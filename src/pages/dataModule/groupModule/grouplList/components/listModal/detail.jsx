// 用户群详情
//创建弹窗
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import { Button, Modal, Table, Tag,Space, } from 'antd';

const {Column, showTotal} = Table

const listDetail = (props) => {
  let { dispatch,modalInfo } = props;
  let [pageInfo,setPageInfo] = useState({
    createUser:false,
    current:1,
    pageSize:10,
  })
  let [total, setTotal] = useState(0);
  let [list, setList] = useState([]);
  let [totalData,setTotalData] = useState({});
  const handleCancel=()=>{
    dispatch({
      type:'setGroupList/setListDetailShow',
      payload:false,
    })
  }
  const handleTableChange = (pagination) => {
    let _obj = JSON.parse(JSON.stringify(pageInfo));
    _obj.current = pagination.current;
    _obj.pageSize = pagination.pageSize;
    setPageInfo(_obj)
  }
  const getData=()=>{
    dispatch({
      type:'setGroupList/getDetailList',
      payload: {
        method: 'get',
        userGroupId: modalInfo.id,
      },
      callback:(res)=>{
        if(res && res.sparkTasks){
          setTotalData(res);
          setList(res.sparkTasks.list);
        }
      }
    })
  }
 
  useEffect(()=>{
    getData();
  },[pageInfo])

  const dataStatusShow=(dataStatus,b)=>{
    console.log(dataStatus,b)
    if(dataStatus=='SUCCESS') return <Tag color="green">成功</Tag>
    if(dataStatus=='FAIL') return <Tag color="red">失败</Tag>
    if(dataStatus=='WAITING') return <Tag color="orange">等待</Tag>
    if(dataStatus=='CALCULATING') return <Tag color="blue">计算中</Tag>
  }

  return (
    <>
      <Modal title={"群组详情"} width={800}
      visible={true} maskClosable={false} onCancel={handleCancel} 
      footer={[<Button type="primary" onClick={handleCancel}>关闭</Button>]}>
        <div className={style.info}>
          <div className={style.info_title}>{totalData.groupName}</div>
          <div className={style.info_block}>
            <div>状态：{totalData.runStatus=='1'? <span style={{color:'#52c41a'}}>启用</span>: <span style={{color:'#f5222d'}}>禁用</span>}</div>
            <div>创建方式：<span> {modalInfo.createTypeName}</span></div>
            <div>去重规则：<span>{totalData.policyUnique ? '按用户保单唯一去重':'按用户唯一去重'}</span></div>
          </div>
          <div className={style.info_block}>
            <div>创建时间：<span>{totalData.createTime}</span></div>
            <div>最近一次更新时间：<span>{totalData.newsUpdateTime}</span></div>
          </div>
        </div>
        <div className={style.style}>
        <Table scroll={{ y: 400 }} onChange={handleTableChange} pagination={{
            current: pageInfo.current,
            pageSize: pageInfo.pageSize,
            total: total
          }} dataSource={list} >
            <Column title="更新时间" dataIndex="finishTime" key="calculateStart" />
            <Column title="群组人数" dataIndex="peopleNumber" key="peopleNumber" />
            <Column title="更新结果" dataIndex="taskStatus" key="taskStatus" 
            render={(text, record) => (
              <Space size="middle">
                {
                  dataStatusShow(text)
                }
              </Space>
            )}/>
            <Column title="操作人" dataIndex="operatorName" key="operatorName" />
          </Table>
        </div>
      </Modal>
    </>
  )
}
export default connect(({ setGroupList }) => ({
  listDetailShow:setGroupList.listDetailShow,
}))(listDetail);