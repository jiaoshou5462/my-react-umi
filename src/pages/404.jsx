import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';
import bg404 from '@/assets/login/404.png';
import tips404 from '@/assets/login/404_tips.png';
import styles from './404.less';

const NoFoundPage = () => (
  // <Result
  //   status="404"
  //   title="404"
  //   subTitle="Sorry, the page you visited does not exist."
  //   extra={
  //     <Button type="primary" onClick={() => history.push('/')}>
  //       Back Home
  //     </Button>
  //   }
  // />
  <div className={styles.box}>
    <img src={bg404} alt="" className={styles.img_bg} />
    <img src={tips404} alt="" className={styles.img_tips} />
    <p className={styles.info}>更多模块即将上线，敬请期待</p>
  </div>
);

export default NoFoundPage;
