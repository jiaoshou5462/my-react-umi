import React,{useEffect, useState} from "react"
import { connect,history } from 'umi'
import { SwiperSlide, Swiper } from 'swiper/react';
import SwiperCore, {
  Navigation,
  Pagination,
  Mousewheel
} from 'swiper';
SwiperCore.use([Navigation, Pagination, Mousewheel])
import 'swiper/swiper.less'
import "swiper/swiper-bundle.css"
import {
  Row,
  Col,
  Form,
  Input,
  Image,
  DatePicker,
} from "antd"
import BaiDuMap from '../baiDuMap'
import style from "./style.less"
const { TextArea } = Input
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const serviceModalPage =(props)=>{
  let {dispatch, detail} = props
  let [form] = Form.useForm()
  let [imgVisible, setImgVisible] = useState(false)
  useEffect(() => {
    dispatch({
      type: 'orderPublic/onReset',
      flag: 5
    })
  },[])
  useEffect(() => {
    if(Object.keys(detail).length > 0){
      let caseWorkSheet = detail.caseWorkSheet || {}
      let torDriverPosition = detail.torDriverPosition || {}
      let data = {
        ...detail,
        ...caseWorkSheet,
        ...torDriverPosition,
        leaveTime: caseWorkSheet.leaveTime ? moment(caseWorkSheet.leaveTime).format('YYYY-MM-DD HH:mm:ss') : '',
        arriveTime: caseWorkSheet.arriveTime ? moment(caseWorkSheet.arriveTime).format('YYYY-MM-DD HH:mm:ss') : '',
        finishTime: caseWorkSheet.leaveTime ? moment(caseWorkSheet.finishTime).format('YYYY-MM-DD HH:mm:ss') : '',
      }
      form.setFieldsValue(data)
    }else {
      form.setFieldsValue()
    }
  },[detail])

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
      <>
        {/* <div className={style.block__cont_bottom}>
          <BaiDuMap
              caseId={detail.id}
              caseDetail={detail}
              driverId={detail.driverId}
          />
        </div> */}
        <div className={style.block__cont_top} >
        <div className={style.block__header}><span>照片信息</span></div>
          {/* <Row className={style.detail_title}>案件照片</Row> */}
          <div style={{padding: '0 30px',marginTop:'24px',marginBottom:'24px'}}>
            {
              detail.imageResultList && detail.imageResultList.length > 0 ? <>
                <Swiper {...swiperSting}>
                  {
                    detail.imageResultList.map((item, key) => {
                      return <SwiperSlide key={key} style={{textAlign: 'center'}}>
                        <Image
                            src={item.imageUrl}
                            className={style.swiper_img}
                            preview={{visible: false}}
                            onClick={() => setImgVisible(true)}
                        />
                      </SwiperSlide>
                    })
                  }
                </Swiper>
                <div style={{ display: 'none' }}>
                  <Image.PreviewGroup preview={{ visible: imgVisible, onVisibleChange: e => setImgVisible(e) }}>
                    {
                      detail.imageResultList.map((item, key) => {
                        return <Image src={item.imageUrl} className={style.swiper_img} />
                      })
                    }
                  </Image.PreviewGroup>
                </div>
              </> : <div className={style.notImg}>暂无案件照片</div>
            }
          </div>
        </div>

        {/* <Form form={form}>

          {
            detail.caseWorkSheet && Object.keys(detail.caseWorkSheet).length > 0 ? <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
              <Row className={style.detail_title}>服务完成信息</Row>
              <Row className={style.row_box}>
                <Col span={8}>
                  <div style={{display: 'flex',width: '100%'}}>
                    <div className={style.form__item}>出发地到救援地行驶里程:</div>
                    <div className={style.form__item_div}>
                      <Input placeholder="暂无" value={detail.caseWorkSheet.arrivedDistance} disabled suffix="KM"/>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{display: 'flex',width: '100%'}}>
                    <div className={style.form__item}>救援地到目的地行驶里程:</div>
                    <div className={style.form__item_div}>
                      <Input placeholder="暂无" value={detail.caseWorkSheet.trailDistance}  disabled suffix="KM"/>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{display: 'flex',width: '100%'}}>
                    <div className={style.form__item}>目的地返回驻点行驶里程:</div>
                    <div className={style.form__item_div}>
                      <Input placeholder="暂无" value={detail.caseWorkSheet.returnDistance}  disabled suffix="KM"/>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className={style.row_box} style={{marginTop: '20px'}}>
                <Col span={8}>
                  <Form.Item label="出发时间" name="leaveTime" labelCol={{flex: '0 0 120px'}}>
                    <Input placeholder="暂无" disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="到达时间" name="arriveTime" labelCol={{flex: '0 0 120px'}}>
                    <Input placeholder="暂无" disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="完成时间" name="finishTime" labelCol={{flex: '0 0 120px'}}>
                    <Input placeholder="暂无" disabled />
                  </Form.Item>
                </Col>
              </Row>
            </div> : null
          }

          <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
            <Row className={style.detail_title}>服务实施人员调派信息</Row>
            <Row className={style.row_box}>
              <Col span={8}>
                <Form.Item label="姓名" name="driverName" labelCol={{flex: '0 0 120px'}}>
                  <Input placeholder="暂无" disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="电话" name="driverPhone" labelCol={{flex: '0 0 120px'}}>
                  <Input placeholder="暂无" disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="救援车辆" name="carNumber" labelCol={{flex: '0 0 120px'}}>
                  <Input placeholder="暂无" disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="服务商" name="providerName" labelCol={{flex: '0 0 120px'}}>
                  <Input placeholder="暂无" disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="到达时间" name="estimateTime" labelCol={{flex: '0 0 120px'}}>
                  <Input placeholder="暂无" disabled suffix="分钟"/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="特殊工具" name="specialTool" labelCol={{flex: '0 0 120px'}}>
                  <Input placeholder="暂无" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="附言" name='memo' labelCol={{flex: '0 0 120px'}}>
                  <TextArea rows={5} placeholder="暂无" disabled/>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form> */}
      </>
  )
};
export default connect(({serviceModal})=>({
}))(serviceModalPage)
