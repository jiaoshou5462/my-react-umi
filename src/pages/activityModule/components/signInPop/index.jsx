import React, { useEffect, useState } from 'react';
import { Form, Carousel } from 'antd';
import { GiftOutlined, NotificationOutlined, ScheduleOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import styles from './style.less';
const signInPop = (props) => {
  let { dispatch, itemData } = props;
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  let [formData, setFormData] = useState({});
  let [adverForm] = Form.useForm();
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#D8D8D8",   //页面背景色  homePageBackgroundColor
    // color2: "#D8D8D8",   //活动规则背景色 activityRuleBackgroundColor
    // color3: "#868686",  //活动规则字体颜色 activityRuleFontColor
    color4: "#fff",  //签到栏背景色 signInDeskBackgroundColor
    color5: "#D8D8D8",   //签到按钮未签到按钮颜色 beforeSignInBackgroundColor
    color6: "#868686",  //签到按钮未签到字体颜色 beforeSignInFontColor
    color7: "#D8D8D8",   //签到按钮已签到按钮颜色 afterSignInBackgroundColor
    color8: "#868686",  //签到按钮已签到字体颜色 afterSignInFontColor
    color9: "#868686",  //签到栏主题字体颜色 signInDeskTopicFontColor
    color10: "#868686",  //签到栏提示字体颜色 signInDeskNoticeFontColor
    color11: "#fff",  //奖池背景色 prizePoolBackgroundColor
    color12: "#868686",  //奖池名称字体颜色 prizePoolNameFontColor
    color13: "#868686",  //奖池提示字体颜色 prizePoolNoticeFontColor
    color14: "#868686",  //奖品名称字体颜色 prizesNameFontColor
    color15: "#fff",   //签到规则背景色 signRulesBackgroundColor
    color16: "#868686",  //签到规则字体颜色 signRulesFontColor
    color17: "#868686",  //中奖记录字体颜色 winningRecordFontColor
  });
  //签到图标
  let [beforeSignImg, setBeforeSignImg] = useState('');//未签到
  let [afterSignImg, setAfterSignImg] = useState('');//已签到
  let [timeoutSignImg, setTimeoutSignImg] = useState('');//过时未签到
  let [prizeSignImg, setPrizeSignImg] = useState('');//奖品
  //签到主题文案
  let [signTopicWord, setSignTopicWord] = useState("签到抽好礼");
  //奖池提示文案
  let [prizePoolNotice, setPrizePoolNotice] = useState("奖品数量有限，先到先得");
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
  //是否显示展示广告位
  let [banChecked, setBanChecked] = useState(itemData.isHomeAdPreviewShow === 1 ? true : false);
  let [winBroadcastSwitch, setWinBroadcastSwitch] = useState(1);
  let [countdownSwitch, setCountdownSwitch] = useState(1);//倒计时
  let [isIcoShare, setIsIcoShare] = useState(itemData.isShare == 1 ? '1' : '');  //分享图标
  let [homeAdStyle, changeAdverType] = useState(itemData.homeAdStyle ? itemData.homeAdStyle : 1);
  let [adverIsTit, changeAdverIsTit] = useState(itemData.homeAdIsShow ? itemData.homeAdIsShow : 1);
  let [adverTitName, changeAdverTitName] = useState("");
  let [adverImg, setAdverImg] = useState([]);

  useEffect(() => {
    getStyleByActivityIdAndStyleCode();
    getStageSActivityThree();
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
      type: 'signInPop/backStageSActivityThree',
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
          setWinBroadcastSwitch(items.winBroadcastSwitch === 1 ? 1 : 0)
          setCountdownSwitch(items.countdownSwitch === 1 ? 1 : 0)
          let toSColor = indexColor;
          setindexColor({ ...toSColor });
        } else {
          message.error(res.result.message);
        }
      }
    });
  };
  //样式数据
  let getStyleByActivityIdAndStyleCode = () => {
    dispatch({
      type: 'signInPop/getStyleByActivityIdAndStyleCode',
      payload: {
        method: 'get',
        params: {
          styleCode: 'signInHome',
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let items = res.body && res.body.styleValue && JSON.parse(res.body.styleValue);
          if (items) {
            setFormData({ ...items });
            setImageUrl(items.homeBackgroundImage);
            let toSColor = indexColor;
            toSColor.color1 = items.homePageBackgroundColor || '#D8D8D8';
            // toSColor.color2 = items.activityRuleBackgroundColor || '#D8D8D8';
            // toSColor.color3 = items.activityRuleFontColor || '#868686';
            toSColor.color4 = items.signInDeskBackgroundColor || '#fff';
            toSColor.color5 = items.beforeSignInBackgroundColor || '#D8D8D8';
            toSColor.color6 = items.beforeSignInFontColor || '#868686';
            toSColor.color7 = items.afterSignInBackgroundColor || '#D8D8D8';
            toSColor.color8 = items.afterSignInFontColor || '#868686';
            toSColor.color9 = items.signInDeskTopicFontColor || '#868686';
            toSColor.color10 = items.signInDeskNoticeFontColor || '#868686';
            toSColor.color11 = items.prizePoolBackgroundColor || '#fff';
            toSColor.color12 = items.prizePoolNameFontColor || '#868686';
            toSColor.color13 = items.prizePoolNoticeFontColor || '#868686';
            toSColor.color14 = items.prizesNameFontColor || '#868686';
            toSColor.color15 = items.signRulesBackgroundColor || '#fff';
            toSColor.color16 = items.signRulesFontColor || '#868686';
            toSColor.color17 = items.winningRecordFontColor || '#868686';
            setindexColor({ ...toSColor });
            setBeforeSignImg(items.beforeSignImg);
            setAfterSignImg(items.afterSignImg);
            setTimeoutSignImg(items.timeoutSignImg);
            setPrizeSignImg(items.prizeSignImg);
            setSignTopicWord(items.signTopicWord ? items.signTopicWord : '签到抽好礼');
            setPrizePoolNotice(items.prizePoolNotice ? items.prizePoolNotice : '奖品数量有限，先到先得');
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
  let [prizesList, setPrizeList] = useState([]);//奖池奖品信息
  let queryPrize = () => {
    dispatch({
      type: 'signInHome/queryPrize',
      payload: {
        method: 'get',
        params: {
          activityId: activityInfo.objectId,
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let items = res.body;
          if(items.length > 9){
            items = items.slice(0,9)
          }
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
        <div className={styles.index_info}>活动规则</div>
        {isIcoShare == 1 ? <div className={styles.index_share}>分享活动</div> : null}
        <div className={styles.index_pos_bom}>
          <div className={styles.index_signin} style={{ 'background': indexColor.color4 }}>
            <div className={styles.title} style={{ 'color': indexColor.color9 }}>{signTopicWord ? signTopicWord : '签到抽好礼'}</div>
            <div className={styles.label} style={{ 'color': indexColor.color10 }}>已连续签到4天，还差1天就可抽奖啦！</div>
            <div className={styles.signin_content}>
              <div className={styles.item}>
                <img className={styles.icon} src={ afterSignImg ? afterSignImg : require('../../../../assets/activity/default_sign.png')} alt="" />
                <span className={styles.date}>第1天</span>
              </div>
              <div className={styles.item}>
                <img className={styles.icon} src={ timeoutSignImg ? timeoutSignImg : require('../../../../assets/activity/default_sign.png')} alt="" />
                <span className={styles.date}>第2天</span>
              </div>
              <div className={styles.item}>
                <img className={styles.icon} src={ afterSignImg ? afterSignImg : require('../../../../assets/activity/default_sign.png')} alt="" />
                <span className={styles.date}>第3天</span>
              </div>
              <div className={styles.item}>
                <img className={styles.icon} src={ beforeSignImg ? beforeSignImg : require('../../../../assets/activity/default_sign.png')} alt="" />
                <span className={styles.date} style={{ 'color': "#333",'fontWeight':'700' }}>第4天</span>
              </div>
              <div className={styles.item}>
                <img className={styles.icon} src={ prizeSignImg ? prizeSignImg : require('../../../../assets/activity/default_sign.png')} alt="" />
                <span className={styles.date}>第5天</span>
              </div>
              <div className={styles.item}>
                <img className={styles.icon} src={ beforeSignImg ? beforeSignImg : require('../../../../assets/activity/default_sign.png')} alt="" />
                <span className={styles.date}>第6天</span>
              </div>
              <div className={styles.item}>
                <img className={styles.icon} src={ beforeSignImg ? beforeSignImg : require('../../../../assets/activity/default_sign.png')} alt="" />
                <span className={styles.date}>第7天</span>
              </div>
            </div>
            <div className={styles.index_button}>
              {countdownSwitch == 1 && timeNum ?
              <span className={styles.button_countdown} style={{ 'color': indexColor.color6, 'background': indexColor.color5 }}>距离活动开始还剩余{timeNum}</span>
              :<span style={{ 'color': indexColor.color6, 'background': indexColor.color5 }}>立即签到</span>}
            </div>
            <div className={styles.signin_backgd}></div>
          </div>
          <div className={styles.index_prizes} style={{ 'background': indexColor.color11 }}>
            <div className={styles.prize_title}>
              <div className={styles.prize_topic} style={{ 'color': indexColor.color12 }}>活动奖池</div>
              <div className={styles.prize_label} style={{ 'color': indexColor.color13 }}><span>{prizePoolNotice ? prizePoolNotice : '奖品数量有限，先到先得'}</span></div>
            </div>
            <div className={styles.prize_content}>
              {prizesList && prizesList.length > 0 && prizesList.map(item => {
                return <div className={styles.prize_item}>
                  <img src={item.prizeImg} alt="" />
                  <div className={styles.prize_name} style={{ 'color': indexColor.color14 }}>{item.prizeName}</div>
                </div>
              })}
            </div>
          </div>
          <div className={styles.index_rules} style={{ 'background': indexColor.color15 }}>
            <div className={styles.rules_content}>
              <div className={styles.rules_item}>
                <div className={styles.rules_title}>
                <ScheduleOutlined className={styles.rules_icon} style={{ 'color': indexColor.color17 }}/>
                <span style={{ 'color': indexColor.color16 }}>连续签到X天</span>
                </div>
                <div className={styles.rules_btn}>已过期</div>
              </div>
              <div className={styles.rules_item}>
                <div className={styles.rules_title}>
                  <ScheduleOutlined className={styles.rules_icon} style={{ 'color': indexColor.color17 }}/>
                  <span style={{ 'color': indexColor.color16 }}>连续签到X天</span>
                  </div>
                  <div className={styles.rules_btn} style={{ 'color': indexColor.color8, 'background': indexColor.color7 }}>已抽奖</div>
              </div>
              <div className={styles.rules_item}>
                <div className={styles.rules_title}>
                <ScheduleOutlined className={styles.rules_icon} style={{ 'color': indexColor.color17 }}/>
                <span style={{ 'color': indexColor.color16 }}>连续签到X天</span>
                </div>
                <div className={styles.rules_btn} style={{ 'color': indexColor.color6, 'background': indexColor.color5 }}>立即抽奖</div>
              </div>
              <div className={styles.rules_item}>
                <div className={styles.rules_title}>
                <ScheduleOutlined className={styles.rules_icon} style={{ 'color': indexColor.color17 }}/>
                <span style={{ 'color': indexColor.color16 }}>连续签到X天</span>
                </div>
                <div className={styles.rules_btn} style={{ 'color': indexColor.color8, 'background': indexColor.color7 }}>未完成</div>
              </div>
            </div>
            <div className={styles.rules_line} style={{ 'background': indexColor.color17 }}></div>
            <div className={styles.index_record} style={{ 'color': indexColor.color17 }}>查看中奖记录</div>
          </div>
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

}))(signInPop);