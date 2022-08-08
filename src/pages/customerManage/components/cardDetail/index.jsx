import React, { useEffect, useState } from "react";
import { connect, history } from 'umi';
import { Table, Tag, Space, Pagination, ConfigProvider, message } from 'antd';
import style from "./style.less";
import locale from 'antd/lib/date-picker/locale/zh_CN';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
const { Column } = Table;

const cardDetail = (props) => {
  let customerId = history.location.query.customerId
  let { dispatch } = props,
    [listData, setListData] = useState([]),
    [pageNo, setPageNo] = useState(1),
    [pageSize, setPageSize] = useState(5),
    [pageTotal, setPageTotal] = useState(0),
    [lable, setLable] = useState('granted'),
    [cardData, setCardData] = useState({
      pageNo: 1,
      pageSize: 5,
      lable: "granted",
      customerId: customerId,
    })

  useEffect(() => {
    getCardList()
  }, [pageNo, lable, cardData])

  let getCardList = () => {
    dispatch({
      type: 'customerListDetail/customerCards',
      payload: {
        method: 'postJSON',
        params: cardData
      },
      callback: (res) => {
        if (res.result.code === '0') {
          setListData(res.body.list);
          setPageTotal(res.body.pageInfo.totalCount)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  /*点击下一页上一页*/
  let onNextChange = (page, pageSize) => {
    cardData.pageNo = page
    setCardData(cardData)
    setPageNo(page)
    setPageSize(pageSize)
  }
  /*改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    cardData.pageNo = page
    cardData.pageSize = pageSize
    setPageNo(page)
    setPageSize(pageSize)
    setCardData(cardData)
    onPageTotal()
  }
  /* 切换状态 */
  let changeLabel = (lable) => {
    cardData.lable = lable;
    cardData.pageNo = 1;
    setCardData(cardData)
    setLable(lable);
    setPageNo(1);
  }

  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNo} / ${totalPage}  页`
  }
  return (
    <>
      <div className={style.select_status}>
        <span onClick={() => { changeLabel('granted') }} className={lable === 'granted' ? style.active_status : ''}>发放</span>
        <span onClick={() => { changeLabel('receive') }} className={lable === 'receive' ? style.active_status : ''}>领取</span>
        <span onClick={() => { changeLabel('used') }} className={lable === 'used' ? style.active_status : ''}>使用</span>
        <span onClick={() => { changeLabel('frozen') }} className={lable === 'frozen' ? style.active_status : ''}>冻结</span>
      </div>

      <Table dataSource={listData} pagination={false}>
        <Column title="卡券ID" dataIndex="yltCardId" key="yltCardId" />
        <Column title="卡券名称" dataIndex="yltCardName" key="yltCardName" />
        <Column title="卡券来源" dataIndex="sourceType" key="sourceType" />
        <Column title="卡券种类" dataIndex="yltCardTypeName" key="yltCardTypeName" />
        <Column title="面值" dataIndex="yltCardAmount" key="yltCardAmount" />
        <Column title="有效期至" dataIndex="yltCardEffectiveEnd" key="yltCardEffectiveEnd"
        // render={(yltCardEffectiveEnd, record) => {
        //   return <span>{moment(yltCardEffectiveEnd).format('YYYY-MM-DD HH:mm:ss')} - {moment(record.endTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        // }}
        />
        {
          lable == 'granted' ? <Column title="发放时间" dataIndex="createTime" key="createTime" /> :
            lable == 'receive' ? <Column title="领取时间" dataIndex="recieveTime" key="recieveTime" /> :
              lable == 'used' ? <Column title="使用时间" dataIndex="usedTime" key="usedTime" /> :
                lable == 'frozen' ? <Column title="冻结时间" dataIndex="shareTime" key="shareTime" /> : ''
        }
      </Table>
      <ConfigProvider locale={zh_CN}>
        <Pagination
          className={style.pagination}
          showQuickJumper
          showSizeChanger
          showTitle={false}
          current={pageNo}
          defaultPageSize={pageSize}
          total={pageTotal}
          onChange={onNextChange}
          pageSizeOptions={['5', '10', '20', '30', '60']}
          onShowSizeChange={onSizeChange}
          showTotal={onPageTotal}
        />
      </ConfigProvider>
    </>
  )
};
export default connect(({ customerListDetail }) => ({
}))(cardDetail)
