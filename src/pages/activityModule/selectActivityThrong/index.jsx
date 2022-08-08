import React,{useEffect, useState} from "react"
import { connect,history } from 'umi'
import {
  Modal,
  message,
} from "antd"
import style from "./style.less"
const selectActivityThrongPage =(props)=>{
  let {dispatch, list, throngVisible, onHideThrong, throngType} = props,
      [visible, setVisible] = useState(false),
      [throngList, setThrongList] = useState([]);
      // [activityData, setActivityData] = React.useState(JSON.parse(localStorage.getItem('activityInfo'))) //活动信息
      let activityData=JSON.parse(localStorage.getItem('activityInfo')) //活动信息
  /*回调*/
  useEffect(()=>{
    if(throngVisible){
      setVisible(throngVisible)
      getCrowdList()
    }
  },[throngVisible, list])
  /*获取人群列表,并初始化选中项*/
  let getCrowdList = () =>{
    if(!activityData){
      return
    }
    let data = {
      pageNum: 1,
      pageSize: 9999,
      channelId: activityData.channelId,
      activityId: activityData.objectId,
    }
    let requestType = '';
    if(throngType == 1){
      requestType = 'selectActivityThrong/getThrongListES';
    }else if(throngType == 2){
      requestType = 'selectActivityThrong/getThrongListExclude';
    }
    dispatch({
      type: requestType,
      // type: 'selectActivityThrong/getThrongListES',
      payload:{
        method:'postJSON',
        params: data
      },
      callback: (res) => {
        if(res.result.code === '0'){
          let temp = res.body || []
          let tempList = []
          temp.map(item =>{
            let tempData = {}
            tempData.type = throngType
            tempData.throngId = item.id
            tempData.count = item.countNum
            tempData.throngName = item.groupName
            tempList.push(tempData)
          })
          for(let k = 0; k < tempList.length; k++) {
            for(let i = 0; i < list.length; i++) {
              if(tempList[k].throngId === list[i].throngId){
                tempList[k].checkStatus = true
                break
              }else {
                tempList[k].checkStatus = false
              }
            }
          }
          setThrongList(tempList)
        }else {
          message.error(res.result.message)
        }
      }
    })
  }
  /*选择人群*/
  let onChooseThrong = (index) =>{
    let temp = [...throngList]
    temp.map((item, key) => {
      if(key === index){
        if(!item.checkStatus){
          item.checkStatus = true
        }else{
          item.checkStatus = false
        }
      }
    })
    setThrongList(temp)
  }
  /*确定选择人群并初始化人群选中的奖品*/
  let onOk = () => {
    let temp = []
    throngList.map(item => {
      if(item.checkStatus){
        temp.push(item)
      }
    })
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
              return <div key={key} className={item.checkStatus ? style.throng_item_check : style.throng_item} onClick={()=> {onChooseThrong(key)}}>
                <div>{item.throngName}</div>
                <div className={style.throng_item_num}>{!item.count ? '--' : `${item.count}人`}</div>
              </div>
            })
          }
        </div>
        <div className={style.throng_bot}>
          已选：
          {
            throngList.map((item, key) => {
              return <span key={key}>
                {
                  item.checkStatus ? `${item.throngName} ；` : ''
                }
              </span>
            })
          }
        </div>
      </Modal>
    </>
  )
}
export default connect(({selectActivityThrong})=>({
}))(selectActivityThrongPage)
