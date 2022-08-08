import React,{useEffect, useState} from "react"
import { connect,history } from 'umi'
import {
  Row,
  Col,
  Tag,
  Form,
  Space,
  Input,
  Table,
  Modal,
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
/*卡券种类*/
let discountsTypeArr = [
  {id: 1, text: "优惠券" },
  {id: 2, text: "抵用券" },
  {id: 3, text: "打折券" },
]
/*发放方式*/
let serviceTypeArr = [
  {id: 1, text: '自发'},
  {id: 2, text: '代发'}
]
/*状态*/
let statusArr = [
  {id: 2, text: '生效'},
  {id: 3, text: '失效'}
]
const basicCardListPage =(props)=>{
  let {dispatch, channelList, pageTotal, list, categoryList} = props,
    [form] = Form.useForm(),
    [pageSize, setPageSize] = useState(10),
    [pageNum, setPage] = useState(1),
    [payload, setPayload] = useState({
      pageNum,
      pageSize,
      query: {
        status: null,
        channelNo: null,
        couponSkuNo: null,
        serviceType: null,
        pricingStatus: null,
        couponSkuName: null,
        discountsType: null,
        createTimeEnd: null,
        createTimeStart: null,
        couponCategoryType: null
      }
    })

  let renderColumns = () => {
    return (
      [{
        title: '基础卡券号',
        dataIndex: 'couponSkuNo',
        width: '12%',
        render: (couponSkuNo, record) => {
          return <span className={style.click_blue} onClick={() => {goToDetail(couponSkuNo, record)}}>
            {couponSkuNo}
          </span>
        }
      }, {
        title: '卡券标题',
        dataIndex: 'couponSkuName',
        width: '12%',
      }, {
        title: '发放方式',
        dataIndex: 'serviceTypeStr',
        width: '7%',
      }, {
        title: '卡券品类',
        dataIndex: 'couponCategoryName',
        width: '10%'
      }, {
        title: '卡券种类',
        dataIndex: 'discountsTypeStr',
        width: '10%',
      }, {
        title: '面值/折扣',
        dataIndex: 'faceValue',
        width: '10%',
      }, {
        title: '创建日期',
        dataIndex: 'createTime',
        width: '10%',
        render: (createTime) => {return <span>{createTime ? moment(createTime).format('YYYY-MM-DD') : ''}</span>}
      }, {
        title: '状态',
        dataIndex: 'statusStr',
        width: '8%',
        render: (statusStr, record) => statusRender(statusStr, record)
      }, {
        title: '操作',
        dataIndex: 'status',
        width: '15%',
        render: (status, record) => Operation(status, record)
      }]
    )
  }

  let Operation = (status, record)=> {
    let couponSkuNo = record.couponSkuNo
    let onTakeEffect = () => {
      dispatch({
        type: 'basicCardList/onTakeEffect',
        payload: {param: couponSkuNo},
        pageCallback: (res) => {
          if(res.result.code === '0'){
            Modal.success({
              content: res.result.message,
              onOk: () => {
                getList()
              }
            })
          }else {
            Modal.error({
              content: res.result.message,
              onOk: () => {
                getList()
              }
            })
          }
        }
      })
    }
    let onLoseEffect = () => {
      dispatch({
        type: 'basicCardList/onLoseEffect',
        payload: {param: couponSkuNo},
        pageCallback: (res) => {
          if(res.result.code === '0'){
            Modal.success({
              content: res.result.message,
              onOk: () => {
                getList()
              }
            })
          }else {
            Modal.error({
              content: res.result.message,
              onOk: () => {
                getList()
              }
            })
          }
        }
      })

    }
    let goToEdit = () => {
      sessionStorage.setItem('basicCard_cardId', couponSkuNo) //卡券详情和编辑id
      sessionStorage.setItem('basicCard_productNo', record.productNo) //卡券详情和编辑的sku编号
      setTimeout(()=>{
        history.push('/editBasicCard')
      },200)
    }
    let onCopyCard = () =>{
      sessionStorage.setItem('basicCard_copyCardId', couponSkuNo) //复制卡券id
      sessionStorage.setItem('basicCard_productNo', record.productNo) //卡券详情和编辑的sku编号
      Modal.success({
        content: '复制成功，快去新建卡券吧！'
      })
    }
    return <span className={style.click_blue}>
      {
        status === 2 ? <span style={{marginRight: '10px'}} onClick={onLoseEffect}>失效</span> :
          status === 3 ? <span style={{marginRight: '10px'}} onClick={onTakeEffect}>生效</span> : null
      }
      {
        status === 3 ? <span style={{marginRight: '10px'}} onClick={goToEdit}>编辑</span> : null
      }
      <span onClick={onCopyCard}>复制</span>
    </span>
  }
  let goToDetail = (couponSkuNo, record) => {
    sessionStorage.setItem('basicCard_cardId', couponSkuNo) //卡券详情和编辑id
    sessionStorage.setItem('basicCard_productNo', record.productNo) //卡券详情和编辑的sku编号
    setTimeout(()=>{
      history.push('/basicCardDetail')
    },200)
  }
  let statusRender = (statusStr, record) =>{
    let status = record.status
    if(status === 3){
      return <Tag color="red">{statusStr}</Tag>
    }
    if(status === 2){
      return <Tag color="blue">{statusStr}</Tag>
    }
  }
  useEffect(()=>{
    sessionStorage.removeItem('basicCard_skuDetail') //重置选中的sku信息
    sessionStorage.removeItem('basicCard_copyCardId') //重置复制卡券
    sessionStorage.removeItem('basicCard_productNo') //卡重置详情和编辑的sku编号
    /*获取渠道*/
    dispatch({
      type: "basicCardList/getChannel"
    })
    /*获取卡券品类(服务)*/
    dispatch({
      type: "basicCardList/getCategory"
    })
  },[])
  /*回调*/
  useEffect(()=>{
    getList()
  },[pageNum, pageSize, payload])
  /*获取列表*/
  let getList = () => {
    dispatch({
      type: 'basicCardList/getList',
      payload
    })
  }
  let goToAdd = () => {
    if(!sessionStorage.getItem('basicCard_copyCardId')){
      sessionStorage.removeItem('basicCard_addDetail')
      history.push("/addBasicCard")
    }else{
      history.push("/editBasicCard")
    }
  }
  /*清空内容*/
  let resetBtnEvent = ()=> {
    form.resetFields()
    let data = {
      pageNum: 1,
      pageSize,
      query: {
        status: null,
        channelNo: null,
        couponSkuNo: null,
        serviceType: null,
        pricingStatus: null,
        couponSkuName: null,
        discountsType: null,
        createTimeEnd: null,
        createTimeStart: null,
        couponCategoryType: null
      }
    }
    setPage(1)
    setPayload(data)
  }
  /*搜索按钮*/
  let searchBtnEvent = (e)=>{
    let createTimeEnd = e.createTime ? moment(e.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')  : null
    let createTimeStart = e.createTime ? moment(e.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')  : null
    let data = {
      pageNum: 1,
      pageSize,
      query: {
        ...e,
        createTimeEnd,
        createTimeStart,
      }
    }
    setPage(1)
    setPayload(data)
  }
  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) =>{
    payload.pageNum = page
    setPayload(payload)
    setPage(page)
    setPageSize(pageSize)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) =>{
    payload.pageNum = page
    payload.pageSize = pageSize
    setPage(page)
    setPageSize(pageSize)
    setPayload(payload)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) =>{
    let totalPage  = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNum} / ${totalPage}  页`
  }

  return(
    <div>
      <div className={style.block__cont}>
        <div className={style.block__header}>基础卡券列表</div>
        <Form className={style.form__cont} form={form} onFinish={searchBtnEvent}>
          <Row justify="space-around" align="center">
            <Form.Item label="基础卡券号：" name="couponSkuNo" className={style.form__item} labelCol={{span: 8}}>
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="卡券标题：" name="couponSkuName" className={style.form__item} labelCol={{span: 8}}>
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="发放方式：" name="serviceType" className={style.form__item} labelCol={{span: 8}}>
              <Select placeholder="不限">
                {
                  serviceTypeArr.map((item, key) => {
                    return <Option key={key} value={item.id}>{item.text}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Row>
          <Row justify="space-around" align="center">
            <Form.Item label="卡券品类：" name="couponCategoryType" className={style.form__item} labelCol={{span: 8}}>
              <Select placeholder="不限">
                {
                  categoryList.map((item, key) => {
                    return <Option key={key} value={item.id}>{item.categoryName}</Option>
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item label="卡券种类：" name="discountsType" className={style.form__item} labelCol={{span: 8}}>
              <Select placeholder="不限">
                {
                  discountsTypeArr.map((item,key) => <Option key={key} value={item.id}>{item.text}</Option>)
                }
              </Select>
            </Form.Item>
            <Form.Item label="状态：" name="status" className={style.form__item} labelCol={{span: 8}}>
              <Select placeholder="不限">
                {
                  statusArr.map((item, key) => {
                    return <Option key={key} value={item.id}>{item.text}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Row>
          <Row justify="space-around" align="left">
            <Form.Item label="创建时间：" name="createTime" className={style.form__item} labelCol={{span: 8}}>
              <RangePicker locale={locale} placeholder={['开始时间','结束时间']}/>
            </Form.Item>
            <Form.Item labelCol={{span: 8}} className={style.form__item}/>
            <Form.Item labelCol={{span: 8}} className={style.form__item}/>
          </Row>
          <Row justify="space-around" align="left">
            <Space size={22}>
              <Button className={style.btn_radius} htmlType="submit" type="primary">查询</Button>
              <Button className={style.btn_radius} htmlType="button" onClick={resetBtnEvent}>重置</Button>
            </Space>
          </Row>
        </Form>
      </div>
      <div className={style.block__cont__t}>
        <div className={style.block__header__f}>
          <Button className={style.btn_radius} type="primary" onClick={goToAdd}>新建基础卡券</Button>
        </div>
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
        <ConfigProvider locale={zh_CN}>
          <Pagination
            className={style.pagination}
            showQuickJumper
            showTitle={false}
            current={pageNum}
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
  )
};
export default connect(({basicCardList})=>({
  list: basicCardList.list,
  pageTotal: basicCardList.pageTotal,
  channelList: basicCardList.channelList,
  categoryList: basicCardList.categoryList,
}))(basicCardListPage)
