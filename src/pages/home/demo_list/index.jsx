import React,{useEffect,useState} from 'react';
import { connect } from 'umi';
import style from './style.less';
import {
  Form,
  Input,
  Table,
  Badge,
  Space,
  Button,
  Pagination,
  Modal,
  Select,
  Tooltip,
  message,
  ConfigProvider,} from 'antd';

import { QueryFilter} from '@ant-design/pro-form';
import CompAuthControl from '@/components/Authorized/CompAuthControl'
import { ListTitle, ListTips, ListTable, ListTableBtns,
  LtbItem, TypeTags, StateBadge, TextEllipsis, ListTableTime,
  MoneyFormat,} from "@/components/commonComp/index";

import { method } from 'lodash';
const { Column } = Table;

const { Option } = Select;

let _tableList=[];

for(let i=0;i<100;i++){
  let obj={
    id:i+1,
    text: '正常文本',
    money: 123456.123456+i*100,
    name: Math.ceil(Math.random()*2)==1 ? 
      `需要省略显示的文本 需要省略显示的文本 需要省略显示的文本${i}`:`显示的文本${i}`,
    type: Math.ceil(Math.random()*5),
    state: Math.ceil(Math.random()*5),
    time: '2022-12-12 10:10:10',
  };
  _tableList.push(obj)
}

const Home = (props) =>{
  const {dispatch} = props;
  let [form] = Form.useForm()

  const [tableList,setTableList] = useState([]);
  const [pageSize,setPageSize] = useState(10);
  const [page,setPage] = useState(1);
 
  const submitData=()=>{};
  const resetForm=()=>{};

  //分页
  const pageChange=(page,pageSize)=>{
    setPage(page)
    setPageSize(pageSize)
  }
 
  //page pageSize监听
  useEffect(()=>{
    slicePage();
  },[page,pageSize])

  //前端模拟分页
  const slicePage=()=>{
    let startNum = (page-1) * pageSize;
    let endNum = page * pageSize;
    let _list = _tableList.slice(startNum,endNum);
    setTableList(_list);
  }

  // 所有组件根据自己需要引入
  return(
    <>
      <div className={style.filter_box}>
        {/* 为了方便迁移，这里可以直接使用Form.Item内嵌的方式 */}
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={submitData} onReset={resetForm}>
          <Form.Item label="文本框1号" name="name1" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="文本框2号" name="name2" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="文本框3号" name="name3" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="下拉框1号" name="name4" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="不限">
              <Option value="1">类型1</Option>
              <Option value="2">类型2</Option>
            </Select>
          </Form.Item>
          <Form.Item label="下拉框2号" name="name5" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="不限">
              <Option value="1">类型1</Option>
              <Option value="2">类型2</Option>
            </Select>
          </Form.Item>
          <Form.Item label="下拉框3号" name="name6" labelCol={{flex: '0 0 120px'}}>
            <Select placeholder="不限">
              <Option value="1">类型1</Option>
              <Option value="2">类型2</Option>
            </Select>
          </Form.Item>
        </QueryFilter>
      </div>
      <div className={style.list_box}>
        {/* 表格标题 功能按钮 */}
        <ListTitle titleName="列表标题">
          <Space size={8}>
            <Button>导出按钮</Button>
            <Button type='primary'>新增按钮</Button>
          </Space>
        </ListTitle>
        {/* 表格提示 */}
        <ListTips>
          活动投放总计：418.7 万元
        </ListTips>
        {/* 表格组件+分页 分页已经内嵌在组件里面 在ListTable配置即可*/}
        {/* 注意Table的pagination属性需设置为false 隐藏table自带分页*/}
        <ListTable showPagination current={page} pageSize={pageSize} total={_tableList.length}
        onChange={pageChange} 
        >
          <Table dataSource={tableList} scroll={{x:1200}} pagination={false}>
            <Column title="列表id" dataIndex="id" key="id" />
            <Column title="正常文本" dataIndex="text" key="id" />
            <Column title="金额" dataIndex="money" key="id" 
            render={(text, record)=>(
              // prefix：前缀 默认为空 不显示
              // acc：显示小数点后几位，默认全显示
              <MoneyFormat acc={2} prefix="￥">{text}</MoneyFormat>
            )}/>
            <Column title="名称-省略显示" dataIndex="name" key="id" 
            render={(text, record)=>(
              // 文本两行省略显示
              <TextEllipsis>{text}</TextEllipsis>
            )}/>
            <Column title="日期时间" dataIndex="time" key="id" 
            render={(text, record)=>(
              // 日期时间需要提前格式化 2022-12-12 10:00:00，再使用ListTableTime组件
              // 组件暂不支持自动格式化
              <ListTableTime>{text}</ListTableTime>
            )}/>
            <Column title="状态" dataIndex="state" key="id" 
            render={(text, record)=>(<>
              {/* StateBadge为antd-Badge组件二次封装 颜色参考antd-Badge文档  */}
              {text==1?<StateBadge type="pink">状态{text}</StateBadge>:''}
              {text==2?<StateBadge type="red">状态{text}</StateBadge>:''}
              {text==3?<StateBadge type="yellow">状态{text}</StateBadge>:''}
              {text==4?<StateBadge status="success">状态{text}</StateBadge>:''}
              {text==5?<StateBadge color="#142ff1">状态{text}</StateBadge>:''}
            </>)}/>
            <Column title="类型" dataIndex="type" key="id" 
            render={(text, record)=>(<>
              {text==1?<TypeTags type="red">类型{text}</TypeTags>:''}
              {text==2?<TypeTags type="yellow">类型{text}</TypeTags>:''}
              {text==3?<TypeTags type="green">类型{text}</TypeTags>:''}
              {text==4?<TypeTags type="orange">类型{text}</TypeTags>:''}
              {text==5?<TypeTags color="#142ff1">类型{text}</TypeTags>:''}
              </>
            )}/>
            {/* 根据情况调整width来控制按钮的换行，尽量一行展示 */}
            <Column title="操作"  key="id" fixed="right" width={230}
            render={(text, record)=>(
              // 操作按钮组 <LtbItem>支持自定义颜色，<LtbItem>内容自定义
              // <ListTableBtns>子元素必须是<LtbItem>,请勿在<LtbItem>外层再套div等盒子
              // 如果有显示隐藏的控制，三元运算符后面接空字符串''
              // showNum: 最多展示多少按钮（不折叠的按钮）  all为全部显示不折叠
              <ListTableBtns showNum={3}>
                <LtbItem style={{color:'red'}} onClick={()=>{console.log(111)}}>按钮1</LtbItem>
                {1?<CompAuthControl compCode="demo_list_btn2"><LtbItem>按钮2</LtbItem></CompAuthControl>:
                ''}
                <CompAuthControl compCode="demo_list_btn2-1"><LtbItem>按钮2-1</LtbItem></CompAuthControl>
                {false?<LtbItem>按钮3</LtbItem>:null}
                <LtbItem>按钮按钮6</LtbItem>
                <LtbItem>按钮7</LtbItem>
                <LtbItem>按钮8</LtbItem>
              </ListTableBtns>
            )}/>
          </Table>
        </ListTable>
        
      </div>
    </>
  )
}
export default connect(({ loading }) => ({
  
}))(Home);