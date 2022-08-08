import React, { useEffect, useState } from "react";
import { connect, history } from 'umi';
import { message,Form, Carousel  } from "antd"
import style from "./style.less";
import locale from 'antd/lib/date-picker/locale/zh_CN';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { CloseCircleOutlined, LeftOutlined, EllipsisOutlined, NotificationOutlined } from '@ant-design/icons';
const homePagePreview = (props) => {
  let { dispatch,homeDataInit,popTypes } = props;

  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#F5A623",   //按钮背景色
    color2: "#fff",  //按钮字体颜色
    color3: "#fff",  //周边字体颜色
    color5: "#ffffff",  //页面背景色
    color6: "rgba(0, 0, 0, 0.3)",  //周边背景色
    color7: "#fff",  //剩余次数颜色
    color8: "rgba(0,0,0,.3)",  //剩余次数背景色
    color9: "#fff",  //活动时间颜色
    color10: "rgba(0,0,0,.3)",  //活动时间背景色
  });
  let [imageUrl, setImageUrl] = useState("");  //首页背景
  let [activityTypes,setActivityTypes] =  useState('')
  //首页广告图片上传
  let [adverImg, setAdverImg] = useState([]);

  //参与按钮
  let [btnTxt, setBtnTxt] = useState("立即开始");  //按钮名称
  //广告标题
  let [adverIsTit, changeAdverIsTit] = useState(1);
  let [adverTitName, changeAdverTitName] = useState("");
  //任务广告
  let [adverImg1, setAdverImg1] = useState([]);
  let [adverIsTit1, changeAdverIsTit1] = useState(1);
  let [adverTitName1, changeAdverTitName1] = useState("");
  let [adverIsNum1, changeAdverIsNum1] = useState(1);
  let [isTaskStyle, changeAdverType1] = useState(1);
  //分享相关
  let [firendType, setFirendType] = useState(1);
  let [shareFirend, setShareFirend] = useState("分享好友立即得抽奖机会");  //标题名称
  let [shareTitle, setShareTitle] = useState("邀请好友注册助力");  //标题名称
  let [shareType, setShareType] = useState(1);
  let [shareTitle2, setShareTitle2] = useState("");//邀请记录-描述文案
  let [inviteFriendsNum, setInviteFriendsNum] = useState(1);  //分享好友机会次数要求
  let [specifyLinkNum, setSpecifyLinkNum] = useState(0);  //广告-指定上线
  let [inviteMemeberBoostNum, setInviteMemeberBoostNum] = useState(0);  //邀请好友注册助力人数要求
  let [isBackClore, setIsBackClore] = useState(true);//剩余次数是否需透明底
  let [isBackClore2, setIsBackClore2] = useState(true);//剩余次数是否需透明底
  let [homeAdStyle, changeAdverType] = useState(1);
  let [styleType, setStyleType] = useState(1); //样式单选
  let [tabType, setTabType] = useState('1');
  useEffect(()=>{
    preViewHomePage()
  },[homeDataInit,popTypes])

  let preViewHomePage = () =>{
    let items = homeDataInit;
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
    setShareTitle2(turntableInviteFriendsCopywriting);
    let toSColor = indexColor;
    toSColor.color5 = items.homeBelowBackgroundColor || '#ffffff';
    toSColor.color3 = items.homePeripheralOperationColor || '#fff';
    toSColor.color2 = items.homeParticipateButtonFontColor || '#fff';
    toSColor.color1 = items.homeParticipateButtonBackgroundColor || '#F5A623';
    toSColor.color6 = items.homePeripheralOperationBackgroundColor || 'rgba(0,0,0,.3)';
    toSColor.color7 = items.turntableLuckyDrawFontColor || '#fff'
    toSColor.color8 = items.turntableLuckyDrawBackgroundColor || 'rgba(0,0,0,.3)';
    toSColor.color9 = items.activityTimeFontColor || '#fff'
    toSColor.color10 = items.activityTimeBackgroundColor || 'rgba(0,0,0,.3)';
    setindexColor({ ...toSColor });
    setIsBackClore(items.isBackCloreGame)
    setIsBackClore2(items.isBackCloreTime)
    setBtnTxt(items.homeParticipateButtonTxt ? items.homeParticipateButtonTxt : '');
    setInviteFriendsNum(items.inviteFriendsNum ? items.inviteFriendsNum  : 1);
    setInviteMemeberBoostNum(items.inviteMemeberBoostNum ? items.inviteMemeberBoostNum  : 1);
    setSpecifyLinkNum(items.specifyLinkNum ? items.specifyLinkNum : 1);
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
    changeAdverIsNum1(items.isTaskShow ? items.isTaskShow : 0);
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
  

  return <>
    <div className={style.wrap_prby}>
      <div className={style.wrap_preview}>
        <div className={style.phone_wrap}>
          <div className={style.phone_img1}><img src={require('../../../../../../assets/activity/setpage_m1.png')}></img></div>
          <div className={style.phone_img2}><LeftOutlined className={style.phone_img2_1} /><EllipsisOutlined className={style.phone_img2_2} /></div>
          {/* 活动首页 */}
          <div className={style.index_wrap} style={{ backgroundColor: `${indexColor.color5}`, backgroundImage: `url(${imageUrl})` }}>
            <div className={style.index_pos_bom}>
              <div className={style.index_info} style={{ top: '15px' }}>
                <span className={`${style.index_wrap_top_n1}`} style={{ 'color': indexColor.color3, 'background': indexColor.color6 }}>活动规则</span>
                <span className={`${style.index_wrap_top_n2}`} style={{ 'color': indexColor.color3, 'background': indexColor.color6 }}>中奖记录</span>
              </div>
              <div className={style.index_time} style={{ "color": indexColor.color9 }}>
                {isBackClore2 ? <span style={{ "background": indexColor.color10 }}></span> : null}
                <i>活动开始时间-活动结束时间</i></div>
              <div className={style.index_button}><span style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>{btnTxt ? btnTxt : '立即开始'}</span></div>
              <div className={style.index_count} style={{ "color": indexColor.color7 }}>
                {isBackClore ? <span style={{ "background": indexColor.color8 }}></span> : null}
                <i>剩余0次机会</i></div>
              {/* 分享 */}
              <div className={style.box_wrapper}>
                <div className={style.phone_share}>
                  {typeof firendType == 'number' ?
                    <div className={style.image_wrap}>{
                      firendType == 1 ? <img src={require('../../../../../../assets/activity/pirend_m1.png')} />
                        : firendType == 2 ? <img src={require('../../../../../../assets/activity/pirend_m2.png')} />
                          : firendType == 3 ? <img src={require('../../../../../../assets/activity/pirend_m3.png')} />
                            : firendType == 4 ? <img src={require('../../../../../../assets/activity/pirend_m4.png')} />
                              : null
                            }
                    </div>
                  : <div className={style.image_wrap}><img src={firendType} /></div>}
                  <div className={style.phone_share_top}>{shareFirend ? shareFirend : '分享好友立即得抽奖机会'} 0/{inviteFriendsNum}</div>
                </div>
              </div>
              <div className={style.box_wrapper}>
                <div className={`${style.phone_share} ${style.phone_share_bg} ${shareType == 1 ? style.phone_share_bg1 : shareType == 2 ? style.phone_share_bg2 : shareType == 3 ? style.phone_share_bg3 : shareType == 4 ? style.phone_share_bg4 : null}`}
                  style={typeof shareType != 'number' ? {backgroundImage: `url(${shareType})` } : null}>
                  <div className={style.paddingSize}>
                    <div className={style.phone_share2_top}>{shareTitle ? shareTitle : '邀请好友注册助力'} 0/{inviteMemeberBoostNum}</div>
                    <div className={style.phone_share_btn}>立即邀请</div>
                    <div className={style.phone_share_Copywriting}>{shareTitle2 ? shareTitle2 : '#文案描述#'}</div>
                    <div className={style.phone_share_list}>
                      <span><i></i><em>用户名</em></span><span><i></i><em>用户名</em></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.box_wrapper}>
                <div className={style.index_poster} style={ typeof isTaskStyle == 'number' ? { backgroundColor: isTaskStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : isTaskStyle == 2 ? '#0023EE' : isTaskStyle == 3 ? '#E53423' : isTaskStyle == 4 ? '#790000' : 'none' } : {backgroundImage: `url(${isTaskStyle})`}}>
                  {adverIsTit1 == 1 ?
                    <h4 style={{ 'color': "#fff" }}><span>{adverTitName1 ? adverTitName1 : '广告标题'}</span>   {adverIsNum1 == 1 ? <span>  0/{specifyLinkNum}</span> : null}</h4>
                    : null}
                  <Carousel>
                    {adverImg1.length > 0 ?
                      adverImg1.map((item, key) => {
                        return <div className={style.indec_poster_banner} key={key}><img src={item} /></div>
                      })
                      : <div className={style.indec_poster_banner}><h3>广告</h3></div>
                    }
                  </Carousel>
                </div>
              </div>
              <div className={style.box_wrapper}>
                <div className={style.index_poster} style={ typeof homeAdStyle == 'number' ? { backgroundColor: homeAdStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : homeAdStyle == 2 ? '#0023EE' : homeAdStyle == 3 ? '#E53423' : homeAdStyle == 4 ? '#790000' : 'none' } : {backgroundImage: `url(${homeAdStyle})`}}>
                  {adverIsTit == 1 ?
                    <h4 style={{ 'color': "#fff" }}>{adverTitName ? adverTitName : '广告标题'}</h4>
                    : null}
                  <Carousel>
                    {adverImg.length > 0 ?
                      adverImg.map((item, key) => {
                        return <div className={style.indec_poster_banner} key={key}><img src={item}></img></div>
                      })
                      : <div className={style.indec_poster_banner}><h3>广告</h3></div>
                    }
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
          <div className={style.phone_img3}><img src={require('../../../../../../assets/activity/setpage_m2.png')}></img></div>
        </div>
        {
          popTypes == 1 || popTypes == 2 ?  //活动规则 and 中奖记录
            <div className={style.index_rule}>
              <div className={style.index_rule_by}>
                <div className={style.index_rule_img}>
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
              <CloseCircleOutlined className={style.index_rule_close} />
            </div>
            : popTypes == 3 ?    //抽奖结果
              <div className={style.index_rule}>
                {/* 卡券 */}
                {tabType == '1' ?
                  <div className={`${style.index_rule_bys} ${style.index_rule_by1}`}>
                    <div className={style.index_rule_img}>
                      {
                        styleType == 1 ? <img src={require('../../../../../../assets/activity/setpage_m15.png')}></img>
                          : styleType == 2 ? <img src={require('../../../../../../assets/activity/setpage_m17.png')}></img>
                            : styleType == 3 ? <img src={require('../../../../../../assets/activity/m_style_3_1.png')}></img>
                              : styleType == 4 ? <img src={require('../../../../../../assets/activity/m_style_4_1.png')}></img>
                                : styleType == 5 ? <img src={require('../../../../../../assets/activity/m_style_5_1.png')}></img>
                                  : <img src={styleType}></img>}
                    </div>
                    <div className={style.index_by_mian}>
                      <h6 style={{ "color": styleType == 1 ? '#1888FF' : styleType == 5 ? '#FF0500' : '#fff' }}>恭喜你获得</h6>
                    </div>
                  </div>: null}
                <CloseCircleOutlined className={style.index_rule_close} />
              </div>
              : null
          }
      </div>
    </div>
  </>
}
export default connect(({  }) => ({
}))(homePagePreview)