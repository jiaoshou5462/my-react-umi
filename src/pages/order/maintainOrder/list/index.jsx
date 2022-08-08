import React,{useEffect, useState} from "react"
import { connect,history } from 'umi'
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
import style from "./style.less"
const { Option } = Select
const { RangePicker } = DatePicker
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const { Search } = Input
/*状态*/
let statusArr = [{
  id: '1',
  title: '预约中'
},{
  id: '2',
  title: '预约完成'
},{
  id: '3',
  title: '已到店'
},{
  id: '5',
  title: '服务完成'
},{
  id: '6',
  title: '服务取消'
},{
  id: '7',
  title: '待支付'
},{
  id: '8',
  title: '已失效'
}]

/*服务项目*/
let orderTypeArr = [{
  id: '3',
  title: '普通洗车'
},{
  id: '29',
  title: '精细洗车'
}]

/*用户反馈*/
let assessmentResultArr = [{
  id: '2',
  title: '好评'
},{
  id: '3',
  title: '中评'
},{
  id: '4',
  title: '差评'
}]
const maintainOrderListPage =(props)=>{
  let {dispatch, pageTotal, list, providerList, reserveStoreList,
        reserveStoreTotal, actualStoreList, actualStoreTotal} = props,
    [form] = Form.useForm(),
    [channelId, setChannelId] = useState(localStorage.getItem('tokenObj') && JSON.parse(localStorage.getItem('tokenObj')).channelId || ''),
    [pageSize, setPageSize] = useState(10),
    [pageNo, setPage] = useState(1),
    [payload, setPayload] = useState({
      channelId,
      pageInfo: {
        pageNo,
        pageSize,
      }
    }),
    [storePageSize, setStorePageSize] = useState(30), //门店size
    [reserveStorePageNo, setReserveStorePage] = useState(1), //预约门店页数
    [reserveStorePageInfo, setReserveStorePageInfo] = useState({
      pageInfo: {
        pageSize: storePageSize,
        pageNo: reserveStorePageNo,
      }
    }), //预约门店page
    [actualStorePageNo, setActualStorePage] = useState(1), //实际门店页数
    [actualStorePageInfo, setActualStorePageInfo] = useState({
      pageInfo: {
        pageSize: storePageSize,
        pageNo: actualStorePageNo,
      }
    }) //实际门店page
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
  },[pageNo, pageSize, payload, channelId])
  /*获取列表*/
  let getList = () => {
    dispatch({
      type: 'maintainOrderList/getList',
      payload: {
        method: 'postJSON',
        params: payload
      },
    })
  }
  useEffect(() => {
    getReserveStoreList() //预约
  },[reserveStorePageNo, reserveStorePageInfo])
  useEffect(() => {
    getActualStoreList() //实际
  },[actualStorePageNo, actualStorePageInfo])
  /*获取预约门店列表*/
  let getReserveStoreList = () => {
    dispatch({
      type: 'orderPublic/getReserveStoreList',
      payload: {
        method: 'postJSON',
        params: reserveStorePageInfo
      },
    })
  }
  /*获取实际门店列表*/
  let getActualStoreList = () => {
    dispatch({
      type: 'orderPublic/getActualStoreList',
      payload: {
        method: 'postJSON',
        params: actualStorePageInfo
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
        }, {
          title: '供应商',
          align: 'center',
          dataIndex: 'providerName',
        }, {
          title: '订单状态',
          align: 'center',
          dataIndex: 'orderStatusName',
        }, {
          title: '验证码',
          dataIndex: 'verifiyCode',
          align: 'center',
        }, {
          title: '车主姓名',
          dataIndex: 'customerName',
          align: 'center',
        },{
          title: '车主电话',
          dataIndex: 'customerPhone',
          align: 'center',
        }, {
          title: '下单时间',
          dataIndex: 'createTime',
          align: 'center',
        }, {
          title: '预约日期',
          dataIndex: 'bookTime',
          align: 'center',
        }, {
          title: '预约时段',
          dataIndex: 'bookTimePeriod',
          align: 'center',
        }, {
          title: '预约门店',
          dataIndex: 'bookLocationName',
          align: 'center',
        }, {
          title: '服务商订单号',
          dataIndex: 'outOrderNo',
          align: 'center',
        }, {
          title: '操作',
          align: 'center',
          fixed: 'right',
          dataIndex: 'objectId',
          render: (objectId) => operateRender(objectId)
        }]
    )
  }
  /*操作*/
  let operateRender = (objectId) => {
    /*跳转详情*/
    let goToDetail = () => {
      history.push({
        pathname: '/order/maintainOrder/list/detail',
        state: {
          objectId
        }
      })
    }
    return <span className={style.click_blue} onClick={goToDetail}>查看</span>
  }
  /*清空内容*/
  let resetBtnEvent = ()=> {
    form.resetFields();
    let data = {
      channelId,
      pageInfo: {
        pageSize,
        pageNo: 1,
      }
    }
    setPage(1)
    setPayload(data)
    onActualStoreSearch()
    onReserveStoreSearch()
  }
  /*搜索按钮*/
  let searchBtnEvent = (e)=>{
    //下单时间
    let createTimeEnd = e.createTime ? moment(e.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')  : null
    let createTimeStart = e.createTime ? moment(e.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')  : null
    //预约检测时间
    let bookTimeEnd = e.bookTime ? moment(e.bookTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')  : null
    let bookTimeStart = e.bookTime ? moment(e.bookTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')  : null
    //实际完成时间
    let actualTimeEnd = e.actualTime ? moment(e.actualTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')  : null
    let actualTimeStart = e.actualTime ? moment(e.actualTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')  : null
    let data = {
      ...e,
      channelId,
      bookTimeEnd,
      bookTimeStart,
      actualTimeEnd,
      actualTimeStart,
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
  let onNextChange = (page, pageSize) =>{
    payload.pageInfo.pageNo = page
    setPayload(payload)
    setPage(page)
    setPageSize(pageSize)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) =>{
    payload.pageInfo.pageNo = page
    payload.pageInfo.pageSize = pageSize
    setPage(page)
    setPageSize(pageSize)
    setPayload(payload)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) =>{
    let totalPage  = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNo} / ${totalPage}  页`
  }
  /*预约门店页数方法 点击下一页上一页*/
  let onReserveStoreNextChange = (page, pageSize) =>{
    reserveStorePageInfo.pageInfo.pageNo = page
    setReserveStorePage(page)
    setStorePageSize(pageSize)
    setReserveStorePageInfo(reserveStorePageInfo)
  }
  /*预约门店 搜索*/
  let onReserveStoreSearch = (e) => {
    let data = {
      locationName: e ? e : null,
      pageInfo: {
        pageNo: 1,
        pageSize: storePageSize,
      }
    }
    setReserveStorePage(1)
    setReserveStorePageInfo(data)
  }
  /*实际门店页数方法 点击下一页上一页*/
  let onActualStoreNextChange = (page, pageSize, e) =>{
    actualStorePageInfo.pageInfo.pageNo = page
    setActualStorePage(page)
    setStorePageSize(pageSize)
    setActualStorePageInfo(actualStorePageInfo)
  }
  /*实际门店 搜索*/
  let onActualStoreSearch = (e) => {
    let data = {
      locationName: e ? e : null,
      pageInfo: {
        pageNo: 1,
        pageSize: storePageSize,
      }
    }
    setActualStorePage(1)
    setActualStorePageInfo(data)
  }

  return(
    <div>
      <div className={style.block__cont}>
        <Form className={style.form__cont} form={form} onFinish={searchBtnEvent}>
          <Row>
            <Col span={8}>
              <Form.Item label="订单号：" name="orderNo" labelCol={{flex: '0 0 120px'}}>
                <Input placeholder="请输入" allowClear/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="订单状态：" name="orderStatus" labelCol={{flex: '0 0 120px'}}>
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
              <Form.Item label="车主姓名：" name="customerName" labelCol={{flex: '0 0 120px'}}>
                <Input placeholder="请输入" allowClear/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="车主手机号：" name="customerPhone" labelCol={{flex: '0 0 120px'}}>
                <Input placeholder="请输入" allowClear/>
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
              <Form.Item label="验证码：" name="verifiyCode" labelCol={{flex: '0 0 120px'}}>
                <Input placeholder="请输入" allowClear/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="预约保养时间：" name="bookTime" labelCol={{flex: '0 0 120px'}}>
                <RangePicker
                    allowClear
                    locale={locale}
                    style={{width: '100%'}}
                    placeholder={['开始时间', '结束时间']}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="预约保养门店：" name="bookLocationId" labelCol={{flex: '0 0 120px'}}>
                <Select
                    allowClear
                    placeholder="不限"
                    notFoundContent='暂无数据'
                    dropdownRender={menu => (
                        <div>
                          <Search placeholder="输入门店名称可筛选" allowClear onSearch={onReserveStoreSearch}/>
                          {menu}
                          <ConfigProvider locale={zh_CN}>
                            <Pagination
                                simple
                                showSizeChanger={false}
                                total={reserveStoreTotal}
                                className={style.store_page}
                                current={reserveStorePageNo}
                                defaultPageSize={storePageSize}
                                onChange={onReserveStoreNextChange}
                            />
                          </ConfigProvider>
                        </div>
                    )}
                >
                  {
                    reserveStoreList.map((item, key) => {
                      return <Option key={key} value={item.objectId}>{item.locationName}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="实际完成时间：" name="actualTime" labelCol={{flex: '0 0 120px'}}>
                <RangePicker
                    allowClear
                    locale={locale}
                    style={{width: '100%'}}
                    placeholder={['开始时间', '结束时间']}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="实际完成门店：" name="actualLocationId" labelCol={{flex: '0 0 120px'}}>
                <Select
                    allowClear
                    placeholder="不限"
                    notFoundContent='暂无数据'
                    dropdownRender={menu => (
                        <div>
                          <Search placeholder="输入门店名称可筛选" allowClear onSearch={onActualStoreSearch}/>
                          {menu}
                          <ConfigProvider locale={zh_CN}>
                            <Pagination
                                simple
                                showSizeChanger={false}
                                total={actualStoreTotal}
                                className={style.store_page}
                                current={actualStorePageNo}
                                defaultPageSize={storePageSize}
                                onChange={onActualStoreNextChange}
                            />
                          </ConfigProvider>
                        </div>
                    )}
                >
                  {
                    actualStoreList.map((item, key) => {
                      return <Option key={key} value={item.objectId}>{item.locationName}</Option>
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
            <Col span={8}>
              <Form.Item label="服务商订单号：" name="outOrderNo" labelCol={{flex: '0 0 120px'}}>
                <Input placeholder="请输入" allowClear/>
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
              locale={{emptyText: '暂无数据'}}
              columns={renderColumns()}
              dataSource={list}
              pagination={false}
              scroll={{
                x: 600
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
                total={pageTotal}
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
export default connect(({maintainOrderList, orderPublic})=>({
  list: maintainOrderList.list,
  pageTotal: maintainOrderList.pageTotal,
  providerList: orderPublic.providerList,
  actualStoreList: orderPublic.actualStoreList,
  actualStoreTotal: orderPublic.actualStoreTotal,
  reserveStoreList: orderPublic.reserveStoreList,
  reserveStoreTotal: orderPublic.reserveStoreTotal,
}))(maintainOrderListPage)
