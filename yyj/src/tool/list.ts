import { reactive } from "@vue/reactivity";
import { timeFormat } from "@/tool/tool";
import {commonData} from '@/tool/type'

  function getListData<T>(request:any, params:commonData, type?:string) {

  interface dataModel{
    loading:boolean;
    totalPage:number;
    successText:string;
    data:commonData[];
    initFlag:boolean;
    reachEnd:boolean
  }
  const data = reactive<dataModel>({
    loading: true,
    totalPage: 1,
    successText: "",
    data: [],
    initFlag: true,
    reachEnd: false
  });
  const onRefresh = () => {
    if (data.totalPage > params.pageNo) {
      // (params.pageNo as number)++;
      (<number>params.pageNo )++;
      getList();
    }
  };
  async function getList() {
    const {
      body: { dataList, totalPage }
    } = await request(params);
    data.data = data.data.length < 1 ? dataList : data.data.concat(dataList);
    data.totalPage = totalPage;
    if (type === "joblist" || type === "deliveryList") {
      data.data.forEach(val => {
        if (val.jobType === 1) {
          val.jobStatusName = "全职";
        } else if (val.jobType === 2) {
          val.jobStatusName = "兼职";
        } else {
          val.jobStatusName = "实习";
        }
        if (type === "deliveryList") {
          switch (val.resumeStatus) {
            case 1:
              val.resumeStatusName = "已发送";
              break;
            case 2:
              val.resumeStatusName = "已查看";
              break;
            case 3:
              val.resumeStatusName = "不合适";
              break;
            case 0:
              val.resumeStatusName = "待查看";
          }
        }
        val.showTime = timeFormat("YYYY-mm-dd", val.createTime as number);
      });
    }
    data.loading = false;
    if (!data.totalPage || data.totalPage === params.pageNo) {
      data.loading = false;
      data.reachEnd = true;
      data.successText =
        data.totalPage && data.data.length > 6 ? "没有更多啦~" : "";
    }
    // data.successText = "刷新成功";
    data.initFlag = false;
    // debugger
  }
  return {
    data,
    onRefresh,
    getList
  };
}
export default getListData;
