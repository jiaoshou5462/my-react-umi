import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, Upload, message, Button, Radio
} from "antd";
import { LoadingOutlined, PlusOutlined, DeleteOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { uploadIcon } from '@/services/activity.js';
import style from "./style.less"


// 2横向滑动
const lateralSliding = (props) => {
  const { dispatch, putItem } = props;
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };

  // 总数据list内容设置
  let [formData, setFormData] = useState([])

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

  //增加图片列表
  let addList = e => {
    let toFormData = formData;
    toFormData.push({pictureUrl: "",actionUrl: ""})
    setFormData([...toFormData]);
  }

  //图片列表删除及上下
  let setListTs = (name, int) => {
    let toFormData = formData;
    if (name == "up") {   //上移
      if (int > 0) {
        toFormData.splice(int - 1, 0, (toFormData[int]))
        toFormData.splice(int + 1, 1)
      }
    } else if (name == "dele") {//删除
      toFormData.splice(int, 1)
    } else if (name == "down") {//下移
      toFormData.splice(int + 2, 0, (toFormData[int]))
      toFormData.splice(int, 1)
    }
    setFormData([...toFormData]);
  }
  return (
    <div className={style.wrap}>
      <div className={style.wrap_child2}>
        <h5>上传图片</h5>
        <p>要求：图片宽高 750*320 (单位px)，图片大小不超过2M，支持图片格式 jpg/png</p>
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
                  >
                    {item.pictureUrl ? <img src={item.pictureUrl} alt="图片上传" style={{ width: '100%' }} /> : <span className={style.wrap_list_li_imgs}>图片上传</span>}
                  </Upload>
                </div>
                <div className={style.wrap_list_li_link}>
                  <strong>链接：</strong><Input onChange={linkChange.bind(this, index)} value={item.actionUrl} />
                </div>
                <div className={style.wrap_list_li_tools}>
                  <span onClick={() => { setListTs("up", index) }}><UpOutlined /></span>
                  <span onClick={() => { setListTs("dele", index) }}><DeleteOutlined /></span>
                  <span onClick={() => { setListTs("down", index) }}><DownOutlined /></span>
                </div>
              </div>
            })
          }
          <Button className={style.wrap_list_btn} onClick={addList} icon={<PlusOutlined />}>继续添加组件</Button>
        </div>
      </div>

    </div>
  )
};
export default connect(({ carowner_pageManage }) => ({
  putItem: carowner_pageManage.putItem,
}))(lateralSliding)
