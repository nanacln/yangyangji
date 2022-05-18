import axios ,{ AxiosInstance }from 'axios'
import {commonData} from '@/types/type'
// import { stringify } from 'qs'

const http: AxiosInstance = axios.create({
	headers: {
		'Content-Type': 'application/json;charset=UTF-8;charset=UTF-8',
	},
	// transformRequest: [
	// 	function(data) {
	// 		return stringify(data)
	// 	},
	// ],
})
// http.interceptors.request.use(config => {
// 	// config.headers['Content-Type'] = 'application/json;charset=UTF-8'
// 	// config.data = JSON.stringify(config.data)
// 	return config
// })
interface BaseResponse<T> {
  code: number
  data: T
  msg?: string,
  total?:number
}
const request = <T>(url:string,data:commonData|FormData): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    http.post<BaseResponse<T>>(url,data).then(
      res => {
        resolve(res.data)
      },
      err => {
        
        reject(err)
      }
    )
  })
}
const request2 = (url:string,data:commonData|FormData): Promise<commonData[]> => {
  return new Promise((resolve, reject) => {
    http.post<commonData[]>(url,data).then(
      res => {
        resolve(res.data)
      },
      err => {
        
        reject(err)
      }
    )
  })
}
const httpPost = <T>(url:string,data:commonData|FormData): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    http.post<BaseResponse<T>>(url,data).then(
      res => {
        resolve(res.data)
      },
      err => {
        
        reject(err)
      }
    )
  })
}
const httpGet = <T>(url:string,data:commonData): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    http.get<BaseResponse<T>>(url,{params:data}).then(
      res => {
        resolve(res.data)
      },
      err => {
        
        reject(err)
      }
    )
  })
}
export {
  request,
  request2,
  httpPost,
  httpGet
}
