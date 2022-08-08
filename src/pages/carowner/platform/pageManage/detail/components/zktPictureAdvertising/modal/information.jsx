import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, message, Space,Form,Table,Button,Modal,Select
} from "antd";
import { ListTable,} from "@/components/commonComp/index";

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
        //替换 弹窗抛出给外部的数据
        return {value:item.objectId,label:item.title};
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
  const crmNewsCategoryList=()=>{
    dispatch({
      type: 'carowner_pageManage/crmNewsCategoryList',
      payload: {
        method:'post',
        params:{}
      },
      callback:(res)=>{
        if(res.result.code == '0'){
          setCategoryList(res.body.data || [])
        }
      }
    })
  }
  
  useEffect(()=>{
    crmNewsCategoryList();
  },[])

  const getList=()=>{
    let obj = form.getFieldsValue();
    dispatch({
      type: 'carowner_pageManage/queryHotProduct',
      payload: {
        method:'postJSON',
        params:{
          ...pageInfo,
          ...obj,
        }
      },
      callback:(res)=>{
        if(res.result.code == '0' && res.body){
          setList(res.body.data || [])
          let _pageInfo = res.body.pageInfo;
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
    <Modal title={'资讯内容'} width={1200} visible={true} centered maskClosable={false} onOk={selectSend} onCancel={handleCancel}>
      <div className={style.information}>
        <Form className={style.formBox} form={form} onFinish={getList}>
          <Form.Item label="标题" name='title' className={style.formBox_item} placeholder="请输入">
            <Input />
          </Form.Item>
          <Form.Item label="分类" name='newsCategory' className={style.formBox_item} allowClear>
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
            <Column title="资讯标题" dataIndex="title" />
            <Column title="内容简介" dataIndex="textContent" />
            <Column title="分类" dataIndex="newsCategoryName" width={150}/>
            <Column title="转发数量" dataIndex="forwardNum" width={150}/>
            <Column title="转发点击数" dataIndex="forwardClickNum" width={150}/>
          </Table>
        </ListTable>
      </div>
    </Modal>
  )
};
export default connect(({  }) => ({
  
}))(modal)
