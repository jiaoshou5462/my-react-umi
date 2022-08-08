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
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const carWashOrderDetailPage =(props)=>{
  let {dispatch, location, detail, } = props
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
      type: 'carWashOrderDetail/getDetail',
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
            <div>验证码：</div>
            <div>{detail.verifiyCode}</div>
          </Col>
        </Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>车主姓名：</div>
            <div>{detail.customerName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>车主手机号：</div>
            <div>{detail.customerPhone}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>预约门店：</div>
            <div>{detail.bookLocationName}</div>
          </Col>
        </Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>预约日期：</div>
            <div>{detail.bookTime}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>预约时段：</div>
            <div>{detail.bookTimePeriod}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>车牌号：</div>
            <div>{detail.plateNo}</div>
          </Col>
        </Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>车型：</div>
            <div>{detail.carModelName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>车辆年限：</div>
            <div>{detail.carYearName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>完成时间：</div>
            <div>{detail.actualTime}</div>
          </Col>
          {/* <Col span={7} offset={1} className={style.detail_item}>
            <div>服务提供方：</div>
            <div>{detail.providerName}</div>
          </Col> */}
        </Row>
        <Row  align="left">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>完成门店：</div>
            <div>{detail.actualLocationName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item} />
        </Row>
      </div>

      <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
        <Row className={style.detail_title}>卡券信息</Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>卡券ID：</div>
            <div>{detail.orderCard && detail.orderCard.yltCardId}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>卡券种类：</div>
            <div>{detail.orderCard && detail.orderCard.yltCardTypeName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>卡券名称：</div>
            <div>{detail.orderCard && detail.orderCard.yltCardName}</div>
          </Col>
        </Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>卡券状态：</div>
            <div>{detail.orderCard && detail.orderCard.yltCardStatusName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item} />
          <Col span={7} offset={1} className={style.detail_item} />
        </Row>
      </div>

      <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
        <Row className={style.detail_title}>车辆证件照片</Row>
        <div style={{padding: '0 50px'}}>
          {
            detail.imageList && detail.imageList.length > 0 ? <>
              <Swiper {...swiperSting}>
                {
                  detail.imageList.map((item, key) => {
                    return <SwiperSlide style={{textAlign: 'center'}}>
                      <Image.PreviewGroup>
                        <Image
                            src={item.imageUrl}
                            className={style.swiper_img}
                            preview={{visible: false}}
                            onClick={() => setImgVisible(true)}
                        />
                      </Image.PreviewGroup>
                    </SwiperSlide>
                  })
                }
              </Swiper>
              <div style={{ display: 'none' }}>
                <Image.PreviewGroup preview={{ visible: imgVisible, onVisibleChange: vis => setImgVisible(vis) }}>
                  {
                    detail.imageList.map((item, key) => {
                      return <Image src={item.imageUrl} className={style.swiper_img} />
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
export default connect(({carWashOrderDetail})=>({
  detail: carWashOrderDetail.detail,
}))(carWashOrderDetailPage)


