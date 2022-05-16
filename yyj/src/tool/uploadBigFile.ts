import axios from 'axios'
import SparkMD5 from 'spark-md5'
import { nextTick } from 'vue'
import { Toast } from 'vant'
interface stateModel {
  showPicker: boolean
  form: {
    role: string;
    userId: string;
    nickName: string;
    videoUrl:string
  },
  avatar:string,
  rate:number,
  showUploadProgress:boolean,
  currentRate:number
}
function uploadBigHook(state:stateModel) {
  let ext = '',
    fileArr:Array<Blob> = [],
    uploadChuncks = [],
    md5Val = ''
  const alreadyUpChuncks:{[propName:number]:number}={}
  let startTime=0
  async function uploadBig(file:any) {
    ext = file.name.substr(file.name.lastIndexOf('.') + 1)
    fileArr = sliceFile(file)
    md5Val = await md5File([file]) as string
    await checkUpload()
    //多个请求并发
    ManyUploadSlice()
    //一次上传一个请求
    // startTime=new Date().getTime()
    // uploadSlice()
  }
  // 切割文件
  function sliceFile(file:Blob) {
    const files = [];
    const chunkSize = 1000 * 1024;
    for (let i = 0; i < file.size; i += chunkSize) {
      const end = i + chunkSize >= file.size ? file.size : i + chunkSize;
      const currentFile = file.slice(i, end > file.size ? file.size : end);
      files.push(currentFile);
    }
    return files;
  }
  // 获取文件md5值
  function md5File(files:Array<Blob>) {
    const spark = new SparkMD5.ArrayBuffer();
    let fileReader=null as unknown as FileReader;
    let i = 0
    for (; i < files.length; i++) {
      fileReader = new FileReader();
      fileReader.readAsArrayBuffer(files[i]);
    }
    return new Promise((resolve) => {
      fileReader.onload = function (e) {
        spark.append((e.target as FileReader).result);
        if (i == files.length) {
          resolve(spark.end());
        }
      };
    });
  }
  async function checkUpload() {
    const param={
      type:'check',
      current:1,
      md5Val,
      total:1
    }
    const data = await axios({
      url: `/api/bigFileUpload`,
      method: "post",
      data: param,
    });
    if (data.data.code === 200) {
      uploadChuncks = data.data.data.chunk
      uploadChuncks.forEach((e:number)=>{
        alreadyUpChuncks[e]=1
      })
    }
  }
   function ManyUploadSlice(){
    let mergeFlag=false
    let preIndex=-1
    let NextIndex=0
    const len=5<fileArr.length?5:fileArr.length
    startTime=new Date().getTime()
    console.log('start',startTime);
    for(let i=0;i<len&&!mergeFlag;i++){
      singleUpload(++preIndex,i)
    }
    function singleUpload(chunkIndex:number,i:number){
      if(chunkIndex===fileArr.length){
        mergeFlag=true
        NextIndex=0
        preIndex=-1
        mergeFile()
        return
      }
      if (alreadyUpChuncks[chunkIndex ]) {
        ++chunkIndex;
        ++preIndex
        ++NextIndex
        state.rate = Math.round(((NextIndex ) / fileArr.length) * 100)
        singleUpload(preIndex,i )
        return
      }
      const formData = new FormData();
      formData.append("file", fileArr[chunkIndex]);
      formData.append('type','upload')
      formData.append('current',chunkIndex+'')
      formData.append('total',fileArr.length+'')

       axios({
        url: `/api/bigFileUpload?md5Val=${md5Val}`,
        method: "post",
        data: formData,
      }).then(data=>{
        if (data.data.code == 200) {
          if (preIndex < fileArr.length - 1) {
            ++NextIndex
            state.rate = Math.round(((NextIndex ) / fileArr.length) * 100)
            singleUpload(++preIndex,i);
          } else{
            ++NextIndex
            if(NextIndex===fileArr.length){
              mergeFlag=true
              NextIndex=0
              preIndex=-1
              mergeFile()
            }else{
              state.rate = Math.round(((NextIndex ) / fileArr.length) * 100)
            }
            
          }
          console.log(chunkIndex,999999,i,NextIndex);
          
        }
      });

      
    }
  }
  // async function uploadSlice(chunkIndex = 0) {
    
  //   if(chunkIndex===fileArr.length-1){
  //     mergeFile()
  //     return
  //   }
  //   if (alreadyUpChuncks[chunkIndex ]) {
  //     ++chunkIndex;
  //     state.rate = Math.round(((chunkIndex ) / fileArr.length) * 100)
  //     uploadSlice(chunkIndex + 1)
  //     return
  //   }
  //   const formData = new FormData();
  //   formData.append("file", fileArr[chunkIndex] as Blob);
  //   formData.append('type','upload')
  //   formData.append('current',chunkIndex+'')
  //   formData.append('total',fileArr.length +'')

  //   const data = await axios({
  //     url: `/api/bigFileUpload?md5Val=${md5Val}`,
  //     method: "post",
  //     data: formData,
  //   });

  //   if (data.data.code == 200) {
  //     if (chunkIndex < fileArr.length - 1) {
  //       ++chunkIndex;
  //       state.rate = Math.round(((chunkIndex ) / fileArr.length) * 100)
  //       uploadSlice(chunkIndex);
  //     } else {
  //       mergeFile();
  //     }
  //   }
  // }

  async function mergeFile() {
    const param={
      type:'merge',
      ext,
      md5Val,
      total:fileArr.length
    }
    const data = await axios(
      {
        url:`/api/bigFileUpload`,
        method:'POST',
        data:param
      }
    );
    if (data.data.code == 200) {
      state.rate = 100
      state.form.videoUrl = data.data.data.url
      state.showUploadProgress = false
      console.log('end',new Date().getTime()-startTime);
      nextTick(() => {
        state.currentRate = 0
        state.rate = 0
      })
    } else {
      Toast(data.data.info);
    }
  }
  return {
    uploadBig,
  }
}




export default uploadBigHook