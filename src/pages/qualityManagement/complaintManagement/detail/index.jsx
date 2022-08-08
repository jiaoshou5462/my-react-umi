/*
 * @Author: wangzhushan
 * @Date: 2022-05-10 19:22:03
 * @LastEditTime: 2022-05-18 08:49:29
 * @LastEditors: wangzhushan
 * @Description: 投诉管理详情
 */
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Form, Input,Tag, Table, Select, Row, Col, Pagination, Tooltip, Button, DatePicker, Modal, message } from "antd";
import style from "./style.less";
import Detail from '../../../order/rescueOrder/detail'


const complaintManagementDetail = (props) => {
  let { dispatch, location } = props
  let [detailInfo, setDetailInfo] = useState(location && location.state.detailInfo)
  console.log(location)
  return (
    <>
      <div className={style.account}>
        <div className={style.tableData_title}>处理结果</div>
        <Row className={style.row_detail}>
          <Col span={8} className={style.col_item}>
            <span className={style.fsz1}>解决状态</span>
            <span className={style.fsz2}>{detailInfo.settleStatusName || '-'}</span>
          </Col>
          <Col span={8} className={style.col_item}>
            <span className={style.fsz1}>解决方式</span>
            <span className={style.fsz2}>{detailInfo.settleCategoryName || '-'}</span>
          </Col>
          <Col span={8} className={style.col_item}>
            <span className={style.fsz1}>投诉来源</span>
            <span className={style.fsz2}>{detailInfo.complainSourceName || '-'}</span>
          </Col>
          <Col span={24} className={style.col_item}>
            <span className={style.fsz1}>投诉内容</span>
            <span className={style.fsz2}>{detailInfo.complainContent || '-'}</span>
          </Col>
          <Col span={24} className={style.col_item}>
            <span className={style.fsz1}>处理结果</span>
            <span className={style.fsz2}>{detailInfo.complainSettleResult || '-'}</span>
          </Col>
        </Row>
      </div>
      <Detail location={location}/>
    </>
  )
}


export default connect(({  }) => ({

}))(complaintManagementDetail)