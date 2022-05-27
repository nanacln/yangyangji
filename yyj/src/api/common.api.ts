import {httpGet,httpPost } from "@/tool/http";
import {
  paramList,
  growupRecordListModel,
  recoredSaveModel,
  registerInfo,
  loginInfo,
  userInfo,
  relativerInfo,
  BaseResponse,
  updateUserInfo,
  commentsModel
} from '@/types/common'


export function growuprecordList(params:paramList):Promise<BaseResponse<growupRecordListModel>>{
  return httpGet<growupRecordListModel>("/api/record/list", params);
}
export function growuprecordSave(params:recoredSaveModel):Promise<BaseResponse<string>>{
  return httpPost('/api/record/add',params)
}
export function growuprecordDelete(params:{id:number}):Promise<BaseResponse<string>>{
  return httpPost('/api/record/delete',params)
}
export function growuprecordlike(params:{id:number,userId:number,userName:string}):Promise<BaseResponse<{userId:number,userName:string}[]>>{
  return httpPost('/api/record/like',params)
}
export function updateComments(params:commentsModel):Promise<BaseResponse<string>>{
  return httpPost('/api/record/comments',params)
}

export function imgUpload(params:FormData):Promise<BaseResponse<string>>{
  return httpPost('/api/upload/file',params)
}
export function register(params:registerInfo):Promise<BaseResponse<string>>{
  return httpPost('/api/lr/register',params)
}
export function login(params:loginInfo):Promise<BaseResponse<userInfo>>{
  return httpPost<userInfo>('/api/lr/login',params)
}
export function userList(userId:string):Promise<BaseResponse<relativerInfo>>{
  return httpGet<relativerInfo>('/api/user/list',{userId})
}
export function updateUser(params:updateUserInfo):Promise<BaseResponse<string>>{
  return httpPost('/api/user/update',params)
}
export function updateUserAvatar(params:{file:string,userId:string}):Promise<BaseResponse<string>>{
  return httpPost<string>('/api/upload/userAvatar',params)
}
export function videoUpload(params:FormData):Promise<BaseResponse<string>>{
  return httpPost('/api/upload/video',params)
}
