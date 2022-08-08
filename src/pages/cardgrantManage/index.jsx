import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Tabs, Form, Input, Table, Select, Row, Space, Button, Pagination, Tag } from "antd";
import style from "./style.less";

import GrantList from './grantList';
import RuleList from './ruleList';


const { TabPane } = Tabs;

const grantPage = (props) => {
  let { dispatch, isRadioTabs } = props;
  let nowActiveKey = sessionStorage.getItem('defaultActiveKey') ? sessionStorage.getItem('defaultActiveKey') : 1
  let [defaultActiveKey, setDefaultActiveKey] = useState(nowActiveKey)//当前tab

  let callback = (key) => {
    // console.log(key, '33')
    sessionStorage.setItem('defaultActiveKey', key)
    setDefaultActiveKey(key);
  }

  useEffect(() => {
    sessionStorage.setItem('defaultActiveKey', isRadioTabs)
    setDefaultActiveKey(isRadioTabs);
    console.log(defaultActiveKey, 'defaultActiveKey')
    console.log(isRadioTabs, 'isRadioTabs')

  }, [isRadioTabs])
  return (
    <>
      <div>
        {
          isRadioTabs == 1 ?
            <GrantList />
            :
            <RuleList />
        }
        {/* <Tabs type="card" style={{ padding: ' 0 36px' }} onChange={callback} defaultActiveKey={defaultActiveKey}>
          <TabPane tab="批次发放" key="1"><GrantList /></TabPane>
          <TabPane tab="规则发放" key="2" disabled><RuleList /></TabPane>
        </Tabs> */}
      </div>
    </>
  )
}


export default connect(({ cardgrantManageModel }) => ({
  isRadioTabs: cardgrantManageModel.isRadioTabs,//tabs切换
}))(grantPage)







