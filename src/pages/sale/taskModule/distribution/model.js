import { saleImportExcel, queryTaskSaleKpiList, queryTaskKpiWeight, onDownloadFile, downloadTaskExcel, deleteTaskId } from '@/services/saleTask';
const Model = {
  namespace: 'saleDistribution',
  state: {
    taskSaleKpiList : [],// 销售列表
    taskSaleKpiInfo : [],// 销售数据
    taskKpiInfo: [], // kpi显示数据
  },
  effects: {
    // 销售任务导入销售账户
    *saleImportExcel({ payload, callback }, { call, put }) {
      let response = yield call(saleImportExcel, payload);
      callback && callback(response)
    },
    // 销售任务 分配员工设置kpi
    *queryTaskKpiWeight({ payload, callback }, { call, put }) {
      let response = yield call(queryTaskKpiWeight, payload);
      callback && callback(response)
    },
    /*下载excel*/
    *onDownloadFile({payload, callback},{put,call}){
      let response = yield call(onDownloadFile, payload)
      callback && callback(response)
    },
    // 销售任务下载错误信息文件
    *downloadTaskExcel({payload, callback},{put,call}){
      console.log(payload)
      let response = yield call(downloadTaskExcel, payload)
      callback && callback(response)
    },
    // 销售任务查询销售列表
    *getTaskSaleKpiList({ payload, callback }, { call, put }) {
      let response = yield call(queryTaskSaleKpiList, payload);
      callback && callback(response)
    },
    // 销售任务 根据taskiD删除
    *deleteTaskId({ payload, callback }, { call, put }) {
      let response = yield call(deleteTaskId, payload);
      callback && callback(response)
    },
  },
  reducers: {
    
  },
};
export default Model;