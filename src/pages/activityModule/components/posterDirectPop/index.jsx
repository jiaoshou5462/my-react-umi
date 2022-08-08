import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import styles from './style.less';

let originTime = "";
const posterDirectPop = (props) => {
  let { dispatch, itemData } = props;
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
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
  let [banChecked, setBanChecked] = useState(false);  //广告位
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#D8D8D8",   //按钮背景色
    color2: "#868686",  //按钮字体颜色
    color3: "#D8D8D8",  //周边字体颜色
    color5: "#ffffff",  //页面背景色
    color6: "rgba(0,0,0,.3)",  //周边背景色
    color7: "#868686",  //活动时间字体颜色
    color8: "rgba(0,0,0,.3)",  //活动时间背景色
  });
  let [imageUrl, setImageUrl] = useState("");  //首页背景
  let [isIcoShare, setIsIcoShare] = useState('');  //分享图标
  let [winBroadcastSwitch, setWinBroadcastSwitch] = useState(1);//广播
  let [countdownSwitch, setCountdownSwitch] = useState(1);//倒计时
  let [timeSwitch, setTimeSwitch] = useState(1);//活动时间
  let [startTime, setStartTime] = useState("");//开始时间
  let [endTime, setEndTime] = useState("");//结束时间
  let [btnTxt, setBtnTxt] = useState("获取海报");  //按钮名称
  //是否需透明底
  let [isBackClore, setIsBackClore] = useState(false);//规则 记录
  let [isBackClore2, setIsBackClore2] = useState(false);//活动时间
  //广告标题
  let [homeAdStyle, changeAdverType] = useState(1);
  let [adverIsTit, changeAdverIsTit] = useState(1);//广告标题是否显示
  let [adverTitName, changeAdverTitName] = useState("");
  let [adverImg, setAdverImg] = useState([]);
  let [activityTime, setActivityTime] = useState('活动时间');//活动时间输入
  useEffect(() => {
    getStyleByActivityIdAndStyleCode();
    getStageSActivityThree();
  }, []);
  //样式数据
  let getStyleByActivityIdAndStyleCode = () => {
    dispatch({
      type: 'visPop/getStyleByActivityIdAndStyleCode',
      payload: {
        method: 'get',
        params: {
          styleCode: 'posterDirectHome',
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let items = res.body && res.body.styleValue && JSON.parse(res.body.styleValue);
          setActivityTime(items.activityTime ? items.activityTime : originTime);
          if (items) {
            setImageUrl(items.homeBackgroundImage);
            let toSColor = indexColor;
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
            changeAdverType(items.homeAdStyle ? items.homeAdStyle : 1);
            setindexColor({ ...toSColor });
            setBtnTxt(items.homeParticipateButtonTxt);
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
      type: 'posterDirectPop/queryEnterpriseLogo',
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
        if (res.result.code == "0") {
            let items = res.body;
            if(items.isEnterprise){
              queryEnterpriseLogo();
            }
            let isShare = items.isShare == 1 ? '1' : '';
            setIsIcoShare(isShare);
            let timestamp = (new Date()).getTime();
            let toStamp = timestamp > new Date(items.startTime).getTime() ? 0 : new Date(items.startTime).getTime() - timestamp;
            toStamp = toStamp == 0 ? 0 : setMoment(toStamp);
            setTimeNum(toStamp);
            setWinBroadcastSwitch(items.winBroadcastSwitch === 1 ? 1 : 0);
            setCountdownSwitch(items.countdownSwitch === 1 ? 1 : 0);
            setTimeSwitch(items.timeSwitch === 1 ? 1 : 0)
            originTime = items.startTime + '——' + items.endTime;
            // setStartTime(items.startTime)
            // setEndTime(items.endTime)
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
            {isIcoShare ? <div className={styles.index_share}><img src={require('../../../../assets/activity/setpage_m18.png')}></img></div> : null}
              <div className={styles.index_pos_bom}>
                <div className={styles.index_button}>
                  {countdownSwitch == 1 && timeNum ?
                  <span className={styles.button_countdown} style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>距离活动开始还剩余{timeNum}</span>
                  :<span style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>{btnTxt ? btnTxt : '获取海报'}</span>}
                </div>
                <div className={styles.index_info} style={{ 'color': indexColor.color3 }}>
                  {isBackClore ? <span style={{ 'background': indexColor.color6 }}></span> : null}
                  <i>活动规则  |  中奖记录</i>
                </div>
                {banChecked ? <div className={styles.box_wrapper}>
                    <div className={styles.index_poster} style={{ backgroundColor: homeAdStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : homeAdStyle == 2 ? '#0023EE' : homeAdStyle == 3 ? '#E53423' : homeAdStyle == 4 ? '#790000' : 'none' }}>
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

export default connect(({ }) => ({

}))(posterDirectPop);