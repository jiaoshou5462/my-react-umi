import {echoActivityFive,updateActivityStatus,buyCheaperFinish} from "@/services/activity";
const Model = {
  namespace: 'activityFinish',
  state: {
  },
  effects: {
    *echoActivityFive({ payload,callback }, { put,call }){
      let response = yield call(echoActivityFive,payload);
      callback && callback(response)
    },
     /*修改活动状态*/
     *updateActivityStatus({payload, callback},{put,call}){
      let response = yield call(updateActivityStatus, payload)
      callback && callback(response)
    },
    /*修改活动状态*/
    *buyCheaperFinish({payload, callback},{put,call}){
      let response = yield call(buyCheaperFinish, payload)
      callback && callback(response)
    },
  },
  reducers: {

  },
};
export default Model;
