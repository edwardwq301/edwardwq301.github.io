# Python

## 资料

- [oeasy py](https://www.lanqiao.cn/courses/3584)
- [可视化](https://pythontutor.com/)
- [`argparse` 接收参数教程](https://tendcode.com/subject/article/python-shell/)

`match`: the use of the `_` symbol will match with any input

## 字符串

当经常进行字符串拼接时用 join 更好，类似 cpp string 的 append

```py
result_join = "".join(['a', 'b', 'c', 'd'])
print(result_join)  # Output: 'abcd'
```

## 列表

- `if` 生成式：`la = [i for i in range(10) if i % 2 == 0]`
- `if else` 生成式：`la = [i if i % 2 == 0 else -1 for i in range(10)]`
- oi 输入：`a,b,c=map(int,input().split())`
- 列表乘法：相当于先减一层方括号再重复，最后外面加一层方括号 `a=[1,2]*3 # a=[1,2,1,2,1,2]`
- 列表切片：如果赋给另一个变量，相当于浅复制

```py
la = [0, 1, [2, 3, 4], 5, 6, 7]
la_slice = la[0:3]
la[0] = 10
la[2].append(10)
print(la_slice)
# [0, 1, [2, 3, 4, 10]]
```

### 复制问题

学 python 经典问题：

```py
list_a=[0,[1]]
list_b=list_a       # 和 a 完全一样
list_c=list_a.copy()# 浅复制出来一个
list_d=list_a[:]    # 浅复制出来另一个

list_a[0]=10
list_a[1].append(2)
# list_b? list_c? list_d?
```

要回答这个问题，先了解 py 中可以分成

- mutable 可变类型：列表，集合，字典
- immutable 不可变类型：整数，字符串

浅复制一个 mutable，相当于复制指针/引用；浅复制 immutable 等于深复制，新开一块内存

[图形化展示](https://pythontutor.com/render.html#code=list_a%3D%5B0,%5B1%5D%5D%0Alist_b%3Dlist_a%0Alist_c%3Dlist_a.copy%28%29%0Alist_d%3Dlist_a%5B%3A%5D%0A%0Alist_a%5B0%5D%3D10%0Alist_a%5B1%5D.append%282%29&cumulative=false&curInstr=6&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=3&rawInputLstJSON=%5B%5D&textReferences=false)

```py
# note "example1"
import copy


def shallow_deep_part1():
    original_int = 42
    shallow_copy_int = original_int
    deep_copy_int = copy.deepcopy(original_int)
    print("immutable: shallow = deep")
    print(f"origin:\t\t{id(original_int)}\nshallow_copy:\t\t{id(shallow_copy_int)}\ndeep_copy:\t\t{id(deep_copy_int)}")

    print("\n======\n")
    print("mutable: shallow != deep")
    original_list = [1, [2, 3], 4]
    same_with_origin = original_list
    shallow_copy_list = original_list[:]

    shallow_copy_list[0] = 10
    shallow_copy_list[1].append(5)

    print("original: ", original_list)
    print("shallow: ", shallow_copy_list)
    print("same with origin: ", same_with_origin)
```

```py
# note "example2"
def shallow_deep_part2():
    origin = [[0] for i in range(3)]  # each item diff
    print(id(origin[0]), id(origin[1]), id(origin[2]))
    origin[0].append(1)
    print(origin)    # [[0, 1], [0], [0]]

    another = [[0]]*3  # same item
    another[0].append(1)
    print(another)   # [[0, 1], [0, 1], [0, 1]]
```

## 字典

字典设置值

```py
from collections import defaultdict

s = [('yellow', 1), ('blue', 2), ('yellow', 3),
    ('blue', 4), ('red', 1)]
# 此处必须写可调用的函数像 list set，[] 不行
d = defaultdict(list)
for k, v in s:
    d[k].append(v)
# 比下边注释的那行快
# d.setdefault(k, []).append(v)
```

## range

先看一小段 cpp 和 py

```cpp
//  "cpp"
for(int i = 0; i < 10; i++){
    std::cout<< i <<' ';
    i += 100
}
```

```py
# "py"
for i in range(10):
    print(i)
    i+=100
```

很容易看出 cpp 只会输出 0，但是发现 py 竟然输出 0-9，😱

然后[查一下](https://docs.python.org/3/reference/compound_stmts.html#the-for-statement)，相当于每次把 yield 的结果赋给 i，形象化表示就是挨个取[0,1,2]，循环体里修改不会影响下一次循环 i 的值。

`for` loop in python, your looping variable, here x proceeds to the next item in your iterable. So any changes made to x are overwritten when the loop restarts.

the only way for the loop structure to be changed within the loop is to change the iterable you're looping over. So, for instance

```py
# wont stop
def test_bad():
    L = [1, 2, 3, 4, 5]
    for item in L:
        L.append(item)
        print(L)


# can stop
def test_good():
    L = [1, 2, 3, 4, 5]
    for i in range(len(L)):
        L.append(i)
        print(L)
```

[参考资料，值得一看](https://www.reddit.com/r/learnpython/comments/525sti/comment/d7hmvnb/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)

## yield

- 在函数中执行完 yield 后下次执行从下一条开始直到再次执行一次 yield，相当于 return 一个值后下次继续执行
- 返回一个生成器，可以遍历，`for i in generator`，有点像 cpp 的 iterator

下边是一个例子，另一个例子是约瑟夫环，直接本站搜索即可

```py
def test_yield():
    yield 1
    yield 2
    for i in range(3,5):
        print(f"yield {i}")
        yield i
    yield 10   # the last will be 10
    return 100 # wont be executed


for val in test_yield():
    print(val)
```

## 类

python 用双下划线表示不同的用途，主要是大家约定俗成，没有像 cpp 或 Java 那么严格的方式

```py
class Parent:
    def __init__(self):
        self.__private_var = 10

    def __private_method(self):
        print("This is a private method in parent")

    def __add__(self, other):  # overwrite in child
        print("parent add")


class Child(Parent):
    def __init__(self):
        super().__init__()
        print(self._Parent__private_var)
        self.__private_method()

    def __private_method(self):
        print("This is a private method in child")

    def __add__(self, other):
        print("child add")
```

### match

```py
name = input("What's your name? ")

match name:
    case "Harry" | "Hermione" | "Ron":
        print("Gryffindor")
    case "Draco":
        print("Slytherin")
    case _:
        print("Who?")
```

## 概率抽取

- 假如现在要以特定概率抽取列表里元素，可以用 `random.choices(todo_list,[0.05,0.9,0.05])`
- 但是假如是要从列表抽取一个元素，`choices` 就不太方便，可以用以下方法：

```py
p = random.uniform(0, 1)

threshold = 0.8

if p >= threshold:
    print("yes")
else:
    print("no")
```

## socket demo

- server: create socket, bind, listen, accept
- client: create socket, connect

```py
# "server"
import socket
from threading import Thread

INET = socket.AF_INET
IP_PORT = ("127.0.0.1", 9999)
RECEIVE_SIZE = 1024


def acceptConnection(connection: socket.socket, port):
    while True:
        receive_data = connection.recv(RECEIVE_SIZE).decode()
        if (receive_data == "exit"):
            break

        connection.sendall((f"server receive {port}: "+receive_data).encode())

    connection.close()


server_socket = socket.socket(INET)
server_socket.bind(IP_PORT)
server_socket.listen(1)

while True:
    client_connection, client_port = server_socket.accept()
    thread = Thread(target=acceptConnection, args=(
        client_connection, client_port))
    thread.start()
```

```py
# "client"
import socket

IP_PORT = ("127.0.0.1", 9999)
RECEIVE_SIZE = 1024
client_socket = socket.socket(socket.AF_INET)

client_socket.connect(IP_PORT)

while True:
    message = input("client input: ").strip()
    if not message:
        continue
    client_socket.sendall(message.encode())

    print("get from server: ", client_socket.recv(
        RECEIVE_SIZE).decode().strip())

    if message == "exit":
        print("client: finish!")
        break

client_socket.close()
```

## fun problem

### 114514

数字生成器，[原理](https://github.com/USTC-Hackergame/hackergame2020-writeups/blob/3877a242223afcb65d8f8f4c532f2fd5f46e38e9/official/%E8%B6%85%E7%B2%BE%E5%B7%A7%E7%9A%84%E6%95%B0%E5%AD%97%E8%AE%BA%E8%AF%81%E5%99%A8/README.md)

```py
def calc(number: int) -> str:
    bases = []
    magic = "114514"
    bases.append("~-"+'1')
    for i in magic[1:]:
        bases.append("-~"*(10-int(i))+i)  # convert x to 10

    anw = ""
    for i in range(len(magic)):
        digit = number//(10**(5-i)) % 10
        if i == 0:
            anw = bases[0]
        else:
            anw = '('+anw+'*'+bases[i]+')'
        anw = "-~"*digit+anw
        # 第一个直接加 digit，后面的先把上次结果*10，整体加括号，再加 digit
    print(anw)
    return anw
```

### i18n

i18n 是 internationalization 的缩写

可以用 dfs 生成缩写（abbreviation），[另一种 dfs 实现是](https://github.com/keon/algorithms/blob/cad4754bc71742c2d6fcbd3b92ae74834d359844/algorithms/backtrack/generate_abbreviations.py)

1. 从前往后放，每个位置上要么是数字要么是字母
2. 前一位是数字的话，本位就不能是数字
3. 如果没有剩余字母可放/已经超过长度 返回，实现的时候用已经放了几个字母更加直观

```py
def generate_abbreviations(word):
    def dfs(posi, used_char, cur: str, word, anw: list):
        if posi == len(word) or used_char == len(word):
            anw.append(cur)
            return

        dfs(posi+1, used_char+1, cur+word[used_char], word, anw)
        for i in range(1, len(word)-used_char+1):
            if posi > 0 and cur[-1].isdigit():
                continue
            else:
                dfs(posi+1, used_char+i, cur+str(i), word, anw)

    anw = []
    dfs(0, 0, "", word, anw)
    print(anw)
    return anw


def test():
    word = "word"
    word_res = ['word', 'wor1', 'wo1d', 'wo2', 'w1rd', 'w1r1', 'w2d', 'w3', '1ord', '1or1', '1o1d', '1o2', '2rd', '2r1', '3d', '4']
    iget = generate_abbreviations(word)
    assert set(iget) == set(word_res)
```

### 求所有的回文字串

`'abcbab' => [['abcba', 'b'], ['a', 'bcb', 'a', 'b'], ['a', 'b', 'c', 'bab'], ['a', 'b', 'c', 'b', 'a', 'b']]`

不是很好想，直接抄答案😭

```py
# "normal"
def palindromic_substrings(s):
    if not s:
        return [[]]
    results = []
    # for i in range(len(s), 0, -1): 两者均可
    for i in range(1, len(s)+1):
        sub = s[:i]
        if sub == sub[::-1]:
            rightpart = palindromic_substrings(s[i:])
            for rest in rightpart:
                results.append([sub] + rest)

    return results
```

```py
# "pythonic"
def palindromic_substrings(s):
    if not s:
        yield []
        # return 有没有都正确，添加顺序不同

    for i in range(1, len(s)+1):
        substr = s[:i]
        if substr == substr[::-1]:
            for right_poss in palindromic_substrings(s[i:]):
                yield [substr]+right_poss


anw = palindromic_substrings("ababc")
for i in anw:
    print(i)
```

### Gale Shapley

稳定匹配，稳定婚姻。个人认为先把**问题理解清楚**是最重要的

假如有三个男生，三个女生，大家都有一个评价列表，现在两两配对，不能出现以下情况：

- 一个男生和一个女生都会放弃当前配偶，然后两者结合
- eg：man1 loves woman1 while man1 lives with woman2, and woman1 loves man1 while woman1 lives with man2
- 上边的匹配称为不稳定的，也就是存在「双向奔赴」：两者互为更好的选择，都会放弃当前配偶来形成新的一对
- 还是上边的例子：man1 和 woman1 都离家出走找到真爱

再举个例子：

男生为 A B C，女生为 X Y Z

| prefer | max |   | min |
|--------|-----|---|-----|
|    A   |  Y  | X |  Z  |
|    B   |  Z  | Y |  X  |
|    C   |  X  | Z |  Y  |

| prefer | max |   | min |
|--------|-----|---|-----|
|    X   |  B  | A |  C  |
|    Y   |  C  | B |  A  |
|    Z   |  A  | C |  B  |

稳定的匹配有：男在前，女在后

- man get best and woman get third: AY, BZ, CX
- both get second: AX, BY, CZ
- man get third and woman get best: AZ, BX, CY

可以得出：稳定匹配可能有多个

怎么得到稳定匹配：Gale Shapley 算法

```text
# Gale-Shapley
initialize each person to be free
while (some man m is free and hasn't proposed to every woman) do
w = highest ranked woman in m's list to whom m has not yet proposed
if (w is free) then
    (m, w) become engaged
else if (w prefers m to her fiance m') then
    (m, w) become engaged
    m' become free
return the set S of engaged pairs
```

然后就会发现算法其实和选择有关，上边的例子中，男生有主动出击，女生可以拒绝当前或更新，但是男生总是先获得最大满意的结果（排名尽可能靠前），女生不一定获得最满意的结果（有可能人家郎才女貌，喜欢的男生被截胡了）。谁海投谁有利🤣

```py
# "py code"
from enum import Enum


class state(Enum):
    free = 0
    engage = 1
    married = 2


class Person:
    def __init__(self, name, lovelist: list[str]) -> None:
        self.name = name
        self.lovelist = lovelist
        self.state = state.free
        self.partner = ""

    def prefer(self, candi: str):
        if not self.partner or \
                self.lovelist.index(candi) < self.lovelist.index(self.partner):
            return True
        else:
            return False


def GetByName(name: str):
    return dic[name]


def SetPartner(man: Person, woman: Person):
    man.partner = woman.name
    woman.partner = man.name
    woman.state = state.engage


def DelPartner(man: Person, woman: Person):
    man.partner = ""
    woman.partner = ""


def Gale_Shapley(persons: list[Person]):
    for man in persons[:]:
        for poss_woman in man.lovelist:
            woman = GetByName(poss_woman)
            if woman.state == state.free:
                SetPartner(man, woman)
                persons.remove(man)
                break
            elif woman.state == state.engage:
                if woman.prefer(man.name):
                    origin_partner = GetByName(woman.partner)
                    DelPartner(origin_partner, woman)
                    SetPartner(man, woman)
                    persons.remove(man)
                    persons.append(origin_partner)
                    break


def Solve(persons: list):
    copy = persons.copy()
    Gale_Shapley(persons)
    for i in copy:
        print(f"{i.name}--{i.partner}")


x = Person("x", ['b', 'a', 'c'])
y = Person("y", ['c', 'b', 'a'])
z = Person("z", ['a', 'c', 'b'])

a = Person("a", ['y', 'x', 'z'])
b = Person("b", ['z', 'y', 'x'])
c = Person("c", ['x', 'z', 'y'])


dic = {
    "a": a, "b": b, "c": c,
    "x": x, "y": y, "z": z
}

persons_man = [a, b, c]
persons_woman = [x, y, z]


Solve(persons_man)  # ay bz cx
print("-" * 5)
Solve(persons_woman)  # xb yc za
```

- [推荐:论文原文翻译](https://zhuanlan.zhihu.com/p/139121340)
- [伪代码来源](https://kiosk007.top/post/%E7%AE%97%E6%B3%95%E7%AC%94%E8%AE%B0-%E7%A8%B3%E5%AE%9A%E5%8C%B9%E9%85%8D%E7%AE%97%E6%B3%95/#gale-shapley-algorithm)
- [wikipedia](https://en.wikipedia.org/wiki/Stable_marriage_problem)
