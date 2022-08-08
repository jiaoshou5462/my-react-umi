import React,{useEffect, useState} from "react"
import { connect,history } from 'umi'
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Checkbox,
} from "antd"
import style from "./style.less"
const { Option } = Select
const { TextArea } = Input
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
let checkList = [{
  value: 0,
  label: '预约救援',
},{
  value: 1,
  label: '必须录音',
},{
  value: 2,
  label: '事故车',
},{
  value: 3,
  label: '是否承保',
}]
const customerModalPage =(props)=>{
  let {dispatch, detail, underwritingList, userProviderList, serviceTypeList, serviceItemList,
    provinceList, cityList, regionList, destCityList, destRegionList, positionList, faultTypeList,
    carTypeList, carColorList, insuranceList, carBrandList, carModelList} = props
  let [form] = Form.useForm()
  let [checkValue, setCheckValue] = useState([])
  let [channelBranchId, setChannelBranchId] = useState('')
  let [providerId, setProviderId] = useState('')
  let [carType, setCarType] = useState('')

  useEffect(() => {
    let channelId = localStorage.getItem('tokenObj') && JSON.parse(localStorage.getItem('tokenObj')).channelId || ''
    getConfigCode(1)
    getConfigCode(4)
    getConfigCode(6, channelId)
    dispatch({
      type: 'orderPublic/getUserProviderList',
      payload: {
        method: 'get',
        params: {}
      },
    })
  },[])

  /*获取公共列表*/
  let getConfigCode = (flag, parentId) => {
    /*1、省 2、市 3、区 4、服务类型 5、服务项目 6、承保单位
    7、方位 8、故障类型 9、车型 10.车辆颜色 11、保险公司*/
    let temp = {}
    if(flag === 1 || flag === 2 || flag === 3){
      temp = {
        name: 'TOR_REGION',
        clause: flag === 1 ? 'level=1' : 'parent_id=' + parentId
      }
    }
    if(flag === 4){
      temp = {
        name: 'TOR_SERVICE_TYPE',
        pageType: 'display',
        from: 'rescueOrder'
      }
    }
    if(flag === 5){
      temp = {
        name: 'TOR_SERVICE',
        clause: 'service_type_id=' + parentId
      }
    }
    if(flag === 6){
      temp = {
        name: 'tor_channel_branch',
        clause: 'parent_id=' + parentId
      }
    }
    if(flag === 7){
      temp = {
        name: 'TOR_POSITION_TYPE',
      }
    }
    if(flag === 8){
      temp = {
        name: 'TOR_ASSISTANT_TYPE',
      }
    }
    if(flag === 9){
      temp = {
        name: 'TOR_CAR_TYPE',
      }
    }
    if(flag === 10){
      temp = {
        name: 'TOR_COLOR',
      }
    }
    if(flag === 11){
      temp = {
        name: 'TOR_INSURER',
      }
    }

    dispatch({
      type: 'orderPublic/getConfigCode',
      payload: {
        method: 'get',
        params: temp
      },
      flag
    })
  }

  /*获取当前页面的 公共列表*/
  let getModalConfigCode = (flag, parentId) => {
    /*1、省 2、市 3、区 4、服务类型 5、服务项目 6、承保单位*/
    let temp = {}
    if(flag === 1 || flag === 2 || flag === 3){
      temp = {
        name: 'TOR_REGION',
        clause: flag === 1 ? 'level=1' : 'parent_id=' + parentId
      }
    }
    dispatch({
      type: 'customerModal/getModalConfigCode',
      payload: {
        method: 'get',
        params: temp
      },
      flag
    })
  }


  useEffect(() => {
    if(Object.keys(detail).length > 0){
      let torCaseCar = detail.torCaseCar || {}
      let caseWorkSheet = detail.caseWorkSheet || {}
      let torDriverPosition = detail.torDriverPosition || {}
      let {brandId, modelId} = torCaseCar
      let data = {
        ...detail,
        ...torCaseCar,
        ...caseWorkSheet,
        ...torDriverPosition,
        brandId: brandId && brandId + '',
        carColor: detail.carColor && detail.carColor + '',
        serviceId: detail.serviceId && detail.serviceId + '',
        positionId: detail.positionId && detail.positionId + '',
        assistantType: detail.assistantType && detail.assistantType + '',
        serviceTypeId: detail.serviceTypeId && detail.serviceTypeId + '',
        reportTime: detail.reportTime ? moment(detail.reportTime).format('YYYY-MM-DD HH:mm:ss') : '',
        reservationTime: detail.reservationTime && moment(detail.reservationTime).format('YYYY-MM-DD HH:mm:ss'),
      }
      let tempCheck = []
      let tempList = [detail.reservationFlg, detail.voiceIsNecessary, detail.isAccident, detail.underwriteFlag]
      tempList.map((item, key) => {
        if(item === 1){
          tempCheck.push(key)
        }
      })
      setCarType(detail.carType && detail.carType + '')
      setProviderId(detail.providerId && detail.providerId + '')
      setChannelBranchId(detail.channelBranchId && detail.channelBranchId + '')
      setCheckValue(tempCheck)
      form.setFieldsValue(data)

      /*1、省 2、市 3、区 4、服务类型 5、服务项目 6、承保单位
      7、方位 8、故障类型 9、车型 10.车辆颜色 11、保险公司*/

      /*有服务省 就请求 服务城市接口*/
      if(detail.province){
        getConfigCode(2, detail.province)
      }
      /*有服务城市 就请求 服务地区接口*/
      if(detail.caseCity){
        getConfigCode(3, detail.caseCity)
      }
      /*有目的地省 就请求 目的地城市接口*/
      if(detail.destProvince){
        getModalConfigCode(2, detail.destProvince)
      }
      /*有目的地城市 就请求 目的地地区接口*/
      if(detail.destCity){
        getModalConfigCode(3, detail.destCity)
      }
      /*有服务类型 就请求 服务项目接口*/
      if(detail.serviceTypeId){
        getConfigCode(5, detail.serviceTypeId)
      }

      /*判断字段是否有值，减少不必要的接口请求*/

      /*方位*/
      if(detail.positionId){
        getConfigCode(7)
      }
      /*故障类型*/
      if(detail.assistantType){
        getConfigCode(8)
      }
      /*车型*/
      if(detail.carType){
        getConfigCode(9)
      }
      /*颜色*/
      if(detail.carColor){
        getConfigCode(10)
      }
      /*保险公司*/
      if(detail.insurerId){
        getConfigCode(11)
      }
      /*车辆品牌*/
      if(brandId){
        dispatch({
          type: 'orderPublic/getCarBrandList',
          payload: {
            method: 'get',
            params: {}
          },
        })
      }
      /*车辆车系*/
      if(brandId && modelId){
        dispatch({
          type: 'orderPublic/getCarModelList',
          payload: {
            method: 'get',
            params: {
              brandId
            }
          },
        })
      }
    }else {
      form.setFieldsValue()
    }
  },[detail])

  let onChannelBranchId = (e) => {
    setChannelBranchId(e)
  }
  let onProviderId = (e) => {
    setProviderId(e)
  }
  let onCarType = (e) => {
    setCarType(e)
  }
  return(
      <>
        <Form form={form}>
          <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
            <Row className={style.detail_title} style={{justifyContent: 'space-between'}}>
              <div>客户信息</div>
              <div>
                <div>
                  <span>案件号：</span>
                  <span>{detail.claimsCode}</span>
                </div>
              </div>
            </Row>
            <Row className={style.row_box}>
              <Col span={8}>
                <Form.Item label="报案电话" name="hideContactPhone" labelCol={{flex: '0 0 120px'}}>
                  <Input placeholder="暂无" disabled />
                </Form.Item>
              </Col>
             <Col span={8}>
               <Form.Item label="来电人" name="customerName" labelCol={{flex: '0 0 120px'}}>
                 <Input placeholder="暂无" disabled />
               </Form.Item>
             </Col>
             <Col span={8}>
               <Form.Item label="车牌号" name="vehicleCode" labelCol={{flex: '0 0 120px'}}>
                 <Input placeholder="暂无" disabled />
               </Form.Item>
             </Col>
            </Row>
          </div>
          <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
            <Row className={style.detail_title}>工单信息</Row>
            <Row className={style.row_box}>
              <Col span={8}>
                <Form.Item label="工单号" name="traceCode" labelCol={{flex: '0 0 120px'}}>
                  <Input placeholder="暂无" disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <div style={{display: 'flex',width: '100%'}}>
                  <div className={style.form__item}>承保单位:</div>
                  <div style={{flex: '1 1'}}>
                    <Select
                        disabled
                        showArrow={false}
                        placeholder="暂无"
                        value={channelBranchId}
                        onChange={onChannelBranchId}
                        className={style.form_select_box}
                    >
                      {
                        underwritingList.map((item, key) => {
                          return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                        })
                      }
                    </Select>
                  </div>
                </div>
              </Col>
              <Col span={8} >
                <div style={{display: 'flex',width: '100%'}}>
                  <div className={style.form__item}>供应商:</div>
                  <div style={{flex: '1 1'}}>
                    <Select
                        disabled
                        showArrow={false}
                        placeholder="暂无"
                        value={providerId}
                        onCheange={onProviderId}
                        className={style.form_select_box}
                    >
                      {
                        userProviderList.map((item, key) => {
                          return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                        })
                      }
                    </Select>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className={style.row_box}>
              <Col span={8}>
                <Form.Item label="服务类型" name="serviceTypeId" labelCol={{flex: '0 0 120px'}}>
                  <Select showArrow={false} placeholder="暂无" disabled>
                    {
                      serviceTypeList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="服务项目" name="serviceId" labelCol={{flex: '0 0 120px'}}>
                  <Select placeholder="暂无" disabled showArrow={false}>
                    {
                      serviceItemList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row className={style.row_box}>
              <Col span={8}>
                <Form.Item label="服务地址" labelCol={{flex: '0 0 120px'}}>
                  <Select
                      disabled
                      placeholder="暂无"
                      showArrow={false}
                      value={detail.province && detail.province + ''}
                      className={style.form_area_item}
                  >
                    {
                      provinceList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                  <Select
                      disabled
                      placeholder="暂无"
                      showArrow={false}
                      value={detail.caseCity && detail.caseCity + ''}
                      className={style.form_area_item}
                  >
                    {
                      cityList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                  <Select
                      disabled
                      placeholder="暂无"
                      showArrow={false}
                      value={detail.regionId && detail.regionId + ''}
                      className={style.form_area_item}
                  >
                    {
                      regionList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="目的地址" labelCol={{flex: '0 0 120px'}}>
                  <Select
                      disabled
                      placeholder="暂无"
                      showArrow={false}
                      value={detail.destProvince && detail.destProvince + ''}
                      className={style.form_area_item}
                  >
                    {
                      provinceList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                  <Select
                      disabled
                      placeholder="暂无"
                      showArrow={false}
                      value={detail.destCity && detail.destCity + ''}
                      className={style.form_area_item}
                  >
                    {
                      destCityList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                  <Select
                      disabled
                      placeholder="暂无"
                      showArrow={false}
                      value={detail.destRegionId && detail.destRegionId + ''}
                      className={style.form_area_item}
                  >
                    {
                      destRegionList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form colon={false}>
              <Row className={style.row_box}>
                <Col span={8}>
                  <Form.Item label=" " labelCol={{flex: '0 0 120px'}}>
                    <Input placeholder="暂无" className={style.form_area_input} value={detail.caseAddress} disabled />
                    <Input placeholder="暂无" className={style.form_area_input} value={detail.caseAddressFlag} disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label=" " labelCol={{flex: '0 0 120px'}}>
                    <Input placeholder="暂无" className={style.form_area_input} value={detail.destination} disabled />
                    <Input placeholder="暂无" className={style.form_area_input} value={detail.destinationFlag} disabled />
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <Row className={style.row_box}>
              <Col span={8}>
                <Form.Item label="方位" name="positionId" labelCol={{flex: '0 0 120px'}}>
                  <Select disabled placeholder="暂无" showArrow={false}>
                    {
                      positionList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="故障类型" name="assistantType" labelCol={{flex: '0 0 120px'}}>
                  <Select disabled placeholder="暂无" showArrow={false}>
                    {
                      faultTypeList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="预估里程" name="estimateDistance" labelCol={{flex: '0 0 120px'}}>
                  <Input placeholder="暂无" disabled />
                </Form.Item>
              </Col>
            </Row>
              <Row className={style.row_box}>
                <Col span={8}>
                  <Form.Item label="报案时间" name="reportTime" labelCol={{flex: '0 0 120px'}}>
                    <Input placeholder="暂无" disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="预约时间" name="reservationTime" labelCol={{flex: '0 0 120px'}}>
                    <Input placeholder="暂无" disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form colon={false}>
                    <Form.Item label=" " labelCol={{flex: '0 0 20px'}}>
                      <Checkbox.Group
                          disabled
                          value={checkValue}
                          options={checkList}
                      />
                    </Form.Item>
                </Form>
              </Col>
              </Row>
            <Row className={style.row_box}>
              <Col span={8}>
                <Form.Item label="查勘员姓名" name="surveyoName" labelCol={{flex: '0 0 120px'}}>
                  <Input placeholder="暂无" disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="查勘员电话" name="surveyoTelephone" labelCol={{flex: '0 0 120px'}}>
                  <Input placeholder="暂无" disabled />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className={style.block__cont} style={{paddingBottom: '30px',marginTop: '20px'}}>
            <Row className={style.detail_title}>车辆及保险信息</Row>
            <Row className={style.row_box}>
              <Col span={8}>
                <Form.Item label="车辆品牌" name="carBrand" labelCol={{flex: '0 0 120px'}}>
                  <Input placeholder="暂无" disabled />
                </Form.Item>
              </Col>
              <Col span={8} >
                <div style={{display: 'flex',width: '100%'}}>
                  <div className={style.form__item}>车型:</div>
                  <div style={{flex: '1 1'}}>
                    <Select
                        disabled
                        value={carType}
                        placeholder="暂无"
                        showArrow={false}
                        onCheange={onCarType}
                        className={style.form_select_box}
                    >
                      {
                        carTypeList.map((item, key) => {
                          return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                        })
                      }
                    </Select>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <Form.Item label="颜色" name="carColor" labelCol={{flex: '0 0 120px'}}>
                  <Select disabled placeholder="暂无" showArrow={false}>
                    {
                      carColorList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="识别码" name="identityNo" labelCol={{flex: '0 0 120px'}}>
                  <Input placeholder="暂无" disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="保险公司" name="insurerId" labelCol={{flex: '0 0 120px'}}>
                  <Select disabled placeholder="暂无" showArrow={false}>
                    {
                      insuranceList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="保单号码" name="policyNo" labelCol={{flex: '0 0 120px'}}>
                  <Input placeholder="暂无" disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="车辆品牌(内部)" name="brandId" labelCol={{flex: '0 0 120px'}}>
                  <Select disabled placeholder="暂无" showArrow={false}>
                    {
                      carBrandList.map((item, key) => {
                        return <Option key={key} value={item.brandId}>{item.brandName}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="车辆车系" name="modelId" labelCol={{flex: '0 0 120px'}}>
                  <Select disabled placeholder="暂无" showArrow={false}>
                    {
                      carModelList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.modelName}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="注意事项" name='warningDescription' labelCol={{flex: '0 0 120px'}}>
                  <TextArea rows={5} placeholder="暂无" disabled/>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </>
  )
};
export default connect(({customerModal, orderPublic})=>({
  cityList: orderPublic.cityList,
  regionList: orderPublic.regionList,
  carTypeList: orderPublic.carTypeList,
  positionList: orderPublic.positionList,
  carColorList: orderPublic.carColorList,
  provinceList: orderPublic.provinceList,
  carBrandList: orderPublic.carBrandList,
  carModelList: orderPublic.carModelList,
  insuranceList: orderPublic.insuranceList,
  destCityList: customerModal.destCityList,
  faultTypeList: orderPublic.faultTypeList,
  destRegionList: customerModal.destRegionList,
  serviceTypeList: orderPublic.serviceTypeList,
  serviceItemList: orderPublic.serviceItemList,
  underwritingList: orderPublic.underwritingList,
  userProviderList: orderPublic.userProviderList,
}))(customerModalPage)
