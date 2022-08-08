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
  Cascader,
  Tag
} from "antd"
import { QueryFilter, ProFormText, ProFormDatePicker, ProFormCascader, ProFormDateRangePicker, ProFormSelect } from '@ant-design/pro-form';
import style from "./style.less"
const { Option } = Select
const { RangePicker } = DatePicker
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import ComboModal from './component/comboModal'
import InputModal from './component/inputModal'
import 'moment/locale/zh-cn'
import { downloadFile } from '@/utils/utils'
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";
moment.locale('zh-cn')
const rescueOrderListPage = (props) => {

  const dateFormat = 'YYYY-MM-DD HH:mm:ss';

  let reportTimeEnd = moment().format('YYYY-MM-DD 23:59:59')
  let reportTimeStart = moment().add(-90, 'day').format('YYYY-MM-DD 00:00:00')

  let { dispatch, pageTotal, list, provinceList, cityList, regionList,
    serviceTypeList, serviceItemList, channelList } = props,
    [form] = Form.useForm(),
    [pageSize, setPageSize] = useState(10),
    [pageNum, setPage] = useState(1),
    [payload, setPayload] = useState({
      pageNum,
      pageSize,
      channelId: localStorage.getItem('tokenObj') && JSON.parse(localStorage.getItem('tokenObj')).channelId || '',
      reportTimeEnd,
      reportTimeStart
    }),
    [parentId, setParentId] = useState(null), //省id
    [cityId, setCityId] = useState(null), //市id
    [regionId, setRegionId] = useState(null), //地区id
    [comboVisible, setComboVisible] = useState(false), // 是否展示弹窗
    [inputVisible, setInputVisible] = useState(false), // 是否展示输入弹窗
    [cancelVisible, setCancelVisible] = useState(false), // 取消二次确认弹窗
    [cancelNo, setCancelNo] = useState(null), // 两种不同取消确认弹窗
    [editNo, setEditNo] = useState(''), //新增1、编辑2
    [caseId, setCaseId] = useState(''), //订单编号
    [inputNo, setInputNo] = useState(''), //催促1、备注2
    [keyValue, setKeyValue] = useState(true)

  const [areaList, setAreaList] = useState([]);
  //初始化省列表
  useEffect(() => {
    let list = provinceList.map((item) => {
      return {
        ...item,
        value: item.id,
        label: item.codeDesc,
        flag: 2,
        isLeaf: false,
      }
    });
    setAreaList(list);
  }, [provinceList])
  /*订单来源*/
  let OrderSourceArr = [{
    id: 0,
    title: '后台'
  }, {
    id: 1,
    title: '用户'
  }, {
    id: 2,
    title: '系统'
  }
  ]

  useEffect(() => {
    /*渠道列表*/
    dispatch({
      type: 'orderPublic/getChannelList',
      payload: {
        method: 'postJSON',
        params: {
          pageNum: 1,
          pageSize: 9999999,
        }
      },
    })
    dispatch({
      type: 'rescueOrderDetail/onReset',
    })
    dispatch({
      type: 'orderPublic/onReset',
      flag: 2
    })
    dispatch({
      type: 'orderPublic/onReset',
      flag: 3
    })
    dispatch({
      type: 'orderPublic/onReset',
      flag: 5
    })
  }, [])
  /*回调*/
  useEffect(() => {
    getList()
  }, [pageNum, pageSize, payload])
  /*获取列表*/
  let getList = () => {
    let data = JSON.parse(JSON.stringify(payload))
    if (data.reportTime) {
      data.reportTimeStart = moment(data.reportTime[0]).endOf('day').format('YYYY-MM-DD 00:00:00')
      data.reportTimeEnd = moment(data.reportTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    }
    delete data.reportTime
    if (!keyValue) {
      data.reportTimeStart = null
      data.reportTimeEnd = null
    }
    dispatch({
      type: 'rescueOrderList/getList',
      payload: {
        method: 'postJSON',
        params: data
      },
    })
  }
  useEffect(() => {
    getConfigCode(1)
    getConfigCode(4)
  }, [])
  /*获取省份地区列表*/
  let getConfigCode = (flag, parentId, callback) => {
    /*1、省 2、市 3、区 4、服务类型 5、服务项目*/
    let temp = {}
    if (flag === 1 || flag === 2 || flag === 3) {
      temp = {
        name: 'TOR_REGION',
        clause: flag === 1 ? 'level=1' : 'parent_id=' + parentId
      }
    }
    if (flag === 4) {
      temp = {
        name: 'TOR_SERVICE_TYPE',
        pageType: 'display',
        from: 'rescueOrder'
      }
    }
    if (flag === 5) {
      temp = {
        name: 'TOR_SERVICE',
        clause: 'service_type_id=' + parentId
      }
    }

    dispatch({
      type: 'orderPublic/getConfigCode',
      payload: {
        method: 'get',
        params: temp
      },
      callback: (e) => {
        callback && callback(e);
      },
      flag
    })
  }
  let renderColumns = () => {
    return (
      [{
        title: '订单号',
        dataIndex: 'claimsCode',
        width: 170,
        fixed: 'left',
        render: (claimsCode, render) => operateRender(claimsCode, render)
      }, {
        title: '订单状态',
        width: 100,
        dataIndex: 'caseStatusStr',
        render: (caseStatusStr, record) => caseStatusRender(caseStatusStr, record)
      }, {
        title: '报案时间',
        width: 190,
        dataIndex: 'reportTime',
        render: (reportTime, render) => <ListTableTime>{reportTime}</ListTableTime>
      }, {
        title: '报案类型',
        width: 100,
        dataIndex: 'serviceTypeStr',
        render: (serviceTypeStr, record) => ServiceItemsType(serviceTypeStr, record)
      }, {
        title: '报案电话',
        width: 150,
        dataIndex: 'contactPhone',
      }, {
        title: '车牌号',
        width: 150,
        dataIndex: 'vehicleCode',
      }, {
        title: '车主姓名',
        width: 150,
        dataIndex: 'customerName',
      }, {
        title: '联系电话',
        width: 150,
        dataIndex: 'customerPhone',
      }, {
        title: '服务商',
        width: 150,
        dataIndex: 'providerName',
        render: (providerName) => <span>{providerName ? providerName : '-'}</span>
      }, {
        title: '预约时间',
        width: 190,
        dataIndex: 'reservationTime',
        render: (reservationTime, render) => <ListTableTime>{reservationTime}</ListTableTime>
      },
      {
        title: '订单来源',
        dataIndex: 'sourceFlagStr',
        width: 100,
        // render: (sourceFlagStr, record) => dataStatusShow(sourceFlagStr)
      },
      {
        title: '操作',
        width: 210,
        fixed: 'right',
        //1待派单2调度中3已接单4已取消5已到达6已检测7已签收8待评价9已完成10已改派11已拍照12已上传13未付款14退款中15已退款16空驶17已调度未接单18到达客户处19已取车20已交车21验车不通过
        render: (render) => (
          <ListTableBtns showNum={3}>
            { render.caseStatus == 1 ? <LtbItem onClick={() => setEdit(render)}>修改</LtbItem> : null }
            { render.caseStatus == 1 || render.caseStatus == 2 || render.caseStatus == 3 ? <LtbItem onClick={() => setUrge(render)}>催促</LtbItem> : null }
            { render.caseStatus == 1 || render.caseStatus == 2 || render.caseStatus == 3 || render.caseStatus == 5 || render.caseStatus == 6 ? <LtbItem onClick={() => setRemarks(render)}>备注</LtbItem> : null }
            { render.caseStatus == 1 || render.caseStatus == 2 ? <LtbItem onClick={() => setCancel(1, render)}>取消</LtbItem> : null }
            { render.caseStatus == 3 || render.caseStatus == 5 || render.caseStatus == 6 ? <LtbItem onClick={() => setCancel(2, render)}>取消</LtbItem> : null }
          </ListTableBtns>
        )

        // render: (render) => {
        //   return <div>
        //     {
        //       render.caseStatus == 1 ? <div>
        //         <span className={style.click_blue} onClick={() => setEdit(render)}>修改</span>
        //         <span className={style.click_blue} onClick={() => setUrge(render)}>催促</span>
        //         <span className={style.click_blue} onClick={() => setRemarks(render)}>备注</span>
        //         <span className={style.click_blue} onClick={() => setCancel(1, render)}>取消</span>
        //       </div>
        //         : render.caseStatus == 2 ? <div>
        //           <span className={style.click_blue} onClick={() => setUrge(render)}>催促</span>
        //           <span className={style.click_blue} onClick={() => setRemarks(render)}>备注</span>
        //           <span className={style.click_blue} onClick={() => setCancel(1, render)}>取消</span>
        //         </div>
        //           : render.caseStatus == 3 ? <div>
        //             <span className={style.click_blue} onClick={() => setUrge(render)}>催促</span>
        //             <span className={style.click_blue} onClick={() => setRemarks(render)}>备注</span>
        //             <span className={style.click_blue} onClick={() => setCancel(2, render)}>取消</span>
        //           </div>
        //             : render.caseStatus == 5 ? <div>
        //               <span className={style.click_blue} onClick={() => setRemarks(render)}>备注</span>
        //               <span className={style.click_blue} onClick={() => setCancel(2, render)}>取消</span>
        //             </div>
        //               : render.caseStatus == 6 ? <div>
        //                 <span className={style.click_blue} onClick={() => setRemarks(render)}>备注</span>
        //                 <span className={style.click_blue} onClick={() => setCancel(2, render)}>取消</span>
        //               </div>
        //                 : '-'  //其他状态
        //     }
        //   </div>
        // }
      }]
    )
  }

  // const dataStatusShow = (sourceFlagStr) => {
  //   if (sourceFlagStr == '后台') return <TypeTags type="blue">后台</TypeTags>
  //   if (sourceFlagStr == '系统') return <TypeTags type="orange">系统</TypeTags>
  //   if (sourceFlagStr == '用户') return <TypeTags type="purple">用户</TypeTags>
  //   if (sourceFlagStr == '') return <>-</>
  // }

  let setEdit = (render) => {
    setEditNo(2)
    setCaseId(render.id)
    setComboVisible(true)
  }
  let setUrge = (render) => {
    setInputNo(1)
    setCaseId(render.id)
    setInputVisible(true)
  }
  let setCancel = (code, render) => {
    setCancelVisible(true)
    setCaseId(render.id)
    setCancelNo(code)
  }
  let setRemarks = (render) => {
    setInputNo(2)
    setCaseId(render.id)
    setInputVisible(true)
  }

  /*操作*/
  let operateRender = (claimsCode, render) => {
    /*跳转详情*/
    let goToDetail = () => {
      history.push({
        pathname: '/order/rescueOrder/list/detail',
        state: {
          caseId: render.id
        }
      })
    }
    return <span className={style.click_blue} onClick={goToDetail}>{claimsCode}</span>
  }
  /*清空内容*/
  let resetBtnEvent = () => {
    setKeyValue(false);
    let reportTimeEnd = null
    let reportTimeStart = null
    form.resetFields()
    let data = {
      pageSize,
      pageNum: 1,
      channelId: localStorage.getItem('tokenObj') && JSON.parse(localStorage.getItem('tokenObj')).channelId || '',
      reportTimeEnd,
      reportTimeStart
    }
    setParentId(null)
    setCityId(null)
    setRegionId(null)
    setPage(1)
    setPayload(data)
    dispatch({
      type: 'orderPublic/onReset',
      flag: 2
    })
    dispatch({
      type: 'orderPublic/onReset',
      flag: 3
    })
    dispatch({
      type: 'orderPublic/onReset',
      flag: 5
    })
  }
  /*搜索按钮*/
  let searchBtnEvent = (e) => {
    let data = {
      ...e,
      cityId,
      parentId,
      regionId,
      pageSize,
      pageNum: 1,
      reportTimeEnd,
      reportTimeStart
    }
    setPage(1)
    setPayload(data)
  }

  //分页
  const pageChange=(page,pageSize)=>{
    let new_payload = JSON.parse(JSON.stringify(payload));
    new_payload.pageNum = page
    new_payload.pageSize = pageSize
    setPage(page)
    setPageSize(pageSize)
    setPayload(new_payload)
  }

  /*省change 联动地区接口*/
  let onProvinceChange = (e) => {
    setParentId(e[0])
    setCityId(e[1])
    setRegionId(e[2])
  }
  let loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (targetOption.flag > 3) {
      console.log(targetOption)
    } else {
      targetOption.loading = true;
      getConfigCode(targetOption.flag, targetOption.id, (res) => {
        console.log(res);
        if (res.body && res.body.length) {
          targetOption.loading = false;
          targetOption.children = res.body.map((item) => {
            return {
              ...item,
              value: item.id,
              label: item.codeDesc,
              flag: targetOption.flag + 1,
              isLeaf: targetOption.flag >= 3,
            }
          });
          setAreaList(JSON.parse(JSON.stringify(areaList)));
        }
      });
    }
  }
  /*市change 联动区接口*/
  let onCityChange = (e) => {
    if (e) {
      getConfigCode(3, e)
    }
    dispatch({
      type: 'orderPublic/onReset',
      flag: 3
    })
    setCityId(e)
    setRegionId(null)
  }
  /*区change*/
  let onRegionChange = (e) => {
    setRegionId(e)
  }
  /*服务类型change 联动服务项目接口*/
  let onServiceTypeChange = (e) => {
    if (e) {
      getConfigCode(5, e)
    }
    dispatch({
      type: 'orderPublic/onReset',
      flag: 5
    })
    form.resetFields(['serviceId'])
  }
  const setOnChangeTime = (e) => {
    if (!e) {
      reportTimeEnd = null,
        reportTimeStart = null
      setKeyValue(false)
    } else {
      setKeyValue(true)
    }
  }
  /*导出*/
  let setExport = () => {
    let data = JSON.parse(JSON.stringify(payload))
    if (data.reportTime) {
      data.reportTimeStart = moment(data.reportTime[0]).endOf('day').format('YYYY-MM-DD 00:00:00')
      data.reportTimeEnd = moment(data.reportTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    }
    delete data.reportTime
    if (!keyValue) {
      data.reportTimeStart = null
      data.reportTimeEnd = null
    }
    // let param = form.getFieldValue()
    // console.log(param)
    dispatch({
      type: 'rescueOrderList/getExportCaseList',
      payload: {
        method: 'postJSON',
        params: data,
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let fileId = res.body.fileId
          console.log(fileId)
          getFileLoad(fileId)
        }
      }
    })
  }

  let getFileLoad = (fileId) => {
    dispatch({
      type: 'billHandleModel/fileDownload',
      payload: {
        method: 'get',
        fileCode: fileId,
        responseType: 'blob',
      },
      callback: (res) => {
        if (res) {
          downloadFile(res, '救援列表.xlsx')
        }
      }
    })
  }
  /*新增救援订单*/
  let setAdd = () => {
    // setEditNo(1)
    // setComboVisible(true)
    history.push('/order/rescueOrder/list/createNewOrder')
  }

  /*设置弹窗回调*/
  let onCallbackSetSales = (e) => {
    if (e) {
      setComboVisible(false)
      getList()
    } else {
      setComboVisible(false)
    }
  }

  let onCallbackInput = (e) => {
    if (e) {
      setInputVisible(false)
      getList()
    } else {
      setInputVisible(false)
    }
  }

  let setConfirm = () => {
    setCancelVisible(false)
  }

  let setInputOk = () => {
    dispatch({
      type: "rescueOrderList/rescueOrderCancel",
      payload: {
        method: 'postJSON',
        params: {
          caseId: caseId
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          setCancelVisible(false)
          message.success('取消成功!')
          getList()
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  // 报案类型翻译
  let ServiceItemsType = (type, record) => {
    let num = Math.floor(Math.random()*10+1);
    if(record.serviceTypeId==1) return <TypeTags color="#2FB6E4">{type}</TypeTags>
    if(record.serviceTypeId==2) return <TypeTags color="#32D1AD">{type}</TypeTags>
    if(record.serviceTypeId==4) return <TypeTags color="#28CB6B">{type}</TypeTags>
    if(record.serviceTypeId==5) return <TypeTags color="#7545A7">{type}</TypeTags>
    if(record.serviceTypeId==13) return <TypeTags color="#C91132">{type}</TypeTags>
    if(record.serviceTypeId==14) return <TypeTags color="#FF4A1A">{type}</TypeTags>
    if(record.serviceTypeId==15) return <TypeTags color="#FFC500">{type}</TypeTags>
    
    if(record.serviceTypeId==18) return <TypeTags color="#4B7FE8">{type}</TypeTags>
    if(record.serviceTypeId==19) return <TypeTags color="#0084FF">{type}</TypeTags>
    if(record.serviceTypeId==16) return <TypeTags color="#AF52DE">{type}</TypeTags>

    if(num==1 || num==2) return <TypeTags color="#FF9500">{type}</TypeTags>
    if(num==3 || num==4) return <TypeTags color="#5E5CE6">{type}</TypeTags>
    if(num==5 || num==6) return <TypeTags color="#32D74B">{type}</TypeTags>
    if(num==7 || num==8) return <TypeTags color="#FF2D55">{type}</TypeTags>
    if(num==9) return <TypeTags color="#6236FF">{type}</TypeTags>
    if(num==10)return <TypeTags color="#FF3030">{type}</TypeTags>
  }

  // 救援状态翻译
  let caseStatusRender = (text, record) => {
    if(record.caseStatus==1 || record.caseStatus == 13 || record.caseStatus == 14) return <StateBadge color="#FF4A1A">{text}</StateBadge>
    if(record.caseStatus==2 || record.caseStatus == 3 || record.caseStatus == 5 || record.caseStatus == 6 || record.caseStatus == 10 || record.caseStatus == 11 || record.caseStatus == 12 || record.caseStatus == 17 || record.caseStatus == 18 || record.caseStatus == 19 || record.caseStatus == 20) return <StateBadge color="#2FB6E4">{text}</StateBadge>
    if(record.caseStatus==7 || record.caseStatus == 8 || record.caseStatus == 9 || record.caseStatus == 15 || record.caseStatus == 21) return <StateBadge color="#32D1AD">{text}</StateBadge>
    if(record.caseStatus==4 || record.caseStatus == 16 ) return <StateBadge color="#C91132">{text}</StateBadge>
  }

  return (
    <div>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtnEvent} onReset={resetBtnEvent}>
          <ProFormText name="claimsCode" label="订单号" labelCol={{ flex: '0 0 120px' }} />
          <ProFormText name="contactPhone" label="报案电话" labelCol={{ flex: '0 0 120px' }} />
          <ProFormText name="vehicleCode" label="车牌号" labelCol={{ flex: '0 0 120px' }} />
          <ProFormDateRangePicker format={dateFormat} name="reportTime" label="报案时间" labelCol={{ flex: '0 0 120px' }}
            locale={locale}
            style={{ width: '100%' }}
            placeholder={['开始时间', '结束时间']}
            initialValue={keyValue ? [moment(moment().add(-90, 'day'), dateFormat), moment(moment(), dateFormat)] : null}
            onChange={(e) => { setOnChangeTime(e) }} />
          <ProFormSelect name="serviceTypeId" label="服务类型" labelCol={{ flex: '0 0 120px' }} onChange={onServiceTypeChange}
            options={serviceTypeList.map((v) => {
              return { value: v.id, label: v.codeDesc }
            })}
          />
          <ProFormSelect name="serviceId" label="服务项目" labelCol={{ flex: '0 0 120px' }}
            options={serviceItemList.map((v) => {
              return { value: v.id, label: v.codeDesc }
            })}
          />
          <Form.Item name="area" label="报案地区" labelCol={{ flex: '0 0 120px' }}>
            <Cascader options={areaList} loadData={loadData} onChange={onProvinceChange} />
          </Form.Item>
          <ProFormSelect name="sourceFlag" label="订单来源" labelCol={{ flex: '0 0 120px' }}
            options={OrderSourceArr.map((v) => {
              return { value: v.id, label: v.title }
            })}
          />
          <ProFormText name="traceCode" label="来源工单号" labelCol={{ flex: '0 0 120px' }} />
        </QueryFilter>
      </div>

      <div className={style.list_box}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
            <Button onClick={() => { setExport() }}>导出</Button>
            <Button onClick={() => { setAdd() }} type="primary" >新建</Button>
          </Space>
        </ListTitle>
        <ListTable showPagination current={pageNum} pageSize={pageSize} total={pageTotal} onChange={pageChange}>
          <Table columns={renderColumns()} dataSource={list} pagination={false} scroll={{ x: 1200 }} />
        </ListTable>
      </div>

      <ComboModal        //组合弹窗；新增、编辑
        comboVisible={comboVisible}
        editNo={editNo}
        location={caseId}
        onCallbackSetSales={(flag) => onCallbackSetSales(flag)}
      />
      <InputModal        //订单催促、订单备注
        inputVisible={inputVisible}
        inputNo={inputNo}
        location={caseId}
        onCallbackInput={(flag) => onCallbackInput(flag)}
      />
      {/* 取消提示 */}
      {
        cancelNo == 1 ?
          <Modal title={<div className={style.block_header_title}>提示</div>} visible={cancelVisible} onOk={() => { setInputOk() }} onCancel={() => { setConfirm() }} centered={true}>
            <p style={{paddingLeft: '8px'}}>该订单正在加紧安排中，是否确认取消订单？</p>
          </Modal>
          :
          <Modal title={<div className={style.block_header_title}>提示</div>} visible={cancelVisible} onOk={() => { setInputOk() }} onCancel={() => { setConfirm() }} centered={true}>
            <p style={{paddingLeft: '8px'}}>该订单司机已出发，可能存在空驶费用，请联系壹路通客服取消该订单。</p>
          </Modal>
      }

    </div>
  )
};
export default connect(({ rescueOrderList, orderPublic, financeManageModel }) => ({
  list: rescueOrderList.list,
  cityList: orderPublic.cityList,
  regionList: orderPublic.regionList,
  channelList: orderPublic.channelList,
  pageTotal: rescueOrderList.pageTotal,
  provinceList: orderPublic.provinceList,
  serviceTypeList: orderPublic.serviceTypeList,
  serviceItemList: orderPublic.serviceItemList,
}))(rescueOrderListPage)
