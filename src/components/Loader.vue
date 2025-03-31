<template>
    <teleport to="#back">
        <div 
        class="d-flex justify-content-center align-items-center h-100 loading-container"
        :style="{backgroundColor: background || ''}">
                <div class="loading-content">
                <div class="spinner-border text-primary" role="status">
                </div>
                <p v-if="text" class="text-primary small">{{ text }}</p>
            </div>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import useDOMCreate from '../hooks/useDOMCreate';
useDOMCreate('back');
defineProps<{
    text:string,
    background:string
}>()
</script>

<style scoped>
.loading-container{
    background:rgba(255,255,255,0.5);
    z-index:100;
    position:fixed;
    width:100%;
    height:100%;
    top:0;
    left:0;
}
.loading-container{
    text-align:center;
}
</style>