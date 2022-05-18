
export const name='commonType'
// export interface listModel<T extends any>{
//   dataList:T[]
//   pageNo?: number
//   pageSize?: number
//   totalNum?: number
//   totalPage?: number
// }

//我的项目
type paramList={
  pageSize:number,
	pageNo:number
}
type growupRecordArr={
  role:string,
  content:string,
  imgs:string,
  comments?:string,
  likes:{userId:number,userName:string}[],
  like:boolean
}[]
interface pageList<T>{
  list:T
  count:number
  pageNo:number
  pageSize:number
  totalPage:number
}
type recoredSaveModel={
  role:string,
  content:string,
  imgs:string,
  
}

type growupRecordListModel=pageList<growupRecordArr>
type registerInfo={
  username:string,
  password:string,
  role:string,
  nickName:string
}
type loginInfo={
  password:string,
  username:string
}
type userInfo={
  role:string,
  nickName:string,
  userId:string,
  avatar?:string
}
type relativerInfo={
  nickName:string,
  role:string,
  userId:string,
  avatar?:string
}[]

interface BaseResponse<T> {
  code: number
  data: T
  msg?: string,
  total?:number
}
type updateUserInfo={
  role:string,
  userId:string,
  nickName:string,
}
type commentsModel={
  userId:string,
  id:number,
  comments:string,
  nickName:string
}
interface ImageFile{
  content:string
  file:File
  message:string
  status:string
}

export type {
  paramList,
  growupRecordArr,
  pageList,
  recoredSaveModel,
  growupRecordListModel,
  registerInfo,
  loginInfo,
  userInfo,
  relativerInfo,
  BaseResponse,
  updateUserInfo,
  commentsModel,
  ImageFile
}