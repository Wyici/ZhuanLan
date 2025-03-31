import{onMounted, onUnmounted, ref, type Ref} from 'vue'
const useClickOutside = (elementRef: Ref<null | HTMLElement>) =>
{
    const isClickOutside = ref(false);
    const handler = ( e : MouseEvent) => {
    if(elementRef.value)
        {//先判断该DOM节点是否存在
            if(elementRef.value.contains(e.target as HTMLElement))//如果该DOM节点包含当前点击的节点
            {
                isClickOutside.value = false;
            }
            else
            {
                isClickOutside.value = true;
            }
        }
    }
    onMounted(() => document.addEventListener('click',handler));
    onUnmounted(() => document.removeEventListener('click',handler));
    return isClickOutside;
}

export default useClickOutside;