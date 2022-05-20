export type commonData={
  [propName: string]:string|number
}

export type stringType={
  [propName: string]:string
}
export type msgtype = {
  type: string
  content: any
  userId?: string
  toUserId?: string,
  data?:msgtype[]
}
export type stateModel = {
  msg: string
  name: string
  userId: string
  chatArr: msgtype[]
  unreadObj: any,
  avatarObj:any,
  avatar:string
}
export interface commentsModel{
  userId:string,
  id:number,
  comments:string
}
export type aa={
  name:string
}
export type stuInfo={
  name:string,
  age:number,
  grade:string
}
export type eri={
  dd:string;
  sd:number
}