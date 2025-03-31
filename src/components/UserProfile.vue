<template>
    <div class="user-profile-component">
        <div class="d-flex align-items-center">
            <img :src="fitUrl" :alt="user.nickName" class="rounded-circle img-thumbnail">
            <div class="detail ml-2">
                <h6 class="d-block mb-0">{{user.nickName}}</h6>
                <span class="text-truncate text-muted d-block custom-truncate">{{user.description}}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { UserProps } from '../testData';
import { addColumnAvatar } from '../helper'
const props = defineProps<{
    user:UserProps
}>();
const fitUrl = computed(() =>{
    addColumnAvatar(props.user,50,50);
    const { avatar } = props.user;
    return avatar && avatar.fitUrl;
})

</script>

<style>
.custom-truncate {
  display: block;       /* 让 text-truncate 生效 */
  width: 200px;         /* 需要设置固定宽度 */
  white-space: nowrap;  /* 防止文本换行 */
  overflow: hidden;     /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 超出部分用省略号表示 */
}
.user-profile-component img {
  width: 50px;
  height: 50px;
}
</style>