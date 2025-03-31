<template>
    <div class="post-list">
      <article v-for="post in posts" :key="post._id" class="card mb-3 shadow-sm">
        <div class="card-body">
          <router-link :to="`/posts/${post._id}`">{{post.title}}</router-link>
          <div class="row my-3 align-items-center">
            <div v-if="post.image && typeof post.image !== 'string'" class="col-4">
              <img :src="post.image.fitUrl" :alt="post.title" class="rounded-lg w-100">
            </div>
            <p :class="{'col-8': post.image}" class="text-muted">{{post.excerpt}}</p>
          </div>
          <span class="text-muted">{{post.createdAt}}</span>
        </div>
      </article>
    </div>
  </template>

<script setup lang="ts">
import { computed } from 'vue';
import { type ImageProps, type PostProps } from '../testData';
import { generateFitUrl } from '../helper';
const props = defineProps<{
    list:PostProps[]
}>()
const posts = computed(() => {
      return props.list.map(post => {
        generateFitUrl(post.image as ImageProps, 200, 110, ['m_fill'])
        return post
      })
    })
</script>

<style>
.post-list h4 a {
  text-decoration: none;
  color:#1a1a1a;
}
.post-list h4 a:hover {
  color:#0d6efd;
}
</style>
