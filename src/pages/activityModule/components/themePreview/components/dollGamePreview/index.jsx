import React, { useEffect, useState } from 'react';
import { Form, Carousel, message } from 'antd';
import { connect, history } from 'umi';
import style from './style.less';
import {  LeftOutlined, EllipsisOutlined } from '@ant-design/icons';

const gamePagePreview = (props) => {
  let { dispatch,  onChangType,gameDataInit } = props;
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  let activityDetail = localStorage.getItem('activityDetail');   //是否详情禁用状态
  let activityDetails = activityDetail == '1' ? true : false;

  //背景
  let [imageUrl, setImageUrl] = useState("");  //背景图
  let [rockerUrl, setRockerUrl] = useState("");  //摇杆
  let [clipUrl, setClipUrl] = useState("");  //夹-按钮
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#fff",   //页面背景色
    color2: '#fff',  //倒计时字体颜色
  });
  let [countDown, setCountDown] = useState(20);//倒计时
  let [showCaseArr, setShowCaseArr] = useState([]);//橱窗图片合集
  let previewGamePage = ()=>{
    let items = gameDataInit;
    setImageUrl(items.gameBackgroundImage ? items.gameBackgroundImage : '');
    setRockerUrl(items.rockerUrl ? items.rockerUrl : '');
    setClipUrl(items.clipUrl ? items.clipUrl : '');
    let toIndexColor = indexColor;
    toIndexColor.color1 = items.gameBackgroundColor ? items.gameBackgroundColor : '#fff';
    toIndexColor.color2 = items.countDownColor ? items.countDownColor : '#fff';
    setindexColor({ ...toIndexColor });
    setCountDown(items.countDown ? items.countDown : 20);
    if (items.showCaseArr) {
      setShowCaseArr([...items.showCaseArr]);
    }
  }
  useEffect(()=>{
    previewGamePage()
  },[gameDataInit])

  return (
    <div>
      {/* 预览、编辑 */}
        <div className={style.wrap_prby}>
          <div className={style.wrap_preview}>
            <div className={style.phone_wrap}>
              <div className={style.phone_img1}><img src={require('../../../../../../assets/activity/setpage_m1.png')}></img></div>
              <div className={style.phone_img2}><LeftOutlined className={style.phone_img2_1} /><EllipsisOutlined className={style.phone_img2_2} /></div>
              {/* 活动首页 */}
              <div className={style.index_wrap} style={{ backgroundColor: `${indexColor.color1}`, backgroundImage: `url(${imageUrl})` }}>
                <div className={style.index_backgd}></div>
                <div className={style.index_info} style={{ backgroundImage: `url(${showCaseArr[0] && showCaseArr[0].img ? showCaseArr[0].img : ''})` }}>
                  <span className={style.index_info_user}>头像</span>
                  <span className={style.index_info_box1}><img src={showCaseArr[6] && showCaseArr[6].img ? showCaseArr[6].img : require('../../../../../../assets/activity/dollMachine_m3.png')}></img></span>
                  <span className={style.index_info_box2}>
                    {
                      showCaseArr[2] && showCaseArr[2].img ? <img src={showCaseArr[2].img}></img> : showCaseArr[3] && showCaseArr[3].img ? <img src={showCaseArr[3].img}></img> : showCaseArr[4] && showCaseArr[4].img ? <img src={showCaseArr[4].img}></img> : <em>礼物图</em>
                    }
                  </span>
                  <div className={style.index_info_box3}>
                    {
                      showCaseArr[1] && showCaseArr[1].img ? <img className={style.index_info_box3_m} src={showCaseArr[1].img}></img> : <div className={style.index_info_box3_by}>
                        <img src={require('../../../../../../assets/activity/dollMachine_m4.png')}></img>
                        <p>礼物推叠图</p>
                      </div>
                    }
                  </div>
                </div>
                <div className={style.index_time} style={{ color: `${indexColor.color2}` }}>{countDown}S</div>
                <div className={style.index_info2}>
                  <span><img src={rockerUrl ? rockerUrl : require('../../../../../../assets/activity/dollMachine_m2.png')}></img></span>
                  <span><img src={clipUrl ? clipUrl : require('../../../../../../assets/activity/dollMachine_m1.png')}></img></span>
                </div>
              </div>
              <div className={style.phone_img3}><img src={require('../../../../../../assets/activity/setpage_m2.png')}></img></div>
            </div>
          </div>
        </div>
      </div>
  )
}
export default connect(({ visGame, loading }) => ({

}))(gamePagePreview);
