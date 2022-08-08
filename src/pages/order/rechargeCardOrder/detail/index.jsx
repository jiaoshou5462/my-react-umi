import React,{useEffect, useState} from "react"
import { connect, history } from 'umi'
import { SwiperSlide, Swiper } from 'swiper/react';
import SwiperCore, {
  Navigation,
  Pagination,
  Mousewheel
} from 'swiper';
SwiperCore.use([Navigation, Pagination, Mousewheel])
import 'swiper/swiper.less';
import "swiper/swiper-bundle.css"
import {
  Row,
  Col,
  Space,
  Button,
  Image,
} from "antd"
import style from "./style.less"
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const rechargeCardOrderDetailPage =(props)=>{
  let {dispatch, location, detail} = props
  let [id, setId] = useState(location.state && location.state.objectId || '')
  let [imgVisible, setImgVisible] = useState(false)
  useEffect(() => {
    if(id){
      getDetail()
    }
  },[id])

  /*获取详请*/
  let getDetail = () => {
    dispatch({
      type: 'rechargeCardOrderDetail/getDetail',
      payload: {
        method: 'postJSON',
        params: {
          id
        }
      },
    })
  }
  /*Swiper属性设置*/
  let swiperSting = {
    cssMode: true,
    mousewheel: true,
    navigation: true,
    watchOverflow: true,
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 20,
    className: style.mySwiper_box,
  }
  return(
    <div>
      <div className={style.block__cont} style={{paddingBottom: '30px'}}>
        <div className={style.block__header}>
          <span>订单详情</span>
        </div>
        <Row className={style.detail_title}>订单信息</Row>
        <Row  align="center">
        <Col span={7} offset={1} className={style.detail_item}>
            <div>订单编号：</div>
            <div>{detail.orderNo}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>下单时间：</div>
            <div>{detail.createTime}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>充值卡号：</div>
            <div>{detail.oilCardNo}</div>
          </Col>
        </Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>充值面额：</div>
            <div>{detail.productPrice}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>订单状态：</div>
            <div>{detail.orderStatusName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>手机号：</div>
            <div>{detail.customerPhone}</div>
          </Col>
        </Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>充值渠道：</div>
            <div>{detail.providerName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>支付金额：</div>
            <div>{detail.payAmount}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>支付状态：</div>
            <div>{detail.payStatusName}</div>
          </Col>
        </Row>
      </div>

      <div className={style.block__cont} style={{padding: '30px 50px',marginTop: '20px'}}>
        <Row justify="space-around" align="left">
          <Space size={22}>
            <Button className={style.btn_radius} htmlType="button" onClick={()=>{history.goBack()}}>返回</Button>
          </Space>
        </Row>
      </div>
    </div>
  )
};
export default connect(({rechargeCardOrderDetail})=>({
  detail: rechargeCardOrderDetail.detail,
}))(rechargeCardOrderDetailPage)


