import React, { useEffect, useState } from 'react'
import { connect, history } from 'umi'
import styles from './style.less'
import { InfoCircleOutlined } from '@ant-design/icons'
import ConfigActivityRules from '../setConfigure/configActivityRules'   //大转盘
import SeckilActivityRules from '../setConfigure/seckilActivityRules'   //秒杀
import DirectPumping from '../setConfigure/directPumping'   //直抽
import DiscountShoppingRules from '../setConfigure/discountShoppingRules'   //优惠购
import DollMachineRules from '../setConfigure/dollMachineRules'   //娃娃机
import GoldenEggsRules from '../setConfigure/goldenEggsRules'   //砸金蛋
import StrikeActivityRules from '../setConfigure/strikeActivityRules'   //点点乐
import AnswerRules from '../setConfigure/answerRules'   //答题有奖
import CollectWordRules from '../setConfigure/collectWordRules'   //集字
import PosterDirectRules from '../setConfigure/posterDirectRules'   //专属海报
import QuestionnaireRules from '../setConfigure/questionnaireRules'   //问卷调查
import SignInRules from '../setConfigure/signInRules'   //签到
import FlipCardRules from '../setConfigure/flipCardRules'   //翻牌
import LayerModal from '../components/layerModal'   //取消、上一步弹窗
import EnterControl from './enterControl.jsx';
const activityTwo = (props) => {
  let { dispatch } = props;
  //取消弹窗
  let [isCancelModal, setIsCancelModal] = useState(false);
  let [isNewActivity, setIsNewActivity] = useState(localStorage.getItem('isNewActivity')) //是否新活动
  let [activityData, setActivityData] = React.useState(JSON.parse(localStorage.getItem('activityInfo')))  //活动信息
  let [activityStep, setactivityStep] = React.useState(parseInt(JSON.parse(localStorage.getItem('activityStep'))))  //活动信息
  let setIsCancel = () => {
    setIsCancelModal(true);
  }
  let onClickCancel = (e) => {
    setIsCancelModal(false);
    setIsStepBack(false);
  }
  //上一步
  let [topIndex, setTopIndex] = useState("抽奖");  //当前tab栏
  let tabChoiced = (e) => {
    if ((isNewActivity != 'false' || !activityData.marketActivityType) && activityStep <= 2) {
      activtiyTypeArr.map((item1,key1)=>{
        if(item1.topName == e){
          setIndex(item1.children[0].name)
        }
      })
      setTopIndex(e)
    }
  };
  let [index, setIndex] = useState("");  //抽奖 游戏tab
  let luckChoiced = (e) => {
    if ((isNewActivity != 'false' || !activityData.marketActivityType) && activityStep <= 2) {
      setIndex(e);
      if(e == '日日签'){
        sessionStorage.setItem('selectSignIn', 1);
      }else{
        sessionStorage.setItem('selectSignIn', 0);
      }
      
    }
  };
  /*上一步*/
  let [isStepBack, setIsStepBack] = useState(false);
  let [isStepInt, setIsStepInt] = useState(0);   //跳转对应页
  let setStepBack = (i) => {
    setIsStepInt(i)
    setIsStepBack(true)
  }
  let [activtiyTypeArr, setAcitivityTypeArr] = useState([
    {
      topName:"抽奖",
      children:[
        {
          name:"大转盘",
          marketActivityType: 1,
          describe:"幸运转盘转出好运",
          imgUrl:require("@/assets/activity/shape_6.png"),
          component:<ConfigActivityRules setStepBack = {setStepBack} luckChoiced = {luckChoiced} setIsCancel = {setIsCancel} />,
        },
        {
          name:"直抽",
          marketActivityType: 3,
          describe:"快速便捷抽出好礼",
          imgUrl:require("@/assets/activity/shape_7.png"),
          component:<DirectPumping setStepBack = {setStepBack} luckChoiced = {luckChoiced} setIsCancel = {setIsCancel} />,
        },
        {
          name:"砸金蛋",
          marketActivityType: 6,
          describe:"砸金蛋抽奖",
          imgUrl:require("@/assets/activity/shape_8.png"),
          component:<GoldenEggsRules setStepBack = {setStepBack} luckChoiced = {luckChoiced} setIsCancel = {setIsCancel} />,
        },
        {
          name:"盲盒娃娃机",
          marketActivityType: 5,
          describe:"盲盒娃娃机抽奖",
          imgUrl:require("@/assets/activity/shape_9.png"),
          component:<DollMachineRules setStepBack = {setStepBack} luckChoiced = {luckChoiced} setIsCancel = {setIsCancel} />,
        },
        {
          name:"红包雨",
          marketActivityType: null,
          describe:"红包雨抽奖",
          imgUrl:require("@/assets/activity/shape_10.png"),
          component:"",
        },
        {
          name:"专属海报",
          marketActivityType: 10,
          describe:"精美好礼等你来抽",
          imgUrl:require("@/assets/activity/shape_14.jpg"),
          component:<PosterDirectRules setStepBack = {setStepBack} luckChoiced = {luckChoiced} setIsCancel = {setIsCancel} />,
        },
        {
          name:"日日签",
          marketActivityType: 12,
          describe:"每日打卡赢好礼",
          imgUrl:require("@/assets/activity/shape_16.jpg"),
          component:<SignInRules setStepBack = {setStepBack} luckChoiced = {luckChoiced} setIsCancel = {setIsCancel} />,
        },
      ]
    },
    {
      topName:"秒杀",
      children:[
        {
          name:"秒杀专场",
          marketActivityType: 2,
          describe:"拼手速抢好礼",
          imgUrl:require("@/assets/activity/seckil_m7.png"),
          component:<SeckilActivityRules setStepBack = {setStepBack} luckChoiced = {luckChoiced} setIsCancel = {setIsCancel} />,
        },
        {
          name:"优惠购",
          marketActivityType: 4,
          describe:"满满好礼 任您选",
          imgUrl:require("@/assets/activity/seckil_m9.png"),
          component:<DiscountShoppingRules setStepBack = {setStepBack} luckChoiced = {luckChoiced} setIsCancel = {setIsCancel} />,
        },
        {
          name:"先到先得",
          marketActivityType: null,
          describe:"拼速度 抢好礼",
          imgUrl:require("@/assets/activity/seckil_m8.png"),
          component:"",
        }
      ]
    },
    {
      topName:"互动游戏",
      children:[
        {
          name:"趣味点点乐",
          marketActivityType: 7,
          describe:"开心点点乐，大奖抽抽抽",
          imgUrl:require("@/assets/activity/shape_11.png"),
          component:<StrikeActivityRules setStepBack = {setStepBack} luckChoiced = {luckChoiced} setIsCancel = {setIsCancel} />,
        },
        {
          name:"集字",
          marketActivityType: 9,
          describe:"集字得好礼",
          imgUrl:require("@/assets/activity/shape_13.jpg"),
          component:<CollectWordRules setStepBack = {setStepBack} luckChoiced = {luckChoiced} setIsCancel = {setIsCancel} />,
        },
        {
          name:"翻牌消消乐",
          marketActivityType: 13,
          describe:"开心翻牌抽大奖",
          imgUrl:require("@/assets/activity/shape_17.png"),
          component:<FlipCardRules setStepBack = {setStepBack} luckChoiced = {luckChoiced} setIsCancel = {setIsCancel} />,
        }
      ]
    },
    {
      topName:"问卷",
      children:[
        {
          name:"答题有奖",
          marketActivityType: 8,
          describe:"答题有奖，豪礼抽抽抽",
          imgUrl:require("@/assets/activity/shape_12.png"),
          component:<AnswerRules setStepBack = {setStepBack} luckChoiced = {luckChoiced} setIsCancel = {setIsCancel} />,
        },
        {
          name:"问卷调查",
          marketActivityType: 11,
          describe:"问卷调查，调研用户信息",
          imgUrl:require("@/assets/activity/shape_15.jpg"),
          component:<QuestionnaireRules setStepBack = {setStepBack} luckChoiced = {luckChoiced} setIsCancel = {setIsCancel} />,
        }
      ]
    }
  ]);
  let [activityType1, setActivityType] = useState(null);//活动类型
  let [materialId, setMaterialId] = useState(null);//主题id
  let getActivityType = () => {
    let type = 'twoNumber/getActivityRuleDetail';
    let marketActivityType = activityData.activityCenter_marketActivityType || null;
    if(marketActivityType == 2 || marketActivityType == 4){
      type = 'twoNumber/echoSeckillRuleActivity'
    }
    dispatch({
      type: type,
      payload: {
        method: 'postJSON',
        params: {
          channelId: activityData.channelId,
          activityId: activityData.objectId
        }
      },
      callback: (res) => {
        if(res.result.code === '0'){
          let activityType = res.body.marketActivityType;
          let toMaterialId = res.body.materialId;
          setMaterialId(toMaterialId);
          setActivityType(activityType);
          if(!toMaterialId){
            return
          }
          dispatch({
            type: 'selectTheme/onSetTheme',
            payload: null
          })
          activtiyTypeArr.map((item1,key1)=>{
            if(item1.topName == topIndex){
              setIndex(item1.children[0].name)
            }
          })
          if(activityType == 1){
            setTopIndex("抽奖");
            setIndex("大转盘");
          }else if(activityType == 2){
            setTopIndex("秒杀");
            setIndex("秒杀专场");
          }else if(activityType == 3){
            setTopIndex("抽奖");
            setIndex("直抽");
          }else if(activityType == 4){
            setTopIndex("秒杀");
            setIndex("优惠购");
          }else if (activityType == 5) {
            setTopIndex("抽奖");
            setIndex("盲盒娃娃机");
          }else if (activityType == 6) {
            setTopIndex("抽奖");
            setIndex("砸金蛋");
          }else if (activityType == 7) {
            setTopIndex("互动游戏");
            setIndex("趣味点点乐");
          }else if (activityType == 8) {
            setTopIndex("问卷");
            setIndex("答题有奖");
          }else if (activityType == 9) {
            setTopIndex("互动游戏");
            setIndex("集字");
          }else if (activityType == 10) {
            setTopIndex("抽奖");
            setIndex("专属海报");
          }else if (activityType == 11) {
            setTopIndex("问卷");
            setIndex("问卷调查");
          }else if (activityType == 12) {
            setTopIndex("抽奖");
            setIndex("日日签");
          }else if (activityType == 13) {
            setTopIndex("互动游戏");
            setIndex("翻牌消消乐");
          }
        }
      }
    })
  }
  useEffect(()=>{
    if(!activityType1){
      getActivityType();
    }
  },[activityType1])
  useEffect(() => {
    sessionStorage.setItem('selectSignIn', 0);
    if(!materialId){
      dispatch({
        type: 'selectTheme/onSetTheme',
        payload: null
      })
      activtiyTypeArr.map((item1,key1)=>{
        if(item1.topName == topIndex){
          setIndex(item1.children[0].name)
        }
      })
      if(activityData.marketActivityType == 1){
        setTopIndex("抽奖");
        setIndex("大转盘");
      }else if(activityData.marketActivityType == 2){
        setTopIndex("秒杀");
        setIndex("秒杀专场");
      }else if(activityData.marketActivityType == 3){
        setTopIndex("抽奖");
        setIndex("直抽");
      }else if(activityData.marketActivityType == 4){
        setTopIndex("秒杀");
        setIndex("优惠购");
      }else if (activityData.marketActivityType == 5) {
        setTopIndex("抽奖");
        setIndex("盲盒娃娃机");
      }else if (activityData.marketActivityType == 6) {
        setTopIndex("抽奖");
        setIndex("砸金蛋");
      }else if (activityData.marketActivityType == 7) {
        setTopIndex("互动游戏");
        setIndex("趣味点点乐");
      }else if (activityData.marketActivityType == 8) {
        setTopIndex("问卷");
        setIndex("答题有奖");
      }else if (activityData.marketActivityType == 9) {
        setTopIndex("互动游戏");
        setIndex("集字");
      }else if (activityData.marketActivityType == 10) {
        setTopIndex("抽奖");
        setIndex("专属海报");
      }else if (activityData.marketActivityType == 11) {
        setTopIndex("问卷");
        setIndex("问卷调查");
      }else if (activityData.marketActivityType == 12) {
        setTopIndex("抽奖");
        setIndex("日日签");
      }else if (activityData.marketActivityType == 13) {
        setTopIndex("互动游戏");
        setIndex("翻牌消消乐");
      }
    }
  },[])
  return (
      <div>
        <LayerModal iscancal={isCancelModal} onClickCancel={onClickCancel} isstopback={isStepBack} isstepint={isStepInt}/>
          {!materialId ? <div className={styles.block__cont}>
            <h1 className={styles.wrap_h1}>活动形式</h1>
            <div className={styles.wrap_main}>
              <h2 className={styles.msg_h2}><InfoCircleOutlined className={styles.msg_ico} />设置活动基本信息</h2>
              <div className={styles.wrap_head_tab}>
                {
                  activtiyTypeArr.map((item,key) => {
                    return <span key={key} onClick={()=>tabChoiced(item.topName)} className={item.topName == topIndex ? `${styles.tab_active}` : ''}>{item.topName}</span>
                  })
                }
              </div>
              <div className={styles.wrap_list_card}>
                {
                  activtiyTypeArr.map((item1,key1)=>{
                    if(item1.topName == topIndex){
                      return <ul>
                        {
                          item1.children.map((item2,key2)=>{
                            return <li onClick={()=>luckChoiced(item2.name)} className={index == item2.name ? `${styles.list_active}` : ''}>
                                <img src={item2.imgUrl} />
                                <h4>{item2.name}</h4>
                                <p>{item2.describe}</p>
                              </li>
                          })
                        }
                      </ul>
                    }
                  })
                }
            </div>
            </div>
          </div> : null}
        {/* 活动规则及奖品 */}
        {
          activtiyTypeArr.map((item1,key1)=>{
            return item1.children.map((item2,key2)=>{
              if(item1.topName == topIndex && item2.name == index){
                return <div className={styles.block_box2}>
                  <EnterControl compCode={item2.name}>
                    {item2.component}
                  </EnterControl>
                </div>
              }
            })
          })
        }
      </div>
    )
  }
export default connect(({ twoNumber, loading,selectTheme }) => ({
}))(activityTwo);
