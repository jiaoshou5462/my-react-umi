import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import styles from './style.less';

let originTime = '';
const discountPop = (props) => {
  let { dispatch, itemData, applyTheme } = props;
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  let [formData, setFormData] = useState({});
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#1890FF",   //按钮背景色
    color2: "#fff",  //按钮字体颜色
    color3: "#fff",  //周边字体颜色
    color5: "#ffffff",  //页面背景色
    color6: "rgba(0,0,0,.5)",  //周边背景色
    color7: "#868686",  //活动时间字体颜色
    color8: "rgba(0,0,0,.3)",  //活动时间背景色
  });
  let [imageUrl, setImageUrl] = useState("");  //首页背景
  let [isIcoShare, setIsIcoShare] = useState('');  //分享图标
  let [words,setWords]=useState("立即购买");
  let [timeSwitch, setTimeSwitch] = useState(1);//活动时间
  let [isBackClore2, setIsBackClore2] = useState(false);//活动时间
  let [activityTime, setActivityTime] = useState('活动时间');//活动时间输入
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
  let [buyLimitNum, setBuyLimitNum] = useState(1);
  //数据获取
  let getBuyCheaperPageStyle = () => {
    dispatch({
      type: 'discountHome/getBuyCheaperPageStyle',
      payload: {
        method: 'get',
        params: {
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
          let isShare = items.isShare == 1 ? '1' : '';
          setIsIcoShare(isShare)
          setTimeSwitch(items.timeSwitch === 1 ? 1 : 0);
          setBuyLimitNum(items.count);
          originTime = items.startTime + '——' + items.endTime;
        } else {
          message.error(res.result.message);
        }
      }
    });
  };
  useEffect(()=>{
    if(applyTheme){
      getStyleByActivityIdAndStyleCode();
    }else{
      if (activityInfo && activityInfo.objectId && activityInfo.channelId) {
        getBuyCheaperPageStyle();
      }
    }
  },[applyTheme])
  //样式数据
  let getStyleByActivityIdAndStyleCode = () => {
    dispatch({
      type: 'discountHome/getStyleByActivityIdAndStyleCode',
      payload: {
        method: 'get',
        params: {
          styleCode: 'discountHome',
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let items = res.body && res.body.styleValue && JSON.parse(res.body.styleValue);
          window.activityData_materialApply = {...window.activityData_materialApply};
          window.activityData_materialApply.activityTime = items.activityTime ? items.activityTime : originTime;
          window.activityData_materialApply.homeButtonContent = items.homeButtonContent;
          window.activityData_materialApply.buyPageButtonContent = items.buyPageButtonContent;
          setActivityTime(items.activityTime ? items.activityTime : originTime);
          if(items){
            setFormData({ ...items });
            setImageUrl(items.homeImag);
            if(items.homeButtonContent){
              setWords(items.homeButtonContent);
            }
            let toSColor = indexColor;
            toSColor.color5 = items.homeBackgroundColor || '#ffffff';
            toSColor.color3 = items.homeFloatTypefaceColor || '#fff';
            toSColor.color2 = items.homeButtonTypefaceColor || '#fff';
            toSColor.color1 = items.homeButtonBackgroundColor || '#1890FF';
            toSColor.color6 = items.homeFloatBackgroundColor || 'rgba(0,0,0,.5)';
            toSColor.color7 = items.activityTimeFontColor || '#868686';
            toSColor.color8 = items.activityTimeBackgroundColor || 'rgba(0,0,0,.3)';
            setindexColor({ ...toSColor });
            if (items.activityTimeBackgroundColor) {
              setIsBackClore2(true)
            } else {
              setIsBackClore2(false)
            }
          }
        }
      }
    });
  }
  return (
    <div>
        <div className={styles.phone_wrap}>
            {/* 活动首页 */}
            <div className={styles.index_wrap} style={{ background: `${indexColor.color5}` }}>
                <div className={styles.index_backgd}><img src={imageUrl}></img></div>
                {logo ?
                <div className={styles.index_logo}><img src={logo} alt="" /></div>
                 : null}
                <div className={styles.index_info}>
                  <span className={styles.info_rule} style={{ 'background': indexColor.color6,'color': indexColor.color3 }}>活动规则</span>
                  <span className={styles.info_record} style={{ 'background': indexColor.color6,'color': indexColor.color3 }}>购买记录</span>
                </div>
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
                    <span style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>{words}</span>
                  </div>
                  {buyLimitNum != null ? <div className={styles.index_limitNum}>
                    <div>
                      <span className={styles.limitNum_label}  style={{ 'color': indexColor.color1 }}>您有{buyLimitNum}次参与机会</span>
                      <span className={styles.limitNum_bg} style={{ 'background': indexColor.color2 }}></span>
                    </div>
                  </div> : null}
                </div>
            </div>
        </div>
    </div>
  )
}

export default connect(({selectTheme }) => ({
  applyTheme: selectTheme.applyTheme
}))(discountPop);