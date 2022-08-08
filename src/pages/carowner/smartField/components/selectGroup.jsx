import React,{useEffect, useState} from "react"
import { connect,history } from 'umi'
import {
  Modal,
  message,
} from "antd"
import style from "./selectGroup.less"
let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));
window.smartField_groupList = [];
const selectGroup =(props)=>{
  let {dispatch, selList, sendData} = props;
  const [selItems,setSelItems] = useState([]);
  const [groupList,setGroupList] = useState([]);

  useEffect(()=>{
    setSelItems(selList || [])
    getList();
  },[])

  //初始化设置高亮选中
  const setChecked=(list)=>{
    for(let i=0;i<list.length;i++){
      list[i].checked = false;
    }
    for(let item of selList || []){
      for(let i=0;i<list.length;i++){
        let gItem = list[i];
        if(item.crowdId==gItem.id){
          list[i].checked = true;
          break;
        }
      }
    }
    setGroupList(list)
  }


  let getList = () =>{
    if(window.smartField_groupList && window.smartField_groupList.length){
      setChecked(window.smartField_groupList);
      return;
    }
    dispatch({
      type: 'selectActivityThrong/getThrongListExclude',
      payload:{
        method:'postJSON',
        params: {
          pageNum: 1,
          pageSize: 9999,
          channelId: tokenObj.channelId,
        }
      },
      callback: (res) => {
        if(res.result.code === '0'){
          let temp = res.body || []
          window.smartField_groupList = temp;
          setChecked(temp);
        }else {
          message.error(res.result.message)
        }
      }
    })
  }
  //选中群组
  const oncheck=(res,checked,index)=>{
    let _selItems = JSON.parse(JSON.stringify(selItems));
    let _groupList = JSON.parse(JSON.stringify(groupList));
    if(checked){//取消
      for(let i=0;i<selItems.length;i++){
        let item = selItems[i];
        if(res.id==item.crowdId){
          _selItems.splice(i,1);
          --i;break;
        }
      }
    }else{//勾选
      _selItems.push({crowdId: res.id,crowdName:res.groupName});
    }
    _groupList[index].checked= !checked;
    setGroupList(_groupList);
    setSelItems(_selItems);
  }
  const onOk=()=>{
    sendData(selItems);
  }
  const onCancel=()=>{
    sendData();
  }

  return(
    <Modal width={820} onOk={onOk} okText='确定' title="选择人群" 
    cancelText='取消' closable={false} visible={true} onCancel={onCancel} maskClosable={false} centered >
      <div className={style.group_box}>
        <div className={style.throng_box}>
          {
            groupList.map((item, index) => {
              return <div key={index} className={item.checked ? style.throng_item_check : style.throng_item} onClick={()=> {oncheck(item,item.checked,index)}}>
                <div>{item.groupName}</div>
                <div className={style.throng_item_num}>{item.countNum && `${item.countNum}人` || '--'}</div>
              </div>
            })
          }
        </div>
        <div className={style.throng_bot}>
          已选：{
            selItems.map(item=>{
              return <span>{item.crowdName}; </span>
            })
          }
        </div>
      </div>
    </Modal>
  )
}
export default connect(({selectActivityThrong})=>({

}))(selectGroup)
