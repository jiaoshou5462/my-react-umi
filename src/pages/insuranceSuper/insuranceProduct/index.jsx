import { connect, history  } from 'umi'
import React, { useEffect, useState, useRef } from 'react'
import {
  Row,
  Col,
  Form,
  Radio,
  Input,
  Select,
  Button,
  Upload,
  Switch,
  message,
  Checkbox,
  DatePicker,
  InputNumber,
  Space,
} from 'antd'
import {PlusOutlined, CloseOutlined } from '@ant-design/icons'
import { Editor, Toolbar } from '@wangeditor/editor-for-react' //富文本框
import SetColor from '@/pages/activityModule/components/setColor' //颜色选择器
import PosterChange from "../../informationManager/components/posterChange" //海报弹窗
import ProductTagModal from "../productTagModal" //产品标签弹窗
import '@wangeditor/editor/dist/css/style.css'
import { uploadIcon } from '@/services/activity.js';
import moment from 'moment'
import 'moment/locale/zh-cn'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import styles from './style.less'
const { Option } = Select
const { RangePicker } = DatePicker
let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken }

const insuranceProductPage = (props) => {
  let { dispatch, location} = props
  let [form] = Form.useForm()
  let [sortList, setSortList] = useState([]) //分类列表
  let [effectType, setEffectType] = useState(1) //指定生效类型
  let [effectTime, setEffectTime] = useState([]) //指定时间
  let [describeStatus, setDescribeStatus] = useState(true) //描述开关状态
  let [imgTypes, setImgTypes] = useState(true) //上传图片的错误状态
  let [goodImg, setGoodImg] = useState('')  //图片链接
  let [priceType, setPriceType] = useState(1)  //价格类型
  let [editor, setEditor] = useState(null) // 富文本 存储 editor 实例
  let [defaultHtmlValue, setDefaultHtmlValue] = useState('')//富文本 引导内容回显使用
  let [htmlContent, setHtmlContent] = useState('')//富文本 onchange 值
  let [guideButton, setGuideButton] = useState('立即投保') //引导页跳转按钮文本
  let [goodLabel, setGoodLabel] = useState('') //展示标签
  let [goodTitle, setGoodTitle] = useState('') //标题
  let [goodDesc, setGoodDesc] = useState('') //描述标题
  let [goodPrice, setGoodPrice] = useState('') //价格数值
  let [descDetails, setDescDetails] = useState('') //描述内容
  let [posterData, setPosterData] = useState({})//选择宣传海报回调
  let [tagVisible, setTagVisible] = useState(false)//是否打开标签选择弹窗
  let [changePosterModal, setChangePosterModal] = useState(0)//显示宣传海报问题
  let [guarAmount, setGuarAmount] = useState(null)//保障金额
  let [amountUnit, setAmountUnit] = useState(2)//保障金额单位
  let [checkTagList, setCheckTagList] = useState([])//选中的标签数组
  let [editorStatus, setEditorStatus] = useState(false)//富文本详情延迟展示
  let [showContent, setShowContent] = useState(1)//是否显示引导页内容 默认是
  let [productId, setProductId] = useState('')//产品id
  let [channelId, setChannelId] = useState(location.state && location.state.channelId || '')  //渠道
  let [objectId, setObjectId] = useState(location.state && location.state.objectId || '')  //产品详情id
  let [detailStatus, setDetailStatus] = useState(location.state && location.state.type === 1 ? true : false)  //是否是查看详情
  let [customizeColor, setCustomizeColor] = useState({
    color1: "#333333",   //描述颜色
    color2: "#FFFFFF",  //展示标签颜色
    color3: "#FD9C0E",  //按钮颜色
  })
  useEffect(() => {
    if(objectId){
      getChannelSupGoodDetail()
    }else {
      setEditorStatus(true)
    }
  },[objectId])
  useEffect(() => {
    form.setFieldsValue({
      priceType,
      guideButton,
      amountUnit,
      showContent: 1,
      posterLockFlag: 0,
      priceDefine: '每月保费',
      effecType: effectType,
      descSwitch: describeStatus,
    })
    if(channelId) {
      getSortList()
    }
  },[channelId])

  //获取分类列表
  let getSortList = () => {
    dispatch({
      type: 'superMarket/getAllGoodClass',
      payload: {
        method: 'get',
        channelId,
      }, callback: (res) => {
        if (res.code === 'S000000') {
          setSortList([...res.data])
        } else {
          message.error(res.message)
        }
      }
    })
  }
  /*生效期限*/
  let onEffectTypeChange = (e) => {
    let temp = e.target.value
    setEffectType(temp)
    form.setFieldsValue({
      effecType: temp
    })
  }
  /*生效时间*/
  let onTimeChange = (e) => {
      setEffectTime(e)
  }
  /*描述开关*/
  let onDescribeChange = (e) => {
    form.setFieldsValue({
      descSwitch: e
    })
    setDescribeStatus(e)
  }
  /*颜色切换*/
  let onColorChange = (key, e) => {
    let tempColor = JSON.parse(JSON.stringify(customizeColor))
    tempColor[key] = e
    setCustomizeColor(tempColor)
  }
  /*图片上传前的校验*/
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
  /*上传后的回调*/
  let weChange = (e) => {
    if (imgTypes) {
      let toItems = e.file.response ? e.file.response.items : ''
      form.setFieldsValue({
        goodImg: toItems
      })
      setGoodImg(toItems)
    }
  }
  const uploadButton = (
      <div style={{marginTop: 25}}>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>上传图片</div>
      </div>
  )
  /*限制数字输入框只能输入整数*/
  let limitNumber = (value) => {
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(/\D/g, '') : ''
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(/\D/g, '') : ''
    } else {
      return null
    }
  }
  /*价格类型*/
  let onPriceTypeChange = (e) => {
    setPriceType(e.target.value)
  }
  /*保障金额*/
  let onGuarAmountChange = (e) => {
    form.setFieldsValue({
      guarAmount: e
    })
    setGuarAmount(e)
  }
  /*保障金额单位*/
  let onAmountUnitChange = (e) => {
    form.setFieldsValue({
      amountUnit: e
    })
    setAmountUnit(e)
  }
  /*描述标题*/
  let onDescChange = (e) => {
    setGoodDesc(e.target.value)
  }
  /*描述内容*/
  let onDetailsChange = (e) => {
    setDescDetails(e.target.value)
  }
  /*价格数值*/
  let onPriceChange = (e) => {
    setGoodPrice(e.target.value)
  }

  // 富文本配置
  const editorConfig = {
    placeholder: '请输入内容...',
    preview: true,
    onCreated: (editor) => {
      // 编辑器创建之后，记录 editor 实例，重要 ！！！ （有了 editor 实例，就可以执行 editor API）
      editor.insertBreak()//回车换行
      editor.undo()//撤销
      if(detailStatus) {
        editor.disable()//禁用
      }
      setEditor(editor)
    },
    onChange: (editor) => {
      // editor 选区或者内容变化时，获取当前最新的的 content
      if(detailStatus) {
        return
      }
      setEditor(editor)
      setHtmlContent(editor.getHtml())
      form.setFieldsValue({
        htmlContent: editor.getHtml()
      })
    },
    MENU_CONF: {
      uploadImage: {
        server: uploadIcon,
        // form-data fieldName ，默认值 'wangeditor-uploaded-file'
        fieldName: 'files',
        maxFileSize: 10 * 1024 * 1024, // 10M
        // 最多可上传几个文件，默认为 100
        maxNumberOfFiles: 10,
        // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
        allowedFileTypes: ['image/*'],
        headers: {
          "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken,
          Accept: '*/*',
        },
        onBeforeUpload(file) {
          return file
        },
        customInsert(res, insertFn) {
          insertFn(res.items, '', res.items);
        }
      }
    }
  }
  useEffect(() => {
    onRenderHTML()
  },[htmlContent])
  /*副本同步渲染*/
  let onRenderHTML = () => {
    return <div dangerouslySetInnerHTML={{__html: htmlContent}} className={styles.productR_view_cont}/>
  }
  /*标题*/
  let onTitleChange = (e) => {
    setGoodTitle(e.target.value)
  }
  /*引导页跳转按钮文本*/
  let onLabelChange = (e) => {
    let temp = e.target.value
    setGoodLabel(temp)
    form.setFieldsValue({
      goodLabel: temp
    })
  }
  /*引导页跳转按钮文本*/
  let onGuideButtonChange = (e) => {
    let temp = e.target.value
    setGuideButton(temp)
    form.setFieldsValue({
      guideButton: temp
    })
  }
  /*选择海报*/
  let changePoster = () => {
    setChangePosterModal({ modalName: 'changePost'})
  }

  /*关闭选择宣传海报弹框*/
  let callModalPoster = () => {
    setChangePosterModal('')
  }

  /*海报子组件的回调*/
  let getValue = (e) => {
    let temp = {
      posterId: e.id,
      posterUrl: e.url,
      posterName: e.name,
    }
    form.setFieldsValue({
      ...temp
    })
    setPosterData(temp)
  }
  /*产品标签回调*/
  let onTagChange = (e) => {
    if(e) {
      let temp = JSON.parse(JSON.stringify(checkTagList))
      e.productsTags = e.id + ''
      e.productsTagsName = e.tagName
      delete e.id
      delete e.tagName
      temp.push(e)
      setCheckTagList(temp)
    }
    setTagVisible(false)
  }
  /*删除标签*/
  let onDelTag = (key) => {
    let temp = JSON.parse(JSON.stringify(checkTagList))
    temp.splice(key, 1)
    setCheckTagList(temp)
  }
  useEffect(() => {
    form.setFieldsValue({
      productsTagInfos: checkTagList
    })
  },[checkTagList])
  /*提交*/
  let onSubmit = (e) => {
    if(showContent) {
      if(htmlContent.indexOf('img') < 0){
        let reg =/<[^>]+>/gim
        let str = htmlContent.replace(reg,"")
        let tempStr = str.replace(/\s*/g,"")
        if(!tempStr){
          message.info('请填写引导内容')
          return
        }
      }
    }

    let data = {
      ...e,
      channelId,
      ...posterData,
      effecType: effectType,
      labelColor: customizeColor.color2,
      guideButtonColour: customizeColor.color3,
      descSwitch: e.descSwitch ? 1 : 0,
    }
    if(showContent) {
      data.nodeHtmlContent = JSON.stringify(editor.children)
    }else {
      data.nodeHtmlContent = ''
    }
    if (describeStatus) {
      data.descColor = customizeColor.color1
    }
    if (effectType === 1) {
      let startTime = moment(effectTime[0]).format('YYYY-MM-DD HH:mm:ss')
      let endTime = moment(effectTime[1]).format('YYYY-MM-DD HH:mm:ss')
      data.startTime = startTime
      data.endTime = endTime
    }
    if(objectId){
      data.objectId = objectId
      data.productId = productId
    }
    dispatch({
      type: 'insuranceSuperProduct/saveChannelSupGood',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.code === 'S000000') {
          message.success({
            content: '保存成功',
            duration: 2,
            onClose: () => {
              goBack()
            }
          })
        } else {
          message.error(res.message)
        }
      }
    })
  }
  //详情请求
  let getChannelSupGoodDetail = () => {
    dispatch({
      type: 'insuranceSuperProduct/getChannelSupGoodDetail',
      payload: {
        method: 'get',
        objectId: objectId
      }, callback: (res) => {
        if (res.code === 'S000000') {
          let temp = res.data || {}
          form.setFieldsValue({
            ...temp
          })
          setShowContent(temp.showContent)
          setHtmlContent(temp.htmlContent)
          setGoodImg(temp.goodImg || '')
          setGoodDesc(temp.goodDesc || '')
          setProductId(temp.productId || '')
          setGoodTitle(temp.goodTitle || '')
          setGoodLabel(temp.goodLabel || '')
          setGoodPrice(temp.goodPrice || '0')
          setGuarAmount(temp.guarAmount || '')
          setDescDetails(temp.descDetails || '')
          setGuideButton(temp.guideButton || '')
          setCheckTagList(temp.productsTagInfos || [])
          setDescribeStatus(temp.descSwitch === 1 ? true : false)
          let tempColor = {
            color1: '#333333',
            color2: temp.labelColor || '',
            color3: temp.guideButtonColour || '',
          }
          if(temp.effectType === '1') {
            setEffectType(1)
            setEffectTime([moment(temp.startTime),moment(temp.endTime)])
          }else {
            setEffectType(0)
          }
          if (temp.descSwitch === 1) {
            tempColor.color1 = temp.descColor
          }
          let tempPoster = {
            posterId: temp.posterId,
            posterUrl: temp.posterUrl,
            posterName: temp.posterName,
          }
          setPosterData(tempPoster)
          setCustomizeColor(tempColor)
          if(temp.nodeHtmlContent){
            setDefaultHtmlValue([
              {
                type: "paragraph",
                children: JSON.parse(temp.nodeHtmlContent),
              }
            ])
          }else{
            setDefaultHtmlValue('')
          }
          setEditorStatus(true)
        } else {
          message.error(res.message)
        }
      }
    })
  }
  /*是否显示详情页开关*/
  let onShowContChange = (e) => {
    setShowContent(e.target.value)
  }
  /*返回上一页面*/
  let goBack = () => {
    window.history.go(-1)
  }

  return <>
    <Form className={styles.block_box} form={form} onFinish={onSubmit}>
      <div style={{flex: '0 0 70%', paddingBottom: '40px'}}>
        <div className={styles.block_left_cont}>
          <div className={styles.block_heading}>基本信息</div>
          <Row style={{margin: '32px 32px 0 0'}}>
            <Col span={16}>
              <Form.Item label="分类" name="objectGoodId" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}} rules={[{ required: true, message: "请选择" }]}>
                <Checkbox.Group style={{ width: '100%' }}>
                  {
                    sortList.map((item, i) => {
                      return <Checkbox value={item.objectId}  disabled={detailStatus}>{item.className}</Checkbox>
                    })
                  }
                </Checkbox.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{margin: '24px 32px 0 0'}}>
            <Col span={16}>
              <Form.Item label="生效期限" name="effecType" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}} rules={[{ required: true, message: "请选择" }]}>
                <div style={{display: 'flex'}}>
                  <Radio.Group value={effectType} onChange={onEffectTypeChange} disabled={detailStatus} style={{ width: '168px', marginTop: '7px'}}>
                    <Radio value={0}>永久</Radio>
                    <Radio value={1}>指定时间</Radio>
                  </Radio.Group>
                  {
                    effectType === 1 ?
                        <RangePicker
                            showTime
                            value={effectTime}
                            locale={locale}
                            onChange={onTimeChange}
                            disabled={detailStatus}
                            style={{ width: '17vw' }}
                            format="YYYY-MM-DD HH:mm:ss"
                        /> : null
                  }
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{margin: '24px 32px 0 0'}}>
            <Col span={16}>
              <Form.Item label="产品名称" name="goodTitle" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}} rules={[{ required: true, message: "请输入" }]}>
                <Input maxLength="30" placeholder="请输入" style={{width: '20vw'}} value={goodTitle} disabled={detailStatus} onChange={onTitleChange}/>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{margin: '24px 32px 0 0'}}>
            <Col span={16}>
              <Form.Item label="显示描述文字" name="descSwitch" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}} rules={[{ required: true, message: "请选择" }]}>
                <Switch onChange={onDescribeChange} checked={describeStatus} disabled={detailStatus} />
              </Form.Item>
            </Col>
          </Row>
          {
            describeStatus ? <>
              <Row style={{margin: '24px 32px 0 0'}}>
                <Col span={16}>
                  <Form.Item label="描述标题" name="goodDesc" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}} rules={[{ required: true, message: "请输入" }]}>
                    <Input
                        maxLength="8"
                        onChange={onDescChange}
                        placeholder="不超过8个字"
                        style={{width: '20vw'}}
                        disabled={detailStatus}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{margin: '24px 32px 0 0'}}>
                <Col span={16}>
                  <Form.Item label="描述内容" name="descDetails" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}} rules={[{ required: true, message: "请输入" }]}>
                    <Input
                        maxLength="10"
                        style={{width: '20vw'}}
                        disabled={detailStatus}
                        onChange={onDetailsChange}
                        placeholder="不超过10个字，建议6个字以内"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{margin: '24px 32px 0 0'}}>
                <Col span={16}>
                  <Form.Item label="描述标题颜色" name="descColor" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}}>
                    <div style={{marginTop: '6px'}}>
                      <SetColor
                          colorName='color1'
                          disabled={detailStatus}
                          setMColor={onColorChange}
                          colors={customizeColor.color1}
                      />
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </> : null
          }
          <Row style={{margin: '24px 32px 0 0'}}>
            <Col span={24}>
              <Form.Item label="角标标签" name="goodLabel" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}}>
                <div style={{display: 'flex'}}>
                  <Input
                      maxLength="4"
                      value={goodLabel}
                      onChange={onLabelChange}
                      style={{width: '20vw'}}
                      disabled={detailStatus}
                      placeholder="至多2个汉字，4个字符"
                  />
                  <div style={{display: 'flex'}}>
                    <span className={styles.tag_title}>标签颜色</span>
                    <div style={{marginTop: '6px'}}>
                      <SetColor
                          colorName='color2'
                          disabled={detailStatus}
                          setMColor={onColorChange}
                          colors={customizeColor.color2}
                      />
                    </div>
                  </div>
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{margin: '24px 32px 0 0'}}>
            <Col span={16}>
              <Form.Item label="产品图片" name="goodImg" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}} rules={[{ required: true, message: "请上传图片" }]}>
                <Upload
                    name="files"
                    headers={headers}
                    listType="picture"
                    action={uploadIcon}
                    showUploadList={false}
                    disabled={detailStatus}
                    onChange={(value => { weChange(value) })}
                    beforeUpload={(value) => { weUpload(value) }}
                >
                  <div className={styles.goodImg_box}>
                    {goodImg ? <img src={goodImg} style={{ width: '100%', height: '100%' }} /> : uploadButton}
                  </div>
                </Upload>
                <div className={styles.goodImg_remark}>建议尺寸 1:1，图片大小不超过100kb，支持jpg、png。该图将用于产品列表页缩略图、产品引导页头图</div>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{margin: '24px 32px 0 0'}}>
            <Col span={16} flex={'start'}>
              <Form.Item label="保障金额" name="guarAmount" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}} rules={[{ required: true, message: "请输入" }]}>
                <div style={{display: 'flex'}}>
                  <InputNumber
                      min={0}
                      precision={0}
                      value={guarAmount}
                      onChange={onGuarAmountChange}
                      parser={limitNumber}
                      placeholder="请输入整数"
                      formatter={limitNumber}
                      disabled={detailStatus}
                      style={{ width: '20vw' }}
                  />
                  <div style={{marginLeft: '8px'}}>
                   <Form.Item name="amountUnit" style={{margin: 0}}>
                      <Select disabled={detailStatus} onChange={onAmountUnitChange} value={amountUnit}>
                        <Option value={1}>千</Option>
                        <Option value={2}>万</Option>
                      </Select>
                    </Form.Item>
                  </div>
                </div>
              </Form.Item>

            </Col>
          </Row>
          <Row style={{margin: '24px 32px 0 0'}}>
            <Col span={16}>
              <Form.Item label="价格类型" name="priceType" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}} rules={[{ required: true, message: "请选择" }]}>
                <Radio.Group onChange={onPriceTypeChange} disabled={detailStatus}>
                  <Radio value={0}>一口价</Radio>
                  <Radio value={1}>起步价</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{margin: '24px 32px 0 0'}}>
            <Col span={16}>
              <Form.Item label="价格数值" name="goodPrice" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}} rules={[{ required: true, message: "请输入" }]}>
                <Input
                    onChange={onPriceChange}
                    disabled={detailStatus}
                    style={{ width: '20vw' }}
                    addonAfter={priceType === 1 ? '元起' : ' 元 '}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{margin: '24px 32px 0 0'}}>
            <Col span={16}>
              <Form.Item label="价格定义" name="priceDefine" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}} rules={[{ required: true, message: "请输入" }]}>
                <Input maxLength="20" placeholder="请输入" style={{ width: '20vw' }} disabled={detailStatus}/>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{margin: '24px 32px 0 0'}}>
            <Col span={16}>
              <Form.Item label="链接" name="goodLink" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}} rules={[{ required: true, message: "请输入" }]}>
                <Input maxLength="200" placeholder="请输入，如http://…" style={{ width: '20vw' }} disabled={detailStatus}/>
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className={styles.block_left_cont}>
          <div className={styles.block_heading}>推广信息</div>
          <Row style={{margin: '24px 32px 0 0'}}>
            <Col span={16}>
              <Form.Item label="产品标签" name="productsTagInfos" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}}>
                <div className={styles.product_tag_box}>
                  {
                    checkTagList.length > 0 ? checkTagList.map((item, key) => {
                      return <div className={styles.product_tag}>
                        标签{key + 1}：{item.productsTagsName}；权重：{item.tagWeight}
                        {
                          !detailStatus ? <CloseOutlined onClick={() => {onDelTag(key)}}/> : null
                        }
                      </div>
                    }) : null
                  }
                  {
                    !detailStatus ? <div className={styles.product_tag}  onClick={() => {setTagVisible(!tagVisible)}}>
                      <PlusOutlined style={{marginRight: '8px'}} />
                      添加标签
                    </div> : null
                  }
                  <div className={styles.product_remark}>产品标签用于匹配推荐用户，标签权重越高，匹配度越高</div>
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{margin: '24px 32px 0 0'}}>
            <Col span={16}>
              <Form.Item label="宣传海报" name="posterId" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}}>
                <div>
                  {
                    !detailStatus ? <div className={styles.product_poster_box} onClick={changePoster}>
                      <img src={require('../../../assets/poster_icon.png')}  />
                      <span>选择宣传海报</span>
                    </div> : null
                  }
                  {
                    posterData.posterName ? <div className={styles.product_poster_text}>
                      已选择：{posterData.posterName}
                    </div> : null
                  }
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{margin: '24px 32px 0 0'}}>
            <Col span={16}>
              <Form.Item label="允许更改海报" name="posterLockFlag" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}}>
                <Radio.Group disabled={detailStatus}>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{margin: '24px 32px 0 0'}}>
            <Col span={16}>
              <Form.Item label="显示推广详情页" name="showContent" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}} rules={[{ required: true, message: "请选择" }]}>
                <Radio.Group disabled={detailStatus} onChange={onShowContChange}>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </Radio.Group>
              </Form.Item>
              <div className={styles.product_remark} style={{paddingLeft: '140px'}}>用于单个产品推广时，用户可停留在推广页，点击推广按钮跳转至产品链接，不显示推广详情页，单个产品推广时，用户会直接跳转至产品链接</div>
            </Col>
          </Row>
          <div style={{display: !showContent ? 'none' : 'block'}}>
            <Row style={{margin: '24px 32px 0 0'}}>
              <Col span={20}>
                <Form.Item label="推广内容" labelCol={{ flex: '0 0 120px' }} name="htmlContent" rules={[{ required: !showContent ? false : true, message: "请输入" }]}>
                  <div style={{ border: '1px solid #ccc', zIndex: 100}}>
                    {
                      editorStatus ? <>
                        <Toolbar
                            editor={editor}
                            mode="default"
                            style={{ borderBottom: '1px solid #ccc' }}
                        />
                        <Editor
                            id="dev1"
                            mode="default"
                            defaultConfig={editorConfig}
                            defaultContent={defaultHtmlValue}
                            style={{ height: '280px' }}
                        />
                      </> : null
                    }
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Row style={{margin: '24px 32px 0 0'}}>
              <Col span={24}>
                <Form.Item label="跳转按钮" name="guideButton" labelCol={{ flex: '0 0 140px' }} style={{margin: 0}} rules={[{ required: !showContent ? false : true, message: "请输入" }]}>
                  <div style={{display: 'flex'}}>
                    <Input
                        maxLength="6"
                        value={guideButton}
                        disabled={detailStatus}
                        placeholder="至多6个汉字"
                        style={{width: '20vw'}}
                        onChange={onGuideButtonChange}
                    />
                    <div style={{display: 'flex', position: 'relative'}}>
                      <span className={styles.tag_title}>按钮颜色</span>
                      <div style={{marginTop: '6px'}}>
                        <SetColor
                            colorName='color3'
                            colorPosition={'top'}
                            disabled={detailStatus}
                            setMColor={onColorChange}
                            colors={customizeColor.color3}
                        />
                      </div>
                    </div>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      {/*动态预览*/}
      <div className={styles.block_right_cont}>
        <div className={styles.block_heading}>动态预览</div>
        <div className={styles.productR_view} style={{ backgroundImage: `url(${require('@/assets/phoneViewBg.png')})` }}>
          <div className={styles.productR_view_box}>
            <div className={styles.productR_view_img}>
              {
                goodImg ? <img src={goodImg} className={styles.productR_view_img}/> : null
              }
              {
                goodLabel ? <div className={styles.productR_view_label_box}>
                  <div className={styles.productR_view_label_bg} style={{background: customizeColor.color2}}/>
                  <div className={styles.productR_view_label}>{goodLabel}</div>
                </div> : null
              }
              {
                describeStatus ? <div className={styles.productR_view_goodDesc_box}>
                  <div style={{background: customizeColor.color1}} className={styles.productR_view_goodDesc_bg}/>
                  <div className={styles.productR_view_goodDesc} style={{color: customizeColor.color1}}>
                    <span className={styles.productR_view_goodDesc_title}>{goodDesc}</span>
                    <span>{descDetails}</span>
                  </div>
                </div> : null
              }
            </div>
            <div className={styles.productR_view_title}>{goodTitle}</div>
            <div className={styles.productR_view_amount}>
              最高保障 {guarAmount}{amountUnit === 1 ? '千' : '万'}
            </div>
            <div className={styles.productR_view_heading}>
              <div className={styles.productR_view_heading_line}/>
              <div style={{margin: '0 10px'}}>描述</div>
              <div className={styles.productR_view_heading_line}/>
            </div>
            {
              onRenderHTML()
            }
            <div className={styles.productR_view_btn_box}>
              <div className={styles.productR_view_btn_left}>
                <span>{goodPrice}</span>
                <span className={styles.productR_view_btn_left_unit}>{priceType === 1 ? ' 元起' : ' 元 '}</span>
              </div>
              <div className={styles.productR_view_btn} style={{background: customizeColor.color3}}>{guideButton}</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.product_btm_box}>
        <Row justify="end">
          <Space size={22}>
            <Button htmlType="button" onClick={goBack}>取消</Button>
            <Button htmlType="submit" type="primary" disabled={detailStatus}>提交</Button>
          </Space>
        </Row>
      </div>
    </Form>
    {
      changePosterModal ?
        <PosterChange
            modalInfo={changePosterModal}
            channelType={'product'}
            toFatherValue={(flag) => callModalPoster(flag)}
            getValue={(val) => { getValue(val) }}
        /> : null
    }
    {
      tagVisible ? <ProductTagModal
          tagVisible={tagVisible}
          onTagChange={onTagChange}
          checkTagList={checkTagList}
      /> : null
    }

  </>
}
export default connect(({ insuranceProduct }) => ({
}))(insuranceProductPage);
