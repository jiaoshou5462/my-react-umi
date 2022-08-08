/*
 * @Author: wangzhushan
 * @Date: 2022-04-26 15:17:11
 * @LastEditTime: 2022-05-05 18:31:30
 * @LastEditors: wangzhushan
 * @Description: 额度管理
 */
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Table, Select, Row, Col, Pagination, Tooltip, Button, DatePicker, Modal, message } from "antd";
import { RingProgress } from '@ant-design/charts';
import { InfoCircleOutlined } from '@ant-design/icons';
import style from "./style.less";
import { parseToThousandth } from '@/utils/date'
import moment from 'moment';


const quotamanagementList = (props) => {
  const zhangketong_config = {
    height: 120,
    width: 120,
    autoFit: false,
    percent: 0, // 对应得百分比 除以100
    color: ['#FFD500', '#F7F7F7'],
    statistic: {
      content: {
        formatter: (datum) => {
          return `<div class=${style.charts}><span class=${style.tools}>${Math.floor(datum.percent * 100)}</span>%</div>`
        },
      }
    },
  }
  const zhiketong_config = {
    height: 120,
    width: 120,
    autoFit: false,
    percent: 0, // 对应得百分比 除以100
    color: ['#32D1AD', '#F7F7F7'],
    statistic: {
      content: {
        formatter: (datum) => {
          return `<div class=${style.charts}><span class=${style.tools}>${Math.floor(datum.percent * 100)}</span>%</div>`
        },
      }
    },
  };
  let { dispatch } = props;
  let [zhiketongConfig, setZhiketongConfig] = useState({...zhiketong_config}); // 智客通百分比图表数据
  let [zhangketongConfig, setZhangketongConfig] = useState({...zhangketong_config}); // 掌客通百分比图表数据
  let [quotaInfo, setQuotaInfo] = useState({}); // 页面对象
 
  useEffect(()=> {
    queryRing();
  }, [])

  // 查询额度管理数据（查询环形图数据）
  let queryRing = () => {
    dispatch({
      type: 'quotamanagement/QueryRing',
      payload: {
        method: 'get',
      },
      callback: res => {
        if (res.result.code == 'S000000') {
          setQuotaInfo(res.body);
          let zhiketongInfo = JSON.parse(JSON.stringify(zhiketong_config));
          let zhangketongInfo = JSON.parse(JSON.stringify(zhangketong_config));
          if(res.body.zhiKtResult.boughtUserAmount) {
            zhiketongInfo.percent = (res.body.zhiKtResult.percentage / 100);
          }else {
            zhiketongInfo.percent = 0;
          }
          if(res.body.zhangKtResult.boughtAccountAmount) {
            zhangketongInfo.percent = (res.body.zhangKtResult.percentage / 100); 
          }else {
            zhangketongInfo.percent = 0; 
          }
          setZhiketongConfig(zhiketongInfo);
          setZhangketongConfig(zhangketongInfo);
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  return (
    <>
      <div className={style.block__cont}>
        <div className={style.block__header}>智客通</div>
        <Row className={style.ptb24}>
          <Col span={8} className={style.left_col}>
            <RingProgress {...zhiketongConfig} />
            <span>用户量使用率</span>
          </Col>
          <Col span={16}>
            <div className={style.right_title}>用户体量</div>
            <Row className={style.ptb24}>
              <Col span={8} className={style.col_item}>
                <span>已购买用户量</span>
                {
                  quotaInfo.zhiKtResult && quotaInfo.zhiKtResult.boughtUserAmount ?
                    <span>{parseToThousandth(quotaInfo.zhiKtResult.boughtUserAmount)}人</span>
                    :
                    <span>--</span>
                }
              </Col>
              <Col span={8} className={style.col_item}>
                <span>已使用用户量</span>
                {
                  quotaInfo.zhiKtResult && quotaInfo.zhiKtResult.boughtUserAmount ?
                    <span>{quotaInfo.zhiKtResult && quotaInfo.zhiKtResult.userUserAmount ? parseToThousandth(quotaInfo.zhiKtResult.userUserAmount) : '--'}人</span>
                    :
                    <span>--</span>
                }
              </Col>
              <Col span={8} className={style.col_item}>
                <span>有效期至</span>
                <span>{quotaInfo.zhiKtResult && quotaInfo.zhiKtResult.expiryDateStr ? quotaInfo.zhiKtResult.expiryDateStr : '--'}</span>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div className={style.block__cont}>
        <div className={style.block__header}>掌客通</div>
        <Row className={style.ptb24}>
          <Col span={8} className={style.left_col}>
            <RingProgress {...zhangketongConfig} />
            <span>账号激活率</span>
          </Col>
          <Col span={16}>
            <div className={style.right_title}>账号数量</div>
            <Row className={style.ptb24}>
              <Col span={8} className={style.col_item}>
                <span>已购买账号数</span>
                {
                  quotaInfo.zhangKtResult && quotaInfo.zhangKtResult.boughtAccountAmount ?
                    <span>{parseToThousandth(quotaInfo.zhangKtResult.boughtAccountAmount)}人</span>
                    :
                    <span>--</span>
                }
              </Col>
              <Col span={8} className={style.col_item}>
                <span>已激活账号数</span>
                {
                  quotaInfo.zhangKtResult && quotaInfo.zhangKtResult.boughtAccountAmount ?
                    <span>{quotaInfo.zhangKtResult && quotaInfo.zhangKtResult.activatedAccount ? parseToThousandth(quotaInfo.zhangKtResult.activatedAccount) : '--' }人</span>
                    :
                    <span>--</span>
                }
              </Col>
              <Col span={8} className={style.col_item}>
                <span>未激活账号数</span>
                {
                  quotaInfo.zhangKtResult && quotaInfo.zhangKtResult.boughtAccountAmount ?
                    <span>{quotaInfo.zhangKtResult && quotaInfo.zhangKtResult.notActivatedAccount ? parseToThousandth(quotaInfo.zhangKtResult.notActivatedAccount) : '--' }人</span>
                    :
                    <span>--</span>
                }
              </Col>
              {/* 一期隐藏 */}
              {/* <Col span={8} className={style.col_item}>
                <span>活跃账号数<Tooltip title="活跃账户需拥有100个及以上的客户">
                  <InfoCircleOutlined className={style.info_icon} />
                </Tooltip></span>
                <span>{quotaInfo.zhangKtResult && quotaInfo.zhangKtResult.activeAccount ? parseToThousandth(quotaInfo.zhangKtResult.activeAccount) : '--' }人</span>
              </Col>
              <Col span={8} className={style.col_item}>
                <span>次活跃账号数<Tooltip title="次活跃账户需拥有0到99个客户">
                  <InfoCircleOutlined className={style.info_icon} />
                </Tooltip></span>
                <span>{quotaInfo.zhangKtResult && quotaInfo.zhangKtResult.secondActiveAccount ? parseToThousandth(quotaInfo.zhangKtResult.secondActiveAccount) : '--' }人</span>
              </Col>
              <Col span={8} className={style.col_item}>
                <span>非活跃账号数<Tooltip title="非活跃账号拥有的客户数量为0">
                  <InfoCircleOutlined className={style.info_icon} />
                </Tooltip></span>
                <span>{quotaInfo.zhangKtResult && quotaInfo.zhangKtResult.inactiveAccount ? parseToThousandth(quotaInfo.zhangKtResult.inactiveAccount) : '--' }人</span>
              </Col> */}
              <Col span={8} className={style.col_item}>
                <span>已冻结账号数</span>
                {
                  quotaInfo.zhangKtResult && quotaInfo.zhangKtResult.boughtAccountAmount ?
                    <span>{quotaInfo.zhangKtResult && quotaInfo.zhangKtResult.frozenAccount ? parseToThousandth(quotaInfo.zhangKtResult.frozenAccount) : '--' }人</span>
                    : 
                    <span>--</span>
                }
              </Col>
              <Col span={8} className={style.col_item}>
                <span>有效期至</span>
                <span>{quotaInfo.zhangKtResult && quotaInfo.zhangKtResult.expiryDateStr ? quotaInfo.zhangKtResult.expiryDateStr : '--'}</span>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  )
}


export default connect(({  }) => ({

}))(quotamanagementList)