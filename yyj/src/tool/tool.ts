import {stringType} from '@/tool/type'
export function dateFormat(fmt:string, date:Date):string {
  let ret;
  const opt:stringType = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (const k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
}
export function timeFormat(fmt:string, time:number):string {
  let ret;
  const date = new Date(time);
  const opt:stringType = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (const k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
}
export function resolveFileName(url:string):string {
  const arr = url.split(".")[0].split("/");
  return arr[arr.length - 1];
}
export function getSuffix(url:string):string {
  const arr = url.split(".");
  return arr[arr.length - 1];
}

const imagePrefix = "https://hr.xhd.cn";

export { imagePrefix };


//我的项目
export function setLocalStorage(name:string,value:string):void{
  localStorage.setItem(name,value)
}
export function getLocalStorage(name:string):string{
  return localStorage.getItem(name) as string
}