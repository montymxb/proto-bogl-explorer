import os

def f():
    files = os.listdir(".")

    index = 1

    for f in files:
        if f == "test.py":
            continue
        else:
            os.rename(f,"P" + str(index) + ".bgl")
        index = index + 1

f()
