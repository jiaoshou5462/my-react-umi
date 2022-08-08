import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, message, Space,Form,Table,Button,Modal,Select
} from "antd";
import { ListTable,} from "@/components/commonComp/index";
import moment from 'moment';

const {Column} = Table;
let rowOption = [];

import style from "./style.less";
const modal = (props) => {
  const { dispatch,selectedKeys,closeEvent } = props;
  const [form] = Form.useForm()
  const [categoryList,setCategoryList] = useState([]);
  const [list,setList] = useState([]);
  const [selectedRowKeys,setSelectedRowKeys] = useState([]);
  const [total,setTotal] = useState(0);
  const [pageInfo,setPageInfo] = useState({
    pageNo: 1,
    pageSize: 10
  });

  //关闭弹窗
  const handleCancel=()=>{
    closeEvent(false)
  }
  const rowSelection = {
    onChange: (key, option) => {
      rowOption = option.map(item=>{
        //替换 弹窗抛出给外部的数据
        return {value:item.objectId,label:item.internalName};
      });
      setSelectedRowKeys(key)
    },
    type:'radio',
    selectedRowKeys: selectedRowKeys
  }
  useEffect(()=>{
    let _keys = selectedKeys.map(item=>{
      return item.value;
    })
    rowOption = selectedKeys;
    setSelectedRowKeys(_keys)
  },[selectedKeys])
  const queryMarketTypeList=()=>{
    dispatch({
      type: 'carowner_pageManage/queryMarketTypeList',
      payload: {
        method:'get',
        params:{}
      },
      callback:(res)=>{
        if(res.result.code == '0'){
          setCategoryList(res.body || [])
        }
      }
    })
  }
  
  useEffect(()=>{
    queryMarketTypeList();
  },[])

  const getList=()=>{
    let obj = form.getFieldsValue();
    dispatch({
      type: 'carowner_pageManage/queryActivityByStatus',
      payload: {
        method:'postJSON',
        params:{
          ...pageInfo,
          ...obj,
        }
      },
      callback:(res)=>{
        if(res.result.code == '0' && res.body){
          setList(res.body.list || [])
          setTotal(res.body.total);
        }
      }
    })
  }

  useEffect(()=>{
    getList();
  },[pageInfo])

  const resetForm=()=>{
    form.resetFields();
    setPageInfo({
      pageNo:1,
      pageSize:10,
    })
  }

  //分页切换
  const handleTableChange = (current,pageSize) => {
    let _obj = JSON.parse(JSON.stringify(pageInfo));
    _obj.pageNo = current;
    _obj.pageSize = pageSize;
    setPageInfo(_obj)
  }
  //选中
  const selectSend=()=>{
    closeEvent(rowOption)
  }
  const showTypeName=(value)=>{
    if(categoryList.length){
      for(let item of categoryList){
        if(item.marketActivityType==value){
          return item.marketActivityTypeStr;
        }
      }
    }
  }

  return (
    <Modal title={'营销活动'} width={1200} visible={true} centered maskClosable={false} onOk={selectSend} onCancel={handleCancel}>
      <div className={style.information}>
        <Form className={style.formBox} form={form} onFinish={getList}>
          <Form.Item label="活动ID" name='activityId' className={style.formBox_item} placeholder="请输入">
            <Input />
          </Form.Item>
          <Form.Item label="名称" name='activityName' className={style.formBox_item} placeholder="请输入">
            <Input />
          </Form.Item>
          <Form.Item label="活动类型" name='activityType' className={style.formBox_item} allowClear style={{paddingRight: '0'}}>
            <Select placeholder="选择分类" >
              {
                categoryList.map((item) => <Option key={item.marketActivityType} value={item.marketActivityType}>
                  {item.marketActivityTypeStr}
                </Option>)
              }
            </Select>
          </Form.Item>
          <div className={style.formBox_btn} style={{flex: '0 0 100%'}}>
            <Space span={8}>
              <Button onClick={resetForm}>重置</Button>
              <Button type="primary" htmlType="submit">查询</Button>
            </Space>
          </div>
        </Form>
        <ListTable showPagination current={pageInfo.pageNo} pageSize={pageInfo.pageSize} total={total} style={{padding: 0}}
        onChange={handleTableChange}>
          <Table pagination={false} dataSource={list} scroll={{y:500}}
          rowSelection={rowSelection} rowKey="objectId">
            <Column title="活动ID" dataIndex="objectId" />
            <Column title="活动内部名称" dataIndex="internalName" />
            <Column title="活动类型" dataIndex="marketType" 
            render={(text, record) => (
              <>{showTypeName(text)}</>
            )}/>
            <Column title="活动开始时间" dataIndex="startTime"
            render={(text, record) => (
              <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>
            )}/>
            <Column title="活动结束时间" dataIndex="endTime"
            render={(text, record) => (
              <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>
            )}/>
          </Table>
        </ListTable>
      </div>
    </Modal>
  )
};
export default connect(({  }) => ({
  
}))(modal)
