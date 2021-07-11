import {request as http } from "@/tool/http";
import {commonData,listModel} from '@/tool/type'
import {videoResultModel,businessResultModel,qgfxResult} from '@/types/aboutus'


export function fenxiaoList(params:commonData) {
	return http<qgfxResult>('/api/font/regionCity/getRegionCityByType', params)
}
export function fenxiaoDetail(id:string) {
	return http<commonData>('/api/font/regionCity/getById', { id })
}
//大事记
export function bigEventList() {
	return http<commonData[]>('/api/front/memorabiliaInfo/list', {
		pageNo: 1,
		pageSize: 100,
		enable: 1,
	})
}
//工作列表
export function jobList(params:commonData) {
	return http('/api/front/jobSearch/list', params)
}
//机构类型
export function organizaType() {
	return http<commonData[]>('/api/front/organizaType/list', { enable: 1 })
}
//职位类别
export function category() {
	return http<listModel>('/api/front/categoryType/list', { enable: 1 })
}

//宣讲会
export function lecture(params:commonData) {
	return http('/api/front/lecture/list', params)
}
//宣讲会详情
export function lectureDetail(id:string) {
	return http<commonData>('/api/front/lecture/getById', { id })
}
//空中宣讲会
export function onlineLecture(params:commonData) {
	return http('/api/front/airLecture/list', params)
}
//报名
export function sign(params:commonData) {
	return http('/api/font/subscribe/save', params)
}
//业务体系列表
export function business() {

	return http<businessResultModel>('/api/front/business/list', { enable: 1 })
}
//业务体系详情
export function businessDetail(id:string) {
	return http<commonData>('/api/front/business/getById', { id })
}
//宣传片
export function videoList() {
	return http<videoResultModel>('/api/front/trailer/list', {})
}
//投递简历
export function delivery(params:commonData) {
	return http('/api/front/delivery/save', params)
}
