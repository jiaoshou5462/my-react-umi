import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, Carousel, Upload, message, Select, Radio, Row, Col, Switch,Divider } from 'antd';
import { connect, history } from 'umi';
import styles from './style.less';
import SetColor from '../setColor';   //选择颜色组件
import { UploadOutlined, InboxOutlined, PlusOutlined, LeftOutlined, EllipsisOutlined } from '@ant-design/icons';
import LayerModal from '../layerModal';   //取消、上一步弹窗
import { isEmpty } from 'lodash';

const activityPage = (props) => {
  let { dispatch, subimtData, onChangType, isDataStore, storeConfig, showLayer, isDataChange, applyTheme } = props;
  let [activityData, setActivityData] = React.useState(JSON.parse(localStorage.getItem('activityInfo')))  //活动信息
  let [formData, setFormData] = useState({});
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
  //下一步
  let setStepNext = () => {
    if (isDataChange) {
      showLayer(2)
    } else {
      history.push("/activityConfig/activityList/activityModule/finish");
    }
  }

  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  let activityDetail = localStorage.getItem('activityDetail');   //是否详情禁用状态
  let activityDetails = activityDetail == '1' ? true : false;
  //对应编辑栏
  const [indexInt, setIndexInt] = useState(1);
  //首页切换工具栏
  let setTools = (i) => {
    setIndexInt(i)
  };
  //背景
  let [imageUrl, setImageUrl] = useState("");  //背景图
  //颜色设置
  let [gameColor, setgameColor] = useState({}) //参与按钮及信息颜色配置
  useEffect(() => {
    let tempColor = {  //参与按钮及信息颜色配置
      color1: "#FF7900",//按钮背景颜色
      color2: "#fff",  //按钮字体颜色
      color3: "#00CBE7",  //标签背景颜色
      color4: "#fff",  //标签字体颜色
    }
    setgameColor(tempColor);
  }, [])
  let setMcolor = (n, i) => {
    let toMcolors = { ...gameColor };
    toMcolors[n] = i;
    setgameColor(toMcolors);
    onChangType(true);
  };
  //按钮文案
  let [words,setWords]=useState("立即购买");
  let setBtnWords =(value)=>{
    setWords(value.target.value);
    onChangType(true);
  }
  //广告
  let [adverForm] = Form.useForm();
  //form保存
  let adverSubmit = (value) => {
    let toFormData = formData;
    toFormData.buyButtonBackgroundColor = gameColor.color1,
    toFormData.buyButtonFontColor = gameColor.color2,
    toFormData.labelBackgroundColor = gameColor.color3,
    toFormData.labelFontColor = gameColor.color4,
    toFormData.buyButtonWord = words,
    dispatch({
      type: 'discountList/newStyleSave',
      payload: {
        method: 'postJSON',
        params: {
          styleCode: 'discountHome',
          activityId: activityInfo.objectId,
          styleValue: JSON.stringify(toFormData)
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {
          window.activityData_materialApply = {...window.activityData_materialApply};
          window.activityData_materialApply.homeButtonContent = toFormData.homeButtonContent;
          window.activityData_materialApply.buyPageButtonContent = toFormData.buyPageButtonContent;
          message.success(res.result.message);
          onChangType(false);
          if (isDataStore) {
            storeConfig(true);
          }
        } else {
          message.error(res.result.message);
        }
      }
    });
  };
  //样式数据
  let getStyleByActivityIdAndStyleCode = () => {
    dispatch({
      type: 'discountList/getStyleByActivityIdAndStyleCode',
      payload: {
        method: 'get',
        params: {
          styleCode: 'discountHome',
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let items = res.body && res.body.styleValue && JSON.parse(res.body.styleValue);
          window.activityData_materialApply = {...window.activityData_materialApply};
          window.activityData_materialApply.homeButtonContent = items.homeButtonContent;
          window.activityData_materialApply.buyPageButtonContent = items.buyPageButtonContent;
          if(items){
            setFormData({ ...items });
            let togameColor = gameColor;
            togameColor.color1 = items.buyButtonBackgroundColor || '#FF7900';
            togameColor.color2 = items.buyButtonFontColor || '#fff';
            togameColor.color3 = items.labelBackgroundColor || '#00CBE7';
            togameColor.color4 = items.labelFontColor || '#fff';
            if(items.buyPageButtonContent){
              setWords(items.buyPageButtonContent);
            }
            setgameColor({ ...togameColor });
          }
        }
      }
    });
  }
  //购买页商品展示
  let [goodsList,setGoodsList]=useState([]);
  //活动商品查询
  let getBuyCheaperGoods = () => {
    dispatch({
      type: 'discountShoppingRules/getBuyCheaperGoods',
      payload: {
        method: 'get',
        params: {
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let items = res.body;
          let list = [];
          items.length > 0 && items.map(item => {
            let obj = {
              tradeDisplayName: item.tradeDisplayName.slice(0,11),
              tradeTag: item.tradeTag,
              singleBuyLimit: item.singleBuyLimit,
              singleLimitNum: item.singleLimitNum,
              prizeImg: item.prizeImg,
              unitPrice: item.unitPrice,
              payPrice: item.payPrice
            }
            list.push(obj);
          })
          list.push({
            tradeDisplayName: "商品名称",
            tradeTag: "热销",
            singleBuyLimit: 1,
            singleLimitNum: 10,
            prizeImg: require('../../../../assets/activity/prize_m1.png'),
            unitPrice: 399.9,
            payPrice: 199.9
          })
          setGoodsList(list);
        } else {
          message.error(res.result.message);
        }
      }
    });
  };
  useEffect(() => {
    if (isDataStore) {
      adverSubmit(adverForm.getFieldsValue())
    }
  }, [isDataStore]);

  useEffect(() => {
    if (activityInfo && activityInfo.objectId && activityInfo.channelId) {
      getBuyCheaperGoods();
    }
  }, []);

  return (
    <div>
      <LayerModal iscancal={isCancelModal} onClickCancel={onClickCancel} isstopback={isStepBack} isstepint={isStepInt} />
      {/* 预览、编辑 */}
      <div className={`${styles.by_main} ${activityDetails ? styles.by_delmain : ''}`}>
        {/* 预览-转盘也页*/}
        <h2 className={styles.wrap_titles}>
          <div className={styles.wrap_title_h2}>
            <em>预览</em>
            <div style={{ marginLeft: '320px' }}>
            {indexInt === 1 ? '按钮' : '商品标签'}
            </div>
          </div>
        </h2>
        <div className={styles.wrap_prby}>
          <div className={styles.wrap_preview}>
            <div className={styles.phone_wrap}>
              <div className={styles.phone_img1}><img src={require('../../../../assets/activity/setpage_m1.png')}></img></div>
              <div className={styles.phone_img2}><LeftOutlined className={styles.phone_img2_1} /><span>{activityInfo.internalName}</span><EllipsisOutlined className={styles.phone_img2_2} /></div>
              <div className={styles.phone_img3}><img src={require('../../../../assets/activity/setpage_m2.png')}></img></div>
              {/* 购买页 */}
              <div className={styles.index_wrap}>
                <div className={styles.good_content}>
                  {goodsList.length > 0 && goodsList.map((item, index) => {
                    return <div className={styles.good_item}>
                      <div className={styles.item_left}>
                        <img className={styles.item_prizeImg} src={item.prizeImg} alt="" />
                        {index == goodsList.length -1 ? <div className={styles.item_pop}>已抢光</div> : null}
                        <div className={styles.item_tradeTag} style={{ 'background': gameColor.color3,'color': gameColor.color4 }} onClick={setTools.bind(this, 2)}>{item.tradeTag}</div>
                      </div>
                      <div className={styles.item_right}>
                        <div className={styles.item_name}>{item.tradeDisplayName}</div>
                        <div className={styles.item_singleLimit}>
                          <span className={styles.limit_word} style={{'color': gameColor.color1 }}>{item.singleBuyLimit == 1 ? `限购${item.singleLimitNum}件` : '不限购'}</span>
                          <span className={styles.limit_bg} style={{ 'background': gameColor.color1}}></span>
                        </div> 
                        <div className={styles.item_originPrice}>￥<span>{item.unitPrice}</span></div>
                        <div className={styles.item_payPrice}><span>￥</span>{item.payPrice}</div>
                        {index == goodsList.length -1 ?<div className={`${styles.item_btn} ${styles.item_sellOut}`}>已售罄</div> : <div className={styles.item_btn} style={{ 'background': gameColor.color1,'color': gameColor.color2 }} onClick={setTools.bind(this, 1)}>{words}</div>}
                      </div>
                    </div>
                  })}
                  <div className={styles.good_nomore}>没有更多商品</div>
                </div>
              </div>
            </div>
          </div>
          {/* 编辑 */}
          <div className={styles.side_style}>
            <Form form={adverForm} onFinish={adverSubmit} labelCol={{ span: 3 }} wrapperCol={{ span: 12 }}>
              {/* 字体颜色 */}
              {indexInt == 1 ?
                    <div className={`${styles.side_wrap2} ${styles.side_wrap}`}>
                      <div className={styles.side_wrap_by}>
                        <div className={styles.side_wrap2_li} style={{ marginTop: '25px' }}>
                          <span className={styles.side_wrap2_span}>背景颜色：</span>
                          <span className={styles.side_wrap2_color}><SetColor colors={gameColor.color1} colorName='color1' setMColor={setMcolor} ></SetColor></span>
                        </div>
                        <div className={styles.side_wrap2_li}>
                          <span className={styles.side_wrap2_span}>字体颜色：</span>
                          <span className={styles.side_wrap2_color}><SetColor colors={gameColor.color2} colorName='color2' setMColor={setMcolor} ></SetColor></span>
                        </div>
                        <div className={styles.side_wrap2_li}>
                          <span className={styles.side_wrap2_span}>按钮文案：</span>
                          <Input className={styles.side_wrap3_toppn} value={words} onChange={setBtnWords} maxLength="4" />
                        </div>
                      </div>
                      <div className={styles.side_wrap_btn}><Button type="primary" htmlType="submit">保存</Button></div>
                    </div>
                : indexInt == 2 ?
                <div className={`${styles.side_wrap2} ${styles.side_wrap}`}>
                  <div className={styles.side_wrap_by}>
                    <div className={styles.side_wrap2_li} style={{ marginTop: '25px' }}>
                      <span className={styles.side_wrap2_span}>背景颜色：</span>
                      <span className={styles.side_wrap2_color}><SetColor colors={gameColor.color3} colorName='color3' setMColor={setMcolor} ></SetColor></span>
                    </div>
                    <div className={styles.side_wrap2_li}>
                      <span className={styles.side_wrap2_span}>字体颜色：</span>
                      <span className={styles.side_wrap2_color}><SetColor colors={gameColor.color4} colorName='color4' setMColor={setMcolor} ></SetColor></span>
                    </div>
                  </div>
                  <div className={styles.side_wrap_btn}><Button type="primary" htmlType="submit">保存</Button></div>
                </div> : null}
            </Form>
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
export default connect(({ discountList, loading, selectTheme }) => ({
  subimtData: discountList.subimtData,
  applyTheme: selectTheme.applyTheme
}))(activityPage);
