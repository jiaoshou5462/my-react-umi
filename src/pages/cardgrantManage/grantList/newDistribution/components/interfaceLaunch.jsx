import React, { useState, useEffect, useRef, useContext } from 'react';
import { connect, history } from 'umi';
import {
  Row, Col, Form, Space, Radio, Input, Table, Select, Divider, Button, DatePicker,
  Pagination, Modal, message, Tooltip
} from "antd"
import AddCouponsModal from '../modal/addCouponsModal';
import style from "./style.less";
import { QuestionCircleOutlined } from '@ant-design/icons';
import Coupon from './coupon';
import Cardbag from './cardbag';
let compData = {};
let allObj = {}//数量,总额对象

// 添加接口投放
const interfaceLaunch = (props) => {
  let { dispatch, editInfo, detailList } = props;
  // 登录成功返回的数据
  const currentUser = localStorage.getItem('tokenObj') ? JSON.parse(localStorage.getItem('tokenObj')) : {};

  let [isRadioTabs, setIsRadioTabs] = useState(0);

  const chooseTabs = (e) => {
    setIsRadioTabs(e.target.value)
  }
  return (
    <>
      {/* <Row justify="space-around" align="center" style={{ marginTop: '30px' }}>
        <Radio.Group defaultValue={isRadioTabs} value={isRadioTabs} buttonStyle="solid" onChange={chooseTabs}>
          <Radio.Button style={{ width: '200px', height: '36px', textAlign: 'center' }} value={0}>选择卡券</Radio.Button>
          <Radio.Button style={{ width: '200px', height: '36px', textAlign: 'center' }} value={1}>选择卡包</Radio.Button>
        </Radio.Group>
      </Row> */}
      {
        isRadioTabs == 0 ? <Coupon editInfo={editInfo} detailList={detailList} /> :
          isRadioTabs == 1 ? <Cardbag /> : ''
      }
    </>
  )
}

export default connect(({ cardgrantManageModel }) => ({
  // cardbagIdList: cardgrantManageModel.cardbagIdList,
}))(interfaceLaunch)