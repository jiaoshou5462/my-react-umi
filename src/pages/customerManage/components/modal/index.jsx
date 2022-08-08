import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Table, Modal, Tree, message, Checkbox, Transfer, Tooltip} from "antd"
import style from "./style.less";
const { Column } = Table;
const modal = (props) => {
  let { dispatch, modalInfo, toFatherValue } = props;
  let [recordInfo, setRecordInfo] = useState([])
  useEffect(() => {
    queryEditRecord()
  },[])
  // 查询修改记录
  let queryEditRecord = () => {
    dispatch({
      type: 'customerListDetail/queryEditRecord',
      payload: {
        method: 'postJSON',
        params: {
          objectId:modalInfo.objectId,
          typeName:modalInfo.type,
        },
      },
      callback: (res) => {
        if(res.code=='S000000') {
          setRecordInfo(res.data)
        }else {
          message.error(res.message)
        }
      }
    })
  }
  return (
    <>
      {/* 修改记录 */}
      <Modal title="修改记录" visible={modalInfo.modalName=='editrecord'} width={900} footer={null} onCancel={()=> {toFatherValue(false)}}>
        <Table dataSource={recordInfo} pagination={false}>
          <Column align={'center'} title="修改事项" dataIndex="typeName" key="typeName" />
          <Column align={'center'} title="修改内容" width={100} dataIndex="remark" key="remark" />
          <Column align={'center'} title="修改时间" dataIndex="createTime" key="createTime" />
          <Column align={'center'} title="操作人" dataIndex="createUser" key="createUser" />
        </Table>
      </Modal>
    </>
  )
}


export default connect(({  }) => ({
}))(modal)







