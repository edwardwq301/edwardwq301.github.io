# Vue Learn
## watch
props 默认是是一个响应式对象

如果需要监听 props.b 及其内部变化：`watch(props.b, (newVal) => { ... });  // 自动深度监听（如果 props.b 是 reactive）`

如果只需要监听 props.b 是否被替换：`watch(() => props.b, (newVal) => { ... });  // 仅引用变化`。因为 **getter** 返回的是一个引用（数组、对象、函数、Promise）,Vue 默认用 === 比较引用地址。

如果需要监听普通对象的内部变化：`watch(() => props.b, (newVal) => { ... }, { deep: true });  // 深度监听`

props 本身是响应式代理，但解构后的属性（如 const { b } = props）会失去响应性。直接通过 props.b 访问可保持响应性。

## emit
emit 是子组件向父组件传递事件和数据的标准方式​​

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

子组件收集表单数据，用 emit 发送数据给父组件，父组件调用 api 是一种良好实践