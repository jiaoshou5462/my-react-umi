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
const eMaintOrderDetailPage =(props)=>{
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
      type: 'eMaintOrderDetail/getDetail',
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
        <Row className={style.detail_title}>基本信息</Row>
        <Row  align="center">
        <Col span={7} offset={1} className={style.detail_item}>
            <div>订单编号：</div>
            <div>{detail.orderNo }</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>订单状态：</div>
            <div>{detail.orderStatusName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>渠道：</div>
            <div>{detail.channelName}</div>
          </Col>
        </Row>
      </div>

      <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
        <Row className={style.detail_title}>预约信息</Row>
        <Row  align="left">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>车主姓名：</div>
            <div>{detail.customerName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>车主手机号：</div>
            <div>{detail.customerPhone}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>车牌号：</div>
            <div>{detail.plateNo}</div>
          </Col>
          </Row>
        <Row  align="left">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>车型：</div>
            <div>{detail.carModelName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>预约门店：</div>
            <div>{detail.storeName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>预约时间：</div>
            <div>{detail.bookTimeStr}</div>
          </Col>
        </Row>
        <Row  align="left">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>服务项目：</div>
            <div>{detail.productName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>第三方订单ID：</div>
            <div>{detail.providerOrderNo}</div>
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
export default connect(({eMaintOrderDetail})=>({
  detail: eMaintOrderDetail.detail,
}))(eMaintOrderDetailPage)


