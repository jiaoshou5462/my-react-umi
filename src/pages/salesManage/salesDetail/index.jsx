import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Tabs, Form, Input, DatePicker, Table, Image, message, Select, Modal, Button, Row, Col } from "antd";
import { CaretDownOutlined } from '@ant-design/icons';

import style from "./style.less";
import moment from 'moment';
import { formatDate } from '@/utils/date'
// import ActivityTask from './activityTask';
import CustomerInfo from './customerInfo/index';
import CardcouponInfo from './cardcouponInfo/index';
import BehaviorInfo from './behaviorInfo/index';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { TabPane } = Tabs;

const salesDetail = (props) => {
  let { dispatch, saleInfo, zkInfo, saleDetailInfo, location } = props;
  let [form] = Form.useForm();
  let [pageType, setPageType] = useState(location.query && location.query.pageType || '') //页面来源
  useEffect(() => {
    getSaleInfoDetail()
  }, [])


  // 查询销售详情信息
  let getSaleInfoDetail = () => {
    dispatch({
      type: 'salesManageModel/getSaleInfoDetail',
      payload: {
        method: 'get',
        params: {
          availablePoints: history.location.query.availablePoints,//可用积分
          cardCount: history.location.query.cardCount,//卡卷数量//balanceId,
          channelId: history.location.query.channelId,//渠道ID
          objectId: history.location.query.objectId//	销售ID
        },
      }
    });
  }

  return (
    <>
      <div className={style.detailBox} style={{ borderRadius: '20px' }}>
        <div className={style.title}>
          <div>销售信息</div>
          <Button className={style.backBtn} onClick={() => { history.goBack(); }}>返回</Button>
        </div>
        {/* 1 */}
        <div className={style.info}>
          <div className={style.info_data}>
            <Form.Item className={style.form_item} label="销售名称:" labelCol={{ span: 8 }}>
              {saleInfo && saleInfo.username}
            </Form.Item>
            <Form.Item className={style.form_item} label="销售账号:" labelCol={{ span: 8 }}>
              {saleInfo && saleInfo.userid}
            </Form.Item>
            <Form.Item className={style.form_item} label="账号状态:" labelCol={{ span: 8 }}>
              {saleInfo && saleInfo.userStatusName}
            </Form.Item>
            <Form.Item className={style.form_item} label="所属门店:" labelCol={{ span: 8 }}>
              {saleInfo && saleInfo.depname}
            </Form.Item>
            <Form.Item className={style.form_item} label="所属团队:" labelCol={{ span: 8 }}>
              {saleInfo && saleInfo.teamName}
            </Form.Item>
            <Form.Item className={style.form_item} label="账号更新时间:" labelCol={{ span: 8 }}>
              {saleInfo && saleInfo.updateTime}
            </Form.Item>
          </div>
        </div>
        <div className={style.interspace}></div>
        {/* 2 */}
        <div className={style.title}>掌客信息</div>
        <div>
          <div style={{ padding: '30px 200px' }}>
            <Row justify="space-around" align="center">
              <Col style={{ marginBottom: '24px' }} span={6}>
                <div>活跃客户：<span>{zkInfo && zkInfo.customerActiveTotals ? zkInfo.customerActiveTotals : 0}</span></div>
              </Col>
              <Col style={{ marginBottom: '24px' }} span={6}>
                <div>流失客户：<span>{saleDetailInfo && saleDetailInfo.lossCustomers ? saleDetailInfo.lossCustomers : 0}</span></div>
              </Col>
              <Col style={{ marginBottom: '24px' }} span={6}>
                <div>享权客户：<span>{zkInfo && zkInfo.customerEnjoyTotals ? zkInfo.customerEnjoyTotals : 0}</span></div>
              </Col>
              <Col style={{ marginBottom: '24px' }} span={6}>
                <div>积分余额：<span>{saleDetailInfo && saleDetailInfo.availablePoints ? saleDetailInfo.availablePoints : 0}</span></div>
              </Col>
            </Row>
            <Row justify="space-around" align="center">
              <Col style={{ marginBottom: '24px' }} span={6}>
                <div>卡券数量：<span>{saleDetailInfo && saleDetailInfo.cardCount ? saleDetailInfo.cardCount : 0}</span></div>
              </Col>
              <Col style={{ marginBottom: '24px' }} span={6}>
              </Col>
              <Col style={{ marginBottom: '24px' }} span={6}>
              </Col>
              <Col style={{ marginBottom: '24px' }} span={6}>
              </Col>
            </Row>
          </div>
          <div style={{ padding: '0 150px' }}>
            <Row justify="space-around" align="center">
              <Col span={6} style={{ margin: '10px 0' }}>
                <div className={style.typeBox}>
                  <p>扫码跳转</p>
                  <span className={style.size_18}>{zkInfo.customerSweepCodeTotals ? zkInfo.customerSweepCodeTotals : 0}</span> 人
                </div>
                <p style={{ margin: '20px 0 0 70px' }}><CaretDownOutlined style={{ color: '#D8D8D8' }} /></p>
              </Col>
              <Col span={6} style={{ margin: '10px 0' }}>
                <div className={style.typeBox}>
                  <p>内容转发</p>
                  <span className={style.size_18}>{zkInfo.newForwords ? zkInfo.newForwords : 0}</span> 人
                </div>
                <p style={{ margin: '20px 0 0 70px' }}><CaretDownOutlined style={{ color: '#D8D8D8' }} /></p>
              </Col>
              <Col span={6} style={{ margin: '10px 0' }}>
                <div className={style.typeBox}>
                  <p>产品转发</p>
                  <span className={style.size_18}>{zkInfo.productForwords ? zkInfo.productForwords : 0}</span> 人
                </div>
                <p style={{ margin: '20px 0 0 70px' }}><CaretDownOutlined style={{ color: '#D8D8D8' }} /></p>
              </Col>
              <Col span={6} style={{ margin: '10px 0' }}>
                <div className={style.typeBox}>
                  <p>卡券赠送</p>
                  <span className={style.size_18}>{zkInfo.sendCards ? zkInfo.sendCards : 0}</span> 人
                </div>
                <p style={{ margin: '20px 0 0 70px' }}><CaretDownOutlined style={{ color: '#D8D8D8' }} /></p>
              </Col>


              <Col span={6} style={{ margin: '10px 0' }}>
                <div className={style.typeBox}>
                  <p>扫码获客</p>
                  <span className={style.size_18}>{zkInfo.customerBySweepCodeTotals ? zkInfo.customerBySweepCodeTotals : 0}</span> 人
                </div>
                <p className={style.blueCont}>转化率：{zkInfo.sweepCodeDegree ? zkInfo.sweepCodeDegree : 0} %</p>
              </Col>
              <Col span={6} style={{ margin: '10px 0' }}>
                <div className={style.typeBox}>
                  <p>内容点击</p>
                  <span className={style.size_18}>{zkInfo.newClicks ? zkInfo.newClicks : 0}</span> 人
                </div>
                <p className={style.blueCont}>触达率：{zkInfo.newsDegree ? zkInfo.newsDegree : 0} %</p>
              </Col>
              <Col span={6} style={{ margin: '10px 0' }}>
                <div className={style.typeBox}>
                  <p>产品点击</p>
                  <span className={style.size_18}>{zkInfo.productClicks ? zkInfo.productClicks : 0}</span> 人
                </div>
                <p className={style.blueCont}>触达率：{zkInfo.productsDegree ? zkInfo.productsDegree : 0} %</p>
              </Col>
              <Col span={6} style={{ margin: '10px 0' }}>
                <div className={style.typeBox}>
                  <p>卡券使用</p>
                  <span className={style.size_18}>{zkInfo.useCards ? zkInfo.useCards : 0}</span> 人
                </div>
                <p className={style.blueCont}>促活率：{zkInfo.cardsDegree ? zkInfo.cardsDegree : 0} %</p>
              </Col>
            </Row>

          </div>
        </div>
      </div>

      <div className={style.detailBox} style={{ borderRadius: '20px', marginTop: '30px' }}>
        <Tabs style={{ padding: ' 0 36px' }} defaultActiveKey="2">
          {/* <TabPane tab="活动任务" key="1"><ActivityTask /></TabPane> */}
          <TabPane tab="客户信息" key="2"><CustomerInfo pageType={pageType} relationUserId={history.location.query.objectId} saleInfo={saleInfo} /></TabPane>
          <TabPane tab="卡券信息" key="3"><CardcouponInfo carInfo={saleInfo} /></TabPane>
          <TabPane tab="行为信息" key="4"><BehaviorInfo relationUserId={history.location.query.objectId} /></TabPane>
        </Tabs>
      </div>
      {/* <div className={style.btns}>
          <Button onClick={() => { history.goBack() }}>返回</Button>
        </div> */}
    </>
  )
}


export default connect(({ salesManageModel }) => ({
  saleInfo: salesManageModel.saleInfo,
  zkInfo: salesManageModel.zkInfo,
  saleDetailInfo: salesManageModel.saleDetailInfo
}))(salesDetail)
