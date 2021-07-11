import {listModel} from './common'
export type videoResultModel={
  businessSystemPromo:string,
  memorabiliaPromo: string
  name:string
}[]

export interface businessResult{
  aboutUs: string
  id: number
  imgPath: string
  name:string
}
export type businessResultList=businessResult[]
export type businessResultModel=listModel<businessResult>

export type qgfxResult{
  regionId:string
  regionName:string
  schoolList:{
    cityId:number
    intro:string
    name:string
  }[]
}[]