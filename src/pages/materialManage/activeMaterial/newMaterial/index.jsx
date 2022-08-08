import React, { useEffect, useState } from "react";
import { Link, connect, history } from 'umi';
import { Modal, Row, Col, Select, message,Form, Upload, Button , Input } from "antd"
import { UploadOutlined } from '@ant-design/icons';
import style from "./style.less";
import moment from 'moment';  // 日期处理
import 'moment/locale/zh-cn';
import TurntablePage from './setPage/turntablePage'
import { uploadIcon } from '@/services/activity.js';

moment.locale('zh-cn')

const  newMaterial= (props) => {
  let materialId = history.location.query.materialId
  let styleCode = history.location.query.styleCode
  let marketType = history.location.query.marketType
  let { dispatch } = props
  let [form] = Form.useForm()
  let [categoryForm] = Form.useForm()
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  let [titleType, setTitleType] = useState('')
  // 活动类型
  let activtiyTypeArr = {
    1:{
      children:[{
        name:"大转盘",
        marketActivityType:1,
        styleCode:"turntablePage_material"
      },{
        name:"直抽",
        marketActivityType:3
      },{
        name:"砸金蛋",
        marketActivityType:6
      },{
        name:"盲盒娃娃机",
        marketActivityType:5
      }],
      defaultMarketActivityType:1,
      defaultStyleCode:'turntablePage_material'
    },
    2:{
      children:[{
        name:"秒杀专场",
        marketActivityType:2
      },{
        name:"优惠购",
        marketActivityType:4
      }],
      defaultMarketActivityType:2
    },
    3:{
      children:[{
        name:"趣味点点乐",
        marketActivityType:7
      }],
      defaultMarketActivityType:7
    },
    4:{
      children:[{
        name:"答题有奖",
        marketActivityType:8
      }],
      defaultMarketActivityType:8
    }
  }
 
  let [materialData,setMaterialData] = useState({
    marketType:null,
    marketActivityType:null,
    categoryId:null,
    themeName:'',
    themeShowImg:'',
    publicityPoster:'',
    banner:'',
    styleValue:'',
    styleCode:''
  })
  // 主题名称
  let themeNameChange = (e) => {
    materialData.themeName = e.target.value
    setMaterialData(JSON.parse(JSON.stringify(materialData)))
  }
  // 选择活动类型
  let marketActivityTypeChange = (value,option) => {
      materialData.marketActivityType = value
      materialData.styleCode = option?option.key:''
      setMaterialData(JSON.parse(JSON.stringify(materialData)))
  }
  // 图片上传
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
  let handleChange = (info,type) => {
    if (info.file.status === 'done') {
      materialData[type] = info.file.response.items
      setMaterialData(JSON.parse(JSON.stringify(materialData)))
    }else if(info.file.status === 'error'){
      message.error('上传失败')
    }
  };
  // 保存素材数据
  let [basicValidSubmit,setBasicValidSubmit] = useState(false)
  let submitBasicMaterialData = () => {
    form.validateFields().then(values => {
      setBasicValidSubmit(true)
    })
    .catch(errorInfo => {
      setBasicValidSubmit(false)
    });
  }
  // 创建分类
  let [categoryVisible,setCategoryVisible] = useState(false)
  let [categoryList,setCategoryList] = useState([])
  let materialCategoryList = ()=>{
    dispatch({
      type: 'activeMaterial/materialCategoryList',
      payload: {
        method: 'postJSON',
        params: {
          pageNo:1,
          pageSize:100
        }
      },
      callback: (res) => {
        if (res.code === '0000') {
          setCategoryList(res.items.list)
        } else {
          message.error(res.message)
        }
      }
    })
 }
  let categoryChange  = (e) => {
    materialData.categoryId = e
    setMaterialData(JSON.parse(JSON.stringify(materialData)))
  }
  let openCategoryModal = () => {
    setCategoryVisible(true)
  }
  let categorylHandleOk = () => {
    let categoryName = categoryForm.getFieldsValue()
    console.log(categoryName)
    dispatch({
      type: 'activeMaterial/addMaterialCategory',
      payload: {
        method: 'postJSON',
        params: categoryName
      }, callback: (res) => {
        if (res.code === '0000') {
           materialCategoryList()
           categoryForm.resetFields()
           setCategoryVisible(false)
        } else {
          message.error(res.message)
        }
      }
    })

  }  
  let categoryHandleCancel = () => {
    categoryForm.resetFields()
    setCategoryVisible(false)
  }
  // 图片预览
  let [previewVisible,setPreviewVisible] = useState(false)
  let [previewImage,setPreviewImage] = useState('')
  let previewhandleCancel = () => {
    setPreviewVisible(false)
  }
  let handlePreview = async file => {
    setPreviewVisible(true)
    setPreviewImage(file)
  };
  // 获取素材数据
  let getMaterialDetails = ()=>{
    dispatch({
      type: 'activeMaterial/getMaterialDetails',
      payload: {
        method: 'get',
        params: {
          materialId: materialId,
          styleCode: styleCode
        }
      },
      callback: (res) => {
        if(res.code === '0000') {
          setMaterialData(res.items)
          form.setFieldsValue(res.items)
        }else{
          message.error(res.message)
        }

      }
    })
  }
  useEffect(()=>{
    materialCategoryList()
    if(materialId&&styleCode){
      getMaterialDetails()
      setTitleType('编辑')
    }else{
      if(marketType){
        materialData.marketType = marketType
        materialData.marketActivityType = activtiyTypeArr[marketType].defaultMarketActivityType
        materialData.styleCode = activtiyTypeArr[marketType].defaultStyleCode
      }
      form.setFieldsValue(materialData)
      setMaterialData(materialData)
      setTitleType('新建')
    }
  },[])
  return (
    <div>
      <Form  form={form}  label>
        <div className={style.block__cont}>
          <div className={style.block__header}>
            <span>{titleType}活动素材</span>
          </div>
          <div className={style.sub_content}>
            <div className={style.sub_title}>基本信息配置</div>
            <Row >
              <Col span={8}>
                <Form.Item label="活动类型" name="marketActivityType" labelCol={{flex:'0 0 120px'}} rules={[{ required: true, message: "请选择活动类型" }]}>
                  <Select
                    showSearch
                    notFoundContent='暂无数据'
                    placeholder="请选择"
                    allowClear
                    onChange={marketActivityTypeChange}
                  >
                    {
                      materialData.marketType && activtiyTypeArr[materialData.marketType] ?
                        activtiyTypeArr[materialData.marketType].children.map((item, key) => {
                          return <Option key={item.styleCode} value={item.marketActivityType}>{item.name}</Option>
                        })
                        : ''
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <div className={style.category_content}>
                  <Form.Item label="分类名称" name="categoryId"  labelCol={{flex:'0 0 120px'}} rules={[{ required: true, message: "请选择分类名称" }]}>
                  <Select
                    showSearch
                    notFoundContent='暂无数据'
                    placeholder="请选择"
                    allowClear
                    onChange={categoryChange}
                    optionFilterProp="children"
                  >
                    {
                      categoryList.map((item, key) => {
                          return <Option value={item.categoryId}>{item.categoryName}</Option>
                        })
                    }
                  </Select>
                  </Form.Item>
                </div>
                <Button  type="link"  onClick={openCategoryModal}>新增</Button>
              </Col>
              <Col span={8}>
                <Form.Item label="主题名称"  labelCol={{flex:'0 0 120px'}} name="themeName" rules={[{ required: true, message: "请输入主题名称" }]}>
                  <Input onChange={themeNameChange}  maxLength={8}/>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <div className={style.image_content}>
                  <span><i>*</i>展示图：</span>
                  {materialData.themeShowImg?<img onClick={(e)=>handlePreview(materialData.themeShowImg)} className={style.image_part} style={{width:'100px',height:'100px'}} src={materialData.themeShowImg}/>:null}
                </div>
                <Form.Item className={style.image_upload} name='themeShowImg' labelCol={{flex:'0 0 120px'}}  extra="建议尺寸：300px*300px" rules={[{ required: true, message: "请上传展示图" }]}>
                  <Upload
                    name="files"
                    action={uploadIcon}
                    beforeUpload={beforeUpload}
                    onChange={(file)=>handleChange(file,'themeShowImg')}
                    headers={headers}
                  >
                    <Button icon={<UploadOutlined />} className={style.box2_uplonds}>上传图片</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={8}>
                <div className={style.image_content}>
                  <span><i>*</i>宣传海报：</span>
                  {materialData.publicityPoster?<img  onClick={(e)=>handlePreview(materialData.publicityPoster)} className={style.image_part} style={{width:'100px',height:'100px'}} src={materialData.publicityPoster}/>:null}
                </div>
                <Form.Item  className={style.image_upload} name='publicityPoster' labelCol={{flex:'0 0 120px'}}  extra="建议尺寸：1080px*1920px" rules={[{ required: true, message: "请上传宣传海报" }]}>
                  <Upload
                    name="files"
                    action={uploadIcon}
                    beforeUpload={beforeUpload}
                    onChange={(file)=>handleChange(file,'publicityPoster')}
                    headers={headers}
                  >
                    <Button icon={<UploadOutlined />} className={style.box2_uplonds}>上传图片</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={8}>
                <div className={style.image_content}>
                  <span><i>*</i>活动banner：</span>
                  {materialData.banner?<img className={style.image_part} style={{width:'100px',height:'100px'}} src={materialData.banner}/>:null}
                </div>
                <Form.Item  className={style.image_upload} name='banner' labelCol={{flex:'0 0 120px'}}  extra="建议尺寸：355px*150px" rules={[{ required: true, message: "请上传banner" }]}>
                  <Upload
                   name="files"
                   action={uploadIcon}
                   beforeUpload={beforeUpload}
                   onChange={(file)=>handleChange(file,'banner')}
                   headers={headers}
                  >
                    <Button icon={<UploadOutlined />} className={style.box2_uplonds}>上传图片</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </div>
           {/* 首页配置 */}
          <div className={style.part_line_content}></div>
            <div className={style.sub_content}>
              {materialData.marketActivityType===1?<TurntablePage submitBasicMaterialData={submitBasicMaterialData} basicMaterialData={materialData} basicValidSubmit={basicValidSubmit}/>:null}
            </div>
        </div>
      </Form>
      <Modal title='创建分类' visible={categoryVisible} footer={null} onOk={categorylHandleOk} onCancel={categoryHandleCancel}>
           <Form  form={categoryForm} onFinish={categorylHandleOk}>
              <Form.Item  className={style.image_upload} name='categoryName' label="分类名称" labelCol={{flex:'0 0 120px'}} rules={[{ required: true, message: "请输入分类名称" }]}>
                <Input/>
              </Form.Item>
              <div className={style.btn_content}>
                <Button className={style.btn_radius} htmlType="button"  className={style.confirm_btn} onClick={categoryHandleCancel}>取消</Button>
                <Button className={style.btn_radius} htmlType="submit" type="primary">保存</Button>
              </div>
           </Form>
        </Modal>
        <Modal
          visible={previewVisible}
          title='图片预览'
          footer={null}
          onCancel={previewhandleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
    </div>
  )
};
export default connect(({ customerListDetail }) => ({
}))(newMaterial)
