import React, { useEffect, useState } from 'react';
import { InputNumber, Input, Button, Checkbox, Upload, message, Radio } from 'antd';
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
  let activityDetail = localStorage.getItem('activityDetail');   //是否详情禁用状态
  let activityDetails = activityDetail == '1' ? true : false;
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  const [indexInt, setIndexInt] = useState(1); //活动首页对应状态 1：背景图 2参与按钮 3信息

  let [indexColor, setindexColor] = useState({  //参与按钮及信息颜色配置
    color1: "#FCFCFC",   //按钮背景色
    color2: '#868686',  //倒计时
  });
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
  let [rockerUrl, setRockerUrl] = useState("");  //摇杆
  let [clipUrl, setClipUrl] = useState("");  //夹-按钮
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

  //橱窗图片合集
  let [showCaseArr, setShowCaseArr] = useState([
    {
      title: '橱窗背景图',
      remarks: "橱窗背景",
      proposal: "建议尺寸：750px*951px"
    },
    {
      title: '礼物堆叠图',
      remarks: "礼物堆叠",
      proposal: "建议尺寸：670px*328px"
    },
    {
      title: '礼物图1',
      remarks: "礼物图",
      proposal: "建议尺寸：200px*200px"
    },
    {
      title: '礼物图2',
      remarks: "礼物图",
      proposal: "建议尺寸：200px*200px"
    }, {
      title: '礼物图3',
      remarks: "礼物图",
      proposal: "建议尺寸：200px*200px"
    }
    , {
      title: '抓钩-开：',
      remarks: "抓钩图",
      proposal: "建议尺寸：236px*736px"
    }
    , {
      title: '抓钩-关',
      remarks: "抓钩图",
      proposal: "建议尺寸：236px*736px"
    }
  ]);
  let handleChange2 = (info, key) => {
    if (info.file.status === 'done') {
      let toshowCaseArr = showCaseArr;
      toshowCaseArr[key].img = info.file.response.items;
      setShowCaseArr([...toshowCaseArr]);
      onChangType(true);
    }
  };

  //倒计时
  let [countDown, setCountDown] = useState(20);
  let changeCountDown = (name) => {
    setCountDown(name);
    onChangType(true);
  }
  //提交 
  let subInfo = () => {
    let toFormData = formData;
    toFormData.gameBackgroundImage = imageUrl;
    toFormData.gameBackgroundColor = indexColor.color1;
    toFormData.rockerUrl = rockerUrl;
    toFormData.clipUrl = clipUrl;
    toFormData.countDownColor = indexColor.color2;
    toFormData.countDown = countDown;
    toFormData.showCaseArr = showCaseArr;
    dispatch({
      type: 'dollMachineGame/newStyleSave',
      payload: {
        method: 'postJSON',
        params: {
          styleCode: 'dollHome',
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
    if (isDataStore) {
      subInfo()
    }
  }, [isDataStore]);
  //样式数据
  let getStyleByActivityIdAndStyleCode = () => {
    dispatch({
      type: 'dollMachineGame/getStyleByActivityIdAndStyleCode',
      payload: {
        method: 'get',
        params: {
          styleCode: 'dollHome',
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let items = res.body && res.body.styleValue && JSON.parse(res.body.styleValue);
          window.activityData_materialApply = {...window.activityData_materialApply}
          window.activityData_materialApply.homeAd = items.homeAd;
          window.activityData_materialApply.homeAdTitleName = items.homeAdTitleName;
          window.activityData_materialApply.inviteFriendsTitle = items.inviteFriendsTitle;
          window.activityData_materialApply.homeAdIsShow = items.homeAdIsShow;
          window.activityData_materialApply.isHomeAdPreviewShow = items.isHomeAdPreviewShow;
          window.activityData_materialApply.isFans = items.isFans;
          window.activityData_materialApply.showButton = items.showButton;
          window.activityData_materialApply.turntableInviteFriendsCopywriting = items.turntableInviteFriendsCopywriting;
          window.activityData_materialApply.turntableInviteFriendsTitle = items.turntableInviteFriendsTitle;
          window.activityData_materialApply.homeParticipateButtonTxt = items.homeParticipateButtonTxt;
          if(items){
            setFormData({ ...items });
            setImageUrl(items.gameBackgroundImage ? items.gameBackgroundImage : '');
            setRockerUrl(items.rockerUrl ? items.rockerUrl : '');
            setClipUrl(items.clipUrl ? items.clipUrl : '');
            let toIndexColor = indexColor;
            toIndexColor.color1 = items.gameBackgroundColor ? items.gameBackgroundColor : '#FCFCFC';
            toIndexColor.color2 = items.countDownColor ? items.countDownColor : '#868686';
            setindexColor({ ...toIndexColor });
            setCountDown(items.countDown ? items.countDown : 20);
            if (items.showCaseArr) {
              setShowCaseArr([...items.showCaseArr]);
            }
          }
        }
      }
    });
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
            <div style={{ marginLeft: '365px' }}>
              {
                indexInt === 1 ? '背景图' :
                  indexInt === 3 ? '橱窗图片集合' :
                    indexInt === 4 ? '倒计时样式' :
                      indexInt === 5 ? '按钮-摇杆' :
                        indexInt === 6 ? '按钮-夹' :
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
                <div className={styles.index_info} onClick={setTools.bind(this, 3)} style={{ backgroundImage: `url(${showCaseArr[0] && showCaseArr[0].img ? showCaseArr[0].img : ''})` }}>
                  <span className={styles.index_info_user}>头像</span>
                  <span className={styles.index_info_box1}><img src={showCaseArr[6] && showCaseArr[6].img ? showCaseArr[6].img : require('../../../../assets/activity/dollMachine_m3.png')}></img></span>
                  <span className={styles.index_info_box2}>
                    {
                      showCaseArr[2] && showCaseArr[2].img ? <img src={showCaseArr[2].img}></img> : showCaseArr[3] && showCaseArr[3].img ? <img src={showCaseArr[3].img}></img> : showCaseArr[4] && showCaseArr[4].img ? <img src={showCaseArr[4].img}></img> : <em>礼物图</em>
                    }
                  </span>
                  <div className={styles.index_info_box3}>
                    {
                      showCaseArr[1] && showCaseArr[1].img ? <img className={styles.index_info_box3_m} src={showCaseArr[1].img}></img> : <div className={styles.index_info_box3_by}>
                        <img src={require('../../../../assets/activity/dollMachine_m4.png')}></img>
                        <p>礼物推叠图</p>
                      </div>
                    }
                  </div>
                </div>
                <div className={styles.index_time} onClick={setTools.bind(this, 4)} style={{ color: `${indexColor.color2}` }}>{countDown}S</div>
                <div className={styles.index_info2}>
                  <span onClick={setTools.bind(this, 5)}><img src={rockerUrl ? rockerUrl : require('../../../../assets/activity/dollMachine_m2.png')}></img></span>
                  <span onClick={setTools.bind(this, 6)}><img src={clipUrl ? clipUrl : require('../../../../assets/activity/dollMachine_m1.png')}></img></span>
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
                    <div className={styles.style_box_m3}>    {/* 橱窗图片集合 */}
                      {
                        showCaseArr.map((item, key) => {
                          return <div className={styles.style_bm3_li}>
                            <strong>{item.title}：</strong>
                            <div className={styles.style_bm3_li_m}>
                              {
                                item.img ? <img src={item.img} className={styles.style_bm3_li_m1}></img> :
                                  <div className={styles.style_bm3_li_m2}>
                                    <img src={require('../../../../assets/activity/dollMachine_m4.png')}></img>
                                    <p>{item.remarks}</p>
                                  </div>
                              }
                            </div>
                            <div className={styles.style_bm3_li_up}>
                              <Upload
                                name="files"
                                showUploadList={false}
                                action={uploadIcon}
                                beforeUpload={beforeUpload}
                                onChange={(e) => { handleChange2(e, key) }}
                                headers={headers}
                                className={styles.style_bm3_li_up1}
                              >
                                <Button icon={<UploadOutlined />}>上传图片</Button>
                              </Upload>
                              <p className={styles.style_bm3_li_up2}>{item.proposal}</p>
                            </div>
                          </div>
                        })
                      }
                    </div>
                    : indexInt == 4 ?
                      <div className={styles.style_box_m4}>    {/* 倒计时样式 */}
                        <div className={styles.side_wrap2_li}>
                          <span className={styles.side_wrap2_span}>字体颜色：</span>
                          <span className={styles.side_wrap2_color}><SetColor colors={indexColor.color2} colorName='color2' setMColor={setMcolor} /></span>
                        </div>
                        <div className={styles.side_wrap2_li}>
                          <span className={styles.side_wrap2_span}>倒计时：</span>
                          <InputNumber min={1} value={countDown} onChange={changeCountDown} />
                        </div>
                      </div>
                      : indexInt == 5 ?
                        <div className={styles.style_box_m5}>    {/* 按钮-摇杆 */}
                          <strong>摇杆图：</strong>
                          <div className={styles.style_bm3_li_m}>
                            {
                              rockerUrl ? <img src={rockerUrl} className={styles.style_bm3_li_m1}></img> :
                                <div className={styles.style_bm3_li_m2}>
                                  <img src={require('../../../../assets/activity/dollMachine_m4.png')}></img>
                                  <p>默认图</p>
                                </div>
                            }
                          </div>
                          <div className={styles.style_bm3_li_up}>
                            <Upload
                              name="files"
                              showUploadList={false}
                              action={uploadIcon}
                              beforeUpload={beforeUpload}
                              onChange={(e) => { handleChange(e, 'rocker') }}
                              headers={headers}
                              className={styles.style_bm3_li_up1}
                            >
                              <Button icon={<UploadOutlined />}>上传图片</Button>
                            </Upload>
                            <p className={styles.style_bm3_li_up2}>建议尺寸：272px*192px</p>
                          </div>
                        </div>
                        : indexInt == 6 ?
                          <div className={styles.style_box_m5}>    {/* 按钮-夹 */}
                            <strong>按钮图：</strong>
                            <div className={styles.style_bm3_li_m}>
                              {
                                clipUrl ? <img src={clipUrl} className={styles.style_bm3_li_m1}></img> :
                                  <div className={styles.style_bm3_li_m2}>
                                    <img src={require('../../../../assets/activity/dollMachine_m4.png')}></img>
                                    <p>默认图</p>
                                  </div>
                              }
                            </div>
                            <div className={styles.style_bm3_li_up}>
                              <Upload
                                name="files"
                                showUploadList={false}
                                action={uploadIcon}
                                beforeUpload={beforeUpload}
                                onChange={(e) => { handleChange(e, 'clip') }}
                                headers={headers}
                                className={styles.style_bm3_li_up1}
                              >
                                <Button icon={<UploadOutlined />}>上传图片</Button>
                              </Upload>
                              <p className={styles.style_bm3_li_up2}>建议尺寸：272px*192px</p>
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
export default connect(({ dollMachineGame, loading, selectTheme }) => ({
  applyTheme: selectTheme.applyTheme
}))(activityPage);
