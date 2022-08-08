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
  Image,
  Button,
} from "antd"
import style from "./style.less"
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const driveOrderDetailPage =(props)=>{
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
      type: 'driveOrderDetail/getDetail',
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
            <div>订单号：</div>
            <div>{detail.orderNo}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>状态：</div>
            <div>{detail.orderStatusName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>下单时间：</div>
            <div>{detail.createTime}</div>
          </Col>
        </Row>
      </div>

      <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
        <Row className={style.detail_title}>预约信息</Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>工单号：</div>
            <div>{detail.thirdOrderNo}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>保单号：</div>
            <div>{detail.policyNo}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>用户手机号：</div>
            <div>{detail.customerPhone}</div>
          </Col>
        </Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>用户姓名：</div>
            <div>{detail.customerName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>实际用车人：</div>
            <div>{detail.actualName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>用车人手机：</div>
            <div>{detail.actualPhone}</div>
          </Col>
        </Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>车牌号：</div>
            <div>{detail.plateNo}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>出发时间：</div>
            <div>{detail.startTime}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>出发地点：</div>
            <div>{detail.customerAddress}</div>
          </Col>
        </Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>到达地点：</div>
            <div>{detail.destAddress}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>订单备注：</div>
            <div>{detail.internalRemark}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item} />
        </Row>
      </div>

      {/* <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
        <Row className={style.detail_title}>服务商信息</Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>服务商：</div>
            <div>{detail.providerName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>司机姓名：</div>
            <div>{detail.driverName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>司机手机号：</div>
            <div>{detail.driverPhone}</div>
          </Col>
        </Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>接单时间：</div>
            <div>{detail.acceptTime}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>到达时间：</div>
            <div>{detail.arriveTime}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>出发时间：</div>
            <div>{detail.startTime}</div>
          </Col>
        </Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>完成时间：</div>
            <div>{detail.finishTime}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item} />
          <Col span={7} offset={1} className={style.detail_item} />
        </Row>
      </div> */}

      <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
        <Row className={style.detail_title}>卡券信息</Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>券码：</div>
            <div>{detail.orderCard && detail.orderCard.yltCardId}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>卡券类型：</div>
            <div>{detail.orderCard && detail.orderCard.yltCardTypeName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>券名：</div>
            <div>{detail.orderCard && detail.orderCard.yltCardName}</div>
          </Col>
        </Row>
      </div>

      <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
        <Row className={style.detail_title}>照片</Row>
        <div style={{padding: '0 50px'}}>
          {
            detail.orderImages && detail.orderImages.length > 0 ? <>
              <Swiper {...swiperSting}>
                {
                  detail.orderImages.map((item, key) => {
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
                    detail.orderImages.map((item, key) => {
                      return <Image src={item.imgUrl} className={style.swiper_img} />
                    })
                  }
                </Image.PreviewGroup>
              </div>
            </> : <div className={style.notImg}>暂无照片</div>
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
export default connect(({driveOrderDetail})=>({
  detail: driveOrderDetail.detail,
}))(driveOrderDetailPage)


