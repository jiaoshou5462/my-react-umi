import React, { useEffect, useState } from 'react';
import { Button, Row, Space, Select, Checkbox, Tooltip, Form, Radio, InputNumber, Col, Input, Upload, message, DatePicker, Modal, Switch } from 'antd';
import { connect, history } from 'umi'
import styles from './style.less';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons'
import 'moment/locale/zh-cn'
import { uploadIcon } from '@/services/activity.js'
import WinningRules from '../../winningRules'
var isDataChange = false;   //当前form数据是否有变动
var isTabaleDataChange = false; //当前table数据是否有变动
var notInventory = "";
let drawTypesExtra = {
  0: '次日的活动次数会重置为该值',
  1: '活动期间每个用户总共的活动次数',
  5: '每周一活动次数会重置为该值',
  6:'每月一号活动次数会重置为该值'
}
const flipCardRulesPage = (props) => {
  let { dispatch, setStepBack, luckChoiced, setIsCancel, ruleList } = props;
  let [detailStatus, setDetailStatus] = useState(localStorage.getItem('activityDetail') === '1' ? true : false) //是否是详请状态，1为是
  let [editStatus, setEditStatus] = useState(localStorage.getItem('activityDetail') === '2' ? true : false) //是否是详请状态，1为是
  let [isActivityHave, setIsActivityHave] = useState(localStorage.getItem('isActivityHave')) //是否是活动发布状态
  let [editTableConfig, setEditTableConfig] = useState(false);   //是否开始触发table保存
  let [nDuringFlag, setNDuringFlag] = useState(false)   //n中1开启前置条件状态。奖池里是否有谢谢参与，默认没有
  let [nDuringStatus, setNDuringStatus] = useState(0)   //n中1开启状态，默认0false
  let [nDuringType, setNDuringType] = useState(1)   //n中1类型，
  let [nDuringNum, setNDuringNum] = useState(1)   //n中1抽奖次数
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
  let notInventoryCallback = (e) => {
    notInventory = e;
  }
  // 关闭弹窗
  let handleCancel = (i) => {
    setSsModalVisible(!isModalVisible);
  }
  //不保存
  let stepCancel = (i) => {
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
    inviteFriends: 0,
    isBindCar: 0,         //绑定车辆
    isH5InviteNickName: 0,   //分享人昵称是否使用
    isInviteBuddy: 0,       //邀请好友注册
    isLBS: 0,    //地理位置授权
    isMemberRegister: 0,  // 会员注册
    isSpecifyLink: 0,    //点击指定链接
    posterInviteMode: 0,    //海报二维码邀请方式
  }),
    [gameNumberType, setGameNumberType] = useState(1); //参与抽奖次数
  let changeGameNumberType = (i) => {
    setGameNumberType(i.target.value)
  }
  //分享形式
  let [shareShape, setShareShape] = useState(true);
  // 活动规则及奖品-对应框隐藏框
  let [isTools, setisTools] = useState([false, false, false, false, false, false, false, false]);
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
    if (i == 7) {    //是否抽奖机会分享活动
      toPostFrom.inviteFriends = toIsType;
      setPostFrom(toPostFrom);
    }
    if (i == 5 || i == 6 || i == 3) {
      setIsShareNum(1)
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
  let [isShare, setIsShareNum] = useState(1);  //是否分享
  let [isModalShare, setIsModalShare] = useState(false);  //分享确认
  let firendCancel = () => {
    setIsModalShare(false);
  }
  let firendeOk = () => {
    let toIsTools = [...isTools];
    toIsTools[5] = false;
    toIsTools[6] = false;
    toIsTools[3] = false;
    toIsTools[7] = false;
    setisTools(toIsTools);
    let luckTask = [];
    if (toIsTools[4]) {
      luckTask.push('2');
    }
    form.setFieldsValue({
      shareTask: "",
      luckTask: luckTask
    })
    setShareShape(false);
    setIsShareNum(0);
    setIsModalShare(false);
  }
  let setIsShare = (e) => {
    if (e.target.value == 0) {
      let luckLeg = form.getFieldsValue().luckTask;
      if (luckLeg.length > 0) {
        if (luckLeg.length === 1 && luckLeg[0] == '2') {
          firendeOk()
        } else {
          setIsModalShare(true)
        }
      } else {
        firendeOk()
      }

    } else {
      setShareShape(true)
      setIsShareNum(e.target.value)
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
  let getStageSActivityTwo = () => {
    dispatch({
      type: 'flipCardRules/getActivityRuleDetail',
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
          if (toItemObj.inviteFriends == 1) {
            toLuckTask.push("3");
          }
          let toShareTask = [];
          if (toItemObj.posterInviteMode == 1) {
            toShareTask.push("1");
          }
          if (toItemObj.h5InviteMode == 1) {
            toShareTask.push("2");
          }
          if (activityInfo.marketActivityType) {//活动未配置规则时回显触发动作不参与
            toItemObj.partakAt = toPartakAt;
          }
          toItemObj.luckTask = toLuckTask;
          toItemObj.shareTask = toShareTask;
          toItemObj.inviteMemeberBoostNum = toItemObj.inviteMemeberBoostNum ? toItemObj.inviteMemeberBoostNum : 1;
          toItemObj.inviteFriendsNum = toItemObj.inviteFriendsNum ? toItemObj.inviteFriendsNum : 1;
          toItemObj.specifyLinkNum = toItemObj.specifyLinkNum ? toItemObj.specifyLinkNum : 1;
          form.setFieldsValue(toItemObj);
          let toPostFrom = { ...postFrom };
          toPostFrom.isAttentionWechat = toItemObj.isAttentionWechat;
          toPostFrom.h5InviteMode = toItemObj.h5InviteMode;
          toPostFrom.inviteFriends = toItemObj.inviteFriends;
          toPostFrom.isBindCar = toItemObj.isBindCar;
          toPostFrom.isH5InviteNickName = toItemObj.isH5InviteNickName;
          toPostFrom.isInviteBuddy = toItemObj.isInviteBuddy;
          toPostFrom.isLBS = toItemObj.isLBS;
          toPostFrom.isMemberRegister = toItemObj.isMemberRegister;
          toPostFrom.isSpecifyLink = toItemObj.isSpecifyLink;
          toPostFrom.posterInviteMode = toItemObj.posterInviteMode;
          setPostFrom(toPostFrom);
          let toIsTools = isTools;
          let isShare = toItemObj.isShare == 0 ? false : true;
          if (toItemObj.isShare === 0 || toItemObj.isShare === 1) {
            setIsShareNum(toItemObj.isShare);
          }
          let toWinBroadcastSwitch = toItemObj.winBroadcastSwitch === 1 ? 1 : 0;
          getWinBroadcastSwitch(toWinBroadcastSwitch);
          let toCountdownSwitch = toItemObj.countdownSwitch === 1 ? 1 : 0;
          getCountdownSwitch(toCountdownSwitch);
          let toIsShowActivityTime = toItemObj.timeSwitch === 1 ? 1 : 0;
          getIsShowActivityTime(toIsShowActivityTime);
          let toIsEnterprise = toItemObj.isEnterprise === 1 ? 1 : 0;
          getIsEnterprise(toIsEnterprise);
          toIsTools[0] = toPostFrom.isAttentionWechat == 1 ? true : false;
          toIsTools[1] = toPostFrom.isMemberRegister == 1 ? true : false;
          toIsTools[2] = toPostFrom.isBindCar == 1 ? true : false;
          toIsTools[3] = toPostFrom.isInviteBuddy == 1 ? true : false;
          toIsTools[4] = toPostFrom.isSpecifyLink == 1 ? true : false;
          toIsTools[5] = toPostFrom.posterInviteMode == 1 && isShare ? true : false;
          toIsTools[6] = toPostFrom.h5InviteMode == 1 && isShare ? true : false;
          toIsTools[7] = toPostFrom.inviteFriends == 1 ? true : false;
          setisTools([...toIsTools]);
          let toisLBS = typeLBS;
          toisLBS[0] = toPostFrom.isLBS == 1 ? true : false;
          setTypeLBS([...toisLBS]);
          setWechatImgs(toItemObj.wechatImg);
          setWechatImg2(toItemObj.posterInviteModeImg);
          setWechatImg3(toItemObj.h5InviteModeImg);
          setShareShape(isShare);
          // if (toItemObj.gameNumber && toItemObj.gameNumber >= 0) {
          //   luckChoiced(4)
          // }
          setNDuringNum(toItemObj.nDuringNum || 1)
          setNDuringType(toItemObj.nDuringType || 1);
          setNDuringStatus(toItemObj.nDuringStatus || 0);
          let toSubscribeMsgList = toItemObj.activityNoticeIds && toItemObj.activityNoticeIds.split(",") || [];
          setSubscribeMsg(toSubscribeMsgList);
        }
      }
    });
  };
  let getStrikeConfig = () => {
    dispatch({
      type: 'strikeActivityRules/getGameStrikeConfig',
      payload: {
        method: 'get',
        params: {
          activityId: activityInfo.objectId,
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let items = res.body;
          form.setFieldsValue({
            gameNumberType:items.gameNumberType ? items.gameNumberType : 0,//参与游戏次数类型
            gameNumber:items.gameNumber ? items.gameNumber : 1,//参与游戏次数
          });
          setGameNumberType(items.gameNumberType ? items.gameNumberType : 0)
        } else {
          message.info(res.result.message)
        }
      }
    })
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
        // if(!toForm.wechatUrl){
        //   message.info('请填写h5下行链接')
        //   return
        // }
      }
      if (nDuringStatus === 1 && nDuringType === 0) {
        message.info('请选择n中1类型')
        return
      }
      if(!isSave){
        Modal.info({
          content: '请保存概率表！',
          okText: '确定'
        })
        return
      }
      toForm.isShare = isShare;
      toForm.wechatImg = wechatImgs || '';
      toForm.posterInviteModeImg = wechatImgs2 || '';
      toForm.h5InviteModeImg = wechatImgs3 || '';
      toForm.inviteMemeberBoostType = toForm.inviteMemeberBoostType ? toForm.inviteMemeberBoostType : 0;
      toForm.inviteFriendsType = toForm.inviteFriendsType ? toForm.inviteFriendsType : 0;
      toForm.isMemberRegister = triggerActionList[2] ? 1 : 0;
      toForm.specifyLinkType = toForm.specifyLinkType ? toForm.specifyLinkType : 0;
      toForm.inviteMemeberBoostNum = toForm.inviteMemeberBoostNum ? toForm.inviteMemeberBoostNum : 1;
      toForm.inviteFriendsNum = toForm.inviteFriendsNum ? toForm.inviteFriendsNum : 1;
      toForm.specifyLinkNum = toForm.specifyLinkNum ? toForm.specifyLinkNum : 1;
      toForm.h5InviteMode = toForm.h5InviteMode ? toForm.h5InviteMode : 0;
      toForm.inviteFriends = toForm.inviteFriends && isShare == 1 ? toForm.inviteFriends : 0;
      toForm.isBindCar = toForm.isBindCar ? toForm.isBindCar : 0;
      toForm.isH5InviteNickName = toForm.isH5InviteNickName ? toForm.isH5InviteNickName : 0;
      toForm.isLBS = toForm.isLBS ? toForm.isLBS : 0;
      toForm.isInviteBuddy = toForm.isInviteBuddy && isShare == 1 ? toForm.isInviteBuddy : 0;
      toForm.isSpecifyLink = toForm.isSpecifyLink ? toForm.isSpecifyLink : 0;
      toForm.posterInviteMode = toForm.posterInviteMode ? toForm.posterInviteMode : 0;
      toForm.isAttentionWechat = toForm.isAttentionWechat ? toForm.isAttentionWechat : 0;
      toForm.marketType = 3;
      toForm.marketActivityType = 13;
      toForm.nDuringStatus = nDuringStatus
      toForm.nDuringType = !nDuringStatus ? 1 : nDuringType
      toForm.nDuringNum = nDuringNum;
      toForm.winBroadcastSwitch = winBroadcastSwitch;
      toForm.countdownSwitch = countdownSwitch;
      toForm.timeSwitch = isShowActivityTime;
      toForm.isEnterprise = isEnterprise;
      toForm.activityNoticeIds = subscribeMsg.length > 0 && subscribeMsg.join(',') || '';
      // 触发动作
      let toPartakAt = ruleList.filter(item => toForm.partakAt.some((items) => item.triggerId == items));
      let params = {
        countdownSwitch: toForm.countdownSwitch,
        inviteFriends: toForm.inviteFriends && isShare == 1 ? toForm.inviteFriends : 0,
        inviteFriendsNum: toForm.inviteFriendsNum ? toForm.inviteFriendsNum : 1,
        inviteFriendsType: toForm.inviteFriendsType ? toForm.inviteFriendsType : 0,
        inviteMemeberBoostNum: toForm.inviteMemeberBoostNum ? toForm.inviteMemeberBoostNum : 1,
        inviteMemeberBoostType: toForm.inviteMemeberBoostType ? toForm.inviteMemeberBoostType : 0,
        isInviteBuddy: toForm.isInviteBuddy && isShare == 1 ? toForm.isInviteBuddy : 0,
        isInviteMemeberType: toForm.isInviteMemeberType ? toForm.isInviteMemeberType : 0,
        isSpecifyLink: toForm.isSpecifyLink,
        nduringNum: toForm.nDuringNum,
        nduringStatus: toForm.nDuringStatus,
        nduringType: toForm.nDuringType,
        specifyLinkNum: toForm.specifyLinkNum ? toForm.specifyLinkNum : 1,
        specifyLinkRepeated: toForm.specifyLinkRepeated ? toForm.specifyLinkRepeated : 0,
        specifyLinkType: toForm.specifyLinkType,
        winBroadcastSwitch: toForm.winBroadcastSwitch,
        gameStrikeConfigVO: {
          activityId: activityInfo.objectId,
          gameNumber: toForm.gameNumber,
          gameNumberType: toForm.gameNumberType,
        },
        copywritingVO: {
          notInventory: notInventory ? notInventory : '',
        },
        activityRuleBaseInfoVO: {
          activityNoticeIds: toForm.activityNoticeIds,
          timeSwitch: toForm.timeSwitch,
          isEnterprise: toForm.isEnterprise,
          activityId: activityInfo.objectId,
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
        }
      }
      dispatch({
        type: 'flipCardRules/activityRule',
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
              toAtInfo.marketActivityType = 13;
              toAtInfo.marketType = 3;
              localStorage.setItem('activityInfo', JSON.stringify(toAtInfo));
              message.success({
                content: res.result.message,
                duration: 1,
                onClose: () => {
                  history.push("/activityConfig/activityList/activityModule/setPage");
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
  //表格数据变动
  let onDataTableChange = (i) => {
    isTabaleDataChange = !i;
  }
  let [isSave,setIsSave] = useState(true);//概率表是否是已保存状态
  let isSaveTable = (val) =>{
    setIsSave(val)
  }
  useEffect(() => {
    form.setFieldsValue({
      gameNumberType: 1,    //参与活动 0每天 1总计
      gameNumber: 1,  //活动次数
      partakAt: [],  //触发动作
      attentionWechatCopyWriting: "您还未关注公众号，需关注后参与",//公众号 引导文案
      memberRegisterCopyWriting: "您还不是注册会员，需要注册会员才能参与",//会员注册 引导文案
      bindCarCopyWriting: "您还未绑定车辆，需要绑定车辆后才能参与",//绑定车辆 引导文案
      wechatImg: "", //h5图文链接图片
      wechatTitle: "",   //h5图文链接标题
      wechatDescription: "",   //h5图文链接描述
      // wechatUrl: "",   //h5下行链接
      isNews: true,   //是否支持消息授权引导
      newsName: "",
      newsMould: "",
      luckTask: [],
      inviteMemeberBoostType: 0,  //可邀请的数量上限
      inviteFriendsType: 0,  //分享活动
      inviteMemeberBoostNum: 1,
      inviteFriendsNum: 1,
      specifyLinkType: 0,  //每个链接可增加抽奖机会：
      specifyLinkNum: 1,
      isShare: 1,    //是否支持分享
      shareTask: "",
      posterInviteModeImg: "",  //海报图片
      h5InviteModeCopyWriting: "点击右上方“…”分享好友",
      h5InviteModeImg: "",
      h5InviteTitle: "",
      specifyLinkRepeated: 0,
      nDuringType: 1,
    })
  }, []);
  useEffect(()=>{
    //数据回显
    if (ruleList && ruleList.length > 0 && activityInfo && activityInfo.objectId && activityInfo.channelId) {
      getStageSActivityTwo();
      getStrikeConfig();
    }
  },[ruleList])
  /*n中1 根据奖品判断逻辑回调*/
  let winLotteryCallback = (e) => {
    let temp = e || []
    let status = temp.filter(item => Number(item.type) === 5) || []
    setNDuringFlag(status.length > 0 ? true : false)
  }
  useEffect(() => {
    if (!nDuringFlag) {
      setNDuringStatus(0)
    }
  }, [nDuringFlag])
  /*n中1 开关change事件*/
  let onN1Change = (e) => {
    if (!nDuringFlag) {
      Modal.info({
        content: '奖池中没有未中奖概率，请添加后再开启！',
        okText: '确定'
      })
    } else if(!isSave && e){
      Modal.info({
        content: '请保存概率表！',
        okText: '确定'
      })
    } else {
      let value = e ? 1 : 0
      setNDuringStatus(value)
      setNDuringNum(1)
      setNDuringType(1)
    }
  }
  /*n中1 类型change*/
  let onNDuringTypeChange = (e) => {
    setNDuringType(e.target.value)
    setNDuringNum(1)
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
  let [winBroadcastSwitch, getWinBroadcastSwitch] = useState(1);
  let setWinBroadcastSwitch = (value) => {
    let winBroadcastSwitchInt = value ? 1 : 0;
    getWinBroadcastSwitch(winBroadcastSwitchInt);
  }
  let [countdownSwitch, getCountdownSwitch] = useState(1);
  let setCountdownSwitch = (value) => {
    let countdownSwitch = value ? 1 : 0;
    getCountdownSwitch(countdownSwitch);
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
    if (ruleList && ruleList.length > 0) {
      let toTriggerActionList = {};
      let toPartakAt = [];
      if (!activityInfo.marketActivityType) {   //未选活动状态
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
      <Modal title="提示" visible={isModalVisible} footer={null} onCancel={handleCancel}>
        <p>您还没有完成规则配置，是否保存?</p>
        <div className={styles.modal_btn}>
          <Button onClick={stepCancel}>否</Button>
          <Button type="primary" onClick={handleOk}>是</Button>
        </div>
      </Modal>
      {/* 分享提示 */}
      <Modal title="提示" visible={isModalShare} cancelText="否" okText="是" onCancel={firendCancel} onOk={firendeOk}>
        <p>当前已使用需要分享功能的任务，是否确认关闭？</p>
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

          {/* 参与抽奖次数 */}
          <div className={`${styles.wrap2_box} ${styles.wrap2_box2}`}>
            <Form.Item name="gameNumberType" label="参与活动次数：" className={styles.box2_radio} rules={[{ required: true }]}>
              <Radio.Group disabled={detailStatus || isActivityHave} onChange={changeGameNumberType}>
                <Radio value={0}>每天</Radio>
                <Radio value={5}>每周</Radio>
                <Radio value={6}>每月</Radio>
                <Radio value={1}>总计</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="gameNumber" label="" className={styles.box2_count} extra={drawTypesExtra[gameNumberType]} rules={[{ required: true, message: "请输入次数" }]}>
              <InputNumber disabled={detailStatus || isActivityHave} className={styles.box2_count_width} min={0} />
            </Form.Item>
          </div>
          {/*将池及中奖率*/}
          <div className={`${styles.wrap2_box} ${styles.wrap2_box2}`}>
            <h3>奖池及中奖率</h3>
            <h3>
              <span style={{ color: '#e02020b8' }}>* </span>
              用户中奖规则：
            </h3>
            <WinningRules
              detailStatus={detailStatus}
              nDuringStatus={nDuringStatus}
              configDataSucs={configDataSucs}
              winningEditStatus={editStatus}
              editTableConfig={editTableConfig}
              onDataTableChange={onDataTableChange}
              isSaveTable={isSaveTable}
              winLotteryCallback={winLotteryCallback}
              notInventoryCallback={notInventoryCallback}
              typeName="directPumping"
            />  {/*中奖规则组件*/}
          </div>
          {/* n中1 */}
          <div className={`${styles.wrap2_box} ${styles.wrap2_box3}`}>
            <div style={{ display: 'flex' }}>
              <span style={{ marginTop: '4px' }}>
                <h3>
                  需要n中1
                  <Tooltip title="n中1指的是在指定的抽奖次数内只会有一次真的按概率抽奖，其他皆为不中奖。">
                    <InfoCircleOutlined className={styles.wrap2_ico} />
                  </Tooltip>：
                </h3>
              </span>
              <span>
                <Form.Item name="nDuringStatus" >
                  <Switch
                    checked={nDuringStatus === 1}
                    checkedChildren="开"
                    unCheckedChildren="关"
                    onChange={onN1Change}
                    disabled={detailStatus || isActivityHave}
                  />
                </Form.Item>
              </span>
            </div>
            {
              nDuringStatus ? <div>
                <Form.Item label="类型：" name="nDuringType" rules={[{ required: true }]}>
                  <Radio.Group onChange={onNDuringTypeChange} value={nDuringType} disabled={detailStatus || isActivityHave}>
                    <Radio value={1}>随机中奖</Radio>
                    <Radio value={2}>指定第一次中奖</Radio>
                  </Radio.Group>
                </Form.Item>
              </div> : null
            }
            {
              nDuringStatus === 1 && nDuringType === 1 ? <Form.Item name="nDuringNum" >
                n = <InputNumber
                  min={1}
                  parser={limitNumber}
                  formatter={limitNumber}
                  value={nDuringNum}
                  onChange={(value) => { setNDuringNum(value) }}
                  disabled={detailStatus || isActivityHave}
                /> 建议不超过总抽奖次数
              </Form.Item> : null
            }
          </div>
          {/* 增加抽奖机会 */}
          <div className={`${styles.wrap2_box} ${styles.wrap2_box3}`}>
            <h3>增加抽奖机会：</h3>
            <div className={styles.box3_main}>
              <Form.Item name="luckTask" label="增加抽奖任务：">
                <Checkbox.Group className={styles.box3_cen_checks} disabled={detailStatus || isActivityHave}>
                  <Row className={styles.box3_cen_checks_row}>
                    <Col span={12}><Checkbox onChange={isToolsBox.bind(this, 7)} value="3" disabled={!shareShape} style={{ lineHeight: '32px' }}>分享活动（需开启分享设置）</Checkbox></Col>
                    <Col span={12}><Checkbox onChange={isToolsBox.bind(this, 3)} value="1" disabled={!shareShape} style={{ lineHeight: '32px' }}>邀请好友注册（需开启分享设置）</Checkbox></Col>
                    <Col span={10}><Checkbox onChange={isToolsBox.bind(this, 4)} value="2" style={{ lineHeight: '32px' }}>点击指定链接</Checkbox></Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </div>
            <div className={styles.box3_child}>
              {
                isTools[7] ?
                  <div className={styles.box3_child_li}>
                    <h5>分享活动</h5>
                    <div className={styles.box3_child_mian}>
                      <h6><i>*</i>分享加参与机会上限：</h6>
                      <Form.Item name="inviteFriendsType" label="" className={styles.box3_radio} rules={[{ required: true }]}>
                        <Radio.Group disabled={detailStatus || isActivityHave}>
                          <Radio value={0}>每天</Radio>
                          <Radio value={1}>总计</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item name="inviteFriendsNum" label="" className={styles.box3_count}>
                        <InputNumber disabled={detailStatus || isActivityHave} className={styles.box3_count_width} min={1} />
                      </Form.Item>
                    </div>
                  </div>
                  : null
              }
              {
                isTools[3] ?
                  <div className={styles.box3_child_li}>
                    <h5>邀请好友注册</h5>
                    <div className={styles.box3_child_mian}>
                      <h6><i>*</i>可邀请的数量上限：</h6>
                      <Form.Item name="inviteMemeberBoostType" label="" className={styles.box3_radio} rules={[{ required: true }]}>
                        <Radio.Group disabled={detailStatus || isActivityHave}>
                          <Radio value={0}>每天</Radio>
                          <Radio value={1}>总计</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item name="inviteMemeberBoostNum" label="" className={styles.box3_count}>
                        <InputNumber disabled={detailStatus || isActivityHave} className={styles.box3_count_width} min={1} />
                      </Form.Item>
                    </div>
                  </div>
                  : null
              }
              {
                isTools[4] ?
                  <div className={styles.box3_child_li}>
                    <h5>点击指定链接</h5>
                    <div className={styles.box3_child_mian}>
                      <h6><i>*</i>每个链接可增加抽奖机会：</h6>
                      <Form.Item name="specifyLinkType" label="" className={styles.box3_radio} rules={[{ required: true }]}>
                        <Radio.Group disabled={detailStatus || isActivityHave}>
                          <Radio value={0}>每天</Radio>
                          <Radio value={1}>总计</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item name="specifyLinkNum" label="" className={styles.box3_count} rules={[{ required: true, message: "请输入次数" }]}>
                        <InputNumber disabled={detailStatus || isActivityHave} className={styles.box3_count_width} min={1} />
                      </Form.Item>
                      <h6><i>*</i>每个链接是否能重复计算抽奖机会：</h6>
                      <Form.Item name="specifyLinkRepeated" label="" className={styles.box3_radio} rules={[{ required: true }]}>
                        <Radio.Group disabled={detailStatus || isActivityHave}>
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                  </div>
                  : null
              }
            </div>
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
              <div className={styles.box4_main_child}>
                <label><i>*</i>是否支持分享：</label>
                <Radio.Group disabled={detailStatus || isActivityHave} value={isShare} onChange={setIsShare}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </div>
              {/* <Form.Item name="" label="是否支持分享：" className={styles.box2_radio} rules={[{ required: true }]} >
                                <Radio.Group disabled={detailStatus || isActivityHave} value={isShare} onChange={setIsShare}>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={0}>否</Radio>
                                </Radio.Group>
                            </Form.Item> */}
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
                      <Form.Item name='posterInviteModeImg' label="" extra="建议尺寸：1080px*1920px" rules={[{ required: true, message: "请上传海报哦" }]}>
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
                <em className={styles.box5_main_li_em}>中奖广播条：<Tooltip title="用户的中奖信息会在页面上方轮播展示"><InfoCircleOutlined className={styles.wrap2_ico} /></Tooltip></em>
                <Switch checked={winBroadcastSwitch === 1} onChange={setWinBroadcastSwitch} />
              </div>
              <div className={styles.box5_main_li}>
                <em className={styles.box5_main_li_em}>倒计时提示：<Tooltip title="活动未开始时页面上展示倒计时"><InfoCircleOutlined className={styles.wrap2_ico} /></Tooltip></em>
                <Switch checked={countdownSwitch === 1} onChange={setCountdownSwitch} />
              </div>
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
export default connect(({ flipCardRules, loading, activityModule, twoNumber }) => ({
  ruleList: activityModule.ruleList,
}))(flipCardRulesPage);
