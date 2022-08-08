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
  let { dispatch, subimtData, adverData, onChangType, isDataStore, storeConfig, setIsDataStore, setIsDataTypes, showLayer, isDataChange, applyTheme } = props;
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
      getStageSActivityThree();
    }else{
      if (activityInfo && activityInfo.objectId && activityInfo.channelId) {
        getStageSActivityThree();
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
  let activityDetail = localStorage.getItem('activityDetail');   //是否详情禁用状态
  let activityDetails = activityDetail == '1' ? true : false;

  let [adverForm] = Form.useForm();
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  const [indexInt, setIndexInt] = useState(1); //活动首页对应状态 1：背景图 2参与按钮 3信息
  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#1890FF",   //按钮背景色
    color2: "#fff",  //按钮字体颜色
    color3: "#fff",  //周边字体颜色
    color5: "#ffffff",  //页面背景色
    color6: "rgba(0,0,0,.5)",  //周边背景色
    color7: "#868686",  //活动时间字体颜色
    color8: "rgba(0,0,0,.3)",  //活动时间背景色
  });
  let [imageUrl, setImageUrl] = useState("");  //首页背景
  let [isIcoShare, setIsIcoShare] = useState('');  //分享图标
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
  let handleChange = info => {
    if (info.file.status === 'done') {
      setImageUrl(info.file.response.items)
      onChangType(true);
    }
  };
  let [timeSwitch, setTimeSwitch] = useState(1);//活动时间
  // let [startTime, setStartTime] = useState("");//开始时间
  // let [endTime, setEndTime] = useState("");//结束时间
  let [isBackClore2, setIsBackClore2] = useState(false);//活动时间
  let onBackCloreChange2 = (value) => {
    setIsBackClore2(value)
  }
  let [activityTime, setActivityTime] = useState('活动时间');//活动时间输入
  let activityTimeChange = (value) => {
    setActivityTime(value.target.value);
    onChangType(true);
  }
  //提交
  let subInfo = () => {
    let toFormData = formData;
    toFormData.homeImag = imageUrl,
    toFormData.homeBackgroundColor = indexColor.color5,
    toFormData.homeButtonBackgroundColor = indexColor.color1,
    toFormData.homeButtonTypefaceColor = indexColor.color2,
    toFormData.homeFloatTypefaceColor = indexColor.color3,
    toFormData.homeFloatBackgroundColor = indexColor.color6,
    toFormData.activityTimeFontColor = indexColor.color7;
    toFormData.activityTimeBackgroundColor = isBackClore2 ? indexColor.color8 : null;
    toFormData.homeButtonContent = words,
    toFormData.activityTime = activityTime;
    dispatch({
      type: 'discountHome/newStyleSave',
      payload: {
        method: 'postJSON',
        params: {
          styleCode: 'discountHome',
          activityId: activityInfo.objectId,
          styleValue: JSON.stringify(toFormData)
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          window.activityData_materialApply = {...window.activityData_materialApply};
          window.activityData_materialApply.activityTime = toFormData.activityTime ? toFormData.activityTime : originTime;
          window.activityData_materialApply.homeButtonContent = toFormData.homeButtonContent;
          window.activityData_materialApply.buyPageButtonContent = toFormData.buyPageButtonContent;
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
  //剩余倒计时
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
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
  let [buyLimitNum, setBuyLimitNum] = useState(1);
  //数据获取
  let getStageSActivityThree = () => {
    dispatch({
      type: 'discountHome/getBuyCheaperPageStyle',
      payload: {
        method: 'get',
        params: {
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        getStyleByActivityIdAndStyleCode();
        if (res.result.code == "0") {
          let items = res.body;
          if(items.isEnterprise){
            queryEnterpriseLogo();
          }
          let isShare = items.isShare == 1 ? '1' : '';
          setIsIcoShare(isShare)
          setTimeSwitch(items.timeSwitch === 1 ? 1 : 0)
          setBuyLimitNum(items.count);
          originTime = items.startTime + '——' + items.endTime;
        } else {
          message.error(res.result.message);
        }
      }
    });
  };
  //样式数据
  let getStyleByActivityIdAndStyleCode = () => {
    dispatch({
      type: 'goldenEggsGame/getStyleByActivityIdAndStyleCode',
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
          window.activityData_materialApply.activityTime = items.activityTime ? items.activityTime : originTime;
          window.activityData_materialApply.homeButtonContent = items.homeButtonContent;
          window.activityData_materialApply.buyPageButtonContent = items.buyPageButtonContent;
          setActivityTime(items.activityTime ? items.activityTime : originTime);
          if(items){
            setFormData({ ...items });
            setImageUrl(items.homeImag);
            if(items.homeButtonContent){
              setWords(items.homeButtonContent);
            }
            let toSColor = indexColor;
            toSColor.color5 = items.homeBackgroundColor || '#ffffff';
            toSColor.color3 = items.homeFloatTypefaceColor || '#fff';
            toSColor.color2 = items.homeButtonTypefaceColor || '#fff';
            toSColor.color1 = items.homeButtonBackgroundColor || '#1890FF';
            toSColor.color6 = items.homeFloatBackgroundColor || 'rgba(0,0,0,.5)';
            toSColor.color7 = items.activityTimeFontColor || '#868686';
            toSColor.color8 = items.activityTimeBackgroundColor || 'rgba(0,0,0,.3)';
            setindexColor({ ...toSColor });
            if (items.activityTimeBackgroundColor) {
              setIsBackClore2(true)
            } else {
              setIsBackClore2(false)
            }
          }
        }
      }
    });
  }
  //按钮文案
  let [words,setWords]=useState("立即购买");
  let setBtnWords =(value)=>{
    setWords(value.target.value)
    onChangType(true);
  }
  useEffect(() => {
    if (isDataStore) {
      subInfo();
    }
  }, [isDataStore])


  useEffect(() => {
    
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
            <div style={{ marginLeft: '230px' }}>
              {
                indexInt === 1 ? '背景图' :
                  indexInt === 2 ? '参与按钮' :
                    indexInt === 4 ? '活动时间' :
                      '周边操作'
              }
            </div>
          </div>
        </h2>
        <div className={styles.wrap_prby}>
          <div className={styles.wrap_preview}>
            <div className={styles.phone_wrap}>
              <div className={styles.phone_img1}><img src={require('../../../../assets/activity/setpage_m1.png')}></img></div>
              <div className={styles.phone_img2}><LeftOutlined className={styles.phone_img2_1} /><span>{activityInfo.internalName}</span><EllipsisOutlined className={styles.phone_img2_2} /></div>
              <div className={styles.phone_img3}><img src={require('../../../../assets/activity/setpage_m2.png')}></img></div>
              {/* 活动首页 */}
              <div className={styles.index_wrap} style={{ background: `${indexColor.color5}` }}>
                <div className={styles.index_backgd} onClick={setTools.bind(this, 1)}><img src={imageUrl}></img></div>
                {logo ?
                <div className={styles.index_logo}><img src={logo} alt="" /></div>
                 : null}
                <div className={styles.index_info} onClick={setTools.bind(this, 3)}>
                  <span className={styles.info_rule} style={{ 'background': indexColor.color6,'color': indexColor.color3 }}>活动规则</span>
                  <span className={styles.info_record} style={{ 'background': indexColor.color6,'color': indexColor.color3 }}>购买记录</span>
                </div>
                {timeSwitch === 1 ?
                  <div className={styles.index_time} style={{ "color": indexColor.color7 }} onClick={setTools.bind(this, 4)}>
                    <div className={styles.time_wrap}>
                      {isBackClore2 ? <span style={{ "background": indexColor.color8 }}></span> : null}
                      <div>{activityTime}</div>
                    </div>
                    {/* <div>{startTime ? startTime : '活动开始时间'}——{endTime ? endTime : '活动结束时间'}</div> */}
                  </div>
                : null}
                {isIcoShare ? <div className={styles.index_share}><img src={require('../../../../assets/activity/setpage_m18.png')}></img></div> : null}
                <div className={styles.index_pos_bom}>
                  <div className={styles.index_button} onClick={setTools.bind(this, 2)}>
                    <span style={{ 'color': indexColor.color2, 'background': indexColor.color1 }}>{words}</span>
                  </div>
                  {buyLimitNum != null ? <div className={styles.index_limitNum}>
                    <div>
                      <span className={styles.limitNum_label}  style={{ 'color': indexColor.color1 }}>您有{buyLimitNum}次参与机会</span>
                      <span className={styles.limitNum_bg} style={{ 'background': indexColor.color2 }}></span>
                    </div>
                  </div> : null}
                </div>
              </div>
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
                          onChange={handleChange}
                          headers={headers}
                        >
                          <Button>上传图片</Button>
                        </Upload>
                      </div>

                      <p>建议尺寸：750px*1624px</p>
                    </div>
                    {/* <div className={styles.style_m1_img}><img src="" alt="默认图片"></img></div> */}
                  </div>
                  
                  <div className={styles.style_box_btn}><Button type="primary" onClick={subInfo}>保存</Button></div>
                </div>
              : indexInt == 2 ?
                <div className={styles.style_box_m2}>    {/* 参与按钮 */}
                  <div className={styles.style_box_main}>
                    <div><strong className={styles.style_box_strong}>购买按钮文案：</strong><span className={styles.style_box_span1}><Input value={words} onChange={setBtnWords} maxLength="30" /></span></div>
                    <div><strong className={styles.style_box_strong}>购买按钮颜色：</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color1} colorName='color1' setMColor={setMcolor} /></span></div>
                    <div><strong className={styles.style_box_strong}>字体颜色：</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color2} colorName='color2' setMColor={setMcolor} /></span></div>
                    
                  </div>
                  <div className={styles.style_box_btn}><Button type="primary" onClick={subInfo}>保存</Button></div>
                </div>
              : indexInt == 3 ?
                  <div className={styles.style_box_m2}>    {/* 周边操作 */}
                    <div className={styles.style_box_main}>
                      <div><strong className={styles.style_box_strong}>背景颜色：</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color6} colorName='color6' setMColor={setMcolor} /></span></div>
                      <div><strong className={styles.style_box_strong}>字体颜色：</strong><span className={styles.style_box_span}><SetColor colors={indexColor.color3} colorName='color3' setMColor={setMcolor} /></span></div>
                    </div>
                    <div className={styles.style_box_btn}><Button type="primary" onClick={subInfo}>保存</Button></div>
                  </div>
              // 活动时间
              : indexInt == 4 ?
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
export default connect(({ discountHome, loading, selectTheme }) => ({
  subimtData: discountHome.subimtData,
  adverData: discountHome.adverData,
  applyTheme: selectTheme.applyTheme
}))(activityPage);
