import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, Carousel, Upload, message, Select, Radio, Row, Col, Switch } from 'antd';
import { connect, history } from 'umi';
import { uploadIcon } from '@/services/activity.js';
import styles from './style.less';
import SetColor from '../setColor';   //选择颜色组件
import { CloseCircleOutlined, LeftOutlined, EllipsisOutlined } from '@ant-design/icons';

const activityPage = (props) => {
  let { dispatch, homeDataInit, popTypes } = props;
  let [formData, setFormData] = useState({});
  //取消弹窗
  let [isCancelModal, setIsCancelModal] = useState(false);
  const [indexInt, setIndexInt] = useState(1); //活动首页对应状态 1：背景图 2参与按钮 3信息
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#F5A623",   //按钮背景色
    color2: "#fff",  //按钮字体颜色
    color3: "#fff",  //周边字体颜色
    color5: "#ffffff",  //页面背景色
    color6: "rgba(0,0,0,.3)",  //周边背景色
    color7: "#fff",  //活动时间字体颜色
    color8: "rgba(0,0,0,.3)",  //活动时间背景色
    color9: "#fff",  //活动时间颜色
    color10: "rgba(0,0,0,.3)",  //活动时间背景色
  });
  let [imageUrl, setImageUrl] = useState("");  //首页背景
  let [isIcoShare, setIsIcoShare] = useState('');  //分享图标
  //首页切换工具栏
  let setTools = (i) => {
    setIndexInt(i)
  };

  let [timeSwitch, setTimeSwitch] = useState(1);//活动时间
  let [startTime, setStartTime] = useState("");//开始时间
  let [endTime, setEndTime] = useState("");//结束时间
  let [styleType, setStyleType] = useState(1); //样式单选
  let [activityTypes,setActivityTypes] =  useState('')
  let [isBackClore2, setIsBackClore2] = useState(true);//活动时间是否需要透明底

  //剩余倒计时
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  
  useEffect(()=>{
    previewHomePage()
  },[homeDataInit,popTypes])

  let previewHomePage = () =>{
    let items = homeDataInit
    setFormData({ ...items });
    setImageUrl(items.homeImag);
    if(items.homeButtonContent){
      setWords(items.homeButtonContent);
    }
    let toSColor = indexColor;
    toSColor.color5 = items.homeBackgroundColor || '#ffffff';
    toSColor.color3 = items.homeFloatTypefaceColor || '#fff';
    toSColor.color2 = items.homeButtonTypefaceColor || '#fff';
    toSColor.color1 = items.homeButtonBackgroundColor || '#F5A623';
    toSColor.color6 = items.homeFloatBackgroundColor || 'rgba(0,0,0,.3)';
    toSColor.color7 = items.activityTimeFontColor || '#fff';
    toSColor.color8 = items.activityTimeBackgroundColor || 'rgba(0,0,0,.3)';
    toSColor.color9 = items.activityTimeFontColor || '#fff'
    toSColor.color10 = items.activityTimeBackgroundColor || 'rgba(0,0,0,.3)';
    setindexColor({ ...toSColor });
    setIsBackClore2(items.isBackCloreTime)
    let isShare = items.isShare == 1 ? '1' : '';
    setIsIcoShare(isShare)
    setTimeSwitch(items.timeSwitch === 1 ? 1 : 0)
    setStartTime(items.startTime)
    setEndTime(items.endTime)
    if (items.activityTimeBackgroundColor) {
      setIsBackClore2(true)
    } else {
      setIsBackClore2(false)
    }
    let temp = 1;
    if (popTypes == 1) {
      temp = items.activityRuleUniteStyle || 1;
    } else if (popTypes == 2) {
      temp = items.winUniteStyle || 1;
    } else if (popTypes == 3) {
      temp = items.lotteryAllStyle || 1;
    }
    setStyleType(temp)
  }
  //按钮文案
  let [words,setWords]=useState("立即购买");

  return (
    <div className={styles.wrap_prby}>
      <div className={styles.wrap_preview}>
        <div className={styles.phone_wrap}>
          <div className={styles.phone_img1}><img src={require('../../../../../../assets/activity/setpage_m1.png')}></img></div>
          <div className={styles.phone_img3}><img src={require('../../../../../../assets/activity/setpage_m2.png')}></img></div>
          {/* 活动首页 */}
          <div className={styles.index_wrap} style={{ background: `${indexColor.color5}` }}>
            <div className={styles.index_backgd} onClick={setTools.bind(this, 1)}><img src={imageUrl}></img></div>
            <div className={styles.index_info} onClick={setTools.bind(this, 3)}>
              <span className={styles.info_rule} style={{ 'background': indexColor.color6,'color': indexColor.color3 }}>活动规则</span>
              <span className={styles.info_record} style={{ 'background': indexColor.color6,'color': indexColor.color3 }}>购买记录</span>
            </div>
            <div className={styles.index_time} style={{ "color": indexColor.color9 }}>
              {isBackClore2 ? <span style={{ "background": indexColor.color10 }}></span> : null}
              <i>活动开始时间-活动结束时间</i></div>
            {isIcoShare ? <div className={styles.index_share}><img src={require('../../../../../../assets/activity/setpage_m18.png')}></img></div> : null}
            <div className={styles.index_pos_bom}>
              <div className={styles.index_button} onClick={setTools.bind(this, 2)}><span style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>{words}</span></div>
            </div>
          </div>
        </div>
        {
          popTypes == 1 || popTypes == 2 ?  //活动规则 and 中奖记录
            <div className={styles.index_rule}>
              <div className={styles.index_rule_by}>
                <div className={styles.index_rule_img}>
                  {
                    styleType == 1 ? <img src={require('../../../../../../assets/activity/setpage_m15.png')}></img>
                      : styleType == 2 ? <img src={require('../../../../../../assets/activity/setpage_m16.png')}></img>
                        : styleType == 3 ? <img src={require('../../../../../../assets/activity/m_style_3_5.png')}></img>
                          : styleType == 4 ? <img src={require('../../../../../../assets/activity/m_style_4_4.png')}></img>
                            : styleType == 5 ? <img src={require('../../../../../../assets/activity/m_style_5_5.png')}></img>
                              : <img src={styleType}></img>}

                </div>
                <h6 style={{ "color": styleType == 1 ? '#4A4A4A' : styleType == 2 ? '#FCF0C7' : '#fff' }}>{popTypes == 1 ? '活动规则' : activityTypes == 2 ? '秒杀记录' :  activityTypes == 4 ? '购买记录' : '中奖记录'}</h6>
              </div>
              <CloseCircleOutlined className={styles.index_rule_close} />
            </div>
            : null
        }
      </div>
    </div>
  )
}
export default connect(({ discountHome, loading }) => ({
  subimtData: discountHome.subimtData,
  adverData: discountHome.adverData,

}))(activityPage);
