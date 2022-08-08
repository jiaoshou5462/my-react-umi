import React,{useEffect, useState} from "react"
import { connect, history } from 'umi'
import { Row, Col,Form, Modal,  Select, Input, DatePicker, Button, Table, Upload, Radio, Space, message, Tooltip,InputNumber  } from "antd"
import style from "./style.less"
import moment from 'moment';
import 'moment/locale/zh-cn';
import { uploadIcon } from '@/services/activity.js';
import locale from 'antd/lib/date-picker/locale/zh_CN'
import {InsertRowLeftOutlined, PlusCircleOutlined} from '@ant-design/icons'
import '@wangeditor/editor/dist/css/style.css'
import { IDomEditor, IEditorConfig, IToolbarConfig, SlateTransforms } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-react' //富文本框
import PosterChange from '../posterChange';
moment.locale('zh-cn');
const { confirm } = Modal
const { TextArea } = Input;
let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
const newInformationManagere =(props)=>{
  let tokenObj=JSON.parse(localStorage.getItem('tokenObj'));
  
  let {dispatch, modalInfo, toFatherValue} = props,
  [form] = Form.useForm(),
  [saveCategoryForm] = Form.useForm()
  const [visitVisable, setVisitVisable] = useState(0)//引用和原创的判断
  const [categoryList, setCategoryList] = useState([])//分类下拉框
  const [posterList, setPosterList] = useState([])//海报
  const [newsCategorysList, setNewsCategorysList] = useState([])//推荐的客户标
  const [categoryValue, setCategoryValue] = useState([])//分类显示的值
  const [newsCategorysValue, setNewsCategorysValue] = useState([])//用于推荐的客户标显示的值
  const [addCategoryVisable, setAddCategoryVisable] = useState(false)//添加分类
  const [iconUrl, setIconUrl] = useState('')//上传图片
  const [synPosterValue, setSynPosterValue] = useState(2)//锁定默认海报
  const [toolTip, setToolTip] = useState('1、在设置过默认宣传海报的前提下，锁定默认海报，则销售人员在”掌客通-小程序”上直接选择该内容进行生成海报操作，直接显示默认宣传海报且不允许更换海报和二维码；2、当没有设置默认宣传海报时，则锁定默认海报功能无效。')//锁定海报toolTop文字提示
  const [changePosterModal, setChangePosterModal] = useState('')//选择海报
  const [spanList, setSpanList] = useState('')//选择宣传海报回调
  const [orderNo, setOrderNo] = useState(1)//排序
  const [htmlConnect, setHtmlConnect] = useState('')//引导内容因为进页面就会调用onchange事件  改变使用
  const [defaultHtmlValue, setDefaultHtmlValue] = useState('')//引导内容回显使用
  const [showEdit,setShowEdit] = useState(false)
  const [fileList, setFileList] = useState([])//上传图片

  const [editor, setEditor] = useState(null) // 存储 editor 实例
  
  const toolbarConfig = {} // 菜单栏配置
  
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
        setHtmlConnect(editor.getHtml())
        form.setFieldsValue({
          htmlContent:editor.getHtml()
        })
        console.log('changed', editor.children,"text",editor.getText())
      },
      MENU_CONF: {
        uploadImage: {
          server: uploadIcon,
          // form-data fieldName ，默认值 'wangeditor-uploaded-file'
          fieldName: 'files',
          maxFileSize: 10 * 1024 * 1024, // 2M
          // 最多可上传几个文件，默认为 100
          maxNumberOfFiles: 10,
          // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
          allowedFileTypes: ['image/*'],
          headers: {
            "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken,
            Accept: '*/*',
          },
          onBeforeUpload(file) {
            console.log(file,"1")
            return file
          },
          customInsert(res,insertFn){
            console.log(res)
            insertFn(res.items,'',res.items);
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
  
 //添加提交
  let submitEvent = (json) => {
    
    console.log(editor.getHtml(),"1",htmlConnect,"2")
    let value = JSON.parse(JSON.stringify(json))
    var dateObj = new Date(value.reportTime); 
    var momentObj = moment(dateObj); 
    var momentString = momentObj.format('YYYY-MM-DD HH:mm'); // 2016-07-15 
    value.newsTags = value.newsTags.toString()
    var resultData = JSON.parse(JSON.stringify(value))
    resultData.reportTime = momentString
    resultData.posterLockFlag = synPosterValue
    resultData.newsOrderNo = orderNo
    resultData.type = visitVisable
    resultData.posterId = spanList.id
    resultData.htmlContent = htmlConnect
    resultData.nodeHtmlContent = JSON.stringify(editor.children)
    if(modalInfo.modalName=='edit'){
      resultData.objectId = modalInfo.objectId
    }
    console.log(resultData,"1")
    save(resultData)
  }

  let save = (param)=>{
    dispatch({
      type: 'informationManager/saveOrUpdateNews',
      payload: {
        method:'postJSON',
        params:param
      },
      callback: res => {
        if(res.result.code == '0'){
          message.success(res.result.message)
          toFatherValue(true)
        }else{
          message.error(res.result.message)
        }
        
      }
    })
  }
  //搜索条件
  useEffect(() => {
    if(modalInfo.modalName != 'add'){
      findByChannelIds()
      getNewsDetails()
    }else{
      setShowEdit(true)
    }
    crmNewsCategoryList()
    findByChannelId()
  },[])


  // 查询详情
  let getNewsDetails = (record)=>{
    dispatch({
      type: 'informationManager/getNewsDetails',
      payload: {
        method:'get',
        newsId:modalInfo.objectId
      },
      callback: res => {
        if(res.result.code == '0'){
          setOrderNo(res.body.data.newsOrderNo)
          getValue({
            name:res.body.data.posterTitle,
            url:res.body.data.posterUrl,
            id:res.body.data.posterId
          });
          setSynPosterValue(res.body.data.posterLockFlag)
          setIconUrl(res.body.data.iconUrl)
          setVisitVisable(res.body.data.type)
          console.log(res.body.data.htmlContent)
          if(res.body.data.nodeHtmlContent){
            setDefaultHtmlValue([
              {
                  type: "paragraph",
                  children: JSON.parse(res.body.data.nodeHtmlContent),
              }
            ])
          }else{
            setDefaultHtmlValue('')
          }
          
          setShowEdit(true);
          handleChange(res.body.data.iconUrl,'upload')
          form.setFieldsValue({
            newsCategory:res.body.data.newsCategory,
            reportTime:moment(res.body.data.reportTime),
            title:res.body.data.title,
            type:res.body.data.type,
            newsTag:record,
            textContent:res.body.data.textContent,
            htmlContent:res.body.data.htmlContent,
            posterLockFlag:res.body.data.posterLockFlag,
            newsTags:newsCategorysValue,
            posterUrl:res.body.data.posterUrl || res.body.data.posterTitle?  res.body.data.posterTitle:res.body.data.posterTitle,
            iconUrl:res.body.data.iconUrl,
            objectId:res.body.data.objectId,
            refUrl:res.body.data.refUrl,
            saleOpenType:res.body.data.saleOpenType,
          })
          console.log(defaultHtmlValue)
        }else{
          message.error(res.result.message)
        }
      }
    }) 

  }
  // 下拉框标签
  let findByChannelId = () => {
    dispatch({
      type: 'informationManager/findByChannelId',
      payload: {
        method:'get',
      },
      callback: res => {
        if(res.result.code == '0'){
          setNewsCategorysList(res.body.data)
        }
      }
    })
  }

  // 下拉框标签
  let findByChannelIds = () => {
    dispatch({
      type: 'informationManager/findByChannelId',
      payload: {
        method:'get',
        params:{
          newsId:modalInfo.objectId  
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
          setNewsCategorysValue(cateUserList)
        }
      }
    })
  }
  
  // 下拉框分类
  let crmNewsCategoryList = () => {
    dispatch({
      type: 'informationManager/crmNewsCategoryList',
      payload: {
        method:'post',
        params: {
        }
      },
      callback: res => {
        if(res.result.code == '0'){
          setCategoryList(res.body.data)
        }
      }
    })
  }

  // 保存分类 
  let realSaveCategory = (param) => {
    console.log(param)
    dispatch({
      type: 'informationManager/saveCategory',
      payload: {
        method:'postJSON',
        params: param
      },
      callback: res => {
        if(res.result.code == '0' ){
          message.success(res.result.message)
          setAddCategoryVisable(false)
          crmNewsCategoryList()
        }else{
          message.error(res.result.message)
        }
      }
    })
  }
  //改变下拉框分类
  let handleChangeCategory = (val)=>{
    let item = newsCategorysValue;
    item.push(val)
    setNewsCategorysValue(item)
  }

  // 表情转码
  let utf16toEntities = (str) => {
    const patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
    str = str.replace(patt, (char) => {
      let H;
      let L;
      let code;
      let s;

      if (char.length === 2) {
        H = char.charCodeAt(0); // 取出高位
        L = char.charCodeAt(1); // 取出低位
        code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
        s = `&#${code};`;
      } else {
        s = char;
      }

      return s;
    });

    return str;
  }
  // 表情解码
  let entitiestoUtf16  = (strObj) => {
    const patt = /&#\d+;/g;
    const arr = strObj.match(patt) || [];

    let H;
    let L;
    let code;

    for (let i = 0; i < arr.length; i += 1) {
      code = arr[i];
      code = code.replace('&#', '').replace(';', '');
      // 高位
      H = Math.floor((code - 0x10000) / 0x400) + 0xD800;
      // 低位
      L = ((code - 0x10000) % 0x400) + 0xDC00;
      code = `&#${code};`;
      const s = String.fromCharCode(H, L);
      strObj = strObj.replace(code, s);
    }
    return strObj;
  }
  
  //添加分类
  let addCategory = ()=>{
    setAddCategoryVisable(true);
  }
  //删除图片
  let removeImage =() =>{
    setFileList([])
    setIconUrl('')
  }
  // 改变图片
  let handleChange = (value,name) => {
    if(name){
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: value
        }
      ])
    }else{
      if (value.file && value.file.response) {
        let res = value.file.response
        if (res.code === 'S000000') {
          setFileList([
            {
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: res.items
            }
          ])
          setIconUrl(res.items)
          form.setFieldsValue({
            iconUrl:res.items
          })
        } else {
          message.error('上传失败')
        }
      }else {
        // setIconUrl(value)
        form.setFieldsValue({
          iconUrl:value
        })
      }
    }
  };
  let beforeUpload  = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传图片文件！');
    }
    const isLt2M = file.size / 1024 / 100;
    if (!isLt2M) {
      message.error('上传图片文件不能超过100k');
    }
    return isJpgOrPng && isLt2M;
  }
  //改变锁定默认海报
  let onChangeSynPost = e => {
    setSynPosterValue(e.target.value)
  }
  let changeCategoryType = value => {
    setVisitVisable(value)
  }
  
  //保存分类 
  let saveCategory = ()=>{
    let cate = saveCategoryForm.getFieldsValue('categoryName')
    realSaveCategory(JSON.parse(JSON.stringify(cate)));
  }
  // 选择海报
  let changePoster = () => {
    setChangePosterModal({modalName:'changePost'})
  }
  //关闭选择宣传海报弹框
  let callModalPoster = ()=>{
    setChangePosterModal('')
  }
  //接受子组件传过来的值
  let getValue = (value)=>{
    console.log(value,"value")
    form.setFieldsValue({
      posterUrl:value.url,
      posterId:value.id,
    })
    setSpanList(value)
  }
  //富文本框上传图片回调
  let uploadCallback = (file)=>{
    return new Promise((resolve,reject)=>{
      console.log(file)
      let formData = new FormData();
      formData.append('files',file)
      dispatch({
        type: 'informationManager/uploadNameList',//上传接口
        payload: {
          method: 'upload',
          params: formData
        },
        callback: res => {
          console.log(res)
          if(res.code=='S000000'){
            resolve({data:{link:res.items}})
          }
          else{
            reject();
          }
        }
      })
    })
  }
  
  return(
    <>
      <Modal width={1000} title={modalInfo.modalName=='add'? '新增': '编辑'} visible={modalInfo.modalName=='add' || modalInfo.modalName=='edit'}
        footer={null} onCancel={()=>{toFatherValue(true)}}
        >
          <Form form={form} onFinish={submitEvent} className={style.form}>
            <Row>
              <Col span={24}>
                <Form.Item label="客户" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                <Select
                      showSearch
                      notFoundContent='暂无数据'
                      placeholder="请选择"
                      optionFilterProp="children"
                      defaultValue={JSON.parse(localStorage.getItem('tokenObj')).channelName}
                      disabled>
                    </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={10}>
                <Form.Item label="分类" labelCol={{flex:'0 0 120px'}} name="newsCategory" rules={[{ required: true}]}>
                  <Select
                    showSearch
                    notFoundContent='暂无数据'
                    placeholder="请选择"
                    defaultValue={categoryValue}
                    
                    >
                    {
                      categoryList && categoryList.length ?
                      categoryList.map((item, key) => {
                          return <Option key={key} value={item.objectId}>{item.categoryName}</Option>
                        }): ''
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col offset={0}>
                <Button type="primary" onClick={addCategory}>添加分类</Button>
              </Col>
              <Col span={2} offset={0}>
                <span >排序:</span>
              </Col>
              <Col span={7}>
                <InputNumber defaultValue={orderNo} value={orderNo} onChange={(e)=>{setOrderNo(e)}}/>
              </Col>
            </Row>
            <Row >
              <Col span={24}>
                <Form.Item label="推荐的客户标" labelCol={{flex:'0 0 120px'}} name="newsTags" rules={[{ required: true}]}>
                  <Select
                    showSearch
                    mode="tags"
                    notFoundContent='暂无数据'
                    placeholder="请选择"
                    optionFilterProp="children"
                    defaultValue={newsCategorysValue}
                    onChange={()=>{handleChangeCategory()}}
                    >
                      {
                        newsCategorysList && newsCategorysList.length?newsCategorysList.map((item, key) => {
                          return <Option key={key} value={item.objectId}>{item.tagName}</Option>
                        }): ''
                      }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row >
              <Col span={24}>
                <Form.Item label="标题" labelCol={{flex:'0 0 120px'}} name="title" rules={[{ required: true}]}>
                  <Input placeholder="请输入"/>
                </Form.Item>
              </Col>
            </Row>
            <Row >
              <Col span={24}>
                <Form.Item label="生效时间" labelCol={{flex:'0 0 120px'}} name="reportTime" rules={[{ required: true}]}>
                <DatePicker format={'YYYY-MM-DD HH:mm'} style={{width: '100%'}}/>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="类型" labelCol={{flex:'0 0 120px'}} name="type" rules={[{ required: true}]}>
                  <Select
                      showSearch
                      notFoundContent='暂无数据'
                      placeholder="请选择"
                      optionFilterProp="children"
                      onChange={changeCategoryType}
                      >
                        <option value={2}>引用</option>
                        <option value={1}>原创</option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="封面图片" labelCol={{flex:'0 0 120px'}} name="iconUrl" rules={[{ required: true}]}>
                  {
                    iconUrl ? <>
                    <Upload
                    name="files"
                    listType="picture-card"
                    action={uploadIcon}
                    headers={headers}
                    beforeUpload={beforeUpload}
                    showUploadList={{showPreviewIcon: false}}
                    onChange={handleChange}
                    fileList={fileList}
                    onRemove ={removeImage}
                    maxLength={1}
                  >
                    <div >
                      <PlusCircleOutlined/><span>上传文件</span>
                    </div>
                  </Upload>
                  <div>（支持上传图片规格：尺寸64 x 64px,格式：jpg/png,大小：不超过100KB）</div>
                  </>:<>
                      <Upload
                      name="files"
                      listType="picture-card"
                      showUploadList={{showPreviewIcon: false}}
                      action={uploadIcon}
                      headers={headers}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      maxLength={1}
                    >
                      <div >
                        <PlusCircleOutlined/><span>上传文件</span>
                      </div>
                    </Upload>
                    <div>（支持上传图片规格：尺寸64 x 64px,格式：jpg/png,大小：不超过100KB）</div>
                    </>
                  }
                
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="宣传海报" labelCol={{flex:'0 0 120px'}} name="posterUrl" rules={[{ required: true}]}>
                  <Button type="primary" onClick={()=>{changePoster()}}>选择宣传海报</Button>
                  {spanList ? <span><span className={style.fontNameSize}>{spanList.name}</span> <span className={style.fontSize} onClick={()=>{setSpanList(null)}}>X</span></span>
                  :''}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="锁定默认海报"  tooltip={toolTip} labelCol={{flex:'0 0 120px'}} name="posterLockFlag" rules={[{ required: true}]}>
                  <Radio.Group onChange={onChangeSynPost} value={synPosterValue} defaultValue={synPosterValue}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            {
              visitVisable==2?
              <>
              <Row>
                <Col span={24}>
                  <Form.Item label="引用链接" labelCol={{flex:'0 0 120px'}} name="refUrl" rules={[{ required: true}]}>
                    <Input placeholder="请输入"/>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label="销售直接访问" labelCol={{flex:'0 0 120px'}} name="saleOpenType" rules={[{ required: true}]}>
                  <Select
                      showSearch
                      notFoundContent='暂无数据'
                      placeholder="请选择"
                      optionFilterProp="children"
                      >
                        <option value={0}>引用链接</option>
                        <option value={1}>原创内容</option>
                  </Select>
                  </Form.Item>
                </Col>
              </Row>
            </>
            :''
            }
            <Row>
              <Col span={24}>
                <Form.Item label="内容简介 " labelCol={{flex:'0 0 120px'}} name="textContent" rules={[{ required: true}]}>
                  <TextArea showCount maxLength={400}  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="引导内容 " labelCol={{flex:'0 0 120px'}} name="htmlContent" rules={[{ required: true}]}>
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
              </Col>
            </Row>
            
            <Row justify="end" >
              <Space size={22}>
                <Button htmlType="button" onClick={()=> {toFatherValue(false)}}>取消</Button>
                <Button htmlType="submit" type="primary">保存</Button>
              </Space>
            </Row>


          </Form>
      </Modal>
      <Modal width={500} title={'添加分类'} visible={addCategoryVisable} footer={null} onCancel={()=>{setAddCategoryVisable(false)}}>
        <Form form={saveCategoryForm} onFinish={()=>saveCategory()} className={style.form}>
          <Row>
            <Col span={18}>
              <Form.Item label="分类名称" labelCol={{flex:'0 0 120px'}} name="categoryName" rules={[{ required: true}]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" >
              <Space size={22}>
                <Button htmlType="submit" type="primary">保存</Button>
              </Space>
            </Row>
        </Form>
      </Modal>
      {changePosterModal?<PosterChange modalInfo={changePosterModal} toFatherValue={(flag)=>callModalPoster(flag)} getValue = {(val)=>{getValue(val)}}></PosterChange>:''}
    </>
  )
};
export default connect(({informationManager})=>({

}))(newInformationManagere)


