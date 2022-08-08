import React, { useEffect, useState } from 'react';
import { InputNumber, Input, Button, Checkbox, Upload, message, Radio, Space, Rate } from 'antd';
const { TextArea } = Input;
import { connect, history } from 'umi';
import { uploadIcon } from '@/services/activity.js';
import styles from './style.less';
import SetColor from '../setColor';   //选择颜色组件
import { UploadOutlined, LeftOutlined, EllipsisOutlined } from '@ant-design/icons';
import LayerModal from '../layerModal';   //取消、上一步弹窗

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
  let [themeId ,setThemeId] = useState(null);//应用主题Id
  useEffect(()=>{
    setThemeId(applyTheme);
  },[applyTheme])
  useEffect(()=>{
    if(themeId){
      getMaterialDetails(themeId);
    }else{
      getStyleByActivityIdAndStyleCode();
    }
  },[themeId])
  // 获取素材数据
  let getMaterialDetails = (themeId)=>{
    dispatch({
      type: 'selectTheme/getMaterialDetails',
      payload: {
        method: 'get',
        params: {
          materialId: themeId,
          styleCode: 'answerPage_material'
        }
      },
      callback: (res) => {
        if(res.result.code === '0') {
          let items = JSON.parse(res.body.styleValue);
          dealWithStyle(items);
        }else{
          message.error(res.result.message)
        }
      }
    })
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
  let activityDetail = localStorage.getItem('activityDetail');   //是否详情禁用状态
  let activityDetails = activityDetail == '1' ? true : false;
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  const [indexInt, setIndexInt] = useState(1); //活动首页对应状态 1：背景图 2参与按钮 3信息

  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#9D9D9D",   //背景色
    // color2: '#868686',  //倒计时
    color3: "#D8D8D8",  //提交按钮背景色
    color4: "#868686",  //提交按钮字体颜色
  });
  //提交按钮
  let [btnTxt, setBtnTxt] = useState("提交问卷");  //按钮名称
  let setbtnTxt = (value) => {
    setBtnTxt(value.target.value)
    onChangType(true);
  }
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
  //  上传图
  let [imageUrl, setImageUrl] = useState("");  //首页背景
  let [answerItem, setAnswerItem] = useState({}); //查询题目
  
  let beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传JPG/PNG 格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('图片大小不能高于 5MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  let handleChange = (info, name) => {
    onChangType(true);
    if (info.file.status === 'done') {
      if (name == 'back') {
        setImageUrl(info.file.response.items)
      } else if (name == 'rocker') {
        setRockerUrl(info.file.response.items)
      } else if (name == 'clip') {
        setClipUrl(info.file.response.items)
      }

      onChangType(true);
    }
  };

  //提交 
  let subInfo = () => {
    let toFormData = formData;
    toFormData.gameBackgroundImage = imageUrl;
    toFormData.gameBackgroundColor = indexColor.color1;
    toFormData.gameSubmitButtonBackgroundColor = indexColor.color3;
    toFormData.gameSubmitButtonColor = indexColor.color4;
    toFormData.gameSubmitButtonTxt = btnTxt;
    dispatch({
      type: 'questionnaireGame/newStyleSave',
      payload: {
        method: 'postJSON',
        params: {
          styleCode: 'questionnaireHome',
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
          message.error(res.result.message);
        }
      }
    });
  };

  useEffect(() => {
    if (activityInfo && activityInfo.objectId && activityInfo.channelId) {
      getStyleByActivityIdAndStyleCode();
      queryGameAnswerData();
      getAnswerConfig();
    }
  }, []);

  useEffect(() => {
    if (isDataStore) {
      subInfo()
    }

  }, [isDataStore]);
  let dealWithStyle = (items) => {
    setFormData({ ...items });
    setImageUrl(items.gameBackgroundImage ? items.gameBackgroundImage : '');
    setBtnTxt(items.gameSubmitButtonTxt ? items.gameSubmitButtonTxt : '提交问卷');
    let toIndexColor = indexColor;
    toIndexColor.color1 = items.gameBackgroundColor ? items.gameBackgroundColor : '#9D9D9D';
    toIndexColor.color3 = items.gameSubmitButtonBackgroundColor ? items.gameSubmitButtonBackgroundColor : '#D8D8D8';
    toIndexColor.color4 = items.gameSubmitButtonColor ? items.gameSubmitButtonColor : '#868686';
    setindexColor({ ...toIndexColor });
  }
  //样式数据
  let getStyleByActivityIdAndStyleCode = () => {
    dispatch({
      type: 'questionnaireGame/getStyleByActivityIdAndStyleCode',
      payload: {
        method: 'get',
        params: {
          styleCode: 'questionnaireHome',
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          if (res.body && res.body.styleValue) {
            let items = JSON.parse(res.body.styleValue);
            if(applyTheme){
              getMaterialDetails(applyTheme);
            }else{
              dealWithStyle(items);
            }
          }
        }
      }
    });
  }
  // 查询答题题目
  let queryGameAnswerData = () => {
    dispatch({
      type: 'questionnaireGame/queryGameAnswerData',
      payload: {
        method: 'get',
        params: {
          styleCode: 'questionnaireHome',
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if(res.result.code === '0') {
          setAnswerItem(res.body[0]?res.body[0]:{})
        }else{
          message.error(res.result.message);
        }
      }
    })
  }
  let [answerTitle,setAnswerTitle] = useState('')
  let getAnswerConfig = () => {
    dispatch({
      type: 'questionnaireHome/queryGameAnswerConfig',
      payload: {
        method: 'get',
        params: {
          activityId: activityInfo.objectId,
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let items = res.body;
          setAnswerTitle(items.title)
        } else {
          message.info(res.result.message)
        }
      }
    })
  }
  return (
    <div>
      <LayerModal iscancal={isCancelModal} onClickCancel={onClickCancel} isstopback={isStepBack} isstepint={isStepInt} />
      {/* 预览、编辑 */}
      <div className={`${styles.by_main} ${activityDetails ? styles.by_delmain : ''}`}>
        {/* 预览-首页 */}
        <h2 className={styles.wrap_titles}>
          <div className={styles.wrap_title_h2}>
            <em>预览</em>
            {/* <div className={styles.index_adver}><span onClick={setTools.bind(this, 2)}>更换皮肤</span></div> */}
            <div style={{ marginLeft: '359px' }}>
              {
                indexInt === 1 ? '背景图' :
                  // indexInt === 2 ? '更换皮肤' :
                    indexInt === 3 ? '提交按钮' :
                      // indexInt === 4 ? '倒计时样式' :
                      //   indexInt === 5 ? '按钮-摇杆' :
                      //     indexInt === 6 ? '按钮-夹' :
                            '其它'
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
              <div className={styles.index_wrap} style={{ backgroundColor: `${indexColor.color1}`, backgroundImage: `url(${imageUrl})` }}>
                <div className={styles.index_backgd} onClick={setTools.bind(this, 1)} ></div>
                <div className={styles.answer_box}>
                  <div className={styles.answer_tip}>{answerTitle}</div>
                  <div className={styles.content_box}>
                    <div className={styles.question_wrap}>
                      <div className={styles.question}>
                        <div className={styles.label}>01 是否喜欢运动？<span className={styles.star}> *</span></div>
                        <Radio.Group className={styles.selection_wrap} value={1}>
                          <Radio value={1}>选中项</Radio>
                          <Radio value={2}>未选中项</Radio>
                        </Radio.Group>
                      </div>
                      <div className={styles.question}>
                        <div className={styles.label}>02 下列运动中，您喜欢哪些运动？<span className={styles.star}> *</span></div>
                        <Checkbox.Group className={styles.selection_wrap} value={[1,2]}>
                          <Checkbox value={1}>选中项</Checkbox>
                          <Checkbox value={2}>选中项</Checkbox>
                          <Checkbox value={3}>未选中项</Checkbox>
                          <Checkbox value={4}>未选中项</Checkbox>
                        </Checkbox.Group>
                      </div>
                      <div className={styles.question}>
                        <div className={styles.label}>03 请描述下你印象最深刻的事情<span className={styles.star}> *</span></div>
                        <TextArea style={{marginLeft: '20px',width: 280,marginBottom: '10px'}} placeholder='请输入' autoSize={{ minRows: 3, maxRows: 5 }} disabled/>
                      </div>
                      <div className={styles.question}>
                        <div className={styles.label}>04 请给xx服务打分<span className={styles.star}> *</span></div>
                        <Rate style={{marginLeft: '20px',color: '#0091FF',marginBottom: '10px'}} disabled defaultValue={4} />
                      </div>
                    </div>
                    <div className={styles.answer_btn_box} onClick={setTools.bind(this, 3)}>
                      <span className={styles.answer_btn} style={{background:`${indexColor.color3}`,color:`${indexColor.color4}`}}>{btnTxt}</span>
                    </div>
                  </div>
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
                    <span className={styles.side_wrap2_color}><SetColor colors={indexColor.color1} colorName='color1' setMColor={setMcolor} /></span>
                  </div>
                </div>
                  : indexInt == 3 ?
                    <div className={styles.style_box_m4}>
                      <div className={styles.side_wrap2_li}>
                        <span className={styles.side_wrap2_span}>按钮文案：</span>
                        <span className={styles.side_wrap2_color}><Input maxLength={4} value={btnTxt} onChange={setbtnTxt}/></span>
                      </div>
                      <div className={styles.side_wrap2_li}>
                        <span className={styles.side_wrap2_span}>背景颜色：</span>
                        <span className={styles.side_wrap2_color}><SetColor colors={indexColor.color3} colorName='color3' setMColor={setMcolor} /></span>
                      </div>
                      <div className={styles.side_wrap2_li}>
                        <span className={styles.side_wrap2_span}>字体颜色：</span>
                        <span className={styles.side_wrap2_color}><SetColor colors={indexColor.color4} colorName='color4' setMColor={setMcolor} /></span>
                      </div>
                    </div>
                          : null}
              <div className={styles.style_box_btn}><Button type="primary" onClick={() => { subInfo() }}>保存</Button></div>
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
export default connect(({ questionnaireGame, loading, selectTheme }) => ({
  applyTheme: selectTheme.applyTheme
}))(activityPage);
