import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Tag, Row, Form, Space, Radio, DatePicker, Modal, Input, Table, Select, Button, Pagination, ConfigProvider, message, Badge, Menu, Dropdown, Alert } from "antd"
import style from "./style.less";
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
const { Option } = Select;
const { RangePicker } = DatePicker

//账单页面
const grantListPage = (props) => {
  let { dispatch, isRadioTabs, channelList, categoryList, grantList, totalCount } = props;
  let [form] = Form.useForm();
  let [cardNo, setCardNo] = useState('');//选中的批次号
  // 删除弹框
  const [isDelVisible, setIsDelVisible] = useState(false);

  let [payload, setPayload] = useState({
    pageInfo: {
      pageNo: 1,
      pageSize: 10
    },
    channelId: '',//渠道id
    grantBatchId: '',//批次号
    grantDate: '',//发放时间
    skuCardName: '',//卡券名称
    skuCardCategory: '',//卡券品类
  })
  useEffect(() => {
    selectChannel()
    selectcategory()
  }, [])

  useEffect(() => {
    listGrant()
  }, [payload])
  //渠道下拉
  let selectChannel = () => {
    dispatch({
      type: 'cardgrantManageModel/selectChannel',
      payload: {
        method: 'postJSON',
        params: {}
      }
    })
  }
  //品类下拉
  let selectcategory = () => {
    dispatch({
      type: 'cardgrantManageModel/categorySelect',
      payload: {
        method: 'postJSON',
        params: {
          pageNum: 1,
          pageSize: 99999999,
          channelNo: ''//客户编号
        }
      }
    })
  }
  let listGrant = () => {
    dispatch({
      type: 'cardgrantManageModel/listGrant',//列表
      payload: {
        method: 'postJSON',
        params: payload
      }
    })
  }
  // 点击编辑
  let handelEdit = () => {
    // history.push({
    //   pathname: '/cardgrantManage/grantList/newDistribution',//跳转编辑页
    // })
  }
  // 保存编辑结果
  let updGrant = () => {
    // dispatch({
    //   type: 'cardgrantManageModel/updGrant',//编辑
    //   payload: {
    //     method: 'postJSON',
    //     params: payload
    //   }
    // })
  }

  // 确认删除
  let delGrant = () => {
    dispatch({
      type: 'cardgrantManageModel/delGrant',//删除
      payload: {
        method: 'postJSON',
        params: {
          grantBatchId: cardNo
        }
      }
    })
  }



  let grantDetail = (text, all) => {
    let goToDetail = () => {
      localStorage.setItem('grant_list_item', JSON.stringify(all));
      history.push({
        pathname: '/cardgrantManage/grantList/grantDetail'
      })

    }
    return <a onClick={goToDetail}>{text}</a>
  }
  // 发放类型1：活动 2：直投
  let grantTypeName = (text, all) => {
    return <>
      {
        text == 1 ? <span>活动</span>
          : text == 2 ? <span>直投</span>
            : ''
      }
    </>
  }
  //卡卷领取方式 1：全部发放 2：用户自选
  let cardReceiveTypeName = (text, all) => {
    return <>
      {
        text == 1 ? <span>全部发放</span>
          :
          text == 2 ? <span>用户自选</span>
            : ''
      }
    </>
  }
  const columns = [
    {
      title: '发放批次',
      dataIndex: 'grantBatchId',
      key: 'grantBatchId',
      render: (text, all) => grantDetail(text, all)
    },
    { title: '渠道', dataIndex: 'channelName', key: 'channelName' },
    {
      title: '发放类型',
      dataIndex: 'grantType',
      key: 'grantType',
      render: (text, all) => grantTypeName(text, all)
    },
    { title: '发放名称', dataIndex: 'grantName', key: 'grantName' },
    { title: '发放人群', dataIndex: 'grantGroup', key: 'grantGroup' },
    { title: '发放时间', dataIndex: 'grantDate', key: 'grantDate' },
    { title: '发放人数', dataIndex: 'grantNum', key: 'grantNum' },
    { title: '发放成功人数', dataIndex: 'grantSuccessNum', key: 'grantSuccessNum' },
    { title: '发放失败人数', dataIndex: 'grantFailNum', key: 'grantFailNum' },
    { title: '领取人数', dataIndex: 'getpeople', key: 'getpeople' },
    { title: '使用人数', dataIndex: 'usepeople', key: 'usepeople' },
    {
      title: '卡券领取方式',
      key: 'cardReceiveType',
      dataIndex: 'cardReceiveType',
      render: (text, all) => cardReceiveTypeName(text, all)
    },
    {
      title: '状态',
      key: 'status',
      render: (text, all) => (
        <>
          {
            all.status == 1 ?
              <span><Badge status="error" />未发放</span> // 状态1：未发放 2：发放中 3：已发放
              :
              all.status == 2 ?
                <span><Badge status="warning" />发放中</span>
                :
                <span><Badge status="success" />已发放</span>
          }
        </>
      )
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, all) => operation(text, all)
    },
  ];
  // 操作
  let operation = (text, all) => {

    // 点击删除
    let handelDel = () => {
      setIsDelVisible(true);
      setCardNo(text.grantBatchId)
    }
    return <>
      <Space size="middle">
        {all.status == 1 ?
          <div>
            <Space size="middle"><a onClick={handelEdit}>编辑</a><a onClick={handelDel}>删除</a></Space>
          </div>
          :
          all.status == 3 ?
            <div style={{color:'#1890ff'}} onClick={() => { releaseRecord(text, all) }}>发放记录</div>
            :
            '--'
        }
      </Space>
    </>
  }


  /*3查询按钮*/
  let searchBtn = (values) => {
    console.log(values, 'values')

    // 判断是否存在（时间）
    if (values.grantDate) {
      grantBatchDetailVOList[0].effectStartDate = values.grantDate[0].format('YYYY-MM-DD HH:mm:ss');
      grantBatchDetailVOList[0].effectEndDate = values.grantDate[1].format('YYYY-MM-DD HH:mm:ss');
    }
    let data = {
      pageInfo: {
        pageNo: 1,
        pageSize: 10
      },
      channelId: values.channelId,//渠道id
      grantBatchId: values.grantBatchId,//批次号
      grantDate: values.grantDate,//发放时间
      skuCardName: values.skuCardName,//卡券名称
      skuCardCategory: values.skuCardCategory,//卡券品类
    }
    setPayload(data);
  }

  /*4重置*/
  let resetBtnEvent = () => {
    form.resetFields();//重置
    let data = {
      pageInfo: {
        pageNo: 1,
        pageSize: 10
      },
      channelId: '',//渠道id
      grantBatchId: '',//批次号
      grantDate: '',//发放时间
      skuCardName: '',//卡券名称
      skuCardCategory: '',//卡券品类
    }
    setPayload(data)
  }

  let money = 100;
  let allMoney = 5600;
  let cenMoney = 800;
  // 新增发放
  let newDistribution = () => {
    history.push({
      pathname: '/cardgrantManage/grantList/newDistribution',
      // query: {
      //   billId: all.billId,//账单id
      //   recordDetail: 'view'
      // }
    })
  }
  let changeTabs = (e) => {
    // console.log(e.target.value, 'e.target.value')
    dispatch({
      type: 'cardgrantManageModel/setRadioTabs',//tabs切换
      payload: e.target.value
    })
  }
  /*点击下一页上一页(参数是改变后的页码及每页条数)*/
  let onNextChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageInfo.pageNo = page
    this_payload.pageInfo.pageSize = pageSize
    setPayload(this_payload)

  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageInfo.pageNo = page
    this_payload.pageInfo.pageSize = pageSize
    setPayload(this_payload)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / payload.pageInfo.pageSize)
    return `共${total}条记录 第 ${payload.pageInfo.pageNo} / ${totalPage}  页`
  }

  return (
    <>
      <div className={style.block__cont}>
        <Form className={style.form__cont} form={form} onFinish={searchBtn}>
          <Row justify="space-around" align="center" style={{ marginBottom: '50px' }}>
            <Radio.Group defaultValue={isRadioTabs} buttonStyle="solid" onChange={changeTabs}>
              <Radio.Button style={{ width: '200px', height: '36px', textAlign: 'center' }} value={1}>批次发放</Radio.Button>
              <Radio.Button style={{ width: '200px', height: '36px', textAlign: 'center' }} value={isRadioTabs}>规则发放</Radio.Button>
            </Radio.Group>
          </Row>
          <Row justify="space-around" align="center">
            <Form.Item label="渠道：" name="channelId" className={style.form__item} labelCol={{ span: 8 }}>
              <Select
                placeholder="不限"
                showSearch
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {
                  channelList.map((v) => <Option key={v.id} value={v.id}>{v.codeDesc}</Option>)
                }
              </Select>
            </Form.Item>
            <Form.Item label="发放批次：" name="grantBatchId" className={style.form__item} labelCol={{ span: 8 }}>
              <Input placeholder="请输入"></Input>
            </Form.Item>
            <Form.Item label="发放时间：" name="grantDate" className={style.form__item} labelCol={{ span: 8 }}>
              <RangePicker placeholder={['开始时间', '结束时间']} />
            </Form.Item>
          </Row>
          <Row justify="space-around" align="center">
            <Form.Item label="卡券名称：" name="skuCardName" className={style.form__item} labelCol={{ span: 8 }}>
              <Input placeholder="请输入" ></Input>
            </Form.Item>

            <Form.Item label="卡券品类：" name="skuCardCategory" className={style.form__item} labelCol={{ span: 8 }}>
              <Select placeholder="不限" allowClear>
                {
                  categoryList.map((v) => <Option key={v.id} value={v.id}>{v.categoryName}</Option>)
                }
              </Select>
            </Form.Item>
            <Form.Item className={style.form__item} labelCol={{ span: 8 }}>
            </Form.Item>
          </Row>
          <Row justify="space-around" align="center">
            <Space size={22}>
              <Button htmlType="submit" type="primary">查询</Button>
              <Button htmlType="button" onClick={resetBtnEvent}>重置</Button>
            </Space>
          </Row>
        </Form>
      </div>
      <div className={style.block__cont__t}>
        <div className={style.listTitle}>
          <span style={{ padding: '30px 20px' }}>发放列表</span>
          <div className={style.btns}>
            {/* <Button style={{ margin: '10px' }} htmlType="button" type="primary">批次发放</Button>
            <Button style={{ margin: '10px' }} htmlType="button">规则发放</Button> */}
            <Button style={{ margin: '10px' }} htmlType="button" type="primary" onClick={newDistribution}>新增直投发放</Button>
          </div>
        </div>
        <Alert style={{ marginBottom: '30px' }} message={'当前周期投放额度：' + money + '/' + allMoney + '元（其中' + cenMoney + '元为待投放状态）'} type="info" showIcon />

        <Table scroll={{ x: 1000 }} columns={columns} dataSource={grantList} pagination={false}></Table>
        <Pagination
          className={style.pagination}
          current={payload.pageInfo.pageNo} //选中第一页
          pageSize={payload.pageInfo.pageSize} //默认每页展示10条数据
          total={totalCount} //总数
          onChange={onNextChange} //切换 页码时触发事件
          pageSizeOptions={['10', '20', '30', '60']}
          onShowSizeChange={onSizeChange}
          showTotal={onPageTotal}
        />
      </div>
      {/* 删除弹框 */}
      <Modal title="删除" visible={isDelVisible} onOk={delGrant} onCancel={() => { setIsDelVisible(false) }}>
        <p>确认要移除这张卡券吗？</p>
      </Modal>
    </>
  )
}


export default connect(({ cardgrantManageModel }) => ({
  isRadioTabs: cardgrantManageModel.isRadioTabs,//tabs切换
  channelList: cardgrantManageModel.channelList,//命名空间名.变量
  categoryList: cardgrantManageModel.categoryList,//命名空间名.变量
  grantList: cardgrantManageModel.grantList,
  totalCount: cardgrantManageModel.totalCount
}))(grantListPage)







