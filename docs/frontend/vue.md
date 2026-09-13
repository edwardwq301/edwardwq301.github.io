# Vue Learn

## watch

`props` 本身是响应式对象（`shallowReactive`，只代理顶层属性），所以直接写 `props.b` 就能拿到最新值。

监听 `props.b` 有三种写法，语义完全不同：

1. `watch(props.b, cb)` —— 监听这个对象**内部**的变化
   - 传进去的是 `props.b` 当前指向的那个对象，Vue 把它当 reactive 对象处理，自动深度监听
   - 前提是传进来的这个对象本身是响应式的（父组件用 `reactive()` 创建、再 `:b="obj"` 传下来）。如果父组件传的是普通对象字面量，Vue 会警告 `Invalid watch source`，回调永远不触发
   - 它只盯着这一个对象，父组件把 `props.b` 整个换成新对象时**不触发**

2. `watch(() => props.b, cb)` —— 监听是否被**替换**
   - getter 每次返回 `props.b` 的当前引用，Vue 默认用 `===` 比较引用地址
   - 父组件传入新对象（引用变了）才触发，对象内部的变化不触发

3. `watch(() => props.b, cb, { deep: true })` —— 替换和内部变化都要
   - 用 getter 拿到最新引用，再开 `deep` 递归遍历内部

补充：`props` 顶层是 `shallowReactive`，所以父组件换掉 `props.b` 会触发依赖更新；但对象内部字段的变化不会经由 `props` 这一层被追踪，只有对象自己就是响应式代理时才追得到。

注意：解构会丢响应性，`const { b } = props` 之后 `b` 不再更新，要用 `props.b`，或者 `toRef(props, 'b')`。

## emit

emit 是子组件向父组件传递事件和数据的标准方式。

```vue
<script setup>
// Child.vue
// 使用 defineEmits 定义可触发的事件
const emit = defineEmits(['some-event']);

const sendDataToParent = () => {
  const arg = "Hello from Child!";
  emit('some-event', arg); // 触发事件并传递数据
};
</script>

<template>
  <button @click="sendDataToParent">Click to Emit</button>
</template>
```

```vue
<script setup>
// Parent.vue
import Child from './Child.vue';

const handleChildEvent = (arg) => {
  console.log(arg); // "Hello from Child!"
};
</script>

<template>
  <Child @some-event="handleChildEvent" />
</template>
```

子组件收集表单数据，用 emit 发送给父组件，父组件再调用 API，是一种良好实践。
