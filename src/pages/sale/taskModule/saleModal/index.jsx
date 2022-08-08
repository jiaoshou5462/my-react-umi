import React,{useEffect, useState} from "react"
import { connect, history } from 'umi'
import 'swiper/swiper.less';
import "swiper/swiper-bundle.css"
import {
  Form,
  Alert,
  Modal,
  Table,
  Select,
  message,
  Checkbox,
  Pagination,
  ConfigProvider,
  Input
} from "antd"
import { QueryFilter} from '@ant-design/pro-form';
import style from "./style.less"
import moment from 'moment'
import 'moment/locale/zh-cn'
import zh_CN from "antd/lib/locale-provider/zh_CN";
moment.locale('zh-cn')

let { Option } = Select
let bindWorkArr = [{
  id: 1,
  title: '是',
}, {
  id: 2,
  title: '否',
}]
const saleModalPage =(props)=>{
  let {dispatch, list, pageTotal, taskId, channelId, saleModalFlag, storeList, teamList, saleVisible, onSaleModalCallback} = props
  let [form] = Form.useForm()
  let [visible, setVisible] = useState(false)
  let [allStatus, setAllStatus] = useState(false) //是否全部选中
  let [checkNum, setCheckNum] = useState(0) //选中条数
  let [branchId, setBranchId] = useState('') //门店id
  let [saleCheckList, setSaleCheckList] = useState([]) //选中的销售
  let [saleCheckKeyList, setSaleCheckKeyList] = useState([]) //选中的销售key
  let [pageSize, setPageSize] = useState(10)
  let [pageNo, setPage] = useState(1)
  let [payload, setPayload] = useState({
    taskId,
    channelId,
    isDel: saleModalFlag,
    pageInfo: {
      pageNo,
      pageSize,
    }
  })
  useEffect(() => {
    setVisible(saleVisible)
    if(saleVisible){
      getBranchList()
    }
  },[saleVisible])
  /*回调*/
  useEffect(()=>{
    if(taskId && channelId){
      getList()
    }
    setCheckNum(0)
    setSaleCheckList([])
    setSaleCheckKeyList([])
  },[taskId, channelId, pageNo, pageSize, payload])
  // 查询销售列表
  let getList = () => {
    dispatch({
      type:'saleModal/getList',
      payload: {
        method: 'postJSON',
        params: payload
      }
    })
  }
  // 获取门店list
  let getBranchList = () => {
    dispatch({
      type: 'salesManageModel/getBranchInfo',
      payload: {
        method: 'get',
        params: {},
        channelId
      }
    });
  }
  /*门店change*/
  let onBranchChange = (e, record) => {
    if(record && record.key){
      let key = Number(record.key)
      let temp = storeList[key].branchid
      form.resetFields(['teamId'])
      setBranchId(temp)
    }else {
      setBranchId('')
    }
  }
  useEffect(() => {
    if(branchId){
      getTeamList()
    }
  },[branchId])

  // 获取团队list
  let getTeamList = () => {
    dispatch({
      type: 'salesManageModel/getTeamInfo',
      payload: {
        method: 'get',
        params: {},
        branchId
      }
    })
  }

  /*是否选择全部*/
  let onAllChange = (e) => {
    let status = e.target.checked
    setAllStatus(status)
    setSaleCheckList([])
    setSaleCheckKeyList([])
    setCheckNum(status ? pageTotal : 0)
  }
  /*搜索*/
  let onSearch = (e) => {
    let data = {
      ...payload,
      teamId: e.teamId,
      branchId: e.branchId,
      saleName: e.saleName,
      isBindWork: e.isBindWork,
      pageInfo: {
        pageSize,
        pageNo: 1,
      }
    }
    setPage(1)
    setPayload(data)
  }
  /*重置*/
  let onReset = () => {
    form.resetFields()
    let data = {
      ...payload,
      teamId: '',
      branchId: '',
      saleName: '',
      isBindWork: '',
      pageInfo: {
        pageSize,
        pageNo: 1,
      }
    }
    setPage(1)
    setPayload(data)
  }
  /*列表数组*/
  let renderColumns = () => {
    return (
        [{
          title: '门店',
          dataIndex: 'branchName',
          align: 'center',
        }, {
          title: '团队',
          align: 'center',
          dataIndex: 'teamName',
        }, {
          title: '销售名称',
          align: 'center',
          dataIndex: 'saleName',
        }, {
          title: '销售账号',
          align: 'center',
          dataIndex: 'saleId',
        }, {
          title: '是否绑定企微',
          dataIndex: 'isBindWork',
          render: (isBindWork) =>{
            return <span>{isBindWork === 1 ? '是' : '否'}</span>
          }
        }]
    )
  }
  /*列表选中配置*/
  const rowSelection = {
    onChange: (key, value) => {
      setSaleCheckKeyList(key)
      setSaleCheckList(value || [])
      setCheckNum(value.length || 0)
    },
    type: 'checkbox',
    selectedRowKeys: saleCheckKeyList
  }
  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) =>{
    payload.pageInfo.pageNo = page
    setPage(page)
    setPageSize(pageSize)
    setPayload(payload)
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
    let totalPage = Math.ceil(total / pageSize)
    return `共 ${total} 条记录 第 ${pageNo} / ${totalPage || 1}  页`
  }
  /*确定*/
  let onOk = () => {
    if(saleCheckList.length > 0 || allStatus){
      let tempIdArr = []
      saleCheckList.map(item => {
        tempIdArr.push(item.id)
      })
      if(!saleModalFlag){
        //添加
        addModalSale(tempIdArr)
      }else {
        //删除
        onDelSale(tempIdArr)
      }
    }else {
      message.info('请选择销售')
    }

  }
  // 添加销售
  let addModalSale = (tempIdArr) => {
    let temp = {
      taskId,
      channelId,
      allAdd: allStatus,
      teamId: form.getFieldValue('teamId'),
      branchId: form.getFieldValue('branchId')
    }
    if(!allStatus){
      temp.saleId = tempIdArr
    }
    dispatch({
      type:'saleModal/addModalSale',
      payload: {
        method: 'postJSON',
        params: temp,
      },
      callback: (res) => {
        if(res.result.code === '0') {
          message.success('操作成功')
          onSaleModalCallback(1)
        }
      }
    })
  }
  // 删除销售
  let onDelSale = (tempIdArr) => {
    let temp = {
      teamId: form.getFieldValue('teamId'),
      branchId: form.getFieldValue('branchId'),
    }
    if(allStatus){
      temp.taskId = taskId
    }else {
      temp.id = tempIdArr
    }
    dispatch({
      type:'saleDistribution/deleteTaskId',
      payload: {
        method: 'postJSON',
        params: temp,
      },
      callback: res => {
        if(res.result.code === '0') {
          message.success('操作成功')
          onSaleModalCallback(1)
        }
      }
    })
  }
  /*取消*/
  let onCancel = () => {
    onSaleModalCallback(0)
  }
  return <>
    <Modal
        width={1130}
        onOk={onOk}
        okText='确定'
        title={!saleModalFlag ? '添加员工' : '批量移除员工'}
        cancelText='取消'
        closable={false}
        visible={visible}
        onCancel={onCancel}
        maskClosable={false}
    >
      <div>
        <div className={style.block__cont}>
          <QueryFilter form={form} defaultCollapsed onFinish={onSearch} onReset={onReset}>
            <Form.Item label="所属门店" name="branchId" labelCol={{ flex: '0 0 120px' }}>
              <Select placeholder="不限" showSearch allowClear onChange={onBranchChange}>
                {
                  storeList.length > 0 ? storeList.map((item, key) => {
                    return <Option key={key} value={item.objectId}>{item.depname}</Option>
                  }) : null
                }
              </Select>
            </Form.Item>
            <Form.Item label="所属团队" name="teamId" labelCol={{ flex: '0 0 120px' }}>
              <Select placeholder="请选择团队" showSearch allowClear>
                {
                  teamList.length > 0 ? teamList.map((item, key) => {
                    return <Option key={key} value={item.objectId}>{item.teamName}</Option>
                  }) : null
                }
              </Select>
            </Form.Item>
            <Form.Item label="销售名称" name="saleName" labelCol={{ flex: '0 0 120px' }}>
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="是否绑定企微" name="isBindWork" labelCol={{ flex: '0 0 120px' }}>
              <Select placeholder="不限" allowClear>
                {
                  bindWorkArr.map(item => {
                    return <Option value={item.id} key={item.id}>{item.title}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </QueryFilter>
        </div>
        <div className={style.block__cont__t}>
          <div className={style.block__header}>
            <div>结果列表</div>
            <div>
              <Checkbox onChange={onAllChange}>{!saleModalFlag ? '列表全部添加' : '列表全部移除'}</Checkbox>
            </div>
          </div>
          <Alert
              showIcon
              type="info"
              message={`列表共查询出 ${pageTotal} 条结果，已选择 ${checkNum} 条`}
              style={{margin: '0 24px'}}
          />
          <div className={style.list_box}>
            <Table
                rowSelection={{...rowSelection}}
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
                  showQuickJumper
                  current={pageNo}
                  total={pageTotal}
                  showTitle={false}
                  onChange={onNextChange}
                  showTotal={onPageTotal}
                  defaultPageSize={pageSize}
                  className={style.pagination}
                  onShowSizeChange={onSizeChange}
                  pageSizeOptions={['10', '20', '30', '60']}
              />
            </ConfigProvider>
          </div>
        </div>
      </div>
    </Modal>
  </>
}
export default connect(({saleModal, salesManageModel})=>({
  ...saleModal,
  storeList: salesManageModel.storeArr,
  teamList: salesManageModel.teamArr,
}))(saleModalPage)


