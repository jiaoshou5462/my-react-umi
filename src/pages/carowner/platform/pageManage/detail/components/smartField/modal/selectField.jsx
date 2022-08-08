import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, Image, Space,Form,Table,Button,Modal,Select, message
} from "antd";
import { ListTable,} from "@/components/commonComp/index";
import {fieldType_dict,status_dict,fieldContentType_dict,getDictName} from '@/pages/carowner/smartField/dict';
import { RightOutlined } from "@ant-design/icons";
const {Column} = Table;
let rowOption = [];


import style from "./style.less";
const tokenObj = localStorage.getItem('tokenObj') ? JSON.parse(localStorage.getItem('tokenObj')) : {};
const modal = (props) => {
  const { dispatch,closeEvent,selItem,fieldContentType} = props;
  const [form] = Form.useForm()
  const [categoryList,setCategoryList] = useState([]);
  const [list,setList] = useState([]);
  const [selectedRowKeys,setSelectedRowKeys] = useState([]);
  const [total,setTotal] = useState(0);
  const [pageInfo,setPageInfo] = useState({
    pageNo: 1,
    pageSize: 10
  });

  useEffect(()=>{
    if(selItem && selItem[0]){
      let _selItem = selItem.map(item=>{
        return item.objectId
      })
      setSelectedRowKeys(_selItem);
      rowOption = JSON.parse(JSON.stringify(selItem));
    }else{
      rowOption = [];
    }
  },[])

  //关闭弹窗
  const handleCancel=()=>{
    closeEvent(false)
  }
  const rowSelection = {
    onChange: (key, option) => {
      rowOption = option;
      setSelectedRowKeys(key)
    },
    type:'radio',
    selectedRowKeys: selectedRowKeys
  }
  
  
  const getList=()=>{
    let obj = form.getFieldsValue();
    if(obj.objectId) obj.objectId = Number(obj.objectId);
    dispatch({
      type: 'smartField_model/channelWechatSmartFieldList',
      payload: {
        method:'postJSON',
        params:{
          ...pageInfo,
          ...obj,
          fieldContentType:fieldContentType || 1,
          status: 2,
        }
      },
      callback:(res)=>{
        if(res.result.code == '0'){
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
    if(!rowOption.length){
      message.warning('请选择产品');
      return;
    }
    closeEvent(rowOption[0])
  }
  const toCreateLanwei=()=>{
    history.push('/carowner/smartField/list')
  }

  return (
    <Modal title={'栏位内容'} width={1200} visible={true} centered maskClosable={false} onOk={selectSend} onCancel={handleCancel}>
      <div className={style.information}>
        <Form className={style.formBox} form={form} onFinish={getList}>
          <Form.Item label="栏位ID" name='objectId' className={style.formBox_item} placeholder="请输入">
            <Input />
          </Form.Item>
          <Form.Item label="名称" name='fieldName' className={style.formBox_item} placeholder="请输入">
            <Input />
          </Form.Item>
          <div className={style.formBox_btn} style={{flex: '0 0 33%'}}>
            <Space span={8}>
              <Button onClick={resetForm}>重置</Button>
              <Button type="primary" htmlType="submit">查询</Button>
            </Space>
          </div>
          <div className={style.formBox_btn} style={{flex: '0 0 100%'}}>
            <span onClick={toCreateLanwei} className={style.formBox_link}>没有合适的内容，那就去创建一个吧
            <RightOutlined />
            <RightOutlined /></span>
          </div>
        </Form>
        <ListTable showPagination current={pageInfo.pageNo} pageSize={pageInfo.pageSize} total={total} style={{padding: 0}}
        onChange={handleTableChange}>
          <Table pagination={false} dataSource={list} scroll={{y:500}}
          rowSelection={rowSelection} rowKey="objectId">
            <Column title="栏位ID" dataIndex="objectId" width={100}/>
            <Column title="栏位名称" dataIndex="fieldName"  />
            <Column title="栏位类型" dataIndex="fieldType" render={(text,record)=>(
              <>{getDictName(fieldType_dict,text)}</>
            )} />
            <Column title="内容数量" dataIndex="contentCount" />
          </Table>
        </ListTable>
      </div>
    </Modal>
  )
};
export default connect(({  }) => ({
  
}))(modal)
