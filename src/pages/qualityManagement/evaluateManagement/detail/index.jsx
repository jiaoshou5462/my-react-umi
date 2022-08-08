/*
 * @Author: wangzhushan
 * @Date: 2022-05-10 15:56:49
 * @LastEditTime: 2022-05-11 11:02:25
 * @LastEditors: wangzhushan
 * @Description: 评价管理详情 
 */
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Form, Input,Tag, Table, Select, Row, Col, Pagination, Tooltip, Button, DatePicker, Modal, message } from "antd";
import style from "./style.less";
import Detail from '../../../order/rescueOrder/detail'


const evaluateManagementDetail = (props) => {
  let { dispatch, location } = props
  return (
    <>
      <Detail location={location}/>
    </>
  )
}


export default connect(({  }) => ({

}))(evaluateManagementDetail)