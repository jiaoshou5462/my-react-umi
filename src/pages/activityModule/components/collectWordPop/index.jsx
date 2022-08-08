import React, { useEffect, useState } from 'react';
import { Form, Carousel } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import styles from './style.less';

let originTime = "";
const collectWordPop = (props) => {
  let { dispatch, itemData } = props;
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  let [formData, setFormData] = useState({});
  let [adverForm] = Form.useForm();
  let [adverForm1] = Form.useForm();
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#D8D8D8",   //按钮背景色
    color2: "#868686",  //按钮字体颜色
    color3: "rgba(0, 0, 0, 0.5)",  //活动规则、中奖记录背景色
    color4: "#fff",  //活动规则、中奖记录字体颜色
    color5: "#ffffff",  //页面背景色
    color6: "#868686",  //剩余次数字体颜色
    color7: "rgba(0, 0, 0, 0.5)",  //剩余次数背景色
    color8: "#fff",  //奖池文案字体颜色
    color9: "#868686",  //活动时间字体颜色
    color10: "rgba(0,0,0,.3)",  //活动时间背景色
  });
  let [imageUrl, setImageUrl] = useState("");  //首页背景
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
  let timestamp = (new Date()).getTime();
  let toStamp = timestamp > parseInt(itemData.startTime) ? 0 : parseInt(itemData.startTime) - timestamp;
  toStamp = toStamp == 0 ? 0 : setMoment(toStamp);
  let [timeNum, setTimeNum] = useState(toStamp);
  //是否显示分享好友块
  let [isShowFirend, setIsShowFirend] = useState(itemData.inviteFriends == 1 ? true : false);
  //是否显示邀请好友块
  let [isShowShare, setIsShowShare] = useState(itemData.isInviteBuddy == 1 ? true : false);
  //是否显示展示广告位
  let [banChecked, setBanChecked] = useState(itemData.isHomeAdPreviewShow === 1 ? true : false);
  //是否显示加次数广告位
  let [isShowAdver, setIsShowAdver] = useState(itemData.isSpecifyLink == 1 ? true : false);
  let [winBroadcastSwitch, setWinBroadcastSwitch] = useState(1);
  let [countdownSwitch, setCountdownSwitch] = useState(1);//倒计时
  let [timeSwitch, setTimeSwitch] = useState(1);//活动时间
  let [startTime, setStartTime] = useState("");//开始时间
  let [endTime, setEndTime] = useState("");//结束时间
  let [isIcoShare, setIsIcoShare] = useState(itemData.isShare == 1 ? '1' : '');  //分享图标
  let [homeAdStyle, changeAdverType] = useState(itemData.homeAdStyle ? itemData.homeAdStyle : 1);
  let [adverIsTit, changeAdverIsTit] = useState(itemData.homeAdIsShow ? itemData.homeAdIsShow : 1);

  let [firendType, setFirendType] = useState(1);
  let [shareFirend, setShareFirend] = useState("");  //标题名称
  let [shareTitle, setShareTitle] = useState("");  //标题名称
  let [shareTitle1, setShareTitle1] = useState("");
  let [shareType, setShareType] = useState(1);
  let [adverTitName1, changeAdverTitName1] = useState("");
  let [isTaskStyle, changeAdverType1] = useState(1);
  let [adverImg1, setAdverImg1] = useState([]);
  let [adverIsTit1, changeAdverIsTit1] = useState(1);
  let [isBackClore, setIsBackClore] = useState(false);//规则 记录
  let [isBackClore1, setIsBackClore1] = useState(false);//剩余次数
  let [isBackClore2, setIsBackClore2] = useState(false);//活动时间
  let [adverIsNum1, changeAdverIsNum1] = useState(1);
  let [btnTxt, setBtnTxt] = useState("立即开始");  //按钮名称
  let [composeTxt, setComposeTxt] = useState("合成开奖");  //合成文案
  let [prizeTxt, setPrizeTxt] = useState("集齐所有卡片，合成开奖可随机获得奖池内的奖品~");  //奖池文案
  let [adverTitName, changeAdverTitName] = useState("");
  let [adverImg, setAdverImg] = useState([]);
  let [specifyLinkNum, setSpecifyLinkNum] = useState(0);  //广告-指定上线
  let [inviteMemeberBoostNum, setInviteMemeberBoostNum] = useState(0);  //邀请好友注册助力人数要求
  let [inviteFriendsNum, setInviteFriendsNum] = useState(1);  //分享好友机会次数要求
  let [drawPoints, setDrawPoints] = useState(0);  //抽奖次数
  let [activityTime, setActivityTime] = useState('活动时间');//活动时间输入

  useEffect(() => {
    getStyleByActivityIdAndStyleCode();
    getStageSActivityThree();
    getWordConfig();
    queryPrize();
  }, []);
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
      type: 'collectWordPop/backStageSActivityThree',
      payload: {
        method: 'postJSON',
        params: {
          channelId: activityInfo.channelId,
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let items = res.body;
          if(items.isEnterprise){
            queryEnterpriseLogo();
          }
          let isShare = items.isShare == 1 ? '1' : '';
          setIsIcoShare(isShare);
          let drawPoints = items.drawPoints ? items.drawPoints : 0;
          setDrawPoints(drawPoints);
          let inviteFriends = items.inviteFriends == 1 ? true : false;
          setIsShowFirend(inviteFriends);
          //邀请好友显示
          let isInviteBuddy = items.isInviteBuddy == 1 ? true : false;
          setIsShowShare(isInviteBuddy);
          let isSpecifyLink = items.isSpecifyLink == 1 ? true : false;
          setIsShowAdver(isSpecifyLink);
          let timestamp = (new Date()).getTime();
          let toStamp = timestamp > new Date(items.startTime).getTime() ? 0 : new Date(items.startTime).getTime() - timestamp;
          toStamp = toStamp == 0 ? 0 : setMoment(toStamp);
          setTimeNum(toStamp);
          setInviteFriendsNum(items.inviteFriendsNum);
          setInviteMemeberBoostNum(items.inviteMemeberBoostNum);
          setSpecifyLinkNum(items.specifyLinkNum);
          setWinBroadcastSwitch(items.winBroadcastSwitch === 1 ? 1 : 0)
          setCountdownSwitch(items.countdownSwitch === 1 ? 1 : 0)
          setTimeSwitch(items.timeSwitch === 1 ? 1 : 0)
          originTime = items.startTime + '——' + items.endTime;
          // setStartTime(items.startTime)
          // setEndTime(items.endTime)
          let toSColor = indexColor;
          setindexColor({ ...toSColor });
          //可加次数广告
          changeAdverTitName1(items.turntableAdTitleName);
          adverForm1.setFieldsValue({   //广告表单
            homeAdTitleName: items.turntableAdTitleName,
            isTaskShow: !items.isTaskShow ? 0 : 1,
            isShow: items.tuentableGameIsShow ? items.tuentableGameIsShow : 0,
            turntableAd: items.turntableAd,
            isTaskStyle: items.isTaskStyle ? items.isTaskStyle : 1
          })
          changeAdverType1(items.isTaskStyle ? items.isTaskStyle : 1);
          let toadverImg1 = [];
          if (items.turntableAd && items.turntableAd.length > 0) {
            items.turntableAd.map((n) => {
              toadverImg1.push(n.adImg ? n.adImg : '');
            })
          }
          setAdverImg1([...toadverImg1]);
          changeAdverIsTit1(items.tuentableGameIsShow);
          changeAdverIsNum1(items.isTaskShow ? items.isTaskShow : 0);
        } else {
          message.error(res.result.message);
        }
      }
    });
  };
  //样式数据
  let getStyleByActivityIdAndStyleCode = () => {
    dispatch({
      type: 'collectWordPop/getStyleByActivityIdAndStyleCode',
      payload: {
        method: 'get',
        params: {
          styleCode: 'collectWordHome',
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let items = res.body && res.body.styleValue && JSON.parse(res.body.styleValue);
          setActivityTime(items.activityTime ? items.activityTime : originTime);
          if (items) {
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
            setShareTitle1(turntableInviteFriendsCopywriting);
            let toSColor = indexColor;
            toSColor.color1 = items.homeParticipateButtonBackgroundColor || '#D8D8D8';
            toSColor.color2 = items.homeParticipateButtonFontColor || '#868686';
            toSColor.color3 = items.homeRecordBackgroundColor || 'rgba(0, 0, 0, 0.5)';
            toSColor.color4 = items.homeRecordFontColor || '#fff';
            toSColor.color5 = items.homeBelowBackgroundColor || '#ffffff';
            toSColor.color6 = items.homeGamecountFontColor || '#868686';
            toSColor.color7 = items.homeGamecountBackgroundColor || 'rgba(0, 0, 0, 0.5)';
            toSColor.color8 = items.prizesFontColor || '#fff';
            toSColor.color9 = items.activityTimeFontColor || '#868686';
            toSColor.color10 = items.activityTimeBackgroundColor || 'rgba(0,0,0,.3)';
            if (items.homePlayBackgroundColor) {
              setIsBackClore(true)
            } else {
              setIsBackClore(false)
            }
            if (items.homeGamecountBackgroundColor) {
              setIsBackClore1(true)
            } else {
              setIsBackClore1(false)
            }
            if (items.activityTimeBackgroundColor) {
              setIsBackClore2(true)
            } else {
              setIsBackClore2(false)
            }
            setindexColor({ ...toSColor });
            setBtnTxt(items.homeParticipateButtonTxt ? items.homeParticipateButtonTxt : '立即抽卡');
            setComposeTxt(items.composeButtonTxt ? items.composeButtonTxt : '合成开奖');
            setPrizeTxt(items.prizesTitleTxt ? items.prizesTitleTxt : '集齐所有卡片，合成开奖可随机获得奖池内的奖品~');
            adverForm.setFieldsValue({
              homeAdTitleName: items.homeAdTitleName,
              homeAd: items.homeAd,
              homeAdStyle: items.homeAdStyle ? items.homeAdStyle : 1,
              isShow: items.homeAdIsShow ? items.homeAdIsShow : 0
            })
            setBanChecked(items.isHomeAdPreviewShow === 1 ? true : false);
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
          }
        }
      }
    });
  }
  let [gameNumber, setGameNumber] = useState(0);//剩余次数
  let [wordCardList, setWordCardList] = useState([]);//收集内容列表
  let [isGive, setIsGive] = useState(false);//是否显示赠送图标
  let getWordConfig = () => {
    dispatch({
      type: 'collectWordRules/queryGameWordConfig',
      payload: {
        method: 'get',
        params: {
          activityId: activityInfo.objectId,
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let items = res.body;
          setGameNumber(items.gameNumber)
          setWordCardList(items.gameWordContentVOList);
          setIsGive(items.transfer == 1);
        } else {
          message.info(res.result.message)
        }
      }
    })
  }
  let [prizesList, setPrizeList] = useState([]);//奖池奖品信息
  let queryPrize = () => {
    dispatch({
      type: 'collectWordHome/queryPrize',
      payload: {
        method: 'get',
        params: {
          activityId: activityInfo.objectId,
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let items = res.body;
          setPrizeList(items)
        } else {
          message.info(res.result.message)
        }
      }
    })
  }
  return (
    <div>
      {/* 活动首页 */}
      <div className={styles.index_wrap} style={{ backgroundColor: `${indexColor.color5}`, backgroundImage: `url(${imageUrl})` }}>
        {/* 中奖广播条 */}
        {winBroadcastSwitch === 1 ? <div className={styles.index_broadcast}><NotificationOutlined /><em>185****1231刚刚获得了20元打车券</em></div> : null}
        <div className={styles.index_backgd}></div>
        {logo ?
          <div className={styles.index_logo} style={winBroadcastSwitch === 1 ? null : {top: "20px"}}><img src={logo} alt="" /></div>
            : null}
          {timeSwitch === 1 ?
            <div className={styles.index_time} style={{ "color": indexColor.color9 }}>
              <div className={styles.time_wrap}>
                {isBackClore2 ? <span style={{ "background": indexColor.color10 }}></span> : null}
                <div>{activityTime}</div>
              </div>
            </div>
          : null}
        <div className={styles.index_pos_bom}>
          <div className={styles.index_wordCards}>
            {wordCardList && wordCardList.length > 0 && wordCardList.map(item => {
              return <div className={styles.index_card}>
                <img src={item.img} alt="" />
                <div className={styles.index_card_num}>0张</div>
                <div className={styles.index_card_pop}></div>
              </div>
            })}
          </div>
          <div className={styles.index_info} style={{ top: winBroadcastSwitch === 1 ? '45px' : '15px' }}>
            <span className={`${styles.index_wrap_top_n1}`} style={{ 'color': indexColor.color4, 'background': indexColor.color3 }}>中奖记录</span>
            <span className={`${styles.index_wrap_top_n2}`} style={{ 'color': indexColor.color4, 'background': indexColor.color3 }}>活动规则</span>
          </div>
          <div className={styles.index_buttons}>
            <div className={styles.index_button}>
            {countdownSwitch == 1 && timeNum ?
              <span className={styles.button_countdown} style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>距离活动开始还剩余{timeNum}</span>
              :<span style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>{btnTxt ? btnTxt : '参与抽卡'}</span>}
            </div>
            {isIcoShare ? <div className={`${styles.index_share} ${styles.index_icon}`}>
              <img src={require("../../../../assets/activity/collectWord_share.png")} alt="" />
              <span>分享</span>
            </div> : null}
            {isGive ? <div className={`${styles.index_give} ${styles.index_icon}`}>
              <img src={require("../../../../assets/activity/collectWord_give.png")} alt="" />
              <span>赠送</span>
            </div> : null}
          </div>
          <div className={styles.index_count} style={{ "color": indexColor.color6 }}>
            {isBackClore1 ? <span style={{ "background": indexColor.color7 }}></span> : null}
            <i>剩余机会：{gameNumber}次</i>
          </div>
          <div className={styles.index_prizes}>
            <img src={require('../../../../assets/activity/collectWord_prize.png')} alt="" />
            <div className={styles.prize_title} style={{ "color": indexColor.color8 }}>{prizeTxt ? prizeTxt : '集齐所有卡片，合成开奖可随机获得奖池内的奖品~'}</div>
            <div className={styles.prize_content}>
              {prizesList && prizesList.length > 0 && prizesList.map(item => {
                return <div className={styles.prize_item}>
                  <img src={item.prizeImg} alt="" />
                  <div className={styles.prize_name}>{item.prizeName}</div>
                </div>
              })}
            </div>
          </div>
          {/* 分享 */}
          {isShowFirend ? <div className={styles.box_wrapper}>
            <div className={`${styles.phone_share} ${styles.phone_hover}`}>
              {
                firendType == 1 ? <img src={require('../../../../assets/activity/pirend_m1.png')} />
                  : firendType == 2 ? <img src={require('../../../../assets/activity/pirend_m2.png')} />
                    : firendType == 3 ? <img src={require('../../../../assets/activity/pirend_m3.png')} />
                      : firendType == 4 ? <img src={require('../../../../assets/activity/pirend_m4.png')} />
                        : null
              }
              <div className={styles.phone_share_top}>{shareFirend ? shareFirend : '分享好友立即得抽奖机会'} 0/{itemData.inviteFriendsNum ? itemData.inviteFriendsNum : 1}</div>
            </div>
          </div> : null}
          {isShowShare ? <div className={styles.box_wrapper}>
            <div className={`${styles.phone_share} ${styles.phone_hover}  ${styles.phone_share_bg} ${shareType == 1 ? styles.phone_share_bg1 : shareType == 2 ? styles.phone_share_bg2 : shareType == 3 ? styles.phone_share_bg3 : shareType == 4 ? styles.phone_share_bg4 : null}`}>
              <div className={styles.phone_share2_top}>{shareTitle ? shareTitle : '邀请好友注册助力'} 0/{itemData.inviteMemeberBoostNum ? itemData.inviteMemeberBoostNum : 1}</div>
              <div className={styles.phone_share_btn}>立即邀请</div>
              <div className={styles.phone_share_Copywriting}>{shareTitle1 ? shareTitle1 : '#文案描述#'}</div>
              <div className={styles.phone_share_list}>
                <span><i></i><em>用户名</em></span><span><i></i><em>用户名</em></span>
              </div>
            </div>
          </div> : null}
          {isShowAdver ? <div className={styles.box_wrapper}>
            <div className={`${styles.index_poster} ${styles.phone_hover}`} style={{ backgroundColor: isTaskStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : isTaskStyle == 2 ? '#0023EE' : isTaskStyle == 3 ? '#E53423' : isTaskStyle == 4 ? '#790000' : 'none' }} >
              {adverIsTit1 == 1 ?
                <h4 style={{ 'color': "#fff" }}><span>{adverTitName1 ? adverTitName1 : '广告标题'}</span>   {adverIsNum1 == 1 ? <span>  0/{itemData.specifyLinkNum ? itemData.specifyLinkNum : 0}</span> : null}</h4>
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
            <div className={styles.index_poster} style={{ backgroundColor: homeAdStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : homeAdStyle == 2 ? '#0023EE' : homeAdStyle == 3 ? '#E53423' : homeAdStyle == 4 ? '#790000' : 'none' }}>
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

export default connect(({ }) => ({

}))(collectWordPop);