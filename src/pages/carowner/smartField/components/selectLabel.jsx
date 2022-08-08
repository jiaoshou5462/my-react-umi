import React,{useEffect, useState} from "react"
import { connect,history } from 'umi'
import {
  Modal,
  message,
  Cascader,
} from "antd"
import style from "./selectGroup.less"
let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));
window.smartField_labelList = [];
let selOption = [];
const selectLabel =(props)=>{
  let {dispatch, selList, sendData} = props;
  const [selItems,setSelItems] = useState([]);
  const [labelList,setLabelList] = useState([]);

  useEffect(()=>{
    getList();
  },[])

 
  

  let getList = () =>{
    if(window.smartField_labelList && window.smartField_labelList.length){
      setLabelList(window.smartField_labelList);
      return;
    }
    dispatch({
      type: 'smartField_model/channelGroupChannel',
      payload:{
        method:'get',
      },
      callback: (res) => {
        if(res.result.code === '0' && res.body){
          for(let item of res.body){
            item.name = item.tagGroupName;
            item.children = item.tagInfos;
            for(let info of item.tagInfos){
              info.name = info.tagName;
              info.children = info.tagLayers;
              for(let layer of info.tagLayers){
                layer.name = layer.layerName;
              }
            }
          }
          console.log(res.body)
          window.smartField_labelList = res.body;
          setLabelList(res.body);
        }else {
          message.error(res.result.message)
        }
      }
    })
  }
  const handleOneChange=(value,option)=>{
    selOption = option.map(item=>{
      return {crowdId: item.id,crowdName:item.name}
    });
    setSelItems(value);
  }
  const onOk=()=>{
    sendData(selOption[selOption.length-1]);
  }
  const onCancel=()=>{
    sendData();
  }

  return(
    <Modal width={820} onOk={onOk} okText='确定' title="选择标签" 
    cancelText='取消' closable={false} visible={true} onCancel={onCancel} maskClosable={false} >
      <div className={style.label_box}>
        <Cascader
          style={{ width: '100% ' }}
          placeholder="请选择标签"
          value={selItems}
          fieldNames={{
            label: 'name',
            value : 'id',
            children: 'children',
          }}
          showSearch
          options={labelList}
          onChange={handleOneChange}
        >
        </Cascader>
      </div>
    </Modal>
  )
}
export default connect(({selectActivityThrong})=>({

}))(selectLabel)
