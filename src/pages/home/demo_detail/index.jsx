import React,{useEffect} from 'react';
import { connect } from 'umi';
import styles from './styles.less';
import {Spin,Button} from 'antd';

const Home = (props) =>{
  const {dispatch} = props;

 


  return(
    <div className={styles.contentBox}>
      
    </div>
  )
}
export default connect(({ loading }) => ({
  
}))(Home);