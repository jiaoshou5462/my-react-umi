import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, message, Upload,Form,
} from "antd";
import SetColor from '@/pages/activityModule/components/setColor';   //选择颜色组件
import { uploadIcon } from '@/services/activity.js';
import style from "./style.less";

const { TextArea } = Input;

let defaultObj={
  backgroundColor:'#fff',
  pageName:'',
  isDisplayName: true,
  pageDescribe: '',
  shareTitle: '',
  shareDescribe: '',
  shareImage: '',
}
let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
const settingAll = (props) => {
  const { dispatch, pageItem,checkSettingAll} = props;
  //总数据
  let [formData, setFormData] = useState(defaultObj);

  useEffect(() => {
    if(JSON.stringify(pageItem)!='{}'){
      let obj = {
        backgroundColor: pageItem.backgroundColor,
        pageName: pageItem.pageName,
        isDisplayName: pageItem.isDisplayName===1 || pageItem.isDisplayName===null,
        pageDescribe: pageItem.pageDescribe,
        shareTitle:  pageItem.shareTitle,
        shareDescribe:  pageItem.shareDescribe,
        shareImage:  pageItem.shareImage,
      };
      setFormData(obj);
    }
  }, [pageItem])
  useEffect(() => {
    dispatch({
      type: 'carowner_pageManage/settingAll',
      payload: JSON.parse(JSON.stringify(formData))
    })
  }, [formData])
 
  //颜色
  let setMcolor = (n, i) => {
    let obj = {...formData};
    obj[n] = i;
    setFormData(obj);
  };
  const valueChange=(value,key)=>{
    let obj = {...formData};
    obj[key] = value;
    setFormData(obj);
  }
  //重置颜色
  const resetColor=()=>{
    let obj = {...formData};
    obj.backgroundColor = '#fff';
    setFormData(obj);
  }
   //图片上传
   const imgUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传JPG/PNG 格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能高于 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  let imgChange = (info) => {
    let obj = JSON.parse(JSON.stringify(formData));
    obj.shareImage = info.file.response ? info.file.response.items : '';
    setFormData(obj);
  };

  return (
    <div className={style.box}>
      {checkSettingAll ? <Form autoComplete="off" layout="vertical" >
        <Form.Item label={<div className={style.require_lable}>页面名称</div>}>
          <Input value={formData.pageName} onChange={(e)=>valueChange(e.target.value,'pageName')} maxLength="8"/>
        </Form.Item>
        <Form.Item label={<div className={style.require_lable}>页面描述</div>}>
          <TextArea value={formData.pageDescribe} onChange={(e)=>valueChange(e.target.value,'pageDescribe')} rows={2} showCount maxLength="50"/>
        </Form.Item>
        <Form.Item label={<div className={style.require_lable}>分享标题</div>}>
          <Input value={formData.shareTitle} onChange={(e)=>valueChange(e.target.value,'shareTitle')} maxLength="20"/>
        </Form.Item>
        <Form.Item label={<div className={style.require_lable}>分享描述</div>}>
          <TextArea value={formData.shareDescribe} onChange={(e)=>valueChange(e.target.value,'shareDescribe')} rows={2} showCount maxLength="50"/>
        </Form.Item>
        <Form.Item label={<div className={style.require_lable}>分享图片</div>}>
        <div className={style.bg_tips}>建议尺寸：200px*200px</div>
        <Upload
          name="files"
          listType="picture-card"
          action={uploadIcon}
          showUploadList={false}
          beforeUpload={(e)=>imgUpload(e)}
          onChange={(e)=>imgChange(e)}
          headers={headers}
          className={style.upload_box_bg}
        >
          {formData.shareImage ? <img src={formData.shareImage} alt="图片上传" style={{ width: '100%', height: '100%' }} /> : <span >图片上传</span>}
        </Upload>
        </Form.Item>
        {/* <Form.Item label="是否显示名称" >
          <Switch checked={formData.isDisplayName} defaultChecked={true}
           onChange={(e)=>valueChange(e,'isDisplayName')}
           checkedChildren="展示" unCheckedChildren="隐藏" />
        </Form.Item> */}
        <Form.Item label="背景颜色" name="backgroundColor" style={{paddingBottom: '300px'}}>
          <div className={style.color_box}>
            <SetColor colors={formData.backgroundColor||'#fff'}
            colorName='backgroundColor' setMColor={setMcolor} ></SetColor>
            <span className={style.reset_btn} onClick={resetColor}>重置</span>
          </div>
        </Form.Item>
      </Form>:<div className={style.empty_tips}>该页面无需配置基础设置</div>}
    </div>
  )
};
export default connect(({ carowner_pageManage }) => ({
  putItem: carowner_pageManage.putItem,
  pageItem: carowner_pageManage.pageItem,
  checkSettingAll: carowner_pageManage.checkSettingAll,
}))(settingAll)
