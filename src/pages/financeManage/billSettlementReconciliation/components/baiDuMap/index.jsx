import React,{useEffect, useState} from "react"
import { connect,history } from 'umi'
import {
  Row,
  Col,
  Button,
  Checkbox,
} from "antd"
import style from "./style.less"

// 百度地图API功能
var map = {}
let points = [];//案件轨迹点
let DriveRoutePoints = [];//导航的所有点
let DriverPolyline = [];//地图轨迹
let playPolyline = null;
let timer = null; //定时器
let index = 0; //记录播放到第几个point
let car = null; //汽车图标
let startIcon = null;
let endIcon = null;
let arriveIcon = null;
var polylineData = [];//案件轨迹数据
let arrivePointRevertIndex= 0
/*百度线路经纬度优化*/
let optimiseLine = (linePoints,lineIndex) => {
  //优化的最少个数
  if(linePoints.length < 2){
    return linePoints;
  }
  // 优化到最后点
  if(lineIndex >= linePoints.length-1){
    return linePoints;
  }
  var dataA = linePoints[lineIndex-1],dataB = linePoints[lineIndex],dataC = linePoints[lineIndex+1];
  //时间去重
  if(dataA.reportTime === dataB.reportTime){
      linePoints.splice(lineIndex,1);
      return optimiseLine(linePoints,lineIndex);
    }
    if(dataB.reportTime === dataC.reportTime){
      linePoints.splice(lineIndex+1,1);
      return optimiseLine(linePoints,lineIndex);
    }
  var pointA = new BMap.Point(dataA.longitude, dataA.latitude);
  var pointB = new BMap.Point(dataB.longitude, dataB.latitude);
  var pointC = new BMap.Point(dataC.longitude, dataC.latitude);
  var lineAB = map.getDistance(pointA,pointB);
  var lineBC = map.getDistance(pointB,pointC);
  var timeAB = (new Date(dataB.reportTime).getTime() - new Date(dataA.reportTime).getTime())/1000;
  var timeBC = (new Date(dataC.reportTime).getTime() - new Date(dataB.reportTime).getTime())/1000;
  var speedAB = (lineAB/timeAB).toFixed(2);
  var speedBC = (lineBC/timeBC).toFixed(2);

  //速度去错 120km/h = 33.33m/s  72km/h = 20m/s
  var speedlimit = 20;
  if(speedAB > speedlimit){
    linePoints.splice(lineIndex,1);
    return optimiseLine(linePoints,lineIndex);
  }
  if(speedBC > speedlimit){
    linePoints.splice(lineIndex+1,1);
    return optimiseLine(linePoints,lineIndex);
  }
  ++lineIndex;
  return optimiseLine(linePoints,lineIndex);
}


const baiDuMapPage =(props)=>{
  let {dispatch, caseDetail, caseId, driverId, searchList} = props
  let [playVisible, setPlayVisible] = useState(true) //轨迹回放 按钮状态
  let [pauseVisible, setPauseVisible] = useState(true) //暂停 按钮状态
  let [followVisible, setFollowVisible] = useState(false) //画面跟随 按钮状态
  let [followStatus, setFollowStatus] = useState(false) //画面跟随 状态

  useEffect(() => {
    map = new window.BMap.Map("mapContainer");    // 创建Map实例
    // map.centerAndZoom("上海市", 16);  // 初始化地图,设置中心点坐标和地图级别
    let currentPoint = new window.BMap.Point(caseDetail.locationLongitude,caseDetail.locationLatitude);
    map.centerAndZoom(currentPoint, 16);  // 初始化地图,设置中心点坐标和地图级别
// <!-- 	map.addControl(new BMap.MapTypeControl());   //添加地图类型控件 -->
    map.setCurrentCity("上海");
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    //向地图添加控件
    map.addControl(new  window.BMap.NavigationControl());//平移缩放控件，默认在地图左上方
    map.addControl(new  window.BMap.ScaleControl());//比例尺控件，默认在地图左下方
    map.addControl(new  window.BMap.OverviewMapControl());//缩略图控件，默认在地图右下方
    let ctrl = new  window.BMapLib.TrafficControl({
      showPanel:  true//是否显示路况提示面板
    });
    map.addControl(ctrl);
    ctrl.setAnchor(BMAP_ANCHOR_TOP_RIGHT);
    map.clearOverlays()
  },[])
  useEffect(() => {
    if(Object.keys(caseDetail).length > 0){
      onSetIcon(caseDetail)
    }
  },[caseDetail])

  /*设置地图icon图标*/
  let onSetIcon = (data) => {
    let point = new  window.BMap.Point(data.locationLongitude, data.locationLatitude);
    map.panTo(point);
    let icon;
    if(data.caseStatus == 1){
      icon = new  window.BMap.Icon(require('../../../../../assets/map/accident-red-png-02.png'), new  window.BMap.Size(31,44));
      let accident = new  window. window.BMap.Marker(point,{icon});
      map.addOverlay(accident);
    }else if(data.caseStatus == 2 ){
      icon = new  window.BMap.Icon(require('../../../../../assets/map/accident-orange-png-01.png'), new  window.BMap.Size(35,45));
      let accident = new  window.BMap.Marker(point,{icon});
      map.addOverlay(accident);
    }else if(data.caseStatus == 3 || data.caseStatus == 5 || data.caseStatus == 6 || data.caseStatus == 11){
      icon = new  window.BMap.Icon(require('../../../../../assets/map/accident-green-png-01.png'), new  window.BMap.Size(36,41));
      startIcon = new  window.BMap.Icon(require('../../../../../assets/map/start_green.png'), new  window.BMap.Size(22,39));
      if(data.caseStatus != 3){
        arriveIcon = new  window.BMap.Icon(require('../../../../../assets/map/arrive_green.png'), new  window.BMap.Size(36,40));
      }
      let accident = new  window.BMap.Marker(point,{icon});
      map.addOverlay(accident);
    }else{
      icon = new  window.BMap.Icon(require('../../../../../assets/map/accident-deepgray-png-01.png'), new  window.BMap.Size(35,45));
      startIcon = new  window.BMap.Icon(require('../../../../../assets/map/start_grey.png'), new  window.BMap.Size(36,40));
      endIcon = new  window.BMap.Icon(require('../../../../../assets/map/endpoint_grey.png'), new  window.BMap.Size(36,40));
      arriveIcon = new  window.BMap.Icon(require('../../../../../assets/map/arrive_grey.png'), new  window.BMap.Size(36,40));
    }
    if(startIcon || arriveIcon || endIcon) {
      getLoadArrivedPointIndex(startIcon,arriveIcon,endIcon);
    }
  }
  /*获取 加载到达点的index*/
  let getLoadArrivedPointIndex = (startIcon, arriveIcon, endIcon) => {
    dispatch({
      type: 'financeMap/getLoadArrivedPointIndex',
      payload: {
        method: 'postJSON',
        params: {
          caseId
        }
      },
      callback: (arrivePointRevertIndex) => {
        getCasePolylineSearch(startIcon, arriveIcon, arrivePointRevertIndex, endIcon);
      }
    })
  }
  /*获取 案件多段线搜索*/
  let getCasePolylineSearch = (startIcon, arriveIcon, indexs, endIcon) => {
    points = [];
    if(driverId) {
      dispatch({
        type: 'financeMap/getCasePolylineSearch',
        payload: {
          method: 'postJSON',
          params: {
            caseId,
            driverId
          }
        },
        callback: (temp) => {
          polylineData = temp;
          arrivePointRevertIndex = indexs
          //原始路径描绘
          // resetMapPolyline();
          //优化轨迹
          mapPolyline()
          if(startIcon != undefined && points.length > 0){
            let startMarker = new  window.BMap.Marker(points[0], {icon:startIcon});
            startMarker.setOffset(new window.BMap.Size(0, -20));
            map.addOverlay(startMarker);
          }
          if(arriveIcon != undefined && points.length > 0){
            //选用未经优化的data点
            let pointContent = polylineData[polylineData.length - arrivePointRevertIndex -1];
            if(pointContent){
              let point = new  window.BMap.Point(pointContent.longitude, pointContent.latitude);
              let arriveMarker = new  window.BMap.Marker(point, {icon:arriveIcon});
              arriveMarker.setOffset(new  window.BMap.Size(0, -20));
              map.addOverlay(arriveMarker);
            }
          }
          if(endIcon != undefined  && points.length > 0){
            let endMarker = new  window.BMap.Marker(points[points.length - 1], {icon:endIcon});
            endMarker.setOffset(new  window.BMap.Size(0, -20));
            map.addOverlay(endMarker);
          }
        }
      })
    }
    index = 0
  }

  /*轨迹优化*/
  let mapPolyline = () =>{
    //优化路径描绘star
    points=[];
    DriveRoutePoints = [];
    reset();
    for(var i=0;i<DriverPolyline.length;i++){
      map.removeOverlay(DriverPolyline[i]);
    }
    DriverPolyline = [];
    let tempList = JSON.parse(JSON.stringify(polylineData))
    var optimiseData = optimiseLine(tempList,1, map);
    // var optimiseData = optimiseLine($.extend([],polylineData),1);
    var pointsStar = []; //紧凑点描绘，分开点导航;分段;
    for(var i = 0;i<optimiseData.length;i++){
      var dataA = optimiseData[i],pointA = new BMap.Point(dataA.longitude, dataA.latitude);
      points.push(pointA);
      pointsStar.push(pointA);
      if(i == (optimiseData.length-1)){
        DriverPolyline.push(new BMap.Polyline(pointsStar, {strokeColor: "#3299CC", strokeWeight: 5, strokeOpacity: 1}));
        map.addOverlay(DriverPolyline[DriverPolyline.length-1]);
        break;
      }
      var dataB = optimiseData[i+1],pointB = new BMap.Point(dataB.longitude, dataB.latitude);
      var timeAB = (new Date(dataB.reportTime).getTime() - new Date(dataA.reportTime).getTime())/1000;
      if(timeAB > 600){ //时间大于10分钟 导航路线
        DriverPolyline.push(new BMap.Polyline(pointsStar, {strokeColor: "#3299CC", strokeWeight: 5, strokeOpacity: 1}));
        map.addOverlay(DriverPolyline[DriverPolyline.length-1]);
        DriveRoute(pointA,pointB,i);
        pointsStar = [pointB];
      }
    }
    let drawMapLineForNocasePolyline = true;//对于空驶，完成案件无司机经纬度按一定规则绘画路线
    if(drawMapLineForNocasePolyline){
      if(optimiseData.length <=10 && caseDetail.caseStatus == 16){
        drawDriverToServiceLocation();
      }
      if(optimiseData.length <=10 && (caseDetail.caseStatus == 7 || caseDetail.caseStatus == 9)){
        drawDriverToServiceLocation();
      }
    }
    //end
  }



  /*绘制司机位置到服务地址路线*/
  let drawDriverToServiceLocation = () => {
    dispatch({
      type: 'financeMap/getLoadCaseTimeline',
      payload: {
        method: 'postJSON',
        params: {
          channelId: caseDetail.channelId,
          orderId: caseId,
          platformType: 2
        }
      },
      callback: (data) => {
        let startTime = 0,endTime = 0;
        for(let i = 0;i<data.length;i++){
          if(data[i].caseStatus == 3){
            startTime = data[i].updateTime;
          }
          if(caseDetail.caseStatus == 16 && data[i].caseStatus == 16){
            endTime = data[i].updateTime;
          }
          if(caseDetail.caseStatus == 7 && data[i].caseStatus == 7){
            endTime = data[i].updateTime;
          }
          if(caseDetail.caseStatus == 9 && data[i].caseStatus == 9){
            endTime = data[i].updateTime;
          }
        }
        let distanceTime = parseInt((new Date(endTime).getTime()- new Date(startTime).getTime())/1000);
        let distance = distanceTime*5;//司机速度5m/s
        distance = (distance<5000)?distance:5000;
        let startLatLng = GetAround(caseDetail.locationLatitude,caseDetail.locationLongitude,distance);
        let pointA = new  window.BMap.Point(startLatLng[1], startLatLng[0]),
            pointB =  new  window.BMap.Point(caseDetail.locationLongitude,caseDetail.locationLatitude);
        new  window.BMap.Geocoder().getLocation(pointA, (data) => {
          if(data.surroundingPois && data.surroundingPois.length > 0){
            pointA = data.surroundingPois[0].point;
          }
          points.push(pointA);
          points.push(pointB);
          let startIcon = new  window.BMap.Icon(require('../../../../../assets/map/start_grey.png'), new  window.BMap.Size(36,40));
          let startP = new  window.BMap.Marker(pointA,{icon:startIcon});
          map.addOverlay(startP);
          let arriveIcon = new  window.BMap.Icon(require('../../../../../assets/map/arrive_grey.png'), new  window.BMap.Size(36,40));
          let arriveP =  new  window.BMap.Marker(pointB,{icon:arriveIcon});
          map.addOverlay(arriveP);

          if(caseDetail.caseStatus == 16){
            DriveRouteEmpty(pointA,pointB,0);
          }else{
            DriveRoute(pointA,pointB,0);
          }

          if(caseDetail.destLatitude && caseDetail.caseStatus != 16){
            drawDestinationToServiceLocation();
          }
        })

      }
    })
  }

  //长距离点导航
  let DriveRouteEmpty = (pointA,pointB,index) => {
    let drawLine = (results) => {
      let planObj = results.getPlan(0);
      // 绘制驾车线路
      let route = planObj && planObj.getRoute(0);
      if(route){
        // 驾车线路
        let lenTemp=parseInt(route.getPath().length*2/3);
        DriverPolyline.push(new  window.BMap.Polyline(route.getPath().slice(0,lenTemp), {strokeColor: "#3299CC", strokeWeight: 5, strokeOpacity: 1}));
        map.addOverlay(DriverPolyline[DriverPolyline.length-1]);
        let item = {
          number:index,
          list:route.getPath()
        }
        DriveRoutePoints[index] = route.getPath();
      }
    }
    let driving = new  window.BMap.DrivingRoute(map,{onSearchComplete:drawLine});
    driving.search(pointA, pointB);
  }

  let DriveRoute = (pointA,pointB,index) => {
    let drawLine = (results) => {
      let planObj = results.getPlan(0);
      // 绘制驾车线路
      let route = planObj && planObj.getRoute(0);

      // 驾车线路
      if(route) {
        DriverPolyline.push(new  window.BMap.Polyline(route.getPath(), {strokeColor: "#3299CC", strokeWeight: 5, strokeOpacity: 1}));
        map.addOverlay(DriverPolyline[DriverPolyline.length-1]);
        let item = {
          number:index,
          list:route.getPath()
        }
        DriveRoutePoints[index] = route.getPath();

      }
    }
    let driving = new  window.BMap.DrivingRoute(map,{onSearchComplete:drawLine});
    driving.search(pointA, pointB);
  }

  //服务地址到目的地轨迹
  let drawDestinationToServiceLocation = () => {
    let pointA =  new  window.BMap.Point(caseDetail.locationLongitude,caseDetail.locationLatitude),
        pointB = new  window.BMap.Point(caseDetail.destLongitude,caseDetail.destLatitude);
    points.push(pointA);
    points.push(pointB);
    let endIcon = new  window.BMap.Icon(require('../../../../../assets/map/endpoint_grey.png'), new  window.BMap.Size(36,40));
    let endP = new  window.BMap.Marker(pointB,{icon: endIcon});
    map.addOverlay(endP);
    DriveRoute(pointA,pointB,0);

  }
  //根据提供的经度和纬度、以及半径，取得此半径内的最大最小经纬度
  let GetAround = (latitude, longitude, raidusMile) => {
    latitude = Number(latitude),longitude = Number(longitude);
    let PI = 3.14159265;
    let degree = (24901 * 1609) / 360.0;
    let dpmLat = 1 / degree;
    let radiusLat = dpmLat * raidusMile;
    let minLat = latitude - radiusLat;
    let maxLat = latitude + radiusLat;
    let mpdLng = degree * Math.cos(latitude * (PI / 180));
    let dpmLng = 1 / mpdLng;
    let radiusLng = dpmLng * raidusMile;
    let minLng = longitude - radiusLng;
    let maxLng = longitude + radiusLng;
    return [minLat, minLng, maxLat, maxLng];
  }

  /*轨迹回放*/
  let playv = () => {

    //得到路线上的所有point
// 	    points = driving.getResults().getPlan(0).getRoute(0).getPath();
    //画面移动到起点和终点的中间
// 	    centerPoint = new BMap.Point((points[0].lng + points[points.length - 1].lng) / 2, (points[0].lat + points[points.length - 1].lat) / 2);
//	     map.panTo(centerPoint);
    //连接所有点
// 	   label = new BMap.Label("", {offset: new BMap.Size(-20, -20)});
    car = new window.BMap.Marker(points[0]);
// 	   car.setLabel(label);
    map.addOverlay(car);
    //点亮操作按钮
// 	    });
    //回放加入导航路线
    if(DriveRoutePoints && DriveRoutePoints.length>0){
      for(let i = DriveRoutePoints.length-1; i >= 0; i--){
        if(DriveRoutePoints[i]){
          let pointStar = points.slice(0,i);
          let pointEnd = points.slice(i+1,-1);
          points = pointStar.concat(DriveRoutePoints[i],pointEnd);
        }
      }
      DriveRoutePoints = [];//一次赋值，防止重复
    }
    play()
  }

  let play = () => {
    setPlayVisible(true)
    setPauseVisible(false)
    setFollowVisible(true)
    let point = points[index];
    let playPoints = points.filter(function(item,pI){
      if(pI <= index){
        return true;
      }else{
        return false;
      }
    })
    if(index > 0) {
      if(playPolyline){
        map.removeOverlay(playPolyline);
      }
      playPolyline = new window.BMap.Polyline(playPoints, {strokeColor: "red", strokeWeight: 1, strokeOpacity: 1})
      map.addOverlay(playPolyline);
    }
    car.setPosition(point);
    index++;
    if(followStatus) {
      map.panTo(point);
    }
    if(index < points.length) {
      timer = window.setTimeout(() => {
        play(index)
      }, 200);
    } else {
      setPlayVisible(true)
      setPauseVisible(true)
      map.panTo(point);
    }
  }
  /*暂停*/
  let pause = () => {
    setPlayVisible(false)
    setPauseVisible(true)
    setFollowVisible(false)
    if(timer) {
      window.clearTimeout(timer);
    }
  }
  /*重置*/
  let reset = () => {
    if(playPolyline){
      map.removeOverlay(playPolyline);
      map.removeOverlay(car);
    }
    setPlayVisible(false)
    setPauseVisible(true)
    setFollowStatus(false)
    setFollowVisible(false)

    if(timer) {
      window.clearTimeout(timer);
    }
    index = 0;
  }

  /*画面跟随*/
  let onCheckChange = (e) => {
    let status = e.target.checked
    setFollowStatus(status)
  }
  return(
      <div className={style.map_box}>
        <Row>
          <Col span={12} className={style.map_title}>
            地图信息
          </Col>
          <Col span={12}  align="right" className={style.map_head}>
            <Checkbox onChange={onCheckChange} checked={followStatus} disabled={followVisible}>画面跟随</Checkbox>
            <Button type="primary" disabled={playVisible} onClick={playv}>轨迹回放</Button>
            <Button type="primary" disabled={pauseVisible} onClick={pause}>暂停</Button>
            <Button onClick={reset}>重置</Button>
          </Col>
        </Row>
        <div className={style.map_content} id={'mapContainer'} />
      </div>
  )
}
export default connect(({baiDuMap})=>({
  searchList: baiDuMap.searchList
}))(baiDuMapPage)


