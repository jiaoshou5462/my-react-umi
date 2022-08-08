import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import { Row, Col, Form, Modal, Select, Input, DatePicker, Button, Table, Space, ConfigProvider, Pagination, message } from "antd"
import style from "./style.less"
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import ModalBox from './components/modal'

import { QueryFilter} from '@ant-design/pro-form';

import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";

moment.locale('zh-cn');
const { confirm } = Modal
const { RangePicker } = DatePicker;
const obtainCodeGuestProps = (props) => {
  let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));
  let { dispatch } = props,
    [form] = Form.useForm()
    const [payload, setPayload] = useState({
    channelId: tokenObj.channelId,
    monitorFlag: '', // 渠道分类
    channelStatus: null,  //有效状态1:生效,0:失效,2:注销
    qrTitle: '',  //标题
    channelType: '',  //渠道类型
    createStartTime: '',   //开始时间
    createEndTime: '',    //结束时间
    pageSize: 10,
    pageNum: 1
  })
  const [superManager, setSuperManager] = useState(false)
  const [channelList, setChannelList] = useState([])
  const [channelTypeList, setChannelTypeList] = useState([])// 渠道类型
  const [monitorFlagList, setMonitorFlagList] = useState([])//渠道分类
  const [mdalInfo, setMdalInfo] = useState('')//新增编辑菜单
  const [list, setList] = useState([])//数据处理
  const [pageInfo, setPageInfo] = useState([])//分页器
  const [updateName, setUpdateName] = useState([])//操作名称
  const [objectId, setObjectId] = useState([])//删除时候用到的主键ID
  const [isModalDelVisible, setIsModalDelVisible] = useState(false)//删除弹框显示
  const [callList, setCallList] = useState(false)//重置


  //modal回调
  const callModal = (flag) => {
    setMdalInfo(null)
    if (flag) {
      setCallList(!callList)
      qrGuideList()
    }
  }

  //搜索条件
  useEffect(() => {
    customerChannelList(tokenObj.channelId)
    let formData = {
      channelId: tokenObj.channelId,
      monitorFlag: '', // 渠道分类
      channelStatus: null,  //有效状态1:生效,0:失效,2:注销
      qrTitle: '',  //标题
      channelType: '',  //渠道类型
      createStartTime: '',   //开始时间
      createEndTime: '',    //结束时间
      pageSize: 10,
      pageNum: 1
    }
    form.setFieldsValue(formData)
  }, [callList])

  useEffect(() => {
    // 列表查询
    qrGuideList()
  }, [payload])

  // 判断是否为超管
  let judgeIsSuperRole = () => {
    dispatch({
      type: 'obtainCodeGuest/judgeIsSuperRole',
      payload: {
        method: 'get',
      },
      callback: res => {

      }
    })
  }

  // 获客码列表
  let qrGuideList = () => {
    dispatch({
      type: 'obtainCodeGuest/qrGuideList',
      payload: {
        method: 'postJSON',
        params: payload
      },
      callback: res => {
        if (res.result.code == '0') {
          setList(res.body.data)
          setPageInfo(res.body.pageInfo)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }


  //渠道分类
  let getMonitorFlag = () => {
    dispatch({
      type: 'obtainCodeGuest/getMonitorFlag',
      payload: {
        method: 'post',
      },
      callback: res => {
        if (res.result.code == '0') {
          setMonitorFlagList(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }


  //渠道类型
  let getChannelType = () => {
    dispatch({
      type: 'obtainCodeGuest/getChannelType',
      payload: {
        method: 'post',
      },
      callback: res => {
        if (res.result.code == '0') {
          setChannelTypeList(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 渠道列表
  let customerChannelList = (channelId) => {
    dispatch({
      type: 'obtainCodeGuest/customerChannelList',
      payload: {
        method: 'get',
        params: {
          channelId: channelId,
        }
      },
      callback: res => {
        if (res.body.code == '000') {
          setChannelList(res.body.data.channelList)
        }
      }
    })
  }

  let customerRelationType = (text, record) => {
    let textName = ''
    if (text == 1) {
      textName = '绑定'
    } else if (text == 2) {
      textName = '关注'
    } else if (text == 6) {
      textName = '注册'
    } else if (text == 7) {
      textName = '其他扫码'
    } else if (text == 8) {
      textName = '企微二维码'
    }
    return <span>{textName}</span>
  }
  // 0 保险公司 1 4S汽车商 2 网络平台 3 其它
  let channelType = (text) => {
    let textName = ''
    if (text == 0) {
      textName = '保险公司'
    } else if (text == 1) {
      textName = '4S汽车商'
    } else if (text == 2) {
      textName = '网络平台'
    } else if (text == 3) {
      textName = '其它'
    }
    return <span>{textName}</span>
  }
  // 渠道分类:1:壹路通自营渠道2:平台渠道3:服务商自建渠道4:测试渠道
  let monitorFlag = (text) => {
    let textName = ''
    if (text == 1) {
      textName = '壹路通自营渠道'
    } else if (text == 2) {
      textName = '平台渠道'
    } else if (text == 3) {
      textName = '服务商自建渠道'
    } else if (text == 4) {
      textName = '测试渠道'
    }
    return <span>{textName}</span>
  }
  // 1:生效,0:失效,2:注销
  let channelStatus = (text) => {
    if (text == 1) return <StateBadge status="success">生效</StateBadge>
    if (text == 0) return <StateBadge color="#FFC500">失效</StateBadge>
    if (text == 2) return <StateBadge type="red" >注销</StateBadge>
  }
  //列表字段
  let renderColumns = () => {
    return (
      [{
        title: '客户名称',
        dataIndex: 'channelName',
        width: 80,
        fixed: 'left',
      }, {
        title: '客户分类',
        dataIndex: 'monitorFlag',
        width: 90,
        render: (text) => { return monitorFlag(text) }
      },
      {
        title: '有效状态',
        dataIndex: 'channelStatus',
        width: 60,
        render: (text) => { return channelStatus(text) }
      },
      {
        title: '客户类型',
        dataIndex: 'channelType',
        width: 80,
        render: (text) => { return channelType(text) }
      }, {
        title: '标题',
        dataIndex: 'qrTitle',
        width: 120,
        render: (qrDesc) =>  <TextEllipsis>{qrDesc}</TextEllipsis>
      }, {
        title: '描述',
        dataIndex: 'qrDesc',
        width: 100,
        render: (qrDesc) =>  <TextEllipsis>{qrDesc}</TextEllipsis>
      }, {
        title: 'URL/关联公众号',
        dataIndex: 'qrUrl',
        width: 130,
        render: (qrUrl) => <span>{qrUrl || '--'}</span>
      }, {
        title: '默认显示',
        dataIndex: 'isDefault',
        width: 60,
        render: (text, record) => { return text == 0 ? <span>否</span> : <span>是</span> }
      }, {
        title: '客户所属状态',
        dataIndex: 'customerRelationType',
        width: 90,
        render: (text, record) => { return customerRelationType(text, record) }
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 90,
        render: (text, record) => <ListTableTime>{text}</ListTableTime>
      }, {
        title: '操作',
        dataIndex: '',
        width: 120,
        fixed: 'right',
        render: (text, record) => Operation(text, record)
      }]
    )
  }

  //编辑打开弹框
  let editCode = (record) => {
    setMdalInfo({ modalName: 'edit', objectId: record.objectId })
  }


  //删除获客码
  let delCode = (record) => {
    setIsModalDelVisible(true)
    setObjectId(record.objectId)
  }

  let deleteQrGuide = () => {
    dispatch({
      type: 'obtainCodeGuest/deleteQrGuide',
      payload: {
        method: 'get',
        params: {
          objectId: objectId,
        }
      },
      callback: res => {
        if (res.result.code == '0') {
          message.success(res.result.message)
          setIsModalDelVisible(false)
          setPayload({
            channelId: tokenObj.channelId,
            pageNum:1,
            pageSize:10
          })
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  //操作组件
  const Operation = (text, record) => {
    // 状态为启用 显示编辑 禁用  状态为禁用显示 启用编辑删除
    return <ListTableBtns showNum={3}>
      <LtbItem onClick={() => { editCode(record) }}>编辑</LtbItem>
      <LtbItem onClick={() => { delCode(record) }}>删除</LtbItem>
    </ListTableBtns>

  }
  //重置
  let resetBtnEvent = (value) => {
    setPayload({
      pageNum: 1,
      pageSize: 10
    })
    form.resetFields();
    setCallList(!callList)
  }
  //提交
  let searchBtnEvent = (value) => {
    let copy = JSON.parse(JSON.stringify(value))
    if (value.createStartTime) {
      copy.createStartTime = moment(value.createStartTime[0]).format('YYYY-MM-DD')
      copy.createEndTime = moment(value.createStartTime[1]).format('YYYY-MM-DD')
    }
    copy.pageNum = 1
    copy.pageSize = 10
    setPayload(copy)
  }

  //分页
  const pageChange=(page,pageSize)=>{
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = page
    this_payload.pageSize = pageSize
    setPayload(this_payload)
  }

  return (
    <>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtnEvent} onReset={resetBtnEvent}>
          <Form.Item label="客户名称" name="channelId" labelCol={{ flex: '0 0 120px' }}>
            <Select showSearch notFoundContent='暂无数据' placeholder="请输入" optionFilterProp="children" disabled >
              {
                channelList && channelList.length ? channelList.map((item, key) => <Option checked key={key} value={item.id}>{item.channelName}</Option>) : ''
              }
            </Select>
          </Form.Item>
          <Form.Item label="有效状态" name="channelStatus" labelCol={{ flex: '0 0 120px' }}>
            <Select showSearch placeholder="请输入" >
              <option value={1}>生效</option>
              <option value={0}>失效</option>
              <option value={2}>注销</option>
            </Select>
          </Form.Item>
          <Form.Item label="标题" name="qrTitle" labelCol={{ flex: '0 0 120px' }}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="创建日期" name="createStartTime" labelCol={{ flex: '0 0 120px' }}>
            <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </QueryFilter>
      </div>

      <div className={style.list_box}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
            <Button type="primary" onClick={() => { setMdalInfo({ modalName: 'add' }) }}>新增</Button>
          </Space>
        </ListTitle>
        <ListTable showPagination current={pageInfo.pageNo} pageSize={pageInfo.pageSize} total={pageInfo.totalCount} onChange={pageChange}>
          <Table scroll={{ x: 1200 }} columns={renderColumns()} dataSource={list} pagination={false} />
        </ListTable>
      </div>

      <Modal title="删除" visible={isModalDelVisible} onOk={deleteQrGuide} onCancel={() => { setIsModalDelVisible(false) }}>
        确认删除吗？
      </Modal>
      {mdalInfo ? <ModalBox mdalInfo={mdalInfo} toFatherValue={(flag) => callModal(flag)} /> : ''}
    </>

  )
};
export default connect(({ obtainCodeGuest }) => ({

}))(obtainCodeGuestProps)


