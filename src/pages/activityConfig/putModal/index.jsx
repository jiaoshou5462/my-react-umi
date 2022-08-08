import React, { useEffect, useState } from "react"
import { connect, history } from 'umi'
import {
  Row,
  Tag,
  Form,
  Space,
  Input,
  Modal,
  Table,
  Select,
  Button,
  message,
  Pagination,
  ConfigProvider,
  DatePicker,
  Spin
} from "antd"
import style from "./style.less"
import { CopyToClipboard } from 'react-copy-to-clipboard'
const putModalPage = (props) => {
  let { dispatch, putData, putVisible, onHidePutModal } = props,
    [visible, setVisible] = useState(false),
    [longLink, setLongLink] = useState(''), //长链接
    [shortLink, setShortLink] = useState(''), //短连接
    [qrUrl, setQrUrl] = useState(''), //二维码
    [qrPoster, setQrPoster] = useState(''), //二维码海报
    [themePoster, setThemePoster] = useState(''), //主题海报
    [bannerUrl, setBannerUrl] = useState(''), //banner图
    [type, setType] = useState(1),  /*type 1长链接 2短连接 3二维码 4二维码海报 5主题海报 6banner图*/
    [list, setList] = useState([]),
    [loading, setLoading] = useState(true),
    [isEnd, setIsEnd] = useState(false),
    [channelLinkName, setChannelLinkName] = useState('');

  /*回调*/
  useEffect(() => {
    if (putVisible) {
      setVisible(putVisible);
      getActivityLinkList();
    }
  }, [putVisible])
  useEffect(() => {
    if (Object.keys(putData).length > 0) {
      if (putData.status == 5) {
        setIsEnd(true);
      }
      if (type !== 0) {
        getActivityLink()
      }
    }
  }, [putData, type])
  /*获取复制内容*/
  let getActivityLink = () => {
    /*type 1长链接 2短连接 3二维码 4二维码海报 5主题海报 6banner图*/
    let data = {
      type,
      activityId: putData.objectId,
      channelId: putData.channelId,
    }
    dispatch({
      type: 'putModal/getActivityLink',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          if (type === 1) {
            setLongLink(res.body.link)
            setType(2)
          }
          if (type === 2) {
            setShortLink(res.body)
            setType(3)
          }
          if (type === 3) {
            setQrUrl(res.body)
            setType(4)
          }
          if (type === 4) {
            setQrPoster(res.body)
            setType(5)
          }
          if (type === 5) {
            setThemePoster(res.body)
            setType(6)
          }
          if (type === 6) {
            setBannerUrl(res.body)
            setType(0)
            setLoading(false);
          }
        } else {
          if (type === 1) {
            setType(2)
          }
          if (type === 2) {
            setType(3)
          }
          if (type === 3) {
            setType(4)
          }
          if (type === 4) {
            setType(5)
          }
          if (type === 5) {
            setType(6)
          }
          if (type === 6) {
            setType(0)
          }
          message.error(res.result.message)
        }
      }
    })
  }
  /*获取投放列表*/
  let getActivityLinkList = () => {
    /*type 1长链接 2短连接 3二维码*/
    let data = {
      activityId: putData.objectId,
    }
    dispatch({
      type: 'putModal/getActivityLinkList',
      payload: {
        method: 'postJSON',
        params: data
      },
      callback: (res) => {
        if (res.result.code === '0') {
          setList(res.body)
        } else {
          message.error(res.result.message)
        }
      }
    })
  }
  let renderColumns = () => {
    return (
      [{
        title: '渠道ID',
        dataIndex: 'id',
      }, {
        title: '渠道名称',
        dataIndex: 'throwInName',
      }, {
        title: '操作',
        dataIndex: 'channelId',
        render: (channelId, record) => operating(record)
      }]
    )
  }
  //投放渠道输入
  let onChannelName = (e) => {
    setChannelLinkName(e.target.value);
  }
  //投放渠道添加
  let addChannelLine = () => {
    if (channelLinkName) {
      let data = {
        activityId: putData.objectId,
        channelId: putData.channelId,
        throwInName: channelLinkName
      }
      dispatch({
        type: 'putModal/saveActivityThrowIn',
        payload: {
          method: 'postJSON',
          params: data
        },
        callback: (res) => {
          if (res.result.code === '0') {
            getActivityLinkList();
            setChannelLinkName("");
            message.success(res.result.message);
          } else {
            message.error(res.result.message)
          }
        }
      })
    } else {
      message.error('请先输入渠道名称')
    }
  }
  let operating = (record) => {
    return <span className={`${style.click_blue}`} >
      <span><a href={record.qrCode} target='_blank' download='活动二维码'>下载二维码</a></span>
      <CopyToClipboard text={record.longUrl} onCopy={() => message.success('复制成功')}>
        <span>复制原链接</span>
      </CopyToClipboard>
      <CopyToClipboard text={record.shortUrl} onCopy={() => message.success('复制成功')}>
        <span>复制短链接</span>
      </CopyToClipboard>
    </span>
  }
  let onCancel = () => {
    onHidePutModal(false)
    setVisible(false)
  }
  return (
    <>
      <Modal
        width={1000}
        title="投放"
        footer={null}
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
      >
        <div className={style.put_modal_flex}>
          <div>
            <img className={style.put_modal_img} src={qrUrl}></img>
          </div>
          <div className={style.put_modal_btnWrap}>
            {/* <div className={style.put_modal_btn}> */}
            <div className={style.put_modal_btn1}>
              <Button type="primary" ghost>
                <a href={qrUrl} target='_blank' download='活动二维码' >下载二维码</a>
              </Button>
            </div>
            <div className={style.put_modal_btn1} >
              <CopyToClipboard text={longLink} onCopy={() => message.success('复制成功')}>
                <Button type="primary" ghost>
                  复制原链接
                </Button>
              </CopyToClipboard>
            </div>
            <div className={style.put_modal_btn1}>
              <CopyToClipboard text={shortLink} onCopy={() => message.success('复制成功')}>
                <Button type="primary" ghost>
                  复制短链接
                </Button>
              </CopyToClipboard>
            </div>
            {qrPoster ? 
              <div className={style.put_modal_btn1}>
                <Button type="primary" ghost>
                  <a href={qrPoster} target='_blank' download='二维码海报' >生成二维码海报</a>
                </Button>
              </div> 
            : null}
            {themePoster ?
              <div className={style.put_modal_btn1}>
                <Button type="primary" ghost>
                  <a href={themePoster} target='_blank' download='主题海报' >下载主题海报</a>
                </Button>
              </div>
            : null}
            {bannerUrl ?
              <div className={style.put_modal_btn1}>
                <Button type="primary" ghost>
                  <a href={bannerUrl} target='_blank' download='banner图' >下载banner图</a>
                </Button>
              </div>
            : null}
          </div>
          
        </div>
        {
          !isEnd ? <div className={style.put_modal_head}>
            <div>
              <Input placeholder="请输入渠道名称" value={channelLinkName} onChange={onChannelName} />
            </div>
            <div>
              <Button type="primary" className={style.put_modal_head_btn} onClick={addChannelLine}>添加渠道</Button>
            </div>
          </div> : null
        }

        <Table
          locale={{ emptyText: '暂无数据' }}
          columns={renderColumns()}
          dataSource={list}
          pagination={false}
          loading={{
            spinning: false,
            delay: 500
          }}
        />
        <div className={style.put_modal_remark}>提示：微信广告投放需要用原链接</div>
      </Modal>
      {loading && visible ? <div className={style.layer_loading}><Spin size='large' /></div> : ''}
    </>
  )
};
export default connect(({ putModal }) => ({
}))(putModalPage)
