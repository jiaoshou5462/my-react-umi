import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {
  Button,
  Row,
  Tabs,
  Steps,
  Col,
  Descriptions,
} from "antd"
const { TabPane } = Tabs
import { CheckCircleFilled } from '@ant-design/icons';
import style from "./style.less"
import ServiceModal from '../serviceModal'
import CustomerModal from '../customerModal'
import BaiDuMap from '../baiDuMap'
import BottomArea from "@/components/commonComp/BottomArea"; //底部区域组件
const rescueOrderDetailPage = (props) => {
  let { dispatch, location, detail } = props
  let [tabKey, setTabKey] = useState('2')
  let [caseCode, setCaseCode] = useState(0)

  //是否事故车、预约单
  let settleNodeItem = {
    0: "否",
    1: "是"
  }

  useEffect(() => {
    getDetail()
  }, [])
  let getDetail = () => {
    dispatch({
      type: 'rescueOrderDetail/getDetail',
      payload: {
        method: 'postJSON',
        params: {
          caseId: location.state && location.state.caseId || ''
        }
      },
    })
  }
  let onChange = (e) => {
    setTabKey(e)
  }
  let goToBack = () => {
    history.goBack()

  }
  useEffect(() => {
    if (Object.keys(detail).length > 0) {
      let caseList = detail.caseProgressList
      let cod = caseList.findIndex(caseList => caseList.caseStatus == detail.caseStatus)
      setCaseCode(cod)
    }
  }, [detail])

  return (
    <div>
      {
        detail.caseProgressList && detail.caseProgressList.length > 0 ?
          <div className={style.block__cont_1}>
            <div className={style.block__cont_header}>
              <span>流程进度</span>
            </div>
            <div className={style.step_item}>
              <Steps progressDot>
                {
                  detail.caseProgressList && detail.caseProgressList.map((item, index) => {
                    return <>
                      {
                        item.isExist == 1 && (item.caseStatus == 4 || item.caseStatus == 16) ?
                          <Steps.Step title={item.caseStatusStr} description={item.createTime} status="error" />
                          :
                          item.caseStatus == 2 || item.caseStatus == 3 || item.caseStatus == 18 ?
                            null
                            :
                            item.isExist == 1 ?
                              <Steps.Step title={item.caseStatusStr} description={item.createTime} status="finish" />
                              :
                              <Steps.Step title={item.caseStatusStr} description={item.createTime} status="wait" />
                      }
                    </>
                  })
                }
              </Steps>
            </div>
          </div>
          : null
      }

      <Row>
        <Col span={16} className={style.block__cont_right}>
          <div className={style.block__cont_bottom}>
            <div className={style.block__header}><span>订单详情</span></div>
            <Row className={style.detail_row}>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>订单号</div>
                <div className={style.color_fsz1}>{detail.claimsCode || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>来源工单号(渠道订单号)</div>
                <div className={style.color_fsz1}>{detail.traceCode || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>受理日期</div>
                <div className={style.color_fsz1}>{detail.reportTime || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>服务状态</div>
                <div className={style.color_fsz1}>{detail.caseStatusStr || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>服务类型/项目</div>
                <div className={style.color_fsz1}>{detail.serviceTypeStr || '-'}/{detail.serviceStr || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>服务商</div>
                <div className={style.color_fsz1}>{detail.providerName || '-'}</div>
              </Col>
            </Row>
            <Row className={style.detail_row}>
              <Col span={24} className={style.item_form}>
                <div className={style.title_fsz2}>救援地址</div>
                <div className={style.color_fsz1}>{detail.provinceStr}{detail.caseCityStr}{detail.regionStr}{detail.caseAddress} {detail.caseAddressFlag}</div>
              </Col>
            </Row>
            <Row className={style.detail_row}>
              <Col span={24} className={style.item_form}>
                <div className={style.title_fsz2}>目的地址</div>
                <div className={style.color_fsz1}>{detail.destProvinceStr}{detail.destCityStr}{detail.destRegionStr}{detail.destination} {detail.destinationFlag}</div>
              </Col>
            </Row>
            <Row className={style.detail_row}>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>车辆位置</div>
                <div className={style.color_fsz1}>{detail.positionStr || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>故障类型</div>
                <div className={style.color_fsz1}>{detail.assistantTypeStr || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>预估公里数</div>
                <div className={style.color_fsz1}>{detail.estimateDistance || '-'} KM</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>是否事故车</div>
                <div className={style.color_fsz1}>{settleNodeItem[detail.isAccident] || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>案件创建人</div>
                <div className={style.color_fsz1}>{detail && detail.createUserName || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>预约时间</div>
                <div className={style.color_fsz1}>{detail.reservationTime || '-'}</div>
              </Col>
              {
                detail.surveyoName ? <Col span={12} className={style.item_form}>
                  <div className={style.title_fsz2}>查勘员姓名</div>
                  <div className={style.color_fsz1}>{detail.surveyoName}</div>
                </Col>
                  : null
              }
              {
                detail.surveyoTelephone ? <Col span={12} className={style.item_form}>
                  <div className={style.title_fsz2}>查勘员电话</div>
                  <div className={style.color_fsz1}>{detail.surveyoTelephone}</div>
                </Col>
                  : null
              }
            </Row>
          </div>

          <div className={style.block__cont_bottom}>
            <div className={style.block__header}><span>用户信息</span></div>
            <Row className={style.detail_row}>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>来电人</div>
                <div className={style.color_fsz1}>{detail.customerName || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>报案电话</div>
                <div className={style.color_fsz1}>{detail.customerPhone || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>车牌号</div>
                <div className={style.color_fsz2}>{detail.plateNo || '-'}</div>
              </Col>
            </Row>
          </div>

          <div className={style.block__cont_bottom}>
            <div className={style.block__header}><span>车辆及保险信息</span></div>
            <Row className={style.detail_row}>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>车辆品牌</div>
                <div className={style.color_fsz1}>{detail.carBrand || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>车型</div>
                <div className={style.color_fsz1}>{detail.carTypeStr || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>颜色</div>
                <div className={style.color_fsz1}>{detail.carColorStr || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>车架号</div>
                <div className={style.color_fsz1}>{detail.identityNo || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>保险公司</div>
                <div className={style.color_fsz2}>{detail.insurerStr || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>保单号码</div>
                <div className={style.color_fsz2}>{detail.policyNo || '-'}</div>
              </Col>
              {/* <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>救援车辆</div>
                <div className={style.color_fsz1}>{detail.torDriverPosition && detail.torDriverPosition.carNumber || '-'}</div>
              </Col> */}
            </Row>
          </div>

          <div className={style.block__cont_bottom}>
            <div className={style.block__header}><span>订单附言</span></div>
            <div className={style.item_form}>
              <div className={style.color_fsz1}>{detail.memo || '-'}</div>
            </div>
          </div>

          <div className={style.block__cont_bottom}>
            <div className={style.block__header}><span>订单备注</span></div>
            <div className={style.item_form}>
              {
                detail.outRemarkList && detail.outRemarkList.length > 0 ?
                  <div className={style.title_content}>
                    {
                      detail.outRemarkList.map((item, index) => {
                        return (
                          <div >
                            <div className={style.color_fsz3}>{item.content}</div>
                            <div className={style.color_fsz2}>{item.createTime}</div>
                          </div>
                        )
                      })
                    }
                  </div>
                  :
                  <div className={style.color_fsz2}>--</div>
              }
            </div>
          </div>

          {/* <div className={style.block__cont_bottom}>
            <div className={style.block__header}><span>服务实施人员调派信息</span></div>
            <Row className={style.detail_row}>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>姓名</div>
                <div className={style.color_fsz1}>{detail.torDriverPosition && detail.torDriverPosition.driverName || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>电话</div>
                <div className={style.color_fsz1}>{detail.torDriverPosition && detail.torDriverPosition.driverPhone || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>特殊工具</div>
                <div className={style.color_fsz2}>{detail.specialTool || '-'}</div>
              </Col>
            </Row>
          </div> */}

        </Col>

        <Col span={8} className={style.block__cont_left}>
          <div className={style.block__cont_bottom}>
            <div className={style.block__header_map}>
              <span>地图信息</span>
            </div>
            <BaiDuMap
              caseId={detail.id}
              caseDetail={detail}
              driverId={detail.driverId}
            />
          </div>

          <div >
            <ServiceModal detail={detail} />
            {/* <Tabs type="card" size='large' activeKey={tabKey} onChange={onChange}>
              <TabPane tab="客户信息" key="1">
                <CustomerModal detail={detail} />
              </TabPane>
              <TabPane tab="服务信息" key="2">
                <ServiceModal detail={detail} />
              </TabPane>
            </Tabs> */}
          </div>

          <div className={style.block__cont_top}>
            <div className={style.block__header}><span>服务实施人员调派信息</span></div>
            <Row className={style.detail_row}>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>姓名</div>
                <div className={style.color_fsz1}>{detail.torDriverPosition && detail.torDriverPosition.driverName || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>电话</div>
                <div className={style.color_fsz1}>{detail.torDriverPosition && detail.torDriverPosition.driverPhone || '-'}</div>
              </Col>
              <Col span={12} className={style.item_form}>
                <div className={style.title_fsz2}>特殊工具</div>
                <div className={style.color_fsz2}>{detail.specialTool || '-'}</div>
              </Col>
            </Row>
          </div>

          {
            detail.caseWorkSheet && detail.caseWorkSheet != null ?
              <div className={style.block__cont_top}>
                <div>
                  <div className={style.block__header}><span>服务完成信息</span></div>
                  <Row className={style.detail_row}>
                    <Col span={8} className={style.item_form}>
                      <div className={style.title_fsz2}>出发时间</div>
                      <div className={style.color_fsz2}>{detail.caseWorkSheet && detail.caseWorkSheet.leaveTime || '-'}</div>
                    </Col>
                    <Col span={8} className={style.item_form}>
                      <div className={style.title_fsz2}>到达时间</div>
                      <div className={style.color_fsz2}>{detail.caseWorkSheet && detail.caseWorkSheet.arriveTime || '-'}</div>
                    </Col>
                    <Col span={8} className={style.item_form}>
                      <div className={style.title_fsz2}>到达时效(分)</div>
                      <div className={style.color_fsz2}>{detail.caseWorkSheet && detail.caseWorkSheet.arrivePrescription || '-'}</div>
                    </Col>
                  </Row>
                </div>
              </div>
              : null
          }

          <div className={style.block__cont_top}>
            <div className={style.block__header}><span>评价信息</span></div>
            <div className={style.item_form}>
              <div className={style.title_fsz2}>用户评价</div>
              <div className={style.color_fsz2}>{detail.assessment && detail.assessment.comment || '-'}</div>
            </div>
          </div>
        </Col>
      </Row>

      {/* <div className={style.block__cont_bottom}>
        <div className={style.block__header}><span>服务实施人员调派信息</span></div>
        <Row className={style.detail_row}>
          <Col span={8} className={style.item_form}>
            <div className={style.title_fsz2}>姓名</div>
            <div className={style.color_fsz2}>{detail.torDriverPosition && detail.torDriverPosition.driverName || '-'}</div>
          </Col>
          <Col span={8} className={style.item_form}>
            <div className={style.title_fsz2}>电话</div>
            <div className={style.color_fsz2}>{detail.torDriverPosition && detail.torDriverPosition.driverPhone || '-'}</div>
          </Col>
          <Col span={8} className={style.item_form}>
            <div className={style.title_fsz2}>特殊工具</div>
            <div className={style.color_fsz2}>{detail.specialTool || '-'}</div>
          </Col>
        </Row>
      </div> */}



      {/* <div style={{ padding: '20px 0' }}>
        <Row justify="end" align="right">
          <Button onClick={goToBack} className={style.btn_radius}>返回</Button>
        </Row>
      </div> */}
      <BottomArea>
        <Button onClick={goToBack}>返回上级</Button>
      </BottomArea>

    </div>
  )
}
export default connect(({ rescueOrderDetail }) => ({
  detail: rescueOrderDetail.detail
}))(rescueOrderDetailPage)
