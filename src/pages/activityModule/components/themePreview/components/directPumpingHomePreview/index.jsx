import React, { useEffect, useState } from 'react';
import {  Carousel } from 'antd';
import { connect, history } from 'umi';
import styles from './style.less';
import { CloseCircleOutlined, LeftOutlined, EllipsisOutlined, NotificationOutlined } from '@ant-design/icons';

const directPumpingHomePreview = (props) => {
  let { dispatch, homeDataInit,popTypes } = props;
  useEffect(()=>{
    previewHomePage()
  },[homeDataInit,popTypes])
  let previewHomePage = () => {
      let items = homeDataInit;
      let isShare = items.isShare == 1 ? '1' : '';
      setIsIcoShare(isShare);
      setImageUrl(items.homeBackgroundImage);
      setDrawImageUrl(items.lotterySpecialEffectsImage ? items.lotterySpecialEffectsImage : '');
      let drawPoints = items.drawPoints ? items.drawPoints : 0;
      setDrawPoints(drawPoints);
      //分享好友显示
      // let inviteFriends = items.inviteFriends == 1 ? true : false;
      setIsShowFirend(true);
      setInviteFriendsNum(items.inviteFriendsNum?items.inviteFriendsNum:0);
      let inviteFriendsTypeStyle = items.inviteFriendsTypeStyle ? items.inviteFriendsTypeStyle : 1;
      setFirendType(inviteFriendsTypeStyle);
      let inviteFriendsTitle = items.inviteFriendsTitle ? items.inviteFriendsTitle : "分享好友立即得抽奖机会";
      setShareFirend(inviteFriendsTitle);
      //邀请好友显示
      // let isInviteBuddy = items.isInviteBuddy == 1 ? true : false;
      setIsShowShare(true);
      setInviteMemeberBoostNum(items.inviteMemeberBoostNum?items.inviteMemeberBoostNum:0);
      let turntableInviteFriendsTitle = items.turntableInviteFriendsTitle ? items.turntableInviteFriendsTitle : "邀请好友注册助力";
      setShareTitle(turntableInviteFriendsTitle);
      let turntableInviteFriendsStyle = items.turntableInviteFriendsStyle ? items.turntableInviteFriendsStyle : 1;
      setShareType(turntableInviteFriendsStyle);
      let turntableInviteFriendsCopywriting = items.turntableInviteFriendsCopywriting ? items.turntableInviteFriendsCopywriting : "";
      setShareTitle2(turntableInviteFriendsCopywriting);
      // let isSpecifyLink = items.isSpecifyLink == 1 ? true : false;
      setIsShowAdver(true);
      setSpecifyLinkNum(items.specifyLinkNum);
      //可加次数广告
      changeAdverTitName1(items.turntableAdTitleName);
      changeAdverType1(items.isTaskStyle ? items.isTaskStyle : 1);
      let toadverImg1 = [];
      if (items.turntableAd && items.turntableAd.length > 0) {
        items.turntableAd.map((n) => {
          toadverImg1.push(n.adImg ? n.adImg : '');
        })
      }
      setAdverImg1([...toadverImg1]);
      changeAdverIsTit1(items.tuentableGameIsShow);

      let toSColor = indexColor;
      toSColor.color4 = items.homeAdStyleFontColor || '#fff';
      toSColor.color5 = items.homeBelowBackgroundColor || '#ffffff';
      toSColor.color3 = items.homePeripheralOperationColor || '#fff';
      toSColor.color2 = items.homeParticipateButtonFontColor || '#fff';
      toSColor.color1 = items.homeParticipateButtonBackgroundColor || '#F5A623';
      toSColor.color6 = items.homePeripheralOperationBackgroundColor || 'rgba(0,0,0,.3)';
      toSColor.color7 = items.turntableLuckyDrawFontColor || '#fff'
      toSColor.color8 = items.turntableLuckyDrawBackgroundColor || 'rgba(0,0,0,.3)';
      toSColor.color9 = items.activityTimeFontColor || '#fff'
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
      changeAdverType(items.homeAdStyle ? items.homeAdStyle : 1);
      changeAdverIsNum1(items.isTaskShow ? items.isTaskShow : 0);
      setindexColor({ ...toSColor });
      setIsBackClore2(items.isBackCloreTime)
      changeAdverTitName(items.homeAdTitleName);
      let timestamp = (new Date()).getTime();
      let toStamp = timestamp > parseInt(items.startTime) ? 0 : parseInt(items.startTime) - timestamp;
      toStamp = toStamp == 0 ? 0 : setMoment(toStamp);
      setTimeNum(toStamp);
      // setBanChecked(items.isHomeAdPreviewShow === 1 ? true : false)
      setBanChecked(true)
      changeAdverIsTit(items.homeAdIsShow ? items.homeAdIsShow : 0)
      setWinBroadcastSwitch(items.winBroadcastSwitch === 1 ? 1 : 0)
      setCountdownSwitch(items.countdownSwitch === 1 ? 1 : 0)
      let toadverImg = [];
      if (items.homeAd && items.homeAd.length > 0) {
        items.homeAd.map((n) => {
          toadverImg.push(n.adImg ? n.adImg : '');
        })
      }
      setAdverImg([...toadverImg]);
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

  let [styleType, setStyleType] = useState(1); //样式单选
  let [activityTypes,setActivityTypes] =  useState('')
  let [tabType, setTabType] = useState('1');
  const [indexInt, setIndexInt] = useState(1); //活动首页对应状态 1：背景图 2参与按钮 3信息
  let [banChecked, setBanChecked] = useState(true);  //广告位
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#F5A623",   //按钮背景色
    color2: "#fff",  //按钮字体颜色
    color3: "#fff",  //周边字体颜色
    color4: "#fff",  //广告标题字体颜色
    color5: "#ffffff",  //页面背景色
    color6: "rgba(0,0,0,.3)",  //周边背景色
    color7: "#fff",  //剩余次数字体颜色
    color8: "rgba(0,0,0,.3)",  //剩余次数背景色
    color9: "#fff",  //活动时间颜色
    color10: "rgba(0,0,0,.3)",  //活动时间背景色
  });
  let [imageUrl, setImageUrl] = useState("");  //首页背景
  let [drawImageUrl, setDrawImageUrl] = useState("");  //开奖效果图
  let [isIcoShare, setIsIcoShare] = useState('');  //分享图标

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
  let setMoment = (value) => {
    let SysSecond = parseInt(value / 1000);
    var second = Appendzero(Math.floor(SysSecond % 60));            // 计算秒
    var minite = Appendzero(Math.floor((SysSecond / 60) % 60));      //计算分
    var hour = Appendzero(Math.floor((SysSecond / 3600)));      //计算小时
    let endTime = hour + ':' + minite + ':' + second;
    return endTime;
  }
  let [winBroadcastSwitch, setWinBroadcastSwitch] = useState(0);//广播
  let [countdownSwitch, setCountdownSwitch] = useState(0);//倒计时
  //是否需透明底
  let [isBackClore, setIsBackClore] = useState(true);//规则 记录
  let [isBackClore1, setIsBackClore1] = useState(true);//剩余次数
  let [isBackClore2, setIsBackClore2] = useState(true);//活动时间是否需要透明底

  //广告
  // let [adverForm1] = Form.useForm();
  let [adverImg1, setAdverImg1] = useState([]);

  //广告标题
  let [adverIsTit1, changeAdverIsTit1] = useState(1);
  let [adverTitName1, changeAdverTitName1] = useState("");

  let [adverIsNum1, changeAdverIsNum1] = useState(1);
  let [isTaskStyle, changeAdverType1] = useState(1);

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

  let [shareType, setShareType] = useState(1);
  let [shareTitle, setShareTitle] = useState("");  //标题名称

  //邀请记录-描述文案
  let [shareTitle2, setShareTitle2] = useState("");
  let [homeAdStyle, changeAdverType] = useState(1);
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
              <div className={styles.index_time} style={{ "color": indexColor.color9 }}>
                {isBackClore2 ? <span style={{ "background": indexColor.color10 }}></span> : null}
                <i>活动开始时间-活动结束时间</i></div>
              {isIcoShare ? <div className={styles.index_share}><img src={require('../../../../../../assets/activity/setpage_m18.png')}></img></div> : null}
              <div className={styles.index_pos_bom}>
                <div className={styles.index_info} onClick={setTools.bind(this, 3)} style={{ 'color': indexColor.color3 }}>
                  {isBackClore ? <span style={{ 'background': indexColor.color6 }}></span> : null}
                  <i>活动规则  |  中奖记录</i></div>
                <div className={styles.index_button} onClick={setTools.bind(this, 2)}><span style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>立即参加</span></div>
                <div className={styles.index_count} style={{ "color": indexColor.color7 }} onClick={setTools.bind(this, 8)}>
                  {isBackClore1 ? <span style={{ "background": indexColor.color8 }}></span> : null}
                  <i>剩余{drawPoints}次机会</i></div>
                {/* 分享 */}
                {isShowFirend ? <div className={styles.box_wrapper}>
                  <div className={`${styles.phone_share} ${styles.phone_share_friend} ${styles.phone_hover}`} onClick={setTools.bind(this, 6)}>
                    {
                      firendType == 1 ? <img src={require('../../../../../../assets/activity/pirend_m1.png')} />
                        : firendType == 2 ? <img src={require('../../../../../../assets/activity/pirend_m2.png')} />
                          : firendType == 3 ? <img src={require('../../../../../../assets/activity/pirend_m3.png')} />
                            : firendType == 4 ? <img src={require('../../../../../../assets/activity/pirend_m4.png')} />
                              : <img src={firendType}/>
                    }
                    <div className={styles.phone_share_top}>{shareFirend ? shareFirend : '分享好友立即得抽奖机会'} 0/{inviteFriendsNum}</div>
                  </div>
                </div> : null}
                {isShowShare ? <div className={styles.box_wrapper}>
                  <div className={`${styles.phone_share} ${styles.phone_hover}  ${styles.phone_share_bg}`}  style={{background:shareType == 1?'rgba(0,0,0,0.37)': shareType == 2?'#0023EE': shareType == 3?'#E53423':shareType == 4?'#790000':'url('+shareType+') no-repeat 0 0 /100% auto' }} onClick={setTools.bind(this, 7)}>
                    <div className={styles.phone_share2_top}>{shareTitle ? shareTitle : '邀请好友注册助力'} 0/{inviteMemeberBoostNum}</div>
                    <div className={styles.phone_share_btn}>立即邀请</div>
                    <div className={styles.phone_share_Copywriting}>{shareTitle2 ? shareTitle2 : '#文案描述#'}</div>
                    <div className={styles.phone_share_list}>
                      <span><i></i><em>用户名</em></span><span><i></i><em>用户名</em></span>
                    </div>
                  </div>
                </div> : null}
                {isShowAdver ? <div className={styles.box_wrapper}>
                  <div className={`${styles.index_poster} ${styles.phone_hover}`} style={{ background: isTaskStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : isTaskStyle == 2 ? '#0023EE' : isTaskStyle == 3 ? '#E53423' : isTaskStyle == 4 ? '#790000' :  'url('+isTaskStyle+') no-repeat 0 0 /100% auto' }} onClick={setTools.bind(this, 5)}>
                    {adverIsTit1 == 1 ?
                      <h4 style={{ 'color': "#fff" }}><span>{adverTitName1 ? adverTitName1 : '广告标题'}</span>   {adverIsNum1 == 1 ? <span>  0/{specifyLinkNum}</span> : null}</h4>
                      : null}
                    <Carousel>
                      {adverImg1.length > 0 ?
                        adverImg1.map((item, key) => {
                          return <div className={styles.indec_poster_banner} key={key}><img src={item} /></div>
                        })
                        : <div className={styles.indec_poster_banner}><h3>广告</h3></div>
                      }
                    </Carousel>
                  </div>
                </div> : null}
                {banChecked ? <div className={styles.box_wrapper}>
                  <div className={styles.index_poster} onClick={setTools.bind(this, 4)} style={{ background: homeAdStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : homeAdStyle == 2 ? '#0023EE' : homeAdStyle == 3 ? '#E53423' : homeAdStyle == 4 ? '#790000' : 'url('+homeAdStyle+') no-repeat' }}>
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
export default connect(({}) => ({

}))(directPumpingHomePreview);
