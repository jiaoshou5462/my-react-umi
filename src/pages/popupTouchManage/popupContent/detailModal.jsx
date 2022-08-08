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
const detailModal = (props) => {
  let { dispatch, sonListVisible, closeModal, currentInfo, detailRecord, contentRecord } = props;
  let [form] = Form.useForm();
  // console.log(currentInfo, 'currentInfo')

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [payload, setPayload] = useState({});
  useEffect(() => {
    getDetailPopupContentRecordId()
  }, [])

  useEffect(() => {
    getDetailPopupContentRecord()
  }, [current, pageSize, payload])

  const getDetailPopupContentRecord = () => {
    dispatch({
      type: 'popupContentManage/getDetailPopupContentRecord',//查看弹窗内容详情(查看数据信息)
      payload: {
        method: 'postJSON',
        params: {
          pageNum: current,
          pageSize: pageSize,//0卡券，1卡包
          query: {
            id: currentInfo.id
          }
        }
      }
    })
  }
  const getDetailPopupContentRecordId = () => {
    dispatch({
      type: 'popupContentManage/getDetailPopupContentRecordId',//查看弹窗内容详情(查看任务明细)
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
        visible={sonListVisible}
        onCancel={() => { closeModal() }}
        footer={[
          <Button key="close" onClick={() => { closeModal() }}>
            关闭
          </Button>
        ]}
      >
        <>
          <h3 style={{ marginBottom: '20px' }}>内容详情</h3>
          <Descriptions column={3} labelStyle={{ marginLeft: '50px' }}>
            <Descriptions.Item label="内容ID">{detailRecord.id}</Descriptions.Item>
            <Descriptions.Item label="内容名称">{detailRecord.contentName}</Descriptions.Item>
            <Descriptions.Item label="内容类型">{detailRecord.contentTypeStr}</Descriptions.Item>
          </Descriptions>
          <Descriptions column={3} labelStyle={{ marginLeft: '50px' }}>
            <Descriptions.Item label="内容状态">
              <Badge status={
                detailRecord.contentStatus == 1 ? 'error' :
                  detailRecord.contentStatus == 2 ? 'success' : 'default'}
              />
              {detailRecord.contentStatusStr}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">{detailRecord.updateTime}</Descriptions.Item>
            <Descriptions.Item label="操作人">{detailRecord.updateUser}</Descriptions.Item>
          </Descriptions>
          <Descriptions column={3} labelStyle={{ marginLeft: '50px' }}>
            <Descriptions.Item label="备注">{detailRecord.remark}</Descriptions.Item>
          </Descriptions>

          <h3 style={{ margin: '20px 0' }}>调用记录</h3>
          <Table
            dataSource={contentRecord && contentRecord.list}
            onChange={handleTableChange}
            pagination={{
              current: current,
              pageSize: pageSize,
              total: contentRecord && contentRecord.total,
              showTotal: (total) => {
                let totalPage = Math.ceil(total / pageSize);
                return `共${total}条记录 第 ${current} / ${totalPage}  页`
              }
            }}
          >
            <Column title="弹窗名称" dataIndex="popupName" key="popupName" />
            <Column title="弹窗页面" dataIndex="popupPageName" key="popupPageName" />
            <Column title="调用时间" dataIndex="callTime" key="callTime" />
            <Column title="曝光数" dataIndex="exposureNumber" key="exposureNumber" />
            <Column title="点击人次" dataIndex="clickHitNumber" key="clickHitNumber" />
            <Column title="点击人数" dataIndex="clickNumber" key="clickNumber" />
            <Column title="点击率" dataIndex="clickRate" key="clickRate" align="center"
              render={(text, all) => fmoney(text * 100) + ' % '}
            />
          </Table>
        </>
      </Modal>
    </>
  )
}


export default connect(({ popupContentManage }) => ({
  detailRecord: popupContentManage.detailRecord,
  contentRecord: popupContentManage.contentRecord

}))(detailModal)