import React, { useState, useEffect,useRef } from 'react';
import { connect, history } from 'umi';
import {
  Row,
  Form,
  Modal,
  Image,
  Space,
  Input,
  Table,
  Select,
  Button,
  message,
  DatePicker
} from "antd"
import style from "./style.less";
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

import ModalBox from './components/modal'
import CompAuthControl from '@/components/Authorized/CompAuthControl';
import { QueryFilter} from '@ant-design/pro-form';
import {
  LtbItem,
  ListTitle,
  ListTable,
  StateBadge,
  ListTableTime,
  ListTableBtns,
} from "@/components/commonComp/index";
import {ExclamationCircleOutlined} from "@ant-design/icons";
const { confirm } = Modal;

let bindWorkArr = [{
  id: 1,
  title: '是',
}, {
  id: 2,
  title: '否',
}]

//销售页面
const salesPage = (props) => {
  let { dispatch, channelList, storeArr, teamArr, saleTotal, userInfoLists, tagCountList } = props;
  let [form] = Form.useForm();
  // 登录成功返回的数据
  const currentUser = localStorage.getItem('tokenObj') ? JSON.parse(localStorage.getItem('tokenObj')) : {};
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [payload, setPayload] = useState({});

  const [tagIdArr, setTagIdArr] = useState([]);
  const [tagIdStr, setTagStr] = useState('');//标签id
  const [callList, setCallList] = useState(false);
  const [saleChannelId, setSaleChannelId] = useState(currentUser.channelId);//当前渠道id
  const [modalInfo, setMdalInfo] = useState('');//Modal数据

  //modal回调
  const callModal = (flag) => {
    setMdalInfo('')
    if (flag) {
      setCallList(!callList)
      getSaleListFrist()
    }
  }

  useEffect(() => {
    getCustomerChannelList();
    getBranchInfo();
    getCrmCustomerTagCountList();

  }, [callList])

  useEffect(() => {
    getSaleListFrist()
  }, [current, pageSize, payload])


  useEffect(() => {
    setTagStr('');
  }, [])

  // 获取所属渠道
  const getCustomerChannelList = () => {
    dispatch({
      type: 'salesManageModel/getCustomerChannelList',
      payload: {
        method: 'post',
        params: {
          channelId: currentUser.channelId
        }
      }
    });
  }

  // 获取门店信息
  const getBranchInfo = () => {
    dispatch({
      type: 'salesManageModel/getBranchInfo',
      payload: {
        method: 'get',
        params: {},
        channelId: currentUser.channelId
      }
    });
  }

  // 获取当前门店id
  const currentStore = (e) => {
    getTeamInfo(e);
  }

  // 获取团队信息
  const getTeamInfo = (branchId) => {
    dispatch({
      type: 'salesManageModel/getTeamInfo',
      payload: {
        method: 'get',
        params: {},
        branchId
      }
    });
  }

  const getSaleListFrist = () => {
    let newPayload = JSON.parse(JSON.stringify(payload));
    //日期
    if (newPayload.addRelationTime) {
      newPayload.addRelationTimeStart = moment(newPayload.addRelationTime[0]).format('YYYY-MM-DD')
      newPayload.addRelationTimeEnd = moment(newPayload.addRelationTime[1]).format('YYYY-MM-DD')
    }
    delete newPayload.addRelationTime;
    dispatch({
      type: 'salesManageModel/getSaleList',
      payload: {
        method: 'get',
        params: {
          pageNo: current,
          pageSize: pageSize,
          customerTagIds: tagIdStr,
          ...newPayload
        },
      }
    });
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

    getSaleList(tagId, isActive, index);
  }


  // 查询销售列表信息
  const getSaleList = (tagId, isActive, index) => {
    let newPayload = JSON.parse(JSON.stringify(payload));
    //日期
    if (newPayload.addRelationTime) {
      newPayload.addRelationTimeStart = moment(newPayload.addRelationTime[0]).format('YYYY-MM-DD')
      newPayload.addRelationTimeEnd = moment(newPayload.addRelationTime[1]).format('YYYY-MM-DD')
    }
    delete newPayload.addRelationTime;
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
      type: 'salesManageModel/getSaleList',
      payload: {
        method: 'get',
        params: {
          pageNo: current,
          pageSize: pageSize,
          customerTagIds: tagIdStr,
          ...newPayload
        },
      },
      callback: (res) => {
        if (res.result.code === '0') {
          let dataList = JSON.parse(JSON.stringify(tagCountList))
          dataList[index].isActive = isActive;
          dispatch({
            type: 'salesManageModel/setCrmCustomerTagCountList',
            payload: dataList
          })
        } else {
          message.error(res.result.message)
        }
      }
    });
  }

  // 销售名称（进入详情）
  const salesNameDetail = (text, all) => {
    // 查看详情
    let salesDetail = () => {
      history.push({
        pathname: '/salesManage/list/detail',
        query: {
          availablePoints: all.availablePoints,
          cardCount: all.cardCount ? all.cardCount : 0,
          channelId: all.channelId,
          objectId: all.relationUserId
        }
      })
    }
    return <a onClick={salesDetail}>{text || '-'}</a>
  }

  let columns = [
    {
      title: '销售名称',
      dataIndex: 'userNmae',
      width: 120,
      fixed: 'left',
      render: (text, all) => salesNameDetail(text, all)
    }, {
      title: '销售工号',
      width: 120,
      dataIndex: 'seqnum',
      render: (seqnum) => textRender(seqnum)
    }, {
      title: '销售账号',
      width: 120,
      dataIndex: 'saleUserId',
      render: (saleUserId) => textRender(saleUserId)
    }, {
      title: '所属渠道',
      width: 110,
      dataIndex: 'channelName',
      render: (channelName) => textRender(channelName)
    }, {
      title: '所属门店',
      width: 150,
      dataIndex: 'branchName',
      render: (branchName) => textRender(branchName)
    }, {
      title: '所属团队',
      width: 150,
      dataIndex: 'teamName',
      render: (teamName) => textRender(teamName)
    }, {
      title: '更新账号时间',
      width: 170,
      dataIndex: 'saleUpdateTime',
      render: (saleUpdateTime) => <ListTableTime>{saleUpdateTime}</ListTableTime>
    }, {
      title: '账号状态',
      width: 100,
      dataIndex: 'statusName',
      render: (statusName) => statusNameRender(statusName)
    }, {
      title: '积分余额',
      width: 100,
      dataIndex: 'availablePoints',
      render: (availablePoints) => textRender(availablePoints)
    }, {
      title: '卡券数量',
      width: 100,
      dataIndex: 'cardCount',
      render: (cardCount) => textRender(cardCount)
    }, {
      title: '客户数量',
      width: 100,
      dataIndex: 'customers',
      render: (customers) => textRender(customers)
    }, {
      title: '活动数量',
      width: 100,
      dataIndex: 'activitiesSize',
      render: (activitiesSize) => textRender(activitiesSize)
    }, {
      title: '是否绑定企微',
      width: 120,
      dataIndex: 'isBindWork',
      render: (isBindWork) => <span>{isBindWork === 1 ? '是' : '否'}</span>
    },{
      title: '企微二维码',
      width: 120,
      dataIndex: 'weWorkImg',
      render: (weWorkImg) => {
        if(!weWorkImg) {
          return <span>-</span>
        }else {
          return <Image width={50} height={30} src={weWorkImg} />
        }
      }
    }, {
      title: '操作',
      width: 160,
      fixed: 'right',
      dataIndex: 'status',
      render: (text, all) => (
        <ListTableBtns showNum={2}>
          <LtbItem onClick={() => { setMdalInfo({ modalName: 'edit', ...all }) }}>编辑销售</LtbItem>
          <LtbItem onClick={() => { setMdalInfo({ modalName: 'migration', ...all }) }}>数据迁移</LtbItem>
          {
            all.isBindWork === 1 ? <CompAuthControl compCode="salesManage_list_synchronizeWeWork">
              <LtbItem onClick={() => {onSynchronousWeWork(all)}}>同步企微客户</LtbItem>
            </CompAuthControl> : null
          }
          {
            all.isBindWork === 1 ? <CompAuthControl compCode="salesManage_list_unbindWeWork">
              <LtbItem onClick={() => {onUnbindWeWork(all)}}>解绑企微</LtbItem>
            </CompAuthControl> : null
          }
        </ListTableBtns>
      )
    }
  ];
  /*同步企微客户*/
  let onSynchronousWeWork = (record) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定同步该销售下的所有外部客户吗？',
      okText: '确定',
      cancelText: '取消',
      onOk () {
        dispatch({
          type: 'salesManageModel/onSynchronousWeWork',
          payload: {
            method: 'get',
            params: {
              userId: record.relationUserId
            }
          },
          callback: (res) => {
            if (res.result.code === '0') {
              message.success('客户同步开始进行～')
              getSaleListFrist()
            }else {
              message.info(res.result.message)
            }
          }
        })
      }
    })
  }
  /*解绑企微*/
  let onUnbindWeWork = (record) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定解绑该销售的企微账号吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk () {
        dispatch({
          type: 'salesManageModel/onUnbindWeWork',
          payload: {
            method: 'get',
            params: {
              userId: record.relationUserId
            }
          },
          callback: (res) => {
            if (res.result.code === '0') {
              message.success(res.result.message)
              getSaleListFrist()
            }else {
              message.info(res.result.message)
            }
          }
        })
      }
    })
  }

  // 表单导出
  const exportSales = () => {
    let newPayload = JSON.parse(JSON.stringify(payload));
    //日期
    if (newPayload.addRelationTime) {
      newPayload.addRelationTimeStart = moment(newPayload.addRelationTime[0]).format('YYYY-MM-DD')
      newPayload.addRelationTimeEnd = moment(newPayload.addRelationTime[1]).format('YYYY-MM-DD')
    }
    dispatch({
      type: 'salesManageModel/getExportSaleInfo',
      payload: {
        method: 'postJsonExcel',
        params: newPayload,
      },
      callback: (res) => {
        const url = window.URL.createObjectURL(new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '销售明细列表.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    });
  }

  //表单查询
  const searchBtn = (val) => {
    setCurrent(1)
    setPageSize(10)
    setTagStr(tagIdStr);
    setPayload(JSON.parse(JSON.stringify(val)))
  }

  //表单重置
  const resetBtnEvent = () => {
    form.resetFields();
    setPayload({})
  }

  // 分页切换
  const pageChange=(page,pageSize)=>{
    setCurrent(page)
    setPageSize(pageSize)
    setTagStr(tagIdStr);
  }

  /*校验导入销售账号*/
  let onImportSale = () => {
    dispatch({
      type: 'salesManageModel/onImportSaleCheck',
      payload: {
        method: 'get',
        params: {},
      },
      callback: (res) => {
        let temp = res.result
        if(temp.code === '0') {
          setMdalInfo({ modalName: 'importSale' })
        }else {
          message.info(temp.message)
        }
      }
    })

  }

  // 账号状态
  let statusNameRender = (text) => {
    if(text=='已激活') return <StateBadge color="#32D1AD">{text}</StateBadge>
    if(text=='未激活') return <StateBadge color="#FFC500">{text}</StateBadge>
    if(text=='已冻结') return <StateBadge color="#FF4A1A">{text}</StateBadge>
  }
  // 正常文本翻译
  let textRender = (text) => {
    return <span>{text || '-'}</span>
  }
  return (
    <>

      <div className={style.filter_box}>
        <QueryFilter className={style.form} form={form} defaultCollapsed onFinish={searchBtn} onReset={resetBtnEvent}>
          <Form.Item label="销售名称" name="username" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="销售工号" name="seqnum" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="销售账号" name="salePhone" labelCol={{flex: '0 0 120px'}}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="所属渠道" name="channelId" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限" defaultValue={saleChannelId} disabled>
              {
                channelList && channelList.map((v) => <Option key={v.id} value={v.id}>{v.channelName}</Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item label="所属门店" name="branchId" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限" showSearch allowClear optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 } onChange={(e) => { currentStore(e) }}>
              {
                storeArr && storeArr.map((v) => <Option key={v.branchid} value={v.branchid}>{v.depname}</Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item label="所属团队" name="teamId"labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="请选择所属门店(所属团队自动获取)" showSearch allowClear optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }>
              {
                teamArr && teamArr.map((v) => <Option key={v.objectId} value={v.objectId}>{v.teamName}</Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item label="是否绑定企微" name="isBindWork" className={style.form_item} labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限" allowClear>
              {
                bindWorkArr.map(item => <Option value={item.id} key={item.id}>{item.title}</Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item label="账户状态" name="saleStatus" labelCol={{ flex: '0 0 120px' }}>
            <Select placeholder="不限" allowClear>
              <Option value="1">已激活</Option>
              <Option value="2">未激活</Option>
              <Option value="3">已冻结</Option>
            </Select>
          </Form.Item>
          <Form.Item label="标签激活日期" name="addRelationTime" labelCol={{ flex: '0 0 120px' }}>
            <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder={['开始时间', '结束时间']} />
          </Form.Item>
        </QueryFilter>
      </div>

      <div className={style.list_box}>
        <ListTitle titleName="客户标签"></ListTitle>
        <div className={style.tableData}>
          <Space size={10}>
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
      </div>


      <div className={style.list_box}>
        <ListTitle titleName="结果列表">
          <Space size={8}>
            <Button onClick={exportSales}>导出</Button>
            <CompAuthControl compCode="salesManage_list_importSale">
              <Button onClick={onImportSale} type="primary">导入销售账号</Button>
            </CompAuthControl>
            <CompAuthControl compCode="salesManage_list_importClient">
              <Button onClick={() => { history.push(`/salesManage/list/importList?userId=0&type=2&channelId=${saleChannelId}`) }} type="primary">导入销售客户</Button>
            </CompAuthControl>
          </Space>
        </ListTitle>
        <ListTable showPagination current={current} pageSize={pageSize} total={saleTotal} onChange={pageChange}>
          <Table columns={columns} dataSource={userInfoLists} pagination={false} scroll={{ x: 700 }} />
        </ListTable>
      </div>
      {modalInfo ? <ModalBox modalInfo={modalInfo} toFatherValue={(flag) => callModal(flag)}/> : ''}
    </>
  )
}


export default connect(({ salesManageModel }) => ({
  channelList: salesManageModel.channelList,
  storeArr: salesManageModel.storeArr,
  teamArr: salesManageModel.teamArr,
  saleTotal: salesManageModel.saleTotal,//总数
  userInfoLists: salesManageModel.userInfoLists,//销售列表
  tagCountList: salesManageModel.tagCountList,//
}))(salesPage)







