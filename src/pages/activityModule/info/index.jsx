import React, { useEffect, useState } from 'react';
import {
  Row,
  Form,
  Space,
  Radio,
  Input,
  Select,
  Button,
  Tooltip,
  DatePicker,
  message
} from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN'
import { connect ,history} from 'umi';
import { InfoCircleOutlined } from '@ant-design/icons';
import LayerModal from '../components/layerModal';   //取消、上一步弹窗
import moment from 'moment'
import 'moment/locale/zh-cn'
import styles from './style.less';
import style from "@/pages/activityModule/winningRules/style.less";
import SelectActivityThrong from "@/pages/activityModule/selectActivityThrong";
import {getThrongDetail} from "@/services/activity";
import RichText from "@/pages/basicCard/richText"
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

//所属项目
let projectArr = [
  { title: '2020年1月营销项目', id: 1 },
];
let activityInfo =JSON.parse(localStorage.getItem('activityInfo'));   //基础配置信息
const activityConfigure = (props) => {
  let { dispatch, subimtCode, channelList } = props
  let [form] = Form.useForm()
  let [detailStatus, setDetailStatus]  = useState(localStorage.getItem('activityDetail') === '1' ? true : false) //是否是详请状态，1为是
  let [isCancelModal, setIsCancelModal] = useState(false); //取消弹窗
  let [isActivityHave, setIsActivityHave]  = useState(localStorage.getItem('isActivityHave') || false) //是否是活动发布状态
  let [checkThrong, setCheckThrong]  = useState(0) //选择参与人群value
  let [throngVisible, setThrongVisible] = React.useState(false) //添加人群弹窗状态
  let [list, setList] = useState([]) //人群列表
  let [throngType, setThrongType] = useState(1) //1可参与人群;2排除可参与人群
  let [activityThrongList, setActivityThrongList] = useState([]) //可参与人群
  let [unActivityThrongList, setUnActivityThrongList] = useState([]) //排除可参与人群
  let [channelArr, setChannelArr] = useState([]) //渠道
  let [programArr, setprogramArr] = useState([]) //所属项目
  let [couponUsageExplain, setCouponUsageExplain] = useState('') //活动规则
  useEffect(() => {
    dispatch({
      type: 'selectTheme/onSetTheme',
      payload: null
    })
    form.setFieldsValue({
      isCheckThrong: 0,
      programId:null
    })
  }, [])
  let setIsCancel=()=>{
    setIsCancelModal(true);
  }
  let onClickCancel =(e) => {
    setIsCancelModal(false);
  }
  //下一步提交
  let onSubmit = values => {
    if(!values.describe || values.describe === '' || values.describe.replace(/\s*/g,"") == '<p></p>'){
      message.error('活动规则不能为空')
      return false;
    }
    if(checkThrong == 1 && (!activityThrongList || (activityThrongList && activityThrongList.length == 0))){
      message.error('自定义人群不能为空')
      return false;
    }
    if(!detailStatus){
      let activityId=activityInfo&&activityInfo.objectId?activityInfo.objectId:'';
      let activityCenterSave = activityInfo.activityCenterSave ? JSON.parse(JSON.stringify(activityInfo.activityCenterSave)) : null;
      dispatch({
        type: 'activityNumber/saveMarketingInfo',
        payload:{
          method:'postJSON',
          params:{
            ...values,
            activityId,
            // marketType: 1, //活动游戏类型 1大转盘 2秒杀 3互动游戏
            activityThrongList:activityThrongList?activityThrongList:'',
            unActivityThrongList:unActivityThrongList?unActivityThrongList:'',
            // marketActivityType: 1, //游戏类型 1抽奖 2秒杀 3直抽 4优惠购
            startTime:moment(values.activityTime[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime:moment(values.activityTime[1]).format('YYYY-MM-DD HH:mm:ss'),
            activityCenterSave: activityCenterSave
          },
        },
        callback:(res)=>{
          let toActivityInfo=JSON.parse(localStorage.getItem('activityInfo'));
          let newActivityInfo={...toActivityInfo,...res.body};
          newActivityInfo.activityCenterSave = null;
          localStorage.setItem('isNewActivity', false);
          localStorage.setItem('activityInfo',JSON.stringify(newActivityInfo))
          history.push("/activityConfig/activityList/activityModule/shape")
          dispatch({
            type: 'selectTheme/onSetTheme',
            payload: null
          })
        }
      })
    }else {
      history.push("/activityConfig/activityList/activityModule/shape")
      dispatch({
        type: 'selectTheme/onSetTheme',
        payload: null
      })
    }
  }
  useEffect(()=>{
    if(channelList && channelList.channelList && channelList.channelList.length > 0){
      let temp = [];
      let channelLists=channelList.channelList
      channelLists.map(item => {
        if (item.id === activityInfo.channelId){
          temp.push(item)
        }
      })
      setChannelArr(temp)
    }
  },[channelList])
  useEffect(() => {
    activityInfo =JSON.parse(localStorage.getItem('activityInfo'));
    form.setFieldsValue({
      groupValue: 1,  //选择人群 默认值
      channelId: activityInfo.channelId,  //默认渠道
      copywritingOne: " 很抱歉，您没有资格参与",
      internalName: "",
      displayName: "",
      activityTime: '',
      copywritingTwo: "活动还未开始",
      copywritingThree: "活动已经结束",
      describe: "",
    });
    let isNewActivity = JSON.parse(localStorage.getItem('isNewActivity'));
    if(activityInfo && activityInfo.objectId && activityInfo.channelId && !isNewActivity){
      getStageSActivityOne()
    }
    // let tokenObj=JSON.parse(sessionStorage.getItem('activityListData'));
    let tokenObj=JSON.parse(localStorage.getItem('tokenObj'));
    getChannel(tokenObj.channelId);
    getListMarketProject();
  }, []);
  //获取详请
  let getStageSActivityOne = () => {
    dispatch({
      type: 'activityNumber/backStageSActivityOne',
      payload:{
        method:'postJSON',
        params:{
          channelId:activityInfo.channelId,
          activityId:activityInfo.objectId
        }
      },
      callback:(res)=>{
        if(res.result.code === "0"){
          let temp = res.body || {};
          if(!temp.copywritingOne){
            return
          }
          form.setFieldsValue({
            ...temp,
            activityTime:[moment(res.body.startTime),moment(res.body.endTime)]
          })
          setCouponUsageExplain(res.body.describe)
          setCheckThrong(temp.isCheckThrong)
          if(!temp.programId){
            form.setFieldsValue({
              programId: 0
            })
          }else{
            form.setFieldsValue({
              programId: temp.programId
            })
          }
          getThrongDetail()
        }
      }
    })
  }
  //获取所属项目
  let getListMarketProject = () => {
    dispatch({
      type: 'activityNumber/getListMarketProject',
      payload:{
        method:'postJSON',
        params:{
          channelId:activityInfo.channelId,
        }
      },
      callback:(res)=>{
        if(res.result.code === "0"){
          setprogramArr(res.body);
        }
      }
    })
  }
  /*获取渠道*/
  let getChannel = (channelId) => {
    dispatch({
      type: 'activityList/getActivityChannelList',
      payload: {
        method:'post',
        params: {
          channelId:channelId,
        }
      }
    })
  }
  /*获取以保存的活动人群列表*/
  let getThrongDetail = () =>{
    let data = {
      activityId: activityInfo.objectId,
      channelId: activityInfo.channelId,
    }
    dispatch({
      type: 'activityNumber/getActivityThrong',
      payload:{
        method:'postJSON',
        params: data
      },
      callback: (res) => {
        if(res.result.code === '0'){
          let temp = res.body || []
          if(temp.length > 0){
            let tempOne = []
            let tempTwo = []
            temp.map(item => {
              if(item.type === 1){
                tempOne.push(item)
              }else {
                tempTwo.push(item)
              }
            })
            setActivityThrongList(tempOne)
            setUnActivityThrongList(tempTwo)
          }
        }else {
          message.error(res.result.message)
        }
      }
    })
  }
  /*可参与人群单选change*/
  let onCheckThrongChange = (e) => {
    let value = e.target.value
    let toActivityThrongList = JSON.parse(JSON.stringify(activityThrongList));
    toActivityThrongList = [];
    setCheckThrong(value);
    setActivityThrongList(toActivityThrongList);
  }
  /*关闭人群弹窗*/
  let onHideThrong = (e) => {
    if(throngType === 1){
      setActivityThrongList(e)
    }else {
      setUnActivityThrongList(e)
    }
    setList([])
    setThrongVisible(false)
  }
  /*选择可参与人群*/
  let onPickThrong = () => {
    setThrongType(1)
    setThrongVisible(true)
    setList(activityThrongList)
  }
  /*选择排除人群*/
  let onPickUnThrong = () => {
    setThrongType(2)
    setThrongVisible(true)
    setList(unActivityThrongList)
  }
   /*富文本编辑器*/
   let onTextChange = (value) => {
    form.setFieldsValue({
      describe: value
    })
  }
  return (
    <div className={styles.block__cont}>
      {/* <StepsHead number="0"/> */}
      <LayerModal iscancal={isCancelModal} onClickCancel={onClickCancel}/>
      <div className={styles.activty_info}>
        <div className={styles.head_message}><InfoCircleOutlined className={styles.msg_ico} />设置活动基本信息</div>
        <Form form={form} onFinish={onSubmit} labelCol={{ span: 10 }} wrapperCol={{ span: 8 }}>
          <Row justify="space-around" align="left" className={styles.form_box}>
            <Form.Item label="渠道" name='channelId' className={styles.form__item} rules={[{ required: true, message: "请选择渠道" }]}>
              <Select placeholder="请选择" showSearch disabled={true}>
                {
                  channelArr.map((item, key) => {
                    return <Option key={key} value={item.id}>{item.channelName}</Option>
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item label="所属项目" name='programId' className={styles.form__item} rules={[{ required: true, message: "请选择所属项目" }]}>
              <Select 
                placeholder="请选择" 
                notFoundContent='暂无数据' 
                showSearch 
                optionFilterProp="children"
                disabled={detailStatus||isActivityHave}
              >
                {
                  programArr.map((item, key) => {
                    return <Option key={key} value={item.objectId}>{item.marketProjectName}</Option>
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item label="选择可参与人群" name='isCheckThrong' className={styles.form__item} rules={[{ required: true, message: "请选择可参与人群" }]}>
              <Radio.Group onChange={onCheckThrongChange} disabled={detailStatus || isActivityHave}>
                <Radio value={0}>全部人群</Radio>
                <Radio value={1}>自定义人群</Radio>
              </Radio.Group>
            </Form.Item>
            {
              checkThrong === 1 ? <Form.Item colon={false} label=" " className={styles.form_item_check}>
                <Button type="primary" disabled={detailStatus || isActivityHave} onClick={onPickThrong} >选择人群</Button>
                <div className={styles.form_item_check_title}>
                  {activityThrongList.length > 0?<span>已选择：</span>:null}
                  {
                    activityThrongList.length > 0 && activityThrongList.map((item, key) => {
                      return <span>{item.throngName} {!item.count ? '--' : item.count}人；</span>
                    })
                  }
                </div>
              </Form.Item> : null
            }
            <Form.Item label="排除人群" tooltip="排除的人群没法参与活动"  className={styles.form_item_check}>
              <Button type="primary" disabled={detailStatus || isActivityHave}onClick={onPickUnThrong} >选择人群</Button>
              <div className={styles.form_item_check_title}>
                {unActivityThrongList.length > 0?<span>已选择：</span>:''}
                {
                  unActivityThrongList.length > 0 && unActivityThrongList.map((item, key) => {
                    return <span>{item.throngName} {!item.count ? '--' : item.count}人；</span>
                  })
                }
              </div>
            </Form.Item>
            {/* <Form.Item label="所属项目：" name='project' className={styles.form__item} rules={[{ required: true, message: "请选择所属项目" }]}>
              <Select placeholder="请选择">
                {
                  projectArr.map((item, key) => {
                    return <Option key={key} value={item.id}>{item.title}</Option>
                  })
                }
              </Select>
            </Form.Item>

            <Form.Item name="groupValue" label="选择可参与人群：" className={styles.form__item} rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value={1}>全部人群</Radio>
                <Radio value={2}>自定义人群</Radio>
              </Radio.Group>
            </Form.Item>
            <div className={styles.group_crowd}><Button type="dashed" onClick={toChoie.bind(this, true)}>选择人群</Button><em>已选择：男性会员 20,000人</em></div>

            <Form.Item name="excludeCrowd" label="排除人群：" className={styles.form__item}>
              <div className={styles.group_crowd2}><Button type="dashed" onClick={toChoie.bind(this, true)}>选择人群</Button><em>已选：羊毛党 共 70 人</em></div>
            </Form.Item> */}
            <Form.Item name="copywritingOne" label="不满足参与条件提示文案" className={styles.form__item} rules={[{ required: true, message: "请填写提示文案" }]}>
              <Input disabled={detailStatus} />
            </Form.Item>
          </Row>

          <Row justify="space-around" align="left" className={styles.form_box}>
            <Form.Item name="internalName" label="活动内部名称" className={styles.form__item} rules={[{ required: true, message: "请填写活动内部名称" }]}>
              <Input maxLength="20" disabled={detailStatus} />
            </Form.Item>

            <Form.Item name="displayName" label="活动展示名称" className={styles.form__item} rules={[{ required: true, message: "请填写活动展示名称" }]}>
              <Input maxLength="20" disabled={detailStatus} />
            </Form.Item>
            <div className={styles.form__item}><span className={styles.info_wrap_i1}>该信息会展示在用户端标题处</span></div>

            <Form.Item name="activityTime" label="活动时间" className={styles.form__item} rules={[{required: true, message: "请选择活动时间" }]}>
                <RangePicker locale={locale} disabled={detailStatus||isActivityHave} showTime format="YYYY-MM-DD HH:mm:ss" className={styles.form_item_width2}/>
            </Form.Item>

            <Form.Item name="copywritingTwo" label="活动未开始文案" className={styles.form__item} rules={[{ required: true, message: "请填写活动未开始文案" }]}>
              <Input disabled={detailStatus||isActivityHave} />
            </Form.Item>

            <Form.Item name="copywritingThree" label="活动已结束文案" className={styles.form__item} rules={[{ required: true, message: "请填写活动已结束文案" }]}>
              <Input disabled={detailStatus||isActivityHave} />
            </Form.Item>
          </Row>

          <Row justify="space-around" align="left" className={styles.form_box}>

            <Form.Item name="describe" label="活动规则" className={styles.form__item} rules={[{ required: true, message: "请填写活动规则" }]}>
            <RichText onTextChange={onTextChange} couponUsageExplain={couponUsageExplain} disabled={detailStatus}/>
            </Form.Item>
          </Row>

          <Row justify="center" align="center">
            <Space size={20}>
              <Button onClick={setIsCancel}>返回列表</Button>
              <Button type="primary" htmlType="submit">下一步</Button>
            </Space>
          </Row>
        </Form>
      </div>
      {/*选择人群*/}
      <SelectActivityThrong
          list={list}
          throngType={throngType}
          onHideThrong={onHideThrong}
          throngVisible={throngVisible}
      />
    </div>
  )
}
export default connect(({ activityNumber, loading, activityList,selectTheme }) => ({
  subimtCode: activityNumber.subimtCode,
  channelList: activityList.channelList
}))(activityConfigure);
