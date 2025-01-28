---
comment: true
---

### 倒水
有一个容量为8, 5, 3的桶，其中8为满，5和3为空，只能倒满和倒空，想一个办法得到4的水

bfs，注意搜过的状态不在搜，但是为什么这个类只能存到上一步不能存到上上步，待解决

??? "slove"

    ```cpp
    #include <iostream>
    #include <queue>
    #include <set>
    #include <vector>
    using namespace std;

    class state {
        int bu8;
        int bu5;
        int bu3;
        state * father;

    public:
        state(int bu8, int bu5, int bu3) : bu8(bu8), bu5(bu5), bu3(bu3) {}
        vector<state> getPossState() {
            vector<state> poss;
            if (bu8 > 0) {
                if (bu5 < 5) {
                    int loss = min(5 - bu5, bu8);
                    poss.push_back(state(bu8 - loss, bu5 + loss, bu3));
                }
                if (bu3 < 3) {
                    int loss = min(3 - bu3, bu8);
                    poss.push_back(state(bu8 - loss, bu5, bu3 + loss));
                }
            }
            if (bu5 > 0) {
                if (bu8 < 8) {
                    int loss = min(8 - bu8, bu5);
                    poss.push_back(state(bu8 + loss, bu5 - loss, bu3));
                }
                if (bu3 < 3) {
                    int loss = min(3 - bu3, bu5);
                    poss.push_back(state(bu8, bu5 - loss, bu3 + loss));
                }
            }
            if (bu3 > 0) {
                if (bu8 < 8) {
                    int loss = min(8 - bu8, bu3);
                    poss.push_back(state(bu8 + loss, bu5, bu3 - loss));
                }
                if (bu5 < 5) {
                    int loss = min(5 - bu5, bu3);
                    poss.push_back(state(bu8, bu5 + loss, bu3 - loss));
                }
            }
            return poss;
        }

        bool isAnw() {
            return bu8 == 4 || bu3 == 4 || bu5 == 4;
        }

        int toInt() {
            int anw = bu8;
            anw *= 10;
            anw += bu5;
            anw *= 10;
            anw += bu3;
            return anw;
        }

        void setFather(state * fa) {
            father = fa;
        }

        state * getFather() {
            return father;
        }
    };



    void test() {
        int fat[900]; // fat store its father

        state begin(8, 0, 0);
        begin.setFather(nullptr);
        fat[800] = 0;

        queue<state> queue;
        queue.push(begin);
        set<int> visited;
        visited.insert(begin.toInt());

        while (!queue.empty()) {
            auto top = queue.front();
            queue.pop();

            for (state x : top.getPossState()) {
                if (visited.count(x.toInt()) == 0) {
                    visited.insert(x.toInt());
                    queue.push(x);
                    x.setFather(&top);

                    fat[x.toInt()] = top.toInt();
                    cout << x.toInt() << " father is " << x.getFather()->toInt()
                        << " father'address is " << x.getFather() << endl;
                }
                if (x.isAnw()) {
                    cout << "yes\n";
                    int k = x.toInt();
                    while (fat[k] != 0) {
                        cout << k << ' ';
                        k = fat[k];
                    }
                    cout << endl;
                    // why this is wrong, only can store its father, cannot store
                    // its grandfather?

                    while (x.toInt() != 800) {
                        cout << x.toInt() << ' ';
                        x = *(x.getFather());
                    }
                }
            }
        }
    }


    int main() {
        cout << endl;
        test();

        return 0;
    }
    ```

### 3 无重复字符的最长子串
要求的是最长字串（就是要挨着的字符），不是子序列

**小技巧**：把字符串前边加一个空格或者别的占位，这样计数的时候 `dp[i]` 就自然的表示以第 i 个字母结尾的性质，开空间用新的长度也可以正常访问

解法一：2024/1/19 想的是 dp，以 `dp[i]` 表示第 i 个字母结尾（闭区间）的最长子串

- 如果 `str[i]` 没出现过， `dp[i]=dp[i-1]+1`
- 如果出现过了，就是 `dp[i]=i-上一次出现的位置`，然后提交发现错了 `abba`，再分析一下，
    - 如果上一次 a 出现右边有重复 `eg: bb`，`dp[i]=dp[i-1]+1`
    - 如果没有重复，`dp[i]=i-上一次出现位置`。总之得出应该是两者取小
- 更新出现当前字母出现位置
```
a |qbbc|a

bb|...a....|a
```

??? "dp"

    ```cpp
    class Solution {
    public:
        int lengthOfLongestSubstring(string s) {

            if (s.empty()) return 0;
            s = ' ' + s;
            int n = s.length();
            vector<int> len(n, 0);
            unordered_map<char, int> map;
            for (int i = 1; i < n; i++) {//开空间后正常访问，不用\<=
                if (map.count(s[i])) {
                    len[i] = min(i - map[s[i]], len[i - 1] + 1);
                }
                else len[i] = len[i - 1] + 1;
                map[s[i]] = i;
            }
            return *max_element(len.begin(), len.end());
        }
    };
    ```

解法二：滑动窗口，很多解释都是这个，就不多说了，直接看代码也能明白

??? "滑动窗口"

    ```cpp
    class Solution {
    public:
        int lengthOfLongestSubstring(string s) {
            if (s.size() == 0)
                return 0;
            unordered_map<char, int> cnt;

            int anw = 0;
            int l = 0, r = 0;
            while (r < s.size()) {
                cnt[s[r]]++;
                while (cnt[s[r]] > 1) {
                    cnt[s[l]]--;
                    l++;
                }
                anw = max(anw, r - l + 1);
                r++;
            }
            return anw;
        }
    };
    ```

### 11 盛最多水的容器
双指针移动短板，[正确性证明](https://leetcode.cn/problems/container-with-most-water/solutions/11491/container-with-most-water-shuang-zhi-zhen-fa-yi-do)

```cpp
class Solution {
public:
    int maxArea(vector<int> &height) {
        int anw = 0;
        int left = 0, right = height.size() - 1;
        while (left < right) {
            int area = min(height[left], height[right]) * (right - left);
            anw = max(anw, area);
            if (height[left] < height[right]) left++;
            else right--;
        }
        return anw;
    }
};
```

### 15 三数之和
先排序，双指针，从 i+1 和 end 找，问题在于去重，比如用例 `[-1,0,1,2,-1,-4]`, `[-2,0,0,2,2]`；由于找的时候是从 `[i+1, end]` 找，第一个判定就是 `nums[i] == nums[i-1]`,网上的题解都是 left 和下一位比是否重复，最后在 left++，我觉得这样很容易忘 left++，不如直接用两个变量 left_used, right_used 记录，不用最后再 left++，这样好一些。另外还可以提前判定是否结束，`nums[i]>0`

难度不是很大，但是细节比较多

=== "变量"

    ```cpp
    class Solution {
    public:
        void test() {
            vector<int> origin = {-2, 0, 0, 2, 2};
            auto anw = threeSum(origin);
            for (auto x : anw) {
                for (auto y : x)
                    cout << y << ' ';
                cout << endl;
            }
        }

        vector<vector<int>> threeSum(vector<int>& nums) {
            vector<vector<int>> anw;
            sort(nums.begin(), nums.end());

            for (int i = 0; i < nums.size(); ++i) {
                if (nums[i] > 0)
                    break;
                if (i >= 1 && nums[i - 1] == nums[i])
                    continue;

                int left = i + 1, right = nums.size() - 1;

                while (left < right) {
                    int left_use = nums[left], right_use = nums[right];
                    int sum = left_use + right_use;
                    if (sum > -1 * nums[i])
                        right--;
                    else if (sum < -1 * nums[i])
                        left++;
                    else {
                        anw.emplace_back(vector<int>{nums[i], left_use, right_use});
                        while (left < right && nums[left] == left_use)
                            left++;
                        while (left < right && nums[right] == right_use)
                            right--;
                    }
                }
            }
            return anw;
        }
    };
    ```

=== "不用变量"

    ```cpp
    class Solution {
    public:
        void test() {
            vector<int> origin = {-2, 0, 0, 2, 2};
            auto anw = threeSum(origin);
            for (auto x: anw) {
                for (auto y: x)
                    cout << y << ' ';
                cout << endl;
            }
        }

        vector<vector<int>> threeSum(vector<int> &nums) {
            vector<vector<int>> anw;
            sort(nums.begin(), nums.end());

            for (int i = 0; i < nums.size(); ++i) {
                if (nums[i] > 0) break;
                if (i >= 1 && nums[i - 1] == nums[i])
                    continue;

                int left = i + 1, right = nums.size() - 1;

                while (left < right) {
                    int sum = nums[left] + nums[right];
                    if (sum > -1 * nums[i])
                        right--;
                    else if (sum < -1 * nums[i])
                        left++;
                    else {
                        anw.emplace_back(vector<int>{nums[i], nums[left], nums[right]});
                        while (left < right && nums[left] == nums[left + 1])
                            left++;
                        left++;
                        while (left < right && nums[right] == nums[right - 1])
                            right--;
                        right--;
                    }
                }
            }
            return anw;
        }
    };
    ```


### 17 电话号码组合
典型回溯

```cpp
class Solution {
public:
    unordered_map<char, vector<char>> orders;
    vector<string> anw;
    string res;

    vector<string> letterCombinations(string digits) {
        if(digits.empty()) return vector<string>{};
        setting();
        dfs(digits, 0);
        return anw;
    }

    void dfs(const string& digits, int now_index) {
        if (now_index == digits.size()) {
            anw.push_back(res);
        }
        for (int i = 0; i < orders[digits[now_index]].size(); i++) {
            res.push_back(orders[digits[now_index]][i]);
            dfs(digits, now_index + 1);
            res.pop_back();
        }
    }

    void setting() {
        orders['2'] = {'a', 'b', 'c'};
        orders['3'] = {'d', 'e', 'f'};
        orders['4'] = {'g', 'h', 'i'};
        orders['5'] = {'j', 'k', 'l'};
        orders['6'] = {'m', 'n', 'o'};
        orders['7'] = {'p', 'q', 'r', 's'};
        orders['8'] = {'t', 'u', 'v'};
        orders['9'] = {'w', 'x', 'y', 'z'};
    }
};
```

还有一种迭代的做法，找笛卡尔乘积，那我只要把上次结果的每一项都加一一个字母就行了

```py
def calc(phone: str):
    kmaps = {
        "2": "abc",
        "3": "def",
        "4": "ghi",
        "5": "jkl",
        "6": "mno",
        "7": "pqrs",
        "8": "tuv",
        "9": "wxyz"
    }
    if phone == "":
        return []

    anw = [""]
    for digit in phone:
        tem = []
        for item in anw:
            for choose in kmaps[digit]:
                tem.append(item+choose)
        anw = tem
    print(anw)
```

### 22 括号生成
最开始想的是在当前基础前边加 `()`，后边加 `()`，包裹当前 `(cur)`。然后错了，因为少了 `(())(())` 这种。

还得是一次拼接一个 `(` 或者 `)`

```cpp
class Solution {
public:
    vector<string> generateParenthesis(int n) {
        dfs(n, n);
        return anw;
    }

    vector<string> anw;
    string res;

    void dfs(int left_can_use, int right_can_use) {
        if (!left_can_use && !right_can_use) {
            anw.push_back(res);
            return;
        }

        // 一定不存在正确的匹配 )(((((
        if (left_can_use > right_can_use) return; 
        
        if (left_can_use > 0) {
            res.push_back('(');
            dfs(left_can_use - 1, right_can_use);
            res.pop_back();
        }
        if (right_can_use > 0) {
            res.push_back(')');
            dfs(left_can_use, right_can_use - 1);
            res.pop_back();
        }
    }
};
```

### 23 合并k个链表
[题解](https://leetcode.cn/problems/merge-k-sorted-lists/solutions/2384305/liang-chong-fang-fa-zui-xiao-dui-fen-zhi-zbzx)

第一种，每次挑一个答案，如果后面还有节点，有可能是下一个答案，用最小堆存

```cpp
class Solution {
public:
    ListNode *mergeKLists(vector<ListNode *> &lists) {
        auto cmp = [](ListNode *a, ListNode *b) {
            return a->val > b->val;
        };
        priority_queue<ListNode *, vector<ListNode *>, decltype(cmp)> pq;
        for (auto item: lists) {
            if (item) pq.push(item);
        }
        ListNode dummy(0);
        ListNode *cur = &dummy;
        while (!pq.empty()) {
            auto item = pq.top();
            pq.pop();
            if (item->next) { pq.push(item->next); }
            cur->next = item;
            cur = cur->next;
        }
        return dummy.next;
    }
};
```

第二种，类似归并，两两合并有序链表

```cpp
class Solution {
public:
    ListNode *mergeKLists(vector<ListNode *> &lists) {
        if(lists.empty()) return nullptr;
        return mergePart(lists, 0, lists.size() - 1);
    }

    ListNode *mergePart(vector<ListNode *> &lists, int left, int right){
        if (left >= right) return lists[left];
        int mid = left + right >> 1;
        auto leftHead = mergePart(lists, left, mid);
        auto rightHead = mergePart(lists, mid + 1, right);
        return mergeTwoList(leftHead, rightHead);
    }

    ListNode *mergeTwoList(ListNode *a, ListNode *b) {
        ListNode dummy(0);
        ListNode *cur = &dummy;
        while (a && b) {
            if (a->val < b->val) {
                cur->next = a;
                a = a->next;
            }
            else {
                cur->next = b;
                b = b->next;
            }
            cur = cur->next;
        }
        cur->next = a ? a : b;
        return dummy.next;
    }
};
```

### 24 两两交换链表

=== "非递归"

    ```cpp
    class Solution {
    public:
        ListNode* swapPairs(ListNode* head) {
            ListNode* dummy = new ListNode(0);
            dummy->next = head;
            ListNode* n0 = dummy;
            ListNode* n1 = head;
            while (n1 && n1->next) { // 有两个点来互换
                ListNode* n2 = n1->next;
                ListNode* n3 = n2->next;

                n0->next = n2;
                n2->next = n1;
                n1->next = n3;
                n0 = n1;
                n1 = n3;
            }
            return dummy->next;
        }
    };
    ```

=== "递归"

    ```cpp
    class Solution {
    public:
        ListNode * swapPairs(ListNode * head) {
            if (head == nullptr || head->next == nullptr) // 要求有两个点来互换
                return head;

            ListNode * n1 = head;
            ListNode * n2 = n1->next;
            ListNode * n3 = swapPairs(n2->next);
            
            n1->next = n3;
            n2->next = n1;
            return n2;
        }
    };
    ```

### 25 k个一组反转链表
链表操作还是非递归符合直觉

=== "非递归"

    ```cpp
    class Solution {
    public:
        ListNode *reverseKGroup(ListNode *head, int k) {
            ListNode *newHead = new ListNode(0);
            newHead->next = head;
            ListNode *n0 = newHead;
            ListNode *n1 = n0->next;

            while (n0) {
                ListNode *nk = n0;
                for (int cnt = 0; cnt < k; cnt++) {
                    // nk 并不能为空，如果为空说明不足 k 个来反转
                    if (nk->next) nk = nk->next; 
                    else return newHead->next;
                }
                ListNode *nkp1 = nk->next;  // nkp1 是 nk 下一个点 nk plus 1

                n0->next = rev(n1, nullptr, k);
                n1->next = nkp1;

                n0 = n1;
                n1 = nkp1;
            }
            return newHead->next;
        }

        // 正常反转链表
        ListNode *rev(ListNode *now, ListNode *pre, int k) {
            if (now == nullptr || k == 0)
                return pre;
            ListNode *ne = now->next;
            now->next = pre;
            return rev(ne, now, k - 1);
        }
    };
    ```

=== "递归"

    ```cpp
    class Solution {
    public:
        ListNode * reverseKGroup(ListNode * head, int k) {
            if(head == nullptr) return nullptr;
            ListNode * n1 = head;
            ListNode * nkp1 = n1;
            for (int i = 0; i < k; i++) {
                if (nkp1) nkp1 = nkp1->next;
                else return head;
            }

            nkp1 = reverseKGroup(nkp1, k);
            ListNode * nk = rev(head, nullptr,k); // 不能和下一句调换，先因为先反转内部，最后改 n1 指向
            n1->next = nkp1;
            return nk;
        }

        ListNode * rev(ListNode * now, ListNode * pre, int k) {
            if (now == nullptr || k == 0)
                return pre;
            ListNode * ne = now->next;
            now->next = pre;
            return rev(ne, now, k - 1);
        }
    };
    ```

### 26 80 数组去重
当前数字和答案中往前数第 len-k 个不重就放

```cpp
class Solution {
public:
    int removeDuplicates(vector<int> & nums) {
        return work(nums, 2);
    }
    
    int work(vector<int> nums, int k) {
        int len = 0;
        for (int x : nums)
            if (len < k || nums[len - k] != x)
                nums[len++] = k;
        return len;
    }
};
```



### 31 下一个排列
[题解](https://leetcode.cn/problems/next-permutation/solutions/80560/xia-yi-ge-pai-lie-suan-fa-xiang-jie-si-lu-tui-dao-)

```cpp
class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        if (nums.size() == 1)
            return;
        if (nums.size() == 2) {
            swap(nums[0], nums[1]);
            return;
        }
        int k = nums.size() - 2;
        while (k >= 0 && nums[k] >= nums[k + 1]) // 从右往左找第一个严格升序
            k--;
        if (k >= 0) { // 判断不是全降序 [3,2,1]
            int n = nums.size() - 1;
            while (nums[n] <= nums[k] && n > k)  // 从右往左找第一个严格大于nums[k]
                n--;
            cout << k << ' ' << n;
            swap(nums[n], nums[k]);
        }

        sort(nums.begin() + k + 1, nums.end());
    }
};
```

### 39 组合总和
和 78 子集有点像，都是前边有些不选，从当前开始选，也是回溯

```cpp
class Solution {
public:
    vector<int> res;
    vector<vector<int>> anw;
    int target;
    int now_sum;

    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        this->target = target;
        std::sort(candidates.begin(), candidates.end());
        dfs(candidates, 0);
        return anw;
    }

    void dfs(vector<int>& nums, int begin_index) {
        if (now_sum == target) {
            anw.push_back(res);
            return;
        } else if (now_sum > target || begin_index >= nums.size()) {
            return;
        }

        for (int i = begin_index; i < nums.size(); i++) {
            res.push_back(nums[i]);
            now_sum += nums[i];
            dfs(nums, i); // 这个地方是 i 不是 begin_index
            now_sum -= nums[i];
            res.pop_back();
        }
    }
};
```

### 41 缺失的第一个正数
先给出结论，答案会是在 `[1, nums.size+1]` 中

也就是说只要把大小在 `[1,nums.size]` 的数字放到对应的第几位，最后查一遍就能找到答案

```cpp
class Solution {
public:
    int firstMissingPositive(vector<int> &nums) {
        int sz = nums.size();
        for (int i = 0; i < sz; ++i) {
            while (nums[i] >= 1 && nums[i] <= sz &&
                   nums[i] != nums[nums[i] - 1])
                swap(nums[i], nums[nums[i] - 1]);
        }
        for (int i = 0; i < sz; ++i) {
            if (nums[i] != i+1) return i + 1;
        }
        return sz + 1;
    }
};
```

### 42 接雨水
威名远扬啊，手撕接雨水成为[招聘常态](https://www.nowcoder.com/feed/main/detail/6cc9f0f6b4bf44cca6bbfa520f969c6e)😅，希望不是最后茴香豆的茴有几种写法

[题解](https://leetcode.cn/problems/trapping-rain-water/solutions/9112/xiang-xi-tong-su-de-si-lu-fen-xi-duo-jie-fa-by-w-8)

**按列求**：什么时候本列 i 能放呢，会发现 `[0, i-1],[i+1, end]` 如果两区间都能找到比 i 高的，说明能放，而且能放 `min(a,b) - height[i]` （如果等于 i 的高度相当于放 0）。可以每次都找一遍左边和右边，但是这样浪费时间。之前有的 dp 题如果当前位置没有更好的就放本身。叫法好像是备忘录。可以用这个方法

=== "初始版"

    ```cpp
    class Solution {
    public:
        int trap(vector<int> &height) {
            int anw = 0;
            int sz = height.size();
            for (int i = 0; i < sz; ++i) {
                int i_left_maxheight = height[i];
                for (int k = 0; k < i; ++k)
                    i_left_maxheight = max(i_left_maxheight, height[k]);

                int i_right_maxheight = height[i];
                for (int k = i + 1; k < sz; ++k)
                    i_right_maxheight = max(i_right_maxheight, height[k]);

                anw += min(i_left_maxheight, i_right_maxheight) - height[i];
            }
            return anw;
        }
    };
    ```

=== "改进成dp"

    ```cpp
    class Solution {
    public:
        int trap(vector<int> &height) {
            int anw = 0;
            int sz = height.size();
            vector<int> left_maxheight(sz);
            vector<int> right_maxheight(sz);
            
            left_maxheight[0] = height[0];
            right_maxheight[sz - 1] = height[sz - 1];
            
            // 有大取大，没大取本身
            for (int i = 1; i < sz; ++i) {
                left_maxheight[i] = max(left_maxheight[i - 1], height[i]);
            }
            for (int i = sz - 2; i >= 0; --i) { 
            // i should begin sz-2, not sz-1
                right_maxheight[i] = max(right_maxheight[i + 1], height[i]);
            }
            for (int i = 0; i < sz; ++i) {
                anw += min(left_maxheight[i], right_maxheight[i]) - height[i];
            }
            return anw;
        }
    };

    ```

**按列求双指针**：题解里 dp 优化成双指针没看明白，但是第一个评论很好，和 12 题有异曲同工之妙，但是这个双指针先理解 dp 会更好理解

=== "left < right"

    ```cpp
    class Solution {
    public:
        int trap(vector<int> &height) {
            int n = height.size();
            int left = 0, right = n - 1;
            int leftMaxHeight = height[0];
            int rightMaxHeight = height[n - 1];
            int anw = 0;
            while (left < right) {
                leftMaxHeight = max(leftMaxHeight, height[left]);
                rightMaxHeight = max(rightMaxHeight, height[right]);
                if (leftMaxHeight < rightMaxHeight) {
                    anw += leftMaxHeight - height[left];
                    left++;
                }
                else {
                    anw += rightMaxHeight - height[right];
                    right--;
                }
            }
            return anw;
        }
    };
    ```

=== "left <= right"

    ```cpp
    class Solution {
    public:
        int trap(vector<int> &height) {
            int anw = 0;
            int sz = height.size();
            int left = 0, right = sz - 1;
            int leftMaxHeight = height[left], rightMaxHeight = height[right];

            left++; // 左右边界不能存
            right--;

            while (left <= right) { // left=right 也是可能的答案
                leftMaxHeight = max(leftMaxHeight, height[left]);
                rightMaxHeight = max(rightMaxHeight, height[right]);
                if (leftMaxHeight < rightMaxHeight) {
                    anw += leftMaxHeight - height[left];
                    left++;
                }
                else {
                    anw += rightMaxHeight - height[right];
                    right--;
                }
            }
            return anw;
        }
    };
    ```


**单调栈**：假如当前块比前一个低，说明会有雨水（下标入栈，因为后续会用到水平距离）；假如当前块比之前高，说明之前的雨水应该停下，进行计算。（一行按部分求）

计算过程：先取出比 height[i] 低的高度 bottom，再找 bottom 左侧的高度 leftheight， 在 heigh[i] 和 leftheight 两者取小，乘以水平距离

```txt
        x
x       x
xxxxxxxxx
```

```cpp
class Solution {
public:
    void test() {
        vector<int> height = {0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1};
        cout << trap(height);
    }

    int trap(vector<int> &height) {
        int anw = 0;
        int len = height.size();
        stack<int> stack;
        for (int i = 0; i < len; ++i) {
            while (!stack.empty() && height[i] > height[stack.top()]) {
                int haveWaterIndex = stack.top();
                stack.pop();

                if (stack.empty()) break;

                int possibleHeight = min(height[i], height[stack.top()]);
                int waterHeight = possibleHeight - height[haveWaterIndex];
                int distance = i - stack.top() - 1;
                anw += waterHeight * distance;
            }
            stack.push(i);
        }
        return anw;
    }
};
```

### 48 旋转图像
线性代数：在想我的事情？😋

矩阵转置后做竖直轴对称

```cpp
class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {

        for(int i=0;i<matrix.size();i++)
            for(int j=i+1;j<matrix[i].size();j++)
                swap(matrix[i][j],matrix[j][i]);

        for(int i=0;i<matrix.size();i++)
            for(int j=0;j<matrix.size()/2;j++)
                swap(matrix[i][j],matrix[i][matrix.size()-1-j]);
    }
};
```

### 51 N皇后
难点主要在怎么判断斜着，发现 y+x 对应右上到左下，y-x 对应从左上到右下，但是 y-x 有可能是负的，就加 n 调成非负，也可以用哈希表

```cpp
class Solution {
public:
    vector<vector<string>> solveNQueens(int n) {
        martix = vector<string>(n, string(n, '.'));
        dfs(0, n);
        return anw;
    }

    vector<vector<string>> anw;
    vector<string> martix;
    bool cols[10] = {false};
    bool left_to_right[20] = {false};
    bool right_to_left[20] = {false};

    void dfs(int row, int n) {
        if (row == n) {
            anw.push_back(martix);
            return;
        }
        for (int col = 0; col < n; col++) {
            if (!cols[col] &&
                !right_to_left[col + row] &&
                !left_to_right[col - row + n]) {

                cols[col] = right_to_left[col + row] = left_to_right[col - row + n] = true;
                martix[row][col] = 'Q';
                dfs(row + 1, n);
                martix[row][col] = '.';
                cols[col] = right_to_left[col + row] = left_to_right[col - row + n] = false;
            }
        }
    }
};
```

### 53 最大子数组和
经典 dp 题。无后效性，我的理解是只看它和它之前的事情，不看后边的，可以化简问题；`dp[i]` 表示以 i 为结尾的最大子数组和，所以 `dp[i]=max(dp[i-1]+nums[i], nums[i])` ，优化空间的话不是 anw=max(anw+nums[i], nums[i]), 因为这样求出来的是 dp[end] ，不是 dp[1..end] 中的最大值。用另一个 sum 记录就好了

```cpp
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int sum = 0;
        int anw = nums[0];
        const int sz = nums.size();
        for (int i = 0; i < sz; ++i) {
            sum = max(sum + nums[i], nums[i]);
            anw = max(anw, sum);
        }
        return anw;
    }
};
```

### 54 螺旋矩阵
这个好像之前抄过的，现在能写出来了😋，但是空间开的多

```cpp
class Solution {
public:

    int m, n;
    vector<vector<bool>> visited;

    vector<int> spiralOrder(vector<vector<int>> &matrix) {
        m = matrix.size();
        n = matrix[0].size();
        visited = vector<vector<bool>>(m, vector<bool>(n, false));
        vector<int> anw(m * n, 0);
        pair<int, int> move[4];
        move[0] = {0, 1};
        move[1] = {1, 0};
        move[2] = {0, -1};
        move[3] = {-1, 0};

        for (int x = 0, y = 0, cnt = 0, mv = 0; cnt < matrix.size() * matrix[0].size();) {
            visited[x][y] = true;
            anw[cnt++] = matrix[x][y];
            int nx = x + move[mv].first;
            int ny = y + move[mv].second;
            if (isvalid(nx, ny)) x = nx, y = ny;
            else {
                mv = (mv + 1) % 4;
                x += move[mv].first;
                y += move[mv].second;
            }
        }
        return anw;
    }

    bool isvalid(int x, int y) {
        return x >= 0 && x < m && y >= 0 && y < n && !visited[x][y];
    }
};
```

优化，只用 4 个变量维护上下左右的界限，死循环放，只要边界非法说明放完了，返回即可

```cpp
class Solution {
public:

    vector<int> spiralOrder(vector<vector<int>> &matrix) {
        vector<int> anw;
        if (matrix.empty()) return anw;

        int up = 0, down = matrix.size()-1, left = 0, right = matrix[0].size() - 1;
        while (true) {
            for (int i = left; i <= right; i++)anw.push_back(matrix[up][i]);
            if (++up > down) break;

            for (int i = up; i <= down; i++)anw.push_back(matrix[i][right]);
            if (--right < left) break;

            for (int i = right; i >= left; i--) anw.push_back(matrix[down][i]);
            if (--down < up) break;

            for (int i = down; i >= up; i--)anw.push_back(matrix[i][left]);
            if (++left > right) break;
        }
        return anw;
    }
};
```

### 55 跳跃游戏
这个题直接翻译也行，看代码

```cpp
class Solution {
public:
    bool canJump(vector<int> &nums) {
        if (nums.size() == 1) return true;
        
        int canReachMaxIndex = 0;
        for (int i = 0; i < nums.size(); ++i) {
            if (canReachMaxIndex >= i)
                canReachMaxIndex = max(canReachMaxIndex, i + nums[i]);
            else return false;
        }
        return true;
    }
};
```

### 45 跳跃游戏2
上来没想到太好的方法，用暴力也过了，但明显不是好的解法。

```cpp
class Solution {
public:
    int jump(vector<int> &nums) {
        vector<int> step(nums.size(), INT_MAX);
        step[0] = 0;
        int canGoMaxIndex = 0;
        for (int i = 0; i < nums.size(); ++i) {
            if (canGoMaxIndex >= i) {
                canGoMaxIndex = max(canGoMaxIndex, i + nums[i]);
                for (int spread = i + 1; spread <= i + nums[i] && spread < nums.size(); ++spread)
                    step[spread] = min(step[spread], step[i] + 1);
            }
        }
        return step[nums.size() - 1];
    }
};
```

看[题解](https://leetcode.cn/problems/jump-game-ii/solutions/2566727/dai-ma-sui-xiang-lu-leetcode-45tiao-yue-h2u1r)发现其实不用全存，每次存到到边界需要几步就行了，人话就是：border 之内(包含 border)几步可达，结合代码更好理解

```cpp
class Solution {
public:
    int jump(vector<int> &nums) {
        if(nums.size()==1) return 0;

        int canGoMaxIndex=0,step=0;
        int broder=0;
        for(int i=0;i<nums.size();++i){
            canGoMaxIndex= max(canGoMaxIndex,i+nums[i]);
            if(i == broder){
                broder=canGoMaxIndex;
                step++;
                if(canGoMaxIndex>=nums.size()-1)  return step;
            }
        }
        return step;
    }
};
```

### 61 旋转链表
2024/10/04 周姓室友分享给我，重新做了一遍，想的是先成环，再断开

发现相当于 **倒着转 k 步是新的头**，相当于正转 length-k ，接下来就是找到新头的前一个，断开，返回新头

```java
class Solution {
    public ListNode rotateRight(ListNode head, int k) {
        if(head==null) return head;

        int length = 0;
        ListNode lastTail = head;

        for (ListNode temp = head; temp != null; temp = temp.next) {
            lastTail = temp;
            length++;
        }
    
        lastTail.next = head;
        k = k % length;

        int toNextHead = length - k;
        ListNode preNewHead = head;
        for (int i = 0; i < toNextHead - 1; i++)
            preNewHead = preNewHead.next;

        ListNode newHead = preNewHead.next;
        preNewHead.next = null;
        return newHead;
    }
}
```

---

开始直接两次反转

??? "两次反转"

    ```cpp
    class Solution {
    public:
        ListNode *rotateRight(ListNode *head, int k) {
            if(head==nullptr) return nullptr;
            int cnt = 0;
            for (ListNode *cur = head; cur; cur = cur->next)
                cnt++;
            k %= cnt;
            if(k==0) return head;
            
            head = reverseList(head);
            ListNode dummy(0, head);

            ListNode *n4 = &dummy;
            ListNode *n5 = dummy.next;
            for (int i = 0; i < k; i++)
                n4 = n4->next;
            ListNode *n3 = n4->next;
            n4->next = nullptr;
            dummy.next = reverseList(n5);
            n5->next = reverseList(n3);

            return dummy.next;
        }

        ListNode *reverseList(ListNode *head) {
            ListNode *pre = nullptr;
            while (head) {
                ListNode *ne = head->next;
                head->next = pre;
                pre = head;
                head = ne;
            }
            return pre;
        }
    };
    ```

看题解后发现可以首尾相接成环，然后合理断开

??? "断开"

    ```cpp
    class Solution {
    public:
        ListNode *rotateRight(ListNode *head, int k) {
            if (head == nullptr || k == 0) return head;
            // 统计个数并成环
            int cnt = 0;
            ListNode *cur = head;
            while (cur->next) {
                cur = cur->next;
                cnt++;
            }
            cnt++;
            cur->next = head;

            k %= cnt;
            // 找到新头的前一个 并断开和新头的连接
            cur = head;
            for (int i = 0; i < cnt - k - 1; i++)
                cur = cur->next;

            ListNode *newHead = cur->next;
            cur->next = nullptr;
            return newHead;
        }
    };
    ```

### 69 平方根
如果 x*x 大于 n，一定不是答案；如果等于，直接返回；如果小于，可能是答案。因此找的是最后一个 平方小于等于 n 的数字

开始用乘法，爆范围了。改用除法
```java
import java.math.BigInteger;

class Solution {
    public int mySqrt(int x) {

        int left = 0, right = x;
        while (left < right) {
            int mid = 1 + left + (right - left) / 2;
//            int pow=mid*mid;
            if (mid == x / mid) return mid; // pow == x
            else if (mid < x / mid) left = mid; // pow < x
            else right = mid - 1;
        }
        return left;
    }
}
```


### 73 矩阵置0
- 第一种用集合存对应的行、列，最后集中置零
- 第二种用第一行，第一列做标记，（先记录第一行，第一列要不要置0），假如 `martix[i][j] = 0`，那么 `martix[i][0] = martix[0][j] = 0` （打上置零标记），最后集中处理

=== "set"

    ```cpp
    class Solution {
    public:
        set<int> rows, cols;

        void setZeroes(vector<vector<int>> &matrix) {
            for (int row = 0; row < matrix.size(); row++) {
                for (int col = 0; col < matrix[0].size(); col++)
                    if (matrix[row][col] == 0) {
                        rows.insert(row);
                        cols.insert(col);
                    }
            }
            for(int row:rows){
                for(int & item : matrix[row])
                    item=0;
            }
            for(int col:cols)
            {
                for(auto & i : matrix){
                    i[col]=0;
                }
            }
        }
    };
    ```

=== "flag"

    ```cpp
    class Solution {
    public:

        void setZeroes(vector<vector<int>> &matrix) {
            // 检查第 0 行 第 0 列
            int col0_flag = false, row0_flag = false;
            for (int item_row0: matrix[0])
                if (!item_row0) {
                    row0_flag = true;
                    break;
                }
            for (auto &i: matrix)
                if (!i[0]) {
                    col0_flag = true;
                    break;
                }
            
            // 检查中间
            for (int row = 1; row < matrix.size(); row++)
                for (int col = 1; col < matrix[0].size(); col++)
                    if (!matrix[row][col]) {
                        matrix[row][0] = matrix[0][col] = 0;
                    }
            // 修改中间
            for (int i = 1; i < matrix.size(); i++) {
                if (matrix[i][0] == 0)
                    for (int k = 1; k < matrix[0].size(); k++)
                        matrix[i][k] = 0;
            }
            for (int i = 1; i < matrix[0].size(); i++) {
                if (matrix[0][i] == 0)
                    for (int k = 1; k < matrix.size(); k++)
                        matrix[k][i] = 0;
            }

            // 处理第 0 行 第 0 列
            if (col0_flag)
                for (auto &i: matrix) 
                    i[0] = 0;
            if (row0_flag)
                for (int &i: matrix[0])
                    i = 0;
        }
    };
    ```

### 76 最小覆盖字串
更新：反复做像是在背答案😇，本题关键是利用上来就减一，根据感兴趣字母的值反复在 >=0 上弹跳，不感兴趣字母的值在 <=0 上弹跳

---

优化版本

```java
import java.util.HashMap;

class Solution {
    public String minWindow(String s, String t) {
        if (s.length() < t.length())
            return "";

        char[] sa = s.toCharArray();
        char[] ta = t.toCharArray();

        HashMap<Character, Integer> hits = new HashMap<>();
        for (char c : ta) {
            hits.put(c, hits.getOrDefault(c, 0) + 1);
        }

        int left = 0, right = 0;
        int anwLeft = 0, anwLen = Integer.MAX_VALUE;
        int succHit = 0;
        for (; right < s.length(); right++) {
            char rightChar = sa[right];
            hits.put(rightChar, hits.getOrDefault(rightChar, 0) - 1);
            if (hits.get(rightChar) >= 0) {
                succHit++;
            }
            while (succHit == t.length()) {
                if (right - left + 1 < anwLen) {
                    anwLen = right - left + 1;
                    anwLeft = left;
                }
                char leftChar = sa[left];
                hits.put(leftChar, hits.get(leftChar) + 1);
                if (hits.get(leftChar) > 0)
                    succHit--;
                left++;
            }
        }
        return anwLen == Integer.MAX_VALUE ? "" : s.substring(anwLeft, anwLeft + anwLen);

    }
}
```

```cpp
class Solution {
public:
    unordered_map<char, int> letterNeed;

    string minWindow(string s, string t) {
        if (t.size() > s.size()) return "";

        pair<int, int> anw = {INT_MAX, INT_MAX};
        for (char x: t) letterNeed[x]++;

        int cnt = 0;
        for (int left = 0, right = 0; right < s.size(); right++) {
            letterNeed[s[right]]--;  // 上来就减不判断
            if (letterNeed[s[right]] >= 0) cnt++; // 非答案字母此时为 -1 
            while (cnt == t.size()) {
                if (right - left + 1 < anw.second) anw = {left, right - left + 1};
                letterNeed[s[left]]++;
                if (letterNeed[s[left]] > 0) cnt--; // 非答案字母此时为 0
                left++;
            }
        }

        if (anw.second == INT_MAX) return "";
        else return s.substr(anw.first, anw.second);
    }
};
```

有滑动窗口的提示，想起来是不是很难，但是写起来就容易超时。

思路：如果找到了一个覆盖，就更新答案，再把左指针移动到不能覆盖的地方

注意：每次移动一个字母的距离，不要把非答案字母用 while 全跳过，这样容易出问题

原始版本

```cpp
class Solution {
public:
    unordered_map<char, int> cnt;
    unordered_map<char, int> should;

    string minWindow(string s, string t) {
        if (t.size() > s.size()) return "";

        pair<int, int> anw = {INT_MAX, INT_MAX};
        for (char x: t) should[x]++;

        int left = 0, right = 0;
        while (right < s.size()) {
            if (should[s[right]] > 0) cnt[s[right]]++;
            right++;
            while (check()) {
                if (right - left < anw.second) anw = {left, right - left};
                if (should[s[left]] > 0) cnt[s[left]]--;
                left++;
            }
        }

        cout << anw.first << ' ' << anw.second;
        if (anw.first == INT_MAX) return "";
        return s.substr(anw.first, anw.second);
    }

    bool check() {
        for (auto item: should) {
            if (cnt[item.first] < item.second) return false;
        }
        return true;
    }

};
```

### 78 子集
回溯没想出来，可以一个一个放，在上次的结果的每一项加一个新数。比如 `[1,2,3]` 的子集是在 `[1,2]` 的子集基础上每项都加 `3`

```cpp
class Solution {
public:
    vector<int> res;
    vector<vector<int>> anw;

    vector<vector<int>> subsets(vector<int> &nums) {
        res={};
        anw.push_back(res);
        for (int num: nums) {
            auto last=anw;
            for(auto item:last){
                item.push_back(num);
                anw.push_back(item);
            }
        }
        return anw;
    }
};
```

[回溯](https://leetcode.cn/problems/subsets/solutions/2566767/dai-ma-sui-xiang-lu-leetcode78zi-ji-by-c-yujc)

![回溯树](https://pic.leetcode.cn/1674874362-hBHNCS-image.png)

```cpp
class Solution {
public:
    vector<vector<int>> anw;
    vector<int> res;

    vector<vector<int>> subsets(vector<int> &nums) {
        dfs(nums, 0);
        return anw;
    }

    void dfs(vector<int> &nums, int begin_choose_index) {
        anw.push_back(res);

        if (begin_choose_index == nums.size()) {
            return;
        }
        for (int i = begin_choose_index; i < nums.size(); i++) {
            res.push_back(nums[i]);
            dfs(nums, i + 1);
            res.pop_back();
        }
    }
};
```

### 79 单词搜索
dfs

```cpp
class Solution {
public:
    bool exist(vector<vector<char>> &board, string word) {
        for (int row = 0; row < board.size(); row++)
            for (int col = 0; col < board[0].size(); col++)
                if (dfs(row, col, 0, board, word))
                    return true;
        return false;
    }

    bool dfs(int row, int col, int cnt, vector<vector<char>> &board, string &word) {
        if (cnt == word.size())
            return true;
        if (row < 0 || row >= board.size() || col < 0 || col >= board[0].size())
            return false;

        char c = board[row][col];
        if (c != word[cnt])
            return false;
        
        board[row][col] = '#'; // visited
        bool isFind = dfs(row + 1, col, cnt + 1, board, word) ||
                      dfs(row - 1, col, cnt + 1, board, word) ||
                      dfs(row, col + 1, cnt + 1, board, word) ||
                      dfs(row, col - 1, cnt + 1, board, word);
        board[row][col] = c;
        return isFind;
    }
};
```

??? "早期版本"

    ```cpp
    class Solution {
    public:
        string target;
        string now;
        vector<vector<bool>> used;
        int dx[4] = {0, 0, -1, 1};
        int dy[4] = {1, -1, 0, 0};

        bool exist(vector<vector<char>> &board, string word) {
            target = word;
            used = vector<vector<bool>>(board.size(),
                                        vector<bool>(board[0].size(), false));
            for (int i = 0; i < board.size(); i++)
                for (int j = 0; j < board[0].size(); j++) {
                    bool anw = dfs(now, 0, i, j, board);
                    if (anw)
                        return true;
                };
            return false;
        }

        bool dfs(string& now, int posi, int x, int y, vector<vector<char>> &board) {

            if (target[posi] != board[x][y])
                return false;

            now += board[x][y];
            used[x][y] = true;

            if (now == target)
                return true;

            for (int i = 0; i < 4; i++) {
                int nx = x + dx[i], ny = y + dy[i];
                if (nx >= 0 && nx < board.size() &&
                    ny >= 0 && ny < board[0].size() &&
                    !used[nx][ny])
                    if (dfs(now, posi + 1, nx, ny, board))
                        return true;
            }

            now.pop_back();
            used[x][y] = false;

            return false;
        }
    };
    ```

### 86 分隔链表
开始想直接快慢指针调整顺序，没写出来，然后发现用两个链表头直接挑出来就好了

另外有可能 cur_big->next 指向为小于 x 的点 比如 `1 4 2 x = 3` 需要断开，要么每次处理，要么最后处理

=== "最后处理"

    ```cpp
    class Solution {
    public:
        ListNode *partition(ListNode *head, int x) {

            ListNode small(0);
            ListNode *cur_small = &small;
            ListNode big(0);
            ListNode *cur_big = &big;

            while (head) {
                if (head->val < x) {
                    cur_small->next = head;
                    cur_small = cur_small->next;
                }
                else {
                    cur_big->next = head;
                    cur_big = cur_big->next;
                }
                head = head->next;
            }

            cur_small->next = big.next;
            cur_big->next=nullptr; // important
            return small.next;
        }
    };
    ```

=== "每次处理"

    ```cpp
    class Solution {
    public:
        ListNode *partition(ListNode *head, int x) {

            ListNode small(0);
            ListNode *cur_small = &small;
            ListNode big(0);
            ListNode *cur_big = &big;

            while (head) {
                ListNode *ne = head->next;
                if (head->val < x) {
                    cur_small->next = head;
                    cur_small = cur_small->next;
                    head->next = nullptr;
                }
                else {
                    cur_big->next = head;
                    cur_big = cur_big->next;
                    head->next = nullptr;
                }
                head = ne;
            }
            cur_small->next = big.next;
            return small.next;
        }
    };
    ```

### 94 二叉树中序遍历
今天看到一个[好理解的非递归方法](https://leetcode.cn/problems/binary-tree-inorder-traversal/solutions/25220/yan-se-biao-ji-fa-yi-chong-tong-yong-qie-jian-ming)

```cpp
class Solution {
public:

    vector<int> inorderTraversal(TreeNode *root) {
        vector<int> anw;

        if (root == nullptr) return anw;

        stack<pair<TreeNode *, bool>> st;
        st.push(make_pair(root, false));
        while (!st.empty()) {
            auto [node, color] = st.top();
            st.pop();
            if (node == nullptr) {
                cout << "null" << endl;
                continue;
            }
            if (color) {
                anw.emplace_back(node->val);
                cout << "anw " << node->val << endl;
                continue;
            }
            else {
                st.push(make_pair(node->right, false));
                st.push(make_pair(node, true));
                st.push(make_pair(node->left, false));
                cout << "push right " << node->val << " push left" << endl;
            }
        }
        return anw;
    }
};
```

### 98 验证二叉搜索树
和 99 一个思路，先检验中序遍历有没有逆序

=== "dfs"

    ```cpp
    class Solution {
    public:
        long long  last_val = LONG_LONG_MIN;

        bool isValidBST(TreeNode* root) {
            if (root == nullptr)
                return true;
            bool leftValid = isValidBST(root->left);
            if (!leftValid)
                return false;
            if (last_val >= root->val)
                return false;
            last_val = root->val;
            bool rightValid = isValidBST(root->right);
            if (!rightValid)
                return false;
            return true;
        }
    };
    ```

=== "mirros"

    ```cpp
    class Solution {
    public:
        int last_val = INT_MIN;
        bool ff = false;

        bool isValidBST(TreeNode* root) {

            dfs(root);
            if (ff)
                return false;
            else
                return true;
        }

        void dfs(TreeNode* root) {
            TreeNode* pre = nullptr;
            TreeNode* now = root;
            while (now) {
                TreeNode* mirros = now->left;
                if (mirros == nullptr) {
                    if (pre && pre->val >= now->val) {
                        ff = true;
                    }
                    pre = now;
                    now = now->right;
                    continue;
                }
                while (mirros->right && mirros->right != now) {
                    mirros = mirros->right;
                }
                if (mirros->right == nullptr) {
                    mirros->right = now;
                    now = now->left;
                } else {
                    if (pre && pre->val >= now->val) {
                        ff = true;
                    }
                    mirros->right = nullptr;
                    pre = now;
                    now = now->right;
                }
            }
        }

    }
    ;
    ```

### 99 恢复二叉搜索树
- 中序遍历的结果序列中，第一个逆序对 AB 的 A 是待换元素
- 如果有第二个逆序对，第二个逆序对 CD 的 D 是待换元素
- 如果没有第二个逆序对，就是 AB 互换
- 为什么这么说，可以写一个升序序列然后换其中的两个位置

=== "dfs"

    ```cpp
    class Solution {
    public:
        void recoverTree(TreeNode *root) {
            dfs(root);
            swap(fault_left->val, fault_right->val);
        }

        TreeNode *fault_left;
        TreeNode *fault_right;
        TreeNode *last = nullptr;

        void dfs(TreeNode *root) {
            if (root == nullptr) return;
            dfs(root->left);
            if (last == nullptr) last = root;
            if (last->val > root->val) {
                if (fault_left == nullptr) {
                    fault_left = last;
                    fault_right = root;
                }
                else {
                    fault_right = root;
                }
            }
            last = root;
            dfs(root->right);
        }
    };
    ```

=== "Mirros"

    ```cpp
    class Solution {
    public:
        void recoverTree(TreeNode * root) {
            TreeNode * now = root;
            TreeNode * pre = nullptr;
            TreeNode * x = nullptr;
            TreeNode * y = nullptr;

            while (now) {
                TreeNode * mirros = now->left;
                if (mirros == nullptr) {
                    if (pre && pre->val > now->val) {
                        if (x == nullptr) x = pre;
                        y = now;
                    }
                    pre = now;
                    now = now->right;
                    continue;
                }
                while (mirros->right && mirros->right != now) {
                    mirros = mirros->right;
                }
                if (mirros->right == nullptr) {
                    mirros->right = now;
                    now = now->left;
                }
                else {
                    if (pre && pre->val > now->val) {
                        if (x == nullptr) x = pre;
                        y = now;
                    }
                    mirros->right = nullptr;
                    pre = now;
                    now = now->right;
                }
            }
            if (x && y) swap(x->val, y->val);
        }
    };
    ```

### 105 106 构建二叉树
简单的记法：统一用左子树的大小去调整范围，节省心智

??? "105"

    ```cpp
    class Solution {
    public:
        unordered_map<int, int> valIndexInorder;

        TreeNode *buildTree(vector<int> &preorder, vector<int> &inorder) {

            for (int i = 0; i < inorder.size(); i++)
                valIndexInorder[inorder[i]] = i;

            return build(preorder, inorder, 0, preorder.size() - 1, 0,
                        inorder.size() - 1);
        }

        TreeNode *build(vector<int> &preorder, vector<int> &inorder, int preleft,
                        int preright, int inleft, int inright) {
            if (preleft > preright)
                return nullptr;

            int val = preorder[preleft];
            TreeNode *root = new TreeNode(val);
            int index = valIndexInorder[val];
            int leftLen = index - inleft;

            root->left = build(preorder, inorder,
                            preleft + 1, preleft + leftLen,
                            inleft, inleft + leftLen - 1);
            root->right = build(preorder, inorder,
                                preleft + leftLen + 1, preright,
                                inleft + leftLen + 1, inright);
            return root;
        }
    };
    ```

??? "106"

    ```cpp
    class Solution {
    public:
        unordered_map<int, int> indexInMidorderOf;

        TreeNode *buildTree(vector<int> &inorder, vector<int> &postorder) {
            for (int i = 0; i < inorder.size(); i++)
                indexInMidorderOf[inorder[i]] = i;
            return build(inorder, 0, inorder.size() - 1,
                        postorder, 0, postorder.size() - 1);
        }

        TreeNode *build(vector<int> &inorder, int in_l, int in_r,
                        vector<int> &postorder, int po_l, int po_r) {
            if (in_l > in_r || po_l > po_r) return nullptr;

            TreeNode *root = new TreeNode(postorder[po_r]);
            int rootIndexofMidorder = indexInMidorderOf[postorder[po_r]];
            int leftSonSize = rootIndexofMidorder - in_l;

            root->left = build(inorder, in_l, in_l + leftSonSize - 1,
                            postorder, po_l, po_l + leftSonSize - 1);

            root->right = build(inorder, in_l + leftSonSize + 1, in_r,
                                postorder, po_l + leftSonSize, po_r - 1);
            return root;
        }
    };
    ```

### 114 二叉树转链表
1. 先序遍历，前一个节点的右儿子改成当前点，左儿子为空
2. 把右儿子挂到左子树的最右节点，然后把当前点右儿子改成左，左儿子为空。

=== "递归"

    ```cpp
    class Solution {
    public:
        void flatten(TreeNode *root) {
            TreeNode dummy(0);
            pre = &dummy;
            dfs(root);
        }

        TreeNode *pre = nullptr;

        void dfs(TreeNode *root) {
            if (root == nullptr)
                return;

            TreeNode *leftson = root->left;
            TreeNode *rightson = root->right;

            pre->left = nullptr;
            pre->right = root;
            pre = root;

            dfs(leftson);
            dfs(rightson);
        }
    };
    ```

=== "非递归"

    ```cpp
    class Solution {
    public:
        void flatten(TreeNode *root) {
            if (root == nullptr) return;
            TreeNode du(0);
            TreeNode *pre = &du;
            stack<pair<TreeNode *, bool>> st;
            st.push({root, false});
            while (!st.empty()) {
                auto [node, color] = st.top();
                st.pop();
                if (node == nullptr) continue;
                if (color) {
                    pre->right = node;
                    pre->left = nullptr;

                    pre = node;
                }
                else {
                    st.push({node->right, false});
                    st.push({node->left, false});
                    st.push({node, true});
                }
            }
        }
    };
    ```

=== "规律"

    ```cpp
    class Solution {
    public:
        void flatten(TreeNode* root) {
            if (root == nullptr)
                return;
            while (root) {
                TreeNode* move = root->left;
                while (move && move->right)
                    move = move->right;
                if (move) {
                    move->right = root->right;
                    root->right = root->left;
                    root->left = nullptr;
                }
                root = root->right;
            }
        }
    };
    ```

### 117 填充右指针
层序遍历

```cpp
class Solution {
public:
    Node* connect(Node* root) {
        if (root == nullptr)
            return root;
        queue<Node*> qu;
        qu.push(root);
        while (!qu.empty()) {
            int sz = qu.size();
            for (int i = 0; i < sz; i++) {
                auto item_a = qu.front();
                    qu.pop();
                if (i != sz - 1) {
                    item_a->next = qu.front();
                }
                if (item_a->left)
                    qu.push(item_a->left);
                if (item_a->right)
                    qu.push(item_a->right);
            }
        }

        return root;
    }
};
```

每层相当于一个链表，假如第 i 层已经建立好链表，遍历第 i 层时可以建下一层的

```cpp
class Solution {
public:
    Node *connect(Node *root) {

        if (root == nullptr) return nullptr;

        Node *head = root;
        while (head) {
            Node next_level_head(0); // 开一个 dummy head
            Node *next_level_p = &next_level_head;
            for (Node *cur_level_p = head; cur_level_p; cur_level_p = cur_level_p->next) {
                if (cur_level_p->left) {
                    next_level_p->next = cur_level_p->left;
                    next_level_p = next_level_p->next;
                }
                if (cur_level_p->right) {
                    next_level_p->next = cur_level_p->right;
                    next_level_p = next_level_p->next;
                }
            }
            head = next_level_head.next;
        }
        return root;
    }
};
```

### 118 杨辉三角
难度不大，问题在于空间

```cpp
class Solution {
public:
    vector<vector<int>> generate(int numRows) {
        vector<vector<int>> ret(numRows);
        for (int i = 0; i < numRows; ++i) {
            ret[i].resize(i + 1);
            ret[i][0] = ret[i][i] = 1;
            for (int j = 1; j < i; ++j) {
                ret[i][j] = ret[i - 1][j] + ret[i - 1][j - 1];
            }
        }
        return ret;
    }
};
```

### 121 买卖股票1
相当于求 a[j]-a[i] 的最大值（j>i）

暴力就是双重循环，但是其实可以一个循环，利用无后效性，当我们扫到下标为 i 的元素时，只要有 a[0..i-1] 的最小值就好了，而这个最小值可以在扫到 i 之前就在维护

```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int hold = INT_MAX; // 可以简化判断·
        int anw = 0;
        for (int price : prices) {
            if (hold < price)
                anw = max(anw, price - hold);
            hold = min(hold, price);
        }
        return anw;
    }
};
```

### 124 二叉树中的最大路径和

刚开始想到类似后序遍历，找到左子树和右子树的最大路径和，再和根加一起，方向是对的，但应该不是返回最大路径和，而是以 `root.left/right` 为一端的结果

正解：处理当前节点，找到左子树和右子树的最大路径和 `left,right` 。动态更新 `anw` （看 `left, right` 有没有贡献，有贡献就加到 `sum`）。 另外 dfs 找的是子树（假如是左子树）为一端的结果。直接看代码可能更好理解

??? "slove 124"

    ```cpp
    class Solution {
    public:
        int anw = -0x3f3f3f;
        int maxPathSum(TreeNode * root) {
            dfs(root);
            return anw;
        }
        
        int dfs(TreeNode * root) {
            if (root == nullptr)
                return 0;

            int val = root->val;
            int left = dfs(root->left);
            int right = dfs(root->right);
            if (left > 0)
                val += left;
            if (right > 0)
                val += right;
            anw = max(anw, val);

            return max(root->val, max(left, right) + root->val);
        }
    };

    ```

### 128 最长连续序列
#### 哈希表
一开始想的是哈希表记录出没出现，然后最大范围内遍历+ while 循环，超时了，后来改进成这样

```cpp
class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        int anw = 0;
        if (nums.empty())
            return 0;
        map<int, bool> appear;
        for (int x : nums)
            appear[x] = true;
        for (int x : nums) {
            int len = 1;
            while (appear[x - len])
                len++;
            anw = max(anw, len);
        }
        return anw;
    }
};
```

然后又超时了，看了答案后发现有很多冗余，比如说假如往回查(向小数)，4 就一定比 3 效果好，所以有 4 就不查 3

```cpp
class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        int anw = 1;
        if (nums.empty())
            return 0;
        unordered_map<int, bool> appear;
        for (int x : nums)
            appear[x] = true;
        for (int x : nums) {
            int len = 1;
            if (appear[x + 1])
                continue;
            while (appear[x - len])
                len++;
            anw = max(anw, len);
        }
        return anw;
    }
};
```

还可以往前查，有 3 就不查 4，但是这个表现不好，（我分析理论上应该差不多，实际可能是优化问题或者设计问题？）

gpt 给出的答案是

- 如果 nums 中升序多，往大了数快 `if (appear[x + 1]) continue;`
- 如果 nums 降序多，往小数快 `if (appear[x + 1]) continue;`
- 看起来有点合理

> The performance difference could arise from the order in which the numbers are checked for consecutiveness. It depends on the distribution of numbers in the nums vector. If the numbers are more likely to be consecutive in increasing order, the first approach might perform better. Conversely, if the numbers are more likely to be consecutive in decreasing order, the second approach might be more efficient.

??? "向大数"

    ```cpp
    class Solution {
    public:
        int longestConsecutive(vector<int>& nums) {
            int anw = 1;

            if (nums.empty())
                return 0;
            unordered_map<int, bool> appear;
            for (int x : nums)
                appear[x] = true;
            for (int x : nums) {

                int len = 1;
                if(appear[x-1]) continue;
                while (appear[x + len])
                    len++;
                anw = max(anw, len);
            }

            return anw;
        }
    };
    ```

#### 动态规划
第二种解法：动态规划，感觉这个方法不看答案是不容易想出来的。

```cpp
class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_map<int, int> appear;
        int anw = 0;

        for (int x : nums) {
            if (appear[x] == 0) {
                int total_len = 1;
                int left_len = appear[x - 1];
                int right_len = appear[x + 1];
                //eg: [1, 2, 3] 4 [5, 6]
                total_len =total_len+ left_len + right_len;
                appear[x - left_len] =appear[x]= appear[x + right_len] = total_len;
                anw = max(anw, total_len);
            }
        }
        return anw;
    }
};
```

#### 并查集
第三种解法：并查集思想

存下一个数，这样找到最远的数 right，right-x 就是答案，理论上存下一个和上一个差不多，但是存上一个就会超时

```cpp
class Solution {
public:
    unordered_map<int, int> map;

    int findmap(int x) {
        if (map.count(x)) {
            map[x] = findmap(map[x]);// 路径压缩
            return map[x];
        }
        else return x;
    }

    int longestConsecutive(vector<int> &nums) {
        int anw = 0;
        for (int x: nums) map[x] = x + 1;
        for (int x: nums) {
            int len = findmap(x) - x;
            anw = max(anw, len);
        }
        return anw;
    }
};

class Union {
    static const int N = 10;

    int root[N];
    int size[N];
public:
    Union() {
        for (int i = 0; i < N; i++) {
            root[i] = i;
            size[i] = 1;
        }
    }

    void unionab(int a, int b) {
        int root_a = get_root(a);
        int root_b = get_root(b);
        int atreeSize = size[root_a];
        int btreeSize = size[root_b];

        if (atreeSize < btreeSize) {
            root[root_a] = root_b;
            size[root_b] += atreeSize;
        }
        else {
            root[root_b] = root_a;
            size[root_a] += btreeSize;
        }
    }

    int get_root(int x) {
//        while (root[x] != x) {
//            root[x]=root[root[x]];// this can short path
//            x = root[x];
//        }// 两种写法
        if (root[x] != x)
            root[x] = get_root(root[x]);
        return x;
    }

    bool isConnected(int a, int b) {
        return get_root(a) == get_root(b);
    }

    void print() {
        for (int i = 0; i < N; ++i) {
            printf("root %d is %d\n", i, root[i]);
        }
    }
};
```

??? "TLE"

    ```cpp
    class Solution {
    public:
        unordered_map<int, int> map;

        int findmap(int x) {
            if (map.count(x)) {
                map[x] = findmap(map[x]);
                // 路径压缩
                return map[x];
            }
            else return x;
        }

        int longestConsecutive(vector<int> &nums) {
            int anw = 0;
            for (int x: nums) map[x] = x - 1;
            for (int x: nums) {
                int len = x - findmap(x);
                anw = max(anw, len);
            }
            return anw;
        }
    };

    ```

### 131 分割回文串
和 78 子集有点像，但是子集那个是路上全收集，这个部分收集

```cpp
class Solution {
public:
    vector<vector<string>> partition(string s) {
        dfs(0, s);
        return anw;
    }

    vector<vector<string>> anw;
    vector<string> res;

    void dfs(int begin_index, const string s) {
        if (begin_index == s.size()) {
            anw.push_back(res);
            return;
        }
        for (int i = begin_index; i < s.size(); i++) {
            string substr = s.substr(begin_index, i - begin_index + 1);
            if (isSim(substr))
                res.push_back(substr);
            else
                continue;
            dfs(i + 1, s);
            res.pop_back();
        }
    }

    bool isSim(const string s) {
        for (int i = 0; i < s.size() / 2; i++) {
            if (s[i] != s[s.size() - 1 - i])
                return false;
        }
        return true;
    }
};

```

### 138 随机链表复制
第一种，用哈希表

```cpp
class Solution {
public:
    unordered_map<Node *, Node *> mp;
    Node * copyRandomList(Node * head) {
        Node * dummy = new Node(0);
        Node * now = dummy;
        Node * h = head;
       
        while (h) {
            now->next = new Node(h->val);
            mp[h] = now->next;
            h = h->next;
            now = now->next;
        }

        h = head;
        now = dummy->next;
        while (h) {
            now->random = mp[h->random];
            now = now->next;
            h = h->next;
        }
        return dummy->next;
    }
};
```

第二种[题解](https://leetcode.cn/problems/copy-list-with-random-pointer/solutions/295083/liang-chong-shi-xian-tu-jie-138-fu-zhi-dai-sui-ji-)

用虚拟节点，防止原链表只有一个点。

```cpp
class Solution {
public:
    Node *copyRandomList(Node *head) {
        if (head == nullptr)
            return nullptr;
        auto h = head;
        auto now = head;
        while (h) {
            now = new Node(h->val);
            now->next = h->next;
            h->next = now;
            h = h->next->next;
        }

        h = head;
        while (h) {
            if (h->random)
                h->next->random = h->random->next;
            h = h->next->next;
        }

        h = head;
        Node *dummy = new Node(0);
        dummy->next=head;
        now = dummy;

        while (h) {
            now->next = h->next;
            h->next = h->next->next;
            now = now->next;
            h = h->next;
        }
        return dummy->next;
    }
};
```


### 146 LRU 缓存
双向链表加哈希表，靠近头的是最近使用的。每次操作先检查有没有，有的话就**先删除它与左右的联系再调到头部**（不然的话链表的指向就乱了）。理解起来难度不大，但是写起来太容易出错了。

=== "1 ed"

    ```cpp
    class MyNode {
    public:
        MyNode* prev;
        MyNode* next;
        int val;
        int key;

        MyNode(int _val) : val(_val) {}

        MyNode(int _key, int _val) : key(_key), val(_val) {}
    };

    class LRUCache {
    public:
        unordered_map<int, MyNode*> map;
        MyNode* dummy;
        int cap;
        LRUCache(int capacity) {
            cap = capacity;
            dummy = new MyNode(0);
            dummy->next = dummy;
            dummy->prev = dummy;
        }

        int get(int key) {
            if (map.find(key) == map.end())
                return -1;
            auto item = map[key];
            removeRelationship(item);
            setToFront(item);
            return item->val;
        }

        void put(int key, int value) {
            if (map.find(key) == map.end()) {
                auto item = new MyNode(key, value);
                map[key] = item;
                setToFront(item);

                if (map.size() > cap) {
                    auto todel = dummy->prev;
                    map.erase(todel->key);
                    removeRelationship(todel);
                    delete todel;
                }
            } 
            else {
                removeRelationship(map[key]);
                setToFront(map[key]);
                map[key]->val = value;
            }
        }

        void removeRelationship(MyNode* item) {
            item->prev->next = item->next;
            item->next->prev = item->prev;
        }

        void setToFront(MyNode* item) {
            item->next = dummy->next;
            item->prev = dummy;
            item->next->prev = item;
            item->prev->next = item;
        }
    };
    ```

=== "better"

    ```cpp
    class mynode {
    public:
        int key, value;
        mynode *left;
        mynode *right;

        mynode(int val) : value(val) {}

        mynode(int k, int v) : key(k), value(v) {}
    };

    class LRUCache {
    public:
        unordered_map<int, mynode *> map;
        mynode *dummy;
        int cap;

        LRUCache(int capacity) {
            cap = capacity;
            dummy = new mynode(0);
            dummy->left = dummy;
            dummy->right = dummy;
        }

        int get(int key) {
            auto item = getNode(key);
            return item ? item->value : -1;
        }

        void put(int key, int value) {
            auto item = getNode(key);
            if (item != nullptr) {
                item->value = value;
                return;
            }
            else {
                item = new mynode(key, value);
                map[key] = item;
                setToFront(item);

                if (map.size() > cap) {
                    auto delNode = dummy->left;
                    delRelationship(delNode);
                    map.erase(delNode->key);
                    delete delNode;
                }
            }

        }

        mynode *getNode(int key) {
            if (map.find(key) == map.end()) return nullptr;
            auto item = map[key];
            delRelationship(item);
            setToFront(item);
            return item;
        }

        void delRelationship(mynode *item) {
            item->left->right = item->right;
            item->right->left = item->left;
        }

        void setToFront(mynode *item) {
            item->left = dummy;
            item->right = dummy->right;
            item->left->right = item;
            item->right->left = item;
        }
    };
    ```

### 148 排序链表
归并排序

```cpp
class Solution {
public:
    ListNode *sortList(ListNode *head) {
        if (head == nullptr) return nullptr; // 特判原链表为空

        if (head->next == nullptr) return head;  // 归并终止

        ListNode *left = head;
        ListNode *leftPartEnd = getLeftPartEnd(head);
        ListNode *right = leftPartEnd->next;
        leftPartEnd->next = nullptr;

        left = sortList(left);
        right = sortList(right);
        return merge(left, right);

    }

    // 奇数个节点返回中间，偶数个节点返回左部分的最后一个
    ListNode *getLeftPartEnd(ListNode *head) {
        ListNode *slow = head;
        ListNode *fast = head->next;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
        }
        return slow;
    }

    ListNode *merge(ListNode *left, ListNode *right) {
        ListNode dummy(0);
        ListNode *cur = &dummy;
        while (left && right) {
            if (left->val < right->val) {
                cur->next = left;
                left = left->next;
            }
            else {
                cur->next = right;
                right = right->next;
            }
            cur = cur->next;
        }
        if (left) cur->next = left;
        else cur->next = right;
        return dummy.next;
    }

};
```


第二种，每次从头排序的长度为 1, 2, 4 ...

```cpp
class Solution {
public:
    ListNode *sortList(ListNode *head) {

        int length = getLength(head);
        ListNode dummy(0);
        dummy.next = head;
        
        for (int i = 1; i < length; i*=2) {
            ListNode *sortedTail = &dummy;
            ListNode *cur = sortedTail->next;
            while (cur) {
                ListNode *left = cur;
                ListNode *right = cut(left, i);
                cur = cut(right, i);
                ListNode *newSortedHead = merge(left, right);
                sortedTail->next = newSortedHead;
                while (sortedTail->next) sortedTail = sortedTail->next;
            }
        }
        return dummy.next;
    }

    ListNode *merge(ListNode *left, ListNode *right) {
        ListNode dummy(0);
        ListNode *cur = &dummy;
        while (left && right) {
            if (left->val < right->val) {
                cur->next = left;
                left = left->next;
            }
            else {
                cur->next = right;
                right = right->next;
            }
            cur = cur->next;
        }
        if (left) cur->next = left;
        else cur->next = right;
        return dummy.next;
    }

    ListNode *cut(ListNode *head, int cnt) {
        for (int i = 1; i < cnt && head; i++) {
            head = head->next;
        }
        if (!head) return nullptr;

        ListNode *ne = head->next;
        head->next = nullptr;
        return ne;
    }

    int getLength(ListNode *head) {
        int cnt = 0;
        while (head) {
            cnt++;
            head = head->next;
        }
        return cnt;
    }
};
```

### 155 最小栈
用一个辅助栈存最小值，push 如果 `val <= minst.top` push 进，不然跳过，假如说是 5， 3， 4 这个例子，只要 3 不从真实栈出来，无论后面 4 怎么进出真实栈都不改变最小值。但如果又来一个 3 就要进辅助栈，是为了弹出后来的 3 时，辅助栈最小值还是 3（之前先来的那个）

另外为什么不是所有数字的单调栈？还是 5， 3， 4 这个例子，当 4 从真实栈弹出的时候是不能操作到单调栈的 `|| 5 4 3 (`

### 189 轮转数组
线性代数：在想我的事情？😋

$$(a^Tb^T)^T=ba$$

矩阵的转置或者求逆有上边的性质，可以发现字符串的逆序也符合这个性质。逆序映射转置，单射函数，先分别逆序，再全部逆序即可。

细节处理：轮转 k 个相当于把前 size-k 个数放到最后，当 k=size 相当于前 0 个放到最后，就是原样不动，所以 `if k > nums.size k = k % nums.size`

=== "24ms"

    ```cpp
    class Solution {
    public:
        void test() {
            vector<int> te = {1, 2, 3, 4, 5, 6, 7};
            rotate(te, 3);
        }
        void rotate(vector<int>& nums, int k) {
            k %= nums.size();
            reverse(nums.begin(), nums.begin() + nums.size() - k);
            reverse(nums.begin() + nums.size() - k, nums.end());
            reverse(nums.begin(), nums.end());
            return;
        }
    };
    ```

=== "7ms"

    ```cpp
    class Solution {
    public:
        void test() {
            vector<int> te = {1, 2, 3, 4, 5, 6, 7};
            rotate(te, 3);
        }


        void rotate(vector<int> &nums, int k) {

            if (k <= nums.size()) {
                reverse(nums.begin(), nums.begin() + nums.size() - k);
                reverse(nums.begin() + nums.size() - k, nums.end());
                reverse(nums.begin(), nums.end());
                return;
            }
            else {
                rotate(nums, k - nums.size());
            }
        }
    };
    ```


### 198 打家劫舍
开始想的不对，不用标记上一个偷没偷，直接取就行了

=== "空间On"

    ```cpp
    class Solution {
    public:
        int rob(vector<int> &nums) {
            if(nums.empty()) return 0;
            if(nums.size()==1) return nums[0];
            vector<int>dp(nums.size(),0);
            dp[0]=nums[0];
            dp[1]=max(nums[1],nums[0]);

            for (int i = 2; i <nums.size() ; ++i) {
                dp[i]= max(dp[i-1],dp[i-2]+nums[i]);
            }
            return dp[nums.size()-1];
        }
    };
    ```

=== "O1"

```cpp
class Solution {
public:
    int rob(vector<int>& nums) {
        if (nums.empty()) {
            return 0;
        }
        int size = nums.size();
        if (size == 1) {
            return nums[0];
        }
        int first = nums[0], second = max(nums[0], nums[1]);
        for (int i = 2; i < size; i++) {
            int temp = second;
            second = max(first + nums[i], second);
            first = temp;
        }
        return second;
    }
};
```

### 199 二叉树的右视图
观察到答案是每层的最后一个

```cpp
class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {

        vector<int> anw;
        if (root == nullptr)
            return anw;
        queue<TreeNode*> qu;
        qu.push(root);
        while (!qu.empty()) {
            int k = qu.size();
            for (int i = 0; i < k; i++) {
                TreeNode* item = qu.front();
                qu.pop();
                if (i == k - 1)
                    anw.push_back(item->val);
                if (item->left)
                    qu.push(item->left);
                if (item->right)
                    qu.push(item->right);
            }
        }
        return anw;
    }
};
```

dfs：根右左，如果答案个数和层数（从 0 开始）相同，放入

```cpp
class Solution {
public:
    vector<int> anw;

    vector<int> rightSideView(TreeNode *root) {

        if (root == nullptr) return anw;
        dfs(root, 0);
        return anw;
    }

    void dfs(TreeNode *root, int depth) {
        if (root == nullptr) return;
        if (depth == anw.size()) anw.push_back(root->val);

        dfs(root->right, depth + 1);
        dfs(root->left, depth + 1);
    }
};
```

### 202 快乐数
并不快乐

官方题解写的挺好，补充说明，如果 x 长度大于 3，最终 x 会小于等于 243（999 -> 243），也就是绕来绕去绕到长度为 3 状态顶多会有 243 个，因为状态数有限（最多 243）但是操作无限，所以要么成环绕回到本身，要么到 1 出口

[为什么只有一个环](https://leetcode.cn/problems/happy-number/solutions/21454/shi-yong-kuai-man-zhi-zhen-si-xiang-zhao-chu-xun-h/comments/2245241)

=== "哈希表"

    ```cpp
    class Solution {
    public:
        bool isHappy(int n) {
            unordered_map<int, bool> appear;
            while (true) {
                n = getNext(n);
                if (n == 1) return true;
                if (appear[n] == false) appear[n] = true;
                else return false;
            }
        }

        int getNext(int n) {
            int anw = 0;
            while (n > 0) {
                int x = n % 10;
                anw += x * x;
                n /= 10;
            }
            return anw;
        }
    };
    ```

=== "快慢指针"

    ```cpp
    class Solution {
    public:
        bool isHappy(int n) {
            int slow = getNext(n), fast = getNext(getNext(n));
            while (fast != 1 && slow != fast) {
                slow = getNext(slow);
                fast = getNext(getNext(fast));
            }
            return fast == 1;
        }

        int getNext(int n) {
            int anw = 0;
            while (n > 0) {
                int x = n % 10;
                anw += x * x;
                n /= 10;
            }
            return anw;
        }
    };
    ```


### 205 同构字符串
离散数学最有用的一次

1. 一个哈希表不能维护多对一，要么用两个，要么判断两次。
2. 如果换一种思路，全都转成第三方，汉语和日语全都换成英语，检测英语是不是一样就行了，具体为对应成首次出现的下标

```
abca

0120

defd
```

=== "判两次"

    ```cpp
    class Solution {
    public:

        bool isIsomorphic(string s, string t) {
            return checkT2S(s, t) && checkT2S(t, s);
        }

        bool checkT2S(string t, string s) {
            unordered_map<char, char> ttos;
            for (int i = 0; i < s.size(); i++) {
                if (ttos.find(t[i]) == ttos.end()) {
                    ttos[t[i]] = s[i];
                }
                else if (ttos[t[i]] != s[i]) return false;
            }
            return true;
        }
    };
    ```

=== "转下标"

    ```cpp
    class Solution {
    public:

        bool isIsomorphic(string s, string t) {
            return toIndexString(s) == toIndexString(t);
        }

        string toIndexString(string s) {
            int cnt = 0;
            unordered_map<char, int> toindex;
            string res;
            for (char x: s) {
                if (toindex.find(x) == toindex.end()) {
                    toindex[x] = cnt;
                    // 防止 21 0 2 10 不能区分，所以加空格
                    res +=' '+ to_string(cnt);
                    cnt++;
                }
                else res +=' '+ to_string(toindex[x]);
            }
            cout<<res<<'\n';
            return res;
        }


    };
    ```

### 211 添加与搜索单词
前缀树，主要是搜索的时候怎么处理通配符，直接进行一个 dfs

```cpp
class WordDictionary {
public:
    bool isend;
    WordDictionary *next[26];

    WordDictionary() {
        isend = false;
        fill(next, next + 26, nullptr);
    }

    void addWord(string word) {
        WordDictionary *cur = this;
        for (char x: word) {
            int id = x - 'a';
            if (cur->next[id] == nullptr) cur->next[id] = new WordDictionary();
            cur = cur->next[id];
        }
        cur->isend = true;
    }

    bool search(string word) {
        return search_core(this, word, 0);
    }

    bool search_core(WordDictionary *cur, string &word, int cnt) {
        if (cnt == word.size()) return cur->isend;
        if (word[cnt] == '.') {
            for (auto &x: cur->next)
                if (x != nullptr && search_core(x, word, cnt + 1))
                    return true;
            return false;
        }
        else {
            int id = word[cnt] - 'a';
            if (cur->next[id] == nullptr) return false;
            return search_core(cur->next[id], word, cnt + 1);
        }
    }
};
```

### 212 单词搜索2
一眼爆搜，问题在于怎么减少无效的搜索。

1. 有很多字符串，用 trie
2. 搜过的状态不在搜
3. 不在 trie 的不搜

```cpp
class Trie {
    bool isend;

public:
    string word;
    vector<Trie*> next;

    Trie() {
        isend = false;
        next.assign(26, nullptr);
    }

    void add(string& word) {
        Trie* cur = this;
        for (char x : word) {
            int id = x - 'a';
            if (cur->next[id] == nullptr)
                cur->next[id] = new Trie();
            cur = cur->next[id];
        }
        cur->word = word;
        cur->isend = true;
    }
};

class Solution {
    vector<string> anw;
    Trie trie;

public:
    vector<string> findWords(vector<vector<char>>& board,
                             vector<string>& words) {
        for (auto x : words)
            trie.add(x);
        for (int row = 0; row < board.size(); row++)
            for (int col = 0; col < board[0].size(); col++)
                dfs(row, col, &trie, board);
        return anw;
    }

    void dfs(int row, int col, Trie* cur, vector<vector<char>>& board) {
        if (row < 0 || row >= board.size() || col < 0 || col >= board[0].size())
            return;
        char c = board[row][col];
        if (c == '#' || cur->next[c - 'a'] == nullptr)
            return;

        cur = cur->next[c - 'a']; // trie 看下一位，因为有 dummy 头
        if (!cur->word.empty()) {
            anw.emplace_back(cur->word);
            cur->word.clear(); // 防止多次添加到答案
        }

        board[row][col] = '#';  // 访问过了就修改标志位
        dfs(row + 1, col, cur, board);
        dfs(row - 1, col, cur, board);
        dfs(row, col + 1, cur, board);
        dfs(row, col - 1, cur, board);
        board[row][col] = c;
    }
};
```

### 213 打家劫舍2
看成是 0-n-1 和 1-n 两部分

```cpp

class Solution {
public:
    int rob(vector<int> &nums) {
        if (nums.size() == 1) return nums[0];
        if (nums.size() == 2) return max(nums[1], nums[0]);

        int anw0 = choose(nums, 0, nums.size() - 2);
        int anw1 = choose(nums, 1, nums.size() - 1);
      //  cout <<anw0<<' ' << anw1;
        return max(anw0, anw1);
    }

    int choose(vector<int> &nums, int begin, int end) {
        vector<int> anw(end - begin + 1);
        anw[0] = nums[begin];
        anw[1] = max(nums[begin], nums[begin + 1]);
        if (begin == 1)
            for (int i = 2; i < anw.size(); i++)
                anw[i] = max(anw[i - 1], anw[i - 2] + nums[i + 1]);
        else {
            for (int i = 2; i < anw.size(); i++)
                anw[i] = max(anw[i - 1], anw[i - 2] + nums[i]);
        }
        return anw[anw.size() - 1];
    }
};
```

### 215 数组中的第K个最大元素
快速选择，经典题目。

普通快排：每次快排后 `[lo,j]` 的元素是 `<=x` 的，`[j+1,hi]` 的元素是 `>=x` 的，当 `lo==hi` 就是答案。要找第 k 大，直接数组弄成降序，寻找下标为 k-1 的元素

```cpp
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        return quick(nums, 0, nums.size() - 1, k - 1);
    }

    int quick(vector<int>& nums, int lo, int hi, int k) {
        if (lo >= hi)
            return nums[k];
        int i = lo - 1, j = hi + 1;
        int x = nums[lo + hi >> 1];
        while (i < j) {
            do i++; while (nums[i] > x);
            do j--; while (nums[j] < x);
            if (i < j)
                swap(nums[i], nums[j]);
        }
        if (k <= j)
            return quick(nums, lo, j, k);
        else
            return quick(nums, j + 1, hi, k);
    }
};
```

### 225 两个队列实现栈
每次放的时候先放到辅助队列，把主队列的内容全导入辅助，在把辅助队列导入主队列

或者放的时候先放到主队列，出的时候先把前 n-1 个放到辅助队列，弹出答案，再把辅助队列内容挪回主队列

```cpp
class MyStack {
public:
    queue<int> que;
    queue<int> aux;

    MyStack() {

    }

    void push(int x) {
        aux.push(x);
        while (!que.empty()) {
            aux.push(que.front());
            que.pop();
        }
        swap(que, aux);
    }
    
    int pop() {
        int r = que.front();
        que.pop();
        return r;
    }
    
    int top() {
        int r = que.front();
        return r;
    }
    
    bool empty() {
        return que.empty();
    }
};


```

### 229 多数元素2
- 如果已经出现了，次数加一
- 如果没出现
    - 桶还能放，就放到桶里
    - 没有多余的桶，所有的次数减一

可能有出现在数组靠后的元素，会占到桶里，所以重新统计一次（桶的个数多于 1）,或者抵消了一部分正确数字次数 `eg:[2, 2, 1, 3]`

桶的个数：假如说要找超过 `n/k` 个的元素，桶的个数就是 `k-1` 。假如取 `x` 个， `x*(n/k) <= n  ---> x <= k` ，又因为超过 `n/k` ，所以取 `k-1`

```cpp
class Solution {
public:
    //first 存数字，second 存出现次数
    pair<int, int> bucket[2];

    void write(int x) { 
        // item 取引用，因为要修改里边的元素,不然的话里边的值不变
        for (auto &item: bucket)
            if (item.first == x) {
                item.second++;
                return;
            }
        for (auto &item: bucket)
            if (item.second == 0) {
                item.first = x;
                item.second = 1;
                return;
            }
        for (auto &item: bucket)
            item.second--;
       
    }

    vector<int> majorityElement(vector<int> &nums) {
        bucket[0].first = bucket[1].first = INT_MAX;
        for (auto x: nums) {
            write(x);
        }

        vector<int> res;
        bucket[0].second = bucket[1].second = 0;

        for (auto x: nums) {
            if (x == bucket[0].first)
                bucket[0].second++;
            else if (x == bucket[1].first)
                bucket[1].second++;
        }
        if (bucket[0].second > nums.size() / 3)
            res.push_back(bucket[0].first);
        if (bucket[1].second > nums.size() / 3)
            res.push_back(bucket[1].first);
        return res;
    }
};
```



### 230 二叉搜索树第k个元素
中序遍历时统计个数

```cpp
class Solution {
public:
    int kthSmallest(TreeNode *root, int k) {

        this->k = k;
        dfs(root);
        return anw;
    }

    int k, anw, cnt;

    void dfs(TreeNode *root) {
        if (root == nullptr) return;
        dfs(root->left);
        cnt++;
        if (cnt == k) {
            anw = root->val;
            return;
        }
        dfs(root->right);
    }
};
```
