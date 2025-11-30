# CSS
` ` 后代选择器，只要其上级有就被选中。eg: `a b c` 会被 `a c` 选中，和 `>` 只会在选择器选中直接子元素的时候匹配不同。

## flex
axis often is up to down/left to right, unless change to `row-reverse` etc.

1. `justify-content`: along main axis,
2. `align-items`: along cross axis
3. `flex-flow`: column wrap, conbine `flex-direction` and `flex-wrap`
  - `flex-direction`: defines the direction of the main axis.
  - `flex-wrap`: avoid all content squeezed onto a single row
4. `align-content`: set how multiple lines in a container are spaced apart from each other.


[flex flog level 24 思路](https://flexboxfroggy.com/)

看到红色在最下边，说明`flex-direction`至少是 column ，试一下，然后发现红色在上方，改成`colunm-reverse`

发现挤到一起了，换行，`flex-wrap:wrap-reverse`

发现应该是一段文字行内间隔，调整`align-content:space-between`

发现黄色在最下边，此时主轴为`down->top`
调整`justify-content:center`

最后`flex-flow`合并 `column-reverse wrap-reverse`

```CSS
flex-direction: column-reverse;
align-content:space-between;
flex-wrap: wrap-reverse;
justify-content:center;
```
