import React, { useEffect, useState, } from "react"
import { connect, history } from 'umi'
import {
  Table,
  Modal,
  Button,
  message,
  Space
} from "antd"
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import style from "./style.less";
import {
  LtbItem,
  ListTable,
  ListTitle,
  StateBadge,
  ListTableBtns,
  ListTableTime,
} from "@/components/commonComp/index";

const { Column } = Table;
let levelConfigPage = (props) => {
  let { dispatch, list } = props;
  //提示弹窗
  let [isModal, setIsModal] = useState(false);
  let [isType, setIsType] = useState(1);    //1-启用 2-停用 3-最高删除
  let [toInfo, setToInfo] = useState({});    //当前操作所选
  //确认
  let configModal = () => {
    if (isType == 1) {
      updateGrowLevelStatus(toInfo, 2)
    } else if (isType == 2) {
      updateGrowLevelStatus(toInfo, 1)
    } else if (isType == 3) {
      deleteGrowLevel(toInfo);
    }
  }
  //取消
  let cancelModal = () => {
    setIsModal(false);
  }

  //列表
  let levelColumns = [
    {
      title: '等级顺序',
      dataIndex: 'key',
    }, {
      title: '等级名称',
      dataIndex: 'levelName',
    }, {
      title: '所需成长值',
      dataIndex: 'growValue',
    }, {
      title: '状态',
      dataIndex: 'growStatus',
      render: (growStatus, record) => statusRender(growStatus, record)
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (createTime, record) => {
        return <ListTableTime>{moment(createTime).format('YYYY-MM-DD HH:mm:ss')}</ListTableTime>
      }
    }, {
      title: '操作',
      dataIndex: 'growStatus',
      fixed: 'right',
      width: '18%',
      render: (growStatus, record) => operatingRender(growStatus, record)
    },
  ];
  let statusRender = (growStatus, record) => {
    let color = growStatus === 1 ? '#E02020' : '#03A854'
    return <StateBadge color={color}>{record.growStatusStr}</StateBadge>
  }
  //操作
  let operatingRender = (status, record) => {
    return <ListTableBtns showNum={3}>
      <LtbItem onClick={() => {editOperation(record)}}>
        {
          status === 2 ? '查看' : '编辑'
        }
      </LtbItem>
      <LtbItem onClick={() => {statusOperation(record, status === 1 ? 1 : 0)}}>
        {
          status === 1 ? '启用等级' : '停用等级'
        }
      </LtbItem>
      {
        status === 1 ? <LtbItem onClick={() => {delOperation(record)}}>删除</LtbItem> : null
      }
    </ListTableBtns>
  }
  //操作-启用停用
  let statusOperation = (record, type) => {
    setToInfo({ ...record })
    if (type === 1) {
      setIsType(1);
    } else {
      setIsType(2);
    }
    setIsModal(true);
  }
  //编辑跳转
  let editOperation = (record) => {
    history.replace({
      pathname: '/platformBuild/growthSystem/levelAdd',
      state: {
        objectId: record.id,
        growStatus: record.growStatus
      }
    })
  }
  //添加等级
  let goToAdd = () => {
    history.replace({
      pathname: '/platformBuild/growthSystem/levelAdd',
    })
  }
  //删除
  let delOperation = (info) => {
    if (info.key == 1) {   //最低等级提示
      message.error("无法删除最低的等级");
    } else {
      if (info.key == list.length) {  //最高等级删除二次确认
        setIsType(3);
        setIsModal(true);
        setToInfo({ ...info })
      } else {
        deleteGrowLevel(info)
      }
    }

  }
  //------
  useEffect(() => {
    queryGrowLevelList();
  }, []);
  // 查询列表
  const queryGrowLevelList = () => {
    let params = {
      pageNo: 1,
      pageSize: 100
    };
    dispatch({
      type: 'levelConfig/queryGrowLevelList',
      payload: {
        method: 'postJSON',
        params: params,
      },
    });
  }

  //删除
  let deleteGrowLevel = (info) => {
    dispatch({
      type: 'levelConfig/deleteGrowLevel',
      payload: {
        method: 'get',
        params: {},
        id: info.id,
      }, callback: (res) => {
        if (res.code === '0000') {
          setIsModal(false);
          queryGrowLevelList();
        } else {
          message.error(res.message)
        }
      }
    })
  }

  //更改状态
  let updateGrowLevelStatus = (info, status) => {
    dispatch({
      type: 'levelConfig/updateGrowLevelStatus',
      payload: {
        method: 'postJSON',
        params: {
          id: info.id,
          status: status
        },
      }, callback: (res) => {
        if (res.code === '0000') {
          setIsModal(false);
          queryGrowLevelList();
        } else {
          message.error(res.message)
        }
      }
    })
  }

  return (
      <>
        <div className={style.list_box}>
          <ListTitle titleName="等级配置">
            <Space size={8} className={style.space_box}>
              <span className={style.btn_radius_text}>等级顺序由低到高</span>
              <Button type='primary' onClick={goToAdd}>
                添加等级
              </Button>
            </Space>
          </ListTitle>
          <ListTable showPagination={false}>
            <Table
                locale={{ emptyText: '暂无数据' }}
                scroll={{ x: 1000 }}
                columns={levelColumns}
                dataSource={list}
                pagination={false}
                loading={{
                  spinning: false,
                  delay: 500
                }}
            />
          </ListTable>
        </div>
        <Modal title="提示" closable={false} visible={isModal} onOk={configModal} cancelText='否' okText='是' onCancel={cancelModal} >

          {
            isType === 1 ? <p>是否启用该等级？</p>
                : isType === 2 ? <p>是否停用该等级？</p>
                : isType === 3 ? <p>是否确认删除该等级，删除后该等级的存量用户数据将会重新计算？</p>
                    : null
          }
        </Modal>
      </>
  )
};
export default connect(({ levelConfig }) => ({
  list: levelConfig.list
}))(levelConfigPage)
