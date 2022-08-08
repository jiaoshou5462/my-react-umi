import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, message, Upload, Button
} from "antd";
import { PlusOutlined } from '@ant-design/icons';
import style from "./style.less";
import { uploadIcon } from '@/services/activity.js';


//双列图7
const doubleRowPicture = (props) => {
  const { dispatch, putItem } = props;
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };

  //总数据
  let [formData, setFormData] = useState([]);

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
  //图片名称
  let txtChange = (i, e) => {
    let toFormData = formData;
    toFormData[i].text = e.target.value;
    setFormData([...toFormData]);
  };
  //链接
  let linkChange = (i, e) => {
    let toFormData = formData;
    toFormData[i].actionUrl = e.target.value;
    setFormData([...toFormData]);
  };
  //删
  let setListTs = (name, int) => {
    let toFormData = formData;
    if (name == "dele") {//删除
      toFormData.splice(int, 1)
    }
    setFormData([...toFormData]);
  }
  //增加列表
  let addList = e => {
    let toFormData = formData;
    if (toFormData.length < 6) {
      toFormData.push({ pictureUrl: '', actionUrl: "", text: "" })
    }
    setFormData([...toFormData]);
  }
  return (
    <div className={style.wrap}>
      <h5>上传图片：</h5>
      <div className={style.wrap_p1}>图片内的图标内容需要按照下图规则制作：宽高比 176*160，支持图片格式 jpg/png</div>
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
                  {item.pictureUrl ? <img src={item.pictureUrl} alt="图片上传" style={{ width: '100%', height: '100%' }} /> : <span className={style.wrap_list_li_imgs}>图片上传</span>}
                </Upload>
                {item.pictureUrl ? <a download href={item.pictureUrl} style={{fontSize:'12px'}}>下载图片</a>:''}
              </div>
              <div className={style.wrap_list_li_tool}>
                <div className={style.wrap_list_li_pn}>
                  <p className={style.wrap_list_li_link}>
                    <strong>图片名称</strong><Input onChange={txtChange.bind(this, index)} value={item.text} />
                  </p>
                  <p className={style.wrap_list_li_link}>
                    <strong>链接</strong><Input onChange={linkChange.bind(this, index)} value={item.actionUrl} />
                  </p>
                </div>
                <div className={style.wrap_list_li_ts}>
                  <span onClick={() => { setListTs("dele", index) }}>删除</span>
                </div>
              </div>
            </div>
          })
        }
      </div>
      <Button className={style.wrap_list_btn} onClick={addList} icon={<PlusOutlined />}>继续添加组件({formData.length}/6)</Button>
    </div>
  )
};
export default connect(({ carowner_pageManage }) => ({
  putItem: carowner_pageManage.putItem,
}))(doubleRowPicture)
