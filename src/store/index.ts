import { createStore, Store } from 'vuex';
import { type ColumnProps,type PostProps,type UserProps} from "../testData";
import axios,{type AxiosRequestConfig} from "axios";
import { arrToObj, objToArr } from "../helper";

interface ListProps<P> {
    [id:string]:P
  }
export interface GlobalErrorProps {
    status: boolean;
    message?: string;
}
export interface GlobalColumnsProps {
    data: ListProps<ColumnProps>;
    currentPage: number;
    total?: number;
  }
  export interface GlobalPostsProps {
    data: ListProps<PostProps>;
    loadedColumns: ListProps<{total?: number; currentPage?: number}>;
  }
export interface GlobalDataProps {
    error: GlobalErrorProps;
    columns: GlobalColumnsProps;
    posts: GlobalPostsProps;
    user: UserProps;
    token: string;
    loading:boolean;
}
const asyncAndCommit = async(
    url:string,
    mutationName:string,
    commit: Store<GlobalDataProps>['commit'],
    config: AxiosRequestConfig = { method:'get' },
    extraData?: any
) => {
    const { data } = await axios(url, config);
    if(extraData){
        commit(mutationName, { data, extraData });
    }
    else{
        commit(mutationName, data);
    }
    return data;
}
const store = createStore<GlobalDataProps>({
    state:{
        error: {status: false},
        token: localStorage.getItem('token') || '',
        columns: {data:{}, currentPage:0},
        posts: {data:{}, loadedColumns:{}},
        user: { isLogin: false},
        loading: false
    },
    mutations: {
        login(state, rawData) {
            const { token } = rawData.data;
            state.token = token;
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            localStorage.setItem('token',token);
        },
        logout(state){
            state.token = '';
            localStorage.removeItem('token');
            state.user.isLogin = false;
            delete axios.defaults.headers.common.Authorization;
        },
        createPost(state,newPost)
        {
            state.posts.data[newPost._id] = newPost;
        },
        fetchColumns(state,rawData)
        {
            const { data } = state.columns;
            const { list, count, currentPage} = rawData.data;
            console.log("Before update:", state.columns.data);
            console.log(list)
            state.columns = {
                data: { ...data, ...arrToObj(list) },
                total: count,
                currentPage: currentPage * 1
            }
            console.log("New list:", list);
            console.log('total.value',count);
        },
        fetchColumn(state,rawData)
        {
            state.columns.data[rawData.data._id] = rawData.data;
        },
        updateColumn(state, { data }) {
            state.columns.data[data._id] = data
        },
        fetchPosts(state, { data: rawData, extraData }) {
            const { data, loadedColumns } = state.posts
            const { list, count, currentPage } = rawData.data
            const listData = list as PostProps[]
            state.posts.data = { ...data, ...arrToObj(listData) }
            loadedColumns[extraData] = {
              total: count,
              currentPage
            }
        },
        fetchPost(state,rawData){
            state.posts.data[rawData.data._id] = rawData.data;
        },
        updatePost(state,{data}){
            state.posts.data[data._id] = data;
        },
        deletePost(state,{ data }){
            delete state.posts.data[data._id];
        },
        fetchCurrentUser(state,rawData){
            state.user = { isLogin:true, ...rawData.data}
        },
        updateUser(state, { data }) {
            state.user = { isLogin: true, ...data }
        },
        setError(state, e:GlobalErrorProps){
            state.error = e;
        },
        setLoading(state,status)
        {
            state.loading = status;
        }

    },
    actions: {
        fetchColumns({ state, commit }, params = {}) {
            console.log("params in fetchColumns:", params);
            const { currentPage = 1, pageSize = 6 } = params;
            console.log("Final pageSize:", pageSize);
            console.log("currentPage", currentPage);
            console.log("state.columns.currentPage",state.columns.currentPage);
            if (state.columns.currentPage < currentPage) {
                console.log(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`);
              return asyncAndCommit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit);
            }
        }
        ,
        fetchColumn({ state,commit }, cid) {
            const cIdArr = Object.keys(state.columns.data)
            if (!cIdArr.includes(cid)) {
                return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
            }
        },
        updateColumn({ commit }, { id, payload }) {
            return asyncAndCommit(`/columns/${id}`, 'updateColumn', commit, { method: 'patch', data: payload })
        },
        fetchPosts({ commit, state }, params = {}) {
            console.log()
            const { cid, currentPage = 1, pageSize = 6 } = params
            const { loadedColumns } = state.posts
            const loadedCurentPage = (loadedColumns[cid] && loadedColumns[cid].currentPage) || 0
            if (!Object.keys(loadedColumns).includes(cid) || loadedCurentPage < currentPage) {
              return asyncAndCommit(`/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`,
                'fetchPosts', commit, { method: 'get' }, cid)
            }
          },
        fetchPost({ state,commit }, cid) {
            const currentPost = state.posts.data[cid];
            if (!currentPost||!currentPost.content)
            {
                return asyncAndCommit(`/posts/${cid}`, 'fetchPost', commit);
            }
            else
                return Promise.resolve({data:currentPost});
        },
        updatePost({ commit }, { id, payload }) {
            return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, { method: 'patch', data: payload });
        },
        createPost({ commit }, payload) {
            return asyncAndCommit('/posts', 'createPost', commit, { method: 'post', data: payload });
        },
        deletePost({commit},id){
            return asyncAndCommit(`/posts/${id}`,'deletePost',commit,{method: 'delete'});
        },
        login({ commit }, payload) {
            return asyncAndCommit('/user/login', 'login', commit, { method: 'post', data: payload });
        },
        fetchCurrentUser({ commit }) {
            return asyncAndCommit('/user/current', 'fetchCurrentUser', commit);
        },
        updateUser({ commit }, { id, payload }) {
            return asyncAndCommit(`/user/${id}`, 'updateUser', commit, { method: 'patch', data: payload })
        },
        async loginAndFetch({ dispatch }, loginData) {
            await dispatch('login', loginData);
            return dispatch('fetchCurrentUser');
        }
    },
    getters: {
        getColumns:(state)=>{
            return objToArr(state.columns.data);
        },
        getColumnById: (state) => (id: string) => {
            console.log(state.columns.data[id]);
            return state.columns.data[id];
        },
        getPostsByCid: (state) => (cid: string) => {
            return objToArr(state.posts.data).filter(post => post.column === cid)
        },
        getCurrentPost: (state) => (id: string) => {
            return state.posts.data[id]
        },
        getPostsCountByCid: (state) => (cid: string) => {
            if (state.posts.loadedColumns[cid]) {
              return state.posts.loadedColumns[cid].total
            } else {
              return 0
            }
          },
        getPostsCurrentPageByCid: (state) => (cid: string) => {
            if (state.posts.loadedColumns[cid]) {
              return state.posts.loadedColumns[cid].currentPage
            } else {
              return 0
            }
        }

    } 
})
export default store;