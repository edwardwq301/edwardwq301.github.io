### 402 移动K位数字
官方题解写的，假如 1432 删掉 1 位，假如删除 1/4，肯定是删除 4更好，也就是说 $d_1d_2d_id_k \ and \  d_k>d_i$ 删除dk更好 

那么可以重复k次，这样又太慢了

单调栈（单调不减 1223），什么时候删除栈顶：有更小的（隐含栈不空且还有删除次数）

```py
class Solution:
    def removeKdigits(self, num: str, k: int) -> str:
        numStack = []

        # 构建单调递增的数字串
        for digit in num:
            while k and numStack and numStack[-1] > digit:
                numStack.pop()
                k -= 1

            numStack.append(digit)

        # 如果 K > 0，删除末尾的 K 个字符
        finalStack = numStack[:-k] if k else numStack

        # 抹去前导零
        return "".join(finalStack).lstrip('0') or "0"
```
