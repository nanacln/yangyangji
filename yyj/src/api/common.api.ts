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
  return httpGet<growupRecordListModel>("/api/recordList", params);
}
export function growuprecordSave(params:recoredSaveModel):Promise<BaseResponse<string>>{
  return httpPost('/api/record/add',params)
}
export function updateComments(params:commentsModel):Promise<BaseResponse<string>>{
  return httpPost('/api/record/comments',params)
}

export function imgUpload(params:FormData):Promise<BaseResponse<string>>{
  return httpPost('/api/upload',params)
}
export function register(params:registerInfo):Promise<BaseResponse<string>>{
  return httpPost('/api/register',params)
}
export function login(params:loginInfo):Promise<BaseResponse<userInfo>>{
  return httpPost<userInfo>('/api/login',params)
}
export function userList():Promise<BaseResponse<relativerInfo>>{
  return httpGet<relativerInfo>('/api/userlist',{})
}
export function updateUser(params:updateUserInfo){
  return httpPost('/api/updateUser',params)
}
export function updateUserAvatar(params:any){
  return httpPost<string>('/api/uploadUserAvatar',params)
}
