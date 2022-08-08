import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, message, Space,Form,Table,Button,Modal,Select
} from "antd";
import { ListTable,TextEllipsis,} from "@/components/commonComp/index";

const {Column} = Table;
let rowOption = [];

import style from "./selectWin.less";
const modal = (props) => {
  const { dispatch,closeEvent } = props;
  const [form] = Form.useForm()
  const [categoryList,setCategoryList] = useState([]);
  const [list,setList] = useState([]);
  const [selectedRowKeys,setSelectedRowKeys] = useState([]);
  const [total,setTotal] = useState(0);
  const [pageInfo,setPageInfo] = useState({
    pageNum: 1,
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
          articleTitle:item.articleTitle,
          refUrl:item.refUrl,
        }
      });
      setSelectedRowKeys(key)
    },
    type:'radio',
    selectedRowKeys: selectedRowKeys
  }

  const crmNewsCategoryList=()=>{
    dispatch({
      type: 'smartField_model/queryAllCategory',
      payload: {
        method:'postJSON',
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
    rowOption=[];
    crmNewsCategoryList();
  },[])

  const getList=()=>{
    let obj = form.getFieldsValue();
    dispatch({
      type: 'smartField_model/articleList',
      payload: {
        method:'postJSON',
        params:{
          ...pageInfo,
          ...obj,
          articleStatus:1,
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
      pageNum:1,
      pageSize:10,
    })
  }

  //分页切换
  const handleTableChange = (current,pageSize) => {
    let _obj = JSON.parse(JSON.stringify(pageInfo));
    _obj.pageNum = current;
    _obj.pageSize = pageSize;
    setPageInfo(_obj)
  }
  //选中
  const selectSend=()=>{
    closeEvent(rowOption)
  }

  return (
    <Modal title={'文章选择'} width={1000} visible={true} centered maskClosable={false} onOk={selectSend} onCancel={handleCancel}>
      <div className={style.information}>
        <Form className={style.formBox} form={form} onFinish={getList}>
          <Form.Item label="标题" name='articleTitle' className={style.formBox_item} placeholder="请输入">
            <Input />
          </Form.Item>
          <Form.Item label="分类" name='categoryId' className={style.formBox_item} allowClear>
            <Select placeholder="选择分类" >
              {
                categoryList.map((item) => <Option key={item.objectId} value={item.objectId}>{item.categoryName}</Option>)
              }
            </Select>
          </Form.Item>
          <div className={style.formBox_btn}>
            <Space span={8}>
              <Button onClick={resetForm}>重置</Button>
              <Button type="primary" htmlType="submit">查询</Button>
            </Space>
          </div>
        </Form>
        <ListTable showPagination current={pageInfo.pageNum} pageSize={pageInfo.pageSize} total={total} style={{padding: 0}}
        onChange={handleTableChange}>
          <Table pagination={false} dataSource={list} scroll={{y:500}}
          rowSelection={rowSelection} rowKey="objectId">
            <Column title="文章ID" dataIndex="objectId" width={200} />
            <Column title="文章标题" dataIndex="articleTitle" />
            <Column title="文章分类" dataIndex="categoryNames" render={(text, record)=>(
              <TextEllipsis>{text}</TextEllipsis>
            )}/>
            <Column title="文章链接" dataIndex="refUrl" />
          </Table>
        </ListTable>
      </div>
    </Modal>
  )
};
export default connect(({  }) => ({
  
}))(modal)
