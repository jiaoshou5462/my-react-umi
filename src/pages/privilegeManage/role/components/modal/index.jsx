import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import {
  Form,
  Input,
  Table,
  Modal,
  Tree,
  message,
  Checkbox,
  Transfer,
  Tooltip,
  Select
} from "antd"
import { FileTextOutlined } from '@ant-design/icons';
import style from "./style.less";
const { Column } = Table;
const { Option } = Select;
const { TextArea, Search } = Input;
const { DirectoryTree } = Tree;
let isChecked = false;//是否修改过菜单选中
const modal = (props) => {
  let { dispatch, modalInfo, toFatherValue } = props;
  console.log(modalInfo)
  //新增/修改角色
  const [addRoleName, setAddRoleName] = useState(modalInfo ? modalInfo.name : '')
  const [addRoleDes, setAddRoleDes] = useState(modalInfo ? modalInfo.remark : '')
  //配置权限
  const [treeData, setTreeData] = useState([])
  const [treeDataCheckedAll, setTreeDataCheckedAll] = useState([])
  const [treeDataChecked, setTreeDataChecked] = useState([])
  const [treeDataCheckedId, setTreeDataCheckedId] = useState([])
  //配置权限-设置
  const [configItem, setConfigItem] = useState('')
  const [btnList, setBtnList] = useState([])
  const [btnListChecked, setBtnListChecked] = useState([])
  //分配账号
  const [mockData, setMockData] = useState([])
  const [targetKeys, setTargetKeys] = useState([])

  //数据权限
  const [dataRole, setDataRole] = useState(modalInfo ? modalInfo.dataRole : null)

  //新增角色
  const addRole = () => {
    if (!addRoleName) return message.error({ style: { marginTop: '10vh', }, content: '请输入角色名称' });
    dispatch({
      type: 'roleManage/addRoleData',
      payload: {
        method: 'postJSON',
        params: {
          roleName: addRoleName,
          roleMessage: addRoleDes
        },
      },
      callback: (res) => {
        toFatherValue(res.body)
      }
    })
  }
  //角色停用/启用
  const banRole = () => {
    dispatch({
      type: 'roleManage/banRoleData',
      payload: {
        method: 'postJSON',
        params: {
          roleId: modalInfo.id,
          roleStatus: modalInfo.roleStatus
        },
      },
      callback: (res) => {
        toFatherValue(true)
      }
    })
  }
  //修改角色
  const putRole = () => {
    if (!addRoleName) return message.error({ style: { marginTop: '10vh', }, content: '请输入角色名称' });
    dispatch({
      type: 'roleManage/putRoleData',
      payload: {
        method: 'postJSON',
        params: {
          roleId: modalInfo.id,
          roleName: addRoleName,
          roleMessage: addRoleDes
        },
      },
      callback: (res) => {
        toFatherValue(true)
      }
    })
  }
  //删除角色
  const delRole = () => {
    dispatch({
      type: 'roleManage/delRoleData',
      payload: {
        method: 'delete',
        params: {
          roleId: modalInfo.id,
        },
      },
      callback: (res) => {
        toFatherValue(true)
      }
    })
  }
  //配置权限-查询
  useEffect(() => {
    if (modalInfo.modalName != 'configRole') return
    dispatch({
      type: 'roleManage/getRoleMenuInfoData',
      payload: {
        method: 'get',
        params: {
          roleId: modalInfo.id,
        },
      },
      callback: (res) => {
        console.log(res.body)
        let list = [];
        let ids = [];//树形结构选中id
        let checkedList = [];
        if(res.body){
        for (let i = 0; i < res.body.length; i++) {
          let children = []
          let item = res.body[i].childNodeMenuInfos;
          let twoNum = 0;//二级选中数量
          for (let j = 0; j < item.length; j++) {
            let grandson = [];
            let itemSon = item[j].childNodeMenuInfos
            let threeNum = 0;//三级选中数量
            for (let k = 0; k < itemSon.length; k++) {
              let objSon = { title: itemSon[k].name, key: itemSon[k].id, icon: <FileTextOutlined />, elementNames: itemSon[k].elementNames, path: `${res.body[i].name}>>${item[j].name}>>${itemSon[k].name}`, isMenu: itemSon[k].isMenu };
              //设置选中id 二级
              if (itemSon[k].selected == 1) {
                ids.push(itemSon[k].id);
                checkedList.push(objSon);
                ++threeNum;
              }
              grandson.push(objSon);
            }
            let obj = { title: item[j].name, key: item[j].id, children: grandson, elementNames: item[j].elementNames, path: `${res.body[i].name}>>${item[j].name}` , isMenu: item[j].isMenu}
            if (grandson.length == 0) { obj.icon = <FileTextOutlined /> }
            if (item[j].selected == 1 && grandson.length == 0) checkedList.push(obj);
            //设置选中id 二级
            if (item[j].selected == 1 && threeNum == itemSon.length) {
              ids.push(item[j].id);
              ++twoNum;
            }
            children.push(obj)
          }
          //设置选中id 一级
          if (res.body[i].selected == 1 && twoNum == item.length) {
            ids.push(res.body[i].id);
          }
          list.push({ title: res.body[i].name, key: res.body[i].id, children: children, elementNames: res.body[i].elementNames })
        }
        setTreeDataCheckedId(ids);
        setTreeDataChecked(checkedList);
        setTreeDataCheckedAll(checkedList);
        setTreeData(list);
      }
      }
    })
  }, [])
  //配置权限-复选框切换
  const onCheck = (checkedKeys, info) => {
    setTreeDataCheckedId([...checkedKeys, ...info.halfCheckedKeys])
    isChecked = true;
    let items = []
    for (let i = 0; i < info.checkedNodes.length; i++) {
      if (!info.checkedNodes[i].children || info.checkedNodes[i].children.length == 0) {
        items.push(info.checkedNodes[i])
      }
    }
    setTreeDataChecked(items)
  };
  //配置权限-提交
  const configRole = () => {
    // if (!isChecked) return toFatherValue(false);
    if (!dataRole) {
      message.error({ content: '请选择数据权限！' })
      return false;
    }
    dispatch({
      type: 'roleManage/updateRoleMenuData',
      payload: {
        method: 'postJSON',
        params: {
          roleId: modalInfo.id,
          menuIds: treeDataCheckedId,
          dataRole: dataRole
        },
      },
      callback: (res) => {
        toFatherValue(true)
      }
    })
  }
  //配置权限-设置-查询
  const configItemData = (item) => {
    setConfigItem(item)
    dispatch({
      type: 'roleManage/getMenuElementData',
      payload: {
        method: 'get',
        params: {
          roleId: modalInfo.id,
          menuId: item.key
        },
      },
      callback: (res) => {
        let buttonList = []
        let checkedList = []
        for (let i = 0; i < res.body.length; i++) {
          buttonList.push({ label: res.body[i].name, value: res.body[i].id })
          if (res.body[i].selected == 1) checkedList.push(res.body[i].id)
        }
        setBtnList(buttonList)
        setBtnListChecked(checkedList)
      }
    })
  }
  //配置权限-设置-提交
  const configDesRole = () => {
    dispatch({
      type: 'roleManage/updateMenuElementData',
      payload: {
        method: 'postJSON',
        params: {
          roleId: modalInfo.id,
          elementIds: btnListChecked,
          menuId: configItem.key
        },
      },
      callback: (res) => {
        setConfigItem('')
      }
    })
  }
  //配置权限-设置-复选框
  const checkedValues = (checkedValues) => {
    setBtnListChecked(checkedValues);
  }
  //配置权限-搜索
  const onSearch = event => {
    let value = event.target.value.trim();
    let list = []
    if (!value) {
      setTreeDataChecked(treeDataCheckedAll);
    } else {
      for (let i = 0; i < treeDataCheckedAll.length; i++) {
        if (treeDataCheckedAll[i].title.indexOf(value) > -1) list.push(treeDataCheckedAll[i])
      }
      setTreeDataChecked(list)
    }
  }
  //分配账号
  const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
  const handleChange = targetKeys => {
    setTargetKeys(JSON.parse(JSON.stringify(targetKeys)))
  };
  //分配账号-提交
  const accountRole = () => {
    let userIds = []
    for (let i = 0; i < mockData.length; i++) {
      if (targetKeys.indexOf(mockData[i].key) == -1) userIds.push(mockData[i].key)
    }
    dispatch({
      type: 'roleManage/updateRoleUserData',
      payload: {
        method: 'postJSON',
        params: {
          roleId: modalInfo.id,
          userIds: userIds
        }
      },
      callback: (res) => {
        toFatherValue(true)
      }
    })
  }
  //分配账号-查询
  useEffect(() => {
    if (modalInfo.modalName != 'accountRole') return
    let queryUserRoleData = new Promise((resolve, resolved) => {
      dispatch({
        type: 'roleManage/getRoleUserData',
        payload: {
          method: 'get',
          params: {
            pageNm: 1,
            pageSize: 500,
            roleId: modalInfo.id
          }
        },
        callback: (res) => resolve(res)
      })
    })
    let queryRoleInfoData = new Promise((resolve, resolved) => {
      dispatch({
        type: 'roleManage/getChannelUserData',
        payload: {
          method: 'get',
          params: {
            pageNm: 1,
            pageSize: 500,
            roleId: modalInfo.id
          },
        },
        callback: (res) => resolve(res)
      })
    })
    Promise.all([queryUserRoleData, queryRoleInfoData]).then(res => {
      let mockData = [...res[0].list, ...res[1].list]
      let targetKeys = []
      for (let i = 0; i < mockData.length; i++) {
        mockData[i].key = mockData[i].id
        mockData[i].description = mockData[i].userId + mockData[i].userName
      }
      for (let i = 0; i < res[1].list.length; i++) {
        targetKeys.push(res[1].list[i].id)
      }
      setMockData(mockData)
      setTargetKeys(targetKeys)
    })
  }, [])

  let dataRoleChange=(res)=>{
    setDataRole(res)
  }

  return (
    <>
      {/* 新增角色 */}
      <Modal title={modalInfo.modalName == 'addRole' ? '新增角色' : '修改角色'}
        visible={modalInfo.modalName == 'addRole' || modalInfo.modalName == 'putRole'}
        onOk={() => { modalInfo.modalName == 'addRole' ? addRole() : putRole() }}
        okText={modalInfo.modalName == 'addRole' ? "下一步" : "保存"}
        onCancel={() => { toFatherValue(false) }}>
        <Form.Item label="角色名称：">
          <Input onChange={(e) => { setAddRoleName(e.target.value) }} placeholder="请输入" value={addRoleName} ></Input>
        </Form.Item>
        <Form.Item label="描述信息：">
          <TextArea onChange={(e) => { setAddRoleDes(e.target.value) }} value={addRoleDes} showCount maxLength={100} placeholder="请输入" />
        </Form.Item>
      </Modal>

      {/* 角色停用/启用 */}
      <Modal title="提示" visible={modalInfo.modalName == 'banRole'} onOk={() => { banRole() }} onCancel={() => { toFatherValue(false) }}>
        <p>确认{modalInfo.roleStatus == 1 ? '启用' : '停用'}当前角色？</p>
      </Modal>

      {/* 角色删除 */}
      <Modal title="提示" visible={modalInfo.modalName == 'delRole'} onOk={() => { delRole() }} onCancel={() => { toFatherValue(false) }}>
        <p>确认删除当前角色？</p>
      </Modal>

      {/* 配置权限 */}
      <Modal title="配置权限" width={1000} visible={modalInfo.modalName == 'configRole'} onOk={modalInfo.superRole ? () => { message.error({ style: { marginTop: '10vh', }, content: '当前用户为超管,不允许操作此功能!' }) } : () => { configRole() }} okText="保存" okType={modalInfo.superRole ? "dashed" : 'primary'} onCancel={() => { toFatherValue(false) }}>
        <div className={style.info_title}>基本信息</div>
        <div className={style.info_data}>
          <Form.Item className={style.form_item} label="角色 ID：" >{modalInfo.id}</Form.Item>
          <Form.Item className={style.form_item} label="角色名称：" >{modalInfo.name}</Form.Item>
          <Form.Item className={style.form_item} label="状态：" >{modalInfo.isEnable == 1 ? '已启用' : '已停用'}</Form.Item>
          <Form.Item className={style.form_item} label="描述：" >{modalInfo.remark}</Form.Item>
          <Form.Item className={style.form_item} label="数据权限：" >
            <Select allowClear className={style.wrap_width} value={dataRole} onChange={(e) => { dataRoleChange(e) }}>
              <Option value='all'>全部</Option>
              <Option value='orgsub'>本机构及下属机构</Option>
              <Option value='org'>本机构</Option>
              <Option value='myself'>本人</Option>
            </Select>
          </Form.Item>
        </div>
        <div className={style.border_line}></div>
        <div className={style.info_title}>分配功能</div>
        <div className={style.functions}>
          <div className={style.configBox}>
            <div className={style.configBox_title}>功能权限</div>
            <div className={style.configBox_tree}>
              {
                treeData.length ?
                  <DirectoryTree
                    defaultCheckedKeys={treeDataCheckedId}
                    // checkStrictly={true}
                    checkable
                    multiple
                    defaultExpandAll
                    onCheck={onCheck}
                    treeData={treeData}
                  /> : ''
              }
            </div>
          </div>
          <div className={style.tab_btn}>分配</div>
          <div className={style.configBox}>
            <div className={style.configBox_title}>设置页面元素（已选菜单）</div>
            <div className={style.configBox_tree_right}>
              <div className={style.configBox_search}>
                <Input onPressEnter={onSearch} onChange={onSearch} placeholder="输入搜索内容" />
              </div>
              <div className={style.configBox_scroll}>
                {
                  treeDataChecked.map(item => {
                    return (
                      <div className={style.configBox_pageList}>
                        <div className={style.configBox_pageList_name}>{item.title}</div>
                        {
                          console.log(item)
                        }
                        {
                          item.isMenu==1?
                        <Tooltip placement="rightTop" title={item.elementNames && item.elementNames.length ? item.elementNames.join('、') : '无'}>
                          <div className={style.configBox_pageList_view}>查看权限</div>
                        </Tooltip>:null
                  }
                  {
                          item.isMenu==1?
                        <div onClick={() => { configItemData(item) }} className={style.configBox_pageList_config}>设置</div>
                        :null}
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* 配置权限-设置 */}
      <Modal title="设置页面元素" visible={modalInfo.modalName == 'configRole' && configItem} onOk={modalInfo.superRole ? () => { message.error({ style: { marginTop: '10vh', }, content: '当前用户为超管,不允许操作此功能!' }) } : () => { configDesRole() }} okType={modalInfo.superRole ? "dashed" : 'primary'} okText="保存" onCancel={() => { setConfigItem('') }}>
        <div className={style.headInfo}>
          <div>菜单名称：{configItem.title}</div>
          <div>当前路径：{configItem.path}</div>
        </div>
        <div className={style.border_line}></div>
        <div className={style.visibleBtn}>
          <div>可见按钮：</div>
          <Checkbox.Group options={btnList} value={btnListChecked} onChange={checkedValues} />
        </div>
      </Modal>

      {/* 分配账号 */}
      <Modal title="分配账号" width={1000} visible={modalInfo.modalName == 'accountRole'} onOk={() => { accountRole() }} okText="保存" onCancel={() => { toFatherValue(false) }}>
        <div className={style.info_title}>基本信息</div>
        <div className={style.info_data}>
          <Form.Item className={style.form_item} label="角色 ID：" >{modalInfo.id}</Form.Item>
          <Form.Item className={style.form_item} label="角色名称：" >{modalInfo.name}</Form.Item>
          <Form.Item className={style.form_item} label="状态：" >{modalInfo.isEnable == 1 ? '已启用' : '已停用'}</Form.Item>
          <Form.Item className={style.form_item} label="描述：" >{modalInfo.remark}</Form.Item>
        </div>
        <div className={style.border_line}></div>
        <div className={style.info_title}>分配账号</div>
        <Transfer
          listStyle={{
            width: 450,
            height: 450
          }}
          dataSource={mockData}
          showSearch
          filterOption={filterOption}
          targetKeys={targetKeys}
          onChange={handleChange}
          titles={['已分配账号', '未分配账号']}
          operations={['加入右侧', '加入左侧']}
          pagination={{
            current: 1,
            pageSize: 10,
          }}
          render={item => (
            <div>
              <span className={style.info_data_color} style={{ float: 'left', width: '180px' }}>{item.userId}</span>
              <span className={style.info_data_color} style={{ float: 'left' }}>{item.userName}</span>
            </div>
          )}
        />
      </Modal>

    </>
  )
}


export default connect(({ roleManage }) => ({
}))(modal)







