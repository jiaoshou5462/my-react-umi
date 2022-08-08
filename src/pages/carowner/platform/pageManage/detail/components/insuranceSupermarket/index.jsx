import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, message, Radio,
} from "antd";
import style from "./style.less";
let def_list = [
  {name:'产品名称',show:true,},
  {name:'产品描述',show:true,},
  {name:'产品价格',show:true,},
  {name:'保障金额',show:true,},
  {name:'产品标签',show:true,},
];
let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));
const titles = (props) => {
  const { dispatch, putItem } = props;
  //总数据
  let [formData, setFormData] = useState([{}]);

  useEffect(() => {
    if (JSON.stringify(putItem)!='{}') {
      let newObj = JSON.parse(JSON.stringify(putItem));
      if(newObj.isAddItem){//新增
        newObj.compList = {
          listType:1,
        }
      }
      setFormData(newObj.compList);
    }
  }, [putItem])

  useEffect(() => {
    if(putItem.isClick){
      delete putItem.isClick;return;
    }
    let newObj = JSON.parse(JSON.stringify(putItem));
    newObj.compList = JSON.parse(JSON.stringify(formData));
    dispatch({
      type: 'carowner_pageManage/setSendItem',
      payload: newObj
    })
  }, [formData])

  const radioChange=(e)=>{
    let toFormData = JSON.parse(JSON.stringify(formData));
    toFormData.listType = e.target.value;
    setFormData(toFormData);
  }

  return (
    <div className={style.market}>
      <h5>列表样式</h5>
      <Radio.Group onChange={radioChange} value={formData.listType}>
        <Radio.Button value={1}>大图模式</Radio.Button>
        <Radio.Button value={2}>一行两个</Radio.Button>
        <Radio.Button value={3}>列表模式</Radio.Button>
      </Radio.Group>
    </div>
  )
};
export default connect(({ carowner_pageManage }) => ({
  putItem: carowner_pageManage.putItem,
}))(titles)
