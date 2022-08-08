import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
  Input, Upload, message, Button, Radio, Tabs, InputNumber, Select, Divider
} from "antd";
import { LoadingOutlined, PlusOutlined, DeleteOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { uploadIcon } from '@/services/activity.js';
import SetColor from '@/pages/activityModule/components/setColor';   //选择颜色组件
import style from "./style.less"
const { TabPane } = Tabs;
const { Option, OptGroup } = Select;

// 12分类2
let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));
const contentType2 = (props) => {
  const { dispatch, putItem, listSelect } = props;
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };

  // 总数据list内容设置
  let [formData, setFormData] = useState([])//数据列表
  // 总数据style样式设置
  let [formDataStyle, setFormDataStyle] = useState([{}])
  let [activeKey, setActiveKey] = useState('1')
  let positionTypeArr = [
    { positionName: '文章', positionType: '0' },
    { positionName: '链接', positionType: '1' },
    { positionName: '内部链接', positionType: '2' }
  ]

  useEffect(() => {
    setActiveKey('1');//重置tab
    if (JSON.stringify(putItem)!='{}') {
      let newObj = JSON.parse(JSON.stringify(putItem));
      setFormData(newObj.compList);
      setFormDataStyle(newObj.compStyle)
    }
  }, [putItem])

  useEffect(() => {
    console.log(formData, 'formData')
    // 下拉数据
    dispatch({
      type: 'carowner_pageManage/queryPageListSelect',
      payload: {
        method: 'post',
        params: {
          pageChannelId: tokenObj.channelId
        }
      }
    })
  }, [])

  useEffect(() => {
    if(putItem.isClick){
      delete putItem.isClick;return;
    }
    let newObj = JSON.parse(JSON.stringify(putItem));
    newObj.compList = JSON.parse(JSON.stringify(formData));
    newObj.compStyle = JSON.parse(JSON.stringify(formDataStyle));

    dispatch({
      type: 'carowner_pageManage/setSendItem',
      payload: newObj
    })
  }, [formData, formDataStyle])


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
  // 菜单名称
  let menuChange = (i, e) => {
    let toFormData = formData;
    toFormData[i].menuName = e.target.value;
    setFormData([...toFormData]);
  };
  // 改变定位类型
  let locationTypeChange = (i, e) => {
    let toFormData = formData;
    toFormData[i].positionType = e;
    setFormData([...toFormData]);
  }
  // 展示链接（输入框）
  let linkChange = (i, e) => {
    let toFormData = formData;
    toFormData[i].outsideUrl = e.target.value;
    setFormData([...toFormData]);
  };
  // 展示链接(下拉框)
  let selectChange = (i, e) => {
    let toFormData = formData;
    toFormData[i].insideUrl = e;
    setFormData([...toFormData]);
  };

  //增加图片列表
  let addList = e => {
    let toFormData = formData;
    toFormData.push({ pictureUrl: '', menuName: "", positionType: "0", insideUrl: '', outsideUrl: '' })
    setFormData([...toFormData]);
  }

  //是否显示
  let isShowChange = e => {
    let toFormDataStyle = formDataStyle;
    toFormDataStyle[0].needFrame = e.target.value;
    setFormDataStyle([...toFormDataStyle]);
  };
  //颜色
  let setMcolor = (n, i) => {
    let toFormDataStyle = formDataStyle;
    toFormDataStyle[0][n] = i;
    setFormDataStyle([...toFormDataStyle]);
  };
  //列表删除及上下
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

  let onUpChange = e => {
    let toFormDataStyle = formDataStyle;
    formDataStyle[0].marginTop = e.target.value
    setFormDataStyle([...toFormDataStyle]);
  }
  let onLowChange = e => {
    let toFormDataStyle = formDataStyle;
    formDataStyle[0].marginBottom = e.target.value
    setFormDataStyle([...toFormDataStyle]);
  }
  return (
    <div className={style.wrap}>
      <Tabs defaultActiveKey="1" activeKey={activeKey} onTabClick={setActiveKey}  className={style.wrap_tab}>
        <TabPane tab="内容设置" key="1">
          <div className={style.wrap_box}>
            <h6> 要求：图片宽度60px，高度60px，图片大小不超过20kb，支持图片格式 jpg/png</h6>
            <div className={style.wrap_child2}>
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
                      </div>

                      <div className={style.wrap_list_li_ipts}>
                        <div style={{ margin: '2px 5px' }}>
                          <span style={{ marginRight: '10px' }}>菜单名称</span>
                          <Input style={{ width: 220 }} onChange={menuChange.bind(this, index)} value={item.menuName} />
                        </div>
                        <div style={{ margin: '2px 5px' }}>
                          <span style={{ marginRight: '10px' }}>定位类型</span>
                          <Select defaultValue={item.positionType} style={{ width: 220 }} onChange={locationTypeChange.bind(this, index)}>
                            {
                              positionTypeArr.map((v) => <Option key={v.positionType} value={v.positionType}>{v.positionName}</Option>)
                            }
                          </Select>
                        </div>
                        {
                          item.positionType == '1' ?
                            <div style={{ margin: '2px 5px' }}>
                              <span style={{ marginRight: '10px' }}>展示链接</span>
                              <Input style={{ width: 220 }} onChange={linkChange.bind(this, index)} value={item.outsideUrl} />
                            </div> :
                            item.positionType == '2' ?
                              <div style={{ margin: '2px 5px' }}>
                                <span style={{ marginRight: '10px' }}>展示链接</span>
                                <Select style={{ width: 220 }} onChange={selectChange.bind(this, index)} value={Number(item.insideUrl)}>
                                  {
                                    listSelect.map((v) => <Option key={v.objectId} value={v.objectId}>{v.pageName}</Option>)
                                  }
                                </Select>
                              </div> : ''
                        }
                        <div className={style.wrap_list_li_tools}>
                          <span onClick={() => { setListTs("up", index) }}><UpOutlined /></span>
                          <span onClick={() => { setListTs("dele", index) }}><DeleteOutlined /></span>
                          <span onClick={() => { setListTs("down", index) }}><DownOutlined /></span>
                        </div>
                      </div>

                    </div>
                  })
                }
                {formData.length<4 ? <Button className={style.wrap_list_btn} onClick={addList} icon={<PlusOutlined />}>继续添加组件</Button>:''}
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane tab="样式设置" key="2">
          <h6>要求：图片宽度60px，高度60px，图片大小不超过20kb，支持图片格式 jpg/png</h6>
          <div className={style.wrap_box2}>
            <h5>颜色设置</h5>
            <div className={style.wrap_box2_main}>
              <div className={style.wrap_box2_p}>
                <strong>背景色</strong>
                <div className={style.wrap_box2_top}><SetColor colors={formDataStyle[0].backgroundColor} colorName='backgroundColor' setMColor={setMcolor} ></SetColor></div>
              </div>
              <div className={style.wrap_box2_p}>
                <strong>文字未选中色</strong>
                <div className={style.wrap_box2_top}><SetColor colors={formDataStyle[0].frontUncheckColor} colorName='frontUncheckColor' setMColor={setMcolor} ></SetColor></div>
              </div>
              <div className={style.wrap_box2_p}>
                <strong>文字选中色</strong>
                <div className={style.wrap_box2_top}> <SetColor colors={formDataStyle[0].frontCheckColor} colorName='frontCheckColor' setMColor={setMcolor} ></SetColor></div>
              </div>
              <div className={style.wrap_box2_p}>
                <strong>边框阴影</strong>
                <Radio.Group onChange={isShowChange} value={formDataStyle[0].needFrame+''}>
                  <Radio value={'0'}>显示</Radio>
                  <Radio value={'1'}>不显示</Radio>
                </Radio.Group>
              </div>
              <div className={style.wrap_box2_p}>
                <strong>边框阴影色</strong>
                <div className={style.wrap_box2_top}> <SetColor colors={formDataStyle[0].frameColor} colorName='frameColor' setMColor={setMcolor} ></SetColor></div>
              </div>
            </div>
            <Divider />
            <h5>间距设置</h5>
            <h6>小中大分别对应：小间距 0px；中间距 15px；大间距 30px</h6>
            <div>
              <div style={{ background: '#E7E9ED' }}>
                {/* 上间距 */}
                <div style={{ margin: '10px' }}>
                  <strong style={{ margin: '0 20px' }}>上间距</strong>
                  <strong style={{ margin: '0 20px' }}>{formDataStyle[0].marginTop}</strong>

                  <Radio.Group onChange={onUpChange} value={formDataStyle[0].marginTop} style={{ margin: '20px' }}>
                    <Radio.Button value="0px">小间距</Radio.Button>
                    <Radio.Button value="15px">中间距</Radio.Button>
                    <Radio.Button value="30px">大间距</Radio.Button>
                  </Radio.Group>
                </div>

                <div style={{ margin: '10px' }}>
                  {/* 下间距 */}
                  <strong style={{ margin: '0 20px' }}>下间距</strong>
                  <strong style={{ margin: '0 20px' }}>{formDataStyle[0].marginBottom}</strong>

                  <Radio.Group onChange={onLowChange} value={formDataStyle[0].marginBottom} style={{ margin: '20px' }}>
                    <Radio.Button value="0px">小间距</Radio.Button>
                    <Radio.Button value="15px">中间距</Radio.Button>
                    <Radio.Button value="30px">大间距</Radio.Button>
                  </Radio.Group>
                </div>
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>


    </div >
  )
};
export default connect(({ carowner_pageManage }) => ({
  putItem: carowner_pageManage.putItem,
  listSelect: carowner_pageManage.listSelect,
}))(contentType2)
