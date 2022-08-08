import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, message, Radio,Button,Modal,InputNumber
} from "antd";

import style from "./style.less";
import SelectField from './modal/selectField';
import {fieldType_dict,status_dict,fieldContentType_dict,getDictName} from '@/pages/carowner/smartField/dict';
let selItem = null;
let defObj={
  contentType:1,
  bannerStyle:1,
  imgAngle:1,
  speed:3,
  contentShowNum:'all',
  imgHeight: 160,
  lanwei: '',
  lanweiList:[],
}
const titles = (props) => {
  const { dispatch, putItem,getSmartFieldList, } = props;
  //总数据
  let [formData, setFormData] = useState({});
  const [showSelectField,setShowSelectField] = useState(false)

  useEffect(() => {
    if (JSON.stringify(putItem)!='{}') {
      let newObj = JSON.parse(JSON.stringify(putItem));
      if(newObj.isAddItem){//新增 添加默认值
        newObj.compList = defObj;
      }else{
        newObj.compList = Object.assign(defObj,newObj.compList);
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
    });
  }, [formData])
  
  const dataChange=(e,name)=>{
    let toFormData = JSON.parse(JSON.stringify(formData));
    if(name=='contentType' && formData.lanwei){
      Modal.confirm({
        content:'确定切换选中么？切换操作会清空已选择的内容',
        onOk:()=>{
          toFormData.lanwei = '';
          toFormData[name] = e;
          setFormData(toFormData);
        }
      })
    }else{
      toFormData[name] = e;
      setFormData(toFormData);
    }
  }
 
  const closeEvent=(res)=>{
    if(res){
      let toFormData = JSON.parse(JSON.stringify(formData));
      // getSmartFieldList(res).then(list=>{
        toFormData.lanwei = res;
        // toFormData.lanweiList = list;
        setFormData(toFormData);
      // })
    }
    setShowSelectField(false);
  }
  //更换
  const changeItem=()=>{
    selItem = formData.lanwei;
    setShowSelectField(true);
  }

  return (
    <>
      <div className={style.smartField}>
        <div className={style.block}>
          <span className={style.require_lable}>栏位内容类型</span>
          <Radio.Group onChange={e=>dataChange(e.target.value,'contentType')} defaultValue={1}
           value={formData.contentType}>
            <Radio value={1}>图片</Radio>
            <Radio value={2}>产品</Radio>
            <Radio value={3}>文章</Radio>
          </Radio.Group>
        </div>
        <div className={style.block}>
          <span className={style.require_lable}>
            {formData.contentType==1?'图片数量':''}
            {formData.contentType==2?'产品数量':''}
            {formData.contentType==3?'文章展示':''}
          </span>
          <Radio.Group onChange={e=>dataChange(e.target.value,'contentShowNum')} defaultValue={'all'}
           value={formData.contentShowNum}>
            <Radio value={1}>{formData.contentType==3?'单篇':'单个'} </Radio>
            <Radio value={'all'}>{formData.contentType==3?'多篇':'多个'} </Radio>
          </Radio.Group>
        </div>
        {formData.contentType==1?<>
        {formData.contentShowNum=='all'?<>
          <div className={style.block}>
            <span className={style.require_lable}>轮播速度</span>
            <div><InputNumber value={formData.speed} defaultValue={3} min={0} onChange={e=>dataChange(e,'speed')} 
            style={{width: '60px'}} /> 秒替换一张</div>
          </div>
          <div className={style.block}>
            <span className={style.require_lable}>指示器</span>
            <Radio.Group onChange={e=>dataChange(e.target.value,'bannerStyle')} defaultValue={1} value={formData.bannerStyle}>
              <Radio value={1} className={style.bannerStyle_box}>样式一 <div className={style.bannerStyle_circle}><i></i><i></i><i></i></div></Radio>
              <Radio value={2} className={style.bannerStyle_box}>样式二 <div className={style.bannerStyle_square}><i></i><i></i><i></i></div></Radio>
            </Radio.Group>
          </div>
        </>:''}
        <div className={style.block}>
          <span className={style.require_lable}>图片高度</span>
          <div><InputNumber onChange={e=>dataChange(e,'imgHeight')} defaultValue={160} value={formData.imgHeight} 
          min={0} style={{width: '200px'}}/> px</div>
        </div>
        <div className={style.block}>
          <span className={style.require_lable}>图片倒角</span>
          <Radio.Group onChange={e=>dataChange(e.target.value,'imgAngle')} defaultValue={1} value={formData.imgAngle}>
            <Radio value={1}>直角</Radio>
            <Radio value={2}>圆角</Radio>
          </Radio.Group>
        </div></>:''}
        <div className={style.block}>
          <span className={style.require_lable}>栏位内容</span>
          {formData.lanwei && formData.lanwei.objectId ? <div className={style.lanwei_item}>
            <div className={style.lanwei_item_info}>
              <span>{formData.lanwei.objectId} /</span>
              <span>{formData.lanwei.fieldName} /</span>
              <span>{getDictName(fieldType_dict,formData.lanwei.fieldType)}</span>
            </div>
            <div className={style.lanwei_item_btn} onClick={()=>changeItem()}>更换</div>
          </div>:<span style={{color:'#999'}}>请添加</span>}
        </div>
        {!formData.lanwei?<div className={style.block}>
          <Button type="primary" style={{width: '100%'}} onClick={()=>setShowSelectField(true)}>添加</Button>
        </div>:''}
      </div>
      {showSelectField ? <SelectField selItem={[selItem]} 
      fieldContentType={formData.contentType}
       closeEvent={e=>closeEvent(e)} />:'' }
    </>
    
  )
};
export default connect(({ carowner_pageManage }) => ({
  putItem: carowner_pageManage.putItem,
}))(titles)
