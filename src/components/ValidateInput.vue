<template>
    <div class="validate-input-container pb-3">
        <input
        v-if="tag !== 'textarea'"
        type="text" class="form-control" 
        :class="{'is-invalid':inputRef.error}"
        v-model="inputRef.val"
        @blur = "validateInput"
        v-bind="$attrs"
        >
        <textarea
        v-else
        class="form-control"
        :class="{'is-invalid':inputRef.error}"
        v-model="inputRef.val"
        @blur = "validateInput"
        v-bind="$attrs"
        >
        </textarea>
        <span v-if="inputRef.error" class="invalid-feedback" style="color:red;">{{inputRef.message}}</span>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { emitter } from '../hooks/mitt';
import { type RuleProp, type TagType} from '../testData';
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

defineOptions({
    inheritAttrs: false
});

const props = defineProps<{
    rules: RuleProp[],
    modelValue: string,
    tag?: TagType
}>();

const tag = props.tag ?? 'input'; // 如果没有传递 tag，则默认是 'input'
const emit = defineEmits(['update:modelValue']);

const inputRef = reactive({
    val: computed({
        get:() => props.modelValue || '',
        set: val => {
            emit('update:modelValue',val);
        }
    }),
    error: false,
    message: '',
});
// ✅ 避免死循环
const validateInput = () => {
    if (props.rules && props.rules.length > 0) {

        const allPassed = props.rules.every(rule => {

            let passed = true;
            switch (rule.type) {
                case 'required':
                    passed = (inputRef.val.trim() !== '');
                    break;
                case 'email':
                    passed = emailReg.test(inputRef.val);
                    break;
                case 'password':
                    passed = (inputRef.val.length >= 6);
                    break;
                case 'custom':
                    passed = rule.validator ? rule.validator() :true;
                    break;
                default:
                    break;
            }
            if (!passed) {
                inputRef.message = rule.message;
            }
            return passed;
        });
        inputRef.error = !allPassed;
        return allPassed;
    }
    return true;
};
defineExpose({ validateInput });
onMounted(() => {
    emitter.emit('form-item-created', validateInput);
});
</script>
<style scoped>

</style>