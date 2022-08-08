// 调用场景
// 用户群详情
//创建弹窗
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import { Button, Modal, Table, Radio } from 'antd';

const {Column, showTotal} = Table

const callScene = (props) => {
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
      type:'setGroupList/setCallSceneShow',
      payload:false,
    })
  }
  const handleTableChange = (pagination) => {
    let _obj = JSON.parse(JSON.stringify(pageInfo));
    _obj.current = pagination.current;
    _obj.pageSize = pagination.pageSize;
    setPageInfo(_obj)
  }
  useEffect(()=>{
    dispatch({
      type:'setGroupList/userGroupGetTagSceneById',
      payload: {
        method: 'get',
        userGroupId: modalInfo.id,
      },
      callback:(res)=>{
        if(res && res.length){
          setList(res);
        }
      }
    })
  },[])

  return (
    <>
      <Modal title={"群组调用场景"} width={800}
      visible={true} maskClosable={false} onCancel={handleCancel} 
      footer={[<Button type="primary" onClick={handleCancel}>关闭</Button>]}>
        <div className={style.info}>
          <div className={style.info_title}>{modalInfo.groupName}</div>
        </div>
        <div className={style.style}>
        <Table scroll={{ y: 400 }} onChange={handleTableChange} dataSource={list} >
            <Column title="调用场景" dataIndex="callSence" key="callSence" />
            <Column title="场景名称" dataIndex="senceName" key="senceName" />
            <Column title="被调用时间" dataIndex="callTimeEnd" key="callTimeEnd" render={(text,record)=>(
              <>
                {record.callTimeStart} ~ {record.callTimeEnd}
              </>
            )} />
          </Table>
        </div>
      </Modal>
    </>
  )
}
export default connect(({ setGroupList }) => ({
  listDetailShow:setGroupList.listDetailShow,
}))(callScene);