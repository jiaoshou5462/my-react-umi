import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import { Input, Modal, Button } from "antd"
import styles from "./style.less"
import TurntableHomeReview from '../components/turntableHomePreview'
import TurntableGamePreview from "../components/turntableGamePreview"
import StrikeHomePreview from '../components/strikeHomePreview'
import StrikeGamePreview from '../components/strikeGamePreview'
import DirectPumpingHomePreview from '../components/directPumpingHomePreview'
import DiscountHomePreview from '../components/discountHomePreview'
import DiscountGamePreview from '../components/discountGamePreview'
import DollHomePreview from '../components/dollHomePreview'
import DollGamePreview from '../components/dollGamePreview'
import GoldenEggsHomePreview from '../components/goldenEggsHomePreview'
import GoldenEggsGamePreview from '../components/goldenEggsGamePreview'
import SeckilHomePreview from '../components/seckilHomePreview'

const previewModel = (props) => {
  let { dispatch, listData, previewModelVisble, hidePreviewModel, styleCode, setApplyTheme, setIsSelect } = props;
  let [pageInt, setpageInt] = useState(1);  //对应栏目
  let [editStyleValue, setEditStyleValue] = useState({}) // 预览数据
  // 组件对应数据
  let componentMatchData = {
    'turntablePage_material': {
      1: { componentName: <TurntableHomeReview homeDataInit={editStyleValue} />, btnName: '活动首页' },
      2: { componentName: <TurntableGamePreview gameDataInit={editStyleValue} />, btnName: '转盘游戏页' },
      3: { componentName: <TurntableHomeReview homeDataInit={editStyleValue} popTypes={1} />, btnName: '活动规则' },
      4: { componentName: <TurntableHomeReview homeDataInit={editStyleValue} popTypes={2} />, btnName: '中奖记录' },
      5: { componentName: <TurntableHomeReview homeDataInit={editStyleValue} popTypes={3} />, btnName: '抽奖结果' }
    },
    'seckilPage_material': {
      1: { componentName: <SeckilHomePreview homeDataInit={editStyleValue} />, btnName: '活动首页' },
      3: { componentName: <SeckilHomePreview homeDataInit={editStyleValue} popTypes={1} />, btnName: '活动规则' },
      4: { componentName: <SeckilHomePreview homeDataInit={editStyleValue} popTypes={2} />, btnName: '中奖记录' }
    },
    'directPumpingPage_material': {
      1: { componentName: <DirectPumpingHomePreview homeDataInit={editStyleValue} />, btnName: '抽奖页' },
      3: { componentName: <DirectPumpingHomePreview homeDataInit={editStyleValue} popTypes={1} />, btnName: '活动规则' },
      4: { componentName: <DirectPumpingHomePreview homeDataInit={editStyleValue} popTypes={2} />, btnName: '中奖记录' },
      5: { componentName: <DirectPumpingHomePreview homeDataInit={editStyleValue} popTypes={3} />, btnName: '抽奖结果' }
    },
    'discountPage_material': {
      1: { componentName: <DiscountHomePreview homeDataInit={editStyleValue} />, btnName: '首页' },
      2: { componentName: <DiscountGamePreview gameDataInit={editStyleValue} />, btnName: '购买页' },
      3: { componentName: <DiscountHomePreview homeDataInit={editStyleValue} popTypes={1} />, btnName: '活动规则' },
      4: { componentName: <DiscountHomePreview homeDataInit={editStyleValue} popTypes={2} />, btnName: '购买记录' }
    },
    'dollMachinePage_material': {
      1: { componentName: <DollHomePreview homeDataInit={editStyleValue} />, btnName: '活动首页' },
      2: { componentName: <DollGamePreview gameDataInit={editStyleValue} />, btnName: '游戏页' },
      3: { componentName: <DollHomePreview homeDataInit={editStyleValue} popTypes={1} />, btnName: '活动规则' },
      4: { componentName: <DollHomePreview homeDataInit={editStyleValue} popTypes={2} />, btnName: '中奖记录' },
      5: { componentName: <DollHomePreview homeDataInit={editStyleValue} popTypes={3} />, btnName: '抽奖结果' }
    },
    'goldenEggsPage_material': {
      1: { componentName: <GoldenEggsHomePreview homeDataInit={editStyleValue} />, btnName: '活动首页' },
      2: { componentName: <GoldenEggsGamePreview gameDataInit={editStyleValue} />, btnName: '砸金蛋游戏页' },
      3: { componentName: <GoldenEggsHomePreview homeDataInit={editStyleValue} popTypes={1} />, btnName: '活动规则' },
      4: { componentName: <GoldenEggsHomePreview homeDataInit={editStyleValue} popTypes={2} />, btnName: '中奖记录' },
      5: { componentName: <GoldenEggsHomePreview homeDataInit={editStyleValue} popTypes={3} />, btnName: '抽奖结果' }
    },
    'strikePage_material': {
      1: { componentName: <StrikeHomePreview homeDataInit={editStyleValue} />, btnName: '活动首页' },
      2: { componentName: <StrikeGamePreview gameDataInit={editStyleValue} />, btnName: '游戏页' },
      3: { componentName: <StrikeHomePreview homeDataInit={editStyleValue} popTypes={1} />, btnName: '活动规则' },
      4: { componentName: <StrikeHomePreview homeDataInit={editStyleValue} popTypes={2} />, btnName: '中奖记录' },
      5: { componentName: <StrikeHomePreview homeDataInit={editStyleValue} popTypes={3} />, btnName: '抽奖结果' }
    }
  }
  let statusMatch = {
    1: '待上架',
    2: '展示中',
    3: '已下架'
  }
  useEffect(() => {
    if (previewModelVisble) {
      getMaterialDetails()
    }
  }, [previewModelVisble])

  let componentChange = () => {
    if (componentMatchData[styleCode]) {
      return componentMatchData[styleCode][pageInt] ? componentMatchData[styleCode][pageInt]['componentName'] : null
    }
  }

  let btnNameChange = (pageInt) => {
    if (componentMatchData[styleCode]) {
      return componentMatchData[styleCode][pageInt] ? componentMatchData[styleCode][pageInt].btnName : null
    }
  }

  // 获取素材数据
  let getMaterialDetails = () => {
    dispatch({
      type: 'selectTheme/getMaterialDetails',
      payload: {
        method: 'get',
        params: {
          materialId: listData.id,
          styleCode: styleCode
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          setEditStyleValue(JSON.parse(res.body.styleValue))
        } else {
          message.error(res.result.message)
        }

      }
    })
  }

  let setInt = (i) => {
    setpageInt(i);
  }
  let handleOk = () => {

  }
  let handleCancel = () => {
    hidePreviewModel()
  }
  //预览弹窗应用主题
  let applyTheme = () => {
    setApplyTheme(listData.id);
    setIsSelect(true);
  }
  return (
    <>
      <Modal
        width={900}
        title="预览"
        maskClosable={false}
        visible={previewModelVisble}
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className={styles.content_by}>
          {/* 左侧导航 */}
          <div className={styles.side_left}>
            <div className={styles.side_left_wrap}>
              <h2 className={styles.wrap_title}>活动页面</h2>
              <div className={`${styles.side_lf_box1} ${styles.side_lf_box}`}>
                <Button size='large' type={pageInt === 1 ? 'primary ' : 'default'} onClick={setInt.bind(this, 1)}>{btnNameChange(1)}</Button>
                {btnNameChange(2) ? <div><img src={require('../../../../../assets/activity/setpage_m4.png')} /><Button size='large' type={pageInt === 2 ? 'primary ' : 'default'} onClick={setInt.bind(this, 2)}>{btnNameChange(2)}</Button></div> : null}
              </div>
            </div>
            <div className={styles.side_left_wrap2}>
              <h2 className={styles.wrap_title}>活动弹窗</h2>
              <div className={styles.side_lf_box}>
                <Button size='large' type={pageInt === 3 ? 'primary ' : 'default'} onClick={setInt.bind(this, 3)}>{btnNameChange(3)}</Button>
                <Button size='large' type={pageInt === 4 ? 'primary ' : 'default'} onClick={setInt.bind(this, 4)}>{btnNameChange(4)}</Button>
                {btnNameChange(5) ? <Button size='large' type={pageInt === 5 ? 'primary ' : 'default'} onClick={setInt.bind(this, 5)}>{btnNameChange(5)}</Button> : null}
              </div>
            </div>
          </div>
          {/* 预览、编辑 */}
          <div className={styles.side_right}>
            {componentChange()}
          </div>
        </div>
        <div className={styles.content_apply}>
          <Button size='large' type='primary 'onClick={applyTheme}>应用主题</Button>
        </div>
      </Modal>
    </>
  )
};
export default connect(({ selectTheme }) => ({
}))(previewModel)
