import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Tabs, Form, Input, DatePicker, TimePicker, Table, Row, Col, Space, Image, message, Select, Modal, Button } from "antd";

import { UploadOutlined } from '@ant-design/icons';
import style from "./viewStyle.less";
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { uploadIconInfo } from '@/services/message.js'
import moment from 'moment'
import { formatDate } from '@/utils/date'
import SendingRangeModal from './modal/sendingRangeModal';

const { RangePicker } = DatePicker;
const { Column } = Table;
const { Option } = Select;

// 发消息
const sendMessage = (props) => {
  let { dispatch, messageSelect, checkedKeysList, checkedList, isUpdate } = props;
  let [form] = Form.useForm();
  let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));

  // let [paramObj, setParamObj] = useState({});//表单数据
  const [editor, setEditor] = useState(null) // 存储 editor 实例
  const toolbarConfig = {}// 菜单栏配置
  let [isSendRangeModal, setIsSendRangeModal] = useState(false);//发送范围弹框
  let [isDelayedSendModal, setIsDelayedSendModal] = useState(false);//定时发送弹框
  let [delayedSendTime, setDelayedSendTime] = useState('');//定时发送时间
  let [defaultHtmlValue, setDefaultHtmlValue] = useState('')//引导内容回显使用（编辑器回显）
  let [contentHtml, setContentHtml] = useState('')//引导内容回显使用
  let [msgDetail, setMsgDetail] = useState({})//详情信息
  let [selectedChannelList, setSelectedChannelList] = useState([])//

  // let [mergeCheckedList, setMergeCheckedList] = useState([])//


  const [showEdit, setShowEdit] = useState(false);//富文本框内容的渲染
  const [isPreviewModal, setIsPreviewModal] = useState(false);//预览弹框

  // let obj = form.getFieldValue('title');

  // 编辑器配置
  const editorConfig = {
    placeholder: '请输入内容...',
    onCreated(editor) { // 记录下 editor 实例，重要！
      setEditor(editor)
    },
    onChange(editor) {
      // console.log(editor.getHtml())
      // editor.getText()
      // console.log('content', editor.children)//[{children:[{text: "554"}],type:'paragraph'}]
      setEditor(editor)
      setContentHtml(editor.getHtml())
      form.setFieldsValue({
        content: editor.getHtml()
      })
    },
    MENU_CONF: {
      uploadImage: {
        // 上传图片的配置
        server: uploadIconInfo,
        // form-data fieldName ，默认值 'wangeditor-uploaded-file'
        fieldName: 'files',
        // 单个文件的最大体积限制，默认为 2M
        maxFileSize: 10 * 1024 * 1024, // 10M
        // 最多可上传几个文件，默认为 100
        maxNumberOfFiles: 10,
        // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
        allowedFileTypes: ['image/*'],
        headers: {
          "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken,
          Accept: '*/*',
        },
        onBeforeUpload(file) {// 上传之前触发
          console.log(file, "1")
          return file
        },
        // 自定义插入图片
        customInsert(res, insertFn) {
          // res 即服务端的返回结果

          // 从 res 中找到 url alt href ，然后插图图片
          // insertFn(url, alt, href)
          insertFn(res.items, '', res.items);
        },
      }
    }
  }
  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])


  useEffect(() => {
    messageTypeSelect()
    if (history.location.query.opType == 'edit' || history.location.query.opType == 'detail') {
      messageDetail()
      allCompany()
    } else {//新增时
      // 清空
      dispatch({
        type: 'messageModel/setChannelIdData',
        payload: {
          checkedKeysList: [],
          checkedList: []
        }
      })
      setShowEdit(true)
    }

  }, [])

  // console.log(msgDetail.channelIdList, 'msgDetail555')
  let [companyData, setCompanyData] = useState([]);//全部企业数据
  //获取全部企业（开通过智客通的渠道）
  const allCompany = () => {
    dispatch({
      type: 'messageModel/allCompany',
      payload: {
        method: 'get',
        params: {},
      },
      callback: (res) => {
        let companyDataList = [];
        for (let i = 0; i < res.body.length; i++) {
          let children = [];
          let item = res.body[i].children;
          for (let j = 0; j < item.length; j++) {
            let twoObj = { title: item[j].channelName, key: item[j].channelId }
            children.push(twoObj)
          }
          companyDataList.push({ title: res.body[i].channelName, key: res.body[i].channelId, children: children })
        }
        setCompanyData(companyDataList)
      }
    })
  }

  let [companyView, setCompanyView] = useState([]);//过滤选中的企业数据

  useEffect(() => {
    if (Object.keys(msgDetail).length > 0 && companyData.length > 0) {
      let data = {
        ...msgDetail,
      }
      form.setFieldsValue(data);

      // console.log(msgDetail.channelIdList, 'msgDetail')
      // console.log(companyData, 'companyData')
      let companyOne = companyData.map((item) => {
        item.children.push({ key: item.key, title: item.title })
        return item.children;
      })
      // console.log(companyOne, 'companyOne')
      var companyView = companyOne[0].filter(item => {
        return msgDetail.channelIdList.includes(item.key);
      });
      setCompanyView(companyView);
    }
  }, [msgDetail, companyData])

  //消息分类下拉框
  const messageTypeSelect = () => {
    dispatch({
      type: 'messageModel/messageTypeSelect',
      payload: {
        method: 'get',
        params: {}
      }
    });
  }

  // 消息详情
  let messageDetail = () => {
    dispatch({
      type: 'messageModel/messageDetail',
      payload: {
        method: 'get',
        params: {},
        messageId: history.location.query.messageId
      },
      callback: res => {
        setMsgDetail(res.body);
        setSelectedChannelList(res.body.selectedChannelList);
        let msgDetail = JSON.parse(JSON.stringify(res.body));

        if (msgDetail.content) {
          setDefaultHtmlValue([
            { type: "paragraph", children: JSON.parse(msgDetail.content) }
          ])
        } else {
          setDefaultHtmlValue('')
        }
        setShowEdit(true)
      }
    });
  }

  // 0点击发送范围
  const handelSendRange = () => {
    setIsSendRangeModal(true);
  }

  // 1点击发送
  const sendBtn = (value) => {
    // let paramObj = JSON.parse(JSON.stringify(value));
    // setParamObj(paramObj);
    if (!value.title) {
      message.warning('请输入消息标题！')
    } else if (!checkedKeysList.length) {
      message.warning('请选择消息发送范围！')
    } else if (value.content == '<p><br/></p>') {
      message.warning('请输入消息内容！')
    } else {
      dispatch({
        type: 'messageModel/saveAndSendMessage',
        payload: {
          method: 'postJSON',
          params: {
            id: history.location.query.opType == 'edit' ? history.location.query.messageId : null,//消息主键，新增时不传，修改时必传
            title: value.title,
            type: 2,
            channelIdList: isUpdate ? checkedKeysList : msgDetail.channelIdList,//渠道idList 选择全部企业传[0]
            content: JSON.stringify(editor.children),
            contentHtml: contentHtml,
          }
        },
        callback: (res) => {
          if (res.result.code == '0') {
            message.success(res.result.message)
            history.push({
              pathname: '/message/messageManagementList'
            })
          } else {
            message.error(res.result.message)
          }
        }
      });
    }
  }

  // 2点击定时发送
  const handelDelayedSend = () => {
    if (!form.getFieldValue().title) {
      message.warning('请输入消息标题！')
    } else if (!checkedKeysList.length) {
      message.warning('请选择消息发送范围！')
    } else if (form.getFieldValue().content == '<p><br/></p>') {
      message.warning('请输入消息内容！')
    } else {
      setIsDelayedSendModal(true);
    }
  }
  // 选择定时发送
  const delayedSendChange = (e) => {
    setDelayedSendTime(moment(e).format('YYYY-MM-DD HH:mm'));
  }
  // 确认定时发送
  const handleDelayedOk = () => {
    dispatch({
      type: 'messageModel/saveAndTimingSendMessage',
      payload: {
        method: 'postJSON',
        params: {
          id: history.location.query.opType == 'edit' ? history.location.query.messageId : null,//消息主键，新增时不传，修改时必传
          title: form.getFieldValue().title,
          type: 2,
          channelIdList: isUpdate ? checkedKeysList : msgDetail.channelIdList,//渠道idList 选择全部企业传[0]
          content: JSON.stringify(editor.children),
          contentHtml: contentHtml,
          jobTime: delayedSendTime//定时发送时间
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {
          message.success(res.result.message)
          setIsDelayedSendModal(false);
          history.push({
            pathname: '/message/messageManagementList'
          })
        } else {
          message.error(res.result.message)
        }
      }
    });
  }
  // 3点击存为草稿
  const handelDraft = () => {
    saveOrUpdateMessage()
  }

  // 消息新增或更新（发消息-存为草稿；修改-存为草稿）
  let saveOrUpdateMessage = () => {
    dispatch({
      type: 'messageModel/saveOrUpdateMessage',
      payload: {
        method: 'postJSON',
        params: {
          id: history.location.query.opType == 'edit' ? history.location.query.messageId : null,//消息主键，新增时不传，修改时必传
          title: form.getFieldValue().title ? form.getFieldValue().title : '',
          type: 2,
          channelIdList: isUpdate ? checkedKeysList : msgDetail.channelIdList,//渠道idList 选择全部企业传[0]channelIdList
          content: JSON.stringify(editor.children),
          contentHtml: contentHtml
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {
          message.success(res.result.message)
          history.push({
            pathname: '/message/messageManagementList'
          })
        } else {
          message.error(res.result.message)
        }
      }
    });
  }

  // 点击预览
  const handelPreview = () => {
    setIsPreviewModal(true)
  }

  return (
    <>
      <div className={style.sendMessagePage}>
        <div className={style.title}>查看消息</div>
        <Form form={form} className={style.formBox} onFinish={sendBtn}>
          <Row>
            <Col span={10}>
              <Form.Item label="消息标题：" name="title" labelCol={{ flex: '0 0 120px' }} style={{ width: '66%' }}>
                <Input placeholder="最多20个中文字" maxLength={20} disabled={history.location.query.opType == 'detail' ? true : false}></Input>
              </Form.Item>
              <Form.Item label="消息分类：" name="type" labelCol={{ flex: '0 0 120px' }} style={{ width: '66%' }}>
                <Select placeholder="不限" defaultValue={2} value={2} disabled>
                  {
                    messageSelect && messageSelect.map((v) => <Option key={v.type} value={v.type} disabled={v.type != 2 ? true : false}>{v.desc}</Option>)
                  }
                </Select>
              </Form.Item>
              <Form.Item label="消息发送范围：" labelCol={{ flex: '0 0 120px' }} style={{ width: '66%' }}>
                <Button onClick={handelSendRange} disabled={history.location.query.opType == 'detail' ? true : false} icon={<UploadOutlined />}>选择发送范围</Button>

                <div style={{ marginTop: '20px' }}>
                  已选：
                  {
                    // console.log(isUpdate, 'isUpdate')
                    isUpdate ?
                      checkedList.map((v) => <span>{v.title}； </span>)
                      :
                      companyView.map((v) => <span>{v.title}； </span>)
                  }
                </div>
              </Form.Item>
            </Col>
            <Col span={13} style={{ marginRight: '10px' }}>
              <Form.Item label="消息内容 " name="content" labelCol={{ flex: '0 0 120px' }}>
                <div style={{ border: '1px solid #ccc', zIndex: 100 }} id="dev1">
                  {showEdit ?
                    <>
                      <Toolbar
                        editor={editor}
                        defaultConfig={toolbarConfig}
                        mode="default"
                        style={{ borderBottom: '1px solid #ccc' }} />
                      <Editor
                        mode="default"
                        defaultConfig={editorConfig}
                        defaultContent={defaultHtmlValue}
                        style={{ height: '500px' }} />
                    </>
                    : ''}
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row className={style.btns} justify="space-around" align="center">
            <Space size={22}>
              <Button htmlType="submit" type="primary" disabled={history.location.query.opType == 'detail' ? true : false}>发送</Button>
              <Button htmlType="button" onClick={handelDelayedSend} disabled={history.location.query.opType == 'detail' ? true : false}>定时发送</Button>
              <Button htmlType="button" onClick={handelDraft} disabled={history.location.query.opType == 'detail' ? true : false}>存为草稿</Button>
              <Button htmlType="button" onClick={handelPreview}>预览</Button>
            </Space>
          </Row>
        </Form>

        {/* <div className={style.interspace}></div> */}
        {/* <div className={style.btns}>
          <Button onClick={() => { history.goBack() }}>返回</Button>
        </div> */}
      </div>
      {/* 发送范围弹框 */}
      {/* {
        isSendRangeModal ? <SendingRangeModal isSendRangeModal={isSendRangeModal} msgDetail={msgDetail} closeModal={() => { setIsSendRangeModal(false) }} /> : ''
      } */}
      <SendingRangeModal isSendRangeModal={isSendRangeModal} msgDetail={msgDetail} companyView={companyView} closeModal={() => { setIsSendRangeModal(false) }} />

      {/* 定时发送弹框 */}
      <Modal title='定时发送' width='40%' visible={isDelayedSendModal} onOk={handleDelayedOk} onCancel={() => { setIsDelayedSendModal(false) }}>
        <p style={{ color: '#999' }}>请选择定时发送的时间：</p>
        <DatePicker allowClear={false} onChange={delayedSendChange} showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
        {
          delayedSendTime ?
            <div style={{ marginTop: '20px' }}>该消息将于 {delayedSendTime} 发送</div>
            : ''
        }
      </Modal>
      {/* 预览弹框 */}
      <Modal title='消息预览' width='60%' visible={isPreviewModal}
        onCancel={() => { setIsPreviewModal(false) }}
        footer={[
          <Button key="close" onClick={() => { setIsPreviewModal(false) }}>
            关闭
          </Button>
        ]}
      >
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>{form.getFieldValue().title}</h3>
        <p dangerouslySetInnerHTML={{ __html: contentHtml }} style={{ padding: '0 40px' }}></p>
        <h3 style={{ float: 'right', padding: ' 0 40px' }}>壹路通团队</h3>
      </Modal>
    </>
  )
}


export default connect(({ messageModel }) => ({
  messageSelect: messageModel.messageSelect,
  checkedKeysList: messageModel.checkedKeysList,
  checkedList: messageModel.checkedList,
  isUpdate: messageModel.isUpdate
}))(sendMessage)