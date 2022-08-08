import React, { useEffect, useState, } from "react"
import { connect, history } from 'umi'
import {
  Row,
  Col,
  Form,
  Radio,
  Input,
  Table,
  Modal,
  Button,
  Select,
  Space,
  Progress,
  InputNumber
} from "antd"
import { PlusOutlined } from '@ant-design/icons'

import style from "./style.less";
import { QueryFilter } from '@ant-design/pro-form';
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";
const { Column } = Table;
const { Option } = Select
const { TextArea } = Input
let laveData = [{
  id: 1,
  num: 20,
  percent: 0,
  totalNum: 150,
  title: '青铜'
}, {
  id: 2,
  num: 20,
  percent: 0,
  totalNum: 150,
  title: '白银'
}, {
  id: 3,
  num: 20,
  percent: 0,
  totalNum: 150,
  title: '黄金'
}, {
  id: 4,
  num: 20,
  percent: 0,
  totalNum: 150,
  title: '铂金'
}, {
  id: 5,
  num: 20,
  percent: 0,
  totalNum: 150,
  title: '钻石'
},]
let colorList = [
  ['#B37FEB'],
  ['#F759AB'],
  ['#FF4D4F'],
  ['#FF7A45'],
  ['#FADB14'],
  ['#7CB305'],
  ['#73D13D'],
  ['#36CFC9'],
  ['#40A9FF'],
  ['#597EF7'],
]
let statusArr = [{
  id: 0,
  title: '全部'
}, {
  id: 1,
  title: '启用'
}, {
  id: 2,
  title: '停用'
},]
let cycleArr = [{
  id: 0,
  title: '全部'
}, {
  id: 1,
  title: '每日'
}, {
  id: 2,
  title: '每周'
}, {
  id: 3,
  title: '每月'
}, {
  id: 4,
  title: '一次性'
},]
let growthSystemHomePage = (props) => {
  let { dispatch, list } = props
  let [form] = Form.useForm()
  let [taskIndex, setTaskIndex] = useState('1')
  let [laveList, setLaveList] = useState([])

  useEffect(() => {
    let colorIndex = 0
    laveData.map((item, index) => {
      let temp = item.num / item.totalNum
      let tempNum = temp.toFixed(4)
      item.percent = tempNum * 100
      if (colorIndex === colorList.length) {
        colorIndex = 0
      }
      item.color = colorList[colorIndex]
      colorIndex++
    })
    setLaveList(laveData)
    form.setFieldsValue({
      cycle: 0,
      status: 0
    })
  }, [])
  
  let goToAdd = () => {

  }
  let onTaskChange = (e) => {
    setTaskIndex(e.target.value)
  }
  let progressRender = (percent, item) => {
    return <>
      <div className={style.home_stroke_title}>{item.title}</div>
      <div className={style.home_stroke_num}>{percent}%</div>
    </>
  }
  return (
    <>
      <div className={style.block__cont}>
        <div className={style.block__header}>成长体系</div>
        <div className={style.block__sub__header}>基本信息</div>
        <div style={{ padding: '36px' }}>
          <Row justify="space-around" align="center">
            <Col className={style.form_item_detail} span={8}>
              <div>当前状态：</div>
              <div>已生效</div>
            </Col>
            <Col className={style.form_item_detail} span={8}>
              <div>渠道：</div>
              <div>太保产险-广分</div>
            </Col>
            <Col className={style.form_item_detail} span={8} />
          </Row>
        </div>
      </div>

      <div className={style.block__cont} style={{ margin: '38px 0', paddingBottom: '30px' }}>
        <div className={style.block__sub__header}>
          <div className={style.home_header}>
            <div>用户等级</div>
            <Button className={style.btn_radius} type="primary" onClick={goToAdd}>等级配置</Button>
          </div>
        </div>
        <div className={style.home_laveBox}>
          {
            laveList.length > 0 ? laveList.map((item, key) => {
              return <Progress
                type="circle"
                strokeWidth={12}
                strokeLinecap="square"
                percent={item.percent}
                strokeColor={item.color}
                className={style.home_lavePie}
                format={(percent) => progressRender(percent, item)}
              />
            }) : null
          }
        </div>
      </div>
      <div className={style.block__cont} style={{ margin: '38px 0', paddingBottom: '30px' }}>
        <ListTitle titleName="成长任务"></ListTitle>
        <QueryFilter className={style.form} form={form}>
          <Form.Item label="状态" name="status" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限">
              {
                statusArr.map((item, key) => {
                  return <Option key={key} value={item.id}>{item.title}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="重复周期" name="cycle" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限">
              {
                cycleArr.map((item, key) => {
                  return <Option key={key} value={item.id}>{item.title}</Option>
                })
              }
            </Select>
          </Form.Item>
        </QueryFilter>


        <div style={{ padding: '36px' }}>
          <div className={style.home_task_header}>
            <div>
              <Button className={style.btn_radius} type="primary" onClick={goToAdd}>
                <PlusOutlined />
                添加任务
              </Button>
            </div>
            <Radio.Group onChange={onTaskChange} value={taskIndex}>
              <Radio.Button value="1">奖励任务</Radio.Button>
              <Radio.Button value="2">惩罚任务</Radio.Button>
            </Radio.Group>
          </div>
          <ListTable showPagination={false}>
            {
              taskIndex === '1' ?
                <Table dataSource={list} scroll={{ x: 1200 }} pagination={false}>
                  <Column title="任务名称" dataIndex="couponSkuNo" key="couponSkuNo" />
                  <Column title="重复周期" dataIndex="couponSkuName" key="couponSkuName" />
                  <Column title="单次获得成长值" dataIndex="quotaPrice" key="quotaPrice" />
                  <Column title="周期内可获得次数" dataIndex="count" key="count" />
                  <Column title="状态" dataIndex="status" key="status" />
                  <Column title="操作" key="status" fixed="right" width={230}
                    render={(text, record) => (
                      <ListTableBtns>
                      
                      </ListTableBtns>
                    )} />
                </Table> :
                <Table dataSource={list} scroll={{ x: 1200 }} pagination={false}>
                  <Column title="任务名称" dataIndex="couponSkuNo" key="couponSkuNo" />
                  <Column title="状态" dataIndex="status" key="status" />
                  <Column title="操作" key="status" fixed="right" width={230}
                    render={(text, record) => (
                      <ListTableBtns>
                        
                      </ListTableBtns>
                    )} />
                </Table>
            }


          </ListTable>

        </div>
      </div>
    </>
  )
};
export default connect(({ growthSystemHome }) => ({
  list: growthSystemHome.list
}))(growthSystemHomePage)
