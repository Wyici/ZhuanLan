<template>
    <div class="create-post-page">
        <h4>{{isEditMode ? '编辑文章' : '新建文章'}}</h4>
        <uploader 
        action='/upload'
        class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
        :beforeUpload="commonUploadCheck"
        :uploaded="uploadedData"
        @file-uploaded="handleFileUploaded">
        <h2>点击上传头图</h2>
        <template #loading>
            <div class="d-flex">
                <div class="spinner-border text-secondary" role="status">
                    <span class="sr-only"></span>
                </div>
                <h2>正在上传</h2>
            </div>
        </template>
        <template #uploaded="dataProps">
            <div class="uploaded-area">
                <img :src="dataProps.uploadedData?.data?.url ?? ''">
                <h3>点击重新上传</h3>
            </div>
        </template>
        </uploader>
        <validate-form @form-submit="onFormSubmit">
            <div class="mb-3">
                <label class="form-label">文章标题：</label>
                <validate-input
                    :rules="titleRules"
                    v-model="titleVal"
                    placeholder="请输入文章标题"
                    type="text"
                />
            </div>
            <div class="mb-3">
                <label class="form-label">文章详情：</label>
                <editor 
                v-model="contentVal" 
                :options="editorOptions" 
                ref="editorRef"
                @blur="checkEditor"
                :class="{'is-invalid':!editorStatus.isValid}"></editor>
                <span v-if="!editorStatus.isValid" class="invalid-feedback" style="color:red;">{{editorStatus.message}}</span>
            </div>
            <template #submit>
                <button type="submit" class="btn btn-primary  btn-large">{{isEditMode ? '更新文章' : '发表文章'}}</button>
            </template>
        </validate-form>
    </div>
</template>

<script setup lang="ts">
import { ref , onMounted , reactive} from 'vue';
import ValidateForm from '../components/ValidateForm.vue';
import ValidateInput from '../components/ValidateInput.vue'
import Uploader from '../components/Uploader.vue';
import { commonUploadCheck } from '../helper';
import { type RuleProp, type PostProps} from '../testData';
import { type GlobalDataProps } from '../store';
import { type ResponseType } from '../store/utils';
import { useRouter, useRoute } from 'vue-router';
import createMessage from '../components/createMessage';
import EasyMDE , { type Options }from 'easymde';
import Editor from '../components/Editor.vue';
import { useStore } from 'vuex';
import type { ImageProps } from '../store/utils';
interface EditorInstance {
    clear: () => void;
    getMDEInstance : () => EasyMDE | null;
}
const editorStatus = reactive({
    isValid :true,
    message: ''
})
const titleVal = ref('');
const contentVal = ref('');
const store = useStore<GlobalDataProps>();
const router = useRouter();
const route = useRoute();
const isEditMode = !!route.query.id;//判断是否编辑模式
interface UploadedData {
  data?:ImageProps
}
const uploadedData = ref<UploadedData>();
const editorRef = ref<null | EditorInstance>();
const editorOptions:Options = {
    spellChecker:false
}
const titleRules : RuleProp[] = [
    {   type:'required',message:'文章标题不能为空'}
]
let imageId = '';

onMounted(() => {
    if(editorRef.value){
        console.log(editorRef.value.getMDEInstance);
    }
    if(isEditMode){
        store.dispatch('fetchPost', route.query.id).then((rawData:ResponseType<PostProps>)=>{
            const currentPost = rawData.data;
            if(currentPost.image){
                uploadedData.value = { data: currentPost.image };
            }
            titleVal.value = currentPost.title;
            contentVal.value = currentPost.content || '';
        })
    }
})

const checkEditor = () =>{
    if(contentVal.value.trim() === ''){
        editorStatus.isValid = false;
        editorStatus.message = '文章详情不能为空'
    }
    else{
        editorStatus.isValid = true;
        editorStatus.message = '';
    }
}
const handleFileUploaded = (rawData:ResponseType<ImageProps>) => {
    if(rawData.data._id) {
        imageId = rawData.data._id;
    }
}
const onFormSubmit = (result:boolean) => {
    checkEditor();
    if(result && editorStatus.isValid){
        const { column, _id} = store.state.user;
        if(column){
            const newPost : PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id
            }
            if(imageId && newPost.image){
                newPost.image.fitUrl = imageId;
            }
            const actionName = isEditMode ? 'updatePost' : 'createPost';
            const sendData = isEditMode ? {
                id: route.query.id,
                payload: newPost
            } : newPost;
            store.dispatch(actionName,sendData).then(()=>{
                const str = isEditMode ? '更新成功' : '发表成功';
                createMessage(`${str}    2秒后跳转到文章页面`,'success',2000);
                setTimeout(()=>{
                    router.push({name:'column',params:{ id: column}});
                },2000);
            });
            
        }
    }
}
</script>

<style>
.create-post-page .file-upload-container {
    height:200px;
    cursor:pointer;
    overflow: hidden;
}
.create-post-page .file-upload-container img{
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.uploaded-area {
  position: relative;
}
.uploaded-area:hover h3 {
  display: block;
}
.uploaded-area h3 {
  display: none;
  position: absolute;
  color: #999;
  text-align: center;
  width: 100%;
  top: 50%;
}
</style>