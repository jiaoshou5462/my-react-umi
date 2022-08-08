import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, Image, Space,Form,Table,Button,Modal,Select, message
} from "antd";
import { ListTable,} from "@/components/commonComp/index";

const {Column} = Table;
let rowOption = [];

import style from "./selectWin.less";
const tokenObj = localStorage.getItem('tokenObj') ? JSON.parse(localStorage.getItem('tokenObj')) : {};
const modal = (props) => {
  const { dispatch,closeEvent } = props;
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
        return {
          businessId:item.objectId,
          goodTitle:item.goodTitle,
          goodPrice:item.goodPrice,
          upload_img:item.upload_img,
        }
      });;
      setSelectedRowKeys(key)
    },
    type:'radio',
    selectedRowKeys: selectedRowKeys
  }
  
  const crmNewsCategoryList=()=>{
    dispatch({
      type: 'carowner_pageManage/getAllGoodClass',
      payload: {
        method:'get',
        channelId:tokenObj.channelId,
      },
      callback:(res)=>{
        if(res.code == 'S000000'){
          setCategoryList(res.data || [])
        }
      }
    })
  }
  
  useEffect(()=>{
    rowOption=[];
    crmNewsCategoryList();
  },[])

  const getList=()=>{
    let obj = form.getFieldsValue();
    dispatch({
      type: 'carowner_pageManage/getPageSupGoodsPage',
      payload: {
        method:'postJSON',
        params:{
          pageInfo:pageInfo,
          ...obj,
        }
      },
      callback:(res)=>{
        if(res.code == 'S000000'){
          setList(res.data || [])
          let _pageInfo = res.pageInfo;
          setTotal(_pageInfo.totalCount);
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
    closeEvent(rowOption)
  }

  return (
    <Modal title={'热销产品'} width={1200} visible={true} centered maskClosable={false} onOk={selectSend} onCancel={handleCancel}>
      <div className={style.information}>
        <Form className={style.formBox} form={form} onFinish={getList}>
          <Form.Item label="产品ID" name='productId' className={style.formBox_item} placeholder="请输入">
            <Input />
          </Form.Item>
          <Form.Item label="名称" name='goodTitle' className={style.formBox_item} placeholder="请输入">
            <Input />
          </Form.Item>
          <Form.Item label="产品分类" name='objectId' className={style.formBox_item} allowClear style={{paddingRight: '0'}}>
            <Select placeholder="选择分类" >
              {
                categoryList.map((item) => <Option key={item.objectId} value={item.objectId}>{item.className}</Option>)
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
            <Column title="产品ID" dataIndex="objectId" width={100}/>
            <Column title="产品名称" dataIndex="goodTitle"  />
            <Column title="产品分类" dataIndex="className"  />
            <Column title="产品图片" dataIndex="goodImg" 
            render={(text, record) => (
              <Image width={70} height={70} src={text}></Image>
            )}/>
            <Column title="产品价格" dataIndex="goodPrice" key="goodPrice" />
          </Table>
        </ListTable>
      </div>
    </Modal>
  )
};
export default connect(({  }) => ({
  
}))(modal)
