import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Table, Modal, Space, message, Divider, Upload, Button, Row, Select, Col, Radio, DatePicker } from "antd"
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import style from "./style.less";
import { uploadFile } from '@/services/officialAccount.js';
import AddVariable from '../../../carowner/messageInteraction/directionalLaunch/components/addVariable';
import SceneTemplate from '../../../carowner/messageInteraction/directionalLaunch/components/sceneTemplate';
import moment from 'moment';
const { TextArea } = Input;
import { sortedIndexOf } from 'lodash';
const { RangePicker } = DatePicker;
const { Option } = Select;
const wechatModal = (props) => {
  let { dispatch, modalInfo, toFatherValue,tempSelectVisible,hideTempSelectModel,cardSelectOpenIndex,firstStepData} = props;
  const [backupUrl, setBackupUrl] = useState('')//取色器
  const [fileList, setFileList] = useState();
  const [fileCode, setFileCode] = useState();
  const [fileName, setFileName] = useState();
  const [chackValue, setChackValue] = useState({});
  const [chackVariableValue, setChackVariableValue] = useState({});
  const [templateMessageId, setTemplateMessageId] = useState();
  const [variableModal, setVariableModal] = useState();
  const [senceVariableModal, setSenceVariableModal] = useState();//场景模板modalInfo
  const [uploadShow, setUploadShow] = useState(false);//是否显示下载上传名单详细
  const [wechatId, setWechatId] = useState();
  const [secondDisabled, setSecondDisabled] = useState(false);
  const [pushMechanism, setPushMechanism] = useState(1);
  const [pushCrowdValue, setPushCrowdValue] = useState(2); // 推送人群的默认值
  const [jumpMothod, setJumpMothod] = useState(1);// 跳转方式  
  const [senceTemplateData, setSenceTemplateData] = useState(null);// 存储场景模板名称ID等信息
  const [senceTemplateListData, setSenceTemplateListData] = useState([]);// 添加变量的Data信息
  const [sendTime, setSendTime] = useState(null);// 定时推送
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  const [data, setData] = useState()
  const [form] = Form.useForm();
  const firstLevel = [
    {
      code: 0,
      name: '每日'
    }, {
      code: 1,
      name: '每周'
    }, {
      code: 2,
      name: '每月'
    }
  ];
  const secondLevel = [
    {
      code: 1,
      name: '周一'
    }, {
      code: 2,
      name: '周二'
    }, {
      code: 3,
      name: '周三'
    }, {
      code: 4,
      name: '周四'
    }, {
      code: 5,
      name: '周五'
    }, {
      code: 6,
      name: '周六'
    }, {
      code: 7,
      name: '周日'
    }
  ];

  let [visible,setVisible] = useState(false)
  useEffect(() => {
    // 查询该渠道下面公众号
    form.setFieldsValue({
      sendPerson:pushCrowdValue,
      jumpType:jumpMothod,
    })
    
    if(tempSelectVisible){
      setVisible(true)
      getAppSettingListByChannelId()
      if(modalInfo.objectId){
        getSceneDetail();
      }
    }
  }, [tempSelectVisible,modalInfo])
  let [tempData,setTempData] =useState({})
  let cancelModal = ()=>{
    hideTempSelectModel(false,)
    setVisible(false)
  }

  // 查询该渠道下面公众号
  let getAppSettingListByChannelId = () => {
    dispatch({
      type: 'createStrategic/getAppSettingListByChannelId',
      payload: {
        method: 'post',
      },
      callback: res => {
        console.log(res)
        if (res.result.code == '0') {
          setWechatId(res.body[0].id)

        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 编辑详情
  let getSceneDetail = () => {
    dispatch({
      type: 'createStrategic/getSceneDetail',
      payload: {
        method: 'get',
        params: {
          sceneTemplateId: modalInfo.objectId,
        }
      },
      callback: res => {
        if (res.result.code == '0') {
          let initData = res.body
          initData.data = initData.sceneTemplateDetail.sceneTemplateVariableList
          setTempData(initData.sceneTemplateDetail)
          console.log(initData, "initData")
          setPushCrowdValue(initData.sendPerson)
          setJumpMothod(initData.jumpType)
          setSenceTemplateListData(initData.data)
          setBackupUrl(initData.backupUrl)
          let rules = {}
          initData.data.map((item, index) => {
            rules[`${item.templateFieldCode}`] = item.content
          })
          setTemplateMessageId(initData.sceneTemplateDetail.templateMessageId)
          setSenceTemplateData({
            sceneTemplateName: initData.sceneTemplateName,
          })
          if (initData.sendPerson == 2) {
            setUploadShow(true)
            setFileCode(initData.fileCode)
            setFileName('编辑')
          }

          //检验添加
          form.setFieldsValue({
            sendType: initData.sendType,
            miniAppid: initData.miniAppId,
            miniPagepath: initData.miniPagePath,
            backupUrl: initData.backupUrl,
            taskName: initData.taskName,
            sendPerson: initData.sendPerson,
            jumpType: initData.jumpType,
            teamId: initData.teamId,
            linkUrl:initData.linkUrl,
            sceneTemplateId: initData.sceneTemplateId,
            ...rules
          })
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 查询场景模板列表
  let getSceneTemplateList = (pages) => {
    dispatch({
      type: 'createStrategic/getSceneTemplateList',
      payload: {
        method: 'postJSON',
        params: {
          sceneType: 5,
          wechatAppSettingId: wechatId,
          triggerType:1,
          templateType:1,
          ...pages
        }
      },
      callback: res => {
        if (res.result.code == '0') {
          setSenceVariableModal({ modalName: 'changeTemplate', variableList: res.body.list, pageInfo: { pageNum: res.body.pageNum, pageSize: res.body.pageSize, totalCount: res.body.total } })
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  // 群发确认
  const handleOk = (value) => {
    let data = JSON.parse(JSON.stringify(value))
    let param = {}
    let dInit = []
    senceTemplateListData.map((item, index) => {
      let initOb = chackVariableValue[`${item.templateFieldCode}`]
      let codeList = []
      if (initOb) {
        initOb.map((item, index) => {
          let code = {
            code: item.variable,
            value: item.variableName
          }
          codeList.push(code)
        })
      }

      let pjObject = {
        fieldId: item.templateFieldId,
        content: data[item.templateFieldCode],
        contentColor: document.getElementById(`${item.templateFieldCode}Color`).value,
        code: codeList
      }
      dInit.push(pjObject)
    })
    
    
    data.data = dInit
    data.sceneTemplateId = data.sceneTemplateId 
    data.businessSceneName = firstStepData.strategyName
    data.businessId = firstStepData.id
    data.messageId = tempData.wxTemplateId
    tempData.sceneTemplateVariableList = senceTemplateListData
    if (modalInfo.objectId) {
      data.sceneTemplateMessageId = modalInfo.objectId
    }
    setTempData(tempData)
    saveTemplate(data)
  }

  let saveTemplate = (params) => {
    dispatch({
      type: 'createStrategic/saveTemplate',
      payload: {
        method: 'postJSON',
        params: params
      },
      callback: res => {
        if (res.result.code == '0') {
          hideTempSelectModel(tempData,cardSelectOpenIndex,res.body)
          setVisible(false)
          message.success(res.result.message)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 获取选择变量的值
  let getVariableValue = (value) => {
    // 缓存选中的值
    let checValue = JSON.parse(JSON.stringify(chackValue))
    console.log(value, "value")
    if (value.groupValue.length != 0) {
      // 最后做保存时候
      let initObj = JSON.parse(JSON.stringify(chackVariableValue))

      initObj[`${value.templateFieldCode}`] = value.groupValue
      setChackVariableValue(initObj)
      //拼接添加变量页面传递过来的数组得到variable数组
      let cValue = []
      
      // 获取文件框的值
      let inputValue = form.getFieldValue(`${value.templateFieldCode}`)
      let myField=document.getElementById(`${value.templateFieldCode}Txt`)
      let startPos = myField.selectionStart;
      if (value.groupValue) {
        value.groupValue.map((item, index) => {
          // 用变量页面传递过来的数组对比input框中的 匹配到的不做处理，匹配不到的加在后面
          if (inputValue.indexOf(`{{${item.variable}}}`) == -1) {
            if(startPos == 0){
              inputValue = '{{' + item.variable + '}}' + inputValue
            }else{
              // 如果在中间就先截取
              let temp = inputValue.slice(0,startPos)
              temp += '{{' + item.variable + '}}'
              inputValue = temp + inputValue.slice(startPos,inputValue.length)
              console.log(inputValue)
            }

            
          }

          cValue.push(item.variable)
        })

        //通过正则找到全部的变量（input框）
        // 在使用input框中的变量数组对比变量页面传递过来的  匹配不到的就使用空字符串替换，匹配到的不做处理
        let iputValue = pjFieldData(inputValue)
        // 只有在两个数组不相等的情况下才会走替换逻辑
        if (iputValue.length !== value.groupValue.length) {
          iputValue.map((item, index) => {
            let temporaryInput = inputValue//form.getFieldValue(`${value.templateFieldCode}`)
            if (cValue.toString().indexOf(item) == -1) {
              let result = temporaryInput.replace((`{{${item}}}`), '')
              inputValue = result
              let data = {}
              data[`${value.templateFieldCode}`] = result
              form.setFieldsValue(data)
            }
          })

        } else {
          let data = {}
          data[`${value.templateFieldCode}`] = inputValue
          // 处理好的数组重新复制
          form.setFieldsValue(data)

        }
        checValue[`${value.templateFieldCode}`] = cValue
        textOnChange('', value.index, value.templateFieldCode)
        setChackValue(checValue)

      }
    } else {
      let ip = form.getFieldValue(`${value.templateFieldCode}`)
      let data = {}
      console.log(ip, "inputValue")
      let iputValue = pjFieldData(ip)
      console.log(iputValue, "iputValue")
      iputValue.map((item) => {
        let temporaryInput = ip//form.getFieldValue(`${value.templateFieldCode}`)
        let result = temporaryInput.replace((`{{${item}}}`), '')
        console.log(result, "resukt")
        ip = result
        let data = {}
        data[`${value.templateFieldCode}`] = result
        form.setFieldsValue(data)
      })
      checValue[`${value.templateFieldCode}`] = []
      setChackValue(checValue)
    }
  }

  // 使用正则处理数据
  let pjFieldData = (str) => {
    var reg = /\{{(.+?)\}}/g
    var list = []
    var result = null
    do {
      result = reg.exec(str)
      result && list.push(result[1])
    } while (result)
    return list
  };


  // 打开选择场景模板弹框
  let openChangeTemplate = () => {
    getSceneTemplateList()
  }

  // 跳转到添加变量方法
  let toAddVariable = (param, index) => {
    console.log(param)
    dispatch({
      type: 'createStrategic/findSceneTypeVariableList',
      payload: {
        method: 'postJSON',
        params: {
          templateVariableWxId: param.templateFieldId,
          sceneType: 7,
          sceneTemplateId: templateMessageId
        }
      },
      callback: res => {
        if (res.result.code == '0') {
          if (!chackValue || chackValue[`${param.templateFieldCode}`]) {
            setVariableModal({
              modalName: 'addVariable',
              variableList: res.body.sceneTypeVariableList,
              checkedValue: param.templateFieldCode == null ? null : chackValue[`${param.templateFieldCode}`],
              name: param.templateFieldCode,
              index: index,
              allList: res.body.sceneTypeVariableList
            })
          } else {
            setVariableModal({
              modalName: 'addVariable',
              variableList: res.body.sceneTypeVariableList,
              checkedValue: res.body.selectVariables == null ? null : res.body.selectVariables,
              name: param.templateFieldCode,
              index: index,
              allList: res.body.sceneTypeVariableList
            })
          }
          console.log(variableModal)

        } else {
          message.error(res.result.message)
        }
      }
    })


  }

  // 选择场景模板分页
  let pageInfoChange = (pages) => {
    getSceneTemplateList(pages)
  }
  // 场景模板选择完此模板返回的参数信息

  let getTemplateVariableValue = (value) => {
    console.log(value, "value")
    getDetail(value.templateMessageId)
    setTempData(value)
  }

  let getDetail = (id) => {
    dispatch({
      type: 'createStrategic/getSceneDetail',
      payload: {
        method: 'get',
        params: {
          sceneTemplateId: id
        }
      },
      callback: res => {
        if (res.result.code == '0') {
          let value = res.body.sceneTemplateDetail
          setTemplateMessageId(value.templateMessageId)
          setSenceTemplateData(value)
          setSenceTemplateListData(value.sceneTemplateVariableList)
          let rules = {}
          value.sceneTemplateVariableList.map((item, index) => {
            rules[`${item.templateFieldCode}`] = item.content
          })
          //检验添加
          
          setJumpMothod(res.body.jumpType)
          backupUrlOnchange(res.body.backupUrl)
          form.setFieldsValue({
            miniAppid:res.body.miniAppId,
            linkUrl:res.body.linkUrl,
            miniPagepath:res.body.miniPagePath,
            backupUrl:res.body.backupUrl ,
            jumpType:res.body.jumpType,
            sceneTemplateId: value.sceneTemplateId,
            ...rules,
          })
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  let clearMapVariable = () => {
    setSenceTemplateData(null)
    setSenceTemplateListData([])
    setChackValue({})
  }

  // 备用链接地址
  let backupUrlOnchange = (value) => {
    setBackupUrl(value)
    form.setFieldsValue({
      backupUrl: value
    })
  }

  let sendPersonOnchange = (e) => {
    setPushCrowdValue(e.target.value)
    form.setFieldsValue({
      sendPerson: e.target.value
    })
  }
  // 有值文件下载
  let fileDownload = () => {
    dispatch({
      type: 'createStrategic/fileDownload',//下载文件
      payload: {
        method: 'get',
        params: {},
        fileCode: fileCode,
        responseType: 'blob'
      },
      callback: (res) => {
        console.log(fileName, "!")
        if (res) {
          const url = window.URL.createObjectURL(new Blob([res], { type: "application/json" }))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '上传名单详细.xlsx')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    })
  }

  let textOnChange = (e, index, item) => {
    let test = form.getFieldValue(item)
    let list = JSON.parse(JSON.stringify(senceTemplateListData))
    list[index].content = test
    setSenceTemplateListData(list)
  }
  return (
    <>
      {/* 群发 */}
      <Modal width={1000} title="选择场景模板" visible={visible} footer={null} onCancel={() => {cancelModal()}}>
        <Form form={form} onFinish={handleOk}>
          <Row justify='center'>
            <Col span={24}>
              <Form.Item label="场景模板名称" name="sceneTemplateId" labelCol={{ flex: '0 0 130px' }} rules={[{ required: true }]}>
                <Button onClick={() => openChangeTemplate()}>选择模板</Button>
                {senceTemplateData ? <span><span className={style.fontNameSize}>{senceTemplateData.sceneTemplateName}</span> <span className={style.fontSize} onClick={() => { clearMapVariable() }}>X</span></span>
                  : ''}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="跳转方式" name="jumpType" labelCol={{ flex: '0 0 130px' }}>
                <Radio.Group onChange={(e) => setJumpMothod(e.target.value)} value={jumpMothod} defaultValue={jumpMothod}>
                  <Radio value={2}>小程序</Radio>
                  <Radio value={3}>链接地址</Radio>
                  <Radio value={1}>无</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            {
              jumpMothod == 2 ?
                <>
                  <Col span={24}>
                    <Form.Item label="小程序ID" name="miniAppid" labelCol={{ flex: '0 0 130px' }} rules={[{ required: true }]}>
                      <Input placeholder="请输入" ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="小程序页面地址" name="miniPagepath" labelCol={{ flex: '0 0 130px' }} rules={[{ required: true }]}>
                      <Input placeholder="请输入" ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="备用网页链接" name="backupUrl" labelCol={{ flex: '0 0 130px' }} rules={[{ required: true }]}>
                      <Input placeholder="请输入" value={backupUrl} onChange={(e) => { backupUrlOnchange(e.target.value) }}></Input>
                      <span className={style.spare_href}>微信版本较低时，直接跳转网页地址</span>
                    </Form.Item>
                  </Col>
                </> : jumpMothod == 3 ?
                  <Col span={24}>
                    <Form.Item label="链接" name="linkUrl" labelCol={{ flex: '0 0 130px' }} rules={[{ required: true }]}>
                      <Input placeholder="请输入"></Input>
                    </Form.Item>
                  </Col> : ''
            }
          </Row>
          <Row className={style.style_top_content}>
            <Col span={16}>
              {
                senceTemplateListData.map((item, index) => {
                  return <Row>
                    <Col span={15}>
                      <Form.Item label={item.templateFieldCode + '.DATA'} name={item.templateFieldCode} labelCol={{ flex: '0 0 130px' }} rules={[{ required: true }]}>
                        <TextArea row={1} defaultValue={item.content} onChange={(e) => { textOnChange(e, index, item.templateFieldCode) }} id={`${item.templateFieldCode}Txt`}></TextArea>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Input type="color" id={`${item.templateFieldCode}Color`} defaultValue={item.wxMessageColor} value={item.wxMessageColor} />
                    </Col>
                    <Col span={4}>
                      <span className={style.fontNameSize} onClick={() => { toAddVariable(item, index) }}>+添加变量</span>
                    </Col>
                  </Row>

                })
              }
            </Col>
            {
              senceTemplateListData ? <Col span={8}>
                <div className={style.template_example_div}>
                  <div className={style.template_example}>
                    <div>预览</div>
                    <p>活动开始通知</p>
                    {senceTemplateListData.map((item, index) => {
                      return <div>
                        <span>{item.content}</span>
                      </div>
                    })}
                  </div>
                </div>
              </Col> : ''
            }
          </Row>
          <Divider />
          <Row justify='center '>
            <Button htmlType="submit" type="primary" style={{ marginRight: '10px' }}>提交</Button>
            <Button htmlType="button" onClick={() => { cancelModal() }}>取消</Button>
          </Row>

        </Form>
      </Modal>
      {variableModal ? <AddVariable modalInfo={variableModal} closeMode={() => { setVariableModal(null) }} getVariableValue={(value) => { getVariableValue(value) }} variableList={secondLevel} /> : ''}
      {senceVariableModal ? <SceneTemplate modalInfo={senceVariableModal} closeMode={() => { setSenceVariableModal(null) }} getVariableValue={(value) => { getTemplateVariableValue(value) }} pageInfoChange={(pageInfo) => pageInfoChange(pageInfo)} /> : ''}
    </>
  )
}


export default connect(({ createStrategic }) => ({
  firstStepData:createStrategic.firstStepData
}))(wechatModal)
