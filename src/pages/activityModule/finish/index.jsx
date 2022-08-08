import React, { useEffect, useState } from 'react';
import { Button, message ,Tooltip} from 'antd';
import { connect, history } from 'umi';
import LayerModal from '../components/layerModal';   //取消、上一步弹窗
import { CheckOutlined,InfoCircleOutlined } from '@ant-design/icons';
import styles from './style.less';

const activitFinishs = (props) => {
  let { dispatch } = props;
  let activityInfo = JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
  let [detailStatus, setDetailStatus] = useState(localStorage.getItem('activityDetail') === '0' ? true : false)
  //取消弹窗
  let [isCancelModal, setIsCancelModal] = useState(false);
  let setIsCancel = () => {
    setIsCancelModal(true);
  }
  let onClickCancel = (e) => {
    setIsCancelModal(false);
    setIsStepBack(false);
  }
  //上一步
  let [isStepBack, setIsStepBack] = useState(false);
  let [isStepInt, setIsStepInt] = useState(0);   //跳转对应页
  let setStepBack = (i) => {
    setIsStepInt(i);
    setIsStepBack(true);
  }


  let [tableItem, setTableItem] = useState({
  });
  let getTableInfo = () => {
    dispatch({
      type: 'activityFinish/echoActivityFive',
      payload: {
        method: 'postJSON',
        params: {
          channelId: activityInfo.channelId,
          activityId: activityInfo.objectId
          // activityId: '1727'
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let item = res.body;
          setTableItem({ ...item });
        }
      }
    });
  };
  let buyCheaperFinish = () => {
    dispatch({
      type: 'activityFinish/buyCheaperFinish',
      payload: {
        method: 'get',
        params: {
          activityId: activityInfo.objectId
        }
      },
      callback: (res) => {
        if (res.result.code == "0") {
          let item = res.body;
          setTableItem({ ...item });
        }
      }
    });
  };
  // 提交
  let updateBtn = () => {
    history.replace({
      pathname: '/activityConfig/activityList'
    })
    // dispatch({
    //   type: 'activityFinish/updateActivityStatus',
    //   payload:{
    //     method:'postJSON',
    //     params:{
    //       channelId:activityInfo.channelId,
    //       activityId:activityInfo.objectId,
    //       channelName:activityInfo.channelIdStr,
    //       status:1
    //     }
    //   },
    //   callback:(res)=>{
    //     if(res.code == "0000"){
    //       message.success('成功！')
    //       setTimeout(() => {
    //         history.replace({
    //           pathname: '/activityConfig/activityList'
    //         })
    //       }, 100);
    //     }else{
    //       message.error('提交失败，请重新尝试！')
    //     }
    //   }
    // });
  }


  useEffect(() => {
    dispatch({
      type: 'selectTheme/onSetTheme',
      payload: null
    })
    //数据回显
    if (activityInfo && activityInfo.objectId && activityInfo.channelId) {
      if(activityInfo.marketActivityType == 4){
        buyCheaperFinish();
      }else{
        getTableInfo();
      }
    }
  }, []);
  return (
    <div className={styles.block__cont}>
      <LayerModal iscancal={isCancelModal} onClickCancel={onClickCancel} isstopback={isStepBack} isstepint={isStepInt} />
      <div className={styles.wrap_top}>
        <p><span className={styles.wrap_top_ico}><CheckOutlined className={styles.wrap_top_icos} /></span></p>
        <h6>创建完成</h6>
      </div>

      <div className={styles.wrap_mian}>
        <div className={styles.wrap_mian_info}>
          <p>
            <span><strong>活动时间：</strong><i>{tableItem.activityTime}</i></span>
            <span><strong>活动形式：</strong><i>{activityInfo.marketActivityType == 4 ? tableItem.activityStyle : tableItem.activityForm}</i></span>
          </p>
          <p>
            <span><strong>活动可参与人群：</strong><i>{tableItem.throngNames}</i></span>
            {activityInfo.marketActivityType == 4 ?
            <span><strong>商品总预算：</strong><i>{tableItem.totalProductBudget}元</i><Tooltip title={'商品总预算=商品单价*库存 之和'}><InfoCircleOutlined className={`${styles.wrap_ico} ${styles.wrap2_ico2}`} /></Tooltip></span> :
            <span><strong>奖品预算：</strong><i>{tableItem.totalAmount}元</i></span>}
          </p>
          {activityInfo.marketActivityType == 4 ? <p><span><strong>循环周期：</strong><i>{tableItem.cyclePeriod}</i></span></p> : null}
        </div>
        {
          activityInfo.marketActivityType == 2 ?
            // 秒杀
            <div className={styles.wrap_mian_seckil}>
              <div className={styles.mian_seckil_li}><span>场次</span><span>商品名称</span><span>数量</span><span>单价</span><span>总价</span></div>
              {
                tableItem.seckillVOList ? tableItem.seckillVOList.map((item, i) => {
                  return <div className={styles.mian_seckil_li}>
                    <span>第{i + 1}场</span>
                    <div className={styles.mian_seckil_child}>
                      {item.prizeList.map((items, k) => {
                        return <p><em>{items.prizeName}</em>
                          <em>{items.activityStockNum}</em>
                          <em>{items.prizeAmount}</em>
                          <em>{items.totalPrice}</em></p>
                      })}
                    </div>
                  </div>
                }) : null
              }

            </div>
          : activityInfo.marketActivityType == 4 ?
            // 优惠购
            <div className={styles.wrap_mian_table}>
              <p>
              <span>商品名称</span>
              <span>库存</span>
              <span>单价</span>
              <span>支付价</span>
              <span className={styles.haveIco}>商品总价<Tooltip title={'商品总价=商品单价*库存'}><InfoCircleOutlined className={`${styles.wrap_ico} ${styles.wrap2_ico2}`} /></Tooltip></span>
              <span className={styles.haveIco}>支付总价<Tooltip title={'支付总价=商品支付价*库存'}><InfoCircleOutlined className={`${styles.wrap_ico} ${styles.wrap2_ico2}`} /></Tooltip></span></p>
              {tableItem.goods ?
                tableItem.goods.map((item, i) => {
                  return <p key={i}>
                    <span>{item.prizeName}</span>
                    <span>{item.activityStockNum}</span>
                    <span>{item.unitPrice}元</span>
                    <span>{item.payPrice}元</span>
                    <span>{item.goodsTotalPrice}元</span>
                    <span>{item.payTotalPrice}元</span>
                  </p>
                }) : null
              }
            </div>
          :
            // 转盘
            <div className={styles.wrap_mian_table}>
              <p><span>奖品</span><span>奖品图片</span><span>数量</span><span>总价</span>
                {tableItem.throngList ?
                  tableItem.throngList.map((item, i) => {
                    return <span>{item.name}</span>
                  }) : null
                }
              </p>
              {tableItem.prizeList ?
                tableItem.prizeList.map((item, i) => {
                  return <p key={i}>
                    <span>{item.prizeName}</span>
                    <span><img src={item.prizeImg}></img></span>
                    <span>{item.activityStockNum}</span>
                    <span>{item.totalPrice}</span>
                    {/* <span>{item.defaultWinningNum}%</span> */}
                    {tableItem.throngList ?
                      tableItem.throngList.map((item) => {
                        return <span>{item.list[i]}</span>
                      }) : ''
                    }
                  </p>
                }) : null
              }
            </div>
        }

      </div>
      <div className={styles.wrap_bom}>
        {/* <div className={styles.wrap_bom_preview}><Button>立即预览</Button></div> */}
        <div className={styles.wrap_bom_btn}>
          <Button onClick={setIsCancel}>返回列表</Button>
          <Button onClick={setStepBack.bind(this, 3)}>上一步</Button>
          <Button onClick={updateBtn} type='primary'>提交</Button>

        </div>
      </div>
    </div>
  )
}
export default connect(({ activityFinish, loading,selectTheme }) => ({

}))(activitFinishs);
