import React, { useEffect, useState } from "react"
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
  Button,
  Modal,
  Table,
  Descriptions,
} from "antd"
import style from "./style.less"
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const DetailsModal = (props) => {
  let { dispatch, templateNo, detailsVisible, onCallbackSetSales } = props
  let [visible, setVisible] = useState(false) //弹窗状态
  const [detail, setDetail] = useState({});//弹窗详情
  const [senceTemplateListData, setSenceTemplateListData] = useState(null);// 编辑、启动时获取变量的Data信息

  useEffect(() => {
    setVisible(detailsVisible)
    if (detailsVisible) {
      getDetail()
    }
  }, [detailsVisible])
  /*获取详请*/
  let getDetail = () => {
    dispatch({
      type: 'messageHistory/getListDetail',
      payload: {
        method: 'get',
        params: {
          messageId: templateNo
        }
      },
      callback: res => {
        if (res.result.code == '0') {
          setDetail(res.body)
          setSenceTemplateListData(res.body.sceneTemplateDetail.sceneTemplateVariableList)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  let renderColumns = () => {
    return (
      [{
        title: '调用场景',
        dataIndex: 'callSceneName',
        align: 'center',
        fixed: 'left',
        width: 100,
      }, {
        title: '发送次数',
        dataIndex: 'callCount',
        align: 'center',
        fixed: 'right',
        width: 100,
      }]
    )
  }

  /*关闭*/
  let onCancel = () => {
    onCallbackSetSales(false)
  }
  return (
    <Modal
      onCancel={onCancel}
      width={"90%"}
      destroyOnClose
      visible={visible}
      centered={true}
      keyboard={false}
      maskClosable={false}
      footer={
        [
          <Button onClick={onCancel}>
            关闭
          </Button>
        ]
      }
    >
      <div>
        <div className={style.block__cont} style={{ margin: '30px' }}>
          <div className={style.block__header}>
            <span>消息详情</span>
          </div>
          <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
            <Descriptions.Item label="场景消息分类">{detail && detail.sceneTypeStr}</Descriptions.Item>
            <Descriptions.Item label="场景模板">{detail && detail.sceneTemplateName}</Descriptions.Item>
            <Descriptions.Item label="任务名称">{detail && detail.taskName}</Descriptions.Item>
          </Descriptions>
          <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
            <Descriptions.Item label="触发类型">{detail && detail.triggerTypeStr}</Descriptions.Item>
            <Descriptions.Item label="发送时间">{detail && detail.sendTime}</Descriptions.Item>
            <Descriptions.Item label="发送内容">
            <div className={style.big_bg_box}>
                <div className={style.bg_box}>
                <div className={style.pre_text}>
                  <div className={style.title_template}>{detail.sceneTemplateDetail && detail.sceneTemplateDetail.templateTitle}</div>
                  {senceTemplateListData?senceTemplateListData.map((item, index) => {
                        return <div>
                          <span>{item.content}</span>
                        </div>
                    }):''
                  }
                </div>
                </div>
              </div>
            </Descriptions.Item>
          </Descriptions>
        </div>

        <div className={style.block__cont} style={{ margin: '30px' }}>
          <div className={style.block__header}>
            <span>接收人详情</span>
          </div>
          <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
            <Descriptions.Item label="姓名">{detail.receiverInfo && detail.receiverInfo.customerName}</Descriptions.Item>
            <Descriptions.Item label="openid">{detail.receiverInfo && detail.receiverInfo.openId}</Descriptions.Item>
            <Descriptions.Item label="手机号">{detail.receiverInfo && detail.receiverInfo.mobilePhoneReal}</Descriptions.Item>
          </Descriptions>
          <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
            <Descriptions.Item label="身份证">{detail.receiverInfo && detail.receiverInfo.identityNo}</Descriptions.Item>
            <Descriptions.Item label="送达时间">{detail.receiverInfo && detail.receiverInfo.receiveTime}</Descriptions.Item>
            <Descriptions.Item label="送达结果">{detail.receiverInfo && detail.receiverInfo.messageStatusStr}</Descriptions.Item>
          </Descriptions>
          <Descriptions column={3} labelStyle={{ marginLeft: '20px', marginBottom: '20px' }}>
            <Descriptions.Item label="查看时间">{detail.receiverInfo && detail.receiverInfo.readTime}</Descriptions.Item>
          </Descriptions>
        </div>

      </div>
    </Modal>
  )
};
export default connect(({  }) => ({
}))(DetailsModal)


