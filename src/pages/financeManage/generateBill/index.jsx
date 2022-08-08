import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Tag, Row, Col, Form, Space, Input, Table, Select, Button, Pagination, Modal, ConfigProvider, message, DatePicker } from "antd"
import style from "./style.less";
import moment from 'moment';
import { getMonthRange } from '@/utils/date'
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
import { QueryFilter } from '@ant-design/pro-form';

import {
  ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,
} from "@/components/commonComp/index";

// 结算对账
const generateBillation = (props) => {
  let { dispatch, settlementList, querySelect, location } = props;
  let [channelBillInfo, setChannelBillInfo] = useState(location.state && location.state.info || '');
  let [form] = Form.useForm();
  const [callList, setCallList] = useState(false);
  const [resetFormInfo, setResetFormInfo] = useState(false);

  useEffect(() => {
    /**
     * 查询参数 有值取值， 没值取前三个月跨度最大为12个月
     * */
    savaQuery({});
    if (Object.values(querySelect).length > 0) {
      form.setFieldsValue({
        ...querySelect
      })
    } else {
      if (channelBillInfo.orderType == 1) {
        form.setFieldsValue({
          date: [moment(channelBillInfo.startYearMonth), moment(channelBillInfo.endYearMonth)]
        })
      } else {
        let threeMonths = moment(new Date()).subtract(2, 'months').format('YYYY-MM');// 当前月份的前三个月
        let startDay = moment().startOf('month').format('YYYY-MM');// 当前月份
        form.setFieldsValue({
          date: [moment(threeMonths), moment(startDay)]
        })
      }
    }
  }, [resetFormInfo])

  useEffect(() => {
    querySettlementList();
  }, [callList])


  // 列表查询
  let querySettlementList = () => {
    let info = form.getFieldValue();
    let query = JSON.parse(JSON.stringify(info));
    query.channelId = JSON.parse(localStorage.getItem('tokenObj')).channelId;
    if (query.date) {
      query.timeStart = moment(query.date[0]).format('YYYY-MM');
      query.timeEnd = moment(query.date[1]).format('YYYY-MM');
    }
    delete query.date
    query.queryFlag = 1;
    dispatch({
      type: 'billSettlementReconciliationModel/querySettlementList',
      payload: {
        method: 'postJSON',
        params: {
          ...query
        },
      },
    });
  }
  // 搜索
  let searchBtn = (val) => {
    if (!val.date || getMonthRange(val.date[0], val.date[1]) > 11) return message.warning('结算时间跨度不能超过12个月!'); // 传入年月日去判断  大于12个月给出提示;
    setCallList(!callList)
  };
  // 重置
  let resetBtn = () => {
    form.resetFields();
    setResetFormInfo(!resetFormInfo)
    setCallList(!callList)
  };
  //账单明细
  let realColumns = [
    { title: '结算时间', dataIndex: 'dateStr', key: 'dateStr' },
    { title: '订单分类', dataIndex: 'orderTypeName', key: 'orderTypeName', render: (orderTypeName, record) => <TypeTags color={record.orderType==7? '#FF724D' : '#2FB6E4'}>{orderTypeName}</TypeTags> },
    { title: '已确认/待生成账单(笔)', dataIndex: 'customerConfirmedCount', key: 'customerConfirmedCount', render: (customerConfirmedCount, record) => renderTransactions(customerConfirmedCount, record, 4) },
    { title: '已生成账单(笔)', dataIndex: 'inBillCount', key: 'inBillCount', render: (inBillCount, record) => renderTransactions(inBillCount, record, 1) },
  ];
  // 根据年月动态查询最后一天添加并返回
  let mGetDate = (time) => {
    let date = new Date(time);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let d = new Date(year, month, 0);
    return d.getDate();
  }
  // 此方法用于搜索条件回显时bug
  let orderListQuery = (queryInfo) => {
    dispatch({
      type: 'billSettlementReconciliationModel/saveQuerySelect',
      payload: {
        queryInfo,
      },
    });
  }
  // 笔数render
  let renderTransactions = (typeName, record, value) => {
    let hrefOrder = () => {
      let formValue = form.getFieldValue();
      let info = JSON.parse(JSON.stringify(formValue));
      savaQuery(formValue);
      if (info.date) {
        info.startTime = moment(info.date[0]).format('YYYY-MM-DD');
        info.endTime = moment(info.date[1]).format('YYYY-MM');
        let endTimes = mGetDate(info.endTime);
        info.endTime = `${info.endTime}-${endTimes}`;
      }
      orderListQuery({})
      let orderInfo = { value, ...info, ...record }
      history.push({ pathname: '/financeManage/billSettlementReconciliation/orderList', state: { orderInfo } })
    }
    return <span className={style.click_blue} onClick={() => { hrefOrder() }}>{typeName}</span>
  }
  // 订单分类
  let orderTypeList = [
    { value: 1, name: '场景服务-道路救援' },
    { value: 2, name: '场景服务-代驾服务' },
    { value: 3, name: '场景服务-代办年检' },
    { value: 4, name: '场景服务-事故代步车' },
    { value: 5, name: '场景服务-安全检测' },
    { value: 6, name: '场景服务-轮胎存换' },
    { value: 7, name: '营销投放' },
  ]
  // 保存查询参数到state中，用于返回页面时回显
  let savaQuery = (queryInfo) => {
    dispatch({
      type: 'billSettlementReconciliationModel/querySelect',
      payload: {
        queryInfo,
      },
    });
  }

  return (
    <>
      <div className={style.block__cont}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtn} onReset={resetBtn}>
          <Form.Item name="date" label="结算时间" labelCol={{ flex: '0 0 120px' }}>
            <RangePicker style={{ width: '100%' }} picker="month" placeholder={['开始月份', '结束月份']} />
          </Form.Item>
          <Form.Item name="orderType" label='订单分类' labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="订单分类" allowClear>
              {
                orderTypeList.map(v => <Option value={v.value}>{v.name}</Option>)
              }
            </Select>
          </Form.Item>
        </QueryFilter>
      </div>
      <div className={`${style.block__cont} ${style.form__cont}`}>
        <ListTable showPagination={false}>
          <Table columns={realColumns} dataSource={settlementList} scroll={{ x: 1200 }} pagination={false} />
        </ListTable>
      </div>
    </>
  )
}


export default connect(({ billSettlementReconciliationModel, generateBill }) => ({
  settlementList: billSettlementReconciliationModel.settlementList,
  querySelect: billSettlementReconciliationModel.querySelect,
}))(generateBillation)