import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Form, Input, Avatar, Badge, Table, Select, List, Row, Col, Space, Button, DatePicker, Pagination, Tag, Collapse, message } from "antd";
import style from "./style.less";
import moment from 'moment';
import { UserOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Column } = Table;
const { Panel } = Collapse;

// 重要讯息
const importantMsg = (props) => {
  let { dispatch, type, importantMsgList, importantMsgTotal, } = props;
  let [form] = Form.useForm();

  const [payload, setPayload] = useState({
    pageNum: 1,
    pageSize: 10,
    type: type,//消息类型1 系统通知,2 重要讯息
    // msgStatus: null,//消息状态，1：未读；2：已读
    // userId: null,
    // channelId: null,
    // id: null,//渠道消息通知ID
  });

  useEffect(() => {
    messageManagerList()
  }, [payload])

  // 渠道消息通知分页列表
  const messageManagerList = () => {
    let newPayload = JSON.parse(JSON.stringify(payload));
    dispatch({
      type: 'messageModel/messageManagerList',
      payload: {
        method: 'postJSON',
        params: {
          ...newPayload
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          res.body.list.forEach(item => {
            item.isShow = false;
          })
          dispatch({
            type: 'messageModel/setMessageManagerList',
            payload: {
              list: res.body.list,
              total: res.body.total
            }
          })
        }
      }
    });
  }
  // 点击展开，收起
  const handelMsgOne = (isShow, index) => {
    let newImportantMsgList = JSON.parse(JSON.stringify(importantMsgList));
    for(let item of newImportantMsgList){
      item.isShow = false;
    }
    newImportantMsgList[index].isShow = isShow;
    dispatch({
      type: 'messageModel/setMessageManagerList',
      payload: {
        list: newImportantMsgList,
        total: importantMsgTotal
      }
    })
    // 是否未读（未读时改变状态并调接口）
    if (newImportantMsgList[index].msgStatus == 1) {
      newImportantMsgList[index].msgStatus = 2;
      readMessage(newImportantMsgList[index])
    }
  }
  // 更新渠道消息通知读取状态
  const readMessage = (item) => {
    dispatch({
      type: 'messageModel/readMessage',
      payload: {
        method: 'postJSON',
        params: {
          id: item.id,
        },
        loading: false
      }
    })
  }
  // 时间处理
  const timeReplace = (time) => {
    return time ? time.replace(/(\d{4})-(\d{2})-(\d{2})(.{6})(.*)/, '$2-$3$4') : '';
  }

  /*点击下一页上一页(参数是改变后的页码及每页条数)*/
  let onNextChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = page
    this_payload.pageSize = pageSize
    setPayload(this_payload)

  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    let this_payload = JSON.parse(JSON.stringify(payload));
    this_payload.pageNum = page
    this_payload.pageSize = pageSize
    setPayload(this_payload)
    onPageTotal()
  }
  /*显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / payload.pageSize)
    return `共${total}条记录 第 ${payload.pageNum} / ${totalPage}  页`
  }

  return (
    <>
      <div className={style.grantPage}>
        <List
          className={style.msgList}
          itemLayout="horizontal"
          split={false}
          dataSource={importantMsgList}
          renderItem={(item, index) => (
            <>
              <List.Item onClick={() => { handelMsgOne(!item.isShow, index) }} className={item.isShow ? style.hiddle_borderBottom : style.show_borderBottom} style={{ cursor: 'pointer' }}>
                <List.Item.Meta
                  avatar={<Badge dot={item.msgStatus == 1 ? true : false} offset={[-6, 4]}><Avatar src='https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/images/carowner-admin/icons/msg_icon1.png' /></Badge>}
                  title={item.title}
                  className={item.msgStatus == 1 ? style.title_black : style.title_grey}
                />
                <div>{timeReplace(item.createTime)}</div>
              </List.Item>
              <div className={item.isShow ? style.show_block : style.hiddle_block} style={{ padding: '0 10px', maxHeight: '800px', overflowY: 'auto', marginTop: '-20px' }}>
                {item.contentHtml ? <div dangerouslySetInnerHTML={{ __html: item.contentHtml }} style={{ padding: '0 40px', color: '#666',width:'100%' }}></div>:
                  <div className={style.no_content}>暂无数据...</div>
                }
              </div>
            </>
          )}
        />
        <Pagination
          className={style.pagination}
          current={payload.pageNum} //选中第一页
          pageSize={payload.pageSize} //默认每页展示10条数据
          total={importantMsgTotal} //总数
          onChange={onNextChange} //切换 页码时触发事件
          pageSizeOptions={['10', '20', '30', '60']}
          onShowSizeChange={onSizeChange}
          showTotal={onPageTotal}
        />
      </div>
    </>
  )
}

export default connect(({ messageModel }) => ({
  importantMsgList: messageModel.importantMsgList,
  importantMsgTotal: messageModel.importantMsgTotal,
}))(importantMsg)