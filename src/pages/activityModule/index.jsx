import React, { useEffect, useState } from 'react';
import { Steps, message } from 'antd';
import { connect, history } from 'umi';
import styles from './style.less';
const { Step } = Steps;
let steps = [
  {
    title: '活动信息',
    content: "设置活动基本信息",
    path: "/activityConfig/activityList/activityModule/info",
    key:0
  },
  {
    title: '活动形式及规则',
    content: "活动内容配置",
    path: "/activityConfig/activityList/activityModule/shape",
    key:1
  },
  {
    title: '活动页面',
    content: "活动页面个性化UI",
    path: "/activityConfig/activityList/activityModule/setPage",
    key:2
  },
  // {
  //   title: '部署推广',
  //   content: "活动布署推广",
  //   key:3,
  //   path: "/activityConfig/activityList/activityModule/deploy",
  // },
  {
    title: '完成',
    content: "",
    path: "/activityConfig/activityList/activityModule/finish",
    key:4
  }
];
const stepsList = (props) => {
  let toInt =1;    //数据返回当前已完成步骤
  let activityDetail = localStorage.getItem('activityDetail');
  activityDetail=='0'? toInt = parseInt(localStorage.getItem('activityStep')?localStorage.getItem('activityStep'):1):toInt = 4;
  let toCurrent=steps.filter(item => item.path==props.location.pathname );
  if((parseInt(toCurrent[0].key)+1)>toInt){
    toInt=parseInt(toCurrent[0].key)+1;
    localStorage.setItem('activityStep',toInt)
  }
  const { dispatch, children } = props;
  const [current, setCurrent] = useState(toCurrent[0].key);
  if(current != toCurrent[0].key){
    setCurrent(toCurrent[0].key);
  }
  //切换步骤
  const appoInt = (int, en) => {
    if (toInt > int) {
      setCurrent(int);
      if (en.path) {
        history.push(en.path);
      }
    }
  }
  return (
    <div>
      <div className={styles.steps_main}>
        <Steps current={current}>
          {steps.map((item, index) => (
            <Step key={item.title} title={item.title} onClick={() => appoInt(index, item)} />
          ))}
        </Steps>
        {/* <div className={styles.steps_content}>
          {steps[current].content}
        </div> */}
      </div>
      {children}
    </div>
  );
};

export default connect(({ }) => ({
}))(stepsList);
