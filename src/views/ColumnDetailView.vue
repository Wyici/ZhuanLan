<template>
    <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-4 text-center">
        <img :src="column.avatar && column.avatar.fitUrl" :alt="column.title" class="rounded-circle border img-avatar">
      </div>
      <div class="col-8">
        <h4>{{column.title}}</h4>
        <p class="text-muted">{{column.description}}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
    <button
      class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 d-block"
      @click="loadMorePage" v-if="!isLastPage"
    >
      加载更多
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import PostList from '../components/PostList.vue';
import type { ColumnProps } from '../testData';
import type { GlobalDataProps } from '../store';
import { addColumnAvatar } from '../helper';
import useLoadMore from '../hooks/useLoadMore';

const route = useRoute();
const store = useStore<GlobalDataProps>();
const currentID = ref(route.params.id)
watchEffect(()=>{
  console.log(currentID.value);
})
onMounted(()=>{
  store.dispatch('fetchColumn',currentID.value)
  store.dispatch('fetchPosts',{cid:currentID.value})
})
watch(() => route.params, (toParams) => {
      // 确保要变化的路径是进入到用户的专栏
      // 判断 跳转的 ID 是否存在
      const jumpId = toParams && toParams.id
      const column = store.state.user.column
      if (jumpId && column && (jumpId === column)) {
        // 重新发送请求，在 store 中有对应的缓存设置
        store.dispatch('fetchColumn', jumpId)
        store.dispatch('fetchPosts', { cid: jumpId })
        // 重新赋值，这样 computed 会变化
        currentID.value = toParams.id
      }
})
const column = computed(() => {
      const selectColumn = store.getters.getColumnById(currentID.value) as ColumnProps | undefined
      if (selectColumn) {
        addColumnAvatar(selectColumn, 100, 100)
      }
      return selectColumn
    })
const list = computed(() => store.getters.getPostsByCid(currentID.value))
const count = computed(() => store.getters.getPostsCountByCid(currentID.value))
const currentPage = computed(() => store.getters.getPostsCurrentPageByCid(currentID.value))
const { loadMorePage, isLastPage } = useLoadMore('fetchPosts', count, { currentPage: currentPage.value, cid: currentID.value })
</script>

<style scoped>
.img-avatar {
  width: 200px; /* 统一宽度 */
  height: 200px; /* 统一高度，确保是正方形 */
  object-fit: cover; /* 保证填充整个区域，裁剪超出的部分 */
  border-radius: 50%; /* 让图片变成圆形 */
  border: 2px solid white; /* 添加边框（可选） */
}
</style>