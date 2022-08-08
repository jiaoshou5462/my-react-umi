
import {
  crmProCategoryList,
  saveProCategory,
  updateCategory,
  deleteCategory,
  getSupGoodsPage,
  getChannelSupGoodDetail,
  findByChannelId,
  getDictionary,
  saveProduct,
  getProductInfo,
  getListProductData,
  crmsDel,
  customerChannelList
} from "@/services/team"
const model = {
  namespace: 'productMange',
  //默认数据
  state: {
    channelList: [], //渠道
    allCategoryList: [],
  },
  //处理异步事件
  effects: {

    /* 获取所属渠道 */
    *customerChannelList({ payload, callback }, { put, call }) {
      let response = yield call(customerChannelList, payload)
      callback && callback(response)
    },

    /* 删除 */
    *crmsDel({payload, callback},{put,call}){
      let response = yield call(crmsDel, payload)
      callback && callback(response)
    },


    /* 列表 */
    *getListProductData({payload, callback},{put,call}){
      let response = yield call(getListProductData, payload)
      callback && callback(response)
    },

    /* 详情 */
    *getProductInfo({payload, callback},{put,call}){
      let response = yield call(getProductInfo, payload)
      callback && callback(response)
    },

    /* 保存产品 */
    *saveProduct({payload, callback},{put,call}){
      let response = yield call(saveProduct, payload)
      callback && callback(response)
    },

    /* 查询订单类型 */
    *getDictionary({payload, callback},{put,call}){
      let response = yield call(getDictionary, payload)
      callback && callback(response)
    },

    /* 获取所属渠道 */
    *findByChannelId({payload, callback},{put,call}){
      let response = yield call(findByChannelId, payload)
      callback && callback(response)
    },


    /*关联的产品下拉框-详情*/
    *getChannelSupGoodDetail({payload, callback},{put,call}){
      let response = yield call(getChannelSupGoodDetail, payload)
      callback && callback(response)
    },

    /*关联的产品下拉框*/
    *getSupGoodsPage({payload, callback},{put,call}){
      let response = yield call(getSupGoodsPage, payload)
      callback && callback(response)
    },

    /*编辑分类*/
    *updateCategory({payload, callback},{put,call}){
      let response = yield call(updateCategory, payload)
      callback && callback(response)
    },

    /*查询全部分类*/
    *deleteCategory({payload, callback},{put,call}){
      let response = yield call(deleteCategory, payload)
      callback && callback(response)
    },

    /*查询全部分类*/
    *crmProCategoryList({payload, callback},{put,call}){
      let response = yield call(crmProCategoryList, payload)
      callback && callback(response)
    },
     /* 新增分类 */
    *saveProCategory({payload, callback},{put,call}){
      let response = yield call(saveProCategory, payload)
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
