import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {Checkbox ,DatePicker ,Radio, Form, Input, Modal, InputNumber, Upload, Button, message, Pagination} from "antd"
import { CloseCircleOutlined} from '@ant-design/icons'
import {PlusCircleOutlined} from '@ant-design/icons'
import style from "./style.less"
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'  // 日期处理
import { uploadMedia } from '@/services/officialAccount.js';

const { RangePicker } = DatePicker
const newArticleModel = (props) => {
  const [form] = Form.useForm();
  let tokenObj=JSON.parse(localStorage.getItem('tokenObj'));
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  let { dispatch,newArticleVisible,allCategory,hideAddNewArticle, articleId, objectId} = props,
      [visible, setVisible] = useState(false),
      [allCategoryChange,setAllcategoryChange] = useState([]),
      [channelName, setChannelName] = useState(''),
      [isPermanentTime,setIsPermanentTime] = useState('2'),
      [payload, setPayload] = useState({
        articleType:0,
        channelName:"",
        objectId: "",
        articleTitle: "",      //标题
        isPermanent: "",      //生效时间状态  0为指定时间 需要传递开始结束时间 1为永久 不需要传递开始结束时间
        contentType: 0,     //固定传0
        refUrl: "",          //外部连接
        articleDescribe: "",    //简介
        articleStatus: "",     //状态 1、启用 0 、 停用
        isTop: 0,                     //固定传0
        isHot: 0,                 //固定传0
        orderNo: "",               //排序
        imageUrls:['','',''],
        categoryIds:[],
        relationTime:[]
      })
 
  /*回调*/
  useEffect(() => {
    if (newArticleVisible) {
      setVisible(newArticleVisible)
      allCategory.forEach(item=>{    // 对分类数据进行处理
        item.label = item.categoryName
        item.value = item.objectId
      })
      form.setFieldsValue({      // 初始化列表数据，如有分类自动选择分类
        channelName:tokenObj.channelName,
        relationTime:[],
        categoryIds:objectId?[objectId]:[]
      })
      setAllcategoryChange(allCategory)
      setChannelName(tokenObj.channelName)
      if( articleId ) {
        articleDetail()
      }
    }
  }, [newArticleVisible])

  let handleCancel = (type) => {
    setVisible(false)
    hideAddNewArticle(type)
  }
  let handleOk = () =>{
  }

  /* 选择生效时间 */
  let onChangeIsPermanent = (e) => {
    setIsPermanentTime(e.target.value)
  }
  /* 获取文章详情 */
  let articleDetail = () =>{
    dispatch({
      type: 'articleManage/articleDetail',
      payload: {
        method: 'postJSON',
        params: {
          objectId:articleId
        }
      },
      callback: (res) => {
        if(res.result.code === '0'){
          if(res.body.imageUrls) {
            res.body.imageUrls[0] = res.body.imageUrls[0]
            res.body.imageUrls[1] = res.body.imageUrls[1]
            res.body.imageUrls[2] = res.body.imageUrls[2]
          }else{
            res.body.imageUrls = ['','','']
          }
          setPayload(res.body)
          form.setFieldsValue(res.body)
        }else {
          message.error(res.result.message)
        }
      }
    })
  }

  /* 提交新建文章信息 */
  let submitEvent = (e) => {
    if( e.relationTime){
      if( e.relationTime.length === 2) {
        e.startDate = moment(e.relationTime[0]).format('YYYY-MM-DD');
        e.endDate =  moment(e.relationTime[1]).format('YYYY-MM-DD');
      }else{
        e.startDate = "";
        e.endDate = "";
      }
    }
    for(let x in e){
      payload[x] = e[x]
    }
    setPayload(payload)
    dispatch({
      type: 'articleManage/saveArticle',
      payload: {
        method: 'postJSON',
        params: payload
      },
      callback: (res) => {
        if(res.result.code === '0'){
          handleCancel('save')
          message.success('保存成功')
        }else {
          message.error(res.result.message)
        }
      }
    })
  }
  /* 上传文件 */
  let adverUpload1 = (file) => {
    let fileSize = (file.size / 1024).toFixed(2);
    let ulimit = fileSize>2*1024
    if(ulimit) {
      message.error('文件大小超过限制')
    }
    return !ulimit
  }
  let adverChange = (i,index) => {
    if(i.file.status === 'done'){
      if(i.file.response .result.code === '0'){
        payload.imageUrls[index] = i.file.response.body
        setPayload(JSON.parse(JSON.stringify(payload)))
        message.success('上传成功')
      }else{
        message.success(i.file.response.result.message)
      }
    }
  };

 /* 删除上传的图片 */
 let deletePic = (index) => {
    payload.imageUrls[index] = ''
    setPayload(JSON.parse(JSON.stringify(payload)))
 }

  return (
    <>
      <Modal
        width={900}
        title={articleId?"编辑文章":"新建文章"}
        maskClosable={false}
        visible={visible}
        onOk={handleOk} 
        footer={null}
        onCancel={handleCancel}>
        <Form form={form} onFinish={submitEvent}>
          <div className={style.partName}>基本信息</div>
          <Form.Item label="渠道" name="channelName" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
             <span>{channelName}</span>
          </Form.Item>
          <Form.Item label="分类" name="categoryIds" labelCol={{flex:'0 0 120px'}} rules={[{required:true}]}>
            <Checkbox.Group options={allCategoryChange}/>
          </Form.Item>
          <Form.Item label="标题" name='articleTitle' labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
            <Input/>
          </Form.Item>
          <Form.Item label="简介" name="articleDescribe" labelCol={{flex:'0 0 120px'}}>
            <Input/>
          </Form.Item>
          <Form.Item label="生效时间" name="isPermanent" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
            <Radio.Group onChange={onChangeIsPermanent} >
              <Radio value={1}>永久</Radio>
              <Radio value={0}>指定时间</Radio>
            </Radio.Group>
          </Form.Item>
          {isPermanentTime == 0 ?<Form.Item label="有效时间" name="relationTime"  labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
            <RangePicker locale={locale} placeholder={['开始时间', '结束时间']} format="YYYY-MM-DD"  className={style.rangePicker}/>
          </Form.Item>:null}
          <Form.Item label='排序' name="orderNo" labelCol={{flex:'0 0 120px'}} rules={[{required:true}]} rules={[{ required: true}]}>
            <InputNumber  />
          </Form.Item>
          <Form.Item label="规则" name="articleStatus" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
            <Radio.Group >
              <Radio value={1}>启用</Radio>
              <Radio value={0}>停用</Radio>
            </Radio.Group>
          </Form.Item>
          <div className={style.partName} style={{borderTop:"1px solid #eee",paddingTop:"20px"}}>内容信息</div>
          <Form.Item label='列表' labelCol={{flex:'0 0 120px'}}>
            {payload.imageUrls.map((item,index)=>{
               return<>  
                {item? <div className={index==1?style.pic_gap_content:style.pic_content} style={{position:'relative'}}>
                          <img className={style.pic_content} src={item} object-fit="fill"/>
                          <CloseCircleOutlined className={style.delPic} onClick={()=>deletePic(index)}/>
                       </div>:
                 <Upload
                    className={index==1?style.pic_gap:null}
                    accept='image/*'
                    name="uploadMedia"
                    listType="picture"
                    action={uploadMedia}
                    showUploadList={false}
                    beforeUpload={(val)=>adverUpload1(val,index)}
                    onChange={(val)=>adverChange(val,index)}
                    headers={headers}>
                      <div className={style.pic_content}>
                        <PlusCircleOutlined /><span>上传文件</span>
                      </div>
                    </Upload>
                  }
              </>
            })}
             <div className={style.tip}>需上传1-3张图片，尺寸建议 220 * 152px </div>
          </Form.Item>
          <Form.Item label='文章内容'name="contentType" labelCol={{flex:'0 0 120px'}} rules={[{required:true}]}>
            <Radio.Group >
              <Radio value={0}>外部页面</Radio>
              <Radio value={1} disabled>内部页面</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label='外部链接' name="refUrl" labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
             <Input placeholder="请输入链接，如https://www..."/>
          </Form.Item>
          <div className={style.btn_content}>
            <Button  htmlType="submit" type="primary"  className={style.confirm_btn}>保存</Button>
            <Button  htmlType="button" onClick={handleCancel}>取消</Button>
          </div>
        </Form>
      </Modal>
    </>
  )
};
export default connect((articleManage) => ({
}))(newArticleModel)
