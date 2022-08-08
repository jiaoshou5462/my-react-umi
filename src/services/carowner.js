
import {api} from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js'; //环境变量


/*获取全部可选组件*/
export const queryAllComponentList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatH5Page/queryAllComponentList`,
    ...payload
  })
};
export const queryPageComponentList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatH5Page/queryPageComponentList`,
    ...payload
  })
};
//获取列表
export const getPageList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatH5Page/newPageList`,
    ...payload
  })
};
// 保存组件
export const saveComponent = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatH5Page/saveComponent`,
    ...payload
  })
};

// 删除组件
export const deleteComponent = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatH5Page/deleteComponent`,
    ...payload
  })
};
//保存全部组件
export const sortComponent = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatH5Page/sortComponent`,
    ...payload
  })
};
// 下拉数据（内容1,2）
export const queryPageList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatH5Page/queryPageList`,
    ...payload
  })
};
/*查询所有渠道接口*/
export const getAllChannel = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/getBalanceChannelList`,
    ...payload
  })
};
// 编辑名称
export const updatePageName = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatH5Page/updatePage`,
    ...payload
  })
};
//新增页面
export const addPage = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatH5Page/savePage`,
    ...payload
  })
};
//删除页面
export const delPage = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatH5Page/delPage`,
    ...payload
  })
};
//页面搭建-启用停用
export const updEnableStatus = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatH5Page/updEnableStatus`,
    ...payload
  })
};

//发布
export const publishPage = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatH5Page/publishPage?source=new`,
    ...payload
  })
};
//设为主页
export const updatePageForHome = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatH5Page/updatePageForHome`,
    ...payload
  })
};
//判断是否已有主页 ?pageChannelId=422
export const existHomeFlag = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatH5Page/existHomeFlag`,
    ...payload
  })
};


//拜访跟进-查询销售人员下拉列表
export const saleList = (payload) => {
  return createApi({
    url: `${api}/api/we-work/visitRecord/saleList`,
    ...payload
  })
};
//拜访跟进-获取客户名称列表
export const queryChannelList = (payload) => {
  return createApi({
    url: `${api}/api/we-work/visitRecord/queryChannelList`,
    ...payload
  })
};
//拜访跟进-获取列表
export const pageList = (payload) => {
  return createApi({
    url: `${api}/api/we-work/visitRecord/pageList`,
    ...payload
  })
};
//拜访跟进-根据拜访记录ID查询拜访记录详情
export const detail = (payload) => {
  return createApi({
    url: `${api}/api/we-work/visitRecord/detail`,
    ...payload
  })
};

// E养车保养对接(漆面)列表
export const raiseCarPaintList = (payload) => {
  return createApi({
    url: `${api}/api/maintService/maintOrder/pageList`,
    ...payload
  })
}
// E养车保养对接(漆面)-根据订单id查询漆面订单详情
export const raiseCarPaintDetail = (payload) => {
  return createApi({
    url: `${api}/api/maintService/maintOrder/queryById`,
    ...payload
  })
}
// E养车保养对接(漆面)-查询门店下拉列表
export const raiseCarPaintSelectList = (payload) => {
  return createApi({
    url: `${api}/api/maintService/maintOther/queryList`,
    ...payload
  })
}
// E养车保养对接(备注列表)
export const raiseCarPaintRemarksList = (payload) => {
  return createApi({
    url: `${api}/api/maintService/common/pageRemarkList`,
    ...payload
  })
}
// E养车保养对接(备注新增)
export const addRaiseCarPaintRemarks = (payload) => {
  return createApi({
    url: `${api}/api/maintService/common/insertRemark`,
    ...payload
  })
}
/*获取分类*/
export const getAllGoodClass= (payload) =>{
  return createApi({
    url:`${api}/wechatService/supGoods/getAllGoodClass/${payload.channelId}`,
    ...payload
  })
}
// 保险超市 根据分类id获取列表
export const getSupGoodsById = (payload) => {
  return createApi({
    url: `${api}/wechatService/supGoods/getSupGoodsById`,
    ...payload
  })
}
//页面搭建-掌客通组件-资讯 弹窗
export const queryHotProduct = (payload) => { 
  return createApi({
    url: `${api}/api/channel-service/crmNews/queryHotProduct`,
    ...payload
  })
}
//页面搭建-掌客通组件-热销产品 弹窗
export const getPageSupGoodsPage = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelSupGoods/getPageSupGoodsPage`,
    ...payload
  })
}
//页面搭建-掌客通组件-营销活动 弹窗
export const queryActivityByStatus = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/queryActivityByStatus`,
    ...payload
  })
}
//智能栏位 - 保存
export const channelWechatSmartFieldSave = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatSmartField/save`,
    ...payload
  })
}
//智能栏位 - 列表
export const channelWechatSmartFieldList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatSmartField/list`,
    ...payload
  })
}
//智能栏位 - 详情
export const channelWechatSmartFieldDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatSmartField/detail/${payload.id}`,
    ...payload
  })
}
//智能栏位 - 栏位数据统计
export const fieldStatistics = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatSmartField/fieldStatistics/${payload.id}`,
    ...payload
  })
}
//智能栏位 - 内容数据统计
export const contentStatistics = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatSmartField/contentStatistics/${payload.id}`,
    ...payload
  })
}
//智能栏位 - 修改状态
export const updateEnableStatus = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatSmartField/updateEnableStatus`,
    ...payload
  })
}
//智能栏位 - 删除
export const channelWechatSmartFieldDelete = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatSmartField/delete`,
    ...payload
  })
}