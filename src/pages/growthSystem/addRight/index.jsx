import React, { useEffect, useState, } from "react"
import { connect, history } from 'umi'
import {
  Row,
  Col,
  Form,
  Input,
  Modal,
  Button,
  Select,
  Upload,
  Radio,
  message,
  InputNumber
} from "antd"
import { UploadOutlined } from '@ant-design/icons';
import { uploadIcon } from '@/services/activity.js';
import style from "./style.less"
const { Option } = Select;
const { TextArea } = Input;
let addRightPage = (props) => {
  let { dispatch, location } = props
  let [form] = Form.useForm();
  let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));   //基础配置信息
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  let [taskIds, setTaskIds] = useState(location.state && location.state.objectId || '');  //编辑带来的id 没有代表新建
  //权益种类
  let [rigList, setRigList] = useState([
    {
      id: 1,
      title: '升级有礼',
      describe: "会员等级升级后即可得到奖励"
    },
    {
      id: 2,
      title: '生日礼',
      describe: "每年生日月或当天可得到奖励"
    }, {
      id: 3,
      title: '固定有礼',
      describe: "固定周期发放奖励"
    }
    // , {
    //   id: 4,
    //   title: '参与指定活动',
    //   describe: "部分活动或功能限定会员等级"
    // }
    , {
      id: 5,
      title: '其他权益',
      describe: "其他"
    }
  ]);
  //日期
  let [dayList, setDayList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]);

  let [equityType, setRightType] = useState(0)
  /*权益种类change*/
  let onRightTypeChange = (e) => {
    setRightType(e);
    let toRightInfo = {
      validityTerm: 1,    //领取有效期
      validityNum: 1,    //领取有效期-份
      limitTerm: 1,     //领取份数限制
      limitNum: 1,      //领取份数限制-份
      cycle: 1          //周期循环有效
    };
    setRightInfo({ ...toRightInfo });
  }
  //上传图片
  let [imageUrl, setImageUrl] = useState(''); //icon
  //下载显示图片
  let setDownload = (name) => {
    dispatch({
      type: 'addRight/download',
      payload: {
        method: 'get',
        responseType: 'blob',
        fileCode: name,
      }, callback: (res) => {
        setImageUrl(URL.createObjectURL(res))
      }
    })
  }

  /*上传配置*/
  let beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传JPG/PNG 格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('图片大小不能高于 5MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  let handleChange = info => {
    if (info.file.status === 'done') {
      setImageUrl(info.file.response.items)
    }
  };
  //固定有礼
  let [fixPolite, setFixPolite] = useState({
    month: "1",
    eDay: "1"
  });
  let changeTime = (name, e) => {
    let tofixPolite = fixPolite;
    tofixPolite[name] = e;
    setFixPolite({ ...tofixPolite })
  };
  //新增权益
  let [rightInfo, setRightInfo] = useState({
    validityTerm: 1,    //领取有效期
    validityNum: 1,    //领取有效期-份
    limitTerm: 1,     //领取份数限制
    limitNum: 1,      //领取份数限制-份
    cycle: 1          //周期循环有效
  })
  let changeRightsRo = (e, name) => {
    let toRightInfo = { ...rightInfo };
    toRightInfo[name] = e.target.value;
    setRightInfo(toRightInfo);
  }
  let changeRights = (e, name) => {
    let toRightInfo = { ...rightInfo };
    toRightInfo[name] = e;
    setRightInfo(toRightInfo);
  }
  /*提交*/
  let onSubmit = (info) => {
    if (!imageUrl) {
      message.error('请上传权益icon')
      return false;
    }
    let params = info;
    params.giftTimeType = parseInt(params.giftTimeType ? params.giftTimeType : 1);
    params.giftTimeDay = parseInt(fixPolite.eDay);
    if (params.equityType == 3) {
      params.giftTimeType = 3;
    }
    params.equityIcon = imageUrl;
    params.id = taskIds;
    dispatch({
      type: 'addRight/saveEquityManagement',
      payload: {
        method: 'postJSON',
        params: params
      }, callback: (res) => {
        if (res.code === '0000') {
          message.info('保存成功');
          hisTask();
        } else {
          message.error(res.message)
        }
      }
    })
  }
  //取消
  let hisTask = () => {
    history.replace({
      pathname: '/platformBuild/growthSystem/rightList'
    })
  }

  useEffect(() => {
    form.setFieldsValue({
      equityType: null,
      equityDesc: '',
      exhibitionName: '',
      jumpLink: "",
      icon: "",
      giftTimeType: "1"
    });
  }, []);
  useEffect(() => {
    //编辑回显
    if (taskIds) {
      queryEquityManagement();
    }
  }, []);
  //回显
  let queryEquityManagement = () => {
    dispatch({
      type: 'addRight/queryEquityManagement',
      payload: {
        method: 'get',
        params: {
          id: taskIds
        },
      }, callback: (res) => {
        if (res.code === '0000') {
          let items = res.items;
          items.giftTimeType = String(items.giftTimeType ? items.giftTimeType : 1);
          form.setFieldsValue(items);
          setRightType(items.equityType);
          if (items.equityIcon) {
            setImageUrl(items.equityIcon);
          }

          if (items.giftTimeDay) {
            let tofixPolite = fixPolite;
            tofixPolite.eDay = String(items.giftTimeDay);
            setFixPolite({ ...tofixPolite });
          }
        } else {
          message.error(res.message)
        }
      }
    })
  }

  return (
    <>
      <div className={style.block__cont}>
        <div className={style.block__header}>{taskIds ? '编辑权益' : '添加权益'}</div>
        <div className={style.wrap_centent}>
          <Form scrollToFirstError form={form} onFinish={onSubmit} >
            <Row justify="space-around" align="center" >
              <div className={style.form_item_position}>
                <Form.Item label="权益种类：" name='equityType' className={style.form_item} labelCol={{ span: 5 }} rules={[{ required: true, message: "请选择" }]}>
                  <Select
                    placeholder="请选择"
                    notFoundContent='暂无数据'
                    onChange={onRightTypeChange}
                    className={style.form_item_msg}
                  >
                    {
                      rigList.map((item, key) => <Option key={key} value={item.id}>{item.title}</Option>)
                    }
                  </Select>
                </Form.Item>
                <div className={style.form_item_msg_fx}>{equityType === 0 ? '会员等级升级后即可得到奖励' : rigList[equityType - 1] && rigList[equityType - 1].describe ? rigList[equityType - 1].describe : ''}</div>
              </div>
            </Row>
            <Row justify="space-around" align="center">
              <Form.Item label="展示名称：" name='exhibitionName' className={style.form_item} labelCol={{ span: 5 }} rules={[{ required: true, message: "请输入" }]}>
                <Input placeholder="请输入" className={style.form_item_input} />
              </Form.Item>
            </Row>
            <Row justify="space-around" align="center">
              <div className={style.form_item2}>
                <strong><i>*</i>权益icon：</strong>
                <div className={style.form_item2_by}>
                  <span className={`${style.form_item2_by_m} ${imageUrl ? style.form_item2_by_n1_m2 : null}`}><img src={imageUrl ? imageUrl : require('../../../assets/level_m3.png')}></img> </span>
                  <div className={style.form_item2_by_n1}>
                    {/* <Upload {...uploadConfig} className={style.form_item_upload}> */}
                    <Upload name="files" action={uploadIcon} beforeUpload={beforeUpload} onChange={handleChange} headers={headers} showUploadList={false} className={style.form_item_upload}>
                      <Button icon={<UploadOutlined />} className={style.form_item_icon}>{imageUrl ? '重新上传' : '上传图片'}</Button>
                    </Upload>
                    <p>尺寸要求：120 * 120 px</p>
                  </div>
                </div>
              </div>
            </Row>
            <Row justify="space-around" align="center">
              <Form.Item label="权益描述：" name='equityDesc' className={style.form_item} labelCol={{ span: 5 }} rules={[{ required: true, message: "请输入" }]}>
                <TextArea showCount allowClear rows={4} maxLength={300} placeholder="输入描述" />
              </Form.Item>
            </Row>
            {
              equityType == 2 ? <Row justify="space-around" align="center">
                <Form.Item label="领取有效期" name='giftTimeType' className={style.form_item} labelCol={{ span: 5 }} rules={[{ required: true, message: "请选择" }]}>
                  <Radio.Group>
                    <Radio value="1">生日当天</Radio><Radio value="2">生日当月</Radio>
                  </Radio.Group>
                </Form.Item>
              </Row> : null
            }
            {/* {
              equityType && (equityType == 1 || equityType == 3) ?
                <Row justify="space-around" align="center" className={style.form_item2s}>
                  <div className={style.form_item2}>
                    <strong><i>*</i>领取有效期：</strong>
                    <div className={style.form_item5_by}>
                      <Radio.Group value={rightInfo.validityTerm} onChange={(e) => { changeRightsRo(e, 'validityTerm') }}>
                        <Radio value={1}>长期有效</Radio>
                        <Radio value={2}>
                          <InputNumber min={1} className={style.form_item5_input} value={rightInfo.validityNum} onChange={(e) => { changeRights(e, 'validityNum') }} />份/人
                        </Radio>
                      </Radio.Group>
                    </div></div></Row> : null
            }
            {
              equityType && (equityType == 1 || equityType == 2 || equityType == 3) ?
                <Row justify="space-around" align="center" className={style.form_item2s}>
                  <div className={style.form_item2}>
                    <strong><i>*</i>领取份数限制：</strong>
                    <div className={style.form_item5_by}>
                      <Radio.Group value={rightInfo.limitTerm} onChange={(e) => { changeRightsRo(e, 'limitTerm') }}>
                        <Radio value={1}>不限份数</Radio>
                        <Radio value={2}>
                          <InputNumber min={1} className={style.form_item5_input} value={rightInfo.limitNum} onChange={(e) => { changeRights(e, 'limitNum') }} />份/人
                        </Radio>
                      </Radio.Group>
                    </div></div></Row>
                : null
            }
            {equityType && (equityType == 1 || equityType == 3) ?
              <Row justify="space-around" align="center" className={style.form_item2s}>
                <div className={style.form_item2}>
                  <strong><i>*</i>周期循环有效：</strong>
                  <div className={style.form_item5_by}>
                    <Select className={style.form_item5_sele} value={rightInfo.cycle} onChange={(e) => { changeRights(e, 'cycle') }}>
                      <Option value={1}>每天</Option>
                      <Option value={2}>每周</Option>
                      <Option value={3}>每月</Option>
                      <Option value={4}>每季度</Option>
                      <Option value={5}>每年</Option>
                    </Select>
                  </div></div> </Row> : null
            } */}


            {
              equityType == 3 ?
                <Row justify="space-around" align="center">
                  <div className={style.form_item2}>
                    <strong><i>*</i>赠礼时间：</strong>
                    <div className={style.form_item3_by}>
                      <Select className={style.form_item3_sel} value={fixPolite.month} onChange={(e) => { changeTime('month', e) }}>
                        <Option value="1">每月</Option>
                      </Select>
                      <Select className={style.form_item3_sel} value={fixPolite.eDay} onChange={(e) => { changeTime('eDay', e) }}>
                        {
                          dayList.map((item, key) => <Option key={item}>{item}日</Option>)
                        }
                      </Select>
                    </div>
                  </div>
                </Row>
                : null
            }
            {
              equityType == 4 || equityType == 5 ? <Row justify="space-around" align="center">
                <Form.Item label="跳转链接：" name='jumpLink' className={style.form_item} labelCol={{ span: 5 }} rules={[{ required: true, message: "请输入" }]}>
                  <Input placeholder="http://" maxLength='50' />
                </Form.Item>
              </Row> : null
            }
            <div className={style.form_item4}>
              <Button htmlType="button" onClick={hisTask}>取消</Button>
              <Button type="primary" htmlType="submit">确定</Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  )
};
export default connect(({ addRight }) => ({

}))(addRightPage)
