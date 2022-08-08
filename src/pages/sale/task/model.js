import { querySaleTaskList, queryChannelList, isTaskStatus, queryTaskType, copyTask, deleteTask, queryTaskInfo } from '@/services/saleTask';
const Model = {
  namespace: 'saleTaskManage',
  state: {
    saleTaskList: [],// 销售任务列表数组
    channelList: [],//渠道列表
    taskType: [],// 任务分类
    pageNo: 0,
    pageTotal: 0,
  },
  effects: {
    // 获取销售任务列表
    *querySaleTaskList({ payload, callback }, { call, put }) {
      const response = yield call(querySaleTaskList, payload);
      yield put({
        type: 'setQuerySaleTaskList',
        payload:response,
      });
      callback && callback(response)
    },
    // 获取所属渠道
    *queryChannelList({ payload, callback }, { call, put }) {
      let response = yield call(queryChannelList, payload);
      yield put({
        type: 'setQueryChannelList',
        payload: response
      })
    },
    // 销售任务立即开始 && 销售任务立即结束 &&  销售任务发布
    *isTaskStatus({ payload, callback }, { call, put }) {
      let response = yield call(isTaskStatus, payload);
      callback && callback(response)
    },
    // 销售任务任务分类
    *queryTaskType({ payload, callback }, { call, put }) {
      let response = yield call(queryTaskType, payload);
      yield put({
        type: 'setQueryTaskType',
        payload: response
      })
    },
    // 销售任务复制
    *copyTask({ payload, callback }, { call, put }) {
      let response = yield call(copyTask, payload);
      callback && callback(response)
    },
    // 销售任务 删除
    *deleteTask({ payload, callback }, { call, put }) {
      let response = yield call(deleteTask, payload);
      callback && callback(response)
    },
    // 销售任务 查询任务信息
    *queryTaskInfo({ payload, callback }, { call, put }) {
      let response = yield call(queryTaskInfo, payload);
      callback && callback(response)
    },
  },
  reducers: {
    // 获取销售任务列表
    setQuerySaleTaskList(state, action) {
      let pageInfoVO = action.payload.body.pageInfoVO
      state.pageTotal = pageInfoVO.totalCount
      state.saleTaskList = action.payload.body.taskList ||  []
      return { ...state};
    },
    // 获取所属渠道
    setQueryChannelList(state, action) {
      return { ...state, channelList: action.payload.body.data.channelList}
    },
    // 销售任务任务分类
    setQueryTaskType(state, action) {
      return { ...state, taskType: action.payload.body}
    }
  },
};
export default Model;
