export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?:ImageProps;
  description?:string;
}
export interface ColumnProps {
    _id: string;
    title: string;
    avatar?: ImageProps;
    description: string;
}
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps;
  createdAt?: string;
  column: string;
  author?: string | UserProps;
  isHTML?: boolean;
}
export interface RuleProp {
  type: 'required' | 'email' | 'password' | 'custom';
  message: string;
  validator?: () => boolean;
}
export type TagType = 'input' | 'textarea';
export type MessageType = 'success' | 'error' | 'default';
export type EditCategory = 'profile' | 'column' | 'init'