//用户分群列表
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import {
  Row,
  Col,
  Form,
  Space,
  Input,
  Table,
  Select,
  Button,
  Checkbox,
  Message,
  Modal,
  Badge,
  Tag,
  message,
} from "antd";
import style from './styles.less';
import {createAWay, runState} from '../../tagModule/dict.js'
import CreateTagModal from './components/createTagModal/createTagModal'
import ExportListModal from './components/exportListModal'
import ListDetail from './components/listModal/detail'
import CallScene from './components/listModal/callScene'
import { QueryFilter} from '@ant-design/pro-form';

import { ListTitle, ListTable, ListTableBtns,MoneyFormat,
  LtbItem, TypeTags, StateBadge, ListTableTime} from "@/components/commonComp/index";

let init = false;
const { Option } = Select
const {Column, showTotal} = Table;
let modalInfo={};
const GrouplList = (props) => {
  let { dispatch, userInfo, userGroupList, actionSelectData,attributeSelectData,listDetailShow,callSceneShow,selectData,twoListData } = props;
  let [total, setTotal] = useState(0);
  let [runStatus, setRunStatus] = useState('');
  let [createType, setCreateType] = useState('');
  let [groupName, setGroupName] = useState('');
  let [pageInfo,setPageInfo] = useState({
    createUser:false,
    current:1,
    pageSize:10,
  })
 
  let tokenObj = localStorage.getItem('tokenObj') ? JSON.parse(localStorage.getItem('tokenObj')) : {};
  let [form] = Form.useForm()

  useEffect(() => {
    if(userGroupList) {
      setTotal(userGroupList.total)
    }
  }, [userGroupList]);
  //分页切换
  const handleTableChange = (current,pageSize) => {
    let _obj = JSON.parse(JSON.stringify(pageInfo));
    _obj.current = current;
    _obj.pageSize = pageSize;
    setPageInfo(_obj)
  }
  //勾选
  const setCreateUser = (value)=>{
    let _obj = JSON.parse(JSON.stringify(pageInfo));
    _obj.createUser = value;
    setPageInfo(_obj)
  }
  //重置
  const resetForm = ()=>{
    setGroupName('');
    setRunStatus('');
    setCreateType('');
    setPageInfo({
      createUser:false,
      current:1,
      pageSize:10,
    })
    form.resetFields()
  }
  const search = ()=>{
    getUserGroupList();
  }

  //条件查询
  useEffect(() => {
    getUserGroupList()
  }, [pageInfo]);

  // 查询用户群
  const getUserGroupList = (watch) => {
    let data = {
      pageNum: pageInfo.current,
      pageSize: pageInfo.pageSize,
      runStatus: runStatus,
      createType: createType,
      groupName: groupName,
      channelIds: tokenObj.channelId
    }
    if(pageInfo.createUser) {
      data.createUser = userInfo.userId
    }
    dispatch({
      type: 'setGroupList/getUserGroupData',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback:()=>{
        init = true;
      }
    });
  }
  const createGroups=()=>{
     //新增
     dispatch({
      type:'setGroupList/setModalType',
      payload:'create',
    })

    dispatch({
      type: 'setGroupList/isCreateModalVisible',
      payload: true,
    });
  }
  //下载
  const clickDownload = (id, name) => {
    dispatch({
      type: 'setGroupList/getDownloadFile',
      payload: {
        method: 'get',
        params: {
          fileCode: id
        },
        responseType: 'blob'
      },
      callback: (res) => {
        if(res) {
          const url = window.URL.createObjectURL(new Blob([res], {type: "application/x-www-form-urlencoded"}))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', name+'.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    });
  }

  //刷新
  const clickRefresh = (id) => {
    dispatch({
      type: 'setGroupList/putRefreshData',
      payload: {
        method: 'put',
        id: id,
        params: {},
      },
      callback: (res) => {
        if(res.result.code =='0'){
          message.success('刷新成功');
          getUserGroupList()
        }else{
          Modal.info({
            content: res.result.message || '刷新失败',
          });
        }
      }
    });
  }
  //修改
  const clickRevamp = (id, createType) => {
    dispatch({
      type:'setGroupList/setModalType',
      payload:'edit',
    })
    dispatch({
      type: 'setGroupList/isCreateModalVisible',
      payload: true,
    });
    dispatch({
      type: 'setGroupList/num',
      payload: 1,
    });
    if(createType == 'CUSTOMIZE' || createType == 'TAG') {//自定义
      dispatch({
        type: 'setGroupList/isCustomFlag',
        payload: createType == 'CUSTOMIZE' ? 'custom' : 'tag',
      });
      dispatch({
        type: 'setGroupList/getAllUserGroupData',
        payload: {
          method: 'get',
          id: id,
          params: {},
        }
      });
    }
    if(createType == 'IMPORT') {//导入
      dispatch({
        type: 'setGroupList/isCustomFlag',
        payload: 'import',
      });
      dispatch({
        type: 'setGroupList/getAllImportUserGroupData',
        payload: {
          method: 'get',
          id: id,
          params: {},
        }
      });
    }
  }
  let [isExportListShow, setIsExportListShow] = useState(false);//导出名单modal是否显示
  let [exportData, setExportData] = useState({});//需要导出的用户群组
  const hideExportList = (val) => {
    setIsExportListShow(val);
  }
  //点击操作-查看导出名单
  const exportListView = (record) => {
    setExportData(record);
    setIsExportListShow(true);
  }

  
  //在列表提前获取下拉列表的数据 避免触发调用
  const getSelectList = ()=>{
    if(!actionSelectData.oneList.length){
      dispatch({
        type: 'dataModule_common/getMetaMess',
        payload: {
          method: 'get',
          params: {}
        }
      })
    }
    if(!attributeSelectData.oneList.length){
      dispatch({
        type: 'dataModule_common/getTagEvent',
        payload: {
          method: 'get',
          params: {}
        }
      })
    }
    //标签群组，获取下拉框数据
    dispatch({
      type: 'tagAttribute/channelGroupChannel',
      payload: {
        method: 'get',
      },
    });
    if(!twoListData.length){
      dispatch({
        type: 'tagAttribute/channelPredicateTag',
        payload: {
          method: 'get',
        },
      });
    }
  }
  useEffect(() => {
    getSelectList();
  }, []);

  const openDetail = (item)=>{
    modalInfo = item;
    dispatch({
      type:'setGroupList/setListDetailShow',
      payload:true,
    })
  }
  const openCallScene=(item)=>{
    modalInfo = item;
    dispatch({
      type:'setGroupList/setCallSceneShow',
      payload:true,
    })
  }
  const statusSend=(id,status)=>{
    dispatch({
      type:'setGroupList/userGroupStop',
      payload:{
        method:'put',
        userGroupId: id,
        params:{
          id: id,
          status: status
        }
      },
      callback:()=>{
        Message.info('修改成功');
        getUserGroupList();
      }
    })
  }
  const changeStatus=(item)=>{
    if(item.runStatus=='1'){//启用状态 点击禁用
      Modal.confirm({
        title:'提示',
        content: '是否禁用改群组？',
        onOk:()=>{
          statusSend(item.id,'0');
        }
      })
    }else{
      Modal.confirm({
        title:'提示',
        content: '是否启用改群组？',
        onOk:()=>{
          statusSend(item.id,'1');
        }
      })
    }
  }
  const dataStatusShow=(dataStatus,record)=>{
    if(dataStatus=='CHECK_SUCCESS') return <TypeTags type="green">校验成功</TypeTags>
    if(dataStatus=='CHECK_FAIL') return <a onClick={()=> {clickDownload(record.importResultFileCode, record.groupName)}}>校验失败(结果报告)</a>
    if(dataStatus=='CHECKING') return <TypeTags type="blue">校验中</TypeTags>
    if(dataStatus=='CALCULATING') return <TypeTags type="orange">正在更新</TypeTags>
    if(dataStatus=='WAIT_CALCULATE') return <TypeTags type="purple">等待计算</TypeTags>
    if(dataStatus=='CALCULATE_SUCCESS') return <TypeTags type="indigo">更新成功</TypeTags>
    if(dataStatus=='CALCULATE_FAIL') return <TypeTags type="red">更新失败</TypeTags>
  }

  return (
    <>
      <div className={style.filter_box}>
        {/* 为了方便迁移，这里可以直接使用Form.Item内嵌的方式 */}
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={search} onReset={resetForm}>
          <Form.Item label="运行状态" name='runStatus' labelCol={{flex: '0 0 120px'}} >
            <Select onChange={(value)=> {setRunStatus(value)}} placeholder="选择运行状态" clearIcon>
              {
                runState.map((item, key) => <Option key={item.id} value={item.id}>{item.value}</Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item label="创建方式：" labelCol={{flex: '0 0 120px'}} name='createType'>
            <Select onChange={(value)=> {setCreateType(value)}} placeholder="选择创建方式">
              {
                createAWay.map((item, key) => <Option key={key} value={item.id}>{item.value}</Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item  label="群组名称：" labelCol={{flex: '0 0 120px'}}  name="couponSkuNo">
            <Input onChange={(e)=>{setGroupName(e.target.value)}} placeholder="请输入关键字" />
          </Form.Item>
        </QueryFilter>
      </div>
      <div className={style.list_box}>

        <ListTitle titleName="数据列表">
          <Space size={8}>
            <Checkbox checked={pageInfo.createUser} onChange={(e)=>{setCreateUser(e.target.checked)}}>我创建的用户群</Checkbox>
            <Button type="primary" onClick={createGroups}>创建用户群</Button>
          </Space>
        </ListTitle>
        <ListTable showPagination current={pageInfo.current} pageSize={pageInfo.pageSize} total={total}
        onChange={handleTableChange} 
        >
          <Table pagination={false} dataSource={userGroupList.list} scroll={{x:1550}}>
            <Column title="群组名称" dataIndex="groupName" key="groupName" render={(text,record)=>(
              <a onClick={()=>openDetail(record)}>
                {text}
              </a>
            )} />
            <Column title="群组ID" dataIndex="groupCode" key="groupCode" />
            <Column title="创建方式" dataIndex="createTypeName" key="createTypeName" />
            <Column title="更新方式" dataIndex="refreshType" key="refreshType" />
            <Column title="群组人数" dataIndex="countNum" key="countNum" />
            <Column title="数据更新时间" dataIndex="latestFinishTime" key="latestFinishTime" render={(text,record)=>(
              <ListTableTime>{text}</ListTableTime>
            )}/>
            <Column
              title="数据更新结果"
              key="dataStatus"
              dataIndex="dataStatus"
              render={(text, record) => (
                <Space size="middle">
                  {
                    dataStatusShow(text,record)
                  }
                </Space>
              )}
            />
            <Column title="群组状态" dataIndex="runStatus" key="runStatus" width={120} render={(text,record)=>(
              <>
                {text=='1'?<StateBadge color="#52c41a">启用</StateBadge>:<StateBadge color="#f5222d">禁用</StateBadge>}
              </>
            )} />
            <Column title="更新时间" dataIndex="updateTime" key="updateTime" render={(text,record)=>(
              <ListTableTime>{text}</ListTableTime>
            )}/>
            <Column title="创建人" dataIndex="createUserName" key="createUserName" />
            <Column title="创建时间" dataIndex="createTime" key="createTime" render={(text,record)=>(
              <ListTableTime>{text}</ListTableTime>
            )}/>
            <Column
              title="操作"
              key="action"
              width={250}
              fixed='right'
              render={(text, record) => (
                <ListTableBtns>
                  {
                    record.refreshType == '手动更新'?
                    <LtbItem onClick={()=>clickRefresh(record.id)}>刷新</LtbItem>:''
                  }
                  <LtbItem onClick={()=>clickRevamp(record.id, record.createType)}>修改</LtbItem>

                  <LtbItem onClick={()=>changeStatus(record)}>{record.runStatus=='1'?'禁用':'启用'}</LtbItem>
                  <LtbItem onClick={()=>exportListView(record)}>查看导出名单</LtbItem>
                  <LtbItem onClick={()=>openCallScene(record)}>调用场景</LtbItem>
                </ListTableBtns>
              )}
            />
          </Table>

        </ListTable>
      </div>
      <CreateTagModal/>
      {
       isExportListShow ? <ExportListModal isExportListShow={isExportListShow} exportData={exportData} hideExportList={hideExportList}/> : null
      }
      {listDetailShow ? <ListDetail modalInfo={modalInfo} />:''}
      {callSceneShow ? <CallScene modalInfo={modalInfo} /> :''}
    </>
  )
}
export default connect(({ setGroupList, setTagPanel,dataModule_common,tagAttribute }) => ({
  userGroupList: setGroupList.userGroupList,
  userInfo: setTagPanel.userInfo,
  customerNameList: setGroupList.customerNameList,
  isCreateModalVisible: setGroupList.isCreateModalVisible,
  attributeSelectData:dataModule_common.attributeSelectData,
  actionSelectData:dataModule_common.actionSelectData,
  listDetailShow:setGroupList.listDetailShow,
  callSceneShow:setGroupList.callSceneShow,
  selectData:tagAttribute.selectData,
  twoListData:tagAttribute.twoListData,
}))(GrouplList);