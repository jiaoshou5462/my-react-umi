import React, {useEffect, useState,} from "react"
import { connect, history } from 'umi'
import {
  Form,
  Input,
  Row,
  Space,
  Button,
  Select,
  Radio,
  Col,
  Modal,
  InputNumber,
  message
} from "antd"
import RichText from "@/pages/basicCard/richText"
import 'moment/locale/zh-cn'
import style from "./style.less"
const { Option } = Select
const { TextArea } = Input
let discountsArr = [{
  id:1,
  title: '优惠券'
},{
  id:2,
  title: '抵用券'
},{
  id:3,
  title: '打折券'
}] //卡券种类
/*服务形式*/
let serviceListA = [
  {title: 'A（下单）', id: 'A'},
  {title: 'B（网点）', id: 'B'},
  {title: 'A（下单）+ B（网点）', id: 'AB'},
  {title: 'O（在线）', id: 'O'}]
let tempUsageExplain = "<p><span style='color:rgb(71,85,119);'>使用说明：</span></p><p><span style='color:rgb(71,85,119);'>1.此券仅限有效期内使用，未到使用时间不可使用，超出使用时间此券作废。</span></p><p><span style='color: rgb(71,85,119);'>2.此券仅用于XX服务，限在线支付使用，不再与其他优惠同享。</span></p><p><span style='color: rgb(71,85,119);'>3.每个订单只能使用1张优惠券。</span></p><p><span style='color: rgb(71,85,119);'>4.此券最终解释权归壹路通所有。</span></p>"
let editBasicCardPage = (props) => {
  let { dispatch, history, tagList, channelList, categoryList, cardDetail} = props,
      [form] = Form.useForm(),
      [skuDetail, setSkuDetail] = useState({}), //选中的sku
      [textDisplay, setTextDisplay] = useState(1), //面值显示
      [productNo, setProductNo] = useState(sessionStorage.getItem('basicCard_productNo') || ''), //编辑页面进入id
      [cardId, setCardId] = useState(sessionStorage.getItem('basicCard_cardId')|| ''), //编辑页面进入id
      [copyCardId, setCopyCardId] = useState(sessionStorage.getItem('basicCard_copyCardId')|| ''), //复制新增进入
      [couponUsageExplain, setCouponUsageExplain] = useState(tempUsageExplain) //使用说明
  useEffect(()=>{
    /*卡券品类列表*/
    dispatch({
      type:"editBasicCard/getCategoryBasicCard",
    })
    /*获取渠道*/
    dispatch({
      type: "editBasicCard/getChannel"
    })
    /*获取标签*/
    dispatch({
      type: 'editBasicCard/getTag'
    })
    /*获取卡券详请*/
    dispatch({
      type: 'editBasicCard/getCardDetail',
      payload: {param: !copyCardId ? cardId : copyCardId}
    })
    let temp = JSON.parse(sessionStorage.getItem('basicCard_skuDetail')) ||{}
    if(Object.keys(temp).length > 0){
      setSkuDetail(temp)
      if (temp.serviceType == 2) {
        let tempChannelNo = {
          key: cardDetail.channelNo,
          value: cardDetail.channelNo,
          label: cardDetail.channelName,
        }
        form.setFieldsValue({
          channelNo: tempChannelNo,
        })
      } else {
        form.setFieldsValue({
          channelNo: [],
        })
      }
    }else {
      getSkuProductDetail()
    }
  },[])
  useEffect(()=>{
    if(Object.keys(cardDetail).length > 0){
      let tempChannelNo = []
      form.setFieldsValue({
        ...cardDetail,
        basicCouponTag: {
          key: cardDetail.basicCouponTag,
          value: cardDetail.basicCouponTag,
          label: cardDetail.basicCouponTagName,
        },
      })
      setTextDisplay(cardDetail.textDisplay)
      if(Object.keys(skuDetail).length > 0){
        if(skuDetail.productType === 1){
          form.setFieldsValue({
            usableTimes: 1,
            usableIntervalDays: 1
          })
        }
        if (skuDetail.serviceType == 2) {
          tempChannelNo = {
            key: skuDetail.channelNo,
            value: skuDetail.channelNo,
            label: skuDetail.channelName,
          }
        }
      }
      form.setFieldsValue({
        channelNo: tempChannelNo,
      })
    }
  },[cardDetail, skuDetail])
  /*查询sku产品详情*/
  let getSkuProductDetail = () => {
    dispatch({
      type: 'editBasicCard/getSkuProductDetail',
      payload: {
        method:'getUrlParams',
        params: productNo
      },
      callback: (res) => {
        if(res.result.code === '0'){
          let temp = res.body
          setSkuDetail(temp)
          if (temp.serviceType == 2) {
            let tempChannelNo = {
              key: cardDetail.channelNo,
              value: cardDetail.channelNo,
              label: cardDetail.channelName,
            }
            form.setFieldsValue({
              channelNo: tempChannelNo,
            })
          } else {
            let tempChannelNo = []
            form.setFieldsValue({
              channelNo: tempChannelNo,
            })
          }
        }else {
          message.error(payload.result.message)
        }
      }
    })
  }
  /*面值显示单选*/
  let onDisplayChange = (e) => {
    let value = e.target.value
    setTextDisplay(value)
  }
  /*提交*/
  let onSubmit = e => {
    let {defaultEffectiveDays, maxEffectiveDays} = e
    if(defaultEffectiveDays >= maxEffectiveDays){
      Modal.info({content: '最大有效期天数必须大于默认有效期天数！', okText: '确定'})
      return
    }
    if(!couponUsageExplain || couponUsageExplain === ''){
      Modal.info({content: '使用说明不能为空', okText: '确定'})
      return
    }
    let categoryData = {}
    categoryList.map(item => {
      if (item.id === e.couponCategoryType) {
        categoryData = item
      }
    })
    let data = {
      ...e,
      couponSkuNo: cardId,
      valueType: skuDetail.valueType,
      productNo: skuDetail.productNo,
      productName: skuDetail.productName,
      serviceType: skuDetail.serviceType,
      productType: skuDetail.productType,
      basicCouponTag: e.basicCouponTag.value,
      couponCategoryType: skuDetail.couponCategory,
      couponCategoryName: skuDetail.couponCategoryName,
      basicCouponTagName: e.basicCouponTag.label,
      channelNo: skuDetail.serviceType == 2 ? skuDetail.channelNo  : null,
      channelName: skuDetail.serviceType == 2 ? skuDetail.channelName : null,
      faceValue: e.faceValue ? e.faceValue : skuDetail.faceValue,
      cardJumpForm: skuDetail.cardJumpForm,
      cardJumpUrl: skuDetail.cardJumpUrl,
    }
    dispatch({
      type: !copyCardId ? "editBasicCard/editBasicCard" : "addBasicCard/addBasicCard",
      payload: data,
      pageCallback: (res) => {
        if(res.result.code === '0'){
          Modal.success({
            content: !copyCardId ? '修改成功！' : '新建成功！',
            okText: '确定',
            onOk: () =>{
              goToBack()
            }
          })
        }
      }
    })
  }
  /*返回*/
  let goToBack = () =>{
    sessionStorage.removeItem('basicCard_cardId')
    sessionStorage.removeItem('basicCard_copyCardId')
    sessionStorage.removeItem('basicCard_skuDetail')
    history.goBack()
  }
  /*富文本编辑器*/
  let onTextChange = (value) => {
    form.setFieldsValue({
      couponUsageExplain: value
    })
  }
  /*限制数字输入框只能输入整数*/
  let limitNumber = (value) =>{
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(/^(0+)|[^\d]/g, '') : ''
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(/^(0+)|[^\d]/g, '') : ''
    } else {
      return ''
    }
  }
  /*重置sku*/
  let onResetSku = () => {
    setSkuDetail({})
    sessionStorage.removeItem('basicCard_skuDetail')
  }
  return (
      <>
        <Form className={style.form__cont} form={form} onFinish={onSubmit} >
          <div className={style.block__cont}>
            <div className={style.block__header}>{!copyCardId ? '编辑基础卡券' : '新建基础卡券'}</div>
            <div className={style.block__sub__header}>卡券信息</div>
            <div style={{padding: '36px'}}>
              <Row justify="space-around" align="center">
                <Form.Item label="内部名称：" name='couponSkuName'  className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请输入" }]}>
                  <Input
                      placeholder="请输入"
                  />
                </Form.Item>
                <Form.Item label="卡券种类：" name='discountsType' className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请选择" }]}>
                  <Select placeholder="不限">
                    {
                      discountsArr.map((item,key) => <Option key={key} value={item.id}>{item.title}</Option>)
                    }
                  </Select>
                </Form.Item>
                <Form.Item label="限定客户：" name='channelNo' className={style.form__item} labelCol={{ span: 8 }}>
                  <Select
                      disabled={true}
                      allowClear
                      showSearch
                      labelInValue
                      notFoundContent='暂无数据'
                      placeholder="输入渠道可筛选"
                      optionFilterProp="children"
                  >
                    {
                      channelList.map((item, key) => <Option key={key} value={item.id}>{item.codeDesc}</Option>)
                    }
                  </Select>
                </Form.Item>
              </Row>
              <Row justify="space-around" align="center">
                <Form.Item label="默认有效期天数：" name='defaultEffectiveDays' className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请输入" }]}>
                  <InputNumber
                      min={1}
                      parser={limitNumber}
                      formatter={limitNumber}
                      placeholder="请输入大于0的数值"
                      className={style.form_item_input}
                  />
                </Form.Item>
                <Form.Item label="最大有效期天数：" name='maxEffectiveDays' className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请输入" }]}>
                  <InputNumber
                      min={1}
                      parser={limitNumber}
                      formatter={limitNumber}
                      placeholder="请输入大于0的数值"
                      className={style.form_item_input}
                  />
                </Form.Item>
                <Form.Item label="状态：" name='status' className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请选择" }]}>
                  <Radio.Group>
                    <Radio value={2}>启用</Radio>
                    <Radio value={3}>停用</Radio>
                  </Radio.Group>
                </Form.Item>
              </Row>
              {
                Object.keys(skuDetail).length > 0 ? <Row>
                  <Form.Item label="可用次数：" name='usableTimes' className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请输入" }]}>
                    <InputNumber
                        min={1}
                        parser={limitNumber}
                        formatter={limitNumber}
                        placeholder="请输入大于0的数值"
                        className={style.form_item_input}
                        disabled={skuDetail.productType && skuDetail.productType === 1 ? true : false}
                    />
                  </Form.Item>
                  <Form.Item label="最短使用间隔天数：" name='usableIntervalDays' className={style.form__item} labelCol={{ span: 8 }}>
                    <InputNumber
                        min={1}
                        parser={limitNumber}
                        formatter={limitNumber}
                        placeholder="请输入大于0的数值"
                        className={style.form_item_input}
                        disabled={skuDetail.productType && skuDetail.productType === 1 ? true : false}
                    />
                  </Form.Item>
                  <Form.Item className={style.form__item} labelCol={{ span: 8 }} />
                </Row> : null
              }
              <Row>
                <Form.Item label="备注（选填）：" name='remarks' className={style.form__item__big} labelCol={{ span: 4 }}>
                  <TextArea showCount maxLength={100} style={{height: '100px'}} placeholder="请输入备注" />
                </Form.Item>
              </Row>
            </div>
          </div>

          <div className={style.block__cont} style={{margin: '38px 0', paddingBottom: '30px'}}>
            <div className={style.block__sub__header}>SKU 信息</div>
            <div style={{padding: '36px'}}>
              <Row justify="space-around" align="center">
                <Col className={style.form_item_detail} span={8}>
                  <div>SKU编码：</div>
                  <div>{skuDetail.productNo}</div>
                </Col>
                <Col className={style.form_item_detail} span={8}>
                  <div>服务名称：</div>
                  <div>{skuDetail.productName}</div>
                </Col>
                <Col className={style.form_item_detail} span={8}>
                  <div>服务单位：</div>
                  <div>{skuDetail.serviceUnit}</div>
                </Col>
              </Row>
              <Row justify="space-around" align="center">
                <Col className={style.form_item_detail} span={8}>
                  <div>收费类型：</div>
                  <div>{skuDetail.chargeTypeName}</div>
                </Col>
                <Col className={style.form_item_detail} span={8}>
                  <div>服务分类：</div>
                  <div>{skuDetail.productTypeName}</div>
                </Col>
                <Col className={style.form_item_detail} span={8}>
                  <div>服务方式：</div>
                  <div>
                    {
                      skuDetail.serviceMode ? serviceListA.map(item => {
                        if(item.id === skuDetail.serviceMode){
                          return item.title
                        }
                      }) : ''
                    }
                  </div>
                </Col>
              </Row>
              <Row justify="space-around" align="center">
                <Col className={style.form_item_detail} span={8}>
                  <div>投放品类：</div>
                  <div>{skuDetail.couponCategoryName}</div>
                </Col>
                <Col className={style.form_item_detail} span={8}>
                  <div>采购类型：</div>
                  <div>{skuDetail.procurementTypeName}</div>
                </Col>
                <Col className={style.form_item_detail} span={8}>
                  <div>面值类型：</div>
                  <div>{skuDetail.valueTypeName}</div>
                </Col>
              </Row>
              <Row justify="space-around" align="center">
                {
                  skuDetail.valueType === 1 ?
                      <Col className={style.form_item_detail} span={8}>
                        <div>面值：</div>
                        <div>{skuDetail.faceValue}</div>
                      </Col>
                      :
                      <Col className={style.form_item_detail} span={8}>
                        <Form.Item label="面值/折扣：" name='faceValue'  rules={[{ required: true, message: "请输入" }]}>
                          <Input placeholder="请输入"/>
                        </Form.Item>
                      </Col>
                }
                <Col className={style.form_item_detail} span={8}>
                  <div>业务类型：</div>
                  <div>{skuDetail.serviceTypeName}</div>
                </Col>
                {
                  skuDetail.serviceType == 2 ?
                      <Col className={style.form_item_detail} span={8}>
                        <div>代发渠道：</div>
                        <div>{skuDetail.channelName}</div>
                      </Col>
                      :
                      <Col className={style.form_item_detail} span={8} />
                }
              </Row>
              <Row justify="space-around" align="center">
                <Col className={style.form_item_detail} span={8}>
                  <div>跳转形式：</div>
                  <div>{skuDetail.cardJumpFormStr}</div>
                </Col>
                {
                  skuDetail.cardJumpForm == 1 || skuDetail.cardJumpForm == 4 ?
                      <Col className={style.form_item_detail} span={8}>
                        <div>跳转地址：</div>
                        <div>{skuDetail.cardJumpUrl}</div>
                      </Col>
                      :
                      <Col className={style.form_item_detail} span={8} />
                }
                <Col className={style.form_item_detail} span={8} />
              </Row>
            </div>
            <Row justify="center" align="center">
              <Space size={20}>
                <Button type='primary' onClick={()=>{history.push('relevanceProList')}}>选择SKU</Button>
                <Button onClick={onResetSku}>重置</Button>
              </Space>
            </Row>
          </div>

          <div className={style.block__cont} style={{margin: '38px 0', paddingBottom: '30px'}}>
            <div className={style.block__sub__header}>外观设置</div>
            <div style={{padding: '36px'}}>
              <Row justify="space-around" align="center">
                <Form.Item label="券面名称：" name='couponName' className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请输入券面名称" }]}>
                  <Input placeholder="例如：1元洗车抵用券；不超过12字" maxLength={12}/>
                </Form.Item>
                <Form.Item label="标签：" name='basicCouponTag' className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请选择标签" }]}>
                  <Select placeholder="请选择" labelInValue>
                    {
                      tagList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.tagName}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
                <Form.Item label="面值显示：" name='textDisplay' className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请选择面值显示" }]}>
                  <Radio.Group onChange={onDisplayChange}>
                    <Radio value={1}>面值/折扣</Radio>
                    <Radio value={2}>自定义文字</Radio>
                  </Radio.Group>
                </Form.Item>
              </Row>
              <Row justify="space-around" align="center">
                <Col span={8} className={style.form__item}/>
                <Col span={8} className={style.form__item}/>
                {
                  textDisplay !== 1 ?
                      <Form.Item label="面值显示内容: " name='customText' className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请输入面值显示内容" }]}>
                        <Input
                            placeholder="最多2个字"
                            maxLength={2}
                        />
                      </Form.Item> : null
                }
              </Row>
              <Row >
                <Form.Item label="使用说明" name='couponUsageExplain' className={style.form__item__edit} rules={[{ required: true, message: "请输入使用说明" }]}>
                  {
                    couponUsageExplain ? <RichText onTextChange={onTextChange} couponUsageExplain={couponUsageExplain} /> : null
                  }
                </Form.Item>
              </Row>
            </div>
            <Row justify="center" align="center">
              <Space size={20}>
                <Button onClick={goToBack}>取消</Button>
                <Button type='primary' htmlType="submit">提交</Button>
              </Space>
            </Row>
          </div>
        </Form>

      </>
  )
};
export default connect(({ editBasicCard }) => ({
  tagList: editBasicCard.tagList,
  cardDetail: editBasicCard.cardDetail,
  channelList: editBasicCard.channelList,
  categoryList: editBasicCard.categoryList,
}))(editBasicCardPage)
