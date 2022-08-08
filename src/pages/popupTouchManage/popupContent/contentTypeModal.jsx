import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {
  Modal,
  message,
  Button
} from "antd"
import style from "./modalStyle.less"
const contentTypePage = (props) => {
  let { dispatch, contentTypeVisible, closeModal, editContentType, typeItem } = props;
  // 1:图片 2：图片+按钮 3：图片+文字+按钮 4：文字+按钮
  let [listOP, setListOP] = useState([
    { type: 1, title: '图片', isChoose: false },
    // { type: 2, title: '图片+按钮', btnValue: '示例按钮', isChoose: false, },
    // { type: 3, title: '图片+文字+按钮', btnValue: '示例按钮', contName: '新人好礼', contVal: '本次活动仅限“新注册会员”参与，活动时间内点击按钮参加活动，即可获得新人好礼，数量有限，先到先得～', isChoose: false },
    // { type: 4, title: '文字+按钮', btnValue: '示例按钮', contName: '新人好礼', contVal: '本次活动仅限“新注册会员”参与，活动时间内点击按钮参加活动，即可获得新人好礼，数量有限，先到先得～', isChoose: false },
  ]);
  let [checkTypeItem, setCheckTypeItem] = useState({});//选中的item
  useEffect(() => {
    if (history.location.query.type == 'edit') {//编辑时，反显选中type
      let toListOP = JSON.parse(JSON.stringify(listOP));
      toListOP = toListOP.map((item) => {
        if (Object.keys(typeItem).length) {
          return item.type == typeItem.type ? typeItem : item
        } else {
          if(!Object.keys(checkTypeItem).length){
            if (item.type == editContentType) {//第一次
              item.isChoose = true;
              setCheckTypeItem(item);
            }
            return item;
          }
        }
      })
      setListOP(toListOP)
    } else {//新增时，多次选时反显上一次选中type
      if (Object.keys(typeItem).length) {
        let toListOP = JSON.parse(JSON.stringify(listOP));
        toListOP = toListOP.map((item) => {
          return item.type == typeItem.type ? typeItem : item
        })
        setListOP(toListOP)
      }
    }
  }, [typeItem])

  // 点击选择
  const choose = (item, index) => {
    let toListOP = JSON.parse(JSON.stringify(listOP));
    toListOP = toListOP.map((items) => {
      if (item.type == items.type) {
        items.isChoose = true;
        setCheckTypeItem(items);
      } else {
        items.isChoose = false;
      }
      return items;
    })
    setListOP(toListOP)
  }

  let saveOk = () => {
    closeModal()
    checkedTypeData()
  }

  let checkedTypeData = () => {
    dispatch({
      type: 'popupContentManage/setTypeData',
      payload: {
        typeItem: checkTypeItem,
        isUpdate: true//编辑进入时判断使用原本的还是选择过后的
      }
    })
  }
  /*关闭*/
  let onCancel = () => {
    closeModal()
  }
  return (
    <>
      <Modal
        width='1180px'
        title="选择内容类型"
        visible={contentTypeVisible}
        onOk={saveOk}
        onCancel={onCancel}
      >
        <div className={style.contType_box}>
          {/* {
            console.log(listOP, 'listOP')
          } */}
          {
            listOP.length > 0 && listOP.map((item, index) => {
              return <div className={style.contType_item}>
                <div className={style.contType_header}>
                  <img className={style.contType_bgImg} src={require('@/assets/popupTitle.png')} />
                  <div className={style.contType_title}>{item.title}</div>
                </div>
                <div className={style.contType_content}>
                  {
                    item.type == 1 || item.type == 2 ?
                      <img className={style.contType_img} src={require('@/assets/advertImg.png')} />
                      : item.type == 3 ?
                        <img className={style.contType_minimg} src={require('@/assets/advertMinImg.png')} />
                        : ''
                  }
                  {item.contName ? <h4 style={{ lineHeight: '66px' }}>{item.contName}</h4> : ''}
                  {item.contVal ? <p style={{ height: '60px' }} >{item.contVal}</p> : ''}
                  <div style={{ marginTop: '30px', height: '80px' }}>
                    {item.btnValue ? <Button type="primary" shape="round" size='large'>{item.btnValue}</Button> : ''}
                  </div>
                </div>
                <div className={style.contType_chooseBtn}>
                  {
                    item.isChoose ?
                      <Button type="primary" disabled={checkTypeItem.isChoose || item.isChoose || typeItem.isChoose ? true : false}>已选择</Button> :
                      <Button type="primary" onClick={() => { choose(item, index) }}>选择</Button>
                  }
                </div>
              </div>
            })
          }
        </div>
      </Modal>
    </>
  )
}
export default connect(({ popupContentManage }) => ({
  typeItem: popupContentManage.typeItem,
}))(contentTypePage)
