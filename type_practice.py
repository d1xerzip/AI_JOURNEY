# --- Variables Configuration ---
user_name = "Artem"
user_age = 23
current_year = 2026
money = 1000 * 200 + 1000
print(user_name + str(user_age))
print(user_name + str(user_name))
print(user_name + str(user_age + 1))
print(str(user_age * 20) + user_name)
print(user_name + "24" + " years old")
print(user_name + " is " + str(user_age) + " years old ")
print(
    user_name
    + " is "
    + str(user_age + 10)
    + " And he wanna say, peoples needs to buy crytp"
)
print(
    str(user_age)
    + " is my age, but id love to be a "
    + str(16)
    + " year old guy with an "
    + str(1000)
    + " dollars USA in my pockt"
)
print(
    str(user_age + 23)
    + " is my age, but id love to be a "
    + str(16)
    + " year old guy with an "
    + str(1000 * 200)
    + " dollars USA in my pockt"
)
print(user_name + " is " + str(user_age) + " years old")
print(
    f"{current_year} If {user_age} is my age, i still  wantt {money} USD in my pocket"
)
target_age = 43
years_to_wait = target_age - user_age
target_year = current_year + years_to_wait
print(f" Ill be {target_age} years old in the year {target_year}")
[
    print(f"In {current_year + i}, I will be {user_age + i} years old")
    for i in range(1, 11)
]
