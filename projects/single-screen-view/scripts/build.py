#!/usr/bin/env python3
"""Build deterministic runtime and source archives using Python's standard library.

No install step or signing credentials required. The Chromium archive has
manifest.json at its root; the source archive includes documentation and tests.
"""

from pathlib import Path
import json
import zipfile

ROOT = Path(__file__).resolve().parents[1]
EXTENSION = ROOT / "extension"
DIST = ROOT / "dist"
EXCLUDED_DIRS = {".git", "dist", "node_modules", "__pycache__", ".venv"}
EXCLUDED_NAMES = {".DS_Store", "Thumbs.db", ".env"}
STAMP = (2020, 1, 1, 0, 0, 0)


def included(path):
    relative = path.relative_to(ROOT)
    return (
        path.is_file()
        and not path.is_symlink()
        and not any(part in EXCLUDED_DIRS for part in relative.parts)
        and path.name not in EXCLUDED_NAMES
        and not path.name.startswith(".env.")
        and path.suffix not in {".pem", ".key", ".pyc"}
    )


def archive(destination, paths, base, prefix=""):
    with zipfile.ZipFile(destination, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as output:
        for path in sorted(paths):
            name = prefix + path.relative_to(base).as_posix()
            item = zipfile.ZipInfo(name, STAMP)
            item.create_system = 3
            item.external_attr = 0o100644 << 16
            item.compress_type = zipfile.ZIP_DEFLATED
            output.writestr(item, path.read_bytes(), compresslevel=9)
    print(f"{destination.relative_to(ROOT)} ({destination.stat().st_size:,} bytes)")


def main():
    manifest = json.loads((EXTENSION / "manifest.json").read_text(encoding="utf-8"))
    version = manifest["version"]
    if not version or any(character not in "0123456789." for character in version):
        raise ValueError("Manifest version must contain digits and periods only")
    package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    if version != package["version"]:
        raise ValueError("package.json and extension manifest versions differ")
    DIST.mkdir(exist_ok=True)
    name = f"single-screen-view-{version}"
    archive(DIST / f"{name}-chromium.zip", (p for p in EXTENSION.rglob("*") if included(p)), EXTENSION)
    archive(DIST / f"{name}-source.zip", (p for p in ROOT.rglob("*") if included(p)), ROOT, f"{name}/")


if __name__ == "__main__":
    main()
