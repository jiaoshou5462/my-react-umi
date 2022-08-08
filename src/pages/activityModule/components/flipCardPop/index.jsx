import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import styles from './style.less';

let originTime = "";
const flipCardPop = (props) => {
  let { dispatch, itemData, applyTheme } = props;
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  let [formData, setFormData] = useState({});
  //剩余倒计时
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
  let [timeNum, setTimeNum] = useState(null);
  //分享相关
  let [isShowFirend, setIsShowFirend] = useState(false);  //是否显示分享好友块
  let [isShowShare, setIsShowShare] = useState(false);  //是否显示邀请好友块
  let [isShowAdver, setIsShowAdver] = useState(false);  //是否显示加次数广告位
  let [drawPoints, setDrawPoints] = useState(0);  //抽奖次数
  let [firendType, setFirendType] = useState(1);
  let [inviteMemeberBoostNum, setInviteMemeberBoostNum] = useState(0);  //邀请好友注册助力人数要求
  let [inviteFriendsNum, setInviteFriendsNum] = useState(1);  //分享好友机会次数要求
  let [specifyLinkNum, setSpecifyLinkNum] = useState(0);  //广告-指定上线
  let [shareFirend, setShareFirend] = useState("");  //标题名称

  let [banChecked, setBanChecked] = useState(true);  //广告位
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#D8D8D8",   //按钮背景色
    color2: "#868686",  //按钮字体颜色
    color3: "#D8D8D8",  //周边字体颜色
    color4: "#B9B9B9",  //广告标题字体颜色
    color5: "#ffffff",  //页面背景色
    color6: "rgba(0,0,0,.3)",  //周边背景色
    color7: "#666",  //剩余次数背景色
    color8: "rgba(0,0,0,.3)",  //剩余次数背景色
    color9: "#868686",  //活动时间字体颜色
    color10: "rgba(0,0,0,.3)",  //活动时间背景色
  });
  let [imageUrl, setImageUrl] = useState("");  //首页背景
  let [isIcoShare, setIsIcoShare] = useState('');  //分享图标
  let [winBroadcastSwitch, setWinBroadcastSwitch] = useState(0);//广播
  let [countdownSwitch, setCountdownSwitch] = useState(0);//倒计时
  //是否需透明底
  let [isBackClore, setIsBackClore] = useState(false);//规则 记录
  let [isBackClore1, setIsBackClore1] = useState(false);//剩余次数
  let [shareType, setShareType] = useState(1);//邀请好友助力背景样式
  let [shareTitle, setShareTitle] = useState("");  //标题名称
  //邀请记录-描述文案
  let [shareTitle2, setShareTitle2] = useState("");
  //广告标题
  let [adverIsTit1, changeAdverIsTit1] = useState(1);//加次数广告标题是否显示
  let [adverTitName1, changeAdverTitName1] = useState("");
  let [homeAdStyle, changeAdverType] = useState(1);
  let [adverIsTit, changeAdverIsTit] = useState(1);//广告标题是否显示
  let [adverTitName, changeAdverTitName] = useState("");
  let [adverImg, setAdverImg] = useState([]);
  let [isTaskStyle, changeAdverType1] = useState(1);
  let [adverImg1, setAdverImg1] = useState([]);
  let [adverIsNum1, changeAdverIsNum1] = useState(1);
  let [activityTime, setActivityTime] = useState('活动时间');//活动时间输入
  let [isBackClore2, setIsBackClore2] = useState(false);//活动时间
  let [timeSwitch, setTimeSwitch] = useState(1);//活动时间
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
          styleCode: 'flipCardHome',
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
            let inviteFriendsTypeStyle = items.inviteFriendsTypeStyle ? items.inviteFriendsTypeStyle : 1;
            setFirendType(inviteFriendsTypeStyle);
            let inviteFriendsTitle = items.inviteFriendsTitle ? items.inviteFriendsTitle : "分享好友立即得抽奖机会";
            setShareFirend(inviteFriendsTitle);
            let turntableInviteFriendsTitle = items.turntableInviteFriendsTitle ? items.turntableInviteFriendsTitle : "邀请好友注册助力";
            setShareTitle(turntableInviteFriendsTitle);
            let turntableInviteFriendsStyle = items.turntableInviteFriendsStyle ? items.turntableInviteFriendsStyle : 1;
            setShareType(turntableInviteFriendsStyle);
            let turntableInviteFriendsCopywriting = items.turntableInviteFriendsCopywriting ? items.turntableInviteFriendsCopywriting : "";
            setShareTitle2(turntableInviteFriendsCopywriting);
            let toSColor = indexColor;
            toSColor.color5 = items.homeBelowBackgroundColor || '#ffffff';
            toSColor.color3 = items.homePeripheralOperationColor || '#D8D8D8';
            toSColor.color2 = items.homeParticipateButtonFontColor || '#868686';
            toSColor.color1 = items.homeParticipateButtonBackgroundColor || '#D8D8D8';
            toSColor.color6 = items.homePeripheralOperationBackgroundColor || 'rgba(0,0,0,.3)';
            toSColor.color7 = items.turntableLuckyDrawFontColor || '#666'
            toSColor.color8 = items.turntableLuckyDrawBackgroundColor || 'rgba(0,0,0,.3)';
            toSColor.color9 = items.activityTimeFontColor || '#868686';
            toSColor.color10 = items.activityTimeBackgroundColor || 'rgba(0,0,0,.3)';
            if (items.homePeripheralOperationBackgroundColor) {
              setIsBackClore(true)
            } else {
              setIsBackClore(false)
            }
            if (items.turntableLuckyDrawBackgroundColor) {
              setIsBackClore1(true)
            } else {
              setIsBackClore1(false)
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
            setBanChecked(items.isHomeAdPreviewShow === 1 ? true : false)
            changeAdverIsTit(items.homeAdIsShow ? items.homeAdIsShow : 0)
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
      type: 'visHome/queryEnterpriseLogo',
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
      type: 'flipCardHome/backStageSActivityThree',
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
          let drawPoints = items.drawPoints ? items.drawPoints : 0;
          setDrawPoints(drawPoints);
          //分享好友显示
          let inviteFriends = items.inviteFriends == 1 ? true : false;
          setIsShowFirend(inviteFriends);
          setInviteFriendsNum(items.inviteFriendsNum);
          //邀请好友显示
          let isInviteBuddy = items.isInviteBuddy == 1 ? true : false;
          setIsShowShare(isInviteBuddy);
          setInviteMemeberBoostNum(items.inviteMemeberBoostNum);
          //可加次数广告位显示
          let isSpecifyLink = items.isSpecifyLink == 1 ? true : false;
          setIsShowAdver(isSpecifyLink);
          setSpecifyLinkNum(items.specifyLinkNum);
          //可加次数广告
          changeAdverTitName1(items.turntableAdTitleName);
          items.isTaskStyle = items.isTaskStyle ? ( parseInt(items.isTaskStyle) ? parseInt(items.isTaskStyle) : items.isTaskStyle ) : 1;
          changeAdverType1(items.isTaskStyle);
          let toadverImg1 = [];
          if (items.turntableAd && items.turntableAd.length > 0) {
            items.turntableAd.map((n) => {
              toadverImg1.push(n.adImg ? n.adImg : '');
            })
          }
          setAdverImg1([...toadverImg1]);
          changeAdverIsTit1(items.tuentableGameIsShow);
          changeAdverIsNum1(items.isTaskShow ? items.isTaskShow : 0);
          let timestamp = (new Date()).getTime();
          let toStamp = timestamp > new Date(items.startTime).getTime() ? 0 : new Date(items.startTime).getTime() - timestamp;
          toStamp = toStamp == 0 ? 0 : setMoment(toStamp);
          setTimeNum(toStamp);
          setWinBroadcastSwitch(items.winBroadcastSwitch === 1 ? 1 : 0);
          setCountdownSwitch(items.countdownSwitch === 1 ? 1 : 0);
          setTimeSwitch(items.timeSwitch === 1 ? 1 : 0)
          // setStartTime(items.startTime)
          // setEndTime(items.endTime)
          originTime = items.startTime + '——' + items.endTime;
        } else {
          message.error(res.result.message);
        }
      }
    });
  };
  return (
    <div>
        {/* 活动首页 */}
        <div className={styles.index_wrap} style={{ backgroundColor: `${indexColor.color5}`, backgroundImage: `url(${imageUrl})`}}>
            {/* 中奖广播条 */}
            {winBroadcastSwitch === 1 ? <div className={styles.index_broadcast}><NotificationOutlined /><em>185****1231刚刚获得了20元打车券</em></div> : null}
            <div className={styles.index_backgd}></div>
            {logo ?<div className={styles.index_logo} style={winBroadcastSwitch === 1 ? null : {top: "20px"}}><img src={logo} alt="" /></div>: null}
            <div className={styles.index_info}>
              <span className={styles.info_rule}>规则</span>
              {isIcoShare ? <span className={styles.index_share}>分享</span> : null}
            </div>
            {timeSwitch === 1 ?
              <div className={styles.index_time} style={{ "color": indexColor.color9 }}>
                <div className={styles.time_wrap}>
                  {isBackClore2 ? <span style={{ "background": indexColor.color10 }}></span> : null}
                  <div>{activityTime}</div>
                </div>
              </div>
            : null}
            <div className={styles.index_pos_bom}>
              <div className={styles.index_button}>
                {countdownSwitch == 1 && timeNum ?
                  <span className={styles.button_countdown} style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>距离活动开始还剩余{timeNum}</span>
                  :<span style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>立即开始</span>}
              </div>
              <div className={styles.index_limitNum}>
                <div>
                  <span className={styles.limitNum_label}  style={{ 'color': indexColor.color1 }}>您有{drawPoints}次参与机会</span>
                  <span className={styles.limitNum_bg} style={{ 'background': indexColor.color2 }}></span>
                </div>
              </div>
              <div className={styles.index_btns}>
                <div className={styles.btn} style={{ 'color': indexColor.color1, 'border-color': indexColor.color1 }}>玩法介绍</div>
                <div className={styles.btn} style={{ 'color': indexColor.color1, 'border-color': indexColor.color1 }}>中奖记录</div>
              </div>
              
              {/* 分享 */}
              {isShowFirend ? <div className={styles.box_wrapper}>
                  <div className={`${styles.phone_share} ${styles.phone_hover}`}>
                      {
                          firendType == 1 ? <img src={require('../../../../assets/activity/pirend_m1.png')} />
                              : firendType == 2 ? <img src={require('../../../../assets/activity/pirend_m2.png')} />
                                  : firendType == 3 ? <img src={require('../../../../assets/activity/pirend_m3.png')} />
                                      : firendType == 4 ? <img src={require('../../../../assets/activity/pirend_m4.png')} />
                                          : typeof firendType == 'string' ? <img src={firendType} />
                                              : null
                      }
                      <div className={styles.phone_share_top}>{shareFirend ? shareFirend : '分享好友立即得抽奖机会'} 0/{inviteFriendsNum}</div>
                  </div> 
              </div>: null}
              {isShowShare ? <div className={styles.box_wrapper}>
                  <div className={`${styles.phone_share} ${styles.phone_hover}  ${styles.phone_share_bg} 
                  ${shareType == 1 ? styles.phone_share_bg1 : shareType == 2 ? styles.phone_share_bg2 : shareType == 3 ? styles.phone_share_bg3 : shareType == 4 ? styles.phone_share_bg4 : styles.phone_share_bg1}`}
                  style={typeof shareType == 'string' ? {backgroundImage: `url(${shareType})`,backgroundSize: '100% auto'} : null} >
                      <div className={styles.phone_share2_top}>{shareTitle ? shareTitle : '邀请好友注册助力'} 0/{inviteMemeberBoostNum}</div>
                      <div className={styles.phone_share_btn}>立即邀请</div>
                      <div className={styles.phone_share_Copywriting}>{shareTitle2 ? shareTitle2 : '#文案描述#'}</div>
                      <div className={styles.phone_share_list}>
                          <span><i></i><em>用户名</em></span><span><i></i><em>用户名</em></span>
                      </div>
                  </div>
              </div>: null}
              {isShowAdver ? <div className={styles.box_wrapper}>
                  <div className={`${styles.index_poster} ${styles.phone_hover}`} 
                  style={typeof isTaskStyle == 'number' ? { backgroundColor: isTaskStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : isTaskStyle == 2 ? '#0023EE' : isTaskStyle == 3 ? '#E53423' : isTaskStyle == 4 ? '#790000' : 'none' } : {backgroundImage: `url(${isTaskStyle})`,backgroundSize: '100% auto'}}>
                  {adverIsTit1 == 1 ?
                      <h4 style={{ 'color': "#fff" }}><span>{adverTitName1 ? adverTitName1 : '广告标题'}</span>  {adverIsNum1 == 1 ? <span>{adverImg1.length > 0 ? 1 : 0}/{specifyLinkNum}</span> : null}</h4>
                      : null}
                  <Carousel>
                      {adverImg1 && adverImg1.length > 0 ?
                          adverImg1.map((item, key) => {
                          return <div className={styles.indec_poster_banner} key={key}><img src={item} /></div>
                      })
                      : <div className={styles.indec_poster_banner}><h3>广告</h3></div>
                      }
                  </Carousel>
                  </div>
              </div>: null}
              {banChecked ? <div className={styles.box_wrapper}>
                  <div className={styles.index_poster} style={ typeof homeAdStyle == 'number' ? { backgroundColor: homeAdStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : homeAdStyle == 2 ? '#0023EE' : homeAdStyle == 3 ? '#E53423' : homeAdStyle == 4 ? '#790000' : 'none' } : {backgroundImage: `url(${homeAdStyle})`}}>
                      {adverIsTit == 1 ?
                          <h4 style={{ 'color': "#fff" }}>{adverTitName ? adverTitName : '广告标题'}</h4>
                      : null}
                      <Carousel>
                          {adverImg && adverImg.length > 0 ?
                              adverImg.map((item, key) => {
                                  return <div className={styles.indec_poster_banner} key={key}><img src={item}></img></div>
                              })
                              : <div className={styles.indec_poster_banner}><h3>广告</h3></div>
                          }
                      </Carousel>
                  </div> 
              </div>: null}
            </div>
        </div>
  </div>
  )
}

export default connect(({selectTheme }) => ({
  applyTheme: selectTheme.applyTheme
}))(flipCardPop);