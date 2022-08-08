import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {Row, Form, Input, Modal, Select, Button, message, InputNumber, Upload, Col } from "antd"
import style from "./style.less"
import { uploadMedia } from '@/services/officialAccount.js';

const { TextArea } = Input;
const addReplyModel = (props) => {
  const [form] = Form.useForm();
  let { dispatch, addReplyVisible,channelList,modalInfo,hideAddModel, getList} = props,
      [visible, setVisible] = useState(false),
      [selectType, setSelectType] = useState(''),
      [fileName, setFileName] = useState(''),
      [loadings,setLoadings] = useState({
        picUrl: false,
        imgMediaUrl: false,
        voiceMediaUrl: false,
        musicUrl: false,
        hqMusicUrl: false,
        thumbMediaUrl: false
      })
 let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };

 const checkImageUrl = (rule, value,callback) => {
  let regUrl = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+$/g; 
  if(!value){
      callback('请输入正确链接地址')
  }else{
     if(!regUrl.test(value)){ 
       callback('URL链接非法')
     }else{
       callback()
     }
   }
 }
  /*回调*/
  useEffect(() => {
    if (addReplyVisible) {
      setVisible(addReplyVisible);
      if(modalInfo.objectId){
        getDetailReplyData()
      }
    }
  }, [addReplyVisible])
  // 获取关键字信息
  let getDetailReplyData = () => {
    dispatch({
      type: 'ReplyManage/detailReplyData',
      payload: {
        method: 'postJSON',
        params: {
          objectId:modalInfo.objectId,
          type: modalInfo.type
        }
      },
      callback: (res) => {
        if(res.body.detail){
           for(let x in res.body.detail) {
             if(x === 'description' && res.body.type=='NEWS'){
                res.body.Idescription = res.body.detail[x]
                console.log('asdasdasd')
             }else if(x === 'description' && res.body.type=='MUSIC'){
                res.body.Vdescription = res.body.detail[x]
             }else{
               res.body[x] = res.body.detail[x]
             }
           }
        }
        form.setFieldsValue(res.body)
        setSelectType(res.body.type)
      }

    });
  }

  let handleCancel = () => {
    form.resetFields()
    setVisible(false)
    hideAddModel()
  }
  let handleOk = (val) =>{
    val.objectId = modalInfo.objectId?modalInfo.objectId:''
    switch(selectType){
      case 'TEXT':
        val.content = {     
          content:val.content
        }
        break; 
      case 'NEWS':
        val.content = {     
          title:val.title,
          picUrl:val.picUrl,
          description:val.Idescription,
          url:val.url
        }
        break; 
      case 'IMAGE':
        val.content = {     
          imgMediaUrl: val.imgMediaUrl,
          doesPermanent: val.doesPermanent,
          fileName:fileName
        }
        break; 
      case 'VOICE':
        val.content = {     
          voiceMediaUrl: val.voiceMediaUrl,
          doesPermanent: val.doesPermanent,
          fileName:fileName
        }
        break; 
      case 'MUSIC':
        val.content = {     
          title:val.title,
          musicUrl:val.musicUrl,
          hqMusicUrl: val.hqMusicUrl,
          description: val.Vdescription,
          thumbMediaUrl:val.thumbMediaUrl,
          fileName:fileName
        }
        break; 
    }
    val.content = JSON.stringify(val.content)
    let typeUrl = modalInfo.modalName === '新增'?'ReplyManage/saveReplyData':'ReplyManage/updateReplyData'
    dispatch({
      type: typeUrl,
      payload: {
        method: 'postJSON',
        params: val
      },
      callback: (res) => {
        if(res.result.code === 'S000000') {
          getList()
          hideAddModel()
          setVisible(false)
          message.success('执行成功');
        }else{
          message.error(res.result.message)
        }
          
      }
    });
  }
  // 选择类型显示对应模块
  let onchangeType = (val) => {
    setSelectType(val)
    let chanegType = {}
    switch(val){
      case 'TEXT':
        chanegType = {     
          content:''
        }
        break; 
      case 'NEWS':
        chanegType= {     
          title:'',
          picUrl:'',
          Idescription:'',
          url:''
        }
        break; 
      case 'IMAGE':
        chanegType = {     
          imgMediaUrl: '',
          doesPermanent: ''
        }
        break; 
      case 'VOICE':
        chanegType = {     
          voiceMediaUrl: '',
          doesPermanent: ''
        }
        break; 
      case 'MUSIC':
        chanegType = {     
          title:'',
          musicUrl:'',
          hqMusicUrl: '',
          Vdescription: '',
          thumbMediaUrl: ''
        }
        break; 
    }
    setFileName('')
    form.setFieldsValue(chanegType)

  }
  // 图片上传
  let adverUpload1 = (file,type,typeDetail) => {
    let fileSize = (file.size / 1024).toFixed(2);
    let ulimit = false
    switch(type){
      case 'thumb':
        ulimit = fileSize>64;
        break;
      case 'image':
        ulimit = fileSize>2*1024
        break;
      case 'voice':
        ulimit = fileSize>10*1024
        break;
    }
    if(ulimit) {
      message.error('文件大小超过限制')
    }else{
      loadings[typeDetail] = true
      setLoadings(JSON.parse(JSON.stringify(loadings)))
    }
    return !ulimit

  }
  let adverChange = (i,type) => {
    if(i.file.status === 'done'){
      if(i.file.response.result.code === '0'){
        let url = i.file.response ? i.file.response.body : "";
        let data = {}
        data[type] = url
        if(type === 'voiceMediaUrl' || type === 'thumbMediaUrl' || type==='imgMediaUrl'){
          setFileName(i.file.name)
        }
        form.setFieldsValue(data)
        loadings[type] = false
        setLoadings(JSON.parse(JSON.stringify(loadings)))
        message.success('上传成功')
      }else{
        message.success(i.file.response.result.message)
        loadings[type] = false
        setLoadings(JSON.parse(JSON.stringify(loadings)))
      }
    }
  };

  return (
    <>
     <Modal
        width={900}
        title={modalInfo.modalName}
        maskClosable={false}
        visible={visible}
        onCancel={handleCancel}
        wrapClassName={style.modal_content_part}
        footer={null}
      >
        <Form form={form} onFinish={handleOk}>
          <Form.Item label="关键字"  name="keyword" validateTrigger='onBlur' labelCol={{flex:'0 0 120px'}}  rules={[{ required: true}]}>
            <Input placeholder="请输入"/>
          </Form.Item>
          <Form.Item label="所属渠道" name="channelId" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}}  rules={[{ required: true}]}>
            <Select allowClear placeholder="请选择" >
              {
                channelList.map(v =>  <Option value={v.id}>{v.channelName}</Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item label="优先级" name="priority" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}}  rules={[{ required: true}]}>
            <InputNumber style={{width:'100%'}}/>
          </Form.Item>
          <Form.Item label="状态" name="status" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}}  rules={[{ required: true}]}>
            <Select allowClear placeholder="请选择">
              <Option value={0}>系统内置</Option>
              <Option value={1}>禁用</Option>
              <Option value={2}>启用</Option>
              <Option value={3}>在线客服</Option>
              <Option value={4}>离线客服</Option>
              <Option value={5}>开启客服</Option>
            </Select>
          </Form.Item>
          <Form.Item label="描述说明" name="description" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="类型" name="type" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}}  rules={[{ required: true}]}>
            <Select allowClear placeholder="请选择" onChange={(val) => onchangeType(val)}>
              <Option value="TEXT">文本</Option>
              <Option value="NEWS">图文</Option>
              <Option value="IMAGE">图片</Option>
              <Option value="VOICE">音频</Option>
              <Option value="MUSIC">音乐</Option>
            </Select>
          </Form.Item>
          {
            selectType === 'TEXT'?<Form.Item label="自动回复内容" name="content" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}}  rules={[{ required: true}]}>
              <TextArea rows={8} />
            </Form.Item>:null
          }
          {
            selectType === 'NEWS'?<>
              <Form.Item label="图文标题" name="title" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}}  rules={[{ required: true}]}>
                <Input placeholder="请输入"/>
              </Form.Item>
              <Form.Item label="图文描述信息" name="Idescription" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}}>
                <Input placeholder="请输入"/>
              </Form.Item>
              <Row>
                <Col span={21}>
                  <Form.Item label=" 图文封面URL" name="picUrl" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}}>
                    <Input placeholder="请输入" disabled/>
                  </Form.Item>
                </Col>
                <Col span={3}>
                   <Upload
                      accept='image/*'
                      name="uploadMedia"
                      listType="picture"
                      action={uploadMedia}
                      showUploadList={false}
                      beforeUpload={(val)=>adverUpload1(val,'image','picUrl')}
                      onChange={(val)=>adverChange(val,'picUrl')}
                      headers={headers}>
                        
                      <Button type="primary"  loading={loadings.picUrl} className={style.confirm_btn}>选择文件</Button>
                    </Upload>
                </Col>
              </Row>
              <Form.Item label="图文链接URL" name="url" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}} validateTrigger='onBlur'  rules={[{ required: true, validator:checkImageUrl}]}>
                <Input placeholder="请输入正确链接地址"/>
              </Form.Item>
            </>:null
          }
          {
            selectType === 'IMAGE'?<>
              <Form.Item label="素材类型" name="doesPermanent" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}}  rules={[{ required: true}]}>
                <Select allowClear >
                  <Option value={true}>永久</Option>
                  <Option value={false}>临时</Option>
                </Select>
              </Form.Item>
              <Row>
                <Col span={21}>
                  <Form.Item label=" 图片素材" name="imgMediaUrl" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                    <Input placeholder="请输入" disabled/>
                  </Form.Item>
                </Col>
                <Col span={3}>
                   <Upload
                      accept='image/*'
                      name="uploadMedia"
                      listType="picture"
                      action={uploadMedia}
                      showUploadList={false}
                      beforeUpload={(val)=>adverUpload1(val,'image','imgMediaUrl')}
                      onChange={(val)=>adverChange(val,'imgMediaUrl')}
                      headers={headers}>
                      <Button type="primary"  loading={loadings.imgMediaUrl} className={style.confirm_btn}>选择文件</Button>
                    </Upload>
                </Col>
              </Row>
            </>:null
          }
          {
            selectType === 'VOICE'?<>
              <Form.Item label="素材类型" name="doesPermanent" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                <Select allowClear >
                  <Option value={true}>永久</Option>
                  <Option value={false}>临时</Option>
                </Select>
              </Form.Item>
              <Row>
                <Col span={21}>
                  <Form.Item label=" 音频素材" name="voiceMediaUrl" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                    <Input placeholder="请输入" disabled/>
                  </Form.Item>
                </Col>
                <Col span={3}>
                   <Upload
                      accept='audio/*'
                      name="uploadMedia"
                      listType="picture"
                      action={uploadMedia}
                      showUploadList={false}
                      beforeUpload={(val)=>adverUpload1(val,'voice','voiceMediaUrl')}
                      onChange={(val)=>adverChange(val,'voiceMediaUrl')}
                      headers={headers}>
                      <Button type="primary" loading={loadings.voiceMediaUrl} className={style.confirm_btn}>选择文件</Button>
                    </Upload>
                </Col>
              </Row>
            </>:null
          }
           {
            selectType === 'MUSIC'?<>
              <Form.Item label="音乐标题" name="title" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}}  rules={[{ required: true}]}>
                <Input placeholder="请输入"/>
              </Form.Item>
              <Row>
                <Col span={21}>
                  <Form.Item label=" 音频媒体" name="musicUrl" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                    <Input placeholder="请输入" disabled/>
                  </Form.Item>
                </Col>
                <Col span={3}>
                   <Upload
                      accept='audio/*'
                      name="uploadMedia"
                      listType="picture"
                      action={uploadMedia}
                      showUploadList={false}
                      beforeUpload={(val)=>adverUpload1(val,'voice','musicUrl')}
                      onChange={(val)=>adverChange(val,'musicUrl')}
                      headers={headers}>
                      <Button type="primary" loading={loadings.musicUrl} className={style.confirm_btn}>选择文件</Button>
                    </Upload>
                </Col>
              </Row>
              <Row>
                <Col span={21}>
                  <Form.Item label=" WIFI媒体" name="hqMusicUrl" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                    <Input placeholder="请输入" disabled/>
                  </Form.Item>
                </Col>
                <Col span={3}>
                   <Upload
                      accept='audio/*'
                      name="uploadMedia"
                      listType="picture"
                      action={uploadMedia}
                      showUploadList={false}
                      beforeUpload={(val)=>adverUpload1(val,'voice','hqMusicUrl')}
                      onChange={(val)=>adverChange(val,'hqMusicUrl')}
                      headers={headers}>
                      <Button type="primary" loading={loadings.hqMusicUrl}  className={style.confirm_btn}>选择文件</Button>
                    </Upload>
                </Col>
              </Row>
              <Row>
                <Col span={21}>
                  <Form.Item label=" 媒体缩略图" name="thumbMediaUrl" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}} rules={[{ required: true}]}>
                    <Input placeholder="请输入" disabled/>
                  </Form.Item>
                </Col>
                <Col span={3}>
                   <Upload
                      accept='image/*'
                      name="uploadMedia"
                      listType="picture"
                      action={uploadMedia}
                      showUploadList={false}
                      beforeUpload={(val)=>adverUpload1(val,'thumb','thumbMediaUrl')}
                      onChange={(val)=>adverChange(val,'thumbMediaUrl')}
                      headers={headers}>
                      <Button type="primary" loading={loadings.thumbMediaUrl} className={style.confirm_btn}>选择文件</Button>
                    </Upload>
                </Col>
              </Row>
              <Form.Item label="音乐描述信息" name="Vdescription" className={style.unbunding_reason} labelCol={{flex:'0 0 120px'}}>
                <Input placeholder="请输入"/>
              </Form.Item>
            </>:null
          }
          <div className={style.btn_content}>
            <Button  htmlType="submit" type="primary"  className={style.confirm_btn}>保存</Button>
            <Button  htmlType="button" onClick={handleCancel}>取消</Button>
          </div>
        </Form>
      </Modal>
    </>
  )
};
export default connect(({ ReplyManage }) => ({
  channelList: ReplyManage.channelList
}))(addReplyModel)
