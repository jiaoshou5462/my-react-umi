import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Form,
  Space,
  Radio,
  Table,
  Input,
  Select,
  Button,
  Tooltip,
  DatePicker,
  message,
  Switch,
  Checkbox,
  InputNumber,
  Modal
} from 'antd';
import {
  InfoCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
const { TextArea, Search } = Input;
const { RangePicker } = DatePicker;
const { Column } = Table;
import locale from 'antd/lib/date-picker/locale/zh_CN'
import { connect ,history} from 'umi';
import moment from 'moment'
import 'moment/locale/zh-cn'
import style from './style.less';
const { Option } = Select;
import TaskModal from '../setTask'
import SelectPrize from "../../../activityModule/selectPrize";

const taskreward = (props) => {
  let { dispatch } = props
  let [form] = Form.useForm()
  let [reward, setReward] = useState(1); //任务奖励
  let [taskInfo, setTaskInfo] = useState({});// 上一个页面存放数据  用于判断显示kpi
  let [rewardType, setRewardType] = useState(1); //奖励形式
  let [grantType, setGrantType] = useState(1); //发放方式

  let [cardReceive, setCardReceive] = useState(false);//卡券领取
  let [cardUse, setCardUse] = useState(false);//卡券使用
  let [cardTips, setCardTips] = useState(false);// 卡券权重提示


  let [codeJump, setCodeJump] = useState(false);//扫码跳转
  let [codeGet, setCodeGet] = useState(false);//扫码获客
  let [codeTips, setCodeTips] = useState(false); // 扫码权重提示

  let [articleJump, setArticleJump] = useState(false);//内容转发
  let [articleGet, setArticleGet] = useState(false);//内容点击
  let [articleTips, setArticleTips] = useState(false); // 文章权重提示

  let [productJump, setProductJump] = useState(false);//产品转发
  let [productGet, setProductGet] = useState(false);//产品点击
  let [productTips, setProductTips] = useState(false); // 产品权重提示

  let [cardList, setCardList] = useState([]);//卡券回显数据
  let [codeList, setCodeList] = useState([]);// 扫码获客数据
  let [articleList, setArticleList] = useState([]);// 文章推广数据

  let [productList,setProductList] = useState([]); //产品列表

  const [taskDetail, setTaskDetail] = useState(null);
  const [taskAward, setTaskAward] = useState([]);

  const [taskStatus, setTaskStatus] = useState(localStorage.getItem('taskStatus'));//任务状态   用于区分页面是否禁用
  const [saleKpiList, setSaleKpiList] = useState([]);
  let [taskAwardRemind, setTaskAwardRemind] = useState(1) //公众号任务奖励提醒

  let [prizeVisible, setPrizeVisible] = useState(false) //选择奖品模态框状态
  let [prizeList, setPrizeList] = useState([]) //奖品列表
  let [prizeData, setPrizeData] = useState({}) //奖品
  let [awardsType, setAwardsType] = useState(1) //奖品类型 1卡卷,2积分
  let [weWorkStatus, setWeWorkStatus] = useState(false) //查询当前渠道是否开通企微
  let [weWorkAwardStatus, setWeWorkAwardStatus] = useState(true) //企微奖励通知
  let [noticeType, setNoticeType] = useState([]) //通知类型(3.企微任务开始通知 ,4.企微奖励 5.企微任务通知开关 6.企微任务完成通知 7.企微任务即将结束通知）



  //Modal数据
  const [modalInfo, setMdalInfo] = useState('')
  //modal回调
  const callModal = (flag, title) => {
    setMdalInfo('')
    if(flag) {
      if(title=='setCard') return setCardList(JSON.parse(localStorage.getItem('cardList')))
      if(title=='setCode') return setCodeList(JSON.parse(localStorage.getItem('codeList')))
      if(title=='setArticle') return setArticleList(JSON.parse(localStorage.getItem('ArticleList')))
      if(title=='setProduct') return setProductList(JSON.parse(localStorage.getItem('productList')))
    }
  }
  useEffect(()=> {
    let taskDetail = localStorage.getItem('taskDetail')
    setTaskInfo(JSON.parse(localStorage.getItem('taskInfo')));
    if(taskDetail ==2 || taskDetail==3 || taskDetail == 4) {
      getTaskDetailInfo()
    }
    getWeWorkAuth()
    setTaskDetail(taskDetail)
  },[])
  /*查询当前渠道是否开通企微*/
  let getWeWorkAuth = () => {
    dispatch({
      type:'saleTaskInfo/getWeWorkAuth',
      payload : {
        method: 'getUrlParams',
        params: JSON.parse(localStorage.getItem('tokenObj')).channelId
      },
      callback: (res) => {
        if (res.result.code === '0') {
          setWeWorkStatus(res.body || false)
        }else {
          message.error(res.result.message)
        }
      }
    })
  }
  // 查询任务详情
  let getTaskDetailInfo = () => {
    dispatch({
      type:'saleTaskreward/getTaskDetailInfo',
      payload: {
        method: 'get',
        taskId: history.location.query.taskId
      },
      callback: res => {
        if(res.result.code==0) {
          setTaskInfo({taskType: res.body.taskType})
          let saleKpi = res.body.taskKpiInfo.map(item => item.saleKpi);
          setSaleKpiList(saleKpi)
          res.body.taskKpiInfo.forEach(taskItem => {
            taskType(taskItem.taskType, taskItem.kpi, taskItem.weight)
          })
          setAwardsType(res.body.awardsType || 1)
          setPrizeList(res.body.taskAward || [])
          let taskInfo = []
          if(res.body.taskContent && res.body.taskContent.length){
            let temp = [res.body.taskContent[0].sourceExpand];
            temp.map(item => {
              let tempData = {
                ...item
              }
              tempData.productId = item.objectId
              tempData.productName = item.goodTitle
              taskInfo.push(tempData)
            })
          }

          if(res.body.taskType==1) setCodeList(taskInfo || []);
          if(res.body.taskType==2) setCardList(taskInfo || []);
          if(res.body.taskType==3) setArticleList(taskInfo || []);
          if(res.body.taskType==4) setProductList(taskInfo || []);
          if(res.body.isReward !== undefined) setReward(res.body.isReward);
          if(res.body.rewardSituation !== undefined) setRewardType(res.body.rewardSituation);
          setTaskAwardRemind(res.body.wechatRewardRemind)
          let pointsAmount = res.body.taskAwardPoints && res.body.taskAwardPoints.pointsAmount || 0

          let temp = res.body.noticeType || []
          if(temp.length > 0) {
            let tempStatus = false
            for (let item of temp) {
              if (item === 4) {
                tempStatus = true
                break
              }else {
                tempStatus = false
              }
            }
            setWeWorkAwardStatus(tempStatus)
          }else {
            setWeWorkAwardStatus(true)
          }
          setNoticeType(temp)
          form.setFieldsValue({
            rankTop: res.body.rankTop,
            completion: res.body.completion,
            awardsName: res.body.awardsName,
            awardsNum: res.body.awardsNum,
            awardsType: res.body.awardsType || 1,
            pointsAmount,
          })
        }
      }
    })
  }
  // 校验返回值
  let taskType = (type,kpi, weight) => {
    if(type==1){
      form.setFieldsValue({
        codeJumpKpi:kpi,
        codeJumpWeight: weight
      })
      return setCodeJump(true)
    }
    if(type==2){
      form.setFieldsValue({
        codeGetKpi:kpi,
        codeGetWeight: weight
      })
      return setCodeGet(true)
    }
    if(type==3){
      form.setFieldsValue({
        taskTypeGetKpi: kpi,
        taskTypeGetWeight: weight
      })
      return setCardReceive(true)
    }
    if(type==4){
      form.setFieldsValue({
        taskTypeSetKpi: kpi,
        taskTypeSetWeight: weight
      })
      return setCardUse(true)
    }
    if(type==5){
      form.setFieldsValue({
        articleJumpKpi: kpi,
        articleJumpWeight: weight
      })
      return setArticleJump(true)
    }
    if(type==6) {
      form.setFieldsValue({
        articleGetKpi: kpi,
        articleGetWeight: weight
      })
      return setArticleGet(true)
    }
    if(type==7){
      form.setFieldsValue({
        productJumpKpi: kpi,
        productJumpWeight: weight
      })
      return setProductJump(true)
    }
    if(type==8){
      form.setFieldsValue({
        productGetKpi: kpi,
        productGetWeight: weight
      })
      return setProductGet(true)
    }
  }
  // 任务类型失去焦点判断 (taskInfo.taskType==2)卡券权重失去焦点 && (taskInfo.taskType==1)扫码获客 &&  (taskInfo.taskType==3)文章
  let handleCardBlur = () => {
    let formValue = form.getFieldValue();
    if(taskInfo.taskType==1) {
      setCodeTips( (formValue.codeJumpWeight || 0) + (formValue.codeGetWeight || 0) != 100 )
    }
    if(taskInfo.taskType==2) {
      setCardTips( (formValue.taskTypeGetWeight || 0) + (formValue.taskTypeSetWeight || 0) != 100 )
    }
    if(taskInfo.taskType==3) {
      setArticleTips( (formValue.articleJumpWeight || 0) + (formValue.articleGetWeight || 0) != 100 )
    }
    if(taskInfo.taskType==4){
      setProductTips( (formValue.productJumpWeight || 0) + (formValue.productGetWeight || 0) != 100 )
    }
  }
  // 下一步提交   (taskInfo.taskType==2)卡券权重失去焦点 && (taskInfo.taskType==1)扫码获客   (taskInfo.taskType==3) 文章管理
  let onSubmit = (value) => {
    if(taskInfo.taskType==2) {
      let taskKpiInfo = []
      let jumpObj = {}
      let getObj = {}
      if(!cardReceive && !cardUse) return message.error('请选择至少一个指标!');
      if(cardTips) return message.error('权重值总和需要等于100%!');
      if(cardReceive) {
        if(!value.taskTypeGetKpi || !value.taskTypeGetWeight) return message.error('请完善卡券领取对应权重及kpi');
        jumpObj.kpi = value.taskTypeGetKpi;
        jumpObj.taskType = 3;
        jumpObj.weight = value.taskTypeGetWeight;
        jumpObj.saleKpi = saleKpiList[0]
      }
      if(cardUse) {
        if(!value.taskTypeSetKpi || !value.taskTypeSetWeight) return message.error('请完善卡券使用对应权重及kpi');
        getObj.kpi= value.taskTypeSetKpi;
        getObj.taskType = 4;
        getObj.weight= value.taskTypeSetWeight;
        getObj.saleKpi = saleKpiList[1]
      }
      if(taskDetail== 1) {
        jumpObj.saleKpi = '',
        getObj.saleKpi = ''
      }
      taskKpiInfo.push(jumpObj,getObj)
      if(cardList == false) return message.error('请选择卡券!');
      let newTask = cardList.map(item =>{ // 获取任务内容信息
        return { sourceCode: item.couponSkuNo, sourceName: item.couponSkuName,}
      })
      if(reward==1) {
        if(rewardType==0) {
          if(!value.rankTop) return message.error('请输入奖励排名TOP!');
          if(!value.completion) return message.error('请输入完成度!');
        }else {
          if(!value.completion) return message.error('请输入完成度!');
        }
        if(!value.awardsNum) return message.error('请输入平均发放奖励(奖励发放数量)');
      }
      let info ={
        isContentAssignment: 0,// 内容是否指定（0默认指定，1不指定）
        pointsAmount: value.pointsAmount || 0, // 奖品积分数量
        awardsName: value.awardsName || '', // 奖品名称
        awardsNum:value.awardsNum || '' , // 奖励发放数量
        channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,// 渠道ID
        completion: value.completion || '', // 完成度
        isReward: reward,// 是否奖励（0否1是）
        rankTop: value.rankTop || '', // 排名top
        receiving: 0, // 领取方式（0自动发放-默认，1手动发放）
        rewardSituation: reward==1 ? rewardType : '', //奖励形势（0按排名发放，1按完成度发放)
        taskContent: newTask,// 任务内容信息 arr
        taskId:history.location.query.taskId, // 任务ID
        taskKpiInfo: taskKpiInfo, // 任务Kpi信息 arr
        taskType: taskInfo.taskType,// 任务类型（1扫码，2卡券，3文章，4产品）
        taskCycle: 0,// 任务周期（默认0，无周期）
      }
      saveInfo(info);
    }
    if(taskInfo.taskType==1) {
      let taskKpiInfo = []
      let jumpObj = {}
      let getObj = {}
      if(!codeJump && !codeGet) return message.error('请选择至少一个指标!');
      if(codeTips) return message.error('权重值总和需要等于100%!');
      if(codeJump) {
        if(!value.codeJumpKpi || !value.codeJumpWeight) return message.error('请完善扫码跳转对应权重及kpi');
        jumpObj.kpi = value.codeJumpKpi;
        jumpObj.taskType = 1;
        jumpObj.weight = value.codeJumpWeight;
        jumpObj.saleKpi = saleKpiList[0]
      }
      if(codeGet) {
        if(!value.codeGetKpi || !value.codeGetWeight) return message.error('请完善扫码获客对应权重及kpi');
        getObj.kpi= value.codeGetKpi;
        getObj.taskType = 2;
        getObj.weight= value.codeGetWeight;
        getObj.saleKpi= saleKpiList[1]
      }
      if(taskDetail== 1) { // 新增时传空
        jumpObj.saleKpi = '',
        getObj.saleKpi = ''
      }
      taskKpiInfo.push(jumpObj,getObj);//组装KPI数据
      if(codeList == false) return message.error('请选择二维码任务!');
      let newTask = codeList.map(item =>{  // 获取任务内容信息   来源ID &&  来源名称
        return { sourceId: item.id, sourceName: item.qrTitle }
      })
      if(reward==1) {
        if(rewardType==0) {
          if(!value.rankTop) return message.error('请输入奖励排名TOP!');
          if(!value.completion) return message.error('请输入完成度!');
        }else {
          if(!value.completion) return message.error('请输入完成度!');
        }
        if(!value.awardsNum) return message.error('请输入平均发放奖励(奖励发放数量)');
      }
      let info ={
        isContentAssignment: 0,// 内容是否指定（0默认指定，1不指定）
        isReward: reward,// 是否奖励（0否1是）
        awardsName: value.awardsName || '', // 奖品名称
        awardsNum:value.awardsNum || '' , // 奖励发放数量
        channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,// 渠道ID
        completion: value.completion || '', // 完成度
        rankTop: value.rankTop || '', // 排名top
        receiving: 0, // 领取方式（0自动发放-默认，1手动发放）
        rewardSituation: reward==1 ? rewardType : '', //奖励形势（0按排名发放，1按完成度发放)
        taskContent: newTask,// 任务内容信息 arr
        taskId:history.location.query.taskId, // 任务ID
        taskKpiInfo: taskKpiInfo, // 任务Kpi信息 arr
        taskType: taskInfo.taskType,// 任务类型（1扫码，2卡券，3文章，4产品）
        taskCycle: 0,// 任务周期（默认0，无周期）
      }
      saveInfo(info)
    }
    if(taskInfo.taskType==3) {
      let taskKpiInfo = []
      let jumpObj = {}
      let getObj = {}
      if(!articleJump && !articleGet) return  message.error('请选择至少一个指标!');
      if(articleTips) return message.error('权重值总和需要等于100%!');
      if(articleJump) {
        if(!value.articleJumpKpi || !value.articleJumpWeight) return message.error('请完善内容转发对应权重及kpi');
        jumpObj.kpi = value.articleJumpKpi;
        jumpObj.taskType = 5;
        jumpObj.weight = value.articleJumpWeight;
        jumpObj.saleKpi = saleKpiList[0];
      }
      if(articleGet) {
        if(!value.articleGetKpi || !value.articleGetWeight) return message.error('请完善内容点击对应权重及kpi');
        getObj.kpi= value.articleGetKpi;
        getObj.taskType = 6;
        getObj.weight= value.articleGetWeight;
        getObj.saleKpi = saleKpiList[1]
      }
      if(taskDetail== 1) {
        jumpObj.saleKpi = '',
        getObj.saleKpi = ''
      }
      taskKpiInfo.push(jumpObj,getObj)
      if(articleList == false) return message.error('请选择文章管理任务!');
      let newTask = articleList.map(item =>{ // 获取任务内容信息    来源ID  &&  来源名称
        return { sourceId: item.id, sourceName: item.title}
      })
      if(reward==1) {
        if(rewardType==0) {
          if(!value.rankTop) return message.error('请输入奖励排名TOP!');
          if(!value.completion) return message.error('请输入完成度!');
        }else {
          if(!value.completion) return message.error('请输入完成度!');
        }
        if(!value.awardsNum) return message.error('请输入平均发放奖励(奖励发放数量)');
      }
      let info ={
        pointsAmount: value.pointsAmount || 0, // 奖品积分数量
        isContentAssignment: 0,// 内容是否指定（0默认指定，1不指定）
        awardsName: value.awardsName || '', // 奖品名称
        awardsNum:value.awardsNum || '', // 奖励发放数量
        channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,// 渠道ID
        completion: value.completion || '', // 完成度
        isReward: reward,// 是否奖励（0否1是）
        rankTop: value.rankTop || '', // 排名top
        receiving: 0, // 领取方式（0自动发放-默认，1手动发放）
        rewardSituation: reward==1 ? rewardType : '', //奖励形势（0按排名发放，1按完成度发放)
        taskContent: newTask,// 任务内容信息 arr
        taskId:history.location.query.taskId, // 任务ID
        taskKpiInfo: taskKpiInfo, // 任务Kpi信息 arr
        taskType: taskInfo.taskType,// 任务类型（1扫码，2卡券，3文章，4产品）
        taskCycle: 0,// 任务周期（默认0，无周期）
      }
      saveInfo(info);
    }
    if(taskInfo.taskType==4) {
      let taskKpiInfo = []
      let jumpObj = {}
      let getObj = {}
      if(!productJump && !productGet) return  message.error('请选择至少一个指标!');
      if(productTips) return message.error('权重值总和需要等于100%!');
      if(productJump) {
        if(!value.productJumpKpi || !value.productJumpWeight) return message.error('请完善产品转发对应权重及kpi');
        jumpObj.kpi = value.productJumpKpi;
        jumpObj.taskType = 7;
        jumpObj.weight = value.productJumpWeight;
        jumpObj.saleKpi = saleKpiList[0];
      }
      if(productGet) {
        if(!value.productGetKpi || !value.productGetWeight) return message.error('请完善产品点击对应权重及kpi');
        getObj.kpi= value.productGetKpi;
        getObj.taskType = 8;
        getObj.weight= value.productGetWeight;
        getObj.saleKpi = saleKpiList[1]
      }
      if(taskDetail== 1) {
        jumpObj.saleKpi = '',
        getObj.saleKpi = ''
      }
      taskKpiInfo.push(jumpObj,getObj)
      if(productList == false) return message.error('请选择产品!');
      let newTask = productList.map(item =>{ // 获取任务内容信息    来源ID  &&  来源名称
        return { sourceId: item.productId, sourceName: item.productName}
      })
      if(reward==1) {
        if(rewardType==0) {
          if(!value.rankTop) return message.error('请输入奖励排名TOP!');
          if(!value.completion) return message.error('请输入完成度!');
        }else {
          if(!value.completion) return message.error('请输入完成度!');
        }
        if(!value.awardsNum) return message.error('请输入平均发放奖励(奖励发放数量)');
      }
      let info ={
        pointsAmount: value.pointsAmount || 0, // 奖品积分数量
        isContentAssignment: 0,// 内容是否指定（0默认指定，1不指定）
        awardsName: value.awardsName || '', // 奖品名称
        awardsNum:value.awardsNum || '', // 奖励发放数量
        channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,// 渠道ID
        completion: value.completion || '', // 完成度
        isReward: reward,// 是否奖励（0否1是）
        rankTop: value.rankTop || '', // 排名top
        receiving: 0, // 领取方式（0自动发放-默认，1手动发放）
        rewardSituation: reward==1 ? rewardType : '', //奖励形势（0按排名发放，1按完成度发放)
        taskContent: newTask,// 任务内容信息 arr
        taskId:history.location.query.taskId, // 任务ID
        taskKpiInfo: taskKpiInfo, // 任务Kpi信息 arr
        taskType: taskInfo.taskType,// 任务类型（1扫码，2卡券，3文章，4产品）
        taskCycle: 0,// 任务周期（默认0，无周期）
      }
      saveInfo(info);
    }
  }
  // 保存修改集合
  let saveInfo = (info) => {
    let temp = JSON.parse(JSON.stringify(noticeType || []))
    if(weWorkStatus) {
      if(weWorkAwardStatus) {
        let tempStatus = temp.filter(item => item === 4)
        if (tempStatus.length === 0) temp.push(4)
      }else {
        temp = noticeType
      }
    }else {
      info.wechatRewardRemind = taskAwardRemind // 公众号任务奖励提醒（0否1是）
    }
    info.noticeType = temp
    info.awardsType = awardsType
    if(awardsType === 1) {
      info.taskAward = prizeList
      info.taskAwardPoints = {
        pointsAmount: 0
      } // 积分数量
    }else{
      info.taskAward = []
      info.taskAwardPoints = {
        pointsAmount: Number(info.pointsAmount) || 0
      } // 积分数量
    }
    dispatch({
      type:'saleTaskreward/saveCrmTaskDetailInfo',
      payload: {
        method: 'postJSON',
        params: info
      },
      callback: res => {
        if(res.result.code==0) {
          history.push(`/sale/task/saleTaskModule/distribution?taskId=${history.location.query.taskId}`)
        }else {
          message.error(res.result.message)
        }
      }
    })
  }


  /*获取选中奖品信息*/
  let getPrizeData = (props) => {
    setPrizeData(props.prizeData)
  }
  /*确定选择奖品*/
  let onConfirmPrizeSet = () => {
    if (Object.keys(prizeData).length > 0) {
      let {type} = prizeData
      let tempCardList = []
      if (type === '1') {
        let { cardPrizeList } = prizeData
        if (cardPrizeList && cardPrizeList.length > 0) {
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
            item.amount = item.faceValue
            item.couponCategory = item.couponCategoryType
            let tempData = JSON.parse(JSON.stringify(item))
            tempCardList.push(tempData)
          })
        } else {
          promptBox('请选择卡券!')
          return
        }
      }
      setPrizeList(tempCardList)
      setPrizeVisible(false)
    } else {
      promptBox('请选择奖品!')
      setPrizeVisible(false)
    }
  }
  /*提示框*/
  let promptBox = (content) => {
    Modal.info({ content, okText: '确定' })
  }
  /*奖品弹窗显示隐藏*/
  let onShowPrizeModal = () => {
    if(taskStatus == 1 || taskStatus == 2) {
      return false
    }else {
      let temp = {
        channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId
      }
      localStorage.setItem('activityInfo', JSON.stringify(temp))
      setPrizeVisible(true)
    }
  }
  /*上一步*/
  let goBack = () => {
    let taskDetail = localStorage.getItem('taskDetail')
    let temp = taskStatus || '3'
    localStorage.setItem('taskStatus', temp === '3' ? '3' : temp) // 任务状态, 3 为待发布，可编辑
    localStorage.setItem('taskDetail', taskDetail === '2' || taskDetail === '1' ? '2' : taskDetail)
    history.push(`/sale/task/saleTaskModule/info?taskId=${history.location.query.taskId}`)
  }
  return (
    <>
      <div className={style.taskreward_box}>
        <Form form={form} onFinish={onSubmit}>
          <div className={style.title}>任务KPI</div>
          {
            taskInfo.taskType==1?
            <>
              <Row>
                <Col span={10}>
                  <Form.Item label={<>
                    <Tooltip placement="top" title="扫码跳转，即任务期间客户扫描指定的二维码，跳转到指定页面的人数，同一个客户只统计一次">
                    <QuestionCircleOutlined style={{marginRight: '10px'}}/>
                    </Tooltip>
                  <Checkbox disabled={taskStatus==1 || taskStatus==2} checked={codeJump} onChange={(e)=> {setCodeJump(e.target.checked)}}>扫码跳转</Checkbox></>
                  } name='codeJumpKpi' labelCol={{flex:'0 0 120px'}}
                  >
                    <InputNumber style={{width: '100%'}} precision={0} placeholder="请输入扫码跳转kpi" disabled={taskStatus==1 || taskStatus==2}></InputNumber>
                  </Form.Item>
                  <span className={style.input_unit}>人</span>
                </Col>
                <Col span={10} offset={2}>
                  <Form.Item label="扫码跳转权重" name='codeJumpWeight' labelCol={{flex:'0 0 120px'}}>
                    <InputNumber style={{width: '100%'}} precision={0} placeholder="请输入扫码跳转权重" disabled={taskStatus==1 || codeJump==false || taskStatus==2}
                    onBlur={handleCardBlur} min="1" max="100" />
                  </Form.Item>
                  <span className={style.input_unit}>%</span>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <Form.Item label={<>
                    <Tooltip placement="top" title="扫码获客，即任务期间客户扫描指定的二维码，并成功和业务员建立关系的人数，同一个客户只统计一次">
                    <QuestionCircleOutlined style={{marginRight: '10px'}}/>
                    </Tooltip>
                  <Checkbox disabled={taskStatus==1 || taskStatus==2} checked={codeGet} onChange={(e)=> {setCodeGet(e.target.checked)}}>扫码获客</Checkbox></>
                } name='codeGetKpi' labelCol={{flex:'0 0 120px'}}>
                    <InputNumber style={{width: '100%'}} precision={0} placeholder="请输入扫码获客kpi" disabled={taskStatus==1 || taskStatus==2}></InputNumber>
                  </Form.Item>
                  <span className={style.input_unit}>人</span>
                </Col>
                <Col span={10} offset={2}>
                  <Form.Item label="扫码获客权重" name='codeGetWeight' labelCol={{flex:'0 0 120px'}}>
                    <InputNumber style={{width: '100%'}} precision={0} placeholder="请输入扫码获客" disabled={taskStatus==1 || codeGet==false || taskStatus==2}
                    onBlur={handleCardBlur} min="1" max="100" />
                  </Form.Item>
                  <span className={style.input_unit}>%</span>
                </Col>
              </Row>
              {
                codeTips ?
                <Row>
                  <Col span={14}></Col>
                  <Col span={10}>
                    <span style={{color:"red"}}>权重值总和需要等于100%</span>
                  </Col>
                </Row> : ''
              }
              <div className={style.title2}>
                <Row>
                  <Col span={24}>
                    <Form.Item label="指定二维码" name='464457' labelCol={{flex:'0 0 120px'}}>
                      <Radio disabled={taskStatus==1 || taskStatus ==2} defaultChecked={true}>指定</Radio>
                      <a style={taskStatus==1 || taskStatus == 2 ? {color: '#b8b8b8'} : {}}
                      onClick={ taskStatus==1 || taskStatus==2? 'return false' : () => {setMdalInfo({modalName: 'setCode'})}}>选择二维码</a>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    {
                      codeList && codeList.length ?
                      <Table className={style.table_box} dataSource={codeList} pagination={false}>
                        <Column align={'center'} title="标题" dataIndex="qrTitle" key="qrTitle" />
                        <Column align={'center'} title="描述" dataIndex="qrDesc" key="qrDesc" />
                        <Column align={'center'} title="url/关联公众号" dataIndex="qrUrl" key="qrUrl" />
                      </Table> : null
                    }
                  </Col>
                </Row>
              </div>
            </>:
            taskInfo.taskType==2?
            <>
              <Row>
                <Col span={10}>
                  <Form.Item label={<>
                  <Tooltip placement='top' title='以卡券赠送后用户领取成功为指标!'>
                    <QuestionCircleOutlined style={{marginRight: '10px'}}/>
                  </Tooltip>
                    <Checkbox disabled={taskStatus==1 || taskStatus==2} checked={cardReceive} onChange={(e) => {setCardReceive(e.target.checked)}}>卡券发放</Checkbox></>
                  } name='taskTypeGetKpi' labelCol={{flex:'0 0 180px'}}>
                    <InputNumber style={{width: '100%'}} precision={0} placeholder="请输入" disabled={taskStatus==1 || taskStatus==2}></InputNumber>
                  </Form.Item>
                  <span className={style.input_unit}>人</span>
                </Col>
                <Col span={10} offset={2}>
                  <Form.Item label="卡券发放权重" name='taskTypeGetWeight' labelCol={{flex:'0 0 180px'}}>
                    <InputNumber style={{width: '100%'}} precision={0} placeholder="请输入" disabled={taskStatus==1 || cardReceive==false || taskStatus==2}
                    onBlur={handleCardBlur} min="1" max="100"></InputNumber>
                  </Form.Item>
                  <span className={style.input_unit}>%</span>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <Form.Item label={<>
                    <Tooltip placement="top" title="以卡券赠送后用户领取并使用为指标">
                    <QuestionCircleOutlined style={{marginRight: '10px'}}/>
                    </Tooltip>
                    <Checkbox disabled={taskStatus==1 || taskStatus==2} checked={cardUse} onChange={(e) => {setCardUse(e.target.checked)}}>卡券领取并使用</Checkbox></>
                  } name='taskTypeSetKpi' labelCol={{flex:'0 0 180px'}}>
                    <InputNumber style={{width: '100%'}} precision={0} placeholder="请输入" disabled={taskStatus==1 || taskStatus==2}></InputNumber>
                  </Form.Item>
                  <span className={style.input_unit}>人</span>
                </Col>
                <Col span={10} offset={2}>
                  <Form.Item label="卡券领取并使用权重" name='taskTypeSetWeight' labelCol={{flex:'0 0 180px'}}>
                    <InputNumber style={{width: '100%'}} precision={0} placeholder="请输入" disabled={taskStatus==1 || cardUse==false || taskStatus==2}
                    onBlur={handleCardBlur} min="1" max="100"></InputNumber>
                  </Form.Item>
                  <span className={style.input_unit}>%</span>
                </Col>
              </Row>
              {
                cardTips ?
                <Row>
                  <Col span={14}></Col>
                  <Col span={10}>
                    <span style={{color:"red"}}>权重值总和需要等于100%</span>
                  </Col>
                </Row> : ''
              }
              <div className={style.title2}>
                <Row>
                  <Col span={24}>
                    <Form.Item label="是否指定卡券" name='464457' labelCol={{flex:'0 0 120px'}}>
                      <Radio disabled={taskStatus==1 || taskStatus ==2} defaultChecked={true}>指定</Radio>
                      <a style={taskStatus==1 || taskStatus == 2 ? {color: '#b8b8b8'} : {}}
                      onClick={ taskStatus==1 || taskStatus==2 ? 'return false' : () => {setMdalInfo({modalName: 'setCard'})}}>选择卡券</a>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    {
                      cardList && cardList.length ?
                      <Table className={style.table_box} dataSource={cardList} pagination={false} scroll={{y:500}}>
                        <Column align={'center'} title="卡券编号" dataIndex="couponSkuNo" />
                        <Column align={'center'} title="卡券内部名称" dataIndex="couponSkuName" />
                        <Column align={'center'} title="单价（元）" dataIndex="quotaPrice" />
                      </Table>: null
                    }
                  </Col>
                </Row>
              </div>
            </>:
            taskInfo.taskType==3?
            <>
              <Row>
                <Col span={10}>
                  <Form.Item
                  label={<>
                    <Tooltip placement="top" title="文章转发，即任务期间业务员转发指定文章的次数">
                    <QuestionCircleOutlined style={{marginRight: '10px'}}/>
                    </Tooltip>
                    <Checkbox checked={articleJump} disabled={taskStatus==1 || taskStatus==2} onChange={(e)=> {setArticleJump(e.target.checked)}}>文章转发</Checkbox></>
                  } name='articleJumpKpi' labelCol={{flex:'0 0 120px'}}>
                    <InputNumber style={{width: '100%'}} precision={0} placeholder="请输入文章转发" disabled={taskStatus==1 || taskStatus==2}></InputNumber>
                  </Form.Item>
                  <span className={style.input_unit}>次</span>
                </Col>
                <Col span={10} offset={2}>
                  <Form.Item label="文章转发权重" name='articleJumpWeight' labelCol={{flex:'0 0 120px'}}>
                    <InputNumber style={{width: '100%'}} precision={0} placeholder="请输入文章转发权重" disabled={taskStatus==1 || articleJump==false || taskStatus==2}
                    onBlur={handleCardBlur} min="1" max="100"></InputNumber>
                  </Form.Item>
                  <span className={style.input_unit}>%</span>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <Form.Item label={<>
                    <Tooltip placement="top" title="扫码跳转，即任务期间客户点击业务员转发的指定文章的人数，同一个访问id只统计1次">
                    <QuestionCircleOutlined style={{marginRight: '10px'}}/>
                    </Tooltip>
                  <Checkbox disabled={taskStatus==1 || taskStatus==2} checked={articleGet} onChange={(e)=> {setArticleGet(e.target.checked)}}>文章点击</Checkbox> </>
                  } name='articleGetKpi' labelCol={{flex:'0 0 120px'}}>
                    <InputNumber style={{width: '100%'}} precision={0} placeholder="请输入文章点击" disabled={taskStatus==1 || taskStatus==2}></InputNumber>
                  </Form.Item>
                  <span className={style.input_unit}>人</span>
                </Col>
                <Col span={10} offset={2}>
                  <Form.Item label="文章点击权重" name='articleGetWeight' labelCol={{flex:'0 0 120px'}}>
                    <InputNumber style={{width: '100%'}} precision={0} placeholder="请输入文章点击权重" disabled={taskStatus==1 || articleGet==false || taskStatus==2}
                    onBlur={handleCardBlur} min="1" max="100"></InputNumber>
                  </Form.Item>
                  <span className={style.input_unit}>%</span>
                </Col>
              </Row>
              {
                articleTips ?
                <Row>
                  <Col span={14}></Col>
                  <Col span={10}>
                    <span style={{color:"red"}}>权重值总和需要等于100%</span>
                  </Col>
                </Row> : ''
              }
              <div className={style.title2}>
                <Row>
                  <Col span={24}>
                    <Form.Item label={<div className={style.my_lable}>指定文章</div>} name='464457' labelCol={{flex:'0 0 120px'}}>
                      <Radio disabled={taskStatus==1 || taskStatus ==2} defaultChecked={true}>指定</Radio>
                      <a style={taskStatus==1 || taskStatus == 2 ? {color: '#b8b8b8'} : {}}
                      onClick={ taskStatus==1 || taskStatus==2 ? 'return false' : ()=> {setMdalInfo({modalName: 'setArticle'})}}>选择文章</a>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    {
                      articleList && articleList.length ?
                      <Table className={style.table_box} dataSource={articleList} pagination={false}>
                        <Column align={'center'} title="分类" dataIndex="typeName" key="typeName" />
                        <Column align={'center'} title="标题" dataIndex="title" key="title" />
                        <Column align={'center'} title="简介" dataIndex="articleDescribe" key="articleDescribe" />
                      </Table> : null
                    }
                  </Col>
                </Row>
              </div>
            </>
            : taskInfo.taskType==4?
            <>
            <Row>
              <Col span={14}>
                <Form.Item label={<>
                  <Tooltip placement="top" title="产品转发，即任务期间业务员转发指定产品的次数">
                  <QuestionCircleOutlined style={{marginRight: '10px'}}/>
                  </Tooltip>
                  <Checkbox disabled={taskStatus==1 || taskStatus==2} checked={productJump} onChange={(e)=> {setProductJump(e.target.checked)}}>产品转发</Checkbox>
                  </>} name='productJumpKpi' labelCol={{flex:'0 0 120px'}}>
                  <InputNumber style={{width: '100%'}} precision={0} placeholder="请输入产品转发单位(单位次)" ></InputNumber>
                </Form.Item>
                <span className={style.input_unit}>次</span>
              </Col>
              <Col span={10}>
                <Form.Item label="权重" name='productJumpWeight' labelCol={{flex:'0 0 120px'}}>
                  <InputNumber style={{width: '100%'}} precision={0} placeholder="请输入产品转发权重(单位%)" disabled={taskStatus==1 || productJump==false || taskStatus==2}
                  onBlur={handleCardBlur} min="1" max="100"></InputNumber>
                </Form.Item>
                <span className={style.input_unit}>%</span>
              </Col>
            </Row>
            <Row>
              <Col span={14}>
                <Form.Item label={<>
                  <Tooltip placement="top" title="产品点击，即任务期间客户点击业务员转发的指定产品的人数，同一个访问id只统计1次">
                  <QuestionCircleOutlined style={{marginRight: '10px'}}/>
                  </Tooltip>
                <Checkbox disabled={taskStatus==1 || taskStatus==2} checked={productGet} onChange={(e)=> {setProductGet(e.target.checked)}}>产品点击</Checkbox></>}
                name='productGetKpi' labelCol={{flex:'0 0 120px'}}>
                  <InputNumber style={{width: '100%'}} precision={0} placeholder="请输入产品点击(单位次)" ></InputNumber>
                </Form.Item>
                <span className={style.input_unit}>人</span>
              </Col>
              <Col span={10 }>
                <Form.Item label="权重" name='productGetWeight' labelCol={{flex:'0 0 120px'}}>
                  <InputNumber style={{width: '100%'}} precision={0} placeholder="请输入产品点击权重(单位%)" disabled={taskStatus==1 || productGet==false || taskStatus==2}
                  onBlur={handleCardBlur} min="1" max="100"></InputNumber>
                </Form.Item>
                <span className={style.input_unit}>%</span>
              </Col>
            </Row>
            {
              productTips ?
              <Row>
                <Col span={14}></Col>
                <Col span={10}>
                  <span style={{color:"red"}}>权重值总和需要等于100%</span>
                </Col>
              </Row> : ''
            }
            <div className={style.title2}>
              <Row>
                <Col span={24}>
                  <Form.Item label="指定产品" name='464457' labelCol={{flex:'0 0 120px'}}>
                    <Radio defaultChecked={true}>指定</Radio>
                    <a style={taskStatus==1 || taskStatus == 2 ? {color: '#b8b8b8'} : {}}
                      onClick={ taskStatus==1 || taskStatus==2 ? 'return false' : ()=> {setMdalInfo({modalName: 'setProduct'})}}>选择产品</a>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  {productList && productList.length ? <Table className={style.table_box} dataSource={productList} pagination={false} scroll={{y:500}}>
                    <Column align={'center'} title="产品ID" dataIndex="productId" key="objectId" />
                    <Column align={'center'} title="产品名称" dataIndex="productName" key="goodTitle" />
                    <Column align={'center'} title="生效期限" dataIndex="effectTerm" render={(text,record)=>{
                      if(text == '指定时间'){
                        return <span>{`${record.startTime}-${record.endTime}`}</span>
                      }else{
                        return <span>{text}</span>
                      }
                    }} key="effectTerm" ></Column>
                  </Table> : ''}
                </Col>
              </Row>
            </div>
          </> : ''
          }
          <div className={style.title2}>
            <Row>
              <Col span={24}>
                <Form.Item label={<div className={style.my_lable}>任务奖励</div>} labelCol={{flex:'0 0 120px'}}>
                  <Radio.Group disabled={taskStatus==1 || taskStatus==2} onChange={(e) => {setReward(e.target.value)}} defaultValue={reward} value={reward}>
                    <Radio value={1}>设置奖励</Radio>
                    <Radio value={0}>无奖励</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                {
                  reward=='1' ?
                  <Row>
                    <Col span={24}>
                      <Form.Item label={<div className={style.my_lable}>奖励形式</div>} labelCol={{flex:'0 0 120px'}} rules={[{ required: true, message: "请选择奖励形式" }]}>
                        <Radio.Group disabled={taskStatus==1 || taskStatus==2} onChange={(e) => {setRewardType(e.target.value)}} defaultValue={rewardType}  value={rewardType}>
                          <Radio value={0}>按排名奖励
                            <Tooltip placement="top" title="根据任务完成度个人排名发放奖励，达到设置的排名数就发放">
                              <QuestionCircleOutlined style={{marginLeft: '15px'}}/>
                            </Tooltip>
                          </Radio>

                          <Radio value={1}>按完成度奖励
                            <Tooltip placement="top" title="根据个人任务完成度发放奖励，达到设置的完成度就发放">
                              <QuestionCircleOutlined style={{marginLeft: '15px'}}/>
                            </Tooltip>
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col style={{paddingLeft: '120px'}}>
                      <Row>
                        {
                          rewardType==0?
                          <>
                          <Col flex="0 0 200px">
                            <Form.Item label="排名TOP" name='rankTop' labelCol={{flex:'none'}} colon={false}>
                              <Input disabled={taskStatus==1 || taskStatus==2} placeholder="请输入" ></Input>
                            </Form.Item>
                          </Col>
                          <Col flex="none" className={style.form_word}>，完成度至少</Col>
                          <Col flex="0 0 100px">
                            <Form.Item name='completion' labelCol={{flex:'none'}}>
                              <Input disabled={taskStatus==1 || taskStatus==2} placeholder="请输入" ></Input>
                            </Form.Item>
                            <span className={style.input_unit}>%</span>
                          </Col>
                          </>
                          : <>
                            <Col flex="0 0 200px">
                              <Form.Item label="完成度" name='completion' labelCol={{flex:'none'}} colon={false}>
                                <Input disabled={taskStatus==1 || taskStatus==2} placeholder="请输入" ></Input>
                              </Form.Item>
                              <span className={style.input_unit}>%</span>
                            </Col>
                          </>
                        }
                        <Col flex="none" className={style.form_word} style={{marginLeft: '15px'}}>发放奖励</Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Form.Item label={<div className={style.my_lable}>奖励发放时间</div>} name='146' labelCol={{flex:'0 0 120px'}}>
                        <Radio disabled={taskStatus==1 || taskStatus==2} checked>任务结束后发放</Radio>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item label={<div className={style.my_lable}>奖品类型</div>} name='awardsType' labelCol={{flex:'0 0 120px'}}>
                        <Radio.Group  style={{paddingTop: '5px'}} disabled={taskStatus == 1 || taskStatus == 2} onChange={(e) => {setAwardsType(e.target.value)}} defaultValue={awardsType} value={awardsType}>
                          <Radio value={1}>卡券</Radio>
                          <Radio value={2}>积分</Radio>
                        </Radio.Group>
                        {
                          awardsType === 1 ? <div style={{paddingTop: '6px'}}>
                            <a onClick={onShowPrizeModal}>
                              {
                                prizeList.length > 0 ? '重新选择' : '添加卡券'
                              }
                            </a>
                          </div> : null
                        }
                      </Form.Item>
                    </Col>
                    {
                      awardsType === 1 ? <Col>
                        {
                          prizeList && prizeList.length ? <Table className={style.table_box} dataSource={prizeList} pagination={false} scroll={{y:500}}>
                            <Column align={'center'} title="卡券ID" dataIndex="couponNo"/>
                            <Column align={'center'} title="卡券名称" dataIndex="couponName"/>
                            <Column align={'center'} title="数量" dataIndex="couponNum"/>
                            <Column align={'center'} title="有效期" dataIndex="effectiveDate" render={(effectiveDate) => { return <div>领取后{effectiveDate}天</div> }}/>
                            <Column align={'center'} title="可否转赠" dataIndex="shareFlag" render={(shareFlag) => { return <div>{shareFlag === 1 ? '否' : '是'}</div> }}/>
                          </Table>: null
                        }
                      </Col> : null
                    }
                    {
                      awardsType === 2 ? <Col span={24}>
                        <Form.Item label={'积分数量'} name='pointsAmount' labelCol={{flex:'0 0 120px'}} rules={[{ required: true, message: "请输入" }]}>
                          <Input
                              type={'number'}
                              placeholder={'请输入积分数量'}
                              style={{width: '435px'}}
                              disabled={taskStatus==1 || taskStatus==2}
                          />
                        </Form.Item>
                      </Col> : null
                    }
                    <Col span={24}>
                      <Form.Item label={'奖品展示名称'} name='awardsName' labelCol={{flex:'0 0 120px'}} rules={[{ required: true, message: "请输入" }]}>
                        <Input disabled={taskStatus==1 || taskStatus==2} placeholder="请输入展示名称" style={{width: '435px'}}/>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item label={<div className={style.my_lable}>发放方式</div>} name='1nuhbu' labelCol={{flex:'0 0 120px'}}>
                        <Radio.Group disabled={taskStatus==1 || taskStatus==2} onChange={(e) => {setGrantType(e.target.value)}} defaultValue={grantType}  value={grantType}>
                          <Radio value={1}>平均发放</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    {
                      grantType==1 ?
                      <Col style={{paddingLeft: '120px'}}>
                        <Row>
                          <Col flex="0 0 120px">
                            <Form.Item label="每人奖励" name='awardsNum' labelCol={{flex:'none'}} colon={false} >
                              <Input disabled={taskStatus==1 || taskStatus==2} placeholder="请输入" />
                            </Form.Item>
                          </Col>
                          <Col flex="none" className={style.form_word}>份</Col>
                        </Row>
                      </Col> : null
                    }
                    <Col span={24}>
                      <Form.Item label={<div className={style.my_lable}>领取方式</div>} name='receiving' labelCol={{flex:'0 0 120px'}}>
                        <Radio.Group disabled={taskStatus==1 || taskStatus==2} defaultValue='0' >
                          <Radio value='0'>自动领取<QuestionCircleOutlined style={{marginLeft: '15px'}}/></Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    {
                      !weWorkStatus ? <Col span={24}>
                        <Form.Item label={<div className={style.my_lable}>
                          <Tooltip placement="top" title="公众号任务奖励提醒，开启后，系统将会给收到奖励的业务员推送一条公众号模板消息">
                            <QuestionCircleOutlined style={{marginRight: '4px'}}/>
                          </Tooltip>
                          公众号任务奖励提醒
                        </div>} name='wechatRewardRemind' labelCol={{flex:'0 0 170px'}}>
                          <Switch
                              checked={taskAwardRemind === 1 ? true : false}
                              checkedChildren="开启"
                              unCheckedChildren="关闭"
                              disabled={taskStatus==1 || taskStatus==2}
                              onChange={(e)=> {setTaskAwardRemind(e ? 1 : 0 )}}
                          />
                        </Form.Item>
                      </Col> : null
                    }
                    {
                      weWorkStatus ? <Col span={24}>
                        <Form.Item label='企微通知获得奖励' labelCol={{flex:'0 0 170px'}}>
                          <Switch
                              checked={weWorkAwardStatus}
                              checkedChildren="开启"
                              unCheckedChildren="关闭"
                              disabled={taskStatus==1 || taskStatus==2}
                              onChange={(e) => {setWeWorkAwardStatus(e)}}
                          />
                        </Form.Item>
                      </Col> : null
                    }


                    {/* <Col span={24}>
                      <Form.Item label="领取有效期" name='1n23uhbu' labelCol={{flex:'0 0 120px'}} rules={[{ required: true, message: "请输入领取有效期" }]}>
                        <Input placeholder="请输入领取有效期(单位天)" ></Input>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item label="温馨提示" labelCol={{flex:'0 0 120px'}}>
                        <Input placeholder="奖励发放后，用户需在领取有效期内领取，过期将无法领取"  disabled></Input>
                      </Form.Item>
                    </Col> */}
                  </Row> : ''
                }
              </Col>
              <Col span={24} className={style.btn_box}>
                <Space size={24}>
                  <Button  htmlType="button" onClick={()=> {history.push(`/sale/task`)}}>返回列表</Button>
                  <Button  htmlType="button" onClick={goBack}>上一步</Button>
                  <Button  htmlType="submit" type="primary">下一步</Button>
                </Space>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
      {modalInfo?<TaskModal modalInfo={modalInfo} toFatherValue={(flag, name)=>callModal(flag, name)} />:''}

      {/*选择奖品*/}
      {
        prizeVisible ? <Modal
            width={1200}
            okText="确定"
            title="选择奖品"
            cancelText="取消"
            closable={false}
            maskClosable={false}
            visible={prizeVisible}
            onOk={onConfirmPrizeSet}
            onCancel={() => { setPrizeVisible(false) }}
        >
          {/*activityType: 1为大转盘，2为秒杀, 9为任务奖品选择*/}
          <SelectPrize onOk={getPrizeData} activityType={'9'}/>
        </Modal> : null
      }
    </>
  )
}
export default connect(({ saleTaskreward }) => ({
}))(taskreward);
