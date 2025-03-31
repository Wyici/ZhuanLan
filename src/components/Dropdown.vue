<template>
    <div class="dropdown" ref = "dropdownRef">
        <a href="#" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleOpen">{{ title }}</a>
        <ul class="dropdown-menu" :style="{ display:'block'}" v-if="isOpen" @click="isOpen = false">
            <slot></slot> <!-- 这里渲染 DropdownItem -->
        </ul>
    </div>
</template>

<script setup lang="ts">
import useClickOutside from '../hooks/useClickOutside';
import{ ref ,watch} from 'vue'
defineProps<{
    title: string;
}>();
const isOpen = ref(false);
const dropdownRef = ref<null | HTMLElement>(null);
const toggleOpen = () => {
    isOpen.value = !isOpen.value
}

const isClickOutside = useClickOutside(dropdownRef);
watch(isClickOutside, () =>{
    if(isClickOutside.value && isOpen.value)
    {
        isOpen.value = false;
    }
});
</script>

<style scoped>

</style>
