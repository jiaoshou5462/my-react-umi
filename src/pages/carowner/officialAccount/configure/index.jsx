import React,{useEffect, useState} from 'react';
import { connect, history } from 'umi';
import style from './style.less';
import { Form, Input, Table, Row,Col, Space, Select, Button, DatePicker, Modal, message } from "antd";
const { Column } = Table;
const { RangePicker } = DatePicker;

import {formatDate} from '@/utils/date'
import ModalBox from './components/modal'
import {QueryFilter} from '@ant-design/pro-form';
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";

const Configure = (props) =>{
  const {channelList, dispatch, configureList} = props;
  let [form] = Form.useForm()
  let [cardPageKeyList, setCardPageKeyList] = useState([]) //选中的卡包数据的key

  const [current, setCurrent] = useState(1);// 当前页
  const [pageSize, setPageSize] = useState(10);// 一页显示多少 
  const [filterData, setFilterData] = useState({}); // 表单对象
  const [callList, setCallList] = useState(false);// 控制列表的刷线
  const [wechatAppSettingList, setWechatAppSettingList] = useState([]);// 失效数组  后台以字符串接受
  //Modal数据
  const [modalInfo, setMdalInfo] = useState('')
  
  //modal回调
  const callModal = (flag) => {
    setMdalInfo('')
    if(flag) {
      setCallList(!callList)
      if(typeof flag == 'object') {
        setMdalInfo({modalName: 'configRole', ...flag})
      }
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
  // 获取所属渠道
  useEffect(() => {
    dispatch({
      type: 'configureManage/queryChannelList',
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
  //列表接口
  useEffect(() => {
    let query = JSON.parse(JSON.stringify(filterData))
    if(query.date) {
      query.searchDateG = formatDate(query.date[0])
      query.searchDateL = formatDate(query.date[1])
    }
    delete query.date
    dispatch({
      type: 'configureManage/queryConfigureList',
      payload: {
        method: 'postJSON',
        params: {
          pageInfo:{
            pageNo: current,
            pageSize:pageSize,
          },
          ...query
        }
      },
    });
  },[callList])
  // 表格change
  const rowSelection={
    type: 'checkbox',
    //全选过滤
    onSelectAll: (selected, selectedRows, changeRows) => {
      if(selected) {
        let selectedList = changeRows.map(v => {return v.objectId});
        setWechatAppSettingList(selectedList);
      }else {
        setWechatAppSettingList([]);
      }
    },
    //单选
    onSelect: (record, selected, selectedRows, nativeEvent) => {
      console.log('单选',record,selected,selectedRows,nativeEvent)
      if(selected) {
        let selectedList = record.objectId;
        setWechatAppSettingList(selectedList);
      }else{
        setWechatAppSettingList([]);
      }
    },
  };
  return(
    <>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={submitData} onReset={resetForm}>
              <Form.Item label="所属渠道" name="channelId" labelCol={{flex:'0 0 120px'}}>
                <Select allowClear placeholder="请选择" disabled={true}>
                  {
                    channelList.map(v =>  <Option value={v.id}>{v.channelName}</Option>)
                  }
                </Select>
              </Form.Item>
              <Form.Item label="公众号名称" name="wechatAppName" labelCol={{flex:'0 0 120px'}}>
                <Input placeholder="请输入" ></Input>
              </Form.Item>
              <Form.Item  label="状态" name="status" labelCol={{flex:'0 0 120px'}} >
                <Select allowClear placeholder="不限">
                  <Option value="1">无效</Option>
                  <Option value="2">有效</Option>
                </Select>
              </Form.Item>
              <Form.Item label="创建时间" name="date" labelCol={{flex:'0 0 120px'}}>
                <RangePicker style={{ width: '100%' }} onClick={(e)=> {console.log(e)}} format="YYYY-MM-DD"/>
              </Form.Item>
        </QueryFilter>
      </div>
      <div className={style.list_box}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
          <Button onClick={()=> {wechatAppSettingList && wechatAppSettingList.length>0 ? setMdalInfo({modalName: 'invalidConfigure',wechatList:wechatAppSettingList}): message.error({ style: { marginTop: '10vh', }, content: '请至少选择一条记录!' })}} >失效</Button>
          <Button onClick={()=> {setMdalInfo({modalName: 'addConfigure'})}} type="primary">新增</Button>
          </Space>
        </ListTitle>
        <ListTable showPagination current={current} pageSize={pageSize} total={configureList.total}
          onChange={handleTableChange} 
          >
            <Table rowSelection={rowSelection} dataSource={configureList.list}  scroll={{x:1200}} pagination={false}>
              <Column title="公众号名称" dataIndex="wechatAppName" key="wechatAppName"  render={(text, record)=> (
                <a onClick={() => {setMdalInfo({modalName: 'editConfigure', ...record})}}>{record.wechatAppName}</a>
              )}/>
              <Column title="公众号所属渠道" dataIndex="wechatAppChannelName" key="wechatAppChannelName"  />
              <Column title="服务高级接口状态" dataIndex="serverStatus" key="serverStatus"  render={(text, record)=> (
                <>
                {text==1?'启动':text==2?'未启动':'-'}
              </>
              )}/>
              <Column title="创建时间" dataIndex="createTime" key="createTime"  render={(text, record) => (
                <ListTableTime>{formatDate(record.createTime)}</ListTableTime>
              )} />
              <Column title="状态" dataIndex="status" key="status"  render={(text, record) => (
                <>
                  {text==1?<StateBadge type="red">{'无效'}</StateBadge>:''}
                  {text==2?<StateBadge type="green">{'有效'}</StateBadge>:''}
                </>
              )} />
              <Column width={330} title="操作" key="id"  fixed="right"
                render={(text, record) => (
                  <ListTableBtns showNum={3}>
                    <LtbItem onClick={() => {setMdalInfo({modalName: 'editConfigure', ...record})}}>查看</LtbItem>
                    <LtbItem style={ record.status==1 ? {color:'#eee',pointerEvents:'none'} : {}} onClick={record.status==1 ? 'return false' : () => {history.push(`/carowner/officialAccount/configure/menu?wechatAppId=${record.wechatAppId}`)}}>设置菜单</LtbItem>
                    <LtbItem style={ record.status==1 ? {color:'#eee',pointerEvents:'none'} : {}} onClick={record.status==1 ? 'return false' : () => {setMdalInfo({modalName: 'synchroConfigure', ...record})}}>同步菜单</LtbItem>
                  </ListTableBtns>
                )} />
            </Table>
          </ListTable>
          {modalInfo?<ModalBox modalInfo={modalInfo} toFatherValue={(flag)=>callModal(flag)} />:''}
      </div>
    </>
  )
}
export default connect(({ configureManage }) => ({
  channelList: configureManage.channelList,
  configureList: configureManage.configureList
}))(Configure);