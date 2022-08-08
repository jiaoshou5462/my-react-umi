import React,{useEffect, useState} from "react"
import { connect,history } from 'umi'
import {
  Modal,
  message,
  Input
} from "antd"
import style from "./style.less"
const selectThrongPage =(props)=>{
  let {dispatch, list, throngVisible, onHideThrong} = props,
      [visible, setVisible] = useState(false),
      [throngList, setThrongList] = useState([]),//人群列表
      [checkThrongList, setCheckThrongList] = useState([]), //选中的人群列表，有排序
      [activityData, setActivityData] = React.useState(JSON.parse(localStorage.getItem('activityInfo')));  //活动信息
  let selectSignIn = sessionStorage.getItem("selectSignIn");//新建活动第二步是否选择日日签活动类型
  let [currentIsSign, setCurrentIsSign] = useState(false);//是否是日日签活动
  /*回调*/
  useEffect(()=>{
    if(throngVisible){
      setVisible(throngVisible)
      if(list.length > 0){
        getCrowdList();
        // getChannelType();
      }
    }
  },[throngVisible, list])
  useEffect(()=>{
    if(activityData.marketActivityType == 12 || selectSignIn == 1){
      setCurrentIsSign(true);
    }
  },[])
  /*获取人群列表,并初始化选中项*/
  let getCrowdList = () =>{
    let data = {
      pageNum: 1,
      pageSize: 9999,
      channelId: activityData.channelId,
      activityId: activityData.objectId,
    }
    dispatch({
      type: 'selectThrong/getCrowdList',
      payload:{
        method:'postJSON',
        params: data
      },
      callback: (res) => {
        if(res.result.code === '0'){
          let temp = res.body || []
          for(let k = 0; k < temp.length; k++) {
            for(let i = 0; i < list.length; i++) {
              temp[k].prizeList = JSON.parse(JSON.stringify(list[i].prizeList));
              if(currentIsSign){
                temp[k].selected = false
              }else{
                if(temp[k].throngId === list[i].throngId){
                  temp[k].checkStatus = true
                  break
                }else {
                  temp[k].checkStatus = false
                }
              }
            }
          }
          setThrongList(temp)
          setCheckThrongList(list)
        }else {
          message.error(res.result.message)
        }
      }
    })
  }
  let [activityType,setActivityType]=useState('');//活动类型 A B C D
  // let [userName,setUserName]=useState("");//用户人名称
  // let [userTags,setUserTags]=useState("");//用户人标签
  // let changeName = (value)=>{
  //   setUserName(value.target.value)
  // }
  // let changeTags = (value)=>{
  //   setUserTags(value.target.value)
  // }
  // 获取渠道类型
  let getChannelType = () => {
    dispatch({
      type: 'selectThrong/getChannelType',
      payload: {
        method: 'get',
        params: {},
        channelId: activityData.channelId
      },
      callback: (res) => {
        if (res.result.code == '0') {
          setActivityType(res.body.type)
        } else {
          message.error({ content: res.result.message })
        }
      }
    })
  }
  /*选择人群*/
  let onChooseThrong = (index) =>{
    let temp = JSON.parse(JSON.stringify(throngList));
    let tempList = JSON.parse(JSON.stringify(checkThrongList));
    temp.map((item, key) => {
      if(key === index){
        if(currentIsSign){
          item.selected = !item.selected;
          if(item.selected){
            for(let v = 0; v < item.prizeList.length; v++){
              item.prizeList[v].winningNum = 0
              item.prizeList[v].weightsNum = 0
              item.prizeList[v].expectNum = 0
            }
            tempList.push(item)
          }else {
            tempList.map((value, bond) => {
              if(value.throngId === temp[index].throngId){
                tempList.splice(bond, 1)
              }
            })
          }
        }else{
          if(item.isFlag){
            if(!item.checkStatus){
              item.checkStatus = true
            }else{
              item.checkStatus = false
            }
            if(item.checkStatus){
              for(let v = 0; v < item.prizeList.length; v++){
                item.prizeList[v].winningNum = 0
                item.prizeList[v].weightsNum = 0
                item.prizeList[v].expectNum = 0
              }
              tempList.push(item)
            }else {
              tempList.map((value, bond) => {
                if(value.throngId === temp[index].throngId){
                  tempList.splice(bond, 1)
                }
              })
            }
          }
        }
      }
    })
    setCheckThrongList(tempList)
    setThrongList(temp)
  }
  /*确定选择人群并初始化人群选中的奖品*/
  let onOk = () => {
    let temp = JSON.parse(JSON.stringify(checkThrongList))
    for(let k = 0; k < temp.length; k++) {
      temp[k].key = k

      // for(let i = 0; i < list.length; i++) {
      //   if(temp[k].throngId !== list[i].throngId){
      //     for(let v = 0; v < temp[k].prizeList.length; v++){
      //       temp[k].prizeList[v].winningNum = 0
      //       temp[k].prizeList[v].weightsNum = 0
      //       temp[k].prizeList[v].expectNum = 0
      //     }
      //   }
      // }
      if(currentIsSign){
        temp[k].selected = false;
        setCheckThrongList(temp)
      }else{
        // for(let i = 0; i < list.length; i++) {
        //   if(temp[k].throngId !== list[i].throngId){
        //     for(let v = 0; v < temp[k].prizeList.length; v++){
        //       temp[k].prizeList[v].winningNum = 0
        //       temp[k].prizeList[v].weightsNum = 0
        //       temp[k].prizeList[v].expectNum = 0
        //     }
        //   }
        // }
        console.log(temp)
      }
    }
    if(temp.length > 12){
      message.info('最多选择11个人群！')
      return
    }
    // if(activityType == "B"){
    //   if(!userName){
    //     message.info('请输入用户人群名称！')
    //     return
    //   }
    //   if(!userTags){
    //     message.info('请输入用户人群标签！')
    //     return
    //   }
    // }
    onHideThrong(temp)
    setVisible(false)
  }
  /*关闭*/
  let onCancel = () => {
    onHideThrong(false)
    setVisible(false)
  }
  return(
    <>
      <Modal
          width={800}
          onOk={onOk}
          okText='确定'
          title="选择人群"
          cancelText='取消'
          closable={false}
          visible={visible}
          onCancel={onCancel}
          maskClosable={false}
      >
        <div className={style.throng_box}>
          {
            throngList.map((item, key) => {
              if(currentIsSign){
                return <div key={key} className={item.selected ? style.throng_item_check : style.throng_item} onClick={()=> {onChooseThrong(key)}}>
                  <div>{item.throngName}</div>
                  <div className={style.throng_item_num}>{!item.count ? '--' : `${item.count}人`}</div>
                </div> 
              }else {
                if(item.isFlag !== 0){
                  return <div key={key} className={item.checkStatus ? style.throng_item_check : style.throng_item} onClick={()=> {onChooseThrong(key)}}>
                    <div>{item.throngName}</div>
                    <div className={style.throng_item_num}>{!item.count ? '--' : `${item.count}人`}</div>
                  </div>
                }else {
                 return null
                }
              }
            })
          }
        </div>
        {/* {activityType == "B" ?
          <div className={style.userMassage}>
            <div className={style.item}>
              <span className={style.label}><span style={{color:"red"}}>*</span>用户人群名称：</span>
            <Input className={style.input_width} value={userName} onChange={changeName}/>
            </div>
            <div className={style.item}>
              <span className={style.label}><span style={{color:"red"}}>*</span>用户人群标签：</span>
              <Input className={style.input_width} value={userTags} onChange={changeTags}/>
            </div>
          </div>
        : null} */}
        <div className={style.throng_bot}>
          已选：
          {
            checkThrongList.map((item, key) => {
              if(currentIsSign){
                return <span key={key}>
                {
                  item.selected ? `${item.throngName} ；` : ''
                }
              </span>
              }else{
                return <span key={key}>
                {
                  item.checkStatus ? `${item.throngName} ；` : ''
                }
              </span>
              }
              
            })
          }
        </div>
      </Modal>
    </>
  )
};
export default connect(({selectThrong})=>({
}))(selectThrongPage)
