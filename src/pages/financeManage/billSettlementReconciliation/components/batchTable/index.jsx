
import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Tag, Row, Col, Form, Space, Input, Table, Select, Button, Pagination, DatePicker, message, Modal } from "antd"
import { ExclamationCircleOutlined } from '@ant-design/icons';
import style from "./style.less";

const batchTable = (props) => {
  let { dispatch, modalInfo, toFatherValue } = props;  // batchType  1 撤销入账  2 入账  3 撤回 4 确认 5 调整金额
  console.log(modalInfo)
  let [tableColumn, setTableColumn] = useState([]); // 列表数据

  useEffect(()=> {
    if(modalInfo.type==5){
      console.log(55)
      return setTableColumn(batchMoneyColumn());
    }else {
      console.log(11)
      return setTableColumn(batchCommonColumn())
    }
  }, [])

  // 撤销入账column  && 入账column  &&  撤回column &&   确认column
  let batchCommonColumn = () => {
    let Column = [
      { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo', align: 'center'},
      { title: '匹配结果', dataIndex: 'reportDate', key: 'reportDate', align: 'center'},
      { title: '不匹配原因', dataIndex: 'statusName', key: 'statusName', align: 'center'},
    ]
    return Column;
  }
  // 调整金额column
  let batchMoneyColumn = () => {
    let Column = [
      { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo', align: 'center'},
      { title: '匹配结果', dataIndex: 'reportDate', key: 'reportDate', align: 'center'},
      { title: '调整金额', dataIndex: 'reportDate', key: 'reportDate', align: 'center'},
      { title: '调整原因', dataIndex: 'reportDate', key: 'reportDate', align: 'center'},
      { title: '不匹配原因', dataIndex: 'statusName', key: 'statusName', align: 'center'},
    ]
    return Column;
  }


  return (
    <>
      <Table locale={{emptyText: '暂无数据'}} columns={tableColumn} dataSource={modalInfo.list} pagination={false} />
    </>
  )
}

export default connect(({ }) => ({
}))(batchTable)







