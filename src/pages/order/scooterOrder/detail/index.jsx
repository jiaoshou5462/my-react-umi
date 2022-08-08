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
const scooterOrderDetailPage =(props)=>{
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
      type: 'scooterOrderDetail/getDetail',
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
            <div>工单号：</div>
            <div>{detail.orderInfo &&detail.orderInfo.thirdOrderNo}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>订单号：</div>
            <div>{detail.orderInfo &&detail.orderInfo.orderNo}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>订单状态：</div>
            <div>{detail.orderInfo && detail.orderInfo.orderStatusName}</div>
          </Col>
        </Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>车牌号：</div>
            <div>{detail.orderInfo && detail.orderInfo.plateNo}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>用户姓名：</div>
            <div>{detail.orderInfo && detail.orderInfo.customerName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>手机号：</div>
            <div>{detail.orderInfo && detail.orderInfo.customerPhone}</div>
          </Col>
        </Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>身份证：</div>
            <div>{detail.orderInfo && detail.orderInfo.customerIdentityNo}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>用车天数：</div>
            <div>{detail.orderInfo && detail.orderInfo.rentDays ? detail.orderInfo.rentDays + "天" : ""}</div>
            {/* <div>{detail.orderInfo && detail.orderInfo.rentDays + "天" || null}</div> */}
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>用车类型：</div>
            <div>{detail.orderInfo && detail.orderInfo.rentCarTypeName}</div>
          </Col>
        </Row>
        <Row  align="left">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>预约取车时间：</div>
            <div>{detail.orderInfo && detail.orderInfo.pickupTime}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>预约取车地点：</div>
            <div>{detail.orderInfo && detail.orderInfo.pickupLocationName}</div>
          </Col>
        </Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>预约还车时间：</div>
            <div>{detail.orderInfo && detail.orderInfo.dropoffTime}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>预约还车地点：</div>
            <div>{detail.orderInfo && detail.orderInfo.dropoffLocationName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item} />
        </Row>
        <Row  align="left">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>预约备注：</div>
            <div>{detail.orderInfo && detail.orderInfo.remark}</div>
          </Col>
        </Row>
      </div>

      {/* <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
        <Row className={style.detail_title}>服务信息</Row>
        <Row  align="left">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>服务商：</div>
            <div>{detail.orderInfo && detail.orderInfo.providerName}</div>
          </Col>
          </Row>
        <Row  align="left">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>实际取车时间：</div>
            <div>{detail.orderInfo &&detail.orderInfo.actualPickupTime}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>实际取车地点：</div>
            <div>{detail.orderInfo &&detail.orderInfo.actualPickupLocationName}</div>
          </Col>
        </Row>
        <Row  align="left">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>实际还车时间：</div>
            <div>{detail.orderInfo &&detail.orderInfo.actualDropoffTime}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>实际还车地点：</div>
            <div>{detail.orderInfo &&detail.orderInfo.actualDropoffLocationName}</div>
          </Col>
        </Row>
      </div> */}
    
      <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
        <Row className={style.detail_title}>卡券信息</Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>卡券ID：</div>
            <div>{detail.orderCardList && detail.orderCardList.yltCardId}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>卡券类型：</div>
            <div>{detail.orderCardList && detail.orderCardList.yltCardTypeName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>卡券名称：</div>
            <div>{detail.orderCardList && detail.orderCardList.yltCardName}</div>
          </Col>
        </Row>
      </div>

      <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
        <Row className={style.detail_title}>车辆证件照片</Row>
        <div style={{padding: '0 50px'}}>
          {
            detail.rentOrderImages && detail.rentOrderImages.length > 0 ? <>
              <Swiper {...swiperSting}>
                {
                  detail.rentOrderImages.map((item, key) => {
                    return <SwiperSlide key={key} style={{textAlign: 'center'}}>
                      <Image
                          src={item.imgUrl}
                          className={style.swiper_img}
                          preview={{visible: false}}
                          onClick={() => setImgVisible(true)}
                      />
                    </SwiperSlide>
                  })
                }
              </Swiper>
              <div style={{ display: 'none' }}>
                <Image.PreviewGroup preview={{ visible: imgVisible, onVisibleChange: vis => setImgVisible(vis) }}>
                  {
                    detail.rentOrderImages.map((item, key) => {
                      return <Image src={item.imgUrl} className={style.swiper_img} />
                    })
                  }
                </Image.PreviewGroup>
              </div>
            </> : <div className={style.notImg}>暂无车辆证件照片</div>
          }
        </div>
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
export default connect(({scooterOrderDetail})=>({
  detail: scooterOrderDetail.detail,
}))(scooterOrderDetailPage)


