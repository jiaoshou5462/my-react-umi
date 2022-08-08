import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {
  Row,
  Col,
  Form,
  Space,
  Input,
  Table,
  Select,
  Button,
  message,
  Pagination,
  ConfigProvider,
  DatePicker
} from "antd"
import style from "./style.less"
const { Option } = Select
const { RangePicker } = DatePicker
import { QueryFilter } from '@ant-design/pro-form';
import {
  ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,
} from "@/components/commonComp/index";
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn');
const { Column } = Table;
/*订单类型*/
let orderTypeArr = [{
  id: 1,
  title: '点击'
}, {
  id: 2,
  title: '购买'
},]
/*订单来源*/
let orderSourceArr = [{
  id: 1,
  title: '销售转发'
}, {
  id: 2,
  title: '保险超市'
}, {
  id: 3,
  title: '模板消息'
}, {
  id: 4,
  title: '推广弹窗'
}, {
  id: 5,
  title: '用户分享'
}, {
  id: 6,
  title: '广告位'
}, {
  id: 7,
  title: '默认来源'
}, {
  id: 8,
  title: '推文'
},]
const productOrderListPage = (props) => {
  let { dispatch, pageTotal, list, listData } = props,
    [form] = Form.useForm(),
    [createTime, setCreateTime] = useState([moment().subtract(30, 'days'), moment()]), //默认时间
    [channelId, setChannelId] = useState(localStorage.getItem('tokenObj') && JSON.parse(localStorage.getItem('tokenObj')).channelId || ''),
    [pageSize, setPageSize] = useState(10),
    [pageNo, setPage] = useState(1),
    [payload, setPayload] = useState({
      createTimeStart: createTime && createTime[0].format('YYYY-MM-DD'),
      createTimeEnd: createTime && createTime[1].format('YYYY-MM-DD'),
      channelId,
      pageInfo: {
        pageNo,
        pageSize,
      }
    })
  let [checkDate, setCheckDate] = useState([]) //选中时间时的数据，做限制处理

  /*回调*/
  useEffect(() => {
    form.setFieldsValue({
      createTime
    })
    if (channelId) {
      getList()
    }
  }, [payload])

  /*获取列表*/
  let getList = () => {
    dispatch({
      type: 'productOrderList/getList',
      payload: {
        method: 'postJSON',
        params: payload
      },
    })
  }

  let renderColumns = () => {
    return (
      [{
        title: '订单号',
        dataIndex: 'orderNo',
        width: 180,
        align: 'left',
        fixed: 'left',
        render: (name) => {
          return <span>{name ? name : '-'}</span>
        },
      }, {
        title: '用户openid',
        width: 200,
        align: 'left',
        dataIndex: 'openId',
        render: (name) => {
          return <span>{name ? name : '-'}</span>
        },
      }, {
        title: '产品分类',
        width: 150,
        align: 'left',
        dataIndex: 'productType',
        render: (name) => {
          return <span>{name ? name : '-'}</span>
        },
      }, {
        title: '产品名称',
        width: 230,
        align: 'left',
        dataIndex: 'productName',
        render: (name) => {
          return <span>{name ? name : '-'}</span>
        },
      }, {
        title: '手机号',
        width: 180,
        align: 'left',
        dataIndex: 'phoneNo',
        render: (name) => {
          return <span>{name ? name : '-'}</span>
        },
      }, {
        title: '产品售价',
        width: 150,
        dataIndex: 'productPrice',
        align: 'right',
        render: (productPrice) => {
          return <MoneyFormat>{productPrice || 0}</MoneyFormat>
        }
      }, {
        title: '订单类型',
        width: 150,
        align: 'left',
        dataIndex: 'orderType',
        render: (orderType, record) => onRenderTag(orderType, 1)
      }, {
        title: '来源',
        width: 150,
        align: 'left',
        dataIndex: 'orderSource',
        render: (orderSource) => onRenderTag(orderSource, 2)
      }, {
        title: '创建时间',
        width: 180,
        align: 'left',
        dataIndex: 'createTime',
        render: (text) => {
          return <ListTableTime>{moment(text).format('YYYY-MM-DD HH:mm')}</ListTableTime>
        }
      }]
    )
  }
  let onRenderTag = (orderFlag, type) => {
    let tagName = null;
    if (type === 1) {
      if (orderFlag === 1) {
        tagName = <TypeTags>点击</TypeTags>;
      }
      if (orderFlag === 2) {
        tagName = <TypeTags type="red">购买</TypeTags>
      }

    }
    if (type === 2) {
      if (orderFlag === 1) {
        // tagName=<TypeTags>销售转发</TypeTags>;
        tagName = <span>销售转发</span>;
      }
      if (orderFlag === 2) {
        // tagName=<TypeTags type="red">保险超市</TypeTags>
        tagName = <span>保险超市</span>;
      }
      if (orderFlag === 3) {
        // tagName=<TypeTags type="orange">模板消息</TypeTags>
        tagName = <span>模板消息</span>;
      }
      if (orderFlag === 4) {
        // tagName=<TypeTags type="yellow">推广弹窗</TypeTags>
        tagName = <span>推广弹窗</span>;
      }
      if (orderFlag === 5) {
        // tagName=<TypeTags type="purple">用户分享</TypeTags>
        tagName = <span>用户分享</span>;
      }
      if (orderFlag === 6) {
        // tagName=<TypeTags type="green">广告位</TypeTags>
        tagName = <span>广告位</span>;
      }
      if (orderFlag === 7) {
        // tagName=<TypeTags type="indigo">默认来源</TypeTags>
        tagName = <span>默认来源</span>;
      }
      if (orderFlag === 8) {
        // tagName=<TypeTags type="blue">推文</TypeTags>
        tagName = <span>推文</span>;
      }
    }
    return tagName;
  }
  /*清空内容*/
  let onReset = () => {
    form.resetFields()
    let createTimeEnd = createTime ? moment(createTime[1]).endOf('day').format('YYYY-MM-DD') : null
    let createTimeStart = createTime ? moment(createTime[0]).startOf('day').format('YYYY-MM-DD') : null
    let data = {
      channelId,
      createTimeEnd,
      createTimeStart,
      pageInfo: {
        pageSize,
        pageNo: 1,
      }
    }
    setPage(1)
    setPayload(data)
  }
  /*搜索按钮*/
  let onSearch = (e) => {
    if (!e.createTime) {
      message.info('请选择创建时间')
      return
    }
    let createTimeEnd = e.createTime ? moment(e.createTime[1]).endOf('day').format('YYYY-MM-DD') : null
    let createTimeStart = e.createTime ? moment(e.createTime[0]).startOf('day').format('YYYY-MM-DD') : null
    let data = {
      ...e,
      channelId,
      createTimeEnd,
      createTimeStart,
      pageInfo: {
        pageSize,
        pageNo: 1,
      }
    }
    setPage(1)
    setPayload(data)
  }

  const pageChange = (page, pageSize) => {
    let payloads = JSON.parse(JSON.stringify(payload));
    payloads.pageInfo.pageNo = page;
    payloads.pageInfo.pageSize = pageSize;
    setPage(page);
    setPageSize(pageSize);
    setPayload({ ...payloads });
  }

  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) => {
    payload.pageInfo.pageNo = page
    setPayload(payload)
    setPage(page)
    setPageSize(pageSize)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    payload.pageInfo.pageNo = page
    payload.pageInfo.pageSize = pageSize
    setPage(page)
    setPageSize(pageSize)
    setPayload(payload)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNo} / ${totalPage}  页`
  }
  /* 时间*/
  let onTimeChange = (e) => {
    setCreateTime(e)
  }
  /* 选中时间时*/
  let onCalendarChange = (e) => {
    setCheckDate(e)
  }
  /*限制日期只能选择30天*/
  let onDisabledDate = (current) => {
    if (!checkDate || checkDate.length === 0) {
      return false
    }
    let start = ''
    let end = ''
    if (checkDate[0]) {
      let startTime = checkDate[0]
      start = startTime && startTime.format("YYYY-MM-DD") > current.format("YYYY-MM-DD")
      end = startTime && moment(startTime).add(30, 'days').format("YYYY-MM-DD") < current.format("YYYY-MM-DD")
    }
    if (checkDate[1]) {
      let endTime = checkDate[1]
      end = endTime && endTime.format("YYYY-MM-DD") < current.format("YYYY-MM-DD")
      start = endTime && moment(endTime).subtract(30, 'days').format("YYYY-MM-DD") > current.format("YYYY-MM-DD")
    }
    return start || end
  }
  return (
    <div>
      <div className={style.block__cont}>
        <QueryFilter className={style.form__cont} form={form} defaultCollapsed onFinish={onSearch} onReset={onReset}>
          <Form.Item label="订单号：" name="orderNo" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="手机号：" name="phoneNo" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="openId：" name="openId" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="订单类型：" name="orderType" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限" allowClear>
              {
                orderTypeArr.map((item, key) => {
                  return <Option key={key} value={item.id}>{item.title}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="订单来源：" name="orderSource" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限" allowClear>
              {
                orderSourceArr.map((item, key) => {
                  return <Option key={key} value={item.id}>{item.title}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="创建时间：" name="createTime" labelCol={{ flex: '0 0 120px' }}>
            <RangePicker
              locale={locale}
              style={{ width: '100%' }}
              onChange={onTimeChange}
              disabledDate={onDisabledDate}
              onCalendarChange={onCalendarChange}
              placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>
        </QueryFilter>
      </div>
      <div className={style.block__cont__t}>
        <ListTitle titleName="结果列表">
          <Space size={8}>

          </Space>
        </ListTitle>
        <ListTips>
          <span>
            {listData.coutDataStart} ~ {listData.coutDataEnd} 期间共产生点击记录 {listData.clicksNm} 条，购买记录 {listData.buysNm} 条
          </span>
        </ListTips>
        <ListTable showPagination current={pageNo} pageSize={pageSize} total={pageTotal}
          onChange={pageChange}
        >
          <Table columns={renderColumns()} dataSource={list} scroll={{ x: 1200 }} pagination={false} />
        </ListTable>

      </div>
    </div>
  )
};
export default connect(({ productOrderList }) => ({
  ...productOrderList
}))(productOrderListPage)
