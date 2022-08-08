import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {
  Button,
  Input,
  Form,
  Select,
  Radio,
  DatePicker,
  Spin,
} from "antd"
import style from "./style.less"
import moment, { locales } from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
// import BaiDuMap from "@/pages/order/rescueOrder/baiDuMap"
let map = null;
let searchTimer = null;
let valueList = []
let destValueList = []
var isAgreeShow = 0
let emptyData= 1
const secondStep = (props) => {
  let { dispatch, currentStep,toFirstStep, toThirdStep, echoSecondStepData, secondListData, serviceTypeList, serviceItemList, faultTypeList, positionList, provinceList, cityList, regionList, destProvinceList, destCityList, destRegionList } = props
  let [formData, setFormData] = useState({
    serviceTypeId: null,
    serviceId: null,
    province: null,
    caseCity: null,
    regionId: null,
  });
  const [form] = Form.useForm();
  const [stateValue, setStateValue] = useState(0); //是否事故车
  const [isAgree, setIsAgree] = useState(0); //是否预约单
  // const [isAgreeShow, setIsAgreeShow] = useState(0); //是否展示预约时间
  const [parentId, setParentId] = useState(null); //省id
  const [cityId, setCityId] = useState(null); //市id
  const [regionId, setRegionId] = useState(null); //地区id
  const [destParentId, setDestParentId] = useState(null); //目的省id
  const [destCityId, setDestCityId] = useState(null); //目的市id
  const [destRegionId, setDestRegionId] = useState(null); //目的地区id
  const [parentIdCode, setParentIdCode] = useState(null); //反写省id
  const [cityIdCode, setCityIdCode] = useState(null); //反写市id
  const [regionIdCode, setRegionIdCode] = useState(null); //反写地区id
  const [destParentIdCode, setDestParentIdCode] = useState(null); //反写目的省id
  const [destCityIdCode, setDestCityIdCode] = useState(null); //反写目的市id
  const [destRegionIdCode, setDestRegionIdCode] = useState(null); //反写目的地区id

  const [locationLatitude, setLocationLatitude] = useState(39.915087);//救援地纬度
  const [locationLongitude, setLocationLongitude] = useState(116.403981);//救援地经度
  const [destLatitude, setDestLatitude] = useState(null);//目的纬度
  const [destLongitude, setDestLongitude] = useState(null);//目的经度
  const [fetching, setFetching] = useState(false);


  const [parentIdList, setParentIdList] = useState([]); //反写省list
  const [cityIdList, setCityIdList] = useState([]); //反写市list
  const [regionIdList, setRegionIdList] = useState([]); //反写地区list
  const [destParentIdList, setDestParentIdList] = useState([]); //反写目的省list
  const [destCityIdList, setDestCityIdList] = useState([]); //反写目的市list
  const [destRegionIdList, setDestRegionIdList] = useState([]); //反写目的地区list

  const [rescueValue, setRescueValue] = useState([]); //救援具体地址
  const [destValue, setDestValue] = useState([]);//目的具体地址

  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  const [sendTime, setSendTime] = useState(null);

  useEffect(() => {
    scrollToTop()
    getConfigCode(1)
    getConfigCode(4)
    getConfigCode(7)
    getConfigCode(8)
    getModalConfigCode(1)
  }, [])

  // useEffect(() => {
  //   setParentIdList(provinceList)
  // }, [provinceList])
  // useEffect(() => {
  //   setCityIdList(cityList)
  // }, [cityList])
  // useEffect(() => {
  //   setRegionIdList(regionList)
  // }, [regionList])

  // useEffect(() => {
  //   setDestParentIdList(destProvinceList)
  // }, [destProvinceList])
  // useEffect(() => {
  //   setDestCityIdList(destCityList)
  // }, [destCityList])
  // useEffect(() => {
  //   setDestRegionIdList(destRegionList)
  // }, [destRegionList])

  let scrollToTop = () =>{
    var c = document.documentElement.scrollTop || document.body.scrollTop;
    if(c > 0){
      window.requestAnimationFrame(scrollToTop)
      window.scrollTo(0,c-c/8)
    }
  }

  /*获取公共列表*/
  let getConfigCode = (flag, parentId) => {
    /*1、省 2、市 3、区 4、服务类型 5、服务项目 6、承保单位
    7、方位 8、故障类型 9、车型 10.车辆颜色 11、保险公司*/
    let temp = {}
    if (flag === 1 || flag === 2 || flag === 3) {
      temp = {
        name: 'TOR_REGION',
        clause: flag === 1 ? 'level=1' : 'parent_id=' + parentId
      }
    }
    if (flag === 4) {
      temp = {
        name: 'TOR_SERVICE_TYPE',
        pageType: 'new',
        from: 'rescueOrder'
      }
    }
    if (flag === 5) {
      temp = {
        name: 'TOR_SERVICE',
        pageType: 'new',
        clause: 'service_type_id=' + parentId
      }
    }
    if (flag === 6) {
      temp = {
        name: 'tor_channel_branch',
        clause: 'parent_id=' + parentId
      }
    }
    if (flag === 7) {
      temp = {
        name: 'TOR_POSITION_TYPE',
      }
    }
    if (flag === 8) {
      temp = {
        name: 'TOR_ASSISTANT_TYPE',
      }
    }
    if (flag === 9) {
      temp = {
        name: 'TOR_CAR_TYPE',
      }
    }
    if (flag === 10) {
      temp = {
        name: 'TOR_COLOR',
      }
    }
    if (flag === 11) {
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
      flag,
      callback: (res) => {
        if (res.result.code === "0") {
          if (flag === 1) {
            setParentIdList(res.body)
          } else if (flag === 2) {
            setCityIdList(res.body)
          } else if (flag === 3) {
            setRegionIdList(res.body)
          }
        }
      }
    })
  }

  /*获取当前页面的 公共列表*/
  let getModalConfigCode = (flag, parentId) => {
    /*1、省 2、市 3、区 4、服务类型 5、服务项目 6、承保单位*/
    let temp = {}
    if (flag === 1 || flag === 2 || flag === 3) {
      temp = {
        name: 'TOR_REGION',
        clause: flag === 1 ? 'level=1' : 'parent_id=' + parentId
      }
    }
    dispatch({
      type: 'createNewOrder/getModalConfigCode',
      payload: {
        method: 'get',
        params: temp
      },
      flag,
      callback: (res) => {
        if (res.result.code === "0") {
          if (flag === 1) {
            setDestParentIdList(res.body)
          } else if (flag === 2) {
            setDestCityIdList(res.body)
          } else if (flag === 3) {
            setDestRegionIdList(res.body)
          }
        }
      }
    })
  }

  //预约单
  let onIsAgreeChange = (e) => {
    /*字段：reservationFlg*/
    isAgreeShow = e.target.value
    // setIsAgreeShow(e.target.value);
    setIsAgree(e.target.value)
  }
  //事故车
  let onIsAccident = (e) => {
    /*字段：isAccident*/
    setStateValue(e.target.value)
  }

  /*服务类型change 联动服务项目接口*/
  let onServiceTypeChange = (e) => {
    if (e) {
      getConfigCode(5, e)
    }
    dispatch({
      type: 'orderPublic/onReset',
      flag: 5
    })
    form.resetFields(['serviceId'])
  }
  /*省change 联动地区接口*/
  let onProvinceChange = (e) => {
    if (e) {
      getConfigCode(2, e)
    }
    dispatch({
      type: 'orderPublic/onReset',
      flag: 1
    })
    setParentId(e)
    setCityId(null)
    setRegionId(null)
    setRescueValue(null)
    form.resetFields(['caseAddress'])
    form.resetFields(['caseCity'])
    form.resetFields(['regionId'])
  }
  /*市change 联动区接口*/
  let onCityChange = (e) => {
    if (e) {
      getConfigCode(3, e)
    }
    dispatch({
      type: 'orderPublic/onReset',
      flag: 3
    })
    setCityId(e)
    setRegionId(null)
    setRescueValue(null)
    form.resetFields(['caseAddress'])
    form.resetFields(['regionId'])
  }
  /*区change*/
  let onRegionChange = (e) => {
    setRegionId(e)
    setRescueValue(null)
    form.resetFields(['caseAddress'])
  }

  /*省change 联动地区接口*/
  let onDestProvinceChange = (e) => {
    if (e) {
      getModalConfigCode(2, e)
    }
    setDestParentId(e)
    setDestCityId(null)
    setDestRegionId(null)
    setDestValue(null)
    form.resetFields(['destination'])
    form.resetFields(['destCity'])
    form.resetFields(['destRegionId'])
  }
  /*市change 联动区接口*/
  let onDestCityChange = (e) => {
    if (e) {
      getModalConfigCode(3, e)
    }
    setDestCityId(e)
    setDestRegionId(null)
    setDestValue(null)
    form.resetFields(['destination'])
    form.resetFields(['destRegionId'])
  }
  /*区change*/
  let onDestRegionChange = (e) => {
    setDestRegionId(e)
    setDestValue(null)
    form.resetFields(['destination'])
  }

  let timingPush = (e) => {
    setSendTime(e)
  }

  useEffect(() => {
    map = new window.BMap.Map('b-map'); // 创建Map实例
  })
  const clearSearch = (id) => {
    if (id == 1) {
      setRescueValue([])
    } else {
      setDestValue([])
    }
  }
  //函数防抖
  let searchPlace = (searchValue, id) => {
    clearTimeout(searchTimer);
    setFetching(true)
    clearSearch(id);
    searchTimer = setTimeout(() => {
      searchPlaceFunc(searchValue, id)
    }, 500)
  }
  //搜索地址
  const searchPlaceFunc = (searchValue, id) => {
    if (!searchValue) {
      clearSearch(id)
      setFetching(false)
    } else {
      if (id == 1) {
        var caseAdd = "caseAddress"
      } else {
        var caseAdd = "destination"
      }
      let local = new window.BMap.Autocomplete({

        "input": caseAdd,
        "location": map,
        "onSearchComplete": function (results) {
          let toSearList = results.Br || results.Cr || results.Kr;
          let itemUpdateList = toSearList.map((item, index) => {
            return {
              id: index,
              codeDesc: item.business,
              address: item.city + item.district,
            }
          })
          setFetching(false)
          if (id == 1) {
            setRescueValue(itemUpdateList)
            valueList = itemUpdateList
          } else {
            setDestValue(itemUpdateList)
            destValueList = itemUpdateList
          }
        }
      });
      local.search(searchValue);
    }
  }
  //救援具体地址选择回调
  let setCaseAddress = (e, id) => {
    let lat = secondConfirm(valueList, e)
    getCode(lat.address + lat.codeDesc, id)
    dispatch({
      type: "comboModal/addressAnalyze",
      payload: {
        method: 'get',
        caseAddress: lat.address + lat.codeDesc
      },
      callback: (res) => {
        if (res.result.code === "0") {
          setReverse(res.body, id)
        }
      }
    })
  }
  //目的地具体地址选择回调
  let setDestination = (e, id) => {
    let lat = secondConfirm(destValueList, e)
    getCode(lat.address + lat.codeDesc, id)
    dispatch({
      type: "comboModal/addressAnalyze",
      payload: {
        method: 'get',
        caseAddress: lat.address + lat.codeDesc
      },
      callback: (res) => {
        if (res.result.code === "0") {
          setReverse(res.body, id)
        }
      }
    })
  }
  /*通过地址获取经纬度*/
  let getCode = (address, id) => {
    let myCode = new window.BMap.Geocoder()
    myCode.getPoint(address, function (point) {
      if (id == 0) {
        setLocationLatitude(point.lat)
        setLocationLongitude(point.lng)
      } else {
        setDestLatitude(point.lat)
        setDestLongitude(point.lng)
      }
    })
  }
  /*反写省市区*/
  let setReverse = (res, id) => {
    if (res) {
      if (id == 0) {
        setParentIdCode(res.provinceId)
        setCityIdCode(res.cityId)
        setRegionIdCode(res.districtId)
        /*有服务省 就请求 服务城市接口*/
        if (res.provinceId) {
          getConfigCode(1);
          // getConfigCode(2, res.provinceId);
          cityList = new Promise((resolve, resolved) => {
            dispatch({
              type: 'orderPublic/getConfigCode',
              payload: {
                method: 'get',
                params: {
                  name: 'TOR_REGION',
                  clause: 'parent_id=' + res.provinceId
                },
              },
              callback: (res) => {
                setCityIdList(res.body)
                resolve(res.body)
              }
            })
          })

        }
        /*有服务城市 就请求 服务地区接口*/
        if (res.cityId) {
          // getConfigCode(3, res.cityId)
          regionList = new Promise((resolve, resolved) => {
            dispatch({ 
              type: 'orderPublic/getConfigCode',
              payload: {
                method: 'get',
                params: {
                  name: 'TOR_REGION',
                  clause: 'parent_id=' + res.cityId
                },
              },
              callback: (res) => {
                setRegionIdList(res.body)
                resolve(res.body)
              }
            })
          })
        }

        Promise.all([provinceList, cityList, regionList]).then(resolve => {
          setParentIdList(resolve[0])
          // setCityIdList(resolve[1])
          // setRegionIdList(resolve[2])
          let list1 = secondConfirm(resolve[0], res.provinceId)
          let list2 = secondConfirm(resolve[1], res.cityId)
          let list3 = secondConfirm(resolve[2], res.districtId)
          form.setFieldsValue({
            province: list1.codeDesc,
            caseCity: list2.codeDesc,
            regionId: list3.codeDesc,
          })
        })

      } else {
        setDestParentIdCode(res.provinceId)
        setDestCityIdCode(res.cityId)
        setDestRegionIdCode(res.districtId)
        /*有服务省 就请求 服务城市接口*/
        if (res.provinceId) {
          getModalConfigCode(1)
          // getConfigCode(2, res.provinceId);
          destCityList = new Promise((resolve, resolved) => {
            dispatch({
              type: 'comboModal/getModalConfigCode',
              payload: {
                method: 'get',
                params: {
                  name: 'TOR_REGION',
                  clause: 'parent_id=' + res.provinceId
                },
              },
              callback: (res) => {
                setDestCityIdList(res.body)
                resolve(res.body)
              }
            })
          })

        }
        /*有服务城市 就请求 服务地区接口*/
        if (res.cityId) {
          // getConfigCode(3, res.cityId)
          destRegionList = new Promise((resolve, resolved) => {
            dispatch({
              type: 'comboModal/getModalConfigCode',
              payload: {
                method: 'get',
                params: {
                  name: 'TOR_REGION',
                  clause: 'parent_id=' + res.cityId
                },
              },
              callback: (res) => {
                setDestRegionIdList(res.body)
                resolve(res.body)
              }
            })
          })
        }
        Promise.all([destProvinceList, destCityList, destRegionList]).then(resBody => {
          setDestParentIdList(resBody[0])
          // setDestCityIdList(resBody[1])
          // setDestRegionIdList(resBody[2])
          let list1 = secondConfirm(resBody[0], res.provinceId)
          let list2 = secondConfirm(resBody[1], res.cityId)
          let list3 = secondConfirm(resBody[2], res.districtId)
          form.setFieldsValue({
            destProvince: list1.codeDesc,
            destCity: list2.codeDesc,
            destRegionId: list3.codeDesc,
          })
        })
      }
    }
  }

  //二次确认数据
  let secondConfirm = (list, id1) => {
    let newList = list.filter(item => {
      return id1 == item.id
    })
    if (newList.length) {
      return newList[0]
    } else {
      return ''
    }
  }

  useEffect(() => {
    form.resetFields()
    if (echoSecondStepData) {
      for (let x in formData) {
        formData[x] = echoSecondStepData[x] ? echoSecondStepData[x] : formData[x] // 避免回来重新选择单选出现未选择的情况
      }
      setFormData({ ...formData })
      if (echoSecondStepData && echoSecondStepData.reservationFlg == 1) {
        isAgreeShow = 1
        // setIsAgreeShow(1)
        setSendTime(moment(echoSecondStepData.reservationTime, 'YYYY-MM-DD HH:mm:ss'))
      }
      isAgreeShow = secondListData.isAgreeShow
      // setIsAgreeShow(secondListData.isAgreeShow)
      setStateValue(secondListData.isAccident)
      setIsAgree(secondListData.reservationFlg)

      //回显省市区
      setParentIdList(secondListData.parentIdList)
      setCityIdList(secondListData.cityIdList)
      setRegionIdList(secondListData.regionIdList)
      setDestParentIdList(secondListData.destParentIdList)
      setDestCityIdList(secondListData.destCityIdList)
      setDestRegionIdList(secondListData.destRegionIdList)
      setLocationLatitude(secondListData.locationLatitude)
      setLocationLongitude(secondListData.locationLongitude)
      setDestLatitude(secondListData.destLatitude)
      setDestLongitude(secondListData.destLongitude)
      setRescueValue(secondListData.rescueValue)
      setDestValue(secondListData.destValue)
      setParentIdCode(secondListData.parentIdCode)
      setCityIdCode(secondListData.cityIdCode)
      setRegionIdCode(secondListData.regionIdCode)
      setDestParentIdCode(secondListData.destParentIdCode)
      setDestCityIdCode(secondListData.destCityIdCode)
      setDestRegionIdCode(secondListData.destRegionIdCode)
      form.setFieldsValue({
        ...echoSecondStepData,
        reservationTime: echoSecondStepData && echoSecondStepData.reservationFlg == 1 ? moment(echoSecondStepData.reservationTime, 'YYYY-MM-DD HH:mm:ss') :'',
      })
    } else {
      form.resetFields()
    }

  }, [echoSecondStepData])

  /*返回上一步*/
  let backOff = () => {
    dispatch({
      type: 'createNewOrder/setCurrentStep',
      payload: 0
    })
  }

  useEffect(() => {
    if (toFirstStep) {
      backOff()
    }
  }, [toFirstStep])

  /*点击标题切换判断必填*/
  useEffect(() => {
    if (toThirdStep) {
      form.validateFields().then(values => {
        nextStep()
      })
        .catch(errorInfo => {
        });
    }
  }, [toThirdStep])

  /*下一步*/
  let nextStep = () => {
    emptyData = 2
    getDetailInfoData()
    dispatch({
      type: 'createNewOrder/setCurrentStep',
      payload: 2
    })
  }

  //获取第二页预览与必填数据
  let getDetailInfoData = () => {
    let latitude = {}
    let longitude = {}
    let parentList
    let cityList
    let regionList
    let destParentList
    let destCityList
    let destRegionList
    let rescueValueList
    let destValueList
    let cityListCode
    let parentListCode
    let regionListCode
    let destParentListCode
    let destCityListCode
    let destRegionListCode
    if(emptyData == 1 ){
      parentList = []
      cityList = []
      regionList = []
      destParentList = []
      destCityList = []
      destRegionList = []
      rescueValueList = []
      destValueList = []
      parentListCode = null
      cityListCode = null
      regionListCode = null
      destParentListCode = null
      destCityListCode = null
      destRegionListCode = null
    }else{
      parentList = parentIdList
      cityList = cityIdList
      regionList=regionIdList
      destParentList = destParentIdList
      destCityList = destCityIdList
      destRegionList = destRegionIdList
      rescueValueList = rescueValue
      destValueList = destValue
      parentListCode = parentIdCode
      cityListCode = cityIdCode
      regionListCode = regionIdCode
      destParentListCode = destParentIdCode
      destCityListCode = destCityIdCode
      destRegionListCode = destRegionIdCode
    }
    if (locationLatitude == 39.915087 && locationLongitude == 116.403981) {
      latitude = null
      longitude = null
    } else {
      latitude = locationLatitude
      longitude = locationLongitude
    }
    let isAccidentId= 0
    let reservatId = 0
    if (stateValue === undefined) {
      isAccidentId = 0
    } else {
      isAccidentId = stateValue
    }
    if(isAgree === undefined){
      reservatId = 0
    }else{
      reservatId = isAgree
    }

    if(isAgreeShow === undefined){
      isAgreeShow = 0
    }
    let timeShow = null
    if(isAgreeShow == 1){
      timeShow =  moment(sendTime).format('YYYY-MM-DD HH:mm:ss')
    }else{
      timeShow = null
    }
    let secondListDataArr = {
      "parentIdList": parentList,
      "cityIdList": cityList,
      "regionIdList": regionList,
      "destParentIdList": destParentList,
      "destCityIdList": destCityList,
      "destRegionIdList": destRegionList,
      "locationLatitude": latitude,
      "locationLongitude": longitude,
      "destLatitude": destLatitude,
      "destLongitude": destLongitude,
      "rescueValue": rescueValueList,
      "destValue": destValueList,
      "parentIdCode": parentListCode,
      "cityIdCode": cityListCode,
      "regionIdCode": regionListCode,
      "destParentIdCode": destParentListCode,
      "destCityIdCode": destCityListCode,
      "destRegionIdCode": destRegionListCode,
      "isAccident": isAccidentId,
      "reservationFlg": reservatId,
      "sendTime": timeShow,
      "isAgreeShow": isAgreeShow,
      "emptyData":emptyData,
    }
    // 暂存第二步省市区数据
    dispatch({
      type: 'createNewOrder/setSecondListData',
      payload: {
        secondListData: secondListDataArr,
      }
    })
  }
  useEffect(() => {
    if (secondListData) {
      let secondStep = form.getFieldsValue()
      secondStep.isAccident = secondListData.isAccident
      secondStep.reservationFlg = secondListData.reservationFlg
      secondStep.locationLatitude = secondListData.locationLatitude
      secondStep.locationLongitude = secondListData.locationLongitude
      secondStep.destLatitude = secondListData.destLatitude
      secondStep.destLongitude = secondListData.destLongitude
      if (secondListData.isAgreeShow == 0) {
        secondStep.reservationTime = null
      } else {
        secondStep.reservationTime = moment(secondListData.sendTime).format('YYYY-MM-DD HH:mm:ss')
      }
      //获取第二页预览数据
      let serviceTypeIdStr = secondConfirm(serviceTypeList, secondStep.serviceTypeId)
      let serviceIdStr = secondConfirm(serviceItemList, secondStep.serviceId)
      let positionIdStr = secondConfirm(positionList, secondStep.positionId)
      let assistantTypeStr = secondConfirm(faultTypeList, secondStep.assistantType)
      //省市区
      let provinceStr = []
      let caseCityStr = []
      let regionIdStr = []
      if (secondListData.parentIdCode) {
        provinceStr = secondConfirm(secondListData.parentIdList, secondListData.parentIdCode)
        secondStep.province = provinceStr.id
      } else {
        provinceStr = secondConfirm(provinceList, secondStep.province)
      }
      if (secondListData.cityIdCode) {
        caseCityStr = secondConfirm(secondListData.cityIdList, secondListData.cityIdCode)
        secondStep.caseCity = caseCityStr.id
      } else {
        caseCityStr = secondConfirm(cityList, secondStep.caseCity)
      }
      if (secondListData.regionIdCode) {
        regionIdStr = secondConfirm(secondListData.regionIdList, secondListData.regionIdCode)
        secondStep.regionId = regionIdStr.id
      } else {
        regionIdStr = secondConfirm(regionList, secondStep.regionId)
      }
      //目标省市区
      let destProvinceStr = []
      let destCityStr = []
      let destRegionIdStr = []
      if (secondListData.destParentIdCode) {
        destProvinceStr = secondConfirm(secondListData.destParentIdList, secondListData.destParentIdCode)
        secondStep.destProvince = destProvinceStr.id
      } else {
        if(destProvinceList){
          destProvinceStr = secondConfirm(destProvinceList, secondStep.destProvince)
        }
      }
      if (secondListData.destCityIdCode) {
        destCityStr = secondConfirm(secondListData.destCityIdList, secondListData.destCityIdCode)
        secondStep.destCity = destCityStr.id
      } else {
        if(destCityList){
          destCityStr = secondConfirm(destCityList, secondStep.destCity)
        }
      }
      if (secondListData.destRegionIdCode) {
        destRegionIdStr = secondConfirm(secondListData.destRegionIdList, secondListData.destRegionIdCode)
        secondStep.destRegionId = destRegionIdStr.id
      } else {
        if(destRegionList){
          destRegionIdStr = secondConfirm(destRegionList, secondStep.destRegionId)
        }
      }
      //具体地址
      let lat = []
      if (secondListData.rescueValue && secondListData.rescueValue.length > 0) {
        if (typeof secondStep.caseAddress === 'string') {
          secondStep.caseAddress = secondStep.caseAddress
          // lat.codeDesc = secondStep.caseAddress
        } else {
          lat = secondConfirm(secondListData.rescueValue, secondStep.caseAddress)
          secondStep.caseAddress = lat.address + lat.codeDesc
        }
      }
      let destLat = []
      if (secondListData.destValue && secondListData.destValue.length > 0) {
        if (typeof secondStep.destination === 'string') {
          secondStep.destination = secondStep.destination
          // destLat.codeDesc = secondStep.destination
        } else {
          destLat = secondConfirm(secondListData.destValue, secondStep.destination)
          secondStep.destination = destLat.address + destLat.codeDesc
        }
      }
      let secondDetileInfo = {
        "serviceTypeId": serviceTypeIdStr.codeDesc,
        "serviceId": serviceIdStr.codeDesc,
        "positionId": positionIdStr.codeDesc,
        "assistantType": assistantTypeStr.codeDesc,
        "province": provinceStr.codeDesc,
        "caseCity": caseCityStr.codeDesc,
        "regionId": regionIdStr.codeDesc,
        "destProvince": destProvinceStr.codeDesc,
        "destCity": destCityStr.codeDesc,
        "destRegionId": destRegionIdStr.codeDesc,
        "caseAddress": secondStep.caseAddress,
        "destination": secondStep.destination,
      }
      // 暂存第二步必填字段
      dispatch({
        type: 'createNewOrder/setEditEchoSecondStepData',
        payload: {
          echoSecondStepData: secondStep,
        }
      })
      // 暂存第二步预览字段
      dispatch({
        type: 'createNewOrder/setSecondStepDetile',
        payload: {
          secondStepDetile: secondDetileInfo,
        }
      })
    }
  }, [secondListData])

  useEffect(() => {
    if(locationLongitude && locationLatitude){
      let map = new window.BMap.Map("mapContainer");    // 创建Map实例
      let currentPoint = new window.BMap.Point(locationLongitude, locationLatitude);
      map.centerAndZoom(currentPoint, 16);  // 初始化地图,设置中心点坐标和地图级别
      map.setCenter(currentPoint);// 设置中心点
      map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
      map.clearOverlays();
      let my_location = new window.BMap.Icon(require("@/assets/map/rescueOrder_new_start.png"), new window.BMap.Size(32, 47),{ imageSize: new window.BMap.Size(32, 47)}); // 设置当前自身位置自定义图标
      let accident = new window.BMap.Marker(currentPoint, { icon: my_location });
      map.addOverlay(accident);// 添加中心
  
      //设置路线
      let p1 = new window.BMap.Point(locationLongitude, locationLatitude);
      let p2 = new window.BMap.Point(destLongitude, destLatitude);
      let startIcon = new window.BMap.Icon(require("@/assets/map/rescueOrder_new_start.png"), new window.BMap.Size(32, 47),{ imageSize: new window.BMap.Size(32, 47)}); // 开始
      let endIcon = new window.BMap.Icon(require("@/assets/map/rescueOrder_new_end.png"), new window.BMap.Size(32, 47),{ imageSize: new window.BMap.Size(32, 47)}); // 终点
      let routeLine = null;
      var transit = new window.BMap.DrivingRoute(map, {
        renderOptions: {
          map: map
        },
        onPolylinesSet: function (routes) {
          routeLine = routes[0].getPolyline(); //导航路线
          var start = [p1];
          var newPoint = start.concat(routeLine.getPath(), [p2]);
          routeLine.setPath(newPoint);
          routeLine.setStrokeColor('#00A951');
          routeLine.setStrokeOpacity(1);
          routeLine.setStrokeWeight(7);
          map.addOverlay(routeLine);
        },
        onMarkersSet: function (routes) {
          routes[0].marker.setIcon(startIcon);
          routes[1].marker.setIcon(endIcon)
        }
      });
      transit.search(p1, p2);
    }
    
  }, [locationLongitude, locationLatitude,destLatitude,destLongitude])

  return (
    <>
      <div id="b-map" style={{ display: 'none' }}></div>
      <div className={style.second_step}>
        <Form form={form} onFinish={nextStep} >
          <div className={style.sub_title_1}><i>*</i>选择服务项目</div>
          <div className={style.item_form_title}>
            <Form.Item label="服务类型" className={style.item_form} labelCol={{ flex: '0 0 76px' }}>
              <Form.Item
                name="serviceTypeId"
                noStyle
                rules={[{ required: true, message: '必填信息' }]}
              >
                <Select placeholder="请选择" allowClear onChange={onServiceTypeChange}>
                  {
                    serviceTypeList.map((item, key) => {
                      return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Form.Item>
            <Form.Item label="服务项目" className={style.item_form} labelCol={{ flex: '0 0 76px' }}>
              <Form.Item
                name="serviceId"
                noStyle
                rules={[{ required: true, message: '必填信息' }]}
              >
                <Select placeholder="请选择" allowClear showSearch>
                  {
                    serviceItemList.map((item, key) => {
                      return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Form.Item>
          </div>

          <div className={style.sub_title}><i>*</i>服务信息</div>
          <div className={style.item_form_title}>
            <div className={style.item_form}>
              <Form.Item label="救援地址" labelCol={{ flex: '0 0 76px' }} style={{ marginBottom: 0 }}>
                <div className={style.col_box}>
                  <Form.Item
                    name="province"
                    rules={[{ required: true, message: '必填信息' }]}
                    className={style.item_form_city}
                  >
                    <Select placeholder="省" allowClear onChange={onProvinceChange}  >
                      {
                        parentIdList && parentIdList.length > 0 ? parentIdList.map((item, key) => {
                          return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                        })
                          : ''
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="caseCity"
                    rules={[{ required: true, message: '必填信息' }]}
                    className={style.item_form_other}
                  >
                    <Select placeholder="市" allowClear onChange={onCityChange}   >
                      {
                        cityIdList && cityIdList.length > 0 ? cityIdList.map((item, key) => {
                          return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                        })
                          : ''
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="regionId"
                    rules={[{ required: true, message: '必填信息' }]}
                    className={style.item_form_other}
                  >
                    <Select placeholder="区" allowClear onChange={onRegionChange}  >
                      {
                        regionIdList && regionIdList.length > 0 ? regionIdList.map((item, key) => {
                          return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                        })
                          : ''
                      }
                    </Select>
                  </Form.Item>
                </div>
              </Form.Item>
            </div>
            <div className={style.col_box_address}>
              <Form.Item name="caseAddress" className={style.item_form_address} rules={[{ required: true, message: '必填信息' }]}>
                <Select placeholder="具体地址（如人民路号）" allowClear showSearch
                  onSearch={(e) => searchPlace(e, 1)} filterOption={false} optionLabelProp="label"
                  notFoundContent={fetching ? <Spin size="small" /> : '暂无数据'} onChange={(e) => setCaseAddress(e, 0)}>
                  {
                    rescueValue && rescueValue.length > 0 ? rescueValue.map((item, key) => {
                      return <Option key={key} value={item.id} label={item.address + item.codeDesc}>
                        <div className={style.my_option}>
                          <div className={style.sel_title}>{item.codeDesc}</div>
                          <div className={style.sel_desc}>{item.address}</div>
                        </div>
                      </Option>
                    })
                      : ''
                  }
                </Select>
              </Form.Item>
              <Form.Item name="caseAddressFlag" className={style.item_form_address_right} >
                <Input placeholder="地点名称（如人民公园）" allowClear />
              </Form.Item>
            </div>

            <div className={style.item_form}>
              <Form.Item label="目的地址" labelCol={{ flex: '0 0 76px' }} style={{ marginBottom: 0 }}>
                <div className={style.col_box}>
                  <Form.Item
                    name="destProvince"
                    className={style.item_form_city}
                  >
                    <Select placeholder="省" allowClear onChange={onDestProvinceChange} value={destParentId}>
                      {
                        destParentIdList && destParentIdList.length > 0 ? destParentIdList.map((item, key) => {
                          return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                        })
                          : ''
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="destCity"
                    className={style.item_form_other}
                  >
                    <Select placeholder="市" allowClear onChange={onDestCityChange} value={destCityId}  >
                      {
                        destCityIdList && destCityIdList.length > 0 ? destCityIdList.map((item, key) => {
                          return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                        })
                          : ''
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="destRegionId"
                    className={style.item_form_other}
                  >
                    <Select placeholder="区" allowClear onChange={onDestRegionChange} value={destRegionId} >
                      {
                        destRegionIdList && destRegionIdList.length > 0 ? destRegionIdList.map((item, key) => {
                          return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                        })
                          : ''
                      }
                    </Select>
                  </Form.Item>
                </div>
              </Form.Item>
            </div>
            <div className={style.col_box_address}>
              <Form.Item name="destination" className={style.item_form_address} colon={false}>
                <Select placeholder="具体地址（如人民路号）" showSearch allowClear
                  onSearch={(e) => searchPlace(e, 2)} filterOption={false} optionLabelProp="label"
                  notFoundContent={fetching ? <Spin size="small" /> : '暂无数据'} onChange={(e) => setDestination(e, 2)}>
                  {
                    destValue && destValue.length > 0 ? destValue.map((item, key) => {
                      return <Option key={key} value={item.id} label={item.address + item.codeDesc}>
                        <div className={style.my_option}>
                          <div className={style.sel_title}>{item.codeDesc}</div>
                          <div className={style.sel_desc}>{item.address}</div>
                        </div>
                      </Option>
                    })
                      : ''
                  }
                </Select>
              </Form.Item>
              <Form.Item name="destinationFlag" className={style.item_form_address_right} colon={false}>
                <Input placeholder="地点名称（如人民公园）" allowClear />
              </Form.Item>
            </div>

            <div className={style.col_box_map}>
              <div className={style.map_content} id={'mapContainer'} />
            </div>

            <Form.Item label="车辆位置" className={style.item_form} labelCol={{ flex: '0 0 76px' }}>
              <Form.Item
                name="positionId"
                noStyle
                rules={[{ required: true, message: '必填信息' }]}
              >
                <Select placeholder="请选择" allowClear>
                  {
                    positionList.map((item, key) => {
                      return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Form.Item>
            <Form.Item label="故障类型" className={style.item_form} labelCol={{ flex: '0 0 76px' }}>
              <Form.Item
                name="assistantType"
                noStyle
                rules={[{ required: true, message: '必填信息' }]}
              >
                <Select placeholder="请选择" allowClear>
                  {
                    faultTypeList.map((item, key) => {
                      return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Form.Item>

            <Form.Item label="事故车" name="isAccident" className={style.item_form} labelCol={{ flex: '0 0 76px' }}>
              <Radio.Group value={stateValue} onChange={onIsAccident} defaultValue={0}>
                <Radio value={1} className={style.radio_item}>是</Radio>
                <Radio value={0} className={style.radio_item}>否</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="预约单" name="reservationFlg" className={style.item_form} labelCol={{ flex: '0 0 76px' }}>
              <Radio.Group value={isAgree} onChange={onIsAgreeChange} defaultValue={0}>
                <Radio value={1} className={style.radio_item}>是</Radio>
                <Radio value={0} className={style.radio_item}>否</Radio>
              </Radio.Group>
            </Form.Item>

            {
              isAgreeShow == 1 ?
                <Form.Item label="预约时间" className={style.item_form} labelCol={{ flex: '0 0 76px' }}>
                  <Form.Item
                    name="reservationTime"
                    noStyle
                    rules={[{ required: true, message: '必填信息' }]}
                  >
                    <DatePicker style={{ width: '100%' }} showTime format={dateFormat} onChange={(e) => { timingPush(e) }} onOk={(e) => { timingPush(e) }} value={sendTime ? moment(sendTime, dateFormat) : null} initialValues={sendTime ? moment(sendTime, dateFormat) : null} />
                  </Form.Item>
                </Form.Item>
                :
                ""
            }

          </div>

          <div className={style.btn_content}>
            <Button className={`${style.next_setp} ${style.part_gap}`} onClick={backOff}>上一步</Button>
            <Button type="primary" htmlType="submit" className={style.next_setp} >下一步</Button>
          </div>
        </Form>
      </div>
    </>
  )
};
export default connect(({ createNewOrder, orderPublic }) => ({
  echoSecondStepData: createNewOrder.echoSecondStepData,
  secondStepDetile: createNewOrder.secondStepDetile,
  secondListData: createNewOrder.secondListData,
  currentStep: createNewOrder.currentStep,
  toFirstStep: createNewOrder.toFirstStep,
  toThirdStep: createNewOrder.toThirdStep,
  serviceTypeList: orderPublic.serviceTypeList,
  serviceItemList: orderPublic.serviceItemList,
  faultTypeList: orderPublic.faultTypeList,
  positionList: orderPublic.positionList,
  provinceList: orderPublic.provinceList,
  cityList: orderPublic.cityList,
  regionList: orderPublic.regionList,
  destProvinceList: createNewOrder.destProvinceList,
  destCityList: createNewOrder.destCityList,
  destRegionList: createNewOrder.destRegionList,
}))(secondStep)
