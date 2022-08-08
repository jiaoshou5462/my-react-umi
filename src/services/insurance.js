import {api} from './env-config.js'; //环境变量
import {createApi} from '@/utils/axios.js'; //环境变量

/*获取渠道*/
export const getActivityChannelList= (payload) =>{
  return createApi({url:`${api}/api/marketing/LonginCustomer/customerChannelList`,
    ...payload
  })
}

/*获取分类*/
export const getAllGoodClass= (payload) =>{
  return createApi({url:`${api}/api/channel-service/channelSupGoods/getAllGoodClass/${payload.channelId}`,
    ...payload
  })
}
/*新增分类*/
export const createGoodClass= (payload) =>{
  return createApi({url:`${api}/api/channel-service/channelSupGoods/createGoodClass`,
    ...payload
  })
}
/*修改分类*/
export const updateGoodClass= (payload) =>{
  return createApi({url:`${api}/api/channel-service/channelSupGoods/updateGoodClass`,
    ...payload
  })
}
/*删除分类*/
export const delGoodClass= (payload) =>{
  return createApi({url:`${api}/api/channel-service/channelSupGoods/delGoodClass/${payload.objectId}`,
    ...payload
  })
}
/*产品-批量删除*/
export const batchDelChannelSupGoods= (payload) =>{
  return createApi({url:`${api}/api/channel-service/channelSupGoods/batchDelChannelSupGoods`,
    ...payload
  })
}
/*产品-调整排序*/
export const changeSort= (payload) =>{
  return createApi({url:`${api}/api/channel-service/channelSupGoods/changeSort/${payload.objectId}/${payload.goodSort}`,
    ...payload
  })
}
/*产品-删除*/
export const delChannelSupGoods= (payload) =>{
  return createApi({url:`${api}/api/channel-service/channelSupGoods/delChannelSupGoods/${payload.objectId}`,
    ...payload
  })
}
/*产品-启用*/
export const startChannelSupGood= (payload) =>{
  return createApi({url:`${api}/api/channel-service/channelSupGoods/startChannelSupGood/${payload.objectId}`,
    ...payload
  })
}
/*产品-停用*/
export const stopChannelSupGood= (payload) =>{
  return createApi({url:`${api}/api/channel-service/channelSupGoods/stopChannelSupGood/${payload.objectId}`,
    ...payload
  })
}
/*产品-列表*/
export const getSupGoodsPage= (payload) =>{
  return createApi({url:`${api}/api/channel-service/channelSupGoods/getSupGoodsPage`,
    ...payload
  })
}
/*产品-详情*/
export const getChannelSupGoodDetail= (payload) =>{
  return createApi({url:`${api}/api/channel-service/channelSupGoods/getChannelSupGoodDetail/${payload.objectId}`,
    ...payload
  })
}
/*产品-新增|编辑*/
export const saveChannelSupGood= (payload) =>{
  return createApi({url:`${api}/api/channel-service/channelSupGoods/saveChannelSupGood`,
    ...payload
  })
}
/*修改产品分类排序*/
export const onUpDataProductCategory = (payload) =>{
  return createApi({url:`${api}/api/channel-service/channelSupGoods/productCategory`,
    ...payload
  })
}

/*获取产品标签*/
export const getProductTag = (payload) =>{
  return createApi({url:`${api}/api/channel-service/channelGroup/channel`,
    ...payload
  })
}

