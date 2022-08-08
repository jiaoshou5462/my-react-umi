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
const cargoDeclarationOrderListPage = (props) => {
  let { dispatch, listInfo, list,branchList} = props,
    [form] = Form.useForm(),
    [pageSize, setPageSize] = useState(10),
    [channelId, setChannelId] = useState(localStorage.getItem('tokenObj') && JSON.parse(localStorage.getItem('tokenObj')).channelId || ''),
    [pageNo, setPage] = useState(1),
    [payload, setPayload] = useState({
      channelId,
      pageInfo: {
        pageNo,
        pageSize,
      }
    })
    useEffect(() => {
      dispatch({
        type: 'orderPublic/getBranchList',
        payload: {
          method: 'get',
          id:'2109' ,
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
        type: 'cargoDeclarationOrderList/getList',
        payload: {
          method: 'postJSON',
          params: payload
        },
      })
    }


   let renderColumns = () => {
    return (
      [{
        title: '协议号',
        dataIndex: 'agreementNo',
        width: 120,
        align: 'center',
        fixed: 'left',
      }, {
        title: '投保人',
        width: 170,
        align: 'center',
        dataIndex: 'applicant',
      }, {
        title: '被投保人',
        width: 170,
        align: 'center',
        dataIndex: 'recognizee',
      }, {
        title: '协议日期',
        width: 110,
        align: 'center',
        dataIndex: 'agreementStartTime',
      }, {
        title: '协议终期',
        width: 110,
        align: 'center',
        dataIndex: 'agreementEndTime',
      }, {
        title: '货物名称',
        width: 100,
        align: 'center',
        dataIndex: 'freightName',
      }, {
        title: '车牌号/船次航次',
        width: 120,
        align: 'center',
        dataIndex: 'freightNo',
      }, {
        title: '货物保险金额',
        width: 100,
        align: 'center',
        dataIndex: 'freightAmount',
      }, {
        title: '起运地',
        width: 100,
        align: 'center',
        dataIndex: 'originAddress',
      }, {
        title: '起运日期',
        width: 110,
        align: 'center',
        dataIndex: 'freightStartTime',
      }, {
        title: '目的地',
        width: 100,
        align: 'center',
        dataIndex: 'destinationAddress',
      }, {
        title: '下单时间',
        width: 110,
        align: 'center',
        dataIndex: 'createTime',
      }, {
        title: '分支机构',
        width: 110,
        align: 'center',
        dataIndex: 'centerBranchName',
      }, {
        title: '分支地区',
        width: 120,
        align: 'center',
        dataIndex: 'branchName',
      }, {
        title: '费率',
        width: 100,
        align: 'center',
        fixed: 'right',
        dataIndex: 'feeRate',
      }]
    )
  } 


  /*清空内容*/
  let resetBtnEvent = () => {
    form.resetFields()
    let data = {
      channelId,
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
    //起运时间段
    let freightEndTime = e.freightTime ? moment(e.freightTime[1]).endOf('day').format('YYYY-MM-DD')  : null
    let freightStartTime = e.freightTime ? moment(e.freightTime[0]).startOf('day').format('YYYY-MM-DD')  : null
    //协议日期
    let agreementStartTime = e.agreementStartTime ? moment(e.agreementStartTime).startOf('day').format('YYYY-MM-DD')  : null
    let agreementEndTime = e.agreementEndTime ? moment(e.agreementEndTime).startOf('day').format('YYYY-MM-DD')  : null
    let data = {
      ...e,
      channelId,
      freightEndTime,
      freightStartTime,
      agreementStartTime,
      agreementEndTime,
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
              <Form.Item label="协议号：" name="agreementNo" labelCol={{ flex: '0 0 120px' }}>
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="投保人：" name="applicant" labelCol={{ flex: '0 0 120px' }}>
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="被投保人：" name="recognizee" labelCol={{ flex: '0 0 120px' }}>
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="协议日期：" name="agreementStartTime" labelCol={{flex: '0 0 120px'}}>
              <DatePicker  style={{width: '100%'}}/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="协议终期：" name="agreementEndTime" labelCol={{flex: '0 0 120px'}}>
              <DatePicker  style={{width: '100%'}}/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="起运时间段：" name="freightTime" labelCol={{flex: '0 0 120px'}}>
                <RangePicker
                    allowClear
                    locale={locale}
                    style={{width: '100%'}}
                    placeholder={['开始时间', '结束时间']}
                />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item label="分支机构" name="centerBranchName" labelCol={{flex: '0 0 120px'}}>
                <Select
                    showSearch
                    allowClear
                    notFoundContent='暂无数据'
                    placeholder="输入机构可筛选"
                    optionFilterProp="children"
                >
                  {
                    branchList.map((item, key) => {
                      return <Option key={item.name} value={item.name}>{item.name}</Option>
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
export default connect(({ cargoDeclarationOrderList, orderPublic}) => ({
  list: cargoDeclarationOrderList.list,
  listInfo: cargoDeclarationOrderList.listInfo,
  branchList: orderPublic.branchList
}))(cargoDeclarationOrderListPage)
