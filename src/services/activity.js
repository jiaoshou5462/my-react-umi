import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js'; //环境变量

//活动管理-基础信息配置
export const saveMarketingInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/saveMarketingInfo`,
    ...payload
  })
};
//活动管理-首页样式提交
export const saveHomeStyle = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/saveHomeStyle`,
    ...payload
  })
};
//活动管理-首页广告配置
export const saveHomeAdStyle = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/saveHomeAdStyle`,
    ...payload
  })
};
//活动管理-加次数广告配置
export const saveAddCountAdStyle = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/addDrawTurntableActivityStyle`,
    ...payload
  })
};
//图片上传
export const uploadIcon = `${api}/api/channel-service/channelMarketingMgr/uploadIcon`;
export const uploadIconWord = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/uploadIcon`,
    ...payload
  })
};
//活动配置2-活动条件规则配置
export const activityRule = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/activityRule`,
    ...payload
  })
};
//活动配置3-转盘游戏-保存
export const turntableGameActivityStyle = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/turntableGameActivityStyle`,
    ...payload
  })
};

//活动信息-显示
export const backStageSActivityOne = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/backStageSActivityOne`,
    ...payload
  })
};
//活动形式及规则-显示
export const backStageSActivityTwo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/backStageSActivityTwo`,
    ...payload
  })
};
//活动页面-显示
export const backStageSActivityThree = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/backStageSActivityThree`,
    ...payload
  })
};
//活动信息-所属项目
export const getListMarketProject = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingProject/listMarketProject`,
    ...payload
  })
};
//活动2-奖池及中奖率-选择奖品-卡券套餐列表
export const getCouponList = (payload) => {
  return createApi({
    // url: `${api}/api/purchase/quotation/selectChannelCoupon`,
    url: `${api}/api/purchase/quotation/selectChannelCouponNew`,
    ...payload
  })
}
//活动2-奖池及中奖率-人群接口
export const getThrongList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/queryThrong`,
    ...payload
  })
}
//活动1-通过大数据获取活动可参与人群
export const getThrongListES = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/getThrongListES`,
    ...payload
  })
}
//活动1-通过大数据获取活动排除人群
export const getThrongListExclude = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/getThrongListExclude`,
    ...payload
  })
}
//获取渠道类型
export const getChannelType = (payload) => {
  return createApi({
    url: `${api}/wechatService/getWechatInfoByChannel/${payload.channelId}`,
    ...payload
  })
}
//活动2-通过大数据获取以保存活动人群
export const getActivityThrong = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/queryActivityThrong`,
    ...payload
  })
}
//活动2-奖池及中奖率-获取已保存人群详请
export const getThrongDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/queryThrongList`,
    ...payload
  })
}
//活动2-奖池及中奖率-保存奖品
export const savePrizeInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/savePrizeInfo`,
    ...payload
  })
}
//活动2-奖池及中奖率-获取已保存奖品详请
export const getPrizeDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/queryPrizeList`,
    ...payload
  })
}
//活动2-奖池及中奖率-保存人群
export const saveThrong = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/saveThrong`,
    ...payload
  })
}
//活动2-奖池及中奖率-修改活动库存
export const updatePriceStock = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/updatePriceStock`,
    ...payload
  })
}
//活动2-奖池及中奖率-删除奖品
export const onDeletePrice = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/deletePrice`,
    ...payload
  })
}
//活动2-奖池及中奖率-删除人群
export const onDeleteThrong = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/deleteThrong`,
    ...payload
  })
}
//活动2-奖池及中奖率-保存多张卡券组合成一个套餐
export const saveCardPrize = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/saveCouponPrize`,
    ...payload
  })
}
//活动3-保存 活动规则-中奖纪录-抽奖结果接口
export const saveActivityStyle = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/saveActivityStyle`,
    ...payload
  })
}
/*活动列表*/
export const getActivityList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/queryActivityList`,
    ...payload
  })
}
/*活动-完成回显*/
export const echoActivityFive = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/echoActivityFive`,
    ...payload
  })
}
/*活动列表 - 获取渠道*/
export const getActivityChannelList = (payload) => {
  return createApi({
    url: `${api}/api/marketing/LonginCustomer/customerChannelList`,
    ...payload
  })
}
/*活动列表 - 获取活动投放长链接 短连接 二维码*/
export const getActivityLink = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/getActivityLink`,
    ...payload
  })
}
/*活动列表 - 删除活动*/
export const onDeleteActivity = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/deleteActivity`,
    ...payload
  })
}
/*活动列表 - 修改活动状态*/
export const updateActivityStatus = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/updateStatus`,
    ...payload
  })
}
/*活动列表 - 下载中奖名单excel接口*/
export const downloadActivityExcel = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/downloadExcel`,
    ...payload
  })
}
/*活动列表 - 复制活动*/
export const copyActivity = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/copyActivity`,
    ...payload
  })
}
/*活动列表 - 投放列表*/
export const getActivityLinkList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/getActivityLinkList`,
    ...payload
  })
}
/*活动列表 - 保存投放*/
export const saveActivityThrowIn = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/saveActivityThrowIn`,
    ...payload
  })
}
/*活动形式及规则 - 秒杀配置保存*/
export const seckillActivityRule = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/seckillActivityRule`,
    ...payload
  })
}
/*活动页面 - 秒杀样式保存*/
export const saveSeckillStyle = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/saveSeckillStyle`,
    ...payload
  })
}
/*活动页面 - 秒杀样式回显*/
export const echoSeckillStyle = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/echoSeckillStyle`,
    ...payload
  })
}
/*活动页面 - 秒杀规则回显*/
export const echoSeckillRuleActivity = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/echoSeckillRuleActivity`,
    ...payload
  })
}
/*获取当前活动的 渠道权限*/
export const getChannelAuthority = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/queryChannelPoints`,
    ...payload
  })
}
/*秒杀 - 删除场次*/
export const deleteSeckill = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/deleteSeckill`,
    ...payload
  })
}
/*活动弹窗 - 通用保存*/
export const saveUniteStyle = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/saveUniteStyle`,
    ...payload
  })
}
/*秒杀 - 模板*/
export const queryMessageTemplate = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/queryMessageTemplate?channelId=${payload.params.channelId}`,
    ...payload
  })
}
/*通用 - 获取 选择触发动作：*/
export const queryThirdChannel = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/queryThirdChannel`,
    ...payload
  })
}
//优惠购-活动页面样式保存
export const saveBuyCheaperPageStyle = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBuyCheaper/pageStyle`,
    ...payload
  })
}
//优惠购-活动页面样式查询
export const getBuyCheaperPageStyle = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBuyCheaper/pageStyle`,
    ...payload
  })
}
//优惠购-购买限制、循环周期查询
export const getBuyCheaperBuyLimit = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBuyCheaper/buyLimit`,
    ...payload
  })
}
//优惠购-无库存文案查询
export const getBuyCheaperCopyWriting = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBuyCheaper/copyWriting`,
    ...payload
  })
}
//优惠购-活动商品查询
export const getBuyCheaperGoods = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBuyCheaper/goods`,
    ...payload
  })
}
//优惠购-活动商品查询
export const detBuyCheaperGoods = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBuyCheaper/goods`,
    ...payload
  })
}
//优惠购-活动形式和规则保存
export const buyCheaperSaveRule = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBuyCheaper/saveRule`,
    ...payload
  })
}
//优惠购-完成页数据查询
export const buyCheaperFinish = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBuyCheaper/finish`,
    ...payload
  })
}
/*娃娃机 - 通过活动ID查询全部样式*/
export const getStyleByActivityId = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelNewStyle/getStyleByActivityId`,
    ...payload
  })
}
/*娃娃机 - 通过活动ID 编码code查询对应样式*/
export const getStyleByActivityIdAndStyleCode = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelNewStyle/getStyleByActivityIdAndStyleCode`,
    ...payload
  })
}
/*娃娃机 - 保存修改样式*/
export const newStyleSave = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelNewStyle/save`,
    ...payload
  })
}
/*优惠购 - 获取卡券最近一次设置数据*/
export const getPackageSetUp = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBuyCheaper/getCardPackageCouponSetUp`,
    ...payload
  })
}
//活动管理-查询点点乐配置
export const getGameStrikeConfig = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/queryGameStrikeConfig`,
    ...payload
  })
}
//活动管理-保存或修改点点乐配置
export const updateGameStrikeConfig = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/saveOrUpdateGameStrikeConfig`,
    ...payload
  })
};
//答题-保存或修改答题配置
export const saveOrUpdateGameAnswerConfig = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelGameMgrConfig/saveOrUpdateGameAnswerConfig`,
    ...payload
  })
};
//答题-保存或修改删除答题题目
export const saveOrUpdateGameAnswerData = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelGameMgrConfig/saveOrUpdateGameAnswerData`,
    ...payload
  })
};
//答题-查询答题题目
export const queryGameAnswerData = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelGameMgrConfig/queryGameAnswerData`,
    ...payload
  })
};
//答题-查询答题配置
export const queryGameAnswerConfig = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelGameMgrConfig/queryGameAnswerConfig`,
    ...payload
  })
};
//答题-导入答题题目
export const importAnswer = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelGameMgrConfig/importAnswer`,
    ...payload
  })
};
//答题-导出答题数据报文
export const exportAnswer = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelGameMgrConfig/exportAnswer`,
    ...payload
  })
};
//答题-导出问卷调查数据报文
export const exportQuestionnaire = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelGameMgrConfig/exportQuestionnaire`,
    ...payload
  })
};
//答题-复制
export const copyAnswer = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelGameMgrConfig/copyAnswer?questionId=${payload.params.questionId}`,
    ...payload
  })
};
/* 查询素材分类列表 */
export const materialCategoryNameList = (payload) => {
  return createApi({
    url: `${api}/api/uniway/material-category/materialCategoryNameList`,
    ...payload
  })
};
/* 查询活动素材列表 */
export const materialList = (payload) => {
  return createApi({
    url: `${api}/api/uniway/marketing-material/materialList`,
    ...payload
  })
};
/* 获取活动素材详情 */
export const getMaterialDetails = (payload) => {
  return createApi({
    url: `${api}/api/uniway/marketing-material/getMaterialDetails`,
    ...payload
  })
};
/* 保存当前活动所应用的素材 */
export const putActivityMaterialId = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/putActivityMaterialId`,
    ...payload
  })
};
//集字-查询集字配置
export const queryGameWordConfig = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelGameMgrConfig/queryGameWordConfig`,
    ...payload
  })
};
//集字-获取奖品信息
export const queryPrize = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelGameMgrConfig/queryPrize`,
    ...payload
  })
};
//查询是否上传了企业logo(营销活动配置第二步开启企业logo)
export const queryEnterpriseLogoStatus = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/queryEnterpriseLogoStatus`,
    ...payload
  })
};
//查询企业logo
export const queryEnterpriseLogo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/queryEnterpriseLogo`,
    ...payload
  })
};
//获取订阅消息通知数据选项
export const getSubscribelMessage = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatSceneTemplate/getSubscribelMessage`,
    ...payload
  })
};
// 卡包明细
export const getCardByPackageNoNotGroupByCouponNum = (payload) => {
  return createApi({
    // url: `${api}/api/channel-service/couponCenter/queryCardByPackageNoNotGroupByCouponNum?packageNo=${payload.packageNo}`,
    url: `${api}/api/channel-service/couponCenter/queryCardByPackageNoNotGroupByCouponNumNew?packageNo=${payload.packageNo}&quotationItemId=${payload.quotationItemId}`,
    ...payload
  })
};
//获取活动类型
export const queryMarketTypeList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/queryMarketTypeList`,
    ...payload
  })
};
//根据活动id查询活动通用规则
export const getActivityRule = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelActivityRule/getActivityRule`,
    ...payload
  })
};
//操作活动规则（新增，编辑，删除）
export const saveOrUpdateActivityRule = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelActivityRule/saveOrUpdateActivityRule`,
    ...payload
  })
};
//校验规则是否关联人群
export const checkActivityRule = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelActivityRule/checkActivityRule`,
    ...payload
  })
};
//营销活动列表-补发卡券 卡券发放失败明细
export const downloadResendExcel = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/downloadResendExcel`,
    ...payload
  })
};
//营销活动列表-补发卡券 确认补发卡券
export const resendPrize = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/resendPrize`,
    ...payload
  })
};