import React, { useEffect, useState } from 'react';
import { Button, message, Modal } from 'antd';
import { connect, history } from 'umi';
import VisHome from '../../components/goldenEggsHome';   //首页
import VisGame from '../../components/goldenEggsGame';   //游戏页
import PublicPops from '../../components/publicPops'; //公共弹窗
import SelectTheme from '../../components/selectTheme';//主题选择modal
import styles from './style.less';

const activityPage = (props) => {
  let { dispatch } = props;
  let [pageInt, setpageInt] = useState(1);  //对应栏目
  let [itemData, setItemData] = useState({});  //对应栏目的反填数据
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  let activityDetail = localStorage.getItem('activityDetail');   //是否详情禁用状态
  let activityDetails = activityDetail == '1' ? false : true;
  //切换提示
  let [isGameVisible, setIsGameVisible] = useState(false),
    [toIntNum, setToIntNum] = useState(1),
    [isDataChange, setIsDataChange] = useState(false), //当前数据是否有变动
    [isDataStore, setIsDataStore] = useState(false), //是否保存 
    [visDataType, setVisDataType] = useState(1), //对应当前 2下一步 3上一步 4列表
    [popTypes, setPopTypes] = useState(1); //弹窗 
  let [themeShow ,setThemeShow] = useState(false);//选择主题modal是否显示
  //确定保存
  let gameOk = (i) => {
    setIsGameVisible(false)
    setIsDataStore(true)
  }
  //保存完成
  let storeConfig = (i) => {
    setIsDataStore(false);
    gameCancel();
  }
  //不保存
  let gameCancel = (i) => {
    setIsGameVisible(false);
    setIsDataChange(false);
    if (visDataType == 2) {
      history.push("/activityConfig/activityList/activityModule/finish");
    } else if (visDataType == 3) {
      history.push("/activityConfig/activityList/activityModule/shape");
    } else if (visDataType == 4) {
      history.replace({
        pathname: '/activityConfig/activityList'
      })
    } else {
      setpageInt(toIntNum);
      setPopTypes(parseInt(toIntNum) - 2);
    }

  }
  let setInt = (i) => {
    if (isDataChange) {
      setToIntNum(i);
      setVisDataType(1);
      setIsGameVisible(true)
    } else {
      setpageInt(i)
      setPopTypes(parseInt(i) - 2);
    }
  };
  let showLayer = (i) => {
    setVisDataType(i);
    setIsGameVisible(true)
  }
  let onChangType = (i) => {
    setIsDataChange(i)
  }
  let setIsDataTypes = (i) => {
    setIsDataStore(false)
  }

  useEffect(()=>{
    dispatch({
      type: 'selectTheme/onSetTheme',
      payload: null
    })
  },[])

  useEffect(() => {
    if (pageInt === 3 || pageInt === 4 || pageInt === 5) {
      getStageSActivityThree()
    }
  }, [pageInt]);
  //数据获取
  let getStageSActivityThree = () => {
    dispatch({
      type: 'visGame/backStageSActivityThree',
      payload: {
        method: 'postJSON',
        params: {
          channelId: activityInfo.channelId,
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let data = res.body
          setItemData(data)
        } else {
          message.error(res.result.message)
        }
      }
    });
  };
  /*隐藏素材中心弹窗*/
  let onHideSelectTheme = (e) => {
    setThemeShow(e)
  }
  let selectThemeClick = () => {
    dispatch({
      type: 'selectTheme/onSetTheme',
      payload: null
    })
    setThemeShow(true)
  }
  return (
    <div className={styles.content_by}>
      {themeShow ? <SelectTheme themeShow={themeShow} styleCodeType='goldenEggsHome' materialCode="goldenEggsPage_material" onHideSelectTheme={onHideSelectTheme}/> : null}
      {/* 左侧导航 */}
      <div className={styles.side_left}>
        <div className={styles.side_left_wrap}>
          <h2 className={styles.wrap_title}>活动页面</h2>
          {activityDetails ? <span className={styles.select_theme} onClick={()=>{selectThemeClick()}}>选择主题</span> : null }
          <div className={`${styles.side_lf_box1} ${styles.side_lf_box}`}>
            <Button size='large' type={pageInt === 1 ? 'primary ' : 'default'} onClick={setInt.bind(this, 1)}>活动首页</Button>
            <div><img src={require('../../../../assets/activity/setpage_m4.png')} /></div>
            <Button size='large' type={pageInt === 2 ? 'primary ' : 'ghost'} onClick={setInt.bind(this, 2)}>砸金蛋游戏页</Button>
          </div>
        </div>
        <div className={styles.side_left_wrap2}>
          <h2 className={styles.wrap_title}>活动弹窗</h2>
          <div className={styles.side_lf_box}>
            <Button size='large' type={pageInt === 3 ? 'primary ' : 'default'} onClick={setInt.bind(this, 3)}>活动规则</Button>
            <Button size='large' type={pageInt === 4 ? 'primary ' : 'default'} onClick={setInt.bind(this, 4)}>中奖记录</Button>
            <Button size='large' type={pageInt === 5 ? 'primary ' : 'default'} onClick={setInt.bind(this, 5)}>抽奖结果</Button>
          </div>
        </div>
      </div>
      <Modal title="提示" visible={isGameVisible} closable={false} okText="是" cancelText="否" onOk={gameOk} onCancel={gameCancel}>
        <p>尚未保存当前配置，是否保存?</p>
      </Modal>
      {/* 预览、编辑 */}
      <div className={styles.side_right}>
        {
          pageInt == 1 ? <VisHome onChangType={onChangType} isDataStore={isDataStore} storeConfig={storeConfig} setIsDataStore={setIsDataStore} setIsDataTypes={setIsDataTypes} showLayer={showLayer} isDataChange={isDataChange} />  //首页
            : pageInt == 2 ? <VisGame onChangType={onChangType} isDataStore={isDataStore} storeConfig={storeConfig} setIsDataStore={setIsDataStore} setIsDataTypes={setIsDataTypes} showLayer={showLayer} isDataChange={isDataChange} /> //游戏页
              : pageInt == 3 || pageInt == 4 || pageInt == 5 ? <PublicPops onChangType={onChangType} itemData={itemData} isDataStore={isDataStore} storeConfig={storeConfig} showLayer={showLayer} isDataChange={isDataChange} popTypes={popTypes} styleCodeType="goldenEggsHome"/>
                : null
        }
      </div>
    </div>
  )
}
export default connect(({ goldenEggsPage, loading,selectTheme }) => ({

}))(activityPage);
