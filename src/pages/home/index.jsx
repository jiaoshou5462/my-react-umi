import React,{useEffect} from 'react';
import { connect,history } from 'umi';
import Comp1 from './components/comp1';
import Comp2 from './components/comp2';
import styles from './styles.less';
import {Spin,Button} from 'antd';
import PageTopTips from "@/components/commonComp/PageTopTips";
import TypeTags from "@/components/commonComp/TypeTags";
import BottomArea from "@/components/commonComp/BottomArea"; //底部区域组件
import StateBadge from "@/components/commonComp/StateBadge"; //列表按钮

const Home = (props) =>{
  const {dispatch} = props;

  const backHome=()=>{
    alert('返回上一页')
  }


  return(
    <div className={styles.contentBox}>
      <h2 style={{fontWeight: 'bold',}}>说明：</h2>
      <p style={{paddingBottom: '20px',}}>组件展示，具体引入以及使用方法请参考项目目录 src/pages/home </p>
      <h2>UI规范demo页面</h2>
      <div style={{paddingBottom:'20px'}}>
        <Button type='primary' onClick={()=>{history.push('/demo_list')}} style={{marginRight:'20px'}}>列表页面</Button>
        <Button type='primary' onClick={()=>{history.push('/demo_detail')}}>详情页面</Button>
      </div>
      <h2>Type类型</h2>
      <div className={`${styles.block} ${styles.TypeTags}`}>
        <TypeTags>类型：默认</TypeTags>
        <TypeTags type="red">类型：red</TypeTags>
        <TypeTags type="orange">类型：orange</TypeTags>
        <TypeTags type="yellow">类型：yellow</TypeTags>
        <TypeTags type="purple">类型：purple</TypeTags>
        <TypeTags type="green">类型：green</TypeTags>
        <TypeTags type="indigo">类型：indigo</TypeTags>
        <TypeTags type="blue">类型：blue</TypeTags>
        <TypeTags color="#142ff1">自定义：#142ff1</TypeTags>
      </div>
      <h2>状态</h2>
      <div className={`${styles.block} ${styles.StateBadge}`}>
        <StateBadge status="success">success</StateBadge>
        <StateBadge status="processing">processing</StateBadge>
        <StateBadge status="default">default</StateBadge>
        <StateBadge status="error">error</StateBadge>
        <StateBadge status="warning">warning</StateBadge>
        <br />
        <StateBadge color="pink">pink</StateBadge>
        <StateBadge color="red">red</StateBadge>
        <StateBadge color="yellow">yellow</StateBadge>
        <StateBadge color="orange">orange</StateBadge>
        <StateBadge color="cyan">cyan</StateBadge>
        <StateBadge color="green">green</StateBadge>
        <StateBadge color="blue">blue</StateBadge>
        <StateBadge color="purple">purple</StateBadge>
        <StateBadge color="geekblue">geekblue</StateBadge>
        <StateBadge color="magenta">magenta</StateBadge>
        <StateBadge color="volcano">volcano</StateBadge>
        <StateBadge color="gold">gold</StateBadge>
        <StateBadge color="lime">lime</StateBadge>
        <br />
        <StateBadge color="#2db7f5">#2db7f5</StateBadge>
      </div>

      <BottomArea>
        <Button onClick={backHome}>返回</Button>
      </BottomArea>
    </div>
  )
}
export default connect(({ loading }) => ({
  loading: loading.effects['user/fetchCurrent'],
  
}))(Home);