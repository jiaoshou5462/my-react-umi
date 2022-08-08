import React,{useEffect, useState} from "react"
import { connect, history } from 'umi'
import {
  Modal,
  Input,
  Cascader,
  InputNumber,
  message
} from "antd"
import style from "./style.less"

const productTagModal =(props)=>{
  let {dispatch, productTagList, tagVisible, onTagChange, checkTagList} = props
  let [visible, setVisible] = useState(false)
  let [list, setList] = useState([])
  let [checkTag, setCheckTag] = useState({})
  let [tagWeight, setTagWeight] = useState(0)
  useEffect(() => {
    getProductTag()
  },[])
  /*获取详请*/
  let getProductTag = () => {
    dispatch({
      type: 'productTagModal/getProductTag',
      payload: {
        method: 'get',
        params: {}
      },
    })
  }
  useEffect(() => {
    setVisible(tagVisible)
  },[tagVisible])
  useEffect(() => {
    if (productTagList.length > 0) {
      productTagList.map(item => {
        item.tagName = item.tagGroupName
        delete item.tagGroupName
        if(item.tagInfos){
          item.tagInfos.map(value => {
            value.tagInfos = value.tagLayers || []
            delete value.tagLayers
            if(value.tagInfos) {
              value.tagInfos.map(index =>{
                index.tagName = index.layerName
                delete index.layerName
              })
            }
          })
        }
      })
      setList(productTagList)
    }
  },[productTagList])
  let onCheckTagChange = (e, value) => {
    setCheckTag(value[2])
  }
  let onTagWeightChange = (e) => {
    setTagWeight(e)
  }
  let onOk = () => {
    if(checkTagList.length === 10){
      message.info('最多添加10个标签')
      return
    }
    if(Object.keys(checkTag).length <= 0){
      message.info('请选择标签')
      return
    }
    if(tagWeight === null){
      message.info('请填写权重')
      return
    }
    checkTag.tagWeight = tagWeight
    onTagChange(checkTag)
  }
  let onCancel = () => {
    onTagChange()
  }
  /*限制数字输入框只能输入整数*/
  let limitNumber = (value) => {
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(/\D/g, '') : ''
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(/\D/g, '') : ''
    } else {
      return null
    }
  }
  return(
    <>
      <Modal
          width={537}
          onOk={onOk}
          okText='确定'
          title="产品标签"
          cancelText='取消'
          visible={visible}
          onCancel={onCancel}
          maskClosable={false}
      >
        <div className={style.modal_box}>
          <div style={{marginBottom: '24px'}}>
            <div className={style.modal_title}>
              <span>*</span>
              选择标签
            </div>
            <Cascader
                options={list}
                placeholder="请选择"
                style={{ width: '20vw' }}
                onChange={onCheckTagChange}
                fieldNames={{
                  label: 'tagName',
                  value: 'id',
                  children: 'tagInfos'
                }}
            />
          </div>
          <div>
            <div className={style.modal_title}>
              <span>*</span>
              标签权重
            </div>
            <InputNumber
                min={0}
                max={5}
                precision={0}
                value={tagWeight}
                parser={limitNumber}
                placeholder="请输入整数"
                formatter={limitNumber}
                style={{ width: '20vw' }}
                onChange={onTagWeightChange}
            />
          </div>
          <div className={style.modal_remark}>
            权重范围为0至5的整数，默认为0，标签权重越高，用户标签匹配越优先
          </div>
        </div>
      </Modal>
    </>
  )
};
export default connect(({productTagModal})=>({
  ...productTagModal
}))(productTagModal)


