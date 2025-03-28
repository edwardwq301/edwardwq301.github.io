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


### 47 全排列
难点在于剪枝条件

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public List<List<Integer>> permuteUnique(int[] nums) {
        Arrays.sort(nums);
        used = new boolean[nums.length];
        List<Integer> temp = new ArrayList<>(nums.length);
        anw = new ArrayList<>();
        help(temp, nums, 0);
        return anw;
    }

    private List<List<Integer>> anw;
    boolean[] used;

    private void help(List<Integer> temp, int[] nums, int posi) {
        if (posi == nums.length) {
            anw.add(new ArrayList<>(temp));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (i > 0 && nums[i] == nums[i - 1] && used[i - 1]) continue;
            if (!used[i]) {
                used[i] = true;
                temp.add(nums[i]);
                help(temp, nums, posi + 1);
                temp.remove(temp.size() - 1);
                used[i] = false;
            }
        }
    }
}
```

```mermaid
flowchart TD
    start--> a[1_a] --> b[1_b] --> 2
    start-.this branch should be killed.->c[1_b in temp]
    c-.-> d[1_a is now choose] .->2
```

[参考](https://leetcode.cn/problems/permutations-ii/solutions/9917/hui-su-suan-fa-python-dai-ma-java-dai-ma-by-liwe-2/)

另外一个题，给定一个数字 target，和限定数字个数 useNum，要求：从 [1, target] 找 useNum 个数字，和为 target

先写一个全排列，然后改进，一是剪枝，二是选数字没必要用 `used[]` 标记

```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<Integer>> solve(int target, int maxUse) {
        this.maxUse = maxUse;
        anw = new ArrayList<>();
        ArrayList<Integer> temp = new ArrayList<>();
        dfs(temp, 0, target);
        return anw;
    }

    private void dfs(List<Integer> temp, int sum, int target) {
        if (sum > target || temp.size() > maxUse) {
            return;
        } else if (sum == target) {
            anw.add(new ArrayList<>(temp));
            return;
        }
        for (int i = 1; i <= target; i++) {
            if (!temp.isEmpty() && i <= temp.getLast()) {
                continue;
            }

            temp.add(i);
            dfs(temp, sum + i, target);
            temp.remove(temp.size() - 1);
        }
    }

    List<List<Integer>> anw;
    int maxUse;

    public static void main(String[] args) {
        Solution solution = new Solution();
        List<List<Integer>> anw = solution.solve(10, 3);
        for (List<Integer> l : anw) {
            for (Integer i : l) {
                System.out.print(i.toString() + ' ');
            }
            System.out.println();
        }
    }
}
```
