import React, { useEffect, useState } from 'react';
import { Button, message, Modal } from 'antd';
import { connect, history } from 'umi';
import TurntablePage from '../setUi/turntablePage';   //转盘
import SeckilPage from '../setUi/seckilPage';   //秒杀
import DirectPumpingPage from '../setUi/directPumpingPage';   //直抽
import DiscountShoppingPage from '../setUi/discountShoppingPage';   //优惠购
import DollMachinePage from '../setUi/dollMachinePage';   //娃娃机
import GoldenEggsPage from '../setUi/goldenEggsPage';   //砸金蛋
import StrikeActivityPage from '../setUi/strikeActivityPage';   //点点乐
import AnswerPage from '../setUi/answerPage'//答题有奖
import CollectWordPage from '../setUi/collectWordPage'//集字
import PosterDirectPage from '../setUi/posterDirectPage'//海报
import QuestionnairePage from '../setUi/questionnairePage'//问卷调查
import SignInPage from '../setUi/signInPage'//日日签
import FlipCardPage from '../setUi/flipCardPage'//翻牌
import styles from './style.less';
const activityPage = (props) => {
  let { dispatch } = props;
  let [activityData, setActivityData] = useState(JSON.parse(localStorage.getItem('activityInfo')))  //活动信息
  useEffect(() => {
    dispatch({
      type: 'selectTheme/onSetTheme',
      payload: null
    })
    window.activityData_materialApply = null;
  }, []);

  return (
      <div>
        {
          activityData.marketActivityType ==2 ? 
         <SeckilPage/> : 
         activityData.marketActivityType ==3 ?
         <DirectPumpingPage/>: 
         activityData.marketActivityType ==4 ? 
         <DiscountShoppingPage/>:
         activityData.marketActivityType == 5 ?
         <DollMachinePage />:
         activityData.marketActivityType == 6 ?
         <GoldenEggsPage />:
         activityData.marketActivityType == 7 ?
         <StrikeActivityPage />:
         activityData.marketActivityType == 8 ?
         <AnswerPage/>:
         activityData.marketActivityType == 9 ?
         <CollectWordPage/>:
         activityData.marketActivityType == 10 ?
         <PosterDirectPage/>:
         activityData.marketActivityType == 11 ?
         <QuestionnairePage/>:
         activityData.marketActivityType == 12 ?
         <SignInPage/>:
         activityData.marketActivityType == 13 ?
         <FlipCardPage/>:
         <TurntablePage />
        }
      </div>
  )
}
export default connect(({ activityThree, loading,selectTheme }) => ({

}))(activityPage);
