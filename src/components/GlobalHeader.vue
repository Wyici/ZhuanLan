<template>
    <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
        <router-link to="/" class="navbar-brand text-light" href="#">专栏</router-link>
        <ul v-if="!isLogin" class="list-inline mb-0">
            <li class="list-inline-item"><router-link to='/login' class="btn btn-outline-light my-2">登录</router-link></li>
            <li class="list-inline-item"><router-link to='/signup' class="btn btn-outline-light my-2">注册</router-link></li>
        </ul>
        <ul v-else-if="isLogin && data" class="list-inline mb-0">
            <li class="list-inline-item">
                <Dropdown :title="`欢迎你 ${data.nickName}`">
                    <dropdown-item><router-link class="dropdown-item" to="/create">新建文章</router-link></dropdown-item>
                    <dropdown-item><router-link :to="`/column/${data.column}`" class="dropdown-item">我的专栏</router-link></dropdown-item>
                    <dropdown-item><router-link to="/edit" class="dropdown-item">编辑资料</router-link></dropdown-item>
                    <dropdown-item><a class="dropdown-item" href="#" @click.prevent="handleLogout">退出账号</a></dropdown-item>
                </Dropdown>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import Dropdown from './Dropdown.vue';
import DropdownItem from './DropdownItem.vue';
import createMessage from './createMessage';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
//import { useUserStore } from '../store/user';
import { type UserDataProps } from '../store/user';
import type { GlobalDataProps } from '../store';
const store = useStore<GlobalDataProps>();
//const userStore = useUserStore();
defineProps<{
    data: UserDataProps | null,
    isLogin: boolean
}>();
const router = useRouter();
const handleLogout = () => {
    store.commit('logout');
    //userStore.logout();
    createMessage('退出登录成功    2秒后跳转到首页', 'success', 2000)
      setTimeout(() => {
        router.push('/')
      }, 2000)
}
</script>
