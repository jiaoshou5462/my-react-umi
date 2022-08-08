import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import style from './style.less';
import { Form, Input, Table, Select, Row, message, Button, Col, Space, DatePicker, ConfigProvider, Pagination } from "antd";
import { ListTitle, ListTable} from "@/components/commonComp/index";
  const { Column } = Table;
import { QueryFilter} from '@ant-design/pro-form';
import zh_CN from 'antd/lib/locale-provider/zh_CN'
const Template = (props) => {
  const { dispatch } = props;
  let [form] = Form.useForm();
  let [list, setList] = useState([])
  let [payload, setPayload] = useState({
    pageNo: 1,
    pageSize: 10
  })
  let [pageInfo, setPageInfo] = useState({})


  // 获取所属渠道
  useEffect(() => {
    findListByCondition()
  }, [payload])

  // 重置
  let resetForm = () => {
    form.resetFields();
    setPayload({
      pageNo: 1,
      pageSize : 10
    })
  }

  let submitData = (value) => {
    let param = JSON.parse(JSON.stringify(value))
    param.pageNo = 1
    param.pageSize = 10
    setPayload(param)
  }

  let syncTemplateFromRemoteService = ()=>{
    dispatch({
      type: 'templateMessageNew/syncTemplateFromRemoteService',
      payload: {
        method: 'post'
      },
      callback: res => {
        console.log(res, "res")
        if (res.result.code == '0') {
          message.success(res.result.message)
          resetForm()
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  //显示总条数和页数
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageInfo.pageSize)
    return `共${total}条记录 第 ${pageInfo.pageNo} / ${totalPage}  页`
  }
  //改变每页条数
  let onSizeChange = (page, pageSize) => {
    let param = JSON.parse(JSON.stringify(payload))
    param.pageNo = pageInfo.pageNo
    param.pageSize = pageSize
    setPayload(param)
    onPageTotal()
  }
  //点击下一页上一页*
  let onNextChange = (pageNo, pageSize) => {
    let param = JSON.parse(JSON.stringify(payload))
    param.pageNo = pageNo
    param.pageSize = pageSize
    setPayload(param)
  }

  // 确认删除事件
  let findListByCondition = (param) => {
    dispatch({
      type: 'templateMessageNew/queryTemplateWechart',
      payload: {
        method: 'postJSON',
        params: {
          ...payload,
        }
      },
      callback: res => {
        console.log(res, "res")
        if (res.result.code == '0') {
          setList(res.body.list)
          setPageInfo({
            pageNo: res.body.pageNum,
            pageSize: res.body.pageSize,
            total: res.body.total
          })
        } else {
          message.error(res.result.message)
        }
      }
    })

  }

  return (
    <>
      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={submitData} onReset={resetForm}>
          <Form.Item label="模板标题" name="title" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="模板类型" name="templateType" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="请输入">
              <Option value="">全部</Option>
              <Option value="1">公众号模板</Option>
              <Option value="2">订阅号模板</Option>
            </Select>
          </Form.Item>
        </QueryFilter>
      </div>
      <div className={style.list_box}>
        {/* 表格标题 功能按钮 */}
        <ListTitle titleName="模板列表">
          <Space size={8}>
            <Button type='primary' onClick={syncTemplateFromRemoteService}>同步</Button>
          </Space>
        </ListTitle>
        <ListTable showPagination current={pageInfo.pageNo} pageSize={pageInfo.pageSize} total={pageInfo.total}
        onChange={onNextChange} 
        >
          <Table dataSource={list} scroll={{x:1000}} pagination={false}>
            <Column title="公众号" dataIndex="appName" key="appName" />
            <Column title="模版类型" dataIndex="templateType" key="templateType" />
            <Column title="模板ID" dataIndex="templateId" key="templateId" />
            <Column title="标题" dataIndex="title" key="title" />
          </Table>
        </ListTable>
      </div>
    </>
  )
}
export default connect(({ templateMessageNew }) => ({
}))(Template);