import React, {
  useEffect,
  useState
} from "react";
import { connect, history } from 'umi';
import {
  Col,
  Row,
  Form,
  Radio,
  Input,
  Button,
  Select,
  message,
  InputNumber
} from "antd";
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
let basicCardDetailPage = (props) => {
  let { dispatch, cardDetail, categoryList } = props,
      [form] = Form.useForm(),
      [skuDetail, setSkuDetail] = useState({}), //选中的sku
      [productNo, setProductNo] = useState(sessionStorage.getItem('basicCard_productNo') || ''), //编辑页面进入id
      [cardId, setCardId] = useState(sessionStorage.getItem('basicCard_cardId')|| ''), //卡券编号
      [couponUsageExplain, setCouponUsageExplain] = useState(''), //富文本
      [textDisplay, setTextDisplay] = useState(1) //面值显示

  useEffect(()=>{
    if(Object.keys(cardDetail).length !== 0 ){
      form.setFieldsValue({
        ...cardDetail,
        channelNo: {
          key: cardDetail.channelNo,
          value: cardDetail.channelNo,
          label: cardDetail.channelName,
        },
        basicCouponTag: {
          key: cardDetail.basicCouponTag,
          value: cardDetail.basicCouponTag,
          label: cardDetail.basicCouponTagName,
        },
      })
      setCouponUsageExplain(cardDetail.couponUsageExplain)
      setTextDisplay(cardDetail.textDisplay)
    }
  },[cardDetail])

  useEffect(() => {
    /*卡券品类列表*/
    dispatch({
      type:"editBasicCard/getCategoryBasicCard",
    })
    dispatch({
      type: 'basicCardDetail/getCardDetail',
      payload: {param: cardId}
    })
    getSkuProductDetail()
  },[])
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
        }else {
          message.error(payload.result.message)
        }
      }
    })
  }
  /*返回*/
  let goToBack = () =>{
    history.goBack()
  }
  return (
      <>
        <Form className={style.form__cont} form={form}>
          <div className={style.block__cont}>
            <div className={style.block__header}>基础卡券详请</div>
            <div className={style.block__sub__header}>卡券信息</div>
            <div style={{padding: '36px'}}>
              <Row justify="space-around" align="center">
                <Form.Item label="内部名称：" name='couponSkuName'  className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请输入" }]}>
                  <InputNumber className={style.form_item_input} disabled/>
                </Form.Item>
                <Form.Item label="卡券种类：" name='discountsType' className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请选择" }]}>
                  <Select placeholder="不限" disabled>
                    {
                      discountsArr.map((item,key) => <Option key={key} value={item.id}>{item.title}</Option>)
                    }
                  </Select>
                </Form.Item>
                <Form.Item label="限定客户：" name='channelName' className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请选择" }]}>
                  <InputNumber className={style.form_item_input} disabled/>
                </Form.Item>
              </Row>
              <Row justify="space-around" align="center">
                <Form.Item label="默认有效期天数：" name='defaultEffectiveDays' className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请输入" }]}>
                  <InputNumber className={style.form_item_input} disabled/>
                </Form.Item>
                <Form.Item label="最大有效期天数：" name='maxEffectiveDays' className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请输入" }]}>
                  <InputNumber className={style.form_item_input} disabled/>
                </Form.Item>
                <Form.Item label="状态：" name='status' className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请选择" }]}>
                  <Radio.Group disabled>
                    <Radio value={2}>启用</Radio>
                    <Radio value={3}>停用</Radio>
                  </Radio.Group>
                </Form.Item>
              </Row>
              <Row>
                <Form.Item label="可用次数：" name='usableTimes' className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请输入" }]}>
                  <InputNumber className={style.form_item_input} disabled/>
                </Form.Item>
                <Form.Item label="最短使用间隔天数：" name='usableIntervalDays' className={style.form__item} labelCol={{ span: 8 }}>
                  <InputNumber className={style.form_item_input} disabled placeholder="暂无数据"/>
                </Form.Item>
                <Form.Item className={style.form__item} labelCol={{ span: 8 }} />
              </Row>
              <Row>
                <Form.Item label="备注（选填）：" name='remarks' className={style.form__item__big} labelCol={{ span: 4 }}>
                  <TextArea disabled showCount maxLength={100} style={{height: '100px'}} placeholder="请输入备注" />
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
                <Col className={style.form_item_detail} span={8}>
                  <div>面值/折扣：</div>
                  <div>{cardDetail.faceValue}</div>
                </Col>
                <Col className={style.form_item_detail} span={8}>
                  <div>业务类型：</div>
                  <div>{skuDetail.serviceTypeName}</div>
                </Col>
                {
                  skuDetail.serviceType == 2 ?
                      <Col className={style.form_item_detail} span={8}>
                        <div>代发渠道：</div>
                        <div>{skuDetail.channelName}</div>
                      </Col> :
                      <Col className={style.form_item_detail} span={8} />
                }

              </Row>
              <Row justify="space-around" align="center">
                <Col className={style.form_item_detail} span={8}>
                  <div>状态：</div>
                  <div>{skuDetail.statusStr}</div>
                </Col>
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
          </div>

          <div className={style.block__cont} style={{margin: '38px 0', paddingBottom: '30px'}}>
            <div className={style.block__sub__header}>外观设置</div>
            <div style={{padding: '36px'}}>
              <Row justify="space-around" align="center">
                <Form.Item label="券面名称：" name='couponName' className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请输入券面名称" }]}>
                  <Input placeholder="例如：1元洗车抵用券；不超过12字" disabled maxLength={12}/>
                </Form.Item>
                <Form.Item label="标签：" name='basicCouponTagName' className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请选择标签" }]}>
                  <Input placeholder="请输入" disabled />
                </Form.Item>
                <Form.Item label="面值显示：" name='textDisplay' className={style.form__item} labelCol={{ span: 8 }} rules={[{ required: true, message: "请选择面值显示" }]}>
                  <Radio.Group disabled>
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
                            disabled
                            placeholder="最多2个字"
                            maxLength={2}
                        />
                      </Form.Item> : null
                }
              </Row>
              <Row>
                <Form.Item label="使用说明" name='couponUsageExplain' className={style.form__item__big} rules={[{ required: true, message: "请输入使用说明" }]}>
                  <div dangerouslySetInnerHTML={{__html:couponUsageExplain}} style={{margin: '20px'}} />
                </Form.Item>
              </Row>
              <Row justify="center" align="center">
                <Button onClick={goToBack}>返回</Button>
              </Row>
            </div>
          </div>
        </Form>
      </>
  )
};
export default connect(({ basicCardDetail, editBasicCard }) => ({
  cardDetail: basicCardDetail.cardDetail,
  categoryList: editBasicCard.categoryList,
}))(basicCardDetailPage)
