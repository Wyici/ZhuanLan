<template>
    <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <a href="#" class="btn btn-primary my-2">开始写文章</a>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <column-list :list="list"></column-list>
    <button class="btn btn-outline-primary mx-auto mt-2 mb-5 btn-block w-25 d-block"
    @click="loadMorePage"
    v-if="!isLastPage">加载更多</button>
  </div>
</template>

<script setup lang="ts">
import { computed ,onMounted } from 'vue';
import ColumnList from '../components/ColumnList.vue';
import { type GlobalDataProps} from '../store'
import useLoadMore from '../hooks/useLoadMore';
import { useStore } from 'vuex';
const store = useStore<GlobalDataProps>();
const list = computed(() => store.getters.getColumns);
const total = computed(() => store.state.columns.total || 0);
const currentPage = computed(() => store.state.columns.currentPage || 0)
const { loadMorePage, isLastPage } = useLoadMore('fetchColumns',total,{currentPage:currentPage.value},3);

onMounted(() => {
  store.dispatch('fetchColumns',{pageSize: 3});
})

</script>

<style scoped>

</style>