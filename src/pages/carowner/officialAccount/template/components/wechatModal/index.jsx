import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Table, Modal, Tree, message, Checkbox, Transfer, Button, Row, Upload, Col, Radio} from "antd"
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import style from "./style.less";
const { Column } = Table;
const { TextArea, Search } = Input;
const { DirectoryTree } = Tree;
import { uploadFile } from '@/services/officialAccount.js';

const wechatModal = (props) => {
  let { dispatch, modalInfo, toFatherValue } = props;
  const [groupVal, setGroupVal] = useState(2);
  const [dataTypeVal, setDataTypeVal] = useState(1);
  const [contentList, setContentList] = useState([]);
  const [filedList, setFiledList] = useState([]);
  const [templateObjectId, setTemplateObjectId] = useState('');
  const [fileList,setFileList] = useState([]); // 文件
  const [fileCode, setFileCode] = useState('');// 文件编码
  const [fileName, setFileName] = useState('');// 文件名称
  const [dataCacheKey, setDataCacheKey] = useState('');// key
  const [dataCacheNum, setDataCacheNum] = useState('');// num  
  const [isModalShow, setIsModalShow] = useState(false); // 群发提示的显示与隐藏
  const [modalContent, setModalContent] = useState('');// 群发提示的内容
  const [form] = Form.useForm();
  // 查询该群发详情
  useEffect(()=> {
    dispatch({
      type: 'TemplateManage/queryTemplateByidDetails',
      payload: {
        method: 'post',
        templateObjectId:modalInfo.id
      },
      callback: (res) => {
        if(res.result.code==0){
          setFiledList(res.body.fieldData)
          let result = [];
          if(res.body.filedData && res.body.filedData.length){
            result = res.body.fieldData;
          }else{
            result = pjFieldData(res.body.msgData.templateContent)
          }
          setContentList(result);
          setTemplateObjectId(res.body.msgData.objectId);
          form.setFieldsValue({
            templateTitle:res.body.msgData.templateTitle,
            templateBusinessType: res.body.msgData.templateBusinessType
          })
        }
      }
    })
  }, [])
  // 循环处理megdata数据
  let pjFieldData = (e)=>{
    var result=[];
    let content;
    let dataKey = /{{\w+.DATA}}/gm, prefix = /\w+(?=.DATA)/gm;
    while ((content = dataKey.exec(e)) !== null) {
      content.forEach((item,index) => {
        let contentId = item.match(prefix)[0];
        result.push({"templateFieldCode":contentId});
      })
    }
    return result;
  };
  // 群发确认
  const handleOk = () => {
    setIsModalShow(true)
    if(groupVal==1) return setModalContent('本次发送为全量发送，请核实无误后确认发送!');
    if(groupVal==2) return setModalContent(`本次发送${dataCacheNum}条数据，请核实无误后确认发送!`);
    if(groupVal==3) return setModalContent('本次发送1条数据，请核实无误后确认发送!');
  }
  const handSubmit = () => {
    var num = 0;
    let data = [];
    filedList.forEach((item,index) => {
      let templateFieldCode = item.templateFieldCode;
      if(document.getElementById(`${templateFieldCode}`).value==null || document.getElementById(`${templateFieldCode}`).value=='') {
        num = num+1;
      }
      data.push({
        fieldId: item.objectId,
        content: document.getElementById(`${templateFieldCode}`).value,
        contentColor: document.getElementById(`${templateFieldCode}Color`).value
      })
    })
    if(num > 0){
      return message.error({ style: { marginTop: '10vh', }, content: '请填写详细内容!' });
    }
    if(groupVal==3 && !form.getFieldValue('toUserOpenId')) {
      return message.error({ style: { marginTop: '10vh', }, content: '单个用户发送请填写openId!' });
    }
    if(groupVal==2 && !dataCacheKey) {
      return message.error({ style: { marginTop: '10vh', }, content: '指定人员发送请先导入模板数据!' });
    }
    let obj = {
      data: data,
      url: form.getFieldValue('url'),
      importType: dataTypeVal,
      taskType: groupVal,
      title: form.getFieldValue('templateTitle'),
      miniAppid: form.getFieldValue('miniAppid'),
      miniPagepath: form.getFieldValue('miniPagepath'),
      templateId: templateObjectId,
      toUserOpenId: form.getFieldValue('toUserOpenId'),
      dataCacheKey:dataCacheKey
    };
    dispatch({
      type: 'TemplateManage/saveTemplate',
      payload: {
        method: 'postJSON',
        params: obj
      },
      callback: res => {
        if(res.body.code =='S000000') {
          triggerTask(res.body.data.objectId)
        }else {
          return message.error({ style: { marginTop: '10vh', }, content: res.result.message });
        }
      }
    })
  }
  // 提交后同步
  let triggerTask = (id) => {
    dispatch({
      type: 'TemplateManage/triggerTask',
      payload: {
        method: 'post',
        objectId:id
      },
      callback: res => {
        if(res.result.code==0) {
          message.success({ style: { marginTop: '10vh', }, content: res.result.message });
          toFatherValue(true);
        }else {
          return message.error({ style: { marginTop: '10vh', }, content: res.result.message });
        }
      }
    })
  }
  // 文件上传配置
  let uploadConfig = {
    name:"files",
    maxCount: 1,
    action:uploadFile,
    accept: ".xls,.xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",   //上传文件类型--这个是excel类型
    showUploadList: true,
    headers: {
      "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken
    },
    beforeUpload(file) {
      if (file.size > 1024 * 1024*5) {
        return message.error({ style: { marginTop: '10vh', }, content: '文件大小最大为5M' });
      }
    },
    onChange(e){
      setFileList(e.fileList)
      if (e.file.status === "done"){
        message.destroy();
        message.success(`${e.file.name} 上传成功!`)
        if(e.file.response.result.code === '0'){
          setFileCode(e.file.response.body[0]);
          setFileName(e.file.name);
        }
      } else if (e.file.status === "error"){
        message.destroy()
        message.error(`${e.file.name} 上传失败!`)
      }
    }
  }
  // 导入
  const importFilesNumber = () => {
    if(!fileCode || !fileName) {
      return message.error({ style: { marginTop: '10vh', }, content: '请上传模板!' });
    }
    dispatch({
      type: 'TemplateManage/importFilesNumber',
      payload: {
        method: 'postJSON',
        params: {
          templateId: templateObjectId,
          importType: dataTypeVal,
          taskType: groupVal,
          updateCode: fileCode,
          fileName:fileName,
        }
      },
      callback: res => {
        if(res.result.code==0) {
          message.success('发送成功!')
          setDataCacheKey(res.body.key)
          setDataCacheNum(res.body.num)
        }else {
         return message.error('导入失败!')
        }
      }
    })
  }
  return (
    <>
      {/* 群发 */}
      <Modal width={1000} title={`${modalInfo.appName}模板消息`} visible={modalInfo.modalName=='mass'} footer={null} onCancel={()=> {toFatherValue(false)}}>
        <Form form={form} onFinish={handleOk}>
          <Row>
            <Col span={16}>
              <Row>
                <Col span={24}>
                  <Form.Item label="标题" name="templateTitle" labelCol={{flex:'0 0 130px'}}>
                    <Input  placeholder="请输入"  disabled={true}></Input>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="行业" name='templateBusinessType' labelCol={{flex: '0 0 130px'}}> 
                    <Input  placeholder="请输入" disabled={true}></Input>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="跳转地址" name='url' labelCol={{flex: '0 0 130px'}}> 
                    <Input  placeholder="请输入" ></Input>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="小程序id" name='miniAppid' labelCol={{flex: '0 0 130px'}}> 
                    <Input  placeholder="请输入" ></Input>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="小程序跳转页面" name='miniPagepath' labelCol={{flex: '0 0 130px'}}> 
                    <Input  placeholder="请输入" ></Input>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label='发送方式' name='taskType' labelCol={{flex:'0 0 130px'}}>
                    <Radio.Group onChange={(e) => {setGroupVal(e.target.value)}} defaultValue={groupVal}>
                      <Radio value={1}>全量发送</Radio>
                      <Radio value={2}>指定名单</Radio>
                      <Radio value={3}>单个用户</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              {
                groupVal==2 ?
                <Row>
                  <Col span={24}>
                    <Form.Item label='发送标识' name='dateType' labelCol={{flex:'0 0 130px'}}>
                      <Radio.Group defaultValue={dataTypeVal} onChange={(e) => {setDataTypeVal(e.target.value)}}>
                        <Radio value={1}>身份证</Radio>
                        <Radio value={3}>openId</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={21}>
                    <Form.Item label="上传模板" name="uploadFile"  labelCol={{flex:'0 0 130px'}}>
                      <Upload {...uploadConfig}  fileList={fileList}>
                        <Button icon={<UploadOutlined />}>上传文件</Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Button type='primary' onClick={() => {importFilesNumber()}}>导入</Button>
                  </Col>
                  <Col span={24}>
                    <Form.Item label='数据条数' name='numTotal' labelCol={{flex:'0 0 130px'}}>
                      <Input  placeholder={`本次导入${dataCacheNum || 0 }条数据`} disabled={true}></Input>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label='下载模板' name='download' labelCol={{flex:'0 0 130px'}}>
                      <div className={style.put_down}>
                        <DownloadOutlined />
                        <a href="https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/file-template/carowner-admin/%E6%B6%88%E6%81%AF%E8%A1%A8%E6%A0%BC%E6%A8%A1%E6%9D%BF-%E6%8C%87%E5%AE%9A%E4%BA%BA%E5%91%98.xlsx" download="消息表格模板-指定人员.xlsx">下载模板</a>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
                : null
              }
              {
                groupVal==3 ? 
                <Row>
                  <Col span={24}>
                    <Form.Item label="接收者openid" name='toUserOpenId' labelCol={{flex: '0 0 130px'}}> 
                      <Input  placeholder="请输入" ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                : null
              }
              {
                contentList && contentList.length ? 
                contentList.map((item, index) => (
                  <Row>
                    <Col span={22}>
                      <Form.Item label={`详细内容${item.templateFieldCode}`} name={`${item.templateFieldCode}`} labelCol={{flex: '0 0 130px'}}> 
                        <Input  placeholder={`${item.templateFieldCode}.DATA`} ></Input>
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <input type="color" id={`${item.templateFieldCode}Color`} style={{width:'100%', height:'32px', lineHeight: '32px'}}/>
                    </Col>
                  </Row>
                ))
                : null
              }
            </Col>
            <Col span={8}>
              <div style={{paddingLeft:'20px'}}>
                <div>模板示例</div>
                {
                  contentList && contentList.length ?
                  contentList.map((item, index) => (
                    <div id='add'>{`${item.templateFieldCode}.DATA`}</div>
                  )) : null
                }
                
              </div>
            </Col>
          </Row>
          <Row justify='end'>
            <Col>
              <Button  htmlType="submit" type="primary" style={{marginRight:'10px'}}>提交</Button>
              <Button  htmlType="button" onClick={()=> {toFatherValue(false)}}>取消</Button>
            </Col>
          </Row>
        </Form>
      </Modal>
      {/* 群发提示 */}
      <Modal title="发送提醒" visible={isModalShow} onOk={()=> {handSubmit()}} onCancel={()=> {setIsModalShow(false)}}>
        <p>{modalContent}</p>
      </Modal>
    </>
  )
}


export default connect(({ TemplateManage }) => ({
}))(wechatModal)







