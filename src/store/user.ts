import axios from "axios";
import { type ImageProps, type ResponseType } from "./utils";
import { defineStore } from "pinia";
   // isLogin 和 用户数据放在一个数据结构下，不太合理
   // 判断是否登陆的字段应该单独放置，用户数据应该是一个单独的属性
export interface UserDataProps {
    nickName?: string;
    _id?: string;
    column?: string;
    email?: string;
    avatar?: ImageProps;
    description?: string;
}
  
export interface UserProps {
    token: string;
    isLogin: boolean;
    data: UserDataProps | null;
}

export const useUserStore = defineStore('user',{
    state: (): UserProps => {
        return {
            token: localStorage.getItem('token') || '',
            isLogin: false,
            data: null
        }
    },
    actions:{
        async login(email:string,password:string){
            const payload = {
                email,
                password
            }
            const { data } = await axios.post<ResponseType<UserProps>>('/user/login',payload)
            const { token } = data.data;
            this.token = token;
            localStorage.setItem('token',token)
            console.log(data.data);
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        },
        logout(){
            this.token = '';
            this.isLogin = false;
            localStorage.removeItem('token');
            delete axios.defaults.headers.common.Authorization;
        },
        async fetchCurrentUser(){
            const { data } = await axios.get<ResponseType<UserDataProps>>('/user/current')
            this.isLogin = true;
            this.data = {...data.data};
            console.log(data);
        },
        async updateCurrentUser(id:string,payload:any){
            const { data } = await axios.patch<ResponseType<UserDataProps>>(`/user/${id}`,payload)
            this.isLogin = true;
            this.data = { ...data.data };
        }
    }
})
  