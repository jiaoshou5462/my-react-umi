import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, message, Radio, Divider
} from "antd";
import SetColor from '@/pages/activityModule/components/setColor';   //选择颜色组件
import style from "./style.less"


//分割占位13
const partitionFootprint = (props) => {
  const { dispatch, putItem } = props;

  let [formData, setFormData] = useState([{}])//上传图片列表

  useEffect(() => {
    if (JSON.stringify(putItem)!='{}') {
      let newObj = JSON.parse(JSON.stringify(putItem));
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

  //图片上传
  let imgUpload = (file, i) => {
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
  // 1线条
  let lineStyle = (e) => {
    let toFormData = formData;
    toFormData[0].lineStyle = e.target.value;
    setFormData([...toFormData]);
  };
  // 2间距
  let spaceChange = (e) => {
    let toFormData = formData;
    toFormData[0].lineHeight = e.target.value;
    setFormData([...toFormData]);
  };

  //颜色
  let setMcolor = (n, i) => {
    let toFormData = formData;
    toFormData[0][n] = i;
    setFormData([...toFormData]);
  };


  return (
    <div className={style.wrap}>
      <div className={style.wrap_box2}>
        <div className={style.wrap_box2_main}>
          <div className={style.wrap_box2_p}>
            <strong>线条</strong>
            <Radio.Group onChange={lineStyle} value={formData[0].lineStyle}>
              <Radio.Button value="solid">实线</Radio.Button>
              <Radio.Button value="dashed">虚线</Radio.Button>
              <Radio.Button value="dotted">点线</Radio.Button>
            </Radio.Group>
          </div>
          <div className={style.wrap_box2_p}>
            <strong>空白间距</strong>
            <div className={style.wrap_box2_top}>
              <Input style={{ width: '100px', marginRight: '30px' }} onChange={spaceChange} value={formData[0].lineHeight}></Input>
              <strong>px</strong>
            </div>
          </div>
          <div className={style.wrap_box2_p}>
            <strong>线条颜色</strong>
            <div className={style.wrap_box2_top}><SetColor colors={formData[0].lineColor} colorName='lineColor' setMColor={setMcolor} ></SetColor></div>
          </div>
          <div className={style.wrap_box2_p}>
            <strong>背景颜色</strong>
            <div className={style.wrap_box2_top}><SetColor colors={formData[0].backgroundColor} colorName='backgroundColor' setMColor={setMcolor} ></SetColor></div>
          </div>
        </div>
        <Divider />
      </div>



    </div >
  )
};
export default connect(({ carowner_pageManage }) => ({
  putItem: carowner_pageManage.putItem,
}))(partitionFootprint)
