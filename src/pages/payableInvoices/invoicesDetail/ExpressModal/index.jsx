import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import { SwiperSlide, Swiper } from 'swiper/react';
import { SwapRightOutlined, CaretDownFilled, CheckCircleFilled } from '@ant-design/icons';
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
  Button,
  Modal,
  Table,
  Descriptions,
  message, Timeline,
} from "antd"
import style from "./style.less"
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
let list = [];
const ExpressModal = (props) => {
  let { dispatch, templateNo, fPhoneNo, detailsVisible, onCallbackSetSales } = props
  let [visible, setVisible] = useState(false) //弹窗状态
  const [detail, setDetail] = useState({});//弹窗详情
  const [senceTemplateListData, setSenceTemplateListData] = useState([]);// 编辑、启动时获取变量的Data信息

  useEffect(() => {
    setVisible(detailsVisible)
    getDetail()
  }, [detailsVisible])
  /*获取详请*/
  let getDetail = () => {
    console.log(templateNo, fPhoneNo, detailsVisible)
    dispatch({
      type: 'payableInvoicesModel/getExpressDetail',
      payload: {
        method: 'postJSON',
        params: {
          expressNumber: templateNo,
          billId: fPhoneNo,
        }
      },
      callback: res => {
        if (res.result.code == '0') {
          console.log(res.body)
          setDetail(res.body[0])
          setSenceTemplateListData(res.body[0].routes)
          list = res.body[0].routes
        } else {
          message.error(res.result.message)
        }
      }
    })
  }


  /*关闭*/
  let onCancel = () => {
    onCallbackSetSales(false)
  }
  return (
    <Modal
      onCancel={onCancel}
      width={"50%"}
      destroyOnClose
      visible={visible}
      centered={true}
      keyboard={false}
      maskClosable={false}
      title={"快递信息"}
      footer={null}
    >
      {
        senceTemplateListData.length == 0 ?
          <div>
            <div>快递单号：
              <span>{detail.mailNo}</span>
            </div>
            <div>
              <span>请通过快递单号自行查询快递信息</span>
            </div>
          </div>
          :
          <div>
            <div className={style.expressNumber}>快递单号 {detail.mailNo}</div>

            <div className={style.cityTitle}>
              {
                detail.jCity != null ?
                  <div className={style.city}>
                    <span className={style.cityL}>{detail.jCity}</span>
                    <SwapRightOutlined />
                    <span className={style.cityR}>{detail.dCity}</span>
                  </div>
                  :
                  ""
              }
              <div className={style.signTime}>签收时间：{detail.signinTm}</div>
            </div>

            <div className={style.routes}>
              <div className={style.routesText}>
                <Timeline>
                  {
                    senceTemplateListData.map((item, index) => {
                      return <>
                        {
                          index == 0 || item.sfStatus == 5 ?
                            <div className={style.QsTitleF}>
                              <Timeline.Item dot={<img src={require('../../../../assets/signFor.png')} /> }>
                                <div className={style.QsTitle1}>
                                  <div >
                                    <span className={style.type}>{item.sfStatusName}</span> <span className={style.typeTime}>{item.acceptTime}</span>
                                  </div>
                                  <div>
                                    <span >{item.remark}</span>
                                  </div>
                                </div>
                              </Timeline.Item>
                            </div>
                            :
                            <div className={style.QsTitle}>
                              <Timeline.Item >
                                <div className={style.QsTitle1}>
                                  <div>
                                    <span className={style.type1}>{item.sfStatusName}</span> <span className={style.typeTime1}>{item.acceptTime}</span>
                                  </div>
                                  <div>
                                    <span className={style.typeTimeT}>{item.remark}</span>
                                  </div>
                                </div>
                              </Timeline.Item>
                            </div>

                        }

                      </>
                    })

                  }
                </Timeline>
              </div>
            </div>
          </div>
      }

    </Modal>
  )
};
export default connect(({ }) => ({
}))(ExpressModal)


