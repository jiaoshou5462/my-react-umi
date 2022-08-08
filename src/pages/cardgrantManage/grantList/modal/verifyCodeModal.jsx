import React, { useState, useEffect, useRef, useContext } from 'react';
import { connect, history } from 'umi';
import {
  Row, Col, Form, Space, Radio, Input, Table, Select, Divider, Button, DatePicker,
  Descriptions, Modal, message, InputNumber
} from "antd"
import moment from 'moment';
import style from './modalStyle.less';

const { Column } = Table;
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;

//兑换码弹框
const verifyCodeModal = (props) => {
  let { dispatch, isVerifyCodeModalVisible, closeModal, currentInfo, verifyCodeData, codeFilePassData } = props;
  let [form] = Form.useForm();
  console.log(currentInfo, 'currentInfo')
  console.log(verifyCodeData, 'verifyCodeData')
  let [isLookFilePassword, setIsLookFilePassword] = useState(false);//查看文件密码弹框

  useEffect(() => {
    getVerifyCode()
  }, [])

  //查看兑换码接口
  const getVerifyCode = () => {
    dispatch({
      type: 'cardgrantManageModel/getVerifyCode',
      payload: {
        method: 'postJSON',
        params: {},
        grantBatchId: currentInfo.grantBatchId
      }
    })
  }

  const downfileOP = (text, all) => {
    return <a onClick={() => { downCodeFile(text, all) }}>下载兑换码文件</a>
  }
  let downCodeFile = (text, all) => {
    let fileName = all.fileName;
    dispatch({
      type: 'cardgrantManageModel/fileDownload',//下载文件
      payload: {
        method: 'get',
        params: {},
        fileCode: all.fileId,
        responseType: 'blob'
      },
      callback: (res) => {
        if (res) {
          const url = window.URL.createObjectURL(new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.setAttribute('download', fileName + '.xlsx');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    })
  }

  const passwordOP = (text, all) => {
    return <a onClick={() => (lookFilePassword(text, all))}>查看文件密码</a>
  }
  let lookFilePassword = (text, all) => {
    setIsLookFilePassword(true);
    dispatch({
      type: 'cardgrantManageModel/getVerifyCodeFilePass',//查看文件密码信息
      payload: {
        method: 'postJSON',
        params: {
          fileId: all.fileId
        },
      }
    })
  }

  return (
    <>
      <Modal
        title='查看兑换码'
        width='70%'
        visible={isVerifyCodeModalVisible}
        onCancel={() => { closeModal() }}
        footer={[
          <Button key="closeRecord" onClick={() => closeModal()}>
            关闭
          </Button>
        ]}>
        <Descriptions column={3} labelStyle={{ marginLeft: '50px', marginBottom: '50px' }}>
          <Descriptions.Item label="兑换码数量">{verifyCodeData && verifyCodeData.verifyCodeNum}</Descriptions.Item>
          <Descriptions.Item label="已生成文件数量">{verifyCodeData && verifyCodeData.fileNum}</Descriptions.Item>
          <Descriptions.Item label="兑换截止日期">{verifyCodeData && verifyCodeData.effectEndDate}</Descriptions.Item>
        </Descriptions>

        <Table
          dataSource={verifyCodeData && verifyCodeData.fileArrays}
          bordered
          pagination={false}
        >
          <Column title="文件名称" dataIndex="fileName" key="fileName" align="center" />
          <Column title="批次名称" dataIndex="grantName" key="grantName" align="center" />
          <Column title="文件" dataIndex="downfile" key="downfile" align="center"
            render={(text, all) => downfileOP(text, all)} />
          <Column title="密码" dataIndex="password" key="password" align="center"
            render={(text, all) => passwordOP(text, all)}
          />
        </Table>
      </Modal>

      {isLookFilePassword ?
        <Modal
          title='兑换码文件密码'
          width='30%'
          visible={isLookFilePassword}
          onCancel={() => { setIsLookFilePassword(false); }}
          footer={null}
        >
          <p>文件：{codeFilePassData.fileName}</p>
          <p>密码：{codeFilePassData.filePassword}</p>
          温馨提示；请妥善保管好该文件密码～
        </Modal>
        : ''
      }
    </>
  )
}


export default connect(({ cardgrantManageModel }) => ({
  verifyCodeData: cardgrantManageModel.verifyCodeData,
  codeFilePassData: cardgrantManageModel.codeFilePassData
}))(verifyCodeModal)