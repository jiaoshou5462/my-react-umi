import React,{useEffect, useState} from "react"
import { connect, history } from 'umi'
import { Row, Col,Form, Modal,  Select, Input, Radio, DatePicker, Button, Table, ConfigProvider, Space, Pagination , Tabs, Image,Checkbox, message  } from "antd"
import style from "./style.less"
import moment from 'moment';
import 'moment/locale/zh-cn';
import zh_CN from 'antd/lib/locale-provider/zh_CN'
const { RangePicker } = DatePicker;
moment.locale('zh-cn');
const { confirm } = Modal
const { TabPane } = Tabs;
const posterChange =(props)=>{
  let {dispatch,modalInfo,toFatherValue,getValue ,channelType } = props,
  [form] = Form.useForm()
  const [list,setList] = useState([])//海报列表
  const [toFatherList,setToFatherList] = useState([])//传递给父组件的海报id、name 、url
  const [categoryPoster,setCategoryPoster] = useState([])//海报分类
  const [pageInfo, setPageInfo] = useState({})//分页器
  const [activeKey, setActiveKey] = useState('1')//tab
  const [payload, setPayload] = useState({
    orderType:1,
    posterTitle:'',
    posterCategoryId:''
  })//搜索条件字段
  //搜索条件
  useEffect(() => {
    if(channelType == 'getCode'){
      findPosterCategoryNew()
    }else if (channelType == 'product'){
      findPosterForNewsCategory()
    }else{
      findPosterCategory()
    }
  },[])

  //列表
  useEffect(() => {
    // 选择海报页面不通用 所以加了modalInfo里面的判断
    if(channelType == 'getCode'){
      posterListForQrGuide()
    }else if (channelType == 'product'){
      posterListForNews()
    }else{
      posterList()
    }
  },[payload])

  //海报下拉框分类
  let posterList = () =>{
    dispatch({
      type: 'informationManager/posterList',
        payload: {
          method:'postJSON',
          params:payload
        },
        callback: res => {
          if(res.result.code == '0'){
            setList(res.body.data)
            setPageInfo(res.body.pageInfo)
          }
        }
    })
  }

   //海报下拉框分类
   let posterListForQrGuide = () =>{
    dispatch({
      type: 'informationManager/posterListForQrGuide',
        payload: {
          method:'postJSON',
          params:payload
        },
        callback: res => {
          if(res.result.code == '0'){
            setList(res.body.data)
            setPageInfo(res.body.pageInfo)
          }
        }
    })
  }


  //海报下拉框分类
  let findPosterForNewsCategory = () =>{
    dispatch({
      type: 'informationManager/findPosterForNewsCategory',
        payload: {
          method:'post'
        },
        callback: res => {
          if(res.result.code == '0'){
            setCategoryPoster(res.body.data)
          }
        }
      })
  }

  //海报列表分类
  let posterListForNews = () =>{
    dispatch({
      type: 'informationManager/posterListForNews',
        payload: {
          method:'postJSON',
          params:payload
        },
        callback: res => {
          if(res.result.code == '0'){
            setList(res.body.data)
            setPageInfo(res.body.pageInfo)
          }
        }
    })
  }

  //海报下拉框分类
  let findPosterCategory = () =>{
    dispatch({
      type: 'informationManager/findPosterCategory',
        payload: {
          method:'post'
        },
        callback: res => {
          if(res.result.code == '0'){
            setCategoryPoster(res.body.data)
          }
        }
      })
  }

   //海报下拉框分类
   let findPosterCategoryNew = () =>{
    dispatch({
      type: 'informationManager/findPosterCategoryNew',
        payload: {
          method:'post'
        },
        callback: res => {
          if(res.result.code == '0'){
            setCategoryPoster(res.body.data)
          }
        }
      })
  }

  //添加提交
  let submitEvent = (value) => {
   setPayload(value)
  }

   //保存海报
  let savePosterValue = () =>{
    if(toFatherList.length>0){
      let list = {
        name:toFatherList[0].posterTitle,
        url:toFatherList[0].posterUrl,
        id:toFatherList[0].objectId
      }
      getValue(list)
      toFatherValue()
    }
  }

  //显示总条数和页数
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageInfo.pageSize)
    return `共${total}条记录 第 ${pageInfo.pageNo} / ${totalPage}  页`
  }
  //改变每页条数
  let onSizeChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = this_payload.pageNo
    this_payload.pageSize = pageSize
    setPayload(this_payload)
    onPageTotal()
  }
  //点击下一页上一页*
  let onNextChange = (pageNum, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = pageNum
    this_payload.pageSize = pageSize
    setPayload(this_payload)
  }

  // tab页面切换
  let changeActiveKey = (activeKey) =>{
    let params = JSON.parse(JSON.stringify(payload))
    params.orderType = activeKey
    setPayload(params)
    setActiveKey(activeKey)
  }
  let onCheckChange = (item)=>{
    //永远获取最后一个
    setToFatherList(item.splice(item.length-1,1));
  }
  //重置
  let resetQuearch = ()=>{
    form.resetFields();
    setPayload({
      pageNum:1,
      pageSize:10
    })
  }
  return(
    <>
      <Modal width={1200} title={'宣传海报'} visible={modalInfo.modalName=='changePost'}
        footer={null} onCancel={()=>{toFatherValue()}}
        >
          <Form form={form} onFinish={submitEvent} className={style.form}>
            <Row >
              <Col span={8}>
                <Form.Item label="海报标题" name="posterTitle" labelCol={{flex:'0 0 120px'}}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="海报分类" name="posterCategoryId" labelCol={{flex:'0 0 120px'}}>
                  <Select
                    showSearch
                    notFoundContent='暂无数据'
                    placeholder="请输入"
                    optionFilterProp="children"
                    >
                    {
                      categoryPoster && categoryPoster.length ?
                      categoryPoster.map((item, key) => {
                          return <Option key={key} value={item.objectId}>{item.categoryName}</Option>
                        }): ''
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end" >
              <Space size={22}>
                <Button htmlType="submit" type="primary">查询</Button>
                <Button htmlType="button" type="button" onClick={resetQuearch}>重置</Button>
              </Space>
            </Row>
          </Form>
          <div className={style.tableData}>
            <Tabs type="card" size='small' activeKey={activeKey} onChange={(activeKey)=>{changeActiveKey(activeKey)}}>
              <TabPane tab="最新上传" key={1} >
                <div >
                  <Checkbox.Group style={{ width: '100%' }} value={toFatherList} onChange={onCheckChange} className={style.imageData}>
                    {list && list.length ?list.map((item, key)=>{
                    return  <div className={style.image_item}>
                                <img src={item.posterUrl} width='200px' height='200px'/><br/>
                                <Checkbox value={item} className={style.checkBox} ></Checkbox>已使用{item.useCount}次
                                <div className={style.image_box}>
                                  {item.posterTitle}
                                </div>
                            </div>
                          }):''}
                  </Checkbox.Group>
                  <ConfigProvider locale={zh_CN}>
                    <Pagination
                      className={style.pagination}
                      showTitle={false}
                      current={pageInfo.pageNo}
                      defaultPageSize={pageInfo.pageSize}
                      total={pageInfo.totalCount}
                      onChange={onNextChange}
                      showSizeChanger
                      pageSizeOptions={['10', '20', '30', '60']}
                      onShowSizeChange={onSizeChange}
                      showTotal={onPageTotal}
                    />
                  </ConfigProvider>

                </div>
              </TabPane>
              <TabPane tab="热门下载" key={2} >
              <div >
                  <Checkbox.Group style={{ width: '100%' }} value={toFatherList} onChange={onCheckChange} className={style.imageData}>
                    {list && list.length ?list.map((item, key)=>{
                    return  <div className={style.image_item}>
                                <img src={item.posterUrl} width='200px' height='200px'/><br/>
                                <Checkbox value={item} className={style.checkBox} ></Checkbox>已使用{item.useCount}次
                                <div className={style.image_box}>
                                  {item.posterTitle}
                                </div>
                            </div>
                          }):''}
                  </Checkbox.Group>
                  <ConfigProvider locale={zh_CN}>
                    <Pagination
                      className={style.pagination}
                      showTitle={false}
                      current={pageInfo.pageNum}
                      defaultPageSize={pageInfo.pageSize}
                      total={pageInfo.totalCount}
                      onChange={onNextChange}
                      showSizeChanger
                      pageSizeOptions={['10', '20', '30', '60']}
                      onShowSizeChange={onSizeChange}
                      showTotal={onPageTotal}
                    />
                  </ConfigProvider>

                </div>
              </TabPane>
            </Tabs>
            <div className={style.footerDev}>
              <Space size={22} >
                <Button htmlType="button" type="primary" onClick={savePosterValue}>保存</Button>
                <Button htmlType="button" onClick={()=>{toFatherValue()}}>关闭</Button>
              </Space>
            </div>
        </div>
      </Modal>

    </>
  )
};
export default connect(({informationManager})=>({

}))(posterChange)


