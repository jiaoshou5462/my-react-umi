import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Row, Col, Form, Space, Radio, Input, Select, Button, Tooltip, DatePicker, message, Upload, InputNumber } from 'antd';
import ContentTypeModal from './contentTypeModal'
import SetColor from '@/pages/activityModule/components/setColor';   //选择颜色组件
import { uploadIcon } from '@/services/activity.js';
import { PlusOutlined, QuestionCircleOutlined, CloseCircleOutlined, NotificationOutlined, LeftOutlined, EllipsisOutlined } from '@ant-design/icons';
import styles from './style.less';
import { dataURLtoFile, readFile } from '@/utils/utils'
import moment from 'moment'
import { formatDate, formatTime } from '@/utils/date'
import Modal from 'antd/lib/modal/Modal';


const { TextArea, Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const addEditContentPage = (props) => {
  let { dispatch, typeItem, isUpdate, detailContObj } = props;
  let [form] = Form.useForm();

  let headers = { "accessToken": JSON.parse(localStorage.getItem('tokenObj')).accessToken };
  let [contentTypeVisible, setContentTypeVisible] = useState(false) //内容类型弹窗

  let contentId = history.location.query.id;
  // console.log(typeItem, 'typeItem')
  useEffect(() => {
    if (history.location.query.type == 'edit') {
      getDetailPopupContent()
    } else {
      dispatch({
        type: 'popupContentManage/setTypeData',
        payload: {
          typeItem: {},
          isUpdate: false
        }
      })
    }
  }, [])

  useEffect(() => {
    form.setFieldsValue({
      contentType: typeItem.type
    })
  }, [typeItem])
  let [editContentType, setEditContentType] = useState(null);
  // 查看弹窗内容详情(编辑)
  let getDetailPopupContent = () => {
    dispatch({
      type: 'popupContentManage/getDetailPopupContent',
      payload: {
        method: 'get',
        params: {},
        id: contentId,
      },
      callback: (res) => {
        if (res.result.code == '0') {
          dispatch({
            type: 'popupContentManage/setTypeData',
            payload: {
              typeItem: {},
              isUpdate: false
            }
          })
          setEditContentType(res.body.contentType);

          let popupContentJson = res.body.popupContentJson;
          setButtonFillColor(popupContentJson.buttonFillColor);
          setButtonFontColor(popupContentJson.buttonFontColor);
          setWordContentFontColor(popupContentJson.wordContentFontColor);
          setWordFontColor(popupContentJson.wordFontColor);
          setPictureUrl(popupContentJson.pictureUrl);
          setFileList([{ url: popupContentJson.pictureUrl }]);

          setwordTitle(popupContentJson.wordTitle)
          setwordContent(popupContentJson.wordContent)
          setbuttonClerk(popupContentJson.buttonClerk)


          let popupIntervalVO = res.body.popupIntervalVO;
          setDisplayFrequencyType(popupIntervalVO.displayFrequencyType)
          setIntervalValue(popupIntervalVO.intervalValue)
          setIntervalUnit(popupIntervalVO.intervalUnit)


          form.setFieldsValue({
            contentName: res.body.contentName,
            contentType: res.body.contentType,
            ...popupContentJson,
            ...popupIntervalVO,
            remark: res.body.remark,
          })
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  let beforeUpload = (file) => {
    console.log(file, 'file')
    const isPictureFormat = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';
    if (!isPictureFormat) {
      message.error('请上传JPG/PNG/JPEG/GIF 格式图片!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能高于 5MB!');
    }

    return isPictureFormat && isLt5M;
  }

  // 颜色
  const [buttonFillColor, setButtonFillColor] = useState('#f00');
  const [buttonFontColor, setButtonFontColor] = useState('#333');
  const [wordContentFontColor, setWordContentFontColor] = useState('#333');
  const [wordFontColor, setWordFontColor] = useState('#333');

  let setMcolor = (name, color) => {//name,颜色值
    if (name == 'buttonFillColor') {
      setButtonFillColor(color)
    } else if (name == 'buttonFontColor') {
      setButtonFontColor(color)
    } else if (name == 'wordContentFontColor') {
      setWordContentFontColor(color)
    } else if (name == 'wordFontColor') {
      setWordFontColor(color)
    }
  }

  // 显示频率
  // displayFrequencyType 1、不限制，2、间隔
  const [displayFrequencyType, setDisplayFrequencyType] = useState(1);
  const frequencyChange = (e) => {
    setDisplayFrequencyType(e.target.value)
  }
  // intervalValue间隔值
  const [intervalValue, setIntervalValue] = useState(null);
  const intervalValChange = (e) => {
    setIntervalValue(e)
  }
  // intervalUnit间隔单位(1：分钟 ,2：小时 ,3：天)
  const [intervalUnit, setIntervalUnit] = useState(1);
  const intervalUnitChange = (e) => {
    setIntervalUnit(e)
  }

  // 点击提交保存
  const onSubmit = (value) => {
    console.log(value, 'value')
    if (displayFrequencyType == 2) {
      if (!intervalValue) {
        message.error('请输入间隔时间')
        return;
      }
    } else {
      setIntervalValue(null);
      setIntervalUnit(null);
    }
    dispatch({
      type: 'popupContentManage/getSavePopupContent',
      payload: {
        method: 'postJSON',
        params: {
          id: contentId ? contentId : null,
          contentName: value.contentName,
          contentType: contentId ? editContentType : typeItem.type,
          popupContentJson: {
            buttonClerk: value.buttonClerk,
            // buttonFillColor: buttonFillColor,
            // buttonFontColor: buttonFontColor,
            buttonLink: value.buttonLink,
            pictureLink: value.pictureLink,
            pictureUrl: pictureUrl,
            wordContent: value.wordContent,
            // wordContentFontColor: wordContentFontColor,
            // wordFontColor: wordFontColor,
            wordTitle: value.wordTitle
          },
          popupIntervalVO: {
            displayFrequencyType: displayFrequencyType,//value.displayFrequencyType,
            intervalUnit: intervalUnit,//value.displayFrequencyType,
            intervalValue: intervalValue,//value.displayFrequencyType
          },
          remark: value.remark
        }
      },
      callback: (res) => {
        if (res.result.code === '0') {
          message.success('提交成功')
          history.push({
            pathname: '/popupTouchManage/popupContent'
          })
        } else {
          message.error(res.result.message)
        }
      }
    })
  }

  // 上传按钮
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

  const [pictureUrl, setPictureUrl] = useState('');
  const [fileList, setFileList] = useState([])//上传图片
  let changeImage = (info) => {
    console.log(info, 'info')

    const isPictureFormat = info.file.type === 'image/jpeg' || info.file.type === 'image/png' || info.file.type === 'image/jpg' || info.file.type === 'image/gif';
    if (!isPictureFormat) {
      // message.error('请上传JPG/PNG/JPEG/GIF 格式图片!');
      setPictureUrl('');
      form.setFieldsValue({ pictureUrl: '' })
      setFileList([])
    } else {
      if (info.file.status === 'done') {
        let pictureUrl = info.file.response.items//地址
        // 图片尺寸
        let _image = new Image();
        _image.src = pictureUrl;
        _image.onload = () => {
          // if (_image.width > 315 || _image.height > 400) {
          //   message.warning("图片尺寸不符合");
          //   setPictureUrl('');
          //   form.setFieldsValue({ pictureUrl: '' })
          //   setFileList([])
          // } else {
            setPictureUrl(pictureUrl);
            form.setFieldsValue({
              pictureUrl: pictureUrl
            })
          // }
        }
      }

      let fileList = [...info.fileList];
      fileList.map(file => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      })
      console.log(fileList, 'fileList')
      setFileList(fileList)
    }
  }

  //删除图片
  let removeImage = () => {
    setFileList([])
    setPictureUrl('')
  }
  let [wordTitle, setwordTitle] = useState('');
  let [wordContent, setwordContent] = useState('');
  let [buttonClerk, setbuttonClerk] = useState('');
  let wordTitleChange = (e) => {
    setwordTitle(e.target.value)
  }
  let wordContentChange = (e) => {
    setwordContent(e.target.value)
  }
  let buttonClerkChange = (e) => {
    setbuttonClerk(e.target.value)
  }
  return (
    <>
      <h2 className={styles.wrap_h2}></h2>
      <div className={styles.block__header}>
        <h3>{contentId ? '编辑弹窗内容' : '新建弹窗内容'}</h3>
      </div>
      <Form form={form} onFinish={onSubmit} wrapperCol={{ span: 12 }}>
        <Row className={styles.saleTaskInfo_box}>
          <Col span={16}>
            <Row justify="center" align="center">
              <Col span={24}>
                <Form.Item label="名称" name='contentName' labelCol={{ flex: '0 0 150px' }} rules={[{ required: true, message: "请输入名称" }]}>
                  <Input placeholder="请输入" maxLength="15"></Input>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="内容类型" name='contentType' labelCol={{ flex: '0 0 150px' }} rules={[{ required: true, message: "请选择内容类型" }]}>
                  {/*   */}
                  <Button onClick={() => { setContentTypeVisible(true) }} disabled={(isUpdate || contentId) ? true : ''}><PlusOutlined />选择类型</Button>
                  {
                    isUpdate ? <div style={{ margin: '20px 0 10px' }}>已选择：{typeItem.title}</div>
                      : editContentType ?
                        <div style={{ margin: '20px 0 10px' }}>
                          已选择：
                          {
                            editContentType == 1 ? '图片' :
                              editContentType == 2 ? '图片+按钮' :
                                editContentType == 3 ? '图片+文字+按钮' :
                                  editContentType == 4 ? '文字+按钮' : ''
                          }
                        </div>
                        : ''
                  }
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="图片上传" name='pictureUrl' labelCol={{ flex: '0 0 150px' }} rules={[{ required: true, message: "请上传图片" }]}>
                  <Upload
                    name="files"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={{ showPreviewIcon: false }}
                    headers={headers}
                    action={uploadIcon}
                    fileList={fileList}
                    beforeUpload={beforeUpload}
                    onChange={changeImage}
                    maxLength={1}
                    onRemove={removeImage}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                    {/* {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton} */}
                  </Upload>
                  <p>建议尺寸：315*400，图片格式支持png、jpeg、jpg、gif</p>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="图片链接" name='pictureLink' labelCol={{ flex: '0 0 150px' }} rules={[{ required: true, message: "请输入图片链接" }]}>
                  <Input placeholder="请输入"></Input>
                </Form.Item>
              </Col>
              {/* <>
                    <Col span={24} style={{ position: 'relative' }}>
                      <Form.Item label="标题" name='wordTitle' labelCol={{ flex: '0 0 150px' }} rules={[{ required: true, message: "请输入标题" }]}>
                        <Form.Item noStyle label="标题" name='wordTitle' labelCol={{ flex: '0 0 150px' }}>
                          <Input placeholder="请输入" onChange={wordTitleChange}></Input>
                        </Form.Item>
                        <div style={{ position: 'absolute', top: '3px', right: '-130px' }}>
                          <div style={{ display: 'flex' }}>
                            <span style={{ marginRight: '10px' }}>字体颜色</span>
                            <SetColor colors={wordFontColor} colorName='wordFontColor' setMColor={setMcolor} />
                          </div>
                        </div>
                      </Form.Item>
                    </Col>
                    <Col span={24} style={{ position: 'relative' }}>
                      <Form.Item label="内容" name='wordContent' labelCol={{ flex: '0 0 150px' }} rules={[{ required: true, message: "请输入内容" }]}>
                        <Form.Item noStyle label="内容" name='wordContent' labelCol={{ flex: '0 0 150px' }}>
                          <TextArea rows={4} placeholder="请输入" onChange={wordContentChange} />
                        </Form.Item>
                        <div style={{ position: 'absolute', top: '3px', right: '-130px' }}>
                          <div style={{ display: 'flex' }}>
                            <span style={{ marginRight: '10px' }}>字体颜色</span>
                            <SetColor colors={wordContentFontColor} colorName='wordContentFontColor' setMColor={setMcolor} />
                          </div>
                        </div>
                      </Form.Item>
                    </Col>
                    <Col span={24} style={{ position: 'relative' }}>
                      <Form.Item label="按钮文案" name='buttonClerk' labelCol={{ flex: '0 0 150px' }} rules={[{ required: true, message: "请输入按钮文案" }]}>
                        <Form.Item noStyle label="按钮文案" name='buttonClerk' labelCol={{ flex: '0 0 150px' }} >
                          <Input placeholder="请输入" onChange={buttonClerkChange} maxLength="6"></Input>
                        </Form.Item>
                        <div style={{ position: 'absolute', top: '3px', right: '-130px' }}>
                          <div style={{ display: 'flex' }}>
                            <span style={{ marginRight: '10px' }}>字体颜色</span>
                            <SetColor colors={buttonFontColor} colorName='buttonFontColor' setMColor={setMcolor} />
                          </div>
                        </div>
                        <div style={{ position: 'absolute', top: '3px', right: '-260px' }}>
                          <div style={{ display: 'flex' }}>
                            <span style={{ marginRight: '10px' }}>填充颜色</span>
                            <SetColor colors={buttonFillColor} colorName='buttonFillColor' setMColor={setMcolor} />
                          </div>
                        </div>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item label="按钮链接" name='buttonLink' labelCol={{ flex: '0 0 150px' }} rules={[{ required: true, message: "请输入按钮链接" }]}>
                        <Input placeholder="请输入"></Input>
                      </Form.Item>
                    </Col>
                  </> */}
              <Col span={24}>
                <Form.Item
                  className={styles.showRate}
                  label={<>
                    <Tooltip placement="bottom" title="全局配置：当内容被多个场景同时调用时，需要遵循此规则。">
                      <QuestionCircleOutlined style={{ marginRight: '10px' }} />
                    </Tooltip>
                    显示频率
                  </>}
                  labelCol={{ flex: '0 0 150px' }}>
                  <Radio.Group defaultValue={displayFrequencyType} value={displayFrequencyType} onChange={frequencyChange}>
                    {/* displayFrequencyType 1、不限制，2、间隔)*/}
                    <Radio value={1}>不限制</Radio>
                    <Radio value={2}>
                      <span style={{ marginRight: "20px" }}>每次弹出</span>
                      {/* intervalValue间隔值 */}
                      {
                        displayFrequencyType == 2 ?
                          <>触达后 <InputNumber style={{ width: '20%', marginRight: '10px' }} min={0} defaultValue={intervalValue} value={intervalValue} onChange={intervalValChange} /></>
                          : ''
                      }
                    </Radio>
                  </Radio.Group>
                  {
                    displayFrequencyType == 2 ?
                      <>
                        <Select className={styles.unitSelect} defaultValue={intervalUnit} value={intervalUnit} onChange={intervalUnitChange}>
                          {/* intervalUnit间隔单位(1：分钟 ,2：小时 ,3：天) */}
                          <Option value={1}>分钟</Option>
                          <Option value={2}>小时</Option>
                          <Option value={3}>天</Option>
                        </Select> 可再次弹出
                      </> : ''
                  }

                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="备注说明" name='remark' labelCol={{ flex: '0 0 150px' }}>
                  <TextArea rows={4} placeholder="请输入" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          {/* 右 */}
          <Col span={8} className={styles.right_col}>
            <div className={styles.right_bg} style={{ backgroundImage: `url(${require('@/assets/phoneView.png')})` }}>
              {
                typeItem.type == 1 || editContentType == 1 ?
                  <>
                    <div className={styles.viewModalBox1}>
                      <div className={styles.imgBox1}>
                        {
                          pictureUrl ?
                            <img src={pictureUrl} /> :
                            <img src={require('@/assets/defaultImg.png')} />
                        }
                      </div>
                    </div>
                    <div className={styles.closeIcon1}>
                      <CloseCircleOutlined className={styles.index_rule_close} />
                    </div>
                  </> : ''
              }

              {/* 后续迭代 */}
              {/* {
                typeItem.type == 1 ?
                  <>
                    <div className={styles.viewModalBox1}>
                      <div className={styles.imgBox1}>
                        {
                          pictureUrl ?
                            <img src={pictureUrl} /> :
                            <img src={require('@/assets/defaultImg.png')} />
                        }
                      </div>
                    </div>
                    <div className={styles.closeIcon}>
                      <CloseCircleOutlined className={styles.index_rule_close} />
                    </div>
                  </> :
                  typeItem.type == 2 ?
                    <>
                      <div className={styles.viewModalBox1}>
                        <div className={styles.imgBox1}>
                          {
                            pictureUrl ?
                              <img src={pictureUrl} /> :
                              <img src={require('@/assets/defaultImg.png')} />
                          }
                        </div>
                        <div className={styles.btnBox2}>
                          <Button shape="round" className={styles.btn2} style={{ color: buttonFontColor }}>{buttonClerk ? buttonClerk : ''}</Button>
                        </div>
                      </div>
                      <div className={styles.closeIcon}>
                        <CloseCircleOutlined className={styles.index_rule_close} />
                      </div>
                    </> :
                    typeItem.type == 3 ?
                      <>
                        <div className={styles.viewModalBox3}>
                          <div className={styles.imgBox3}>
                            {
                              pictureUrl ?
                                <img src={pictureUrl} /> :
                                <img src={require('@/assets/defaultImg.png')} />
                            }
                          </div>
                          <div className={styles.cont}>
                            <h4 style={{ color: wordFontColor }}>{wordTitle ? wordTitle : ''}</h4>
                            <p style={{ color: wordContentFontColor }}>{wordContent ? wordContent : ''}</p>
                            <Button shape="round" className={styles.btn} style={{ color: buttonFontColor }}>{buttonClerk ? buttonClerk : ''}</Button>
                          </div>
                        </div>
                        <div className={styles.closeIcon}>
                          <CloseCircleOutlined className={styles.index_rule_close} />
                        </div>
                      </> :
                      typeItem.type == 4 ?
                        <>
                          <div className={styles.viewModalBox3}>
                            <div className={styles.cont4}>
                              <h4 style={{ color: wordFontColor }}>{wordTitle ? wordTitle : ''}</h4>
                              <p style={{ color: wordContentFontColor }}>{wordContent ? wordContent : ''}</p>
                              <Button shape="round" className={styles.btn} style={{ color: buttonFontColor }}>{buttonClerk ? buttonClerk : ''}</Button>
                            </div>
                          </div>
                          <div className={styles.closeIcon}>
                            <CloseCircleOutlined className={styles.index_rule_close} />
                          </div>
                        </> : ''
              } */}
            </div>
          </Col>
          <Col span={24} className={styles.btn_box} justify="end">
            <Space size={24}>
              <Button htmlType="button" onClick={() => { history.goBack() }}>取消</Button>
              <Button htmlType="submit" type="primary">提交</Button>
            </Space>
          </Col>
        </Row>
      </Form>
      {
        contentTypeVisible ?
          <ContentTypeModal
            contentTypeVisible={contentTypeVisible}
            editContentType={editContentType}
            closeModal={() => { setContentTypeVisible(false) }}
          /> : ''
      }
    </>
  )
}
export default connect(({ popupContentManage }) => ({
  typeItem: popupContentManage.typeItem,
  isUpdate: popupContentManage.isUpdate,
  detailContObj: popupContentManage.detailContObj
}))(addEditContentPage);
