import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import QRCode from 'qrcode.react';
import {
  Button,
  Modal,
  message,
} from "antd"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import style from "./style.less";
let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));
let smartFieldPage={
  couponList: '/wechat_carowner/pages/coupon/list.html',
  couponMiddle: '/wechat_carowner/pages/coupon/middlePage.html',
  couponDetail: '/wechat_carowner/pages/coupon/middlePageResult.html',
  orderList: '/wechat_carowner/list.html',
  
  driver: '/wechat_carowner/pages/smartField/driver.html',
  driverDetail: '/wechat_carowner/pages/smartField/driverDetail.html',
  rescue: '/wechat_carowner/pages/smartField/rescue.html',
  rescueDetail: '/wechat_carowner/pages/smartField/rescueDetail.html',
}
//根据环境变量 匹配对应的预览域名
let homeHost = {
  'local':'https://dev.yltapi.com',
  'dev':'https://dev.yltapi.com',
  'test1':'https://test1.yltapi.com',
  'uat':'https://uat.yltapi.com',
  'prod':'https://www.yltapi.com',
}[process.env.DEP_ENV]
const pageModal = (props) => {
  let { dispatch, modalInfo,showPreview,closeModal} = props;
  const [pageUrl,setPageUrl] = useState('');

  useEffect(()=>{
    console.log(modalInfo.pageNameUnique)
    let pageUrl = `${homeHost}/wechat-carowner-new/home?channelId=${tokenObj.channelId}`;
    if(modalInfo.modalType=='pre'){
      pageUrl = `${pageUrl}&YLT_homePreview=1`;
    }
    if(smartFieldPage[modalInfo.pageNameUnique]){
      pageUrl = `${pageUrl}&jumpPage=${smartFieldPage[modalInfo.pageNameUnique]}`;
    }else{
      pageUrl = `${pageUrl}&pageId=${modalInfo.objectId}`;
    }
    setPageUrl(pageUrl);
  },[showPreview])
  
  //下载二维码
  const downloadqrcode=()=>{
    let canvasDom = document.querySelector('#qrCode');
    let url = canvasDom.toDataURL('image/jpeg')
    let downloadElement = document.createElement('a')
    downloadElement.href = url;
    downloadElement.download = modalInfo.pageName+'.jpg';//下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); //点击下载
    document.body.removeChild(downloadElement); //下载完成移除元素
  }

  return (
    <>
      {/* 修改页面 */}
      <Modal title="查看" visible={showPreview} onOk={()=> {}} onCancel={()=> {closeModal(false)}}
      footer={null}>
        <div className={style.win_box}>
          <div className={style.title}>
            {modalInfo.modalType=='check' ? '页面二维码及URL地址已生成，请下载二维码或复制链接':''}
            {modalInfo.modalType=='pre' ? '请扫码二维码进行预览':''}
            {modalInfo.modalType=='publish' ? '页面已经发布成功，并为您生成了url地址及二维码':''}
          </div>
          <div className={style.con_box}>
            <div className={style.qr_code}>
              <QRCode
                id="qrCode"
                value={pageUrl}
                size={160} // 二维码的大小
                fgColor="#000000" // 二维码的颜色
                style={{ margin: 'auto' }}
              />
            </div>
            {modalInfo.modalType != 'pre' ? <div className={style.btn_box}>
              <Button type='primary' onClick={downloadqrcode}>下载二维码</Button>
              <CopyToClipboard text={pageUrl} 
              onCopy={() => message.success('成功，已复制到剪切板')}>
                <Button type='primary' >复制原链接</Button>
              </CopyToClipboard>
              {/* <Button type='primary'>复制原链接</Button> */}
            </div>:''}
          </div>
        </div>
      </Modal>
    </>
  )
}


export default connect(({ carowner_pageManage }) => ({
  allChannelList: carowner_pageManage.allChannelList,
}))(pageModal)







