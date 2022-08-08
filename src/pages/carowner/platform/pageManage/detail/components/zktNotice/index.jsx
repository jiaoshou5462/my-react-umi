import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, message, Radio,DatePicker
} from "antd";
const { RangePicker } = DatePicker;
import SetColor from '@/pages/activityModule/components/setColor';   //选择颜色组件
import style from "./style.less";
import moment from 'moment';
const titles = (props) => {
  const { dispatch, putItem } = props;
  //总数据
  let [formData, setFormData] = useState({});

  useEffect(() => {
    if (JSON.stringify(putItem)!='{}') {
      let newObj = JSON.parse(JSON.stringify(putItem));
      if(newObj.isAddItem){//新增 添加默认值
        let obj={
          title:'公告内容',
          backgroundColor:'#fff',
          textColor:'#333',
          startTime: moment(new Date(),'YYYY-MM-DD'),
          endTime: moment(new Date(),'YYYY-MM-DD'),
        }
        newObj.compList = obj;
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
  //标题
  let titleChange = (e) => {
    let toFormData = JSON.parse(JSON.stringify(formData));
    toFormData.title = e.target.value;
    setFormData(toFormData);
  };
  //颜色
  let setMcolor = (n, i) => {
    let toFormData = JSON.parse(JSON.stringify(formData));
    toFormData[n] = i;
    setFormData(toFormData);
  };
  const timeChange=(res)=>{
    let toFormData = JSON.parse(JSON.stringify(formData));
    toFormData.startTime = moment(res[0]).format('YYYY-MM-DD')
    toFormData.endTime = moment(res[1]).format('YYYY-MM-DD')
    setFormData(toFormData);
  }

  return (
    <div className={style.wrap_box}>
      <div className={style.wrap_box_li}>
        <span className={style.require_lable}>公告</span>
        <Input className={style.wrap_box_li_pn} onChange={titleChange} value={formData.title} placeholder="标题最多不超过8个字" maxLength="8" />
      </div>
      <div className={style.wrap_box_li}>
        <span>背景颜色</span>
        <div className={style.wrap_box_li_top}><SetColor colors={formData.backgroundColor} colorName='backgroundColor' setMColor={setMcolor} ></SetColor></div>
      </div>
      <div className={style.wrap_box_li}>
        <span>文字颜色</span>
        <div className={style.wrap_box_li_top}><SetColor colors={formData.textColor} colorName='textColor' setMColor={setMcolor} ></SetColor></div>
      </div>
      <div className={style.wrap_box_li}>
        <span>生效时间</span>
        <div className={style.wrap_box_li_top}>
          <RangePicker value={[moment(formData.startTime,'YYYY-MM-DD'),moment(formData.endTime,'YYYY-MM-DD')]} 
          format="YYYY-MM-DD" onChange={timeChange} allowClear={false}/>  
        </div>
      </div>
    </div>
  )
};
export default connect(({ carowner_pageManage }) => ({
  putItem: carowner_pageManage.putItem,
}))(titles)
