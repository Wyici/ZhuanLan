<template>
    <div class="row">
        <div v-for="column in columnList" :key="column._id" class="col-4 mb-4 " >
            <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
                <img :src="column.avatar && column.avatar.fitUrl" :alt="column.title" class="rounded-circle border border-light my-3 img-avatar">
                <h5 class="card-title">{{ column.title }}</h5>
                <p class="card-text text-left line-clamp-3">{{ column.description }}</p>
                <router-link :to="`/column/${column._id}`" class="btn btn-outline-primary">进入专栏</router-link>
            </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type ColumnProps } from '../testData';
import { addColumnAvatar } from '../helper';
import { computed } from 'vue';
const props = defineProps<{
    list:ColumnProps[];
}>();
const columnList = computed(() => {
  return props.list.map(column => {
    addColumnAvatar(column, 50, 50)
        return column
  })}
);

</script>

<style>
.img-avatar {
  width: 100px; /* 统一宽度 */
  height: 100px; /* 统一高度，确保是正方形 */
  object-fit: cover; /* 保证填充整个区域，裁剪超出的部分 */
  border-radius: 50%; /* 让图片变成圆形 */
  border: 2px solid white; /* 添加边框（可选） */
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 3; /* 设定最多显示3行 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}
</style>