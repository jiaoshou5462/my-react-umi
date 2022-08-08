//标签面板
import React, { useEffect, useState,useMemo } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import { Row, Col, Form, Select, Input, Button, Tree,Space, Modal,message } from 'antd';
const { Search } = Input;
import {
  SettingOutlined,
  SyncOutlined,
  TagOutlined
} from '@ant-design/icons';
import { Bar, Pie, Column } from '@ant-design/charts';
import TreeModal from './components/treeModal/treeModal'
import CreateTagModal from './components/createTagModal/createTagModal'
import {labelState, createAWay, updateMode} from '../dict.js'
import icon1 from '@/assets/icon1.png'
import icon2 from '@/assets/icon2.png'
import icon3 from '@/assets/icon3.png'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
let config_d = {
  data: [],
  color:'#6395f9',
  xField: 'countNum',
  yField: 'layerName',
  seriesField: 'layerName',
  legend: { position: 'top-left' },
  width: 270,
  height: 270,
}
let config1_d = {
  appendPadding: 10,
  data: [],
  colorField:'layerName',
  angleField: 'countNum',
  colorField: 'layerName',
  radius: 1,
  innerRadius: 0.65,
  width: 270,
  height: 270,
  meta: {
    value: {
      formatter: function formatter(v) {
        return ''.concat(v, ' \xA5');
      },
    },
  },
  label: {
    type: 'inner',
    offset: '-50%',
    style: { textAlign: 'center' },
    autoRotate: false,
    formatter: (val) => {
      return val.percentage+'%'
    },
  },
  interactions: [
    { type: 'element-selected', },
    { type: 'element-active' },
    { type: 'pie-statistic-active' },
  ],
}

const TagPanel = (props) => {
  const { treeList, labelDefaults, labelDistributionList,  actionSelectData,attributeSelectData, dispatch,loading } = props;
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [treeData, setTreeData] = useState([])
  const [tagLayers, setTagLayers] = useState([])
  const [tagName, setTagName] = useState('')
  const [refreshType, setRefreshType] = useState(null)
  const [tagStatuses, setTagStatuses] = useState([])
  const [createTypes, setCreateTypes] = useState([])
  const [toSearch, setToSearch] = useState(false)
  let tokenObj = localStorage.getItem('tokenObj') ? JSON.parse(localStorage.getItem('tokenObj')) : {};

  const [config,setConfig] = useState(config_d);
  const [config1,setConfig1] = useState(config1_d);
  useEffect(()=>{
    config_d.data = tagLayers;
    config1_d.data = tagLayers;
    setConfig(JSON.parse(JSON.stringify(config_d)));
    setConfig1(JSON.parse(JSON.stringify(config1_d)));
  },[tagLayers])
  //打开树弹窗 左侧搜索标签(设置按钮)  
  const showTreeModal = () => {
    dispatch({
      type: 'setTagPanel/isModalVisible',
      payload: true,
    });
  };
  //打开创建标签弹窗(左侧)
  const showCreateTagModal = () => {
    dispatch({
      type:'setTagPanel/setModalType',
      payload:'create',
    })
    dispatch({
      type: 'setTagPanel/isCreateModalVisible',
      payload: true,
    });
  };
  const { DirectoryTree } = Tree;

  //标签切换 (左侧树形select选中)
  const onSelect = (keys, info) => {
    console.log(keys,info);
    if(info.node.isLeaf) {
      dispatch({
        type: 'setTagPanel/labelDefaults',
        payload: keys,
      });
      // 点击左侧树形结构时根据id去查找对应的数据
      dispatch({
        type: 'setTagPanel/labelDistributionData',
        payload: {
          method: 'get',
          id: keys[0].split(",")[1],
          params: {}
        },
      });
    }
  };

  //编辑
  const compile = () => {
    dispatch({
      type:'setTagPanel/setModalType',
      payload:'edit',
    })
    dispatch({
      type: 'setTagPanel/isCreateModalVisible',
      payload: true,
    });
    if(labelDistributionList.createType == 'CUSTOMIZE') {
      dispatch({
        type: 'setTagPanel/isCustomFlag',
        payload: true,
      });
      dispatch({
        type: 'setTagPanel/num',
        payload: 1,
      });
      dispatch({
        type: 'setTagPanel/getLabelAllInfoData',
        payload: {
          method: 'get',
          id: labelDistributionList.id,
          params: {}
        },
      });
    }
    if(labelDistributionList.createType == 'IMPORT') {
      dispatch({
        type: 'setTagPanel/isCustomFlag',
        payload: false,
      });
      dispatch({
        type: 'setTagPanel/num',
        payload: 1,
      });
      dispatch({
        type: 'setTagPanel/getImportLabelAllInfoData',
        payload: {
          method: 'get',
          id: labelDistributionList.id,
          params: {}
        },
      });
      
    }
    
  }

  //手动刷新
  const refresh = (flag, id) => {
    if(flag == 'MANUAL') {
      dispatch({
        type: 'setTagPanel/putLabelRefreshData',
        payload: {
          method: 'put',
          id: id,
          params: {}
        },
        callback:(res)=>{
          if(res.result.code =='0'){
            message.success('刷新成功');
          }else{
            Modal.info({
              content: res.result.message || '刷新失败',
            });
          }
        }
      });
    }
  }

  //监听
  useEffect(()=>{
    if(treeList.length) {
      let treeData = JSON.parse(JSON.stringify(treeList))
      treeData.forEach((item) => {
        if(item.children) {
          item.children.forEach((itemSon) => {
            if(itemSon.children) {
              itemSon.children.forEach((itemGrandson) => {
                itemGrandson.icon = <TagOutlined />
              })
            }
          })
        }
      })
      setTreeData(treeData)
      if(labelDefaults.length) {
        dispatch({
          type: 'setTagPanel/labelDistributionData',
          payload: {
            method: 'get',
            id: labelDefaults[0]?labelDefaults[0].split(",")[1]:'',
            params: {}
          },
        });
      }
    }
  },[treeList])
  useEffect(()=>{
    labelDistributionList.tagLayers?setTagLayers(labelDistributionList.tagLayers):'';
  },[labelDistributionList])

  //审核
  const handleOk = (num) => {
    setConfirmLoading(true);
    let type;
    let payload;
    //标签审核
    if(num===0 || num===1)  {
      type = 'setTagPanel/putLabelAuditData';
      payload = {
        method: 'put',
        id: labelDistributionList.id,
        pass: num,
        params: {}
      }
    }
    // 标签暂停
    if(num===2) {
      type = 'setTagPanel/putLabelPauseData';
      payload = {
        method: 'put',
        id: labelDistributionList.id,
        params: {}
      }
    }
    // 标签重启
    if(num===3) {
      type = 'setTagPanel/putLabelRebootData';
      payload = {
        method: 'put',
        id: labelDistributionList.id,
        params: {}
      }
    }
    dispatch({
      type: type,
      payload: payload,
      callback: (res) => {
        //根据标签ID获取首页需要标签信息
        getTagData();
      }
    });
  };
  const getTagData=()=>{
    dispatch({
      type: 'setTagPanel/labelDistributionData',
      payload: {
        method: 'get',
        id: labelDistributionList.id,
        params: {}
      },
    });
    setConfirmLoading(false);
    setVisible(false);
  }
  const getTreeData=()=>{
    dispatch({
      type: 'setTagPanel/getGroupAllData',
      payload: {
        method: 'get',
        params: {
          tagNameLike: tagName,
          channelIds: tokenObj.channelId,
          refreshType: refreshType,
          createTypes: createTypes.join(','),
          tagStatuses: tagStatuses.join(',')
        }
      },
    });
  }
  
  // 加载左侧树形数据
  useEffect(() => {
    getTreeData();
  }, [tagName,toSearch]);
  //重置
  const resetForm = ()=>{
    setRefreshType(null);
    setTagStatuses([]);
    setCreateTypes([]);
    setToSearch(!toSearch)
  }
  const search = ()=>{
    getTreeData();
  }
  const searchEnter=(value)=>{
    setTagName(value);
  }

  // 导入-失败结果报告(下载) 
  const clickDownload = (id, name) => {
    dispatch({
      type: 'setTagPanel/getDownloadFile',
      payload: {
        method: 'get',
        params: {
          fileCode: id
        },
        responseType: 'blob'
      },
      callback: (res) => {
        if(res) {
          const url = window.URL.createObjectURL(new Blob([res], {type: "application/x-www-form-urlencoded"}))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', name+'.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    });
  }
  
  const getSelectList = ()=>{
    if(!actionSelectData.oneList.length){
      dispatch({
        type: 'dataModule_common/getMetaMess',
        payload: {
          method: 'get',
          params: {}
        }
      })
    }
    if(!attributeSelectData.oneList.length){
      dispatch({
        type: 'dataModule_common/getTagEvent',
        payload: {
          method: 'get',
          params: {}
        }
      })
    }
  }
  useEffect(() => {
    getSelectList();
  }, []);

  //去激活
  const toActive=()=>{
    Modal.confirm({
      title: '提示',
      content: '确定激活该标签吗？激活后系统将自动更新',
      okText: '确认',
      cancelText: '取消',
      onOk:()=>{
        dispatch({
          type: 'setTagPanel/channelTagActive',
          payload: {
            method: 'put',
            id: labelDistributionList.id,
          },
          callback:(res)=>{
            if(res.result.code =='0'){
              message.success('激活成功');
              getTagData();
            }else{
              message.error(res.result.message || '激活失败');
            }
          }
        })
      }
    });
  }

  return (
    <div>
      <div className={style.contentHeader}>
        <Form className={style.form_cont} >
          <Row>
            <Col span={8}> 
              <Form.Item label="标签状态" labelCol={{flex: '0 0 120px'}} >
                <Select placeholder="不限" value={tagStatuses} mode="multiple" showArrow style={{ width: '100%' }} onChange={(e)=> {setTagStatuses(e)}}>
                  {
                    labelState.map((item, key) => <Option key={key} value={item.id}>{item.value}</Option>)
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="创建方式" labelCol={{flex: '0 0 120px'}}>
                <Select placeholder="不限" value={createTypes} mode="multiple" showArrow onChange={(e)=> {setCreateTypes(e)}}>
                  {
                    createAWay.map((item, key) => <Option key={key} value={item.id}>{item.value}</Option>)
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="更新方式"  labelCol={{flex: '0 0 120px'}}>
                <Select placeholder="不限" value={refreshType} showArrow onChange={(e)=> {setRefreshType(e)}}>
                  {
                    updateMode.map((item, key) => <Option key={key} value={item.id}>{item.value}</Option>)
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row justify='end'>
            <Space size={22} >
              <Button onClick={resetForm} >重置</Button>
              <Button onClick={search} type="primary">查询</Button>
              <Button onClick={showCreateTagModal} className={style.form_item_button} type="primary">创建用户标签</Button>
            </Space>
          </Row>
        </Form>
      </div>
      <div className={style.contentBox}>
        <div className={style.content_left}>
          <div className={style.content_left_search}>
            <Row wrap={false}>
              <Col flex="auto">
                <Search onSearch={searchEnter} allowClear
                className={style.content_left_search_input}  placeholder="搜索标签" />
              </Col>
              <Col flex="none">
                <Button onClick={showTreeModal} className={style.content_left_search_setting} shape="circle" icon={<SettingOutlined />} />
              </Col>
            </Row>
          </div>
          <div className={style.content_tree}>
            {
              treeData.length > 0 ?
                <DirectoryTree
                  multiple
                  defaultExpandAll
                  selectedKeys={labelDefaults}
                  onSelect={onSelect}
                  treeData={treeData}
                />
              :''
            }
          </div>
        </div>
        <div className={style.content_right}>
          <div className={style.content_right_status}>
            <div className={style.content_right_status_title}>
              <div className={style.left}>用户标签</div>
              <div className={style.right}>平台管理员</div>
              <div className={style.right}>字符串</div>
              <div className={style.right}>条件规则创建-自定义标签值</div>
              {
                labelDistributionList.refreshType==='MANUAL' ?
                <div onClick={()=> {refresh(labelDistributionList.refreshType, labelDistributionList.id)}}
                className={`${style.right} ${style.point}`}>手动更新&nbsp;&nbsp;<i><SyncOutlined /></i></div>:
                labelDistributionList.refreshType==='AUTO' ?
                <div className={style.right}>自动更新</div>:
                <div className={style.right}>
                  {
                  labelDistributionList.importStatus=='SUCCESS'?
                  <span className={styles.success} >导入-成功</span>:labelDistributionList.importStatus=='FAIL'?
                  <span onClick={()=> {clickDownload(labelDistributionList.importResultFileCode, labelDistributionList.groupName)}} className={styles.fail} >导入-失败（结果报告）</span>:
                  <a>导入-校验中</a>
                }
                </div>
              }
              {/* <div className={style.right}>用户标签</div> */}
            </div>
            <div className={style.content_right_status_name}>
              <span>{labelDistributionList.firstGroupName}&nbsp;-&nbsp;{labelDistributionList.secondGroupName}&nbsp;-&nbsp;</span>{labelDistributionList.tagName}
              {
                labelDistributionList.tagStatus=='PENDING'?
                <div onClick={() => {setVisible(true)}} className={style.content_right_state_icon1} >
                  待审核
                <img src={icon1} alt=""/>
              </div>:''
              }
              {
                labelDistributionList.tagStatus=='PASS'?
                <div onClick={() => {labelDistributionList.refreshType=='AUTO'?setVisible(true):''}} className={style.content_right_state_icon2} >
                  审核通过
                  <img src={icon2} alt=""/>
                </div>:''
              }
              {
                labelDistributionList.tagStatus=='FAIL' || labelDistributionList.tagStatus=='PAUSE'?
                <div onClick={() => {labelDistributionList.tagStatus=='PAUSE'?setVisible(true):''}} className={style.content_right_state_icon3} >
                  {labelDistributionList.tagStatus=='FAIL'?'审核拒绝':'暂停'}
                  <img src={icon3} alt=""/>
                </div>:''
              }
              {
                labelDistributionList.tagStatus=='PENDING'?
                <Modal
                  title="审核提示："
                  visible={visible}
                  confirmLoading={confirmLoading}
                  onCancel={()=> {setVisible(false)}}
                  footer={[
                    <Button key="back" onClick={() => {handleOk(0)}}>
                      拒绝
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => {handleOk(1)}}>
                      通过
                    </Button>
                  ]}
                >
                  <p>所选标签在待审核状态，请审核。</p>
                </Modal>:''
              }
              {
                labelDistributionList.refreshType=='AUTO'&&labelDistributionList.tagStatus=='PASS' || labelDistributionList.refreshType=='AUTO'&&labelDistributionList.tagStatus=='PAUSE'?
                <Modal
                  title="提示："
                  visible={visible}
                  confirmLoading={confirmLoading}
                  onCancel={()=> {setVisible(false)}}
                  footer={[
                    <Button key="back" onClick={() => {setVisible(false)}}>
                      取消
                    </Button>,
                    <Button key="submit" type="primary" 
                      onClick={() => {labelDistributionList.tagStatus=='PASS'?handleOk(2):labelDistributionList.tagStatus=='PAUSE'?handleOk(3):''}}>
                      确认
                    </Button>
                  ]}
                >
                  <p>{labelDistributionList.tagStatus=='PASS'?'请选择是否暂停！':labelDistributionList.tagStatus=='PAUSE'?'请选择是否重启！':''}</p>
                </Modal>:''
              }
              {
                labelDistributionList.active ? <div className={style.active_box}>状态：激活</div>:<>
                  <div className={style.active_box}>状态：未激活 
                  <Button type='primary' size='small' onClick={toActive}>去激活</Button></div> 
                </>
              }
            </div>
            <div className={style.content_right_status_des}>{labelDistributionList.remark}</div>
            <div onClick={compile} className={style.content_right_status_rule}>
              通过自定义规则，将用户分为{tagLayers.length}个层, 分别为 {
                tagLayers.map(v => (
                  <span >{v.layerName}，</span>
                ))
              }
              &gt;
            </div>
          </div>
          
          <div className={style.content_right_distribution}>
            <div className={style.content_right_distribution_title}>标签详情</div>
            <div className={style.content_right_distribution_operation}>
              <div className={style.content_right_distribution_text}>标签人数分布</div>
              <div className={style.content_right_distribution_num}>共 {labelDistributionList.countNum?labelDistributionList.countNum:0} 人</div>
            </div>
            <div className={style.content_right_distribution_des}>
              基准时间：{labelDistributionList.calculationStartTime? moment(labelDistributionList.calculationStartTime).format('YYYY-MM-DD HH:mm:ss'):'null'}，
              计算完成于：{labelDistributionList.calculationEndTime? moment(labelDistributionList.calculationEndTime).format('YYYY-MM-DD HH:mm:ss'):'null'}
            </div>
            <div className={style.content_right_chart}>
              <div className={style.content_right_distribution_bar}>
                <Bar {...config} />
              </div>
              <div className={style.content_right_distribution_pie}>
                <Pie {...config1} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <TreeModal />
      <CreateTagModal />
      
    </div>
  )
}
export default connect(({ loading, setTagPanel,dataModule_common}) => ({
  loading: loading.effects['user/fetchCurrent'],
  treeList: setTagPanel.treeList,
  labelDefaults: setTagPanel.labelDefaults,
  labelDistributionList: setTagPanel.labelDistributionList,
  customerNameList: setTagPanel.customerNameList,
  isModalVisible: setTagPanel.isModalVisible,
  isCreateModalVisible: setTagPanel.isCreateModalVisible,
  attributeSelectData:dataModule_common.attributeSelectData,
  actionSelectData:dataModule_common.actionSelectData,
}))(TagPanel);
