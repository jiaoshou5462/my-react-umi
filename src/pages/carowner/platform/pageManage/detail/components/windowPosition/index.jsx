import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, message, Upload, Button, Radio
} from "antd";
import { PlusOutlined } from '@ant-design/icons';
import style from "./style.less";
import { uploadIcon } from '@/services/activity.js';



// 6橱窗位
const windowPosition = (props) => {
  const { dispatch, putItem } = props;
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken }

  let [formData, setFormData] = useState([{},{},{}])//上传图片列表

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
    newObj.compList = JSON.parse(JSON.stringify(formData));
    dispatch({
      type: 'carowner_pageManage/setSendItem',
      payload: newObj
    })
  }, [formData])
  //图片上传
  let imgUpload = (i, file) => {
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
  let imgChange = (i, info) => {
    let toFormData = JSON.parse(JSON.stringify(formData));
    let toItems = info.file.response ? info.file.response.items : '';
    toFormData[i].pictureUrl = toItems;
    setFormData(toFormData)//一定要解构
  };
  //链接
  let linkChange = (i, e) => {
    let toFormData = JSON.parse(JSON.stringify(formData));
    toFormData[i].actionUrl = e.target.value;
    setFormData(toFormData)
  };

  return (
    <div className={style.wrap}>
      <h5>上传图片：</h5>
      <p>要求：</p>
      <p>左侧大图：图片宽度348px，高度300px；图片大小不超过40kb，支持图片格式 jpg/png。</p>
      <p>右侧小图：图片宽度348px，高度144px；图片大小不超过40kb，支持图片格式 jpg/png。</p>
      <div className={style.wrap_box}>
        {
          formData.map((item, index) => {
            return <div className={style.wrap_box_item}>
              <div className={index == 0 ? style.wrap_box_img : style.wrap_box_img2}>
                <Upload
                  name="files"
                  headers={headers}
                  listType="picture-card"
                  action={uploadIcon}
                  showUploadList={false}
                  onChange={imgChange.bind(this, index)}
                  beforeUpload={imgUpload.bind(this, index)}
                  className={style.wrap_box_img_cl}
                >
                  {item.pictureUrl ? <img src={item.pictureUrl} alt="图片上传" style={{ width: '100%' }} /> : <span className={style.wrap_box_img_child}>图片上传</span>}
                </Upload>
                {item.pictureUrl ? <a download href={item.pictureUrl} style={{fontSize:'12px'}}>下载图片</a>:''}
              </div>
              <div className={style.wrap_box_tt}>
                <div><span>链接</span><Input onChange={linkChange.bind(this, index)} value={item.actionUrl} /></div>
              </div>
            </div>
          })
        }

      </div>
    </div>
  )
};
export default connect(({ carowner_pageManage }) => ({
  putItem: carowner_pageManage.putItem,
}))(windowPosition)
