import React, { useState, useEffect, useRef, useContext } from 'react';
import { connect, history } from 'umi';
import {
  Row, Col, Form, Space, Radio, Input, Table, Select, Divider, Button, DatePicker,
  Pagination, Modal, message, Descriptions, InputNumber, Tooltip
} from "antd"
const { Column } = Table;
import { QuestionCircleOutlined } from '@ant-design/icons';
import style from "./style.less";
import AddCardbagModal from '../modal/addCardbagModal';
const { RangePicker } = DatePicker;
import moment from 'moment';
import { useThresholdRender } from '@/pages/cardgrantManage/grantList/common.js'

let compData = {};
let cardDetailObjSave = {};

// 添加卡包弹框
const cardbag = (props) => {
  let { dispatch, cardbagDetailList, marketProjectId, marketProjectName, grantName, identification, editInfo, cardPackageEditResults, packageAddResult,
    cardReceiveType, shareFlag, effectiveStartDate, effectiveEndDate } = props;
  let [form] = Form.useForm();
  // 登录成功返回的数据
  const currentUser = localStorage.getItem('tokenObj') ? JSON.parse(localStorage.getItem('tokenObj')) : {};
  // 卡包
  let [isCardbagModalVisible, setIsCardbagModalVisible] = useState(false);//添加卡包弹框
  let [checkCardBagObj, setCheckCardBagObj] = useState({});//选中的卡包对象
  let [cardVOList, setCardVOList] = useState([]);//选中的卡包列表
  let [isCardValidityVisible, setIsCardValidityVisible] = useState(false);//设置卡包有效期弹框
  // 点击去设置
  let [cardDetailObj, setCardDetailObj] = useState({}); //卡包详情选中的对象
  let [cardDetailsInfo, setCardDetailsInfo] = useState({}); // 卡包详情选中得对象
  console.log(checkCardBagObj, cardbagDetailList, 'cardbagDetailList29')
  console.log(cardPackageEditResults, 'cardPackageEditResults30')


  // =====编辑进入时=======
  let [newCardPackageEditResults, setNewCardPackageEditResults] = useState(cardPackageEditResults);//编辑页传入的卡包列表数据
  let [newPackageAddResult, setNewPackageAddResult] = useState(packageAddResult);//编辑页传入的卡包对象数据

  useEffect(() => {
    if (cardPackageEditResults && cardPackageEditResults.length) {
      let _cardPackageEditResults = JSON.parse(JSON.stringify(cardPackageEditResults))//编辑数据列表1
      setNewCardPackageEditResults(_cardPackageEditResults);
      compData.detailList = isCheck ? newCardbagDetailList : _cardPackageEditResults;


      let _packageAddResult = JSON.parse(JSON.stringify(packageAddResult))//数据对象2
      if (_packageAddResult && Object.keys(_packageAddResult).length > 0) {
        setNewPackageAddResult(_packageAddResult)
        compData.packageAddResult = _packageAddResult;
      }
      sendData(compData);
    }
  }, [cardPackageEditResults, packageAddResult])

  // ======编辑进入时=======


  // 1选中的卡包数组
  const subCardbagList = (cardobj) => {
    console.log(cardobj, '出发了')
    let _cardobj = JSON.parse(JSON.stringify(cardobj));
    setCheckCardBagObj(_cardobj);

    let _list = JSON.parse(JSON.stringify(cardVOList));
    _list.push(cardobj)//[{},{},{11}]

    // 当前卡包的[{}]
    let cList = _list.splice(_list.length - 1);
    setCardVOList(cList)
  }
  let [isCheck, setIsCheck] = useState(false);//是否选择了
  // 卡包详情列表接口
  useEffect(() => {
    if (Object.keys(checkCardBagObj).length) {//为0时是{}
      setIsCheck(true);
      detailCardByPackageNo();
      handleBagDetailListData()//第一次获取list
    }
  }, [checkCardBagObj])

  // 卡包详情
  let detailCardByPackageNo = () => {
    dispatch({
      type: 'cardgrantManageModel/detailCardByPackageNo',
      payload: {
        method: 'get',
        params: {},
        packageNo: checkCardBagObj.couponPackageNo,//卡包编号
        quotationItemId: checkCardBagObj.quotationItemId
      }
    })
  }

  useEffect(() => {
    //处理数据，发生父组件
    if (isCheck) {
      handleBagDetailListData();
    } else {
      editdata();
    }
  }, [cardbagDetailList, cardPackageEditResults])

  useEffect(() => {
    //统一保存onchange的结果，点击保存再一起修改数据
    cardDetailObjSave = JSON.parse(JSON.stringify(cardDetailObj));
  }, [cardDetailObj]);


  //保存有效天数
  const saveDetail = () => {
    if (isCheck) {//新增
      let _cardbagDetailList = JSON.parse(JSON.stringify(cardbagDetailList))
      let bagArr = _cardbagDetailList.map(item => item.id == cardDetailObjSave.id ? cardDetailObjSave : item);
      dispatch({
        type: 'cardgrantManageModel/setDetailCardByPackageNo',
        payload: bagArr,
      })
    } else {//默认编辑内容时
      let _cardPackageEditResults = JSON.parse(JSON.stringify(cardPackageEditResults));
      let _packageAddResult = JSON.parse(JSON.stringify(packageAddResult))//数据
      // setNewCardPackageEditResults(_cardPackageEditResults);
      // setNewPackageAddResult(_packageAddResult);

      let bagArr = _cardPackageEditResults.map(item => item.id == cardDetailObjSave.id ? cardDetailObjSave : item);
      // console.log(_cardPackageEditResults, '_cardPackageEditResults44444444')
      // console.log(bagArr, 'bagArr444444')
      console.log(editInfo, 'editInfoeditInfo')

      dispatch({
        type: 'cardgrantManageModel/setStartInfo',
        payload: {
          ...editInfo,
          marketProjectId: marketProjectId ? marketProjectId : editInfo.marketProjectId,//所属项目id
          marketProjectName: marketProjectName ? marketProjectName : editInfo.marketProjectName,//所属项目name，用于反显及传参
          grantName: grantName ? grantName : editInfo.grantName,//批次名称
          identification: identification ? identification : editInfo.identification,//发放标识
          grantBatchId: editInfo ? editInfo.grantBatchId : null,
          cardPackageEditResults: bagArr,
          detailList: bagArr,
          packageAddResult: _packageAddResult,

          cardReceiveType: cardReceiveType ? cardReceiveType : editInfo.cardReceiveType,
          shareFlag: shareFlag ? shareFlag : editInfo.shareFlag,
          effectiveStartDate: effectiveStartDate ? effectiveStartDate : editInfo.effectiveStartDate,
          effectiveEndDate: effectiveEndDate ? effectiveEndDate : editInfo.effectiveEndDate,
        }
      })
      // setNewCardPackageEditResults(bagArr)//渲染

    }

  }

  let editdata = () => {
    if ((cardPackageEditResults && cardPackageEditResults.length) && (packageAddResult && Object.keys(packageAddResult).length > 0)) {

      let _cardPackageEditResults = JSON.parse(JSON.stringify(cardPackageEditResults))//编辑数据列表
      let _packageAddResult = JSON.parse(JSON.stringify(packageAddResult))//数据对象
      console.log(_cardPackageEditResults, '_cardPackageEditResults')
      console.log(_packageAddResult, '_packageAddResult')
      let newData = {
        ..._packageAddResult
      }

      compData.detailList = _cardPackageEditResults;
      compData.packageAddResult = newData;//选择的卡包信息（卡包投放时传）
      sendData(compData);
    }
  }
  // 处理卡包详情数据
  let handleBagDetailListData = () => {
    // 卡包详情的[{},{}]

    if (cardbagDetailList && cardbagDetailList.length) {
      // console.log(cardbagDetailList, 'cardbagDetailList')
      let bagArr = JSON.parse(JSON.stringify(cardbagDetailList));
      let newCardbagDetailList = bagArr.map((item, index) => {
        console.log(item, 178)
        return {
          skuCardNo: item.couponSkuNo,
          skuCardName: item.couponSkuName,
          skuCardCategory: item.couponCategoryType,
          skuCardCategoryName: item.couponCategoryName,
          faceValue: item.faceValue,
          serviceType: item.serviceType,//"业务类型(1：自发，2：代发)")
          singleNum: 1,//1
          isGive: 1,//1
          maxiMumValidDays: item.maxEffectiveDays,//最大有效期天数
          effectDateType: item.effectDateType ? item.effectDateType : 0,//有效期类型（0：领取后生效，1：固定日期  2:按保单日期）
          receiveEffectDays: item.receiveEffectDays || 0,//"领取后多少天数生效 0为立即生效")
          effectiveDays: item.effectiveDays || item.useValidDays,//有效天数
          effectStartDate: item.effectStartDate == 'null' ? JSON.parse(item.effectStartDate) : item.effectStartDate,
          effectEndDate: item.effectEndDate == 'null' ? JSON.parse(item.effectEndDate) : item.effectEndDate,
          useValidDays: item.useValidDays, // 使用有效天数
          useValidType: item.useValidType, // 投放类型
        }
      })
      compData.detailList = newCardbagDetailList;
    }

    let _checkCardBagObj = JSON.parse(JSON.stringify(checkCardBagObj));

    //选择的卡包信息（卡包投放时传）
    let newPackageAddResult = {
      channelId: currentUser.channelId,
      couponPackageNo: _checkCardBagObj.couponPackageNo,//卡包编号
      couponPackageName: _checkCardBagObj.couponPackageName,//卡包名称
      totalCouponNum: _checkCardBagObj.totalCouponNum,//数量
      faceValue: _checkCardBagObj.faceValue,//面值
      quotationItemId : _checkCardBagObj.quotationItemId,	// 报价单明细id
      quotationNo : _checkCardBagObj.quotationNo, 	// 关联报价单编号
      receiveValidDays: _checkCardBagObj.receiveValidDays, // 领取有效天数
    }
    compData.packageAddResult = newPackageAddResult;//选择的卡包信息（卡包投放时传）
    // console.log(compData, 'compData111')
    sendData(compData);
  }

  //发送数据给父组件
  let sendData = (data) => {
    dispatch({
      type: 'cardgrantManageModel/setCompData',
      payload: data
    })
  }

  // 添加卡包
  let addCardbag = () => {
    setIsCardbagModalVisible(true)
    dispatch({
      type: 'cardgrantManageModel/setCompData',//清除上一次卡券列表数据
      payload: {
        detailList: [],
        packageAddResult: {}
      }
    })
    // 清空上次卡包明细记录
    dispatch({
      type: 'cardgrantManageModel/setDetailCardByCouponNum',
      payload: []
    })
  }

  // 禁用之前日期
  let disabledDate = (current) => {
    return current && current < moment().startOf('day');
  }

  //  ======================
  // 点击去设置
  const setValidityPeriod = (all, index) => {
    setCardDetailsInfo(all)
    setCardDetailObj(all);
    if(all.useValidDays!= null) {
      if(all.effectiveDays) {
        form.setFieldsValue({ useValidDays: all.effectiveDays })
      }else {
        form.setFieldsValue({ useValidDays: all.useValidDays })
      }
    }else {
      form.setFieldsValue({ useValidDays: all.defaultEffectiveDays })
    }
    setIsCardValidityVisible(true);
  }

  // 1卡包选择设置有效期
  //有效开始日期类型（0：领取后生效，1：固定日期  2:按保单日期）
  let onChangeEffectDateType = (e) => {
    let _cardDetailObj = JSON.parse(JSON.stringify(cardDetailObj))
    _cardDetailObj.effectDateType = e.target.value;
    setCardDetailObj(_cardDetailObj);

    if (e.target.value == 0 ) {
      _cardDetailObj.effectStartDate = null;
      _cardDetailObj.effectEndDate = null;
      setCardDetailObj(_cardDetailObj)
    }else {
      form.setFieldsValue({
        effectDate: []
      })
    }
  }

  // 2生效时间
  let iptNumDate = (e) => {
    let _cardDetailObj = JSON.parse(JSON.stringify(cardDetailObj));
    _cardDetailObj.receiveEffectDays = e;
    setCardDetailObj(_cardDetailObj);

  }

  // 3有效天数
  let iptEffectiveDays = (e) => {
    let _cardDetailObj = JSON.parse(JSON.stringify(cardDetailObj));
    if(cardDetailsInfo.useValidDays) {
      if(Number(e) > cardDetailsInfo.useValidDays) return message.error(`有效天数不能超过${cardDetailsInfo.useValidDays}天!`)
    }else {
      if(Number(e) > cardDetailsInfo.maxEffectiveDays) return message.error(`有效天数不能超过${cardDetailsInfo.maxEffectiveDays}天!`)
    }
    _cardDetailObj.defaultEffectiveDays = e;
    _cardDetailObj.effectiveDays = e;
    // _cardDetailObj.useValidDays = e;
    setCardDetailObj(_cardDetailObj);

  }

  // 4固定时间时-->时间选择框改变时间
  let changeTime = (e) => {
    let _cardDetailObj = JSON.parse(JSON.stringify(cardDetailObj))
    if(cardDetailsInfo.useValidDays) {
      if(((moment(e[1]).valueOf() - moment(e[0]).valueOf()) / (1000*3600*24)) > cardDetailsInfo.useValidDays) {
        return message.warning({ content: `使用有效期不能超过${cardDetailsInfo.useValidDays}天！` })
      }
    }else {
      if(((moment(e[1]).valueOf() - moment(e[0]).valueOf()) / (1000*3600*24)) > cardDetailsInfo.maxEffectiveDays) {
        return message.warning({ content: `使用有效期不能超过${cardDetailsInfo.maxEffectiveDays}天！` })
      }
    }
    if (e) {
      _cardDetailObj.effectStartDate = moment(e[0]).format('YYYY-MM-DD');
      _cardDetailObj.effectEndDate = moment(e[1]).format('YYYY-MM-DD');
      setCardDetailObj(_cardDetailObj)
    }
  }

  // 保存设置时间
  let handleCardValidityOk = () => {
    let _cardDetailObj = JSON.parse(JSON.stringify(cardDetailObj));
    console.log(_cardDetailObj, '_cardDetailObj310')
    if (_cardDetailObj.effectDateType == 0) {
      if (_cardDetailObj.receiveEffectDays == null) {
        setIsCardValidityVisible(true)
        message.warning('请输入生效时间！')
      } else if (_cardDetailObj.defaultEffectiveDays == null) {
        setIsCardValidityVisible(true)
        message.warning('请输入有效天数！')
      } else {
        setIsCardValidityVisible(false)
      }
    } else if (_cardDetailObj.effectDateType == 1) {
      if (_cardDetailObj.effectStartDate== 'null' || !_cardDetailObj.effectEndDate == 'null') {
        setIsCardValidityVisible(true)
        message.warning('请选择生效时间！')
        return false
      } else {
        setIsCardValidityVisible(false)
      }
    } else {
      setIsCardValidityVisible(false)
    }
    saveDetail();
  }


  let receiveRender = (text, all, index) => {
    return <Space size="middle">
      {
        Object.keys(checkCardBagObj).length ? // 新增卡包
          all.useValidDays ?
            all.useValidType == 1 ?
              <span>{all.effectiveDays ? all.effectiveDays: all.useValidDays}天(发放后立即生效)</span>
            :
            all.useValidType == 2 ?
              <span>{all.effectiveDays ? all.effectiveDays: all.useValidDays}天（领取后立即生效）</span>
            :
            all.effectDateType == 1 ?
              <span>{moment(all.effectStartDate).format('YYYY.MM.DD')}~{moment(all.effectEndDate).format('YYYY.MM.DD')}</span>
            : 
              all.effectiveDays ? 
                <span>{all.effectiveDays ? all.effectiveDays: all.defaultEffectiveDays}天</span>
              :
                <span>{all.useValidDays}天</span>
          :
          <span>{`${all.defaultEffectiveDays}天`}</span>
        :  
          all.effectStartDate && all.effectEndDate ? 
            <span>{moment(all.effectStartDate).format('YYYY.MM.DD')}~{moment(all.effectEndDate).format('YYYY.MM.DD')}</span>
          :
          all.useValidType == 1 ?
            <span>{all.effectiveDays ? all.effectiveDays: all.useValidDays}天(发放后立即生效)</span>
          :
          all.useValidType == 2 ?
            <span>{all.effectiveDays ? all.effectiveDays: all.useValidDays}天（领取后立即生效）</span>
          :
            <span>{all.effectiveDays ? all.effectiveDays: all.defaultEffectiveDays}天</span>
      }
      <a onClick={() => { setValidityPeriod(all, index) }}>去设置</a>
    </Space>
  }


  return (
    <>
      <div className={style.listTitle}>
        <h3 style={{ margin: '30px' }}>发放内容</h3>
        <div className={style.btns}>
          <Button style={{ margin: '10px' }} htmlType="button" type="primary" onClick={addCardbag}>添加卡包</Button>
        </div>
      </div>

      <h3 style={{ marginLeft: '30px', color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold', fontSize: '16px' }}>当前卡包</h3>

      {
        Object.keys(checkCardBagObj).length ?
          <Descriptions column={4} labelStyle={{ marginLeft: '50px', marginBottom: '50px' }}>
            <Descriptions.Item label="卡包ID">{checkCardBagObj.couponPackageNo}</Descriptions.Item>
            <Descriptions.Item label="卡包名称">{checkCardBagObj.couponPackageName}</Descriptions.Item>
            <Descriptions.Item label="卡券数量">{checkCardBagObj.totalCouponNum}</Descriptions.Item>
            <Descriptions.Item label="卡包面值">{checkCardBagObj.faceValue}</Descriptions.Item>
          </Descriptions>
          :
          <Descriptions column={4} labelStyle={{ marginLeft: '50px', marginBottom: '50px' }}>
            <Descriptions.Item label="卡包ID">{packageAddResult && packageAddResult.couponPackageNo}</Descriptions.Item>
            <Descriptions.Item label="卡包名称">{packageAddResult && packageAddResult.couponPackageName}</Descriptions.Item>
            <Descriptions.Item label="卡券数量">{packageAddResult && packageAddResult.totalCouponNum}</Descriptions.Item>
            <Descriptions.Item label="卡包面值">{packageAddResult && packageAddResult.faceValue}</Descriptions.Item>
          </Descriptions>
      }

      <h3 style={{ marginLeft: '30px', color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold', fontSize: '16px' }}>卡包详情</h3>
      <Table style={{ marginLeft: '50px' }}
        dataSource={Object.keys(checkCardBagObj).length ? cardbagDetailList : newCardPackageEditResults}//编辑进入时
        pagination={false}>
        <Column title="卡券ID" dataIndex="couponSkuNo" key="couponSkuNo" />
        <Column title="卡券名称" dataIndex="couponSkuName" key="couponSkuName" />
        <Column title="卡券品类" dataIndex="couponCategoryName" key="couponCategoryName" />
        <Column title="卡包面值" dataIndex="faceValue" key="faceValue" />
        <Column title="使用门槛" dataIndex="isUseThreshold" key="isUseThreshold"  render={(isUseThreshold, record) => useThresholdRender(isUseThreshold, record)} />
        <Column title={ <div>使用有效期&nbsp;
          <Tooltip placement='top' title='若发放名单中包含开始日期、结束日期，则以保单时间为准，但仍需针对有效天数做校验，到期时间不超过最大天数，若超出则按最大天数计算'><QuestionCircleOutlined /></Tooltip>
        </div>} 
        dataIndex="receiveEffectDays" key="receiveEffectDays"
        render={(text, record) => receiveRender(text, record)} />
      </Table>

      {/* <Form form={form1}>
        <Form.Item label="领取方式："
          className={style.collectionMethod}
          name="receiveType"
          rules={[{ required: true, message: '此项不能为空' }]}
        >
          <Radio.Group defaultValue={receiveType} onChange={onChangeReceiveWay} value={receiveType}>
            <Radio value={1}>全部发放</Radio>
            <Radio value={2}>用户自领</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="是否支持转赠："
          className={style.collectionMethod}
          rules={[{ required: true, message: '此项不能为空' }]}>
          <Radio.Group defaultValue={2} value={2}>
            <Radio value={1} disabled>是</Radio>
            <Radio value={2}>否</Radio>
          </Radio.Group>
        </Form.Item>

        <Row>
          <Form.Item className={style.collectionMethod} label="卡包领取有效期：" name="effectDateOut" rules={[{ required: true, message: '此项不能为空' }]} labelCol={{ span: 8 }}>
            <RangePicker
              placeholder={['开始时间', '结束时间']}
              allowClear={false}
              onChange={changeCardTime}
              disabledDate={disabledDate}
            />
          </Form.Item>
        </Row>
      </Form> */}

      {/* 添加卡包列表 */}
      {
        isCardbagModalVisible ?
          <AddCardbagModal isCardbagModalVisible={isCardbagModalVisible}
            closeCardbagModal={() => { setIsCardbagModalVisible(false) }} subCardbagList={subCardbagList} />
          : ''
      }

      {/* 设置卡包有效期弹框 */}
      {
        isCardValidityVisible ?
          <Modal width={800} title='卡券个性化设置' visible={isCardValidityVisible} okText="保存" onOk={handleCardValidityOk} onCancel={() => { setIsCardValidityVisible(false) }}>
            <Form className={style.form__cont} form={form}>
              <Row>
                {
                  cardDetailObj.useValidType == 1 || cardDetailObj.useValidType == 2 ? 
                  <Form.Item label={ <div className={style.my_lable}>使用有效期
                          <Tooltip placement="top" title="若发放名单中包含开始日期、结束日期，则以保单时间为准，但仍需针对有效天数做校验，到期时间不超过最大天数，若超出则按最大天数计算">
                            <QuestionCircleOutlined style={{marginLeft: '4px'}}/>
                          </Tooltip> </div>} className={style.form__item}>
                    <Radio.Group onChange={onChangeEffectDateType} defaultValue={cardDetailObj.effectDateType} value={cardDetailObj.effectDateType}>
                      <Radio value={0}>默认</Radio>
                    </Radio.Group>
                  </Form.Item>
                : 
                  <Form.Item label={ <div className={style.my_lable}>使用有效期
                          <Tooltip placement="top" title="若发放名单中包含开始日期、结束日期，则以保单时间为准，但仍需针对有效天数做校验，到期时间不超过最大天数，若超出则按最大天数计算">
                            <QuestionCircleOutlined style={{marginLeft: '4px'}}/>
                          </Tooltip> </div>} className={style.form__item}>
                    <Radio.Group onChange={onChangeEffectDateType} defaultValue={cardDetailObj.effectDateType} value={cardDetailObj.effectDateType}>
                      <Radio value={0}>默认</Radio>
                      <Radio value={1}>固定时间</Radio>
                    </Radio.Group>
                  </Form.Item>
                }
              </Row>
              {
                cardDetailObj.useValidType == 1 || cardDetailObj.useValidType == 2 ? 
                <>
                  <Row style={{paddingLeft: '100px'}}>
                    <Col flex="0 0 180px">
                      <Form.Item label="有效天数：" name="useValidDays" labelCol={{flex:'none'}} colon={false} >
                        <InputNumber min={1} precision={0} onChange={iptEffectiveDays} />
                      </Form.Item>
                    </Col>
                    <Col flex="none" className={style.form_word}>天</Col>
                  </Row> 
                  <p style={{ marginLeft: '100px',  marginTop: '-10px', color: '#f00' }}>{cardDetailsInfo.useValidType==1 ? '生效日期从发放日开始计算' : '生效日期从领取日开始计算'}</p>
                </>
                :
                  cardDetailObj.effectDateType == 0 ?
                  <>
                    <Row style={{paddingLeft: '100px'}}>
                      <Col flex="0 0 120px">
                        <Form.Item label="第" labelCol={{flex:'none'}} colon={false} >
                          <InputNumber min={0} precision={0} value={cardDetailObj.receiveEffectDays ? cardDetailObj.receiveEffectDays : 0} onChange={iptNumDate} /> 
                        </Form.Item>
                      </Col>
                      <Col flex="none" className={style.form_word}>天开始生效，</Col>
                      <Col flex="0 0 180px">
                        <Form.Item label="有效天数：" name="useValidDays"  labelCol={{flex:'none'}} colon={false} >
                          <InputNumber min={1} precision={0} onChange={iptEffectiveDays} />
                        </Form.Item>
                      </Col>
                      <Col flex="none" className={style.form_word}>天</Col>
                    </Row> 
                    <p style={{ marginLeft: '100px', marginTop: '-10px', color: '#f00' }}>第0天表示立即生效，使用有效天数上限不超过{cardDetailsInfo.useValidDays!=null ? cardDetailsInfo.useValidDays : cardDetailsInfo.maxEffectiveDays}天</p>
                  </>
                  : 
                  <>
                    <Row style={{paddingLeft: '100px'}}>
                      <Col span={10}>
                        <Form.Item name="effectDate"  labelCol={{flex:'0 0 120px'}}>
                          <RangePicker style={{width: '100%'}} onChange={changeTime} disabledDate={disabledDate} placeholder={['开始时间', '结束时间']}/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <p style={{ marginLeft: '100px', marginTop: '-10px', color: '#f00' }}>使用有效期上限不超过{cardDetailsInfo.useValidDays!=null ? cardDetailsInfo.useValidDays : cardDetailsInfo.maxEffectiveDays}天</p>
                  </>
              }
            </Form>
          </Modal> : null
      }
    </>
  )
}


export default connect(({ cardgrantManageModel }) => ({
  cardbagDetailList: cardgrantManageModel.cardbagDetailList,
}))(cardbag)