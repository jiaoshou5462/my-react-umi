import React, { useEffect, useState } from "react";
import { connect, history } from 'umi';
import { Table, Tag, Space, Pagination, ConfigProvider,message, Form,Row,Col,Button,Input,Select } from 'antd';
import style from "./style.less";
import locale from 'antd/lib/date-picker/locale/zh_CN';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
const { Option } = Select;
const carInformation = (props) => {
  let customerId = history.location.query.customerId
  let { dispatch } = props,
      // [pageNo, setPageNo] = useState(0),
      // [pageSize, setPageSize] = useState(10),
      // [pageTotal, setPageTotal] = useState(0),
      [form] = Form.useForm(),
      [insuranceList, setInsuranceList] = useState([]),
      [payload, setPayload] = useState({
        customerId: customerId,
      })
  let carType = [
    {label:'车险',value:'1'},
    {label:'非车险',value:'2'}
  ]
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
       render: (text,record,index) => <span>{index+1}</span>,
    },
    {
      title: '保险种类',
      dataIndex: 'policyType',
      key: 'policyType',
      render: (text,record,index) => <span>{text===1?'车险':'非车险'}</span>,
    },
    {
      title: '保险状态',
      dataIndex: 'policyStatus',
      key: 'policyStatus',
      render: (text,record,index) => <span>{text===1?'已购买':null}</span>,
    },
    {
      title: '保单编号',
      dataIndex: 'policyCode',
      key: 'policyCode',
    },
    {
      title: '报价/保费',
      dataIndex: 'policePrice',
      key: 'policePrice',
    },
    {
      title: '保单生效日期',
      dataIndex: 'policyStartDate',
      key: 'policyStartDate',
    },
    {
      title: '保单到期日期',
      dataIndex: 'policyEndDate',
      key: 'policyEndDate',
    },
    {
      title: '销售名称',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    }];

  useEffect(() => {
    getInsuranceList(payload)
 },[])
 let searchBtnEvent = (e) => {
    e.customerId = customerId
    getInsuranceList(e)

  }
let resetBtnEvent = () => {
  form.resetFields()
  getInsuranceList(payload)
}
  /* 获取保险列表 */
  let getInsuranceList = (data) => {
    dispatch({
      type: 'customerListDetail/getCustomerPolicy',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let temp = res.body || {}
          setInsuranceList(temp.list || [])
          // setPageTotal(insuranceProduct.totalCount || 1)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // /* 更改页码 */
  // let onNextChange = () => {

  // }
  // /* 更改以页显示数量 */
  // let onSizeChange = () => {

  // }
  // let onPageTotal = (total, range) => {
  //   let totalPage = Math.ceil(total / pageSize)
  //   return `共${total}条记录 第 ${pageNo} / ${totalPage}  页`
  // }
  return (
    <>
     <Form className={style.form__cont} form={form} onFinish={searchBtnEvent}>
          <Row gutter={60}>
            <Col span={8}>
              <Form.Item label="保单编号" name="policyCode" >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="保单种类" name="policyType" >
                <Select
                  notFoundContent='暂无数据'
                  placeholder="请选择"
                >
                  {
                    carType.map((item, key) => {
                        return <Option key={key} value={item.value}>{item.label}</Option>
                      })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="承担单位" name="branchName" >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={60}>
            <Col span={8}>
              <Form.Item label="销售名称" name="saleName" >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="销售工号" name="saleId" >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <div className={style.btn_cont}>
                <Button  htmlType="submit" type="primary">搜索</Button>
                <Button className={style.btn_search} htmlType="button" onClick={resetBtnEvent}>重置</Button>
              </div>
            </Col>
          </Row>
        </Form>
      <Table columns={columns} dataSource={insuranceList} pagination={false}/>
      {/* <ConfigProvider locale={zh_CN}>
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
        </ConfigProvider> */}
    </>
  )
};
export default connect(({ customerListDetail }) => ({
}))(carInformation)
