import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue';
import LoginView from './views/LoginView.vue';
import ColumnDetailView from './views/ColumnDetailView.vue';
import CreatePostView from './views/CreatePostView.vue';
import store from './store/index';
import SignupView from './views/SignupView.vue';
import axios from 'axios';
import PostDetailView from './views/PostDetailView.vue';
import EditProfileView from './views/EditProfileView.vue';
//import { useUserStore } from './store/user';

const routerHistory = createWebHistory();
const router = createRouter({
    history: routerHistory,
    routes:[
        {
            path:'/',
            name: 'home',
            component:HomeView
        },
        {
            path:'/login',
            name: 'login',
            component:LoginView,
            meta:{ redirectAlreadyLogin: true}
        },
        {
            path:'/column/:id',
            name:'column',
            component:ColumnDetailView
        },
        {
            path:'/create',
            name:'create',
            component:CreatePostView,
            meta:{ requiredLogin: true}
        },
        {
            path:'/signup',
            name:'signup',
            component:SignupView,
            meta:{ redirectAlreadyLogin: true}
        },
        {
            path:'/posts/:id',
            name:'post',
            component:PostDetailView
        },
        {
          path: '/edit',
          name: 'edit',
          component: EditProfileView,
          meta: { requiredLogin: true }
        }
    ]
})
router.beforeEach((to, _from, next) => {
    //const userStore = useUserStore();//注意Store初始化的位置
    
    const { user, token } = store.state;
    const { requiredLogin, redirectAlreadyLogin } = to.meta
    if (!user.isLogin) {
      if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`
        store.dispatch('fetchCurrentUser').then(()=>{
          if (redirectAlreadyLogin) {
            next('/')
          } else {
            next()
          }
        }).catch(e => {
          console.error(e);
          store.commit('logout');
          next('login');
        })
        // userStore.fetchCurrentUser().then(() => {
        //   if (redirectAlreadyLogin) {
        //     next('/')
        //   } else {
        //     next()
        //   }
        // }).catch(e => {
        //   console.error(e)
        //   userStore.logout();
        //   next('login')
        // })
      } else {
        if (requiredLogin) {
          next('login')
        } else {
          next()
        }
      }
    } else {
      if (redirectAlreadyLogin) {
        next('/')
      } else {
        next()
      }
    }
  })
export default router;