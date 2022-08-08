import React, { useEffect, useState } from 'react';
import {Button} from 'antd';
import { connect ,history} from 'umi';
import LayerModal from '../components/layerModal';   //取消、上一步弹窗
import { CheckOutlined } from '@ant-design/icons';
import styles from './style.less';

const activitDeploys = (props) => {
  let { dispatch } = props;
  //取消弹窗
  let [isCancelModal, setIsCancelModal] = useState(false);
  let setIsCancel=()=>{
    setIsCancelModal(true);
  }
  let onClickCancel =(e) => {
    setIsCancelModal(false);
    setIsStepBack(false);
  }
  //上一步
  let [isStepBack, setIsStepBack] = useState(false);
  let [isStepInt, setIsStepInt] = useState(0);   //跳转对应页
  let setStepBack=(i)=>{
    setIsStepInt(i);
    setIsStepBack(true);
  }
  //下一步
  let setStepNext=(i)=>{
    history.push("/activityConfig/activityList/activityModule/finish");
  }

  useEffect(() => {
   
  }, []);
  return (
    <div className={styles.block__cont}>
       <LayerModal iscancal={isCancelModal} onClickCancel={onClickCancel} isstopback={isStepBack} isstepint={isStepInt}/>
      <div className={styles.deploy_mian}>
                <img src={require('../../../assets/activity/shape_5.png')} ></img>
                <h4>暂无配置信息，敬请期待！</h4>
                <p>暂无相关配置信息，请前往下一步吧</p>
              </div>
          <div className={styles.wrap_bom}>
            <Button onClick={setIsCancel}>取消</Button>
            <Button onClick={setStepBack.bind(this,3)}>上一步</Button>
            <Button type="primary" onClick={setStepNext}>下一步</Button>
          </div>
    </div>
  )
}
export default connect(({ activityDeploy, loading }) => ({

}))(activitDeploys);