import React, { useEffect, useState } from 'react';
import {  Carousel } from 'antd';
import { connect, history } from 'umi';
import styles from './style.less';
import { LeftOutlined, EllipsisOutlined } from '@ant-design/icons';
// import LayerModal from '../layerModal';   //取消、上一步弹窗

const  goldenEggsGamePreview = (props) => {
  let { dispatch, onChangType,gameDataInit } = props;
  let [formData, setFormData] = useState({});

  useEffect(()=>{
    previewGamePage()
  },[gameDataInit]) 

  let previewGamePage = ()=>{
    let items = gameDataInit
    setFormData({ ...items });
    setImageUrl(items.gameBackgroundImage);
    setHammerUrl(items.gameHammerImage);
    setSmashedUrl(items.gameSmashedImage);
    setSplitUrl(items.gameSplitImage);
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
    toSColor.color5 = items.gameBelowBackgroundColor || '#ffffff';
    toSColor.color2 = items.gameParticipateButtonFontColor || '#fff';
    toSColor.color1 = items.gameParticipateButtonBackgroundColor || '#F5A623';
    toSColor.color7 = items.turntableLuckyDrawFontColor || '#fff'
    toSColor.color8 = items.turntableLuckyDrawBackgroundColor || 'rgba(0,0,0,.3)';
    if (items.turntableLuckyDrawBackgroundColor) {
      setIsBackClore1(true)
    } else {
      setIsBackClore1(false)
    }
    setindexColor({ ...toSColor });
    setBtnTxt(items.gameParticipateButtonTxt);


    let isShare = items.isShare == 1 ? '1' : '';
    setIsIcoShare(isShare);
    let drawPoints = items.drawPoints ? items.drawPoints : 0;
    setDrawPoints(drawPoints);
    // let inviteFriends = items.inviteFriends == 1 ? true : false;
    setIsShowFirend(true);
    //邀请好友显示
    // let isInviteBuddy = items.isInviteBuddy == 1 ? true : false;
    setIsShowShare(true);
    // let isSpecifyLink = items.isSpecifyLink == 1 ? true : false;
    setIsShowAdver(true);
    setInviteFriendsNum(items.inviteFriendsNum?items.inviteFriendsNum:0);
    setInviteMemeberBoostNum(items.inviteMemeberBoostNum?items.inviteMemeberBoostNum:0);
    setSpecifyLinkNum(items.specifyLinkNum);
    //可加次数广告
    changeAdverTitName(items.turntableAdTitleName);
    changeAdverType(items.isTaskStyle ? items.isTaskStyle : 1);
    let toadverImg = [];
    if (items.turntableAd && items.turntableAd.length > 0) {
      items.turntableAd.map((n) => {
        toadverImg.push(n.adImg ? n.adImg : '');
      })
    }
    setAdverImg([...toadverImg]);
    changeAdverIsTit(items.tuentableGameIsShow);
    changeAdverIsNum1(items.isTaskShow ? items.isTaskShow : 0);
  }

  const [indexInt, setIndexInt] = useState(1); //活动首页对应状态 1：背景图 2参与按钮 3信息
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#F5A623",   //按钮背景色
    color2: "#fff",  //按钮字体颜色
    color5: "#ffffff",  //页面背景色
    color7: "#fff",  //剩余次数字体颜色
    color8: "rgba(0,0,0,.3)",  //剩余次数背景色
  });
  let [isIcoShare, setIsIcoShare] = useState('');  //分享图标
  //首页切换工具栏
  let setTools = (i) => {
    setIndexInt(i)
  };
  let [imageUrl, setImageUrl] = useState("");  //首页背景
  let [hammerUrl, setHammerUrl] = useState("");  //锤子图片
  let [smashedUrl, setSmashedUrl] = useState("");  //被砸图片
  let [splitUrl, setSplitUrl] = useState("");  //砸开图片
 
  //是否需透明底
  let [isBackClore1, setIsBackClore1] = useState(true);//剩余次数

  //广告
  let [adverImg, setAdverImg] = useState([]);
 
  //广告标题
  let [adverIsTit, changeAdverIsTit] = useState(1);
  let [adverTitName, changeAdverTitName] = useState("");
  let [adverIsNum1, changeAdverIsNum1] = useState(1);
  let [isTaskStyle, changeAdverType] = useState(1);

  //参与按钮
  let [btnTxt, setBtnTxt] = useState("砸");  //按钮名称
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

  return (
    <div className={styles.wrap_prby}>
    <div className={styles.wrap_preview}>
      <div className={styles.phone_wrap}>
        <div className={styles.phone_img1}>
          <img src={require('../../../../../../assets/activity/setpage_m1.png')}></img>
        </div>
        <div className={styles.phone_img2}>
          <LeftOutlined className={styles.phone_img2_1} />
          <EllipsisOutlined className={styles.phone_img2_2} />
        </div>
        {/* 活动首页 */}
        <div className={styles.index_wrap} style={{ backgroundColor: `${indexColor.color5}`, backgroundImage: `url(${imageUrl})` }}>
          <div className={styles.index_backgd} onClick={setTools.bind(this, 1)}></div>
          {isIcoShare ? <div className={styles.index_share}><img src={require('../../../../../../assets/activity/setpage_m18.png')}></img></div> : null}
          <div className={styles.index_pos_bom}>
            <div className={styles.index_hammer} onClick={setTools.bind(this, 4)}>
              <img src={hammerUrl ? hammerUrl : require('../../../../../../assets/activity/hammer.png')}></img>
            </div>
            <div className={styles.index_smashed} onClick={setTools.bind(this, 9)}>
              <div><img src={smashedUrl ? smashedUrl : require('../../../../../../assets/activity/goldenEgg.png')}></img></div>
              <div><img src={smashedUrl ? smashedUrl : require('../../../../../../assets/activity/goldenEgg.png')}></img></div>
              <div><img src={smashedUrl ? smashedUrl : require('../../../../../../assets/activity/goldenEgg.png')}></img></div>
            </div>
            <div className={styles.index_button} onClick={setTools.bind(this, 2)}>
              <span style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>{btnTxt ? btnTxt : '砸'}</span>
            </div>
            <div className={styles.index_count} style={{ "color": indexColor.color7 }} onClick={setTools.bind(this, 8)}>
              {isBackClore1 ? <span style={{ "background": indexColor.color8 }}></span> : null}
              <i>剩余次数：{drawPoints}</i>
            </div>
            {/* 分享 */}
            {isShowFirend ? <div className={styles.box_wrapper} >
              <div className={`${styles.phone_share} ${styles.phone_share_friend} ${styles.phone_hover}`} style={{overflow:'hidden'}} onClick={setTools.bind(this, 6)}>
                {
                  firendType == 1 ? <img src={require('../../../../../../assets/activity/pirend_m1.png')} />
                    : firendType == 2 ? <img src={require('../../../../../../assets/activity/pirend_m2.png')} />
                      : firendType == 3 ? <img src={require('../../../../../../assets/activity/pirend_m3.png')} />
                        : firendType == 4 ? <img src={require('../../../../../../assets/activity/pirend_m4.png')} />
                          :<img src={firendType} />
                }
                <div className={styles.phone_share_top}>{shareFirend ? shareFirend : '分享好友立即得抽奖机会'} 0/{inviteFriendsNum}</div>
              </div>
            </div> : null}
            {isShowShare ? <div className={styles.box_wrapper}>
              <div className={`${styles.phone_share} ${styles.phone_hover}  ${styles.phone_share_bg}`} style={{background:shareType == 1?'rgba(0,0,0,0.37)': shareType == 2?'#0023EE': shareType == 3?'#E53423':shareType == 4?'#790000':'url('+shareType+') no-repeat 0 0 /100% auto' }} onClick={setTools.bind(this, 7)}>
                <div className={styles.phone_share2_top}>{shareTitle ? shareTitle : '邀请好友注册助力'} 0/{inviteMemeberBoostNum}</div>
                <div className={styles.phone_share_btn}>立即邀请</div>
                <div className={styles.phone_share_Copywriting}>{shareTitle2 ? shareTitle2 : '#文案描述#'}</div>
                <div className={styles.phone_share_list}>
                  <span><i></i><em>用户名</em></span><span><i></i><em>用户名</em></span>
                </div>
              </div>
            </div> : null}
            {isShowAdver ? <div className={styles.box_wrapper}>
              <div className={`${styles.index_poster} ${styles.phone_hover}`} style={{ background: isTaskStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : isTaskStyle == 2 ? '#0023EE' : isTaskStyle == 3 ? '#E53423' : isTaskStyle == 4 ? '#790000' : 'url('+isTaskStyle+') no-repeat 0 0 /100% auto' }} onClick={setTools.bind(this, 5)}>
                {adverIsTit == 1 ?
                  <h4 style={{ 'color': "#fff" }}><span>{adverTitName ? adverTitName : '广告标题'}</span>   {adverIsNum1 == 1 ? <span>  0/{specifyLinkNum}</span> : null}</h4>
                  : null}
                <Carousel>
                  {adverImg.length > 0 ?
                    adverImg.map((item, key) => {
                      return <div className={styles.indec_poster_banner} key={key}><img src={item} /></div>
                    })
                    : <div className={styles.indec_poster_banner}><h3>广告</h3></div>
                  }
                </Carousel>
              </div>
            </div> : null}
          </div>
        </div>
        <div className={styles.phone_img3}>
          <img src={require('../../../../../../assets/activity/setpage_m2.png')}></img>
        </div>
      </div>
    </div>
  </div>
  )
}
export default connect(({ }) => ({
}))(goldenEggsGamePreview);
