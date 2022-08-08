import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Table, Modal, Space, message, Divider, Upload, Button, Row, Select, Col, Radio, DatePicker, TimePicker } from "antd"
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import style from "./style.less";
import { uploadFile } from '@/services/officialAccount.js';
import AddVariable from '../addVariable';
import SceneTemplate from '../sceneTemplate';
import PropelGroup from '../propelGroup';
import moment from 'moment';
import { sortedIndexOf } from 'lodash';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const wechatModal = (props) => {
  let { dispatch, modalInfo, toFatherValue } = props;
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
  const [marketList, setMarketList] = useState([]);
  const [secondDisabled, setSecondDisabled] = useState(false);
  const [pushMechanism, setPushMechanism] = useState(1);
  const [pushCrowdValue, setPushCrowdValue] = useState(2); // 推送人群的默认值
  const [jumpMothod, setJumpMothod] = useState(1);// 跳转方式  
  const [importType, setImportType] = useState(1); // 数据验证条件
  const [uploadCount, setUploadCount] = useState(0);// 上传之后统计的数量
  const [dataCacheKey, setDataCacheKey] = useState('');// 导入之后返回的key
  const [hourAndSecond, setHourAndSecond] = useState('');// 添加用到的时分
  const [firstLevelValue, setFirstLevelValue] = useState(0);// 周期推送第一个下拉框的值
  const [secondLevelValue, setSecondLevelValue] = useState(1);// 周期推送第二个下拉框的值
  const [resSecondLevel, setResSecondLevel] = useState([]);// 周期推送第二个下拉框可能有两种情况
  const [senceTemplateData, setSenceTemplateData] = useState(null);// 存储场景模板名称ID等信息
  const [senceTemplateListData, setSenceTemplateListData] = useState([]);// 添加变量的Data信息
  const [sendTime, setSendTime] = useState(null);// 定时推送
  const [propleGroupVisiable, setPropleGroupVisiable] = useState(null);// 显示选择人群弹框
  const [activityThrongList, setActivityThrongList] = useState([]);// 回显人物群组
  const [checkActivityThrongList, setCheckActivityThrongList] = useState([]);// 选中回显人物群组
  const [reImport, setReImport] = useState(true);// 判断是否跳过验证
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



  useEffect(() => {
    // 查询该渠道下面公众号
    getAppSettingListByChannelId()
    //营销项目下拉框
    listMarketProject()
    // 处理默认数据 form名称和value不对应需要手动添加校验
    form.setFieldsValue({
      sendPerson: pushCrowdValue,
      jumpType: jumpMothod,
      importType: importType,
      sendType: pushMechanism
    })
    if (modalInfo.objectId) {
      getSceneDetail();
    }
  }, [])
  //查询全部营销项目
  let listMarketProject = () => {
    dispatch({
      type: 'directionalLaunch/listMarketProject',
      payload: {
        method: 'postJSON',
        params: {}
      },
      callback: res => {
        if (res.result.code == '0') {
          setMarketList(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 查询该渠道下面公众号
  let getAppSettingListByChannelId = () => {
    dispatch({
      type: 'directionalLaunch/getAppSettingListByChannelId',
      payload: {
        method: 'post',
      },
      callback: res => {
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
      type: 'directionalLaunch/getSceneDetail',
      payload: {
        method: 'get',
        params: {
          objectId: modalInfo.objectId,
        }
      },
      callback: res => {
        if (res.result.code == '0') {
          let initData = res.body
          setPushCrowdValue(initData.sendPerson)
          setJumpMothod(initData.jumpType)
          setUploadCount(initData.num)
          pushMechanismonChange(initData.sendType)
          setSenceTemplateListData(initData.data)
          setBackupUrl(initData.backupUrl)
          let rules = {}
          initData.data.map((item, index) => {
            rules[`${item.templateFieldCode}`] = item.content
          })
          setTemplateMessageId(initData.wechatSceneTemplateMessageId)
          setSenceTemplateData({
            sceneTemplateName: initData.sceneTemplateName,
          })
          if (initData.sendPerson == 2) {
            setUploadShow(true)
            setFileCode(initData.fileCode)
            setFileName('编辑')
            setReImport(false)
          } else if (initData.sendPerson == 3) {
            setCheckActivityThrongList(initData.throngIds ? initData.throngIds.split(",") : "")
            getThrongListES(initData.throngIds ? initData.throngIds.split(",") : [])
          }
          //周期推送
          if (initData.sendType == 3) {
            firstLevelOnChange(initData.cyclePeriod)
            if (initData.cyclePeriod == 0) {
            } else if (initData.cyclePeriod == 1) {
              secondLevelOnChange(initData.week)
            } else {
              secondLevelOnChange(initData.day)
            }
            hourAndSecondOnchange(initData.hour + ":" + initData.minute)
          } else if (initData.sendType == 2) {
            timingPush(initData.sendTime)
          }

          //检验添加
          form.setFieldsValue({
            importType: initData.importType,
            throngIds: initData.throngIds,
            sendType: initData.sendType,
            linkUrl: initData.linkUrl,
            miniAppid: initData.miniAppid,
            miniPagepath: initData.miniPagepath,
            backupUrl: initData.backupUrl,
            taskName: initData.taskName,
            sendPerson: initData.sendPerson,
            jumpType: initData.jumpType,
            dataCacheKey: initData.fileCode,
            teamId: initData.teamId,
            wechatSceneTemplateId: initData.wechatSceneTemplateId,
            cycleSendTimeStart: initData.sendType == 3 && initData.cycleSendTimeStart != null ? [moment(initData.cycleSendTimeStart), moment(initData.cycleSendTimeEnd)] : '',
            ...rules
          })
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  let getThrongListES = (params) => {
    dispatch({
      type: 'directionalLaunch/getThrongListES',
      payload: {
        method: 'postJSON',
        params: {
          pageNum: 1,
          pageSize: 9999
        }
      },
      callback: res => {
        if (res.result.code == '0') {
          let list = res.body
          let result = [];
          if (params || params.length > 0) {
            list.map((item, index) => {
              params.map((v, index) => {
                if (item.id == v) {
                  result.push(item)
                }
              })
            })
          }
          getPropleGroup(result)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 查询场景模板列表
  let getSceneTemplateList = (pages) => {
    dispatch({
      type: 'directionalLaunch/getSceneTemplateList',
      payload: {
        method: 'postJSON',
        params: {
          sceneType: 5,
          wechatAppSettingId: wechatId,
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
    if (pushCrowdValue == 2) {
      if (reImport) {
        message.error("需要先导入数据！")
        return
      }
    }
    if (pushMechanism == 3) {
      if (hourAndSecond == '') {
        message.error("请输入周期时间")
        return
      }
      if (firstLevelValue == 1) {
        if (secondLevelValue == null) {
          message.error("请输入周期时间")
          return
        }
      }
    }
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
    if (pushMechanism == 2) {
      data.sendTime = moment(sendTime).format(dateFormat)
    } else if (pushMechanism == 3) {
      data.cyclePeriod = firstLevelValue
      if (firstLevelValue == 0) {

      } else if (firstLevelValue == 1) {
        data.week = secondLevelValue
      } else {
        data.day = secondLevelValue
      }
      if (data.cycleSendTimeStart) {
        let start = data.cycleSendTimeStart[0]
        let end = data.cycleSendTimeStart[1]
        data.cycleSendTimeStart = moment(start).format(dateFormat)
        data.cycleSendTimeEnd = moment(end).format(dateFormat)
      }
      // 固定传递时分秒
      let split = typeof hourAndSecond == 'string' ? hourAndSecond.split(":") : moment(hourAndSecond).format("HH:mm").split(":")

      data.hour = split[0]
      data.minute = split[1]
    }
    if (pushCrowdValue == 2) {
      data.num = uploadCount
      data.dataCacheKey = dataCacheKey
      data.fileCode = fileCode
      data.fileName = '上传名单'
    }
    data.data = dInit
    if (modalInfo.objectId) {
      data.objectId = modalInfo.objectId
    }
    saveTemplate(data)
  }

  let saveTemplate = (params) => {
    dispatch({
      type: 'directionalLaunch/saveTemplate',
      payload: {
        method: 'postJSON',
        params: params
      },
      callback: res => {
        if (res.result.code == '0') {
          toFatherValue(true)
          message.success(res.result.message)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 文件上传配置
  let uploadConfig = {
    name: "files",
    maxCount: 1,
    action: uploadFile,
    accept: ".xls,.xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",   //上传文件类型--这个是excel类型
    showUploadList: true,
    headers: {
      "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken
    },
    beforeUpload(file) {
      if (file.size > 1024 * 1024 * 5) {
        return message.error({ style: { marginTop: '10vh', }, content: '文件大小最大为5M' });
      }
    },
    onChange(e) {
      setUploadShow(false)

      setFileList(e.fileList)
      if (e.file.status === "done") {
        message.destroy();
        message.success(`${e.file.name} 上传成功!`)
        if (e.file.response.result.code === '0') {
          setFileCode(e.file.response.body[0]);
          setFileName(e.file.name);
        }
      } else if (e.file.status === "error") {
        setFileCode(null);
        setFileList(null)
        setFileName(null);
        message.destroy()
        message.error(`${e.file.name} 上传失败!`)

      }
    },
    onRemove(e) {
      setFileCode(null);
      setUploadCount(0)
    }
  }

  // 周期推送第一个下拉框
  let firstLevelOnChange = (e) => {
    // 复制第一个级别的下拉框
    setFirstLevelValue(e)
    //每次清空第二个级别的下拉框
    setSecondLevelValue(null)
    // 每次都启用第二个级别的下拉框
    setSecondDisabled(false)
    if (e == 0) {
      setSecondDisabled(true)
      setResSecondLevel([])
      setSecondLevelValue(null)
    } else if (e == 1) {
      setResSecondLevel(secondLevel)
    } else if (e == 2) {
      let dayList = [];
      for (var i = 0; i < 31; i++) {
        dayList.push({ code: i + 1, name: (i + 1) + '号' })
      }
      setResSecondLevel(dayList)
    }
  }
  //选中推送机制的时候需要对周期推送做特殊处理
  let pushMechanismonChange = (value) => {

    setPushMechanism(value)
    firstLevelOnChange(0)
  }

  // 周期推送第二个下拉框
  let secondLevelOnChange = (e) => {
    setSecondLevelValue(e)
  }

  // 获取选择变量的值
  let getVariableValue = (value) => {
    // 缓存选中的值
    let checValue = JSON.parse(JSON.stringify(chackValue))
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
      console.log(inputValue,startPos)
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
    dispatch({
      type: 'directionalLaunch/findSceneTypeVariableList',
      payload: {
        method: 'postJSON',
        params: {
          templateVariableWxId: param.templateFieldId,
          sceneType: 5,
          
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
    getDetail(value.sceneTemplateId)


  }

  let getDetail = (id) => {
    dispatch({
      type: 'directionalLaunch/getSceneTemplateListDetail',
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
            miniAppid: res.body.miniAppId,
            linkUrl: res.body.linkUrl,
            miniPagepath: res.body.miniPagePath,
            backupUrl: res.body.backupUrl,
            jumpType: res.body.jumpType,
            wechatSceneTemplateId: value.templateMessageId,
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

  // 导入
  const importFilesNumber = () => {
    if (!fileCode) {
      return message.error({ style: { marginTop: '10vh', }, content: '请上传模板!' });
    }
    dispatch({
      type: 'directionalLaunch/importFilesNumber',
      payload: {
        method: 'postJSON',
        params: {
          templateId: form.getFieldValue('wechatSceneTemplateId'),
          importType: importType,
          taskType: pushCrowdValue,
          updateCode: fileCode,
          fileName: fileName,
        }
      },
      callback: res => {
        if (res.result.code == 0) {
          message.success('导入成功!')
          form.setFieldsValue({
            dataCacheKey: res.body.key
          })
          setDataCacheKey(res.body.key)
          setUploadCount(res.body.num)
          setReImport(false)
        } else {
          setFileCode(null);
          setFileList(null)
          setFileName(null);
          return message.error(res.result.message)

        }
      }
    })
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
      type: 'directionalLaunch/fileDownload',//下载文件
      payload: {
        method: 'get',
        params: {},
        fileCode: fileCode,
        responseType: 'blob'
      },
      callback: (res) => {
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
  // 定时推送
  let timingPush = (e) => {
    if (modalInfo.objectId) {
      setSendTime(e)
    } else {
      setSendTime(e.format('YYYY-MM-DD HH:mm:ss'))
    }

  }

  let hourAndSecondOnchange = (value) => {
    if (modalInfo.objectId) {
      setHourAndSecond(value)
    } else {
      setHourAndSecond(value.format('HH:mm'))
    }

  }


  let textOnChange = (e, index, item) => {
    let test = form.getFieldValue(item)
    let list = JSON.parse(JSON.stringify(senceTemplateListData))
    if (list) {
      if (JSON.stringify(index) != '[]') {
        list[index].content = test
        setSenceTemplateListData(list)
      }
    }

  }

  let onPickThrong = () => {
    setPropleGroupVisiable({ modalName: 'peopleGroup', checkedPeople: checkActivityThrongList })
  }

  let getPropleGroup = (value) => {
    setActivityThrongList(value)
    let autoList = [];

    if (value.length > 0) {
      value.map((item, index) => {
        autoList.push(item.id)
      })
      form.setFieldsValue({
        throngIds: autoList.toString()
      })
    }

  }

  // 兑换码时间禁用之前日期
  let disabledDate = (current) => {
    return current && current < moment().startOf('hour');
  }

  let importTypeOnChange = (e) => {
    setImportType(e.target.value)
    setReImport(true)
    setUploadCount(0)
  }
  return (
    <>
      {/* 群发 */}
      <Modal width={1000} visible={modalInfo.modalName == 'addMessagePushTask' || modalInfo.modalName == 'edit'} footer={null} onCancel={() => { toFatherValue(false) }}>
        <div className={style.title_add_msg}>{modalInfo.modalName == 'addMessagePushTask' ? '新建' : '编辑'}消息推送任务</div>
        <Divider />
        <Form form={form} onFinish={handleOk}>
          <Row justify='center'>
            <Col span={24}>
              <Form.Item label="营销项目" name="teamId" labelCol={{ flex: '0 0 130px' }} rules={[{ required: true }]}>
                <Select
                  showSearch
                  notFoundContent='暂无数据'
                  placeholder="请选择"
                  optionFilterProp="children"
                  placeholder="营销名称"
                >
                  {
                    marketList.length > 0 ? marketList.map((item, index) => {
                      return <Option value={item.objectId}>{item.marketProjectName}</Option>
                    }) : ''
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="任务名称" name="taskName" labelCol={{ flex: '0 0 130px' }} rules={[{ required: true }]}>
                <Input placeholder="任务名称" ></Input>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="推送人群" name="sendPerson" labelCol={{ flex: '0 0 130px' }} rules={[{ required: true }]}>
                <Radio.Group onChange={(e) => sendPersonOnchange(e)} value={pushCrowdValue} defaultValue={pushCrowdValue}>
                  <Radio value={1}>全量发送</Radio>
                  <Radio value={2}>指定人群</Radio>
                  {/* <Radio value={3}>用户群组</Radio> */}
                </Radio.Group>
              </Form.Item>
            </Col>
            {
              pushCrowdValue == 2 ?
                <>
                  <Col span={24}>
                    <Form.Item label="数据验证条件" name="importType" labelCol={{ flex: '0 0 130px' }} rules={[{ required: true }]}>
                      <Radio.Group onChange={(e) => importTypeOnChange(e)} value={importType} defaultValue={importType}>
                        <Radio value={3}>openid</Radio>
                        <Radio value={1}>身份证</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={15}>
                    <Form.Item label="上传模板" name="dataCacheKey" labelCol={{ flex: '0 0 130px' }} rules={[{ required: true, message: '请导入数据', }]}>
                      <Upload {...uploadConfig} fileList={fileList}>
                        <Button icon={<UploadOutlined />}>上传文件</Button>
                      </Upload>
                      {uploadShow ? <span className={style.fontNameSize} onClick={() => { fileDownload() }}>上传名单详细</span> : ''}
                    </Form.Item>
                  </Col>
                  <Col span={9}>
                    <Button type='primary' onClick={() => { importFilesNumber() }}>导入</Button>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="下载模板" name="downLoad" labelCol={{ flex: '0 0 130px' }}>
                      <div className={style.put_down}>
                        <DownloadOutlined />
                        <a href="https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/file-template/carowner-admin/%E6%B6%88%E6%81%AF%E8%A1%A8%E6%A0%BC%E6%A8%A1%E6%9D%BF-%E6%8C%87%E5%AE%9A%E4%BA%BA%E5%91%98.xlsx" download="消息表格模板-指定人员.xlsx">下载模板</a>
                      </div>
                    </Form.Item>

                  </Col>

                  <Col span={24}>
                    <Form.Item label="数据条数" labelCol={{ flex: '0 0 130px' }} >
                      本地上传{uploadCount}条数
                    </Form.Item>
                  </Col>
                </>
                : pushCrowdValue == 3 ? <>
                  <Col span={24}>
                    <Form.Item label="选择人群" name="throngIds" labelCol={{ flex: '0 0 130px' }} >
                      <Button type="primary" onClick={onPickThrong} >选择人群</Button>
                      <div className={style.form_item_check_title}>
                        {activityThrongList.length > 0 ? <span>已选择：</span> : null}
                        {
                          activityThrongList.length > 0 && activityThrongList.map((item, key) => {
                            return <span>{item.groupName} {!item.countNum ? '--' : item.countNum}人；</span>
                          })
                        }
                      </div>
                    </Form.Item>
                  </Col>
                </> : ''
            }
            <Col span={24}>
              <Form.Item label="场景模板名称" name="wechatSceneTemplateId" labelCol={{ flex: '0 0 130px' }} rules={[{ required: true }]}>
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

            <Col span={24}>
              <Form.Item label="推送机制" name="sendType" labelCol={{ flex: '0 0 130px' }}>
                <Radio.Group onChange={(e) => pushMechanismonChange(e.target.value)} value={pushMechanism} defaultValue={pushMechanism}>
                  <Radio value={1}>立即推送</Radio>
                  <Radio value={2}>定时推送</Radio>
                  <Radio value={3}>周期推送</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            {
              pushMechanism == 2 ?
                <Col span={20}>
                  <DatePicker disabledDate={disabledDate} showTime onChange={(e) => { timingPush(e) }} format={dateFormat} value={sendTime ? moment(sendTime, dateFormat) : null} defaultValue={sendTime ? moment(sendTime, 'YYYY-MM-DD HH:mm:ss') : null} />
                </Col> : pushMechanism == 3 ?
                  <>
                    <Col span={24}>
                      <Form.Item label="周期时间" name="cycleSendTimeStart" labelCol={{ flex: '0 0 130px' }} rules={[{ required: true }]}>
                        <RangePicker
                          defaultValue={data} format={dateFormat} showTime
                        />
                      </Form.Item>
                    </Col>
                    <Col span={20} >
                      <Space>
                        <Select
                          showSearch
                          notFoundContent='暂无数据'
                          optionFilterProp="children"
                          onChange={(e) => firstLevelOnChange(e)}
                          value={firstLevelValue}
                          style={{ width: '70px' }}
                        >
                          {
                            firstLevel.map((v, i) => {
                              return <Option value={v.code}>{v.name}</Option>
                            })
                          }
                        </Select>
                        <Select
                          showSearch
                          notFoundContent='暂无数据'
                          optionFilterProp="children"
                          onChange={(e) => secondLevelOnChange(e)}
                          value={secondLevelValue}
                          disabled={secondDisabled}
                          style={{ width: '70px' }}
                        >
                          {
                            resSecondLevel.map((v, i) => {
                              return <Option value={v.code}>{v.name}</Option>
                            })
                          }
                        </Select>
                        <TimePicker format={'HH:mm'} onChange={(e) => { hourAndSecondOnchange(e) }} value={hourAndSecond ? moment(hourAndSecond, 'HH:mm') : null} defaultValue={hourAndSecond ? moment(hourAndSecond, 'HH:mm') : null} />
                      </Space>
                    </Col>
                  </>
                  : ''
            }
          </Row>
          <Row className={style.style_top_content}>
            <Col span={16}>
              {
                senceTemplateListData.map((item, index) => {
                  return <Row>
                    <Col span={15}>
                      <Form.Item label={item.templateFieldCode + '.DATA'} name={item.templateFieldCode} labelCol={{ flex: '0 0 130px' }} rules={[{ required: true }]}>
                        <TextArea rows={1} defaultValue={item.content} onChange={(e) => { textOnChange(e, index, item.templateFieldCode) }} id={`${item.templateFieldCode}Txt`}></TextArea>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Input type="color" id={`${item.templateFieldCode}Color`} defaultValue={item.wxMessageColor}  />
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
                    <div><p>预览</p></div>
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
            <Button htmlType="button" onClick={() => { toFatherValue(false) }}>取消</Button>
          </Row>

        </Form>
      </Modal>
      {variableModal ? <AddVariable modalInfo={variableModal} closeMode={() => { setVariableModal(null) }} getVariableValue={(value) => { getVariableValue(value) }} variableList={secondLevel} /> : ''}
      {senceVariableModal ? <SceneTemplate modalInfo={senceVariableModal} closeMode={() => { setSenceVariableModal(null) }} getVariableValue={(value) => { getTemplateVariableValue(value) }} pageInfoChange={(pageInfo) => pageInfoChange(pageInfo)} /> : ''}
      {propleGroupVisiable ? <PropelGroup modalInfo={propleGroupVisiable} closeMode={() => { setPropleGroupVisiable(null) }} getVariableValue={(value) => { getPropleGroup(value) }} /> : ''}
    </>
  )
}


export default connect(({ directionalLaunch }) => ({
}))(wechatModal)