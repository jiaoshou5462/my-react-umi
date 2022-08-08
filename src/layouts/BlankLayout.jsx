import React,{useEffect} from 'react';
import { connect,Helmet,history } from 'umi';
import styles from './BlankLayout.less';
import { ConfigProvider } from 'antd';
import 'moment/locale/zh-cn';
import '@/css/blank.less';
import locale from 'antd/lib/locale/zh_CN';
// import { loadingShow, loadingHide } from '@/utils/loading.js';

const Layout = (props) => {




  const { children,route,history,dispatch ,pageMinWidth} = props;
  let filter = route.routes.filter(item=>{
    return item.path == history.location.pathname;
  })[0];
  let title = filter && (filter.title ? filter.title : filter.name);
  
  let noReplace = ['/login','/forgetPwd'];
  if(!localStorage.getItem('tokenObj') && !noReplace.includes(history.location.pathname)) {
    history.replace('/login');
  }


  return (
    <ConfigProvider locale={locale}>
      <div className={styles.container} style={{minWidth: pageMinWidth || '1200px'}}>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <div className={styles.container_content}>{children}</div>
		
      </div>
    </ConfigProvider>
  );
};
export default connect(({ settings,global }) => ({ 
  ...settings,
  pageMinWidth: global.pageMinWidth,
 }))(Layout);
