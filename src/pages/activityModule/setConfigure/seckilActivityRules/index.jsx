import React, { useEffect, useState } from 'react';
import { Button, Row, Space, Select, Checkbox, Tooltip, Form, Radio, InputNumber, Col, Input, Upload, message, DatePicker, Modal, Switch  } from 'antd';
import { connect, history } from 'umi';
import locale from 'antd/lib/date-picker/locale/zh_CN'
import styles from './style.less';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment'
import 'moment/locale/zh-cn'
import { uploadIcon } from '@/services/activity.js';
import SelectPrize from '../../selectPrize';   //奖品
import SetColor from '../../components/setColor';   //选择颜色组件
const { RangePicker } = DatePicker;
var isDataChange = false;   //当前form数据是否有变动
var isTabaleDataChange = false; //当前table数据是否有变动
const seckilActivityRulesPage = (props) => {
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
  // 确定保存
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
  let [form] = Form.useForm();
  let [postFrom, setPostFrom] = useState({ //接口相关参数
    activityId: activityInfo.objectId,
    channelId: activityInfo.channelId,
    isAttentionWechat: 0,   //是否关注公众号
    h5InviteMode: 0,     //是否直接H5分享
    isBindCar: 0,         //绑定车辆
    isH5InviteNickName: 0,   //分享人昵称是否使用
    isInviteBuddy: 0,       //邀请好友注册
    isLBS: 0,    //地理位置授权
    isMemberRegister: 0,  // 会员注册
    isSpecifyLink: 0,    //点击指定链接
    posterInviteMode: 0,    //海报二维码邀请方式
  });
  //分享形式
  let [shareShape, setShareShape] = useState(true);
  // 活动规则及奖品-对应框隐藏框
  let [isTools, setisTools] = useState([false, false, false, false, false, false, false]);
  let isToolsBox = (i, value) => {
    let toIsTools = [...isTools];
    toIsTools[i] = value.target.checked;
    setisTools(toIsTools);
    let toPostFrom = { ...postFrom };
    let toIsType = value.target.checked ? 1 : 0;
    if (i == 0) {    //是否关注公众号;
      toPostFrom.isAttentionWechat = toIsType;
      setPostFrom(toPostFrom);
    }
    if (i == 1) {    //是否会员注册	;
      toPostFrom.isMemberRegister = toIsType;
      setPostFrom(toPostFrom);
    }
    if (i == 2) {    //是否绑定车辆
      toPostFrom.isBindCar = toIsType;
      setPostFrom(toPostFrom);
    }
    if (i == 3) {    //是否邀请好友注册
      toPostFrom.isInviteBuddy = toIsType;
      setPostFrom(toPostFrom);
    }
    if (i == 4) {    //是否点击指定链接
      toPostFrom.isSpecifyLink = toIsType;
      setPostFrom(toPostFrom);
    }
    if (i == 5) {    //是否海报二维码邀请方式
      toPostFrom.posterInviteMode = toIsType;
      setPostFrom(toPostFrom);
    }
    if (i == 6) {    //是否直接H5分享
      toPostFrom.h5InviteMode = toIsType;
      setPostFrom(toPostFrom);
    }
    if (i == 5 || i == 6 || i == 3) {
      form.setFieldsValue({
        isShare: 1
      });
      setShareShape(true)
    }
  };
  //是否地理位置授权
  let [typeLBS, setTypeLBS] = useState([false]);
  let changeLBS = (value) => {
    let toPostFrom = { ...postFrom };
    let toIsTypes = value.target.checked ? 1 : 0;
    toPostFrom.isLBS = toIsTypes;
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
      toIsTools[3] = false;
      setisTools(toIsTools);
      form.setFieldsValue({
        shareTask: "",
      })
      setShareShape(false)
    } else {
      setShareShape(true)
    }

  }
  //下一步提交
  let onFinish = (value) => {
    if (!detailStatus) {
      let toForm = Object.assign(value, postFrom);
      let seckilType = false;
      let seckilShop = false;
      let seckilShop2 = false;
      let seckilShop2Name = "";
      sessionsList.forEach((items, j) => {
        if (!items.startTime || !items.endTime) {
          seckilType = true;
        }
        if (items.prizeList.length <= 0) {
          seckilShop = true;
        }
        for (var i = 0; i < items.prizeList.length; i++) {
          let toItems = items.prizeList[i];
          if (!toItems.activityStockNum || !toItems.prizeImg || !toItems.tradeDescribe || !toItems.tradeDisplayName) {
            seckilShop2 = true;
            seckilShop2Name = "请完善场次" + (j + 1) + '中商品' + (i + 1) + '的信息';
            return false;
          }
          if (toItems.isTradeTag == 1) {
            if (!toItems.tradeTag) {
              seckilShop2 = true;
              seckilShop2Name = "请完善场次" + (j + 1) + '中商品' + (i + 1) + '的信息';
              return false;
            }
          }
        }
      })
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
      if (seckilType) {
        message.error('请完善场次信息')
        return
      }
      if (seckilShop) {
        message.error('请添加对应场次商品')
        return
      }
      if (seckilShop2) {
        message.error(seckilShop2Name)
        return
      }
      toForm.wechatImg = wechatImgs || '';
      toForm.posterInviteModeImg = wechatImgs2 || '';
      toForm.h5InviteModeImg = wechatImgs3 || '';
      toForm.isMemberRegister = triggerActionList[2] ? 1 : 0;
      toForm.h5InviteMode = toForm.h5InviteMode ? toForm.h5InviteMode : 0;
      toForm.isBindCar = toForm.isBindCar ? toForm.isBindCar : 0;
      toForm.isH5InviteNickName = toForm.isH5InviteNickName ? toForm.isH5InviteNickName : 0;
      toForm.isLBS = toForm.isLBS ? toForm.isLBS : 0;
      toForm.isInviteBuddy = toForm.isInviteBuddy ? toForm.isInviteBuddy : 0;
      toForm.isSpecifyLink = toForm.isSpecifyLink ? toForm.isSpecifyLink : 0;
      toForm.posterInviteMode = toForm.posterInviteMode ? toForm.posterInviteMode : 0;
      toForm.isAttentionWechat = toForm.isAttentionWechat ? toForm.isAttentionWechat : 0;
      toForm.seckillTimeList = sessionsList;
      toForm.marketType = 2;
      toForm.marketActivityType = 2;
      toForm.drawType = drawType;
      toForm.activityNoticeIds = subscribeMsg.length > 0 && subscribeMsg.join(',') || '';
      toForm.isRemind = isRemind;
      if (isRemind == 1) {
        let wechatTemplateContentList = remindTmId;
        wechatTemplateContentList.forEach((item, i) => {
          wechatTemplateContentList[i].activityId = activityInfo.objectId;
          wechatTemplateContentList[i].content = toForm[item.templateFieldCode];
          wechatTemplateContentList[i].contentColor = gameColor[i];
          wechatTemplateContentList[i].taskId = toForm.taskId;
          if (item.id) {
            wechatTemplateContentList[i].fieldId = item.id;
          } else {
            wechatTemplateContentList[i].fieldId = item.objectId;
          }

          wechatTemplateContentList[i].id = "";
        });
        toForm.wechatTemplateContentList = wechatTemplateContentList;
      }
      // 触发动作
      let toPartakAt = ruleList.filter(item => toForm.partakAt.some((items) => item.triggerId == items));
      let params = {
        wechatTemplateContentList: toForm.wechatTemplateContentList,
        seckillTimeList: toForm.seckillTimeList,
        copywritingVO: {
          notInventory: toForm.notInventoryCopyWriting
        },
        activityRuleBaseInfoVO: {
          activityNoticeIds: toForm.activityNoticeIds,
          activityId: activityInfo.objectId,
          timeSwitch : isShowActivityTime,
          isEnterprise: isEnterprise,
          attentionWechatCopyWriting: toForm.attentionWechatCopyWriting,
          bindCarCopyWriting: toForm.bindCarCopyWriting,
          channelId: activityInfo.channelId,
          h5InviteDescription: toForm.h5InviteDescription,
          h5InviteMode: toForm.h5InviteMode,
          h5InviteModeCopyWriting: toForm.h5InviteModeCopyWriting,
          h5InviteModeImg: toForm.h5InviteModeImg || '',
          h5InviteTitle: toForm.h5InviteTitle,
          isAttentionWechat: toForm.isAttentionWechat,
          isBindCar: toForm.isBindCar,
          isLBS: toForm.isLBS,
          isMemberRegister: toForm.isMemberRegister,
          isShare: toForm.isShare,
          marketActivityType: toForm.marketActivityType,
          marketType: toForm.marketType,
          memberRegisterCopyWriting: toForm.memberRegisterCopyWriting,
          posterInviteMode: toForm.posterInviteMode,
          posterInviteModeImg: toForm.posterInviteModeImg || '',
          wechatDescription: toForm.wechatDescription,
          wechatImg: toForm.wechatImg || '',
          wechatTitle: toForm.wechatTitle,
          wechatUrl: toForm.wechatUrl,
          marketingTriggerVOS: toPartakAt,
          thirdAttentionWechatCopywriting: toForm.thirdAttentionWechatCopywriting ? toForm.thirdAttentionWechatCopywriting : '',
          thirdMemberRegisterCopywriting: toForm.thirdMemberRegisterCopywriting ? toForm.thirdMemberRegisterCopywriting : '',
          thirdBindCarCopywriting: toForm.thirdBindCarCopywriting ? toForm.thirdBindCarCopywriting : '',
          certificationCopywriting: toForm.certificationCopywriting ? toForm.certificationCopywriting : '',
          thirdCertificationCopywriting: toForm.thirdCertificationCopywriting ? toForm.thirdCertificationCopywriting : '',
          otherCopywriting: toForm.otherCopywriting ? toForm.otherCopywriting : '',
        },
        drawType: toForm.drawType,
        isH5InviteNickName: toForm.isH5InviteNickName ? toForm.isH5InviteNickName : 0,
        isInviteBuddy: toForm.isInviteBuddy ? toForm.isInviteBuddy : 0,
        isRemind: toForm.isRemind,
        isSpecifyLink: toForm.isSpecifyLink ? toForm.isSpecifyLink : 0,
        shareColor: toForm.shareColor,
        taskId: toForm.taskId,
      }
      dispatch({
        type: 'seckilActivityRules/seckillActivityRule',
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
              toAtInfo.marketActivityType = 2;
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
      drawType: 3,
      notInventoryCopyWriting: "您来晚了，该商品已经被洗劫一空",
      h5InviteDescription: '',
      taskId: null
    })
  }, []);
  useEffect(()=>{
    //数据回显
    if (ruleList && ruleList.length > 0 && activityInfo && activityInfo.objectId && activityInfo.channelId) {
      getEchoSeckillRuleActivity();
      queryMessageTemplate();
    }
  },[ruleList])
  //场次相关
  let sessionsName = ['第一场', '第二场', '第三场', '第四场', '第五场'];   //场次名称
  let [sessionsList, setSessionsList] = useState([
    {
      activityId: activityInfo.objectId,
      startTime: '',
      endTime: '',
      budget: 0,
      isShow: true,
      id: '',
      prizeList: [
        // {
        //   activityId:activityInfo.objectId,
        //   prizeName: '',
        //   prizeAmount: 10,
        //   number: 1,
        //   tradeDisplayName: '',
        //   tradeDescribe: '',
        //   prizeImg: '',
        //   isTradeTag: 0,
        //   tradeTag: ''
        // }
      ]
    }
  ]);
  let [isCommodityLayer, setIsCommodityLayer] = useState(false),
    [isCommodityType, setIsCommodityType] = useState(1),   //对应删除 1 商品 2场次
    [toSessionsIn, setToSessionsIn] = useState(0),
    [toCommodityJn, setToCommodityJn] = useState(0);
  //开始时间改变
  let startTimeChang = (e, i) => {
    let toSessionsList = [...sessionsList];
    toSessionsList[i].startTime = "";
    let toStartTime = e ? e.format('YYYY-MM-DD HH:mm:ss') : '';
    let toStartGetTime = new Date(toStartTime).getTime();  //当前选择时间戳
    if (toStartGetTime >= activityData.startTime && toStartGetTime <= activityData.endTime) {
      if (i > 0) {
        if (toSessionsList[i - 1].endTime) {
          let upEndTime = new Date(toSessionsList[i - 1].endTime).getTime()
          if (toStartGetTime >= upEndTime) {
            toSessionsList[i].startTime = toStartTime;
          } else {
            message.error('当前时间需大于上一场次时间!');
          }
        } else {
          message.error('请先完善上一场次时间哦!');
        }
      } else {
        toSessionsList[i].startTime = toStartTime;
      }
    } else {
      message.error('开始时间不在时间范围内!');
    }
    setSessionsList(toSessionsList)
  }
  //结束时间改变
  let endTimeChang = (e, i) => {
    let toSessionsList = [...sessionsList];
    toSessionsList[i].endTime = "";
    let toEndTime = e ? e.format('YYYY-MM-DD HH:mm:ss') : '';
    let toEndGetTime = new Date(toEndTime).getTime();  //当前选择时间戳
    if (toEndGetTime >= activityData.startTime && toEndGetTime <= activityData.endTime) {
      if (toSessionsList[i].startTime) {
        let toStartTime = new Date(toSessionsList[i].startTime).getTime()
        if (toEndGetTime > toStartTime) {
          toSessionsList[i].endTime = toEndTime;
        } else {
          message.error('结束时间需大于开始时间!');
        }
      } else {
        message.error('请先选择开始时间哦!');
      }
    } else {
      message.error('开始时间不在时间范围内!');
    }
    setSessionsList(toSessionsList)
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
  //预算
  let getBudget = (e) => {
    let toSessionsList = JSON.parse(JSON.stringify(sessionsList))
    toSessionsList.forEach((item, i) => {
      let toBudget = 0;
      item.prizeList.forEach((childItem, j) => {
        toBudget = toBudget + (childItem.prizeAmount * parseInt(childItem.activityStockNum || 0))
        toSessionsList[i].prizeList[j].sort = j + 1;
      })
      toSessionsList[i].budget = (parseInt(toBudget * 100)) / 100;
    })
    setSessionsList(toSessionsList)
  }
  //数量
  let sessionNumberChang = (e, i, j) => {
    let toSessionsList = [...sessionsList];
    toSessionsList[i].prizeList[j].activityStockNum = e;
    setSessionsList(toSessionsList)
    getBudget();
  }
  let [addStockVisible, setAddStockVisible] = React.useState(false) // 活动商品库存状态
  let [addStockInfo, setAddStockInfo] = React.useState({}) // 活动商品库存
  let [addStockNum, setAddStockNum] = React.useState(0) // 添加活动库存
  let [addStockTypes, setAddStockTypes] = React.useState(0) // 0减少 1 增加
  //修改数量
  let modifyNumberChang = (e, i, j, types) => {
    setAddStockVisible(true);
    setAddStockInfo({ ...e });
    setAddStockNum(0);
    setToSessionsIn(i);
    setToCommodityJn(j);
    setAddStockTypes(types);
  }
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
      seckillId: sessionsList[toSessionsIn].id
    }
    dispatch({
      type: 'seckilActivityRules/updatePriceStock',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let toSessionsList = [...sessionsList];
          let toaddStockNum = toSessionsList[toSessionsIn].prizeList[toCommodityJn].remainingStockNum;
          let toactivityStockNum = toSessionsList[toSessionsIn].prizeList[toCommodityJn].activityStockNum;
          if (addStockTypes == 1) {
            toaddStockNum = toaddStockNum + addStockNum
            toactivityStockNum = toactivityStockNum + addStockNum;
          } else {
            toaddStockNum = toaddStockNum - addStockNum;
            toactivityStockNum = toactivityStockNum - addStockNum;
          }
          toSessionsList[toSessionsIn].prizeList[toCommodityJn].remainingStockNum = toaddStockNum;
          toSessionsList[toSessionsIn].prizeList[toCommodityJn].activityStockNum = toactivityStockNum;
          setSessionsList(toSessionsList)
          getBudget();
          setAddStockVisible(false)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  //商品展示名称
  let sessionNameChang = (e, i, j) => {
    let toSessionsList = [...sessionsList];
    toSessionsList[i].prizeList[j].tradeDisplayName = e.target.value;
    setSessionsList(toSessionsList)
  }
  //商品描述
  let sessionDescribeChang = (e, i, j) => {
    let toSessionsList = [...sessionsList];
    toSessionsList[i].prizeList[j].tradeDescribe = e.target.value;
    setSessionsList(toSessionsList)
  }
  //图片上传
  let imgUpLoad = (file, i, j) => {
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
  let imgUpChange = (e, i, j) => {
    let toSessionsList = [...sessionsList];
    toSessionsList[i].prizeList[j].prizeImg = e.file.response ? e.file.response.items : '';
    setSessionsList(toSessionsList)
  }
  //商品标签
  let sessionGroupChang = (e, i, j) => {
    let toSessionsList = [...sessionsList];
    toSessionsList[i].prizeList[j].isTradeTag = e.target.value;
    setSessionsList(toSessionsList)
  }
  //商品描述name
  let sessionLableChang = (e, i, j) => {
    let toSessionsList = [...sessionsList];
    toSessionsList[i].prizeList[j].tradeTag = e.target.value;
    setSessionsList(toSessionsList)
  }
  //展开收起
  let isOpenClick = (e, i) => {
    let toSessionsList = [...sessionsList];
    toSessionsList[i].isShow = !toSessionsList[i].isShow;
    setSessionsList(toSessionsList)
  }
  //秒杀场次
  let [drawType, setDrawType] = useState(3);
  let changeDrawType = (e) => {
    setDrawType(e.target.value)
  }

  //添加场次
  let addSessionsData = (e) => {
    let toSessionsList = [...sessionsList];
    toSessionsList = toSessionsList.map((item) => {
      item.isShow = false;
      return item;
    })
    toSessionsList.push({
      activityId: activityInfo.objectId,
      startTime: '',
      endTime: '',
      budget: "0",
      isShow: true,
      prizeList: []
    })
    setSessionsList(toSessionsList)
  }
  let addSessions = (e) => {
    if (sessionsList.length >= 4) {
      message.error('最多设置四场次哦！');
    } else {
      if (sessionsList.length <= 0) {
        addSessionsData();
      } else {
        let toSessionsList = sessionsList[sessionsList.length - 1];
        if (toSessionsList.endTime && toSessionsList.startTime) {
          addSessionsData();
        } else {
          message.error('请先完善上一场的时间哦！');
        }
      }

    }
  }
  //添加商品
  let [prizeVisible, setPrizeVisible] = useState(false); //选择奖品模态框状态
  let [prizeData, setPrizeData] = React.useState({}) //奖品
  let addCommodityClick = (i) => {
    setToSessionsIn(i);
    setPrizeVisible(true);
    setCardPrizeName("")
  }
  //上移
  let comdiyMoveUp = (i, j) => {
    if (j > 0) {
      let toSessionsList = [...sessionsList];
      toSessionsList[i].prizeList[j] = toSessionsList[i].prizeList.splice(j - 1, 1, toSessionsList[i].prizeList[j])[0];
      setSessionsList(toSessionsList)
    }
  }
  //下移
  let comdiyMoveDown = (i, j) => {
    if (j != sessionsList[i].prizeList.length - 1) {
      let toSessionsList = [...sessionsList];
      toSessionsList[i].prizeList[j] = toSessionsList[i].prizeList.splice(j + 1, 1, toSessionsList[i].prizeList[j])[0];
      setSessionsList(toSessionsList)
    }
  }
  //删除
  let comdiyDelete = (i, j) => {
    setToSessionsIn(i);
    setToCommodityJn(j);
    setIsCommodityLayer(!isCommodityLayer);
    setIsCommodityType(1);
  }
  //场次删除
  let seckilDelete = (i) => {
    setToSessionsIn(i);
    setIsCommodityLayer(!isCommodityLayer);
    setIsCommodityType(2);
  }
  //取消删除
  let ommodityLyCancel = (e) => {
    setIsCommodityLayer(!isCommodityLayer);
  }
  let setOnDeletePrice = (callback) => {
    let data = {
      id: sessionsList[toSessionsIn].prizeList[toCommodityJn].id,
      type: 0,
      channelId: activityData.channelId,
      activityId: activityData.objectId
    }
    dispatch({
      type: 'seckilActivityRules/onDeletePrice',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          callback && callback()
        }
      }
    })
  }
  let setOnDeleteSeckill = (callback) => {
    let data = {
      seckillId: sessionsList[toSessionsIn].id,
      activityId: activityData.objectId
    }
    dispatch({
      type: 'seckilActivityRules/deleteSeckill',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          callback && callback()
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  //确认删除
  let commodityLyOk = (e) => {
    let toSessionsList = [...sessionsList];
    if (isCommodityType == 2) {   //场次
      if (toSessionsList.length > 1) {
        if (toSessionsList[toSessionsIn].id) {
          setOnDeleteSeckill(() => {
            toSessionsList.splice(toSessionsIn, 1);
            setSessionsList(toSessionsList);
            setIsCommodityLayer(!isCommodityLayer);
          })
        } else {
          toSessionsList.splice(toSessionsIn, 1);
          setSessionsList(toSessionsList);
          setIsCommodityLayer(!isCommodityLayer);
        }
      } else {
        message.error("至少需要一个场次")
      }
    } else {               //商品
      if (toSessionsList[toSessionsIn].prizeList[toCommodityJn].id) {
        setOnDeletePrice(() => {
          toSessionsList[toSessionsIn].prizeList.splice(toCommodityJn, 1)
          setSessionsList(toSessionsList);
          setIsCommodityLayer(!isCommodityLayer);
        })
      } else {
        toSessionsList[toSessionsIn].prizeList.splice(toCommodityJn, 1)
        setSessionsList(toSessionsList);
        setIsCommodityLayer(!isCommodityLayer);
      }
    }


  }
  /*提示框*/
  let promptBox = (content) => {
    Modal.info({ content, okText: '确定' })
  }
  let [cardPrizeNameVisible, setCardPrizeNameVisible] = useState(false) // 卡券奖品展示名称模态框状态
  let [cardPrizeName, setCardPrizeName] = useState('') // 卡券奖品展示名称
  /*保存多张卡券组合成一个奖品*/
  let onSaveCardPrize = (couponPrizeList, cardCallback) => {
    let toCouponPrizeList = JSON.parse(JSON.stringify(couponPrizeList));
    toCouponPrizeList = toCouponPrizeList.length > 0 && toCouponPrizeList.map((item,index) => {
      item.couponBasicsConfig = couponPrizeList[index];
      return item;
    })
    let data = {
      couponPrizeList: toCouponPrizeList,
      PrizeName: cardPrizeName,
      activityId: activityData.objectId,
      channelId: activityData.channelId,
    }
    dispatch({
      type: 'seckilActivityRules/saveCardPrize',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let item = res.body
          let tempObj = {
            id: '', //奖品卡券id
            num: 1, //卡券数量
            type: '1', //类型：1卡券,2积分,3现金,4实物,5谢谢参与
            remark: '', //谢谢参与
            prizeImg: '', //奖品图片
            totalPrice: 0, //总价（元）
            estimatedNum: 0, //预计数量
            activityStockNum: 0, //活动库存
            prizeName: item.prizeName, //奖品名称
            prizeAmount: item.prizeAmount, //奖品金额或数量
            couponPrizeList: item.couponPrizeList //奖品卡券id
          }
          cardCallback(tempObj)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  /*确定选择奖品*/
  let onConfirmPrizeSet = () => {
    if (Object.keys(prizeData).length !== 0 && prizeData.type !== '6') {
      let { type, prizeAmount, prizeName, remark } = prizeData;
      let temp = sessionsList[toSessionsIn].prizeList;
      /*暂时关闭该校验*/
      if (type === '1') {
        let { cardPrizeList } = prizeData;
        if (cardPrizeList && cardPrizeList.length > 0) {
          let tempCardList = []
          for (let k = 0; k < cardPrizeList.length; k++) {
            if (!cardPrizeList[k].couponNum) {
              promptBox('请输入选中卡券数量!')
              return
            }
            if (cardPrizeList[k].defaultEffectiveDays <= 0) {
              promptBox('请设置选中卡券的有效期!')
              return
            }
          }
          cardPrizeList.map(item => {
            let tempData = JSON.parse(JSON.stringify(item))
            tempCardList.push(tempData)
          })
          if (!cardPrizeName) {
            setCardPrizeNameVisible(true)
            return
          }
          onSaveCardPrize(tempCardList, (res) => {
            if (res) {
              let toCouponPrizeList = JSON.parse(JSON.stringify(res.couponPrizeList))
              toCouponPrizeList = toCouponPrizeList.length > 0 && toCouponPrizeList.map(item => {
                if(item.couponBasicsConfig){
                  item.couponBasicsConfig = JSON.parse(item.couponBasicsConfig);
                }
                return item
              })
              temp.push({
                num: 1,
                type: type,
                id: res.id,
                tradeTag: '',
                prizeImg: '',
                isTradeTag: 0,
                tradeDescribe: '',
                tradeDisplayName: '',
                prizeName: res.prizeName,
                prizeAmount: res.prizeAmount,
                activityId: activityInfo.objectId,
                couponPrizeList: toCouponPrizeList
              })
              let toSessionsList = [...sessionsList];
              toSessionsList[toSessionsIn].prizeList = temp;
              setSessionsList(toSessionsList)
              getBudget()
              dispatch({
                type: 'activitySelectPrize/onResetCardList'
              })
            }
          })
        } else {
          promptBox('请选择卡券!')
          return
        }
      }
      if (type === '2') {
        if (prizeData.pointsType === 1 && !prizeData.pointsLink) {
          promptBox('请输入领取链接！')
          return
        }
        if (prizeAmount && Number(prizeAmount) > 0) {
          let points = Number(prizeAmount)
          let tempNum = points / 200
          prizeData.points = points
          prizeData.prizeAmount = Number(tempNum.toFixed(2))
        } else {
          promptBox('海贝积分需大于0')
          return
        }
      }
      if (type === '3') {
        if (prizeName !== '') {
          if (Number(prizeAmount) <= 0) {
            promptBox('请输入现金红包金额!')
            return
          }
        } else {
          promptBox('请输入奖品名称!')
          return
        }
      }
      if (type === '4') {
        if (prizeName !== '') {
          if (Number(prizeAmount) <= 0) {
            promptBox('请输入单价!')
            return
          }
        } else {
          promptBox('请输入实物名称!')
          return
        }
      }
      let tempPrize = {
        weightsNum: 0,
        winningNum: 0,
        prizeAmount: Number(prizeAmount)
      }
      if (type === '5') {
        if (!remark) {
          promptBox('请输入谢谢参与文案!')
          return
        } else {
          tempPrize.remark = remark
        }
      }
      if (type === '8') {
        if (!prizeName) {
          promptBox('请输入奖品名称!')
          return
        } else if (!prizeData.pointsLink) {
          promptBox('请输入奖品链接!')
          return
        }
      }
      if (type !== '1') {
        temp.push({
          activityId: activityInfo.objectId,
          prizeName: prizeData.prizeName,
          prizeAmount: prizeData.prizeAmount,
          num: 1,
          tradeDisplayName: '',
          tradeDescribe: '',
          prizeImg: '',
          isTradeTag: 0,
          tradeTag: '',
          type: type,
          points: prizeData.points || '',
          pointsType: prizeData.pointsType || '',
          pointsLink: prizeData.pointsLink || ''
        })
        let toSessionsList = [...sessionsList];
        toSessionsList[toSessionsIn].prizeList = temp;
        setSessionsList(toSessionsList);
        getBudget()
      }
      setPrizeVisible(false)
    } else {
      promptBox('请选择奖品!')
    }
  }
  /*获取选中奖品信息*/
  let getPrizeData = (props) => {
    setPrizeData(props.prizeData)
  }
  /*卡券奖品名称确定事件*/
  let onOkCardPrizeName = () => {
    if (!cardPrizeName) {
      promptBox('请输入奖品展示名称！')
    } else {
      onConfirmPrizeSet()
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
          let toLuckTask = [];
          if (toItemObj.isInviteBuddy == 1) {
            toLuckTask.push("1");
          }
          if (toItemObj.isSpecifyLink == 1) {
            toLuckTask.push("2");
          }
          let toShareTask = [];
          if (toItemObj.posterInviteMode == 1) {
            toShareTask.push("1");
          }
          if (toItemObj.h5InviteMode == 1) {
            toShareTask.push("2");
          }
          setDrawType(toItemObj.drawType == 4 ? 4 : 3);
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
            toIsTools[3] = toItemObj.isInviteBuddy == 1;
            toIsTools[4] = toItemObj.isSpecifyLink == 1;
            toIsTools[5] = toItemObj.posterInviteMode == 1 && isShare;
            toIsTools[6] = toItemObj.h5InviteMode == 1 && isShare;
            setisTools([...toIsTools]);
          }
          toItemObj.luckTask = toLuckTask;
          toItemObj.shareTask = toShareTask;
          toItemObj.isShare = isShare ? 1 : 0;
          form.setFieldsValue(toItemObj);
          let toPostFrom = { ...postFrom };
          toPostFrom.isAttentionWechat = toItemObj.isAttentionWechat;
          toPostFrom.h5InviteMode = toItemObj.h5InviteMode;
          toPostFrom.isBindCar = toItemObj.isBindCar;
          toPostFrom.isH5InviteNickName = toItemObj.isH5InviteNickName;
          toPostFrom.isInviteBuddy = toItemObj.isInviteBuddy;
          toPostFrom.isLBS = toItemObj.isLBS;
          toPostFrom.isMemberRegister = toItemObj.isMemberRegister;
          toPostFrom.isSpecifyLink = toItemObj.isSpecifyLink;
          toPostFrom.posterInviteMode = toItemObj.posterInviteMode;
          setPostFrom(toPostFrom);
          let toisLBS = typeLBS;
          toisLBS[0] = toPostFrom.isLBS == 1 ? true : false;
          setTypeLBS([...toisLBS]);
          setWechatImgs(toItemObj.wechatImg);
          setWechatImg2(toItemObj.posterInviteModeImg);
          setWechatImg3(toItemObj.h5InviteModeImg);
          setShareShape(isShare);
          let toSeckillVOList = toItemObj.seckillVOList;
          toSeckillVOList.forEach((e, i) => {
            if (i == 0) {
              e.isShow = true;
            }
            e.endTime ? toSeckillVOList[i].endTime = moment(e.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
            e.startTime ? toSeckillVOList[i].startTime = moment(e.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
          })
          if (toSeckillVOList.length <= 0) {
            toSeckillVOList = [{
              activityId: activityInfo.objectId,
              startTime: '',
              endTime: '',
              budget: 0,
              isShow: true,
              id: '',
              prizeList: [
              ]
            }]
          }
          setSessionsList([...toSeckillVOList]);
          setIsRemind(toItemObj.isRemind == 0 ? 0 : 1);
          if (toItemObj.isRemind == 0) {
            toItemObj.taskId = null;
            form.setFieldsValue(toItemObj);
          }
          if (toItemObj.wechatTemplateContentList && toItemObj.wechatTemplateContentList.length > 0) {
            setRemindTmId([...toItemObj.wechatTemplateContentList])
            let toColor = [];
            toItemObj.wechatTemplateContentList.forEach((item) => {
              toColor.push(item.contentColor);
              toItemObj[item.templateFieldCode] = item.content;
            })
            form.setFieldsValue(toItemObj);
            setgameColor([...toColor])
          }
          let toSubscribeMsgList = toItemObj.activityNoticeIds && toItemObj.activityNoticeIds.split(",") || [];
          setSubscribeMsg(toSubscribeMsgList);
        }
      }
    });
  };
  //模板获取
  let queryMessageTemplate = () => {
    dispatch({
      type: 'seckilActivityRules/queryMessageTemplate',
      payload: {
        method: 'postJSON',
        params: {
          channelId: activityInfo.channelId,
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          setArrTemplate([...res.body]);
          if (!form.getFieldsValue().taskId && res.body[0] && res.body[0].title == '预约生效通知') {
            let toFrom = form.getFieldsValue();
            toFrom.taskId = res.body[0].id;
            form.setFieldsValue(toFrom);
            setRemindTmId([...res.body[0].fieldData]);
            let togameColor = [];
            res.body[0].fieldData.forEach((item) => {
              togameColor.push("#000");
              setgameColor([...togameColor]);
            })
          }
        }
      }
    });
  };
  //其他功能-提醒
  let [isRemind, setIsRemind] = useState(1);
  let changeIsRemind = (value) => {
    setIsRemind(value.target.value)
  }
  //模板
  let [arrTemplate, setArrTemplate] = useState([]);
  let [remindTmId, setRemindTmId] = useState([]); //选择消息对应内容
  //对应颜色设置
  let [gameColor, setgameColor] = useState([])
  let setMcolor = (n, i) => {
    let toMcolors = [...gameColor];
    toMcolors[n] = i;
    setgameColor(toMcolors);
  };
  let changeTemplate = (e) => {
    let toArrTemplate = arrTemplate.filter((item) => {
      return item.id == e;
    })
    setRemindTmId([...toArrTemplate[0].fieldData]);
    let togameColor = [];
    let toForm = form.getFieldsValue();
    toArrTemplate[0].fieldData.forEach((item) => {
      togameColor.push("#000");
      toForm[item.templateFieldCode] = '';
    })
    setgameColor([...togameColor]);
    form.setFieldsValue(toForm);
  }
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
  return (
    <>
      {/* 上一步弹窗 */}
      <Modal title="提示" visible={isModalVisible} okText="是" cancelText="否" onOk={handleOk} onCancel={handleCancel}>
        <p>您还没有完成规则配置，是否保存?</p>
      </Modal>
      {/* 删除商品弹窗 */}
      <Modal title="提示" visible={isCommodityLayer} okText="是" cancelText="否" onOk={commodityLyOk} onCancel={ommodityLyCancel}>
        {isCommodityType == 2 ? <p>场次下的商品也会删除，是否确认删除该场次？</p> : <p>是否确认删除该商品?</p>}

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
          {/*activityType: 1为大转盘，2为秒杀*/}
          <SelectPrize onOk={getPrizeData} activityType={'2'} />
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
                        //地理位置授权
                        return item.triggerId !== 4 ? <Col span={6}>
                          <Checkbox onChange={(e) => { changeAction(e, item, index) }}
                            value={item.triggerId}
                            disabled={item.checked == 1}
                            style={{ lineHeight: '32px' }}>{item.triggerName}</Checkbox>
                        </Col> :
                          //其他
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
          {/*场池*/}
          <div className={`${styles.wrap2_box} ${styles.wrap2_box2}`}>
            <div className={styles.box3_radio}>
              <strong>秒杀场次及商品</strong>
              <Tooltip title={`${drawType == 3 ? '本次活动无论多少场次，仅1次秒杀机会' : '每个场次都有1次秒杀的机会'}`}><InfoCircleOutlined className={`${styles.wrap2_ico} ${styles.wrap2_ico2}`} /></Tooltip>
              <Radio.Group disabled={detailStatus || isActivityHave} value={drawType} onChange={changeDrawType}>
                <Radio value={3}>共1次</Radio>
                <Radio value={4}>每场一次</Radio>
              </Radio.Group>
            </div>
            {/* 场次列表 */}
            <div className={styles.box_sessions}>
              {
                sessionsList.map((item, i) => {
                  return <div className={styles.box_sessions_li}>
                    <div className={styles.box_sessions_top}>
                      <div className={styles.box_sessions_top_lf}>
                        <em>{sessionsName[i]}</em>
                        <span className={styles.box_sessions_top_lpn}><i>开始时间：</i><DatePicker disabled={detailStatus || isActivityHave} value={item.startTime ? moment(item.startTime, 'YYYY-MM-DD HH:mm:ss') : ''} locale={locale} placeholder="请选择开始时间" showTime format="YYYY-MM-DD HH:mm:ss" className={styles.box_sessions_time1} onChange={(e) => { startTimeChang(e, i) }} /></span>
                        <span className={styles.box_sessions_top_lpn}><i>结束时间：</i><DatePicker disabled={detailStatus || isActivityHave} value={item.endTime ? moment(item.endTime, 'YYYY-MM-DD HH:mm:ss') : ''} locale={locale} placeholder="请选择结束时间" showTime format="YYYY-MM-DD HH:mm:ss" className={styles.box_sessions_time1} onChange={(e) => { endTimeChang(e, i) }} /></span>
                        <strong>预算：¥{item.budget}</strong>
                      </div>
                      <div className={styles.box_sessions_top_rg}><span onClick={(e) => { isOpenClick(item, i) }} >{item.isShow ? '收起' : '展开'}</span>
                        {
                          detailStatus || isActivityHave ? null : <em onClick={(e) => { seckilDelete(i) }}>删除</em>
                        }
                      </div>
                    </div>
                    <div className={`${styles.box_sessions_child} ${item.isShow ? styles.box_sessions_child2 : null}`}>
                      {
                        item.prizeList.map((childItem, j) => {
                          return <div className={styles.sessions_child_li}>
                            <h5>商品{j + 1}</h5>
                            <div className={`${styles.sessions_child_pn} ${styles.sessions_child_pn1}`}>
                              <span>商品：{childItem.prizeName}</span>
                              <span>单价：¥{childItem.prizeAmount}</span>
                              <span>数量：<InputNumber disabled={detailStatus || isActivityHave} min={0} value={childItem.activityStockNum} onChange={(e) => { sessionNumberChang(e, i, j) }} /></span>
                              {detailStatus || isActivityHave ? <span>剩余数量：{childItem.remainingStockNum}</span> : null}
                              {detailStatus || isActivityHave ? <em><i onClick={() => { modifyNumberChang(childItem, i, j, 1) }} >添加</i><i onClick={() => { modifyNumberChang(childItem, i, j, 0) }} >减少</i></em> : null}
                            </div>
                            <div className={`${styles.sessions_child_pn} ${styles.sessions_child_pn2}`}>
                              <span>商品展示名称：<Input disabled={detailStatus || isActivityHave} className={styles.sessions_child_pn2_u} placeholder="请输入" value={childItem.tradeDisplayName} onChange={(e) => { sessionNameChang(e, i, j) }} /></span>
                              <span>商品描述：<Input disabled={detailStatus || isActivityHave} value={childItem.tradeDescribe} className={styles.sessions_child_pn2_u} placeholder="请输入" onChange={(e) => { sessionDescribeChang(e, i, j) }} /></span>
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
                                    beforeUpload={(e) => { imgUpLoad(e, i, j) }}
                                    onChange={(e) => { imgUpChange(e, i, j) }}
                                  >
                                    <Button icon={<UploadOutlined />} disabled={detailStatus || isActivityHave}>上传图片</Button>
                                  </Upload>
                                  <p>建议尺寸：120px*120px</p>
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
                              <span>商品标签：</span>
                              <Radio.Group disabled={detailStatus || isActivityHave} onChange={(e) => { sessionGroupChang(e, i, j) }} value={childItem.isTradeTag} className={styles.sessions_child_pn4_ro}>
                                <Radio value={1}>开</Radio>
                                <Radio value={0}>关</Radio>
                              </Radio.Group>
                              {childItem.isTradeTag == 1 ?
                                <Input disabled={detailStatus || isActivityHave} onChange={(e) => { sessionLableChang(e, i, j) }} value={childItem.tradeTag} className={styles.sessions_child_pn4_pn} placeholder="请输入商品标签，不超过4个字" maxLength="4" /> : null
                              }
                            </div>
                            {
                              detailStatus || isActivityHave ? null :
                                <div className={`${styles.sessions_child_pn} ${styles.sessions_child_pn5}`}>
                                  <span onClick={(e) => { comdiyMoveUp(i, j) }}>上移</span>
                                  <span onClick={(e) => { comdiyMoveDown(i, j) }}>下移</span>
                                  <span onClick={(e) => { comdiyDelete(i, j) }}>删除</span>
                                </div>
                            }

                          </div>
                        })
                      }

                      <div><Button disabled={detailStatus || isActivityHave} onClick={(e) => { addCommodityClick(i) }}>添加商品</Button></div>
                    </div>
                  </div>
                })
              }

            </div>
            <div className={styles.wrap2_btn1}><Button disabled={detailStatus || isActivityHave} onClick={addSessions}>添加场次</Button></div>

            <Form.Item name="notInventoryCopyWriting" label="无库存提示文案：" className={styles.box2_count} extra="用户抢商品后无库存的提示">
              <Input placeholder="您来晚了，该商品已经被洗劫一空" className={styles.box2_count_width} disabled={detailStatus || isActivityHave} />
            </Form.Item>
          </div>

          {/* 其他功能 */}
          <div className={`${styles.wrap2_box} ${styles.wrap2_box4}`}>
            <h3>其他功能</h3>
            <div className={styles.wrap4_pn}>
              <span className={styles.wrap4_pn_child}><em>是否开启【提醒我】功能</em> <Tooltip title="开启此功能后，用户将在秒杀场次开始前展示「提醒我」的功能按钮，用户使用提醒功能后，后台将在场次开始前30分钟统一发送模板消息"><InfoCircleOutlined className={styles.wrap2_ico} /></Tooltip></span>
              <Radio.Group disabled={detailStatus || isActivityHave} value={isRemind} onChange={changeIsRemind}>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </div>
            {
              isRemind == 1 ? <div className={styles.wrap4_info}>
                <div className={styles.wrap4_pn2}>
                  <Form.Item name="taskId" className={styles.wrap4_pn2_1} label="模板消息" rules={[{ required: true, message: '请选择模板' }]}>
                    <Select placeholder="请选择" onChange={changeTemplate} disabled={detailStatus || isActivityHave}>
                      {arrTemplate && arrTemplate.length > 0 ? arrTemplate.map((item, i) => {
                        return <Option value={item.id}>{item.title}</Option>
                      }) : null
                      }
                    </Select>
                  </Form.Item>
                  <div className={`${styles.wrap2_box_share} ${styles.wrap4_pn2_2}`}>
                    <InfoCircleOutlined className={styles.wrap2_ico} />
                    <div className={styles.wrap2_fix_share}>
                      <p className={styles.wrap2_fix_share_p1}>推荐选择如编号OPENTM412561767的模板</p>
                      <p className={styles.wrap2_fix_share_p3}><img src={require('../../../../assets/activity/remind.png')}></img></p>
                    </div>
                  </div>
                </div>
                {remindTmId && remindTmId.length ? <div className={styles.wrap4_pn3}>
                  <span className={styles.wrap4_pn3_label}><i>*</i>内容</span>
                  <div className={styles.wrap4_pn3_main}>
                    {
                      remindTmId.map((item, i) => {
                        if (i === 0 || i === (remindTmId.length - 1)) {
                          return <div className={styles.wrap4_pn3_mpn}>
                            <Form.Item label="" name={item.templateFieldCode} className={styles.wrap4_pn3_cpn} rules={[{ required: true, message: '请输入内容' }]}>
                              <Input disabled={detailStatus || isActivityHave} />
                            </Form.Item>
                            <div className={`${styles.side_wrap2_color} ${i === 0 ? styles.side_wrap2_color2 : null}`}><SetColor colors={gameColor[i]} colorName={i} setMColor={setMcolor} ></SetColor></div>
                          </div>
                        } else {
                          return <div className={styles.wrap4_pn3_mpn2}>
                            <strong className={styles.wrap4_pn3_strong}>{item.templateName}</strong>
                            <Form.Item label="" name={item.templateFieldCode} className={styles.wrap4_pn3_cpn} rules={[{ required: true, message: '请输入内容' }]}>
                              <Input disabled={detailStatus || isActivityHave} />
                            </Form.Item>
                            <div className={styles.side_wrap2_color}><SetColor colors={gameColor[i]} colorName={i} setMColor={setMcolor} ></SetColor></div>
                          </div>
                        }

                      })
                    }
                  </div>
                </div> : null}

              </div> : null
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
export default connect(({ seckilActivityRules, loading, activityModule, twoNumber }) => ({
  ruleList: activityModule.ruleList,
}))(seckilActivityRulesPage);
