import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Tabs, Form, Input, Table, Select, Row, Space, Button, Col, DatePicker, Upload, Image } from "antd";
import { DownloadOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;
import Rotation from '../components/rotation/index';
import style from "./style.less";
import moment from 'moment'
import 'moment/locale/zh-cn';
import DetailTools from '../components/detailTools';
import { parseToThousandth } from '@/utils/date';
moment.locale('zh-cn')


const detailScooter = (props) => {
  let { dispatch, location, balanceDetailFact } = props;
  let [detailInfo, setDetailInfo] = useState(location.state && location.state.orderDetailInfo || ''); // 上一个页面传递过来的detailInfo数据
  useEffect(() => {
    queryFactBalanceDetail();
  }, [])
  // 查询详情数据
  let queryFactBalanceDetail = (objectIds) => {
    dispatch({
      type: 'billSettlementReconciliationModel/queryBalanceDetailFact',
      payload: {
        method: 'postJSON',
        params: {
          platformType: 2,
          objectId: objectIds ? objectIds : detailInfo.balanceDetailId
        },
      }
    });
  }


  return (
    <div className={style.block__cont}>
      <div className={style.block__header}>
        <span>订单详情</span>
        <Button className={style.btn_radius} htmlType="button" onClick={() => { history.goBack() }}>返回</Button>
      </div>
      <Row className={style.detail_box}>
        {/* 左侧信息 */}
        <Col span={12} className={style.col_item}>
          <div className={style.detail_item}>
            <div className={style.col_item_left_title}>壹路通订单号(案件号)<span className={style.color_fsz1}>{balanceDetailFact.orderNo || ''}</span></div>
            <Row className={style.detail_row}>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>来源工单号(客户订单号)</div>
                <div className={style.color_fsz1}>{balanceDetailFact.thirdOrderNo || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>受理日期</div>
                <div className={style.color_fsz1}>{balanceDetailFact.orderCreateTimeStr || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>服务状态</div>
                <div className={style.color_fsz1}>{balanceDetailFact.orderStatusName || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>省份</div>
                <div className={style.color_fsz1}>{balanceDetailFact.provinceName || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>城市</div>
                <div className={style.color_fsz1}>{balanceDetailFact.cityName || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>区域</div>
                <div className={style.color_fsz1}>{balanceDetailFact.regionName || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>使用门店</div>
                <div className={style.color_fsz1}>{balanceDetailFact.storeName || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>用车类型</div>
                <div className={style.color_fsz1}>{balanceDetailFact.useCarType || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>取车地点</div>
                <div className={style.color_fsz1}>{balanceDetailFact.orderTakeCarAddress || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>取车时间</div>
                <div className={style.color_fsz1}>{balanceDetailFact.orderPickCarTimeStr || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>还车地点</div>
                <div className={style.color_fsz1}>{balanceDetailFact.orderReturnCarAddress || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>还车时间</div>
                <div className={style.color_fsz1}>{balanceDetailFact.orderReturnCarTimeStr || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>使用天数</div>
                <div className={style.color_fsz1}>{balanceDetailFact.orderUseDayStr || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>案件备注</div>
                <div className={style.color_fsz1}>{balanceDetailFact.orderOutRemark || ''}</div>
              </Col>
            </Row>
          </div>
          <div className={style.detail_item}>
            <div className={style.col_item_left_title}>用户信息</div>
            <Row className={style.detail_row}>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>用户名称</div>
                <div className={style.color_fsz1}>{balanceDetailFact.userName || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>用户手机号</div>
                <div className={style.color_fsz1}>{balanceDetailFact.userMobile || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>车牌号</div>
                <div className={style.color_fsz1}>{balanceDetailFact.plateNo || ''}</div>
              </Col>
            </Row>
          </div>
          <div className={style.detail_item}>
            <div className={style.col_item_left_title}>车辆及保险信息</div>
            <Row className={style.detail_row}>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>保单号码</div>
                <div className={style.color_fsz1}>{balanceDetailFact.policyNo || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>车型</div>
                <div className={style.color_fsz1}>{balanceDetailFact.carModel || ''}</div>
              </Col>
            </Row>
          </div>
        </Col>
        {/* 右侧信息 */}
        <Col span={12} className={style.col_item}>
          <div className={style.right_box}>
            <div className={style.col_item_left_title}>照片信息</div>
            {/* 办理完成照片 */}
            <div className={style.right_phone_box}>
              <Rotation rotationList={balanceDetailFact.rentImageList} />
            </div>
            <div className={style.col_item_left_title}>结算信息</div>
            <Row className={style.detail_row}>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>结算状态</div>
                <div className={style.color_fsz1}>{balanceDetailFact.billFlagName || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>金额(元)</div>
                <div className={style.color_fsz1}>{ parseToThousandth(parseFloat(balanceDetailFact.balanceAmountStr)) || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>异议原因</div>
                <div className={style.color_fsz1}>{balanceDetailFact.objectionReason || ''}</div>
              </Col>
              {
                balanceDetailFact.billFlag == 5 ?
                  <Col span={8} className={style.detail_col}>
                    <div className={style.title_fsz2}>不结算原因</div>
                    <div className={style.color_fsz1}>{balanceDetailFact.noBalanceReason || ''}</div>
                  </Col> : null
              }
            </Row>
          </div>
        </Col>
      </Row>
      {/* 底部按钮 */}
      <DetailTools factBalanceDetail={balanceDetailFact} queryFactBalanceDetail={queryFactBalanceDetail}></DetailTools>
    </div>
  )
}


export default connect(({ billSettlementReconciliationModel }) => ({
  balanceDetailFact: billSettlementReconciliationModel.balanceDetailFact
}))(detailScooter)