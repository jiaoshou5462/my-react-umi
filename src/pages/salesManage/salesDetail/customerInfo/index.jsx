import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Table, Select, Row, Col, Space, Button, DatePicker, Pagination, Tag, Tooltip, message } from "antd";
import style from "./style.less";
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 客户信息
const customerInfo = (props) => {
  let { dispatch, relationUserId, saleInfo, rowsCustomerList,
    rowsCustomerTotal, tagCountList, pageType } = props;
  let [form] = Form.useForm();

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [payload, setPayload] = useState({});

  const [tagIdArr, setTagIdArr] = useState([]);
  const [tagIdStr, setTagStr] = useState('');//标签id

  useEffect(() => {
    getCrmCustomerTagCountList()
  }, [])

  useEffect(() => {
    getCrmCustomerListInfoFrist()
  }, [current, pageSize, payload])


  //获取客户列表信息
  const getCrmCustomerListInfoFrist = (tagId, isActive, index) => {
    let newPayload = JSON.parse(JSON.stringify(payload));
    //	创建日期
    if (newPayload.createTime) {
      newPayload.createStartTime = moment(newPayload.createTime[0]).format('YYYY-MM-DD');
      newPayload.createEndTime = moment(newPayload.createTime[1]).format('YYYY-MM-DD');
    }
    //最近一次活跃日期
    if (newPayload.lastActiveTime) {
      newPayload.lastActiveStartTime = moment(newPayload.lastActiveTime[0]).format('YYYY-MM-DD')
      newPayload.lastActiveEndTime = moment(newPayload.lastActiveTime[1]).format('YYYY-MM-DD')
    }
    //标签激活日期
    if (newPayload.addRelationTime) {
      newPayload.addRelationTimeStart = moment(newPayload.addRelationTime[0]).format('YYYY-MM-DD')
      newPayload.addRelationTimeEnd = moment(newPayload.addRelationTime[1]).format('YYYY-MM-DD')
    }
    // 删除from携带的时间名
    let delNewPayload = (newPayload, keys) => {
      keys.map((key) => {
        delete newPayload[key]
      })
      return newPayload;
    }
    newPayload = delNewPayload(newPayload, ['createTime', 'lastActiveTime', 'addRelationTime']);
    dispatch({
      type: 'salesManageModel/getCrmCustomerListInfo',
      payload: {
        method: 'get',
        params: {
          pageNo: current,
          pageSize: pageSize,
          userId: relationUserId,//销售ID179638
          tagIds: tagIdStr,
          ...newPayload
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          // 处理列表标签样式
          let rows = res.body.crmCustomerListInfoReps || [];
          rows.forEach(listItem => {
            if (listItem.customerTage) {
              listItem.customerTage.forEach(item => {
                item.tagListChange = {}
                let styleData = item.tagStyle.split(';');
                styleData.forEach((element, index) => {
                  if (index != styleData.length - 1) {
                    item.tagListChange[element.split(':')[0]] = element.split(':')[1]
                    item.tagListChange['margin-bottom'] = '10px'
                  }
                })
              })
            }
          })
          dispatch({
            type: 'salesManageModel/setCrmCustomerListInfo',
            payload: {
              rows: rows,
              total: res.body.pageInfo.totalCount
            }
          })
        } else {
          message.error(res.result.message)
        }
      }
    })
  }


  // 客户列表查询标签统计
  const getCrmCustomerTagCountList = () => {
    dispatch({
      type: 'salesManageModel/getCrmCustomerTagCountList',
      payload: {
        method: 'get',
        params: {}
      },
      callback: (res) => {
        if (res.result.code === '0') {
          res.body.forEach(item => {
            item.isActive = false
          })
        } else {
          message.error(res.result.message)
        }
      }
    });
  }
  // 点击标签
  let handelTag = (tagId, isActive, index) => {
    getCrmCustomerListInfo(tagId, isActive, index)
  }

  //获取客户列表信息
  const getCrmCustomerListInfo = (tagId, isActive, index) => {
    let newPayload = JSON.parse(JSON.stringify(payload));
    //	创建日期
    if (newPayload.createTime) {
      newPayload.createStartTime = moment(newPayload.createTime[0]).format('YYYY-MM-DD');
      newPayload.createEndTime = moment(newPayload.createTime[1]).format('YYYY-MM-DD');
    }
    //最近一次活跃日期
    if (newPayload.lastActiveTime) {
      newPayload.lastActiveStartTime = moment(newPayload.lastActiveTime[0]).format('YYYY-MM-DD')
      newPayload.lastActiveEndTime = moment(newPayload.lastActiveTime[1]).format('YYYY-MM-DD')
    }
    //标签激活日期
    if (newPayload.addRelationTime) {
      newPayload.addRelationTimeStart = moment(newPayload.addRelationTime[0]).format('YYYY-MM-DD')
      newPayload.addRelationTimeEnd = moment(newPayload.addRelationTime[1]).format('YYYY-MM-DD')
    }
    // 删除from携带的时间名
    let delNewPayload = (newPayload, keys) => {
      keys.map((key) => {
        delete newPayload[key]
      })
      return newPayload;
    }
    newPayload = delNewPayload(newPayload, ['createTime', 'lastActiveTime', 'addRelationTime']);

    // 处理标签点亮，取消数据
    const idx = tagIdArr.findIndex(item => item === tagId);
    if (idx === -1) {
      tagIdArr.push(tagId)
    } else {
      tagIdArr.splice(idx, 1)
    }
    let tagIdStr = tagIdArr.toString();
    setTagStr(tagIdStr);

    dispatch({
      type: 'salesManageModel/getCrmCustomerListInfo',
      payload: {
        method: 'get',
        params: {
          pageNo: current,
          pageSize: pageSize,
          userId: relationUserId,//销售ID179638
          tagIds: tagIdStr,
          ...newPayload
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let dataList = JSON.parse(JSON.stringify(tagCountList))
          dataList[index].isActive = isActive;
          dispatch({
            type: 'salesManageModel/setCrmCustomerTagCountList',
            payload: dataList
          })

          // 处理列表标签样式
          let rows = res.body.crmCustomerListInfoReps || [];
          rows.forEach(listItem => {
            if (listItem.customerTage) {
              listItem.customerTage.forEach(item => {
                item.tagListChange = {}
                let styleData = item.tagStyle.split(';');
                styleData.forEach((element, index) => {
                  if (index != styleData.length - 1) {
                    item.tagListChange[element.split(':')[0]] = element.split(':')[1]
                    item.tagListChange['margin-bottom'] = '10px'
                  }
                })
              })
            }
          })
          dispatch({
            type: 'salesManageModel/setCrmCustomerListInfo',
            payload: {
              rows: rows,
              total: res.body.total
            }
          })
        } else {
          message.error(res.result.message)
        }
      }
    });
  }


  // 详情
  const customerNameDetail = (text, all) => {
    let detail = () => {
      history.push({
        pathname: pageType === 'team' ? '/teamManage/list/smallDetail' : '/salesManage/list/detail/smallDetail',//客户详情
        query: {
          customerId: all.customerId,
          saleInfo: saleInfo,
          isReadOnly: 'readOnly'

        }
      })
    }
    return <a onClick={detail}>{text}</a>
  }

  const columns = [{
      title: '客户姓名',
      dataIndex: 'customerName',
      width: 130,
      fixed: 'left',
      render: (text, all) => customerNameDetail(text, all)
    }, {
      title: '客户标签',
      width: 200,
      dataIndex: 'customerTage',
      render: (customerTage, all) => (
        <>
          <Tooltip placement="top" title={
            customerTage && customerTage.map((item, index) => {
              return (
                <Tag className={style.tag} key={index} style={item.tagListChange}>
                  {item.tagAlias}
                </Tag>
              );
            })}
          >
            {
              customerTage && customerTage.map((item, index) => {
                return (
                  index < 3 ?
                    <Tag style={{ cursor: 'pointer' }} key={index} style={item.tagListChange}>
                      {item.tagAlias}
                    </Tag>
                    : null
                );
              })
            }
          </Tooltip>
        </>
      ),
    }, {
      title: '联系方式',
      width: 130,
      dataIndex: 'customerPhone'
    }, {
      title: '联系地址',
      width: 130,
      dataIndex: 'customerAddress'
    }, {
      title: '生日',
      width: 130,
      dataIndex: 'customerBirthday'
    }, {
      title: '身份证号',
      width: 200,
      dataIndex: 'customerIdentityNo'
    }, {
      title: '车牌号',
      width: 250,
      dataIndex: 'customerPlateNo',
      render: (customerPlateNo) => {
        if(customerPlateNo.length > 0 ) {
          return <div>
            {
              customerPlateNo.map(item => {
                return <span>{item}；</span>
              })
            }
          </div>
        }
      }
    }, {
      title: '创建时间',
      width: 200,
      dataIndex: 'createTime'
    }, {
      title: '最近一次活跃时间',
      width: 200,
      dataIndex: 'behaviorTime'
    }]

  //表单提交
  const searchBtn = (val) => {
    setCurrent(1);
    setTagStr(tagIdStr);
    setPayload(JSON.parse(JSON.stringify(val)))
  }

  //表单重置
  const resetBtnEvent = () => {
    form.resetFields();
    setPayload({})
  }

  //分页切换
  const handleTableChange = (val) => {
    setCurrent(val.current)
    setPageSize(val.pageSize)
    setTagStr(tagIdStr);
  }
  return (
    <>
      <div className={style.customerInfoPage}>
        <Form className={style.form} form={form} onFinish={searchBtn}>
          <Row>
            <Col span={8}>
              <Form.Item className={style.form__item} label="客户名称：" name="customerName" labelCol={{ flex: '0 0 120px' }}>
                <Input placeholder="请输入"></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item className={style.form__item} label="联系方式：" name="customerPhone" labelCol={{ flex: '0 0 120px' }}>
                <Input placeholder="请输入"></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item className={style.form__item} label="车牌号：" name="plateNo" labelCol={{ flex: '0 0 120px' }}>
                <Input placeholder="请输入"></Input>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <Form.Item className={style.form__item} label="身份证号：" name="identityNo" labelCol={{ flex: '0 0 120px' }}>
                <Input placeholder="请输入"></Input>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item className={style.form__item} label="创建日期：" name='createTime' labelCol={{ flex: '0 0 120px' }}>
                <RangePicker style={{ width: '100%' }} placeholder={['开始时间', '结束时间']} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item className={style.form__item} label="最近一次活跃：" name='lastActiveTime' labelCol={{ flex: '0 0 120px' }}>
                <RangePicker style={{ width: '100%' }} placeholder={['开始时间', '结束时间']} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item className={style.form__item} label="标签激活日期：" name='addRelationTime' labelCol={{ flex: '0 0 120px' }}>
                <RangePicker style={{ width: '100%' }} placeholder={['开始时间', '结束时间']} />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end" align="center">
            <Space size={22}>
              <Button htmlType="button" onClick={resetBtnEvent}>重置</Button>
              <Button htmlType="submit" type="primary">查询</Button>
            </Space>
          </Row>
        </Form>

        <div className={style.interspace}></div>

        <div className={style.tableData}>
          <div className={style.tableData_title}>客户标签：</div>
          <Space size='middle' style={{ padding: '30px' }}>
            {
              tagCountList && tagCountList.map((item, index) => {
                return <div>
                  {
                    !item.isActive ?
                      <div className={style.box} onClick={() => { handelTag(item.tagId, !item.isActive, index) }}>{item.tagAlias}</div>
                      :
                      <div className={style.activeBox} onClick={() => { handelTag(item.tagId, !item.isActive, index) }}>{item.tagAlias}</div>
                  }
                </div>
              })
            }
          </Space>
        </div>

        <div className={style.interspace}></div>

        <div className={style.tableData}>
          <div className={style.tableData_title}>
            结果列表
          </div>
          <Table
            columns={columns}
            dataSource={rowsCustomerList}
            onChange={handleTableChange}
            scroll={{ x: 600 }}
            pagination={{
              current: current,
              pageSize: pageSize,
              total: rowsCustomerTotal,
              showTotal: (total) => {
                let totalPage = Math.ceil(total / pageSize);
                return `共${total}条记录 第 ${current} / ${totalPage}  页`
              }
            }}
          >
          </Table>
        </div>
      </div>
    </>
  )
}

export default connect(({ salesManageModel }) => ({
  rowsCustomerList: salesManageModel.rowsCustomerList,
  rowsCustomerTotal: salesManageModel.rowsCustomerTotal,
  tagCountList: salesManageModel.tagCountList,//
}))(customerInfo)
