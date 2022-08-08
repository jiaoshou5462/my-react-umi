import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input,
  Upload, message, Button
} from "antd";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { uploadIcon } from '@/services/activity.js';
import style from "./style.less"
import { forEach } from "lodash";


// 0单列图
const singleLinePicture = (props) => {
  const { dispatch, allCompList, putItem } = props;
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  let [formData, setFormData] = useState([{}])//上传图片列表(只是其中一个)
  //当前选中组件
  useEffect(() => {
    if (JSON.stringify(putItem)!='{}') {
      let newObj = JSON.parse(JSON.stringify(putItem));
      setFormData(newObj.compList);
    }
  }, [putItem])


  useEffect(() => {
    if(putItem.isClick){
      delete putItem.isClick;return;
    }
    let newObj = JSON.parse(JSON.stringify(putItem));
    newObj.compList = JSON.parse(JSON.stringify(formData))
    dispatch({
      type: 'carowner_pageManage/setSendItem',
      payload: newObj
    })

  }, [formData])


  //图片上传
  let imgUpload = (file, i) => {
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

  // 改变图片
  let imgChange = (info) => {
    let toFormData = formData;
    let toItems = info.file.response ? info.file.response.items : '';
    toFormData[0].pictureUrl = toItems;
    setFormData([...toFormData]);
  };
  //链接
  let linkChange = (e) => {
    let toFormData = formData;
    toFormData[0].actionUrl = e.target.value;
    setFormData([...toFormData]);
  };
  // 文本
  let textChange = (e) => {
    let toFormData = formData;
    toFormData[0].text = e.target.value;
    setFormData([...toFormData]);
  };
  return (
    <div className={style.wrap}>
      <h5>上传图片：</h5>
      <p>要求：图片宽度710px，高度300px，图片大小不超过50kb，支持图片格式 jpg/png</p>
      <div className={style.wrap_box}>
        <div className={style.wrap_box_img}>
          <Upload
            name="files"
            headers={headers}
            listType="picture-card"
            action={uploadIcon}
            showUploadList={false}
            onChange={imgChange}
            beforeUpload={imgUpload}
            className={style.wrap_box_img_cl}
          >
            {formData[0].pictureUrl ? <img src={formData[0].pictureUrl} alt="图片上传" style={{ width: '100%' }} /> : <span className={style.wrap_box_img_child}>图片上传</span>}
          </Upload>
          {formData[0].pictureUrl ? <a download href={formData[0].pictureUrl} style={{fontSize:'12px',marginTop:'10px',display:'block'}}>下载图片</a>:''}
        </div>
        {
          formData[0] ?
            <div className={style.wrap_box_tt}>
              <div><span>链接</span><Input onChange={linkChange} value={formData[0].actionUrl} /></div>
              <div><span>文本</span><Input onChange={textChange} value={formData[0].text} /></div>
            </div>
            : ''
        }
      </div>
    </div>
  )
};
export default connect(({ carowner_pageManage }) => ({
  allCompList: carowner_pageManage.allCompList,
  putItem: carowner_pageManage.putItem,
}))(singleLinePicture)
