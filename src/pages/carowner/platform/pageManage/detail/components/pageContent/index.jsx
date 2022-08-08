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

  return (
    <div className={style.wrap_box}>
      该组件仅用于展示页面内容，无法编辑
    </div>
  )
};
export default connect(({ carowner_pageManage }) => ({
  putItem: carowner_pageManage.putItem,
}))(titles)
