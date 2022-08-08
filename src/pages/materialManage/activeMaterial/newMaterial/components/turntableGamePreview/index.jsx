import React, { useEffect, useState } from 'react';
import { Form, Carousel, message } from 'antd';
import { connect, history } from 'umi';
import style from './style.less';
import {  LeftOutlined, EllipsisOutlined } from '@ant-design/icons';

const gamePageView = (props) => {
  let { dispatch,  onChangType,gameDataInit } = props;
  let [prizeList, setPrizeList] = useState([]) //奖品列表
  
  let reviewGamePage = ()=>{
      let items = gameDataInit;
      setImageUrl(items.turntableBackgroundImage);
      let drawPoints = items.drawPoints ? items.drawPoints : 0;
      setDrawPoints(drawPoints);
      let isInviteBuddy = items.isInviteBuddy == 1 ? true : false
      setIsShowShare(isInviteBuddy);
      let isSpecifyLink = items.isSpecifyLink == 1 ? true : false
      setIsShowAdver(isSpecifyLink);
      let inviteFriends = items.inviteFriends == 1 ? true : false
      setIsShowFirend(inviteFriends);
      setInviteMemeberBoostNum(items.inviteMemeberBoostNum);
      setInviteFriendsNum(items.inviteFriendsNum)
      setSpecifyLinkNum(items.specifyLinkNum);
      let togameColor = gameColor;
      togameColor.color1 = items.belowBackgroundColor || '#fff'
      togameColor.color2 = items.turntableLuckyDrawFontColor || '#666'
      togameColor.color3 = items.turntableAdTitleFontColor || '#666'
      togameColor.color4 = items.turntableLuckyDrawBackgroundColor || 'rgba(0,0,0,.3)';
      if (items.turntableLuckyDrawBackgroundColor) {
        setIsBackClore(true)
      } else {
        setIsBackClore(false)
      }
      setgameColor({ ...togameColor })
      let turntableInviteFriendsTitle = items.turntableInviteFriendsTitle ? items.turntableInviteFriendsTitle : "邀请好友注册助力";
      setShareTitle(turntableInviteFriendsTitle);
      let turntableInviteFriendsCopywriting = items.turntableInviteFriendsCopywriting ? items.turntableInviteFriendsCopywriting : "";
      setShareTitle2(turntableInviteFriendsCopywriting);
      let turntableInviteFriendsStyle = items.turntableInviteFriendsStyle ? items.turntableInviteFriendsStyle : 1;
      setShareType(turntableInviteFriendsStyle);
      let inviteFriendsTypeStyle = items.inviteFriendsTypeStyle ? items.inviteFriendsTypeStyle : 1;
      setFirendType(inviteFriendsTypeStyle);

      let inviteFriendsTitle = items.inviteFriendsTitle ? items.inviteFriendsTitle : "分享好友立即得抽奖机会";
      setShareFirend(inviteFriendsTitle);

      let turntableDiskStyle = items.turntableDiskStyle ? items.turntableDiskStyle : 1;
      setTunType(turntableDiskStyle);
      let turntablePointerStyle = items.turntablePointerStyle ? items.turntablePointerStyle : 1;
      setTunType2(turntablePointerStyle);
      changeAdverTitName(items.turntableAdTitleName);
      // adverForm.setFieldsValue({   //广告表单
      //   homeAdTitleName: items.turntableAdTitleName,
      //   isTaskShow: !items.isTaskShow ? 0 : 1,
      //   isShow: !items.tuentableGameIsShow ? 0 : 1,
      //   turntableAd: items.turntableAd,
      //   isTaskStyle: items.isTaskStyle ? items.isTaskStyle : 1
      // })
      changeAdverType(items.isTaskStyle ? items.isTaskStyle : 1);
      changeAdverIsNum(items.isTaskShow ? items.isTaskShow : 0);
      let toadverImg = [];
      if (items.turntableAd && items.turntableAd.length > 0) {
        items.turntableAd.map((n) => {
          toadverImg.push(n.adImg ? n.adImg : '');
        })
      }
      setAdverImg([...toadverImg]);
      changeAdverIsTit(items.tuentableGameIsShow);

  }
  useEffect(()=>{
    reviewGamePage()
  },[gameDataInit])

  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息

  let activityDetail = localStorage.getItem('activityDetail');   //是否详情禁用状态
  let activityDetails = activityDetail == '1' ? true : false;
  //对应编辑栏
  const [indexInt, setIndexInt] = useState(1);
  //首页切换工具栏
  let setTools = (i) => {
    setIndexInt(i)
  };
  //转盘样式
  let [tunType, setTunType] = useState(1);
  //指针样式
  let [tunType2, setTunType2] = useState(1);

  //背景
  let [imageUrl, setImageUrl] = useState("");  //背景图
  //颜色设置
  let [gameColor, setgameColor] = useState({}) //参与按钮及信息颜色配置
  useEffect(() => {
    let tempColor = {  //参与按钮及信息颜色配置
      color1: "#fff",   //背景色
      color2: "#666",
      color3: "#666",
      color4: "rgba(0,0,0,.3)",  //剩余次数背景色
    }
    setgameColor(tempColor);
  }, [])

  //邀请记录
  let [shareType, setShareType] = useState(1);

  let [shareTitle, setShareTitle] = useState("");  //标题名称
  

  //邀请记录-描述文案
  let [shareTitle2, setShareTitle2] = useState("");


  //分享活动
  let [shareFirend, setShareFirend] = useState("");  //标题名称

  let [firendType, setFirendType] = useState(1);

  //广告
  let [adverImg, setAdverImg] = useState([]);
 

  //广告标题
  let [adverIsTit, changeAdverIsTit] = useState(1);
  let [adverTitName, changeAdverTitName] = useState("");

  let [adverIsNum, changeAdverIsNum] = useState(1);
  let [isTaskStyle, changeAdverType] = useState(1);
 
  let [isShowFirend, setIsShowFirend] = useState(true);  //是否显示邀请好友块
  let [isShowShare, setIsShowShare] = useState(false);  //是否显示邀请分享块
  let [isShowAdver, setIsShowAdver] = useState(false);  //背景图
  let [drawPoints, setDrawPoints] = useState(0);  //抽奖次数
  let [inviteMemeberBoostNum, setInviteMemeberBoostNum] = useState(0);  //邀请上线
  let [specifyLinkNum, setSpecifyLinkNum] = useState(0);  //广告-指定上线
  let [inviteFriendsNum, setInviteFriendsNum] = useState(1);  //分享好友机会
  //是否需透明底
  let [isBackClore, setIsBackClore] = useState(false);
;

  return (
    <div>
      {/* 预览、编辑 */}
      <div className={`${style.by_main} ${activityDetails ? style.by_delmain : ''}`}>
        <div className={style.wrap_prby}>
          <div className={style.wrap_preview}>
            <div className={style.phone_wrap} style={{ 'height': isShowFirend && isShowShare && isShowAdver ? '1014px' : (isShowShare && isShowAdver) || (isShowFirend && isShowShare) ? '914px' : isShowShare || isShowAdver ? '777px' : '671px' }}>
              <div className={style.phone_img1}><img src={require('../../../../../../assets/activity/setpage_m1.png')}></img></div>
              <div className={style.phone_img2}><LeftOutlined className={style.phone_img2_1} /><span>{activityInfo.displayName}</span><EllipsisOutlined className={style.phone_img2_2} /></div>
              <div className={style.phone_img3}><img src={require('../../../../../../assets/activity/setpage_m2.png')}></img></div>
              {/* 活动页 */}
              <div className={style.index_wrap} style={{ "backgroundColor": gameColor.color1, 'height': isShowFirend && isShowShare && isShowAdver ? "907px" : (isShowShare && isShowAdver) || (isShowFirend && isShowShare) ? '807px' : isShowShare || isShowAdver ? '670px' : '566px' }}>
                <div className={`${style.phone_backgd} ${style.phone_hover}`} onClick={setTools.bind(this, 1)}><img src={imageUrl}></img></div>
                <div className={`${style.phone_tuns} ${style.phone_hover}`} onClick={setTools.bind(this, 2)}>
                  <div className={`${style.phone_tunbox} ${tunType == 1 || tunType == 5 ? style.phone_tunbox1 : tunType == 2 || tunType == 4 ? style.phone_tunbox2 : style.phone_tunbox3}`} style={prizeList.length <= 4 ? { "transform": 'rotate(' + ((((2 * Math.PI * 120) / (prizeList.length)) / 4) + 4) + 'deg)' } : { "transform": 'rotate(' + (((2 * Math.PI * 120) / (prizeList.length)) / 4) + 'deg)' }}>
                    {/* 转盘 */}
                    {
                      prizeList.map((item, key) => {
                        return <div key={key} className={style.turntable_detail_box} style={{ "width": (2 * Math.PI * 124) / (prizeList.length), 'margin-left': '-' + ((2 * Math.PI * 124) / (prizeList.length)) / 2 + 'px', 'transform': `rotate(${(360 / (prizeList.length)) * key}deg)` }}>
                          <span className={style.turntable_detail_trans}><i style={{ 'border-left': `${((2 * Math.PI * 124) / (prizeList.length)) / 2}px solid transparent`, 'border-right': `${((2 * Math.PI * 124) / (prizeList.length)) / 2}px solid transparent` }}></i></span>
                          <p>{item.prizeName}</p>
                          <img src={item.prizeImg}></img>
                        </div>
                      })
                    }
                  </div>
                  <div className={style.phone_tunbox_back}>
                    <span>
                      {
                        tunType == 1 ?
                          <img className={style.phone_tunbox_back_m1} src={require('../../../../../../assets/activity/setpage_m20.png')} />
                          : tunType == 2 ?
                            <img className={style.phone_tunbox_back_m1} src={require('../../../../../../assets/activity/setpage_m21.png')}></img>
                            : tunType == 3 ?
                              <img className={style.phone_tunbox_back_m1} src={require('../../../../../../assets/activity/setpage_m22.png')}></img>
                              : tunType == 4 ?
                                <img className={style.phone_tunbox_back_m1} src={require('../../../../../../assets/activity/setpage_m26.png')}></img>
                                : tunType == 5 ?
                                  <img className={style.phone_tunbox_back_m1} src={require('../../../../../../assets/activity/setpage_m27.png')}></img>
                                  : <img className={style.phone_tunbox_back_m1} src={tunType}></img>
                      }
                      {
                        tunType2 == 1 ?
                          <img className={style.phone_tunbox_back_m2} src={require('../../../../../../assets/activity/setpage_m28.png')} />
                          : tunType2 == 2 ?
                            <img className={style.phone_tunbox_back_m2} src={require('../../../../../../assets/activity/setpage_m29.png')} />
                            : tunType2 == 3 ?
                              <img className={style.phone_tunbox_back_m2} src={require('../../../../../../assets/activity/setpage_m30.png')} />
                              : <img className={style.phone_tunbox_back_m2} src={tunType2} />
                      }
                    </span>
                  </div>
                </div>
                <div className={`${style.phone_count} ${style.phone_hover}`} style={{ "color": gameColor.color2 }} onClick={setTools.bind(this, 3)}>
                  {isBackClore ? <span style={{ "background": gameColor.color4 }}></span> : null}
                  <i>您还有{drawPoints}次机会</i></div>
                <div className={style.phone_bombox} style={{overflow:'hidden'}}>
                  {isShowFirend ? <div className={`${style.phone_share} ${style.phone_hover} ${style.phone_share_firend}`} onClick={setTools.bind(this, 6)}>
                    {
                      firendType == 1 ? <img src={require('../../../../../../assets/activity/pirend_m1.png')} />
                        : firendType == 2 ? <img src={require('../../../../../../assets/activity/pirend_m2.png')} />
                          : firendType == 3 ? <img src={require('../../../../../../assets/activity/pirend_m3.png')} />
                            : firendType == 4 ? <img src={require('../../../../../../assets/activity/pirend_m4.png')} />
                              : <img src={firendType} />
                    }
                    <div className={style.phone_share_top}>{shareFirend ? shareFirend : '分享好友立即得抽奖机会'} 0/{inviteFriendsNum}</div>
                  </div> : null}
                  {isShowShare ? <div className={`${style.phone_share} ${style.phone_hover}  ${style.phone_share_bg} `} style={{background:shareType == 1?'rgba(0,0,0,0.37)': shareType == 2?'#0023EE': shareType == 3?'#E53423':shareType == 4?'#790000':'url('+shareType+') no-repeat' }}  onClick={setTools.bind(this, 4)}>
                    <div className={style.phone_share2_top}>{shareTitle ? shareTitle : '邀请好友注册助力'} 0/{inviteMemeberBoostNum}</div>
                    <div className={style.phone_share_btn}>立即邀请</div>
                    <div className={style.phone_share_Copywriting}>{shareTitle2 ? shareTitle2 : '#文案描述#'}</div>
                    <div className={style.phone_share_list}>
                      <span><i></i><em>用户名</em></span><span><i></i><em>用户名</em></span>
                    </div>
                  </div>
                    : null}
                  {
                    isShowAdver ? <div className={`${style.phone_adver} ${style.phone_hover}`} style={{ background: isTaskStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : isTaskStyle == 2 ? '#0023EE' : isTaskStyle == 3 ? '#E53423' : isTaskStyle == 4 ? '#790000' : 'url('+isTaskStyle+') no-repeat' }} onClick={setTools.bind(this, 5)}>
                      {adverIsTit == 1 ?
                        <h4><span>{adverTitName ? adverTitName : '广告标题'}</span>{adverIsNum == 1 ? <i>0/{specifyLinkNum}</i> : null}</h4>
                        : null}
                      <Carousel>
                        {adverImg.length > 0 ?
                          adverImg.map((item, key) => {
                            return <div className={style.phone_count_banner} key={key}><img src={item} /></div>
                          })
                          : <div className={style.phone_count_banner}><h3>广告</h3></div>
                        }
                      </Carousel>
                    </div>
                      : null}

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
export default connect(({ visGame, loading }) => ({
  subimtData: visGame.subimtData,

}))(gamePageView);
