import { h , render} from "vue";
import { type MessageType } from "../testData";
import Message from "./Message.vue";
const createMessage = (message:string, type:MessageType, timeout?:number) => {
    const messageVnode = h(Message,{message,type});
    const mountNode = document.createElement('div');
    document.body.appendChild(mountNode);
    render(messageVnode,mountNode);
    const destory = () => {
        render(null, mountNode);
        document.body.removeChild(mountNode)
    }
    if(timeout)
    {
        setTimeout(()=>{
            destory();
        },timeout);
    }
    return {
        destory
    }
}
export default createMessage;