//树弹窗
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import style from './styles.less';
import { Row, Col, Form, Select, Input, Button, Tree, Modal, Tooltip } from 'antd';
import { TagOutlined } from '@ant-design/icons';

const TreeModal = (props) => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [NodeTreeItem, setNodeTreeItem] = useState(null);
  const [rechristen, setRechristen] = useState('');
  const [treeData, setTreeData] = useState([]);

  const [form] = Form.useForm();

  const { isModalVisible, treeList, dispatch } = props;
  const { DirectoryTree } = Tree;
  const onSelect = (keys, info) => {
      setNodeTreeItem(null) 
  };

  const onScrollCapture = () => {
    setNodeTreeItem(null);
  }

  const onRightClick = ({ event, node }) => {
    const positionInfo = event.currentTarget.getBoundingClientRect();
    const x = positionInfo.width;
    const y = positionInfo.top;
    setNodeTreeItem(
      {
        NodeTreeItem: {
          pageX: x,
          pageY: y,
          id: node.props.eventKey,
          name: node.props.title,
          isLeaf: node.props.isLeaf,
          rank: node.props.rank,
          category: 2
        }
      }
    )
  }


  const onExpand = () => {
    setNodeTreeItem(null)
  };
  const getNodeTreeMenu = () => {
    const { pageX, pageY } = { ...NodeTreeItem.NodeTreeItem };
    const toTop = document.querySelector('.ant-modal');
    const tmpStyle = {
      position: 'absolute',
      maxHeight: 40,
      textAlign: 'center',
      left: `${pageX - 140}px`,
      top: `${pageY - toTop.offsetTop}px`,
      display: 'flex',
      flexDirection: 'row',
      zIndex: 999
    };
    const menu = (
      <div
        style={tmpStyle}
      >
        <div style={{ alignSelf: 'center', marginLeft: 10 }} onClick={() =>{handleAddSub(1)}} className={style.cursor_pointer}>
          <Tooltip placement="bottom" title="重命名">
            重命名
          </Tooltip>
        </div>
        {
          NodeTreeItem.NodeTreeItem.rank==1?
            <div style={{ alignSelf: 'center', marginLeft: 10 }} onClick={() => {handleAddSub(2)}} className={style.cursor_pointer}>
              <Tooltip placement="bottom" title="添加下级目录">
                下方添加目录
              </Tooltip>
            </div>
          :''
        }
        {/* {
          NodeTreeItem.NodeTreeItem.rank==1?
            <div style={{ alignSelf: 'center', marginLeft: 10 }} onClick={() => {handleAddSub(3)}} className={style.cursor_pointer}>
              <Tooltip placement="bottom" title="添加一级目录">
                添加一级目录
              </Tooltip>
            </div>
          :''
        } */}
        {/* {NodeTreeItem.category === 1 ? '' : (
          <div style={{ alignSelf: 'center', marginLeft: 10 }} onClick={handleDeleteSub} className={style.cursor_pointer}>
            <Tooltip placement="bottom" title="删除">
              删除
            </Tooltip>
          </div>
        )} */}
      </div>
    );
    return (NodeTreeItem == null || NodeTreeItem.NodeTreeItem.isLeaf) ? '' : menu;
  }

  const handleAddSub = (num) => {
    // 写自己的业务逻辑
    setIsAdd(num);
    setIsAddModalVisible(true);
  }

  const handleDeleteSub = () => {
    // 写自己的业务逻辑
    setIsDeleteModalVisible(true);
  }

  //添加1级目录
  const handleOk = () => {
    handleAddSub(3)
  };

  const handleCancel = () => {
    dispatch({
      type: 'setTagPanel/isModalVisible',
      payload: false,
    });
  };
  //重命名 && 下方添加目录
  const handleAddOk = () => {
    form.setFieldsValue({
      lableName: '',
    })
    //重命名
    if(isAdd ==1) {
      dispatch({
        type: 'setTagPanel/putGroupName',
        payload: {
          method: 'put',
          name: rechristen,
          id: NodeTreeItem.NodeTreeItem.id.split(",")[1],
          params: {}
        },
        callback: (res) => {
          setIsAddModalVisible(false);
          dispatch({
            type: 'setTagPanel/getGroupAllData',
            payload: {
              method: 'get',
              params: {}
            },
          });
        }
      })
    }
    //添加下级目录 && 添加1级目录
    if (isAdd == 2 || isAdd == 3) {
      dispatch({
        type: 'setTagPanel/addGroup',
        payload: {
          method: 'postJSON',
          params: {
            tagGroupName: rechristen,
            parentId: isAdd == 2 ? NodeTreeItem.NodeTreeItem.id.split(",")[1] : -1,
            sort: 1,
          }
        },
        callback: (res) => {
          setIsAddModalVisible(false);
          dispatch({
            type: 'setTagPanel/getGroupAllData',
            payload: {
              method: 'get',
              params: {}
            },
          });
        }
      })
    }
  };

  const handleAddCancel = () => {
    
    setIsAddModalVisible(false);
  };
  //删除
  const handleDeleteOk = () => {
    dispatch({
      type: 'setTagPanel/delGroup',
      payload: {
        method: 'delete',
        id: NodeTreeItem.NodeTreeItem.id.split(",")[1],
        params: {}
      },
      callback: (res) => {
        setIsDeleteModalVisible(false);
        dispatch({
          type: 'setTagPanel/getGroupAllData',
          payload: {
            method: 'get',
            params: {}
          },
        });
      }
    })
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  //监听
  useEffect(()=>{
    if(treeList.length) {
      let treeData = JSON.parse(JSON.stringify(treeList))
      treeData.forEach((item) => {
        if(item.children) {
          item.children.forEach((itemSon) => {
            // itemSon.children = null
            if(itemSon.children) {
              itemSon.children.forEach((itemGrandson) => {
                itemGrandson.icon = <TagOutlined />
              })
            }
          })
        }
      })
      setTreeData(treeData)
    }
  },[treeList])


  return (
    <div>
      <Modal title="目录设置 (选中后右键设置)" className={style.modelInner} width={700} visible={isModalVisible} onCancel={handleCancel}
        footer={[
          <Button
            className={style.btnleft}
            type="primary"
            key="ok"
            onClick={handleOk}
          >
            添加一级目录
      </Button>,
          <Button
            type="default"
            key="cancel"
            onClick={handleCancel}
          >
            确定
      </Button>,
        ]}>
        <div className={style.content} onScrollCapture={onScrollCapture}>
          <div className={style.content_tree}>
            {
              treeData.length > 0 ?
              <DirectoryTree
                multiple
                defaultExpandAll
                onSelect={onSelect}
                onExpand={onExpand}
                treeData={treeData}
                onRightClick={onRightClick}
              />:''
            }
          </div>
        </div>
        {NodeTreeItem != null ? getNodeTreeMenu() : ""}
      </Modal>
      <Modal title={isAdd==1? '重命名' : '添加'} visible={isAddModalVisible} onCancel={handleAddCancel}
        footer={[
          <Button
            type="primary"
            key="ok"
            onClick={handleAddOk}
          >
            {isAdd==1? '重命名' : '添加'}
          </Button>,
          <Button
            type="default"
            key="cancel"
            onClick={handleAddCancel}
          >
            取消
        </Button>,
        ]}>
        <Form form={form}>
          <Form.Item
            label="名称"
            name="lableName"
            rules={[
              {
                required: true,
                message: '',
              },
            ]}
          >
            <Input onChange={(e)=>setRechristen(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="标签删除提示" visible={isDeleteModalVisible} onCancel={handleDeleteCancel}
        footer={[
          <Button
            type="primary"
            key="ok"
            onClick={handleDeleteOk}
          >
            删除
        </Button>,
          <Button
            type="default"
            key="cancel"
            onClick={handleDeleteCancel}
          >
            取消
        </Button>,
        ]}>
        将删除所选标签，如该标签携带子标签，将同步删除，请确认是否继续删除！
      </Modal>
    </div>
  )
}
export default connect(({ setTagPanel }) => ({
  isModalVisible: setTagPanel.isModalVisible,
  treeList:setTagPanel.treeList,
}))(TreeModal);