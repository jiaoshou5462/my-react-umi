import React,{useEffect, useState} from "react"
import { connect,history } from 'umi'
import { Row, Col, Form, Modal, Space, Input, Table, Select, Button, Divider, message, DatePicker, Pagination, ConfigProvider } from "antd"
import { ExclamationCircleOutlined } from '@ant-design/icons';
import style from "./style.less"
const { Option } = Select
const { RangePicker } = DatePicker
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
import { QueryFilter} from '@ant-design/pro-form';
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";
const { confirm } = Modal;
const teamManageListPage =(props)=>{
  let {dispatch, pageTotal, list, channelList, storeList, tagCountList, teamUserList, editDetail} = props,
      [form] = Form.useForm(),
      [addForm] = Form.useForm(),
      [channelId, setChannelId] = useState(localStorage.getItem('tokenObj') && JSON.parse(localStorage.getItem('tokenObj')).channelId || ''),
      [modalVisible, setModalVisible] = useState(false), //模态框状态
      [modalBtnStatus, setModalBtnStatus] = useState(false), //模态框确定按钮状态
      [teamId, setTeamId] = useState(''), //编辑id，默认不是
      [tagList, setTagList] = useState([]),
      [customerTagIds, setCustomerTagIds] = useState(''),
      [tagIdStatus, setTagIdStatus] = useState(false),
      [pageSize, setPageSize] = useState(10),
      [pageNo, setPage] = useState(1),
      [payload, setPayload] = useState({
        pageInfo: {
          pageNo,
          pageSize,
        }
      })

  useEffect(() => {
    if(channelId){
      form.setFieldsValue({
        channelId
      })
      addForm.setFieldsValue({
        channelId
      })
      getTagList()
      getChannel()
      getStoreList()
    }
  }, [channelId])
  useEffect(() => {
    setTagList(tagCountList)
  },[tagCountList])
  useEffect(() => {
    if(tagIdStatus){
      searchBtnEvent(form.getFieldsValue())
      setTagIdStatus(false)
    }
  },[tagIdStatus])
  useEffect(() => {
    if(Object.keys(editDetail).length > 0){
      setModalVisible(true)
      addForm.setFieldsValue({
        ...editDetail,
      })
      if(editDetail.branchId){
        getTeamUserList(editDetail.branchId)
      }
    }
  },[editDetail])
  /*获取渠道*/
  let getChannel = () => {
    dispatch({
      type: 'importList/getActivityChannelList',
      payload: {
        method: 'post',
        params: {
          channelId
        }
      }
    })
  }
  /*获取标签*/
  let getTagList = () => {
    dispatch({
      type: 'teamManageList/getCrmCustomerTagCountList',
      payload: {
        method: 'get',
        params: {}
      }
    })
  }
  /*回调*/
  useEffect(()=>{
    getList()
  },[pageNo, pageSize, payload])
  /*获取列表*/
  let getList = () => {
    dispatch({
      type: 'teamManageList/getList',
      payload: {
        method: 'postJSON',
        params: payload
      },
    })
  }
  /*获取门店列表*/
  let getStoreList = () => {
    dispatch({
      type: 'teamManageList/getStoreList',
      payload: {
        method: 'getUrlParams',
        params: channelId
      },
    })
  }
  /*获取团队长信息列表*/
  let getTeamUserList = (branchId) => {
    dispatch({
      type: 'teamManageList/getTeamUserList',
      payload: {
        method: 'getUrlParams',
        params: `${channelId + '/' + branchId}`
      },
    })
  }
  /*获取团队长信息列表*/
  let getEditDetail = (teamId) => {
    dispatch({
      type: 'teamManageList/getEditDetail',
      payload: {
        method: 'getUrlParams',
        params: teamId
      },
    })
  }
  useEffect(() => {
    if(customerTagIds.length > 0){
      searchBtnEvent(form.getFieldsValue())
    }
  },[customerTagIds])

  let renderColumns = () => {
    return (
        [{
          title: '团队名称',
          dataIndex: 'teamName',
          width: 170,
          fixed: 'left',
          render: (teamName, record) => detailRender(teamName, record)
        }, {
          title: '团队长名称',
          width: 170,
          dataIndex: 'userName',
          render: (userName) => <span>{userName || '-'}</span>
        }, {
          title: '团队长账号',
          width: 150,
          dataIndex: 'userAccount',
          render: (userAccount) => <span>{userAccount || '-'}</span>
        }, {
          title: '所属渠道',
          width: 150,
          dataIndex: 'channelName',
        },  {
          title: '所属门店',
          width: 150,
          dataIndex: 'branchName',
        }, {
          title: '创建时间',
          width: 170,
          dataIndex: 'createTime',
          render: (createTime) => <ListTableTime>{createTime}</ListTableTime>
        },{
          title: '团队人数',
          width: 100,
          dataIndex: 'teamUsers',
          render: (teamUsers) => <span>{teamUsers || '-'}</span>
        }, {
          title: '客户数量',
          width: 100,
          dataIndex: 'teamCustomers',
          render: (teamCustomers) => <span>{teamCustomers || '-'}</span>
        }, {
          title: '操作',
          width: 150,
          fixed: 'right',
          dataIndex: 'objectId',
          render: (objectId) => operateRender(objectId)
        }]
    )
  }
  /*跳转详情*/
  let detailRender = (teamName, record) => {
    /*跳转详情*/
    let goToDetail = () => {
      history.push({
        pathname: '/teamManage/list/detail',
        state: {
          teamId: record.objectId
        }
      })
    }
    return <span className={style.click_blue} onClick={goToDetail}>{teamName}</span>
  }
  /*操作*/
  let operateRender = (teamId) => {
    /*编辑*/
    let onEdit = () => {
      setModalVisible(true)
      getEditDetail(teamId)
      setTeamId(teamId)
    }
    /*删除*/
    let onDelete = () => {
      confirm({
        icon: <ExclamationCircleOutlined />,
        title: '确定要删除这条信息吗？',
        content: '团队删除后将不可恢复，是否确认删除？',
        onOk() {
          dispatch({
            type: 'teamManageList/onDeleteTeam',
            payload: {
              method: 'deleteParams',
              params: teamId
            },
            callback: (res) => {
              if(res.result.code === '0') {
                message.success(res.result.message)
                getList()
              }else {
                message.error(res.result.message)
              }
            }
          })
        }
      })
    }

    return <ListTableBtns showNum={3}>
      <LtbItem onClick={() => { onEdit() }}>编辑</LtbItem>
      <LtbItem onClick={() => { onDelete() }}>删除</LtbItem>
    </ListTableBtns>
  }
  /*清空内容*/
  let resetBtnEvent = ()=> {
    form.resetFields()
    let data = {
      pageInfo: {
        pageSize,
        pageNo: 1,
      }
    }
    tagList.map(item => {
      item.status = false
    })
    form.setFieldsValue({
      channelId
    })
    setPage(1)
    setPayload(data)
    setTagList(tagList)
    setCustomerTagIds('')
  }
  /*搜索按钮*/
  let searchBtnEvent = (e)=>{
    //创建时间
    if(e.createTime){
      e.createTimeEnd = moment(e.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
      e.createTimeStart = moment(e.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
      delete e.createTime
    }
    //标签激活日期
    if(e.labelTime){
      e.addRelationTimeEnd = moment(e.labelTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
      e.addRelationTimeStart = moment(e.labelTime[0]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
      delete e.labelTime
    }
    let data = {
      ...e,
      customerTagIds,
      pageInfo: {
        pageSize,
        pageNo: 1,
      }
    }
    setPage(1)
    setPayload(data)
  }
  //分页
  const pageChange=(page,pageSize)=>{
    payload.pageInfo.pageNo = page;
    payload.pageInfo.pageSize = pageSize;
    setPayload(payload)
    setPage(page)
    setPageSize(pageSize)
  }

  /*导出*/
  let onExport = () => {
    let temp = form.getFieldsValue()
    if(temp.createTime){
      temp.createEndTime = moment(e.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
      temp.createStartTime = moment(e.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
      delete temp.createTime
    }
    if(temp.labelTime){
      temp.addRelationTimeEnd = moment(temp.labelTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
      temp.addRelationTimeStart = moment(temp.labelTime[0]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
      delete temp.labelTime
    }
    let data = {
      ...temp,
      customerTagIds,
      pageInfo: {
        pageNo,
        pageSize,
      }
    }
    dispatch({
      type: 'teamManageList/onExportTeamList',
      payload: {
        method: 'postJsonExcel',
        params: data
      },
      callback: (res) => {
        const url = window.URL.createObjectURL(new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '团队明细列表.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    })
  }
  /*新增/编辑 门店change*/
  let onStoreChange = (e) => {
    getTeamUserList(e)
    addForm.resetFields(['leaderId'])
  }
  /*保存 新增/编辑 团队*/
  let onAddTeam = (e) => {
    setModalBtnStatus(true)
    let data = {...e}
    if(teamId){
      data.teamId = teamId
    }
    if(e.leaderId) {
      dispatch({
        type: 'teamManageList/onCheckAddTeam',
        payload: {
          method: 'get',
          params: {
            teamId,
            userId: e.leaderId
          }
        },
        callback: (res) => {
          if(res.body.isCheck === 1){
            onConfirm(data)
          }else{
            setModalBtnStatus(false)
            addTeamApi(data)
          }
        }
      })
    }else{
      setModalBtnStatus(false)
      addTeamApi(data)
    }
  }
  /*弹窗*/
  let onConfirm = (data) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '当前销售已加入其他团队，是否强制将其转入本团队。',
      onOk() {
        addTeamApi(data)
      },
      onCancel() {
        setModalBtnStatus(false)
      }
    })
  }
  /*新增接口*/
  let addTeamApi = (data) => {
    dispatch({
      type: 'teamManageList/addTeam',
      payload: {
        method: 'postJSON',
        params: {...data}
      },
      callback: (res) => {
        if(res.result.code === '0'){
          message.success({
            content: '保存成功！',
            onClose() {
              setModalBtnStatus(false)
              setModalVisible(false)
              onResetParams()
              getList()
            }
          })
        }else {
          setModalBtnStatus(false)
          message.error(res.result.message)
        }
      }
    })
  }
  /*取消*/
  let onCancel = () => {
    setTeamId('')
    addForm.resetFields()
    setModalVisible(false)
    onResetParams()
  }
  /*check标签*/
  let onCheckTag = (key) => {
    let temp = JSON.parse(JSON.stringify(tagList))
    if(temp[key].status){
      temp[key].status = false
    }else {
      temp[key].status = true
    }
    let tempId = []
    temp.map(item => {
      if (item.status) {
        tempId.push(item.tagId)
      }
    })
    if(tempId.length > 0){
      setCustomerTagIds(tempId.toString())
    }else {
      setCustomerTagIds('')
    }
    setTagList(temp)
    setTagIdStatus(true)
  }
  /*重置接口数据*/
  let onResetParams = () => {
    dispatch({
      type: 'teamManageList/onReset'
    })
  }
  let onAdd = () => {
    addForm.setFieldsValue({
      channelId
    })
    setModalVisible(true)
  }
  return(
    <>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtnEvent} onReset={resetBtnEvent}>
          <Form.Item label="团队名称" name="teamName" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" allowClear/>
          </Form.Item>
          <Form.Item label="团队长名称" name="teamLeaderName" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" allowClear/>
          </Form.Item>
          <Form.Item label="团队长账号" name="teamLeaderAccount" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" allowClear/>
          </Form.Item>
          <Form.Item label="所属渠道" name="channelId" labelCol={{flex: '0 0 120px'}}>
            <Select disabled showSearch value={channelId} notFoundContent='暂无数据' placeholder="输入渠道可筛选" optionFilterProp="children">
              {
                channelList && channelList.channelList ? channelList.channelList.map((item, key) => <Option key={key} value={item.id}>{item.channelName}</Option>) : ''
              }
            </Select>
          </Form.Item>
          <Form.Item label="所属门店" name="branchId" labelCol={{flex: '0 0 120px'}}>
            <Select allowClear placeholder="不限" notFoundContent='暂无数据'>
              {
                storeList.map((item, key) => <Option key={key} value={item.branchid}>{item.depname}</Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item label="创建日期" name="createTime" labelCol={{flex: '0 0 120px'}}>
            <RangePicker allowClear locale={locale} style={{width: '100%'}} placeholder={['开始时间', '结束时间']}/>
          </Form.Item>
          <Form.Item label="标签激活日期" name="labelTime" labelCol={{flex: '0 0 120px'}}>
            <RangePicker allowClear locale={locale} style={{width: '100%'}} placeholder={['开始时间', '结束时间']} />
          </Form.Item>
        </QueryFilter>
      </div>

      <div className={style.list_box}>
        <ListTitle titleName="客户标签"></ListTitle>
        <div className={style.list_box_flex}>
          {
            tagList.length > 0 ? tagList.map(item => {
              return <div className={`${item.status ? style.tag_box_action : style.tag_box}`} onClick={() => {onCheckTag(item.key)}}>{item.tagAlias}</div>
            }) : '暂无标签'
          }
        </div>
      </div>

      <div className={style.list_box}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
            <Button onClick={onExport}>导出</Button>
            <Button type='primary' onClick={onAdd}>新增</Button>
          </Space>
        </ListTitle>
        <ListTable showPagination current={pageNo} pageSize={pageSize} total={pageTotal} onChange={pageChange}>
          <Table  columns={renderColumns()} dataSource={list} pagination={false} />
        </ListTable>
      </div>

      <Modal
          width={600}
          footer={null}
          destroyOnClose
          onOk={onAddTeam}
          closable={false}
          onCancel={onCancel}
          maskClosable={false}
          visible={modalVisible}
          bodyStyle={{padding: '0'}}
          title= {teamId ? '编辑团队' : '新增团队'}
      >
          <Form form={addForm} onFinish={onAddTeam}>
            <Row className={style.modal_box}>
              <Col span={24}>
                <Form.Item label="所属渠道：" name="channelId" labelCol={{flex: '0 0 120px'}} rules={[{ required: true, message: "请选择" }]}>
                  <Select
                      disabled
                      showSearch
                      value={channelId}
                      notFoundContent='暂无数据'
                      placeholder="输入渠道可筛选"
                      optionFilterProp="children"
                  >
                    {
                      channelList && channelList.channelList ?
                          channelList.channelList.map((item, key) => {
                            return <Option key={key} value={item.id}>{item.channelName}</Option>
                          }) : ''
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="所属门店：" name="branchId" labelCol={{flex: '0 0 120px'}} rules={[{ required: true, message: "请选择" }]}>
                  <Select
                      allowClear
                      disabled={teamId ? true : false}
                      placeholder="不限"
                      onChange={onStoreChange}
                      notFoundContent='暂无数据'
                  >
                    {
                      storeList && storeList.map((item, key) => {
                        return <Option key={key} value={item.branchid}>{item.depname}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="团队名称" name="teamName" labelCol={{flex: '0 0 120px'}} rules={[{ required: true, message: "请输入" }]}>
                  <Input placeholder="请输入" allowClear/>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="团队长" name="leaderId" labelCol={{flex: '0 0 120px'}}>
                  <Select
                      allowClear
                      showSearch
                      notFoundContent='暂无数据'
                      placeholder="输入名称可筛选"
                      optionFilterProp="children"
                  >
                    {
                      teamUserList && teamUserList.map((item, key) => {
                        return <Option key={key} value={item.objectId}>{item.userNmae}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Divider style={{margin: 0}}/>
            <Row justify="end" className={style.modal_box_foot}>
              <Button htmlType="button" onClick={onCancel}>关闭</Button>
              <Button htmlType="submit" type="primary" loading={modalBtnStatus}>保存</Button>
            </Row>
          </Form>
      </Modal>
    </>
  )
};
export default connect(({teamManageList, importList})=>({
  list: teamManageList.list,
  pageTotal: teamManageList.pageTotal,
  storeList: teamManageList.storeList,
  channelList: importList.channelList,
  editDetail: teamManageList.editDetail,
  tagCountList: teamManageList.tagCountList,
  teamUserList: teamManageList.teamUserList
}))(teamManageListPage)
