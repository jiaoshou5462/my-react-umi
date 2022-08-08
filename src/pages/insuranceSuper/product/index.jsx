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
  message,
  Checkbox,
  Col,
  InputNumber,
  Upload,
  Switch
} from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN'
import { connect, history } from 'umi';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment'
import 'moment/locale/zh-cn'
import styles from './style.less';
import { uploadIcon } from '@/services/activity.js';
import SetColor from '@/pages/activityModule/components/setColor';
const { Option } = Select;
const { RangePicker } = DatePicker;
let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));
let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken }

const insProduct = (props) => {
  let { dispatch, location, channelList } = props;
  let [form] = Form.useForm();
  let [classityArr, setClassityArr] = useState([]) //分类
  let [moneyType, setMoneyType] = useState(1) //价格类型
  let [wechatImgs, setWechatImgs] = useState('');  //图片
  let [defaultActKey, setDefaultActKey] = useState(location.state && location.state.objectId || '');  //路由参数
  let [defaultActTypes, setDefaultActTypes] = useState(location.state && location.state.type == '1' ? true : false);  //是否是详情
  let [uchannelId, setUchannelId] = useState(location.state && location.state.channelId || '');  //路由渠道

  let [indexColor, setindexColor] = useState({
    color1: "#BDBD00",   //描述颜色
    color2: "#BDBD00",  //展示标签颜色
  });
  //颜色切换
  let setMcolor = (n, i) => {
    let toMcolors = { ...indexColor };
    toMcolors[n] = i;
    setindexColor(toMcolors);
  }
  //提交
  let onSubmit = (vaule) => {
    let re = /[\u4E00-\u9FA5]/g;
    if (re.test(vaule.goodLabel)) {
      if (vaule.goodLabel.match(re).length > 2) {
        message.error("汉字不能超过两个哦！")
        return false;
      }
    }
    if (!wechatImgs) {
      message.error("请上传产品图片！")
      return false;
    }
    let toForm = {}
    if (defaultActKey) {
      toForm.objectId = defaultActKey;
    }
    toForm.channelId = vaule.channelId;
    toForm.objectGoodId = vaule.objectGoodId;
    toForm.effecType = vaule.effecType;
    toForm.startTime = vaule.time ? moment(vaule.time[0]).format('YYYY-MM-DD HH:mm:ss') : '';
    toForm.endTime = vaule.time ? moment(vaule.time[1]).format('YYYY-MM-DD HH:mm:ss') : '';
    toForm.goodTitle = vaule.goodTitle;
    toForm.goodDesc = vaule.goodDesc;
    toForm.goodImg = wechatImgs;
    toForm.priceType = moneyType;
    toForm.goodPrice = vaule.goodPrice;
    toForm.goodLink = vaule.goodLink;
    toForm.goodLabel = vaule.goodLabel;
    toForm.amountUnit = parseInt(amountUnit);
    toForm.descColor = indexColor.color1;
    toForm.descDetails = vaule.descDetails;
    toForm.descSwitch = switchDescs ? 1 : 0;
    toForm.guarAmount = vaule.guarAmount;
    toForm.labelColor = indexColor.color2;
    toForm.priceDefine = vaule.priceDefine;
    dispatch({
      type: 'insuranceSuperProduct/saveChannelSupGood',
      payload: {
        method: 'postJSON',
        params: toForm
      }, callback: (res) => {
        if (res.code === 'S000000') {
          message.info('提交成功');
          setTimeout(() => {
            backList();
          }, 300);
        } else {
          message.error(res.message)
        }
      }
    })


  }
  //取消
  let backList = () => {
    window.history.go(-1);
  }
  let [effecTypes, setEffecTypes] = useState(true)
  //生效日期
  let effecTypeChange = (e) => {
    setEffecTypes(e.target.value == 1 ? true : false)
  }

  //价格类型
  let roChange = (e) => {
    setMoneyType(e.target.value);
  }
  //表单数据监听
  let onFieldsChange = (value) => {
  }
  let [imgTypes, setImgTypes] = useState(true)
  //图片上传
  let weUpload = (file, i) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传JPG/PNG 格式图片!');
      setImgTypes(false);
    } else {
      setImgTypes(true);
    }
    const isLt2M = file.size / 1024 < 100;
    if (!isLt2M) {
      message.error('图片大小不能高于 100KB!');
      setImgTypes(false);
    } else {
      setImgTypes(true);
    }
    return isJpgOrPng && isLt2M;
  }
  let weChange = (info, i) => {
    if (imgTypes) {
      let toItems = info.file.response ? info.file.response.items : ''
      setWechatImgs(toItems)
    }
  };
  //渠道改变
  let changeChannel = () => {
    getAllGoodClass();
  }
  //详情请求
  let getChannelSupGoodDetail = () => {
    dispatch({
      type: 'insuranceSuperProduct/getChannelSupGoodDetail',
      payload: {
        method: 'get',
        objectId: defaultActKey
      }, callback: (res) => {
        if (res.code === 'S000000') {
          let temp = res.data || {}
          temp.effecType = temp.effectTerm == '永久' ? 0 : 1;
          form.setFieldsValue({
            ...temp,
            time: temp.effecType == 1 ? '' : [moment(res.data.startTime), moment(res.data.endTime)]
          })
          setWechatImgs(temp.goodImg)
          setMoneyType(temp.priceType)
          getAllGoodClass(temp.channelId);
          console.log(temp)
          setSwitchDescs(temp.descSwitch == 0 ? false : true);
          setAmountUnit(String(temp.amountUnit));
          let toMcolors = { ...indexColor };
          toMcolors.color1 = temp.descColor;
          toMcolors.color2 = temp.labelColor;
          setindexColor(toMcolors);
          setEffecTypes(temp.effectTerm == 1 ? true : false)
        } else {
          message.error(res.message)
        }
      }
    })
  }
  useEffect(() => {
    getChannel();
    form.setFieldsValue({
      channelId: tokenObj.channelId,
      objectGoodId: [],
      effecType: 1,
      time: "",
      goodTitle: "",
      goodDesc: '',
      priceType: "",
      goodPrice: "",
      goodLink: "",
      goodLabel: "",
      goodImg: '',
      priceDefine: '每月保费',
      descDetails: '',
      guarAmount: ''
    });
    //编辑回显
    if (defaultActKey) {
      getChannelSupGoodDetail();
    }
    if (uchannelId) {
      form.setFieldsValue({
        channelId: uchannelId,
      })
      getAllGoodClass();
    }
  }, [])

  //数据层
  /*获取渠道*/
  let getChannel = () => {
    dispatch({
      type: 'insuranceSuperProduct/getActivityChannelList',
      payload: {
        method: 'postJSON',
        params: {}
      }
    })
  }
  //分类获取
  let getAllGoodClass = (channelId) => {
    dispatch({
      type: 'superMarket/getAllGoodClass',
      payload: {
        method: 'get',
        channelId: channelId ? channelId : form.getFieldsValue().channelId
      }, callback: (res) => {
        if (res.code === 'S000000') {
          setClassityArr([...res.data]);
        } else {
          message.error(res.message)
        }
      }
    })
  }
  //描述开关
  let [switchDescs, setSwitchDescs] = useState(true)
  let switchDesc = (value) => {
    setSwitchDescs(value)
  }
  //保障金额
  let [amountUnit, setAmountUnit] = useState("2")
  let amountUnitChange = (value) => {
    setAmountUnit(value)
  }


  return (
    <div className={styles.block__cont}>
      <h2 className={styles.wrap_h2}>{defaultActKey ? '编辑产品' : '新增产品'}</h2>
      <div className={styles.wrap_main}>
        <Form form={form} onFinish={onSubmit} labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} onFieldsChange={onFieldsChange}>
          <Row justify="space-around" align="left" className={styles.form_box}>
            <div className={styles.form_box_child}>
              <h3 className={styles.wrap_h3}>基本信息</h3>
              <Form.Item label="渠道：" name='channelId' className={styles.form__item} rules={[{ required: true, message: "请选择渠道" }]}>
                <Select placeholder="请选择" showSearch
                  notFoundContent='暂无数据'
                  placeholder="输入渠道可筛选"
                  optionFilterProp="children"
                  onChange={changeChannel}
                  disabled={true}
                >
                  <Option value={tokenObj.channelId}>{tokenObj.channelName}</Option>
                </Select>
              </Form.Item>

              <Form.Item name="objectGoodId" className={styles.form__item} label="分类：" rules={[{ required: true, message: "请选择分类" }]}>
                <Checkbox.Group className={styles.box1_cen_checks} disabled={defaultActTypes}>
                  <Row>
                    {
                      classityArr.map((item, i) => {
                        return <Col span={6}><Checkbox value={item.objectId} style={{ lineHeight: '32px' }}>{item.className}</Checkbox></Col>
                      })
                    }
                  </Row>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item name="effecType" label="生效期限：" className={styles.form__item}>
                <Radio.Group disabled={defaultActTypes} onChange={effecTypeChange}>
                  <Radio value={0}>永久</Radio>
                  <Radio value={1}>指定时间</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="time" label="时间：" className={styles.form__item} rules={[{ required: effecTypes, message: "请选择时间" }]}>
                <RangePicker disabled={defaultActTypes} locale={locale} showTime format="YYYY-MM-DD HH:mm:ss" className={styles.form_item_width2} />
              </Form.Item>
            </div>
          </Row>


          <Row align="left" className={`${styles.form_box} ${styles.form_box2}`}>
            <h3 className={styles.wrap_h3}>内容信息</h3>
            <Form.Item name="goodTitle" label="标题：" className={styles.form__item} rules={[{ required: true, message: "请填写标题" }]}>
              <Input maxLength="30" placeholder="请输入" disabled={defaultActTypes} />
            </Form.Item>
            <Form.Item name="descSwitch" label="描述：" className={styles.form__item}>
              {/* <Input maxLength="200" placeholder="请输入"  disabled={defaultActTypes}/> */}
              <Switch disabled={defaultActTypes} onChange={switchDesc} checked={switchDescs} />
            </Form.Item>
            {switchDescs ? <div className={styles.style_box_by}>
              <Form.Item name="goodDesc" label="描述标题：" className={styles.form__item} rules={[{ required: true, message: "请填写描述标题" }]}>
                <Input maxLength="8" placeholder="不超过8个字" disabled={defaultActTypes} />
              </Form.Item>
              <Form.Item name="descDetails" label="描述详情：" className={styles.form__item} rules={[{ required: true, message: "请填写描述详情" }]}>
                <Input maxLength="10" placeholder="不超过10个字，建议6个字以内" disabled={defaultActTypes} />
              </Form.Item>
              <div className={styles.style_box_pn}><strong className={styles.style_box_strong}>描述颜色：</strong><span className={styles.style_box_span}>
                <SetColor colors={indexColor.color1} colorName='color1' setMColor={setMcolor} /></span></div>
            </div> : ''}
            <div className={styles.style_label_color}>
              <Form.Item name="goodLabel" label="展示标签：" className={styles.form__item}>
                <Input maxLength="4" placeholder="至多2个汉字，4个字符" disabled={defaultActTypes} />
              </Form.Item>
              <div className={styles.style_box_pn2}><strong className={styles.style_box_strong}>标签颜色：</strong>
              <span className={styles.style_box_span}><SetColor colors={indexColor.color2} colorName='color2' setMColor={setMcolor} /></span></div>
            </div>
            <Form.Item className={styles.form__item} name='goodImg' label="产品图片：" rules={[{ required: true, message: "请上传图片" }]}>
              <div className={styles.form_item_up}>
                <div className={styles.form_item_up1}>
                  <Upload
                    name="files"
                    headers={headers}
                    listType="picture"
                    action={uploadIcon}
                    showUploadList={false}
                    onChange={(value => { weChange(value) })}
                    beforeUpload={(value) => { weUpload(value) }}
                  >
                    <Button disabled={defaultActTypes} icon={<UploadOutlined />} className={styles.box2_uplonds}>上传图片</Button>
                  </Upload>
                  <p>建议尺寸：200px*200px，图片大小不超过100kb支持jpg，png</p>
                </div>
                {
                  wechatImgs ? <div className={styles.form_item_up2}>
                    <img className={styles.form_item_up2_m2} src={wechatImgs}></img>
                  </div> : <div className={styles.form_item_up2}>
                    <img className={styles.form_item_up2_m1} src={require('../../../assets/activity/setpage_m3.png')}></img>
                    <p>默认图</p>
                  </div>
                }

              </div>
            </Form.Item>
            <div className={styles.form_item_box11}>
              <Form.Item name="guarAmount" label="保障金额：" className={styles.form__item} rules={[{ required: true, message: "请输入保障金额" }]}>
                <InputNumber placeholder="请输入整数" min={0} precision={0} style={{ width: 300 }} disabled={defaultActTypes} />
              </Form.Item>
              <Select value={amountUnit} onChange={amountUnitChange} className={styles.form_item_box11_pr} disabled={defaultActTypes}>
                <Option value="2">万</Option>
                <Option value="1">千</Option>
              </Select>
            </div>



            <div className={styles.form_item_box2}>
              <span className={styles.form_item_box2_n}>价格类型：</span>
              <Radio.Group onChange={roChange} value={moneyType} disabled={defaultActTypes}>
                <Radio value={0}>一口价</Radio>
                <Radio value={1}>起步价</Radio>
              </Radio.Group>
            </div>
            <div className={styles.form_item_box3}>
              <Form.Item name="goodPrice" label="价格数值：" className={styles.form__item} rules={[{ required: true, message: "请填写价格" }]}>
                <InputNumber min={0} disabled={defaultActTypes} />
              </Form.Item>
              <i className={styles.form__item_i1}>{moneyType == 1 ? '元起' : '元'}</i>
            </div>

            <Form.Item name="priceDefine" label="价格定义：" className={styles.form__item} rules={[{ required: true, message: "请填写请输入" }]}>
              <Input maxLength="20" placeholder="请输入" disabled={defaultActTypes} />
            </Form.Item>

            <Form.Item name="goodLink" label="链接：" className={styles.form__item} rules={[{ required: true, message: "请填写链接" }]}>
              <Input maxLength="200" placeholder="请输入，如http://…" disabled={defaultActTypes} />
            </Form.Item>
          </Row>

          <div className={styles.form__item_btn}>
            <Button htmlType="button" onClick={backList}>取消</Button>
            <Button type="primary" htmlType="submit" disabled={defaultActTypes}>提交</Button>
          </div>



        </Form>
      </div>
    </div>
  )
}
export default connect(({ insuranceSuperProduct }) => ({
  channelList: insuranceSuperProduct.channelList,
}))(insProduct);
