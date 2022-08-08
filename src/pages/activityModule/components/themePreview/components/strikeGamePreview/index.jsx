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
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#fff",   //背景图下方底色
    color2: '#fff',  //倒计时字体颜色
    color3: 'rgba(0,0,0,.3)',  //倒计时背景颜色
    color4: '#fff',  //目标分数字体颜色
    color5: 'rgba(0,0,0,.3)',  //目标分数背景颜色
    color6: 'rgba(0,0,0,.3)',  //得分背景颜色
    color7: '#fff',  //得分字体颜色
  });
  let [dropGoodsList,setDropGoodsList] = useState([]);//掉落物品合集
  //是否需透明底
  let [isBackClore, setIsBackClore] = useState(false);//目标分数
  let previewGamePage = ()=>{
    let items = gameDataInit;
    setImageUrl(items.gameBackgroundImage ? items.gameBackgroundImage : '');
    setIsBackClore(items.isBackCloreGame);
    let toIndexColor = indexColor;
    toIndexColor.color1 = items.gameBackgroundColor ? items.gameBackgroundColor : '#fff';
    toIndexColor.color2 = items.countDownFontColor ? items.countDownFontColor : '#fff';
    toIndexColor.color3 = items.countDownBackgroundColor ? items.countDownBackgroundColor : 'rgba(0,0,0,.3)';
    toIndexColor.color4 = items.goalScoreFontColor ? items.goalScoreFontColor : '#fff';
    toIndexColor.color5 = items.goalScoreBackgroundColor ? items.goalScoreBackgroundColor : 'rgba(0,0,0,.3)';
    toIndexColor.color6 = items.scoreBackgroundColor ? items.scoreBackgroundColor : 'rgba(0,0,0,.3)';
    toIndexColor.color7 = items.scoreFontColor ? items.scoreFontColor : '#fff';
    setindexColor({ ...toIndexColor });
    let toDropGoodsList = JSON.parse(JSON.stringify(dropGoodsList));
    toDropGoodsList = items.dropGoodsList;
    setDropGoodsList(toDropGoodsList);
  }
  useEffect(()=>{
    previewGamePage()
  },[gameDataInit])

  return (
      <div className={style.wrap_prby}>
        <div className={style.wrap_preview}>
          <div className={style.phone_wrap}>
            <div className={style.phone_img1}><img src={require('../../../../../../assets/activity/setpage_m1.png')}></img></div>
            <div className={style.phone_img2}><LeftOutlined className={style.phone_img2_1} /><EllipsisOutlined className={style.phone_img2_2} /></div>
            {/* 活动首页 */}
            <div className={style.index_wrap} style={{ backgroundColor: `${indexColor.color1}`, backgroundImage: `url(${imageUrl})` }}>
              <div className={style.index_backgd}></div>
              <div className={style.index_goalScore} style={{ color: `${indexColor.color4}` }} >
                <i>目标分：200</i>
                {isBackClore ? <span className={style.goalBg} style={{ 'background': indexColor.color5 }}></span> : null}
              </div>
              <div className={style.index_time} style={{ color: `${indexColor.color2}`,background:`${indexColor.color3}` }}>20S</div>
              <div className={style.index_score} style={{ color: `${indexColor.color7}`,background:`${indexColor.color6}` }}>得分：0</div>
              {/* 掉落物品图片占位 */}
              <div className={`${style.index_drop} ${style.index_drop1}`}>
                {dropGoodsList && dropGoodsList[0] && dropGoodsList[0].imgUrl ?
                  <img src={dropGoodsList[0].imgUrl} alt="" /> 
                  :<img src={require('../../../../../../assets/dropGood.png')} alt="" />
                }
              </div>
              <div className={`${style.index_drop} ${style.index_drop2}`}>
                {dropGoodsList && dropGoodsList[1] && dropGoodsList[1].imgUrl ?
                  <img src={dropGoodsList[1].imgUrl} alt="" /> 
                  :<img src={require('../../../../../../assets/dropGood.png')} alt="" />
                }
              </div>
              <div className={`${style.index_drop} ${style.index_drop3}`}>
                {dropGoodsList && dropGoodsList[2] && dropGoodsList[2].imgUrl ?
                  <img src={dropGoodsList[2].imgUrl} alt="" /> 
                  :<img src={require('../../../../../../assets/dropGood.png')} alt="" />
                }
              </div>
              <div className={`${style.index_drop} ${style.index_drop4}`}>
                {dropGoodsList && dropGoodsList[3] && dropGoodsList[3].imgUrl ?
                  <img src={dropGoodsList[3].imgUrl} alt="" /> 
                  :<img src={require('../../../../../../assets/dropGood.png')} alt="" />
                }
              </div>
              <div className={`${style.index_drop} ${style.index_drop5}`}>
                {dropGoodsList && dropGoodsList[4] && dropGoodsList[4].imgUrl ?
                  <img src={dropGoodsList[4].imgUrl} alt="" /> 
                  :<img src={require('../../../../../../assets/dropGood.png')} alt="" />
                }
              </div>
            </div>
            <div className={style.phone_img3}><img src={require('../../../../../../assets/activity/setpage_m2.png')}></img></div>
          </div>
        </div>
      </div>
  )
}
export default connect(({ visGame, loading }) => ({

}))(gamePagePreview);
