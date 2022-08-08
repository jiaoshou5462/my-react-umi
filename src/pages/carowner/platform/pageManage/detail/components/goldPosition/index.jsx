import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, message, Upload, Button, Radio
} from "antd";
import { PlusOutlined } from '@ant-design/icons';
import style from "./style.less";
import { uploadIcon } from '@/services/activity.js';


// 5黄金位
const goldPosition = (props) => {
  const { dispatch, putItem,pageAllList } = props;
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };


  // 总数据list内容设置
  let [formData, setFormData] = useState([])
  //1置顶，2不置顶
  let [isTop, setIsTop] = useState(putItem.defaultComponent);

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
    newObj.defaultComponent = isTop;
    dispatch({
      type: 'carowner_pageManage/setSendItem',
      payload: newObj
    })
  }, [formData,isTop])

  //是否置顶
  let roChange = (value) => {
    for(let item of pageAllList){
      if(item.defaultComponent==1 && value==1){
        message.error('只能置顶一个组件');
        return;
      }
    }
    setIsTop(value);
  };

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
    let toFormData = formData;
    let toItems = info.file.response ? info.file.response.items : '';
    toFormData[i].pictureUrl = toItems;
    setFormData([...toFormData]);
  };

  //链接
  let linkChange = (i, e) => {
    let toFormData = formData;
    toFormData[i].actionUrl = e.target.value;
    setFormData([...toFormData]);
  };
  //文本
  let textChange = (i, e) => {
    let toFormData = formData;
    toFormData[i].text = e.target.value;
    setFormData([...toFormData]);
  };

  return (
    <div className={style.wrap}>
      <h2>上传图片：</h2>
      <div className={style.wrap_p1}>要求：图片宽度60px 高度60px，图片大小不超过20kb，支持图片格式 jpg/png </div>
      <h2>组件置顶</h2>
      <div className={style.wrap_p1}>置顶的组件会固定在除【用户信息】组件外的最顶部</div>
      <div className={style.wrap_child_box}>
        <em>是否置顶</em>
        <Radio.Group onChange={(e)=>roChange(e.target.value)} value={isTop}>
          <Radio value={1}>置顶</Radio>
          <Radio value={2}>不置顶</Radio>
        </Radio.Group>
      </div>

      <div className={style.wrap_list}>
        {
          formData.map((item, index) => {
            return <div className={style.wrap_list_li}>
              <div className={style.wrap_list_li_img}>
                <Upload
                  name="files"
                  listType="picture-card"
                  action={uploadIcon}
                  showUploadList={false}
                  beforeUpload={imgUpload.bind(this, index)}
                  onChange={imgChange.bind(this, index)}
                  headers={headers}
                  className={style.wrap_list_li_img_child}
                >
                  {item.pictureUrl ? <img src={item.pictureUrl} alt="图片上传" style={{ width: '100%' }} /> : <span className={style.wrap_list_li_imgs}>图片上传</span>}
                </Upload>
                {item.pictureUrl ? <a download href={item.pictureUrl} style={{fontSize:'12px',paddingLeft:'13px'}}>下载图片</a>:''}
              </div>
              <div className={style.wrap_list_li_tool}>
                <div className={style.wrap_list_li_pn}>
                  <p className={style.wrap_list_li_link}>
                    <strong>链接</strong><Input onChange={linkChange.bind(this, index)} value={item.actionUrl} />
                  </p>
                  <p className={style.wrap_list_li_link}>
                    <strong>文本</strong><Input onChange={textChange.bind(this, index)} value={item.text} />
                  </p>
                </div>
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
  pageAllList: carowner_pageManage.pageAllList,
}))(goldPosition)
