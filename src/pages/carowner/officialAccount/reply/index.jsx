import React,{useEffect, useState} from 'react';
import { connect } from 'umi';
import style from './style.less';
import { Form, Input, Table, Select, Row, Space, Button,Col} from "antd";
const { Column } = Table;

import {formatDate} from '@/utils/date'
import ModalBox from './components/modal'
import AddReplyModel from './components/addReplyModel'
import {QueryFilter} from '@ant-design/pro-form';
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";

const Reply = (props) =>{
  const { dispatch, ReplyList, channelList} = props;
  console.log(ReplyList)
  let [form] = Form.useForm()
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filterData, setFilterData] = useState({})
  const [callList, setCallList] = useState(false)
  const [addReplyVisible,setAddReplyVisible] = useState(false)
  //Modal数据
  const [modalInfo, setMdalInfo] = useState('')
  //modal回调
  const callModal = (flag) => {
    setMdalInfo('')
    if(flag) {
      setCallList(!callList);
    }
  }
  //表单提交
  const submitData = (val) => {
    setFilterData(JSON.parse(JSON.stringify(val)))
    setCurrent(1)
    setPageSize(10)
    setCallList(!callList)
  }
  //表单重置
  const resetForm = () => {
    form.resetFields();
    setFilterData({})
    setCallList(!callList)
  }
  //分页切换
  const handleTableChange = (current,pageSize) => {
    setCurrent(current)
    setPageSize(pageSize)
    setCallList(!callList)
  }
  //列表接口
  useEffect(() => {
    getList()
  },[callList])

  // 获取列表数据
  let getList = () => {
    dispatch({
      type: 'ReplyManage/queryReplyList',
      payload: {
        method: 'postJSON',
        params: {
          pageNum: current,
          pageSize: pageSize,
          sort:filterData.sort || '',
          ...filterData
        }
      },
    });
  }
  // 获取所属渠道
  useEffect(() => {
    dispatch({
      type: 'ReplyManage/queryChannelList',
      payload: {
        method: 'get',
        params: {
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId
        }
      }
    });
    form.setFieldsValue({
      channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
    })
  },[callList])
  // 表格状态翻译
  const tableStatus = (status) => {
    {status==0?<TypeTags type="red">{'系统内置'}</TypeTags>:''}
    {status==1?<TypeTags type="yellow">{'禁用'}</TypeTags>:''}
    {status==2?<TypeTags type="green">{'启用'}</TypeTags>:''}
    {status==3?<TypeTags type="orange">{'在线客服'}</TypeTags>:''}
    {status==4?<TypeTags type="orange">{'离线客服'}</TypeTags>:''}
    {status==4?<TypeTags type="orange">{'开启客服'}</TypeTags>:''}
    // if(status==0) return '系统内置'
    // if(status==1) return '禁用'
    // if(status==2) return '启用'
    // if(status==3) return '在线客服'
    // if(status==4) return '离线客服'
    // if(status==5) return '开启客服'
  }
  // 表格状态翻译
  const tableType = (type) => {
    {type=='TEXT'?<TypeTags type="red">{'文本'}</TypeTags>:''}
    {type=='NEWS'?<TypeTags type="yellow">{'图文'}</TypeTags>:''}
    {type=='IMAGE'?<TypeTags type="green">{'图片'}</TypeTags>:''}
    {type=='VOICE'?<TypeTags type="orange">{'音频'}</TypeTags>:''}
    {type=='MUSIC'?<TypeTags type="orange">{'音乐'}</TypeTags>:''}
    // if(type=='TEXT') return '文本'
    // if(type=='NEWS') return '图文'
    // if(type=='IMAGE') return '图片'
    // if(type=='VOICE') return '音频'
    // if(type=='MUSIC') return '音乐'
  }
  
  // 打开新增，修改弹窗
  let openAddModel= (type, record) =>{
    if(type === 'add'){
      setMdalInfo({modalName: '新增'})
    }else{
      setMdalInfo({modalName: '编辑', ...record})
    }
   
    setAddReplyVisible(true)
  }
  let hideAddModel = () => {
    setAddReplyVisible(false)
  }

  return(
    <>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={submitData} onReset={resetForm}>
          <Form.Item  label="所属渠道" name="channelId"  labelCol={{flex:'0 0 120px'}}>  
            <Select allowClear placeholder="不限" disabled={true}>  
              {
                channelList.map(v =>  <Option value={v.id}>{v.channelName}</Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item  label="关键字" name="keyword"  labelCol={{flex:'0 0 120px'}}>
            <Input placeholder="请输入" ></Input>
          </Form.Item>
          <Form.Item   label="类型" name="type"  labelCol={{flex:'0 0 120px'}}>
            <Select allowClear placeholder="不限">
              <Option value="TEXT">文本</Option>
              <Option value="NEWS">图文</Option>
              <Option value="IMAGE">图片</Option>
              <Option value="VOICE">音频</Option>
              <Option value="MUSIC">音乐</Option>
            </Select>
          </Form.Item>
          <Form.Item  label="状态" name="status" labelCol={{flex:'0 0 120px'}} >
            <Select allowClear placeholder="不限">
              <Option value="0">系统内置</Option>
              <Option value="1">禁用</Option>
              <Option value="2">启用</Option>
              <Option value="3">在线客服</Option>
              <Option value="4">离线客服</Option>
              <Option value="5">开启客服</Option>
            </Select>
          </Form.Item>
          <Form.Item  label="优先级排序" name="sort" labelCol={{flex:'0 0 120px'}} >
            <Select allowClear placeholder="不限">
              <Option value="ASC">由高到低</Option>
              <Option value="DESC">由低到高</Option>
            </Select>
          </Form.Item>
        </QueryFilter>
      </div>
      <div className={style.list_box}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
            <Button onClick={()=> openAddModel('add')} type="primary">新增</Button>
          </Space>
        </ListTitle>
        <ListTable showPagination current={current} pageSize={pageSize} total={ReplyList.total}
        onChange={handleTableChange} 
        >
          <Table dataSource={ReplyList.list} scroll={{x:1200}} pagination={false}>
              <Column title="消息ID" dataIndex="objectId" key="objectId" />
              <Column title="关键字" dataIndex="keyword" key="keyword" />
              <Column title="渠道" dataIndex="channelName" key="channelName" />
              <Column title="状态" dataIndex="status" key="status"  render={(text, record) => (
                <>
                  {text==0?<StateBadge type="yellow">{'系统内置'}</StateBadge>:''}
                  {text==1?<StateBadge type="red">{'禁用'}</StateBadge>:''}
                  {text==2?<StateBadge type="green">{'启用'}</StateBadge>:''}
                  {text==3?<StateBadge type="orange">{'在线客服'}</StateBadge>:''}
                  {text==4?<StateBadge type="blue">{'离线客服'}</StateBadge>:''}
                  {text==5?<StateBadge type="indigo">{'开启客服'}</StateBadge>:''}
                </>
              )}/> 
              <Column title="类型" dataIndex="type" key="type"  render={(text, record)=> (
                <>
                  {text=='TEXT'?<TypeTags type="red">{'文本'}</TypeTags>:''}
                  {text=='NEWS'?<TypeTags type="yellow">{'图文'}</TypeTags>:''}
                  {text=='IMAGE'?<TypeTags type="green">{'图片'}</TypeTags>:''}
                  {text=='VOICE'?<TypeTags type="orange">{'音频'}</TypeTags>:''}
                  {text=='MUSIC'?<TypeTags type="blue">{'音乐'}</TypeTags>:''}
                </>
              )}/> 
              <Column title="优先级" dataIndex="priority" key="priority" /> 
              <Column title="创建时间" dataIndex="createTime" key="createTime"  render={(text, record) => (
                <ListTableTime>{formatDate(record.createTime)}</ListTableTime>
              )}/>
              <Column title="说明" dataIndex="description" key="description" render={(text, record)=> (
                <>
                {text || "-"}
              </>
              )}/> 
              <Column width={160} title="操作" key="id" fixed='right' 
                render={(text, record) => (
                  <ListTableBtns showNum={3}>
                    <LtbItem onClick={() =>openAddModel('edit',record)}>修改</LtbItem>
                    <LtbItem onClick={() => {setMdalInfo({modalName: 'deleteReply', ...record})}}>删除</LtbItem>
                  </ListTableBtns>
                )} />
            </Table>
        </ListTable>
      </div>
      {modalInfo?<ModalBox modalInfo={modalInfo} toFatherValue={(flag)=>callModal(flag)} />:''}
      {addReplyVisible?<AddReplyModel  modalInfo={modalInfo} addReplyVisible={addReplyVisible} hideAddModel={hideAddModel} getList={getList}/>:null}
    </>
  )
}
export default connect(({ ReplyManage }) => ({
  ReplyList: ReplyManage.ReplyList,
  channelList: ReplyManage.channelList
}))(Reply);