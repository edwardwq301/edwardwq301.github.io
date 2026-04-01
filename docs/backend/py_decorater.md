# Python 装饰器解释

```python
from functools import partial, wraps


def set_route(path):
    def decorate(func):
        func.ofPath = path
        return func

    return decorate


@set_route("/")
def func_a():
    pass


def my_timer(func=None, *, prefix="---"):
    if func is None:
        return partial(my_timer, prefix=prefix)

    @wraps(func)
    def wrapper(*args, **kargs):
        print(f"{prefix} time pass")
        result = func(*args, **kargs)
        return result

    return wrapper


@my_timer(prefix="AAA")
def func_b_prefix():
    pass


@my_timer
def func_b_no_prefix():
    pass
```

在装饰带路径的时候，相当于

$$
\begin{aligned}
\text{func\_a} &= \text{set\_route}("/")(\text{func\_a}) \\
              &= \text{decorater}(\text{func\_a}) \\
              &= \text{func\_a}
\end{aligned}
$$

因此不能在函数调用前做操作，只能在定义装饰器时做操作。

而 `my_timer` 在装饰带 `prefix` 参数时相当于

$$
\begin{aligned}
\text{func\_b} &= \text{my\_timer}(\text{"AAA"})(\text{func\_b}) \\
              &= \text{partial}(\text{my\_timer}, \text{"AAA"})(\text{func\_b}) \\
              &= \text{my\_timer}(\text{func\_b}, \text{"AAA"}) \\
              &= \text{wrapper}
\end{aligned}
$$

不带参数相当于

$$
\begin{aligned}
\text{func\_b} &= \text{my\_timer}(\text{func\_b}) \\
              &= \text{wrapper}
\end{aligned}
$$
