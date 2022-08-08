import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Input, Button, message, Tree, Row, Col, Form, Alert, Select, Modal } from 'antd';
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import style from "./style.less";
let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));
var toInt = 0;
// 构建树
const eachTreeList = (treeList, key, level) => {
  let _treeList = [];
  for (let item of treeList) {
    toInt++;
    console.log(level, item.id, toInt)
    let obj = {
      ...item,
      title: item.name,
      menuType: key,
      key: `${level}${toInt}${item.id}`,
      type: 'add',
      treeLevel: level,
    };
    if (item.childOrganizations.length) {
      obj.children = eachTreeList(item.childOrganizations, key, level + 1);
    }
    _treeList.push(obj);
  }
  return _treeList;
}
const combinationPage = (props) => {
  let { dispatch } = props;
  let [form] = Form.useForm();
  let [treeList, setTreeList] = useState([]);// 树-菜单
  let [menuParentInfo, setMenuParentInfo] = useState([]);// 上级菜单集合
  let [deleteMenuVisible, setDeleteMenuVisible] = useState(false); //确认删除弹窗
  let [toInfor, setToInfor] = useState({}); //当前所选
  let [buttonType, setButtonType] = useState(false); //保存按钮状态


  useEffect(() => {
    queryList();
    getQueryParentList();
  }, [])

  useEffect(() => {
    form.setFieldsValue({
      isEnable: 1,
      parentId: null,
      name: null
    })
  }, [])

  //树-选择编辑
  const onCheckTree = (item) => {
    if (item.key != "channelOrganizations" && item.key != "providerOrganizations" && item.key != "yltOrganizations") {
      getDetail(item);
    }
    setButtonType(false);
  };
  //树-新增
  const addTree = (item) => {
    setToInfor({ ...{} });
    setButtonType(false);
    form.resetFields();
    form.setFieldsValue({
      ...{
        isEnable: 1,
        parentId: item.id,
      }
    })
  };
  //树-删除
  const deleteTree = (item) => {
    setToInfor({ ...item });
    setDeleteMenuVisible(true);
  };
  //确认删除
  let delTreeMenu = () => {
    dispatch({
      type: 'combination/deleteOrganization',
      payload: {
        method: 'postJSON',
        params: {
          userId: 1,
          id: toInfor.id
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {
          queryList();
          setDeleteMenuVisible(false);
        } else {
          message.error({ content: res.result.message })
        }
      }
    })
  }

  //保存
  let onFinish = (value) => {
    let toInforInfo = {};
    toInforInfo.name = value.name;
    toInforInfo.isEnable = value.isEnable;
    toInforInfo.parentId = value.parentId;
    toInforInfo.platformType = 2;
    toInforInfo.userId = "1";
    toInforInfo.tenantType = "channel";
    if (toInfor && toInfor.code) {   //编辑
      toInforInfo.id = toInfor.id;
      setUpdate(toInforInfo)
    } else {   //新增
      toInforInfo.id = null;
      setInsert(toInforInfo)
    }
  }

  //是否失效状态选择
  let changeIsType = (value) => {
    if (value === 0) {
      let toFroms = form.getFieldsValue();
      let names = "";
      if (toFroms.name5) {
        names = '无法失效，需要先清除关联渠道'
      } else if (toFroms.name6) {
        names = '无法失效，需要先清除承保单位'
      }
      if (toFroms.name5 || toFroms.name6) {
        Modal.error({
          title: names,
          onOk() {
            toFroms.name3 = 1;
            form.setFieldsValue({ ...toFroms })
          }
        });
      }
    }
  }


  //查询组织机构列表
  const queryList = () => {
    dispatch({
      type: 'combination/queryList',
      payload: {
        method: 'postJSON',
        params: {
          platformType: 'channel',
          channelId: tokenObj.channelId
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {
          let item = res.body.channelOrganizations;
          toInt=0;
          let toTrr = [];
          item.forEach((el, i) => {
            let toitem = eachTreeList(el.childOrganizations, 'key' + i, 1);
            el.treeLevel = 0;
            el.key = 'keys' + i;
            el.children = toitem;
            el.type = 'add';
            el.menuType = 'key' + i;
            el.title = el.name;
            el.isEnable = '1';
            el.isDelete = false;
            toTrr.push(el);
          });
          console.log(toTrr)
          // item = eachTreeList(item, "channelOrganizations", 1)
          setTreeList([...toTrr])
        } else {
          message.error({ content: res.result.message })
        }
      }
    })
  }
  //查询上级机构名称
  const getQueryParentList = () => {
    dispatch({
      type: 'combination/queryParentList',
      payload: {
        method: 'postJSON',
        params: {
          tenantType: 'channel',
          channelId: tokenObj.channelId
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {
          let toBody = res.body;
          setMenuParentInfo([...toBody])
        } else {
          message.error({ content: res.result.message })
        }
      }
    })
  }
  //编辑-保存
  let setUpdate = (res) => {
    dispatch({
      type: 'combination/updateOrganization',
      payload: {
        method: 'postJSON',
        params: res
      },
      callback: (res) => {
        if (res.result.code == '0') {
          setButtonType(true);
          message.success("保存成功！");
          queryList();
        } else {
          message.error({ content: res.result.message })
        }
      }
    })
  }
  //新增-保存
  let setInsert = (res) => {
    dispatch({
      type: 'combination/insertOrganization',
      payload: {
        method: 'postJSON',
        params: res
      },
      callback: (res) => {
        if (res.result.code == '0') {
          message.success("保存成功！");
          setButtonType(true);
          queryList();
          setToInfor({ ...res.body });
          getQueryParentList();
        } else {
          message.error({ content: res.result.message })
        }
      }
    })
  }
  //查询组织机构详情
  const getDetail = (res) => {
    dispatch({
      type: 'combination/detailOrganization',
      payload: {
        method: 'postJSON',
        params: {
          id: res.id
        }
      },
      callback: (res) => {
        if (res.result.code == '0') {
          let toRes = res.body;
          toRes.parentId = toRes.parentId === 0 ? null : toRes.parentId;
          setToInfor({ ...toRes });
          form.resetFields();
          form.setFieldsValue(toRes)
        } else {
          message.error({ content: res.result.message })
        }
      }
    })
  }
  //表单数据监听
  let onFieldsChange = () => {
    if (buttonType) {
      setButtonType(false);
    }
  }


  return (
    <>
      <div className={style.block__cont}>
        <Row className={style.row}>
          <Col flex="0 0 300px" className={style.tree_row}>
            <Tree
              treeData={treeList}
              showLine={{ showLeafIcon: false }}
              titleRender={(v) => {
                return <div className={style.menu_block}>
                  <span title="编辑" className={style.meun_name} onClick={() => onCheckTree(v)}>{v.title}</span>
                  {v.treeLevel < 2 ? <span title="新增" onClick={() => { addTree(v) }} className={style.add_Icon} ><PlusCircleOutlined /></span> : ''}
                  {
                    v.treeLevel === 0 ? '' : <span title="删除" className={style.delete_Icon} onClick={() => { deleteTree(v) }}><CloseCircleOutlined /></span>
                  }
                </div>
              }}
            />
          </Col>

          <Col flex="auto" className={style.content_row}>
            <Form className={style.formBox} layout="vertical" form={form} onFinish={onFinish} onFieldsChange={onFieldsChange}>
              <Row className={style.form_item1}>
                <Col flex="0 0 450px">
                  <Alert message='点击左侧机构名称编辑，点击+号新增机构' type='warning' />
                </Col>
              </Row>

              <Row>
                <Col flex="0 0 450px">
                  <Form.Item name="name" label="机构名称" rules={[{ required: true }]}>
                    <Input placeholder="请输入机构名称" maxLength={50}></Input>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col flex="0 0 450px">
                  <Form.Item name="isEnable" label="机构状态" rules={[{ required: true }]}>
                    <Select allowClear onChange={changeIsType}>
                      <Option value={1}>有效</Option>
                      <Option value={0}>失效</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col flex="0 0 450px">
                  <Form.Item name="parentId" label="上级机构名称" rules={[{ required: true }]}>
                    <Select allowClear showSearch optionFilterProp="children" placeholder="上级机构名称">
                      {
                        menuParentInfo.map((item, i) => <Option key={i} value={item.id}>{item.name}</Option>)
                      }
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Button type="primary" htmlType="submit" disabled={buttonType}>保存</Button>
              </Row>


            </Form>
          </Col>

        </Row>
      </div>

      {/* 菜单删除 */}
      <Modal title="删除机构" visible={deleteMenuVisible} onOk={() => { delTreeMenu() }} onCancel={() => { setDeleteMenuVisible(false) }}>
        <p>机构删除后将不能恢复，请谨慎操作，确定要删除机构？</p>
      </Modal>
    </>
  )
}


export default connect(({ combination }) => ({

}))(combinationPage)







