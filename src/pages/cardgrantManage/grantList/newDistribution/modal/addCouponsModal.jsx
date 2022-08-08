import React, { useState, useEffect, useRef, useContext } from 'react';
import { connect, history } from 'umi';
import {
  Row, Col, Form, Space, Radio, Input, Table, Select, Divider, Button, DatePicker,
  Pagination, Modal, message, InputNumber, Tooltip, 
} from "antd"
import moment from 'moment'
import { UploadOutlined, MinusCircleOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import style from './modalStyle.less';
import { useThresholdRender } from '@/pages/cardgrantManage/grantList/common.js'

const { Column } = Table;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option, OptGroup } = Select;

// 添加卡券弹框
const addCouponsModal = (props) => {
  let { dispatch, isModalVisible, editCardPackageFlag, closeModal, skuList, couponList, couponTotal, subList, isCardRadioTabs, categoryList } = props;
  console.log(isCardRadioTabs, 'isCardRadioTabs1122')
  console.log(editCardPackageFlag, 'edit.CardPackageFlag')
  let [form] = Form.useForm();
  let [list, setList] = useState([]);//复制的卡券列表
  let [radioObj, setRadioObj] = useState({})//选中的卡券对象
  let [isGive, setIsGive] = useState(1);//转赠

  let [payload, setPayload] = useState({
    pageNum: 1,
    pageSize: 10,
    couponCategoryType: "",//品类
    couponSkuName: "",//基础卡券名称
    couponSkuNo: "",//	基础卡券编号
    productNo: "",//SKU编号
    couponCategoryType: null,//品类ID
    grantCardPackageFlag: editCardPackageFlag == undefined ? isCardRadioTabs : editCardPackageFlag//投放类型
  })

  useEffect(() => {
    channelSku()
    selectcategory()
  }, [])

  useEffect(() => {
    channelCoupon()
  }, [payload])

  //SKU下拉
  let channelSku = () => {
    dispatch({
      type: 'cardgrantManageModel/channelSku',
      payload: {
        method: 'postJSON',
        params: {}
      }
    })
  }
  //品类下拉
  let selectcategory = () => {
    dispatch({
      type: 'cardgrantManageModel/categorySelect',
      payload: {
        method: 'postJSON',
        params: {
          pageNum: 1,
          pageSize: 99999999
        }
      }
    })
  }

  //基础卡券列表
  let channelCoupon = () => {
    dispatch({
      type: 'cardgrantManageModel/channelCoupon',
      payload: {
        method: 'postJSON',
        params: payload
      }
    })
  }

  let [effectDateType, setEffectDateType] = useState(0); // 有效期,0：领取后生效,1：固定日期
  // 选择有效期
  let onChangeEffectDateType = (e) => {
    let _radioObj = JSON.parse(JSON.stringify(radioObj));
    _radioObj.effectDateType = e.target.value;//有效开始日期类型（0：领取后生效，1：固定日期）
    setRadioObj(_radioObj);
    setEffectDateType(e.target.value);

    if (e.target.value == 0) {
      _radioObj.effectStartDate = '';
      _radioObj.effectEndDate = '';
      setRadioObj(_radioObj)
    }else {
      form.setFieldsValue({
        receiveValidDays: [moment(), moment().add((Number(cardRadioInfo.defaultEffectiveDays) -1), 'days')]
      })
    }

  }
  // 是否转赠
  let onChangeGive = (e) => {
    let _radioObj = JSON.parse(JSON.stringify(radioObj));
    setIsGive(e.target.value)
    _radioObj.isGive = e.target.value;//是否转赠 1 否 2是(可改)
    setRadioObj(_radioObj);
  }
  // 输入框改变生效时间
  let iptNumDate = (e) => {
    let _radioObj = JSON.parse(JSON.stringify(radioObj));
    setReceiveEffectDays(e)
    _radioObj.receiveEffectDays = Number(e)//生效时间
    setRadioObj(_radioObj)
  }
  // 输入框改变有效天数
  let iptDate = (e) => {
    let _radioObj = JSON.parse(JSON.stringify(radioObj));
    setDefaultEffectiveDays(e)
    _radioObj.effectiveDays = Number(e)//有效天数
    setRadioObj(_radioObj)
  }
  // 时间选择框改变时间
  let changeTime = (e) => {
    let _radioObj = JSON.parse(JSON.stringify(radioObj));
    if (e) {
      _radioObj.effectStartDate = moment(e[0]).format('YYYY-MM-DD');
      _radioObj.effectEndDate = moment(e[1]).format('YYYY-MM-DD');
      setRadioObj(_radioObj)
    }
  }
  // 禁选日期&&限制时间范围（选择时间范围要不能大于上限时间）
  const [dates, setDates] = useState([]);
  const disabledDate = current => {
    const tooLate = dates[0] && current.diff(dates[0], 'days') > maxEffectiveDays;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > maxEffectiveDays;
    const today = current && current < moment().startOf('day');//今天之前不可选
    return today || tooEarly || tooLate;
  };

  // 搜索
  let onFinish = (values) => {
    let data = {
      // channelNo: "104",//客户编号
      pageNum: 1,
      pageSize: 10,
      couponSkuName: values.couponSkuName,//卡券名称
      couponCategoryType: values.couponCategoryType,//品类
      productNo: values.productNo,//SKU编号
      couponSkuNo: '',//	基础卡券编号
      grantCardPackageFlag: editCardPackageFlag == undefined ? isCardRadioTabs : editCardPackageFlag//投放类型
    }
    setPayload(data);
  }

  let [receiveEffectDays, setReceiveEffectDays] = useState(0);//生效时间
  let [defaultEffectiveDays, setDefaultEffectiveDays] = useState(null);//默认时间
  let [maxEffectiveDays, setMaxEffectiveDays] = useState(null);//上限时间
  let [cardRadioInfo, setCardRadioInfo] = useState({});// 卡券单选时得数据对象
  let [radioClick, setRadioClick] = useState(0);// 卡券个性化设置使用有效期设置初始值为1  
 
  // 点击列表单选项
  const clickRadio = (text, all) => {
    setCardRadioInfo(all)
    setDefaultEffectiveDays(all.defaultEffectiveDays)//默认时间
    setMaxEffectiveDays(all.maxEffectiveDays)//上限时间

    // console.log(all, 'all1234%%%%%%%%%')
    for (let i = 0; i < list.length; i++) {
      list[i].hashCode == all.hashCode ? list[i].flag = true : list[i].flag = false;
    }
    setList(JSON.parse(JSON.stringify(list)))//要深拷贝，数组不渲染视图
    let _radioObj = JSON.parse(JSON.stringify(radioObj));

    _radioObj.skuCardNo = all.couponSkuNo//基础卡券编号
    _radioObj.skuCardName = all.couponSkuName
    _radioObj.skuCardCategory = all.couponCategoryType//基础卡券品类
    _radioObj.skuCardCategoryName = all.couponCategoryName
    _radioObj.faceValue = all.faceValue//面值
    _radioObj.serviceType = all.serviceType//类型
    if (all.serviceType == 2) {//第三方
      _radioObj.isGive = 1;//是否转赠 1 否 2是(可改)
    } else {
      _radioObj.isGive = isGive//默认转赠
    }

    _radioObj.maxiMumValidDays = (all.quotationNo  && all.useValidDays) ? all.useValidDays : all.maxEffectiveDays//最大时间期限

    _radioObj.effectDateType = effectDateType//默认有效期类型
    _radioObj.receiveEffectDays = 0//生效时间(默认为0)
    _radioObj.effectiveDays = (all.quotationNo && all.useValidDays) ? all.useValidDays : all.defaultEffectiveDays//默认时间，有效天数
    _radioObj.quotation_no = all.quotationNo//关联报价单编号
    _radioObj.useValidType = all.useValidType//使用有效期从何时计算：1、从实际发放日开始 2、从实际领取日开始 3、投放时配置
    _radioObj.effectiveStartDate = ''//卡券领取有效期-始时间
    _radioObj.effectiveEndDate = ''//卡券领取有效期-结束时间
    _radioObj.quotationItemId = all.quotationItemId// 卡券报价单子项id
    _radioObj.receiveValidDays = all.receiveValidDays// 卡券报价领取有效天数
    _radioObj.useValidDays = all.useValidDays// 卡券领取使用有效天数
    _radioObj.isUseThreshold = all.isUseThreshold// 卡券使用门槛
    _radioObj.useThresholdAmount = all.useThresholdAmount// 卡券使用门槛
    if (isCardRadioTabs == 4) {
      _radioObj.singleNum = 1 //单份数量(可改)(接口投放默认1)
    }
    // _radioObj.effectStartDate = //有效开始日期(可改)
    // _radioObj.effectEndDate = //有效结束日期(可改)
    console.log(_radioObj, '1.4.7迭代')
    setRadioObj(_radioObj);
    form.setFieldsValue({ TurnToIncrease: 1});// 给是否转增赋值
    // 根据receiveValidDays(领取有效天数来判断) 动态给卡券个性化领取有效期赋值    当领取有效天数为空时  默认为一年  
    if(isCardRadioTabs==4 || isCardRadioTabs==2 || isCardRadioTabs==3) {
      if(all.receiveValidDays==null) {
        form.setFieldsValue({
          receiveValidDays1: 365
        })
      }else {
        form.setFieldsValue({
          receiveValidDays1: all.receiveValidDays
        })
      }
    } else {
      if(all.receiveValidDays==null) {  //  当领取有效天数为null时  默认赋值为一年
        form.setFieldsValue({
          receiveValidDays1: [moment(), moment().add(1, 'years')]
        })
      }else {
        form.setFieldsValue({ 
          receiveValidDays1: [moment(), moment().add((Number(all.receiveValidDays) -1), 'days')]
        })
      }
    }
    // 当useValidType等于发放或者领取时 给有效期设置默认天数
    if(all.useValidType==1 || all.useValidType==2) {
      form.setFieldsValue({ 
        useEffectiveDays: (all.quotationNo && all.useValidDays ) ? all.useValidDays : all.defaultEffectiveDays,
      })
    }else {
      form.setFieldsValue({ 
        useValidDays: 0,
        useEffectiveDays: (all.quotationNo && all.useValidDays ) ? all.useValidDays : all.defaultEffectiveDays,// 有效天数
        useReceiveEffectDays: 0,//默认设置第0天
      });
    }
  }
  useEffect(() => {
    console.log(couponList, 'couponList')
    setList(couponList)
  }, [couponList])

  // 发放类型
  let serviceTypeText = (text, all) => {
    return <>
      {
        text == 1 ? <span>壹路通</span> :
          text == 2 ? <span>第三方</span> :
            ''
      }
    </>
  }

  // 数量
  let singNum = (singleNum, record, key) => {
    let _radioObj = JSON.parse(JSON.stringify(radioObj));
    let onChangeSingNum = (e) => {
      _radioObj.singleNum = e;
      setRadioObj(_radioObj);
    }
    if (record.flag) {
      return <InputNumber
        value={singleNum}
        min={1}
        max={20}
        onChange={onChangeSingNum}
      />
    } else {
      return null
    }
  }

  // 添加
  let handleCouponOk = () => {
    let formValue = form.getFieldsValue();
    let _radioObj = JSON.parse(JSON.stringify(radioObj));
    
    if (Object.keys(_radioObj).length) {//为0时是{}
      // 有效期的判断
      if(isCardRadioTabs == 4 || isCardRadioTabs==2 || isCardRadioTabs== 3) {
        if(cardRadioInfo.receiveValidDays == null) {  
          if(Number(formValue.receiveValidDays1) > 730) return message.warning({ content: `领取有效期不能超过730天！` })
        }else {
          if(Number(formValue.receiveValidDays1) > cardRadioInfo.receiveValidDays) return message.warning({ content: `领取有效期不能超过${cardRadioInfo.receiveValidDays}天！` })
        }
      }else {
        if(cardRadioInfo.receiveValidDays == null) {  
          if(((moment(formValue.receiveValidDays1[1]).valueOf() - moment(formValue.receiveValidDays1[0]).valueOf()) / (1000*3600*24)) +1 > 730) {
            return message.warning({ content: `领取有效期不能超过730天！` })
          }
        }else {
          if(((moment(formValue.receiveValidDays1[1]).valueOf() - moment(formValue.receiveValidDays1[0]).valueOf()) / (1000*3600*24)) +1 > cardRadioInfo.receiveValidDays) {
            return message.warning({ content: `领取有效期不能超过${cardRadioInfo.receiveValidDays}天！` })
          }
        }
      }

      if(formValue.receiveValidDays) {
        _radioObj.effectStartDate = moment(formValue.receiveValidDays[0]).format('YYYY-MM-DD');
        _radioObj.effectEndDate = moment(formValue.receiveValidDays[1]).format('YYYY-MM-DD');
      }



      if(isCardRadioTabs==4 || isCardRadioTabs==2 || isCardRadioTabs== 3) {
        if(formValue.receiveValidDays1) {
          _radioObj.receiveLimitDays = formValue.receiveValidDays1;
        }
      }else {
        if(formValue.receiveValidDays1) {
          _radioObj.effectiveStartDate = moment(formValue.receiveValidDays1[0]).format('YYYY-MM-DD')
          _radioObj.effectiveEndDate = moment(formValue.receiveValidDays1[1]).format('YYYY-MM-DD')
        }
      }

      if (effectDateType == 0) {//领取后
        if (!_radioObj.singleNum && (isCardRadioTabs != 4 || editCardPackageFlag != 4)) {
          return message.warning({
            content: '请输入单份数量！'
          })
        } else if (!_radioObj.effectiveDays) {
          return message.warning({
             content: '请输入有效天数！' 
            })
        } else if (_radioObj.receiveEffectDays == null) {
          return message.warning({
            content: '请输入生效时间！',
          })
        }
        if(cardRadioInfo.quotationNo && cardRadioInfo.useValidDays) {
          if(Number(formValue.useEffectiveDays) > cardRadioInfo.useValidDays) {
            return message.warning({
              content: `有效天数不能超过${cardRadioInfo.useValidDays}天！`,
            })
          }
        }else {
          if(Number(formValue.useEffectiveDays) > cardRadioInfo.maxEffectiveDays) {
            return message.warning({
              content: `有效天数不能超过${cardRadioInfo.maxEffectiveDays}天！`,
            })
          }
        }
        // 数量&&输入有效天数&&生效时间
        if ((_radioObj.singleNum || (isCardRadioTabs == 4 || editCardPackageFlag == 4)) && _radioObj.effectiveDays && (_radioObj.receiveEffectDays || _radioObj.receiveEffectDays == 0)) {
          closeModal()
          subList(_radioObj)//符合条件添加时，将选中的数据{}传入父组件
          return message.success({
            content: '卡券添加成功！',
          })
        }

      } else {//固定时间
        console.log(formValue, _radioObj, isCardRadioTabs, editCardPackageFlag)
        if(cardRadioInfo.useValidDays) {
          if(((moment(formValue.receiveValidDays[1]).valueOf() - moment(formValue.receiveValidDays[0]).valueOf()) / (1000*3600*24)) +1 > cardRadioInfo.useValidDays) {
            return message.warning({ content: `使用有效期不能超过${cardRadioInfo.useValidDays}天！` })
          }
        }else {
          if(((moment(formValue.receiveValidDays[1]).valueOf() - moment(formValue.receiveValidDays[0]).valueOf()) / (1000*3600*24)) +1 > cardRadioInfo.maxEffectiveDays) {
            return message.warning({ content: `使用有效期不能超过${cardRadioInfo.maxEffectiveDays}天！` })
          }
        }

        // 数量&&选择时间
        if ((_radioObj.singleNum || (isCardRadioTabs == 4 || editCardPackageFlag == 4)) && _radioObj.effectStartDate && _radioObj.effectEndDate) {
          console.log(_radioObj)
          closeModal()
          subList(_radioObj)//符合条件添加时，将选中的数据{}传入父组件
          message.success({
            content: '卡券添加成功！',
          })
        } else if (!_radioObj.singleNum && (isCardRadioTabs != 4 || editCardPackageFlag != 4)) {
          message.warning({
            content: '请输入单份数量！',
          })
        } 
      }

    } else {
      message.warning({
        content: '请选择卡券！',
      })
    }
  }

  /*点击下一页上一页(参数是改变后的页码及每页条数)*/
  let onNextChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = page
    this_payload.pageSize = pageSize
    setPayload(this_payload)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = page
    this_payload.pageSize = pageSize
    setPayload(this_payload)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / payload.pageSize)
    return `共${total}条记录 第 ${payload.pageNum} / ${totalPage}  页`
  }


  return (
    <>
      <Modal width={1400} title='添加卡券' visible={isModalVisible} okText='添加' onOk={handleCouponOk} onCancel={() => { closeModal() }}>
        <h3>1.选择卡券</h3>
        <Form className={style.form__cont} form={form} onFinish={onFinish}>
          <Row justify="space-around" align="center" style={{ marginLeft: '-30px' }}>
            <Form.Item name="couponSkuName" label="卡券名称：" className={style.form__item} labelCol={{ span: 8 }}>
              <Input placeholder='请输入'></Input>
            </Form.Item>
            <Form.Item label="卡券品类：" name="couponCategoryType" className={style.form__item} labelCol={{ span: 8 }}>
              <Select placeholder="请选择" allowClear>
                {
                  categoryList && categoryList.map((v) => <Option key={v.id} value={v.id}>{v.categoryName}</Option>)
                }
              </Select>
            </Form.Item>
            <Form.Item label="SKU：" name="productNo" className={style.form__item} labelCol={{ span: 8 }}>
              <Select placeholder="不限" allowClear>
                {
                  skuList.map((v) => <Option key={v.productNo} value={v.productNo}>{v.productName}</Option>)
                }
              </Select>
            </Form.Item>
          </Row>
          <Row justify="end" style={{ marginBottom: '20px' }}>
            <Button htmlType="submit" type="primary">搜索</Button>
          </Row>
          <Table bordered dataSource={list} pagination={false}>
            <Column
              title="" dataIndex="couponSkuNo"
              render={(text, data) => {
                return <Radio onClick={() => { clickRadio(text, data) }} checked={data.flag}></Radio>
              }}
            />
            <Column title="卡券编号" dataIndex="couponSkuNo" key="couponSkuNo" />
            <Column title="卡券名称" dataIndex="couponSkuName" key="couponSkuName" />
            <Column title="卡券品类" dataIndex="couponCategoryName" key="couponCategoryName" />
            <Column width={120} title="面值（元）" dataIndex="faceValue" key="faceValue" />
            <Column width={140} title="使用门槛" dataIndex="isUseThreshold" key="isUseThreshold" 
              render={(isUseThreshold, record) => useThresholdRender(isUseThreshold, record)}
            />
            <Column width={160} title="领取有效天数" dataIndex="receiveValidDays" key="receiveValidDays" 
              render={(receiveValidDays, record) => {
                return <>
                  {
                    receiveValidDays ? <span>{receiveValidDays}</span> : <span>不限制</span>
                  }
                </>
              }}
              />
            <Column width={180} title="使用有效天数" dataIndex="useValidDays" key="useValidDays" 
              render={(useValidDays, record) => {
                // useValidType	使用有效期从何时计算：1、从实际发放日开始 2、从实际领取率开始 3、投放时配置
                return <>
                  {
                    useValidDays!=null ?  
                    record.useValidType==1 ? <span>{`${useValidDays}天(发放后立即生效)`}</span> : 
                    record.useValidType==2 ? <span>{`${useValidDays}天(领取后立即生效)`}</span> : 
                    record.useValidType==3 ? <span>{`${useValidDays}天`}</span> : <span>{`${useValidDays}天`}</span>
                    :
                    <span>不限制</span>
                  }
                </>
              }}
            />
            <Column width={120} title="供应商" dataIndex="serviceType" key="serviceType"
              render={(text, all) => serviceTypeText(text, all)}
            />
            {
              (isCardRadioTabs == 4 || editCardPackageFlag == 4) ? '' :
                <Column width={'20 %'} title="单份数量（张）" dataIndex="singleNum" key="singleNum"
                  render={(singleNum, record, key) => singNum(singleNum, record, key)}
                />
            }
          </Table>
          <Pagination
            className={style.pagination}
            current={payload.pageNum} //选中第一页
            pageSize={payload.pageSize} //默认每页展示10条数据
            total={couponTotal} //总数
            onChange={onNextChange} //切换 页码时触发事件
            pageSizeOptions={['10', '20', '30', '60']}
            onShowSizeChange={onSizeChange}
            showTotal={onPageTotal}
          />
          {
            Object.keys(radioObj).length ?
              <>
                <Divider style={{ marginTop: '90px' }} />
                <h3 style={{ marginLeft: '-36px' }}>2.卡券个性化设置</h3>
                <div style={{ marginLeft: '-45px' }}>
                  {
                    isCardRadioTabs==4 || isCardRadioTabs==2 || isCardRadioTabs==3? 
                    <Row>
                      <Col flex="0 0 215px">
                        <Form.Item label="领取有效期" name="receiveValidDays1"  labelCol={{flex:'0 0 120px'}} colon={false} >
                          <InputNumber  min={0} placeholder="请输入" precision={0} />
                        </Form.Item>
                      </Col>
                      <Col flex="none" className={style.form_word}>天</Col>  
                    </Row>
                    :
                    <Row>
                      <Col span={9}>
                        <Form.Item name="receiveValidDays1" label="领取有效期"  labelCol={{flex:'0 0 120px'}}>
                          <RangePicker style={{width: '100%'}} disabledDate={disabledDate}  placeholder={['开始时间', '结束时间']}/>
                        </Form.Item>  
                      </Col>
                    </Row>
                  }
                  {
                    cardRadioInfo.receiveValidDays == null ? 
                    <p style={{ marginLeft: '120px', marginTop: '-10px', color: '#f00' }}>该券领取有效天数上限不超过730天</p>
                    :
                    <p style={{ marginLeft: '120px', marginTop: '-10px', color: '#f00' }}>该券领取有效天数上限不超过{ cardRadioInfo.receiveValidDays }天</p>
                  }
                  <Row>
                    <Form.Item label={ <div className={style.my_lable}>使用有效期
                      <Tooltip placement="top" title="若发放名单中包含开始日期、结束日期，则以保单时间为准，但仍需针对有效天数做校验，到期时间不超过最大天数，若超出则按最大天数计算">
                        <QuestionCircleOutlined style={{marginLeft: '4px'}}/>
                      </Tooltip> </div>} className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: '此项不能为空' }]}>
                        {
                          cardRadioInfo.useValidType==1 || cardRadioInfo.useValidType==2 ?  // 若该券有效起始时间限制 为发放日期生效、从领取日期生效时 显示 默认，隐藏按固定时间、按上传有效期
                          <Radio.Group defaultValue={effectDateType} onChange={onChangeEffectDateType} value={effectDateType}>
                            <Radio value={0}>默认</Radio>
                          </Radio.Group> 
                          :
                          <Radio.Group defaultValue={effectDateType} onChange={onChangeEffectDateType} value={effectDateType}>
                            <Radio value={0}>默认</Radio>
                            {
                              (isCardRadioTabs == 2 || editCardPackageFlag == 2) || (isCardRadioTabs == 3 || editCardPackageFlag == 3) || (isCardRadioTabs == 4 || editCardPackageFlag == 4) ? 
                              '' : <Radio Radio value={1}>固定时间</Radio>
                            }
                          </Radio.Group>
                        }
                    </Form.Item>
                  </Row>
                 {
                  cardRadioInfo.useValidType==1 || cardRadioInfo.useValidType==2 ? 
                  <>
                    <Row style={{paddingLeft: '120px'}}>
                      <Col flex="0 0 180px">
                        <Form.Item label="有效天数：" name='useEffectiveDays' labelCol={{flex:'none'}} colon={false} >
                          <InputNumber precision={0}  min={0} max={cardRadioInfo.maxEffectiveDays} placeholder="请输入" onChange={iptDate} />
                        </Form.Item>
                      </Col>
                      <Col flex="none" className={style.form_word}>天</Col>
                    </Row> 
                    <p style={{ marginLeft: '120px', marginTop: '-10px', color: '#f00' }}>{cardRadioInfo.useValidType==1 ? '生效日期从发放日开始计算' : '生效日期从领取日开始计算'}</p>
                  </> 
                  : 
                  effectDateType== 0 ? 
                  <>
                    <Row style={{paddingLeft: '120px'}}>
                      <Col flex="0 0 120px">
                        <Form.Item label="第" name="useReceiveEffectDays" labelCol={{flex:'none'}} colon={false} >
                          <InputNumber precision={0} min={0} onChange={iptNumDate} /> 
                        </Form.Item>
                      </Col>
                      <Col flex="none" className={style.form_word}>天开始生效，</Col>
                      <Col flex="0 0 180px">
                        <Form.Item label="有效天数：" name="useEffectiveDays"  labelCol={{flex:'none'}} colon={false} >
                          <InputNumber precision={0}  min={0} max={cardRadioInfo.maxEffectiveDays} placeholder="请输入" onChange={iptDate} />
                        </Form.Item>
                      </Col>
                      <Col flex="none" className={style.form_word}>天</Col>
                    </Row>
                    <p style={{ marginLeft: '120px', marginTop: '-10px', color: '#f00' }}>第0天表示立即生效，使用有效天数上限不超过{ cardRadioInfo.useValidDays!=null ? cardRadioInfo.useValidDays : cardRadioInfo.maxEffectiveDays  }天</p>
                  </> 
                  :
                  <>
                    <Row style={{paddingLeft: '120px'}}>
                      <Col span={8}>
                        <Form.Item name="receiveValidDays"  labelCol={{flex:'0 0 120px'}}>
                          <RangePicker style={{width: '100%'}} onChange={changeTime} disabledDate={disabledDate} placeholder={['开始时间', '结束时间']}/>
                        </Form.Item>
                      </Col>
                      <Col span={16}></Col>
                    </Row>
                    <p style={{ marginLeft: '120px', marginTop: '-10px', color: '#f00' }}>使用有效期上限不超过{ cardRadioInfo.useValidDays!=null ? cardRadioInfo.useValidDays : cardRadioInfo.maxEffectiveDays }天</p>
                  </>
                }

                {/* {
                  effectDateType == 0 ?
                    <>
                      <Row>
                        <Form.Item label="生效时间：" className={style.form__item} labelCol={{ span: 8 }}>
                          第 <InputNumber min={0} value={receiveEffectDays} onChange={iptNumDate} /> 天
                        </Form.Item>
                        <p style={{ margin: '6px -26px', color: '#f00' }}>第0天表示立即生效</p>
                      </Row>
                      <Row>
                        <Form.Item label="有效天数：" className={style.form__item} labelCol={{ span: 8 }}>
                          <InputNumber min={1} max={maxEffectiveDays} value={defaultEffectiveDays} onChange={iptDate} /> 天
                        </Form.Item>
                        <p style={{ margin: '6px -26px', color: '#f00' }}>有效期上限不超过{maxEffectiveDays}天</p>
                      </Row>
                    </>
                    :
                    <Row>
                      <Form.Item label="有效天数：" name="effectDate" className={style.form__item} labelCol={{ span: 8 }}>
                        <RangePicker
                          onChange={changeTime}
                          disabledDate={disabledDate}
                          onCalendarChange={val => setDates(val)}
                          placeholder={['开始时间', '结束时间']}
                        />
                      </Form.Item>
                    </Row>
                } */}


                  <Row>
                    <Form.Item label="可否转赠："
                      className={style.form__item} labelCol={{ span: 8 }}
                      rules={[{ required: true, message: '此项不能为空' }]}>
                      {
                        radioObj.serviceType == 2 ?
                          <Radio.Group defaultValue={1} value={1}>
                            <Radio value={2} disabled={true}>是</Radio>
                            <Radio value={1}>否</Radio>
                          </Radio.Group>
                          :
                          <Radio.Group defaultValue={isGive} onChange={onChangeGive} value={isGive}>
                            <Radio value={2}>是</Radio>
                            <Radio value={1}>否</Radio>
                          </Radio.Group>
                      }
                    </Form.Item>
                  </Row>
                </div>
              </> : ''
          }

        </Form>

      </Modal>
    </>
  )

}


export default connect(({ cardgrantManageModel }) => ({
  skuList: cardgrantManageModel.skuList,
  couponList: cardgrantManageModel.couponList,
  couponTotal: cardgrantManageModel.couponTotal,
  isCardRadioTabs: cardgrantManageModel.isCardRadioTabs,//投放类型
  categoryList: cardgrantManageModel.categoryList,//卡券品类
  // appllyDetailList: cardgrantManageModel.appllyDetailList,
  // total: cardgrantManageModel.total,//命名空间名.变量
  // detailTotal: cardgrantManageModel.detailTotal
}))(addCouponsModal)