import mitt from "mitt";
//让事件和对应的callback一一对应
type Events = {
    'form-item-created': () => boolean
}
export const emitter = mitt<Events>();//新建一个emitter监听器，实例化mitt时，作为泛型传递过去
