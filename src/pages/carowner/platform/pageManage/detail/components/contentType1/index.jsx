import React, { useEffect, useState, useCallback } from "react"
import { connect, history } from 'umi'
import {
	Input, Upload, message, Button, Radio, Tabs, InputNumber, Select, Divider
} from "antd";
import { LoadingOutlined, PlusOutlined, DeleteOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { uploadIcon } from '@/services/activity.js';
import SetColor from '@/pages/activityModule/components/setColor';   //选择颜色组件
import style from "./style.less"
const { TabPane } = Tabs;
const { Option, OptGroup } = Select;

// 11分类1
let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));
const contentType1 = (props) => {
	const { dispatch, putItem, listSelect } = props;
	// 总数据list内容设置
	let [formData, setFormData] = useState([])//数据列表
	// 总数据style样式设置
	let [formDataStyle, setFormDataStyle] = useState([{}])
	let [activeKey, setActiveKey] = useState('1')
	let positionTypeArr = [
		{ positionName: '文章', positionType: '0' },
		{ positionName: '链接', positionType: '1' },
		{ positionName: '内部链接', positionType: '2' }
	]


	useEffect(() => {
		setActiveKey('1');//重置tab
		if (JSON.stringify(putItem)!='{}') {
			let newObj = JSON.parse(JSON.stringify(putItem));
			setFormData(newObj.compList);
			setFormDataStyle(newObj.compStyle)
		}
	}, [putItem])

	useEffect(() => {
		// 下拉数据
		dispatch({
			type: 'carowner_pageManage/queryPageListSelect',
			payload: {
				method: 'post',
				params: {
					pageChannelId: tokenObj.channelId
				}
			}
		})
	}, [])


	useEffect(() => {
		if(putItem.isClick){
      delete putItem.isClick;return;
    }
		let newObj = JSON.parse(JSON.stringify(putItem));
		newObj.compList = JSON.parse(JSON.stringify(formData));
		newObj.compStyle = JSON.parse(JSON.stringify(formDataStyle));

		dispatch({
			type: 'carowner_pageManage/setSendItem',
			payload: newObj
		})
	}, [formData, formDataStyle])

	// 菜单名称
	let menuChange = (i, e) => {
		let toFormData = formData;
		toFormData[i].menuName = e.target.value;
		setFormData([...toFormData]);
	};
	// 改变定位类型
	let locationTypeChange = (i, e) => {
		let toFormData = formData;
		toFormData[i].positionType = e;
		setFormData([...toFormData]);
	}
	// 展示链接（输入框）
	let linkChange = (i, e) => {
		let toFormData = formData;
		toFormData[i].outsideUrl = e.target.value;
		setFormData([...toFormData]);
	};
	// 展示链接(下拉框)
	let selectChange = (i, e) => {
		let toFormData = formData;
		toFormData[i].insideUrl = e.toString();
		setFormData([...toFormData]);
	};

	//增加图片列表
	let addList = e => {
		let toFormData = formData;
		toFormData.push({ menuName: "", positionType: "0", insideUrl: '', outsideUrl: '' })
		setFormData([...toFormData]);
	}

	//颜色
	let setMcolor = (n, i) => {
		let toFormDataStyle = formDataStyle;
		toFormDataStyle[0][n] = i;
		setFormDataStyle([...toFormDataStyle]);
	};
	//列表删除及上下
	let setListTs = (name, int) => {
		let toFormData = formData;
		if (name == "up") {   //上移
			if (int > 0) {
				toFormData.splice(int - 1, 0, (toFormData[int]))
				toFormData.splice(int + 1, 1)
			}
		} else if (name == "dele") {//删除
			toFormData.splice(int, 1)
		} else if (name == "down") {//下移
			toFormData.splice(int + 2, 0, (toFormData[int]))
			toFormData.splice(int, 1)
		}
		setFormData([...toFormData]);
	}

	let onUpChange = e => {
		let toFormDataStyle = formDataStyle;
		toFormDataStyle[0].marginTop = e.target.value
		setFormDataStyle([...toFormDataStyle]);
	}
	let onLowChange = e => {
		let toFormDataStyle = formDataStyle;
		toFormDataStyle[0].marginBottom = e.target.value
		setFormDataStyle([...toFormDataStyle]);
	}

	return (
		<div className={style.wrap}>
			<Tabs defaultActiveKey="1" activeKey={activeKey} onTabClick={setActiveKey} className={style.wrap_tab}>
				<TabPane tab="内容设置" key="1">
					<div className={style.wrap_box}>
						<div className={style.wrap_child2}>
							<div className={style.wrap_list}>
								{
									formData.map((item, index) => {
										return <div className={style.wrap_list_li}>
											<div style={{ margin: '10px' }}>
												<span style={{ marginRight: '20px' }}>菜单名称</span>
												<Input style={{ width: 320 }} onChange={menuChange.bind(this, index)} value={item.menuName} />
											</div>
											<div style={{ margin: '10px' }}>
												<span style={{ marginRight: '20px' }}>定位类型</span>
												<Select defaultValue={item.positionType} style={{ width: 320 }} onChange={locationTypeChange.bind(this, index)}>
													{
														positionTypeArr.map((v) => <Option key={v.positionType} value={v.positionType}>{v.positionName}</Option>)
													}
												</Select>
											</div>
											{
												item.positionType == '1' ?
													<div style={{ margin: '10px' }}>
														<span style={{ marginRight: '20px' }}>展示链接</span>
														<Input style={{ width: 320 }} onChange={linkChange.bind(this, index)} value={item.outsideUrl} />
													</div> :
													item.positionType == '2' ?
														<div style={{ margin: '10px' }}>
															<span style={{ marginRight: '20px' }}>展示链接</span>
															<Select style={{ width: 320 }} value={item.insideUrl} onChange={selectChange.bind(this, index)}>
																{
																	listSelect.map((v) => <Option key={v.objectId} value={(v.objectId).toString()}>{v.pageName}</Option>)
																}
															</Select>
														</div> : ''
											}
											<div className={style.wrap_list_li_tools}>
												<span onClick={() => { setListTs("up", index) }}><UpOutlined /></span>
												<span onClick={() => { setListTs("dele", index) }}><DeleteOutlined /></span>
												<span onClick={() => { setListTs("down", index) }}><DownOutlined /></span>
											</div>
										</div>
									})
								}
								<Button className={style.wrap_list_btn} onClick={addList} icon={<PlusOutlined />}>继续添加组件</Button>
							</div>
						</div>
					</div>
				</TabPane>
				<TabPane tab="样式设置" key="2">
					<div className={style.wrap_box2}>
						<h5>颜色设置</h5>
						<div className={style.wrap_box2_main}>
							<div className={style.wrap_box2_p}>
								<strong>背景色</strong>
								<div className={style.wrap_box2_top}><SetColor colors={formDataStyle[0].backgroundColor} colorName='backgroundColor' setMColor={setMcolor} ></SetColor></div>
							</div>
							<div className={style.wrap_box2_p}>
								<strong>未选中色</strong>
								<div className={style.wrap_box2_top}><SetColor colors={formDataStyle[0].frontUncheckColor} colorName='frontUncheckColor' setMColor={setMcolor} ></SetColor></div>
							</div>
							<div className={style.wrap_box2_p}>
								<strong>选中色</strong>
								<div className={style.wrap_box2_top}> <SetColor colors={formDataStyle[0].frontCheckColor} colorName='frontCheckColor' setMColor={setMcolor} ></SetColor></div>
							</div>
						</div>
						<Divider />
						<h5>间距设置</h5>
						<h6>小中大分别对应：小间距 0px；中间距 15px；大间距 30px</h6>
						<div>
							<div style={{ background: '#E7E9ED' }}>
								{/* 上间距 */}
								<div style={{ margin: '10px' }}>
									<strong style={{ margin: '0 20px' }}>上间距</strong>
									<strong style={{ margin: '0 20px' }}>{formDataStyle[0].marginTop}</strong>

									<Radio.Group onChange={onUpChange} value={formDataStyle[0].marginTop} style={{ margin: '20px' }}>
										<Radio.Button value="0px">小间距</Radio.Button>
										<Radio.Button value="15px">中间距</Radio.Button>
										<Radio.Button value="30px">大间距</Radio.Button>
									</Radio.Group>
								</div>

								<div style={{ margin: '10px' }}>
									{/* 下间距 */}
									<strong style={{ margin: '0 20px' }}>下间距</strong>
									<strong style={{ margin: '0 20px' }}>{formDataStyle[0].marginBottom}</strong>

									<Radio.Group onChange={onLowChange} value={formDataStyle[0].marginBottom} style={{ margin: '20px' }}>
										<Radio.Button value="0px">小间距</Radio.Button>
										<Radio.Button value="15px">中间距</Radio.Button>
										<Radio.Button value="30px">大间距</Radio.Button>
									</Radio.Group>
								</div>
							</div>
						</div>
					</div>
				</TabPane>
			</Tabs>
		</div >
	)
};
export default connect(({ carowner_pageManage }) => ({
	putItem: carowner_pageManage.putItem,
	listSelect: carowner_pageManage.listSelect,
}))(contentType1)
