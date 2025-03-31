<template>
  <div class="container">
    <global-header :data="currentUser" :is-login="isLogin"></global-header>
    <loader v-if="isLoading" text="拼命加载中" background="rgba(0,0,0,0.8)"></loader>
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light">
      <small>
        <ul class="list-inline">
          <li class="list-inline-item">© 2024 专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Loader from './components/Loader.vue';
import createMessage from './components/createMessage';
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue';
import { computed, watch } from 'vue';
import type { GlobalDataProps } from './store';
import { useStore } from 'vuex';
//import { useGlobalStore } from './store/global';
//import { useUserStore } from './store/user';

//const userStore = useUserStore();
//const currentUser = computed(() => userStore.data);
//const isLogin = computed(()=>userStore.isLogin);
const store = useStore<GlobalDataProps>();
const currentUser = computed(() => store.state.user);
//const globalStore = useGlobalStore();
//const isLoading = computed(() => globalStore.loading);
//onst error = computed(() => globalStore.error);
const isLogin = computed(() => store.state.user.isLogin);
const isLoading = computed(() => store.state.loading);
const error = computed(() => store.state.error);
watch(() => error.value.status, () => {
  const { status, message } = error.value;
  if(status && message){
    createMessage(message,'error');
  }
})
</script>

<style scoped>

</style>
