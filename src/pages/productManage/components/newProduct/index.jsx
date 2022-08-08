import { uploadIcon } from '@/services/activity.js'
import { UploadOutlined } from '@ant-design/icons'
import { Editor, Toolbar } from '@wangeditor/editor-for-react' //富文本框
import '@wangeditor/editor/dist/css/style.css'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Radio, Select, Switch } from "antd"
import React, { useEffect, useState } from "react"
import { connect } from 'umi'
import SetColor from '../../../activityModule/components/setColor' //选择颜色组件
import PosterChange from '../../../informationManager/components/posterChange'
import style from "./style.less"
const { RangePicker } = DatePicker
const { Option } = Select
const newProduct = (props) => {
  const [form] = Form.useForm()
  const [formSelect] = Form.useForm()
  let tokenObj = JSON.parse(localStorage.getItem('tokenObj'))
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken }
  let { dispatch, modalInfo, closeModal} = props
  let [selectFormVisiable, setSelectFormVisiable] = useState(null)
  let [selectForm, setSelectForm] = useState({
    startTime: '',
    endTime: ''
  })
  const [editor, setEditor] = useState(null) // 存储 editor 实例
  const [defaultHtmlValue, setDefaultHtmlValue] = useState('')//引导内容回显使用
  const [textConnect, setTextConnect] = useState('')//引导内容回显使用
  const [color, setColor] = useState('white')//取色器
  const [labelColor, setLabelColor] = useState('white')//标签取色器
  const [relationPro, setRelationPro] = useState([])//关联的产品
  const [hitSwitch, setHitSwitch] = useState([])//开关
  const [newsCategorysList, setNewsCategorysList] = useState([])//推荐的客户标
  const [allCategory, setAllCategory] = useState([])//分类
  const [orderTypeList, setOrderTypeList] = useState([])//订单类型
  const [timeType, setTimeType] = useState('指定时间')//订单类型
  const [goodPrice, setGoodPrice] = useState(0)//inputNumber
  const [tagsSelect, setTagsSelect] = useState([])//用于推荐的客户标回显使用
  const [serviceIdsSelect, setServiceIdsSelect] = useState([])//用于推荐的客户标回显使用
  const [goodLabel, setGoodLabel] = useState(0)//标签
  const [spanList, setSpanList] = useState('')//选择宣传海报回调
  const [changePosterModal, setChangePosterModal] = useState(0)//显示宣传海报问题
  const [imgUrl, setImgUrl] = useState('')//imgUrl
  const [showEdit,setShowEdit] = useState(false)
  const toolbarConfig = {} // 菜单栏配置

  const dateFormat = 'YYYY-MM-DD HH:mm'
  const selectAfter = (
    <Select defaultValue="USD" style={{ width: 60 }}>
      <Option value="USD">万</Option>
    </Select>
  )
  // 编辑器配置
  const editorConfig = {
    placeholder: '请输入内容...',
    onCreated: (editor) => {
      // 编辑器创建之后，记录 editor 实例，重要 ！！！ （有了 editor 实例，就可以执行 editor API）
      editor.insertBreak()//回车换行
      editor.undo()//撤销
      setEditor(editor)
    },
    onChange: (editor) => {
      // editor 选区或者内容变化时，获取当前最新的的 content
      setEditor(editor)
      setTextConnect(editor.getHtml())
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
          console.log(file, "1")
          return file
        },
        customInsert(res, insertFn) {
          insertFn(res.items, '', res.items);
        }
      }
    }
  }
  // 组件销毁时，及时销毁 editor 实例，重要！！！
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  /*回调*/
  useEffect(() => {
    // 关联的产品
    getSupGoodsPage()
    // 分类
    crmProCategoryList()
    // 用于推荐的客户标
    findByChannelId()
    // 订单类型
    getDictionary()
    if(modalInfo.modalName == 'edit'){
      getProductInfo()
      console.log(modalInfo,"modalInfo")
    }else{
      setShowEdit(true)
    }
  }, [])

  // 查询订单类型
  let getDictionary = () => {
    dispatch({
      type: 'productMange/getDictionary',
      payload: {
        method: 'get',
        dictionaryId: 2064
      },
      callback: res => {
        if (res.result.code == '0') {
          setOrderTypeList(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 查询全部分类
  let crmProCategoryList = () => {
    dispatch({
      type: 'productMange/crmProCategoryList',
      payload: {
        method: 'postJSON',
      },
      callback: res => {
        if (res.result.code == '0') {
          setAllCategory(res.body.data)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  // 用于推荐的客户标
  let findByChannelId = () => {
    dispatch({
      type: 'productMange/findByChannelId',
      payload: {
        method: 'get',
      },
      callback: res => {
        if (res.result.code == '0') {
          setNewsCategorysList(res.body.data)
        }
      }
    })
  }

   //改变下拉框分类
  let handleChangeCategory = (val)=>{
    let item = tagsSelect;
    item.push(val)
    setTagsSelect(item)
  }

   // 下拉框标签
   let findByChannelIds = () => {
    dispatch({
      type: 'productMange/findByChannelId',
      payload: {
        method:'get',
        params:{
          newsId:modalInfo.data.objectId
        }
      },
      callback: res => {
        if(res.result.code == '0'){
          let cateUserList = [];
          res.body.data.forEach((item,index)=>{
            if(item.newsId != null){
              handleChangeCategory(item.objectId)
            }
          })
          setTagsSelect(cateUserList)
        }
      }
    })
  }

  let getSupGoodsPage = () => {
    dispatch({
      type: 'productMange/getSupGoodsPage',
      payload: {
        method: 'postJSON',
        params: {
          channelId: tokenObj.channelId,
          goodStatus: 1,
          goodQueryType: 0
        }
      },
      callback: res => {
        if (res.code == "S000000") {
          setRelationPro(res.data)
        } else {
          message.error(res.message)
        }
      }
    })
  }
  //详情
  let getProductInfo = () => {
    dispatch({
      type: 'productMange/getProductInfo',
      payload: {
        method: 'post',
        objectId: modalInfo.data.objectId
      },
      callback: res => {
        let result = JSON.parse(JSON.stringify(res.body.data))
        result.serviceIds = result.serviceIds.split(',').map(Number)
        result.newsTags = tagsSelect
        result.posterUrl =  result.posterTitle? result.posterTitle:null
        findByChannelIds()
        setSelectFormVisiable(true)
        if(result.nodeHtmlContent){
          setDefaultHtmlValue([
            {
                type: "paragraph",
                children: JSON.parse(result.nodeHtmlContent),
            }
          ])
        }else{
          setDefaultHtmlValue('')
        }
        setShowEdit(true)
        getChannelSupGoodDetail(result.goodId)
        result.posterTitle?setSpanList({name:result.posterTitle,id:result.posterId}):setSpanList(null)
        form.setFieldsValue(result)
      }
    })
  }

  let getChannelSupGoodDetail = (param) => {
    dispatch({
      type: 'productMange/getChannelSupGoodDetail',
      payload: {
        method: 'get',
        objectId: param
      },
      callback: res => {
        if (res.code == 'S000000') {
          console.log(res.data)
          let resData = JSON.parse(JSON.stringify(res.data))
          resData.hopTime = [moment(res.data.startTime),moment(res.data.endTime)]
          setTimeType(res.data.effectTerm)
          setSelectForm(res.data)
          setImgUrl(res.data.goodImg)
          setColor(res.data.descColor)
          setLabelColor(res.data.labelColor)
          setGoodPrice(res.data.goodPrice)
          setGoodLabel(res.data.goodLabel)
          formSelect.setFieldsValue(resData)
        }
      }
    })
  }

  let submitEvent = (value) => {
    let param = JSON.parse(JSON.stringify(value))
    param.newsTags = value.newsTags.toString()
    param.serviceIds = value.serviceIds.toString()
    param.nodeHtmlContent = JSON.stringify(editor.children)
    param.htmlContent = textConnect
    param.newsType = 2
    param.posterId = spanList.id
    param.title = JSON.parse(JSON.stringify(formSelect.getFieldValue())).goodTitle

    if(modalInfo.modalName == 'edit'){
      param.objectid = modalInfo.data.objectId
    }
    saveProduct(param)

  }

  //颜色切换
  let setMcolor = (n, i) => {
    setColor(i)
  }

  let setTagModal = (n, i) => {
    setLabelColor(i)
  }

  let changeProduct = (params) => {
    setSelectFormVisiable(params)
    getChannelSupGoodDetail(params)
  }

  let clearSelect = (value) => {
    changeProduct(undefined)
  }

  let onChangeHitSwitch = (value) => {
    console.log(value, "value")
    setHitSwitch(value)
  }

  // 选择海报
  let changePoster = () => {
    setChangePosterModal({ modalName: 'changePost'})
  }

  //关闭选择宣传海报弹框
  let callModalPoster = () => {
    setChangePosterModal('')
  }

  //接受子组件传过来的值
  let getValue = (value) => {
    form.setFieldsValue({
      posterUrl: value.url,
      posterId: value.id,
    })
    setSpanList(value)
  }
  // 保存产品
  let saveProduct = (params) => {
    dispatch({
      type: 'productMange/saveProduct',
      payload: {
        method: 'postJSON',
        params:params
      },
      callback: res => {
        console.log(res)
        if (res.result.code == '0') {
          message.success(res.result.message)
          closeModal(true)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  let handleChangeService = (val) =>{
    let initList = serviceIdsSelect
    initList.push(val)
    setServiceIdsSelect(initList)
  }


  return (
    <>
      <Modal
        width={900}
        title={modalInfo.modalName == 'add' ? "新增" : "编辑"}
        maskClosable={false}
        visible={modalInfo.modalName ? true : false}
        footer={null}
        onCancel={() => closeModal()}
      >
        <Form form={form} onFinish={submitEvent}>
          <Form.Item label="客户" labelCol={{ flex: '0 0 120px' }}>
            <Input defaultValue={modalInfo.channelName} disabled />
          </Form.Item>
          <Form.Item label="分类" name="newsCategory" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
            <Select
              showSearch
              notFoundContent='暂无数据'
              placeholder="请选择"
            >
              {allCategory ?
                allCategory.map((item, index) => {
                  return <Option value={item.objectId}>{item.categoryName}</Option>
                })
                : ''}
            </Select>
          </Form.Item>
          <Form.Item label="关联的产品" name='goodId' labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
            <Select
              showSearch
              allowClear
              onClear={() => changeProduct(undefined)}
              notFoundContent='暂无数据'
              placeholder="请选择"
              value={selectFormVisiable}
              onChange={changeProduct}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {relationPro ?
                relationPro.map((item, index) => {
                  return <Option value={item.objectId}>{item.goodTitle}</Option>
                })
                : ''}
            </Select>
          </Form.Item>
          {
            selectFormVisiable ?
              <>
                <Form form={formSelect} >
                  <Form.Item label="生效期限" name="effectTerm" labelCol={{ flex: '0 0 120px' }}>
                    <Radio.Group disabled>
                      <Radio value={'永久'}>永久</Radio>
                      <Radio value={'指定时间'}>指定时间</Radio>
                    </Radio.Group>
                  </Form.Item>
                  {
                    timeType === '指定时间'?
                    <Form.Item label="时间" name = "hopTime" labelCol={{ flex: '0 0 120px' }}>
                      <RangePicker disabled
                        format={dateFormat}
                      />
                  </Form.Item>:''
                  }
                  <Form.Item label="标题" name="goodTitle" labelCol={{ flex: '0 0 120px' }}>
                    <Input disabled />
                  </Form.Item>

                  <Form.Item label="描述" name="sk" labelCol={{ flex: '0 0 120px' }}>
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={hitSwitch} onChange={onChangeHitSwitch} disabled />
                  </Form.Item>

                  <Form.Item label="描述标题" name="goodDesc" labelCol={{ flex: '0 0 120px' }}>
                    <Input disabled />
                  </Form.Item>

                  <Form.Item label="描述详情" name="descDetails" labelCol={{ flex: '0 0 120px' }}>
                    <Input disabled />
                  </Form.Item>

                  <Form.Item label="产品颜色" name="descColor" labelCol={{ flex: '0 0 120px' }}>
                    <SetColor colors={color} setMColor={setMcolor} />
                  </Form.Item>

                  <Form.Item label="产品图片" name="sfsdffrtgr" labelCol={{ flex: '0 0 120px' }} >
                    <div className={style.image_url}>
                      <div>
                        <Button icon={<UploadOutlined />} disabled>上传图片</Button>
                        <p>建议尺寸<br />200px*200px,图片大小<br />不超过100kb支持jpg<br />png</p>
                      </div>
                      <div >
                        <img src={imgUrl} className={style.imgowen}></img>
                      </div>
                    </div>
                  </Form.Item>

                  <Form.Item label="保障金额" name="guarAmount" labelCol={{ flex: '0 0 120px' }} >
                    <Input addonAfter={selectAfter} defaultValue={1} disabled />
                  </Form.Item>

                  <Form.Item label="价格类型" name="priceType" labelCol={{ flex: '0 0 120px' }} >
                    <Radio.Group disabled>
                      <Radio value={0}>一口价</Radio>
                      <Radio value={1}>起步价</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item label="价格数值" name="goodPrice" labelCol={{ flex: '0 0 120px' }} >
                    <InputNumber disabled value={goodPrice} />元
                  </Form.Item>

                  <Form.Item label="价格定义" name="priceDefine" labelCol={{ flex: '0 0 120px' }} >
                    <Input disabled />
                  </Form.Item>

                  <Form.Item label="链接" name="goodLink" labelCol={{ flex: '0 0 120px' }} >
                    <Input disabled />
                  </Form.Item>

                  <Form.Item label="展示标签" name="goodLabel" labelCol={{ flex: '0 0 120px' }} >
                    <div className={style.image_url}>
                      <div>
                        <Input style={{ width: 200 }} disabled value={goodLabel} />&nbsp;&nbsp;&nbsp;&nbsp;标签颜色
                      </div>
                      <div className={style.pic_gap}>
                        <SetColor colors={labelColor} setMColor={setTagModal} />
                      </div>
                    </div>

                  </Form.Item>
                </Form>
              </> : ''
          }
          <Form.Item label="用于客户标签" name="newsTags" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
            <Select
              mode="tags"
              showSearch
              notFoundContent='暂无数据'
              placeholder="请选择"
              defaultValue={tagsSelect}
              onChange={()=>{handleChangeCategory()}}
            >
              {
                newsCategorysList && newsCategorysList.length ? newsCategorysList.map((item, key) => {
                  return <Option value={item.objectId}>{item.tagName}</Option>
                }) : ''
              }
            </Select>
          </Form.Item>

          <Form.Item label="用于订单类型" name="serviceIds" labelCol={{ flex: '0 0 120px' }} rules={[{ required: true }]}>
            <Select
              mode="tags"
              showSearch
              notFoundContent='暂无数据'
              placeholder="请选择"
              defaultValue={serviceIdsSelect}
              onChange={()=>{handleChangeService()}}
            >
              {
                orderTypeList && orderTypeList.length ? orderTypeList.map((item, key) => {
                  return <Option value={item.value}>{item.name}</Option>
                }) : ''
              }
            </Select>
          </Form.Item>

          <Form.Item label="奖励积分" name="rewardPoints" labelCol={{ flex: '0 0 120px' }}>
            <InputNumber size="large" />
          </Form.Item>

          <Form.Item label="宣传海报" labelCol={{ flex: '0 0 120px' }} name="posterUrl" rules={[{ required: true }]}>
            <Button type="primary" onClick={() => { changePoster() }}>选择宣传海报</Button>
            {spanList ? <span><span className={style.fontNameSize}>{spanList.name}</span> <span className={style.fontSize} onClick={() => { setSpanList(null) }}>X</span></span>
              : ''}
          </Form.Item>

          <Form.Item label="锁定默认海报" labelCol={{ flex: '0 0 120px' }} name="posterLockFlag" rules={[{ required: true }]}>
            <Radio.Group >
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="引导内容 " labelCol={{ flex: '0 0 120px' }} name="textContent" >
          <div style={{ border: '1px solid #ccc', zIndex: 100}} id="dev1">
                    {showEdit ? <><Toolbar
                      editor={editor}
                      mode="default"
                      defaultConfig={toolbarConfig}
                      style={{ borderBottom: '1px solid #ccc' }}
                    />
                    <Editor
                      mode="default"
                      defaultConfig={editorConfig}
                      defaultContent={defaultHtmlValue}
                      style={{ height: '500px' }}
                    /></> : ''}
                </div>
          </Form.Item>

          <div className={style.btn_content}>
            <Button htmlType="submit" type="primary" className={style.confirm_btn}>保存</Button>
            <Button htmlType="button" onClick={() => closeModal()}>取消</Button>
          </div>
        </Form>
        {changePosterModal ? <PosterChange modalInfo={changePosterModal} channelType={'product'} toFatherValue={(flag) => callModalPoster(flag)} getValue={(val) => { getValue(val) }}></PosterChange> : ''}
      </Modal>
    </>
  )
};
export default connect((productMange) => ({
}))(newProduct)
