import React, {
  useEffect,
  useState
} from "react";
import style from "./style.less";
import {
  Tag,
  Row,
  Form,
  Space,
  Input,
  Table,
  Select,
  Button,
  Pagination,
  ConfigProvider
} from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {connect, history} from "umi";
import moment from "moment";
const { Option } = Select
/*"面值类型*/
let valueTypeList = [{title: '固定面值', id: 1},{title: '自定义面值', id: 2}]
/*产品类型*/
let productTypeList = [{title: '三方平台', id: 1},{title: '自营平台', id: 2}]
/*业务类型*/
let serviceTypeList = [{title: '自发', id: 1},{title: '代发', id: 2}]
let relevanceProListPage = (props) => {
  let { dispatch, pageTotal, list, categoryList } = props,
    [form] = Form.useForm(),
    [pageSize, setPageSize] = useState(10),
    [pageNum, setPage] = useState(1),
      [payload, setPayload] = useState({
        pageNum,
        pageSize,
        query: {
          status: '2',
          productNo: null,
          valueType: null,
          productName: null,
          productType: null,
          couponCategory: null,
          procurementType: '01',
        }
      })
  useEffect(() => {
    /*卡券品类列表*/
    dispatch({
      type:"addBasicCard/getCategoryBasicCard",
    })
  },[])
  let columns = [{
      title: 'SKU编码',
      dataIndex: 'productNo',
      width: '10%'
    }, {
      title: '服务名称',
      dataIndex: 'productName',
      width: '15%',
    }, {
      title: '单位',
      dataIndex: 'serviceUnit',
      width: '5%',
    }, {
      title: '投放品类',
      dataIndex: 'couponCategoryName',
      width: '8%',
    }, {
      title: '服务分类',
      dataIndex: 'productTypeName',
      width: '8%',
    }, {
      title: '面值类型',
      dataIndex: 'valueTypeName',
      width: '8%',
    }, {
      title: '收费类型',
      dataIndex: 'chargeTypeName',
      width: '8%',
    }, {
      title: '采购类型',
      dataIndex: 'procurementTypeName',
      width: '8%',
    }, {
      title: '业务类型',
      dataIndex: 'serviceTypeName',
      width: '7%',
    }, {
      title: '所属渠道',
      dataIndex: 'channelName',
      width: '7%',
    }, {
      title: '创建日期',
      dataIndex: 'createTime',
      width: '12%',
      render: (createTime) => {return <span>{moment(createTime).format('YYYY-MM-DD HH:mm:ss')}</span>}
    }, {
      title: '状态',
      dataIndex: 'status',
      width: '7%',
      render: (status, record) => statusRender(status, record)
    },{
      title: '操作',
      dataIndex: 'couponProductNo',
      width: '10%',
      render: (couponProductNo, record) => <Button type="link" onClick={() => {selectBtn(record)}}>选择</Button>
  }]

  /*状态标签*/
  let statusRender = (status, record) =>{
    let statusCor = 'red'
    if(status === 1){
      statusCor = 'red'
    }
    if(status === 2){
      statusCor = 'blue'
    }
    return <Tag color={statusCor}>{record.statusStr}</Tag>
  }
  /*回调*/
  useEffect(()=>{
    getList()
  },[pageNum, pageSize, payload])
  /*查询列表*/
  let getList = () =>{
    dispatch({
      type: 'relevanceProList/getList',
      payload:{
        method: 'postJSON',
        params: payload
      }
    })
  }
  //搜索
  let onSearch = (e) => {
    let data = {
      pageNum: 1,
      pageSize,
      query: {
        status: '2',
        procurementType: '01',
        productNo: e.productNo || null,
        valueType: e.valueType || null,
        productName: e.productName || null,
        productType: e.productType || null,
        couponCategory: e.couponCategory || null,
        serviceType: e.serviceType || null,
      }
    }
    setPage(1)
    setPayload(data)
  }
  //重置
  let resetBtnEvent = () => {
    form.resetFields()
    let data = {
      pageNum: 1,
      pageSize,
      query:{
        status: '2',
        productNo: null,
        valueType: null,
        productName: null,
        productType: null,
        couponCategory: null,
        procurementType: '01',
        serviceType: null,
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
  /*选择产品*/
  let selectBtn = (record) => {
    let data = {...record}
    let temp = JSON.stringify(data)
    sessionStorage.setItem('basicCard_skuDetail', temp)
    setTimeout(()=>{
      goToBack()
    },200)
  }
  /*后退*/
  let goToBack = () =>{
    history.goBack()
  }
  return (
      <>
        <div className={style.block__cont}>
          <div className={style.block__header}>请选择卡券产品</div>
          <Form className={style.form__cont} form={form} onFinish={onSearch}>
            <Row justify="space-around" align="center">
              <Form.Item label="SKU编码：" name='productNo' className={style.form__item} labelCol={{ span: 8 }} >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item label="服务名称：" name='productName' className={style.form__item} labelCol={{ span: 8 }} >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item label="投放品类：" name="couponCategory" className={style.form__item} labelCol={{span: 8}}>
                <Select placeholder="不限">
                  {
                    categoryList.map((item,key) => <Option key={key} value={item.id}>{item.categoryName}</Option>)
                  }
                </Select>
              </Form.Item>
            </Row>
            <Row justify="space-around" align="center">
              <Form.Item label="服务分类：" name="productType" className={style.form__item} labelCol={{span: 8}}>
                <Select placeholder="不限">
                  {
                    productTypeList.map((item, key) => {
                      return <Option key={key} value={item.id}>{item.title}</Option>
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item label="面值类型：" name="valueType" className={style.form__item} labelCol={{span: 8}}>
                <Select placeholder="不限">
                  {
                    valueTypeList.map((item, key) => {
                      return <Option key={key} value={item.id}>{item.title}</Option>
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item label="业务分类：" name="serviceType" className={style.form__item} labelCol={{span: 8}}>
                <Select placeholder="不限">
                  {
                    serviceTypeList.map((item, key) => {
                      return <Option key={key} value={item.id}>{item.title}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Row>
            <Row  justify="center" align="center" className={style.btn__content}>
              <Space size={20}>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button onClick={resetBtnEvent}>重置</Button>
              </Space>
            </Row>
          </Form>
        </div>
        <div className={style.block__cont} style={{marginTop: '30px'}}>
          <Table
            columns={columns}
            pagination={false}
            dataSource={list}
            style={{padding: '0 30px'}}
            locale={{emptyText: '暂无数据'}}
          />
          <ConfigProvider locale={zh_CN}>
            <Pagination
              className={style.pages__content}
              showQuickJumper
              showTitle={false}
              current={pageNum}
              defaultPageSize={pageSize}
              onChange={onNextChange}
              total={pageTotal}
              pageSizeOptions={['10', '20', '30', '40','50']}
              onShowSizeChange={onSizeChange}
              showTotal={onPageTotal}
            />
          </ConfigProvider>
          <Row justify="center" align="center" className={style.btn__content}>
            <Space size={20}>
              <Button onClick={goToBack}>返回</Button>
            </Space>
          </Row>
        </div>
      </>
  )
};
export default connect(({ relevanceProList, addBasicCard }) => ({
  list: relevanceProList.list,
  pageTotal: relevanceProList.pageTotal,
  channelList: relevanceProList.channelList,
  categoryList: addBasicCard.categoryList,
}))(relevanceProListPage)
