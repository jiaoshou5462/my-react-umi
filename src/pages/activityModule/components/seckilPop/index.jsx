import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import styles from './style.less';

const activityMould = (props) => {
  let { dispatch, itemData, applyTheme } = props;
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  let [formData, setFormData] = useState({});
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#1890FF",   //按钮背景色
    color2: "#fff",  //按钮字体颜色
    color3: "#4A90E2",  //主题颜色
  });
  let [imageUrl, setImageUrl] = useState("");  //首页背景
  let [styleType, setStyleType] = useState(1); //样式单选
  let [isIcoShare, setIsIcoShare] = useState('');  //分享图标
  //当前所选场次
  let [toTabActivity, setToTabActivity] = useState(0);
  //本场状态
  let [tabListTime, setTabListTime] = useState({
    siteType: 3,
    time: 0
  });
  useEffect(()=>{
    if(applyTheme){
      getStyleByActivityIdAndStyleCode();
    }else{
      getStyleByActivityIdAndStyleCode();
    }
  },[applyTheme])
  //样式数据
  let getStyleByActivityIdAndStyleCode = () => {
    dispatch({
      type: 'seckilHome/getStyleByActivityIdAndStyleCode',
      payload: {
        method: 'get',
        params: {
          styleCode: 'seckilHome',
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let items = res.body && res.body.styleValue && JSON.parse(res.body.styleValue);
          if(items){
            setFormData({ ...items });
            items.seckillBackgroundImg ? setImageUrl(items.seckillBackgroundImg) : '';
            let toSColor = indexColor;
            toSColor.color3 = items.seckillThemeColor || '#1890FF';
            toSColor.color2 = items.seckillFontColor || '#fff';
            toSColor.color1 = items.seckillBackgroundColor || '#1890FF';
            setindexColor({ ...toSColor });
          }
        }
      }
    });
  }
  //场次
  let [backstageShowList, setBackstageShowList] = useState([]);
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
  useEffect(() => {
    if (Object.keys(itemData).length > 0) {
      // itemData.seckillBackgroundImg ? setImageUrl(itemData.seckillBackgroundImg) : '';
      // let toSColor = indexColor;
      // toSColor.color3 = itemData.seckillThemeColor || '#1890FF';
      // toSColor.color2 = itemData.seckillFontColor || '#fff';
      // toSColor.color1 = itemData.seckillBackgroundColor || '#1890FF';
      // setindexColor({ ...toSColor });
      // setStyleType(itemData.seckillActivityRuleStyle ? itemData.seckillActivityRuleStyle : 1);
      if(itemData.isEnterprise){
        queryEnterpriseLogo();
      }
      let isShare = itemData.isShare == 1 ? '1' : '';
      setIsIcoShare(isShare)
      //场次设置
      let toTabList = [];
      let toTabActivitys = 0;
      let isInHave = false;   //是否有进行中
      let toTabListTime = {
        siteType: 3,
        time: 0
      }
      itemData.backstageShowList = itemData.backstageShowList.map(item => {
        item.startTime = new Date(item.startTime).getTime();
        return item
      })
      itemData.backstageShowList.forEach((e, i) => {
        if (e.startTime) {
          let times = new Date(e.startTime)
          e.date = (times.getMonth() + 1) + '月' + times.getDate() + '日';
          e.time = times.getHours() + ":" + times.getMinutes() + ":" + times.getSeconds();
        } else {
          e.date = '-月-日';
          e.time = '00:00:00';
        }
        if (e.status == 1) {
          setToTabActivity(i);
          toTabActivitys = i;
          isInHave = true;
        }
        toTabList.push(e);
      });
      if (isInHave) {      //当有进行中
        if (itemData.backstageShowList[toTabActivitys].referenceTime) {
          let timestamp = (new Date()).valueOf();
          toTabListTime.siteType = 1;
          let toTimes = parseInt((parseInt(itemData.backstageShowList[toTabActivitys].referenceTime) - timestamp));
          toTabListTime.time = toTimes;
        }
      } else {
        let isNotStarted = false;
        for (var i = 0; i < itemData.backstageShowList.length; i++) {
          if (itemData.backstageShowList[i].status === 0) {
            isNotStarted = true;
            toTabActivitys = i;
            break;
          }
        }
        if (isNotStarted) {   //下场开始
          if (itemData.backstageShowList[toTabActivitys].startTime) {
            let timestamp = (new Date()).valueOf();
            let toTimes = parseInt((parseInt(itemData.backstageShowList[toTabActivitys].startTime) - timestamp));
            toTabListTime.time = toTimes;
            toTabListTime.siteType = 2;
          }
        } else {
          toTabListTime.siteType = 3;
          toTabListTime.time = 0;
          toTabActivitys = parseInt(itemData.backstageShowList.length - 1);
        }
      }
      setToTabActivity(toTabActivitys);
      setTabListTime({ ...toTabListTime });
      setBackstageShowList([...toTabList])
    }
  }, [itemData]);
  //个位补0
  let Appendzero = (obj) => {
    if (obj < 10) return "0" + obj; else return obj;
  }
  return (
    <div className={styles.phone_moudle}>
      <div className={styles.index_wrap_top}>
        {imageUrl ? <img src={imageUrl}></img> :
          <div className={styles.index_wrap_top_moimg}><img src={require('../../../../assets/activity/setpage_m3.png')}></img></div>}
        <div className={styles.index_wrap_top_btn}>
          <span className={styles.index_wrap_top_n1} style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>活动规则</span>
          <span className={styles.index_wrap_top_n2} style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>秒杀记录</span></div>
      </div>
      {logo ?
        <div className={styles.index_logo}><img src={logo} alt="" /></div>
        : null}
      {isIcoShare ? <div className={styles.index_share}><img src={require('../../../../assets/activity/setpage_m18.png')}></img></div> : null}
      <div className={styles.index_main}>
        <div className={styles.index_main_top}>
          <img src={require('../../../../assets/activity/seckil_m1.png')}></img>
          <div className={styles.index_main_top_time} style={{ 'color': indexColor.color3 }}>{
            tabListTime.siteType == 1 ? '距本场结束' : tabListTime.siteType == 2 ? '距下场开始' : '本次秒杀已结束'
          }
            {tabListTime.siteType == 1 || tabListTime.siteType == 2 ? <em><span><i style={{ 'background': indexColor.color3 }}></i>{Appendzero(parseInt((tabListTime.time / 3600000)))}</span> : <span><i style={{ 'background': indexColor.color3 }}></i>{Appendzero(parseInt(tabListTime.time / 60000 % 60))}</span> : <span><i style={{ 'background': indexColor.color3 }}></i>{Appendzero(parseInt(tabListTime.time / 1000 % 60))}</span></em> : ''}</div>
        </div>

        <div className={styles.index_main_tab}>
          {
            backstageShowList.map((items, i) => {
              return <span className={items.status == 1 || toTabActivity == i ? styles.index_main_tabon : ''}><strong style={{ 'color': items.status == 1 || toTabActivity == i ? indexColor.color3 : '' }}>{items.status == 1 ? '进行中' : items.status == 2 ? '已结束' : items.date}</strong>
                <i style={{ 'background': items.status == 1 || toTabActivity == i ? indexColor.color3 : '' }}>{items.status == 1 ? '抢购中' : items.status == 2 ? '抢光啦' : items.time}</i>
              </span>
            })
          }
        </div>

        <div className={styles.index_main_list}>
          {
            backstageShowList[toTabActivity] && backstageShowList[toTabActivity].seckillGoods ? backstageShowList[toTabActivity].seckillGoods.map((item) => {
              return <div className={styles.index_main_li}>
                <img src={item.prizeImg ? item.prizeImg : require('../../../../assets/activity/seckil_m3.png')}></img>
                <div className={styles.index_main_ln}>
                  <h5>{item.tradeTag ? <i style={{ 'color': indexColor.color3, 'borderColor': indexColor.color3 }}>{item.tradeTag}</i> : null}<span>{item.prizeName}</span></h5>
                  <p>{item.tradeDescribe}</p>
                  <div className={styles.index_main_lbom}>
                    <i>剩余{item.activityStockNum}件</i>
                    <span style={{ 'background': indexColor.color3, 'opacity': backstageShowList[toTabActivity].status == 1 ? '1' : '0.3' }}>马上抢</span>
                  </div>
                </div>
              </div>
            }) : null
          }
        </div>

      </div>
    </div>
  )
}

export default connect(({selectTheme }) => ({
  applyTheme: selectTheme.applyTheme
}))(activityMould);