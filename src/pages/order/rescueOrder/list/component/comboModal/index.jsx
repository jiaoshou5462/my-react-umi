import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {
  Modal,
  Table,
  Form,
  Row,
  Col,
  Select,
  message,
  Button,
  Space,
  Input,
  Radio,
  DatePicker,
  Tooltip,
  Spin,
} from "antd"
import style from "./style.less"
import moment from 'moment'
import 'moment/locale/zh-cn'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import SaveModal from "../saveModal"
const { TextArea } = Input
moment.locale('zh-cn')
let map = null;
let searchTimer = null;
let channelId = localStorage.getItem('tokenObj') && JSON.parse(localStorage.getItem('tokenObj')).channelId || ''
let valueList = []
let destValueList = []
const operationModalPage = (props) => {
  let { dispatch, comboVisible, onCallbackSetSales, editNo, location, detail,
    underwritingList, serviceTypeList, serviceItemList, provinceList, cityList, regionList, faultTypeList, positionList, carTypeList, carColorList, destProvinceList, destCityList, destRegionList } = props
  const [form] = Form.useForm();
  const [stateValue, setStateValue] = useState(0); //是否事故车
  const [isAgree, setIsAgree] = useState(0); //是否预约单
  const [isAgreeShow, setIsAgreeShow] = useState(0); //是否展示预约时间
  const [saveVisible, setSaveVisible] = useState(false); // 是否展示弹窗
  const [detailValue, setDetailValue] = useState(null); // 新建订单预览
  const [detailNerArr, setDetailNerArr] = useState({}); // 新建订单预览选择框数据
  const [parentId, setParentId] = useState(null); //省id
  const [cityId, setCityId] = useState(null); //市id
  const [regionId, setRegionId] = useState(null); //地区id
  const [destParentId, setDestParentId] = useState(null); //目的省id
  const [destCityId, setDestCityId] = useState(null); //目的市id
  const [destRegionId, setDestRegionId] = useState(null); //目的地区id
  const [value, setValue] = useState([]); //救援具体地址
  const [destValue, setDestValue] = useState([]);//目的具体地址

  const [locationLatitude, setLocationLatitude] = useState(null);//救援地纬度
  const [locationLongitude, setLocationLongitude] = useState(null);//救援地经度
  const [destLatitude, setDestLatitude] = useState(null);//目的纬度
  const [destLongitude, setDestLongitude] = useState(null);//目的经度
  const [fetching, setFetching] = useState(false);

  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  const [sendTime, setSendTime] = useState(null);

  const [parentIdCode, setParentIdCode] = useState(null); //反写省id
  const [cityIdCode, setCityIdCode] = useState(null); //反写市id
  const [regionIdCode, setRegionIdCode] = useState(null); //反写地区id
  const [destParentIdCode, setDestParentIdCode] = useState(null); //反写目的省id
  const [destCityIdCode, setDestCityIdCode] = useState(null); //反写目的市id
  const [destRegionIdCode, setDestRegionIdCode] = useState(null); //反写目的地区id

  const [parentIdList, setParentIdList] = useState([]); //反写省list
  const [cityIdList, setCityIdList] = useState([]); //反写市list
  const [regionIdList, setRegionIdList] = useState([]); //反写地区list
  const [destParentIdList, setDestParentIdList] = useState([]); //反写目的省list
  const [destCityIdList, setDestCityIdList] = useState([]); //反写目的市list
  const [destRegionIdList, setDestRegionIdList] = useState([]); //反写目的地区list

  useEffect(() => {
    if (comboVisible) {
      setValue([])
      setDestValue([])
      getConfigCode(1)
      getConfigCode(4)
      getConfigCode(7)
      getConfigCode(8)
      getConfigCode(9)
      getConfigCode(10)
      getModalConfigCode(1)
      getConfigCode(6, channelId)
      if (editNo == 1) {
        form.resetFields()
        setStateValue(0)
        setIsAgree(0)
        setIsAgreeShow(0)

        setSendTime(null)


        //清空省市区
        setParentId(null)
        setCityId(null)
        setRegionId(null)
        setDestParentId(null)
        setDestCityId(null)
        setDestRegionId(null)

        dispatch({
          type: 'orderPublic/getUserProviderList',
          payload: {
            method: 'get',
            params: {}
          },
        })
      } else {
        form.resetFields()
        getDetail()
      }
    }

  }, [comboVisible])

  useEffect(() => {
    setParentIdList(provinceList)
  }, [provinceList])
  useEffect(() => {
    setCityIdList(cityList)
  }, [cityList])
  useEffect(() => {
    setRegionIdList(regionList)
  }, [regionList])

  useEffect(() => {
    setDestParentIdList(destProvinceList)
  }, [destProvinceList])
  useEffect(() => {
    setDestCityIdList(destCityList)
  }, [destCityList])
  useEffect(() => {
    setDestRegionIdList(destRegionList)
  }, [destRegionList])

  //编辑时请求数据
  let getDetail = () => {
    dispatch({
      type: 'rescueOrderDetail/getDetail',
      payload: {
        method: 'postJSON',
        params: {
          caseId: location
        }
      },
    })
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
      flag
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
      type: 'comboModal/getModalConfigCode',
      payload: {
        method: 'get',
        params: temp
      },
      flag
    })
  }

  //同步编辑数据
  useEffect(() => {
    if (Object.keys(detail).length > 0) {
      let torCaseCar = detail.torCaseCar || {}
      let caseWorkSheet = detail.caseWorkSheet || {}
      let torDriverPosition = detail.torDriverPosition || {}
      let { brandId, modelId } = torCaseCar
      let data = {
        ...detail,
        ...torCaseCar,
        ...caseWorkSheet,
        ...torDriverPosition,
        brandId: brandId && brandId + '',
        carType: detail.carType && detail.carType + '',
        carColor: detail.carColor && detail.carColor + '',
        serviceId: detail.serviceId && detail.serviceId + '',
        positionId: detail.positionId && detail.positionId + '',
        assistantType: detail.assistantType && detail.assistantType + '',
        serviceTypeId: detail.serviceTypeId && detail.serviceTypeId + '',
        channelBranchId: detail.channelBranchId && detail.channelBranchId + '',
        reservationTime: detail.reservationTime && moment(detail.reservationTime, 'YYYY-MM-DD HH:mm:ss'),
        province: detail.province && detail.province + '',
        caseCity: detail.caseCity && detail.caseCity + '',
        regionId: detail.regionId && detail.regionId + '',
        destProvince: detail.destProvince && detail.destProvince + '',
        destCity: detail.destCity && detail.destCity + '',
        destRegionId: detail.destRegionId && detail.destRegionId + '',
        // destination:detail.destination &&detail.destination+''
      }
      setSendTime(detail.reservationTime && detail.reservationTime)
      // timingPush(detail.reservationTime && moment(detail.reservationTime).format('YYYY-MM-DD HH:mm:ss'))
      setLocationLatitude(detail.locationLatitude && detail.locationLatitude + '')
      setLocationLongitude(detail.locationLongitude && detail.locationLongitude + '')
      setDestLatitude(detail.destLatitude && detail.destLatitude + '')
      setDestLongitude(detail.destLongitude && detail.destLongitude + '')
      setStateValue(detail.isAccident && detail.isAccident)
      setIsAgree(detail.reservationFlg && detail.reservationFlg)
      if (detail.reservationFlg == 1) {
        setIsAgreeShow(1);
      } else {
        setIsAgreeShow(0);
      }
      form.setFieldsValue(data)
      /*1、省 2、市 3、区 4、服务类型 5、服务项目 6、承保单位
      7、方位 8、故障类型 9、车型 10.车辆颜色 11、保险公司*/

      /*有服务省 就请求 服务城市接口*/
      if (detail.province) {
        getConfigCode(2, detail.province)
      }
      /*有服务城市 就请求 服务地区接口*/
      if (detail.caseCity) {
        getConfigCode(3, detail.caseCity)
      }
      /*有目的地省 就请求 目的地城市接口*/
      if (detail.destProvince) {
        getModalConfigCode(1)
        getModalConfigCode(2, detail.destProvince)
      }
      /*有目的地城市 就请求 目的地地区接口*/
      if (detail.destCity) {
        getModalConfigCode(3, detail.destCity)
      }
      /*有服务类型 就请求 服务项目接口*/
      if (detail.serviceTypeId) {
        getConfigCode(5, detail.serviceTypeId)
      }

      /*判断字段是否有值，减少不必要的接口请求*/

      /*方位*/
      if (detail.positionId) {
        getConfigCode(7)
      }
      /*故障类型*/
      if (detail.assistantType) {
        getConfigCode(8)
      }
      /*车型*/
      if (detail.carType) {
        getConfigCode(9)
      }
      /*颜色*/
      if (detail.carColor) {
        getConfigCode(10)
      }
      /*保险公司*/
      if (detail.insurerId) {
        getConfigCode(11)
      }
      /*车辆品牌*/
      if (brandId) {
        dispatch({
          type: 'orderPublic/getCarBrandList',
          payload: {
            method: 'get',
            params: {}
          },
        })
      }
      /*车辆车系*/
      if (brandId && modelId) {
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
      /*承保单位*/
      if (detail.channelBranchId) {
        getConfigCode(6, channelId)
      }
    } else {
      form.setFieldsValue()
    }
  }, [detail])

  /*关闭*/
  let onCancel = () => {
    onCallbackSetSales(false)
  }

  /*保存*/
  let save = (e) => {
    console.log(e)
    e.isAccident = stateValue
    e.reservationFlg = isAgree
    e.locationLatitude = locationLatitude
    e.locationLongitude = locationLongitude
    e.destLatitude = destLatitude
    e.destLongitude = destLongitude
    if (isAgreeShow == 0) {
      e.reservationTime = null
    } else {
      e.reservationTime = moment(sendTime).format('YYYY-MM-DD HH:mm:ss')
    }
    //省市区
    let obj8 = []
    let obj9 = []
    let obj10 = []
    if (parentIdCode) {
      obj8 = secondConfirm(parentIdList, parentIdCode)
      e.province = obj8.id
    } else {
      obj8 = secondConfirm(provinceList, e.province)
    }
    if (cityIdCode) {
      obj9 = secondConfirm(cityIdList, cityIdCode)
      e.caseCity = obj9.id
    } else {
      obj9 = secondConfirm(cityList, e.caseCity)
    }
    if (regionIdCode) {
      obj10 = secondConfirm(regionIdList, regionIdCode)
      e.regionId = obj10.id
    } else {
      obj10 = secondConfirm(regionList, e.regionId)
    }
    //目标省市区
    let obj11 = []
    let obj12 = []
    let obj13 = []
    if (destParentIdCode) {
      obj11 = secondConfirm(destParentIdList, destParentIdCode)
      e.destProvince = obj11.id
    } else {
      obj11 = secondConfirm(destProvinceList, e.destProvince)
    }

    if (destCityIdCode) {
      obj12 = secondConfirm(destCityIdList, destCityIdCode)
      e.destCity = obj12.id
    } else {
      obj12 = secondConfirm(destCityList, e.destCity)
    }

    if (destRegionIdCode) {
      obj13 = secondConfirm(destRegionIdList, destRegionIdCode)
      e.destRegionId = obj13.id
    } else {
      obj13 = secondConfirm(destRegionList, e.destRegionId)
    }
    let lat = []
    if (value.length > 0) {
      lat = secondConfirm(value, e.caseAddress)
      e.caseAddress = lat.address + lat.codeDesc
    }
    let destLat = []
    if (destValue.length > 0) {
      destLat = secondConfirm(destValue, e.destination)
      e.destination = destLat.address + destLat.codeDesc
    }
    if (editNo == 1) {
      if (e) {
        let obj1 = secondConfirm(underwritingList, e.channelBranchId)
        let obj2 = secondConfirm(serviceTypeList, e.serviceTypeId)
        let obj3 = secondConfirm(serviceItemList, e.serviceId)
        let obj4 = secondConfirm(positionList, e.positionId)
        let obj5 = secondConfirm(faultTypeList, e.assistantType)
        let obj6 = secondConfirm(carTypeList, e.carType)
        let obj7 = secondConfirm(carColorList, e.carColor)

        let detileInfo = {
          "channelBranchId": obj1.codeDesc,
          "serviceTypeId": obj2.codeDesc,
          "serviceId": obj3.codeDesc,
          "positionId": obj4.codeDesc,
          "assistantType": obj5.codeDesc,
          "carType": obj6.codeDesc,
          "carColor": obj7.codeDesc,
          "province": obj8.codeDesc,
          "caseCity": obj9.codeDesc,
          "regionId": obj10.codeDesc,
          "destProvince": obj11.codeDesc,
          "destCity": obj12.codeDesc,
          "destRegionId": obj13.codeDesc,
          "caseAddress": lat.codeDesc,
          "destination": destLat.codeDesc,
        }
        setDetailNerArr(detileInfo)
        setDetailValue(e)
        setSaveVisible(true)
      }
    } else {
      e.id = location
      e.uniwayFlag = detail.uniwayFlag

      dispatch({
        type: "comboModal/reviseRescueOrderList",
        payload: {
          method: 'postJSON',
          params: e
        },
        callback: (res) => {
          if (res.result.code === '0') {
            onCallbackSave(true)
            message.success('保存成功!')
          } else {
            onCallbackSave(false)
            message.error(res.result.message)
          }
        }
      })
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

  //预约单
  let onIsAgreeChange = (e) => {
    /*字段：reservationFlg*/
    setIsAgreeShow(e.target.value);
    setIsAgree(e.target.value)
  }
  //事故车
  let onIsAccident = (e) => {
    /*字段：isAccident*/
    setStateValue(e.target.value)
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
    form.resetFields(['regionId'])
  }
  /*区change*/
  let onRegionChange = (e) => {
    setRegionId(e)
  }

  /*省change 联动地区接口*/
  let onDestProvinceChange = (e) => {
    if (e) {
      getModalConfigCode(2, e)
    }
    // dispatch({
    //   type: 'orderPublic/onReset',
    //   flag: 1
    // })
    setDestParentId(e)
    setDestCityId(null)
    setDestRegionId(null)
    form.resetFields(['destCity'])
    form.resetFields(['destRegionId'])
  }
  /*市change 联动区接口*/
  let onDestCityChange = (e) => {
    if (e) {
      getModalConfigCode(3, e)
    }
    // dispatch({
    //   type: 'orderPublic/onReset',
    //   flag: 3
    // })
    setDestCityId(e)
    setDestRegionId(null)
    form.resetFields(['destRegionId'])
  }
  /*区change*/
  let onDestRegionChange = (e) => {
    setDestRegionId(e)
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
  useEffect(() => {
    map = new window.BMap.Map('b-map'); // 创建Map实例
  })

  const clearSearch = (id) => {
    if (id == 1) {
      setValue([])
    } else {
      setDestValue([])
    }
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
          let toSearList = results.Kr;
          let itemUpdateList = toSearList.map((item, index) => {
            return {
              id: index,
              codeDesc: item.business,
              address: item.city + item.district,
            }
          })
          setFetching(false)
          if (id == 1) {
            setValue(itemUpdateList)
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

  //函数防抖
  let searchPlace = (searchValue, id) => {
    clearTimeout(searchTimer);
    setFetching(true)
    clearSearch(id);
    searchTimer = setTimeout(() => {
      searchPlaceFunc(searchValue, id)
    }, 500)
  }

  /*设置弹窗回调*/
  let onCallbackSave = (e) => {
    if (e) {
      setSaveVisible(false)
      onCallbackSetSales(true)
    } else {
      setSaveVisible(false)
    }
  }

  let timingPush = (e) => {
    setSendTime(e)
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

  useEffect(() => {
    map = new window.BMap.Map('b-map'); // 创建Map实例
  })


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
              callback: (res) => { resolve(res.body) }
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
              callback: (res) => resolve(res.body)
            })
          })
        }

        Promise.all([provinceList, cityList, regionList]).then(resolve => {
          setParentIdList(resolve[0])
          setCityIdList(resolve[1])
          setRegionIdList(resolve[2])
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
              callback: (res) => resolve(res.body)
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
              callback: (res) => resolve(res.body)
            })
          })
        }
        Promise.all([destProvinceList, destCityList, destRegionList]).then(resBody => {
          setDestParentIdList(resBody[0])
          setDestCityIdList(resBody[1])
          setDestRegionIdList(resBody[2])
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

  return (
    <>
      <div id="b-map" style={{ display: 'none' }}></div>
      <Modal
        title={editNo == 1 ?  <div className={style.block__header}>新建订单</div> : <div className={style.block__header}>编辑订单</div>}
        onCancel={onCancel}
        width={1130}
        destroyOnClose
        visible={comboVisible}
        centered={true}
        keyboard={false}
        maskClosable={false}
        footer={""}
      >
        <div className={style.box}>
          <Form className={style.form__cont} form={form} onFinish={save} layout="vertical">
            <Row>
              <Col span={12} className={style.item_box}>
                <Form.Item label="分支机构" name="channelBranchId" className={style.item_form} colon={false} >
                  <Select placeholder="请选择" allowClear>
                    {
                      underwritingList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12} className={style.item_box}>
                <Form.Item label={
                  <div>
                    来源工单号&nbsp;
                    <Tooltip placement="bottom" title={'工单号是您公司内部系统中的服务单号，如无可不用填写'}>
                      <ExclamationCircleOutlined style={{ color: "#b5a8a8" }} />
                    </Tooltip>
                  </div>
                } name="traceCode" className={style.item_form} colon={false}>
                  <Input placeholder="请输入" allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row >
              {
                editNo == 1 ?
                  <Col span={12} className={style.item_box}>
                    <Form.Item label="报案电话" name="mobileNo" className={style.item_form} rules={[{ required: true, message: "必填信息" }]} colon={false}>
                      <Input placeholder="请输入" allowClear />
                    </Form.Item>
                  </Col>
                  :
                  <Col span={12} className={style.item_box}>
                    <Form.Item label="报案电话" name="mobileNo" className={style.item_form} rules={[{ required: true, message: "必填信息" }]} colon={false}>
                      <Input placeholder="请输入" allowClear disabled />
                    </Form.Item>
                  </Col>
              }
              <Col span={12} className={style.item_box}>
                <Form.Item label="姓名" name="customerName" className={style.item_form} rules={[{ required: true, message: "必填信息" }]} colon={false}>
                  <Input placeholder="请输入" allowClear />
                </Form.Item>
              </Col>

            </Row>
            {
              editNo == 1 ?
                <Row>
                  <Col span={12} className={style.item_box}>
                    <Form.Item label="服务类型" name="serviceTypeId" className={style.item_form} rules={[{ required: true, message: "必填信息" }]} colon={false}>
                      <Select placeholder="请选择" allowClear onChange={onServiceTypeChange}>
                        {
                          serviceTypeList.map((item, key) => {
                            return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                          })
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12} className={style.item_box}>
                    <Form.Item label="服务项目" name="serviceId" className={style.item_form} rules={[{ required: true, message: "必填信息" }]} colon={false}>
                      <Select placeholder="请选择" allowClear showSearch>
                        {
                          serviceItemList.map((item, key) => {
                            return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                          })
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12} className={style.item_box}>
                    <Form.Item label="车牌号" name="plateNo" className={style.item_form} rules={[{ required: true, message: "必填信息" }]} colon={false}>
                      <Input placeholder="请输入" allowClear />
                    </Form.Item>
                  </Col>
                </Row>
                :
                <Row>
                  <Col span={12} className={style.item_box}>
                    <Form.Item label="服务类型" name="serviceTypeId" className={style.item_form} rules={[{ required: true, message: "必填信息" }]} colon={false}>
                      <Select placeholder="请选择" allowClear onChange={onServiceTypeChange} disabled >
                        {
                          serviceTypeList.map((item, key) => {
                            return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                          })
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12} className={style.item_box}>
                    <Form.Item label="服务项目" name="serviceId" className={style.item_form} rules={[{ required: true, message: "必填信息" }]} colon={false}>
                      <Select placeholder="请选择" allowClear showSearch disabled >
                        {
                          serviceItemList.map((item, key) => {
                            return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                          })
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12} className={style.item_box}>
                    <Form.Item label="车牌号" name="plateNo" className={style.item_form} rules={[{ required: true, message: "必填信息" }]} colon={false}>
                      <Input placeholder="请输入" allowClear />
                    </Form.Item>
                  </Col>
                </Row>
            }

            <Row >
              <Col span={12} className={style.col_box}>
                <Form.Item label="救援地址" name="province" className={style.item_form_city} rules={[{ required: true, message: "必填信息" }]} colon={false}>
                  <Select placeholder="省" allowClear onChange={onProvinceChange} value={parentId}>
                    {
                      parentIdList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
                <Form.Item name="caseCity" className={style.item_form_1} rules={[{ required: true, message: "必填信息" }]} colon={false}>
                  <Select placeholder="市" allowClear onChange={onCityChange} value={cityId}>
                    {
                      cityIdList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
                <Form.Item name="regionId" className={style.item_form_4} rules={[{ required: true, message: "必填信息" }]} colon={false}>
                  <Select placeholder="区" allowClear onChange={onRegionChange} value={regionId}>
                    {
                      regionIdList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item>

              </Col>
              <Col span={12} className={style.col_box}>
                <Form.Item name="caseAddress" className={style.item_form_2} colon={false} rules={[{ required: true, message: "必填信息" }]}>
                  <Select placeholder="具体地址（如人民路号）" allowClear showSearch
                    onSearch={(e) => searchPlace(e, 1)} filterOption={false} optionLabelProp="label"
                    notFoundContent={fetching ? <Spin size="small" /> : '暂无数据'} onChange={(e) => setCaseAddress(e, 0)}>
                    {
                      value.map((item, key) => {
                        return <Option key={key} value={item.id} label={item.address + item.codeDesc}>
                          <div className={style.my_option}>
                            <div className={style.sel_title}>{item.codeDesc}</div>
                            <div className={style.sel_desc}>{item.address}</div>
                          </div>
                        </Option>
                      })
                    }
                  </Select>
                </Form.Item>

                <Form.Item name="caseAddressFlag" className={style.item_form_3} colon={false}>
                  <Input placeholder="地点名称（如人民公园）" allowClear />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12} className={style.col_box}>
                <Form.Item label="目的地址" name="destProvince" className={style.item_form_city} colon={false}>
                  <Select placeholder="省" allowClear onChange={onDestProvinceChange} value={destParentId}>
                    {
                      destParentIdList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
                <Form.Item name="destCity" className={style.item_form_1} colon={false}>
                  <Select placeholder="市" allowClear onChange={onDestCityChange} value={destCityId}>
                    {
                      destCityIdList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item >
                <Form.Item name="destRegionId" className={style.item_form_4} colon={false}>
                  <Select placeholder="区" allowClear onChange={onDestRegionChange} value={destRegionId}>
                    {
                      destRegionIdList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12} className={style.col_box}>
                <Form.Item name="destination" className={style.item_form_2} colon={false}>
                  <Select placeholder="具体地址（如人民路号）" showSearch allowClear
                    onSearch={(e) => searchPlace(e, 2)} filterOption={false} optionLabelProp="label"
                    notFoundContent={fetching ? <Spin size="small" /> : '暂无数据'} onChange={(e) => setDestination(e, 2)}>
                    {
                      destValue.map((item, key) => {
                        return <Option key={key} value={item.id} label={item.address + item.codeDesc}>
                          <div className={style.my_option}>
                            <div className={style.sel_title}>{item.codeDesc}</div>
                            <div className={style.sel_desc}>{item.address}</div>
                          </div>
                        </Option>
                      })
                    }
                  </Select>
                </Form.Item>

                <Form.Item name="destinationFlag" className={style.item_form_3} colon={false}>
                  <Input placeholder="地点名称（如人民公园）" allowClear />
                </Form.Item>
              </Col>
            </Row>

            <Row >
              <Col span={12} className={style.item_box}>
                <Form.Item label="车辆位置" name="positionId" className={style.item_form} rules={[{ required: true, message: "必填信息" }]} colon={false}>
                  <Select placeholder="请选择" allowClear>
                    {
                      positionList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12} className={style.item_box}>
                <Form.Item label="故障类型" name="assistantType" className={style.item_form} rules={[{ required: true, message: "必填信息" }]} colon={false}>
                  <Select placeholder="请选择" allowClear>
                    {
                      faultTypeList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12} className={style.item_box}>
                <Form.Item label="预约单" className={style.item_form} colon={false}>
                  <Radio.Group value={isAgree} onChange={onIsAgreeChange}>
                    <Radio value={1} className={style.radio_item}>是</Radio>
                    <Radio value={0} className={style.radio_item}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12} className={style.item_box}>
                <Form.Item label="事故车" className={style.item_form} colon={false}>
                  <Radio.Group value={stateValue} onChange={onIsAccident}>
                    <Radio value={1} className={style.radio_item}>是</Radio>
                    <Radio value={0} className={style.radio_item}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              {
                isAgreeShow == 1 ?
                  <Col span={12} className={style.item_box}>
                    <Form.Item label="预约时间" name="reservationTime" className={style.item_form} rules={[{ required: true, message: "必填信息" }]} colon={false}>
                      <DatePicker style={{ width: '100%' }} showTime onChange={(e) => { timingPush(e) }} format={dateFormat} value={sendTime ? moment(sendTime, dateFormat) : null} initialValue={sendTime ? moment(sendTime, dateFormat) : null} />
                    </Form.Item>
                  </Col>
                  :
                  ""
              }
              <Col span={12} className={style.item_box}>
                <Form.Item label="车辆品牌" name="carBrand" className={style.item_form} colon={false}>
                  <Input placeholder="请输入" allowClear />
                </Form.Item>
              </Col>
              <Col span={12} className={style.item_box}>
                <Form.Item label="车型" name="carType" className={style.item_form} colon={false}>
                  <Select placeholder="请选择" allowClear>
                    {
                      carTypeList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12} className={style.item_box}>
                <Form.Item label="颜色" name="carColor" className={style.item_form} colon={false}>
                  <Select placeholder="请选择" allowClear>
                    {
                      carColorList.map((item, key) => {
                        return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12} className={style.item_box}>
                <Form.Item label="车架号" name="identityNo" className={style.item_form} colon={false}>
                  <Input placeholder="请输入" allowClear />
                </Form.Item>
              </Col>
              <Col span={12} className={style.item_box}>
                <Form.Item label="保单号" name="policyNo" className={style.item_form} colon={false}>
                  <Input placeholder="请输入" allowClear maxLength={30} />
                </Form.Item>
              </Col>
            </Row>
            {/* <Row>
              
            </Row> */}
            <Row>
              <Col span={24} className={style.item_box_memo}>
                <Form.Item label={
                  <div>
                    订单附言&nbsp;
                    <Tooltip placement="bottom" title={'附言将会告知服务人员，可填写本次服务其他相关信息'}>
                      <ExclamationCircleOutlined style={{ color: "#b5a8a8" }} />
                    </Tooltip>
                  </div>
                } name='memo' className={style.item_form} colon={false}>
                  <TextArea placeholder="请输入" allowClear maxLength={100} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end" className={style.button_sty}>
              <Space>
                <Button htmlType="button" onClick={onCancel}>取消</Button>
                <Button htmlType="submit" type="primary">保存</Button>
              </Space>
            </Row>
          </Form>
        </div>
      </Modal>

      <SaveModal    //新建订单确认模板
        saveVisible={saveVisible}
        detail={detailValue}
        detailNerArr={detailNerArr}
        onCallbackSave={(flag) => onCallbackSave(flag)}
      />
    </>
  )
};
export default connect(({ comboModal, orderPublic, rescueOrderDetail }) => ({
  underwritingList: orderPublic.underwritingList,
  serviceTypeList: orderPublic.serviceTypeList,
  serviceItemList: orderPublic.serviceItemList,
  provinceList: orderPublic.provinceList,
  cityList: orderPublic.cityList,
  regionList: orderPublic.regionList,
  faultTypeList: orderPublic.faultTypeList,
  positionList: orderPublic.positionList,
  carTypeList: orderPublic.carTypeList,
  carColorList: orderPublic.carColorList,
  destCityList: comboModal.destCityList,
  destRegionList: comboModal.destRegionList,
  destProvinceList: comboModal.destProvinceList,
  detail: rescueOrderDetail.detail
}))(operationModalPage)
