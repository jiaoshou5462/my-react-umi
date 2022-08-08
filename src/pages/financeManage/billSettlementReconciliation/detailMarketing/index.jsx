import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Tabs, Form, Input, Table, Select, Row, Space, Button, Col, DatePicker, Upload, Image } from "antd";
import { DownloadOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;
import style from "./style.less";
import moment from 'moment'
import 'moment/locale/zh-cn';
import DetailTools from '../components/detailTools';
import { parseToThousandth } from '@/utils/date';
moment.locale('zh-cn')


const detailMarketing = (props) => {
  let { dispatch, location, palanceDetailPut } = props;
  let [detailInfo, setDetailInfo] = useState(location.state && location.state.orderDetailInfo || ''); // 上一个页面传递过来的detailInfo数据

  useEffect(() => {
    queryPutBalanceDetail();
  }, [])
  // 查询详情数据
  let queryPutBalanceDetail = (objectIds) => {
    dispatch({
      type: 'billSettlementReconciliationModel/queryPalanceDetailPut',
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
        <Col span={6}></Col>
        <Col span={12} className={style.col_item}>
          <div className={style.detail_item}>
            <div className={style.col_item_left_title}>卡券编号/卡包编号<span className={style.color_fsz1}>{palanceDetailPut.cardId || ''}</span></div>
            <Row className={style.detail_row}>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>基础卡券/卡包编号</div>
                <div className={style.color_fsz1}>{palanceDetailPut.couponSkuNo || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>卡券/卡包标题</div>
                <div className={style.color_fsz1}>{palanceDetailPut.couponSkuName || ''}5</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>投放类型</div>
                <div className={style.color_fsz1}>{palanceDetailPut.couponPackageFlagName || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>卡券种类</div>
                <div className={style.color_fsz1}>{palanceDetailPut.discountsNmae || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>卡券品类</div>
                <div className={style.color_fsz1}>{palanceDetailPut.couponCategoryName || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>面值</div>
                <div className={style.color_fsz1}>{ parseToThousandth(parseFloat(palanceDetailPut.faceValueStr)) || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>获取来源</div>
                <div className={style.color_fsz1}>{palanceDetailPut.deliveryMethodName || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>所属项目</div>
                <div className={style.color_fsz1}>{palanceDetailPut.marketProjectName || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>卡包标识</div>
                <div className={style.color_fsz1}>{palanceDetailPut.couponPackageFlagName || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>首赠人身份证</div>
                <div className={style.color_fsz1}>{palanceDetailPut.recipientIdentityNo || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>首赠人手机号</div>
                <div className={style.color_fsz1}>{palanceDetailPut.recipientPhone || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>门店名称</div>
                <div className={style.color_fsz1}>{palanceDetailPut.storeName || ''}</div>
              </Col>
            </Row>
          </div>
          <div className={style.detail_item}>
            <div className={style.col_item_left_title}>用户信息</div>
            <Row className={style.detail_row}>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>用户名称</div>
                <div className={style.color_fsz1}>{palanceDetailPut.customerName || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>用户手机号</div>
                <div className={style.color_fsz1}>{palanceDetailPut.customerPhone || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>用户身份证号</div>
                <div className={style.color_fsz1}>{palanceDetailPut.customerIdentityNo || ''}</div>
              </Col>
            </Row>
          </div>
          <div className={style.detail_item}>
            <div className={style.col_item_left_title}>结算信息</div>
            <Row className={style.detail_row}>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>结算状态</div>
                <div className={style.color_fsz1}>{palanceDetailPut.billFlagName || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>结算节点</div>
                <div className={style.color_fsz1}>{palanceDetailPut.balanceNodeName || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>结算节点时间</div>
                <div className={style.color_fsz1}>{palanceDetailPut.balanceNodeTimeStr || ''}</div>
              </Col>
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>结算金额(元)</div>
                <div className={style.color_fsz1}>{ parseToThousandth(parseFloat(palanceDetailPut.balanceAmountStr)) || ''}</div>
              </Col>
              {
                palanceDetailPut.billFlag == 5 ?
                  <Col span={8} className={style.detail_col}>
                    <div className={style.title_fsz2}>不结算原因</div>
                    <div className={style.color_fsz1}>{palanceDetailPut.noBalanceReason || ''}</div>
                  </Col> : null
              }
              <Col span={8} className={style.detail_col}>
                <div className={style.title_fsz2}>异议原因</div>
                <div className={style.color_fsz1}>{palanceDetailPut.objectionReason || ''}</div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={6}></Col>
      </Row>
      {/* 底部按钮 */}
      <DetailTools factBalanceDetail={palanceDetailPut} queryFactBalanceDetail={queryPutBalanceDetail}></DetailTools>
    </div>
  )
}


export default connect(({ billSettlementReconciliationModel }) => ({
  palanceDetailPut: billSettlementReconciliationModel.palanceDetailPut
}))(detailMarketing)