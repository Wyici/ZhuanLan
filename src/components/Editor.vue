<template>
    <div class="vue-easymde-editor">
        <textarea ref="textArea"></textarea>
    </div>
</template>

<script setup lang="ts">
import EasyMDE, { type Options } from 'easymde';
import { onMounted, onUnmounted, ref, watch } from 'vue';

// 定义 Props
interface EditorProps {
    modelValue?: string;
    options?: Options;
}
const props = defineProps<EditorProps>();

// 定义 Emit
interface EditorEvents {
    (type: 'update:modelValue', value: string): void;
    (type: 'change', value: string): void;
    (type: 'blur'): void;
}
const emit = defineEmits<EditorEvents>();

// DOM 绑定
const textArea = ref<null | HTMLTextAreaElement>(null);
let easyMDEInstance: EasyMDE | null = null;
const innerValue = ref(props.modelValue || '');
watch(()=>props.modelValue,(newValue)=>{
    if(easyMDEInstance){
        if(newValue !== innerValue.value){
            easyMDEInstance.value(newValue || '');
        }
    }
})
onMounted(() => {
    if (textArea.value) {
        // 组装 EasyMDE 配置
        const config: Options = {
            ...(props.options || {}), // 允许外部传入配置
            element: textArea.value, // 绑定到 textarea
            initialValue: innerValue.value // 设置初始值
        };
        easyMDEInstance = new EasyMDE(config);

        // 监听内容变化
        easyMDEInstance.codemirror.on('change', () => {
            if (easyMDEInstance) {
                const updatedValue = easyMDEInstance.value();
                innerValue.value = updatedValue;
                emit('update:modelValue', updatedValue);
                emit('change', updatedValue);
            }
        });

        // 监听失焦事件
        easyMDEInstance.codemirror.on('blur', () => {
            if (easyMDEInstance) {
                emit('blur');
            }
        });
    }
});
//销毁对应实例
onUnmounted(()=>{
    if(easyMDEInstance){
        easyMDEInstance.cleanup();
    }
    easyMDEInstance = null;
})
const clear = () => {
    if(easyMDEInstance){
        easyMDEInstance.value('');
    }
}
const getMDEInstance = () =>{
    return easyMDEInstance;
}
defineExpose({
    clear,
    getMDEInstance
})
</script>

<style>
.vue-easymde-editor.is-invalid {
  border: 1px solid #dc3545;
}
</style>