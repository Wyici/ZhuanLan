import createMessage from "./components/createMessage";
import { type ColumnProps, type ImageProps, type UserProps} from "./testData";

export function generateFitUrl(data: ImageProps, width: number, height: number, format = ['m_pad']) {
  if (data && data.url) {
    const formatStr = format.reduce((prev, current) => {
      return current + ',' + prev
    }, '')
    data.fitUrl = data.url + `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`
  }
}

export function addColumnAvatar(data: ColumnProps | UserProps, width: number, height: number) {
  if(data === null){
    console.log('data为null')
  }
  if (data.avatar) {
    generateFitUrl(data.avatar,width,height);
  }else{
    const parseCol = data as ColumnProps;
    data.avatar = {
      fitUrl: parseCol.title ? 
              new URL('../assets/column.jpg', import.meta.url).href
            : new URL('../assets/avatar.jpg', import.meta.url).href
    }
  }
}

interface CheckCondition{
    format?: string[];
    size?: number;
}
type ErrorType = 'size' | 'format' | null;
export function beforeUploadCheck(file:File,condition:CheckCondition){
    const {format, size} = condition;
    const isValidFormat = format ? format.includes(file.type) : true;
    const isValidSize = size ? (file.size / 1024 / 1024 < size) : true;
    let error:ErrorType = null;
    if(!isValidFormat) error = 'format';
    if(!isValidSize) error = 'size';
    return {
        passed: isValidFormat && isValidSize,
        error
    }
}
export const commonUploadCheck = (file: File) => {
  const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
  const { passed, error } = result
  if (error === 'format') {
    createMessage('上传图片只能是 JPG/PNG 格式!', 'error', 2000)
  }
  if (error === 'size') {
    createMessage('上传图片大小不能超过 1Mb', 'error', 2000)
  }
  return passed
}
export const arrToObj = <T extends{_id?:string}>(arr:Array<T>) => {
  return arr.reduce((prev,current)=>{
    if(current._id){
      prev[current._id] = current
    }
    return prev
  },{} as {[key:string]:T})
}

export const objToArr = <T>(obj:{[key:string]:T}) => {
  return Object.keys(obj).map(key => obj[key]);
}