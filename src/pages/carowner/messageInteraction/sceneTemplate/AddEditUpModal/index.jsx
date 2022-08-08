import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Table, Modal, Space, message, Divider, Upload, Button, Row, Select, Col, Radio, DatePicker } from "antd"
import { PlusOutlined } from '@ant-design/icons';
import style from "./style.less";
import ChooseTemplate from '../ChooseTemplate';
import AddVariable from '../AddVariable';
const { TextArea } = Input;
import { uploadFile } from '@/services/officialAccount.js';
import moment from 'moment';
const { RangePicker } = DatePicker;
const { Option } = Select;
let openWinKey = '';
const AddEditUpModal = (props) => {
  let { dispatch, templateNo, addVisible, entryType, onCallbackSetSales,templateType } = props;
  const [form] = Form.useForm();
  const [jumpMothod, setJumpMothod] = useState(2);// 跳转方式
  const [modalDetail, setModalDetail] = useState({});//弹窗详情
  const [variableModal, setVariableModal] = useState();
  const [senceVariableModal, setSenceVariableModal] = useState(null);//场景模板modalInfo
  const [senceTemplateListData, setSenceTemplateListData] = useState(null);// 编辑、启动时获取变量的Data信息
  const [senceTemplateData, setSenceTemplateData] = useState(null);// 存储场景模板名称ID等信息
  const [chackValue, setChackValue] = useState({});
  const [chackVariableValue, setChackVariableValue] = useState({});
  const [weChatLiat, setWeChatLiat] = useState([]);
  const [backupUrl, setBackupUrl] = useState('');
  const [wechatId, setWechatId] = useState();



  useEffect(() => {
    if (addVisible && entryType != 3) {
      getDetail()
    }
    getWeChatDetail()
    // 处理默认数据 form名称和value不对应需要手动添加校验
    form.setFieldsValue({
      jumpType:jumpMothod,
    })
  }, [addVisible])

  let getDetail = () => {
    dispatch({
      type: 'sceneTemplate/getEditDetail',
      payload: {
        method: 'get',
        params: {
          sceneTemplateId: templateNo
        }
      },
      callback: res => {
        if (res.result.code == '0') {
          setModalDetail(res.body)
          setJumpMothod(res.body.jumpType)
          setSenceTemplateListData(res.body.sceneTemplateDetail.sceneTemplateVariableList)
          console.log(res.body.sceneTemplateDetail.templateTitle)
          if (res.body.sceneTemplateDetail.templateTitle != null) {
            setSenceTemplateData({
              templateTitle: res.body.sceneTemplateDetail.templateTitle,
            })
          }
          
          let data = {}
          res.body.sceneTemplateDetail.sceneTemplateVariableList.map((item,index)=>{
            item.wxMessageColor = item.wxMessageColor == null ? 'black' : item.wxMessageColor
            data[`${item.templateFieldCode}`] = item.content
          })
          backupUrlOnchange(res.body.backupUrl)
          form.setFieldsValue({
            ...data,
            miniAppId:res.body.miniAppId,
            miniPagePath:res.body.miniPagePath,
            jumpType:res.body.jumpType,
            linkUrl:res.body.linkUrl,
            messageId:res.body.messageId,
            sceneTemplateName:res.body.sceneTemplateName
          })
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  let getWeChatDetail = () => {
    dispatch({
      type: 'sceneTemplate/getWeChatList',
      payload: {
        method: 'postJSON',
      },
      callback: res => {
        if (res.result.code == '0') {
          setWeChatLiat(res.body)
          setWechatId(res.body[0].id)
          form.setFieldsValue({
            messageId: res.body[0].id
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
      type: 'sceneTemplate/getWechatSceneTemplateList',
      payload: {
        method: 'postJSON',
        params: {
          wechatAppSettingId: wechatId,
          templateType:templateType,
          ...pages
        }
      },
      callback: res => {
        if (res.result.code == '0') {
          setSenceVariableModal({ modalName: 'changeTemplate', variableList: res.body, pageInfo: { pageNum: res.body.pageNum, pageSize: res.body.pageSize, totalCount: res.body.total } })
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  // 获取选择变量的值
  let getVariableValue = (value) => {
    let checValue = JSON.parse(JSON.stringify(chackValue))
    if (value.groupValue.length != 0) {
      // 最后做保存时候
      let initObj = JSON.parse(JSON.stringify(chackVariableValue))

      initObj[`${value.templateFieldCode}`] = value.groupValue
      setChackVariableValue(initObj)
      //拼接添加变量页面传递过来的数组得到variable数组
      let cValue = []
      // 缓存选中的值
      
      // 获取文件框的值
      let inputValue = form.getFieldValue(`${value.templateFieldCode}`)
      let myField=document.getElementById(`${value.templateFieldCode}Txt`)
      let startPos = myField.selectionStart;
      if (value.groupValue) {
        value.groupValue.map((item, index) => {
          // 用变量页面传递过来的数组对比input框中的 匹配到的不做处理，匹配不到的加在后面
          if(inputValue == null ){
            inputValue = '{{' + item.variable + '}}'
          }else{
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

  let pjFieldDatadd = (e)=>{
    var result=[];
    let content;
    let dataKey = /{{\w+.DATA}}/gm, prefix = /\w+(?=.DATA)/gm;
    // let reg = match(/}\n([^}]*)/g)
    // let arr = e.match(/}\n([^}]*)/g);
    // let resArr = {};
    // for(let item of arr){
    //   if(item.includes('：')){
    //     let objArr = item.replace('}\n').replace('{{').split('：');
    //     resArr[objArr[0]] = 
    //   }
    // }
    while ((content = dataKey.exec(e)) !== null) {
      content.forEach((item,index) => {
        let contentId = item.match(prefix)[0];
        result.push({"templateFieldCode":contentId});
      })
    }
    return result;
  };

  // 打开选择场景模板弹框
  let openChangeTemplate = () => {
    getSceneTemplateList()
  }
  // 选择场景模板分页
  let pageInfoChange = (pages) => {
    getSceneTemplateList(pages)
  }

  /*关闭*/
  let onCancel = () => {
    form.resetFields();
    onCallbackSetSales(false)
    setSenceTemplateListData(null)
    // setSenceTemplateListData([])
    setSenceTemplateData(null)
    setJumpMothod(2)
    setChackValue({})
  }

  // 提交
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
        // sceneType: sceneType,
        fieldId: item.templateFieldId,
        content: data[item.templateFieldCode],
        contentColor: document.getElementById(`${item.templateFieldCode}Color`).value,
        code: codeList
      }
      dInit.push(pjObject)
    })
    data.data = dInit
    if (entryType != 3) {
      data.sceneTemplateId = templateNo
    }
    saveTemplate(data)
  }

  let saveTemplate = (params) => {
    dispatch({
      type: 'sceneTemplate/new',
      payload: {
        method: 'postJSON',
        params: params
      },
      callback: res => {
        if (res.result.code == '0') {
          setJumpMothod(2)
          onCallbackSetSales(true)
          onCancel()
          message.success(res.result.message)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  let getTemplateVariableValue = (value) => {
    // let arr = value.content.split('\n');
    // let resArr = [];
    // for(let item of arr){
    //   if(item){
    //     resArr.push(item.replace('.DATA',''));
    //   }
    // }
    // console.log(resArr,"value")
    // let result = [];
    // result = pjFieldDatadd(value.content)
    // console.log(result)
    // setSenceTemplateListData([])
    setChackValue({})
    setSenceTemplateData(value)
    form.setFieldsValue({
      messageId: value.wxTemplateId
    })
    setSenceTemplateListData(value.sceneTemplateVariableList)
    let rules = {}
    value.sceneTemplateVariableList.map((item, index) => {
      item.wxMessageColor = item.wxMessageColor == null ? 'black' : item.wxMessageColor
      rules[`${item.templateFieldCode}`] = item.content
    })
    //检验添加
    form.setFieldsValue(rules)
  }

  // 跳转到添加变量方法
  let toAddVariable = (param, index) => {
    openWinKey = param;
    if (index == 2) {

    }
    dispatch({
      type: 'sceneTemplate/getVariableList',
      payload: {
        method: 'postJSON',
        params: {
          templateVariableWxId: param.templateFieldId || '',
          sceneTemplateId:modalDetail.sceneTemplateDetail && modalDetail.sceneTemplateDetail.templateMessageId,
          sceneType: modalDetail && modalDetail.sceneType,
        }
      },
      callback: res => {
        console.log(chackValue,"res")
        if (res.result.code == '0') {
          if (!chackValue || chackValue[`${param.templateFieldCode}`]) {
            setVariableModal({
              modalName: 'addVariable',
              variableList: res.body.sceneTypeVariableList,
              checkedValue: param.templateFieldCode == null ? null : chackValue[`${param.templateFieldCode}`],
              name: param.templateFieldCode,
              index:index,
              allList: res.body.sceneTypeVariableList
            })
          } else {
            setVariableModal({
              modalName: 'addVariable',
              variableList: res.body.sceneTypeVariableList,
              checkedValue: res.body.selectVariables == null ? null : res.body.selectVariables,
              name: param.templateFieldCode,
              index:index,
              allList: res.body.sceneTypeVariableList
            })
          }
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  let clearMapVariable = () => {
    setSenceTemplateData(null)
    setSenceTemplateListData(null)
    setChackValue({})
  }

  //颜色切换
  let setMcolor = (e) => {
  }

  let textOnChange = (e, index,item) => {
    let test = form.getFieldValue(item)
    let list = JSON.parse(JSON.stringify(senceTemplateListData))
    if(list){
      if(JSON.stringify(index) != '[]'){
        list[index].content = test
        setSenceTemplateListData(list)
      }
    }
    setSenceTemplateListData(list)
  }

  // 备用链接地址
  let backupUrlOnchange = (value) => {
    setBackupUrl(value)
    form.setFieldsValue({
      backupUrl: value
    })
  }
  return (
    <>
      {/* 群发 */}
      <Modal width={1000} visible={addVisible}
        title={entryType == 1 ? <div>启用模板</div> : entryType == 2 ? <div>编辑模板</div> : <div>新建模板</div>}
        footer={null}
        onCancel={onCancel}>

        <Form form={form} onFinish={handleOk}>
          <Row>
            <Col flex="auto">
              <Col span={15}>
                <Form.Item label="场景消息分类:" name="sceneTypeStr" labelCol={{ flex: '0 0 150px' }} >
                  {entryType == 3 || modalDetail.triggerType == 2? <span>定向投放</span> : <span>{modalDetail.sceneTypeStr}</span>}
                </Form.Item>
              </Col>
              <Col span={15}>
                <Form.Item label="场景模板名称:" name="sceneTemplateName" labelCol={{ flex: '0 0 150px' }} >
                  {
                    entryType == 3 || modalDetail.triggerType == 2 ? <Input placeholder="请输入" /> : <span>{modalDetail.sceneTemplateName}</span>
                  }
                </Form.Item>
              </Col>
              <Col span={15}>
                <Form.Item label="触发类型:" name="triggerTypeStr" labelCol={{ flex: '0 0 150px' }} >
                  {entryType == 3 ? <span>人工推送</span> : <span>{modalDetail.triggerTypeStr}</span>}
                </Form.Item>
              </Col>
              {/* <Col span={15}>
                <Form.Item label="公众号" name="messageId" labelCol={{ flex: '0 0 150px' }} rules={[{ required: true }]}>
                  <Select placeholder="不限" allowClear>
                    {
                      weChatLiat.map((item, key) => {
                        return <Option value={item.id} checked>{item.name}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col> */}
              <Col span={15}>
                <Form.Item label="微信模板" name="messageId" labelCol={{ flex: '0 0 150px' }}>
                  <Button onClick={() => openChangeTemplate()}>选择模板</Button>
                  {senceTemplateData  ? <span><span className={style.fontSize}>{senceTemplateData.templateTitle}</span> <span className={style.fontSize} onClick={() => { clearMapVariable() }}>X</span></span>
                    : ''}
                </Form.Item>
              </Col>
              <Col span={15}>
                <Form.Item label="跳转方式" name="jumpType" labelCol={{ flex: '0 0 150px' }}>
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
                    <Col span={15}>
                      <Form.Item label="小程序ID" name="miniAppId" labelCol={{ flex: '0 0 150px' }} rules={[{ required: true }]}>
                        <Input placeholder="请输入" ></Input>
                      </Form.Item>
                    </Col>
                    <Col span={15}>
                      <Form.Item label="小程序页面地址" name="miniPagePath" labelCol={{ flex: '0 0 150px' }} rules={[{ required: true }]}>
                        <Input placeholder="请输入"></Input>
                      </Form.Item>
                    </Col>
                    <Col span={15}>
                      <Form.Item label="备用网页链接" name="backupUrl" labelCol={{ flex: '0 0 150px' }} rules={[{ required: true }]}>
                        <Input placeholder="请输入" value={backupUrl} onChange={(e) => { backupUrlOnchange(e.target.value) }}></Input>
                        <span className={style.spare_href}>微信版本较低时，直接跳转网页地址</span>
                      </Form.Item>
                    </Col>
                  </> : jumpMothod == 3 ?
                    <Col span={15}>
                      <Form.Item label="链接" name="linkUrl" labelCol={{ flex: '0 0 150px' }} rules={[{ required: true }]}>
                        <Input placeholder="请输入"></Input>
                      </Form.Item>
                    </Col>
                    : ''
              }
            </Col>
          </Row>

          <Divider />

          <Row>
            <Col span={16}>
              {
                  senceTemplateListData ? senceTemplateListData.map((item, index) => {
                    return <Row>
                      <Col span={15}>
                        <Form.Item label={item.templateFieldCode + '.DATA'} name={item.templateFieldCode} labelCol={{ flex: '0 0 150px' }} rules={[{ required: true }]}>
                          <TextArea rows={1} placeholder={'请输入'} defaultValue={item.content} onChange={(e) => {textOnChange(e,index,item.templateFieldCode) }} id={`${item.templateFieldCode}Txt`}></TextArea>
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Input type="color" id={`${item.templateFieldCode}Color`} defaultValue={item.wxMessageColor} onChange={(value) => { setMcolor(value) }} />
                      </Col>
                      <Col span={4} >
                        <PlusOutlined className={style.add_driect} />
                        <span className={style.add_driect_add} onClick={() => { toAddVariable(item,index) }}>增加变量</span>
                      </Col>
                    </Row>
                  })
                  : ''
              }

            </Col>

            {
              senceTemplateListData && senceTemplateData?
                <>
                  <Col span={8} className={style.image_box}>
                    <div className={style.big_bg_box}>
                      <span>实时预览</span>
                      <div className={style.bg_box}>
                        <div className={style.title_template}>{senceTemplateData.templateTitle}</div>
                      {senceTemplateListData.map((item, index) => {
                        return <div>
                          <span>{item.content}</span>
                        </div>
                      })}

                      </div>
                    </div>
                  </Col>
                  <Divider />
                </>
                : ''
            }
          </Row>


          <Row justify='end'>
            <Col>
              <Button htmlType="button" onClick={onCancel} style={{ marginRight: '10px' }}>取消</Button>
              <Button htmlType="submit" type="primary" >提交</Button>
            </Col>
          </Row>
        </Form>
      </Modal>
      {variableModal ? <AddVariable modalInfo={variableModal} closeMode={() => { setVariableModal(null) }} getVariableValue={(value) => { getVariableValue(value) }} /> : ''}
      {senceVariableModal ? <ChooseTemplate modalInfo={senceVariableModal} closeMode={() => { setSenceVariableModal(null) }} getVariableValue={(value) => { getTemplateVariableValue(value) }} pageInfoChange={(pageInfo) => pageInfoChange(pageInfo)} /> : ''}
    </>
  )
}


export default connect(({ }) => ({
}))(AddEditUpModal)
