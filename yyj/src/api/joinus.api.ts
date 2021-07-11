import {request as http } from "@/tool/http";
import {commonData,listModel} from '@/tool/type'

//投递简历
export function delivery(params:commonData) {
	return http('/api/front/delivery/save', params)
}
//获取职位详情信息
export function getJobInfo(id:string) {
	return http<commonData>('/api/front/jobSearch/getJobById', { id })
}
//职位亮点
export function getWalfare() {
	return http<listModel>('/api/front/welfare/list', { enable: 1 })
}
