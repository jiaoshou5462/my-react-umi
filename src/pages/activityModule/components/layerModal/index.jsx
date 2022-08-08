import React, { useEffect, useState } from 'react';
import { connect ,history} from 'umi';
import { Modal, Button, Space } from 'antd';

const layerModals = (props) => {
  let { dispatch, iscancal, onClickCancel,isstopback,isstepint } = props;
  //取消弹窗
  let [isModalVisible,setSsModalVisible] = useState(false);

  //上一步弹窗
  let [isStepVisible,setIsStepVisiblee] = useState(false);
  let [stepInts,setStepInts] = useState(0);

  let handleOk=()=>{
    setSsModalVisible(false)
    onClickCancel(false);
    history.replace({
      pathname: '/activityConfig/activityList'
    })
  };
  let handleCancel=()=>{
    onClickCancel(false)
    setSsModalVisible(false)
    setIsStepVisiblee(false);
  }
  let stepeOk=()=>{
    if(stepInts==1){
      history.push("/activityConfig/activityList/activityModule/info");
    }else if(stepInts==2){
      history.push("/activityConfig/activityList/activityModule/shape");
    }else if(stepInts==3){
      history.push("/activityConfig/activityList/activityModule/setPage");
    }else if(stepInts==4){
      history.push("/activityConfig/activityList/activityModule/deploy");
    }
  }
  useEffect(() => {
    if(iscancal){
      setSsModalVisible(true)
    }
    if(isstopback){
      setIsStepVisiblee(true)
    }
    if(isstepint){
      setStepInts(isstepint)
    }
  },[iscancal,isstopback,isstepint])

  return (
    <>
      {/* 取消弹窗 */}
      <Modal title="提示" visible={isModalVisible} okText="确认" cancelText="取消" onOk={handleOk} onCancel={handleCancel}>
        <p>否确定返回列表页？</p>
      </Modal>

        {/* 上一步弹窗 */}
        <Modal title="提示" visible={isStepVisible} okText="确认" cancelText="取消" onOk={stepeOk} onCancel={handleCancel}>
        <p>是否确定切换上一步？</p>
      </Modal>
    </>
  )
}

export default layerModals;