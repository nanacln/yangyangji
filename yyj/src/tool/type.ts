export type commonData={
  [propName: string]:string|number
}
export type stringType={
  [propName: string]:string
}
export type loginIn={
  memberId?:string|number,
  id?:string|number,
  realName:string
}
export type memberModel={
  status:number
}
// export type resumeDelete={ id: string, memberId: string, fileName?: string }
// export type resumeModel={
//   id:number,

// }
export type listModel={
  dataList:commonData[]
}
export type resumeListAll={
  resumeList:commonData[],
  resumeFileList:commonData[]
}
export type showJobPop='cityName'|'jigouName'|'jobTypeName'
export type bolleanCollections={[propName:string]:boolean}
export type stringCollections={
  [propName:string]:string
}
export type fileObj={
  name:string,
  file:any,
}
export type fourType='resumeName'|'assessment'|'careerPlan'|'certificate'
export type resumeDetail={
  educationList:commonData[],
  experienceList:commonData[],
  projectList:commonData[],
  [propName:string]:number|string|commonData[]
}
export type msgtype = {
  type: string
  content: any
  userId?: string
  toUserId?: string,
  data?:msgtype[]
}