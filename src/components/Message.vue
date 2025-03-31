<template>
    <teleport to="#message">
        <div class="alert message-info fixed-top w-50 mx-auto d-flex justify-content-between mt-2"
        :class="classObject" v-if="isVisible">
            <span>{{message}}</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click.prevent="hide">
            </button>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { type MessageType } from '../testData';
import useDOMCreate from '../hooks/useDOMCreate';
import { ref } from 'vue';
const props = defineProps<{
    message?: string;
    type: MessageType;
}>();
const emit = defineEmits(['close-message']);  
const isVisible = ref(true);
const classObject = {
      'alert-success': props.type === 'success',
      'alert-danger': props.type === 'error',
      'alert-primary': props.type === 'default'
}
const hide = () => {
    isVisible.value = false;
    emit('close-message',true);
}
useDOMCreate('message');

</script>

<style scoped>

</style>