import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Tabs, Form, Input, Table, Select, Row, Space, Button, Col, DatePicker, Upload, Image } from "antd";
import { DownloadOutlined } from '@ant-design/icons';
import Rotation from '../components/rotation/index';
import style from "./style.less";
import BaiDuMap from '../components/baiDuMap'
import moment from 'moment'
import 'moment/locale/zh-cn';
import DetailTools from '../components/detailTools';
import { parseToThousandth } from '@/utils/date';
moment.locale('zh-cn')


const detailRescue = (props) => {
  let { dispatch, location, balanceDetailFact } = props;
  let [detailInfo, setDetailInfo] = useState(location.state && location.state.orderDetailInfo || ''); // 上一个页面传递过来的detailInfo数据
  let [detail, setDateil] = useState({}); // 详情对象
  let [imageInfo, setImageInfo] = useState({}); // 轮播图对象包含地图信息
  let [isShowMap, setIsShowMap] = useState(false); // 控制地图得显示与隐藏


  useEffect(() => {
    queryFactBalanceDetail();
  }, [])
  // 查询详情数据
  let queryFactBalanceDetail = (objectIds) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'billSettlementReconciliationModel/queryBalanceDetailFact',
        payload: {
          method: 'postJSON',
          params: {
            platformType: 2,
            objectId: objectIds ? objectIds : detailInfo.balanceDetailId,
          },
        },
        callback: res => {
          let detailObj = JSON.parse(JSON.stringify(res.body))
          detailObj.channelId = detailInfo.channelId;
          detailObj.platformType = 1; // 平台类型: 1：壹路通,2:智客通，3:服务商
          resolve(queryDetailRescueImageList(detailObj, objectIds));
        }
      });
    })
  }
  // 查询轮播图数据
  let queryDetailRescueImageList = (info, objectIds) => {
    dispatch({
      type: 'billSettlementReconciliationModel/queryDetailRescueImageList',
      payload: {
        method: 'postJSON',
        params: {
          platformType: 2,
          objectId: objectIds ? objectIds : detailInfo.balanceDetailId,
        },
      },
      callback: res => {
        info.caseStatus = res.body.caseStatus;
        info.destLatitude = res.body.destLatitude;
        info.destLongitude = res.body.destLongitude;
        info.locationLatitude = res.body.locationLatitude;
        info.locationLongitude = res.body.locationLongitude;
        setImageInfo(res.body);
        setDateil(info);
        setIsShowMap(true)
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
                <div className={style.title_fsz2}>案件创建人</div>
                <div className={style.color_fsz1}>{balanceDetailFact.orderCreateUser || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>服务单位</div>
                <div className={style.color_fsz1}>{balanceDetailFact.providerName || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>是否事故车</div>
                <div className={style.color_fsz1}>{balanceDetailFact.carConditionName || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>故障地点</div>
                <div className={style.color_fsz1}>{balanceDetailFact.orderAddress || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>目的地</div>
                <div className={style.color_fsz1}>{balanceDetailFact.destAddress || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>公里数</div>
                <div className={style.color_fsz1}>{balanceDetailFact.serviceDistance || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>救援时间</div>
                <div className={style.color_fsz1}>{balanceDetailFact.orderAcceptTimeStr || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>到达时间</div>
                <div className={style.color_fsz1}>{balanceDetailFact.orderArrivalTimeStr || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>到达时效(分钟)</div>
                <div className={style.color_fsz1}>{balanceDetailFact.agingStr || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>服务项目</div>
                <div className={style.color_fsz1}>{balanceDetailFact.serviceName || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>承保单位</div>
                <div className={style.color_fsz1}>{balanceDetailFact.underwritingUnit || ''}</div>
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
                <div className={style.title_fsz2}>车架号</div>
                <div className={style.color_fsz1}>{balanceDetailFact.carFrameNum || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>车型</div>
                <div className={style.color_fsz1}>{balanceDetailFact.carModel || ''}</div>
              </Col>
            </Row>
          </div>
          <div className={style.detail_item}>
            <div className={style.col_item_left_title}>评价信息</div>
            <Row className={style.detail_row}>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>用户评价</div>
                <div className={style.color_fsz1}>{balanceDetailFact.userEvaluate || ''}</div>
              </Col>
            </Row>
          </div>
        </Col>
        {/* 右侧地图及信息 */}
        <Col span={12} className={style.col_item}>
          <div className={style.right_box}>
            {/* 地图组件 */}
            {isShowMap ? <BaiDuMap caseId={detail.orderId} caseDetail={detail} driverId={imageInfo.driverId} /> : ''}
            {/* 照片信息 */}
            <div className={style.col_item_left_title}>照片信息</div>
            <div className={style.right_phone_box}>
              <Rotation rotationList={imageInfo.caseImageList} />
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
  balanceDetailFact: billSettlementReconciliationModel.balanceDetailFact,
}))(detailRescue)