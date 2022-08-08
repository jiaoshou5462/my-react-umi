import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Form, Button, Modal, Space, message, Checkbox, Divider, Select } from "antd"
import style from "./style.less";
const { Option } = Select;
const addVariable = (props) => {

  let { dispatch, closeMode, modalInfo, getVariableValue } = props;
  const [throngList, setThrongList] = useState([])
  useEffect(() => {
    getThrongListES()

  }, [])

  let getThrongListES = () => {
    dispatch({
      type: 'directionalLaunch/getThrongListES',
      payload: {
        method: 'postJSON',
        params: {
          pageNum: 1,
          pageSize: 9999
        }
      },
      callback: res => {
        if (res.result.code == '0') {
          let list = res.body
          if (modalInfo.checkedPeople || modalInfo.checkedPeople.length > 0) {
            list.map((item, index) => {
              modalInfo.checkedPeople.map((v, index) => {
                if (item.id == v) {
                  item.checkStatus = true
                }
              })

            })
          }
          setThrongList(list)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  let submitEvent = () => {
    let resultList = []
    throngList.map((item, index) => {
      if (item.checkStatus) {
        resultList.push(item)
      }
    })
    getVariableValue(resultList)
    closeMode()
  }

  /*选择人群*/
  let onChooseThrong = (index) => {
    let temp = [...throngList]
    temp.map((item, key) => {
      if (key === index) {
        if (!item.checkStatus) {
          item.checkStatus = true
        } else {
          item.checkStatus = false
        }
      }
    })
    setThrongList(temp)
  }

  let onCancel = () => {
    closeMode()
  }

  return (
    <>
      <Modal
        width={800}
        okText='确定'
        cancelText='取消'
        visible={modalInfo.modalName == 'peopleGroup'}
        title="选择人群"
        closable={false}
        onCancel={onCancel}
        onOk={submitEvent}
        maskClosable={false}
      >
        <div className={style.throng_box}>
          {
            throngList.map((item, key) => {
              return <div key={key} className={item.checkStatus ? style.throng_item_check : style.throng_item} onClick={() => { onChooseThrong(key) }}>
                <div>{item.groupName}</div>
                <div className={style.throng_item_num}>{!item.countNum ? '--' : `${item.countNum}人`}</div>
              </div>
            })
          }
        </div>
        <div className={style.throng_bot}>
          已选：
          {
            throngList.map((item, key) => {
              return <span key={key}>
                {
                  item.checkStatus ? `${item.groupName} ；` : ''
                }
              </span>
            })
          }
        </div>
      </Modal>
    </>
  )
}


export default connect(({ directionalLaunch }) => ({
}))(addVariable)







