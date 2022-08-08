import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, message, Upload, Button,Tabs,Radio,
} from "antd";
import { PlusOutlined } from '@ant-design/icons';
import style from "./style.less";
import { uploadIcon } from '@/services/activity.js';
const { TabPane } = Tabs;

// 4图文导航
const pictureNavigation = (props) => {
  const { dispatch, putItem,pageAllList,} = props;
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };

  //总数据列表
  let [formData, setFormData] = useState([]);
  let [formDataStyle, setFormDataStyle] = useState([{}])
  let [activeKey, setActiveKey] = useState('1')
  //1置顶，2不置顶
  let [isTop, setIsTop] = useState(putItem.defaultComponent || 2);

  useEffect(() => {
    setActiveKey('1');//重置tab
    if (JSON.stringify(putItem)!='{}') {
      let newObj = JSON.parse(JSON.stringify(putItem));
      let compStyle = '';
      console.log(newObj)
      if(newObj.compStyle.length && JSON.stringify(newObj.compStyle[0])!='{}'){
        compStyle = newObj.compStyle;
      }else{
        compStyle = [{
          isBackground:'0',
        }]
      }
      setFormDataStyle(compStyle)
      setFormData(newObj.compList);
    }
  }, [putItem])


  useEffect(() => {
    if(putItem.isClick){
      delete putItem.isClick;return;
    }
    let newObj = JSON.parse(JSON.stringify(putItem));
    newObj.compList = JSON.parse(JSON.stringify(formData))
    newObj.compStyle = JSON.parse(JSON.stringify(formDataStyle));
    newObj.defaultComponent = isTop;
    console.log(newObj)
    dispatch({
      type: 'carowner_pageManage/setSendItem',
      payload: newObj
    })
  }, [formData,formDataStyle,isTop])

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
    let toItems = info.file.response ? info.file.response.items : '';
    if(i=='bg'){
      formDataStyle[0].backgroundUrl = toItems;
      setFormDataStyle([...formDataStyle]);
    }else{
      let toFormData = formData;
      toFormData[i].pictureUrl = toItems;
      setFormData([...toFormData]);
    }
  };
  //拓展标题
  let roChange = (e,name) => {
    formDataStyle[0][name] = e.target.value;
    setFormDataStyle([...formDataStyle]);
  };
  let topChange=(value)=>{
    for(let item of pageAllList){
      if(item.defaultComponent==1 && value==1){
        message.error('只能置顶一个组件');
        return;
      }
    }
    setIsTop(value);
  }
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
  //上下移删
  let setListTs = (name, int) => {
    let toFormData = JSON.parse(JSON.stringify(formData));
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
  //增加列表
  let addList = e => {
    let toFormData = formData;
    toFormData.push({
      pictureUrl: '',
      actionUrl: "",
      text: ""
    })
    setFormData([...toFormData]);
  }
  
  return (
    <div className={style.wrap}>
      <Tabs defaultActiveKey={"1"} activeKey={activeKey} onTabClick={setActiveKey} className={style.wrap_tab}>
        <TabPane tab="内容设置" key="1">
          <div className={style.wrap_child_box}>
            <em>是否置顶</em>
            <Radio.Group onChange={(e)=>topChange(e.target.value)}
              value={isTop}
              className={style.wrap_box_li_top}>
              <Radio value={1}>置顶</Radio>
              <Radio value={2}>不置顶</Radio>
            </Radio.Group>
          </div>
          <h2>上传图片：</h2>
          <div className={style.wrap_p1}>要求：图片宽度60px 高度60px，图片大小不超过20kb，支持图片格式 jpg/png </div>
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
                    <div className={style.wrap_list_li_ts}>
                      <span onClick={() => { setListTs("up", index) }}>前移</span>
                      <span onClick={() => { setListTs("dele", index) }}>删除</span>
                      <span onClick={() => { setListTs("down", index) }}>后移</span>
                    </div>
                  </div>
                </div>
              })
            }
            <Button className={style.wrap_list_btn} onClick={addList} icon={<PlusOutlined />}>继续添加组件</Button>
          </div>
        </TabPane>
        <TabPane tab="样式设置" key="2">
          <div className={style.wrap_box}>
            <p>要求：图片宽度750px，每一行高度100px，图片大小不超过500kb，支持图片格式jpg/png</p>
            <div className={style.wrap_box_li}>
              <Radio.Group onChange={(e)=>roChange(e,'isBackground')} defaultValue={'0'}
              value={formDataStyle[0].isBackground} className={style.wrap_box_li_top}>
                <Radio value={'0'}>无底色</Radio>
                <Radio value={'1'}>背景图</Radio>
              </Radio.Group>
            </div>
            {
              formDataStyle[0].isBackground == 1 ? 
              <div className={style.wrap_box_li}>
                <div className={style.wrap_list_li_img}>
                  <Upload
                    name="files"
                    listType="picture-card"
                    action={uploadIcon}
                    showUploadList={false}
                    beforeUpload={imgUpload.bind(this, 'bg')}
                    onChange={imgChange.bind(this, 'bg')}
                    headers={headers}
                    className={style.bgUpload}
                  >
                    {formDataStyle[0].backgroundUrl ? <img src={formDataStyle[0].backgroundUrl} alt="图片上传" style={{ width: '100%', height: '100%' }} /> :
                    <span className={style.wrap_list_li_imgs}>图片上传</span>}
                  </Upload>
                </div>
              </div>:''
            }
          </div>
        </TabPane>
      </Tabs>
    </div>
  )
};
export default connect(({ carowner_pageManage }) => ({
  putItem: carowner_pageManage.putItem,
  pageAllList: carowner_pageManage.pageAllList,
}))(pictureNavigation)
