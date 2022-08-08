import React, { useEffect, useState, } from "react"
import { connect, history } from 'umi'
import {
  Form,
  message,
  Input,
  Table,
  Modal,
  Button,
  Select,
  Tooltip,
  InputNumber,
  Upload
} from "antd"
import { UploadOutlined, PlusOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { uploadIcon } from '@/services/activity.js';
import style from "./style.less";
import SelectPrize from '../components/selectPrize';   //奖品
const { Option } = Select
const { TextArea } = Input
const { confirm } = Modal
let levelAddPage = (props) => {
  let { dispatch, location } = props;
  let [form] = Form.useForm();
  let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));   //基础配置信息
  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  let [taskIds, setTaskIds] = useState(location.state && location.state.objectId || '');  //编辑带来的id 没有代表新建
  let [growStatus, setGrowStatus] = useState(location.state && location.state.growStatus && location.state.growStatus == 2 ? true : false);  //是否启用
  let [list, setList] = useState([]) //权益列表
  let [levelNum, setLevelNum] = useState(2) //等级福利选择
  //表单信息
  let [inFrom, setInFrom] = useState({
    levelName: '',   //等级名称
    growValue: '',   //成长值
    monthNum: null, //每月限制分数
  })
  let targetChange = (name, e) => {
    let toInFrom = inFrom;
    toInFrom[name] = e.target.value;
    setInFrom({ ...toInFrom });
  }
  let valueChange = (name, e) => {
    let toInFrom = inFrom;
    toInFrom[name] = e;
    setInFrom({ ...toInFrom });
  }
  //是否添加
  let [isAdd, setIsAdd] = useState(true);
  //下载显示图片
  let setDownload = (name) => {
    dispatch({
      type: 'addRight/download',
      payload: {
        method: 'get',
        responseType: 'blob',
        fileCode: name,
      }, callback: (res) => {
        setImageUrl(URL.createObjectURL(res))
      }
    })
  }
  /*上传配置*/
  let [imageUrl, setImageUrl] = useState(''); //icon
  // let [imageCode, setImageCode] = useState(''); //iconcode
  //  上传背景图
  let beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传JPG/PNG 格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('图片大小不能高于 5MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  let handleChange = info => {
    if (info.file.status === 'done') {
      setImageUrl(info.file.response.items)
    }
  };

  //删除
  let removeImg = () => {
    if (!growStatus) {
      setImageUrl('')
    }
  }
  //列表
  let [productList, setProductList] = useState([]);  //勾选的产品列表
  let [selectedRowKeys, setSelectedRowKeys] = useState([]);  //勾选的产品列表key
  let [selectedLegal, setSelectedLegal] = useState([]);  //勾选权益字符串
  let levelColumns = [
    {
      title: '权益名称',
      dataIndex: 'exhibitionName',
      width: '20%',
    }, {
      title: '说明',
      dataIndex: 'equityDesc',
      width: '30%',
    }, {
      title: '礼品设置',
      dataIndex: 'status',
      width: '50%',
      render: (status, record) => operatingRender(status, record)
    }
  ]
  //操作
  let operatingRender = (status, record) => {
    if (status) {
      return <div className={style.wrap_table_tool}>
        <span>选择礼品：</span><em>{record.equityPrizeList && record.equityPrizeList.length > 0 && record.equityPrizeList[0].prizeName && record.equityPrizeList[0].type != 7 ? record.equityPrizeList[0].prizeName : record.equityPrizeList && record.equityPrizeList.length > 0 && record.equityPrizeList[0].prizeName && record.equityPrizeList[0].type == 7 ? record.equityPrizeList[0].growthValue : '请选择'}{record.equityPrizeList && record.equityPrizeList.length > 0 && record.equityPrizeList[0].type == 6 ? '积分' : record.equityPrizeList && record.equityPrizeList.length > 0 && record.equityPrizeList[0].type == 7 ? '成长值' : ''}</em><i onClick={() => { giftSelect(record) }}>选择礼品</i>
      </div>
    } else {
      return
    }

  }
  //过滤取消勾选
  let filterList = (info) => {
    let toList = list;
    toList.forEach((e, i) => {
      let toType = false;
      info.forEach((n, j) => {
        if (e.id == n.id) {
          toType = true;
        }
      })
      if (!toType) {
        toList[i].equityPrizeList = [];
      }
    })
    setList([...toList]);
  }
  //列表-勾选
  let rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKey, selectedRows) => {
      setProductList([...selectedRows]);
      setSelectedRowKeys([...selectedRowKey])
      filterList(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: growStatus, // Column configuration not to be checked
    }),
    selectedRowKeys: selectedRowKeys
  };
  //添加商品区分类  1-升级奖励  2-权益
  let [addCommodType, setAddCommodType] = useState(1)

  //添加商品
  let [prizeVisible, setPrizeVisible] = useState(false); //选择奖品模态框状态
  let [prizeData, setPrizeData] = React.useState([]) //奖品
  let [toGitf, setToGitf] = React.useState({}) //当前选择的权益
  //奖励
  let [prizeList, setPrizeList] = useState([]);  //升级奖品

  //升级选择
  let addCommodityClick = (i) => {
    setPrizeVisible(true);
    setAddCommodType(1);
  }
  //删除奖励
  let filterPrize = (item, i) => {
    let toPrizeList = prizeList;
    toPrizeList.splice(i, 1);
    setPrizeList([...toPrizeList]);
  }
  //删除升级奖品
  let delePrize = (item, i) => {
    if (!growStatus) {
      if (item.levelId) {  //已保存奖励
        deletePrice(item, i);
      } else {
        filterPrize(item, i)
      }
    }
  }
  //权益-选择礼品
  let giftSelect = (info) => {
    if (!growStatus) {
      setPrizeVisible(true);
      setAddCommodType(2);
      setToGitf({ ...info });
    }
  }

  /*提示框*/
  let promptBox = (content) => {
    Modal.info({ content, okText: '确定' })
  }
  let [cardPrizeNameVisible, setCardPrizeNameVisible] = useState(false) // 卡券奖品展示名称模态框状态
  let [cardPrizeName, setCardPrizeName] = useState(''); // 卡券奖品展示名称
  /*确定选择奖品*/
  let onConfirmPrizeSet = () => {
    if (Object.keys(prizeData).length !== 0) {
      let { type, prizeAmount, prizeName, remark } = prizeData;
      let temp = prizeList;
      /*暂时关闭该校验*/
      if (type === '1') {
        let { cardPrizeList } = prizeData;
        if (cardPrizeList && cardPrizeList.length > 0) {
          let tempCardList = []
          for (let k = 0; k < cardPrizeList.length; k++) {
            if (!cardPrizeList[k].couponNum) {
              promptBox('请输入选中卡券数量!')
              return
            }
            if (cardPrizeList[k].defaultEffectiveDays <= 0) {
              promptBox('请设置选中卡券的有效期!')
              return
            }
          }
          cardPrizeList.map(item => {
            let tempData = JSON.parse(JSON.stringify(item))
            tempCardList.push(tempData)
          })
          if (!cardPrizeName) {
            setCardPrizeNameVisible(true)
            return
          }
          let toInfos = {
            prizeName: cardPrizeName,
            type: type,
            couponPrizeList: cardPrizeList,
            equityId: toGitf.equityId
          }
          if (addCommodType == 2) {   //权益
            let toList = list;
            toList.forEach((e, i) => {
              if (e.equityId == toGitf.equityId) {
                toList[i].equityPrizeList = [toInfos];
              }
            })
            setList([...toList]);
            let toproductList = productList;
            toproductList.forEach((e, i) => {
              if (e.equityId == toGitf.equityId) {
                toproductList[i].equityPrizeList = [toInfos];
              }
            })
            setProductList([...toproductList]);
          } else {     //升级
            temp.push(toInfos)
            setPrizeList([...temp])
          }

        } else {
          promptBox('请选择卡券!')
          return
        }
      }
      if (type === '2') {
        if (prizeData.pointsType === 1 && !prizeData.pointsLink) {
          promptBox('请输入领取链接！')
          return
        }
        if (prizeAmount && Number(prizeAmount) > 0) {
          let points = Number(prizeAmount)
          let tempNum = points / 200
          prizeData.points = points
          prizeData.prizeAmount = Number(tempNum.toFixed(2))
        } else {
          promptBox('海贝积分需大于0')
          return
        }
      }
      if (type === '3') {
        if (prizeName !== '') {
          if (Number(prizeAmount) <= 0) {
            promptBox('请输入现金红包金额!')
            return
          }
        } else {
          promptBox('请输入奖品名称!')
          return
        }
      }
      if (type === '4') {
        if (prizeName !== '') {
          if (Number(prizeAmount) <= 0) {
            promptBox('请输入单价!')
            return
          }
        } else {
          promptBox('请输入实物名称!')
          return
        }
      }
      if (type === '6') {
        if (!prizeName) {
          message.error('请输入积分');
          return;
        }
      }
      if (type === '7') {
        if (!prizeName) {
          message.error('请输入成长值');
          return;
        }
      }
      let tempPrize = {
        weightsNum: 0,
        winningNum: 0,
        prizeAmount: Number(prizeAmount)
      }
      if (type === '5') {
        if (!remark) {
          promptBox('请输入谢谢参与文案!')
          return
        } else {
          tempPrize.remark = remark
        }
      }
      if (type !== '1') {
        let toInfos2 = {
          prizeName: prizeData.prizeName,
          prizeAmount: prizeData.prizeAmount,
          num: 1,
          tradeDisplayName: '',
          tradeDescribe: '',
          prizeImg: '',
          isTradeTag: 0,
          tradeTag: '',
          type: type,
          points: prizeData.points || '',
          pointsType: prizeData.pointsType || '',
          pointsLink: prizeData.pointsLink || '',
          equityId: toGitf.equityId
        }
        if (type == '7') {
          toInfos2.prizeName = '成长值';
          toInfos2.growthValue = prizeData.prizeName;
        }
        if (addCommodType == 2) {   //权益
          let toList2 = list;
          toList2.forEach((e, i) => {
            if (e.equityId == toGitf.equityId) {
              toList2[i].equityPrizeList = [toInfos2];
            }
          })
          setList([...toList2]);
          let toproductList = productList;
          toproductList.forEach((e, i) => {
            if (e.equityId == toGitf.equityId) {
              toproductList[i].equityPrizeList = [toInfos2];
            }
          })
          setProductList([...toproductList]);
        } else {
          temp.push(toInfos2)
          setPrizeList([...temp])
        }
      }
      setPrizeVisible(false)
    } else {
      promptBox('请选择奖品!')
    }
  }
  /*获取选中奖品信息*/
  let getPrizeData = (props) => {
    setPrizeData(props.prizeData);
  }
  /*卡券奖品名称确定事件*/
  let onOkCardPrizeName = () => {
    if (!cardPrizeName) {
      promptBox('请输入奖品展示名称！')
    } else {
      onConfirmPrizeSet()
      setCardPrizeNameVisible(false)
      setCardPrizeName('');
    }
  }
  //取消
  let hisTask = () => {
    history.replace({
      pathname: '/platformBuild/growthSystem/levelConfig',
    })
  }
  //确定
  let configLevelAdd = () => {
    console.log()
    if (!inFrom.levelName) {
      message.error('请输入等级名称')
      return false;
    } else if (typeof inFrom.growValue != 'number' || inFrom.growValue < 0) {
      message.error('请输入需要成长值')
      return false;
    }
    //  else if (prizeList.length <= 0) {
    //   message.error('请添加升级奖励礼品')
    //   return false;
    // } else if (!inFrom.monthNum) {
    //   message.error('请输入每月份数')
    //   return false;
    // } 
    else {
      saveGrowLevel();
    }
  }
  //删除奖励
  let deletePrice = (name, ins) => {
    let params = {
      growthId: name.levelId,
      id: name.id
    }
    dispatch({
      type: 'levelAdd/deletePrice',
      payload: {
        method: 'postJSON',
        params: params
      }, callback: (res) => {
        if (res.code === '0000') {
          filterPrize(name, ins)
        } else {
          message.error(res.message)
        }
      }
    })
  };
  /*限制数字输入框只能输入整数*/
  let limitNumber = (value) => {
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(/\D/g, '') : ''
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(/\D/g, '') : ''
    } else {
      return null
    }
  }
  let [growLevelInfo, setGrowLevelInfo] = useState({});
  //-------
  useEffect(() => {
    queryEquityManagementList();
    //编辑回显
    if (taskIds) {
      queryEquityManagement();
    }
  }, [])
  useEffect(() => {
    let toSelectedLegal = '';
    let toList = list;
    //过滤礼品设置是否显示
    if (list && list.length > 0) {
      toList.forEach((e, i) => {
        toList[i].status = false;
        if (productList && productList.length > 0) {
          productList.forEach((j) => {
            if (j.equityId == e.equityId) {
              toList[i].status = true;
            }
          })
        }
      })
    }
    setList([...toList]);


    //已选择过滤文案
    if (productList && productList.length > 0) {
      productList.forEach((e) => {
        toSelectedLegal = toSelectedLegal + e.equityTypeStr + '； '
      })
    }
    setSelectedLegal(toSelectedLegal)
  }, [productList])
  useEffect(() => {
    if (growLevelInfo && growLevelInfo.equityLevelPrizeList && growLevelInfo.equityLevelPrizeList.length > 0 && list && list.length > 0) {
      let toSelectedRowKeys = [];
      let toEquityLevelPrizeList = growLevelInfo.equityLevelPrizeList;
      let toList = list;
      list.forEach((item, i) => {
        growLevelInfo.equityLevelPrizeList.forEach((childs, n) => {
          if (item.equityId == childs.equityId) {
            toSelectedRowKeys.push(i);
            toEquityLevelPrizeList[n].equityTypeStr = item.equityTypeStr;
            toList[i].equityPrizeList = childs.equityPrizeList;
          }
        })
      })
      setSelectedRowKeys([...toSelectedRowKeys]);
      setProductList([...toEquityLevelPrizeList]);
      setList([...toList])
      setGrowLevelInfo({ ...{} })
    }
  }, [growLevelInfo, list])
  // 查询列表
  const queryEquityManagementList = () => {
    let params = {
      pageNo: 1,
      pageSize: 100
    };
    dispatch({
      type: 'levelAdd/queryEquityManagementList',
      payload: {
        method: 'postJSON',
        params: params,
      }, callback: (res) => {
        if (res.code === '0000') {
          let toList = res.items.list;
          toList = toList.map((item, i) => { item.key = i; item.equityId = item.id; delete item.id; return item; })
          setList([...toList]);
        } else {
          message.error(res.message)
        }
      }
    });
  }
  // 保存
  const saveGrowLevel = () => {
    let params = inFrom;
    params.growLevelPrizeList = prizeList;
    params.badge = imageUrl;
    params.id = taskIds;
    params.monthNum = params.monthNum ? params.monthNum : 0;
    params.equityLevelPrizeList = productList;
    dispatch({
      type: 'levelAdd/saveGrowLevel',
      payload: {
        method: 'postJSON',
        params: params,
      }, callback: (res) => {
        if (res.code === '0000') {
          message.info('保存成功')
          hisTask();
        } else {
          message.error(res.message)
        }
      }
    });
  }


  //回显
  let queryEquityManagement = () => {
    dispatch({
      type: 'levelAdd/queryGrowLevel',
      payload: {
        method: 'get',
        params: {
          id: taskIds
        },
      }, callback: (res) => {
        if (res.code === '0000') {
          let toinFrom = {
            levelName: res.items.levelName,
            growValue: res.items.growValue,
            monthNum: res.items.monthNum ? res.items.monthNum : null
          }
          setInFrom({ ...toinFrom });

          if (res.items.badge) {
            setImageUrl(res.items.badge);
          }
          if (res.items.growLevelPrizeList) {
            setPrizeList([...res.items.growLevelPrizeList]);
          }


          let toItems = res.items;
          setGrowLevelInfo({ ...toItems })
        } else {
          message.error(res.message)
        }
      }
    })
  }
  return (
    <>
      {/*选择商品*/}
      {
        prizeVisible ? <Modal
          width={1200}
          okText="确定"
          title="选择商品"
          cancelText="取消"
          closable={false}
          maskClosable={false}
          visible={prizeVisible}
          onOk={onConfirmPrizeSet}
          // afterClose={getBudget}
          onCancel={() => { setPrizeVisible(false) }}
        >
          <SelectPrize onOk={getPrizeData} activityType='3' />
          <Modal
            onOk={onOkCardPrizeName}
            closable={false}
            maskClosable={false}
            visible={cardPrizeNameVisible}
            onCancel={() => {
              setCardPrizeNameVisible(false)
              setCardPrizeName('')
            }}
          >
            <div>
              <span>
                奖品展示名称
                <Tooltip title="在活动中展示的名称">
                  <InfoCircleOutlined className={style.wrap2_ico} />
                </Tooltip>：
              </span>
              <Input
                value={cardPrizeName}
                style={{ width: '150px' }}
                onChange={(e) => { setCardPrizeName(e.target.value) }}
              />
            </div>
          </Modal>
        </Modal> : null
      }



      <div className={style.block__cont}>
        <div className={style.block__header}>{isAdd ? '添加等级' : '编辑等级'}</div>
        <Form form={form}>
          <div className={style.level_wrap1}>
            <Form.Item label="等级名称" className={style.level_wrap1_pn1}>
              <Input placeholder='给等级取个名字' value={inFrom.levelName} onChange={(e) => { targetChange('levelName', e) }} disabled={growStatus} />
            </Form.Item>
            <Form.Item label="需要成长值" className={style.level_wrap1_pn2}>
              <InputNumber className={style.level_wrap1_pn2_num} min={0} value={inFrom.growValue} placeholder='请输入整数' onChange={(e) => { valueChange('growValue', e) }} disabled={growStatus} parser={limitNumber} formatter={limitNumber} />
            </Form.Item>
          </div>
          <div className={style.level_wrap3}>
            <div className={style.level_wrap_h2}>奖励与福利</div>
            <div className={style.level_wrap2_main}>
              <div className={style.level_main_left}>
                {/* <div className={`${style.level_main_lbox} ${style.level_main_lbox1}`}>
                  <h4>升级奖励</h4>
                  <div className={`${style.level_main_lf_li} ${style.level_main_lf_li2} ${levelNum == 1 ? style.level_main_lf_lion : null}`} onClick={() => { setLevelNum(1) }}>
                    <h6>XXX卡券<br />XXX积分</h6>
                  </div>
                </div> */}
                <div className={`${style.level_main_lbox} ${style.level_main_lbox2}`}>
                  <h4>等级福利</h4>
                  <div className={`${style.level_main_lf_li} ${style.level_main_lf_li2} ${levelNum == 2 ? style.level_main_lf_lion : null}`} onClick={() => { setLevelNum(2) }}>
                    <h3>页面皮肤</h3>
                    <img src={require('../../../assets/level_m5.png')}></img>
                  </div>
                  <div className={`${style.level_main_lf_li} ${style.level_main_lf_li2} ${levelNum == 3 ? style.level_main_lf_lion : null}`} onClick={() => { setLevelNum(3) }}>
                    <h3>徽章</h3>
                    <img src={require('../../../assets/level_m4.png')}></img>
                  </div>
                  <div className={`${style.level_main_lf_li} ${style.level_main_lf_li2} ${levelNum == 4 ? style.level_main_lf_lion : null}`} onClick={() => { setLevelNum(4) }}>
                    <h3>头像框</h3>
                    <img src={require('../../../assets/level_m6.png')}></img>
                  </div>
                  <div className={`${style.level_main_lf_li} ${style.level_main_lf_li3} ${levelNum == 5 ? style.level_main_lf_lion : null}`} onClick={() => { setLevelNum(5) }}>
                    <h3>权益</h3>
                    <p>已选择{productList.length}项权益</p>
                  </div>
                </div>
              </div>
              <div className={style.level_main_right2}>
                {
                  levelNum == 1 ?
                    <div className={style.level_mr_box6}>
                      <h2>礼品</h2>
                      <div className={style.level_main_rg_box1}>
                        {
                          prizeList.map((item, key) => {
                            return <p><span>{item.type == 7 ? item.growthValue : item.prizeName}{item.type == 6 ? '积分' : item.type == 7 ? '成长值' : ''}</span><DeleteOutlined className={style.level_main_rg_box1_del} onClick={(e) => {
                              delePrize(item, key)
                            }} /></p>
                          })
                        }
                      </div>
                      <Button type="primary" disabled={growStatus} className={style.level_main_rg_btn} onClick={addCommodityClick}><PlusOutlined />添加礼品</Button>
                      <h2>每月份数限制</h2>
                      <div className={style.level_wrap2_box2}>
                        <Form.Item label="">
                          <InputNumber className={style.level_wrap2_box2_num} min={1} value={inFrom.monthNum} parser={limitNumber} formatter={limitNumber} placeholder='请输入整数' onChange={(e) => { valueChange('monthNum', e) }} disabled={growStatus} />
                        </Form.Item>
                        <em>份</em>
                      </div>
                      <div className={style.level_wrap2_box3}>若每个月库存消耗完，用户得在次月领取，每次设置后在次月1日再生效</div>
                    </div> :
                    levelNum == 2 ?
                      //页面皮肤
                      <div className={style.level_mr_box1}>
                        <h2>敬请期待</h2>
                      </div>
                      : levelNum == 3 ?
                        //页面皮肤
                        <div className={style.level_mr_box2}>
                          <h2>选择徽章</h2>
                          <div className={style.level_mr_box2_badge}>
                            <div className={`${style.level_mr_box2_badge_img} ${imageUrl ? style.level_mr_box2_badge_img2 : null}`}><img src={imageUrl ? imageUrl : require('../../../assets/level_m3.png')}></img></div>
                            <div className={style.level_mr_box2_badge_btn}>
                              {/* <Upload {...uploadConfig} className={style.level_mr_box2_badge_btns}> */}
                              <Upload name="files" action={uploadIcon} beforeUpload={beforeUpload} onChange={handleChange} headers={headers} showUploadList={false} className={style.level_mr_box2_badge_btns}>
                                <Button icon={<UploadOutlined />} className={style.level_mr_box2_badge_btn_child} disabled={growStatus}>{imageUrl ? '重新上传' : '上传图片'}</Button>
                              </Upload>
                              {
                                imageUrl ? <p className={style.level_mr_box2_badge_remove}><span onClick={removeImg}>删除</span></p> : <p className={style.level_mr_box2_badge_bpn}>建议尺寸：120px*120px</p>
                              }
                            </div>
                          </div>
                        </div>
                        : levelNum == 4 ?
                          //头像框
                          <div className={style.level_mr_box3}>
                            <h2>敬请期待</h2>
                          </div>
                          : levelNum == 5 ?
                            //权益
                            <div className={style.level_mr_box4}>
                              <h2>选择权益</h2>
                              <div className={style.level_rbox4_nav}>已选择：{selectedLegal}</div>
                              <Table
                                locale={{ emptyText: '暂无数据' }}
                                scroll={{ x: 1000 }}
                                columns={levelColumns}
                                rowSelection={rowSelection}
                                dataSource={list}
                                pagination={false}
                                loading={{
                                  spinning: false,
                                  delay: 500
                                }}
                              />
                            </div>
                            : null
                }

              </div>
            </div>
            <div className={style.level_main_bom}>
              <Button onClick={hisTask}>取 消</Button>
              <Button type="primary" onClick={configLevelAdd}>确 定</Button>
            </div>
          </div>


        </Form>
      </div>
    </>
  )
};
export default connect(({ levelAdd }) => ({
}))(levelAddPage)
