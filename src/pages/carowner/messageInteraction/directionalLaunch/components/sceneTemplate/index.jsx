import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { Form, Button, Modal, Space, Pagination, ConfigProvider, Divider, Select } from "antd"
import style from "./style.less";
import zh_CN from 'antd/lib/locale-provider/zh_CN'
const { Option } = Select;

const addVariable = (props) => {

  let { dispatch, modalInfo, closeMode, getVariableValue, pageInfoChange } = props;
  // closeMode关闭方法
  const [pageInfo, setPageInfo] = useState({})
  const [groupValue, setGroupValue] = useState([])

  useEffect(() => {
    setPageInfo(modalInfo.pageInfo)
  }, [])

  useEffect(() => {
    setPageInfo(modalInfo.pageInfo)
  }, [modalInfo])
  // 选择此模板进行的操作
  let submitEvent = (param) => {
    getVariableValue(param)
    closeMode()
  }

  //显示总条数和页数
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageInfo.pageSize)
    return `共${total}条记录 第 ${pageInfo.pageNum} / ${totalPage}  页`
  }
  //改变每页条数
  let onSizeChange = (page, pageSize) => {
    let this_payload = {};
    this_payload.pageNum = this_payload.pageNo
    this_payload.pageSize = pageSize
    onPageTotal()
  }
  //点击下一页上一页*
  let onNextChange = (pageNum, pageSize) => {
    setPageInfo({ pageNum: pageNum, pageSize: pageSize })
    pageInfoChange({ pageNum: pageNum, pageSize: pageSize })
  }

  return (
    <>
      <Modal width={1500} visible={modalInfo.modalName == 'changeTemplate'} footer={null} onCancel={() => closeMode()}>
        <div className={style.change_variable_title}>
          <span className={style.text_variable}>选择场景模板</span>
          <Divider />
          <div className={style.div_big}>
            {
              modalInfo.variableList ? modalInfo.variableList.map((v, i) => {
                return <div className={style.div_content}>
                  <div className={style.title_sece_template}>场景模板名称:{v.sceneTemplateName}</div>
                  <div className={style.pre_text}>
                    <div>{v.templateTitle}</div>
                    {v.sceneTemplateVariableList.map((item, index) => {
                      return <div>
                        <span>{item.templateFieldCode + '.DATA'}{item.content == null ? '' : ':'+item.content}</span>
                      </div>
                    })}

                  </div>
                  <div className={style.button_style}><Button onClick={() => submitEvent(v)}>使用此微信模板</Button></div>

                </div>

              }) : ''
            }
          </div>

        </div>
        <div>
          <Pagination
            className={style.pagination}
            showQuickJumper
            showTitle={false}
            current={pageInfo.pageNum}
            defaultPageSize={pageInfo.pageSize}
            total={pageInfo.totalCount}
            onChange={onNextChange}
            pageSizeOptions={['10', '20', '30', '60']}
            onShowSizeChange={onSizeChange}
            showTotal={onPageTotal}
          />
        </div>

      </Modal>
    </>
  )
}


export default connect(({ directionalLaunch }) => ({
}))(addVariable)







