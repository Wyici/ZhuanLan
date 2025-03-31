<template>
    <form class="validate-form-container">
        <slot name="default"></slot>
        <div class="submit-area" @click.prevent="submitForm">
            <slot name="submit">
                <button type="submit" class="btn btn-primary">提交</button>
            </slot>
        </div>
    </form>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue';
import { emitter } from '../hooks/mitt'; // 导入 mitt 实例
type ValidateFunc = () => boolean;
let funcArr: ValidateFunc[] = [];
// 提交表单的方法
const emit = defineEmits(['form-submit']);
const submitForm = () => {
    const result = funcArr.map(func => func()).every(result => result);
    emit('form-submit',result)
}
const callback = (func:ValidateFunc) =>{
    if(func)    funcArr.push(func);
}
const clearAllStatus = () => {
    funcArr = [];
};
// 监听 'form-item-created' 事件
emitter.on('form-item-created', callback);

// 在组件卸载时清理监听
onUnmounted(() => {
  emitter.off('form-item-created', callback);
  funcArr = [] // 清空验证函数数组
});
defineExpose({
    clearAllStatus
});
</script>

<style scoped>

</style>