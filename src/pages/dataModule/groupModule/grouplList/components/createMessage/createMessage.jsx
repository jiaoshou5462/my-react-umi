//基础信息
import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import {
  Form, Input, Switch, Button, TreeSelect, Radio, Upload, Select
} from 'antd';
import { UploadOutlined, DownloadOutlined,FileTextOutlined} from '@ant-design/icons';
import fileIcon from '@/assets/file.png'
import {uploadImg} from '@/services/tag'

const CreateMessage = (props) => {
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  const { isCustomFlag, allImportUserGroupData, allUserGroupData, modalType, customerNameList, dispatch, cRef, data  } = props;
  const [treeValue, setTreeValue] = useState(null);
  const [modalShow, setModalShow] = useState(false);
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

  useEffect(() => {
    if (data && (data.website == '' || data.radio == '')) {
      //第一次进基本信息默认自动更新
      form.setFieldsValue({
        website: true,
        radio: '1'
      })
    } else {
      //返回到基本信息页显示数据
      form.setFieldsValue(data)
    }
  }, []);
  //设置弹窗数据
  const setFormData=(data)=>{
    if(JSON.stringify(data) != "{}") {//修改
      form.setFieldsValue({
        codeDesc1: data.channelName,
        codeDesc: data.channelName + ',' + data.channelId,
        groupName: data.groupName,
        groupCode: data.groupCode.substring(10),
        refreshType: data.refreshType,
        remark: data.remark,
        runStatus: data.runStatus === '1',
        useNewFile: (data.useNewFile===true || data.useNewFile===false) ? data.useNewFile:true, 
      })
    } else {//新增
      setModalShow(true);
      form.setFieldsValue({
        groupName: '',
        groupCode: '',
        refreshType: '',
        remark: '',
        tagLayers: [],
        runStatus:true,
        useNewFile:true,
      })
    }
  }
  //编辑查询
  useEffect(() => {
    let data = JSON.parse(JSON.stringify(allUserGroupData))
    setFormData(data)
  }, [allUserGroupData]);
  useEffect(() => {
    let data = JSON.parse(JSON.stringify(allImportUserGroupData))
    setFormData(data)
  }, [allImportUserGroupData]);
  
  //上传
  const uploadFile = (info) => {
    if (info.file.status === 'done') {
      form.setFieldsValue({
        code: info.file.response.body[0]
      })
    }
  }

  const onChangeTree = (value) => {
    setTreeValue(value)
  };

  //name校验
  const validateServiceName = (rule, value, callback) => {
    if(!value) return callback()
    if(JSON.stringify(allUserGroupData) != "{}" || JSON.stringify(allImportUserGroupData) != "{}") {
      callback()
    } else {
      dispatch({
        type: 'setGroupList/getNameUniqueData',
        payload: {
          method: 'get',
          groupName: value,
          params: {},
          loading:false,
        },
        callback: (res) => {
          if(res.body) {
            callback()
          } else {
            callback('用户群名称已存在')
          }
        }
      });
    }
  }


  return (
    <div className={style.form_box}>
      <Form {...layout} form={form} onFinish={onFinish} validateMessages={validateMessages}>
        <Form.Item name='groupName' label="用户群显示名" rules={[{ required: true },{validator: validateServiceName}]}>
          <Input autocomplete="off"/>
        </Form.Item>
        {
          (JSON.stringify(allUserGroupData) != "{}" || JSON.stringify(allImportUserGroupData) != "{}") ?
            <Form.Item name='groupCode' label="用户群ID">
            <Input
              disabled={true}
              addonBefore="user_group" autocomplete="off"/>
          </Form.Item>:''
        }
        {
           modalType != 'create' && isCustomFlag == 'import'? <Form.Item name='useNewFile' label="群组修改" defa>
           <Radio.Group>
            <Radio value={false}>仅添加新增数据</Radio>
            <Radio value={true}>覆盖原有数据</Radio>
          </Radio.Group>
         </Form.Item>:''
        }
        {
          isCustomFlag != 'import' ?
            // 自定义创建
            <Form.Item name='refreshType' label="更新方式" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value="MANUAL">手动更新</Radio>
                <Radio value="AUTO">例行更新(每天)</Radio>
              </Radio.Group>
            </Form.Item> :
            //导入创建
            <div>
              <Form.Item
                name="code"
                label="上传"
                rules={[{ required: true }]}
              >
                <div className={style.fileUploadBox}>
                <Upload
                  action={uploadImg}
                  name="files"
                  onChange={(e) => { uploadFile(e) }}
                  headers={headers}
                   >
                  <Button icon={<UploadOutlined />}>选择文件</Button>
                </Upload>
                </div>
                <div className={style.upload_remark}>
                  <span>上传模板格式的用户信息创建用用户分群（请选择其中一列填写用户信息）</span>
                  <a href="https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/file-template/carowner-admin/%E6%A0%87%E7%AD%BE%E7%BE%A4%E7%BB%84%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx"
                  download='模板.xls' className={style.upload_template}>下载模板</a>
                </div>
              </Form.Item>
            </div>
        }
        <Form.Item name='remark' label="备注">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name='runStatus' label="状态" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
      </Form>
    </div >
  )
}
export default connect(({ setGroupList }) => ({
  isCustomFlag: setGroupList.isCustomFlag,
  modalType: setGroupList.modalType,
  treeList: setGroupList.treeList,
  customerNameList: setGroupList.customerNameList,
  allImportUserGroupData: setGroupList.allImportUserGroupData,
  allUserGroupData: setGroupList.allUserGroupData
}))(CreateMessage);