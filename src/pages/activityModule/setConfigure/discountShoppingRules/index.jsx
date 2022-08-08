import React, { useEffect, useState } from 'react';
import { Button, Row, Space, Select, Checkbox, Tooltip, Form, Radio, InputNumber, Col, Input, Upload, message, DatePicker, Modal, TimePicker, Switch } from 'antd';
import { connect, history } from 'umi';
import locale from 'antd/lib/date-picker/locale/zh_CN'
import styles from './style.less';
import { InfoCircleOutlined, UploadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment'
import 'moment/locale/zh-cn'
import { uploadIcon } from '@/services/activity.js';
import SelectPrize from '../../selectPrize';   //奖品
import SetColor from '../../components/setColor';   //选择颜色组件
import RichText from "@/pages/basicCard/richText"
const { RangePicker } = DatePicker;
const { TextArea } = Input;
var isDataChange = false;   //当前form数据是否有变动
var isTabaleDataChange = false; //当前table数据是否有变动
const weekObj = [
  { label: "周一", key: 1 },
  { label: "周二", key: 2 },
  { label: "周三", key: 3 },
  { label: "周四", key: 4 },
  { label: "周五", key: 5 },
  { label: "周六", key: 6 },
  { label: "周日", key: 7 },
];
let monthObj = [];
for (let i = 1; i < 32; i++) {
  monthObj.push({ key: i, label: `${i}号` })
}
const discountShoppingRulesPage = (props) => {
  let { dispatch, setStepBack, setIsCancel, ruleList } = props;
  let [detailStatus, setDetailStatus] = useState(localStorage.getItem('activityDetail') === '1' ? true : false) //是否是详请状态，1为是
  let [editStatus, setEditStatus] = useState(localStorage.getItem('activityDetail') === '2' ? true : false) //是否是详请状态，1为是
  let [isActivityHave, setIsActivityHave] = useState(localStorage.getItem('isActivityHave')) //是否是活动发布状态
  let [editTableConfig, setEditTableConfig] = useState(false);   //是否开始触发table保存
  let [activityData, setActivityData] = React.useState(JSON.parse(localStorage.getItem('activityInfo')))  //活动信息
  //上一步弹窗
  let [isModalVisible, setSsModalVisible] = useState(false);
  /*返回列表*/
  let goBackList = () => {
    setIsCancel(1);
  }
  //上一步
  let onPrevious = () => {
    // setStepBack(1)
    if (isDataChange || isTabaleDataChange) {
      setSsModalVisible(!isModalVisible);
    } else {
      history.push("/activityConfig/activityList/activityModule/info");
    }
  };
  // 确定保存（弹窗提示是否保存当前配置时）
  let handleOk = (i) => {
    if (isTabaleDataChange) {
      setEditTableConfig(true);
    }
    if (isDataChange) {
      onFinish(form.getFieldsValue())
    }
  }
  //数据保存成功
  let configDataSucs = (i) => {
    if (!isDataChange && !isTabaleDataChange && isModalVisible) {
      history.push("/activityConfig/activityList/activityModule/info");
    }
  }
  // 不保存
  let handleCancel = (i) => {
    setSsModalVisible(!isModalVisible);
    history.push("/activityConfig/activityList/activityModule/info");
  }
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  let [form] = Form.useForm();//当前页面表单提交数据
  let [postFrom, setPostFrom] = useState({ //接口相关参数
    buyCheaperGoodVOS: {},//添加商品相关信息
    buyLimitVO: {
      activityId: activityInfo.objectId,
      channelId: activityInfo.channelId,
      dateRangeStart: '',//日期限制范围开始
      dateRangeEnd: '',//日期限制范围结束
      timeRangeStart: '',//每天活动开始时间
      timeRangeEnd: '',//每天活动结束时间
      id: '',
      cyclePeriod: '',//周期限制
      buyLimit: '',//购买限制
    },//购买限制和循环周期
    copywritingVO: {
      notInventory: '您来晚了，该商品已经被洗劫一空',
    },//无库存文案
    activityRuleBaseInfoVO: {
      activityId: activityInfo.objectId,
      attentionWechatCopyWriting: "",//	是否关注公众号文案
      bindCarCopyWriting: "",//	绑定车辆文案
      channelId: activityInfo.channelId,
      h5InviteDescription: "",//分享描述
      h5InviteMode: 0,     //是否直接H5分享
      h5InviteModeCopyWriting: "",//h5遮罩引导分享文案
      h5InviteModeImg: "",//h5分享图片
      h5InviteTitle: "",//h5分享标题
      isAttentionWechat: 0,   //是否关注公众号
      isBindCar: 0,         //绑定车辆
      isLBS: 0,    //地理位置授权
      isMemberRegister: 0,//是否注册会员
      isShare: 0,//是否支持分享
      marketActivityType: 4,//活动形式
      marketType: 2,//活动类型
      memberRegisterCopyWriting: "",//注册引导文案
      posterInviteMode: 0,    //海报二维码邀请方式
      posterInviteModeImg: 0,    //海报二维码图片
      wechatDescription: 0,    //海报二维码图片
      isH5InviteNickName: "",   //公众号h5图文链接描述
      wechatImg: "",   //公众号h5图片地址
      wechatTitle: "",   //公众号h5标题
      wechatUrl: "",   //新添加公众号h5地址链接
    },
  });
  let [shareShape, setShareShape] = useState(true);//分享形式
  // 活动规则及奖品-对应框隐藏框  参与活动触发动作及分享设置
  let [isTools, setisTools] = useState([false, false, false, false, false, false, false]);
  let isToolsBox = (i, value) => {
    let toIsTools = [...isTools];
    toIsTools[i] = value.target.checked;
    setisTools(toIsTools);
    let toPostFrom = JSON.parse(JSON.stringify(postFrom));
    let toIsType = value.target.checked ? 1 : 0;
    if (i == 0) {    //是否关注公众号;
      toPostFrom.activityRuleBaseInfoVO.isAttentionWechat = toIsType;
      setPostFrom(toPostFrom);
    }
    if (i == 1) {    //是否会员注册	;
      toPostFrom.activityRuleBaseInfoVO.isMemberRegister = toIsType;
      setPostFrom(toPostFrom);
    }
    if (i == 2) {    //是否绑定车辆
      toPostFrom.activityRuleBaseInfoVO.isBindCar = toIsType;
      setPostFrom(toPostFrom);
    }
    if (i == 5) {    //是否海报二维码邀请方式
      toPostFrom.activityRuleBaseInfoVO.posterInviteMode = toIsType;
      setPostFrom(toPostFrom);
    }
    if (i == 6) {    //是否直接H5分享
      toPostFrom.activityRuleBaseInfoVO.h5InviteMode = toIsType;
      setPostFrom(toPostFrom);
    }
    if (i == 5 || i == 6 || i == 3) {
      form.setFieldsValue({
        isShare: 1
      });
      toPostFrom.activityRuleBaseInfoVO.isShare = 1;
      setPostFrom(toPostFrom);
      setShareShape(true)
    }
  };
  //是否地理位置授权
  let [typeLBS, setTypeLBS] = useState([false]);
  let changeLBS = (value) => {
    let toPostFrom = JSON.parse(JSON.stringify(postFrom));;
    let toIsTypes = value.target.checked ? 1 : 0;
    toPostFrom.activityRuleBaseInfoVO.isLBS = toIsTypes;
    setPostFrom(toPostFrom);
    let csTypeLBS = typeLBS;
    csTypeLBS[0] = value.target.checked;
    setTypeLBS([...csTypeLBS]);
  }
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  // 参与活动配置
  let [wechatImgs, setWechatImgs] = useState('');  //h5图文链接图片
  let [wechatImgs2, setWechatImg2] = useState('');  //海报图片海报图片
  let [wechatImgs3, setWechatImg3] = useState('');  //指定链接
  //公众号图片上传
  let weUpload = (file, i) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传JPG/PNG 格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能高于 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  let weChange = (info, i) => {
    if(info.file.type != 'image/jpeg' && info.file.type != 'image/png'){
      return false;
    }
    if(info.file.size > (1024 * 1024 * 2)){
      return false;
    }
    let toItems = info.file.response ? info.file.response.items : ''
    if (i == 1) {
      setWechatImgs(toItems)
    } else if (i == 2) {
      setWechatImg2(toItems)
    } else if (i == 3) {
      setWechatImg3(toItems)
    }
  };
  let setIsShare = (e) => {
    if (e.target.value == 0) {
      let toIsTools = [...isTools];
      toIsTools[5] = false;
      toIsTools[6] = false;
      setisTools(toIsTools);
      let toPostFrom = JSON.parse(JSON.stringify(postFrom));;
      toPostFrom.activityRuleBaseInfoVO.posterInviteMode = 0;
      toPostFrom.activityRuleBaseInfoVO.h5InviteMode = 0;
      setPostFrom(toPostFrom);
      form.setFieldsValue({
        shareTask: "",
      })
      setShareShape(false)
    } else {
      setShareShape(true)
    }
  }
  //输入时间转换字符串
  let timeFormatAndJudge = (e) => {
    let formatDate = typeof e == "string" ? e : e.format('HH:mm:ss');
    let timeNum = (new Date(`2021-01-01 ${formatDate}`)).getTime();
    return timeNum
  }
  //下一步提交
  let onFinish = (value) => {
    if (!detailStatus) {
      let toForm = Object.assign(value, postFrom);
      if (toForm.partakAt.includes(1)) {//关注公众号
        if (!toForm.wechatImg) {
          message.info('请上传h5图文链接图片')
          return
        }
        if (!toForm.wechatTitle) {
          message.info('请填写h5图文链接标题')
          return
        }
        if (!toForm.wechatDescription) {
          message.info('请填写h5图文链接描述')
          return
        }
      }
      if (!cycle) {
        message.info('请选择循环周期')
        return
      } else if (cycle == 1) {
        if (!timeStart || !timeEnd) {
          message.info('请选择循环时间')
          return
        } else {
          if (timeFormatAndJudge(timeStart) >= timeFormatAndJudge(timeEnd)) {
            message.error('结束时间需大于开始时间')
            return
          }
        }
      } else if (cycle == 2 || cycle == 3) {
        if (!timeStart || !timeEnd || !dateStart || !dateEnd) {
          message.info('请选择循环周期时间')
          return
        } else {
          if (dateStart > dateEnd) {
            message.error('结束时间需大于开始时间')
            return
          }
          if (timeFormatAndJudge(timeStart) >= timeFormatAndJudge(timeEnd)) {
            message.error('结束时间需大于开始时间')
            return
          }
        }
      }
      if (!buyLimit) {
        message.info('请选择购买限制')
        return
      } else if (buyLimit == 1) {
        if (!limitNum) {
          message.info('请填写每人最多可购买件数')
          return
        }
      }
      if (!goodsList.length) {
        message.info('请添加商品')
        return
      }
      let singleLimitNumTotal = null;
      let goodsFlag = true;
      let havNotSingleLimit = false;
      goodsList.length > 0 && goodsList.forEach((item, i) => {
        if(item.activityStockNum == 0){
          goodsFlag = true;
        }else if(item.activityStockNum == '' || item.activityStockNum == null){
          goodsFlag = false;
        }
        if(item.singleBuyLimit == 1){
          if(!item.singleLimitNum){
            goodsFlag = false;
          }else{
            singleLimitNumTotal += item.singleLimitNum;
          }
        }else{
          havNotSingleLimit = true;
        }
        if (!item.payPrice  || !item.tradeDisplayName || !item.tradeTag || !item.prizeImg) {
          goodsFlag = false;
          return false;
        }
        item.remark = item.needKnow;
      })
      if (!goodsFlag) {
        message.info('请完善商品信息')
        return
      }
      if(!havNotSingleLimit && singleLimitNumTotal !=null && limitNum > 0 && singleLimitNumTotal < limitNum){
        message.info(`商品限购总和不得小于${limitNum}次（参与机会）`)
        return
      }
      toForm.activityRuleBaseInfoVO.activityId = activityInfo.objectId;
      toForm.activityRuleBaseInfoVO.timeSwitch = isShowActivityTime;
      toForm.activityRuleBaseInfoVO.isEnterprise = isEnterprise;
      toForm.activityRuleBaseInfoVO.attentionWechatCopyWriting = toForm.attentionWechatCopyWriting;
      toForm.activityRuleBaseInfoVO.bindCarCopyWriting = toForm.bindCarCopyWriting;
      toForm.activityRuleBaseInfoVO.channelId = activityInfo.channelId;
      toForm.activityRuleBaseInfoVO.h5InviteDescription = toForm.h5InviteDescription;
      toForm.activityRuleBaseInfoVO.h5InviteModeCopyWriting = toForm.h5InviteModeCopyWriting;
      toForm.activityRuleBaseInfoVO.h5InviteModeImg = wechatImgs3 || '';
      toForm.activityRuleBaseInfoVO.h5InviteTitle = toForm.h5InviteTitle;
      toForm.activityRuleBaseInfoVO.isMemberRegister = triggerActionList[2] ? 1 : 0;
      toForm.activityRuleBaseInfoVO.isShare = toForm.isShare;
      toForm.activityRuleBaseInfoVO.marketActivityType = 4;
      toForm.activityRuleBaseInfoVO.marketType = 2;
      toForm.activityRuleBaseInfoVO.memberRegisterCopyWriting = toForm.memberRegisterCopyWriting;
      toForm.activityRuleBaseInfoVO.posterInviteModeImg = wechatImgs2 || '';
      toForm.activityRuleBaseInfoVO.wechatDescription = toForm.wechatDescription;
      toForm.activityRuleBaseInfoVO.isH5InviteNickName = toForm.isH5InviteNickName ? toForm.isH5InviteNickName : 0;
      toForm.activityRuleBaseInfoVO.wechatImg = wechatImgs || '';
      toForm.activityRuleBaseInfoVO.wechatTitle = toForm.wechatTitle;
      toForm.activityRuleBaseInfoVO.wechatUrl = toForm.wechatUrl ? toForm.wechatUrl : "";
      let toPartakAt = ruleList.filter(item => toForm.partakAt.some((items) => item.triggerId == items));
      // 触发动作
      toForm.activityRuleBaseInfoVO.thirdAttentionWechatCopywriting = toForm.thirdAttentionWechatCopywriting ? toForm.thirdAttentionWechatCopywriting : "";
      toForm.activityRuleBaseInfoVO.thirdMemberRegisterCopywriting = toForm.thirdMemberRegisterCopywriting ? toForm.thirdMemberRegisterCopywriting : "";
      toForm.activityRuleBaseInfoVO.thirdBindCarCopywriting = toForm.thirdBindCarCopywriting ? toForm.thirdBindCarCopywriting : "";
      toForm.activityRuleBaseInfoVO.certificationCopywriting = toForm.certificationCopywriting ? toForm.certificationCopywriting : "";
      toForm.activityRuleBaseInfoVO.thirdCertificationCopywriting = toForm.thirdCertificationCopywriting ? toForm.thirdCertificationCopywriting : "";
      toForm.activityRuleBaseInfoVO.otherCopywriting = toForm.otherCopywriting ? toForm.otherCopywriting : "";
      toForm.activityRuleBaseInfoVO.activityNoticeIds = subscribeMsg.length > 0 && subscribeMsg.join(',') || '';
      toForm.activityRuleBaseInfoVO.marketingTriggerVOS = [...toPartakAt];
      let list = goodsList.map((item, index) =>{
        item.cardPackage = cardPackage[index] || {};
        let quotationItemId = (packageDetailList.length > 0 && packageDetailList[index] && packageDetailList[index].length > 0 && packageDetailList[index][0].quotationItemId) || null;
        if(packageDetailList[index] && packageDetailList[index].length > 0 && quotationItemId == cardPackage[index].quotationItemId){
          item.cardPackage.cardPackageCouponList = packageDetailList[index];
        }else{
          item.cardPackage.cardPackageCouponList = packageDetail[index];
        }
        return item
      })
      toForm.buyCheaperGoodVOS = list;
      toForm.buyLimitVO.cyclePeriod = cycle;
      let startTime = timeStart ? (typeof timeStart == "string") ? timeStart : timeStart.format('HH:mm:ss') : "";
      let endTime = timeEnd ? (typeof timeEnd == "string") ? timeEnd : timeEnd.format('HH:mm:ss') : "";
      toForm.buyLimitVO.timeRangeStart = startTime;
      toForm.buyLimitVO.timeRangeEnd = endTime;
      toForm.buyLimitVO.dateRangeStart = dateStart;
      toForm.buyLimitVO.dateRangeEnd = dateEnd;
      toForm.buyLimitVO.buyLimit = buyLimit == 1 ? limitNum : -1;
      toForm.buyLimitVO.id = limitId ? limitId : "";
      toForm.buyLimitVO.goodsType = goodsType;
      toForm.copywritingVO = {
        notInventory: toForm.notInventory
      }
      toForm.buyCheaperGoodVOS = toForm.buyCheaperGoodVOS.map(good => {
        good.cardPackage.id = null;
        if(good.type == "9"){
          good.couponPrizeList = [];
        }else if(good.type == "1"){
          good.cardPackage = {}
        }
        if(good.cardPackage && good.cardPackage.cardPackageCouponList){
          let toCardPackageCouponList = JSON.parse(JSON.stringify(good.cardPackage.cardPackageCouponList));
          toCardPackageCouponList.length > 0 && toCardPackageCouponList.map(item => {
            item.id = null;
            if(!item.effectiveDate){
              if(item.serviceType == 2){
                item.effectiveDate = item.defaultEffectiveDays;
              }else if(item.serviceType == 1){
                if(item.useValidDays && item.useValidDays > 0){
                  item.effectiveDate = item.useValidDays;
                }else{
                  item.effectiveDate = item.maxEffectiveDays;
                }
              }
              item.effectiveDays = item.effectiveDate;
            }
            return item;
          })
          good.cardPackage.cardPackageCouponList = JSON.parse(JSON.stringify(toCardPackageCouponList));
        }
        return good;
      })
      let params = {
        activityRuleBaseInfoVO: toForm.activityRuleBaseInfoVO,
        buyCheaperGoodVOS: toForm.buyCheaperGoodVOS,
        buyLimitVO: toForm.buyLimitVO,
        copywritingVO: toForm.copywritingVO,
      }
      dispatch({
        type: 'discountShoppingRules/buyCheaperSaveRule',
        payload: {
          method: 'postJSON',
          params: params
        },
        callback: (res) => {
          if (res.result.code === '0') {
            if (isDataChange && isModalVisible) {
              isDataChange = false;
              configDataSucs();
            } else {
              let toAtInfo = JSON.parse(localStorage.getItem('activityInfo'));
              toAtInfo.marketActivityType = 4;
              toAtInfo.marketType = 2;
              localStorage.setItem('activityInfo', JSON.stringify(toAtInfo));
              message.success({
                content: res.result.message,
                duration: 1,
                onClose: () => {
                  history.push("/activityConfig/activityList/activityModule/setPage")
                }
              })
            }
          } else {
            message.info(res.result.message)
          }
        }
      })
    } else {
      history.push("/activityConfig/activityList/activityModule/setPage")
    }
  };
  //表单数据变动监听
  let onFieldsChange = (value) => {
    isDataChange = true;
  }
  //开始时间改变
  let startTimeChang = (e, i) => {
    let toStartTime = e ? e.format('YYYY-MM-DD HH:mm:ss') : '';
    let toStartGetTime = new Date(toStartTime).getTime();  //当前选择时间戳
  }
  //结束时间改变
  let endTimeChang = (e, i) => {
    let toEndTime = e ? e.format('YYYY-MM-DD HH:mm:ss') : '';
    let toEndGetTime = new Date(toEndTime).getTime();  //当前选择时间戳
  }
  /*限制数字输入框只能输入整数*/
  let limitNumber = (value) => {
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(/\D/g, '') : ''
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(/\D/g, '') : ''
    } else {
      return null
    }
  }
  //限制支付价仅可输入两位小数
  let limitDecimalsF = (value) => {
    let reg = /^(-)*(\d+)\.(\d\d).*$/;
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(reg, '$1$2.$3');
  };
  let limitDecimalsP = (value) => {
    let reg = /^(-)*(\d+)\.(\d\d).*$/;
    return value.replace(/￥\s?|(,*)/g, '').replace(reg, '$1$2.$3');
  };
  let [goodsList, setGoodsList] = useState([]);//活动商品

  //商品总预算
  let [budget, setBudget] = useState(0);
  let getBudget = () => {
    let toGoodsList = JSON.parse(JSON.stringify(goodsList))
    if (toGoodsList.length > 0) {
      let totalBudget = 0;
      for (let item of toGoodsList) {
        totalBudget = totalBudget + ((item.activityStockNum || 0) * item.unitPrice);
      }
      setBudget(totalBudget);
    } else {
      setBudget(0);
    }
  }
  //添加商品-库存输入
  let sessionNumberChang = (e, i, type) => {
    let toGoodsList = JSON.parse(JSON.stringify(goodsList));
    toGoodsList[i].activityStockNum = e;
    setGoodsList(toGoodsList)
  }
  useEffect(() => {
    getBudget()
  }, [goodsList])
  let [addStockVisible, setAddStockVisible] = React.useState(false) // 活动商品库存状态
  let [addStockInfo, setAddStockInfo] = React.useState({}) // 活动商品库存
  let [addStockNum, setAddStockNum] = React.useState(0) // 添加活动库存的数量
  let [addStockTypes, setAddStockTypes] = React.useState(0) // 0减少 1 增加
  //修改数量
  let modifyNumberChang = (e, i, types) => {
    setAddStockVisible(true);
    setAddStockInfo({ ...e });
    setAddStockNum(0);
    setToCommodityJn(i);
    setAddStockTypes(types);
  }
  //弹窗添加、减少库存数量
  let onAddStockNumChange = (e) => {
    setAddStockNum(e)
  }
  /*修改活动库存 确定事件*/
  let onAddStock = () => {
    /*type 0 是减少库存，1 是增加库存*/
    if (addStockVisible && addStockNum <= 0) {
      message.error('库存不得小于0')
      return
    }
    if (addStockTypes === 0 && (addStockInfo.remainingStockNum < addStockNum)) {
      message.error('库存不得大于剩余库存')
      return
    }
    let data = {
      id: addStockInfo.id,
      type: addStockTypes,
      activityId: addStockInfo.activityId,
      channelId: activityData.channelId,
      num: addStockNum,
      seckillId: goodsList[0].id
    }
    dispatch({
      type: 'seckilActivityRules/updatePriceStock',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let toGoodsList = JSON.parse(JSON.stringify(goodsList));
          let toaddStockNum = toGoodsList[toCommodityJn].remainingStockNum;
          let toactivityStockNum = toGoodsList[toCommodityJn].activityStockNum;
          if (addStockTypes == 1) {
            toaddStockNum = toaddStockNum + addStockNum
            toactivityStockNum = toactivityStockNum + addStockNum;
          } else {
            toaddStockNum = toaddStockNum - addStockNum;
            toactivityStockNum = toactivityStockNum - addStockNum;
          }
          toGoodsList[toCommodityJn].remainingStockNum = toaddStockNum;
          toGoodsList[toCommodityJn].activityStockNum = toactivityStockNum;
          setGoodsList(toGoodsList)
          setAddStockVisible(false)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  let [isGoodsTypeVisible, setIsGoodsTypeVisible] = useState(false);
  let [goodsType, setGoodsType] = useState(1);//商品类型 1 卡券  2 卡包
  let [tempData, setTempData] = useState(null);
  let goodsTypeChange = (e) =>{
    if(goodsList.length > 0){
      setIsGoodsTypeVisible(true);
      setTempData(e.target.value);
    }else{
      setGoodsType(e.target.value);
    }
  }
  let goodsTypeOk = () => {
    setIsGoodsTypeVisible(false);
    setGoodsType(tempData);
    let toGoodsList = JSON.parse(JSON.stringify(goodsList));
    toGoodsList = toGoodsList.filter(item => {return item.id});
    toGoodsList.length > 0 && toGoodsList.map(item => {
      deletePrice(item.id);
    })
    setGoodsList([]);
    setCardPackage([]);
    setPackageDetail([]);
  }
  let deletePrice = (val) => {
    let data = {
      id: val,
    }
    dispatch({
      type: 'discountShoppingRules/detBuyCheaperGoods',
      payload: {
        method: 'delete',
        params: data,
        isParams: true
      },
      callback: (res) => {
        if (res.result.code === '0') {
        }
      }
    })
  }
  let goodsTypeCancel = () => {
    setIsGoodsTypeVisible(false);
  }
  //商品展示名称
  let sessionNameChang = (e, i) => {
    let toGoodsList = JSON.parse(JSON.stringify(goodsList));
    toGoodsList[i].tradeDisplayName = e.target.value;
    setGoodsList(toGoodsList)
  }
  //商品描述
  let sessionDescribeChang = (e, i) => {
    let toGoodsList = JSON.parse(JSON.stringify(goodsList));
    toGoodsList[i].tradeDescribe = e.target.value;
    setGoodsList(toGoodsList)
  }
  //库存类型选择 总库存、周期库存
  let changeStockTypeChange = (e, i) => {
    let toGoodsList = JSON.parse(JSON.stringify(goodsList));
    toGoodsList[i].stockType = e.target.value;
    setGoodsList(toGoodsList)
  }
  //周期库存周期选择 每天、每周、每月
  let cycleTypeChange = (e, i) => {
    let toGoodsList = JSON.parse(JSON.stringify(goodsList));
    toGoodsList[i].cycleStockType = e;
    setGoodsList(toGoodsList)
  }
  //单个商品购买限制
  let singleBuyLimitChange = (e, i) => {
    let toGoodsList = JSON.parse(JSON.stringify(goodsList));
    toGoodsList[i].singleBuyLimit = e.target.value;
    if(e.target.value == -1){
      toGoodsList[i].singleLimitNum = null;
    }
    setGoodsList(toGoodsList)
  }
  //单个商品限制数量
  let singleLimitNumChange = (e, i) => {
    let toGoodsList = JSON.parse(JSON.stringify(goodsList));
    toGoodsList[i].singleLimitNum = e;
    setGoodsList(toGoodsList)
  }
  //图片上传
  let imgUpLoad = (file, i) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传JPG/PNG 格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能高于 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  let imgUpChange = (e, i) => {
    let toGoodsList = JSON.parse(JSON.stringify(goodsList));
    toGoodsList[i].prizeImg = e.file.response ? e.file.response.items : '';
    setGoodsList(toGoodsList)
  }
  //商品标签
  let sessionLableChang = (e, i) => {
    let toGoodsList = JSON.parse(JSON.stringify(goodsList));
    toGoodsList[i].tradeTag = e.target.value;
    setGoodsList(toGoodsList)
  }
  //商品支付价
  let payPriceChang = (e, i) => {
    let toGoodsList = JSON.parse(JSON.stringify(goodsList));
    toGoodsList[i].payPrice = e;
    setGoodsList(toGoodsList)
  }
  //商品购买须知
  let onTextChange = (e, i) => {
    let toGoodsList = JSON.parse(JSON.stringify(goodsList));
    toGoodsList[i].needKnow = e;
    setGoodsList(toGoodsList)
  }
  //购买限制
  let [buyLimit, setBuyLimit] = useState(-1);
  let changeBuyLimit = (e) => {
    setLimitNum(null);
    setBuyLimit(e.target.value);
  }
  //购买限制信息ID
  let [limitId, setLimitId] = useState(null);
  //每人限购件数
  let [limitNum, setLimitNum] = useState(null);
  let limitNumChange = (e) => {
    setLimitNum(e)
  }
  //循环周期
  let [cycle, setCycle] = useState(-1);
  let changeCycle = (e) => {
    setCycle(e.target.value);
    let toGoodsList = JSON.parse(JSON.stringify(goodsList));
    toGoodsList.map((item, i) => {
      item.activityStockNum = null;
    })
    setGoodsList(toGoodsList)
    setTimeStart(null);
    setTimeEnd(null);
    setDateStart(null);
    setDateEnd(null);
  }
  //循环周期配置
  let [weekArr, setWeekArr] = useState(weekObj);//周选择
  let [monthArr, setMonthArr] = useState(monthObj);//月选择
  let [dateStart, setDateStart] = useState("");//开始日期/周几
  let dateStartChange = (value) => {
    setDateStart(value)
  }
  let [dateEnd, setDateEnd] = useState("");//结束日期/周几
  let dateEndChange = (value) => {
    setDateEnd(value)
  }
  let [timeStart, setTimeStart] = useState("");//每天开始时间
  let timeStartChange = (value) => {
    setTimeStart(value)
  }
  let [timeEnd, setTimeEnd] = useState("");//每天结束时间
  let timeEndChange = (value) => {
    setTimeEnd(value)
  }
  //添加商品
  let [prizeVisible, setPrizeVisible] = useState(false); //选择奖品模态框状态
  let [prizeData, setPrizeData] = React.useState({}) //奖品
  let [currentGoodIndex, setCurrentGoodIndex] = useState(null);//添加第几个商品
  let addCommodityClick = () => {
    let goodsListLength = goodsList.length;
    setPrizeVisible(true);
    setCardPrizeName("");
    setCurrentGoodIndex(goodsListLength);
  }

  let [isCommodityLayer, setIsCommodityLayer] = useState(false);//弹窗提示删除状态
  let [toCommodityJn, setToCommodityJn] = useState(0);//删除商品的index
  let [toEditItem, setToEditItem] = useState(null);//编辑商品的index
  let [editGood, setEditGood] = useState(null);//当前编辑的商品
  let editCommodityClick = (i) => {
    setToEditItem(i);
    setEditGood(goodsList[i])
    setPrizeVisible(true);
    setCardPrizeName("");
  }
  //删除
  let comdiyDelete = (i) => {
    setToCommodityJn(i);
    setIsCommodityLayer(!isCommodityLayer);
    setToEditItem(null);

  }
  //确认删除
  let commodityLyOk = (e) => {
    let toGoodsList = JSON.parse(JSON.stringify(goodsList));
    let toCardPackage = JSON.parse(JSON.stringify(cardPackage));
    let toPackageDetail = JSON.parse(JSON.stringify(packageDetail));
    if (toGoodsList[toCommodityJn].id) {
      setOnDeletePrice(() => {
        toGoodsList.splice(toCommodityJn, 1);
        setGoodsList(toGoodsList);
        if(toCardPackage[toCommodityJn]){
          toCardPackage.splice(toCommodityJn, 1);
          setCardPackage(toCardPackage);
        }
        if(toPackageDetail[toCommodityJn]){
          toPackageDetail.splice(toCommodityJn, 1);
          setPackageDetail(toPackageDetail);
        }
        setIsCommodityLayer(!isCommodityLayer);
      })
    } else {
      toGoodsList.splice(toCommodityJn, 1)
      setGoodsList(toGoodsList);
      setIsCommodityLayer(!isCommodityLayer);
    }
    setPackageDetailList([]);
    setBudget(0);
  }
  //取消删除
  let ommodityLyCancel = (e) => {
    setToCommodityJn(0);
    setIsCommodityLayer(!isCommodityLayer);
  }
  //删除商品
  let setOnDeletePrice = (callback) => {
    let data = {
      id: goodsList[toCommodityJn].id,
    }
    dispatch({
      type: 'discountShoppingRules/detBuyCheaperGoods',
      payload: {
        method: 'delete',
        params: data,
        isParams: true
      },
      callback: (res) => {
        if (res.result.code === '0') {
          callback && callback()
        }
      }
    })
  }
  //数据获取循环周期和购买限制获取
  let getBuyCheaperBuyLimit = () => {
    dispatch({
      type: 'discountShoppingRules/getBuyCheaperBuyLimit',
      payload: {
        method: 'get',
        params: {
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0" && res.body) {
          let items = res.body;
          setCycle(items.cyclePeriod ? items.cyclePeriod : -1);
          if (items.buyLimit > 0) {
            setBuyLimit(1);
            setLimitNum(items.buyLimit);
          } else {
            setBuyLimit(items.buyLimit ? items.buyLimit : -1);
          }
          setLimitId(items.id);
          setTimeStart(items.timeRangeStart);
          setTimeEnd(items.timeRangeEnd);
          setDateStart(items.dateRangeStart);
          setDateEnd(items.dateRangeEnd);
          setGoodsType(items.goodsType ? items.goodsType : 1)
          isDataChange = false;
        } else {
          message.error(res.result.message);
        }
      }
    });
  };
  //无库存文案查询
  let getBuyCheaperCopyWriting = () => {
    dispatch({
      type: 'discountShoppingRules/getBuyCheaperCopyWriting',
      payload: {
        method: 'get',
        params: {
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let items = res.body;
          if (items && items.notInventory) {
            form.setFieldsValue({
              notInventory: items.notInventory
            })
          }
          isDataChange = false;
        } else {
          message.error(res.result.message);
        }
      }
    });
  };
  //活动商品查询
  let getBuyCheaperGoods = () => {
    dispatch({
      type: 'discountShoppingRules/getBuyCheaperGoods',
      payload: {
        method: 'get',
        params: {
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        getBuyCheaperBuyLimit();
        if (res.result.code == "0") {
          let items = res.body;
          let totalBudget = 0;
          for (let item of items) {
            item.remark = item.remark || "";
            totalBudget = totalBudget + item.activityStockNum * item.unitPrice;
          }
          setBudget(totalBudget);
          setGoodsList(items);
          if(items.length > 0){
            let toCardPackage = [];
            let toPackageDetail = [];
            items.map((item, index) => {
              let cardPackage = item.cardPackage || {};
              let cardPackageCouponList = item.cardPackage && item.cardPackage.cardPackageCouponList.length > 0 ? item.cardPackage.cardPackageCouponList : [];
              toCardPackage.push(cardPackage);
              toPackageDetail.push(cardPackageCouponList);
            })
            setCardPackage(toCardPackage);
            setPackageDetail(toPackageDetail);
          }
          // if(items.length > 0){
          //   let toCardPackage = items[0].cardPackage ? items[0].cardPackage : {};
          //   let toCardPackageCouponList = items[0].cardPackage && items[0].cardPackage.cardPackageCouponList.length > 0 ? items[0].cardPackage.cardPackageCouponList : [];
          //   // toCardPackageCouponList.map((item)=>{
          //   //   item.defaultEffectiveDays = item.effectiveDays;
          //   // })
          //   setCardPackage(toCardPackage);
          //   setPackageDetail(toCardPackageCouponList);
          // }
          isDataChange = false;
        } else {
          message.error(res.result.message);
        }
      }
    });
  };

  /*提示框*/
  let promptBox = (content) => {
    Modal.info({ content, okText: '确定' })
  }
  let [cardPrizeNameVisible, setCardPrizeNameVisible] = useState(false) // 卡券奖品展示名称模态框状态
  let [cardPrizeName, setCardPrizeName] = useState('') // 卡券奖品展示名称
  let [couponPackageNo,setcouponPackageNo] = useState();//卡包ID
  let [quotationItemId,setQuotationItemId] = useState();//卡包quotationItemId
  let [packageDetail,setPackageDetail] = useState([]);//卡包明细
  /*确定选择奖品*/
  let onConfirmPrizeSet = () => {
    if (Object.keys(prizeData).length !== 0 && prizeData.type !== '6') {
      let temp = JSON.parse(JSON.stringify(goodsList));
      let { cardPrizeList, type } = prizeData;
      /*暂时关闭该校验*/
      if (type === '1') {
        if (cardPrizeList && cardPrizeList.length > 0) {
          let itemCard = cardPrizeList[0];
          if (!itemCard.couponNum) {
            promptBox('请输入选中卡券数量!')
            return
          }
          if (itemCard.defaultEffectiveDays <= 0) {
            promptBox('请设置选中卡券的有效期!')
            return
          }
          if (!cardPrizeName) {
            setCardPrizeNameVisible(true)
            return
          }
          let addItem = {
            type: type,
            activityStockNum: "",
            remainingStockNum: '',
            prizeImg: '',
            tradeTag: '',
            tradeDescribe: '',
            tradeDisplayName: '',
            prizeName: cardPrizeName,
            payPrice: '',
            unitPrice: itemCard.quotaPrice * itemCard.couponNum,
            activityId: activityInfo.objectId,
            remark: '',
            id: '',
            couponPrizeList: cardPrizeList,
            couponNum: itemCard.couponNum,
            stockType: 1,
            singleBuyLimit: -1,
            cycleStockType: 1
          };
          if (toEditItem == null) {
            temp.push(addItem)
          } else {
            temp[toEditItem].type = type;
            temp[toEditItem].prizeName = cardPrizeName;
            temp[toEditItem].unitPrice = itemCard.quotaPrice * itemCard.couponNum;
            temp[toEditItem].couponPrizeList = cardPrizeList;
            temp[toEditItem].stockType = 1;
            temp[toEditItem].singleBuyLimit = -1;
            temp[toEditItem].cycleStockType = 1;
          }
          setGoodsList(temp)
        } else {
          promptBox('请选择卡券!')
          return
        }
      }
      if (type === '9') {
        if (cardPrizeList && cardPrizeList.length > 0) {
          setcouponPackageNo(cardPrizeList[0].couponPackageNo)
          setQuotationItemId(cardPrizeList[0].quotationItemId)
          let itemCard = cardPrizeList[0];
          if (!itemCard.couponNum) {
            promptBox('请输入选中卡包数量!')
            return
          }
          if (!cardPrizeName) {
            setCardPrizeNameVisible(true)
            return
          }
          let addItem = {
            type: type,
            activityStockNum: '',
            remainingStockNum: '',
            prizeImg: '',
            tradeTag: '',
            tradeDescribe: '',
            tradeDisplayName: '',
            prizeName: cardPrizeName,
            payPrice: '',
            unitPrice: itemCard.faceValue,
            activityId: activityInfo.objectId,
            remark: '',
            id: '',
            couponPrizeList: cardPrizeList,
            cardPackage: itemCard,
            stockType: 1,
            singleBuyLimit: -1,
            cycleStockType: 1
          };
          if (toEditItem == null) {
            temp.push(addItem)
          } else {
            temp[toEditItem].type = type;
            temp[toEditItem].prizeName = cardPrizeName;
            temp[toEditItem].unitPrice = itemCard.faceValue;
            temp[toEditItem].cardPackage = itemCard;
            temp[toEditItem].stockType = 1;
            temp[toEditItem].singleBuyLimit = -1;
            temp[toEditItem].cycleStockType = 1;
          }
          setGoodsList(temp);
          getPackageDetailList();
        } else {
          promptBox('请选择卡包!')
          return
        }
      }
      setPrizeVisible(false)
    } else {
      promptBox('请选择奖品!')
    }
  }
  /*获取卡包明细*/
  let getPackageDetailList = () => {
    dispatch({
      type: 'discountShoppingRules/getCardByPackageNoNotGroupByCouponNum',
      payload: {
        method: 'get',
        params: {},
        packageNo:couponPackageNo,//卡包编号
        quotationItemId: quotationItemId
      },
      callback: (res) => {
        let toPackageDetail = JSON.parse(JSON.stringify(packageDetail));
        toPackageDetail[currentGoodIndex] = res.body;
        setPackageDetail(toPackageDetail);
      }
    });
  }
  let [cardPackage,setCardPackage] = useState([]);//卡包相关保存数据
  let [packageDetailList,setPackageDetailList] = useState([]);//卡包内卡券明细列表
  /*获取选中奖品信息*/
  let getPrizeData = (props) => {
    let toCardPackage = JSON.parse(JSON.stringify(cardPackage));
    toCardPackage[currentGoodIndex] = props.prizeData.cardPrizeList[0] || {};
    setCardPackage(toCardPackage);
    setPrizeData(props.prizeData);
  }

  let takePackageDetail = (value) => {
    let toPackageDetailList = JSON.parse(JSON.stringify(packageDetailList));
    toPackageDetailList[currentGoodIndex] = value;
    setPackageDetailList(toPackageDetailList);
  }
  /*卡券奖品名称确定事件*/
  let onOkCardPrizeName = () => {
    if (!cardPrizeName) {
      promptBox('请输入奖品展示名称！')
    } else {
      onConfirmPrizeSet();
      setCardPrizeNameVisible(false)
    }
  }
  //结束时间限制
  let disabledDate = (item, current) => {
    let toEndTime = parseInt(activityData.endTime) + 86400000;
    toEndTime = moment(toEndTime).format('YYYY-MM-DD HH:mm:ss');
    let toStartTime = activityData.startTime;
    toStartTime = moment(toStartTime).format('YYYY-MM-DD HH:mm:ss');
    if (!current) {
      return (moment(item, 'YYYY-MM-DD HH:mm:ss') && moment(item, 'YYYY-MM-DD HH:mm:ss') < moment(toStartTime, 'YYYY-MM-DD HH:mm:ss')) || moment(item, 'YYYY-MM-DD HH:mm:ss') >= moment(toEndTime, 'YYYY-MM-DD HH:mm:ss');
    } else {
      return (current && current < moment(item, 'YYYY-MM-DD HH:mm:ss')) || (current && current >= moment(toEndTime, 'YYYY-MM-DD HH:mm:ss'));
    }
  }
  let [twoInfo, setTwoInfo] = useState({}); //回显信息
  //触发动作
  let [triggerActionList, setTriggerActionList] = useState({
    2: true,
  });
  let changeAction = (e, item, i) => {
    let toTriggerActionList = triggerActionList;
    toTriggerActionList[item.triggerId] = e.target.checked;
    setTriggerActionList({ ...toTriggerActionList })
  }
  //数据获取
  let getEchoSeckillRuleActivity = () => {
    dispatch({
      type: 'seckilActivityRules/echoSeckillRuleActivity',
      payload: {
        method: 'postJSON',
        params: {
          channelId: activityInfo.channelId,
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let toItemObj = res.body;
          setTwoInfo({ ...toItemObj });
          if(toItemObj && toItemObj.triggerCodes.length == 0){
            let triggerObj = {
                activityId: toItemObj.objectId,
                triggerCode: 10001,
                triggerChannelId: 2
            }
            toItemObj.triggerCodes.push(triggerObj)
          }
          if(toItemObj.themePosterInviteModeImg && toItemObj.themeH5InviteModeImg){
            setThemePosterImg(toItemObj.themePosterInviteModeImg);
            setThemeShareImg(toItemObj.themeH5InviteModeImg);
            toItemObj.posterInviteModeImg = toItemObj.posterInviteModeImg || toItemObj.themePosterInviteModeImg;
            toItemObj.h5InviteModeImg = toItemObj.h5InviteModeImg || toItemObj.themeH5InviteModeImg;
          }
          // 触发动作回显
          let toPartakAt = [];
          if (toItemObj && toItemObj.triggerCodes && toItemObj.triggerCodes.length > 0) {
            let toPartakArr = ruleList.filter(item => toItemObj.triggerCodes.some((items) => item.triggerChannelId == items.triggerChannelId));
            toPartakArr.forEach(el => {
              toPartakAt.push(el.triggerId);
            });
          }
          let toShareTask = [];
          if (toItemObj.posterInviteMode == 1) {
            toShareTask.push("1");
          }
          if (toItemObj.h5InviteMode == 1) {
            toShareTask.push("2");
          }
          let isShare = toItemObj.isShare != 0;
          let toIsShowActivityTime = toItemObj.timeSwitch === 1 ? 1 : 0;
          getIsShowActivityTime(toIsShowActivityTime);
          let toIsEnterprise = toItemObj.isEnterprise === 1 ? 1 : 0;
          getIsEnterprise(toIsEnterprise);
          if (activityInfo.marketActivityType) {//活动未配置规则时回显触发动作不参与
            // toItemObj.partakAt = toPartakAt;
            let toIsTools = [...isTools];
            toIsTools[0] = toItemObj.isAttentionWechat == 1;
            toIsTools[1] = toItemObj.isMemberRegister == 1;
            toIsTools[2] = toItemObj.isBindCar == 1;
            toIsTools[5] = toItemObj.posterInviteMode == 1 && isShare;
            toIsTools[6] = toItemObj.h5InviteMode == 1 && isShare;
            setisTools([...toIsTools]);
          }
          toItemObj.shareTask = toShareTask;
          toItemObj.isShare = isShare ? 1 : 0;
          form.setFieldsValue(toItemObj);
          let toPostFrom = JSON.parse(JSON.stringify(postFrom));;
          toPostFrom.activityRuleBaseInfoVO.isAttentionWechat = toItemObj.isAttentionWechat || 0;
          toPostFrom.activityRuleBaseInfoVO.h5InviteMode = toItemObj.h5InviteMode || 0;
          toPostFrom.activityRuleBaseInfoVO.isBindCar = toItemObj.isBindCar || 0;
          toPostFrom.activityRuleBaseInfoVO.isH5InviteNickName = toItemObj.isH5InviteNickName;
          toPostFrom.activityRuleBaseInfoVO.isLBS = toItemObj.isLBS || 0;
          toPostFrom.activityRuleBaseInfoVO.isMemberRegister = toItemObj.isMemberRegister || 0;
          toPostFrom.activityRuleBaseInfoVO.posterInviteMode = toItemObj.posterInviteMode || 0;
          setPostFrom(toPostFrom);
          let toisLBS = typeLBS;
          toisLBS[0] = toPostFrom.activityRuleBaseInfoVO.isLBS == 1 ? true : false;
          setTypeLBS([...toisLBS]);
          setWechatImgs(toItemObj.wechatImg);
          setWechatImg2(toItemObj.posterInviteModeImg);
          setWechatImg3(toItemObj.h5InviteModeImg);
          setShareShape(isShare);
          form.setFieldsValue(toItemObj);
          let toSubscribeMsgList = toItemObj.activityNoticeIds && toItemObj.activityNoticeIds.split(",") || [];
          setSubscribeMsg(toSubscribeMsgList);
          isDataChange = false;
        }
      }
    });
  };
  let [isCycleTimeVisible, setCycleTimeVisible] = useState(false);//每月循环不规则日期提示
  //确认
  let cycleTimeOk = (e) => {
    setCycleTimeVisible(false);
  }
  //取消
  let cycleTimeCancel = (e) => {
    setTimeStart(null);
    setTimeEnd(null);
    setDateStart(null);
    setDateEnd(null);
    setCycleTimeVisible(false);
  }
  let [cycleModelMsg, setCycleModelMsg] = useState('');//循环周期提示框文案
  let cycleDateBlur = (e, time) => {
    if (cycle == 1 && timeStart && timeEnd) {
      if (timeFormatAndJudge(timeStart) >= timeFormatAndJudge(timeEnd)) {
        message.error('结束时间需大于开始时间')
        return
      }
    }
    if ((cycle == 2 || cycle == 3) && timeStart && timeEnd && dateStart && dateEnd) {
      if (dateStart > dateEnd) {
        message.error('结束时间需大于开始时间')
        return
      }
      if (timeFormatAndJudge(timeStart) >= timeFormatAndJudge(timeEnd)) {
        message.error('结束时间需大于开始时间')
        return
      }
      if (dateStart == 29 || dateEnd == 29 || dateStart == 30 || dateEnd == 30 || dateStart == 31 || dateEnd == 31) {
        let startTime = (typeof timeStart == "string") ? timeStart : timeStart.format('HH:mm:ss');
        let endTime = (typeof timeEnd == "string") ? timeEnd : timeEnd.format('HH:mm:ss');
        let message = `您选择的周期为：每月${dateStart}号~${dateEnd}号 ${startTime}~${endTime}`;
        setCycleTimeVisible(true);
        setCycleModelMsg(message);
      }
    }
  }
  useEffect(() => {
    form.setFieldsValue({
      partakAt: [],  //触发动作
      attentionWechatCopyWriting: "您还未关注公众号，需关注后参与",//公众号 引导文案
      memberRegisterCopyWriting: "您还不是注册会员，需要注册会员才能参与",//会员注册 引导文案
      bindCarCopyWriting: "您还未绑定车辆，需要绑定车辆后才能参与",//绑定车辆 引导文案
      wechatImg: "", //h5图文链接图片
      wechatTitle: "",   //h5图文链接标题
      wechatDescription: "",   //h5图文链接描述
      // wechatUrl: "",   //h5下行链接
      isNews: 0,   //是否支持消息授权引导
      newsName: "",
      newsMould: "",
      isShare: 1,    //是否支持分享
      shareTask: "",
      posterInviteModeImg: "",  //海报图片
      h5InviteModeCopyWriting: "点击右上方“…”分享好友",
      h5InviteModeImg: "",
      h5InviteTitle: "",
      notInventory: "您来晚了，该商品已经被洗劫一空",//库存文案
      h5InviteDescription: '',
      taskId: null
    })
  }, []);
  useEffect(()=>{
    //数据回显
    if (ruleList && ruleList.length > 0 && activityInfo && activityInfo.objectId && activityInfo.channelId) {
      getEchoSeckillRuleActivity();
      getBuyCheaperGoods();
      getBuyCheaperCopyWriting();
      // getBuyCheaperBuyLimit();
    }
  },[ruleList])
  let [isShowActivityTime, getIsShowActivityTime] = useState(1);
  let setIsShowActivityTime = (value) => {
    let isShowActivityTime = value ? 1 : 0;
    getIsShowActivityTime(isShowActivityTime);
  }
  //企业logo
  let [isEnterprise, getIsEnterprise] = useState(0);
  let setIsEnterprise = (value) => {
    if(value){
      queryEnterpriseLogoStatus(value);
    }else{
      getIsEnterprise(value);
    }
  }
  let queryEnterpriseLogoStatus = (val) => {
    dispatch({
      type: 'twoNumber/queryEnterpriseLogoStatus',
      payload: {
        method: 'get',
        params: {}
      },
      callback:(res)=>{
        if (res.result.code == "0") {
          if(res.body){
            let isEnterprise = val ? 1 : 0;
            getIsEnterprise(isEnterprise);
          }else{
            message.error("开启失败，企业logo未上传！");
          }
        }
      }
    })
  }
  //订阅消息
  let [subscribeMsg, setSubscribeMsg] = useState([]);
  let [subscribeMsgList, setSubscribeMsgList] = useState([]);
  let subscribeMsgChange = (value) => {
    setSubscribeMsg(value)
  }
  let getSubscribelMessage = () => {
    dispatch({
      type: 'configActivityRules/getSubscribelMessage',
      payload: {
        method: 'postJSON',
        params: {
          sceneType: 1,
          templateType: 2
        }
      },
      callback:(res)=>{
        if (res.result.code == "0") {
          if(res.body){
            setSubscribeMsgList(res.body);
          }else{
            message.error(res.result.message);
          }
        }
      }
    })
  }
  let [themePosterImg, setThemePosterImg] = useState('');//主题海报图片
  let [themeShareImg, setThemeShareImg] = useState('');//主题分享图片
  //使用主题海报
  let useThemePosterInviteModeImg = () => {
    form.setFieldsValue({
      posterInviteModeImg: themePosterImg,
    });
    setWechatImg2(themePosterImg);
  }
  //使用主题图片
  let useThemeH5InviteModeImg = () => {
    form.setFieldsValue({
      h5InviteModeImg: themeShareImg,
    });
    setWechatImg3(themeShareImg);
  }
  useEffect(() => {
    dispatch({
      type: 'activityModule/queryThirdChannel',
      payload: {
        method: 'get',
        params: {
          channelId: activityInfo.channelId,
        }
      },
    })
    getSubscribelMessage();
  }, [])
  useEffect(() => {
    let activityStep = parseInt(JSON.parse(localStorage.getItem('activityStep'))); //活动信息
    if (ruleList && ruleList.length > 0) {
      let toTriggerActionList = {};
      let toPartakAt = [];
      if (!activityInfo.marketActivityType && activityStep <= 2) {   //未选活动状态
        let filtRuleList = ruleList.filter(item => item.checked == 1);
        if (filtRuleList && filtRuleList[0]) {
          toTriggerActionList = {
            [`${filtRuleList[0].triggerId}`]: true
          }
          toPartakAt = [filtRuleList[0].triggerId];
        }
        let toFieldsValue = {};
        ruleList.forEach(el => {
          if (el.actionName) {
            toFieldsValue[el.actionName] = el.copyWriting;
          }
        })
        form.setFieldsValue(toFieldsValue);
      } else {   //编辑或其它已生成marketActivityType状态
        if (twoInfo && twoInfo.triggerCodes && twoInfo.triggerCodes.length > 0) {
          let toPartakArr = ruleList.filter(item => twoInfo.triggerCodes.some((items) => item.triggerChannelId == items.triggerChannelId));
          toPartakArr.forEach(el => {
            toPartakAt.push(el.triggerId);
            toTriggerActionList[el.triggerId] = true;
          });
          let toFieldsValue = {};
          ruleList.forEach(el => {
            if (el.actionName) {
              toFieldsValue[el.actionName] = twoInfo[el.actionName] ? twoInfo[el.actionName] : el.copyWriting ? el.copyWriting : '';
            }
          })
          form.setFieldsValue(toFieldsValue);
        }
      }
      form.setFieldsValue({
        partakAt: [...toPartakAt]
      });
      setTriggerActionList({ ...toTriggerActionList });
    }
  }, [ruleList, twoInfo]);
  useEffect(() => {
    isDataChange = true;
  }, [postFrom, goodsList, buyLimit, timeStart, timeEnd, dateStart, dateEnd, limitNum]);
  return (
    <>
      {/* 商品类型确认弹窗 */}
      <Modal title="提示" visible={isGoodsTypeVisible} okText="确认" cancelText="取消" onOk={goodsTypeOk} onCancel={goodsTypeCancel}>
        <p>切换操作会清空已添加商品，确认切换卡券/卡包吗？</p>
      </Modal>
      {/* 确认循环周期时间 */}
      <Modal title="提示" visible={isCycleTimeVisible} okText="继续" cancelText="取消" onOk={cycleTimeOk} onCancel={cycleTimeCancel}>
        <p style={{ "font-weight": "700" }}>{cycleModelMsg}</p>
        <p style={{ "color": "#8c8787" }}><span style={{ 'color': 'red' }}>对于没有29号/30号/31号的月份，当月的这几天将没有该活动循环，</span>你还要继续吗？</p>
      </Modal>
      {/* 上一步弹窗 */}
      <Modal title="提示" visible={isModalVisible} okText="是" cancelText="否" onOk={handleOk} onCancel={handleCancel}>
        <p>您还没有完成规则配置，是否保存?</p>
      </Modal>
      {/* 删除商品弹窗 */}
      <Modal title="提示" visible={isCommodityLayer} okText="是" cancelText="否" onOk={commodityLyOk} onCancel={ommodityLyCancel}>
        <p>是否确认删除该商品?</p>
      </Modal>
      {/*选择商品*/}
      {
        prizeVisible ? <Modal
          width={1200}
          okText="确定"
          title="选择商品"
          cancelText="取消"
          closable={false}
          maskClosable={false}
          visible={prizeVisible}
          onOk={onConfirmPrizeSet}
          afterClose={getBudget}
          onCancel={() => { setPrizeVisible(false) }}
        >
          {/* activityType: 1为大转盘，2为秒杀 3为直抽 4位优惠购       editGood = {editGood}*/}
          <SelectPrize onOk={getPrizeData} activityType={'4'} takePackageDetail = {takePackageDetail} goodsType={goodsType} editGood = {editGood}/>
          <Modal
            onOk={onOkCardPrizeName}
            closable={false}
            maskClosable={false}
            visible={cardPrizeNameVisible}
            onCancel={() => {
              setCardPrizeNameVisible(false)
              setCardPrizeName('')
            }}
          >
            <div>
              <span>
                奖品展示名称
                <Tooltip title="在活动中展示的名称">
                  <InfoCircleOutlined className={styles.wrap2_ico} />
                </Tooltip>：
              </span>
              <Input
                value={cardPrizeName}
                style={{ width: '150px' }}
                onChange={(e) => { setCardPrizeName(e.target.value) }}
              />
            </div>
          </Modal>
        </Modal> : null
      }
      {/*添加活动库存弹窗*/}
      <Modal
        okText="确定"
        title={addStockTypes == 1 ? '添加库存' : '减少库存'}
        cancelText="取消"
        closable={false}
        maskClosable={false}
        visible={addStockVisible}
        onOk={onAddStock}
        onCancel={() => { setAddStockVisible(false) }}
      >
        <span>{addStockTypes == 1 ? '添加' : '减少'}库存：</span>
        <InputNumber
          min={0}
          parser={limitNumber}
          formatter={limitNumber}
          value={addStockNum}
          onChange={(value) => { onAddStockNumChange(value) }}
        />
      </Modal>
      <Form form={form} onFinish={onFinish} onFieldsChange={onFieldsChange}>
        <h1 className={styles.wrap_h1}>活动规则及奖品</h1>
        <div className={styles.mould_wrap}>
          {/* 参与活动触发动作 */}
          <div className={`${styles.wrap2_box} ${styles.wrap2_box1}`}>
            <h3>参与活动触发动作
              <Tooltip title="没有满足指定条件的用户会触发对应的行为。如“会员注册”，没有注册的会员系统会引导注册"><InfoCircleOutlined className={styles.wrap2_ico} /></Tooltip>
            </h3>
            <div className={styles.box1_cen}>
              <Form.Item name="partakAt" className={styles.box1_cen_check} label="选择触发动作：" rules={[{ required: true, message: "请选择相关动作" }]}>
                <Checkbox.Group className={styles.box1_cen_checks} disabled={detailStatus || isActivityHave}>
                  <Row>
                    {/* <Col span={6}><Checkbox onChange={isToolsBox.bind(this, 0)} value='1' style={{ lineHeight: '32px' }}>关注公众号</Checkbox></Col>
                    <Col span={6}><Checkbox onChange={isToolsBox.bind(this, 1)} value='2' checked={isTools[1]} disabled style={{ lineHeight: '32px' }}>会员注册</Checkbox></Col>
                    <Col span={6}><Checkbox onChange={isToolsBox.bind(this, 2)} value='3' checked={isTools[2]} style={{ lineHeight: '32px' }}>绑定车辆</Checkbox></Col>
                    <Col span={6}><Checkbox value='4' onChange={changeLBS} style={{ lineHeight: '32px' }}>地理位置授权</Checkbox></Col> */}
                    {
                      ruleList.map((item, index) => {
                        //其他
                        return item.triggerId !== 4 ? <Col span={6}>
                          <Checkbox onChange={(e) => { changeAction(e, item, index) }}
                            value={item.triggerId}
                            disabled={item.checked == 1}
                            style={{ lineHeight: '32px' }}>{item.triggerName}</Checkbox>
                        </Col> :
                          //地理位置授权
                          <Col span={6}>
                            <Checkbox onChange={changeLBS}
                              value={item.triggerId}
                              style={{ lineHeight: '32px' }}>{item.triggerName}</Checkbox>
                          </Col>
                      })
                    }
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </div>
            {/* 活动动作对应配置 */}
            <div className={styles.box1_configure}>
              {
                ruleList.map((item, index) => {
                  let toInfo = '';
                  if (item.triggerId == 1) {  //关注公众号
                    toInfo = <div className={`${styles.box1_config_wrap} ${styles.box1_config_wrap1}`}>
                      <h5>关注公众号</h5>
                      <div className={styles.box1_config1_top}>
                        <h6>引导文案：</h6>
                        <Form.Item name="attentionWechatCopyWriting" label="" className={`${styles.box2_count} ${styles.box2_count2}`} extra="引导用户关注的弹窗中使用">
                          <Input disabled={detailStatus || isActivityHave} placeholder="您还未关注公众号，需关注后参与" />
                        </Form.Item>
                      </div>
                      <div className={styles.box1_config1_n1}>
                        <h6>h5图文链接信息：</h6>
                        <p>用户在活动中关注公众号后，下行的h5链接可以快捷再次进入活动。</p>
                      </div>
                      <div className={styles.box2_count2}>
                        <h6><span style={{ color: 'red' }}>*</span>h5图文链接图片：</h6>
                        <Form.Item name='wechatImg' label="" extra="建议尺寸：200px*200px" >
                          <Upload
                            name="files"
                            headers={headers}
                            listType="picture"
                            action={uploadIcon}
                            showUploadList={false}
                            onChange={(value => { weChange(value, 1) })}
                            beforeUpload={(value) => { weUpload(value, 1) }}
                          >
                            <Button disabled={detailStatus || isActivityHave} icon={<UploadOutlined />} className={styles.box2_uplonds}>上传图片</Button>
                          </Upload>
                        </Form.Item>
                        {
                          wechatImgs ? <div className={styles.wrap_wechatImgs}>
                            <img src={wechatImgs} />
                          </div> : null
                        }
                      </div>
                      <div className={styles.box1_config1_top}>
                        <h6><span style={{ color: 'red' }}>*</span>h5图文链接标题：</h6>
                        <Form.Item name="wechatTitle" label="" className={`${styles.box2_count} ${styles.box2_count2}`}>
                          <Input disabled={detailStatus || isActivityHave} />
                        </Form.Item>
                      </div>

                      <div className={styles.box1_config1_top}>
                        <h6><span style={{ color: 'red' }}>*</span> h5图文链接描述：</h6>
                        <Form.Item name="wechatDescription" label="" className={`${styles.box2_count} ${styles.box2_count2}`}>
                          <Input disabled={detailStatus || isActivityHave} />
                        </Form.Item>
                      </div>
                    </div>
                  } else if (item.triggerId == 2) {   //会员注册
                    toInfo = <div className={`${styles.box1_config_wrap} ${styles.box1_config_wrap2}`}>
                      <h5>会员注册</h5>
                      <div className={styles.box1_config1_top}>
                        <h6><span style={{ color: 'red' }}>*</span> 引导文案：</h6>
                        <Form.Item name="memberRegisterCopyWriting" label="" rules={[{ required: true, message: '请输入引导文案' }]} className={styles.box2_count} extra="引导用户注册的弹窗中使用">
                          <Input placeholder="您还不是注册会员，需要注册会员才能参与" disabled={detailStatus || isActivityHave} />
                        </Form.Item>
                      </div>
                    </div>
                  } else if (item.triggerId == 3) {   //绑定车辆
                    toInfo = <div className={`${styles.box1_config_wrap} ${styles.box1_config_wrap3}`}>
                      <h5>绑定车辆</h5>
                      <div className={styles.box1_config1_top}>
                        <h6>引导文案：</h6>
                        <Form.Item name="bindCarCopyWriting" label="" className={styles.box2_count} extra="引导用户绑车的弹窗中使用">
                          <Input placeholder="您还未绑定车辆，需要绑定车辆后才能参与" disabled={detailStatus || isActivityHave} />
                        </Form.Item>
                      </div>
                    </div>
                  } else {
                    toInfo = <div className={`${styles.box1_config_wrap} ${styles.box1_config_wrap3}`}>
                      <h5>{item.triggerName}</h5>
                      <div className={styles.box1_config1_top}>
                        <h6>引导文案：</h6>
                        <Form.Item name={item.actionName} label="" className={styles.box2_count} extra={`引导用户${item.triggerName}中使用`}>
                          <Input placeholder={item.copyWriting} disabled={detailStatus || isActivityHave} />
                        </Form.Item>
                      </div>
                    </div>
                  }
                  if (triggerActionList[item.triggerId]) {
                    return toInfo;
                  } else {
                    return null;
                  }
                })
              }
            </div>
          </div>
          {/*购买限制*/}
          <div className={`${styles.wrap2_box} ${styles.wrap2_box2}`}>
            <h3>购买限制</h3>
            <div className={styles.box3_radio}>
              <strong><span style={{ color: 'red' }}>*</span> 循环周期</strong>
              <Tooltip title={'可设置在活动时间内的周期循环方式'}><InfoCircleOutlined className={`${styles.wrap2_ico} ${styles.wrap2_ico2}`} /></Tooltip>
              <Radio.Group disabled={detailStatus || isActivityHave} value={cycle} onChange={changeCycle}>
                <Radio value={-1}>不限</Radio>
                <Radio value={1}>每日</Radio>
                <Radio value={2}>每周</Radio>
                <Radio value={3}>每月<Tooltip title={'若选择循环周期为每月29号/30号/31号，对于没有29号/30号/31号的月份，当月将没有该活动循环'}><InfoCircleOutlined className={`${styles.wrap2_ico} ${styles.wrap2_ico2}`} /></Tooltip></Radio>
              </Radio.Group>
            </div>
            {cycle == 1 ?
              <div className={styles.box3_radio}>
                <TimePicker style={{ 'width': '173px' }} locale={locale} showTime disabled={detailStatus || isActivityHave} value={timeStart ? moment(timeStart, 'HH:mm:ss') : ''} onBlur={(e) => { cycleDateBlur(e, timeStart) }} placeholder="请选择开始时间" onChange={timeStartChange} format="HH:mm:ss" className={styles.form_item_width2} />
                <span style={{ display: "inline-block", padding: '0 8px' }}>至</span>
                <TimePicker style={{ 'width': '173px' }} locale={locale} showTime disabled={detailStatus || isActivityHave} value={timeEnd ? moment(timeEnd, 'HH:mm:ss') : ''} onBlur={(e) => { cycleDateBlur(e, timeEnd) }} placeholder="请选择结束时间" onChange={timeEndChange} format="HH:mm:ss" className={styles.form_item_width2} />
              </div>
              : cycle == 2 ?
                <div className={styles.box3_radio}>
                  <Select style={{ 'width': '120px' }} placeholder="请选择" showSearch disabled={detailStatus || isActivityHave} value={dateStart} onBlur={(e) => { cycleDateBlur(e, dateStart) }} onChange={dateStartChange}>
                    {
                      weekArr.map((item, key) => {
                        return <Option key={key} value={item.key}>{item.label}</Option>
                      })
                    }
                  </Select>
                  <span style={{ display: "inline-block", padding: '0 8px' }}>至</span>
                  <Select style={{ 'width': '120px' }} placeholder="请选择" showSearch disabled={detailStatus || isActivityHave} value={dateEnd} onBlur={(e) => { cycleDateBlur(e, dateEnd) }} onChange={dateEndChange}>
                    {
                      weekArr.map((item, key) => {
                        return <Option key={key} value={item.key}>{item.label}</Option>
                      })
                    }
                  </Select>
                  <span style={{ display: "inline-block", padding: '0 8px' }}> </span>
                  <TimePicker style={{ 'width': '173px' }} locale={locale} showTime disabled={detailStatus || isActivityHave} value={timeStart ? moment(timeStart, 'HH:mm:ss') : ''} onBlur={(e) => { cycleDateBlur(e, timeStart) }} placeholder="请选择开始时间" onChange={timeStartChange} format="HH:mm:ss" className={styles.form_item_width2} />
                  <span style={{ display: "inline-block", padding: '0 8px' }}>至</span>
                  <TimePicker style={{ 'width': '173px' }} locale={locale} showTime disabled={detailStatus || isActivityHave} value={timeEnd ? moment(timeEnd, 'HH:mm:ss') : ''} onBlur={(e) => { cycleDateBlur(e, timeEnd) }} placeholder="请选择结束时间" onChange={timeEndChange} format="HH:mm:ss" className={styles.form_item_width2} />
                </div>
                : cycle == 3 ?
                  <div className={styles.box3_radio}>
                    <Select style={{ 'width': '120px' }} placeholder="请选择" showSearch disabled={detailStatus || isActivityHave} value={dateStart} onBlur={(e) => { cycleDateBlur(e, dateStart) }} onChange={dateStartChange}>
                      {
                        monthArr.map((item, key) => {
                          return <Option key={key} value={item.key}>{item.label}</Option>
                        })
                      }
                    </Select>
                    <span style={{ display: "inline-block", padding: '0 8px' }}>至</span>
                    <Select style={{ 'width': '120px' }} placeholder="请选择" showSearch disabled={detailStatus || isActivityHave} value={dateEnd} onBlur={(e) => { cycleDateBlur(e, dateEnd) }} onChange={dateEndChange}>
                      {
                        monthArr.map((item, key) => {
                          return <Option key={key} value={item.key}>{item.label}</Option>
                        })
                      }
                    </Select>
                    <span style={{ display: "inline-block", padding: '0 8px' }}> </span>
                    <TimePicker style={{ 'width': '173px' }} locale={locale} showTime disabled={detailStatus || isActivityHave} value={timeStart ? moment(timeStart, 'HH:mm:ss') : ''} onBlur={(e) => { cycleDateBlur(e, timeStart) }} placeholder="请选择开始时间" onChange={timeStartChange} format="HH:mm:ss" className={styles.form_item_width2} />
                    <span style={{ display: "inline-block", padding: '0 8px' }}>至</span>
                    <TimePicker style={{ 'width': '173px' }} locale={locale} showTime disabled={detailStatus || isActivityHave} value={timeEnd ? moment(timeEnd, 'HH:mm:ss') : ''} onBlur={(e) => { cycleDateBlur(e, timeEnd) }} placeholder="请选择结束时间" onChange={timeEndChange} format="HH:mm:ss" className={styles.form_item_width2} />
                  </div>
                  : null
            }

            <div className={styles.box3_radio}>
              <strong><span style={{ color: 'red' }}>*</span> 参与次数限制</strong>
              <Tooltip title={'活动商品购买限制'}><InfoCircleOutlined className={`${styles.wrap2_ico} ${styles.wrap2_ico2}`} /></Tooltip>
              <Radio.Group disabled={detailStatus || isActivityHave} value={buyLimit} onChange={changeBuyLimit}>
                <Radio value={-1}>不限</Radio>
                <Radio value={1}>限制</Radio>
              </Radio.Group>
            </div>
            {buyLimit == 1 ? <div className={styles.box3_radio}>
              <span>每人最多 <InputNumber disabled={detailStatus || isActivityHave} min={0} value={limitNum} parser={limitNumber} formatter={limitNumber} onChange={limitNumChange} /> 次参与机会</span>
            </div> : null}
          </div>

          {/* 活动商品 */}
          <div className={`${styles.wrap2_box} ${styles.wrap2_box4}`}>
            <h3>活动商品</h3>
            <div className={styles.box3_radio}>
              <strong><span style={{ color: 'red' }}>*</span>商品类型：</strong>
              <Radio.Group disabled={detailStatus || isActivityHave} value={goodsType} onChange={goodsTypeChange}>
                <Radio value={1}>卡券</Radio>
                <Radio value={9}>卡包</Radio>
              </Radio.Group>
            </div>
            {/* 商品列表 */}
            <div className={styles.box_sessions}>
              <div className={styles.box_sessions_li}>
                <div className={styles.box_sessions_top}>
                  <div className={styles.box_sessions_top_lf}>
                    <strong>商品配置</strong>
                    <strong>
                      <Tooltip title={'商品总预算=商品单价*库存 之和'}>
                        <InfoCircleOutlined className={`${styles.wrap2_ico} ${styles.wrap2_ico1}`} />
                      </Tooltip>
                      总预算：¥{budget}</strong>
                  </div>
                </div>
                <div className={`${styles.box_sessions_child} ${styles.box_sessions_child2}`}>
                  {
                    goodsList && goodsList.length > 0 && goodsList.map((childItem, i) => {
                      return <div className={styles.sessions_child_wrap}>
                        <div className={styles.sessions_child_li}>
                          <div className={styles.sessions_header}>
                            <h5>商品{i + 1}</h5>
                            {/* {detailStatus || isActivityHave ? null :
                              <span onClick={(e) => { editCommodityClick(i) }}>编辑</span>
                            } */}
                          </div>
                          <div className={`${styles.sessions_child_pn} ${styles.sessions_child_pn1}`}>
                            <span>商品：{childItem.prizeName}</span>
                            <span>单价：¥{childItem.unitPrice}</span>
                            <span>
                              <Tooltip title={'商品优惠后展示的价格，即用户实际支付价'}>
                                <InfoCircleOutlined className={styles.wrap2_ico} />
                              </Tooltip>
                              支付价：¥ <InputNumber disabled={detailStatus || isActivityHave} min={0} step={0.01} formatter={limitDecimalsF} parser={limitDecimalsP} value={childItem.payPrice} onChange={(e) => { payPriceChang(e, i) }} /></span>
                            {/* {cycle == -1 ? <span>总库存：<InputNumber disabled={detailStatus || isActivityHave} min={0} value={childItem.activityStockNum} parser={limitNumber} formatter={limitNumber} onChange={(e) => { sessionNumberChang(e, i) }} /></span>
                              : <span>周期库存：<InputNumber disabled={detailStatus || isActivityHave} min={0} value={childItem.activityStockNum} parser={limitNumber} formatter={limitNumber} onChange={(e) => { sessionNumberChang(e, i) }} /></span>}
                            {detailStatus || isActivityHave ? <span>剩余库存：{childItem.remainingStockNum}</span> : null}
                            {detailStatus || isActivityHave ? <em><i onClick={() => { modifyNumberChang(childItem, i, 1) }} >添加</i><i onClick={() => { modifyNumberChang(childItem, i, 0) }} >减少</i></em> : null} */}
                          </div>
                          <div className={`${styles.sessions_child_pn} ${styles.sessions_child_pn2}`}>
                            <div className={styles.box3_radio}>
                              <span>库存配置：</span>
                              <Radio.Group disabled={detailStatus || isActivityHave} value={childItem.stockType} onChange={(e) => {changeStockTypeChange(e, i)}}>
                                <Radio value={1}>总库存</Radio>
                                <Radio value={2}>周期库存</Radio>
                              </Radio.Group>
                              <Select placeholder="请选择"disabled={detailStatus || isActivityHave || childItem.stockType == 1} value={childItem.cycleStockType} onChange={(e) => {cycleTypeChange(e, i)}}>
                                <Option value={1}>每日</Option>
                                <Option value={2}>每周</Option>
                                <Option value={3}>每月</Option>
                              </Select>
                            </div>
                          </div>
                          <div className={`${styles.sessions_child_pn} ${styles.sessions_child_pn2}`}>
                            库存数量：<InputNumber disabled={detailStatus || isActivityHave} min={0} value={childItem.activityStockNum} parser={limitNumber} formatter={limitNumber} onChange={(e) => { sessionNumberChang(e, i) }} />
                            {detailStatus || isActivityHave ? <span className={styles.sessions_remain}>剩余库存：{childItem.remainingStockNum}</span> : null}
                            {detailStatus || isActivityHave ? <em><i onClick={() => { modifyNumberChang(childItem, i, 1) }} >添加</i><i onClick={() => { modifyNumberChang(childItem, i, 0) }} >减少</i></em> : null}
                          </div>
                          <div className={`${styles.sessions_child_pn} ${styles.sessions_child_pn2}`}>
                            <div className={styles.box3_radio}>
                              <span>购买限制：</span>
                              <Radio.Group disabled={detailStatus || isActivityHave} value={childItem.singleBuyLimit} onChange={(e) => {singleBuyLimitChange(e, i)}}>
                                <Radio value={-1}>不限制</Radio>
                                <Radio value={1}>最多购买 <InputNumber disabled={detailStatus || isActivityHave || childItem.singleBuyLimit == -1} min={1} value={childItem.singleLimitNum} parser={limitNumber} formatter={limitNumber} onChange={(e) => { singleLimitNumChange(e, i) }} /> 件</Radio>
                              </Radio.Group>
                            </div>
                          </div>
                          <div className={`${styles.sessions_child_pn} ${styles.sessions_child_pn2}`}>
                            <span>商品展示名称：<Input disabled={detailStatus || isActivityHave} className={styles.sessions_child_pn2_u} placeholder="请输入" value={childItem.tradeDisplayName} onChange={(e) => { sessionNameChang(e, i) }} /></span>
                            {/* <span>商品描述：<Input disabled={detailStatus || isActivityHave} value={childItem.tradeDescribe} className={styles.sessions_child_pn2_u} placeholder="请输入" onChange={(e) => { sessionDescribeChang(e, i) }} /></span> */}
                          </div>
                          <div className={`${styles.sessions_child_pn} ${styles.sessions_child_pn3}`}>
                            <div className={styles.sessions_child_pn3_lf}>
                              <strong>商品图片：</strong>
                              <div>
                                <Upload
                                  name="files"
                                  headers={headers}
                                  listType="picture"
                                  action={uploadIcon}
                                  showUploadList={false}
                                  beforeUpload={(e) => { imgUpLoad(e, i) }}
                                  onChange={(e) => { imgUpChange(e, i) }}
                                >
                                  <Button icon={<UploadOutlined />} disabled={detailStatus || isActivityHave}>上传图片</Button>
                                </Upload>
                                <p>建议尺寸：120px*105px</p>
                              </div>
                            </div>
                            {
                              childItem.prizeImg ?
                                <div className={styles.sessions_child_pn3_rg}>
                                  <img className={styles.sessions_child_pn3_rgm2} src={childItem.prizeImg}></img>
                                </div>
                                : <div className={styles.sessions_child_pn3_rg}>
                                  <img className={styles.sessions_child_pn3_rgm1} src={require('../../../../assets/activity/setpage_m3.png')}></img>
                                  <p>默认图</p>
                                </div>
                            }
                          </div>
                          <div className={`${styles.sessions_child_pn} ${styles.sessions_child_pn4}`}>
                            <span><span style={{ color: 'red' }}>*</span> 商品标签：</span>
                            <Input disabled={detailStatus || isActivityHave} onChange={(e) => { sessionLableChang(e, i) }} value={childItem.tradeTag} className={styles.sessions_child_pn4_pn} placeholder="请输入商品标签，不超过4个字" maxLength="4" />
                            <Tooltip title={'填入活动商品标签，以便后续对活动商品进行优化，活动期间展示在商品详情页，例如：热销，优惠购，爆款等'}>
                              <QuestionCircleOutlined className={`${styles.wrap2_ico} ${styles.ico_attr}`} />
                            </Tooltip>
                          </div>
                          {childItem.type == 9 ? 
                            <div className={`${styles.sessions_child_pn} ${styles.sessions_child_pn4}`}>
                              <span>卡包权益：</span>
                              <div className={styles.packageDetail}>
                                {packageDetail.length > 0 && packageDetail[i] && packageDetail[i].length > 0 && packageDetail[i].map((item,index)=>{
                                  return <p>{item.couponSkuName} {item.faceValue}元 *{item.couponNum}</p>
                                })}
                              </div>
                            </div>
                          :null}
                          <div className={`${styles.sessions_child_pn} ${styles.sessions_child_pn4}`}>
                            <span>购买须知：</span>
                            <div className={styles.textArea}>
                              <RichText onTextChange={(e) => onTextChange(e, i)} couponUsageExplain={childItem.remark} disabled={detailStatus} />
                            </div>
                          </div>
                        </div>
                        {
                          detailStatus || isActivityHave ? null :
                            <div className={styles.sessions_child_pn5}>
                              <span onClick={(e) => { comdiyDelete(i) }}>删除</span>
                            </div>
                        }
                      </div>
                    })
                  }
                  <div><Button disabled={detailStatus || isActivityHave || (goodsType == 9 && goodsList.length == 1)} onClick={(e) => { addCommodityClick() }}>添加商品</Button></div>
                </div>
              </div>
            </div>

            {cycle == -1 ?
              <Form.Item name="notInventory" label="无库存提示文案（总库存）" className={styles.box2_count} extra="用户抢商品后无库存的提示">
                <Input placeholder="您来晚了，该商品已经被洗劫一空" className={styles.box2_count_width} disabled={detailStatus || isActivityHave} />
              </Form.Item>
              : <Form.Item name="notInventory" label="无库存提示文案（周期库存）" className={styles.box2_count} extra="用户抢商品后无库存的提示">
                <Input placeholder="您来晚了，该商品已经被洗劫一空" className={styles.box2_count_width} disabled={detailStatus || isActivityHave} />
              </Form.Item>
            }
          </div>


          {/* 分享设置 */}
          <div className={`${styles.wrap2_box} ${styles.wrap2_box3}`}>
            <h3>分享设置
              <div className={styles.wrap2_box_share}>
                <InfoCircleOutlined className={styles.wrap2_ico} />
                <div className={styles.wrap2_fix_share}>
                  <p className={styles.wrap2_fix_share_p1}>分享样式预览</p>
                  <p className={styles.wrap2_fix_share_p2}>活动h5原生的分享功能，开始后分享出去样式</p>
                  <p className={styles.wrap2_fix_share_p3}><img src={require('../../../../assets/activity/share_m1.png')}></img></p>
                </div>
              </div>
            </h3>
            <div className={styles.box4_main}>
              <Form.Item name="isShare" label="是否支持分享：" className={styles.box2_radio} rules={[{ required: true }]} onChange={setIsShare}>
                <Radio.Group disabled={detailStatus || isActivityHave}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </Form.Item>
              {shareShape ?
                <Form.Item name="shareTask" label="分享形式：" rules={[{ required: true, message: "请选择分享形式" }]}>
                  <Checkbox.Group disabled={detailStatus || isActivityHave} className={styles.box3_cen_checks} >
                    <Row>
                      <Col span={8}><Checkbox onChange={isToolsBox.bind(this, 5)} value="1" style={{ lineHeight: '32px' }}>海报二维码邀请</Checkbox></Col>
                      <Col span={8}><Checkbox onChange={isToolsBox.bind(this, 6)} value="2" style={{ lineHeight: '32px' }}>直接h5分享</Checkbox></Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
                : null}
            </div>
            <div className={styles.box3_child}>
              {
                isTools[5] ?
                  <div className={styles.box3_child_li}>
                    <h5>海报二维码邀请</h5>
                    <div className={styles.box3_child_mian}>
                      <h6><i>*</i>海报图片</h6>
                      <Form.Item name='posterInviteModeImg' label="" extra="尺寸要求：1080px*1920px" rules={[{ required: true, message: "请上传海报哦" }]}>
                        <Upload
                          name="files"
                          headers={headers}
                          listType="picture"
                          action={uploadIcon}
                          showUploadList={false}
                          beforeUpload={(value) => { weUpload(value, 2) }}
                          onChange={(value) => { weChange(value, 2) }}
                        >
                          <Button disabled={detailStatus || isActivityHave} icon={<UploadOutlined />} className={styles.box2_uplonds}>上传图片</Button>
                        </Upload>
                      </Form.Item>
                      {
                        wechatImgs2 ? <div className={styles.wrap_wechatImgs}>
                          <img src={wechatImgs2} />
                          {
                            themePosterImg && wechatImgs2 != themePosterImg ? <div className={styles.useThemeImg} onClick={useThemePosterInviteModeImg}>使用主题海报</div>
                            : null                      
                          }
                        </div> : null
                      }
                    </div>
                  </div>
                  : null}
              {
                isTools[6] ?
                  <div className={styles.box3_child_li}>
                    <h5>点击指定链接</h5>
                    <div className={styles.box3_child_mian}>
                      <h6><i>*</i>遮罩引导分享文案：</h6>
                      <Form.Item name="h5InviteModeCopyWriting" label="" className={styles.box5_mian_info_li} rules={[{ required: true, message: "请输入文案" }]}>
                        <Input disabled={detailStatus || isActivityHave} placeholder="点击右上方“…”分享好友" />
                      </Form.Item>
                      <h6><i>*</i>分享图片：</h6>
                      <Form.Item name='h5InviteModeImg' label="" extra="建议尺寸：200px*200px" rules={[{ required: true, message: "请上传海报哦" }]}>
                        <Upload
                          name="files"
                          headers={headers}
                          listType="picture"
                          action={uploadIcon}
                          showUploadList={false}
                          beforeUpload={(value) => { weUpload(value, 3) }}
                          onChange={(value) => { weChange(value, 3) }}
                        >
                          <Button disabled={detailStatus || isActivityHave} icon={<UploadOutlined />} className={styles.box2_uplonds}>上传图片</Button>
                        </Upload>
                      </Form.Item>
                      {
                        wechatImgs3 ? <div className={styles.wrap_wechatImgs}>
                          <img src={wechatImgs3} />
                          {
                            themeShareImg && wechatImgs3 != themeShareImg ? <div className={styles.useThemeImg} onClick={useThemeH5InviteModeImg}>使用主题图片</div>
                            : null
                          }
                        </div> : null
                      }
                      <h6><i>*</i>分享标题：</h6>
                      <Form.Item name="h5InviteTitle" label="" className={styles.box5_mian_info_li} rules={[{ required: true, message: "请输入标题" }]}>
                        <Input disabled={detailStatus || isActivityHave} placeholder="请输入" />
                      </Form.Item>
                      <h6><i>*</i>分享描述：</h6>
                      <Form.Item name="h5InviteDescription" label="" className={styles.box5_mian_info_li} rules={[{ required: true, message: "请输入描述" }]}>
                        <Input disabled={detailStatus || isActivityHave} placeholder="请输入" />
                      </Form.Item>
                    </div>
                  </div>
                  : null}
            </div>
          </div>
          {/* 消息通知引导 */}
          <div className={`${styles.wrap2_box} ${styles.wrap2_box5}`}>
            <h3>其它</h3>
            <div className={styles.box5_main}>
              <div className={styles.box5_main_li}>
                <em className={styles.box5_main_li_em}>活动时间：<Tooltip title="在活动首页显示活动时间"><InfoCircleOutlined className={styles.wrap2_ico} /></Tooltip></em>
                <Switch checked={isShowActivityTime === 1} onChange={setIsShowActivityTime} />
              </div>
              <div className={styles.box5_main_li}>
                <em className={styles.box5_main_li_em}>企业logo：<Tooltip title="在活动首页展示企业logo"><InfoCircleOutlined className={styles.wrap2_ico} /></Tooltip></em>
                <Switch checked={isEnterprise === 1} onChange={setIsEnterprise} />
              </div>
            </div>
          </div>
          {/* 订阅消息通知 */}
          <div className={`${styles.wrap2_box} ${styles.wrap2_box3}`}>
            <h3>订阅通知：</h3>
            <div className={styles.box3_main}>
              <Checkbox.Group className={styles.box3_cen_checks} disabled={detailStatus || isActivityHave}
               onChange={subscribeMsgChange} value={subscribeMsg}>
                <Row className={styles.box3_cen_checks_row}>
                  {subscribeMsgList && subscribeMsgList.length > 0 && subscribeMsgList.map((item)=>{
                    return <Col span={10}><Checkbox disabled={item.status == 2} value={item.subscribelMessageId.toString()} style={{ lineHeight: '32px' }}>{item.subscribelMessageName}</Checkbox></Col>
                  })}
                </Row>
              </Checkbox.Group>
            </div>
          </div>
        </div>
        <div className={styles.wrap_bom}>
          <Button onClick={goBackList}>返回列表</Button>
          <Button onClick={onPrevious}>上一步</Button>
          <Button type="primary" htmlType="submit">下一步</Button>
        </div>
      </Form>
    </>
  )
}
export default connect(({ discountShoppingRules, loading, activityModule, twoNumber }) => ({
  ruleList: activityModule.ruleList,
}))(discountShoppingRulesPage);
