import { defineStore } from "pinia";
import { type ColumnProps } from "../testData";
import { type ResponseType } from ".";
import axios from "axios";
import { computed, ref } from "vue";

//以use开头
export const useTestStore2 = defineStore('test2',()=>{
    const total = ref(0)
    const data = ref<ColumnProps[]>([])
    const doubleTotal = computed(()=>total.value * 2)
    const fetchColumns = async(params:any={}) =>{
        const { currentPage = 1,pageSize = 3 } = params
        const { data:rawData } = await axios.get<ResponseType<{count:number;list:ColumnProps[]}>>(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`)
        const { count, list } = rawData.data;
        total.value = count;
        data.value = list;
        return list;
    }
    {
        return {
            total,
            data,
            doubleTotal,
            fetchColumns
        }
    }
})