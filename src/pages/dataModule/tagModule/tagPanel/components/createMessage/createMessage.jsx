//基础信息
import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import {
  Form, Input, Switch, Button, TreeSelect, Radio, Upload, Select
} from 'antd';
import { UploadOutlined, DownloadOutlined,PlusCircleOutlined,CloseOutlined ,FileTextOutlined} from '@ant-design/icons';
import addIcon from '@/assets/add.png'
import delIcon from '@/assets/del.png'
import fileIcon from '@/assets/file.png'
let compId = 0;
let fileList = [{ compId: 0, file:'', layerName: '', fileName: ''}];
const CreateMessage = (props) => {
  const { isCustomFlag, treeList,customerNameList, labelAllInfoData, importLabelAllInfoData, dispatch, cRef, data  } = props;
  const [modalShow, setModalShow] = useState(false);
  const [treeValue, setTreeValue] = useState(null);
  const [treeData, setTreeData] = useState([]);
  const [tagLayers, setTagLayers] = useState([{ compId: 0, file:'', layerName: ''}]);
  let tokenObj = localStorage.getItem('tokenObj') ? JSON.parse(localStorage.getItem('tokenObj')) : {};
  //通过Form.useForm对表单数据域进行交互。useForm是React Hooks的实现，只能用于函数组件
  const [form] = Form.useForm();
  //cRef就是父组件传过来的ref
  useImperativeHandle(cRef, () => ({
    //getForm就是暴露给父组件的方法
    getForm: () => form,
    onReset: () => onReset()
  }));
  //若有正则验证，则在所有的正则校验都通过后用来获取输入的数据，若没有正则校验，则直接获取输入的数据
  const onFinish = values => {
    // values.date = timestampToTime(values.date).replace(' ', '')
  };
  
  //重置要配合着const [form] = Form.useForm()以及form={form}
  const onReset = () => {
    form.resetFields();
    form.setFieldsValue({
      website: true,
      radio: "b"
    })
    // form.setFieldsValue(data)
  };
  
  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
  };
  
  const validateMessages = {
    required: '${label} 必填!',
  };
  //分类新增
  const addFileList = ()=> {
    let list = JSON.parse(JSON.stringify(tagLayers))
    let thisObj = { compId: ++compId, file:'', layerName: ''};
    list.push(thisObj)
    fileList.push(thisObj);
    setTagLayers(list)
  }
  //分类删除
  const delFileList = (index)=> {
    let list = JSON.parse(JSON.stringify(tagLayers))
    list.splice(index,1);
    setTagLayers(list)
  }

  //分类文件上传
  const uploadFile = (file, index) => {
    
    let list = JSON.parse(JSON.stringify(tagLayers))
    list[index].file = file.target.files[0]
    list[index].fileName = file.target.files[0].name
    fileList[index].file = file.target.files[0]
    fileList[index].fileName = file.target.files[0].name
    setTagLayers(list)
  }
  //分类input框
  const changeInput = (value,index) => {
    let list = JSON.parse(JSON.stringify(tagLayers))
    list[index].layerName = value.target.value
    setTagLayers(list)
  }
  useEffect(() => {
    if(tagLayers.length != fileList.length) {
      fileList = JSON.parse(JSON.stringify(tagLayers))
    }
    if(tagLayers.length && fileList.length) {
      fileList.forEach((item,index) => {
        tagLayers[index].file = item.file
      })
      form.setFieldsValue({
        tagLayers: tagLayers
      })
    }
  },[tagLayers])
  useEffect(() => {
    if (data && (data.website == '' || data.radio == '')) {
      //第一次进基本信息默认自动更新
      form.setFieldsValue({
        website: true,
        radio: 'b'
      })
    } else {
      //返回到基本信息页显示数据
      form.setFieldsValue(data)
    }
  }, []);

  useEffect(() => {
    let treeData = JSON.parse(JSON.stringify(treeList))
    treeData.forEach((item) => {
      if(item.children) {
        item.value = item.key
        item.disabled = true
        item.key = undefined
        item.children.forEach((itemSon) => {
          itemSon.value = itemSon.key?itemSon.key.split(",")[1]:''
          itemSon.key = undefined
          itemSon.children = undefined
        })
      }
    })
    setTreeData(treeData)
  }, [treeList]);



  //编辑查询
  useEffect(() => {
    if(JSON.stringify(labelAllInfoData) != "{}" || JSON.stringify(importLabelAllInfoData) != "{}") {
      
      setModalShow(true);
      let data = JSON.stringify(labelAllInfoData) != "{}" ? labelAllInfoData : JSON.stringify(importLabelAllInfoData) != "{}" ? importLabelAllInfoData : ''
      form.setFieldsValue({
        tagName: data.tagName,
        tagCode: data.tagCode.substring(5),
        tagGroupId: String(data.tagGroupId),
        refreshType: data.refreshType,
        remark: data.remark,
        // identifyType: data.identifyType,
        tagLayers: data.tagLayers?data.tagLayers:[],
      })
      if(data.tagLayers) {
        setTagLayers(data.tagLayers)
      }
     
    } else {
     
      setModalShow(true);
      form.setFieldsValue({
        tagName: '',
        tagCode: '',
        tagGroupId: '',
        refreshType: '',
        remark: '',
        tagLayers: []
      })
    }
  }, [labelAllInfoData,importLabelAllInfoData]);

  
  
  const onChangeTree = (value) => {
    setTreeValue(value)
  };

  //上传
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e && e.file;
  };

  return (
    <div className={style.form_box}>
      <Form {...layout} form={form} onFinish={onFinish} validateMessages={validateMessages}>
        <Form.Item name='codeDesc1' label="客户名称">
          {tokenObj.channelName}
        </Form.Item>
        <Form.Item name='tagName' label="标签显示名" rules={[{ required: true }]} >
          <Input autocomplete="off" maxLength="20"/>
        </Form.Item>
        {
          (JSON.stringify(labelAllInfoData) != "{}" || JSON.stringify(importLabelAllInfoData) != "{}") ?
          <Form.Item name='tagCode' label="标签ID">
          <Input
              disabled={true}
              addonBefore="user_" autocomplete="off"/>
          </Form.Item>:''
        }
        
        <Form.Item name='tagGroupId' label="分类" rules={[{ required: true }]}>
          <TreeSelect
            style={{ width: '100%' }}
            value={treeValue}
            showSearch
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder=""
            treeDefaultExpandAll
            onChange={onChangeTree}
          />
        </Form.Item>
        {
          isCustomFlag ?
            // 自定义创建
            <Form.Item name='refreshType' label="更新方式" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value="MANUAL">手动更新</Radio>
                <Radio value="AUTO">自动更新</Radio>
              </Radio.Group>
            </Form.Item> :
            //导入创建
            <div>
              {/* <Form.Item name="identifyType" label="识别用户方式" rules={[{ required: true }]}>
                <Radio.Group>
                  <Radio value="1">身份证</Radio>
                  <Radio value="0">用户ID</Radio>
                </Radio.Group>
              </Form.Item> */}
              <Form.Item
                name="tagLayers"
                label="分层"
                rules={[{ required: true }]}
              >
                {tagLayers.map((item,index) => (
                  <div key={item.compId} className={style.fileUploadBox}>
                    <Input value={item.layerName}  onChange={(value)=> {changeInput(value,index)}} className={style.file_input} autocomplete="off"/>
                    <div className={style.file_upload}>
                      {
                        item.fileName?<span><FileTextOutlined style={{fontSize:'18px',marginRight:'10px'}}/>{item.fileName}</span>:
                        <Button icon={<DownloadOutlined />}>文件上传</Button>
                      }
                      <input onChange={(e)=> {uploadFile(e,index)}} placeholder="上传" type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                    </div>
                    {
                      index==0?
                      <PlusCircleOutlined onClick={()=>{addFileList()}} className={style.file_icon}/>:
                      <CloseOutlined onClick={()=>{delFileList(index)}} className={style.file_icon}/>
                    }
                  </div>
                ))}
                <div className={style.upload_remark}>
                  <span>上传模板格式的用户信息创建用户标签（请选择其中一列填写用户信息）</span>
                  <a href="https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/file-template/carowner-admin/%E6%A0%87%E7%AD%BE%E7%BE%A4%E7%BB%84%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx"
                  download='模板.xls' className={style.upload_template}>下载模板</a>
                </div>
              </Form.Item>
            </div>
        }
        <Form.Item name='remark' label="备注">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </div >
  )
}
export default connect(({ setTagPanel }) => ({
  isCustomFlag: setTagPanel.isCustomFlag,
  treeList: setTagPanel.treeList,
  customerNameList: setTagPanel.customerNameList,
  labelAllInfoData: setTagPanel.labelAllInfoData,
  importLabelAllInfoData: setTagPanel.importLabelAllInfoData
}))(CreateMessage);