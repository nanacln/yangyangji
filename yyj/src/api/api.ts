import {request as http,request2 } from "@/tool/http";
import {commonData,loginIn,memberModel,listModel,resumeListAll,resumeDetail} from '@/tool/type'

//投递列表
export function deliveryList(params:commonData){
  return http("/api/front/delivery/list", params);
}
// 投递数量查询
export function deliveryNumber(params:commonData) {
  return http("/api/front/delivery/count", params);
}
//用户简历模块
export function myResume(params:commonData) {
  return http<resumeListAll>("/api/front/resume/getAllByMemberId", params);
}
//附件简历列表
export function fileResumeList(id: string) {
  return request2("/api/front/resumeFile/getResumeFileByMid", {
    memberId: id
  });
}
//在线简历列表
export function resumeList(id: string) {
  return http<listModel>("/api/front/resume/getResumeByMid", { memberId: id });
}
//上传附件简历
export function uploadResume(params:FormData) {
  return http("/api/file/upload", params);
}
//在线简历创建
export function saveResume(params:commonData) {
  return http("/api/front/resume/save", params);
}
//在线简历创建
export function updateResume(params:commonData) {
  return http("/api/front/resume/update", params);
}
//获取在线简历详情
export function getResumeDetail(params:commonData) {
  return http<resumeDetail>("/api/front/resume/getInfoById", params);
}
//获取在线简历数量
export function getResumeNum(params:commonData) {
  return http("/api/front/resume/count", params);
}
//在线简历删除
export function deleteResumeById(params:commonData) {
  return http("/api/front/resume/delete", params);
}
//获取附件简历数量
export function getResumeFileNum(params:commonData) {
  return http("/api/front/resumeFile/count", params);
}
//附件简历列表
export function deleteResumeFile(params:commonData) {
  return http("/api/front/resumeFile/delete", params);
}
//登录注册模块
export function login(params:commonData) {
  return http<loginIn>("/api/front/login", params);
}
//发送短信验证码
export function sendCode(params:commonData) {
  return http("/api/front/send", params);
}

//查询用户是否存在
export function checkMember(data: commonData) {
  return http<memberModel>('/api/front/verification',data)
}