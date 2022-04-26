import axios from 'axios'
import SparkMD5 from 'spark-md5'
import { nextTick } from 'vue'
import { Toast } from 'vant'
function uploadBigHook(state) {
  let ext = ''
  let fileArr = []
  let uploadChuncks = []
  let md5Val = ''

  async function uploadBig(file) {

    ext = file.name.substr(file.name.lastIndexOf('.') + 1)
    fileArr = sliceFile(file)
    md5Val = await md5File([file])
    await checkUpload()
    uploadSlice()
  }
  // 切割文件
  function sliceFile(file) {
    const files = [];
    const chunkSize = 500 * 1024;
    for (let i = 0; i < file.size; i += chunkSize) {
      const end = i + chunkSize >= file.size ? file.size : i + chunkSize;
      let currentFile = file.slice(i, end > file.size ? file.size : end);
      files.push(currentFile);
    }
    return files;
  }
  // 获取文件md5值
  function md5File(files) {
    const spark = new SparkMD5.ArrayBuffer();
    let fileReader;
    for (var i = 0; i < files.length; i++) {
      fileReader = new FileReader();
      fileReader.readAsArrayBuffer(files[i]);
    }
    return new Promise((resolve) => {
      fileReader.onload = function (e) {
        spark.append(e.target.result);
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
    let data = await axios({
      url: `/api/bigFileUpload`,
      method: "post",
      data: param,
    });
    if (data.data.code === 200) {
      uploadChuncks = data.data.data.chunk
    }
  }
  async function uploadSlice(chunkIndex = 0) {
    if(chunkIndex===fileArr.length-1){
      mergeFile()
      return
    }
    if (uploadChuncks.includes(chunkIndex + '')) {
      
      uploadSlice(chunkIndex + 1)
      return
    }
    let formData = new FormData();
    formData.append("file", fileArr[chunkIndex]);
    formData.append('type','upload')
    formData.append('current',chunkIndex)
    formData.append('total',fileArr.length)

    let data = await axios({
      url: `/api/bigFileUpload?md5Val=${md5Val}`,
      method: "post",
      data: formData,
    });

    if (data.data.code == 200) {
      if (chunkIndex < fileArr.length - 1) {
        state.rate = Math.round(((chunkIndex + 1) / fileArr.length) * 100)
        ++chunkIndex;
        uploadSlice(chunkIndex);
      } else {
        mergeFile();
      }
    }
  }

  async function mergeFile() {
    const param={
      type:'merge',
      ext,
      md5Val,
      total:fileArr.length
    }
    let data = await axios(
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