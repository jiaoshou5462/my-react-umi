import React, { useEffect, useState } from 'react';
import { Button, Upload, message } from 'antd';
import { connect, history } from 'umi';
import { uploadIcon } from '@/services/activity.js';
import styles from './style.less';
import SetColor from '../setColor';   //选择颜色组件
import { LeftOutlined, EllipsisOutlined,CloseCircleOutlined } from '@ant-design/icons';
// import LayerModal from '../layerModal';   //取消、上一步弹窗

const seckilHomePreview = (props) => {
  let { dispatch,homeDataInit,popTypes  } = props;
  const [indexInt, setIndexInt] = useState(1); //活动首页对应状态
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#1890FF",   //按钮背景色
    color2: "#fff",  //按钮字体颜色
    color3: "#4A90E2",  //主题颜色
  });
  let [imageUrl, setImageUrl] = useState("");  //首页背景
  let [isIcoShare, setIsIcoShare] = useState('');  //分享图标


  //首页切换工具栏
  let setTools = (i) => {
    setIndexInt(i)
  };
  //本场状态
  let [tabListTime, setTabListTime] = useState({
    siteType: 3,
    time: 0
  });
  //场次
  let [backstageShowList, setBackstageShowList] = useState([]);
  //当前所选场次
  let [toTabActivity, setToTabActivity] = useState(0);
  //个位补0
  let Appendzero = (obj) => {
    if (parseInt(obj) < 10) {
      if (parseInt(obj) <= 0) {
        return "00";
      } else {
        return "0" + parseInt(obj);
      }
    } else {
      return parseInt(obj);
    }
  }
  //切换tab
  let changTabNav = (i) => {
    setToTabActivity(i)
  }
  let [margTops, setMargTops] = useState(0);   //当前滚动值
  let [margTypes, setMargTypes] = useState(false);
  let [cY, setCY] = useState(0);
  let touchMouseDw = (e) => {
    setCY(e.clientY);
    setMargTypes(true)
  }
  window.onmouseup = (e) => {
    if (margTypes) {
      let ny = e.clientY;
      let toMargTops = margTops;
      if (ny > cY) {    //下滚
        toMargTops = parseInt(toMargTops) - (parseInt(ny) - parseInt(cY));
      } else {    //上滚
        toMargTops = parseInt(toMargTops) + (parseInt(cY) - parseInt(ny))
      }
      let mainHg = document.getElementById("listViews").clientHeight;
      let mainHgr = document.getElementById("listViewsMr").clientHeight;
      if (toMargTops >= (mainHgr - mainHg)) {
        toMargTops = mainHgr - mainHg;
      }
      setMargTops(toMargTops > 0 ? toMargTops : 0)
      setMargTypes(false);
    }
  }
  window.onmousemove = (e) => {
    if (margTypes) {
      let ny = e.clientY;
      let toMargTops = margTops;
      if (ny > cY) {    //下滚
        toMargTops = parseInt(toMargTops) - (parseInt(ny) - parseInt(cY));
      } else {    //上滚
        toMargTops = parseInt(toMargTops) + (parseInt(cY) - parseInt(ny))
      }
      document.getElementById("listViews").scrollTop = toMargTops;
    }
  }
  let touchScroll = (e) => {
    if (!margTypes) {
      setMargTops(document.getElementById("listViews").scrollTop)
    }
  }

  useEffect(() => {
    preViewHomePage()
  }, [homeDataInit,popTypes])
  let preViewHomePage = () => {
    let items = homeDataInit
    items.seckillBackgroundImg ? setImageUrl(items.seckillBackgroundImg) : '';
    let toSColor = indexColor;
    toSColor.color3 = items.seckillThemeColor || '#1890FF';
    toSColor.color2 = items.seckillFontColor || '#fff';
    toSColor.color1 = items.seckillBackgroundColor || '#1890FF';
    setindexColor({ ...toSColor });
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
  let [activityTypes,setActivityTypes] =  useState(2)
  return (
    <div className={styles.wrap_prby}>
      <div className={styles.wrap_preview}>
        <div className={styles.phone_wrap}>
          <div className={styles.phone_img1}><img src={require('../../../../../../assets/activity/setpage_m1.png')}></img></div>
          <div className={styles.phone_img2}><LeftOutlined className={styles.phone_img2_1} /><span></span><EllipsisOutlined className={styles.phone_img2_2} /></div>
          <div className={styles.phone_img3}><img src={require('../../../../../../assets/activity/setpage_m2.png')}></img></div>
          {/* 活动首页 */}
          <div className={styles.index_wrap}>
            <div className={styles.index_wrap_top}>
              {imageUrl ? <img onClick={setTools.bind(this, 1)} className={`${styles.index_wrap_top_moimg2} ${indexInt == 1 ? styles.index_wrap_actives : ''}`} src={imageUrl}></img> :
                <div onClick={setTools.bind(this, 1)} className={`${styles.index_wrap_top_moimg} ${indexInt == 1 ? styles.index_wrap_actives : ''}`}><img src={require('../../../../../../assets/activity/setpage_m3.png')}></img></div>}
              <div className={styles.index_wrap_top_btn}>
                <span className={`${styles.index_wrap_top_n1}`} onClick={setTools.bind(this, 2)} style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>活动规则</span>
                <span className={`${styles.index_wrap_top_n2}`} onClick={setTools.bind(this, 2)} style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>秒杀记录</span></div>
            </div>

            {isIcoShare ? <div className={styles.index_share}><img src={require('../../../../../../assets/activity/setpage_m18.png')}></img></div> : null}
            <div className={`${styles.index_main} ${indexInt == 3 ? styles.index_wrap_actives : ''}`} onClick={setTools.bind(this, 3)}>
              <div className={styles.index_main_top}>
                <img src={require('../../../../../../assets/activity/seckil_m1.png')}></img>
                <div className={styles.index_main_top_time} style={{ 'color': indexColor.color3 }}>{
                  tabListTime.siteType == 1 ? '距本场结束' : tabListTime.siteType == 2 ? '距下场开始' : '本次秒杀已结束'
                }
                  {tabListTime.siteType == 1 || tabListTime.siteType == 2 ? <em><span><i style={{ 'background': indexColor.color3 }}></i>{Appendzero(parseInt((tabListTime.time / 3600000)))}</span> : <span><i style={{ 'background': indexColor.color3 }}></i>{Appendzero(parseInt(tabListTime.time / 60000 % 60))}</span> : <span><i style={{ 'background': indexColor.color3 }}></i>{Appendzero(parseInt(tabListTime.time / 1000 % 60))}</span></em> : ''}</div>
              </div>

              <div className={styles.index_main_tab}>
                {
                  backstageShowList.map((items, i) => {
                    return <span className={items.status == 1 || toTabActivity == i ? styles.index_main_tabon : ''} onClick={() => { changTabNav(i) }}><strong style={{ 'color': items.status == 1 || toTabActivity == i ? indexColor.color3 : '' }}>{items.status == 1 ? '进行中' : items.status == 2 ? '已结束' : items.date}</strong>
                      <i style={{ 'background': items.status == 1 || toTabActivity == i ? indexColor.color3 : '' }}>{items.status == 1 ? '抢购中' : items.status == 2 ? '抢光啦' : items.time}</i>
                    </span>
                  })
                }
              </div>

              <div className={styles.index_main_list} id="listViews" onMouseDown={touchMouseDw} onScroll={touchScroll}>
                <div className={styles.index_main_list_main} id='listViewsMr'>
                  {
                    backstageShowList[toTabActivity] && backstageShowList[toTabActivity].seckillGoods ? backstageShowList[toTabActivity].seckillGoods.map((item) => {
                      return <div className={styles.index_main_li}>
                        <img src={item.prizeImg ? item.prizeImg : require('../../../../../../assets/activity/seckil_m3.png')}></img>
                        <div className={styles.index_main_ln}>
                          <h5>{item.tradeTag ? <i style={{ 'color': indexColor.color3, 'borderColor': indexColor.color3 }}>{item.tradeTag}</i> : null}<span>{item.tradeDisplayName}</span></h5>
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
export default connect(({ }) => ({

}))(seckilHomePreview);
