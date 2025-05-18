## 232 两个栈实现队列
push 的时候好说，在 pop 的时候没有必要全倒腾，只有在输出栈为空的时候再倒腾就行了

```cpp

class MyQueue {
private:
    stack<int> inSt;
    stack<int> outSt;
public:
    MyQueue() {
    }

    void push(int x) {
        inSt.push(x);
    }

    int pop() {
        if (outSt.empty()) {
            while (!inSt.empty()) {
                outSt.push(inSt.top());
                inSt.pop();
            }
        }
        int x = outSt.top();
        outSt.pop();
        return x;
    }

    int peek() {
        if (outSt.empty()) {
            while (!inSt.empty()) {
                outSt.push(inSt.top());
                inSt.pop();
            }
        }
        return outSt.top();
    }

    bool empty() {
        return inSt.empty() && outSt.empty();
    }
};
```

## 236 二叉树的最近公共祖先
只感觉出是后序遍历（当时红皮书图论看有没有环），但是在祖先是本身和上边节点卡了

```cpp
class Solution {
public:
    TreeNode *lowestCommonAncestor(TreeNode *root, TreeNode *p, TreeNode *q) {
        // 找到就返回一个，所以最上层
        if (root == nullptr || root == q | root == p) return root;
        TreeNode *left = lowestCommonAncestor(root->left, p, q);
        TreeNode *right = lowestCommonAncestor(root->right, p, q);
        if (left && right) return root;
        else left ? left : right;
    }
};
```

## 238 除自身以外数组的乘积
前缀和思路，这个是前缀乘和后缀乘。

```cpp
class Solution {
public:
    vector<int> productExceptSelf(vector<int> &nums) {
        int sz = nums.size();
        vector<int> anw(sz, 1);
        int right_mul=1;
        for (int i = 1; i < sz; ++i) {
            anw[i]=anw[i-1]*nums[i-1];
        }
        for(int i=sz-2;i>=0;--i){
            right_mul*=nums[i+1];
            anw[i]=anw[i]*right_mul;
        }
        return anw;
    }
};
```



## 239 滑动窗口最大值
最开始想到的是窗口新进的值更大，那么窗口里所有比它小的都不是答案了，看提示发现是双端队列存候选答案，不是答案不用存。这也是单调队列（可以相等元素）的一个应用

```cpp
class Solution {
public:
    vector<int> maxSlidingWindow(vector<int> &nums, int k) {

        deque<int> deque;
        vector<int> anw;
        for (int right = 0, left = 0; right < nums.size(); right++) {
            while (!deque.empty() && nums[right] > deque.back()) {
                deque.pop_back();
            }
            deque.push_back(nums[right]);

            if (right - left + 1 > k) {
                if (nums[left] == deque.front()) deque.pop_front();
                left++;
            }
            if (right-left+1 == k)
                anw.push_back(deque.front());
        }
        return anw;
    }
};
```

## 240 搜索二维矩阵
从右上角往左边和下边看是二叉树

```cpp
class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {

        int row=0,col=matrix[0].size()-1;
        while (row>=0&&row<matrix.size()&&col>=0&& col<matrix[0].size()){
            if(matrix[row][col]==target) return true;
            else if(matrix[row][col]<target) row++;
            else col--;
        }
        return false;
    }
};
```

## 274 H指数
看起来挺简单，做起来难

有 H 个数大于等于 H，找最大的 H

1. 发现 H 在 [0, size]，可以二分找有至少 H 个数大于 H 的右端点
2. 先排个序，假如要看是不是有 4 个数大于等于 4，怎么找呢，应该是从数组后面往前看四个，如果第四个大于等于四，那么说明符合。根据这个条件可以从前往后找，也可以从后往前找
3. 用桶记录，超过 size 的相当于引用为 size，从后往前找到第一个满足 引用加和 >= H 的 H

总结：用二分和桶比较好，排序也行


```cpp
// "二分"
class Solution {
public:
    int hIndex(vector<int>& citations) {
        int n = citations.size();

        int left = 0, right = n;
        while (left < right) {
            int mid = left + right + 1 >> 1;
            if (check(mid, citations))
                left = mid;
            else
                right = mid - 1;
        }
        return left;
    }

    bool check(int mid, vector<int>& nums) {
        int cnt = 0;
        for (int x : nums) {
            if (x >= mid)
                cnt++;
        }
        return cnt >= mid;
    }
};
```


```cpp
// "从前往后"
class Solution {
public:
    int hIndex(vector<int>& citations) {
        sort(citations.begin(), citations.end());
        
        int anw = 0;
        int n = citations.size();
        for (int i = 1; i <= n; i++) {
            if (citations[n-i]>=i)
                anw = i;
        }
        return anw;
    }
};
```


```cpp
// "从后往前"
class Solution {
public:
    int hIndex(vector<int>& citations) {
        sort(citations.begin(), citations.end());
    
        int n = citations.size();
        for (int i = n; i >=1; i--) {
            if (citations[n-i]>=i)
                return i;
        }
        return 0;
    }
};
```

```cpp
// "桶"
#include<vector>

class Solution {
public:
    int hIndex(vector<int>& citations) {
        int n = citations.size();
        vector<int>f(n + 1);

        for (int x : citations)
            f[min(n, x)]++;
        
        int total = 0;
        for (int i = n; i >= 0; i--)
        {
            total += f[i];
            // 从后往前找到第一个 有 k 个数 >= k
            if (total >= i) return i;
        }
        return -1;
    }
};
```

## 283 移动0
联动 26 27，把非零都捡出来

```java
class Solution {
    public void moveZeroes(int[] nums) {
        int newCount = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != 0) {
                nums[newCount++] = nums[i];
            }
        }
        for (int i = newCount; i < nums.length; i++)
            nums[i] = 0;
    }
}

class SolutionUpdate {
    public void moveZeroes(int[] nums) {
        int newCount = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != 0) {
                int temp=nums[newCount];
                nums[newCount++] = nums[i];
                nums[i]=temp;
            }
        }
    
    }
}
```


下边是为了用双指针而用，感觉比较僵硬

一种是双指针，一个指向新的开始，一个找应该出现的下一位

```cpp
class Solution {
public:
    void moveZeroes(vector<int> &nums) {
        int choose = 0;
        for (int new_begin = 0; new_begin < nums.size(); ++new_begin) {
            while (choose < nums.size() && !nums[choose]) choose++;
            if (choose < nums.size())
                nums[new_begin] = nums[choose++];
            else {
                while (new_begin<nums.size())
                    nums[new_begin++]=0;
                break;
            }
        }
    }
};
```

不太好的做法是互换，遇到一个 0，就找下一个非 0，进行互换，没有非零就结束，但是需要检查 `[1, 0]` 这种

```cpp
class Solution {
public:
    void moveZeroes(vector<int>& nums) {

        int next = 0;
        while (next < nums.size() && nums[next] != 0)
            next++;     // find first 0
        while (next < nums.size() && nums[next] == 0)
            next++;     // find first positive num after first 0

        for (int new_start = 0; new_start < nums.size(); ++new_start) {
            if (nums[new_start] == 0) {
                while (next < nums.size() && nums[next] == 0)
                    next++;
                if (next >= nums.size())
                    break;
                else
                    swap(nums[new_start], nums[next]);
            }
        }
    }
};
```


## 287 寻找重复数

以[1,3,4,2,2]为例，如果有相同数字，相当于会存在一个环

**核心**：
下标和内容一起做指向

| 下标 | 0   | 1   | 3   | 2   | 4       |
| ---- | --- | --- | --- | --- | ------- |
| 内容 | 1   | 3   | 2   | 4   | 2(成环) |
| 节点 | 1   | 3   | 2   | 4   | 2       |

然后就和[环形链表2](https://leetcode.cn/problems/linked-list-cycle-ii/description/)一个做法，判环找入口

```C++
class Solution {
public:
    vector<int> num;

    int next(int x) { return num[x]; }

    int findDuplicate(vector<int> &nums) {
        num = nums;
        int slow = 0;
        int fast = 0;
        do {
            slow = next(slow);
            fast = next(next(fast));
        } while (slow != fast);

        fast = 0;
        while (fast != slow) {
            fast = next(fast);
            slow = next(slow);
        }
        return fast;
    }
};
```


## 347 前 K 个高频元素
哈希表记录出现次数，用最大堆挑出答案

```cpp
class Solution {
public:
    unordered_map<int, int> map;
    priority_queue<pair<int, int>, vector<pair<int, int>>> pq;

    vector<int> topKFrequent(vector<int> &nums, int k) {
        vector<int> anw;
        for (int x: nums) map[x]++;
        for (auto item: map)pq.emplace(item.second, item.first);
        for (int i = 0; i < k; ++i) {
            auto item = pq.top();
            pq.pop();
            anw.push_back(item.second);
        }
        return anw;
    }
};
```

## 367 有效的完全平方数
和 69 题联动，先找到平方根的整数，然后判断；或者 `n^2 = (1+3...+2n-1)` 用奇数能一直减到零就是完全平方数
```java
class Solution {

    public boolean isPerfectSquare(int num) {
        int x = 1;
        while (num >= x) {
            num -= x;
            x += 2;
        }
        return num == 0;
    }

    public boolean isPerfectSquare2(int num) {
        int x = mysqrt(num);
        return x*x == num;
    }

    private int mysqrt(int num) {
        int left = 0, right = num;
        while (left < right) {
            int mid = 1 + left + (right - left) / 2;
            if (mid <= num / mid) left = mid;
            else right = mid - 1;
        }
        return left;
    }
}
```

## 394 字符串解码
看起来挺简单的，做起来就不是一回事了。直接背下来，另外不要一次处理太多，比如看到一个数字不要再开 while 处理，不然的话在下标上就会很难处理。

```cpp
class Solution {
public:
    string decodeString(string s) {

        // 存的是接下来的串应该重复多少次，和上一次处理结果
        stack<pair<int, string>> st;
        int num = 0;
        string current_process;
        for (char i: s) {
            if (i >= '0' && i <= '9') {
                num *= 10;
                num += (i - '0');
            }
            else if (i == '[') {
                st.emplace(num, current_process);
                num = 0;
                current_process.clear();
            }
            else if (i == ']') {
                int n = st.top().first;
                // n指示的是current的循环次数，不是last_result的
                string last_result = st.top().second;
                st.pop();
                for (int k = 0; k < n; k++)
                    last_result.append(current_process);
                
                current_process = last_result;
            }
            else {
                current_process += i;
            }
        }
        return current_process;
    }
};
```


## 402 移掉K位数字
假如只要删 1 位 `4321,2341,4231` 很容就看出答案应该删除 4

周姓室友直觉很敏锐啊，如果当前处理的那一位前边有比它大的，大的就应该删除，很自然的想到看前边的状态就用栈。这个题就是单调栈（或者说是从前到后选的时候尽量选一些小的数字，比如 `2341` 选 4 不选 1）

还有一些细节

- 前导零，最开始做法是把 0 也压栈，最后一起处理，另一种是在循环时就处理（什么时候不能入栈呢，就是栈为空且当前处理为 0，反过来就是什么时候能入栈）
- 空间，开始是用 `anw= x+ anw` 然后 MLE 了，用 `anw += x` 加 `reverse` 就不会
- 可能没删除够，就弹栈


```cpp
// "primary"
class Solution {
public:
    string removeKdigits(string num, int k) {

        if (k >= num.size()) return "0";

        stack<char> st;
        int removedCnt = 0;
        for (char x: num) {
            while (!st.empty() && st.top() > x && removedCnt < k) {
                st.pop();
                removedCnt++;
            }
            st.push(x);
        }

        while (removedCnt < k) { // 防止没删除够
            st.pop();
            removedCnt++;
        }

        string anw;
        while (!st.empty()) {
            anw += st.top();
            st.pop();
        }

        std::reverse(anw.begin(), anw.end());

        int begin = 0; // 删除前导零
        while (begin < anw.size() && anw[begin] == '0') begin++;
        anw = anw.substr(begin);

        if (anw.empty() || anw[0] == '0') return "0";
        return anw;
    }
};
```

```cpp
// "better"
class Solution {
public:
    string removeKdigits(string num, int k) {

        if (k >= num.size()) return "0";

        stack<char> st;
        int removedCnt = 0;
        for (char x: num) {
            while (!st.empty() && st.top() > x && removedCnt < k) {
                st.pop();
                removedCnt++;
            }
            if (!st.empty() || x != '0')
                st.push(x);
        }

        while (removedCnt < k&&!st.empty()) {
            st.pop();
            removedCnt++;
        }

        string anw;
        while (!st.empty()) {
            anw += st.top();
            st.pop();
        }
        std::reverse(anw.begin(), anw.end());

        if (anw.empty()) return "0";
        return anw;
    }
};
```

## 437 路径总和

```cpp
class Solution {
public:
    unordered_map<long long, int> map;
    int anw = 0;

    int pathSum(TreeNode *root, int targetSum) {
        map[0] = 1;
        dfs(root, 0, targetSum);
        return anw;
    }

    void dfs(TreeNode *root, long long sum, int targetSum) {
        if (root == nullptr) return;
        
        sum += root->val;
        if (map.count(sum - targetSum))
            anw += map[sum - targetSum];
            
        map[sum]++;
        dfs(root->left, sum, targetSum);
        dfs(root->right, sum, targetSum);
        map[sum]--;

    }
};
```

## 438 找到字符串中所有字母异位词
滑动窗口

```cpp
class Solution {
public:
    map<char, int> cnt;
    map<char, int> should;

    bool check(const string& p) {
        for (auto item : should) {
            if (cnt[item.first] != item.second)
                return false;
        }
        return true;
    }

    vector<int> findAnagrams(string s, string p) {
        for (char x : p)
            should[x]++;

        vector<int> anw;
        int left, right;
        for (left = 0, right = 0; right < s.size(); right++) {
            cnt[s[right]]++;
            while (right - left + 1 > p.size()) { // 长度超了就缩小
                cnt[s[left]]--;
                left++;
            }
            if (right - left + 1 == p.size() && check(p)) { // 找到了答案
                anw.push_back(left);
                // 下边可有可无
                // cnt[s[left]]--;  
                // left++;
            }
        }
        return anw;
    }
};
```

## 543 二叉树的直径
后序遍历找到左子树的最大深度，右子树的最大深度，加起来就是当前节点为根的直径，有可能不经过根节点，所以用全局变量

```cpp
class Solution {
public:
    int anw = 0;
    int diameterOfBinaryTree(TreeNode* root) {
        if (root == nullptr) return 0;
        dfs(root);
        return anw;
    }

    int dfs(TreeNode* root) {
        if (root == nullptr) return 0;
        int left = dfs(root->left);
        int right = dfs(root->right);
        anw = max(anw, left + right);
        return max(left, right) + 1;
    }
};
```

## 560 和为 K 的子数组
开始以为是滑动窗口，但是带负数，做不出来，提示有前缀和，之后暴力找的

```cpp
class Solution {
public:
    int subarraySum(vector<int> &nums, int k) {

        vector<int> prefix(nums.size() , 0);
        prefix[0] = nums[0];
        for (int i = 1; i < prefix.size(); i++) {
            prefix[i] = prefix[i - 1] + nums[i];
        }

       int anw=0;
        for(int i=0;i<prefix.size();i++){
            if(prefix[i]==k) anw++;
            for(int r=i+1;r<prefix.size();r++){
                if(prefix[r]-prefix[i]==k) anw++;
            }
        }
        return anw;
    }
};
```

看了题解，前缀和加哈希表，每次相当于找 `prefix[j]-prefix[i]=k, j>i` 进行移项后 `prefix[j]-k=prefix[i], j>i` 可以看成两数之和那道题，非常的巧妙

为了解决 `prefix[j] = k` 的情况 ` eg: [1, 0] k = 1`，有两种方法

1. 上来就记录 `mp[0] = 1`
2. 循环内特判


```cpp
// "未优化"
class Solution {
public:
    int subarraySum(vector<int> &nums, int k) {

        vector<int> prefix(nums.size(), 0);
        prefix[0] = nums[0];
        for (int i = 1; i < prefix.size(); i++) {
            prefix[i] = prefix[i - 1] + nums[i];
        }
        unordered_map<int, int> mp;
        mp[0] = 1;
        int anw = 0;
        for (int i = 0; i < prefix.size(); i++) {
            if (mp.find(prefix[i] - k) != mp.end())
                anw += mp[prefix[i] - k];
            mp[prefix[i]]++;
        }
        return anw;
    }
};
```


```cpp
// "优化1"
class Solution {
public:
    int subarraySum(vector<int> &nums, int k) {
        int anw=0,sum=0;
        unordered_map<int,int>mp;
        mp[0]=1;
        for(int num:nums){
            sum+=num;
            if(mp.find(sum-k)!=mp.end())
                anw+=mp[sum-k];
            mp[sum]++;
        }
        return anw;
    }
};
```

```cpp
// "优化2"
class Solution {
public:
    int subarraySum(vector<int> &nums, int k) {
        int anw=0,sum=0;
        unordered_map<int,int>mp;
    //  mp[0]=1;  // 不进行 mp[0]=1 就特判
        for(int num:nums){
            sum+=num;
            if(sum==k) anw++;
            if(mp.find(sum-k)!=mp.end()) // 这行没有也行，因为没有的项结果为0
                anw+=mp[sum-k];
            mp[sum]++;
        }
        return anw;
    }
};
```

## 739 每日温度
2024-01-03 看到公众号发的，当时有个朦胧的思路，想到用单调栈，然后发现力扣曾经交过这个题，复习一下

开始是这么想的，用 `[1, 5, 4, 2, 7]` 试了一下，答案是 `[1, 3, 2, 1, 0]` ，从后往前来，（最后一个元素的答案一定是 0），7 先压栈，2 比 7 小，答案是 1，4 的下一个气温应该是 7，但是栈里现在有个 2 ，不是我们想要的就弹出，所以总结出，当前指向元素比栈顶小就入栈，比栈顶大就不断弹栈，如果等于栈顶呢，举个例子就好了 `[2, 2, 7]`，很容易就得出应该弹栈，因为我们找的是比当前元素大的气温。


```cpp
//  "倒序"
class Solution {
public:
    vector<int> dailyTemperatures(vector<int> &temperatures) {
        stack<int> st;
        int n = temperatures.size();
        vector<int> anw(n);

        for (int i = n - 1; i >= 0; i--) {
            while (!st.empty() && temperatures[i] >= temperatures[st.top()]) {
                st.pop();
            }
            if (!st.empty())
                anw[i] = st.top() - i;
            else anw[i] = 0;
            
            st.push(i);
        }
        return anw;
    }
};
```

然后看了一下答案，他是正序处理的，如果当前元素比栈顶大，说明应该用当前元素更新之前想要的答案，（就是找了高的气温），反之直接入栈


```cpp
//  "正序"
class Solution {
public:
    vector<int> dailyTemperatures(vector<int> &temperatures) {
        stack<int> st;
        int n = temperatures.size();
        vector<int> anw(n);

        for (int i = 0; i < n; i++) {
            while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
                int top = st.top();
                anw[top] = i - top;
                st.pop();
            }
            st.push(i);
        }
        return anw;
    }
};
```

事后想一想，其实都差不多，甚至正序更直观，符合题的操作说法。正序处理相当于是存已知的低温，用更高的气温更新过去。逆序相当于是存已知的高温，用低温去找高温。

[洛谷原题](https://www.luogu.com.cn/problem/P5788)第一个题解这么看更好理解

```txt
-------------`
     2  4  7 |
-------------          
```

做出来了，feel good🥰


## 784 字母大小写全排列
不能用每次都收集，因为没法区分 `ab pos=1` 和 `ab pos=2` ，导致重复收集

应该用下标超界做收集条件

位图做法，统计字母个数，总共有 `2^chars` 可能，遇到字符，看是纯字串的第 k 位，如果在 第 poss 个可能中第 k 位为 1，放大写；反之放小写

```cpp
//  "wrong"
class Solution {
public:
    vector<string> anw;
    vector<string> letterCasePermutation(string s) {
        dfs(0, s);
        return anw;
    }
    void dfs(int pos, string s) {
        if (pos == s.size())
            return;
        if (isdigit(s[pos])) {
            dfs(pos + 1, s);
            return;
        }
        else if (isupper(s[pos])) {
            anw.emplace_back(s);
            dfs(pos + 1, s);
            s[pos] = tolower(s[pos]);
            anw.emplace_back(s);
            dfs(pos + 1, s);
        }
        else {
            anw.emplace_back(s);
            dfs(pos + 1, s);
            s[pos] = toupper(s[pos]);
            anw.emplace_back(s);
            dfs(pos + 1, s);
        }
    }
};
```

```cpp
//  "正常思路"
class Solution {
    vector<string> ret;

    // 取不取引用都对
    void dfs(string & s, int pos) {
        while (pos < s.size() && isdigit(s[pos]))
            ++pos;
        if (pos >= s.size())
            return ret.push_back(s);

        if (islower(s[pos])) {
            dfs(s, pos + 1);

            s[pos] = toupper(s[pos]);
            dfs(s, pos + 1);
        }
        else {
            dfs(s, pos + 1);

            s[pos] = tolower(s[pos]);
            dfs(s, pos + 1);
        }
    }

public:
    vector<string> letterCasePermutation(string s) {
        dfs(s, 0);
        return ret;
    }
};
```


```cpp
//  "改进"
class Solution {
public:
    void dfs(string &s, int pos, vector<string> &res) {
        while (pos < s.size() && isdigit(s[pos])) {
            pos++;
        }
        if (pos == s.size()) {
            res.emplace_back(s);
            return;
        }
        dfs(s, pos + 1, res);
    // 65^32=97, 97^32=65 
    // a->A A->a
        s[pos] ^= 32;
        dfs(s, pos + 1, res);
    }

    vector<string> letterCasePermutation(string s) {
        vector<string> ans;
        dfs(s, 0, ans);
        return ans;
    }
};

```

```cpp
//  "位图"
class Solution {
public:
    vector<string> letterCasePermutation(string s) {
        vector<string> anw;
        int char_cnt = 0;
        for (char x : s)
            if (isalpha(x))
                char_cnt++;

        int total_possible = 1 << char_cnt;

        for (int poss = 0; poss < total_possible; poss++) {
            string tem;
            for (int si = 0, k_in_chars = 0; si < s.size(); si++) {
                if (isdigit(s[si]))
                    tem += s[si];
                else {
                    if (poss & (1 << k_in_chars++))
                        tem += toupper(s[si]);
                    else
                        tem += tolower(s[si]);
                }
            }
            anw.emplace_back(tem);
        }
        return anw;
    }
};
```

## 844 比较含退格的字符串
最直接的想法：模拟

```java
class Solution {

    public boolean backspaceCompare(String s, String t) {
        return getTrim(s).equals(getTrim(t));
    }

    private static String getTrim(String s) {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) != '#') {
                stringBuilder.append(s.charAt(i));
            } else {
                if (!stringBuilder.isEmpty())
                    stringBuilder.deleteCharAt(stringBuilder.length() - 1);
            }
        }
        return stringBuilder.toString();
    }
}
```

联动 移动0 那个题，把关键的内容提出来

```java
class Solution {
    public boolean backspaceCompare(String s, String t) {
        return changeString(s).equals(changeString(t));
    }

    public static String changeString(String str) {
        char[] x = str.toCharArray();
        int slow = 0;
        for (int fast = 0; fast < x.length; fast++) {
            if (x[fast] != '#')
                x[slow++] = x[fast];
            else {
                if (slow > 0)
                    slow--;
            }
        }

        return String.valueOf(x, 0, slow);

    }
}
```

从后往前看。删除对字符串后面的字符就不起作用了，每次找到要比较的字符

关键是**或**条件：因为可能有一个跑完了，但是另一个是 `x#` 这种，所以不能是与条件

```java
public class Solution {
    public static void main(String[] args) {
        Solution solution = new Solution();
        solution.test();
    }

    void test() {
        String s = "nzp#o#g";
        String t = "b#nzp#o#g";
        // after compare char n ,si = -1 and ti = 1 so use or condition
        System.out.println(this.backspaceCompare(s, t));
    }

    public boolean backspaceCompare(String s, String t) {

        int sCnt = 0, tCnt = 0;
        int si = s.length() - 1, ti = t.length() - 1;
        while (si >= 0 && ti >= 0) {
            while (si >= 0) {
                if (s.charAt(si) == '#') {
                    sCnt++;
                    si--;
                } else if (sCnt > 0) {
                    sCnt--;
                    si--;
                } else {
                    break;
                }
            }
            while (ti >= 0) {
                if (t.charAt(ti) == '#') {
                    tCnt++;
                    ti--;
                } else if (tCnt > 0) {
                    tCnt--;
                    ti--;
                } else {
                    break;
                }
            }
            if (si >= 0 && ti >= 0) {
                if (s.charAt(si) != t.charAt(ti)) {
                    return false;
                }
                si--;
                ti--;
            } else {
                if (si >= 0 || ti >= 0) return false;
            }

        }
        System.out.println("si: " + si);
        System.out.println("ti: " + ti);
        return true;
    }
}
```

## 890 查找和替换模式
题非常好地给出提示：是双射关系，不能 `f(a) = 1 f(a) = 2` 同时存在，只能是`f(a) = 1 f(1) = a`同时成立

可以列出表格

| a->1 | 1->a | null 不存在哈希映射 |
| ---- | ---- | -------- |
| null | null | add      |
| null | yes  | err      |
| null | no   | err      |
| yes  | null | err      |
| no   | null | err      |
| yes  | no   | err      |
| no   | yes  | err      |
| no   | no   | err      |
| yes  | yes  | continue |


```java
import java.util.*;

class Solution {
    public List<String> findAndReplacePattern(String[] words, String pattern) {
        int[] word2pattern = new int[26];
        int[] pattern2word = new int[26];
        List<String> anw = new ArrayList<String>();
        for (String word : words) {
            Arrays.fill(word2pattern, -1);
            Arrays.fill(pattern2word, -1);
            boolean ok = true;
            for (int i = 0; ok && i < word.length(); i++) {
                int w = word.charAt(i) - 'a';
                int p = pattern.charAt(i) - 'a';
                if (pattern2word[p] == -1 && word2pattern[w] == -1) {
                    pattern2word[p] = w;
                    word2pattern[w] = p;
                } else if (pattern2word[p] == w && word2pattern[w] == p) continue;
                else ok = false;
            }
            if (ok) anw.add(word);
        }
        return anw;
    }
}
```

然后发现表格中间可以合并成 `pattern2word[p] != w`，因为不存在的 -1 刚好也能用，避免了空异常

```java
import java.util.*;

class Solution {
    public List<String> findAndReplacePattern(String[] words, String pattern) {
        int[] word2pattern = new int[26];
        int[] pattern2word = new int[26];
        List<String> anw = new ArrayList<String>();
        for (String word : words) {
            Arrays.fill(word2pattern, -1);
            Arrays.fill(pattern2word, -1);
            boolean ok = true;
            for (int i = 0; ok && i < word.length(); i++) {
                int w = word.charAt(i) - 'a';
                int p = pattern.charAt(i) - 'a';
                if (pattern2word[p] == -1 && word2pattern[w] == -1) {
                    pattern2word[p] = w;
                    word2pattern[w] = p;
                } else if (pattern2word[p] != w)
                    ok = false;
            }
            if (ok) anw.add(word);
        }
        return anw;
    }
}
```

第二种方法就是官方做两次检查

```java
class Solution {
    public List<String> findAndReplacePattern(String[] words, String pattern) {
        List<String> ans = new ArrayList<String>();
        for (String word : words) {
            if (match(word, pattern) && match(pattern, word)) {
                ans.add(word);
            }
        }
        return ans;
    }

    public boolean match(String word, String pattern) {
        Map<Character, Character> map = new HashMap<Character, Character>();
        for (int i = 0; i < word.length(); ++i) {
            char x = word.charAt(i), y = pattern.charAt(i);
            if (!map.containsKey(x)) {
                map.put(x, y);
            } else if (map.get(x) != y) { 
                return false;
            }
        }
        return true;
    }
}
```

## 904 水果成篮
就是找一段区间尽可能长，区间内只有两种元素

用滑动窗口，不能用变量存值去删除，原因下边 java

```java
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import static java.lang.Integer.max;

class Solution {
    public static void main(String[] args) {
        Solution solution = new Solution();

        int[] nums = {3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4};
        System.out.println(solution.totalFruit(nums));
    }

    private int totalFruit(int[] nums) {
        int left = 0, right = 0;
        int anw = 0;
        HashMap<Integer, Integer> cnt = new HashMap<>();
        for (; right < nums.length; right++) {
            cnt.put(nums[right], cnt.getOrDefault(nums[right], 0) + 1);
            while (cnt.size() > 2) {
                cnt.put(nums[left], cnt.getOrDefault(nums[left], 0) - 1);
                if (cnt.get(nums[left]) == 0) cnt.remove(nums[left]);
                left++;
            }
            anw = max(anw, right - left + 1);
        }
        return anw;
    }

    public int totalFruitFailed(int[] nums) {
        // failed on 1,2,1,1,2 because only remove the first 1, not remove later of 1
        int left = 0, right = 0;
        HashSet<Integer> types = new HashSet<>();
        int maxLen = 0;
        for (; right < nums.length; right++) {
            types.add(nums[right]);
            while (types.size() > 2) {
                maxLen = max(maxLen, right - left);
                int removeVal = nums[left];
                types.remove(nums[left]);
                while (nums[left] == removeVal && left < right) left++;
            }
        }
        return maxLen;
    }
}
```

```cpp
class Solution {
public:
    int totalFruit(vector<int> &fruits) {

        int anw = 0;
        unordered_map<int, int> pick;

        for (int left = 0, right = 0; right < fruits.size(); right++) {
            pick[fruits[right]]++;

            while (pick.size() > 2) {
                pick[fruits[left]]--;
                if (pick[fruits[left]] == 0) pick.erase(fruits[left]);
                left++;
            }

            anw = max(anw, right - left + 1);
        }
        return anw;
    }
};
```

不太好的想法：最开始用两个桶，有空桶就放到里面，没有空桶且当前值不在桶里，更新一个桶，问题在于哪个：最近上一次访问的水果种类的桶是不能更新的

这个不好在于更新 left 是反复往左的，比较慢

```cpp
class Solution {
public:
    int totalFruit(vector<int> &fruits) {

        int anw = 0;
        int res = 0;
        int pick[2] = {-1, -1};
        for (int left = 0, right = 0; right < fruits.size(); right++) {
            if (pick[0] == -1) {
                pick[0] = fruits[right];
                res++;
            }
            else if (pick[1] == -1) {
                pick[1] = fruits[right];
                res++;
            }
            else if (pick[0] == fruits[right] || pick[1] == fruits[right]) res++;
            else {
                anw = max(anw, res);
                left = right - 1;
                while (left > 0 && fruits[left] == fruits[left - 1]) left--;
                res = right - left + 1;
                if (pick[0] != fruits[right-1]) pick[0] = fruits[right];
                else pick[1] = fruits[right];
            }
        }
        anw= max(anw,res);
        return anw;
    }
};
```

## 977 有序数组平方
直观做法：先找第一个大于等于 0 的数，然后往两边选

巧妙做法：两边开选，选较大的放在答案最后


```java
//  "直观"
import static java.lang.Math.*;

class Solution {
    public int[] sortedSquares(int[] nums) {

        int rightPoint = bsearch(nums);
        int leftPoint = rightPoint - 1;
        int[] anw = new int[nums.length];
        for (int i = 0; i < nums.length; i++) {
            int leftval = Integer.MAX_VALUE;
            int rightval = Integer.MAX_VALUE;
            if (leftPoint >= 0) {
                leftval = nums[leftPoint] * nums[leftPoint];
            }
            if (rightPoint < nums.length) {
                rightval = nums[rightPoint] * nums[rightPoint];
            }
        //  System.out.println(leftval + "--" + rightval);
            if (leftval < rightval) {
                anw[i] = leftval;
                leftPoint--;
            } else {
                anw[i] = rightval;
                rightPoint++;
            }
        }
        return anw;
    }

    private int bsearch(int[] nums) {
        int left = 0, right = nums.length;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] >= 0) right = mid;
            else left = mid + 1;
        }
        return left;
    }
}
```

```java
//   "巧妙"
import static java.lang.Math.*;

class Solution {
    public int[] sortedSquares(int[] nums) {
        int left = 0, right = nums.length - 1;
        int[] anw = new int[nums.length];
        for (int i = nums.length - 1; i >= 0; i--) {
            int leftval = nums[left] * nums[left];
            int rightval = nums[right] * nums[right];
            if (leftval > rightval) {
                anw[i] = leftval;
                left++;
            } else {
                anw[i] = rightval;
                right--;
            }
        }
        return anw;
    }
}
```

## 1475 商品折扣后最终价格
这个题和 739 是一个类型，假设 `[4,8,3,7]`，可以用 3 更新前边的 4，8，也就是当前的值比前边的小，就出栈之前内容并更新。

完全可以先复制一份一模一样的，更新的话能更新好之前的。不能更新的也是本身。要不然就是最后再全部出栈

```cpp
class Solution {
public:
    vector<int> finalPrices(vector<int> &prices) {
        vector<int> anw=prices; // 复制构造函数
        stack<int> st;
        for (int i = 0; i < prices.size(); i++) {
            while (!st.empty() && prices[i] <= prices[st.top()]) {
                int pre_anw_index = st.top();
                st.pop();
                anw[pre_anw_index] = prices[pre_anw_index] - prices[i];
            }
            st.push(i);
        }
      
        return anw;
    }
};
```


```cpp
//  "全部出栈"
class Solution {
public:
    vector<int> finalPrices(vector<int> &prices) {
        vector<int> anw(prices.size(), 0);
        stack<int> st;
        for (int i = 0; i < prices.size(); i++) {
            while (!st.empty() && prices[i] <= prices[st.top()]) {
                int pre_anw_index = st.top();
                st.pop();
                anw[pre_anw_index] = prices[pre_anw_index] - prices[i];
            }
            st.push(i);
        }
        while (!st.empty()) {
            int pre_anw_index = st.top();
            st.pop();
            anw[pre_anw_index] = prices[pre_anw_index];
        }
        return anw;
    }
};
```


## 763 划分字母区间
最开始没什么想法，然后仔细读题，发现相同字母都在一个区间，然后连了一下同一个字母的最前和最后，发现可以看成合并区间那道题

```cpp
class Solution {
public:

    unordered_map<char, pair<int, int>> dic;

    bool canMerge(pair<int, int> a, pair<int, int> b) {
        if (a.first > b.second || a.second < b.first)
            return false;
        else return true;
    }

    vector<int> partitionLabels(string s) {
        int sz = s.size();
        for (int i = 0; i < sz; ++i) {
            if (dic.count(s[i])) {
                dic[s[i]].first = min(dic[s[i]].first, i);
                dic[s[i]].second = max(dic[s[i]].second, i);
            }
            else {
                dic[s[i]] = {i, i};
            }
        }

        vector<int> anw;
        pair<int, int> broder = {0, 0};

        for (char x: s) {
            if (canMerge(dic[x], broder)) {
                broder.first = min(broder.first, dic[x].first);
                broder.second = max(broder.second, dic[x].second);
            }
            else {
                anw.push_back(broder.second - broder.first + 1);
                broder = dic[x];
            }
        }
        // don't forget push the last border
        anw.push_back(broder.second-broder.first+1);
        return anw;
    }
};
```

过了之后发现时间有点落后，看题解，说的是如果 **i == 当前字母出现的最远位置**，说明找到一个区间，![题解图片](https://pic.leetcode.cn/1683277847-xxagyB-image.png)

```cpp
class Solution {
public:
    vector<int> partitionLabels(string s) {
        unordered_map<char, int> dic;
        int sz = s.size();
        for (int i = 0; i < sz; ++i) {
            dic[s[i]] = max(dic[s[i]], i);
        }

        int left = 0, right = 0;
        vector<int> anw;
        for (int i = 0; i < sz; ++i) {
            right = max(right, dic[s[i]]);
            if (i == right) {
                anw.push_back(right - left + 1);
                left = i + 1;
            }
        }
        return anw;
    }
};
```

## 1658 将 x 减到 0 的最小操作数
反转问题，相当于找一段长度尽可能大的连续子数组，`子数组之和等于整个数组和 - x`

```cpp
class Solution {
public:
    int minOperations(vector<int> &nums, int x) {

        int anw = nums.size()+1; // 防止答案是整个数组

        int total_sum = 0;
        for (const int &num: nums) total_sum += num;
        int target = total_sum - x;
        if(target<0) return -1;

        int window_sum = 0;
        for (int left = 0, right = 0; right < nums.size(); right++) {
            window_sum += nums[right];

            if (window_sum < target) continue;
            while (window_sum > target) {
                window_sum -= nums[left];
                left++;
            }
            if (window_sum == target) {
                anw = min(anw, int(nums.size() - (right - left + 1)));
            }
        }
        if (anw == nums.size()+1) return -1;
        else return anw;
    }
};
```

## 1953 工作最大周数
好比插空，最大值 max_element,剩下的为 rest。

- 如果 `rest <= max_element - 1` 合法的有 `2*rest+1`
- 如果 `rest > max_element - 1` 说明都能完成，因为假如先从大到小排序，从前到后插空都能插进去。`eg: [5, 4, 3]`

```cpp
class Solution {
public:
    long long numberOfWeeks(vector<int> &milestones) {
        long long max_ele= *std::max_element(milestones.begin(), milestones.end());
        long long rest=0;
        for(int x:milestones) rest+=x;
        rest-=max_ele;
        if(rest<=max_ele-1) return 2 * rest + 1;
        else return max_ele + rest;
    }
};
```

## 2335 装满杯子
正确方法是每次取剩余水最多的两个，直到只剩一杯水

```cpp
class Solution {
public:
    int fillCups(vector<int>& amount) {
        sort(amount.begin(),amount.end());
        if(amount[1]==0) return amount[2];
        amount[1]--;amount[2]--;
        return 1+fillCups(amount);
    }
};
```

直接算：从小到大排序为 a, b, c

- `c >= a + b` 结果为 c
- `c < a + b` ，多出来的为 deta
    - 如果 deta 为偶数，经过 `deta/2` 次后， `a'+b' = c`，结果为 `deta/2 + c`。
    - 如果 deta 为奇数，操作 `(deta-1)/2` 次后，`a'+ b'= c + 1` 结果为 `(deta-1)/2 + c + 1`

```cpp
class Solution {
public:
    int fillCups(vector<int>& amount) {
        sort(amount.begin(), amount.end());
        int a = amount[0], b = amount[1], c = amount[2];
        if (c >= a + b)
            return c;
        else
            return (a + b - c + 1) / 2 + c;
    }
};
```

## 最长连续公共子序列
[题目](https://www.acwing.com/problem/content/description/3695/)

成功字母个数和尝试长度不能只用一个变量表示两件事，不然用 substr 就很难受，比如 a.sub(ia,try)=b.sub(ib,try) 如果 try++，取答案长度就得 try-1。但是这样有时候是错的。


```cpp
//  "slove"
#include <string>
#include <iostream>
using namespace std;

int main() {
    string a, b;
    cin >> a >> b;
    string anw;
    
    // solution 1
    // int minlen = min(a.size(), b.size());
    // for (int trylen = 0; trylen <= minlen; trylen++)
    //     for (int ia = 0; ia + trylen <= a.size(); ia++)
    //         for (int ib = 0; ib + trylen < b.size(); ib++) {
    //             if (a.substr(ia, trylen) == b.substr(ib, trylen)) {
    //                 if (trylen >= anw.size())
    //                     anw = a.substr(ia, trylen);
    //             }
    //         }

    // solution 2 better
    for (int ia = 0; ia < a.size(); ia++) {
        for (int ib = 0; ib < b.size(); ib++) {
            int succ = 0;
            for (int trylen = 0; ia + trylen < a.size() && ib + trylen < b.size(); trylen++) {
                if (a[ia + trylen] == b[ib + trylen]) {
                    succ++;
                }
                else
                    break;
            }
            if (succ >= anw.size())
                anw = a.substr(ia, succ);
        }
    }
    cout << anw.size() << '\n';
    cout << anw;

    return 0;
}
```

## 第K大的数

[链接](https://leetcode.cn/problems/kth-largest-element-in-an-array/description/)

- 想要达到 $O(n)$ 时间，就得从快排变形。
- 第K大的数正好是下标为size-k
- 一次快排相当于把一个数放到对应位置，那就找哪一次放好了的下标正好是要求的
> 没做出来时痛苦万分，~~~抄完了~~~ 学会了之后觉得就应该这么写😥

```C++
//  slove
class Solution {
public:
int findKthLargest(vector<int> &nums, int k) {
    return quicksort(nums,0,nums.size()-1,nums.size()-k);
}

int quicksort(vector<int> &nums, int l, int r, int k) {
    if (l == r) return nums[k];
    int i = l - 1, j = r + 1, mid = nums[l + r >> 1];
    while (i < j) {
        do i++; while (nums[i] < mid);
        do j--; while (nums[j] > mid);
        if (i < j) swap(nums[i], nums[j]);
    }
    if (k <= j) return quicksort(nums, l, j, k);
    else return quicksort(nums, j + 1, r, k);
}
};
```

从这个题谈开，假如要找[第K小的数](https://www.acwing.com/problem/content/description/788/)可以说每次快排结束能获得左边≤a[j]的结果，右边大于等于a[j+1]的结果，问题在于是怎么判断下一次的区间（我个人觉得看成下标好理解）

k看成长度，比较到lo的距离

```cpp
if (j - lo + 1 >= k)
    return wqsort(a, lo, j, k);
else
    return wqsort(a, j + 1, hi, k - (j + 1 - lo));
```

k看成下标

```cpp
if (k<=j)
    return wqsort(a, lo, j, k);
else
    return wqsort(a, j + 1, hi, k);
```


```cpp
//  "下标"
#include <iostream>

using namespace std;
const int N = 100010;

int wqsort(int a[], int lo, int hi, int k) {
    if (lo >= hi)
        return a[k];//a[lo] also OK

    int i = lo - 1, j = hi + 1, mid = a[lo + hi >> 1];
    while (i < j) {
        do
            i++;
        while (a[i] < mid);
        do
            j--;
        while (a[j] > mid);
        if (i < j)
            swap(a[i], a[j]);
    }
    if (k <= j)
        return wqsort(a, lo, j, k);
    else
        return wqsort(a, j + 1, hi, k);
}

int main() {
    int n;
    cin >> n;
    int k;
    cin >> k;
    int a[N];
    for (int i = 0; i < n; i++)
        cin >> a[i];
    cout << wqsort(a, 0, n - 1, k - 1);//转成下标
    return 0;
}
```

```cpp
//  "长度"
#include <iostream>

using namespace std;
const int N = 100010;

int wqsort(int a[], int lo, int hi, int k) {
    if (lo >= hi)
        return a[lo];

    int i = lo - 1, j = hi + 1, mid = a[lo + hi >> 1];
    while (i < j) {
        do
            i++;
        while (a[i] < mid);
        do
            j--;
        while (a[j] > mid);
        if (i < j)
            swap(a[i], a[j]);
    }
    if (j - lo + 1 >= k)
        return wqsort(a, lo, j, k);
    else
        return wqsort(a, j + 1, hi, k - (j + 1 - lo));
}

int main() {
    int n;
    cin >> n;
    int k;
    cin >> k;
    int a[N];
    for (int i = 0; i < n; i++)
        cin >> a[i];
    cout << wqsort(a, 0, n - 1, k);
    return 0;
}
```

## 两个有序数组第K大元素
这里指的是排列好后，下标为`k-1`的元素，不是去重后的第K大

1. 最基础的：两个数组合并到一个大数组，排序，返回即可
2. 改进一点：不用开太多的空间，用两个指针分别指向起始位置，移动就加一，一直加到等于K

```cpp
//  "双指针"
int kthElement(vector<int> arr1, vector<int> arr2, int array1len, int array2len, int k) {
    int l1 = 0, l2 = 0;
    int cnt = 0;
    int tem = 0;
    while (l1 < array1len && l2 < array2len) {
        if (arr1[l1] < arr2[l2]) {
            tem = arr1[l1];
            l1++;
        }
        else {
            tem = arr2[l2];
            l2++;
        }
        cnt++;
        if (cnt == k) return tem;
    }
    while (cnt < k && l1 < array1len) {
        tem = arr1[l1++];
        cnt++;
    }
    while (cnt < k && l2 < array2len) {
        tem = arr2[l2++];
        cnt++;
    }
    if (cnt == k)return tem;
    return -1;
}

```

**最优版**：可以发现这么一个规律 `l1 <= r2, l2 <= r1`

![cut](https://lh3.googleusercontent.com/3kUSML0zVJzEHWT5LVrLWWuzEJPyedVbFX0ykHI08Q9IzP8lon0Sl5m-qwj2b9Y8X9yCp6fbc8aSxb-3tmM7FmYPt8Q35FWlC3RK8adqo8ArIiH3oR19BqCSTvCDkC1Ujr-ap6cC)

只要找到符合上边条件并且元素个数正好为 K 的情况， `max(l1,l2)` 就是答案

- 假定 `arr1len <= arr2len` ，用二分确定从 arr1 取几个元素(arr2 取 `k- cut1` 个)

假如 `arr1len = 5, arr2len = 7`, `lo` 是 arr1 最少取的个数， `hi` 是最多取的个数

```txt
k = 3, lo = 0, hi = 3
k = 6, lo = 0, hi = 5
k = 11, lo = 4, hi = 5
```

arr1 取几个元素和 arr2len 有关，arr1最少取 `max(0, k-arr2len)`， arr1最多取 `min(k, arr1len)` 个

- 假如 arr1 取了0个元素，那么为了方便判断， `l1=INT_MIN`
- 假如 arr1 取了 arr1len 个元素，那么为了方便判断， `l1=INT_MAX`

```cpp
int kthElement(vector<int> &arr1, vector<int> &arr2, int arr1len, int arr2len, int k) {
    if (arr1len > arr2len) {
        return kthElement(arr2, arr1, arr2len, arr1len, k);
    }
    int lo = max(0, k - arr2len), hi = min(k, arr1len);
    while (lo <= hi) {
        int cut1 = lo + hi >> 1;
        int cut2 = k - cut1;
        int l1 = cut1 == 0 ? INT_MIN : arr1[cut1 - 1];
        int l2 = cut2 == 0 ? INT_MIN : arr2[cut2 - 1];
        int r1 = cut1 == arr1len ? INT_MAX : arr1[cut1];
        int r2 = cut2 == arr2len ? INT_MAX : arr2[cut2];

        if (l1 <= r2 && l2 <= r1) {
            return max(l1, l2);
        }
        else if (l1 > r2)
            hi = cut1 - 1;
        else lo = cut1 + 1;
    }
    return 1;
}
```

如果没有理解，可以参考以下资料，视频讲的比较清楚

- [印度老哥的视频讲解](https://takeuforward.org/data-structure/k-th-element-of-two-sorted-arrays/#google_vignette)
- [有关cut的讲解](https://blog.csdn.net/hk2291976/article/details/51107778?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-51107778-blog-119826156.235%5Ev40%5Epc_relevant_3m_sort_dl_base4&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-51107778-blog-119826156.235%5Ev40%5Epc_relevant_3m_sort_dl_base4&utm_relevant_index=2)

## 环形链表2

[题目链接](https://leetcode.cn/problems/linked-list-cycle-ii/description/)

[完整版题解](https://leetcode.cn/problems/linked-list-cycle-ii/solutions/12616/linked-list-cycle-ii-kuai-man-zhi-zhen-shuang-zhi-/)

- 设有a个节点（不含环的起点），环内有b个节点
- 当第一次相遇时，

$$
\begin{aligned}
fast &=2*low \\
fast &=low+n*b \\
fast &=2nb \\
low  &=nb 
\end{aligned}
$$


- 所有从头开始走到环的起点都是 $a+Nb步$
- 所以low再走a步就到起点，那么让快指针重新指向头，一次一步走a步，两者就会重合

```C++
//  solve
class Solution {
public:
ListNode *detectCycle(ListNode *head) {
    ListNode *low = head;
    ListNode *fast = head;
    bool ff = false;
    while (fast != nullptr && fast->next != nullptr) {
        fast = fast->next->next;
        low = low->next;
        if (fast == low) {
            ff = true;
            break;
        }
    }
    if (ff) {
        fast=head;
        while (fast!=low){
            fast=fast->next;
            low=low->next;
        }
        return low;
    }
    return nullptr;

}
};
```

## 最短无序连续子数组
**双指针**

- 找出升序，降序的区间，中间就是无序。
- 希望中间的值 `x>Lmax&&x<Rmin` ，反过来说，当 `x<Lmax||x>Rmin` 就应该调整左右端点
- 细节部分
- 为了方便调整到数组开始和结尾，用1e5+10和-1e5-10进行设置
- 为什么无序区间的数字开始从**L**找？如果从**L+1**开始，反例是 `1, 3, 2, 2, 2`

```cpp
// "双指针"
class Solution {
public:
    int findUnsortedSubarray(vector<int> &nums) {
        if (nums.size() == 1) return 0;

        int l = 0, r = nums.size() - 1;
        while (l < r && nums[l] <= nums[l + 1]) l++;
        while (l < r && nums[r] >= nums[r - 1]) r--;

        int lmaxval = nums[l], rminval = nums[r];
        if (l == r) return 0;

        int i = l + 1;
        for (int k = l ; k < r; ++k) {
            if (nums[k] < lmaxval) {
                while (l >= 0 && nums[k] < lmaxval) {
                    l--;
                    if (l < 0) lmaxval = -1e5 - 10;
                    else lmaxval = nums[l];
                }
            
            }
            if (nums[k] > rminval) {
                while (r < nums.size() && nums[k] > rminval) {
                    r++;
                    if (r >= nums.size())
                        rminval = 1e5 + 10;
                    else rminval = nums[r];
                }
            
            }
        }

        return r - l - 1;
    }
};
```

**一次遍历** [传送门](https://leetcode.cn/problems/shortest-unsorted-continuous-subarray/solutions/422614/si-lu-qing-xi-ming-liao-kan-bu-dong-bu-cun-zai-de-/comments/1194164)

先只考虑中段数组，设其左边界为L，右边界为R：

`nums[R]` 不可能是 `[L，R]` 中的最大值（否则应该将 `nums[R]` 并入右端数组）

`nums[L]` 不可能是`[L,R]`中的最小值（否则应该将 `nums[L]` 并入左端数组）

很明显:

 `[L,R]` 中的最大值 等于 `[0，R]` 中的最大值，设其为 max

 `[L,R]` 中的最小值 等于 `[L， nums.length-1]`中的最小值，设其为 min

那么有：

`nums[R] < max < nums[R+1] < nums[R+2] < ...`  所以说，从左往右遍历，最后一个小于max的为右边界

`nums[L] > min > nums[L-1] > nums[L-2] > ... ` 所以说，从右往左遍历，最后一个大于min的为左边界

```cpp
//  "一次遍历"
class Solution {
public:
    int findUnsortedSubarray(vector<int> &nums) {


        int min = nums[nums.size() - 1], max = nums[0];
        int end = -1, begin = 0;
        //end和begin的初值不重要，让end-bigin+1=0即可
        for (int i = 0; i < nums.size(); ++i) {
            if (nums[i] < max)
                end = i;
            else max = nums[i];

            if (nums[nums.size() - 1 - i] > min)
                begin = nums.size() - 1 - i;
            else min = nums[nums.size() - 1 - i];
        }
        return end - begin + 1;
    }
};
```


## 最长上升子序列
1. dp $O(n^2)$ , `dp[i]=max(dp[i],dp[j]+1) when a[i]>a[j],`
2. dp+贪心，每次找 `x<=anw[i]`的左端点更新
3. 记忆化搜索


```cpp
//  "dp On2"
#include "bits/stdc++.h"

using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];
    vector<int> dp(n, 1);
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (a[i] > a[j])
                dp[i] = max(dp[i], dp[j] + 1);
        }
    }
    cout << *max_element(dp.begin(), dp.end());
    return 0;
}
```

```cpp
// "dp+贪心"
#include "bits/stdc++.h"

using namespace std;

void check(int x, vector<int> &anw) {
    int l = 0, r = anw.size() - 1;
    while (l < r) {
        int mid = l+r>>1;
        if (anw[mid] <x)l = mid+1;
        else r = mid;
    }

    anw[r] = x;
}

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];
    vector<int> anw;
    anw.push_back(a[0]);
    for (int i = 1; i < n; i++) {
        if (anw[anw.size() - 1] < a[i])
            anw.push_back(a[i]);
        else check(a[i], anw);
    }
    cout << anw.size();
    return 0;
}
```

## 数组中的逆序对

- 归并排序，注意循环的边界是 `l r`不是 **0**
- 套模板会空间多一点但是直观，优化一下相当于不停在求子问题


```cpp
// "开空间较多"
class Solution {
public:
int inversePairs(vector<int> &nums) {
    if(nums.size()==0) return 0;
    int anw = mergesort(nums, 0, nums.size() - 1);
    return anw;
}

int mergesort(vector<int> &nums, int l, int r) {
    if (l == r) return 0;
    int mid = l + r >> 1;
    int cnt = 0;
    cnt += mergesort(nums, l, mid);
    cnt += mergesort(nums, mid + 1, r);

    int m = mid, n = r, id = r;
    
    vector<int> anw(nums.size());
    
    while (m >= l && n > mid) {
        if (nums[n] >= nums[m]) anw[id--] = nums[n--];
        else cnt+=n-mid, anw[id--] = nums[m--];
    }
    while (m >= l) anw[id--] = nums[m--];
    while (n > mid)anw[id--] = nums[n--];
    
    id = l;
    while (id <= r)
        nums[id] = anw[id], id++;
        
    return cnt;
}
};
```


```cpp
// "On空间"
class Solution {
public:
int inversePairs(vector<int> &nums) {
    if (nums.size() == 0) return 0;
    vector<int> tem = nums;
    int anw = mergesort(nums, 0, nums.size() - 1, tem);
    return anw;
}

int mergesort(vector<int> &nums, int l, int r, vector<int> &tem) {
    if (l == r) {
        tem[l] = nums[l];
        return 0;
    }
    int mid = l + r >> 1;
    int cnt = 0;
    cnt += mergesort(tem, l, mid, nums);
    cnt += mergesort(tem, mid + 1, r, nums);

    int m = mid, n = r, id = r;
    while (m >= l && n >= mid+1) {
        if(nums[m]>nums[n]) {
            tem[id--]=nums[m--];
            cnt+=n-mid;
        }
        else tem[id--]=nums[n--];
    }
    while (m >= l) tem[id--] = nums[m--];
    while (n > mid)tem[id--] = nums[n--];

    return cnt;
}
};
```

## 编辑距离
[题解](https://leetcode.cn/problems/edit-distance/solutions/2468072/dai-ma-sui-xiang-lu-72-bian-ji-ju-chi-by-or3j/)

可以优化成O(M)


```cpp
//  "slove"
class Solution {
public:
    void printmarix(vector<int> source) {
        for (auto x : source)
            cout << x << ' ';
        cout << endl;
    }

    void printVect(vector<vector<int>> dp) {
        for (auto x : dp) {
            for (auto y : x)
                cout << y << ' ';
            cout << endl;
        }
    }

    int minDistance(string source, string dest) {
        vector<int> dp(dest.size() + 1, 0);


        for (int i = 0; i <= dest.size(); i++)
            dp[i] = i;

        for (int i = 1; i <= source.size(); i++) {
            int tem = dp[0];
            dp[0] = i;
            for (int j = 1; j <= dest.size(); j++) {
                int pre_dp_j = dp[j];
                if (source[i - 1] == dest[j - 1])
                    dp[j] = tem;
                else
                    dp[j] = min(tem, min(dp[j - 1], dp[j])) + 1;

                tem = pre_dp_j;
            }
            //  printmarix(dp);
        }
        return dp[dest.size()];
    }

    int minDistance_corr(string source, string dest) {
        vector<vector<int>> dp(source.size() + 1, vector<int>(dest.size() + 1, 0));

        for (int i = 0; i <= source.size(); i++)
            dp[i][0] = i;
        for (int i = 0; i <= dest.size(); i++)
            dp[0][i] = i;

        for (int i = 1; i <= source.size(); i++)
            for (int j = 1; j <= dest.size(); j++) {
                if (source[i - 1] == dest[j - 1])
                    dp[i][j] = dp[i - 1][j - 1];
                else
                    dp[i][j] = min(min(dp[i - 1][j - 1], dp[i - 1][j]), dp[i][j - 1]) + 1;
            }
        //  printVect(dp);
        return dp[source.size()][dest.size()];
    }
};

```


## Decimal dominants
Given an array with n keys, design an algorithm to find all values that occur more than  n/10 times. The expected running time of your algorithm should be linear. [题解](https://www.cnblogs.com/evasean/p/7273857.html) 这个让我联想到莫尔投票法的一个题[力扣169](https://leetcode.cn/problems/majority-element/description/)

two sum with link node


```cpp
//  "solve"
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode* head = new ListNode(0);
        ListNode* tem = head;
        int adding = 0;
        while (l1 || l2) {
            int x = 0, y = 0;
            if (l1) x = l1->val;
            if (l2) y = l2->val;
            int sum = (x + y + adding) % 10;
            adding = (x + y + adding) / 10;
            ListNode* ne = new ListNode(sum);
            tem->next = ne;
            tem = tem->next;
            if (l1)
                l1 = l1->next;
            if (l2)
                l2 = l2->next;
        }
        if (adding) {
            ListNode* ne = new ListNode(adding);
            tem->next = ne;
        }
        tem = head->next;
        delete head;
        return tem;
    }
};
```

## 75 颜色分类


```cpp
// "dutchFlag"
class Solution {
public:
    void sortColors(vector<int> &nums) {
        // num 0 is red, 1 is white, 2 is blue
        int red = 0, white = 0, blue = nums.size() - 1;
        while (white <= blue) {
            if (nums[white] == 0) {
                swap(nums[white], nums[red]);
                red++;
                white++; // white red 都指向0，两者互换后都前进
            }
            else if (nums[white] == 2) {
                swap(nums[white], nums[blue]);
                blue--;
            }
            else white++;
        }
    }
};
```


```cpp
// "刷油漆"
class Solution {
public:
void sortColors(vector<int> &nums) {
    int l0 = 0, l1 = 0;
    for (int i = 0; i < nums.size(); i++) {
        int value = nums[i];
        nums[i] = 2;
        if (value <= 1) nums[l1++] = 1;
        if (value == 0) nums[l0++] = 0;
    }
}
};
```

The Dutch national flag. [wikipedia](https://en.wikipedia.org/wiki/Dutch_national_flag_problem)

sort an array of some 0,1,2 in O(n) 

- [0, i-1] < midElement
- [i, j-1] = midElement
- [j, k] unsorted
- [k+1, end] >midElement

```cpp
void dutchFlag(vector<int>&todo){
int N=todo.size();
int low=0,mid=0,high=N-1;
while (mid<=high){
    if(todo[mid]==0){
        swap(todo[low],todo[mid]);
        low++;
        mid++;
    }
    else if(todo[mid]==2){
        swap(todo[mid],todo[high]);
        high--;
    }
    else mid++;
}
}
```


## Merging with smaller auxiliary array
given an array[2n], which is sorted from a[0] to a[n], and sorted from a[n+1] to a[2n]. you need to sort the entire array with O(n) space

solve:
1. copy the first part to auxiliary array
2. merge auxiliary array and the second part of original array 


```cpp
#include <vector>
#include <algorithm>
#include <iostream>

using namespace std;

void merge(vector<int> &a) {
    vector<int> aux = vector<int>(a.size() / 2);
    int half = a.size() / 2;
    for (int i = 0; i < half; i++)
        aux[i] = a[i];

    int lo = 0, hi = half;
    int k = 0;
    
    while (lo < half && hi < a.size()) {
        if (aux[lo] < a[hi])
            a[k++] = aux[lo++];
        else a[k++] = a[hi++];
    }
    while (lo < half) a[k++] = aux[lo++];
    while (hi < a.size()) a[k++] = a[hi++];

}

void test() {
    vector<int> a = {6, 7, 8, 9, 10, 1, 2, 3, 4, 5};
    vector<int> expect = a;
    std::sort(expect.begin(), expect.end());

    merge(a);
    for (auto x: a)
        cout << x << ' ';

    if (a == expect)
        cout << "yes";
    else
        cout << "NO";
}

int main() {
    test();
    return 0;
}
```

## Taxicab numbers
find items like `a^3+b^3=c^3+d^3`

可以这么想，看成横纵 1 到 n 的矩阵，里边填写立方和。上三角和下三角的元素一样所以只考虑上三角。

1. 遍历所有横纵坐标，用哈希表，出现过的立方和就输出一下，没出现过的就存起来
2. 用堆存立方和（也可以是优先队列，我这里用最小堆，相当于立方和从小到大，最大堆也行，相当于从大到小）堆不空就反复尝试。另外用堆拓展的时候只往一个方向拓展，用两个就不对

```cpp
#include <unordered_map>
#include "iostream"
#include "vector"
#include "queue"

using namespace std;

class taxinum {

public:
int a, b, sum;

taxinum(int _a, int _b) : a(_a), b(_b), sum(a * a * a + b * b * b) {}

bool operator==(taxinum other) const {
    return this->sum == other.sum;
}

bool operator<(taxinum other) const {
    return this->sum < other.sum;
}

bool operator>(taxinum other) const {
    return this->sum > other.sum;
}

friend ostream &operator<<(ostream &os, const taxinum &t) {
    os << t.a << '+' << t.b << '=' << t.sum;
    return os;
}


};

void testMinheap() {
priority_queue<taxinum, vector<taxinum>, greater<taxinum>> queue1;

int n = 30;
for (int i = 1; i <= n; i++)
    queue1.push(taxinum(i, i));

taxinum oldPair(1, 1);
while (!queue1.empty()) {
    taxinum newPair = queue1.top();
    queue1.pop();

    if (newPair.sum == oldPair.sum)
        cout << oldPair << "-----" << newPair << endl;
    if (newPair.b < n)
        queue1.push(taxinum(newPair.a, newPair.b + 1));

    oldPair = newPair;
}

}

void testHashmap() {
int n = 30;
unordered_map<int, pair<int, int>> table;
for (int i = 1; i <= n; i++)
    for (int j = i; j <= n; j++) {
        taxinum t(i, j);
        int sum = t.sum;
        if (table.contains(sum)) {
            cout << i << ' ' << j << ' ' << table[sum].first << ' ' << table[sum].second << endl;
        }
        else {
            table[sum] = {i, j};
        }
    }

}

void testMaxheap() {
priority_queue<taxinum, vector<taxinum>, less<taxinum>> queue1;

int n = 30;
for (int i = 1; i <= n; i++)
    queue1.push(taxinum(i, i));

taxinum oldPair(1, 1);
while (!queue1.empty()) {
    taxinum newPair = queue1.top();
    queue1.pop();

    if (newPair.sum == oldPair.sum)
        cout << oldPair << "-----" << newPair << endl;
    //一个方向就够了
    if (newPair.b > 0)
        queue1.push(taxinum(newPair.a, newPair.b - 1));
//        if (newPair.a > 0)
//            queue1.push(taxinum(newPair.a - 1, newPair.b));

    oldPair = newPair;
}

}

int main() {
testMaxheap();
testHashmap();
return 0;
}
```

## lakes
[链接](https://codeforces.com/contest/1829/problem/E)

这个题在于剪枝，有的不用再dfs了，不然超时。假如（1，1）和（1，2）联通，dfs（1，1）和dfs（1，2）是一个结果。

```cpp
#include <cstring>
#include "iostream"

using namespace std;
const int N = 1010;
int gra[N][N];
int n, m;
int total;
int dx[4] = {0, 0, -1, 1};
int dy[4] = {1, -1, 0, 0};
bool visited[N][N];


int dfs(int a, int b) {
visited[a][b] = true;
if (gra[a][b] == 0) return 0;
int anw = gra[a][b];

for (int i = 0; i < 4; i++) {
    int nx = a + dx[i];
    int ny = b + dy[i];
    if (nx >= 1 && nx <= n && ny >= 1 && ny <= m
        && gra[nx][ny] > 0 && visited[nx][ny] == false) { anw += dfs(nx, ny); }
}
return anw;
}

void solve() {

int fin = 0;
cin >> n >> m;

for (int i = 1; i <= n; i++)
    for (int j = 1; j <= m; j++)
        cin >> gra[i][j];


memset(visited, 0, sizeof visited);
for (int i = 1; i <= n; i++)
    for (int j = 1; j <= m; j++) {
        if (gra[i][j] != 0 && visited[i][j] == false) {

            fin = max(dfs(i, j), fin);
        }
    }
cout << fin << endl;

}

int main() {

cin >> total;
while (total--)
    solve();
return 0;
}

```

## Hits Different
[链接](https://codeforces.com/contest/1829/problem/G)

[前缀和动画讲解](https://usaco.guide/silver/more-prefix-sums?lang=cpp#2d-prefix-sums)

非常巧妙啊，转成前缀和,详情可以见相应英文题解

```cpp
#include "iostream"

using namespace std;

typedef long long  llint;
llint anw[2050000];
llint gra[2029][2029];
llint cur = 1;

void solve() {
llint x;
cin >> x;
cout << anw[x] << endl;
}

int main() {
ios::sync_with_stdio(false);
cin.tie(nullptr);
int n;
for (int i = 1; i <= 2023; i++)
    for (int j = i; j >= 1; j--) {
        gra[j][i - j + 1] = gra[j - 1][i - j + 1] + gra[j][i - j + 1 - 1]
                            - gra[j - 1][i - j + 1 - 1]
                            + cur * cur;
        anw[cur] = gra[j][i - j + 1];
        cur++;
    }
cin >> n;
while (n--)
    solve();
return 0;
}
```

## Distinct Split
[链接](https://codeforces.com/contest/1791/problem/D)

1. 一次遍历统计出所有字母的出现次数
2. 从前往后开始算，给pre分一个字母，就在该字母出现总数-1
3. 统计所有字母，进行加和；

巧妙在相当于并行处理2个字符串，想不出来😥 


## 读者写者问题
[wiki](https://en.wikipedia.org/wiki/Readers%E2%80%93writers_problem#)


```cpp
//  "读者优先"
#include <mutex>
#include <iostream>
#include <thread>

using namespace std;

mutex readCntLock;
int readCnt;
mutex resource;

void readResource(int x) {
    cout << x << " read\n";
}

void reader() {
    while (true) {
        readCntLock.lock();
        readCnt++;
        if (readCnt == 1)
            resource.lock();
        readCntLock.unlock();

        readResource(readCnt);

        readCntLock.lock();
        readCnt--;
        if (readCnt == 0)
            resource.unlock();
        readCntLock.unlock();
    }
}

void writeResource(int x) {
    cout << x << " write\n";
}

void writer() {
    while (true) {
        resource.lock();
        writeResource(1);
        resource.unlock();
    }
}

int main() {
    thread reader_b(reader);
    thread writer_a(writer);
    thread reader_c(reader);
    writer_a.join();
    reader_b.join();
    reader_c.join();
    return 0;
}
```

```cpp
 "写者优先"
#include <mutex>
#include <iostream>
#include <thread>

using namespace std;

int readCnt;
mutex readCntLock;

int writeCnt;
mutex writeCntLock;

mutex readTry;
mutex resource;

void readResource(int x) {
    cout << x << " read\n";
}

void reader() {
    while (true) {
        readTry.lock();

        readCntLock.lock();
        readCnt++;
        if (readCnt == 1)
            resource.lock();
        readCntLock.unlock();

        readTry.unlock();


        readResource(readCnt);


        readCntLock.lock();
        readCnt--;
        if (readCnt == 0)
            resource.unlock();
        readCntLock.unlock();
    }
}

void writeResource(int x) {
    cout << x << " write\n";
}

void writer() {
    while (true) {
        writeCntLock.lock();
        writeCnt++;
        if (writeCnt == 1)
            readTry.lock();
        writeCntLock.unlock();

        resource.lock();
        writeResource(1);
        resource.unlock();

        writeCntLock.lock();
        writeCnt--;
        if (writeCnt == 0)
            readTry.unlock();
        writeCntLock.unlock();
    }
}

int main() {
    thread reader_b(reader);
    thread writer_a(writer);
    thread reader_c(reader);
    writer_a.join();
    reader_b.join();
    reader_c.join();
    return 0;
}
```

```cpp
//  "公平"
#include <mutex>
#include <iostream>
#include <thread>

using namespace std;

int readCnt;
mutex readCntLock;

mutex serviceQueue;
mutex resource;

void readResource(int x) {
    cout << x << " read\n";
}

void reader() {
    while (true) {
        serviceQueue.lock();

        readCntLock.lock();
        readCnt++;
        if (readCnt == 1)
            resource.lock();
        readCntLock.unlock();

        serviceQueue.unlock();


        readResource(readCnt);


        readCntLock.lock();
        readCnt--;
        if (readCnt == 0)
            resource.unlock();
        readCntLock.unlock();
    }
}

void writeResource(int x) {
    cout << x << " write\n";
}

void writer() {
    while (true) {
        serviceQueue.lock();
        resource.lock();
        serviceQueue.unlock();

        writeResource(1);

        resource.unlock();
    }
}

int main() {
    thread reader_b(reader);
    thread writer_a(writer);
    thread reader_c(reader);
    writer_a.join();
    reader_b.join();
    reader_c.join();
    return 0;
}
```
