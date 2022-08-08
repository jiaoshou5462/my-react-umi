import React, { useEffect, useState } from "react"
import { connect } from 'umi'
import SwiperCore, {
  Navigation,
  Pagination,
  Mousewheel
} from 'swiper';
SwiperCore.use([Navigation, Pagination, Mousewheel])
import 'swiper/swiper.less';
import "swiper/swiper-bundle.css"
import {
  Modal,
  message
} from "antd"
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const ConfirmModal = (props) => {
  let statusNoT = 0; //启、停状态反转传值
  let { dispatch, templateNo,statusNo,moduleType,confirmVisible,onCallbackSetSales } = props
  let [visible, setVisible] = useState(false) //弹窗状态

  useEffect(() => {
    setVisible(confirmVisible)
  }, [confirmVisible])

/*关闭*/
let onCancel = () => {
  onCallbackSetSales(false)
}
/*确认*/
let onOk = () => {
  if (moduleType == 1) {
    statusNoT = 2
    stopUp()
  }else if (moduleType == 2) {
    statusNoT = 1
    stopUp()
  }else{
    deleteUp()
  }
}

/*停用*/
  let stopUp = () => {
    dispatch({
      type: "sceneTemplate/stop",
      payload: {
        method: 'postJSON',
        params: {
          sceneTemplateId:templateNo,
          status:statusNoT
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          onCallbackSetSales(true)
          message.success('状态修改成功!')
        } else {
          onCallbackSetSales(false)
          message.error(res.result.message)
        }
      }
    })
  }

  /*删除*/
  let deleteUp = () => {
    dispatch({
      type: "sceneTemplate/delete",
      payload: {
        method: 'delete',
          sceneTemplateId:templateNo,
      },
      callback: (res) => {
        if (res.result.code === '0') {
          onCallbackSetSales(true)
          message.success('删除成功!')
        } else {
          onCallbackSetSales(false)
          message.error(res.result.message)
        }
      }
    })
  }

  return (
    <Modal
    onOk={onOk}
    onCancel={onCancel}
    title={
      moduleType == 1?<div>
          启用场景模板
        </div>
        : moduleType == 2?<div>
          停用场景模板
        </div>
        : <div>
          删除场景模板
        </div>
    }
    width={400}
    destroyOnClose
    visible={visible}
    centered={true}
    keyboard={false}
    maskClosable={false}
    >
      {
        moduleType == 1?<div>
          请确认是否启用当前场景模板
        </div>
        : moduleType == 2?<div>
          请确认是否停用当前场景模板
        </div>
        : <div>
          请确认是否删除当前场景模板
        </div>
      }
    </Modal>
  )
};
export default connect(({  }) => ({
}))(ConfirmModal)


