import React, { useState, useEffect } from "react";
import { connect, history } from 'umi';
import { Form, Input, Table, Upload, Select, Divider, Empty, Row, Space, Button, Radio, Descriptions, DatePicker, Modal, Card, message, Pagination, Tooltip, Typography, InputNumber } from "antd";
import style from "./style.less";
import Coupon from './components/coupon';
import Cardbag from './components/cardbag';
import ExchangeCode from './components/exchangeCode';//支持添加卡券和卡包
import InterfaceLaunch from './components/interfaceLaunch';//支持添加卡券和卡包

import { fmoney } from '@/utils/date'
import failIcon from '@/assets/failIcon.png'
import moment from 'moment';
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;


// 新增卡券
let addEditCard = (props) => {
  let { dispatch, moneyQuato, selsctMarketingItems, isCardRadioTabs, compData, allObj } = props;
  console.log(compData, 'compData')
  let [form] = Form.useForm();
  // 登录成功返回的数据
  const currentUser = localStorage.getItem('tokenObj') ? JSON.parse(localStorage.getItem('tokenObj')) : {};

  let [fileId, setFileId] = useState(null);//文件存放ID
  let [isFileVisible, setIsFileVisible] = useState(false);//下载流文件

  let [temType, setTemType] = useState(1);//模版类型（1：简易模版，2：保险公司模版）
  let [cardPackageFlag, setCardPackageFlag] = useState(0);//0卡券，1卡包
  let [isSaveVisible, setIsSaveVisible] = useState(false);//保存卡券、卡包二次确认弹框
  // let [cardReceiveType, setCardReceiveType] = useState(1);//领取方式 1：全部发放 2：用户自领 3.用户领取 4.用户自选 5.接口发放
  // 1卡包领取方式
  const [receiveType, setReceiveType] = useState(1);
  // 1card领取方式
  const onChangeReceiveWay = (e) => {
    setReceiveType(e.target.value);
  }
  
  // 卡包领取有效期回显
  if(cardPackageFlag==1 ) {
    form.setFieldsValue({
      effectiveDate : compData.packageAddResult.receiveValidDays != null ? [moment(), moment().add((Number(compData.packageAddResult.receiveValidDays) -1), 'days')] : [moment(), moment().add(1, 'years')]
    })
  }


  // 卡券
  let [totalPeople, setTotalPeople] = useState(0)//总人数
  let [totalNum, setTotalNum] = useState(0)//总发放数量

  useEffect(() => {
    compQuato()
    selsctAllMarketing()

    // 设置初始进来时的卡券投放、卡包投放tabs默认值状态
    dispatch({
      type: 'cardgrantManageModel/setCardRadioTabs',//tabs切换
      payload: 0
    })
    setCardPackageFlag(0);

    dispatch({
      type: 'cardgrantManageModel/setCompData',//清除上一次卡券列表数据
      payload: {
        detailList: [],
        packageAddResult: {}
      }
    })

    // 默认卡券有效期
    let data = {
      effectiveDate: [moment(), moment().add(1, 'years')]
    }
    form.setFieldsValue(data)
  }, [])


  // 额度
  let compQuato = () => {
    dispatch({
      type: 'cardgrantManageModel/compQuato',
      payload: {
        method: 'postJSON',
        params: {}
      }
    })
  }
  // 营销活动
  let selsctAllMarketing = () => {
    dispatch({
      type: 'cardgrantManageModel/selsctAllMarketing',
      payload: {
        method: 'postJSON',
        params: {
          type: 1
        }
      }
    })
  }

  let [marketProjectId, setMarketProjectId] = useState(null);//所属项目id
  let [marketProjectName, setMarketProjectName] = useState('');//所属项目name
  let [marketProjectNameDate, setMarketProjectNameDate] = useState('');//所属项目name_20210908
  let [grantName, setGrantName] = useState('');//发放名称
  let [identification, setIdentification] = useState(null);//发放标识
  let [verifyNum, setVerifyNum] = useState(null);//兑换码数量
  let [effectiveStartDate, setEffectiveStartDate] = useState('');//兑换码开始时间，卡券领取有效期-开始时间 
  let [effectiveEndDate, setEffectiveEndDate] = useState('');//兑换码结束时间，卡券领取有效期-结束时间

  // 兑换码时间,卡券领取有效期禁用之前日期~一年之内
  let disabledDate = (current) => {
    const today = current && current < moment().startOf('day');//今天之前不可选
    // const withinAyear = current && current > moment().add(1, 'years');
    return today;
    // return today || withinAyear;
  }

  let marketProjectIdOrName = (e) => {
    console.log(e, 'ee')
    let data = e.split('&')
    setMarketProjectId(data[0])//id
    setMarketProjectName(data[1])//name
    setMarketProjectNameDate(data[1] + '_' + moment().format('YYYYMMDD'))//所属项目name_20210908
    form.setFieldsValue({ grantName: data[1] + '_' + moment().format('YYYYMMDD') })
  }

  // 点击保存
  let subBtnEvent = (values) => {
    // console.log(compData, 'compData')
    // 兑换码时间，卡券领取时间
    if (values.effectiveDate) {
      effectiveStartDate = values.effectiveDate[0].format('YYYY-MM-DD');
      effectiveEndDate = values.effectiveDate[1].format('YYYY-MM-DD');
      setEffectiveStartDate(effectiveStartDate)
      setEffectiveEndDate(effectiveEndDate)
    }

    if (cardPackageFlag == 0) {//0卡券
      if (!fileId) {
        message.warning({ content: '请上传名单！' })
      } else if (!isUseFile) {//有效的名单
        message.warning({ content: '请重新上传有效名单！' })
      }
      // else if ((moneyQuato.allQuoat - moneyQuato.useQuoat - moneyQuato.occupyQuoat) < allObj.allMoney * totalNum) {
      //   message.warning({ content: '本月投放额度不足，请联系管理员' })
      // } else if (allObj.allCont * totalNum > 100000) {
      //   message.warning({ content: '单批次导入卡券总张数不能超过100000张' })
      // } 
      else if (!compData.detailList.length) {
        message.warning({ content: '请添加卡券！' })
      }

      // if (marketProjectId && values.grantName && values.identification && compData.detailList.length && fileId && isUseFile && ((moneyQuato.allQuoat - moneyQuato.useQuoat - moneyQuato.occupyQuoat) - allObj.allMoney * totalNum) > 0) {
      if (marketProjectId && values.grantName && values.identification && compData.detailList.length && fileId && isUseFile) {
        setIsSaveVisible(true)
        setMarketProjectId(Number(marketProjectId))
        setGrantName(values.grantName)
        setIdentification(values.identification)
      }

    } else if (cardPackageFlag == 1) {//1卡包
      if (!fileId) {
        return message.warning({ content: '请上传名单！' })
      } else if (!isUseFile) {//有效的名单
        return message.warning({ content: '请重新上传有效名单！' })
      } else if (!compData.detailList.length) {
        return message.warning({ content: '请添加卡包！' })
      }
      if(compData.packageAddResult.receiveValidDays== null) {
        if(((moment(values.effectiveDate[1]).valueOf() - moment(values.effectiveDate[0]).valueOf()) / (1000*3600*24) + 1) > 730) {
          return message.warning({ content: `卡包领取有效期不能超过730天！` })
        }
      }else {
        if(((moment(values.effectiveDate[1]).valueOf() - moment(values.effectiveDate[0]).valueOf()) / (1000*3600*24) + 1) > compData.packageAddResult.receiveValidDays) {
          return message.warning({ content: `卡包领取有效期不能超过${compData.packageAddResult.receiveValidDays}天！` })
        }
      }
      if (marketProjectId && values.grantName && values.identification && compData.detailList.length && fileId && isUseFile) {
        setIsSaveVisible(true)
        setMarketProjectId(Number(marketProjectId))
        setGrantName(values.grantName)
        setIdentification(values.identification)
      }
    } else if (cardPackageFlag == 2) {//2兑换码
      if (!compData.detailList.length) {
        message.warning({ content: '请添加卡券！' })
      }

      if (marketProjectId && values.grantName && values.verifyNum && compData.detailList.length) {
        setIsSaveVisible(true)
        setMarketProjectId(Number(marketProjectId))
        setGrantName(values.grantName)
        setVerifyNum(values.verifyNum)
      }
    } else if (cardPackageFlag == 3) {
      if (!compData.detailList.length) {
        message.warning({ content: '请添加卡券！' })
      }
      if (marketProjectId && values.grantName && values.identification && fileId && isUseFile && values.verifyNum && compData.detailList.length) {
        setIsSaveVisible(true)
        setMarketProjectId(Number(marketProjectId))
        setGrantName(values.grantName)
        setIdentification(values.identification)
        setVerifyNum(values.verifyNum)
      }
    } else if (cardPackageFlag == 4) {
      if (!compData.detailList.length) {
        message.warning({ content: '请添加卡券！' })
      }
      if (marketProjectId && values.grantName && compData.detailList.length) {
        setIsSaveVisible(true)
        console.log(marketProjectId, 'marketProjectId555')
        setMarketProjectId(Number(marketProjectId))
        setGrantName(values.grantName)
      }
    }

  }

  // 二次保存
  let handleSaveOk = () => {
    dispatch({
      type: 'cardgrantManageModel/addGrant',
      payload: {
        method: 'postJSON',
        params: {
          channelId: currentUser.channelId,//渠道id(测试)
          marketProjectId: marketProjectId,//所属项目
          marketProjectName: marketProjectName,//所属项目名称
          grantName: grantName,//发放名称
          cardPackageFlag: cardPackageFlag,//0卡券，1卡包,2兑换码，3N选M，4接口投放
          grantType: 2,//发放类型 1：活动 2：直投

          identification: (cardPackageFlag == 0 || cardPackageFlag == 1 || cardPackageFlag == 3) ? identification : cardPackageFlag == 2 ? null : null,//发放标识  1.客户手机号 2.身份证号码 3微信openId 4.车架号+车牌号
          grantGroup: (cardPackageFlag == 0 || cardPackageFlag == 1 || cardPackageFlag == 3) ? nameList : null,//发放人群(特殊名单1)
          templateType: (cardPackageFlag == 0 || cardPackageFlag == 1 || cardPackageFlag == 3) ? temType : null,//模版类型（1：简易模版，2：保险公司模版）
          fileId: (cardPackageFlag == 0 || cardPackageFlag == 1 || cardPackageFlag == 3) ? fileId : '',//文件存放ID
          fileName: (cardPackageFlag == 0 || cardPackageFlag == 1 || cardPackageFlag == 3) ? fileName : '',//文件名称
          cardReceiveType: cardPackageFlag == 0 ? 1 : cardPackageFlag == 1 ? receiveType : cardPackageFlag == 2 ? 3 : cardPackageFlag == 3 ? 4 : cardPackageFlag == 4 ? 5 : '',// 领取方式 1：全部发放 2：用户自领 3.用户领取 4.用户自选 5.接口发放
          shareFlag: shareFlag, // 1-不可赠送  2-可赠送
          detailList: compData.detailList,
          packageAddResult: cardPackageFlag == 1 ? compData.packageAddResult : {},

          verifyNum: (cardPackageFlag == 2 || cardPackageFlag == 3) ? verifyNum : null,//兑换码数量，N选M数量
          effectiveStartDate: (cardPackageFlag == 0 || cardPackageFlag == 1 || cardPackageFlag == 2 || cardPackageFlag == 3) ? effectiveStartDate : '',//兑换码开始时间,N选M开始时间
          effectiveEndDate: (cardPackageFlag == 0 || cardPackageFlag == 1 || cardPackageFlag == 2 || cardPackageFlag == 3) ? effectiveEndDate : '',//兑换码结束时间,N选M结束时间

          // status: 1,//状态1：未发放 2：发放中 3：已发放
          // createUser: 'test',//用户(测试)
          // channelName: '',//渠道名称
          // grantDate: '',//发放时间
        },
        responseType: 'blob'//都转成blob类型
      },
      callback: (res) => {
        blobToSaveJSON(res);
      }
    });
  }

  //blob转json再处理数据
  const blobToSaveJSON = (blob) => {
    var reader = new FileReader();
    reader.readAsText(blob, 'utf-8');
    reader.onload = () => {
      let res = '';
      try {
        res = JSON.parse(reader.result);//将正确数据转成json
      } catch (error) {
        console.log('保存文件有误');
        setSaveDataMethod(blob)
        return;
      }
      setSaveDataMethod(res)
    }
  }
  const setSaveDataMethod = (resdata) => {
    if (!resdata.result) {//错误文件时
      setIsSaveVisible(false)
      // message.error({ content: '文件校验失败！' })

      const url = window.URL.createObjectURL(new Blob([resdata], { type: "application/vnd.ms-excel;charset=utf-8" }))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '错误信息.xls')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      if (resdata.result.code == '0') {
        message.success({ content: resdata.result.message })
        setIsSaveVisible(false)
        history.push({ pathname: '/cardgrantManage/grantList' })
      } else {
        message.error({ content: resdata.result.message })
      }
    }
  }




  const [nameList, setnameList] = useState(1);
  const onChangeNameList = (e) => {
    setnameList(e.target.value)
  }

  const onChangeTemplateType = (e) => {
    setTemType(e.target.value)
  }

  // 假上传名单
  let handelBtn = () => {
    message.warning({ content: '请先选择发放标识！' })
  }

  let [fileName, setFileName] = useState('')//文件名称
  let [fileData, setFileData] = useState(null);//返回的文件流
  let [isUseFile, setIsUseFile] = useState('');//是否是有效文件

  // 上传名单
  let handleUpload = (files) => {
    console.log(files, 'files')
    fileName = files.file.name;
    setFileName(files.file.name);
    let { file } = files;
    let formData = new FormData();
    formData.append('file', file);
    let coupon_promotion = 'coupon_promotion';
    formData.append('folderCode', coupon_promotion);
    dispatch({
      type: 'cardgrantManageModel/uploadNameList',//上传接口
      payload: {
        method: 'upload',
        params: formData
      },
      callback: (res) => {
        console.log(res, 'res')
        if (res.result.code == '0') {
          setFileId(res.body)//设置fileId
          dispatch({
            type: 'cardgrantManageModel/backExcelData',//上传名单之后数据
            payload: {
              method: 'postJSON',
              params: {
                fileId: res.body,
                identification: identification,// 发放标识
                // grantGroup: temType//发放人群
                templateType: temType//模版类型
              },
              responseType: 'blob'//都转成blob类型
            },
            callback: (resdata) => {
              blobToJSON(resdata);
            }
          })
        } else {
          message.error({ content: res.result.message })
        }
      }
    });
  }
  //blob转json再处理数据
  const blobToJSON = (blob) => {
    var reader = new FileReader();
    reader.readAsText(blob, 'utf-8');
    reader.onload = () => {
      let res = '';
      try {
        res = JSON.parse(reader.result);//将正确数据转成json
      } catch (error) {
        console.log('上传文件有误');
        setFileDataMethod(blob)
        return;
      }
      setFileDataMethod(res)
    }
  }

  const setFileDataMethod = (resdata) => {
    if (!resdata.result) {//错误文件时
      setIsFileVisible(true);
      setFileData(resdata);
    } else {
      if (resdata.result.code == '0') {
        setIsUseFile(resdata.result.code);
        setTotalPeople(resdata.body.count)//总人数
        setTotalNum(resdata.body.priceCount)//总的发放数量
        message.success({ content: resdata.result.message })
      } else {
        message.error({ content: resdata.result.message })
      }
    }
  }

  // 下载文件
  let onLoadFile = () => {
    setIsFileVisible(false);
    const url = window.URL.createObjectURL(new Blob([fileData], { type: "application/vnd.ms-excel;charset=utf-8" }))
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', '错误名单.xls')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  let uploadChange = (file) => {
    console.log(file, 'file2222')
  }

  // 改变发放标识
  let identificationChange = (e) => {
    setIdentification(e)
  }

  // 改变卡券投放，卡包投放
  let changeCardTabs = (e) => {
    dispatch({
      type: 'cardgrantManageModel/setCardRadioTabs',//tabs切换
      payload: e
    })
    setCardPackageFlag(e)

    dispatch({
      type: 'cardgrantManageModel/setCompData',//清除上一次卡券列表数据
      payload: {
        detailList: [],
        packageAddResult: {}
      }
    })
  }


  /* 限制数字输入框只能输入整数 */
  const limitNumber = value => {
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(/^(0+)|[^\d]/g, '') : ''
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(/^(0+)|[^\d]/g, '') : ''
    } else {
      return ''
    }
  }

  const handelNum = (e) => {
    // if (allObj.allCont * totalNum == 0) {
    //   message.warning({ content: '请先添加卡券，再输入领取卡券数！' })
    // }
  }
  // ======================

  // 2卡包有效期
  let [cardPackageReceiveDateStart, setCardPackageReceiveDateStart] = useState('');
  let [cardPackageReceiveDateEnd, setCardPackageReceiveDateEnd] = useState('');


  // 2时间选择框改变时间，外面
  let changeCardTime = (e) => {
    if (e) {
      cardPackageReceiveDateStart = moment(e[0]).format('YYYY-MM-DD');
      setCardPackageReceiveDateStart(cardPackageReceiveDateStart)
      cardPackageReceiveDateEnd = moment(e[1]).format('YYYY-MM-DD')
      setCardPackageReceiveDateEnd(cardPackageReceiveDateEnd)
    }
  }

  // // 禁用之前日期
  // let disabledDate = (current) => {
  //   return current && current < moment().startOf('day');
  // }
  let [shareFlag, setShareFlag] = useState(1);//1-不可赠送  2-可赠送
  let handelShareFlag = (e) => {
    setShareFlag(e.target.value)
  }

  return (
    <>
      <div className={style.block__cont}>
        <div className={style.block__header}>
          <h3>新增发放</h3>
        </div>
        <h3 style={{ padding: '30px 0 20px 30px' }}>基础信息</h3>
        <Form className={style.form__cont} form={form} onFinish={subBtnEvent}>
          <div style={{ marginLeft: '-70px' }}>
            <Form.Item label="所属项目：" name="marketProjectId" className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: '此项不能为空' }]}>
              <Form.Item name="marketProjectId" label="所属项目：" noStyle className={style.form__item} labelCol={{ span: 8 }}>
                <Select
                  placeholder="请选择所属项目"
                  style={{ width: '66%' }}
                  showSearch
                  onChange={(e) => { marketProjectIdOrName(e) }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {
                    selsctMarketingItems && selsctMarketingItems.map((v) => <Option key={v.objectId} value={v.objectId + '&' + v.marketProjectName}>{v.marketProjectName}</Option>)
                  }
                </Select>
              </Form.Item>
              <Tooltip>
                <Typography.Link href="/operate/marketingProject" style={{ marginLeft: '30px' }}>前往添加</Typography.Link>
              </Tooltip>
            </Form.Item>

            <Form.Item name="grantName" label="批次名称：" className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: '此项不能为空' }]}>
              <Input placeholder="请输入批次名称" maxLength={50} style={{ width: '66%' }} value={marketProjectNameDate}></Input>
            </Form.Item>

            <Form.Item name="cardPackageFlag" label="投放类型：" className={style.form__item} labelCol={{ span: 8 }}>
              <Select
                placeholder="不限"
                style={{ width: '66%' }}
                defaultValue={cardPackageFlag}
                value={cardPackageFlag}
                // defaultValue={isCardRadioTabs}
                // value={isCardRadioTabs}
                onChange={changeCardTabs}>
                <Option value={0}>卡券投放</Option>
                <Option value={1}>卡包投放</Option>
                <Option value={2}>兑换码投放</Option>
                <Option value={3}>N选M投放</Option>
                <Option value={4}>接口投放</Option>
              </Select>
            </Form.Item>
            {
              (cardPackageFlag == 0 || cardPackageFlag == 1 || cardPackageFlag == 3) ?
                <Form.Item label="发放目标类型："
                  className={style.form__item}
                  labelCol={{ span: 8 }}
                  rules={[{ required: true, message: '此项不能为空' }]}
                >
                  <Radio.Group defaultValue={nameList} onChange={onChangeNameList} value={nameList}>
                    <Space direction="vertical">
                      <Radio value={2} disabled={true}>自定义人群 <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>按系统预设好的指定人群发放，卡券有效期统一</span></Radio>
                      <Radio value={1}>特殊名单 <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>按模板上传名单，不同的用户可以有不同的卡券有效期</span></Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
                : ''
            }

            {/* 1自定义人群 */}
            {
              nameList == 2 && (cardPackageFlag == 0 || cardPackageFlag == 1 || cardPackageFlag == 3) ?
                <Form.Item label="发放人群：" className={style.form__item} labelCol={{ span: 8 }}>
                  <Button>选择人群</Button>
                </Form.Item>
                : ''
            }

            {
              nameList == 1 && (cardPackageFlag == 0 || cardPackageFlag == 1 || cardPackageFlag == 3) ?
                <>
                  <div style={{ marginLeft: '218px', marginBottom: '10px' }}>
                    <Radio.Group buttonStyle="solid" defaultValue={temType} onChange={onChangeTemplateType} value={temType}>
                      <Radio.Button value={1} style={{ marginRight: '20px' }}>简易模板</Radio.Button>
                      <Radio.Button value={2}>保险公司模板</Radio.Button>
                    </Radio.Group>
                  </div>
                  {
                    temType == 1 ?
                      <Card style={{ width: '600px', marginLeft: '218px' }}>
                        <div>简易模板包含了给个人用户发券的基础字段，适用于没有特殊要求的场景</div>
                        <Divider />
                        <p>客户手机号：11位数字，若发放标识为手机号时为必填项</p>
                        <p>身份证号码：18位，若发放标识为身份证号时为必填项</p>
                        <p>微信openid：若发放标识为openid时为必填项</p>
                        <p>保单号：非必填项</p>
                        <p>开始时间&结束时间：格式必须是yyyy/MM/dd，如2021/07/31；开始时间不得大于结束时间且间隔时间不得大于投放卡券列表中最小的最大有效天数；两个时间全部填写或全部不填写</p>
                        <p>车牌号：6至7位，非必填项</p>
                        <p>车架号：17位，非必填项</p>
                        <p>发放次数：针对单个用户投放卡券的次数，必须为正整数，如A用户发放次数为2，批次下某卡券单个数量为3，则该用户会收到2 * 3 = 6张卡券，必填项</p>
                        <p><span style={{ color: '#f00' }}>* </span> 单个文件至多导入10000条数据</p>
                        <p><span style={{ color: '#f00' }}>* </span> 保单号、车牌号、车架号捆绑填写，全部填写或全部不填写</p>
                        <p><span style={{ color: '#f00' }}>* </span> 保单号+开始时间+结束时间不得出现完全重复的数据</p>
                      </Card>
                      :
                      <Card style={{ width: '600px', marginLeft: '218px' }}>
                        <div>保险公司模板适用于卡券关联保险公司保单用户完整必要信息的场景</div>
                        <Divider />
                        <p>客户手机号：11位数字，若发放标识为手机号时为必填项</p>
                        <p>身份证号码：18位，若发放标识为身份证号时为必填项</p>
                        <p>微信openid：若发放标识为openid时为必填项</p>
                        <p>保单号：必填项</p>
                        <p>开始时间&结束时间：必填项，格式必须是yyyy/MM/dd，如2021/07/31；开始时间不得大于结束时间且间隔时间不得大于投放卡券列表中最小的最大有效天数</p>
                        <p>车牌号：6至7位，必填项</p>
                        <p>车架号：17位，必填项</p>
                        <p>发放次数：针对单个用户投放卡券的次数，必须为正整数，如A用户发放次数为2，批次下某卡券单个数量为3，则该用户会收到2 * 3 = 6张卡券，必填项</p>
                        <p>渠道：必填项</p>
                        <p>机构：必填项</p>
                        <p><span style={{ color: '#f00' }}>* </span> 单个文件至多导入10000条数据</p>
                        <p><span style={{ color: '#f00' }}>* </span> 保单号+开始时间+结束时间不得出现完全重复的数据</p>
                      </Card>
                  }

                  {
                    cardPackageFlag == 0 || cardPackageFlag == 1 || cardPackageFlag == 3 ?
                      <Form.Item name="identification" label="发放标识：" style={{ marginTop: '20px' }} className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: '此项不能为空' }]}>
                        <Select
                          placeholder="请选择"
                          style={{ width: '66%' }}
                          onChange={identificationChange}
                        >
                          <Option value={1}>客户手机号</Option>
                          <Option value={2}>身份证号码</Option>
                          <Option value={3}>微信openId</Option>
                          {
                            currentUser.channelId == 83 ? <Option value={4}>车架号</Option> : ''
                          }
                        </Select>
                      </Form.Item>
                      :
                      ''
                  }
                  {
                    temType == 1 ?
                      <>
                        <div style={{ display: 'flex' }}>
                          <Form.Item label="模板名单：" style={{ marginTop: '20px' }} className={style.form__item} labelCol={{ span: 8 }}>
                            {
                              identification ?
                                <Upload maxCount={1} showUploadList={false} customRequest={handleUpload} onChange={uploadChange} accept='.xls,.xlsx,.xlsm'>
                                  <Button type="dashed">上传名单</Button>
                                </Upload>
                                :
                                <Button type="dashed" onClick={handelBtn}>上传名单</Button>
                            }
                            {
                              isUseFile == '0' ?
                                <span style={{ color: '#B9B9B9', margin: '0 20px' }}>{totalPeople}人</span>
                                : ''
                            }
                          </Form.Item>
                        </div>
                        {
                          isUseFile == '0' ?
                            <div style={{ marginLeft: "230px", marginBottom: '20px', color: '#B9B9B9' }}>{fileName}</div>
                            :
                            <div style={{ marginLeft: "230px" }}></div>
                        }
                        <a style={{ lineHeight: '22px', color: '#1890ff', marginLeft: "220px", cursor: "pointer" }}
                          href={`/img/简易模板.xlsx`}
                          downLoad={"简易模板.xlsx"}
                        >
                          简易模板下载
                        </a>
                      </>
                      :
                      <>
                        <div style={{ display: 'flex' }}>
                          <Form.Item name="peo" label="发放人群：" style={{ marginTop: '20px' }} className={style.form__item} labelCol={{ span: 8 }}>
                            {
                              identification ?
                                <Upload maxCount={1} showUploadList={false} customRequest={handleUpload} onChange={uploadChange} accept='.xls,.xlsx,.xlsm'>
                                  <Button type="dashed">上传名单</Button>
                                </Upload>
                                :
                                <Button type="dashed" onClick={handelBtn}>上传名单</Button>
                            }
                            {
                              isUseFile == '0' ?
                                <span style={{ color: '#B9B9B9', margin: '0 20px' }}>{totalPeople}人</span>
                                : ''
                            }
                          </Form.Item>
                        </div>
                        {
                          fileName ?
                            <div style={{ marginLeft: "220px", marginBottom: '20px', color: '#B9B9B9' }}>{fileName}</div>
                            :
                            <div style={{ marginLeft: "230px" }}></div>
                        }
                        <a style={{ lineHeight: '22px', color: '#1890ff', marginLeft: "220px", cursor: "pointer" }}
                          href={`/img/保险公司模板.xlsx`}
                          downLoad={"保险公司模板.xlsx"}
                        >
                          保险公司模板下载
                        </a>
                      </>
                  }
                </>
                : ''
            }

            {
              cardPackageFlag == 0 ?
                // <Form.Item name="effectiveDate" label="卡券领取有效期：" className={style.form__item} style={{ marginTop: '20px' }} labelCol={{ span: 8 }} rules={[{ required: true, message: '此项不能为空' }]}>
                //   <RangePicker
                //     placeholder={['开始时间', '结束时间']}
                //     disabledDate={disabledDate}
                //   />
                // </Form.Item>
                null :
                cardPackageFlag == 1 ?
                  <>
                    <Form.Item name="cardReceiveType" label="领取方式：" className={style.form__item} style={{ marginTop: '20px' }} labelCol={{ span: 8 }}>
                      <Radio.Group defaultValue={receiveType} onChange={onChangeReceiveWay} value={receiveType}>
                        <Radio value={1}>全部发放</Radio>
                        <Radio value={2}>用户自领</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item label="是否支持转赠：" className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: '此项不能为空' }]}>
                      <Radio.Group defaultValue={shareFlag} value={shareFlag} onChange={handelShareFlag}>
                        <Radio value={2}>是</Radio>
                        <Radio value={1}>否</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {/* <Form.Item name="effectiveDate" label="卡包领取有效期：" className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: '此项不能为空' }]}>
                      <RangePicker placeholder={['开始时间', '结束时间']} disabledDate={disabledDate} />
                    </Form.Item> */}
                  </> :
                  cardPackageFlag == 2 ?
                    <>
                      <Form.Item name="verifyNum" label="兑换码数量：" className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: '此项不能为空' }]}>
                        <InputNumber placeholder="请输入兑换码数量" min={1} formatter={limitNumber} parser={limitNumber} style={{ width: '66%' }}></InputNumber>
                      </Form.Item>
                      <Form.Item name="effectiveDate" label="卡券兑换有效期：" className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: '此项不能为空' }]}>
                        <RangePicker
                          placeholder={['开始时间', '结束时间']}
                          disabledDate={disabledDate}
                        />
                      </Form.Item>
                    </> :
                    cardPackageFlag == 3 ?
                      <>
                        <Form.Item name="cardReceiveType" label="领取方式：" className={style.form__item} style={{ marginTop: '20px' }} labelCol={{ span: 8 }}>
                          <Radio.Group defaultValue={4} value={4}>
                            <Radio value={4}>用户自选</Radio>
                          </Radio.Group>
                        </Form.Item>
                        <Form.Item name="verifyNum" label="最多领取卡券数：" className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: '此项不能为空' }]}>
                          <InputNumber placeholder="填写用户可领取数量" min={1}
                            // max={allObj.allCont * totalNum}
                            onChange={handelNum}
                            formatter={limitNumber} parser={limitNumber} style={{ width: '66%' }}></InputNumber>
                        </Form.Item>
                        {/* <Form.Item name="effectiveDate" label="卡券领取有效期：" className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: '此项不能为空' }]}>
                          <RangePicker
                            placeholder={['开始时间', '结束时间']}
                            disabledDate={disabledDate}
                          />
                        </Form.Item> */}
                      </>
                      : ''
            }
          </div>

          {/* 2 */}
          <div className={style.block__cont__t}>
            <Divider style={{ margin: '24px 0 0' }} />
            {/* <Row justify="space-around" align="center" style={{ marginTop: '30px' }}>
              <Radio.Group defaultValue={cardPackageFlag} value={cardPackageFlag} buttonStyle="solid" onChange={changeCardTabs}>
                <Radio.Button style={{ width: '200px', height: '36px', textAlign: 'center' }} value={0}>卡券投放</Radio.Button>
                <Radio.Button style={{ width: '200px', height: '36px', textAlign: 'center' }} value={1}>卡包投放</Radio.Button>
              </Radio.Group>
            </Row> */}
            {
              cardPackageFlag == 0 || cardPackageFlag == 3 ? <Coupon /> :
                cardPackageFlag == 1 ? <Cardbag /> :
                  cardPackageFlag == 2 ? <ExchangeCode /> :
                    cardPackageFlag == 4 ? <InterfaceLaunch /> : ''
            }


            {
              cardPackageFlag==1 ?
              <>
                <Form.Item name="effectiveDate" label="卡包领取有效期：" className={`${style.form__item} ${style.form_margin}`} labelCol={{ span: 8 }} rules={[{ required: true, message: '此项不能为空' }]}>
                  <RangePicker placeholder={['开始时间', '结束时间']} disabledDate={disabledDate} />
                </Form.Item> 
                <p style={{ marginLeft: '160px', marginTop: '-10px', color: '#f00' }}>
                  {compData.packageAddResult.receiveValidDays==null ? `卡包领取有效期期不超过730天` : `卡包领取有效期期不超过${compData.packageAddResult.receiveValidDays}天`}
                </p>
              </>
              : null
            }
            {/* 展示不用 */}
            {/* <Form.Item label="发放时间："
              className={style.collectionMethod}
              rules={[{ required: true, message: '此项不能为空' }]}>
              <Radio.Group defaultValue={1}>
                <Radio value={1}>立即发放</Radio>
                <Radio value={2}>定时发放</Radio>
              </Radio.Group>
            </Form.Item> */}

            {/* 隐藏 */}
            {/* <div style={{ lineHeight: '40px', marginTop: '20px' }}>
              卡券单份预算总和{allMoney}元，人数{totalPeople}人，共占用{fmoney(allMoney * totalNum)}元，
              {
                moneyQuato ?
                  <span>剩余额度{fmoney((moneyQuato.allQuoat - moneyQuato.useQuoat - moneyQuato.occupyQuoat) - allMoney * totalNum)}元</span>
                  : ''
              }
            </div> */}
          </div>
          {/* style={{ position: 'absolute', right: 40, bottom: 150 }} */}
          <Row justify="end" align="center" style={{ padding: '30px' }}>
            <Space size={22}>
              <Button onClick={() => { history.goBack(); }}>取消</Button>
              <Button htmlType='submit' type="primary">保存</Button>
            </Space>
          </Row>
        </Form>
      </div>

      {/* 文件框 */}
      <Modal visible={isFileVisible} closeIcon footer={null} >
        <p style={{ textAlign: 'center', color: '#000' }}>
          <img src={failIcon} style={{ width: '24px', height: '24px', marginBottom: '6px', marginRight: '10px' }} />
          <span style={{ fontSize: '16px' }}>上传失败！</span>
        </p>
        <p>您上传的文件有异常，下载错误文件查看错误原因后修改原文件重新上传!</p>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button onClick={() => { setIsFileVisible(false) }} style={{ width: '116px', marginRight: '8px' }}>取 消</Button>
          <Button type="primary" onClick={onLoadFile} style={{ marginLeft: '8px' }}>错误名单下载</Button>
        </div>
      </Modal >

      {/* 二次保存框 */}
      <Modal visible={isSaveVisible} style={{ textAlign: 'center' }} okText='提交' onOk={handleSaveOk} onCancel={() => { setIsSaveVisible(false) }}>
        {
          cardPackageFlag == 0 ?
            <div>
              <h3 style={{ fontSize: '16px' }}>请确认提交本次卡券投放</h3>
              <p style={{ marginTop: '40px' }}>本次卡券投放人数 {totalPeople} 人，共 {allObj.allCont * totalNum} 张卡券</p>
            </div> :
            cardPackageFlag == 1 ?
              <div>
                <h3 style={{ fontSize: '16px' }}>请确认提交本次卡包投放</h3>
                <p style={{ marginTop: '40px' }}>本次卡券投放人数 {totalPeople} 人，共 {totalNum} 个卡包</p>
              </div> :
              cardPackageFlag == 2 ?
                <div>
                  <h3 style={{ fontSize: '16px' }}>请确认提交本次卡券兑换码投放</h3>
                  <p style={{ marginTop: '40px' }}>兑换码数量共 {verifyNum} 张，共 {allObj.allCont * verifyNum} 张卡券</p>
                </div> :
                cardPackageFlag == 3 ?
                  <div>
                    <h3 style={{ fontSize: '16px' }}>请确认提交本次N选M投放</h3>
                    <p style={{ marginTop: '40px' }}>本次卡券投放人数 {totalPeople} 人，共 {allObj.allCont * totalPeople} 张卡券</p>
                  </div> :
                  cardPackageFlag == 4 ?
                    <div>
                      <h3 style={{ fontSize: '16px' }}>请确认提交本次接口投放</h3>
                      {/* <p style={{ marginTop: '40px' }}>本次卡券投放人数 {totalPeople} 人，共 {allObj.allCont * totalNum} 张卡券</p> */}
                    </div> : ''
        }
        <span style={{ fontSize: '12px', color: '#f00' }}>提交保存不会立即生效，请至投放列表点击“生效”按钮进行投放</span>
      </Modal>
      {/* 隐藏 */}
      {/* ，预算 {fmoney(allMoney * totalNum)} 元， 使用后剩余额度 {fmoney((moneyQuato.allQuoat - moneyQuato.useQuoat - moneyQuato.occupyQuoat) - allMoney * totalNum)} 元。 */}
    </>
  )
};
export default connect(({ cardgrantManageModel }) => ({
  isCardRadioTabs: cardgrantManageModel.isCardRadioTabs,//tabs切换
  moneyQuato: cardgrantManageModel.moneyQuato,
  selsctMarketingItems: cardgrantManageModel.selsctMarketingItems,
  compData: cardgrantManageModel.compData,
  allObj: cardgrantManageModel.allObj,
}))(addEditCard)
