import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Row, Col, Form, Input, Modal, message, Select, Tooltip, Checkbox, Upload, Button} from "antd"
import { ExclamationCircleOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import style from "./style.less";
const { TextArea } = Input;
const txt = <>
              <div>温馨提示：</div>
              <div>1、数据迁移之后，被迁移账号的数据会自动清空；</div>
              <div>2、客户数据，即这个客户的所有数据，如客户信息、车辆信息、保单信息、业务信息、行为记录、社交圈等；</div>
              <div>3、标签激活关系，即这个客户与被迁移账号的标签激活关系；</div>
            </>
const modal = (props) => {
  let { dispatch, modalInfo, toFatherValue} = props;
  const [migration, setMigration] = useState({});// 数据迁移对象
  const [customerAndTags, setCustomerAndTags] = useState(0); // 数据迁移中的客户数据和标签激活关系
  const [targetSale, setTargetSale] = useState(); //目标销售
  const [targetList, setTargetList] = useState([]);// 目标销售数据
  /***********************************************************编辑销售数据****************************************************************************/
  const [editInfo, setEditInfo] = useState({});// 编辑销售对象
  const [channelList, setChannelList] = useState([]); //编辑销售所属渠道
  const [branchList, setBranchList] = useState([]); //编辑销售所属门店
  const [teamList, setTeamList] = useState([]); //编辑销售所属团队
  const [userName, setUserName] = useState(''); // 销售名称
  const [seqnum, setSeqnum] = useState(''); // 销售工号
  const [salePhone, setSalePhone] = useState('');// 销售账号
  const [channelId, setChannelId] = useState(''); // 渠道id
  const [branchid, setBranchid] = useState('');// 门店id
  const [teamId, setTeamId] = useState('');//团队id
  const [oldTeamId, setOldTeamId] = useState(); //old的团队id
  const [userStatus, setUserStatus] = useState(null); // 冻结账号
  const [showGroupData, setShowGroupData] = useState(null); // 查看集团数据
  const [branchManager, setBranchManager] = useState(null); // 查看门店数据
  const [fileList,setFileList] = useState([]); // 文件上传
  const [fileName, setFileName] = useState('');// 文件名称
  const [fileCode, setFileCode] = useState(''); // 文件编码
  const [errDownload, setErrDownload] = useState('');// 导入销售账户保存失败标识
  //数据迁移-查询
  useEffect(() => {
    if(modalInfo.modalName != 'migration') return
    dispatch({
      type: 'salesManageModel/querySaleInfo',
      payload: {
        method: 'get',
        saleId: modalInfo.relationUserId,
        params: {}
      },
      callback: (res) => {
        setMigration(res.body)
      }
    })
    queryTargetList();
  },[])
  // 数据迁移-目标销售查询
  const queryTargetList = () => {
    dispatch({
      type: 'salesManageModel/queryMoveSaleList',
      payload: {
        method: 'get',
      },
      callback: (res) => {
        setTargetList(res.body)
      }
    })
  }
  // 编辑销售-查询
  useEffect(()=> {
    if(modalInfo.modalName != 'edit') return
    // 编辑销售
    dispatch({
      type: 'salesManageModel/queryEditSaleInfo',
      payload: {
        method: 'get',
        userId: modalInfo.relationUserId,
        params: {}
      },
      callback: (res) => {
        setUserName(res.body.saleName);// 销售名称
        setSeqnum(res.body.seqNum); // 销售工号
        setSalePhone(res.body.salePhone); //销售账号
        setUserStatus(res.body.userStatus);// 冻结账号
        setShowGroupData(Number(res.body.showGroupData)); // 查看集团数据
        setBranchManager(Number(res.body.branchManager)); // 查看门店数据
        setEditInfo(res.body)
        Promise.all([queryCustomerChannelList(res.body.channelId), queryBranchInfo(res.body.channelId,res.body.branchId), queryTeamInfo(res.body.branchId,res.body.teamId)]).then(res=> {
        })
      }
    })
  },[])
  // 所属渠道
  let queryCustomerChannelList = (channelId) => {
    return new Promise((resolve, reject) => {
       dispatch({
        type: 'salesManageModel/queryCustomerChannelList',
        payload: {
          method: 'post',
          params: {
            channelId,
          }
        },
        callback: (res) => {
          setChannelId(channelId); // 渠道id
          setChannelList(res.items.data.channelList)
          resolve(res.items.data.channelList)
        }
      })
    })
  }
  // 所属门店
  let queryBranchInfo = (channelId,branchid) => {
    return new Promise((resolve, reject) => {
       dispatch({
        type: 'salesManageModel/queryBranchInfo',
        payload: {
          method: 'get',
          channelId,
        },
        callback: (res) => {
          setBranchid(branchid);//门店id
          setBranchList(res.body)
          resolve(res.body)
        }
      })
    })
  }
  // 所属团队
  let queryTeamInfo = (branchId,teamId) => {
    return new Promise((resolve, reject) => {
       dispatch({
        type: 'salesManageModel/queryTeamInfo',
        payload: {
          method: 'get',
          branchId,
        },
        callback: (res) => {
          setTeamId(Number(teamId));//团队id
          setOldTeamId(Number(teamId));//老的团队id
          setTeamList(res.body);
          resolve(res.body)
        }
      })
    })
  }
  // 导入销售账号-查询
  useEffect(()=> {
    if(modalInfo.modalName != 'importSale') return
    let tokenObj = JSON.parse(localStorage.getItem('tokenObj'))
    queryCustomerChannelList(tokenObj.channelId)
  },[])
  // 数据迁移的保存
  const addMigrationSale = () => {
    if(!customerAndTags) return message.error({style: {marginTop: '10vh', },content: '请勾选客户数据和标签激活关系!'});
    if(!targetSale) return message.error({style: {marginTop: '10vh', },content: '请选择销售账号!'});
    dispatch({
      type: 'salesManageModel/addSaleInfo',
      payload: {
        method: 'postJSON',
        params: {
          customerAndTags,
          saleId: modalInfo.relationUserId,
          targetSale,
        },
      },
      callback: (res) => {
        toFatherValue(true)
      }
    })
  }
  // 编辑销售的保存
  const addEditSale = () => {
    let b = /^1\d{10}$/.test(salePhone);
    let c = /^1(3[0-9]|4[5,7]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{8}$/.test(salePhone);
    if(!userName) return message.error({style: {marginTop: '10vh', },content: '请输入销售名称!'});
    if(!salePhone) return message.error({style: {marginTop: '10vh', },content: '请输入销售账号!'});
    if(!b || !c) return message.error({style: {marginTop: '10vh', },content: '请输入以1开头的11位手机号!'});
    if(!channelId) return message.error({style: {marginTop: '10vh', },content: '请选择所属渠道!'});
    if(!branchid) return message.error({style: {marginTop: '10vh', },content: '请选择所属门店!'});
    dispatch({
      type: 'salesManageModel/saveSaleInfo',
      payload: {
        method: 'postJSON',
        params: {
          branchId: branchid,//门店ID
          branchManager:branchManager,//查看门店数据
          channelId:channelId,//渠道ID
          oldTeamId:oldTeamId,//老团队id
          seqnum:seqnum,//销售工号
          showGroupData:showGroupData,//查看集团数据
          teamId:teamId,//团队ID
          userCode:salePhone,//销售code
          userId:modalInfo.relationUserId,//销售ID
          userName:userName,//销售名称
          userStatus:userStatus,//用户状态
        }
      },
      callback: (res) => {
        let temp = res.result
        if(temp.code === '0') {
          toFatherValue(true)
        }else {
          message.info(temp.message)
        }

      }
    })
  }
  // 导入销售账户的保存
  const addImportSale = () => {
    if(!fileCode || !fileName) return message.error({style: {marginTop: '10vh', },content: '请上传excel文件!'});
    dispatch({
      type: 'salesManageModel/importSaleInfo',
      payload: {
        method: 'postJSON',
        params: {
          channelId:channelId,// 渠道id
          fileCode:fileCode,// 文件code
          fileName:fileName,// 文件名称
          type:'1',//类型
          userId:modalInfo.relationUserId,//销售ID
        }
      },
      callback: (res) => {
        if(res.result.code==0){
          message.success(res.result.message);
          toFatherValue(true)
        }else {
          message.error(res.result.message);
          setErrDownload(res.body);
        }
      }
    })
  }
  // 下载文件接口
  let downloadSaleExcel = (fileCode) => {
    let data = {
      fileCode,
    }
    dispatch({
      type: 'salesManageModel/onDownloadFile',
      payload: {
        method: 'getDownloadExcel',
        params: data,
        allData: true
      },
      callback: (res) => {
        const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/vnd.ms-excel" }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        // link.setAttribute('download', decodeURIComponent(res.headers.filename));
        link.setAttribute('download', decodeURIComponent('导入文件错误信息列表.xlsx'));
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    })
  }
  // 数据迁移客户数据和标签激活关系change事件
  const checkBoxChange = (e) => {
    e.target.checked ? setCustomerAndTags(1) : setCustomerAndTags(0)
  }
  // 编辑销售checkbox的change事件
  const editSaleCheckbox = (e, type) => {
    if(type==1){
      if(e.target.checked) {
        setUserStatus(0);
      }else{
        setUserStatus(1);
      }
    }
    //二选一
    if(type==2){
      setBranchManager(null)
      if(e.target.checked) {
        setShowGroupData(1);
      }else{
        setShowGroupData(0);
      }
    }
    if(type==3){
      setShowGroupData(null)
      if(e.target.checked) {
        setBranchManager(1)
      }else{
        setBranchManager(0)
      }
    }
  }
  // 上传配置
  let uploadConfig = {
    name:"files",
    maxCount: 1,
    action:"/api/file/upload?folderCode=sale_customer",
    accept: ".xls,.xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",   //上传文件类型--这个是excel类型
    showUploadList: true,
    headers: {
      "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken
    },
    // 上传之前
    beforeUpload(file) {
      message.loading('文件上传中', 0)
    },
    // 上传完成之后
    onChange(e){
      console.log(e.file.status)
      setFileList(e.fileList)
      if (e.file.status === "done"){
        message.destroy();
        message.success(`${e.file.name} 上传成功!`)
        if(e.file.response.result.code === '0'){
          setFileName(e.file.name);
          setFileCode(e.file.response.body[0]);
        }
      } else if (e.file.status === "error"){
        message.destroy()
        message.error(`${e.file.name} 上传失败!`)
      }
    }
  }
  return (
    <>
      {/* 数据迁移*/}
      <Modal width={880} title='数据迁移'
            className={style.modal_content_part}
            visible={modalInfo.modalName=='migration'}
            onOk={()=> {addMigrationSale()}}
            okText="保存"
            onCancel={()=> {toFatherValue(false)}}>
        <div style={{overflow:'hidden'}}>
          <div className={style.info}>
            <div className={style.item_box}>
              <div className={style.key_val}>所属渠道：<span>{migration.channelName}</span></div>
              <div className={style.key_val}>销售名称：<span>{migration.username}</span></div>
              <div className={style.key_val}>销售账号：<span>{migration.userid}</span></div>
            </div>
          </div>
          <div className={style.infos}>
            <div className={style.info_title}>数据账户
              <Tooltip placement="bottomLeft" title={txt} overlayStyle={{ maxWidth: 450 }} >
                <ExclamationCircleOutlined />
              </Tooltip>
            </div>
            <div className={style.item_box}>
              <div className={style.key_val}><Checkbox defaultChecked={customerAndTags} onChange={(e)=>{checkBoxChange(e)}}></Checkbox><span>客户数据和标签激活关系</span></div>
            </div>
          </div>
          <div className={style.infoss}>
            <div className={style.info_title}>迁移给</div>
            <div className={style.item_box}>
              <div className={style.key_val}>所属渠道：<span>{migration.channelName}</span></div>
              <div className={style.key_val}></div>
              <Form.Item className={style.key_val} label="目标销售：">
                <Select
                  showSearch
                  optionFilterProp="children"
                  allowClear
                  placeholder="请输入销售账号"
                  value={targetSale}
                  onChange={(e) => {setTargetSale(e)}}>
                  {
                    targetList.map(v => <Option key={v.relationUserId} title={v.telephone} value={v.relationUserId}>{v.telephone}</Option>)
                  }
                </Select>
              </Form.Item>
            </div>
          </div>
        </div>
      </Modal>
      {/* 编辑销售 */}
      <Modal width={880} title='编辑销售'
            className={style.modal_content_part}
            visible={modalInfo.modalName=='edit'}
            onOk={()=> {addEditSale()}}
            okText="保存"
            onCancel={()=> {toFatherValue(false)}}>
        <div style={{overflow:'hidden'}}>
          <div className={style.edit_info}>
            <Row>
              <Col span={12} style={{paddingRight:'10px'}}>
                <Form.Item label="销售名称" required>
                  <Input placeholder="请输入" value={userName} onChange={(e)=> {setUserName(e.target.value)}}></Input>
                </Form.Item>
              </Col>
              <Col span={12} style={{paddingLeft:'10px'}}>
                <Form.Item label="销售工号">
                  <Input placeholder="请输入" value={seqnum} onChange={(e)=> {setSeqnum(e.target.value)}}></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12} style={{paddingRight:'10px'}}>
                <Form.Item label="销售账号" required>
                  <Input placeholder="请输入" value={salePhone} onChange={(e)=> { setSalePhone(e.target.value)}}></Input>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="所属渠道" required>
                  <Select allowClear placeholder="请选择" value={channelId} disabled>
                    {
                      channelList.map(v => <Option key={v.id} value={v.id}>{v.channelName}</Option>)
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12} style={{paddingRight:'10px'}}>
                <Form.Item label="所属门店" required>
                  <Select allowClear placeholder="请选择" value={branchid} onChange={(e)=> {setBranchid(e)}}>
                    {
                      branchList.map(v => <Option key={v.branchid} value={v.branchid}>{v.depname}</Option>)
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12} style={{paddingLeft:'10px'}}>
                <Form.Item label="所属团队">
                  <Select allowClear placeholder="请选择" value={teamId} onChange={(e)=> {setTeamId(e)}}>
                    {
                      teamList.map(v => <Option key={v.objectId} value={v.objectId}>{v.teamName}</Option>)
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className={style.edit_infos}>
            <div className={style.info_title}>账号设置</div>
            <div className={style.item_box}>
              <div div className={style.key_val}><Checkbox checked={userStatus===0} onChange={(e)=>{editSaleCheckbox(e,1)}}>冻结账号</Checkbox></div>
              <div div className={style.key_val}><Checkbox checked={showGroupData}
              disabled={userStatus==0? true : false} onChange={(e)=>{editSaleCheckbox(e,2)}}>查看集团数据</Checkbox></div>
              <div div className={style.key_val}><Checkbox checked={branchManager}
              disabled={userStatus==0? true : false} onChange={(e)=>{editSaleCheckbox(e,3)}}>查看门店数据</Checkbox></div>
            </div>
          </div>
        </div>
      </Modal>
      {/* 导入销售账户 */}
      <Modal width={880} title='导入销售账号'
            className={style.modal_content_part}
            visible={modalInfo.modalName=='importSale'}
            onOk={()=> {addImportSale()}}
            okText="保存"
            maskClosable={false}
            onCancel={()=> {toFatherValue(false)}}>
        <div style={{overflow:'hidden'}}>
          <div className={style.import_sale}>
            <Row>
              <Col span={24}>
                <Form.Item label="渠道" labelCol={{flex: '0 0 120px'}} required>
                  <Select allowClear placeholder="请选择" value={channelId} disabled>
                    {
                      channelList.map(v => <Option key={v.id} value={v.id}>{v.channelName}</Option>)
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="导入销售" labelCol={{flex: '0 0 120px'}} required>
                  <Upload {...uploadConfig} fileList={fileList} className={style.upload_icon}>
                    <Button icon={<UploadOutlined />} style={{color:"#1890ff",cursor:'pointer', width:'100%'}}>上传选择文件</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="模板下载" labelCol={{flex: '0 0 120px'}}>
                  <div  className={style.put_down}>
                    <DownloadOutlined  className={style.down_icon}/>
                    {
                      channelId==422 ? <a href='https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/file-template/carowner-admin/%E9%94%80%E5%94%AE%E8%B4%A6%E5%8F%B7%E6%A8%A1%E6%9D%BF%28%E5%90%AB%E8%BF%94%E4%BD%A3%29.xlsx'  download='销售账号模板(返佣金).xlsx' >下载导入模板 </a>
                      :
                      (
                        channelId==1489 ? <a href='https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/file-template/carowner-admin/%E9%94%80%E5%94%AE%E8%B4%A6%E5%8F%B7%E6%A8%A1%E6%9D%BF%28%E9%94%80%E5%94%AE%E9%A2%9D%E5%BA%A6%29.xlsx'  download='销售账号模板(销售额度).xlsx' >下载导入模板 </a>
                      :
                        <a href='https://ylt-frontend.oss-cn-hangzhou.aliyuncs.com/file-template/carowner-admin/%E9%94%80%E5%94%AE%E8%B4%A6%E5%8F%B7%E6%A8%A1%E6%9D%BF.xlsx'  download='销售客户模版.xlsx' >下载导入模板 </a>
                      )
                    }

                  </div>
                </Form.Item>
              </Col>
            </Row>
            {
              errDownload ?
              <Row>
                <Col span={24}>
                  <Form.Item label="错误信息下载" labelCol={{flex: '0 0 120px'}}>
                    <div  className={style.put_down}>
                      <DownloadOutlined  className={style.down_icon}/>
                      <sapn onClick={()=> {downloadSaleExcel(errDownload)}}>下载错误信息文件</sapn>
                    </div>
                  </Form.Item>
                </Col>
              </Row> : ''
            }
          </div>
        </div>
      </Modal>
    </>
  )
}
export default connect(({ accountManage }) => ({
}))(modal)
