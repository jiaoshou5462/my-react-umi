//创建弹窗
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import { Space, Select, Input, Button, Tree, Modal, Table, message } from 'antd';
const {Column, showTotal} = Table;
let fileStatus = {
  'FINISH': "已生成",
  'ERROR': "文件生成失败",
  'PENDING': "正在生成文件"
}
const exportListModal = (props) => {
  let { exportData, isExportListShow, hideExportList, dispatch } = props;
  let [isShow, setIsShow] = useState(false);//modal是否显示
  let [groupName, setGroupName] = useState("");//当前群组名称
  let [groupId, setGroupId] = useState();//当前群组ID
  let [current, setCurrent] = useState(1);//页码
  let [pageSize, setPageSize] = useState(5);//页数
  let [total, setTotal] = useState(0);//总数
  let [fileList, setFileList] = useState();//列表展示数据
  //关闭modal
  let handleCancel = () => {
    setIsShow(false);
    hideExportList(false);
  }

  useEffect(() => {
    if(isExportListShow && exportData){
      setIsShow(true);
      setGroupName(exportData.groupName);
      setGroupId(exportData.id);
    }
  }, [isExportListShow,exportData]);
  useEffect(()=>{
    if(groupId){
      exportUserGroup(groupId)
    }
  },[groupId,current])
  //查询列表数据
  let exportUserGroup = (groupId) => {
    dispatch({
      type: 'exportListModal/exportUserGroup',
      payload: {
        method: 'get',
        userGroupId: groupId,
        params: {
          userGroupId: groupId,
          pageNum: current,
          pageSize: pageSize
        },
        loading:false,
      },
      callback: (res) => {
        if(res.result.code == "0"){
          let items = res.body;
          setFileList(items.list);
          // setPageSize(items.pageSize);
          // setCurrent(items.pages);
          setTotal(items.total);
        }
      }
    });
  }
  //点击生成导出名单
  let downloadList = () => {
    dispatch({
      type: 'exportListModal/exportUserGroup',
      payload: {
        method: 'post',
        userGroupId: groupId,
        params: {},
        loading:false,
      },
      callback: (res) => {
        if(res.result.code == "0"){
          Modal.info({
            title: "提示",
            content: (
              <div>
                <p>{res.body}</p>
              </div>
            ),
            onOk() {
              setCurrent(1);
              exportUserGroup(groupId)
            },
          })
        }
      }
    });
  }

  //刷新列表数据
  let updateList = () => {
    setCurrent(1);
    exportUserGroup(groupId);
  }
  //分页切换
  let handleTableChange = (pagination) => {
    setCurrent(pagination.current)
    // setPageSize(pagination.pageSize)
  }

  //下载
  let clickDownload = (fileCode,fileName) => {
    dispatch({
      type: 'exportListModal/getDownloadFile',
      payload: {
        method: 'get',
        params: {
          fileCode: fileCode
        },
        responseType: 'blob'
      },
      callback: (res) => {
        if(res) {
          const url = window.URL.createObjectURL(new Blob([res], {type: "application/x-www-form-urlencoded"}))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    });
  }
  return (
    <div>
      <Modal title="导出名单" width={1000} visible={isShow} maskClosable={false} onCancel={handleCancel} footer={false}> 
        <div className={style.top}>
          <div className={style.title}>当前群组名称：{groupName}</div>
          <Button type="primary" onClick={downloadList}>生成导出名单</Button>
        </div>
        <div className={style.content}>
          <div className={style.notice}>
            <div className={style.left_notice}>
              <div className={style.label}>历史导出记录</div>
              <div className={style.update} onClick={updateList}>刷新</div>
            </div>
            <div className={style.right_notice}>导出名单为异步生成文件，请至下方列表中下载</div>
          </div>
          <Table onChange={handleTableChange} 
            pagination={{current: current,pageSize: pageSize,total: total}} 
            dataSource={fileList}>
            <Column title="群组名称" dataIndex="userGroupName" key="userGroupName" />
            <Column title="文件名称" dataIndex="fileName" key="fileName" />
            <Column title="导出时间" dataIndex="exportTime" key="exportTime" />
            <Column title="导出状态" 
              dataIndex="exportStatus" 
              key="exportStatus"  
              render={(text, record) => (
                <Space size="middle">
                  {record.exportStatus  ? <p>{fileStatus[record.exportStatus]}</p> : null}
                </Space>
              )}
            />
            <Column
              title="操作"
              key="action"
              render={(text, record) => (
                <Space size="middle">
                  {record.fileCode ? <a onClick={()=>clickDownload(record.fileCode, record.fileName)}>下载</a> : null}
                </Space>
              )}
            />
          </Table>
        </div>
      </Modal>
    </div>
  )
}
export default connect(({ exportListModal, loading }) => ({
}))(exportListModal);