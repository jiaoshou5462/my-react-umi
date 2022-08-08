import React, { useEffect, useState } from 'react';
import { Form,Checkbox, Carousel, message } from 'antd';
import { connect, history } from 'umi';
import styles from './style.less';
import {  LeftOutlined, EllipsisOutlined, NotificationOutlined,CloseCircleOutlined  } from '@ant-design/icons';

const goldenEggsHomePreview = (props) => {
  let { dispatch, homeDataInit,popTypes } = props;
  //取消弹窗
  useEffect(()=>{
    previewHomePage()
  },[homeDataInit,popTypes])

  let previewHomePage = () =>{
    let items = homeDataInit
    setImageUrl(items.homeBackgroundImage);
    let toSColor = indexColor;
    toSColor.color5 = items.homeBelowBackgroundColor || '#ffffff';
    toSColor.color3 = items.homePeripheralOperationColor || '#fff';
    toSColor.color2 = items.homeParticipateButtonFontColor || '#fff';
    toSColor.color1 = items.homeParticipateButtonBackgroundColor || '#F5A623';
    toSColor.color6 = items.homePeripheralOperationBackgroundColor || 'rgba(0,0,0,.3)';
    toSColor.color9 = items.activityTimeFontColor || '#fff'
    toSColor.color10 = items.activityTimeBackgroundColor || 'rgba(0,0,0,.3)';
    setindexColor({ ...toSColor });
    setIsBackClore2(items.isBackCloreTime)
    setBtnTxt(items.homeParticipateButtonTxt);
    // setBanChecked(items.isHomeAdPreviewShow === 1 ? true : false);
    setBanChecked(true)
    let toadverImg = [];
    if (items.homeAd && items.homeAd.length > 0) {
      items.homeAd.map((n) => {
        toadverImg.push(n.adImg ? n.adImg : '');
      })
    }
    setAdverImg([...toadverImg]);
    changeAdverIsTit(items.homeAdIsShow ? items.homeAdIsShow : 0)
    changeAdverType(items.homeAdStyle ? items.homeAdStyle : 1);
    changeAdverTitName(items.homeAdTitleName);
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
  let [banChecked, setBanChecked] = useState(false);  //广告位
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#F5A623",   //按钮背景色
    color2: "#fff",  //按钮字体颜色
    color3: "#fff",  //周边字体颜色
    color5: "#ffffff",  //页面背景色
    color6: "rgba(0, 0, 0, 0.3)",  //周边背景色
    color9: "#fff",  //活动时间颜色
    color10: "rgba(0,0,0,.3)",  //活动时间背景色
  });
  let [imageUrl, setImageUrl] = useState("");  //首页背景
  let [isIcoShare, setIsIcoShare] = useState('');  //分享图标
  const [indexInt, setIndexInt] = useState(1); //活动首页对应状态 1：背景图 2参与按钮 3信息
  //首页切换工具栏
  let setTools = (i) => {
    setIndexInt(i)
  };

  //首页广告图片上传
  let [adverImg, setAdverImg] = useState([]);
  //广告标题
  let [adverIsTit, changeAdverIsTit] = useState(1);
  let [adverTitName, changeAdverTitName] = useState("");
  
  //剩余倒计时
  let [timeNum, setTimeNum] = useState('');
  //个位补0
  let Appendzero = (obj) => {
    if (obj < 10) return "0" + obj; else return obj;
  }
  let [winBroadcastSwitch, setWinBroadcastSwitch] = useState(0);//广播
  let [countdownSwitch, setCountdownSwitch] = useState(0);//倒计时
  //参与按钮
  let [btnTxt, setBtnTxt] = useState("立即开始");  //按钮名称
  let [homeAdStyle, changeAdverType] = useState(1);
  let [tabType, setTabType] = useState('1');
  let [styleType, setStyleType] = useState(1); //样式单选
  let [activityTypes,setActivityTypes] =  useState('')
  let [isBackClore2, setIsBackClore2] = useState(true);//剩余次数是否需透明底

  return (
      <div className={styles.wrap_prby}>
        <div className={styles.wrap_preview}>
          <div className={styles.phone_wrap}>
            <div className={styles.phone_img1}><img src={require('../../../../../../assets/activity/setpage_m1.png')}></img></div>
            <div className={styles.phone_img2}><LeftOutlined className={styles.phone_img2_1} /><EllipsisOutlined className={styles.phone_img2_2} /></div>
            {/* 活动首页 */}
            <div className={styles.index_wrap} style={{ backgroundColor: `${indexColor.color5}`, backgroundImage: `url(${imageUrl})` }}>
              {/* 中奖广播条 */}
              {winBroadcastSwitch === 1 ? <div className={styles.index_broadcast}><NotificationOutlined /><em>185****1231刚刚获得了20元打车券</em></div> : null}
              <div className={styles.index_backgd} onClick={setTools.bind(this, 1)}></div>
              {countdownSwitch === 1 ?
                <h3 className={styles.index_title}>活动{timeNum ? timeNum : '00:00:00'}后开始</h3>
                : null}
              {isIcoShare ? <div className={styles.index_share}><img src={require('../../../../../../assets/activity/setpage_m18.png')}></img></div> : null}
              <div className={styles.index_pos_bom}>
                <div className={styles.index_info} style={{ top: winBroadcastSwitch === 1 ? '45px' : '15px' }}>
                  <span className={`${styles.index_wrap_top_n1}`} onClick={setTools.bind(this, 3)} style={{ 'color': indexColor.color3, 'background': indexColor.color6 }}>活动规则</span>
                  <span className={`${styles.index_wrap_top_n2}`} onClick={setTools.bind(this, 3)} style={{ 'color': indexColor.color3, 'background': indexColor.color6 }}>中奖记录</span>
                </div>
                <div className={styles.index_time} style={{ "color": indexColor.color9 }}>
                  {isBackClore2 ? <span style={{ "background": indexColor.color10 }}></span> : null}
                  <i>活动开始时间-活动结束时间</i></div>
                <div className={styles.index_button} onClick={setTools.bind(this, 2)}><span style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>{btnTxt ? btnTxt : '立即开始'}</span></div>
                {banChecked ? <div className={styles.box_wrapper}>
                  <div className={styles.index_poster} onClick={setTools.bind(this, 4)} style={{ background: homeAdStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : homeAdStyle == 2 ? '#0023EE' : homeAdStyle == 3 ? '#E53423' : homeAdStyle == 4 ? '#790000' : 'url('+homeAdStyle+') no-repeat 0 0 /100% auto' }}>
                    {adverIsTit == 1 ?
                      <h4 style={{ 'color': "#fff" }}>{adverTitName ? adverTitName : '广告标题'}</h4>
                      : null}
                    <Carousel>
                      {adverImg.length > 0 ?
                        adverImg.map((item, key) => {
                          return <div className={styles.indec_poster_banner} key={key}><img src={item}></img></div>
                        })
                        : <div className={styles.indec_poster_banner}><h3>广告</h3></div>
                      }
                    </Carousel>
                  </div>
                </div> : null}
              </div>
            </div>
            <div className={styles.phone_img3}><img src={require('../../../../../../assets/activity/setpage_m2.png')}></img></div>
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
          : popTypes == 3 ?    //抽奖结果
            <div className={styles.index_rule}>
              {/* 卡券 */}
              {tabType == '1' ?
                <div className={`${styles.index_rule_bys} ${styles.index_rule_by1}`}>
                  <div className={styles.index_rule_img}>
                    {
                      styleType == 1 ? <img src={require('../../../../../../assets/activity/setpage_m15.png')}></img>
                        : styleType == 2 ? <img src={require('../../../../../../assets/activity/setpage_m17.png')}></img>
                          : styleType == 3 ? <img src={require('../../../../../../assets/activity/m_style_3_1.png')}></img>
                            : styleType == 4 ? <img src={require('../../../../../../assets/activity/m_style_4_1.png')}></img>
                              : styleType == 5 ? <img src={require('../../../../../../assets/activity/m_style_5_1.png')}></img>
                                : <img src={styleType}></img>}
                  </div>
                  <div className={styles.index_by_mian}>
                    <h6 style={{ "color": styleType == 1 ? '#1888FF' : styleType == 5 ? '#FF0500' : '#fff' }}>恭喜你获得</h6>
                  </div>
                </div>: null}
              <CloseCircleOutlined className={styles.index_rule_close} />
            </div>
            : null
          }
        </div>
      </div>
  )
}
export default connect(({ }) => ({

}))(goldenEggsHomePreview);
