
export const name='commonType'
export interface listModel<T extends any>{
  dataList:T[]
  pageNo?: number
  pageSize?: number
  totalNum?: number
  totalPage?: number
}



//我的项目
export type paramList={
  pageSize:number,
	pageNo:number
}
export type growupRecordArr={
  role:string,
  content:string,
  imgs:string,
  comments?:string
}[]
export interface pageList<T>{
  list:T
  count:number
  pageNo:number
  pageSize:number
  totalPage:number
}
export type recoredSaveModel={
  role:string,
  content:string,
  imgs:string,
  
}

export type growupRecordListModel=pageList<growupRecordArr>
export type registerInfo={
  username:string,
  password:string,
  role:string,
  nickName:string
}
export type loginInfo={
  password:string,
  username:string
}
export type userInfo={
  role:string,
  nickName:string,
  userId:string,
  avatar?:string
}
export type relativerInfo={
  nickName:string,
  role:string,
  userId:string,
  avatar?:string
}[]

export interface BaseResponse<T> {
  code: number
  data: T
  msg?: string,
  total?:number
}
export type updateUserInfo={
  role:string,
  userId:string,
  nickName:string,
}
export type commentsModel={
  userId:string,
  id:number,
  comments:string,
  nickName:string
}
export interface ImageFile{
  content:string
  file:File
  message:string
  status:string
}

