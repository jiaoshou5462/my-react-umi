import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { SwiperSlide, Swiper } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Mousewheel } from 'swiper';
SwiperCore.use([Navigation, Pagination, Mousewheel])
import 'swiper/swiper.less'
import "swiper/swiper-bundle.css"
import { Tabs, Form, Input, Table, Select, Row, Space, Button, Col, DatePicker, Upload, Image } from "antd";
import { DownloadOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;
import style from "./style.less";
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')


const rotation = (props) => {
  let { dispatch, rotationList } = props;
  let [imgVisible, setImgVisible] = useState(false)
  let [imgKey, setImgKey] = useState(null)


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
  // 图片点击
  let handleImg = (key) => {
    setImgKey(key)
    setImgVisible(true)
  }

  return (
    <div style={{padding: '30px 50px'}}>
      {
        rotationList && rotationList.length > 0 ? <>
          <Swiper {...swiperSting}>
            {
              rotationList.map((item, key) => {
                return <SwiperSlide key={key} style={{textAlign: 'center'}}>
                  <Image
                    src={item.imageUrl ? item.imageUrl : item.imgUrl}
                    className={style.swiper_img}
                    preview={{visible: false}}
                    // onClick={() => handleImg(key)}
                    onClick={() => setImgVisible(true)}
                  />
                </SwiperSlide>
              })
            }
          </Swiper>
          <div style={{ display: 'none' }}>
            <Image.PreviewGroup preview={{ visible: imgVisible, onVisibleChange: e => setImgVisible(e) }}>
              {
                rotationList.map((item, key) => {
                  // if(imgKey==key)
                  return <Image src={item.imageUrl ? item.imageUrl : item.imgUrl} className={style.swiper_img} />
                })
              }
            </Image.PreviewGroup>
          </div>
        </> : <div className={style.notImg}>暂无案件照片</div>
      }
    </div>
  )
}


export default connect(({  }) => ({

}))(rotation)