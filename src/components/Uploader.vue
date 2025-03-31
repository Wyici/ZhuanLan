<template>
    <div class="file-upload">
        <div class="file-upload-container" @click.prevent="triggerUpload" v-bind="$attrs">
            <slot v-if="fileStatus === 'loading'" name="loading">
                <button class="btn btn-primary">正在上传...</button>
            </slot>
            <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
                <button class="btn btn-primary">上传成功</button>
            </slot>
            <slot v-else name="default">
                <button class="btn btn-primary">点击上传</button>
            </slot>
        </div>
        <input type="file" 
        class="file-input d-none"
        ref="fileInput"
        @change="handleFileChange"/>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, watch } from 'vue';
import type { ImageProps } from '../testData';
type UploadStatus = 'ready' | 'loading' | 'success' | 'error';
type CheckFunction = (file: File) => boolean;
defineOptions({
    inheritAttrs: false
});
interface UploadedData {
  data?:ImageProps
}
const props = defineProps<{
    action: string,
    beforeUpload?: CheckFunction,
    uploaded?:UploadedData
}>();

const emit = defineEmits(['file-uploaded','file-uploaded-error']);
const fileInput = ref<null | HTMLInputElement>(null);
const fileStatus = ref<UploadStatus>(props.uploaded ? 'success' :'ready');

const uploadedData = ref(props.uploaded);
watch(() => props.uploaded,(newValue) => {
    if(newValue){
        fileStatus.value = 'success'
        uploadedData.value = newValue;
    }
});
const triggerUpload = () => {
    if(fileInput.value){
        fileInput.value.click()//通过点击button，触发input的click
    }
}
const handleFileChange = (e:Event) => {
    const currentTarget = e.target as HTMLInputElement;
    if(currentTarget.files){
        const files = Array.from(currentTarget.files);
        if(props.beforeUpload){
            const result = props.beforeUpload(files[0])
            if(!result) return;
        }
        fileStatus.value = 'loading';
        const formData = new FormData();
        formData.append('file',files[0]);
        axios.post(props.action, formData,{
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        }).then(resp =>{
            emit('file-uploaded',resp.data)
            uploadedData.value = resp.data;
            fileStatus.value = 'success';
        }).catch((error) => {
            emit('file-uploaded-error',{error});
            fileStatus.value = 'error';
        }).finally(() =>{
            if(fileInput.value){
                fileInput.value.value = '';
            }
        })
    }
}
</script>

<style scoped>

</style>