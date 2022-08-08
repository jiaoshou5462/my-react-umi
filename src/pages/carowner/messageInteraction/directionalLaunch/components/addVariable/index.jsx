import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Form, Button, Modal, Space, message, Checkbox, Divider, Select } from "antd"
import style from "./style.less";
const { Option } = Select;
const addVariable = (props) => {

  let { dispatch, modalInfo, closeMode, getVariableValue } = props;
  // closeMode关闭方法
  const [checkValue, setCheckValue] = useState([])//回显多选框使用 只能用字符串
  const [groupValue, setGroupValue] = useState([])//返回给父组件的数组
  const [index, setIndex] = useState([])//数组下标
  const [allList, setAllList] = useState([])//全部数据
  const [groupValueData, setGroupValueData] = useState({
    groupValue: groupValue,
    templateFieldCode: modalInfo.name
  })//返回给父组件的对象

  useEffect(() => {
    setGroupValueData({
      groupValue: groupValue,
      templateFieldCode: modalInfo.name,
      index, index
    })
  }, [groupValue])

  useEffect(() => {
    setCheckValue(modalInfo.checkedValue)
    setIndex(modalInfo.index)
    let emoList = [];
    modalInfo.allList.map((item, index) => {
      modalInfo.checkedValue.map((v)=>{
        if(item.variable == v){
          emoList.push(item)
        }
      })
    })
    setGroupValue(emoList)
  }, [])

  // 选中多选框组的时候 同时获取checkValue的name信息 返回给父页面使用
  let onChange = (checkValue) => {
    setCheckValue(checkValue)
    if (checkValue.length > 0) {
      let initList = [];
      modalInfo.variableList.map((item, index) => {
        checkValue.map((v, i) => {
          if (item.variable == v) {
            initList.push(item);
            setGroupValue(initList)
          }
        })
      })
    } else {
      setGroupValue([])
    }

  }

  let submitEvent = () => {
    closeMode()
    getVariableValue(groupValueData)
  }

  return (
    <>
      <Modal className={style.modal_wid_height} visible={modalInfo.modalName == 'addVariable'} footer={null} closable={false}>
        <div className={style.change_variable_title}>
          <span className={style.text_variable}>选择变量值</span>
        </div>
        <Divider />
        <div >
          <Checkbox.Group className={style.checkbox_box} onChange={(checkValue) => { onChange(checkValue) }} value={checkValue}>
            {modalInfo.variableList ? modalInfo.variableList.map((v, i) => {
              return <div className={style.checkbox_box_item}><Checkbox value={v.variable}>{v.variableName}</Checkbox></div>
            }) : ''}
          </Checkbox.Group>
        </div>
        <Divider />
        <div className={style.end_variable}>
          <Space align="end">
            <Button type="primary" onClick={() => { submitEvent() }}>确认</Button>
            <Button onClick={() => { closeMode() }} >取消</Button>
          </Space>
        </div>

      </Modal>
    </>
  )
}


export default connect(({ directionalLaunch }) => ({
}))(addVariable)







