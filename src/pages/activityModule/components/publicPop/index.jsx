import React, { useEffect, useState } from 'react';
import {
  Button,
  Carousel,
  message,
  Modal,
  Input,
  Radio,
  Checkbox
} from 'antd';
import {
  connect,
  history,
  setStepNext
} from 'umi';
import styles from './style.less';
import { LeftOutlined, EllipsisOutlined, CloseCircleOutlined } from '@ant-design/icons';
import LayerModal from '../layerModal';   //取消、上一步弹窗
import VisPop from '../visPop';   //转盘
import SeckilPop from '../seckilPop';   //秒杀
import DirectPop from '../directPop';   //直抽
import DiscountPop from '../discountPop';   //优惠购

const activityRule = (props) => {
  let { dispatch, itemData, onChangType, isDataStore, storeConfig, showLayer, isDataChange, popTypes } = props;
  useEffect(() => {
    if (Object.keys(itemData).length > 0) {
      let temp = 1;
      if (popTypes == 1) {
        temp = itemData.activityRuleUniteStyle || 1;
      } else if (popTypes == 2) {
        temp = itemData.winUniteStyle || 1;
      } else if (popTypes == 3) {
        temp = itemData.lotteryAllStyle || 1;
        let showButton = itemData.showButton;
        let couponBtnShow = showButton ? showButton.couponBtnShow === 0 ? true : false : true;
        let integrationBtnShow = showButton ? showButton.integrationBtnShow === 0 ? true : false : true;
        let externalPrizeBtnShow = showButton ? showButton.externalPrizeBtnShow === 0 ? true : false : true;
        let materialObjectBtnShow = showButton ? showButton.materialObjectBtnShow === 0 ? true : false : true;
        setCouponBtnShow(couponBtnShow);
        setIntergationBtnShow(integrationBtnShow);
        setExternalPrizeBtnShow(externalPrizeBtnShow);
        setMaterialObjectBtnShow(materialObjectBtnShow);
        setExternalPrizeTxt(showButton && showButton.externalPrizeTxt);
        setMaterialObjectTxt(showButton && showButton.materialObjectTxt);
        let isFans = itemData.isFans || 0;
        setVsFans(isFans)
      }
      setStyleType(temp)
    }
  }, [itemData])
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


  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  let activityTypes = activityInfo.marketActivityType ? activityInfo.marketActivityType : 1;

  let activityDetail = localStorage.getItem('activityDetail');   //是否详情禁用状态
  let activityDetails = activityDetail == '1' ? true : false;

  let [styleType, setStyleType] = useState(1); //样式单选
  let setStyle = (vaule) => {
    setStyleType(vaule.target.value)
    onChangType(true);
  }

  let [couponBtnShow, setCouponBtnShow] = useState(true);//卡券隐藏按钮
  let [integrationBtnShow, setIntergationBtnShow] = useState(true);//积分隐藏按钮
  let [externalPrizeBtnShow, setExternalPrizeBtnShow] = useState(true);//外部奖品隐藏按钮
  let [materialObjectBtnShow, setMaterialObjectBtnShow] = useState(true);//实物隐藏按钮
  //卡券隐藏
  let tab1Change = (e) => {
    setCouponBtnShow(!e.target.checked)
    onChangType(true);
  }
  //积分隐藏
  let tab2Change = (e) => {
    setIntergationBtnShow(!e.target.checked)
    onChangType(true);
  }
  //外部奖品隐藏
  let tab6Change = (e) => {
    if(!e.target.checked){
      setExternalPrizeTxt("");
    }
    setExternalPrizeBtnShow(!e.target.checked)
    onChangType(true);
  }
  //实物隐藏
  let tab3Change = (e) => {
    if(!e.target.checked){
      setMaterialObjectTxt("");
    }
    setMaterialObjectBtnShow(!e.target.checked)
    onChangType(true);
  }

  let [vsFans, setVsFans] = useState(1);   //粉丝
  let setFans = (e) => {
    setVsFans(e.target.value)
    onChangType(true);
  }
  let [externalPrizeTxt, setExternalPrizeTxt] = useState("");//外部奖品文案提示
  let [materialObjectTxt, setMaterialObjectTxt] = useState("");//实物文案提示
  let externalPrizeTxtChange = (e) => {
    setExternalPrizeTxt(e.target.value);
    onChangType(true);
  }
  let materialObjectTxtChange = (e) => {
    setMaterialObjectTxt(e.target.value);
    onChangType(true);
  }
  // tab
  let [tabType, setTabType] = useState('1');
  let tabChange = (e) => {
    setTabType(e.target.value)
  }
  /*保存*/
  let saveActivityStyle = () => {
    let data = {
      step: popTypes,
      activityId: activityInfo.objectId,
      channelId: activityInfo.channelId,
    }
    if(popTypes == 3 && !externalPrizeBtnShow && !externalPrizeTxt){
      message.info("请输入外部奖品文案提示");
      return 
    }
    if(popTypes == 3 && !materialObjectBtnShow && !materialObjectTxt){
      message.info("请输入实物文案提示");
      return
    }
    if (popTypes == 1) {
      data.activityRuleUniteStyle = styleType;
    } else if (popTypes == 2) {
      data.winUniteStyle = styleType;
    } else if (popTypes == 3) {
      data.lotteryAllStyle = styleType;
      data.showButton = {
        couponBtnShow : couponBtnShow ? 0 : 1,
        integrationBtnShow : integrationBtnShow ? 0 : 1,
        externalPrizeBtnShow : externalPrizeBtnShow ? 0 : 1,
        materialObjectBtnShow : materialObjectBtnShow ? 0 : 1,
        externalPrizeTxt : externalPrizeTxt,
        materialObjectTxt : materialObjectTxt,
      }
      data.isFans = vsFans;
    }
    dispatch({
      type: 'publicPop/saveUniteStyle',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          message.success(res.result.message)
          onChangType(false);
          if (isDataStore) {
            storeConfig(true);
          }
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  useEffect(() => {
    if (isDataStore) {
      saveActivityStyle();
    }
  }, [isDataStore]);
  return (
    <div>
      <LayerModal iscancal={isCancelModal} onClickCancel={onClickCancel} isstopback={isStepBack} isstepint={isStepInt} />
      {/* 预览、编辑 */}
      <div className={`${styles.by_main} ${activityDetails ? styles.by_delmain : ''}`}>
        {/* 预览-首页 */}
        <h2 className={styles.wrap_titles}>
          <div className={styles.wrap_title_h2}>
            <em>预览</em>
            <div style={{ marginLeft: '320px' }}>弹窗样式</div>
          </div>
        </h2>
        <div className={styles.wrap_prby}>
          <div className={styles.wrap_preview}>
            <div className={styles.phone_wrap}>
              <div className={styles.phone_img1}><img src={require('../../../../assets/activity/setpage_m1.png')}></img></div>
              <div className={styles.phone_img2}><LeftOutlined className={styles.phone_img2_1} /><span>{activityInfo.displayName}</span><EllipsisOutlined className={styles.phone_img2_2} /></div>
              
              {/* 活动首页 */}
              <div className={styles.index_wrap}>
                {/* 模板背景 */}
                {
                  activityTypes == 1 ? <VisPop itemData={itemData}></VisPop> :
                    activityTypes == 2 ? <SeckilPop itemData={itemData}></SeckilPop> 
                    :
                    activityTypes == 3 ? <DirectPop itemData={itemData}></DirectPop>
                    :
                    activityTypes == 4 ? <DiscountPop itemData={itemData}></DiscountPop>
                    : null
                }
                <div className={styles.phone_img3}><img src={require('../../../../assets/activity/setpage_m2.png')}></img></div>
                {
                  popTypes == 1 || popTypes == 2 ?  //活动规则 and 中奖记录
                    <div className={styles.index_rule}>
                      <div className={styles.index_rule_by}>
                        <div className={styles.index_rule_img}>
                          {
                            styleType == 1 ? <img src={require('../../../../assets/activity/setpage_m15.png')}></img>
                              : styleType == 2 ? <img src={require('../../../../assets/activity/setpage_m16.png')}></img>
                                : styleType == 3 ? <img src={require('../../../../assets/activity/m_style_3_5.png')}></img>
                                  : styleType == 4 ? <img src={require('../../../../assets/activity/m_style_4_4.png')}></img>
                                    : styleType == 5 ? <img src={require('../../../../assets/activity/m_style_5_5.png')}></img>
                                      : null}

                        </div>
                        <h6 style={{ "color": styleType == 1 ? '#4A4A4A' : styleType == 2 ? '#FCF0C7' : '#fff' }}>{popTypes == 1 ? '活动规则' : activityTypes == 2 ? '秒杀记录' :  activityTypes == 4 ? '购买记录' : '中奖记录'}</h6>
                        {
                          popTypes == 1 ?
                            <div className={styles.index_rule_txt} dangerouslySetInnerHTML={{ __html: itemData.describe }}>
                            </div>
                            : popTypes == 2 ?
                              <div className={styles.index_record}>
                                <div className={styles.index_record_li}>
                                  <span><img src={require('../../../../assets/activity/prize_m1.png')}></img>
                                    <em>外部奖品名称</em>
                                  </span>
                                  <i>去领取</i>
                                </div>
                                <div className={styles.index_record_li}>
                                  <span><img src={require('../../../../assets/activity/prize_m2.png')}></img>
                                    <em>话费券</em>
                                  </span>
                                </div>
                                <div className={styles.index_record_li}>
                                  <span><img src={require('../../../../assets/activity/prize_m3.png')}></img>
                                    <em>猫眼电影券</em>
                                  </span>
                                  <i>去使用</i>
                                </div>
                              </div>
                              : null
                        }

                      </div>
                      <CloseCircleOutlined className={styles.index_rule_close} />
                    </div>
                    : popTypes == 3 ?    //抽奖结果
                      <div className={styles.index_rule}>
                        {/* 卡券 */}
                        {tabType == '1' ?
                          <div className={`${styles.index_rule_bys} ${styles.index_rule_by1}`}>
                            <div className={styles.index_rule_img}>
                              {
                                styleType == 1 ? <img src={require('../../../../assets/activity/setpage_m15.png')}></img>
                                  : styleType == 2 ? <img src={require('../../../../assets/activity/setpage_m17.png')}></img>
                                    : styleType == 3 ? <img src={require('../../../../assets/activity/m_style_3_1.png')}></img>
                                      : styleType == 4 ? <img src={require('../../../../assets/activity/m_style_4_1.png')}></img>
                                        : styleType == 5 ? <img src={require('../../../../assets/activity/m_style_5_1.png')}></img>
                                          : null}
                            </div>
                            <div className={styles.index_by_mian}>
                              <h6 style={{ "color": styleType == 1 ? '#1888FF' : styleType == 5 ? '#FF0500' : '#fff' }}>恭喜你获得</h6>
                              <p style={{ "color": styleType == 1 ? '#4A4A4A' : styleType == 5 ? '#FF0500' : '#fff' }}>猫眼电影券</p>
                              <div className={styles.index_by1_img}>
                                <img src={require('../../../../assets/activity/prize_m3.png')}></img>
                              </div>
                              {couponBtnShow ? <div className={styles.index_by1_btn}><span>立即使用</span></div> : null}
                            </div>
                          </div>
                          //积分
                          : tabType == '2' ?
                            <div className={`${styles.index_rule_bys} ${styles.index_rule_by1}`}>
                              <div className={styles.index_rule_img}>
                                {
                                  styleType == 1 ? <img src={require('../../../../assets/activity/setpage_m15.png')}></img>
                                    : styleType == 2 ? <img src={require('../../../../assets/activity/setpage_m17.png')}></img>
                                      : styleType == 3 ? <img src={require('../../../../assets/activity/m_style_3_1.png')}></img>
                                        : styleType == 4 ? <img src={require('../../../../assets/activity/m_style_4_1.png')}></img>
                                          : styleType == 5 ? <img src={require('../../../../assets/activity/m_style_5_1.png')}></img>
                                            : null}
                              </div>
                              <div className={styles.index_by_mian}>
                                <h6 style={{ "color": styleType == 1 ? '#1888FF' : styleType == 5 ? '#FF0500' : '#fff' }}>恭喜你获得</h6>
                                <p style={{ "color": styleType == 1 ? '#4A4A4A' : styleType == 5 ? '#FF0500' : '#fff' }}>1000海贝积分</p>
                                <div className={styles.index_by1_img}>
                                  <img src={require('../../../../assets/activity/prize_m1.png')}></img>
                                </div>
                                {integrationBtnShow ? <div className={styles.index_by1_btn}><span>立即使用</span></div> : null}
                              </div>
                            </div>
                            //实物
                            : tabType == '3' ?
                              <div className={`${styles.index_rule_by} ${materialObjectBtnShow ? styles.index_rule_by6 : null}`}>
                                <div className={styles.index_rule_img}>
                                  {
                                    styleType == 1 ? <img src={require('../../../../assets/activity/setpage_m15.png')}></img>
                                      : styleType == 2 ? <img src={require('../../../../assets/activity/setpage_m17.png')}></img>
                                        : styleType == 3 ? <img src={require('../../../../assets/activity/m_style_3_2.png')}></img>
                                          : styleType == 4 ? <img src={require('../../../../assets/activity/m_style_4_2.png')}></img>
                                            : styleType == 5 ? <img src={require('../../../../assets/activity/m_style_5_2.png')}></img>
                                              : null}
                                </div>
                                <div className={`${styles.index_by_mian} ${styleType == 2 ? styles.index_by_mian2 : null}`}>
                                  <h6 style={{ "color": styleType == 2 ? '#FBEABD' : styleType == 1 ? '#1888FF' : styleType == 5 ? '#FF0500' : "#fff" }}>恭喜你获得</h6>
                                  <p style={{ "color": styleType == 2 ? '#FBEABD' : styleType == 1 ? '#9B9B9B' : styleType == 5 ? '#FF0500' : '#fff' }}>奖品名称</p>
                                  <div className={styles.index_by1_img}>
                                    <img src={require('../../../../assets/activity/prize_m4.png')}></img>
                                  </div>
                                  {materialObjectBtnShow ? 
                                    <div className={styles.index_by1_address}>
                                      <h5>请填写您的收货地址</h5>
                                      <p><span>姓名</span><input type='text'></input></p>
                                      <p><span>手机号</span><input type='text'></input></p>
                                      <p className={styles.index_by1_address_area}><span>详细地址</span><textarea></textarea></p>
                                      <button>提交</button>
                                    </div>
                                  : <p className={styles.index_notice}>{materialObjectTxt}</p>}
                                </div>
                              </div>
                              //现金红包
                              : tabType == '4' ?
                                <div className={`${styles.index_rule_bys} ${styles.index_rule_by4}`}>
                                  <div className={styles.index_rule_img}>
                                    {
                                      styleType == 1 ? <img src={require('../../../../assets/activity/setpage_m15.png')}></img>
                                        : styleType == 2 ? <img src={require('../../../../assets/activity/setpage_m17.png')}></img>
                                          : styleType == 3 ? <img src={require('../../../../assets/activity/m_style_3_3.png')}></img>
                                            : styleType == 4 ? <img src={require('../../../../assets/activity/m_style_4_1.png')}></img>
                                              : styleType == 5 ? <img src={require('../../../../assets/activity/m_style_5_3.png')}></img>
                                                : null}
                                  </div>
                                  <div className={styles.index_by_mian}>
                                    {
                                      vsFans === 1 ? <h6 style={{ "color": styleType == 1 ? '#1888FF' : styleType == 2 ? '#FBEABD' : styleType == 5 ? '#FF0500' : '#fff' }}>恭喜你获得</h6>
                                        : <h6 style={{ "color": styleType == 1 ? '#1888FF' : styleType == 2 ? '#FBEABD' : styleType == 5 ? '#FF0500' : '#fff' }}>恭喜你获得</h6>
                                    }
                                    {
                                      vsFans === 1 ? <p style={{ "color": styleType == 1 ? '#9B9B9B' : styleType == 2 ? '#FBEABD' : styleType == 5 ? '#FF0500' : '#fff' }}>
                                        10元现金红包
                                        <br />
                                        长按公众号二维码前往领取
                                      </p> : <p style={{ "color": styleType == 1 ? '#9B9B9B' : styleType == 2 ? '#FBEABD' : styleType == 5 ? '#FF0500' : '#fff' }}>
                                        10元现金红包
                                        <br />
                                        请于【服务通知】中领取
                                      </p>
                                    }

                                    <div className={styles.index_by1_img}>
                                      {
                                        vsFans === 1 ? <span /> : <em />
                                      }

                                    </div>
                                  </div>
                                </div>
                                //未中奖
                                : tabType == '5' ?
                                  <div className={`${styles.index_rule_bys} ${styles.index_rule_by5}`}>
                                    <div className={styles.index_rule_img}>
                                      {
                                        styleType == 1 ? <img src={require('../../../../assets/activity/setpage_m15.png')}></img>
                                          : styleType == 2 ? <img src={require('../../../../assets/activity/setpage_m17.png')}></img>
                                            : styleType == 3 ? <img src={require('../../../../assets/activity/m_style_3_4.png')}></img>
                                              : styleType == 4 ? <img src={require('../../../../assets/activity/m_style_4_3.png')}></img>
                                                : styleType == 5 ? <img src={require('../../../../assets/activity/m_style_5_4.png')}></img>
                                                  : null}
                                    </div>
                                    <div className={styles.index_by_mian}>
                                      <h6 style={{ "color": styleType == 1 ? '#1888FF' : styleType == 2 ? '#FBEABD' : styleType == 5 ? '#FF0500' : '#fff' }}>很抱歉您未能中奖</h6>
                                      <p style={{ "color": styleType == 1 ? '#9B9B9B' : styleType == 2 ? '#FBEABD' : styleType == 5 ? '#FF0500' : '#fff' }}>期待您下次好运</p>
                                      <div className={styles.index_by1_img}>
                                        <img src={require('../../../../assets/activity/prize_m5.png')}></img>
                                      </div>
                                    </div>
                                  </div>
                                  //外部奖品
                                  : tabType == '6' ?
                                    <div className={`${styles.index_rule_bys} ${styles.index_rule_by1}`}>
                                      <div className={styles.index_rule_img}>
                                        {
                                          styleType == 1 ? <img src={require('../../../../assets/activity/setpage_m15.png')}></img>
                                            : styleType == 2 ? <img src={require('../../../../assets/activity/setpage_m17.png')}></img>
                                              : styleType == 3 ? <img src={require('../../../../assets/activity/m_style_3_1.png')}></img>
                                                : styleType == 4 ? <img src={require('../../../../assets/activity/m_style_4_1.png')}></img>
                                                  : styleType == 5 ? <img src={require('../../../../assets/activity/m_style_5_1.png')}></img>
                                                    : null}
                                      </div>
                                      <div className={styles.index_by_mian}>
                                        <h6 style={{ "color": styleType == 1 ? '#1888FF' : styleType == 5 ? '#FF0500' : '#fff' }}>恭喜你获得</h6>
                                        <p style={{ "color": styleType == 1 ? '#4A4A4A' : styleType == 5 ? '#FF0500' : '#fff' }}>相关奖品</p>
                                        <div className={styles.index_by1_img}>
                                          <img src={require('../../../../assets/activity/prize_m1.png')}></img>
                                        </div>
                                        {externalPrizeBtnShow ? 
                                          <div className={styles.index_by1_btn}><span>立即领取</span></div> 
                                          : <p className={styles.index_notice} style={{"color": styleType == 1 ? "#9B9B9B" : "#fff"}}>{externalPrizeTxt}</p>
                                        }
                                      </div>
                                    </div>
                                    : null}
                        <CloseCircleOutlined className={styles.index_rule_close} />
                      </div>
                      : null
                }
              </div>
            </div>
          </div>
          {/* 编辑 */}
          <div className={styles.side_style}>
            <div className={`${styles.side_wrap1} ${styles.side_wrap} ${popTypes == 3 ? styles.side_wrap3 : null}`}>
              {popTypes == 1 || popTypes == 2 ?
                  <div className={styles.side_wrap_by}>
                    <h6>样式：</h6>
                    <Radio.Group value={styleType} className={styles.side_wrap1_list} onChange={setStyle}>
                      <Radio value={1} className={styles.side_wrap1_li}>样式1
                        <div className={styles.side_wrap1_liimg}><span><img src={require('../../../../assets/activity/setpage_m15.png')}></img></span></div>
                      </Radio>
                      <Radio value={2} className={styles.side_wrap1_li}>样式2
                        <div className={styles.side_wrap1_liimg}><span><img src={require('../../../../assets/activity/setpage_m16.png')}></img></span></div>
                      </Radio>
                      <Radio value={3} className={styles.side_wrap1_li}>样式3
                        <div className={styles.side_wrap1_liimg}><span><img src={require('../../../../assets/activity/m_style_3_5.png')}></img></span></div>
                      </Radio>
                      <Radio value={4} className={styles.side_wrap1_li}>样式4
                        <div className={styles.side_wrap1_liimg}><span><img src={require('../../../../assets/activity/m_style_4_4.png')}></img></span></div>
                      </Radio>
                      <Radio value={5} className={styles.side_wrap1_li}>样式5
                        <div className={styles.side_wrap1_liimg}><span><img src={require('../../../../assets/activity/m_style_5_5.png')}></img></span></div>
                      </Radio>
                    </Radio.Group>
                  </div>
                  : popTypes == 3 ?
                    <div className={styles.side_wrap_by}>
                      <div className={`${styles.side_wrap_top} ${styles.wrap_box}`}>
                        <h6>样式：</h6>
                        <Radio.Group value={styleType} className={styles.side_wrap1_list} onChange={setStyle}>
                          <Radio value={1} className={styles.side_wrap1_li}>样式1
                            <div className={styles.side_wrap1_liimg}><img src={require('../../../../assets/activity/setpage_m15.png')}></img></div>
                          </Radio>
                          <Radio value={2} className={styles.side_wrap1_li}>样式2
                            <div className={styles.side_wrap1_liimg}><img src={require('../../../../assets/activity/setpage_m17.png')}></img></div>
                          </Radio>
                          <Radio value={3} className={styles.side_wrap1_li}>样式3
                            <div className={styles.side_wrap1_liimg}><img src={require('../../../../assets/activity/m_style_3_1.png')}></img></div>
                          </Radio>
                          <Radio value={4} className={styles.side_wrap1_li}>样式4
                            <div className={styles.side_wrap1_liimg}><img src={require('../../../../assets/activity/m_style_4_1.png')}></img></div>
                          </Radio>
                          <Radio value={5} className={styles.side_wrap1_li}>样式5
                            <div className={styles.side_wrap1_liimg}><img src={require('../../../../assets/activity/m_style_5_1.png')}></img></div>
                          </Radio>
                        </Radio.Group>
                      </div>
                      <div className={styles.side_wrap_top}>
                        <Radio.Group value={tabType} onChange={tabChange}>
                          <Radio.Button className={tabType == '1' ? `${styles.wrap_toptab_activity}` : `${styles.side_wrap_topli}`} value="1">卡券</Radio.Button>
                          <Radio.Button className={tabType == '2' ? `${styles.wrap_toptab_activity}` : `${styles.side_wrap_topli}`} value="2">积分</Radio.Button>
                          <Radio.Button className={tabType == '6' ? `${styles.wrap_toptab_activity}` : `${styles.side_wrap_topli}`} value="6">外部奖品</Radio.Button>
                          <Radio.Button className={tabType == '3' ? `${styles.wrap_toptab_activity}` : `${styles.side_wrap_topli}`} value="3">实物</Radio.Button>
                          <Radio.Button className={tabType == '4' ? `${styles.wrap_toptab_activity}` : `${styles.side_wrap_topli}`} value="4">现金红包</Radio.Button>
                          <Radio.Button className={tabType == '5' ? `${styles.wrap_toptab_activity}` : `${styles.side_wrap_topli}`} value="5">未中奖</Radio.Button>

                        </Radio.Group>
                        {tabType == 4 ?
                          <div className={styles.side_wrap_top_red}>
                            <Radio.Group value={vsFans} onChange={setFans}>
                              <Radio value={1}>粉丝用户</Radio>
                              <Radio value={0}>非粉丝用户</Radio>
                            </Radio.Group>
                          </div>
                          : null}
                      </div>
                      {tabType == 1 ?
                        <div className={styles.wrap_box_block}>
                          <div className={styles.wrap_box1_n1}>页面中的奖品仅为示例</div>
                          <Checkbox className={styles.wrap_box1_check} checked={!couponBtnShow} onChange={tab1Change}>隐藏 [立即使用]</Checkbox>
                        </div> :
                      tabType == 2 ?
                        <div className={styles.wrap_box_block}>
                          <div className={styles.wrap_box1_n1}>页面中的奖品仅为示例</div>
                          <Checkbox className={styles.wrap_box1_check} checked={!integrationBtnShow} onChange={tab2Change}>隐藏 [立即使用]</Checkbox>
                          <div className={styles.wrap_box1_n2}>显示：请确保领取链接已配置</div>
                          <div className={styles.wrap_box1_n2}>隐藏：请确保积分已对接</div>
                        </div> :
                      tabType == 6 ?
                        <div className={styles.wrap_box_block}>
                          <div className={styles.wrap_box1_n1}>页面中的奖品仅为示例</div>
                          <Checkbox className={styles.wrap_box1_check} checked={!externalPrizeBtnShow} onChange={tab6Change}>隐藏 [立即领取]</Checkbox>
                          {!externalPrizeBtnShow ? 
                            <div className={styles.wrap_box1_n3}>
                              <span>文案提示：</span>
                              <Input className={styles.wrap_box1_btn} value={externalPrizeTxt} onChange={externalPrizeTxtChange} maxLength="20"/>
                            </div>
                          : null}
                        </div> :
                      tabType == 3 ?
                        <div className={styles.wrap_box_block}>
                          <div className={styles.wrap_box1_n1}>页面中的奖品仅为示例</div>
                          <Checkbox className={styles.wrap_box1_check} checked={!materialObjectBtnShow} onChange={tab3Change}>隐藏 [收货地址]</Checkbox>
                          {!materialObjectBtnShow ?
                            <div className={styles.wrap_box1_n3}>
                              <span>文案提示：</span>
                              <Input className={styles.wrap_box1_btn} value={materialObjectTxt} onChange={materialObjectTxtChange} maxLength="20"/>
                            </div> 
                          : null}
                        </div>
                      : null}
                    </div>
                  : null
              }
              <div className={styles.side_wrap_btn}><Button type="primary" onClick={saveActivityStyle}>保存</Button></div>
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
export default connect(({ visRule, loading }) => ({

}))(activityRule);
