import React, { useEffect, useState } from 'react';
import { InputNumber, Input, Button, Checkbox, Upload, message, Radio, Space } from 'antd';
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
    color1: "#FCFCFC",   //按钮背景色
    // color2: '#868686',  //倒计时
    color3: "#D8D8D8",  //提交按钮背景色
    color4: "#868686",  //提交按钮字体颜色
  });
  //提交按钮
  let [btnTxt, setBtnTxt] = useState("提交");  //按钮名称
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
    toFormData.countDownColor = indexColor.color2;
    dispatch({
      type: 'answerGame/newStyleSave',
      payload: {
        method: 'postJSON',
        params: {
          styleCode: 'answerHome',
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
    let toIndexColor = indexColor;
    toIndexColor.color1 = items.gameBackgroundColor ? items.gameBackgroundColor : '#FCFCFC';
    toIndexColor.color2 = items.countDownColor ? items.countDownColor : '#868686';
    toIndexColor.color3 = items.gameSubmitButtonBackgroundColor ? items.gameSubmitButtonBackgroundColor : '#D8D8D8';
    toIndexColor.color4 = items.gameSubmitButtonColor ? items.gameSubmitButtonColor : '#868686';
    setindexColor({ ...toIndexColor });
  }
  //样式数据
  let getStyleByActivityIdAndStyleCode = () => {
    dispatch({
      type: 'answerGame/getStyleByActivityIdAndStyleCode',
      payload: {
        method: 'get',
        params: {
          styleCode: 'answerHome',
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
      type: 'answerGame/queryGameAnswerData',
      payload: {
        method: 'get',
        params: {
          styleCode: 'answerHome',
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
      type: 'answerHome/queryGameAnswerConfig',
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
                  <div>
                    <div className={styles.answer_title}>1、{answerItem.name} {answerItem.choseType ==0?'（单选题）':'（多选题）'}</div>
                    {answerItem.choseType ==0 ?<Radio.Group className={styles.answer_select}>
                      <Space direction="vertical" size="middle">
                        {answerItem.itemList.map(item => {
                          return <Radio value={item.itemId}>{item.itemName}</Radio>
                        })}
                      </Space>
                    </Radio.Group>:null}
                   {answerItem.choseType ==1 ?<Checkbox.Group className={styles.answer_select}>
                      <Space direction="vertical" size="middle">
                        {answerItem.itemList.map(item => {
                          return <Checkbox value={item.itemId}>{item.itemName}</Checkbox>
                        })}
                      </Space>
                    </Checkbox.Group>:null}
                  </div>
                  <div className={styles.answer_btn_box}>
                    <span onClick={setTools.bind(this, 3)} className={styles.answer_btn} style={{background:`${indexColor.color3}`,color:`${indexColor.color4}`,border:'none'}}>{btnTxt}</span>
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
                </div>
                  : indexInt == 3 ?
                    <div className={styles.style_box_m4}>
                      <div className={styles.side_wrap2_li}>
                        <span className={styles.side_wrap2_span}>按钮文案：</span>
                        <span className={styles.side_wrap2_color}><Input maxLength={4} placeholder="提交" onChange={setbtnTxt}/></span>
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
export default connect(({ answerGame, loading, selectTheme }) => ({
  applyTheme: selectTheme.applyTheme
}))(activityPage);
