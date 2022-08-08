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
  Pagination,
  ConfigProvider,
  DatePicker
} from "antd"
const { Column } = Table;
import style from "./style.less"
const { Option } = Select
const { RangePicker } = DatePicker
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const { Search } = Input
let statusArr = [{
  id: 1,
  title: '充值中'
}, {
  id: 2,
  title: '充值失败'
}, {
  id: 3,
  title: '已完成'
}, {
  id: 4,
  title: '已取消'
}, {
  id: 5,
  title: '待支付'
}]
let cardTypeArr = [{
  id: 1,
  title: '中石化'
}, {
  id: 2,
  title: '中石油'
}]
let productArr = [{
  id: 1,
  title: '50元加油卡'
}, {
  id: 2,
  title: '100元加油卡'
}, {
  id: 3,
  title: '200元加油卡'
}, {
  id: 4,
  title: '500元加油卡'
}, {
  id: 5,
  title: '1000元加油卡'
}]
const rechargeCardOrderListPage = (props) => {
  let { dispatch, listInfo, list,providerList} = props,
    [form] = Form.useForm(),
    [pageSize, setPageSize] = useState(10),
    [channelId, setChannelId] = useState(localStorage.getItem('tokenObj') && JSON.parse(localStorage.getItem('tokenObj')).channelId || ''),
    [pageNo, setPage] = useState(1),
    [orderType, setorderType] = useState(9),
    [payload, setPayload] = useState({
      orderType,
      channelId,
      pageInfo: {
        pageNo,
        pageSize,
      }
    })

    useEffect(() => {
      dispatch({
        type: 'orderPublic/getProviderList',
        payload: {
          method: 'postJSON',
          params: {}
        },
      })
    }, [])
    /*回调*/
    useEffect(()=>{
      if(channelId){
        getList()
      }
    },[pageNo, pageSize, payload])
    /*获取列表*/
    let getList = () => {
      dispatch({
        type: 'rechargeCardOrderList/getList',
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
        align: 'center',
        fixed: 'left',
      },  {
        title: '供应商',
        align: 'center',
        dataIndex: 'providerName',
      }, {
        title: '订单状态',
        align: 'center',
        dataIndex: 'orderStatusName',
      }, {
        title: '车主电话',
        align: 'center',
        dataIndex: 'oilPhone',
      }, {
        title: '卡号种类',
        align: 'center',
        dataIndex: 'oilCardName',
      }, {
        title: '充值卡号',
        align: 'center',
        dataIndex: 'oilCardNo',
      }, {
        title: '手机号',
        align: 'center',
        dataIndex: 'oilPhone',
      }, {
        title: '下单时间',
        align: 'center',
        dataIndex: 'createTime',
      }, {
        title: '产品名称',
        align: 'center',
        dataIndex: 'productName',
      }, {
        title: '操作',
        align: 'center',
        fixed: 'right',
        dataIndex: 'objectId1',
        render: (objectId1) => operateRender(objectId1)
      }]
    )
  } 


  /*操作*/
  let operateRender = (objectId) => {
    /*跳转详情*/
    let goToDetail = () => {
      history.push({
        pathname: '/order/rechargeCardOrder/list/detail',
        state: {
          objectId
        }
      })
    }
    return <span className={style.click_blue} onClick={goToDetail}>查看</span>
  }

  /*清空内容*/
  let resetBtnEvent = () => {
    form.resetFields()
    let data = {
      channelId,
      orderType,
      pageInfo: {
        pageSize,
        pageNo: 1,
      }
    }
    setPage(1)
    setPayload(data)
  }
  /*搜索按钮*/
  let searchBtnEvent = (e) => {
    //下单时间
    let createTimeEnd = e.createTime ? moment(e.createTime[1]).endOf('day').format('YYYY-MM-DD')  : null
    let createTimeStart = e.createTime ? moment(e.createTime[0]).startOf('day').format('YYYY-MM-DD')  : null
    let data = {
      ...e,
      channelId,
      orderType,
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

  return (
    <div>
      <div className={style.block__cont}>
        <Form className={style.form__cont} form={form} onFinish={searchBtnEvent}>
          <Row>
            <Col span={8}>
              <Form.Item label="订单号：" name="orderNo" labelCol={{ flex: '0 0 120px' }}>
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="订单状态：" name="orderStatus" labelCol={{ flex: '0 0 120px' }}>
                <Select placeholder="不限" allowClear>
                  {
                    statusArr.map((item, key) => {
                      return <Option key={key} value={item.id}>{item.title}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="充值卡号：" name="oilCardNo" labelCol={{ flex: '0 0 120px' }}>
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="下单时间：" name="createTime" labelCol={{flex: '0 0 120px'}}>
                <RangePicker
                    allowClear
                    locale={locale}
                    style={{width: '100%'}}
                    placeholder={['开始时间', '结束时间']}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="车主手机号：" name="customerPhone" labelCol={{ flex: '0 0 120px' }}>
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="卡号种类：" name="oilCardType" labelCol={{ flex: '0 0 120px' }}>
                <Select placeholder="不限" allowClear>
                  {
                    cardTypeArr.map((item, key) => {
                      return <Option key={key} value={item.id}>{item.title}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="产品名称：" name="productName" labelCol={{ flex: '0 0 120px' }}>
                <Select placeholder="不限" allowClear>
                  {
                    productArr.map((item, key) => {
                      return <Option key={key} value={item.title}>{item.title}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="供应商：" name="providerId" labelCol={{flex: '0 0 120px'}}>
                <Select
                    showSearch
                    allowClear
                    notFoundContent='暂无数据'
                    placeholder="输入供应商可筛选"
                    optionFilterProp="children"
                >
                  {
                    providerList.map((item, key) => {
                      return <Option key={key} value={item.providerId}>{item.providerName}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Space size={22}>
              <Button htmlType="button" onClick={resetBtnEvent}>重置</Button>
              <Button htmlType="submit" type="primary">查询</Button>
            </Space>
          </Row>
        </Form>
      </div>
      <div className={style.block__cont__t}>
        <div className={style.block__header}>结果列表</div>
        <div className={style.list_box}>
          <Table
            locale={{ emptyText: '暂无数据' }}
            columns={renderColumns()}
            dataSource={list}
            pagination={false}
            scroll={{
              x: 800
            }}
            loading={{
              spinning: false,
              delay: 500
            }}
          />
          <ConfigProvider locale={zh_CN}>
            <Pagination
              className={style.pagination}
              showQuickJumper
              showTitle={false}
              current={pageNo}
              defaultPageSize={pageSize}
              total={listInfo.totalCount}
              onChange={onNextChange}
              pageSizeOptions={['10', '20', '30', '60']}
              onShowSizeChange={onSizeChange}
              showTotal={onPageTotal}
            />
          </ConfigProvider>
        </div>
      </div>
    </div>
  )
};
export default connect(({ rechargeCardOrderList, orderPublic}) => ({
  list: rechargeCardOrderList.list,
  listInfo: rechargeCardOrderList.listInfo,
  providerList: orderPublic.providerList
}))(rechargeCardOrderListPage)
