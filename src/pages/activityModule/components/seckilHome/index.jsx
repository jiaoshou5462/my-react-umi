import React, { useEffect, useState } from 'react';
import { Button, Upload, message } from 'antd';
import { connect, history } from 'umi';
import { uploadIcon } from '@/services/activity.js';
import styles from './style.less';
import SetColor from '../setColor';   //选择颜色组件
import { LeftOutlined, EllipsisOutlined } from '@ant-design/icons';
import LayerModal from '../layerModal';   //取消、上一步弹窗

const activityPage = (props) => {
  let { dispatch, itemData, onChangType, isDataStore, storeConfig, setIsDataStore, setIsDataTypes, showLayer, isDataChange, applyTheme } = props;
  let [formData, setFormData] = useState({});
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  const [indexInt, setIndexInt] = useState(1); //活动首页对应状态
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#1890FF",   //按钮背景色
    color2: "#fff",  //按钮字体颜色
    color3: "#4A90E2",  //主题颜色
  });
  let [imageUrl, setImageUrl] = useState("");  //首页背景
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  let [isIcoShare, setIsIcoShare] = useState('');  //分享图标
  //取消弹窗
  let [isCancelModal, setIsCancelModal] = useState(false);
  let setIsCancel = () => {
    if (isDataChange) {
      showLayer(4)
    } else {
      setIsCancelModal(true);
    }
  }
  let onClickCancel = (e) => {
    setIsCancelModal(false);
    setIsStepBack(false);
  }
  useEffect(()=>{
    if(applyTheme){
      getStyleByActivityIdAndStyleCode();
    }else{
      if (activityInfo && activityInfo.objectId && activityInfo.channelId) {
        getStyleByActivityIdAndStyleCode();
      }
    }
  },[applyTheme])
  //上一步
  let [isStepBack, setIsStepBack] = useState(false);
  let [isStepInt, setIsStepInt] = useState(0);   //跳转对应页
  let setStepBack = (i) => {
    if (isDataChange) {
      showLayer(3)
    } else {
      setIsStepInt(i);
      setIsStepBack(true);
    }
  }
  let setStepNext = () => {
    if (isDataChange) {
      showLayer(2)
    } else {
      history.push("/activityConfig/activityList/activityModule/finish");
    }
  }
  //  上传背景图
  let beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error('请上传JPG/PNG/GIF 格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('Image must smaller than 5MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  let handleChange = info => {
    if (info.file.status === 'done') {
      setImageUrl(info.file.response.items)
      onChangType(true);
    }
  };
  //颜色切换
  let setMcolor = (n, i) => {
    let toMcolors = { ...indexColor };
    toMcolors[n] = i;
    setindexColor(toMcolors);
    onChangType(true);
  }

  //首页切换工具栏
  let setTools = (i) => {
    setIndexInt(i)
  };
  //提交保存
  let subInfo = () => {
    let toFormData = formData;
    toFormData.seckillBackgroundImg = imageUrl,
    toFormData.seckillFontColor = indexColor.color2,
    toFormData.seckillBackgroundColor = indexColor.color1,
    toFormData.seckillThemeColor = indexColor.color3
    dispatch({
      type: 'seckilHome/newStyleSave',
      payload: {
        method: 'postJSON',
        params: {
          styleCode: 'seckilHome',
          activityId: activityInfo.objectId,
          styleValue: JSON.stringify(toFormData)
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          message.success(res.result.message);
          onChangType(false);
          if (isDataStore) {
            storeConfig(true);
          }
        } else {
          setIsDataStore(false)
          setIsDataTypes(false)
          message.error(res.result.message);
        }
      }
    });
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
    //数据回显
    if (Object.keys(itemData).length > 0) {
      // itemData.seckillBackgroundImg ? setImageUrl(itemData.seckillBackgroundImg) : '';
      // let toSColor = indexColor;
      // toSColor.color3 = itemData.seckillThemeColor || '#1890FF';
      // toSColor.color2 = itemData.seckillFontColor || '#fff';
      // toSColor.color1 = itemData.seckillBackgroundColor || '#1890FF';
      // setindexColor({ ...toSColor });
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
          let times = new Date(e.startTime);
          e.date = (times.getMonth() + 1) + '月' + times.getDate() + '日';
          e.time = Appendzero(times.getHours()) + ":" + Appendzero(times.getMinutes()) + ":" + Appendzero(times.getSeconds());
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
  }, [itemData])
  useEffect(() => {
    if (isDataStore) {
      subInfo();
    }
  }, [isDataStore]);
  return (
    <div>
      <LayerModal iscancal={isCancelModal} onClickCancel={onClickCancel} isstopback={isStepBack} isstepint={isStepInt} />
      {/* 预览、编辑 */}
      <div className={styles.by_main}>
        {/* 预览-首页 */}
        <h2 className={styles.wrap_titles}>
          <div className={styles.wrap_title_h2}>
            <em>预览</em>
            <div style={{ marginLeft: '320px' }}>
              {
                indexInt === 1 ? '背景图' :
                  indexInt === 2 ? '周边功能按钮' :
                    indexInt === 3 ? '秒杀区域' : ''}
            </div>
          </div>
        </h2>
        <div className={styles.wrap_prby}>
          <div className={styles.wrap_preview}>
            <div className={styles.phone_wrap}>
              <div className={styles.phone_img1}><img src={require('../../../../assets/activity/setpage_m1.png')}></img></div>
              <div className={styles.phone_img2}><LeftOutlined className={styles.phone_img2_1} /><span>{activityInfo.internalName}</span><EllipsisOutlined className={styles.phone_img2_2} /></div>
              <div className={styles.phone_img3}><img src={require('../../../../assets/activity/setpage_m2.png')}></img></div>
              {/* 活动首页 */}
              <div className={styles.index_wrap}>
                <div className={styles.index_wrap_top}>
                  {logo ?
                    <div className={styles.index_logo}><img src={logo} alt="" /></div>
                    : null}
                  {imageUrl ? <img onClick={setTools.bind(this, 1)} className={`${styles.index_wrap_top_moimg2} ${indexInt == 1 ? styles.index_wrap_actives : ''}`} src={imageUrl}></img> :
                    <div onClick={setTools.bind(this, 1)} className={`${styles.index_wrap_top_moimg} ${indexInt == 1 ? styles.index_wrap_actives : ''}`}><img src={require('../../../../assets/activity/setpage_m3.png')}></img></div>}
                  <div className={styles.index_wrap_top_btn}>
                    <span className={`${styles.index_wrap_top_n1}`} onClick={setTools.bind(this, 2)} style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>活动规则</span>
                    <span className={`${styles.index_wrap_top_n2}`} onClick={setTools.bind(this, 2)} style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>秒杀记录</span></div>
                </div>

                {isIcoShare ? <div className={styles.index_share}><img src={require('../../../../assets/activity/setpage_m18.png')}></img></div> : null}
                <div className={`${styles.index_main} ${indexInt == 3 ? styles.index_wrap_actives : ''}`} onClick={setTools.bind(this, 3)}>
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
                            <img src={item.prizeImg ? item.prizeImg : require('../../../../assets/activity/seckil_m3.png')}></img>
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
          </div>
          {/* 编辑 */}
          <div className={styles.side_style}>
            <div className={styles.style_box}>
              {/* 背景图 */}
              {indexInt == 1 ?
                <div className={styles.style_box_m1}>
                  <div className={styles.style_box_main}>
                    <strong>背景图</strong>
                    {imageUrl ? 
                      <div className={styles.backImg_show}>
                        <img src={imageUrl} alt="" />
                      </div>
                    : null}
                    <div className={styles.style_m1_upimg}>
                      <div className={styles.style_upimg_btn}>
                        <Upload
                          name="files"
                          action={uploadIcon}
                          beforeUpload={beforeUpload}
                          onChange={handleChange}
                          headers={headers}
                        >
                          <Button>上传图片</Button>
                        </Upload>
                      </div>

                      <p>建议尺寸：750px*470px</p>
                    </div>
                  </div>
                  <div className={styles.style_box_btn}><Button type="primary" onClick={subInfo}>保存</Button></div>
                </div>
                : indexInt == 2 ?
                  <div className={styles.style_box_m2}>    {/* 参与按钮 */}
                    <div className={styles.style_box_main}>
                      <div><strong className={styles.style_box_strong}>背景颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color1} colorName='color1' setMColor={setMcolor} /></span></div>
                      <div><strong className={styles.style_box_strong}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color2} colorName='color2' setMColor={setMcolor} /></span></div>
                    </div>
                    <div className={styles.style_box_btn}><Button type="primary" onClick={subInfo}>保存</Button></div>
                  </div>
                  : indexInt == 3 ?
                    <div className={styles.style_box_m2}>    {/* 周边操作 */}
                      <div className={styles.style_box_main}>
                        <div><strong className={styles.style_box_strong}>主题颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color3} colorName='color3' setMColor={setMcolor} /></span></div>
                      </div>
                      <div className={styles.style_box_btn}><Button type="primary" onClick={subInfo}>保存</Button></div>
                    </div>
                    : null}
            </div>
          </div>
        </div>
        <div className={styles.wrap_bom}>
          <Button onClick={setIsCancel}>返回列表</Button>
          <Button onClick={setStepBack.bind(this, 2)}>上一步</Button>
          <Button type="primary" onClick={setStepNext}>下一步</Button>
        </div>
      </div>

    </div>
  )
}
export default connect(({ visHome, loading, selectTheme }) => ({
  subimtData: visHome.subimtData,
  adverData: visHome.adverData,
  applyTheme: selectTheme.applyTheme
}))(activityPage);
