import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, Upload, message, Button, Radio, Tabs, InputNumber,Popover
} from "antd";
import { PlusOutlined, DeleteOutlined, UpOutlined, DownOutlined,DownloadOutlined } from '@ant-design/icons';
import { uploadIcon } from '@/services/activity.js';
import SetColor from '@/pages/activityModule/components/setColor';   //选择颜色组件
import style from "./style.less"
const { TabPane } = Tabs;


// 1轮播图
const carouselPicture = (props) => {
  const { dispatch, putItem,pageAllList } = props;
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };

  // 总数据list内容设置
  let [formData, setFormData] = useState([])
  // 总数据style样式设置
  let [formDataStyle, setFormDataStyle] = useState([{}])
  //1置顶，2不置顶
  let [isTop, setIsTop] = useState(putItem.defaultComponent);
  let [activeKey, setActiveKey] = useState('1')

  useEffect(() => {
    setActiveKey('1')//重置tab
    if (JSON.stringify(putItem)!='{}') {
      let newObj = JSON.parse(JSON.stringify(putItem));
      setFormData(newObj.compList);
      if(putItem.compStyle.length){
        setFormDataStyle(newObj.compStyle);
      }else{
        setFormDataStyle([{
          bannerStyle: 1,//（轮播圆点）样式
          frontCheckColor: "#ff0",//选中色
          frontUncheckColor: "#0f0",//未选中色
          speed: 2//轮播速度
        }]);
      }
    }
  }, [putItem])


  useEffect(() => {
    if(putItem.isClick){
      delete putItem.isClick;return;
    }
    let newObj = JSON.parse(JSON.stringify(putItem));
    newObj.compList = JSON.parse(JSON.stringify(formData));
    newObj.compStyle = JSON.parse(JSON.stringify(formDataStyle));
    newObj.defaultComponent = isTop;

    dispatch({
      type: 'carowner_pageManage/setSendItem',
      payload: newObj
    })
  }, [formData, formDataStyle,isTop])

  //是否置顶 1置顶，2不置顶
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
    // console.log(file,'888')/
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

  // 改变图片1
  let imgChange = (i, info) => {
    let toFormData = JSON.parse(JSON.stringify(formData));
    let toItems = info.file.response ? info.file.response.items : '';
    toFormData[i].pictureUrl = toItems;
    setFormData([...toFormData]);
  };

  //链接2
  let linkChange = (i, e) => {
    let toFormData = JSON.parse(JSON.stringify(formData));
    toFormData[i].actionUrl = e.target.value;
    setFormData([...toFormData]);
  };

  //增加图片列表3
  let addList = e => {
    let toFormData = JSON.parse(JSON.stringify(formData));
    toFormData.push({ pictureUrl: "", actionUrl: "" })
    setFormData([...toFormData]);
  }


  //样式(轮播圆点)4
  let styleChange = e => {
    let toFormDataStyle = JSON.parse(JSON.stringify(formDataStyle));
    toFormDataStyle[0].bannerStyle = e.target.value;
    setFormDataStyle([...toFormDataStyle]);
  };

  //颜色5
  let setMcolor = (n, i) => {//名称，颜值
    let toFormDataStyle = JSON.parse(JSON.stringify(formDataStyle));
    toFormDataStyle[0][n] = i;
    setFormDataStyle([...toFormDataStyle]);
  };

  //轮播速度6
  let numberChange = (e) => {
    let toFormDataStyle = JSON.parse(JSON.stringify(formDataStyle));
    toFormDataStyle[0].speed = e;
    setFormDataStyle([...toFormDataStyle]);
  };

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
    // queryPageComponentList()
  }

  let queryPageComponentList = () => {//刷新
    dispatch({
      type: 'carowner_pageManage/queryPageComponentList',
      payload: {
        method: 'postJSON',
        params: {
          pageId: history.location.query.pageId
        }
      }
    })
  }

  return (
    <div className={style.wrap}>
      <Tabs defaultActiveKey="1" activeKey={activeKey} onTabClick={setActiveKey} className={style.wrap_tab}>
        <TabPane tab="轮播内容" key="1">
          <div className={style.wrap_box}>
            <div className={style.wrap_child}>
              <h5>组件置顶</h5>
              <p>置顶的组件会固定在除【用户信息】组件外的最顶部</p>
              <div className={style.wrap_child_box}>
                <em>是否置顶</em>
                <Radio.Group onChange={(e)=>roChange(e.target.value)} value={isTop}>
                  <Radio value={1}>置顶</Radio>
                  <Radio value={2}>不置顶</Radio>
                </Radio.Group>
              </div>
            </div>
            <div className={style.wrap_child2}>
              <h5>上传图片</h5>
              <p>要求：图片宽高 750*320 (单位px)，图片大小不超过2M，支持图片格式jpg/png</p>
              <div className={style.wrap_list}>
                {
                  formData.map((item, index) => {
                    return <div className={style.wrap_list_li}>
                      <div className={style.wrap_list_li_img}>
                        <Upload
                          name="files"
                          headers={headers}
                          listType="picture-card"
                          action={uploadIcon}
                          showUploadList={false}
                          beforeUpload={imgUpload.bind(this, index)}
                          onChange={imgChange.bind(this, index)}
                        >
                          {item.pictureUrl ? <img src={item.pictureUrl} alt="图片上传" style={{ width: '100%' }} /> : <span className={style.wrap_list_li_imgs}>图片上传</span>}
                        </Upload>
                      </div>
                      <div className={style.wrap_list_li_link}>
                        <strong>链接：</strong><Input onChange={linkChange.bind(this, index)} value={item.actionUrl} />
                      </div>
                      <div className={style.wrap_list_li_tools}>
                        <span onClick={() => { setListTs("up", index) }}><UpOutlined /> 上移</span>
                        <span onClick={() => { setListTs("dele", index) }}><DeleteOutlined style={{color:'red'}}/> 删除</span>
                        <span onClick={() => { setListTs("down", index) }}><DownOutlined /> 下移</span>
                        {item.pictureUrl?<a download href={item.pictureUrl}><DownloadOutlined style={{color:'#1890ff'}}/> 下载</a>:''}
                      </div>
                    </div>
                  })
                }
                <Button className={style.wrap_list_btn} onClick={addList} icon={<PlusOutlined />}>继续添加组件</Button>
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane tab="样式设置" key="2">
          <div className={style.wrap_box2}>
            <h5>轮播导航</h5>
            <div className={style.wrap_box2_main}>
              <div className={style.wrap_box2_p}>
                <strong>样式</strong>
                <Radio.Group className={style.wrap_box2_top2} onChange={styleChange} value={formDataStyle[0].bannerStyle}>
                  <Radio value={'1'} className={style.wrap_box2_pro}><i>1</i><div className={style.wrap_box2_proi}><i className={style.wrap_box2_pro_a1}></i><i></i><i></i></div></Radio>
                  <Radio value={'2'} className={style.wrap_box2_pro}><i>2</i><div className={style.wrap_box2_proi}><i className={style.wrap_box2_pro_a2}></i><i></i><i></i></div></Radio>
                </Radio.Group>
              </div>
              <div className={style.wrap_box2_p}>
                <strong>未选中色</strong>
                <div className={style.wrap_box2_top}><SetColor colors={formDataStyle[0].frontUncheckColor} colorName='frontUncheckColor' setMColor={setMcolor}></SetColor></div>
              </div>
              <div className={style.wrap_box2_p}>
                <strong>选中色</strong>
                <div className={style.wrap_box2_top}> <SetColor colors={formDataStyle[0].frontCheckColor} colorName='frontCheckColor' setMColor={setMcolor}></SetColor></div>
              </div>
              <div className={style.wrap_box2_p}>
                <strong>轮播速度</strong>
                <InputNumber min={1} value={formDataStyle[0].speed} onChange={numberChange} />
                <em>秒替换一张</em>
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>


    </div>
  )
};
export default connect(({ carowner_pageManage }) => ({
  putItem: carowner_pageManage.putItem,
  pageAllList: carowner_pageManage.pageAllList,
}))(carouselPicture)
