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
  DatePicker,
  Modal,
  message,
} from "antd"
import style from "./style.less"
const { Option } = Select
const { RangePicker } = DatePicker
import CompAuthControl from '@/components/Authorized/CompAuthControl'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import CardDetailModal from "./modal/cardDetailModal"
import 'moment/locale/zh-cn';
import { QueryFilter } from '@ant-design/pro-form';
import {
  ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,
} from "@/components/commonComp/index";
const { Column } = Table;
moment.locale('zh-cn')
const cardDetailListPage = (props) => {
  let { dispatch, pageTotal, list, categoryList, cardSources, cardTypes, fileCode } = props,
    [form] = Form.useForm(),
    [pageSize, setPageSize] = useState(10),
    [first, setFirst] = useState(true),
    [pageNo, setPage] = useState(1),
    [objectId, setObjectId] = useState([]),//删除时候用到的主键ID
    [isModalDelVisible, setIsModalDelVisible] = useState(false),//删除弹框显示
    [currentInfo, setCurrentInfo] = useState({}),//点击的当前数据
    [sonListVisible, setSonListVisible] = useState(false),// 子列表弹框
    [delSign, setDelSign] = useState(""),
    [payload, setPayload] = useState({
      cardType: null,
      identityNo: null,
      cardSource: null,
      bsoPolicyNo: null,
      customerName: null,
      cardCategory: null,
      customerPhone: null,
      scEffectiveEnd: null,
      scEffectiveStart: null,
      plateNo: null,
      vinNo: null,
      policyNo: null,
      pageInfo: {
        pageNo,
        pageSize,
      }
    })

  useEffect(() => {
    /*获取 筛选下拉数据*/
    dispatch({
      type: 'cardDetailList/getQueryList',
      payload: {
        method: 'postJSON',
        params: {}
      },
    })
  }, [])

  /*回调*/
  useEffect(() => {
    getList()
  }, [payload])

  /*获取列表*/
  let getList = () => {
    dispatch({
      type: 'cardDetailList/getList',
      payload: {
        method: 'postJSON',
        params: payload
      },
    })
  }

  /*获取 卡券导出code*/
  let getExcelCode = () => {
    let load = JSON.parse(JSON.stringify(payload))
    delete load.pageInfo
    dispatch({
      type: 'cardDetailList/onImportExcelCode',
      payload: {
        method: 'postJSON',
        params: { ...load }
      },
    })
  }
  useEffect(() => {
    if (fileCode) {
      onImportExcel()
    }
  }, [fileCode])
  let onImportExcel = () => {
    dispatch({
      type: 'cardDetailList/onImportExcelFile',
      payload: {
        method: 'getDownloadExcel',
        params: { fileCode }
      },
      callback: (res) => {
        const url = window.URL.createObjectURL(new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '卡券明细.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        dispatch({
          type: 'cardDetailList/onReset'
        })
      }
    })
  }
  let renderColumns = () => {
    return (
      [{
        title: '卡券ID',
        width: 150,
        align: 'left',
        fixed: 'left',
        dataIndex: 'poolDetailId',
        render: (text, all) => grantDetail(text, all),
      }, {
        title: '卡券名称',
        width: 200,
        align: 'left',
        dataIndex: 'scName',
      }, {
        title: '卡券品类',
        width: 200,
        align: 'left',
        dataIndex: 'scCategoryName',
        render: (name) => {
          return <span>{name ? name : '-'}</span>
        },
      }, {
        title: '卡券形式',
        width: 100,
        align: 'left',
        dataIndex: 'scTypeName',
        render: (scTypeName, scTypeInfo) => {
          let toRentCarType = null;
          if (scTypeInfo.scType == 1) {
            toRentCarType = <TypeTags type="yellow">{scTypeName}</TypeTags>
          } else if (scTypeInfo.scType == 2) {
            toRentCarType = <TypeTags type="green">{scTypeName}</TypeTags>
          } else if (scTypeInfo.scType == 3) {
            toRentCarType = <TypeTags type="orange">{scTypeName}</TypeTags>
          } else if (scTypeInfo.scType == 4) {
            toRentCarType = <TypeTags type="red">{scTypeName}</TypeTags>
          } else if (scTypeInfo.scType == 5) {
            toRentCarType = <TypeTags color="#142ff1">{scTypeName}</TypeTags>
          }
          return <span>{toRentCarType ? toRentCarType : '-'}</span>
        },
      }, {
        title: '卡券来源',
        width: 100,
        align: 'left',
        dataIndex: 'sourceTypeName',
        render: (name) => {
          return <span>{name ? name : '-'}</span>
        },
      }, {
        title: '卡券面值',
        width: 100,
        align: 'left',
        dataIndex: 'scAmount',
        render: (name) => {
          return <span>{name ? name : '-'}</span>
        },
      }, {
        title: '卡券状态',
        width: 100,
        align: 'left',
        dataIndex: 'cpdStatusName',
        render: (cpdStatusName, renders) => {
          let toorderStatusName = '-';
          if (cpdStatusName == '--') {
            toorderStatusName = <span>-</span>
          } else if (cpdStatusName == '已领取') {
            toorderStatusName = <StateBadge color="#FF4A1A">{cpdStatusName}</StateBadge>
          } else if (cpdStatusName == '已过期') {
            toorderStatusName = <StateBadge color="#C91132">{cpdStatusName}</StateBadge>
          } else if (cpdStatusName == '已发放') {
            toorderStatusName = <StateBadge status="success">{cpdStatusName}</StateBadge>
          } else if (renders.cpdStatus == 4) {
            toorderStatusName = <StateBadge color="#142ff1">{cpdStatusName}</StateBadge>
          } else if (renders.cpdStatus == 5) {
            toorderStatusName = <StateBadge color="#FF724D">{cpdStatusName}</StateBadge>
          } else if (renders.cpdStatus == 7) {
            toorderStatusName = <StateBadge color="#6591EB">{cpdStatusName}</StateBadge>
          } else if (renders.cpdStatus == 8) {
            toorderStatusName = <StateBadge color="#333">{cpdStatusName}</StateBadge>
          } else {
            toorderStatusName = <span>-</span>
          }
          return cpdStatusName ? toorderStatusName : <span>-</span>;
        },
      }, {
        title: '微信openid',
        width: 200,
        align: 'left',
        dataIndex: 'openId',
        render: (name) => {
          return <span>{name ? name : '-'}</span>
        },
      }, {
        title: '手机号',
        width: 140,
        align: 'left',
        dataIndex: 'customerPhone',
        render: (name) => {
          return <span>{name ? name : '-'}</span>
        },
      }, {
        title: '用户姓名',
        width: 160,
        align: 'left',
        dataIndex: 'customerName',
        render: (name) => {
          return <span>{name ? name : '-'}</span>
        },
      }, {
        title: '身份证号',
        width: 200,
        align: 'left',
        dataIndex: 'identityNo',
        render: (name) => {
          return <span>{name ? name : '-'}</span>
        },
      }, {
        title: '卡券生效日期',
        width: 150,
        align: 'left',
        dataIndex: 'cpdEffectiveStart',
        render: (text) => {
          return <ListTableTime>{moment(text).format('YYYY-MM-DD')}</ListTableTime>
        }
      }, {
        title: '发放标识',
        width: 200,
        align: 'left',
        dataIndex: 'bsoPolicyNo',
      }, {
        title: '操作',
        width: 140,
        align: 'left',
        fixed: 'right',
        dataIndex: '',
        render: (record) => Operation(record)
      },]
    )
  }

  //操作组件
  const Operation = (record) => {
    // 状态为启用 显示编辑 禁用  状态为禁用显示 启用编辑删除
    return <div className={style.click_blue}>
      {
        record.displayBtn ? <span onClick={() => { delCode(record) }}>删除</span> : ""
      }

    </div>
  }

  // 点击详情
  const grantDetail = (text, all) => {
    return <a onClick={() => { sonList(text, all) }}>{text}</a>
  }

  // 卡券投放展开子列表
  let sonList = (text, all) => {
    setSonListVisible(true);
    setCurrentInfo(all);
  }

  //删除获客码
  let delCode = (record) => {
    setIsModalDelVisible(true)
    setObjectId(record.poolDetailId)
    setDelSign(record.delSign)
    console.log(record.delSign)
  }

  let deleteQrGuide = () => {
    console.log(delSign)
    dispatch({
      type: 'cardDetailList/deleteCouponDetail',
      payload: {
        method: 'post',
        params: {
          couponDetailId: objectId,
          delSign: delSign,
        },
      },
      callback: res => {
        setFirst(false)
        if (res.result.code == '0') {
          message.success(res.result.message)
          setIsModalDelVisible(false)
          getList()
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  /*清空内容*/
  let resetBtnEvent = () => {
    setFirst(false)
    form.resetFields()
    let data = {
      cardType: null,
      identityNo: null,
      cardSource: null,
      bsoPolicyNo: null,
      customerName: null,
      cardCategory: null,
      customerPhone: null,
      scEffectiveEnd: null,
      scEffectiveStart: null,
      plateNo: null,
      vinNo: null,
      policyNo: null,
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
    setFirst(false)
    let scEffectiveEnd = e.scEffective ? moment(e.scEffective[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : null
    let scEffectiveStart = e.scEffective ? moment(e.scEffective[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : null
    let data = {
      ...e,
      scEffectiveEnd,
      scEffectiveStart,
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
    setFirst(false)
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
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtnEvent} onReset={resetBtnEvent}>
          <Form.Item label="姓名：" name="customerName" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="手机号：" name="customerPhone" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="身份证号：" name="identityNo" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="卡券品类：" name="cardCategory" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限">
              {
                categoryList.map((item, key) => {
                  return <Option key={key} value={item.value}>{item.name}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="卡券形式：" name="cardType" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限">
              {
                cardTypes.map((item, key) => {
                  return <Option key={key} value={item.value}>{item.name}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="卡券来源：" name="cardSource" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限">
              {
                cardSources.map((item, key) => {
                  return <Option key={key} value={item.value}>{item.name}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="卡券名称：" name="scName" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="发放标识：" name="bsoPolicyNo" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="卡券生效日期：" name="scEffective" labelCol={{ flex: '0 0 120px' }}>
            <RangePicker locale={locale} placeholder={['开始时间', '结束时间']} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="车牌号：" name="plateNo" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="车架号：" name="vinNo" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="保单号：" name="policyNo" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" />
          </Form.Item>
        </QueryFilter>
      </div>
      <div className={style.block__cont__t}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
            <Button type="primary" onClick={getExcelCode}>导出</Button>
          </Space>
        </ListTitle>
        <ListTable showPagination current={pageNo} pageSize={pageSize} total={pageTotal}
          onChange={pageChange}
        >
          <Table columns={renderColumns()} dataSource={list} scroll={{ x: 1600 }} pagination={false} />
        </ListTable>
      </div>
      <div>
        <Modal title="删除" visible={isModalDelVisible} onOk={deleteQrGuide} onCancel={() => { setIsModalDelVisible(false) }}>
          确认删除吗？
        </Modal>
      </div>

      {/* 查看详情弹框 */}
      {
        sonListVisible ?
          <CardDetailModal sonListVisible={sonListVisible}
            currentInfo={currentInfo}
            closeModal={() => { setSonListVisible(false) }}
          />
          : ''
      }

    </div>
  )
};
export default connect(({ cardDetailList }) => ({
  list: cardDetailList.list,
  fileCode: cardDetailList.fileCode,
  pageTotal: cardDetailList.pageTotal,
  cardTypes: cardDetailList.cardTypes,
  cardSources: cardDetailList.cardSources,
  categoryList: cardDetailList.categoryList,
}))(cardDetailListPage)
