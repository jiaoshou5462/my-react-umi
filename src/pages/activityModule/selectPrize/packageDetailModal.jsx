import React, { useState, useEffect, useRef, useContext } from 'react';
import { connect, history } from 'umi';
import { Pagination, Button, Input, InputNumber, Table, Select,  Modal, ConfigProvider, Radio, DatePicker,message} from "antd";
const { RangePicker } = DatePicker;
import zh_CN from "antd/lib/locale-provider/zh_CN";
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import style from './style.less';
import { InfoCircleOutlined, FormOutlined } from "@ant-design/icons";
import { set } from 'lodash';

const { TextArea } = Input;
const { Option, OptGroup } = Select;

// 添加卡包弹框
const packageDetailModal = (props) => {
  let { dispatch, showPackageDetail, closePackageDetailModal, packageDetailData,packageDetailList, cardbagByCouponNumList } = props;
  let [list, setList] = useState([])  //卡券列表数据
  let [total,setTotal] = useState();//数据总条数
  let [pageSize, setPageSize] = useState(10),
    [pageNum, setPage] = useState(1),
    [payload, setPayload] = useState({
      pageNum,
      pageSize,
      packageNo: "",
      quotationItemId: ""
    });
  // 卡包明细
  const cardbagcolumns = [
    { title: '基础卡券编号', dataIndex: 'couponSkuNo', key: 'couponSkuNo' },
    { title: '卡券名称', dataIndex: 'couponSkuName', key: 'couponSkuName' },
    { title: '卡券品类', dataIndex: 'couponCategoryName', key: 'couponCategoryName' },
    {
      title: '卡券种类', dataIndex: 'discountsType', key: 'discountsType',
      render: (text, all) => {
        return <>
          {
            text == 1 ? <span>优惠券</span> :
              text == 2 ? <span>优惠券</span> :
                text == 3 ? <span>打折券</span> :
                  text == 4 ? <span>兑换券</span> : ''
          }
        </>
      }
    },
    {
      title: '发放方式', dataIndex: 'serviceType', key: 'serviceType',
      render: (text, all) => {
        return <>
          {
            text == 1 ? <span>自发</span> :
              text == 2 ? <span>代发</span> : ''
          }
        </>
      }
    },
    {
      title: '面值类型', dataIndex: 'valueType', key: 'valueType',
      render: (text, all) => {
        return <>
          {
            text == 1 ? <span>固定面值</span> :
              text == 2 ? <span>自定义面值</span> : ''
          }
        </>
      }
    },
    { title: '面值/折扣', dataIndex: 'faceValue', key: 'faceValue' },
    {
      title: '使用门槛', dataIndex: 'isUseThreshold', key: 'isUseThreshold',
      render: (text, all) => {
        return <>
          {
            text == 1 ? <span>满{all.useThresholdAmount}元可用</span> : <span>无门槛</span>
          }
        </>
      }
    },
    { title: '数量', dataIndex: 'couponNum', key: 'couponNum' },
    {
      title: '有效期', dataIndex: 'effectiveDate', key: 'effectiveDate',
      render: (effectiveDate, record,index) => renderTime(effectiveDate, record,index)
    }
  ]
  
  useEffect(() => {
    let temp = cardbagByCouponNumList || []
    temp.map(item => {
      item.effectiveDate = item.defaultEffectiveDays
    })
    setList(temp)
  }, [cardbagByCouponNumList])
  useEffect(() => {
    let total = packageDetailData.total || null;
    let toPayload = payload;
    toPayload.packageNo = packageDetailData.couponPackageNo || "";
    toPayload.quotationItemId = packageDetailData.quotationItemId || "";
    setTotal(total);
    setPayload(toPayload);
  }, [packageDetailData])
  /*获取卡包明细*/
  let getPackageDetailList = () => {
    dispatch({
      type: 'activitySelectPrize/detailCardByCouponNum',
      payload: {
        method: 'get',
        params: {},
        packageNo: payload.packageNo,//卡包编号
        quotationItemId: payload.quotationItemId//卡包编号
      }
    })
  }
  /*回调*/
  useEffect(() => {
    getPackageDetailList()
  }, [pageNum, pageSize, payload])
  // 添加
  let handleCouponOk = () => {
    packageDetailList(list);
    closePackageDetailModal();
  }
  /*卡包点击下一页上一页*/
  let onNextChange = (page, pageSize) => {
    payload.pageNum = page
    setPayload(payload)
    setPage(page)
    setPageSize(pageSize)
  }
  /*卡包改变每页条数*/
  let onSizeChange = (page, pageSize) => {
    payload.pageNum = page
    payload.pageSize = pageSize
    setPage(page)
    setPageSize(pageSize)
    setPayload(payload)
    onPageTotal()
  }
  /*卡包显示总条数和页数*/
  let onPageTotal = (total, range) => {
    let totalPage = Math.ceil(total / pageSize)
    return `共${total}条记录 第 ${pageNum} / ${totalPage}  页`
  }



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

  // let [cardTimeRecord, setCardTimeRecord] = useState({}) // 卡券 编辑有效期时，当前这条数据详请。
  let [isValidityVisible,setValidityVisible] = useState(false);//是否显示有效期设置modal
  // let [validityDate,setValidityDate] = useState(1);//默认选中 最近一次设置
  let [validityMode,setValidityMode] = useState(1);//有效期 领取后 、固定时间
  let [takeEffect,setTakeEffect] = useState(1);//有效期生效时间
  let [effectValue,setEffectValue] = useState();//有效期设置多少天后生效
  let [validityTime,setValidityTime] = useState();//有效期天数
  let [fixedTime,setFixedTime] = useState([]);//固定时间选择时长
  // let [btnType1,setBtnType1] = useState("primary");//按钮类型
  // let [btnType2,setBtnType2] = useState("");//按钮类型
  let [dates, setDates] = useState([]);
  let [maxValidDays,setMaxValidDays] = useState();//最大有效天数
  // let [packageSetUp ,setPackageSetUp ] = useState({});//接口获取最近一次设置
  
  let disabledDate = current => {
    if (!dates || dates.length === 0) {
      return false;
    }
    let tooLate = dates[0] && current.diff(dates[0], 'days') > maxValidDays;
    let tooEarly = dates[1] && dates[1].diff(current, 'days') > maxValidDays;
    return tooEarly || tooLate;
  };
  let [detailIndex,setDetailIndex] = useState();//当前修改卡包明细第几条数据

  //有效期设置弹窗展示数据处理
  let dataDeal = (record) =>{
    let validityMode1 = record.effectDateType == 0 ? 1 : 2;
    let fixedTime1 = record.effectStartDate && record.effectEndDate ? [moment(record.effectStartDate),moment(record.effectEndDate)] : [];
    let takeEffect1 = 1;
    let effectValue1 = null;
    if(record.receiveEffectDays == 0){
      takeEffect1 = 1;
    }else{
      takeEffect1 = 2;
      effectValue1 = record.receiveEffectDays;
    }
    let toMaxValidDays = record.maxEffectiveDays;
    let toValidityTime = record.defaultEffectiveDays;
    if(record.serviceType == 1){
      if(record.useValidDays && record.useValidDays >= 0){
        toMaxValidDays = record.useValidDays;
        toValidityTime = record.useValidDays;
      }else{
        toValidityTime = record.maxEffectiveDays;
      }
    }
    if(record.effectiveDays){
      toValidityTime = record.effectiveDays;
    }
    setValidityMode(validityMode1);
    setTakeEffect(takeEffect1);
    setFixedTime(fixedTime1);
    setEffectValue(effectValue1);
    // setMaxValidDays(record.maxEffectiveDays);
    // setValidityTime(record.defaultEffectiveDays);
    setMaxValidDays(toMaxValidDays);
    setValidityTime(toValidityTime);
    // setValidityTime(record.effectiveDays);
    // setMaxValidDays(record.maxiMumValidDays);
  }
  /*有效期组件*/
  let renderTime = (effectiveDate, record,index) => {
    let onClickTime = () => {
      setDetailIndex(index);
      // setCardTimeRecord(record);
      dataDeal(record);
      // setMaxValidDays(record.maxEffectiveDays);
      // setValidityTime(record.defaultEffectiveDays);
      setValidityVisible(true)
    }
    return <div>
      {
        record.effectDateType == 0 && record.receiveEffectDays == 0 ?
          <span>领取后立即生效</span>
        :record.effectDateType == 0 && record.receiveEffectDays ?
          <span>领取后第 {record.receiveEffectDays} 天后生效</span>
        :record.effectDateType == 1 ?
          <span>{record.effectStartDate}~{record.effectEndDate}</span>
        :''
      }
      <FormOutlined onClick={(onClickTime)} />
    </div>
  }
   /*回调*/
  //  useEffect(() => {
  //   if(validityDate == 1){
  //     setBtnType1("primary");
  //     setBtnType2("");
  //     dataDeal();
  //   }else if(validityDate == 2){
  //     setBtnType1("");
  //     setBtnType2("primary");
  //   }
  // }, [validityDate])
  //最近一次有效期设置
  // let lastestSet = () => {
  //   setBtnType1("primary");
  //   setBtnType2("");
  //   dataDeal();
  //   setValidityDate(1);
  //   setValidityTime(cardTimeRecord.defaultEffectiveDays);
  // }
  
  //默认有效期设置
  // let defaultSet = () => {
  //   setBtnType1("");
  //   setBtnType2("primary");
  //   setValidityDate(2);
  //   setValidityMode(1);
  //   setTakeEffect(1);
  //   setMaxValidDays(cardTimeRecord.maxEffectiveDays);
  //   setValidityTime(cardTimeRecord.defaultEffectiveDays);
  // }
  //有效期方式设置
  let validityModeChange = (e) => {
    setValidityMode(e.target.value);
    setTakeEffect(1);
    setEffectValue();
    setValidityTime();
  }
  //有效期生效时间设置
  let takeEffectChange = (e) => {
    setTakeEffect(e.target.value);
    setEffectValue();
    setFixedTime([]);
  }
  //设置领取后多少天生效
  let effectValueChange = (value) => {
    setEffectValue(value);
  }
  //设置有效天数
  let validityTimeChange = (value) => {
    setValidityTime(value);
  }
  //固定时间选择
  let fixedTimeChange = (value) => {
    setFixedTime(value);
  }
  //卡券有效期设置确定
  let handleValidityOk = () => {
    if(validityMode == 1){
      if(takeEffect == 2 && !effectValue){
        message.error('请输入生效时间！');
        return false;
      }
      if(!validityTime){
        message.error('请输入有效期天数！');
        return false;
      }
    }else if(validityMode == 2){
      if(!fixedTime[0]){
        message.error('请选择日期！');
        return false;
      }
    }
    let temp = JSON.parse(JSON.stringify(list));
    temp[detailIndex].effectDateType=validityMode == 1 ? 0 : 1 ;//	0：领取后生效，1：固定日期
    temp[detailIndex].effectEndDate=fixedTime[1] ? moment(fixedTime[1]).format('YYYY-MM-DD') : "";//	结束有效期
    temp[detailIndex].effectStartDate=fixedTime[0] ? moment(fixedTime[0]).format('YYYY-MM-DD') : "";//开始有效期
    // temp[detailIndex].defaultEffectiveDays=validityTime;//有效天数
    temp[detailIndex].effectiveDays=validityTime;//有效天数
    temp[detailIndex].effectiveDate=validityTime;//有效天数
    temp[detailIndex].receiveEffectDays= takeEffect == 2 ? effectValue : 0;//	0为立即生效
    // temp[detailIndex].maxEffectiveDays= maxValidDays;//	最大有效期天数
    setList(temp);
    setValidityVisible(false);
  }
  
  // let getPackageSetUp = () => {
  //   dispatch({
  //     type: 'activitySelectPrize/getPackageSetUp',
  //     payload: {
  //       method: 'get',
  //       params: {}
  //     },
  //     callback: (res) => {
  //       if (res.result.code == "0") {
  //         if(res.body){
  //           let items = res.body;
  //           setPackageSetUp(items);
  //           let validityMode1 = items.effectDateType == 0 ? 1 : 2;
  //           let fixedTime1 = items.effectStartDate && items.effectEndDate ? [moment(items.effectStartDate),moment(items.effectEndDate)] : [];
  //           let takeEffect1 = 1;
  //           let effectValue1 = null;
  //           if(items.receiveEffectDays == 0){
  //           takeEffect1 = 1;
  //           }else{
  //           takeEffect1 = 2;
  //           effectValue1 = items.receiveEffectDays;
  //           }
  //           setValidityMode(validityMode1);
  //           setTakeEffect(takeEffect1);
  //           setFixedTime(fixedTime1);
  //           setEffectValue(effectValue1);
  //           setValidityTime(items.effectiveDays);
  //           setMaxValidDays(items.maxiMumValidDays);
  //         }
  //       } else {
  //         message.error(res.result.message);
  //       }
  //     }
  //   });
  // }
  return (
    <>
      <Modal
        title='卡券有效期设置'
        width={380}
        closable={false}
        visible={isValidityVisible}
        okText='确定'
        onOk={handleValidityOk}
        // onCancel={() => { setValidityVisible(false) }}
        onCancel={handleValidityOk}
      >
        <div className={style.validity_wrap}>
          {/* <div className={style.validity_row}>
            <Button className={style.btn_radius} type={btnType1} onClick={lastestSet}>最近一次设置</Button>
            <Button type={btnType2} onClick={defaultSet}>默认设置</Button>
          </div> */}
          <div className={style.validity_row}>
            <span>有效期：</span>
            <Radio.Group value={validityMode} onChange={validityModeChange}>
                <Radio value={1}>领取后</Radio>
                <Radio value={2}>固定时间</Radio>
              </Radio.Group>
          </div>
          {validityMode == 1 ?
            <div>
              <div className={style.validity_row}>
                <span>生效时间：</span>
                <Radio.Group value={takeEffect} onChange={takeEffectChange}>
                    <Radio value={1}>立即生效</Radio>
                    <Radio value={2}>第 <InputNumber style={{ width: 70 }} disabled={takeEffect == 1} min={0} parser={limitNumber} formatter={limitNumber} value={effectValue} onChange={effectValueChange}/> 天</Radio>
                  </Radio.Group>
              </div>
              <div className={style.validity_row}>
                <span>有效期天数：</span>
                <InputNumber min={0} parser={limitNumber} max={maxValidDays} formatter={limitNumber} style={{ width: 70 }} value={validityTime} onChange={validityTimeChange}/> 天
              </div>
            </div>
            : validityMode == 2 ?
              <div className={style.validity_row}>
                <RangePicker 
                  disabledDate={disabledDate}
                  onCalendarChange={val => setDates(val)} 
                  value={fixedTime} 
                  onChange={fixedTimeChange} 
                  locale={locale} 
                  format="YYYY-MM-DD" 
                  className={style.form_item_width2}
                />
              </div>
            : null
          }
          <div className={style.validity_row}>
            <span>有效期不超过{maxValidDays}天</span>
          </div>
        </div>
      </Modal>
      <Modal
        title='卡包明细'
        width={1200}
        closable={false}
        visible={showPackageDetail}
        okText='确定'
        onOk={handleCouponOk}
        onCancel={() => { closePackageDetailModal() }}
      >
        <Table
          columns={cardbagcolumns}
          dataSource={list}
          locale={{ emptyText: '暂无数据' }}
          pagination={false}
          loading={{
            spinning: false,
            delay: 500
          }}
        >
        </Table>
        <ConfigProvider locale={zh_CN}>
          <Pagination
            className={style.detailPagination}
            showQuickJumper
            showTitle={false}
            current={payload.pageNum} //选中第一页
            pageSize={payload.pageSize} //默认每页展示10条数据
            total={total}
            onChange={onNextChange} //切换 页码时触发事件
            pageSizeOptions={['10', '20', '30', '60']}
            onShowSizeChange={onSizeChange}
            showTotal={onPageTotal}
          />
        </ConfigProvider>
      </Modal>
    </>
  )
}

export default connect(({ activitySelectPrize }) => ({
  cardbagByCouponNumList: activitySelectPrize.cardbagByCouponNumList
}))(packageDetailModal)