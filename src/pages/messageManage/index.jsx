import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Tabs, Form, Input, Table, Select, Row, Space, Button, Pagination, Tag } from "antd";
import style from "./style.less";
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

import ImportantMsg from './components/importantMsg'
import SystemNotice from './components/systemNotice';

const { TabPane } = Tabs;

const messageCenter = (props) => {
  let { dispatch } = props;
  let nowActiveKey = sessionStorage.getItem('defaultActiveKey') ? sessionStorage.getItem('defaultActiveKey') : 2
  let [defaultActiveKey, setDefaultActiveKey] = useState(nowActiveKey)//当前tab

  let callback = (key) => {
    // console.log(key, '33')
    sessionStorage.setItem('defaultActiveKey', key)
    setDefaultActiveKey(key);

    dispatch({
      type: 'messageModel/setMsgTabs',//tabs切换
      payload: nowActiveKey
    })
  }
  return (
    <>
      <div className={style.block__cont}>
        {/* <div className={style.block__header}>
          <div>消息中心</div>
        </div> */}
        <Tabs style={{ padding: ' 0 36px' }} onChange={callback} defaultActiveKey={defaultActiveKey}>
          <TabPane tab="重要讯息" key="2"><ImportantMsg type={nowActiveKey} /></TabPane>
          <TabPane tab="系统通知" key="1" disabled>
            {/* <SystemNotice /> */}
          </TabPane>
        </Tabs>
      </div>
    </>
  )
}


export default connect(({ financeManageModel }) => ({
}))(messageCenter)