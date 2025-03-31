<template>
    <div class="post-detail-page">
      <modal title="删除文章" :visible="modalIsVisible"
      @modal-on-close="modalIsVisible = false"
      @modal-on-confirm="hideAndDelete"
      >
      <p>确定要删除这篇文章吗？</p>
      </modal>
      <nav aria-label="breadcrumb" v-if="currentPost">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">首页</router-link></li>
        <li class="breadcrumb-item"><router-link :to="`/column/${currentPost.column}`">专栏首页</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">{{currentPost.title}}</li>
      </ol>
    </nav>
    <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
      <img :src="currentImageUrl" alt="currentPost.title" class="rounded-lg img-fluid my-4" v-if="currentImageUrl">
      <h2 class="mb-4">{{currentPost.title}}</h2>
      <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
        <div class="col">
          <user-profile :user="currentPost.author" v-if="typeof currentPost.author === 'object'"></user-profile>
        </div>
        <span class="text-muted col text-end font-italic">发表于：{{currentPost.createdAt}}</span>
      </div>
      <div v-html="currentHTML"></div>
    </article>
    <div v-if="showEditArea" class="btn-group mt-5 mb-5 d-flex jusityfy-content-end w-25 mx-auto">
      <router-link 
      type="button"
      class="btn btn-success"
      :to="{name:'create',query: { id: currentPost._id}}"
      >编辑</router-link>
      <button type="button" class="btn btn-danger" @click.prevent="modalIsVisible = true">删除</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { marked } from 'marked';
import type { PostProps, UserProps } from '../testData';
import type { ResponseType, ImageProps } from '../store/utils';
import type { GlobalDataProps} from '../store';
import UserProfile from '../components/UserProfile.vue';
import Modal from '../components/Modal.vue';
import createMessage from '../components/createMessage';
import { useStore } from 'vuex';
const router = useRouter();
const route = useRoute();
const store = useStore<GlobalDataProps>();
const modalIsVisible = ref(false);
const currentID = ref(route.params.id);
onMounted(()=>{
  store.dispatch('fetchPost',currentID.value);

})
const currentPost = computed<PostProps>(() => store.getters.getCurrentPost(currentID.value));
const currentHTML = computed(() => { 
    if (currentPost.value && currentPost.value.content) {
        const { isHTML, content } = currentPost.value;
        return isHTML ? content :marked.parse(content);
    }
    return ''; // 添加默认返回值，防止 undefined
});
const currentImageUrl = computed(() => {
    if (currentPost.value && currentPost.value.image) {
        const { image } = currentPost.value
        return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
      } else {
        return null
      }
});
const showEditArea = computed(() => {
  const { isLogin, _id} = store.state.user;
  if( currentPost.value && currentPost.value.author && isLogin){
    const postAuthor = currentPost.value.author as UserProps;
    return postAuthor._id === _id;
  }
  else
    return false;
});
const hideAndDelete = () => {
  modalIsVisible.value = false;
  store.dispatch('deletePost',currentID).then((rawdata:ResponseType<PostProps>) => {
    createMessage('删除成功 2秒之后跳转到专栏首页','success',2000);
    setTimeout(()=>{
      router.push({name:'column',params:{ id:rawdata.data.column}})
    },2000)
  })
}
</script>

<style scoped>

</style>