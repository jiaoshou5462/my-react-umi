import React, { useState, useEffect, useRef, useContext } from 'react';
import { connect, history } from 'umi';
import {
  Row, Col, Form, Space, Badge, Input, Table, Select, Divider, Button, DatePicker,
  Descriptions, Modal, message, InputNumber
} from "antd"
import moment from 'moment'
import style from './modalStyle.less';
import { parseToThousandth, fmoney } from '@/utils/date';

const { TextArea } = Input;
const { Column } = Table;
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;

//列表详情弹框
const directionalDetail = (props) => {
  let { dispatch, detailVisible, closeModal, currentInfo, detailData } = props;
  let [form] = Form.useForm();

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [payload, setPayload] = useState({});
  useEffect(() => {
    getDetailId()
  }, [])

  const getDetailId = () => {
    dispatch({
      type: 'directionalPopupManage/getDetailId',//详情
      payload: {
        method: 'get',
        params: {},
        id: currentInfo.id,
      }
    })
  }
  // 有效期处理
  const effectDateType = (text, all) => {
    return <>
      {
        all.effectDateType == 0 && all.receiveEffectDays == 0 ?
          <span>{all.effectiveDays}天（领取后立即生效）</span>
          :
          all.effectDateType == 0 && all.receiveEffectDays ?
            <span>{all.effectiveDays}天（领取后第 {all.receiveEffectDays} 天生效）</span>
            :
            all.effectDateType == 1 ?
              <span>{moment(all.effectStartDate).format('YYYY.MM.DD')}~{moment(all.effectEndDate).format('YYYY.MM.DD')}</span>
              :
              all.effectDateType == 2 ?
                <span>以保单时间为准</span>
                : ''
      }
    </>
  }

  //分页切换
  const handleTableChange = (val) => {
    setCurrent(val.current)
    setPageSize(val.pageSize)
  }
  return (
    <>
      <Modal
        title="内容详情"
        width={'90%'}
        centered
        visible={detailVisible}
        onCancel={() => { closeModal() }}
        footer={[
          <Button key="close" onClick={() => { closeModal() }}>
            关闭
          </Button>
        ]}
      >
        <>
          <h3 style={{ marginBottom: '20px' }}>基础信息</h3>
          <Descriptions column={3} labelStyle={{ marginLeft: '50px' }}>
            <Descriptions.Item label="弹窗ID">{detailData.id}</Descriptions.Item>
            <Descriptions.Item label="弹窗名称">{detailData.popupName}</Descriptions.Item>
            <Descriptions.Item label="弹窗页面">{detailData.popupPageName}</Descriptions.Item>
          </Descriptions>
          <Descriptions column={3} labelStyle={{ marginLeft: '50px' }}>
            <Descriptions.Item label="内容名称">{detailData.popupContentName}</Descriptions.Item>
            <Descriptions.Item label="内容类型">{detailData.popupContentTypeStr}</Descriptions.Item>
            <Descriptions.Item label="弹窗状态">
              <Badge status={
                detailData.popupStatus == 1 ? 'error' :
                  detailData.popupStatus == 2 ? 'success' :
                    detailData.popupStatus == 4 ? 'warning' : 'default'}
              />
              {
                detailData.popupStatus == 1 ? '未启用' :
                  detailData.popupStatus == 2 ? '已启用' :
                    detailData.popupStatus == 4 ? '已停用' : ''
              }
            </Descriptions.Item>
          </Descriptions>
          <Descriptions column={3} labelStyle={{ marginLeft: '50px' }}>
            <Descriptions.Item label="弹窗时间">{detailData.startTime} - {detailData.endTime}</Descriptions.Item>
            <Descriptions.Item label="操作人">{detailData.updateUser}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{detailData.updateTime}</Descriptions.Item>
          </Descriptions>
          <Descriptions column={3} labelStyle={{ marginLeft: '50px' }}>
            <Descriptions.Item label="备注">{detailData.remark}</Descriptions.Item>
          </Descriptions>

          <h3 style={{ margin: '20px 0' }}>弹窗数据</h3>
          <Descriptions column={4} labelStyle={{ marginLeft: '50px' }}>
            <Descriptions.Item label="曝光数">{detailData.data && parseToThousandth(detailData.data.exposureNumber)}</Descriptions.Item>
            <Descriptions.Item label="点击人次">{detailData.data && parseToThousandth(detailData.data.clickHitNumber)}</Descriptions.Item>
            <Descriptions.Item label="点击人数">{detailData.data && parseToThousandth(detailData.data.clickNumber)}</Descriptions.Item>
            <Descriptions.Item label="点击率">{detailData.data ? fmoney(detailData.data.clickRate * 100) + ' % ' : ''}</Descriptions.Item>
          </Descriptions>
        </>
      </Modal>
    </>
  )
}


export default connect(({ directionalPopupManage }) => ({
  detailData: directionalPopupManage.detailData,
}))(directionalDetail)