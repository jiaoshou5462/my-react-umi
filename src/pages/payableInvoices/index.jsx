import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Table, Select, Row,Col, Space, Button, DatePicker, Pagination, Cascader, Modal, message,Tooltip } from "antd";
import style from "./style.less";
import moment from 'moment';
import { QuestionCircleOutlined} from '@ant-design/icons';


const { Column } = Table;
const { Option } = Select;
const { RangePicker } = DatePicker;
import { QueryFilter } from '@ant-design/pro-form';

import {
  ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,
} from "@/components/commonComp/index";


// 应付及发票列表
const payableInvoicesPage = (props) => {
  let { dispatch, location, payableInvoiceList, payableInvoiceTotal, businessTypeArr, saveQuerySelect } = props;
  let [form] = Form.useForm();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [payload, setPayload] = useState({
    pageNum: 1,
    pageSize: 10
  });
  let [channelBillInfo, setChannelBillInfo] = useState(location.state && location.state.info || '');
  let [isOrgIdList, setIsOrgIdList] = useState([])
  let [showColumn, setShowColumn] = useState(columns);

  useEffect(() => {
    savaQuery({});// 去除菜单左侧点击参数残留
    queryChildOrg();
    businessType();
    if (Object.values(saveQuerySelect).length > 0) {
      form.setFieldsValue({
        ...saveQuerySelect
      })
    } else {
      if (channelBillInfo.orderType == 3) {
        form.setFieldsValue({
          balancePeriod: [moment(channelBillInfo.startYearMonth), moment(channelBillInfo.endYearMonth)],
          invoiceStatus: channelBillInfo.billStatus,
          billType: channelBillInfo.businessType,
        })
      } else {
        form.setFieldsValue({});//查询
      }
    }
  }, [])

  useEffect(() => {
    let toQuery = form.getFieldsValue();
    console.log(toQuery.balancePeriod)
    let newQuery = {};
    newQuery.billNo = toQuery.billNo;
    newQuery.billType = toQuery.billType ;
    newQuery.reciveStatus = toQuery.reciveStatus 
    newQuery.billName = toQuery.billName ;
    newQuery.invoiceStatus = toQuery.invoiceStatus;
    if (toQuery.balancePeriod) {
      newQuery.balancePeriodStart = moment(toQuery.balancePeriod[0]).format('YYYY-MM')
      newQuery.balancePeriodEnd = moment(toQuery.balancePeriod[1]).format('YYYY-MM')
    }
    // delete newQuery.balancePeriod;
    // if(newQuery.orgId && newQuery.orgId.length>0){
    //   newQuery.orgId=newQuery.orgId[newQuery.orgId.length-1];
    // }else {
    //   delete newQuery.orgId;
    // }
    if(Object.values(saveQuerySelect).length > 0) {
      if(saveQuerySelect.orgId && saveQuerySelect.orgId.length>0) {
        newQuery.orgId=saveQuerySelect.orgId[saveQuerySelect.orgId.length-1];
      }
    }else {
      if(toQuery.orgId && toQuery.orgId.length>0){
        newQuery.orgId=toQuery.orgId[toQuery.orgId.length-1];
      }
    }
    newQuery.balancePeriodAndBillNoDesc = true; // 写死参数
    let toPayInfo = payload;
    toPayInfo.query = newQuery;
    payableAndInvoiceList(toPayInfo)
  }, [payload])

  // 查询分支机构数据
  let queryChildOrg = () => {
    dispatch({
      type: 'billHandleModel/queryChildOrg',
      payload: {
        method: 'postJSON',
        params: {
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          platformType:'channel',
          userId: JSON.parse(localStorage.getItem('tokenObj')).userId,
        }
      },
      callback: res => {
        if(res.result.code==0) {
          if(res.body.channelOrganizations && res.body.channelOrganizations.length>0) {
            let tree = eachTreeList(res.body.channelOrganizations);
            setIsOrgIdList([...tree]);
          }
        }else {
          message.error(res.result.message)
        }
      }
    });
  }

  // 构建树
  const eachTreeList = (treeList) => {
    let _treeList = [];
    for (let item of treeList) {
      let obj = {
        ...item,
        value:item.id,
        label:item.name,
      };
      if (item.childOrganizations.length > 0 && item.childOrganizations[0].id) {
        obj.children = eachTreeList(item.childOrganizations);
      }
      _treeList.push(obj);
    }
    return _treeList;
  }

  // 业务类型
  let businessType = () => {
    dispatch({
      type: 'payableInvoicesModel/businessType',// 命名空间名/effect内的函数名
      payload: {
        method: 'get',
        params: {}
      }
    });
  }
  // 列表接口
  const payableAndInvoiceList = (params) => {
    dispatch({
      type: 'payableInvoicesModel/payableAndInvoiceList',//列表
      payload: {
        method: 'postJSON',
        params: params,
      },
      callback: res => {
        if(isOrgIdList.length == 0) {
          columns.some((item, i) => {
            if (item.dataIndex == 'orgName') {
              columns.splice(i, 1)
              return true 
            }
          })
          setShowColumn(columns)
        }
      }
    });
  }

  // 导出接口
  const listExport = () => {
    let newPayload = JSON.parse(JSON.stringify(payload));
    // 账单月份
    if (newPayload.balancePeriod) {
      newPayload.balancePeriodStart = moment(newPayload.balancePeriod[0]).format('YYYYMM')
      newPayload.balancePeriodEnd = moment(newPayload.balancePeriod[1]).format('YYYYMM')
    }
    dispatch({
      type: 'detailsModel/orderExport',// 据实导出
      payload: {
        method: 'postJsonExcel',
        params: newPayload,
      },
      callback: (res) => {
        const url = window.URL.createObjectURL(new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '据实明细列表.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    });
  }

  let columns = [
    { title: '账单月份', dataIndex: 'balancePeriod', width: 110, key: 'balancePeriod' },
    { title: '账单编号', dataIndex: 'billNo', key: 'billNo' },
    { title: '账单名称', dataIndex: 'billName', key: 'billName', width: 150, render: (text, record) => <TextEllipsis>{text}</TextEllipsis> },
    { title: '业务类型', dataIndex: 'billTypeStr', key: 'billTypeStr', width: 120, render:(text, record)=> (
      <>
        {text=='场景服务'?<TypeTags type="blue">{'场景服务'}</TypeTags>:''}
        {text=='营销投放'?<TypeTags type="orange">{'营销投放'}</TypeTags>:''}
        {text=='软件订阅'?<TypeTags type="purple">{'软件订阅'}</TypeTags>:''}
        {text=='增值服务'?<TypeTags type="yellow">{'增值服务'}</TypeTags>:''}
        {text=='集采服务'?<TypeTags type="green">{'集采服务'}</TypeTags>:''}
      </>
    )},
    { title: '分支机构', dataIndex: 'orgName', key: 'orgName', render: (text, record) =><span>{text || '-'}</span> },
    { title: '应付金额', dataIndex: 'adjustConfirmedAmount', key: 'adjustConfirmedAmount', align: 'right', render:(text, record) => <span>{text ? <MoneyFormat acc={2} prefix="￥">{text}</MoneyFormat> : "-"}</span> },
    { title: '发票状态', dataIndex: 'invoiceStatusStr', key: 'invoiceStatusStr', width: 110, render:(text, record)=> (
      <>
        {text=='已开票'?<StateBadge type="green">{'已开票'}</StateBadge>:''}
        {text=='部分开票'?<StateBadge type="yellow">{'部分开票'}</StateBadge>:''}
        {text=='未开票'?<StateBadge type="red">{'未开票'}</StateBadge>:''}
      </>
    )},
    { title: '已开票金额(元)', dataIndex: 'totalInvoiceAmount', key: 'totalInvoiceAmount', align: 'right', render:(text, record) => <span>{text ? <MoneyFormat acc={2} prefix="￥">{text}</MoneyFormat> : "-"}</span>  },
    { title: '发票数量', dataIndex: 'invoiceCount', key: 'invoiceCount',render:(text, record)=> <>{text || "-"}</>},
    { title: (<div>
      快递状态(张)&nbsp;
      <Tooltip placement="rightTop" title={'快递状态非实时更新，每日会更新一次或手动查询后更新'} arrowPointAtCenter='true'>
        <QuestionCircleOutlined style={{ color: "#333" }} />
      </Tooltip>
      </div>),render: (text,record) => {
      return <div className={style.item_text}>
        {
          record.toBeSendSum == 0 && record.inTransitSum == 0 && record.deliveredSum == 0 && record.returnPartSum == 0 ?
          '-'
          :
          <>
            {record.toBeSendSum != 0 ? <span>待寄出:{record.toBeSendSum}</span> :''}
            {record.inTransitSum != 0 ? <span>运送中:{record.inTransitSum}</span> :''}
            {record.deliveredSum != 0 ? <span>已送达:{record.deliveredSum}</span> :''}
            {record.returnPartSum != 0 ? <span>已退件:{record.returnPartSum}</span> :''}
          </>
        }
      </div>
    }, },
    { title: '付款状态', dataIndex: 'reciveStatusStr', key: 'reciveStatusStr' , width: 130, render:(text, record)=> (
      <>{
        text ?
        <>
          {text=='未付款'?<StateBadge type="red">{'未付款'}</StateBadge>:''}
          {text=='已付款'?<StateBadge type="green">{'已付款'}</StateBadge>:''}
          {text=='部分付款'?<StateBadge type="yellow">{'部分付款'}</StateBadge>:''}
        </>
        :'-'
        }
      </>
    )},
    { title: '已付金额', dataIndex: 'totalIncomeAmount', key: 'totalIncomeAmount', align: 'right', render:(text, record) => <span>{text ? <MoneyFormat acc={2} prefix="￥">{text}</MoneyFormat> : "-"}</span>  },
    { title: '应付余额', dataIndex: 'balancePayable', key: 'balancePayable', align: 'right', render:(text, record) => <span>{text ? <MoneyFormat acc={2} prefix="￥">{text}</MoneyFormat> : "-"}</span> },
    {
      title: '操作', dataIndex: 'option', key: 'option',
      render: (text, all) => option(text, all)
    }
  ]

  const option = (text, all) => {
    let invoiceDetail = () => {
      let queryInfo = form.getFieldsValue();
      savaQuery(queryInfo);
      history.push({
        pathname: '/payableInvoices/list/invoicesDetail',
        query: {
          billNo: all.billNo
        }
      })
    }
    let paymentDetail = () => {
      let queryInfo = form.getFieldsValue();
      savaQuery(queryInfo);
      history.push({
        pathname: '/payableInvoices/list/payableDetail',
        query: {
          billNo: all.billNo
        }
      })
    }
    return <ListTableBtns showNum={2}>
      <LtbItem onClick={invoiceDetail}>发票详情</LtbItem>
      <LtbItem onClick={paymentDetail}>付款详情</LtbItem>
    </ListTableBtns>
  }

  // 保存查询参数到state中，用于返回页面时回显
  let savaQuery = (queryInfo) => {
    dispatch({
      type: 'payableInvoicesModel/saveQuerySelect',
      payload: {
        queryInfo,
      },
    });
  }

  //表单提交
  const searchBtn = (val) => {
    setPayload({
      ...{
        pageNum: 1,
        pageSize: 10
      }
    })
  }

  //表单重置
  const resetBtnEvent = () => {
    form.resetFields();
    setPayload({
      ...{
        pageNum: 1,
        pageSize: 10
      }
    })
  }

  //分页切换
  const pageChange = (current, pageSize) => {
    // setCurrent(current);
    // setPageSize(pageSize);
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = current
    this_payload.pageSize = pageSize
    setPayload(this_payload)
  }

  return (
    <>
      <div className={style.block__cont}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtn} onReset={resetBtnEvent}>
          <Form.Item label="账单编号" name="billNo" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="账单月份：" name='balancePeriod' labelCol={{ flex: '0 0 120px' }}>
            <RangePicker style={{ width: '100%' }} picker="month" placeholder={['开始月份', '结束月份']} />
          </Form.Item>
          <Form.Item label="业务类型：" name="billType" labelCol={{ flex: '0 0 120px' }}>
            <Select allowClear showSearch placeholder="不限" optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              {
                businessTypeArr && businessTypeArr.map((v) => <Option key={v.value} value={v.value}>{v.name}</Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item label="账单名称" name="billName" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" />
          </Form.Item>              
          <Form.Item label="付款状态：" name="reciveStatus" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限" showSearch allowClear optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }>
              <Option value={0}>未付款</Option>
              <Option value={1}>已付款</Option>
              <Option value={2}>部分付款</Option>
            </Select>
          </Form.Item>
          <Form.Item label="发票状态：" name="invoiceStatus" labelCol={{ flex: '0 0 120px' }}>
            {/* 0未开票，1已开票，2部分开票，3已申请 */}
            <Select allowClear placeholder="不限">
              {/* <Option value={0}>未开票</Option> */}
              <Option value={1}>已开票</Option>
              <Option value={2}>部分开票</Option>
              <Option value={3}>未开票</Option>
            </Select>
          </Form.Item>
            {
              isOrgIdList.length> 0?
                <Form.Item name="orgId" className={style.form_by_fn} labelCol={{ flex: '0 0 120px' }} label="分支机构" >
                  <Cascader options={isOrgIdList} placeholder="请选择分支机构" showSearch onSearch={value => console.log(value)} changeOnSelect />
                </Form.Item>: null
            }
           </QueryFilter>
      </div>
      <div className={style.table_block}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
            {/* <Button onClick={listExport} type="primary">导出</Button> */}
          </Space>
        </ListTitle>
        <ListTable showPagination current={payload.pageNum} pageSize={payload.pageSize} total={payableInvoiceTotal} onChange={pageChange}>
          <Table columns={showColumn} dataSource={payableInvoiceList} scroll={{ x: 1600 }} pagination={false} />
        </ListTable>
      </div>
    </>
  )
}

export default connect(({ payableInvoicesModel }) => ({
  payableInvoiceList: payableInvoicesModel.payableInvoiceList,
  payableInvoiceTotal: payableInvoicesModel.payableInvoiceTotal,
  businessTypeArr: payableInvoicesModel.businessTypeArr,
  saveQuerySelect: payableInvoicesModel.saveQuerySelect
}))(payableInvoicesPage)