
import {
  posterCategoryManageList,
  saveOrUpdatePosterCategory,
  posterCategoryOrder,
  deletePosterCategory,
  saveOrUpdatePoster,
  deletePoster,
  posterDetail,
  posterLists,
  saveByPosterStatus,
  posterCategoryReplace
} from "@/services/team"
const model = {
  namespace: 'propagandPoster',
  //默认数据
  state: {
    channelList: [], //渠道
    allCategoryList: [],
  },
  //处理异步事件
  effects: {

    /* 海报列表 */
    *posterLists({ payload, callback }, { put, call }) {
      let response = yield call(posterLists, payload)
      callback && callback(response)
    },

    /* 修改分类 */
    *posterCategoryReplace({ payload, callback }, { put, call }) {
      let response = yield call(posterCategoryReplace, payload)
      callback && callback(response)
    },

    /* 批量上下架 */
    *saveByPosterStatus({ payload, callback }, { put, call }) {
      let response = yield call(saveByPosterStatus, payload)
      callback && callback(response)
    },

    /* 海报详情 */
    *posterDetail({ payload, callback }, { put, call }) {
      let response = yield call(posterDetail, payload)
      callback && callback(response)
    },


    /* 删除海报 */
    *deletePoster({ payload, callback }, { put, call }) {
      let response = yield call(deletePoster, payload)
      callback && callback(response)
    },

    /* 保存修改海报 */
    *saveOrUpdatePoster({ payload, callback }, { put, call }) {
      let response = yield call(saveOrUpdatePoster, payload)
      callback && callback(response)
    },

    /* 删除海报分类 */
    *deletePosterCategory({ payload, callback }, { put, call }) {
      let response = yield call(deletePosterCategory, payload)
      callback && callback(response)
    },

    /* 海报分类列表 */
    *posterCategoryManageList({ payload, callback }, { put, call }) {
      let response = yield call(posterCategoryManageList, payload)
      callback && callback(response)
    },

    /* 新增修改海报分类 */
    *saveOrUpdatePosterCategory({ payload, callback }, { put, call }) {
      let response = yield call(saveOrUpdatePosterCategory, payload)
      callback && callback(response)
    },


    /*海报排序-详情*/
    *posterCategoryOrder({ payload, callback }, { put, call }) {
      let response = yield call(posterCategoryOrder, payload)
      callback && callback(response)
    },
  },
  //处理同步事件
  reducers: {

  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
