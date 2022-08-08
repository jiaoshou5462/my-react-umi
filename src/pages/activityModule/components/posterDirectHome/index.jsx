import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, Carousel, Upload, message, Select, Radio, Row, Col, Switch } from 'antd';
import { connect, history } from 'umi';
import { uploadIcon } from '@/services/activity.js';
import styles from './style.less';
import SetColor from '../setColor';   //选择颜色组件
import { UploadOutlined, InboxOutlined, PlusOutlined, LeftOutlined, EllipsisOutlined, NotificationOutlined } from '@ant-design/icons';
import LayerModal from '../layerModal';   //取消、上一步弹窗

let originTime = "";
const activityPage = (props) => {
  let { dispatch, subimtData, adverData, onChangType, isDataStore, storeConfig, setIsDataStore, setIsDataTypes, showLayer, isDataChange } = props;
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
    let temp = adverForm.getFieldsValue();
    let homeAd = temp.homeAd ? temp.homeAd.filter((item, i) => item.adImg = item.adImg ? adverImg[i] : '') : [];
    if(homeAd.length < 1 && banChecked){
      setIsDataStore(false);
      setIsDataTypes(false);
      message.error('广告至少上传一个！');
      return
    }
    if (isDataChange) {
      showLayer(2)
    } else {
      history.push("/activityConfig/activityList/activityModule/finish");
    }
  }
  let activityDetail = localStorage.getItem('activityDetail');   //是否详情禁用状态
  let activityDetails = activityDetail == '1' ? true : false;

  let [adverForm] = Form.useForm();
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  const [indexInt, setIndexInt] = useState(1); //活动首页对应状态 1：背景图 2参与按钮 3信息
  let [banChecked, setBanChecked] = useState(false);  //广告位
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#D8D8D8",   //按钮背景色
    color2: "#868686",  //按钮字体颜色
    color3: "#D8D8D8",  //周边字体颜色
    color5: "#ffffff",  //页面背景色
    color6: "rgba(0,0,0,.3)",  //周边背景色
    color7: "#868686",  //活动时间字体颜色
    color8: "rgba(0,0,0,.3)",  //活动时间背景色
  });
  let [imageUrl, setImageUrl] = useState("");  //首页背景
  let [isIcoShare, setIsIcoShare] = useState('');  //分享图标
  //广告位显示切换
  let adverChang = (e) => {
    let value = e.target.checked
    setBanChecked(value)
    if (!value) {
      adverSubmit({}, true)
    }
    onChangType(true);
  };
  //首页切换工具栏
  let setTools = (i) => {
    setIndexInt(i)
  };
  //颜色切换
  let setMcolor = (n, i) => {
    let toMcolors = { ...indexColor };
    toMcolors[n] = i;
    setindexColor(toMcolors);
    onChangType(true);
  }
  //  上传背景图
  let beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error('请上传JPG/PNG/GIF 格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('图片大小不能高于 5MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  let handleChange = (info, name) => {
    if (info.file.status === 'done') {
      setImageUrl(info.file.response.items)
      onChangType(true);
    }
  };
  //首页广告图片上传
  let [adverImg, setAdverImg] = useState([]);
  let adverUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传JPG/PNG 格式图片!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能高于 5MB!');
    }
    return isJpgOrPng && isLt5M;
  }
  let adverChange = (i, info) => {
    let toImgArr = [...adverImg];
    toImgArr[i] = info.file.response ? info.file.response.items : "";
    setAdverImg(toImgArr);
    onChangType(true);
  };
  let subInfo = (notCheck) => {
    if(!btnTxt){
      message.error('开始按钮文案不能为空');
      return
    }
    let temp = adverForm.getFieldsValue();
    let homeAd = temp.homeAd ? temp.homeAd.filter((item, i) => item.adImg = item.adImg ? adverImg[i] : '') : [];
    let toFormData = formData;
    toFormData.homeBackgroundImage = imageUrl;
    toFormData.homeBelowBackgroundColor = indexColor.color5;
    toFormData.homeParticipateButtonBackgroundColor = indexColor.color1;
    toFormData.homeParticipateButtonFontColor = indexColor.color2;
    toFormData.homePeripheralOperationColor = indexColor.color3;
    toFormData.homePeripheralOperationBackgroundColor = isBackClore ? indexColor.color6 : '';
    toFormData.activityTimeFontColor = indexColor.color7;
    toFormData.activityTimeBackgroundColor = isBackClore2 ? indexColor.color8 : null;
    toFormData.homeParticipateButtonTxt = btnTxt ? btnTxt : "获取我的海报";
    toFormData.turntableAdTitleFontColor = "#fff";
    toFormData.homeAd = homeAd;
    toFormData.isHomeAdPreviewShow = notCheck ? 0 : banChecked ? 1 : 0;
    toFormData.homeAdTitleName = adverTitName;
    toFormData.homeAdStyle = parseInt(temp.homeAdStyle);
    toFormData.homeAdIsShow = parseInt(temp.isShow);
    toFormData.activityTime = activityTime;
    dispatch({
      type: 'posterDirectHome/newStyleSave',
      payload: {
        method: 'postJSON',
        params: {
          styleCode: 'posterDirectHome',
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
  //首页广告保存
  let adverSubmit = (value, notCheck) => {
    let temp = adverForm.getFieldsValue();
    let homeAd = temp.homeAd ? temp.homeAd.filter((item, i) => item.adImg = item.adImg ? adverImg[i] : '') : [];
    if(homeAd.length < 1 && !notCheck){
      setIsDataStore(false);
      setIsDataTypes(false);
      message.error('广告至少上传一个！');
      return
    }
    subInfo(notCheck);
  };
  //广告标题
  let [adverIsTit, changeAdverIsTit] = useState(1);
  let [adverTitName, changeAdverTitName] = useState("");
  let setAdverIsTit = (e) => {
    changeAdverIsTit(e.target.value)
    onChangType(true);
  }
  let setAdverTitName = (e) => {
    changeAdverTitName(e.target.value)
  }
  let removeAdver = (value) => {
    let toImgArr = [...adverImg];
    toImgArr.splice(value, 1);
    setAdverImg(toImgArr);
  }
  //参与按钮
  let [btnTxt, setBtnTxt] = useState("获取我的海报");  //按钮名称
  let setbtnTxt = (value) => {
    setBtnTxt(value.target.value)
    onChangType(true);
  }
  //剩余倒计时
  let [timeNum, setTimeNum] = useState('');
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  //个位补0
  let Appendzero = (obj) => {
    if (obj < 10) return "0" + obj; else return obj;
  }
  let setMoment = (value) => {
    let SysSecond = parseInt(value / 1000);
    var second = Appendzero(Math.floor(SysSecond % 60));            // 计算秒
    var minite = Appendzero(Math.floor((SysSecond / 60) % 60));      //计算分
    var hour = Appendzero(Math.floor((SysSecond / 3600)));      //计算小时
    let endTime = hour + '小时' + minite + '分钟' + second + "秒";
    return endTime;
  }
  let [winBroadcastSwitch, setWinBroadcastSwitch] = useState(1);//广播
  let [countdownSwitch, setCountdownSwitch] = useState(1);//倒计时
  let [timeSwitch, setTimeSwitch] = useState(1);//活动时间
  // let [startTime, setStartTime] = useState("");//开始时间
  // let [endTime, setEndTime] = useState("");//结束时间
  //是否需透明底
  let [isBackClore, setIsBackClore] = useState(false);//规则 记录
  let onBackCloreChange = (value) => {
    setIsBackClore(value)
  }
  let [isBackClore2, setIsBackClore2] = useState(false);//活动时间
  let onBackCloreChange2 = (value) => {
    setIsBackClore2(value)
  }
  let [activityTime, setActivityTime] = useState('活动时间');//活动时间输入
  let activityTimeChange = (value) => {
    setActivityTime(value.target.value);
    onChangType(true);
  }
  //样式数据
  let getStyleByActivityIdAndStyleCode = () => {
    dispatch({
      type: 'posterDirectHome/getStyleByActivityIdAndStyleCode',
      payload: {
        method: 'get',
        params: {
          styleCode: 'posterDirectHome',
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let items = res.body && res.body.styleValue && JSON.parse(res.body.styleValue);
          setActivityTime(items.activityTime ? items.activityTime : originTime);
          if (items) {
            setFormData({ ...items });
            setImageUrl(items.homeBackgroundImage);
            let toSColor = indexColor;
            toSColor.color5 = items.homeBelowBackgroundColor || '#ffffff';
            toSColor.color3 = items.homePeripheralOperationColor || '#D8D8D8';
            toSColor.color2 = items.homeParticipateButtonFontColor || '#868686';
            toSColor.color1 = items.homeParticipateButtonBackgroundColor || '#D8D8D8';
            toSColor.color6 = items.homePeripheralOperationBackgroundColor || 'rgba(0,0,0,.3)';
            toSColor.color7 = items.activityTimeFontColor || '#868686';
            toSColor.color8 = items.activityTimeBackgroundColor || 'rgba(0,0,0,.3)';
            if (items.homePeripheralOperationBackgroundColor) {
              setIsBackClore(true)
            } else {
              setIsBackClore(false)
            }
            if (items.activityTimeBackgroundColor) {
              setIsBackClore2(true)
            } else {
              setIsBackClore2(false)
            }
            changeAdverType(items.homeAdStyle ? items.homeAdStyle : 1);
            setindexColor({ ...toSColor });
            setBtnTxt(items.homeParticipateButtonTxt);
            changeAdverTitName(items.homeAdTitleName);
            adverForm.setFieldsValue({
              homeAdTitleName: items.homeAdTitleName,
              homeAd: items.homeAd,
              homeAdStyle: items.homeAdStyle ? items.homeAdStyle : 1,
              isShow: items.homeAdIsShow ? items.homeAdIsShow : 0
            })
            setBanChecked(items.isHomeAdPreviewShow === 1 ? true : false)
            changeAdverIsTit(items.homeAdIsShow ? items.homeAdIsShow : 0)
            let toadverImg = [];
            if (items.homeAd && items.homeAd.length > 0) {
              items.homeAd.map((n) => {
                toadverImg.push(n.adImg ? n.adImg : '');
              })
            }
            setAdverImg([...toadverImg]);
            
          }else{
            setActivityTime(originTime);
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
  //数据获取
  let getStageSActivityThree = () => {
    dispatch({
      type: 'posterDirectHome/backStageSActivityThree',
      payload: {
        method: 'postJSON',
        params: {
          channelId: activityInfo.channelId,
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let items = res.body;
          if(items.isEnterprise){
            queryEnterpriseLogo();
          }
          let isShare = items.isShare == 1 ? '1' : '';
          setIsIcoShare(isShare);
          let timestamp = (new Date()).getTime();
          let toStamp = timestamp > new Date(items.startTime).getTime() ? 0 : new Date(items.startTime).getTime() - timestamp;
          toStamp = toStamp == 0 ? 0 : setMoment(toStamp);
          setTimeNum(toStamp);
          setWinBroadcastSwitch(items.winBroadcastSwitch === 1 ? 1 : 0);
          setCountdownSwitch(items.countdownSwitch === 1 ? 1 : 0);
          setTimeSwitch(items.timeSwitch === 1 ? 1 : 0)
          // setStartTime(items.startTime)
          // setEndTime(items.endTime)
          originTime = items.startTime + '——' + items.endTime;
        } else {
          message.error(res.result.message);
        }
      }
    });
  };
  let [homeAdStyle, changeAdverType] = useState(1);
  let setAdverType = (e) => {
    changeAdverType(e.target.value)
    onChangType(true);
  }
  useEffect(() => {
    if (isDataStore) {
      if (banChecked) {   //广告位是否显示
        adverSubmit(adverForm.getFieldsValue())
      } else {
        subInfo();
      }
    }
  }, [subimtData, adverData, indexInt, isDataStore])

  useEffect(() => {
    adverForm.setFieldsValue({   //首页广告表单
      isShow: 1,
      homeAd: [{}],
      homeAdStyle: 1
    });
    if (activityInfo && activityInfo.objectId && activityInfo.channelId) {
      getStageSActivityThree();
      getStyleByActivityIdAndStyleCode();
    }
  }, []);
  return (
    <div>
      <LayerModal iscancal={isCancelModal} onClickCancel={onClickCancel} isstopback={isStepBack} isstepint={isStepInt} />
      {/* 预览、编辑 */}
      <div className={`${styles.by_main} ${activityDetails ? styles.by_delmain : ''}`}>
        {/* 预览-首页 */}
        <h2 className={styles.wrap_titles}>
          <div className={styles.wrap_title_h2}>
            <em>预览</em>
            <div className={styles.index_adver}><Checkbox onChange={adverChang} checked={banChecked}>广告位</Checkbox></div>
            <div style={{ marginLeft: '265px' }}>
              {
                indexInt === 1 ? '背景图' :
                  indexInt === 2 ? '开始文案' :
                    indexInt === 3 ? '周边操作' :
                      indexInt === 5 ? '活动时间' :
                      '广告位'
              }
            </div>
          </div>
        </h2>
        <div className={styles.wrap_prby}>
          <div className={styles.wrap_preview}>
            <div className={styles.phone_wrap}>
              <div className={styles.phone_img1}><img src={require('../../../../assets/activity/setpage_m1.png')}></img></div>
              <div className={styles.phone_img2}><LeftOutlined className={styles.phone_img2_1} /><span>{activityInfo.internalName}</span><EllipsisOutlined className={styles.phone_img2_2} /></div>
              {/* 活动首页 */}
              <div className={styles.index_wrap} style={{ backgroundColor: `${indexColor.color5}`, backgroundImage: `url(${imageUrl})` }}>
                {/* 中奖广播条 */}
                {winBroadcastSwitch === 1 ? <div className={styles.index_broadcast}><NotificationOutlined /><em>185****1231刚刚获得了20元打车券</em></div> : null}
                <div className={styles.index_backgd} onClick={setTools.bind(this, 1)}></div>
                {logo ?
                <div className={styles.index_logo} style={winBroadcastSwitch === 1 ? null : {top: "20px"}}><img src={logo} alt="" /></div>
                 : null}
                {timeSwitch === 1 ?
                <div className={styles.index_time} style={{ "color": indexColor.color7 }} onClick={setTools.bind(this, 10)}>
                  <div className={styles.time_wrap}>
                    {isBackClore2 ? <span style={{ "background": indexColor.color8 }}></span> : null}
                    <div>{activityTime}</div>
                  </div>
                  {/* <div>{startTime ? startTime : '活动开始时间'}——{endTime ? endTime : '活动结束时间'}</div> */}
                </div>
                : null}
                {/* {countdownSwitch === 1 ?
                  <h3 className={styles.index_title}>活动{timeNum ? timeNum : '00:00:00'}后开始</h3>
                  : null} */}
                {isIcoShare ? <div className={styles.index_share}><img src={require('../../../../assets/activity/setpage_m18.png')}></img></div> : null}
                <div className={styles.index_pos_bom}>
                  <div className={styles.index_button} onClick={setTools.bind(this, 2)}>
                    {countdownSwitch == 1 && timeNum ?
                    <span className={styles.button_countdown} style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>距离活动开始还剩余{timeNum}</span>
                    :<span style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>{btnTxt ? btnTxt : '获取我的海报'}</span>}
                  </div>
                  <div className={styles.index_info} onClick={setTools.bind(this, 3)} style={{ 'color': indexColor.color3 }}>
                    {isBackClore ? <span style={{ 'background': indexColor.color6 }}></span> : null}
                    <i>活动规则  |  中奖记录</i>
                  </div>
                  {banChecked ? <div className={styles.box_wrapper}>
                    <div className={styles.index_poster} onClick={setTools.bind(this, 4)} style={{ backgroundColor: homeAdStyle == 1 ? 'rgba(0, 0, 0, 0.37)' : homeAdStyle == 2 ? '#0023EE' : homeAdStyle == 3 ? '#E53423' : homeAdStyle == 4 ? '#790000' : 'none' }}>
                      {adverIsTit == 1 ?
                        <h4 style={{ 'color': "#fff" }}>{adverTitName ? adverTitName : '广告标题'}</h4>
                        : null}
                      <Carousel>
                        {adverImg.length > 0 ?
                          adverImg.map((item, key) => {
                            return <div className={styles.indec_poster_banner} key={key}><img src={item}></img></div>
                          })
                          : <div className={styles.indec_poster_banner}><h3>广告</h3></div>
                        }
                      </Carousel>
                    </div>
                  </div> : null}
                </div>
              </div>
              <div className={styles.phone_img3}><img src={require('../../../../assets/activity/setpage_m2.png')}></img></div>
            </div>
          </div>
          {/* 编辑 */}
          <div className={styles.side_style}>
            <div className={styles.style_box}>
              {/* 背景图 */}
              {indexInt == 1 ?
                <div className={styles.style_box_m1}>
                  <div className={styles.side_wrap2_li}>
                    <span className={styles.side_wrap2_span}>背景图下方底色：</span>
                    <span className={styles.side_wrap2_color}><SetColor colors={indexColor.color5} colorName='color5' setMColor={setMcolor} /></span>
                  </div>
                  <p style={{ color: 'rgba(0, 0, 0, 0.25)' }}>背景图无法完全覆盖屏幕时，会显示此底色</p>
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
                          onChange={(e) => { handleChange(e, 'back') }}
                          headers={headers}
                        >
                          <Button>上传图片</Button>
                        </Upload>
                      </div>

                      <p>建议尺寸：750px*1624px</p>
                    </div>
                  </div>
                  
                  <div className={styles.style_box_btn}><Button type="primary" onClick={()=>{subInfo()}}>保存</Button></div>
                </div>
                : indexInt == 2 ?
                  <div className={styles.style_box_m2}>    {/* 参与按钮 */}
                    <div className={styles.style_box_main}>
                      <div className={styles.style_box_btns}><strong className={styles.style_box_strong}>开始文案</strong>
                        <Input className={styles.style_box_btn_pn} value={btnTxt} onChange={setbtnTxt} maxLength="6" placeholder="获取我的海报" />
                      </div>
                      <div><strong className={styles.style_box_strong}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color2} colorName='color2' setMColor={setMcolor} /></span></div>
                      <div><strong className={styles.style_box_strong}>背景颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color1} colorName='color1' setMColor={setMcolor} /></span></div>
                    </div>
                    <div className={styles.style_box_btn}><Button type="primary" onClick={()=>{subInfo()}}>保存</Button></div>
                  </div>
                  : indexInt == 3 ?
                    <div className={styles.style_box_m2}>    {/* 周边操作 */}
                      <div className={styles.style_box_main}>
                        <div><strong className={styles.style_box_strong}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color3} colorName='color3' setMColor={setMcolor} /></span></div>
                        <div><strong className={styles.style_box_strong}>是否需透明底</strong>
                          <Switch className={styles.style_box_switch} checkedChildren="开" unCheckedChildren="关" checked={isBackClore} onChange={onBackCloreChange} />
                        </div>
                        {isBackClore ? <div><strong className={styles.style_box_strong}>背景颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color6} colorName='color6' setMColor={setMcolor} /></span></div> : null}

                      </div>
                      <div className={styles.style_box_btn}><Button type="primary" onClick={()=>{subInfo()}}>保存</Button></div>
                    </div>
                    // 活动时间
                    : indexInt == 10 ?
                    <div className={styles.style_box_m2}>
                      <div className={styles.style_box_main}>
                        <div>
                          <strong className={styles.style_box_strong}>活动时间</strong>
                          <Input className={styles.style_box_btn_pn} value={activityTime} onChange={activityTimeChange} />
                        </div>
                        <div><strong className={styles.style_box_strong}>字体颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color7} colorName='color7' setMColor={setMcolor} /></span></div>
                        <div><strong className={styles.style_box_strong}>是否需透明底</strong>
                          <Switch className={styles.style_box_switch} checkedChildren="开" unCheckedChildren="关" checked={isBackClore2} onChange={onBackCloreChange2} />
                        </div>
                        {isBackClore2 ? <div><strong className={styles.style_box_strong}>背景颜色</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color8} colorName='color8' setMColor={setMcolor} /></span></div> : null}

                      </div>
                      <div className={styles.style_box_btn}><Button type="primary" onClick={() => { subInfo() }}>保存</Button></div>
                    </div>
                  : null}
              <div className={styles.style_box_m3} style={{ display: indexInt == 4 ? 'block' : 'none' }}>    {/* 广告 */}
                <div className={styles.style_box_main}>
                  <Form form={adverForm} onFinish={adverSubmit} labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
                    <div className={styles.style_box3_top}>
                      <Form.Item name="isShow" label="标题：" onChange={setAdverIsTit}>
                        <Radio.Group>
                          <Radio value={1}>显示</Radio>
                          <Radio value={0}>隐藏</Radio>
                        </Radio.Group>
                      </Form.Item>
                      {adverIsTit == 1 ?           
                        <Form.Item name="homeAdTitleName" label="标题名称：" rules={[{ required: true, message: "请输入标题" }]}>
                          <Input onChange={setAdverTitName} />
                        </Form.Item>
                      : null}
                      <Form.Item name="homeAdStyle" label="样式：" onChange={setAdverType} rules={[{ required: true, message: "请选择样式" }]}>
                        <Radio.Group className={styles.side_adver_list}>
                          <Radio value={1} className={styles.side_wrap3_li}>样式1
                            <div className={`${styles.side_adver_liimg} ${styles.side_adver_liimg1}`}>
                              <div><h5>标题名称</h5>
                                <p></p></div>
                            </div>
                          </Radio>
                          <Radio value={2} className={styles.side_wrap3_li}>样式2
                            <div className={`${styles.side_adver_liimg} ${styles.side_adver_liimg2}`}>
                              <div><h5>标题名称</h5>
                                <p></p></div>
                            </div>
                          </Radio>
                          <Radio value={3} className={styles.side_wrap3_li}>样式3
                            <div className={`${styles.side_adver_liimg} ${styles.side_adver_liimg3}`}>
                              <div><h5>标题名称</h5>
                                <p></p></div>
                            </div>
                          </Radio>
                          <Radio value={4} className={styles.side_wrap3_li}>样式4
                            <div className={`${styles.side_adver_liimg} ${styles.side_adver_liimg4}`}>
                              <div> <h5>标题名称</h5>
                                <p></p></div>
                            </div>
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                    <div className={styles.style_box3_list}> {/* 广告动态栏 */}
                      <Form.List name="homeAd">
                        {(fields, { add, remove }) => {
                          return (
                            <div>
                              {fields.map((field, index) => (
                                <div className={styles.style_box3_li} key={index} >
                                  <Form.Item name={[field.name, 'adImg']} label="广告图：" extra="建议尺寸：686px*220px" rules={[{ required: true, message: "请上传广告图" }]}>
                                    <Upload
                                      name="files"
                                      listType="picture"
                                      showUploadList={false}
                                      action={uploadIcon}
                                      beforeUpload={adverUpload.b}
                                      onChange={adverChange.bind(this, index)}
                                      headers={headers}
                                    >
                                      <Button icon={<UploadOutlined />}>上传图片</Button>
                                    </Upload>
                                  </Form.Item>
                                  <div className={styles.style_box3_li_img}>
                                    <img src={adverImg[index]}></img>
                                  </div>
                                  <Form.Item name={[field.name, 'adJumpType']} label="跳转类型：" rules={[{ required: true, message: '请选择跳转类型' }]}>
                                    <Select placeholder="请选择">
                                      <Option value={0}>外部链接</Option>
                                    </Select>
                                  </Form.Item>
                                  <Form.Item name={[field.name, 'adContent']} label="链接：" rules={[{ required: true, message: '请输入链接' }]}>
                                    <Input />
                                  </Form.Item>
                                  <span className={styles.adver_remove} onClick={() => { remove(field.name); removeAdver(field.name); }}>删除</span>
                                </div>
                              ))}
                              <Form.Item className={styles.adver_addbtn}>
                                <Button onClick={(value) => { if (fields.length < 5) { add() } }} icon={<PlusOutlined />}>新增广告图（至多五个）</Button>
                              </Form.Item>
                            </div>
                          );
                        }}
                      </Form.List>
                    </div>
                    <div className={styles.style_box_btn}><Button type="primary" htmlType="submit">保存</Button></div>
                  </Form>
                </div>
              </div>
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
export default connect(({ posterDirectHome, loading }) => ({
  subimtData: posterDirectHome.subimtData,
  adverData: posterDirectHome.adverData,

}))(activityPage);
