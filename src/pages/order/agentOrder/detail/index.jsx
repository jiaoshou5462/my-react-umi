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
  Checkbox,
} from "antd"
import style from "./style.less"
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
let vehicleDamageArr = [{
  value: '前杠',
  label: '前杠',
},{
  value: '引擎盖',
  label: '引擎盖',
},{
  value: '车顶',
  label: '车顶',
},{
  value: '右前叶',
  label: '右前叶',
},{
  value: '右前门',
  label: '右前门',
},{
  value: '右后门',
  label: '右后门',
},{
  value: '右后叶',
  label: '右后叶',
},{
  value: '左前叶',
  label: '左前叶',
},{
  value: '左后门',
  label: '左后门',
},{
  value: '左后叶',
  label: '左后叶',
},{
  value: '后盖尾门',
  label: '后盖尾门',
},{
  value: '后杠',
  label: '后杠',
},{
  value: '车前灯',
  label: '车前灯',
},{
  value: '车尾灯',
  label: '车尾灯',
}]
const agentOrderDetailPage =(props)=>{
  let {dispatch, location, detail, } = props
  let [id, setId] = useState(location.state && location.state.objectId || '')
  let [orderType, setOrderType] = useState(0)
  let [caseNo, setCaseNo] = useState('')
  let [vehicleDamageValue, setVehicleDamageValue] = useState([])
  let [certificateVisible, setCertificateVisible] = useState(false)
  let [completedVisible, setCompletedVisible] = useState(false)
  let [damageVisible, setDamageVisible] = useState(false)

  useEffect(() => {
    if(id){
      getDetail()
    }
  },[id])
  useEffect(() => {
    if(Object.keys(detail).length > 0){
      setCaseNo(detail.caseNo)
      setOrderType(detail.orderType)
      let temp = detail.vehicleDamage && detail.vehicleDamage.split(',') || []
      let tempArr = []
      if(temp.length > 0){
        temp.map(item => {
          vehicleDamageArr.map(value => {
            if(item === value.label){
              tempArr.push(item)
            }
          })
        })
      }
      setVehicleDamageValue(tempArr)
    }
  },[detail])
  /*获取详请*/
  let getDetail = () => {
    dispatch({
      type: 'agentOrderDetail/getDetail',
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
            <div>{detail.thirdOrderNo}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>订单编号：</div>
            <div>{detail.orderNo}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>车牌号：</div>
            <div>{detail.plateNo}</div>
          </Col>
        </Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>订单类型：</div>
            <div>{detail.orderTypeName}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>预约取车时间：</div>
            <div>{detail.pickupTime}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>客户电话：</div>
            <div>{detail.customerPhone}</div>
          </Col>
        </Row>
        {
          orderType === 17 || orderType === 30 ? <Row  align="center">
            <Col span={7} offset={1} className={style.detail_item}>
              <div>分配师傅：</div>
              <div>{detail.driverName}</div>
            </Col>
            <Col span={7} offset={1} className={style.detail_item}>
              <div>师傅联系电话：</div>
              <div>{detail.driverPhone}</div>
            </Col>
            <Col span={7} offset={1} className={style.detail_item}>
              <div className={style.detail_item_text}>取车地址：</div>
              <div>{detail.pickupAddress}</div>
            </Col>
          </Row> : null
        }
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>供应商订单编号：</div>
            <div>{detail.outOrderNo}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>订单状态：</div>
            <div>{detail.orderStatusName}</div>
          </Col>
          {
            caseNo ? <Col span={7} offset={1} className={style.detail_item}>
              <div>案件号：</div>
              <div>{caseNo}</div>
            </Col> : <Col span={7} offset={1} className={style.detail_item}/>
          }
        </Row>
        {
          orderType === 15 ? <Row align="center">
            <Col span={7} offset={1} className={style.detail_item}>
              <div>收件人：</div>
              <div>{detail.addressee}</div>
            </Col>
            <Col span={7} offset={1} className={style.detail_item}>
              <div className={style.detail_item_text}>收件地址：</div>
              <div>{detail.addresseeAddress}</div>
            </Col>
            <Col span={7} offset={1} className={style.detail_item}/>
          </Row> : null
        }
      </div>

      <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
        <Row className={style.detail_title}>车辆信息</Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>车牌号：</div>
            <div>{detail.plateNo}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>注册日期：</div>
            <div>{detail.registerDate}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}>
            <div>车架号：</div>
            <div>{detail.vinNo}</div>
          </Col>
        </Row>
        <Row  align="center">
          <Col span={7} offset={1} className={style.detail_item}>
            <div>发动机号：</div>
            <div>{detail.engineNo}</div>
          </Col>
          <Col span={7} offset={1} className={style.detail_item}/>
          <Col span={7} offset={1} className={style.detail_item}/>
        </Row>
      </div>
      {
        detail.orderType === 15 ? <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
          <Row className={style.detail_title}>证件信息</Row>
          <div style={{padding: '0 50px'}}>
            {
              detail.images && detail.images.length > 0 ? <>
                <Swiper {...swiperSting}>
                  {
                    detail.images.map((item, key) => {
                      return (
                          <SwiperSlide key={key} style={{textAlign: 'center'}}>
                            <Image
                                src={item.imageUrl}
                                className={style.swiper_img}
                                preview={{visible: certificateVisible}}
                                onClick={() => setCertificateVisible(true)}
                            />
                          </SwiperSlide>
                      )
                    })
                  }
                </Swiper>
                {
                  certificateVisible ? <div style={{ display: 'none' }}>
                    <Image.PreviewGroup preview={{ visible: certificateVisible, onVisibleChange: (e) =>{setCertificateVisible(e)}}}>
                      {
                        detail.images.map((item, key) => {
                          return <Image src={item.imageUrl} className={style.swiper_img} />
                        })
                      }
                    </Image.PreviewGroup>
                  </div> : null
                }
              </> : <div className={style.notImg}>暂无证件信息</div>
            }
          </div>
        </div> : <>

          <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
            <Row className={style.detail_title}>服务信息</Row>
            <Row  align="center">
              <Col span={7} offset={1} className={style.detail_item}>
                <div>检测场：</div>
                <div>{detail.checkName}</div>
              </Col>
              <Col span={7} offset={1} className={style.detail_item}>
                <div>办理结果备注：</div>
                <div>{detail.remark}</div>
              </Col>
              <Col span={7} offset={1} className={style.detail_item}>
                <div>收车验证码：</div>
                <div>{detail.knockOffCode}</div>
              </Col>
            </Row>
            <div>
              {
                detail.completedPictures && detail.completedPictures.length > 0 ? <>
                  <div className={style.detail_title}>办理完成照片</div>
                  <div style={{padding: '0 50px'}}>
                    <Swiper {...swiperSting}>
                      {
                        detail.completedPictures.map((item, key) => {
                          return <SwiperSlide style={{textAlign: 'center'}}>
                              <Image
                                  src={item.imageUrl}
                                  className={style.swiper_img}
                                  preview={{visible: false}}
                                  onClick={() => setCompletedVisible(true)}
                              />
                          </SwiperSlide>
                        })
                      }
                    </Swiper>
                  </div>
                  {
                    completedVisible ? <div style={{ display: 'none' }}>
                      <Image.PreviewGroup preview={{ visible: completedVisible, onVisibleChange: (e) =>{setCompletedVisible(e)}}}>
                        {
                          detail.completedPictures.map((item, key) => {
                            return <Image src={item.imageUrl} className={style.swiper_img} />
                          })
                        }
                      </Image.PreviewGroup>
                    </div> : null
                  }
                </> : null
              }
            </div>
            <Row  align="center">
              <Col span={24} offset={2} className={style.detail_item}>
                <div>车辆损伤：</div>
                <div>
                  <Checkbox.Group
                      disabled
                      value={vehicleDamageValue}
                      options={vehicleDamageArr}
                  />
                </div>
              </Col>
            </Row>
          </div>
          {
            detail.damagePictures && detail.damagePictures.length > 0 ? <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
              <Row className={style.detail_title}>损伤照片</Row>
              <div style={{padding: '0 50px'}}>
                <Swiper {...swiperSting}>
                  {
                    detail.damagePictures.map((item, key) => {
                      return <SwiperSlide key={key} style={{textAlign: 'center'}}>
                          <Image
                              src={item.imageUrl}
                              className={style.swiper_img}
                              preview={{visible: false}}
                              onClick={() => setDamageVisible(true)}
                          />
                      </SwiperSlide>
                    })
                  }
                </Swiper>
              </div>
              {
                damageVisible ? <div style={{ display: 'none' }}>
                  <Image.PreviewGroup preview={{ visible: damageVisible, onVisibleChange: (e) =>{setDamageVisible(e)}}}>
                    {
                      detail.damagePictures.map((item, key) => {
                        return <Image src={item.imageUrl} className={style.swiper_img} />
                      })
                    }
                  </Image.PreviewGroup>
                </div> : null
              }
            </div> : null
          }
        </>
      }

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
export default connect(({agentOrderDetail})=>({
  detail: agentOrderDetail.detail,
}))(agentOrderDetailPage)


