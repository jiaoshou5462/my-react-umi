import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import {
  Table,
  Input,
  Modal,
  Image,
  Upload,
  Button,
  message,
  Tooltip,
  InputNumber,
  Checkbox,
  Popover 
} from 'antd';
import {
  PlusCircleTwoTone,
  CloseSquareFilled,
  InfoCircleOutlined,
  MinusCircleTwoTone,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import style from './style.less';
import { uploadIcon } from "@/services/activity";
import SelectPrize from '../selectPrize'
import SelectThrong from '../selectThrong'
const { confirm } = Modal;
const winningRulesPage = (props) => {
  let { dispatch, detailStatus, onDataTableChange, isSaveTable, editTableConfig, notInventoryCallback,
    configDataSucs, winLotteryCallback, nDuringStatus, typeName, showRuleList } = props
  let [notInventoryCopyWriting, setNotInventory] = useState('奖品已被抢完') //无库存
  let [listStatus, setListStatus] = useState(false) //人群列表计算一次状态
  let [prizeListStatus, setPrizeListStatus] = useState(false) //奖品列表计算一次状态
  let [prizeVisible, setPrizeVisible] = useState(false) //选择奖品模态框状态
  let [list, setList] = useState([]) //人群列表
  let [prizeList, setPrizeList] = useState([]) //奖品列表
  let [estimatedNum, setEstimatedNum] = useState(0) //总预计数量
  let [activityStockNum, setActivityStockNum] = useState(0) //总活动库存
  let [remainingStockNum, setRemainingStockNum] = useState(0) //活动剩余总库存
  let [totalPrice, setTotalPrice] = useState(0) //总价
  let [totalPrizePrice, setTotalPrizePrice] = useState(0) //总计奖品单价
  let [prizeData, setPrizeData] = React.useState({}) //奖品
  let [editStatus, setEditStatus] = React.useState(false) //是否编辑,默认不是
  let [addStockNum, setAddStockNum] = React.useState(0) // 添加活动库存
  let [stockData, setStockData] = React.useState({}) // 添加/减少 活动库存的 当前奖品数据
  let [addStockVisible, setAddStockVisible] = React.useState(false) // 添加活动库存状态
  let [reduceStockNum, setReduceStockNum] = React.useState(0) // 减少活动库存状态
  let [reduceStockVisible, setReduceStockVisible] = React.useState(false) // 减少活动库存状态
  let [stockPrizeStatus, setStockPrizeStatus] = React.useState(false) // 调用活动库存接口成功后的状态，用来更新列表计算
  let [throngVisible, setThrongVisible] = React.useState(false) //添加人群弹窗状态
  let [btnLoading, setBtnLoading] = React.useState(false) //保存按钮load状态
  let [saveStatus, setSaveStatus] = React.useState(true) //默认不可编辑，
  let [cardPrizeName, setCardPrizeName] = useState('') // 卡券奖品展示名称
  let [cardPrizeNameVisible, setCardPrizeNameVisible] = useState(false) // 卡券奖品展示名称模态框状态
  let [activityData, setActivityData] = React.useState(JSON.parse(localStorage.getItem('activityInfo')))  //活动信息
  let [headers, setHeaders] = useState({ "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken }) //获取token，设置上传header
  let [winningEditStatus, setWinningEditStatus] = useState(localStorage.getItem('isActivityHave') || false) //是否是活动发布状态
  let selectSignIn = sessionStorage.getItem("selectSignIn");//新建活动第二步是否选择日日签活动类型
  let [currentIsSign, setCurrentIsSign] = useState(false);//是否是日日签活动
  useEffect(() => {
    if(showRuleList && showRuleList.length > 0){
      let list = showRuleList.filter(item => {return item.deleted == 2});
      setRuleList([...list]);
    }
    getThrongDetail() //获取已保存人群详请
  },[showRuleList])
  useEffect(()=>{
    if(activityData.marketActivityType == 12 || selectSignIn == 1){
      setCurrentIsSign(true);
    }
  },[])
  useEffect(() => {
    if (list.length > 0 && !listStatus) {
      setListStatus(true)
      onListChange() //初始化计算
    }
    if (prizeList.length > 0 && !prizeListStatus) {
      setPrizeListStatus(true)
      onListChange() //初始化计算
    }
    if (stockPrizeStatus) {
      onListChange() //初始化计算
      setStockPrizeStatus(false)
    }
    winLotteryCallback(prizeList)
  }, [list, prizeList, stockPrizeStatus])
  /*获取已保存人群详请*/
  let getThrongDetail = (stockChangeStatus, detailStatus) => {
    let data = {
      channelId: activityData.channelId,
      activityId: activityData.objectId,
    }
    dispatch({
      type: 'winningRules/getThrongDetail',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let temp = res.body.throngList || [];
          setNotInventory(res.body.notInventoryCopyWriting)
          notInventoryCallback(res.body.notInventoryCopyWriting)
          let tempPrize = [{
            type: 2,
            title: '添加',
            winningNum: 0,
            weightsNum: 0
          }, {
            type: 1,
            title: '总计',
            winningNum: 0,
            weightsNum: 0
          }];
          temp.map(item1 => {
            let toShowCheckRule = [];
            if(item1.activityRuleId && item1.activityRuleId.length > 0){
              showRuleList && showRuleList.length > 0 && showRuleList.map(item2 => {
                item1.activityRuleId.map(key => {
                  if(key == item2.id){
                    toShowCheckRule.push(item2.days);
                  }
                })
              })
              item1.showCheckRule = [...toShowCheckRule];
            }
          })
          if (temp.length > 0 && temp[0].id) {
            temp.map((item, key) => {
              item.key = key
              item.prizeList = JSON.parse(JSON.stringify([...item.prizeList, ...tempPrize]))
            })
            setList(temp)
            if (detailStatus) {
              setListStatus(false)
            }
            setEditStatus(true)
            getPrizeDetail(stockChangeStatus || 0) //获取已保存奖品详请
          } else {
            setEditStatus(false)
            getCrowdList() //获取人群列表
          }
        }
      }
    })
  }
  /*获取已保存奖品详请*/
  let getPrizeDetail = (stockChangeStatus) => {
    let data = {
      channelId: activityData.channelId,
      activityId: activityData.objectId,
    }
    dispatch({
      type: 'winningRules/getPrizeDetail',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          setPrizeList(res.body)
          if (stockChangeStatus && stockChangeStatus === 1) {
            setStockPrizeStatus(true)
          }
        }
      }
    })
  }
  /*获取人群列表*/
  let getCrowdList = () => {
    let data = {
      pageNum: 1,
      pageSize: 9999,
      channelId: activityData.channelId,
      activityId: activityData.objectId,
    }
    dispatch({
      type: 'winningRules/getCrowdList',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let temp = res.body || []
          let tempList = []
          temp.map(item => {
            if (item.isFlag === 0) {
              tempList.push(item)
            }
          })
          let tempPrize = [{
            type: 2,
            title: '添加',
            winningNum: 0,
            weightsNum: 0
          }, {
            type: 1,
            title: '总计',
            winningNum: 0,
            weightsNum: 0
          }]
          tempList.map((item, key) => {
            item.key = key
            item.prizeList = JSON.parse(JSON.stringify(tempPrize))
          })
          setList(tempList)
        } else {
          promptBox(res.result.message)
        }
      }
    })
  }

  /*活动库存Change事件*/
  let onInventoryChange = (e, key) => {
    let temp = [...prizeList]
    let num = 0
    temp.map((item, index) => {
      if (index === key) {
        item.activityStockNum = e
      }
      num += item.activityStockNum
    })
    setPrizeList(temp)
    setActivityStockNum(num)
    onDataTableChange(false)
    onListChange()
  }
  /*预估参与率Change事件*/
  let onJoinChange = (e, key) => {
    let temp = [...list]
    temp.map((item, index) => {
      if (key === index) {
        item.estimatedParticipationRate = e
        let tempNum = e / 100 * item.count
        item.estimatedMemberNum = parseInt(tempNum)
      }
    })
    setList(temp)
    onListChange(false, key)
    onDataTableChange(false)
  }
  /*预计人数Change事件*/
  let onForecastChange = (e, key) => {
    let temp = [...list]
    temp[key].estimatedMemberNum = e
    setList(temp)
    onPrizeListChange()
    onDataTableChange(false)
  }
  /*权重Change事件*/
  let onWeightChange = (e, key, index) => {
    let temp = [...list]
    temp[key].prizeList[index].weightsNum = e
    setList(temp)
    onListChange()
    onDataTableChange(false)
  }
  /*列表计算汇总*/
  let onListChange = () => {
    let temp = [...list]
    /*计算总权重*/
    temp.map((item, key) => {
      let tempNum = 0
      item.prizeList.map((value, index) => {
        tempNum += value.weightsNum
      })
      item.totalWeight = tempNum
    })
    /*计算百分比*/
    temp.map(item => {
      item.prizeList.map(value => {
        if (item.totalWeight > 0) {
          let num = value.weightsNum / item.totalWeight * 100
          value.winningNum = Number(num.toFixed(2))
        }
      })
    })
    setList(temp)
    onPrizeListChange() //初始请求传参，区分计算操作
  }
  /*奖品计算汇总*/
  let onPrizeListChange = () => {
    let tempList = [...list]
    let temp = [...prizeList]
    /*计算奖品预计数量并拆分赋值给对应的奖品item*/
    tempList.map(item => {
      item.prizeList.map(value => {
        let num = 0
        if (!value.type) {
          num += value.winningNum / 100 * item.estimatedMemberNum
        }
        value.expectNum = parseInt(num)
      })
    })
    let toList = []
    tempList.map((item, key) => {
      item.prizeList.map((items, keys) => {
        if (!items.type) {
          if (!toList[keys]) {
            toList[keys] = items.expectNum
          } else {
            toList[keys] = toList[keys] + items.expectNum
          }
        }
      })
    })
    temp.map((item, key) => {
      item.estimatedNum = toList[key] ? parseInt(toList[key]) : 0
    })
    let totalPrice = 0
    let estimatedNum = 0
    let totalPrizePrice = 0
    let activityStockNum = 0
    let remainingStockNum = 0
    /*计算总和*/
    temp.map(item => {
      let num = item.activityStockNum * item.prizeAmount
      item.totalPrice = Number(num)
      totalPrice += Number(item.totalPrice)
      estimatedNum += Number(item.estimatedNum)
      totalPrizePrice += Number(item.prizeAmount)
      activityStockNum += Number(item.activityStockNum)
      remainingStockNum += Number(item.remainingStockNum || 0)
    })
    setPrizeList(temp)
    setTotalPrice(totalPrice.toFixed(2))
    setEstimatedNum(estimatedNum.toFixed(2))
    setTotalPrizePrice(totalPrizePrice.toFixed(2))
    setActivityStockNum(activityStockNum.toFixed(2))
    setRemainingStockNum(remainingStockNum.toFixed(2))
  }
  /*添加奖品*/
  let addPrize = () => {
    if (detailStatus || winningEditStatus || saveStatus) {
      return
    }
    if (typeName == 'directPumping' && prizeList.length === 12) {
      promptBox('奖品不能超过12个')
    } else if (typeName == 'turntable' && prizeList.length === 8) {
      promptBox('奖品不能超过8个')
    } else {
      setPrizeVisible(true)
    }

    onDataTableChange(false)
  }
  /*删除奖品 前置判断*/
  let onDelPrize = (key, item) => {
    if (Number(item.type) == 5 && nDuringStatus === 1) {
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        content: '删除后也将关闭n中1逻辑，是否确认？',
        okText: '是',
        cancelText: '否',
        onOk () {
          onDelPrizeItem(key, item)
        },
      })
    } else {
      onDelPrizeItem(key, item)
    }
  }
  /*删除奖品*/
  let onDelPrizeItem = (key, item) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '是否要移除该奖品?',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk () {
        if (item.id) {
          if (editStatus) {
            let data = {
              id: item.id,
              type: item.type,
              channelId: activityData.channelId,
              activityId: activityData.objectId
            }
            dispatch({
              type: 'winningRules/onDeletePrice',
              payload: {
                method: 'postJSON',
                params: data
              },
              callback: (res) => {
                if (res.result.code === '0') {
                  getThrongDetail(0, true)
                  message.success('删除成功！')
                  onDataTableChange(false)
                }
              }
            })
          }
        } else {
          let tempList = [...list]
          let temp = prizeList.splice(key, 1)
          tempList.map(item => {
            item.prizeList.splice(key, 1)
          })
          setList(tempList)
          setPrizeList([...temp])
          onListChange()
          onDataTableChange(false)
        }
      }
    })
  }
  /*添加人群*/
  let addThrong = () => {
    if (detailStatus || winningEditStatus || saveStatus) {
      return
    }
    if (list.length === 12) {
      promptBox('人群不能超过12个')
    } else {
      setThrongVisible(true)
      onDataTableChange(false)
    }
  }
  /*删除人群*/
  let onDelThrong = (key, item) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '是否要移除该人群?',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk () {
        if (editStatus) {
          let data = {
            id: item.id,
            channelId: activityData.channelId,
            activityId: activityData.objectId
          }
          dispatch({
            type: 'winningRules/onDeleteThrong',
            payload: {
              method: 'postJSON',
              params: data
            },
            callback: (res) => {
              if (res.result.code === '0') {
                getThrongDetail()
                onListChange() //初始化计算
                message.success('删除成功！')
                onDataTableChange(false);
              }
              if (res.result.code === '9999') {
                let temp = list.splice(key, 1)
                setList([...temp])
                onListChange()
                onDataTableChange(false);
              }
            }
          })
        } else {
          let temp = list.splice(key, 1)
          setList([...temp])
          onListChange()
          onDataTableChange(false);
        }
      }
    })
  }
  /*关闭人群弹窗*/
  let onHideThrong = (e) => {
    if (e && e.length > 0) {
      let temp = JSON.parse(JSON.stringify(e));
      // for (let k = 0; k < temp.length; k++) {
      //   for (let i = 0; i < toList.length; i++) {
      //     if (temp[k].throngId === toList[i].throngId) {
      //       temp[k] = toList[i];
      //     }
      //   }
      // }
      setList(temp)
    }
    setThrongVisible(false)
  }
  /*无库存input事件*/
  let onNotInventoryChange = (e) => {
    let value = e.target.value
    setNotInventory(value)
    onDataTableChange(false)
    notInventoryCallback(value);
  }

  /*上传奖品图片*/
  let weUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('请上传JPG/PNG 格式图片!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小不能高于 2MB!')
    }
    return isJpgOrPng && isLt2M
  }
  let weChange = (value, key) => {
    onDataTableChange(false);
    if (value.file.response) {
      let res = value.file.response;
      if (res.code === 'S000000') {
        let tempUrl = res.items;
        let temp = [...prizeList]
        temp.map((item, index) => {
          if (index === key) {
            item.prizeImg = tempUrl
          }
        })
        setPrizeList(temp)
      } else {
        promptBox('上传图片失败！')
      }
    }
  };
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
  /*获取选中奖品信息*/
  let getPrizeData = (props) => {
    setPrizeData(props.prizeData)
  }
  /*确定选择奖品*/
  let onConfirmPrizeSet = () => {
    if (Object.keys(prizeData).length !== 0 && prizeData.type !== '6') {
      let { type, prizeAmount, prizeName, remark } = prizeData
      let temp = [...prizeList]
      let tempList = [...list]
      if (type === '1') {
        let { cardPrizeList } = prizeData
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
              temp.push({ ...res })
              setPrizeList(temp)
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
      tempList.map((item, key) => {
        let index = item.prizeList.length - 2
        if (key === item.key) {
          item.prizeList.splice(index, 0, { ...tempPrize })
        }
      })
      if (type !== '1') {
        temp.push({ ...prizeData })
        setPrizeList(temp)
      }
      setList(tempList)
      setListStatus(false)
      setPrizeVisible(false)
    } else {
      if (prizeData.type !== '6') {
        promptBox('请选择奖品!')
      } else {
        setPrizeVisible(false)
      }
    }
  }
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
      type: 'winningRules/saveCardPrize',
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
          setCardPrizeName('')
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  /*保存*/
  let onSave = () => {
    if(currentIsSign){
      let toList = JSON.parse(JSON.stringify(list));
      let goalList = [];
      let isRepeat = false;
      let isInclude = false;
      let isRuleIdFree = false;
      toList.length > 0 && toList.map(item => {
        goalList.push({
          throngId: item.throngId,
          activityRuleId: item.activityRuleId || [],
        });
      })
      goalList.length > 0 && goalList.map(item => {
        if(item.activityRuleId.length == 0){
          isRuleIdFree = true;
          return
        }
      })
      for(let i = 0;i < goalList.length; i ++){
        for(let j = 0;j < goalList.length; j ++){
          if(i != j && goalList[i].throngId == goalList[j].throngId ){
            if(goalList[i].activityRuleId.length > 0 && goalList[j].activityRuleId.length > 0){
              let i_activityRuleId = (goalList[i].activityRuleId.sort()).toString();
              let j_activityRuleId = (goalList[j].activityRuleId.sort()).toString();
              if(i_activityRuleId === j_activityRuleId){
                isRepeat = true;
              }else if(i_activityRuleId.indexOf(j_activityRuleId) != -1 || j_activityRuleId.indexOf(i_activityRuleId) != -1){
                isInclude = true;
              }
            }else if(goalList[i].activityRuleId.length == 0 && goalList[j].activityRuleId.length == 0){
              isRepeat = true;
            }
          }
        }
      }

      if(isRuleIdFree){
        message.error('当前存在人群暂未关联规则，请先关联规则后再次保存。');
        return
      }
      if(isRepeat){
        message.error('当前存在相同人群或存在相同人群所关联的规则相同！');
        return
      }
      if(isInclude){
        message.error('当前存在相同人群所关联的规则是包含关系！');
        return
      }
    }
    let notWinningCopyWriting = '' //未中奖文案
    if (!notInventoryCopyWriting) {
      promptBox('请输入无库存提示文案')
      return
    }
    if (typeName == 'turntable' && prizeList.length < 4) {
      promptBox('奖品不能少于4个')
      return
    }
    for (let i = 0; i < prizeList.length; i++) {
      if (!prizeList[i].prizeImg) {
        promptBox('请上传奖品图片')
        return
      }
      if (prizeList[i].type === '5') {
        notWinningCopyWriting = prizeList[i].remark
      }
    }
    for (let i = 0; i < list.length; i++) {
      // if(!list[i].estimatedParticipationRate || list[i].estimatedParticipationRate <= 0){
      //   promptBox('请输入预估参与率')
      //   return
      // }
      // if(!list[i].estimatedMemberNum || list[i].estimatedMemberNum <= 0){
      //   promptBox('请输入预计人数')
      //   return
      // }
      for (let k = 0; k < list[i].prizeList.length; k++) {
        let item = list[i].prizeList[k]
        if (!item.type && item.weightsNum === null) {
          promptBox('请输入权重')
          return
        }
      }
    }
    setBtnLoading(true)
    let toPrizeList = JSON.parse(JSON.stringify(prizeList));
    toPrizeList = toPrizeList.length > 0 && toPrizeList.map((item,index) => {
      if(item.couponPrizeList && item.couponPrizeList.length > 0){
        let toCouponPrizeList = JSON.parse(JSON.stringify(item.couponPrizeList));
        toCouponPrizeList = toCouponPrizeList.length > 0 && toCouponPrizeList.map((item1,index1) => {
          item1.couponBasicsConfig = item.couponPrizeList[index1];
          return item1;
        })
        item.couponPrizeList = JSON.parse(JSON.stringify(toCouponPrizeList));
      } 
      return item
    })
    let data = {
      notWinningCopyWriting,
      notInventoryCopyWriting,
      prizeInfoList: JSON.parse(JSON.stringify(toPrizeList)),
      channelId: activityData.channelId,
      activityId: activityData.objectId,
    }
    dispatch({
      type: 'winningRules/savePrizeInfo',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let temp = res.body
          onSaveCrowd(temp)
          isSaveTable(true)
        } else {
          promptBox(res.result.message)
          onDataTableChange(false)
          setBtnLoading(false)
          isSaveTable(false)
        }
      }
    })
  }
  /*保存人群*/
  let onSaveCrowd = (tempPrizeList) => {
    list.map(item => {
      item.prizeList.map((value, key) => {
        if (!value.type) {
          value.awardId = tempPrizeList[key].id
        }
      })
    })
    let data = {
      throngList: list,
      channelId: activityData.channelId,
      activityId: activityData.objectId,
    }
    dispatch({
      type: 'winningRules/saveThrong',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          if (editTableConfig) {
            onDataTableChange(true)
            configDataSucs(true)
          } else {
            setSaveStatus(true)
            Modal.success({ content: '保存概率表成功！', okText: '确定' })
          }
          setBtnLoading(false)
          getThrongDetail()
        } else if(res.result.code === '0400' && res.result.message == '存在相同人群关联相同规则'){
          message.error('当前存在相同人群或存在相同人群所关联的规则相同！');
          setBtnLoading(false)
          return
        }else {
          promptBox(res.result.message)
          setBtnLoading(false)
        }
      }
    })
  }
  /*提示框*/
  let promptBox = (content) => {
    Modal.info({ content, okText: '确定' })
  }
  /*获取奖品卡券详请*/
  let TooltipText = (record) => {
    const columns = [
      {
        title: '卡券名称',
        dataIndex: 'couponName',
      }, {
        title: '卡券品类',
        dataIndex: 'couponCategoryName',
      }, {
        title: '面值',
        dataIndex: 'prizeAmount',
      }, {
        title: '单批数量',
        dataIndex: 'couponNum',
      }, {
        title: '有效期',
        dataIndex: 'effectiveDate',
        render: (effectiveDate) => { return <div>领取后{effectiveDate}天</div> }
      }, {
        title: '可否转增',
        dataIndex: 'shareFlag',
        render: (shareFlag) => { return <div>{shareFlag === 1 ? '否' : '是'}</div> }
      }
    ]
    return <Table
      locale={{ emptyText: '暂无数据' }}
      columns={columns}
      dataSource={record.couponPrizeList}
      pagination={false}
      loading={{
        spinning: false,
        delay: 500
      }}
    />
  }
  /*减少/添加活动库存 确定事件*/
  let onShowStockModal = (e, type) => {
    /*type 0 是减少库存，1 是增加库存*/
    e.stockType = type
    setStockData(e)
    if (type === 1) {
      setAddStockVisible(true)
    } else {
      setReduceStockVisible(true)
    }
  }
  /*修改活动库存 确定事件*/
  let onAddStock = () => {
    /*type 0 是减少库存，1 是增加库存*/
    if (addStockVisible && addStockNum <= 0) {
      promptBox('添加库存不得小于0')
      return
    }
    if (reduceStockVisible && reduceStockNum <= 0) {
      promptBox('减少库存不得小于0')
      return
    }
    if (reduceStockVisible && stockData.remainingStockNum < reduceStockNum) {
      promptBox('减少库存不得大于剩余库存')
      return
    }
    let data = {
      id: stockData.id,
      type: stockData.stockType,
      activityId: stockData.activityId,
      channelId: activityData.channelId,
      num: stockData.stockType === 1 ? addStockNum : reduceStockNum
    }
    dispatch({
      type: 'winningRules/updatePriceStock',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          getThrongDetail(1)
          /*重置*/
          setAddStockNum(0)
          setStockData({})
          setRemainingStockNum(0)
          setAddStockVisible(false)
          setReduceStockVisible(false)
        } else {
          promptBox(res.result.message)
        }
      }
    })
  }
  /*添加 活动库存 input 改变事件*/
  let onAddStockNumChange = (e) => {
    setAddStockNum(e)
  }
  /*减少 活动库存 input 改变事件*/
  let onReduceStockNumChange = (e) => {
    setReduceStockNum(e)
  }
  /*编辑概率表*/
  let editTableData = () => {
    onDataTableChange(false)
    isSaveTable(false)
    setSaveStatus(!saveStatus)
  }
  //返回上一步时数据保存
  useEffect(() => {
    if (editTableConfig) {
      onSave()
    }
  }, [editTableConfig])
  /*卡券奖品名称确定事件*/
  let onOkCardPrizeName = () => {
    if (!cardPrizeName) {
      promptBox('请输入奖品展示名称！')
    } else {
      onConfirmPrizeSet()
      setCardPrizeNameVisible(false)
    }
  }
  let [isConnectRules, setIsConnectRules] = useState(false);//关联规则弹窗
  let [ruleList, setRuleList] = useState([]);//签到规则列表
  let [checkRuleList, setCheckRuleList] = useState([]);//关联签到规则列表
  let [currentCrowd, setCurrentCrowd] = useState(null);//当前操作关联的人群
  //点击关联规则
  let connectRulesClick = (e, key) => {
    if(detailStatus || saveStatus){
      return
    }
    setCheckRuleList(list[key].activityRuleId);
    setIsConnectRules(true);
    setCurrentCrowd(key)
  }
  //确认关联
  let connectRules = () => {
    let toList = JSON.parse(JSON.stringify(list));
    toList[currentCrowd].activityRuleId = [...checkRuleList];
    let toCheckRuleList = JSON.parse(JSON.stringify(checkRuleList));
    let toShowCheckRule = [];
    showRuleList && showRuleList.length > 0 && showRuleList.map(item => {
      toCheckRuleList.map(key => {
        if(key == item.id){
          toShowCheckRule.push(item.days);
        }
      })
    })
    toList[currentCrowd].showCheckRule = toShowCheckRule;
    setList(toList);
    setIsConnectRules(false);
  }
  //取消
  let closeConnectRules = () => {
    setIsConnectRules(false);
  }
  //选择签到规则关联
  let checkRuleListChange = (val) => {
    setCheckRuleList(val);
  }
  return <div>
    <Modal title="关联规则" visible={isConnectRules} footer={null} onCancel={closeConnectRules}>
      <div className={style.connectRule_wrap}>
        {ruleList && ruleList.length > 0 ?
        <Checkbox.Group className={style.rules_check} value={checkRuleList} onChange={checkRuleListChange}>
          {ruleList && ruleList.length > 0 && ruleList.map(item => {
          return <Checkbox value={item.id}>连续签到{item.days}天</Checkbox>
          })}
        </Checkbox.Group>
        :<div className={style.connectRule_free}>当前还未设置规则</div>}
      </div>
      <div className={style.modal_btn}>
        <Button onClick={closeConnectRules}>取消</Button>
        <Button type="primary" onClick={connectRules}>确认</Button>
      </div>
    </Modal>
    <div className={`${style.box} ${prizeList.length > 8 ? style.box_n2 : null}`}>
      <div className={style.flex}>
        <div className={style.box_left}>
          <div className={style.space} />
          <div className={style.prize_title}>
            奖品图片
            <Tooltip title="奖品尺寸要求：224 * 144 px;点击图片可放大查看。">
              <InfoCircleOutlined className={style.wrap2_ico} />
            </Tooltip>
          </div>
          <div className={style.box_height}>
            单价(元)
          </div>
        </div>
        {
          prizeList.map((item, key) => {
            return <div key={key} className={style.box_right}>
              <div className={style.box_right_title}>
                {
                  item.type == 1 && item.couponPrizeList ? <Tooltip overlayStyle={{ minWidth: '700px' }} color={'rgba(230,230,230,0.85)'} title={TooltipText(item)} >
                    <InfoCircleOutlined className={style.wrap2_ico} />
                  </Tooltip> : null
                }
                {item.prizeName}
                {
                  !detailStatus && !winningEditStatus && !saveStatus ? <CloseSquareFilled className={style.box_right_title_icon} onClick={() => { onDelPrize(key, item) }} /> : null
                }
              </div>
              <div className={style.prize_title}>
                {
                  !item.prizeImg ? null : <img src={item.prizeImg} className={style.prize_title_img} />
                }
                {
                  !detailStatus && !saveStatus ? <Upload
                    name="files"
                    listType="picture"
                    headers={headers}
                    action={uploadIcon}
                    beforeUpload={weUpload}
                    showUploadList={false}
                    onChange={(value) => { weChange(value, key) }}
                  >
                    <span className={style.prize_title_img_text}>{!item.prizeImg ? '上传图片' : '变更'}</span>
                  </Upload> : null
                }
              </div>
              <div className={style.box_height}>{item.type == 5 ? '--' : item.prizeAmount}</div>
            </div>
          })
        }
        {
          !detailStatus && !winningEditStatus && !saveStatus ? <div className={`${style.add_prize} ${typeName == 'directPumping' ? style.add_prize2 : null}`} onClick={addPrize}>
            <div className={style.add_icon}>+</div>
            添加奖品({prizeList.length}/{typeName == 'directPumping' ? '12' : '8'})
          </div> : null
        }
        <div className={style.box_right}>
          <div className={style.box_right_title} >总计</div>
          <div className={style.prize_title}>-</div>
          <div className={style.box_height}>{totalPrizePrice}</div>
        </div>
      </div>
      {
        list.map((item, key) => {
          return <div key={key} className={style.flex} >
            <div className={style.crowd_box_wrap}>
              <div className={style.crowd_box}>
                <div className={style.crowd_left}>
                  <div className={style.crowd_left_item}>
                    <Popover content={item.throngName} trigger="hover">
                      <div className={style.crowd_throngName}>{item.throngName}</div>
                    </Popover>
                    <Popover content={!item.count ? '--' : `${item.count}人`} trigger="hover">
                      <div className={style.crowd_count}>{!item.count ? '--' : `${item.count}人`}</div>
                    </Popover>
                    {
                      key > 0 && !detailStatus && !winningEditStatus && !saveStatus ? <CloseSquareFilled className={style.box_right_title_icon} onClick={() => { onDelThrong(key, item) }} /> : null
                    }
                  </div>
                  <div className={style.crowd_left_item}>
                    <div className={style.crowd_left_item_leve}>预估参与率</div>
                    <div>
                      <InputNumber
                        min={0}
                        disabled={detailStatus || saveStatus || winningEditStatus}
                        formatter={value => `${value}%`}
                        className={style.crowd_left_item_input}
                        value={item.estimatedParticipationRate}
                        onChange={(value) => { onJoinChange(value, key) }}
                        parser={value => value.replace('%', '')}
                      />
                    </div>
                  </div>
                  <div className={style.crowd_left_item}>
                    <div>预计人数</div>
                    <div>
                      <InputNumber
                        min={0}
                        parser={limitNumber}
                        formatter={limitNumber}
                        disabled={detailStatus || saveStatus || winningEditStatus}
                        value={item.estimatedMemberNum}
                        className={style.crowd_left_item_input}
                        onChange={(value) => { onForecastChange(value, key) }}
                      />
                    </div>
                  </div>
                </div>
                <div className={style.crowd_right}>
                  中奖率
                  <Tooltip title="输入不同奖品的权重，为不同的奖品设置好中奖概率"><InfoCircleOutlined className={style.wrap2_ico} /></Tooltip>
                </div>
              </div>
              {currentIsSign ? <div className={style.crowd_rules}>
                <div className={style.rules_label}>规则：</div>
                {item.showCheckRule && item.showCheckRule.length > 0 ? 
                  <div className={style.rule_content}>
                    {item.showCheckRule.map(item => {
                      return <div className={style.rule_item}>连续签到{item}天</div>
                    })}
                  </div> 
                :<div className={style.rule_content} style={(detailStatus || saveStatus) ? {color: "#999"} : {cursor: "pointer"}} onClick={(e) => {connectRulesClick(e, key)}}>+关联规则</div>}
                
                {item.showCheckRule && item.showCheckRule.length > 0 ?<div className={style.rule_change} style={(detailStatus || saveStatus) ? {color: "#999"} : {color: "#4B7FE8",cursor: "pointer"}} onClick={(e) => {connectRulesClick(e, key)}}>更换</div> : null}
              </div> : null}
            </div>
            <div className={style.box_right_winning_box}>
              {
                item.prizeList.map((value, index) => {
                  return !value.type ? <div key={index} className={style.box_right_winning} style={currentIsSign ? {height: '230px'} : null}>
                    <div style={{ margin: '0 0 20px 0' }}>{value.winningNum}%</div>
                    <div>
                      <span style={{ margin: '10px' }}>权重</span>
                      <InputNumber
                        min={0}
                        parser={limitNumber}
                        formatter={limitNumber}
                        disabled={detailStatus || saveStatus || winningEditStatus}
                        value={value.weightsNum}
                        onChange={(value) => { onWeightChange(value, key, index) }}
                      />
                    </div>
                  </div>
                    : value.type === 2
                      ? <>
                        {
                          !detailStatus && !winningEditStatus && !saveStatus ? <div key={index} className={style.add_prize_item} onClick={addPrize} /> : null
                        }
                      </>
                      : <div key={index} className={style.box_right_winning} style={currentIsSign ? {height: '230px'} : null}>100%</div>
                })
              }
            </div>
          </div>
        })
      }
      {
        !detailStatus && !winningEditStatus && !saveStatus ? <div className={style.add_crowd} onClick={addThrong}>
          <div className={style.add_icon} style={{ margin: '12px 10px 0 0' }}>+</div>
          <div>添加人群 {list.length}/12</div>
        </div> : null
      }
      <div className={style.total_box}>
        <div className={style.total_left}>预计数量</div>
        {
          prizeList.map((item, key) => {
            return <div key={key} className={style.total_item}>{item.estimatedNum}</div>
          })
        }
        {
          !detailStatus && !winningEditStatus && !saveStatus ? <div className={style.add_prize_item} onClick={addPrize} /> : null
        }
        <div className={style.total_item}>{estimatedNum}</div>
      </div>
      <div className={style.total_box}>
        <div className={style.total_left}>活动库存</div>
        {
          prizeList.map((item, key) => {
            return <div key={key} className={style.total_item}>
              {
                item.type == 5 ? '--' : <>
                  {
                    !winningEditStatus ? <InputNumber
                      min={0}
                      parser={limitNumber}
                      formatter={limitNumber}
                      disabled={detailStatus || saveStatus}
                      value={item.activityStockNum}
                      onChange={(value) => { onInventoryChange(value, key) }}
                    /> : <div className={style.edit_total_item}>
                      {/*编辑时*/}
                      {/*减少库存*/}
                      {
                        winningEditStatus ? <MinusCircleTwoTone className={style.edit_total_item_icon} style={{ left: '10px' }} onClick={() => { onShowStockModal(item, 0) }} /> : null
                      }
                      {item.activityStockNum}
                      {/*添加库存*/}
                      {
                        winningEditStatus ? <PlusCircleTwoTone className={style.edit_total_item_icon} onClick={() => { onShowStockModal(item, 1) }} /> : null
                      }
                    </div>
                  }
                </>
              }
            </div>
          })
        }
        {
          !detailStatus && !winningEditStatus && !saveStatus ? <div className={style.add_prize_item} onClick={addPrize} /> : null
        }
        <div className={style.total_item} >{activityStockNum}</div>
      </div>
      {
        editStatus ? <div className={style.total_box}>
          <div className={style.total_left}>剩余库存</div>
          {
            prizeList.map((item, key) => {
              return <div key={key} className={style.total_item}>
                {
                  item.type == 5 ? '--' : item.remainingStockNum || 0
                }
              </div>
            })
          }
          {
            !detailStatus && !winningEditStatus && !saveStatus ? <div className={style.add_prize_item} onClick={addPrize} /> : null
          }
          <div className={style.total_item} >{remainingStockNum}</div>
        </div> : null
      }
      <div className={style.total_box} style={{ background: '#E6F7FF' }}>
        <div className={style.total_left} style={{ borderBottom: 'none' }}>总价（元）</div>
        {
          prizeList.map((item, key) => {
            return <div key={key} className={style.total_item} style={{ borderBottom: 'none' }}>
              {item.type == 5 ? '--' : Number(item.totalPrice.toFixed(2))}
            </div>
          })
        }
        {
          !detailStatus && !winningEditStatus && !saveStatus ? <div className={style.add_prize_item} onClick={addPrize} /> : null
        }
        <div className={style.total_item} >{totalPrice}</div>
      </div>
    </div>
    <div className={style.bto_btn_box}>
      <div><span style={{ color: '#E02020' }}>*</span>无库存提示文案</div>
      <Input
        disabled={detailStatus || saveStatus}
        className={style.bto_btn_input}
        onChange={onNotInventoryChange}
        value={notInventoryCopyWriting}
      />
      {
        !detailStatus && saveStatus ? <Button className={style.bto_btn} onClick={editTableData}>编辑概率表</Button> : null
      }
      {
        !saveStatus ? <Button className={style.bto_btn} onClick={onSave} type="primary" loading={btnLoading} >保存概率表</Button> : null
      }
    </div>
    {/*添加活动库存弹窗*/}
    <Modal
      okText="确定"
      title="添加库存"
      cancelText="取消"
      closable={false}
      maskClosable={false}
      visible={addStockVisible}
      onOk={onAddStock}
      onCancel={() => { setAddStockVisible(false) }}
    >
      <span>添加库存：</span>
      <InputNumber
        min={0}
        parser={limitNumber}
        formatter={limitNumber}
        value={addStockNum}
        onChange={(value) => { onAddStockNumChange(value) }}
      />
    </Modal>
    {/*减少活动库存弹窗*/}
    <Modal
      okText="确定"
      title="减少库存"
      cancelText="取消"
      closable={false}
      maskClosable={false}
      visible={reduceStockVisible}
      onOk={onAddStock}
      onCancel={() => { setReduceStockVisible(false) }}
    >
      <span>减少库存：</span>
      <InputNumber
        min={0}
        parser={limitNumber}
        formatter={limitNumber}
        value={reduceStockNum}
        onChange={(value) => { onReduceStockNumChange(value) }}
      />
    </Modal>
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
        afterClose={onListChange}
        onCancel={() => { setPrizeVisible(false) }}
      >
        {/*activityType: 1为大转盘，2为秒杀*/}
        <SelectPrize onOk={getPrizeData} activityType={'1'} />
        {/*卡券有效期模态框*/}
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
                <InfoCircleOutlined className={style.wrap2_ico} />
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
    {/*选择人群*/}
    <SelectThrong
      list={list}
      onHideThrong={onHideThrong}
      throngVisible={throngVisible}
    />

  </div>
};

export default connect(({ winningRules }) => ({
}))(winningRulesPage);
