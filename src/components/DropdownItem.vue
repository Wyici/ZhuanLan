<template>
    <div>
        <li class="dropdown-option" 
        :class="{'is-disabled' : disabled}"
        >
            <slot></slot> <!-- 这里渲染 <a class="dropdown-item">...</a> -->
        </li>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    disabled?: boolean;
}>();

</script>

<style scoped>
.dropdown-option.is-disabled *{
    color:#ccc;
    pointer-events: none;
    background-color: transparent;
}
</style>