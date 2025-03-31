import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store/index'
import axios from 'axios'
//import { createPinia } from 'pinia'
//import { useGlobalStore } from './store/global'
import 'easymde/dist/easymde.min.css'

//const pinia = createPinia();
const app = createApp(App);
app.use(store);
//app.use(pinia);
app.use(router);
//const globalStore = useGlobalStore();//要在加载对应Pinia以后
axios.defaults.baseURL = 'http://apis.imooc.com/api'
axios.interceptors.request.use(config => {
    config.params = {...config.params, icode:'9ADCD75E7298A620'}
    if(config.data instanceof FormData){
        config.data.append('icode','9ADCD75E7298A620');
    }
    else{
        config.data = {...config.data,icode:'9ADCD75E7298A620'}
    }
    return config;
})
axios.interceptors.request.use(config => {

    //store.commit('setLoading', true)
    //store.commit('setError',{status:false, message:''});
    // globalStore.setLoading(true);
    // globalStore.setError({status:false, message:''})

    return config
})
  
  
axios.interceptors.response.use(config => {
    //globalStore.loading =false;
    store.commit('setLoading', false)
    return config
},e =>{
    console.log(e);
    const { error } = e.response.data;
    // globalStore.error = {status:true, message:error};
    // globalStore.loading = false;
    store.commit('setError',{status:true, message:error});
    store.commit('setLoading',false);
    return Promise.reject(error)
})  
app.mount('#app');
