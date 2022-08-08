import React,{useEffect,useState} from 'react';
import { connect,history } from 'umi';
import style from './style.less';
import {
  Form,
  Input,
  Table,
  Badge,
  Space,
  Button,
  Pagination,
  Modal,
  Select,
  Tooltip,
  message,
  ConfigProvider,} from 'antd';

import { QueryFilter} from '@ant-design/pro-form';

import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";

import {formatDate, formatTime} from '@/utils/date';
import {fieldType_dict,status_dict,fieldContentType_dict} from '../dict';

import Statistics from './statistics';
const getDictName=(dict,value)=>{
  for(let item of dict){
    if(item.value==value){
      return item.label;
    }
  }
}

let compData={};
let compDataDetail={};
const { Column } = Table;

const { Option } = Select;

const Home = (props) =>{
  const {dispatch} = props;
  let [form] = Form.useForm();

  const [tableList,setTableList] = useState([]);
  const [total,setTotal] = useState(10); 
  const [pageInfo,setPageInfo] = useState({
    pageNo:1,
    pageSize:10,
  });
 
  const submitData=()=>{
    getList();
  };
  const resetForm=()=>{
    let _pageInfo = JSON.parse(JSON.stringify(pageInfo));
    _pageInfo.pageNo = 1;
    form.resetFields();
    setPageInfo(_pageInfo);
  };

  //分页
  const pageChange=(page,pageSize)=>{
    let _pageInfo = JSON.parse(JSON.stringify(pageInfo));
    _pageInfo.pageNo = page;
    _pageInfo.pageSize = pageSize;
    setPageInfo(_pageInfo)
  }
 
  const getList=()=>{
    let formObj = form.getFieldsValue();
    dispatch({
      type: 'smartField_model/channelWechatSmartFieldList',
      payload:{
        method:'postJSON',
        params: {
          ...formObj,
          ...pageInfo,
        }
      },
      callback:(res)=>{
        if(res.result.code=='0' && res.body){
          setTableList(res.body.list);
          setTotal(res.body.total);
        }else{
          message.error(res.result.message || '');
        }
      }
    })
  }

  //page pageSize监听
  useEffect(()=>{
    getList();
  },[pageInfo])

  //启用禁用
  const changeStatus=(record)=>{
    //status 1未启用 2启用
    Modal.confirm({
      content: record.status==1 ? '请确认是否启用？':'请确认是否禁用',
      onOk:()=>{
        dispatch({
          type: 'smartField_model/updateEnableStatus',
          payload: {
            method: 'postJSON',
            params: {
              objectId: record.objectId,
              status: record.status==1 ? 2:1,
            }
          },
          callback: (res) => {
            if(res.result.code=='0'){
              message.success('操作成功');
              getList();
            }else{
              message.error(res.result.message || '');
            }
          }
        })
      }
    })
  }
  //删除
  const deleteItem=(record)=>{
    Modal.confirm({
      content: '请确认是否删除',
      onOk:()=>{
        dispatch({
          type: 'smartField_model/channelWechatSmartFieldDelete',
          payload: {
            method: 'postJSON',
            params: {
              objectId: record.objectId,
            }
          },
          callback: (res) => {
            if(res.result.code=='0'){
              message.success('操作成功');
              getList();
            }else{
              message.error(res.result.message || '');
            }
          }
        })
      }
    })
  }
  //新增
  const addItem=()=>{
    history.push(`/carowner/smartField/list/detail`)
  }
  //进入详情页 编辑
  const toDetail=(item)=>{
    history.push(`/carowner/smartField/list/detail?id=${item.objectId}`)
  }
  const statistics=(item)=>{
    history.push(`/carowner/smartField/list/statistics?id=${item.objectId}`)
  }

  // 所有组件根据自己需要引入
  return(
    <>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={submitData} onReset={resetForm}>
          <Form.Item label="栏位名称" name="fieldName" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="栏位类型" name="fieldType" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="不限" allowClear>
              {
                fieldType_dict.map(item=>{
                  return <Option value={item.value}>{item.label}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="栏位内容" name="fieldContentType" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="不限" allowClear>
              {
                fieldContentType_dict.map(item=>{
                  return <Option value={item.value}>{item.label}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="状态" name="status" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="不限" allowClear>
              {
                status_dict.map(item=>{
                  return <Option value={item.value}>{item.label}</Option>
                })
              }
            </Select>
          </Form.Item>
        </QueryFilter>
      </div>
      <div className={style.list_box}>
        {/* 表格标题 功能按钮 */}
        <ListTitle titleName="栏位">
          <Space size={8}>
            <Button type='primary' onClick={addItem}>新建</Button>
          </Space>
        </ListTitle>
        <ListTable showPagination current={pageInfo.pageNo} pageSize={pageInfo.pageSize} total={total}
        onChange={pageChange}>
          <Table dataSource={tableList} scroll={{x:1200}} pagination={false}>
            <Column title="栏位ID" dataIndex="objectId" render={(text, record)=>(
              <span className={style.table_id} onClick={()=>toDetail(record)}>{text}</span>
            )}/>
            <Column title="栏位名称" dataIndex="fieldName"  />
            <Column title="栏位类型" dataIndex="fieldType" 
            render={(text, record)=>(<>
              {text==1?<TypeTags type="green">{getDictName(fieldType_dict,text)}</TypeTags>:''}
              {text==2?<TypeTags type="red">{getDictName(fieldType_dict,text)}</TypeTags>:''}
              </>
            )}/>
            <Column title="栏位内容" dataIndex="fieldContentType" 
            render={(text, record)=>(<>
              {getDictName(fieldContentType_dict,text)}
              </>
            )}/>
            <Column title="状态" dataIndex="status" 
            render={(text, record)=>(<>
              {text==1?<StateBadge type="red">{getDictName(status_dict,text)}</StateBadge>:''}
              {text==2?<StateBadge type="green">{getDictName(status_dict,text)}</StateBadge>:''}
            </>)}/>
            <Column title="更新时间" dataIndex="updateTime"  
            render={(text, record)=>(
              <ListTableTime>{formatTime(text)}</ListTableTime>
            )}/>
            <Column title="操作人" dataIndex="updateUser"   />
            <Column title="操作"  key="id" fixed="right" width={230}
            render={(text, record)=>(
              <ListTableBtns>
                <LtbItem onClick={()=>changeStatus(record)}>{record.status==1?'启用':'停用'}</LtbItem>
                {record.status==1?<LtbItem onClick={()=>toDetail(record)}>编辑</LtbItem>:''}
                {record.status==1?<LtbItem onClick={()=>deleteItem(record)}>删除</LtbItem>:''}
                <LtbItem onClick={()=>statistics(record)}>数据统计</LtbItem>
              </ListTableBtns>
            )}/>
          </Table>
        </ListTable>

      </div>
    </>
  )
}
export default connect(({ loading }) => ({
  
}))(Home);