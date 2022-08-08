import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {
  Button,
  Input,
  Form,
  Select,
  Space,
  Tooltip
} from "antd"
import style from "./style.less"
import moment from 'moment'
import 'moment/locale/zh-cn'
const { TextArea } = Input
moment.locale('zh-cn')
let channelId = localStorage.getItem('tokenObj') && JSON.parse(localStorage.getItem('tokenObj')).channelId || ''
const firstStep = (props) => {
  let { dispatch, echoFirstStepData, toSecondStep, underwritingList, carTypeList, carColorList } = props
  const [form] = Form.useForm();
  let [branchList, setBranchList] = useState([]);// new分支机构
  let [formData, setFormData] = useState({
    mobileNo: null,
    customerName: null,
    plateNo: null
  })

  useEffect(() => {
    form.resetFields()
    // getConfigCode(6, channelId) // old
    queryBranchList()
    getConfigCode(9)
    getConfigCode(10)
  }, [])

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

  // 查询承保单位列表(数据权限使用)
  let queryBranchList = () => {
    dispatch({
      type: 'billSettlementReconciliationModel/queryBranchList',
      payload: {
        method: 'postJSON',
        params: { 
          channelId: JSON.parse(localStorage.getItem('tokenObj')).channelId,
          platformType: 'channel',
          userId: JSON.parse(localStorage.getItem('tokenObj')).userId,
        }
      },
      callback: res => {
        if(res.result.code==0) {
          setBranchList(res.body)
        }else {
          message.warning(res.result.message)
        }
      }
    });
  }

  useEffect(() => {
    form.resetFields()
    if (echoFirstStepData) {
      for (let x in formData) {
        formData[x] = echoFirstStepData[x] ? echoFirstStepData[x] : formData[x] // 避免第二步回来重新选择单选出现未选择的情况
      }
      setFormData({ ...formData })
      form.setFieldsValue(echoFirstStepData)
    } else {
      form.resetFields()
    }

  }, [echoFirstStepData])

  /*点击标题切换判断必填*/
  useEffect(() => {
    if (toSecondStep) {
      form.validateFields().then(values => {
        nextStep()
      })
        .catch(errorInfo => {
        });
    }
  }, [toSecondStep])

  /*下一步*/
  let nextStep = () => {
    // 暂存第一步必填字段
    dispatch({
      type: 'createNewOrder/setFirstEchoStepData',
      payload: {
        echoFirstStepData: form.getFieldValue(),
      }
    })
    let firstStep = form.getFieldsValue()
    //获取第一页预览数据
    let channelBranchIdStr = branchListFn(branchList, firstStep.channelBranchId)
    let carTypeStr = secondConfirm(carTypeList, firstStep.carType)
    let carColorStr = secondConfirm(carColorList, firstStep.carColor)
    let firstDetileInfo = {
      "channelBranchId": channelBranchIdStr.depname,
      "carType": carTypeStr.codeDesc,
      "carColor": carColorStr.codeDesc,
    }
    // 暂存第一步预览字段
    dispatch({
      type: 'createNewOrder/setFirstStepDetile',
      payload: {
        firstStepDetile: firstDetileInfo,
      }
    })
    //跳转下一页
    dispatch({
      type: 'createNewOrder/setCurrentStep',
      payload: 1
    })
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
  // 分支机构二次确认数据
  let branchListFn = (list, id1) => {
    let newList = list.filter(item => id1 == item.branchid)
    if (newList.length) {
      return newList[0]
    } else {
      return ''
    }
  }

  /*关闭*/
  let onCancel = () => {
    history.push('/order/rescueOrder/list')
    dispatch({
      type: 'createNewOrder/setReset',
    })
  }

  return (
    <div className={style.first_step}>
      <Form form={form} onFinish={nextStep}>
        <div className={style.sub_title_1}><i>*</i>用户信息</div>
        <div className={style.item_form_title}>
          <Form.Item label="报案电话" className={style.item_form} labelCol={{ flex: '0 0 76px' }}>
            <Form.Item
              name="mobileNo"
              noStyle
              rules={[{ required: true, message: '必填信息' }]}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Form.Item>
          <Form.Item label="姓名" className={style.item_form} labelCol={{ flex: '0 0 76px' }}>
            <Form.Item
              name="customerName"
              noStyle
              rules={[{ required: true, message: '必填信息' }]}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Form.Item>
          <Form.Item label="车牌号" className={style.item_form} labelCol={{ flex: '0 0 76px' }}>
            <Form.Item
              name="plateNo"
              noStyle
              rules={[{ required: true, message: '必填信息' }]}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Form.Item>
        </div>

        <div className={style.sub_title}>订单信息</div>
        <div className={style.item_form_title}>
          <Form.Item label="分支机构" name="channelBranchId" labelCol={{ flex: '0 0 76px' }} className={style.item_form}>
            <Select placeholder="请选择" allowClear>
              {
                branchList.map((item, key) => {
                  return <Option key={key} value={item.branchid}>{item.depname}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="来源工单号" name="traceCode" labelCol={{ flex: '0 0 83px' }} className={style.item_form_other}>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <div className={style.icon_tips}>来源工单号是您公司内部系统中的服务单号，没有可不用填写</div>
        </div>

        <div className={style.sub_title}>车辆及保单信息</div>
        <div className={style.item_form_title}>
          <Form.Item label="车架号" name="identityNo" labelCol={{ flex: '0 0 76px' }} className={style.item_form} >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="车辆品牌" name="carBrand" labelCol={{ flex: '0 0 76px' }} className={style.item_form} >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="车型" name="carType" labelCol={{ flex: '0 0 76px' }} className={style.item_form} >
            <Select placeholder="请选择" allowClear>
              {
                carTypeList.map((item, key) => {
                  return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="颜色" name="carColor" labelCol={{ flex: '0 0 76px' }} className={style.item_form} >
            <Select placeholder="请选择" allowClear>
              {
                carColorList.map((item, key) => {
                  return <Option key={key} value={item.id}>{item.codeDesc}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="保单号" name="policyNo" labelCol={{ flex: '0 0 76px' }} className={style.item_form} >
            <Input placeholder="请输入" allowClear maxLength={30} />
          </Form.Item>
        </div>



        <div className={style.btn_content}>
          <Button className={style.part_gap} onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit" >下一步</Button>
        </div>
      </Form>
    </div>
  )
};
export default connect(({ createNewOrder, orderPublic }) => ({
  echoFirstStepData: createNewOrder.echoFirstStepData,
  toSecondStep: createNewOrder.toSecondStep,
  firstStepDetile: createNewOrder.firstStepDetile,
  underwritingList: orderPublic.underwritingList,
  carTypeList: orderPublic.carTypeList,
  carColorList: orderPublic.carColorList,
}))(firstStep)
