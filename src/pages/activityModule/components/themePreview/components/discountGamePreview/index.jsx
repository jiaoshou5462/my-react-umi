import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, Carousel, Upload, message, Select, Radio, Row, Col, Switch,Divider } from 'antd';
import { connect, history } from 'umi';
import styles from './style.less';
import SetColor from '../setColor';   //选择颜色组件
import { UploadOutlined, InboxOutlined, PlusOutlined, LeftOutlined, EllipsisOutlined } from '@ant-design/icons';

const activityPage = (props) => {
  let { dispatch, gameDataInit } = props;
  let [formData, setFormData] = useState({});
  //对应编辑栏
  const [indexInt, setIndexInt] = useState(1);
  //首页切换工具栏
  let setTools = (i) => {
    setIndexInt(i)
  };
  //背景
  let [imageUrl, setImageUrl] = useState("");  //背景图
  //颜色设置
  let [gameColor, setgameColor] = useState({}) //参与按钮及信息颜色配置
  useEffect(() => {
    let tempColor = {  //参与按钮及信息颜色配置
      color2: "#fff",//字体颜色
      color4: "#F5A623",  //按钮颜色
    }
    setgameColor(tempColor);
  }, [])
  //按钮文案
  let [words,setWords]=useState("立即购买");
  
  useEffect(()=>{
    previewGamePage()
  },[gameDataInit])
  let previewGamePage = () => {
    let items = gameDataInit
    setFormData({ ...items });
    let togameColor = gameColor;
    togameColor.color2 = items.buyPageButtonTypefaceColor || '#fff';
    togameColor.color4 = items.buyPageButtonBackgroundColor || '#F5A623';
    if(items.buyPageButtonContent){
      setWords(items.buyPageButtonContent);
    }
    setgameColor({ ...togameColor });
  }

  //购买页商品展示
  let [goodMessage,setGoodMessage]=useState({
    prizeImg:"",
    tradeDisplayName:"产品",
    tradeTag: '产品描述',
    payPrice:99.99,
    unitPrice:120,
    remark:'',
  });

  return (
    <div className={styles.wrap_prby}>
      <div className={styles.wrap_preview}>
        <div className={styles.phone_wrap}>
          <div className={styles.phone_img1}><img src={require('../../../../../../assets/activity/setpage_m1.png')}></img></div>
          <div className={styles.phone_img3}><img src={require('../../../../../../assets/activity/setpage_m2.png')}></img></div>
          {/* 购买页 */}
          <div className={styles.index_wrap}>
            <div className={styles.phone_topImg}>
              <img src={require("../../../../../../assets/discountBuyPage_1.png")} />
              <div className={styles.phone_prizeImg}>
                <img  src={require('../../../../../../assets/activity/dicountPreview.png')} />
              </div>
            </div>
            <div className={styles.phone_middleInfo}>
              <div>
                <span className={styles.prize_name}>{goodMessage.tradeDisplayName}</span>
                <span className={styles.prize_tag}>{goodMessage.tradeTag}</span>
              </div>
              <div>
                <span className={styles.prize_price1}>优惠价：<span style={{ "font-size": '18px' }}>￥{goodMessage.payPrice}</span></span>
                <span className={styles.prize_price2}>原价：{goodMessage.unitPrice}元</span>
              </div>
              <div className={`${styles.phone_count} ${styles.phone_hover}`} style={{ "color": gameColor.color2 }} onClick={setTools.bind(this, 1)}>
                <span style={{ "background": gameColor.color4 }}></span>
                <i>{words}</i>
              </div>
            </div>
            {goodMessage.cardPackage ?
            <div className={styles.phone_buyMessage}>
              <div><Divider className={styles.title}>卡包权益</Divider></div>
              <div className={styles.buy_content}>
                {
                  goodMessage.cardPackage.cardPackageCouponList && goodMessage.cardPackage.cardPackageCouponList.map((item, key) => {
                    return <p> {key+1}、{item.couponSkuName} {item.faceValue}元 *{item.couponNum}</p>
                  })
                }
              </div>
            </div>
            :null}
            <div className={styles.phone_buyMessage}>
              <div><Divider className={styles.title}>购买须知</Divider></div>
              <div className={styles.buy_content}  dangerouslySetInnerHTML={{ __html: goodMessage.remark }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default connect(({ discountGame, loading }) => ({
  subimtData: discountGame.subimtData,
}))(activityPage);
