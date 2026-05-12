import pygame
import random

# Запуск pygame pluggin
pygame.init()
# game size 20 x 20 = 400x400 (20 клеток по 20 пикселей)
CELL = 20
COLS = 20
ROWS = 20
WIDTH = COLS * CELL
HEIGHT = ROWS * CELL
# creating a window
screen = pygame.display.set_mode(
    (WIDTH, HEIGHT)
)  # ASKING TO TAKE PARAMETRERS FROM cells, cols, rows
pygame.display.set_caption("Snake")  # NAME TAG
# TIME
clock = pygame.time.Clock()
snake = [{"x": 10, "y": 10}, {"x": 9, "y": 10}, {"x": 8, "y": 10}]
dir = {"x": 1, "y": 0}
food = {"x": random.randint(0, COLS - 1), "y": random.randint(0, ROWS - 1)}
# cicle
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:  # close
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP and dir["y"] != 1:
                dir = {"x": 0, "y": -1}
            if event.key == pygame.K_DOWN and dir["y"] != -1:
                dir = {"x": 0, "y": 1}
            if event.key == pygame.K_LEFT and dir["x"] != 1:
                dir = {"x": -1, "y": 0}
            if event.key == pygame.K_RIGHT and dir["x"] != -1:
                dir = {"x": 1, "y": 0}
    new_head = {"x": snake[0]["x"] + dir["x"], "y": snake[0]["y"] + dir["y"]}
    snake.insert(0, new_head)
    if (
        new_head["x"] < 0
        or new_head["x"] >= COLS
        or new_head["y"] < 0
        or new_head["y"] >= ROWS
        or new_head in snake[1:]
    ):
        running = False
    if snake[0]["x"] == food["x"] and snake[0]["y"] == food["y"]:
        food = {"x": random.randint(0, COLS - 1), "y": random.randint(0, ROWS - 1)}
        snake.append(snake[-1])
    else:
        snake.pop()

    screen.fill((26, 46, 26))  # dark green
    for x in range(0, WIDTH, CELL):
        pygame.draw.line(screen, (30, 60, 30), (x, 0), (x, HEIGHT))
    for y in range(0, HEIGHT, CELL):
        pygame.draw.line(screen, (30, 60, 30), (0, y), (WIDTH, y))
    pygame.draw.rect(
        screen,
        (216, 90, 48),
        (food["x"] * CELL + 2, food["y"] * CELL + 2, CELL - 4, CELL - 4),
    )
    for seg in snake:
        pygame.draw.rect(
            screen,
            (83, 74, 183),
            (seg["x"] * CELL + 2, seg["y"] * CELL + 2, CELL - 4, CELL - 4),
        )

    pygame.display.flip()  # refresh
    clock.tick(10)
pygame.quit()
