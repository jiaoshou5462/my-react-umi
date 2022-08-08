import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, message, Radio,
} from "antd";
import SetColor from '@/pages/activityModule/components/setColor';   //选择颜色组件
import style from "./style.less";
const titles = (props) => {
  const { dispatch, putItem } = props;
  //总数据
  let [formData, setFormData] = useState([{}]);

  useEffect(() => {
    if (JSON.stringify(putItem)!='{}') {
      let newObj = JSON.parse(JSON.stringify(putItem));
      if(newObj.isAddItem){//新增 添加默认值
        newObj.compList[0].title = '标题';
        newObj.compList[0].color = '#333';
        newObj.compList[0].needSubTitle = '1';
        newObj.compList[0].subColor = '#666';
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
    let toFormData = formData;
    toFormData[0].title = e.target.value;
    setFormData([...toFormData]);
  };
  //颜色
  let setMcolor = (n, i) => {
    let toFormData = formData;
    toFormData[0][n] = i;
    setFormData([...toFormData]);
  };
  //拓展标题
  let roChange = e => {
    let toFormData = formData;
    toFormData[0].needSubTitle = e.target.value;
    setFormData([...toFormData]);
  };
  //副标题
  let ViceTitleChange = (e) => {
    let toFormData = formData;
    toFormData[0].subtitle = e.target.value;
    setFormData([...toFormData]);
  };
  // 跳转链接
  let linkChange = (e) => {
    let toFormData = formData;
    toFormData[0].actionUrl = e.target.value;
    setFormData([...toFormData]);
  };

  return (
    <div className={style.wrap}>
      <div className={style.wrap_box}>
        <div className={style.wrap_box_li}>
          <strong>标题文本</strong>
          <Input className={style.wrap_box_li_pn} onChange={titleChange} value={formData[0].title} placeholder="标题最多不超过8个字" maxLength="8" />
        </div>
        <div className={style.wrap_box_li}>
          <strong>文本颜色</strong>
          <div className={style.wrap_box_li_top}><SetColor colors={formData[0].color} colorName='color' setMColor={setMcolor} ></SetColor></div>
        </div>
      </div>

      <div className={style.wrap_box}>
        <div className={style.wrap_box_li}>
          <strong>拓展标题</strong>
          <Radio.Group onChange={roChange} value={formData[0].needSubTitle} className={style.wrap_box_li_top}>
            <Radio value={'0'}>显示</Radio>
            <Radio value={'1'}>不显示</Radio>
          </Radio.Group>
        </div>
        {/* 副标题 */}
        {
          formData[0].needSubTitle == '0' ?
            <>
              <div className={style.wrap_box_li}>
                <strong>副标题文本</strong>
                <Input className={style.wrap_box_li_pn} onChange={ViceTitleChange} value={formData[0].subtitle} placeholder="副标题最多不超过6个字" maxLength="6" />
              </div>
              <div className={style.wrap_box_li}>
                <strong>文本颜色</strong>
                <div className={style.wrap_box_li_top}><SetColor colors={formData[0].subColor} colorName='subColor' setMColor={setMcolor} ></SetColor></div>
              </div>
              <div className={style.wrap_box_li}>
                <strong>跳转链接</strong>
                <Input className={style.wrap_box_li_pn} onChange={linkChange} value={formData[0].actionUrl} />
              </div>
            </>
            : ''
        }
      </div>
    </div>
  )
};
export default connect(({ carowner_pageManage }) => ({
  putItem: carowner_pageManage.putItem,
}))(titles)
