import React, { useEffect, useState } from 'react';
import { Steps, message } from 'antd';
import { connect, history } from 'umi';
import styles from './style.less';
const { Step } = Steps;
let steps = [
  {
    title: '基础信息',
    path: "/sale/task/saleTaskModule/info",
    key:0
  },
  {
    title: '设置任务kpi和奖励',
    path: "/sale/task/saleTaskModule/taskreward",
    key:1
  },
  {
    title: '分配员工',
    path: "/sale/task/saleTaskModule/distribution",
    key:2
  },
  {
    title: '完成',
    path: "/sale/task/saleTaskModule/finish",
    key:3
  }
];
let toInt =1;    //数据返回当前已完成步骤
const saleStepsList = (props) => {
  const { dispatch, children } = props;
  let taskDetail = localStorage.getItem('taskDetail');      /*taskDetail 无操作为0， 1为新增，2为编辑 3为查看任务  4为详情 */
  let toCurrent=steps.filter(item => item.path==props.location.pathname );
  const [current, setCurrent] = useState(toCurrent[0].key);
  if(current != toCurrent[0].key){
    setCurrent(toCurrent[0].key);
  }
  //切换步骤
  const appoInt = (int, en) => {
    // if(taskDetail==2 || taskDetail==3 || taskDetail==4) {
    //   if (en.path) {
    //     history.push(`${en.path}?taskId=${history.location.query.taskId}`);
    //     setCurrent(int);
    //   }
    // }
  }
  return (
    <div>
      <div className={styles.steps_main}>
        <Steps current={current}>
          {steps.map((item, index) => (
            <Step key={item.title} title={item.title} onClick={() => appoInt(index, item)} />
          ))}
        </Steps>
      </div>
      {children}
    </div>
  );
};

export default connect(({ }) => ({
}))(saleStepsList);
