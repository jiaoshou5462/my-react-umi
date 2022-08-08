import React,{useEffect, useState} from "react"
import { connect,history } from 'umi'
import {
  Form,
  Input,
  Table,
  Select,
} from "antd"
import {
  LtbItem,
  TypeTags,
  ListTitle,
  ListTable,
  StateBadge,
  ListTableTime,
  ListTableBtns
} from "@/components/commonComp/index"
import {QueryFilter} from "@ant-design/pro-form"
import style from "./style.less"
const { Option } = Select
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
let statusArr = [{
  id: '0',
  color: '#FFC500',
  title: '待确认'
},{
  id: '1',
  color: '#32D1AD',
  title: '已确认'
},{
  id: '2',
  color: '#2FB6E4',
  title: '已收款'
},{
  id: '3',
  color: '#7545A7',
  title: '处理中'
},{
  id: '4',
  color: '#0084FF',
  title: '办理成功'
},{
  id: '5',
  color: '#28CB6B',
  title: '已完成'
},{
  id: '6',
  color: '#FF4A1A',
  title: '已取消'
},{
  id: '7',
  color: '#FF9500',
  title: '待支付'
},{
  id: '8',
  color: '#C91132',
  title: '已失效'
},{
  id: '9',
  color: '#5E5CE6',
  title: '待补交'
},{
  id: '10',
  color: '#4B7FE8',
  title: '待补款'
},{
  id: '11',
  color: '#AF52DE',
  title: '已接单'
},{
  id: '12',
  color: '#32D74B',
  title: '司机就位'
},{
  id: '13',
  color: '#FF2D55',
  title: '取车成功'
},{
  id: '14',
  color: '#6236FF',
  title: '检测中'
},{
  id: '15',
  color: '#FF3030',
  title: '检测完成'
},{
  id: '16',
  color: '#7E7DEB',
  title: '车辆归还中'
},{
  id: '17',
  color: '#FF724D',
  title: '办理失败'
},{
  id: '18',
  color: '#815EFF',
  title: '到场未服务'
},]
let orderTypeArr = [{
  id: '15',
  color: '#2FB6E4',
  title: '6年免检'
},{
  id: '17',
  color: '#32D1AD',
  title: '上门取车送检'
},{
  id: '30',
  color: '#FF724D',
  title: '自驾送检'
},]
let supplierArr = [{
  id: '113882',
  title: '车多网'
},{
  id: '114199',
  title: '安安车务'
},]

/*订单来源*/
let OrderSourceArr = [{
  id: 0,
  title: '后台'
},{
  id: 1,
  title: '用户'
},{
  id: 2,
  title: '系统'
}
]

const agentOrderListPage =(props)=>{
  let {dispatch, pageTotal, list, provinceList, cityList} = props,
      [form] = Form.useForm(),
      [channelId, setChannelId] = useState(localStorage.getItem('tokenObj') && JSON.parse(localStorage.getItem('tokenObj')).channelId || ''),
      [payload, setPayload] = useState({
        channelId,
        pageInfo: {
          pageNo: 1,
          pageSize: 10,
        }
      })
    useEffect(() => {
      getConfigCode(1)
    },[])
    /*回调*/
    useEffect(()=>{
      if(channelId){
        getList()
      }
    },[payload])

  /*获取列表*/
  let getList = () => {
    dispatch({
      type: 'agentOrderList/getList',
      payload: {
        method: 'postJSON',
        params: payload
      },
    })
  }

  /*获取省份地区列表*/
  let getConfigCode = (flag, parentId) => {
    let temp = {
      name: 'TOR_REGION',
      clause: flag === 1 ? 'level=1' : 'parent_id=' + parentId
    }
    dispatch({
      type: 'orderPublic/getConfigCode',
      payload: {
        method: 'get',
        params: temp
      },
      flag
    })
  }

  let renderColumns = () => {
    return (
        [{
          title: '订单号',
          dataIndex: 'orderNo',
        }, {
          title: '供应商',
          dataIndex: 'providerName',
          render: (providerName) => {
            return <span>{providerName || '-'}</span>
          }
        }, {
          title: '订单类型',
          dataIndex: 'orderTypeName',
          render: (orderTypeName, record) => orderTypeRender(orderTypeName, record)
        }, {
          title: '订单状态',
          dataIndex: 'orderStatusName',
          render: (orderStatusName, record) => statusRender(orderStatusName, record)
        }, {
          title: '车牌号',
          dataIndex: 'plateNo',
        }, {
          title: '联系电话',
          dataIndex: 'customerPhone',
        }, {
          title: '下单日期',
          dataIndex: 'createTime',
          render: (createTime) => {
            return <ListTableTime>{createTime}</ListTableTime>
          }
        }, {
          title: '订单来源',
          dataIndex: 'sourceFlagStr',
          render: (sourceFlagStr) => {
            return <span>{sourceFlagStr || '-'}</span>
          }
        }, {
          title: '操作',
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
        pathname: '/order/agentOrder/list/detail',
        state: {
          objectId
        }
      })
    }
    return <ListTableBtns showNum={3}>
      <LtbItem onClick={goToDetail}>查看</LtbItem>
    </ListTableBtns>
  }
  let orderTypeRender = (name, record) => {
    let tempColor = ''
    orderTypeArr.map(item => {
      if(Number(item.id) === record.orderType){
        tempColor = item.color
      }
    })
    return <TypeTags color={tempColor}>{name}</TypeTags>
  }
  let statusRender = (name, record) => {
    let tempColor = ''
    statusArr.map(item => {
      if(Number(item.id) === record.orderStatus){
        tempColor = item.color
      }
    })
    return <StateBadge color={tempColor}>{name || '-'}</StateBadge>
  }
  /*清空内容*/
  let resetBtnEvent = ()=> {
    form.resetFields()
    let data = {
      channelId,
      pageInfo: {
        pageSize: 10,
        pageNo: 1,
      }
    }
    setPayload(data)
    dispatch({
      type: 'orderPublic/onReset'
    })
  }
  /*搜索按钮*/
  let searchBtnEvent = (e)=>{
    let createTimeEnd = e.createTime ? moment(e.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')  : null
    let createTimeStart = e.createTime ? moment(e.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')  : null
    let data = {
      ...e,
      channelId,
      createTimeEnd,
      createTimeStart,
      pageInfo: {
        pageSize: 10,
        pageNo: 1,
      }
    }
    setPayload(data)
  }
  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) =>{
    let temp = JSON.parse(JSON.stringify(payload))
    temp.pageInfo.pageNo = page
    temp.pageInfo.pageSize = pageSize
    setPayload(temp)
  }
  /*省份change 联动地区接口*/
  let onProvinceChange = (e) => {
    if(e){
      getConfigCode(2, e)
    }
    dispatch({
      type: 'orderPublic/onReset',
      flag: 2
    })
    form.resetFields(['cityId'])
  }

  return(
    <div>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtnEvent} onReset={resetBtnEvent}>
          <Form.Item label="订单号" name="orderNo" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" allowClear/>
          </Form.Item>
          <Form.Item label="车主姓名" name="customerName" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" allowClear/>
          </Form.Item>
          <Form.Item label="手机号" name="customerPhone" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" allowClear/>
          </Form.Item>
          <Form.Item label="车牌号" name="plateNo" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" allowClear/>
          </Form.Item>
          <Form.Item label="订单状态" name="orderStatus" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="不限" allowClear>
              {
                statusArr.map((item, key) => {
                  return <Option key={key} value={item.id}>{item.title}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="订单类型" name="orderType" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="不限" allowClear>
              {
                orderTypeArr.map((item, key) => {
                  return <Option key={key} value={item.id}>{item.title}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="省份" name="provinceId" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="不限" allowClear onChange={onProvinceChange}>
              {
                provinceList.map((item, key) => {
                  return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="城市" name="cityId" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="请先选择省份" allowClear>
              {
                cityList.map((item, key) => {
                  return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="供应商" name="providerId" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="不限" allowClear>
              {
                supplierArr.map((item, key) => {
                  return <Option key={key} value={item.id}>{item.title}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="订单来源" name="sourceFlag" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="请选择" allowClear>
              {
                OrderSourceArr.map((item, key) => {
                  return <Option key={key} value={item.id}>{item.title}</Option>
                })
              }
            </Select>
          </Form.Item>
        </QueryFilter>
      </div>
      <div className={style.list_box}>
        <ListTitle titleName="结果列表" />
        <ListTable
            showPagination
            total={pageTotal}
            onChange={onNextChange}
            current={payload.pageInfo.pageNo}
            pageSize={payload.pageInfo.pageSize}
        >
          <Table
              locale={{emptyText: '暂无数据'}}
              columns={renderColumns()}
              dataSource={list}
              pagination={false}
              loading={{
                spinning: false,
                delay: 500
              }}
          />
        </ListTable>
      </div>
    </div>
  )
};
export default connect(({agentOrderList, orderPublic})=>({
  list: agentOrderList.list,
  cityList: orderPublic.cityList,
  pageTotal: agentOrderList.pageTotal,
  provinceList: orderPublic.provinceList,
}))(agentOrderListPage)
