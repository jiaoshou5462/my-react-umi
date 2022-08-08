import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Table, Modal, Tree, message, Checkbox, Transfer, Tooltip} from "antd"
import { FileTextOutlined } from '@ant-design/icons';
import style from "./style.less";
const { Column } = Table;
const { TextArea, Search } = Input;
const { DirectoryTree } = Tree;
const modal = (props) => {
  let { dispatch, modalInfo, toFatherValue } = props;
  // 公众号回复删除确认事件
  const deleteReply = () => {
    dispatch({
      type: 'ReplyManage/deleteReplyId',
      payload: {
        method: 'delete',
        objectId: modalInfo.objectId
      },
      callback: (res) => {
        toFatherValue(true)
      }
    });
  }
  return (
    <>
      {/* 公众号回复删除 */}
      <Modal title="提示" visible={modalInfo.modalName=='deleteReply'} onOk={()=> {deleteReply()}} onCancel={()=> {toFatherValue(false)}}>
        <p>确认删除本条回复规则吗？</p>
      </Modal>
    </>
  )
}


export default connect(({ ReplyManage }) => ({
}))(modal)