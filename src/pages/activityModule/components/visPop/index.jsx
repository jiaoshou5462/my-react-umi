import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import styles from './style.less';

let originTime = "";
const activityMould = (props) => {
  let { dispatch, itemData, applyTheme } = props;
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  let [formData, setFormData] = useState({});
  let [banChecked, setBanChecked] = useState(false);  //广告位
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#D8D8D8",   //按钮背景色
    color2: "#868686",  //按钮字体颜色
    color3: "#D8D8D8",  //周边字体颜色
    color4: "#B9B9B9",  //广告标题字体颜色
    color5: "#ffffff",  //页面背景色
    color6: "rgba(0,0,0,.3)",  //周边背景色
    color7: "#868686",  //活动时间字体颜色
    color8: "rgba(0,0,0,.3)",  //活动时间背景色
  });
  let [imageUrl, setImageUrl] = useState("");  //首页背景
  let [isIcoShare, setIsIcoShare] = useState('');  //分享图标
  let [adverImg, setAdverImg] = useState([]);
  let [adverIsTit, changeAdverIsTit] = useState(1);
  let [adverTitName, changeAdverTitName] = useState("");
   //剩余倒计时
   let [timeNum, setTimeNum] = useState('');
   //个位补0
   let Appendzero = (obj) => {
     if (obj < 10) return "0" + obj; else return obj;
   }
   let setMoment = (value) => {
     let SysSecond = parseInt(value / 1000);
     var second = Appendzero(Math.floor(SysSecond % 60));            // 计算秒
     var minite = Appendzero(Math.floor((SysSecond / 60) % 60));      //计算分
     var hour = Appendzero(Math.floor((SysSecond / 3600)));      //计算小时
     let endTime = hour + '小时' + minite + '分钟' + second + '秒';
     return endTime;
   }
   let [winBroadcastSwitch, setWinBroadcastSwitch] = useState(0);//广播
   let [countdownSwitch, setCountdownSwitch] = useState(0);//倒计时
   //是否需透明底
   let [isBackClore, setIsBackClore] = useState(false);
   let [isBackClore2, setIsBackClore2] = useState(false);//活动时间
   let [homeAdStyle, changeAdverType] = useState(1);
   let [timeSwitch, setTimeSwitch] = useState(1);//活动时间
   let [activityTime, setActivityTime] = useState('活动时间');//活动时间输入
  useEffect(() => {
    
  }, []);
  useEffect(()=>{
    if(applyTheme){
      getStageSActivityThree();
    }else{
      getStageSActivityThree();
    }
  },[applyTheme])
  //样式数据
  let getStyleByActivityIdAndStyleCode = () => {
    dispatch({
      type: 'visPop/getStyleByActivityIdAndStyleCode',
      payload: {
        method: 'get',
        params: {
          styleCode: 'tableHome',
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let items = res.body && res.body.styleValue && JSON.parse(res.body.styleValue);
          window.activityData_materialApply = {...window.activityData_materialApply}
          window.activityData_materialApply.homeAd = items.homeAd;
          window.activityData_materialApply.homeAdTitleName = items.homeAdTitleName;
          window.activityData_materialApply.inviteFriendsTitle = items.inviteFriendsTitle ? items.inviteFriendsTitle : "分享好友立即得抽奖机会";
          window.activityData_materialApply.homeAdIsShow = items.homeAdIsShow;
          window.activityData_materialApply.isHomeAdPreviewShow = items.isHomeAdPreviewShow;
          window.activityData_materialApply.isFans = items.isFans;
          window.activityData_materialApply.showButton = items.showButton;
          window.activityData_materialApply.turntableInviteFriendsCopywriting = items.turntableInviteFriendsCopywriting;
          window.activityData_materialApply.turntableInviteFriendsTitle = items.turntableInviteFriendsTitle ? items.turntableInviteFriendsTitle : "邀请好友注册助力";
          window.activityData_materialApply.activityTime = items.activityTime ? items.activityTime : originTime;
          setActivityTime(items.activityTime ? items.activityTime : originTime);
          if(items){
            setFormData({ ...items });
            setImageUrl(items.homeBackgroundImage);
            let toSColor = indexColor;
            toSColor.color4 = items.homeAdStyleFontColor || '#B9B9B9';
            toSColor.color5 = items.homeBelowBackgroundColor || '#ffffff';
            toSColor.color3 = items.homePeripheralOperationColor || '#D8D8D8';
            toSColor.color2 = items.homeParticipateButtonFontColor || '#868686';
            toSColor.color1 = items.homeParticipateButtonBackgroundColor || '#D8D8D8';
            toSColor.color6 = items.homePeripheralOperationBackgroundColor || 'rgba(0,0,0,.3)';
            toSColor.color7 = items.activityTimeFontColor || '#868686';
            toSColor.color8 = items.activityTimeBackgroundColor || 'rgba(0,0,0,.3)';
            if (items.homePeripheralOperationBackgroundColor) {
              setIsBackClore(true)
            } else {
              setIsBackClore(false)
            }
            if (items.activityTimeBackgroundColor) {
              setIsBackClore2(true)
            } else {
              setIsBackClore2(false)
            }
            items.homeAdStyle = items.homeAdStyle ? ( parseInt(items.homeAdStyle) ? parseInt(items.homeAdStyle) : items.homeAdStyle ) : 1;
            changeAdverType(items.homeAdStyle);
            setindexColor({ ...toSColor });
            changeAdverTitName(items.homeAdTitleName);
            changeAdverIsTit(items.homeAdIsShow ? items.homeAdIsShow : 0)
            setBanChecked(items.isHomeAdPreviewShow === 1 ? true : false)
            let toadverImg = [];
            if (items.homeAd && items.homeAd.length > 0) {
              items.homeAd.map((n) => {
                toadverImg.push(n.adImg ? n.adImg : '');
              })
            }
            setAdverImg([...toadverImg]);
          }
        }
      }
    });
  }
  let [logo, setLogo] = useState("");//企业logo图片url
  let queryEnterpriseLogo = () => {
    dispatch({
      type: 'visPop/queryEnterpriseLogo',
      payload: {
        method: 'get',
        params: {}
      },
      callback:(res)=>{
        if (res.result.code == "0") {
          if(res.body){
            setLogo(res.body);
          }
        }
      }
    })
  }
  //数据获取
  let getStageSActivityThree = () => {
    dispatch({
      type: 'visPop/backStageSActivityThree',
      payload: {
        method: 'postJSON',
        params: {
          channelId: activityInfo.channelId,
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        getStyleByActivityIdAndStyleCode();
        if (res.result.code == "0") {
          let items = res.body;
          if(items.isEnterprise){
            queryEnterpriseLogo();
          }
          window.activityData_materialApply = {...window.activityData_materialApply}
          window.activityData_materialApply.turntableAd = items.turntableAd;
          window.activityData_materialApply.isShow = items.tuentableGameIsShow;
          window.activityData_materialApply.turntableAdTitleName = items.turntableAdTitleName;
          window.activityData_materialApply.isTaskShow = items.isTaskShow;
          let isShare = items.isShare == 1 ? '1' : '';
          setIsIcoShare(isShare);
          let timestamp = (new Date()).getTime();
          let toStamp = timestamp > new Date(items.startTime).getTime() ? 0 : new Date(items.startTime).getTime() - timestamp;
          toStamp = toStamp == 0 ? 0 : setMoment(toStamp);
          setTimeNum(toStamp);
          setWinBroadcastSwitch(items.winBroadcastSwitch === 1 ? 1 : 0)
          setCountdownSwitch(items.countdownSwitch === 1 ? 1 : 0)
          originTime = items.startTime + '——' + items.endTime;
          setTimeSwitch(items.timeSwitch === 1 ? 1 : 0)
        } else {
          message.error(res.result.message);
        }
      }
    });
  };
  return (
    <div>
      {/* 活动首页 */}
      <div className={styles.index_wrap} style={{ backgroundColor: `${indexColor.color5}`, backgroundImage: `url(${imageUrl})` }}>
        {/* 中奖广播条 */}
        {winBroadcastSwitch === 1 ? <div className={styles.index_broadcast}><NotificationOutlined /><em>185****1231刚刚获得了20元打车券</em></div> : null}
        {isIcoShare ? <div className={styles.index_share}><img src={require('../../../../assets/activity/setpage_m18.png')}></img></div> : null}
        {logo ?
          <div className={styles.index_logo} style={winBroadcastSwitch === 1 ? null : {top: "20px"}}><img src={logo} alt="" /></div>
            : null}
          {timeSwitch === 1 ?
            <div className={styles.index_time} style={{ "color": indexColor.color7 }}>
            <div className={styles.time_wrap}>
              {isBackClore2 ? <span style={{ "background": indexColor.color8 }}></span> : null}
              <div>{activityTime}</div>
            </div>
            </div>
          : null}
        <div className={styles.index_pos_bom}>
          <div className={styles.index_button}>
            {countdownSwitch == 1 && timeNum ?
              <span className={styles.button_countdown} style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>距离活动开始还剩余{timeNum}</span>
              :<span style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>立即参加</span>}
          </div>
          <div className={styles.index_info} style={{ 'color': indexColor.color3 }}>
            {isBackClore ? <span style={{ 'background': indexColor.color6 }}></span> : null}
            <i>活动规则  |  中奖记录</i></div>
          {banChecked ? <div className={styles.box_wrapper}>
            <div className={styles.index_poster} style={ typeof homeAdStyle == 'number' ? { backgroundColor: homeAdStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : homeAdStyle == 2 ? '#0023EE' : homeAdStyle == 3 ? '#E53423' : homeAdStyle == 4 ? '#790000' : 'none' } : {backgroundImage: `url(${homeAdStyle})`}}>
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
    </div>
  )
}

export default connect(({ selectTheme }) => ({
  applyTheme: selectTheme.applyTheme
}))(activityMould);