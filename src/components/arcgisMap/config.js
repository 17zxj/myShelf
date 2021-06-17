
import { loadModules } from 'esri-loader';
import config from '@/config';
import { message } from 'antd';
import YLZIcon from '@/assets/mapIcon/YLZ.png';
import LLZIcon from '@/assets/mapIcon/LLZ.png';
import YWZIcon from '@/assets/mapIcon/YWZ.png';
import SPZIcon from '@/assets/mapIcon/SPZ.png';
import POINTIcon from '@/assets/mapIcon/point.png';
import WSJIcon from '@/assets/mapIcon/wsj.png';
import YSJIcon from '@/assets/mapIcon/ysj.png';
import CNJIcon from '@/assets/mapIcon/cnj.png';
import SSJIcon from '@/assets/mapIcon/ssj.png';
import FMJIcon from '@/assets/mapIcon/fmj.png';
import DSJIcon from '@/assets/mapIcon/dsj.png';
import CXJIcon from '@/assets/mapIcon/cxj.png';
import YLJIcon from '@/assets/mapIcon/ylj.png';
import SFJIcon from '@/assets/mapIcon/sfj.png';
import BZIcon from '@/assets/mapIcon/bz.png';
import YSBIcon from '@/assets/mapIcon/ysb.png';
import HFCIcon from '@/assets/mapIcon/hfc.png';
import FMIcon from '@/assets/mapIcon/fm.png';
import ZMIcon from '@/assets/mapIcon/zm.png';
import PSHIcon from '@/assets/mapIcon/psh.png';
import WSCIcon from '@/assets/mapIcon/wsc.png';
import TFJIcon from '@/assets/mapIcon/tfj.png';
import YLYIcon from '@/assets/mapIcon/yly.png';
import PFKIcon from '@/assets/mapIcon/pfk.png';
message.config({
    maxCount: 1,
});
const geometryServiceUrl = 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer'
const mapServiceUrl = 'http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/MapServer'
export default {
    center:[112.36,25.5926],
    addFeatureLayer : (data,map)=>{
        const myOptions = config.arcGisOption;
        loadModules(["esri/layers/FeatureLayer"],myOptions).then(([FeatureLayer])=>{
            data.map((v,i)=>{
                let featureLayer  = v.renderer?new FeatureLayer({
                    url: v.url,
                    outFields: ["*"] ,
                    renderer: v.renderer,  //渲染器 
                    definitionExpression: v.definitionExpression || {}  //查询条件 
                }): new FeatureLayer({
                    url: v.url,
                    mode: FeatureLayer.MODE_SNAPSHOT,   
                    outFields: ["*"] ,
                    // definitionExpression: v.definitionExpression || {}  //查询条件 
                });
                featureLayer.myType = v.title
                featureLayer.myDetailUrl = v.detailUrl
                featureLayer.myDetailType = v.detailType
                featureLayer.detailModalWidth = v.detailModalWidth
                featureLayer.detailSearchUrl = v.detailSearchUrl
                map.add(featureLayer)
                v.layer = featureLayer
                // console.log(featureLayer)
                // featureLayer.queryFeatures().then(function(results){
                //     // prints the array of result graphics to the console
                //     console.log(`图层${i}`,results.features);
                // });
            })
            
        })
        return data
    },
    queryFeatures: (query,featuresLayer) => {
        featuresLayer.queryFeatures().then(function(results){
            // prints the array of result graphics to the console
            console.log(results.features);
        });
    },
    queryTask:(queryUrl,queryWhere,callback,needAdd = true)=>{
        const myOptions = config.arcGisOption;
        loadModules(["esri/tasks/QueryTask","esri/tasks/support/Query"],myOptions).then(([QueryTask,Query])=>{
            const queryTask = new QueryTask({
                url: queryUrl
            });
            let query = new Query();
            query.returnGeometry = true;
            query.outFields = ["*"];
            query.where = needAdd?`${queryWhere} and is_deleted = 0`:`${queryWhere}`;

            queryTask.execute(query).then(function(results){
                // console.log("查询成功",results.features);
                callback(results.features)
            });
            
            // When resolved, returns a count of the features that satisfy the query.
            // queryTask.executeForCount(query).then(function(results){
            //     console.log(results);
            // });  
        })
    },
    addGraphicLayer:(map,callback)=>{
        const myOptions = config.arcGisOption;
        loadModules([
            "esri/layers/GraphicsLayer",
        ], myOptions).then(([ 
            GraphicsLayer
        ]) => {
            const layer = new GraphicsLayer({});
            map && map.add(layer);
            callback && callback(layer)
        })
    },
    addGraphic:(geometry,symbol,layer,callback,attributes=null) =>{
        const myOptions = config.arcGisOption;
        loadModules(["esri/Graphic"],myOptions).then(([Graphic])=>{
            const graphic = new Graphic({
                attributes:attributes,
                geometry: geometry,
                symbol: symbol,
            });
            layer.graphics.add(graphic)
            callback && callback(graphic)
        })
    },
    addDraw:(type,view,symbol,callback,setLongLat,graphicsLayer)=>{
        const myOptions = config.arcGisOption;
        loadModules([
            "esri/views/draw/Draw",
            "esri/Graphic",
        ], myOptions).then(([ 
            Draw,
            Graphic,
        ]) => {

            const mapdraw = new Draw({
                view: view,
            });
            
            function createPointGraphic(coordinates,isComplete){
                if(graphicsLayer){
                    graphicsLayer.removeAll()
                }else{
                    view.graphics.removeAll();
                }
                
                const point = {
                  type: "point", // autocasts as /Point
                  x: coordinates[0],
                  y: coordinates[1],
                  spatialReference: view.spatialReference
                };

                const polyline = {
                    type: "polyline", // autocasts as Polyline
                    paths: coordinates,
                    spatialReference: view.spatialReference
                };

                const polygon = {
                    type: "polygon", // autocasts as Polygon
                    rings: coordinates,
                    spatialReference: view.spatialReference
                };

                const list = {
                    "point":point,
                    "polyline":polyline,
                    "polygon":polygon
                }
              
                const graphic = new Graphic({
                  geometry: list[type],
                  symbol: symbol
                });

                if(graphicsLayer){
                    graphicsLayer.add(graphic)
                }else{
                    view.graphics.add(graphic);
                }

                setLongLat(graphic,isComplete)
                
            }


            callback(mapdraw,createPointGraphic)
        })
    },

    // 添加经纬度
    addCoordinateConversion: (view,callback) => {
        const myOptions = config.arcGisOption;
        loadModules([
            "esri/widgets/CoordinateConversion",
        ],myOptions).then(([CoordinateConversion])=>{
            const ccWidget = new CoordinateConversion({
                view: view
            });
            // view.ui.add(ccWidget, "top-right");
            // console.log("ccWidget",ccWidget)
            callback && callback(ccWidget)
            // var newFormat = new Format({
            //     // The format's name should be unique with respect to other formats used by the widget
            //     name: "XYZ",
            //     conversionInfo: {
            //       // Define a convert function
            //       // Point -> Position
            //       convert: function(point) {
            //         var returnPoint = point.spatialReference.isWGS84
            //           ? point
            //           : webMercatorUtils.webMercatorToGeographic(point);
            //         var x = returnPoint.x.toFixed(4);
            //         var y = returnPoint.y.toFixed(4);
            //         var z = returnPoint.z.toFixed(4);
            //         return {
            //           location: returnPoint,
            //           coordinate: `${x}, ${y}, ${z}`
            //         };
            //       },
            //       // Define a reverse convert function
            //       // String -> Point
            //       reverseConvert: function(string) {
            //         var parts = string.split(",");
            //         return new Point({
            //           x: parseFloat(parts[0]),
            //           y: parseFloat(parts[1]),
            //           z: parseFloat(parts[2]),
            //           spatialReference: { wkid: 4326 }
            //         });
            //       }
            //     },
            //     // Define each segment of the coordinate
            //     coordinateSegments: [
            //       {
            //         alias: "X",
            //         description: "Longitude",
            //         searchPattern: numberSearchPattern
            //       },
            //       {
            //         alias: "Y",
            //         description: "Latitude",
            //         searchPattern: numberSearchPattern
            //       },
            //       {
            //         alias: "Z",
            //         description: "Elevation",
            //         searchPattern: numberSearchPattern
            //       }
            //     ],
            //     defaultPattern: "X°, Y°, Z"
            //   });
      
            //   // add our new format to the widget's dropdown
            //   ccWidget.formats.add(newFormat);
        })
    },

    // 测距测面
    /**
     * 
     * @param {string} type 类型 point/polyline/polygon 
     * @param {*} view 
     */
    measure:(type,view,callback,completeback,changeCursor)=>{
        const myOptions = config.arcGisOption;
        loadModules([
            "esri/widgets/Sketch/SketchViewModel",
            "esri/Graphic",
            "esri/layers/GraphicsLayer",
            "esri/tasks/GeometryService",
            "esri/tasks/support/LengthsParameters",
            "esri/tasks/support/AreasAndLengthsParameters"
        ], myOptions).then(([ 
            SketchViewModel,
            Graphic,
            GraphicsLayer,
            GeometryService,
            LengthsParameters,
            AreasAndLengthsParameters
        ]) => {
            const graphicsLayer = new GraphicsLayer({
                id:'graphic'
            })
            view.map.add(graphicsLayer)

            const polylineSymbol = {
                type: 'simple-line',
                color: '#FB4830',
                width: '2',
                style: 'solid'
            }

            const polygonSymbol = {
                type: 'simple-fill',
                color: 'rgba(36, 127, 238, 0.38)',
                style: 'solid',
                outline: {
                    color: '#FB4830',
                    width: '1'
                }
            }

            const sketchViewModel = new SketchViewModel({
                updateOnGraphicClick: false,
                view: view,
                layer: graphicsLayer,
                polylineSymbol:polylineSymbol,
                polygonSymbol:polygonSymbol
            })

            sketchViewModel.create(type)

            sketchViewModel.on('create-complete',(evt)=>{
                const graphic = new Graphic({
                    geometry: evt.geometry,
                    symbol: sketchViewModel.graphic.symbol
                })
                graphicsLayer.add(graphic)
            })

            sketchViewModel.on('create',(evt)=>{
                if(evt.state == "complete"){
                    message.loading("测算中")
                    const geometryService = new GeometryService({
                        url:geometryServiceUrl
                    })
                    if(type == "polyline"){
                        let newPaths = config.spArray(2,evt.graphic.geometry.paths[0]);
                        let polylines = []
                        newPaths.map((v,i)=>{
                            let geo = {
                                type: "polyline", // autocasts as Polyline
                                paths: v,
                                spatialReference: view.spatialReference
                            };
                            let polyline = new Graphic({
                                geometry: geo,
                                symbol: polylineSymbol
                            });
                            polylines.push(polyline.geometry)
                        })
                        const lengthsParameters = new LengthsParameters();
                        lengthsParameters.calculationType = "planar";
                        lengthsParameters.polylines = polylines;
                        lengthsParameters.lengthUnit = GeometryService.UNIT_METER;
                        lengthsParameters.geodesic = true;
                        geometryService.lengths(lengthsParameters).then(res=>{
                            message.success("测算完成",2)
                            completeback && completeback()
                            let points = evt.graphic.geometry.paths[0]
                            points.map((v,i)=>{
                                let textSymbol;
                                let pointSymbol = {
                                    type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                                    size: "6px",
                                    color: [226, 119, 40]
                                }
                                if(i == 0){
                                    textSymbol = {
                                        type: "text",  // autocasts as new TextSymbol()
                                        color: "#1199FF",
                                        haloColor: "#FFFFFF",
                                        haloSize: "1px",
                                        text: "起点",
                                        xoffset: 3,
                                        yoffset: 3,
                                        font: {  // autocasts as new Font()
                                          size: 12,
                                          family: "Josefin Slab",
                                          weight: "bold"
                                        }
                                    };
                                }else if(i == points.length-1){
                                    textSymbol = {
                                        type: "text",  // autocasts as new TextSymbol()
                                        color: "#1199FF",
                                        haloColor: "#FFFFFF",
                                        haloSize: "1px",
                                        text: `终点:${res.lengths[i-1]>3000?(res.lengths[i-1]/1000).toFixed(2)+'千米':res.lengths[i-1].toFixed(2)+'米'}`,
                                        xoffset: 3,
                                        yoffset: 3,
                                        font: {  // autocasts as new Font()
                                          size: 12,
                                          family: "Josefin Slab",
                                          weight: "bold"
                                        }
                                    };
                                }else{
                                    textSymbol = {
                                        type: "text",  // autocasts as new TextSymbol()
                                        color: "#1199FF",
                                        haloColor: "#FFFFFF",
                                        haloSize: "1px",
                                        text: `${res.lengths[i-1]>3000?(res.lengths[i-1]/1000).toFixed(2)+'千米':res.lengths[i-1].toFixed(2)+'米'}`,
                                        xoffset: 3,
                                        yoffset: 3,
                                        font: {  // autocasts as new Font()
                                          size: 12,
                                          family: "Josefin Slab",
                                          weight: "bold"
                                        }
                                    };
                                }
                                const point = {
                                    type: "point",
                                    x: v[0],
                                    y: v[1],
                                    spatialReference: view.spatialReference
                                };
                                const graphic = new Graphic({
                                    geometry: point,
                                    symbol: textSymbol
                                });
                                const graphic2 = new Graphic({
                                    geometry: point,
                                    symbol: pointSymbol
                                });
                                graphicsLayer.addMany([graphic,graphic2])
                            })
                            
                        })
                    }else if(type == "polygon"){
                        const centerPoint = {
                            type:'point',
                            x: evt.graphic.geometry.centroid.longitude,
                            y: evt.graphic.geometry.centroid.latitude,
                            spatialReference: view.map.spatialReference
                        }
                       
                        const areasAndLengthsParameters = new AreasAndLengthsParameters();
                        areasAndLengthsParameters.polygons = evt.graphic.geometry;
                        areasAndLengthsParameters.areaUnit = 'square-meters';
                        areasAndLengthsParameters.length = 'meters';
                        geometryService.areasAndLengths(areasAndLengthsParameters).then(res=>{
                            message.success("测算完成",2)
                            completeback && completeback()
                            const  text = `面积：${res.areas[0]>10000?(res.areas[0]/10000).toFixed(2)+'万平方米':res.areas[0].toFixed(2)+'平方米'}
                                            周长：${res.lengths[0].toFixed(2)+'米'}`
                            const textSymbol = {
                                type: "text",  // autocasts as new TextSymbol()
                                color: "#1199FF",
                                haloColor: "#FFFFFF",
                                haloSize: "1px",
                                text: text,
                                xoffset: 3,
                                yoffset: 3,
                                font: {  // autocasts as new Font()
                                  size: 12,
                                  family: "Josefin Slab",
                                  weight: "bold"
                                }               
                            }
                            const graphic = new Graphic({
                                geometry: centerPoint,
                                symbol: textSymbol
                            });
                            graphicsLayer.add(graphic)
                        })
                    }
                }else if(evt.state == "active"){
                    changeCursor("ing")
                }
            })

            callback && callback(graphicsLayer,sketchViewModel)

        })
    },

    // 连通性分析
    connectServices: (connnetPoints,callback) => {
        console.log("connnetPoints",connnetPoints)
        const myOptions = config.arcGisOption;
        loadModules([
            "esri/tasks/RouteTask",
            "esri/tasks/support/RouteParameters",
            "esri/tasks/support/FeatureSet"
        ],myOptions).then(([RouteTask,RouteParameters,FeatureSet])=>{
            const routeTask = new RouteTask({
                url: "http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/9"
            });
            let routeParams = new RouteParameters({
                stops: new FeatureSet(),
                outSpatialReference: {
                  // autocasts as new SpatialReference()
                  wkid: 4326
                },
                returnRoutes:true
            });
            connnetPoints.map((v,i)=>{
                routeParams.stops.features.push(v);
            })
            routeTask.solve(routeParams).then(callback);
        })
    },

    // buffer 缓冲区分析
    bufferServices: (graphic,view,distances=0,callback) => {
        const myOptions = config.arcGisOption;
        loadModules([
            "esri/Graphic",
            "esri/tasks/GeometryService",
            "esri/geometry/SpatialReference",
            "esri/tasks/support/BufferParameters",
        ],myOptions).then(([
            Graphic,
            GeometryService,
            SpatialReference,
            BufferParameters
        ])=>{
            const geometryService = new GeometryService({
                url:geometryServiceUrl
            })
            const bufferSymbol = {
                type: 'simple-fill',
                color: [248, 121, 111, 0.5],
                style: 'solid',
                outline: {
                    color: [248, 121, 111, 0.5],
                    width: '1'
                }     
            }
            let params = new BufferParameters({
                distances: [distances],
                unit: "meters",
                geodesic: false,
                bufferSpatialReference: new SpatialReference({wkid: 3857}),
                outSpatialReference: view.spatialReference,
                geometries: [graphic.geometry]
            })
           
            geometryService.buffer(params).then(res=>{
                let bufferGeoOut
                res.map((v,i)=>{
                    let graphic = new Graphic(v, bufferSymbol);
                    view.graphics.add(graphic);
                    bufferGeoOut = graphic
                })
                callback && callback(res,bufferGeoOut)
            });
        })
    },

    // 空间查询 多图层 但无属性过滤
    identifyQuery: (geometry,layerIds,view,callback) => {
        const myOptions = config.arcGisOption;
        loadModules([
            "esri/tasks/IdentifyTask",
            "esri/tasks/support/IdentifyParameters"
        ],myOptions).then(([
            IdentifyTask, IdentifyParameters
        ])=>{
            const identifyTask = new IdentifyTask(mapServiceUrl)

            let params = new IdentifyParameters();
            params = new IdentifyParameters();
            params.tolerance = 5;   //容差
            params.layerIds = layerIds;  //空间查询的图层
            params.layerOption = "all";  //空间查询的条件  visible
            params.width = view.width;
            params.height = view.height;
            params.geometry = geometry;
            params.mapExtent = view.extent;
            params.returnGeometry  = true;

            identifyTask
            .execute(params)
            .then((response)=>{
                callback && callback(response)
            })
        })
    },

    // 单一图层兼属性的空间查询
    queryTaskByGeometry:(queryUrl,queryWhere,geometry,view,callback)=>{
        const myOptions = config.arcGisOption;
        loadModules(["esri/tasks/QueryTask","esri/tasks/support/Query"],myOptions).then(([QueryTask,Query])=>{
            const queryTask = new QueryTask({
                url: queryUrl
            });
            let query = new Query();
            query.returnGeometry = true;
            query.outFields = ["*"];
            query.where = `${queryWhere}`;

            query.geometry = geometry;
            query.spatialRelationship = "intersects";
            query.outSpatialReference = view.spatialReference;

            queryTask.execute(query).then(function(results){
                // console.log("查询成功",results.features);
                callback(results.features)
            });
        })
    },

    // mapServer 图层请求
    addMapImage:(layerUrl,map,definitionExpression,callback)=>{
        const myOptions = config.arcGisOption;
        loadModules(["esri/layers/MapImageLayer"],myOptions).then(([MapImageLayer])=>{
            let layers = [];
            definitionExpression.map((v,i)=>{
                var layer = new MapImageLayer({
                    url: layerUrl,
                    sublayers: [
                        {
                            id: 10,
                            visible: true,
                            definitionExpression:v
                        }, 
                        {
                            id: 9,
                            visible: false
                        }, 
                        {
                            id: 8,
                            visible: false
                        }, 
                        {
                            id: 7,
                            visible: false,
                        }, 
                        {
                            id: 6,
                            visible: false,
                        }, 
                        {
                            id: 5,
                            visible: false,
                        }, 
                        {
                            id: 4,
                            visible: false,
                        }, 
                        {
                            id: 3,
                            visible: false,
                        }, 
                        {
                            id: 2,
                            visible: false,
                        }, 
                        {
                            id: 1,
                            visible: false,
                        }, 
                        {
                            id: 0,
                            visible: false,
                        }
                    ],
                });
                map.add(layer);
                layers.push(layer)
            })
            callback && callback(layers)
        })
    },

    // 图层地址及渲染器
    ylzRender: {
        title:"雨量站",
        key:"雨量站",
        icon:'icon-yuliangzhan',
        iconStyle:{color:'#1199FF'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/1",
        detailUrl: `${config.baseUrl}/jiahe/jhRainStation/detail`,
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": YLZIcon,
                "width": "20px",
                "height": "22px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhRainStation/detail`,
        detailType:'ylz',
        detailModalWidth:412,
        detailSearchUrl:`${config.baseUrl}/jiahe/jhRainRealData/getHisRainCurve` 
    },
    llzRender:{
        title:"流量站",
        key:"流量站",
        icon:'icon-liuliang',
        iconStyle:{color:'#1199FF'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/2",
        detailUrl: `${config.baseUrl}/jiahe/jhFlowStation/detail`,
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": LLZIcon,
                "width": "20px",
                "height": "22px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhFlowStation/detail`,
        detailType:'llz',
        detailModalWidth:412,
        detailSearchUrl:`${config.baseUrl}/jiahe/jhFlowRealData/getHisFlowCurve` 
    },
    ywzRender:{
        title:"液位站",
        key:"液位站",
        icon:'icon-yewei',
        iconStyle:{color:'#1199FF'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/0",
        detailUrl: `${config.baseUrl}/jiahe/jhWaterLevelStation/detail`,
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": YWZIcon,
                "width": "20px",
                "height": "22px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhWaterLevelStation/detail`,
        detailType:'ywz',
        detailModalWidth:412,
        detailSearchUrl:`${config.baseUrl}/jiahe/jhWaterLevelRealData/getHisLevelCurve` 
    },
    spzRender:{
        title:"视频监控",
        key:"视频监控",
        icon:'icon-shipinjiankong',
        iconStyle:{color:'#1199FF'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/3",
        detailUrl: `${config.baseUrl}/jiahe/jhVideoStation/detail`,
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": SPZIcon,
                "width": "20px",
                "height": "22px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhVideoStation/detail`,
        detailType:'spjkz',
        detailModalWidth:412
    },
    // 排水户
    pshRender:{
        title:"排水户",
        key:"排水户",
        icon:'icon-weibiaoti-26',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/4",
        detailUrl: `${config.baseUrl}/jiahe/jhSewerageUser/detail`,
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": PSHIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhSewerageUser/detail`,
        detailType:'psh',
        detailModalWidth:400
    },
    // 污水处理厂
    wscRender:{
        title:"污水处理厂",
        key:"污水处理厂",
        icon:'icon-weibiaoti-24',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/5",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": WSCIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhSewageTreatmentPlant/detail`,
        detailType:'wsc',
        detailModalWidth:400
    },
    // 受纳水体（河道）
    riverRender:{
        title:"河道",
        key:"河道",
        icon:'icon-weibiaoti-27',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/6",
        renderer:{
            "type": "simple",
            "symbol": {
                type: "simple-fill", // autocasts as SimpleFillSymbol
                color: [100,185,250,0.7],
                style: "solid",
                outline: {  // autocasts as SimpleLineSymbol
                  color: "#63b9f9",
                  width: 1
                }
            }
        },
        definitionExpression:"is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhReceiveRiver/detail`,
        detailType:'snhd',
        detailModalWidth:400
    },
    // 受纳水体（湖泊）
    lakeRender:{
        title:"湖泊",
        key:"湖泊",
        icon:'icon-weibiaoti-25',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/7",
        renderer:{
            "type": "simple",
            "symbol": {
                type: "simple-fill", // autocasts as SimpleFillSymbol
                color: [100,185,250,0.7],
                style: "solid",
                outline: {  // autocasts as SimpleLineSymbol
                  color: "#64B9FA",
                  width: 1
                }
            }
        },
        definitionExpression:"is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhReceiveLake/detail`,
        detailType:'snhp',
        detailModalWidth:400 
    },
    // 管点
    pointRender: {
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        }
    },
    // 污水管网
    wslineRender:{
        title:"污水管网",
        key:"污水管网",
        icon:'icon-guanwang',
        iconStyle:{color:'#009BFF'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/9",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "simple-line",
                "color": "#009BFF",
                "width": "4px",
            }
        },
        definitionExpression:"type = '污水' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhLine/detail`,
        detailType:'gx',
        detailModalWidth:326
    },
    // 雨水管网
    yslineRender:{
        title:"雨水管网",
        key:"雨水管网",
        icon:'icon-guanwang',
        iconStyle:{color:'#00C159'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/9",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "simple-line",
                "color": "#00C159",
                "width": "4px",
            }
        },
        definitionExpression:"type = '雨水' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhLine/detail`,
        detailType:'gx',
        detailModalWidth:326
    },
    // 雨污合流/混接
    ywlineRender:{
        title:"雨污合流",
        key:"雨污合流",
        icon:'icon-guanwang',
        iconStyle:{color:'#EC9940'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/9",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "simple-line",
                "color": "#EC9940",
                "width": "4px",
            }
        },
        definitionExpression:"type = '雨污合流' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhLine/detail`,
        detailType:'gx',
        detailModalWidth:326
    },
    // 附属物
    wsjRender: {
        title:"污水井",
        key:"污水井",
        icon:'icon-weibiaoti-11',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": WSJIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"appendant_type = '污水井' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'jcj',
        detailModalWidth:412,
        detailSearchUrl:`${config.baseUrl}/jiahe/jhWaterLevelRealData/getHisWaterLevelCurveNew` 
    },
    ysjRender:{
        title:"雨水井",
        key:"雨水井",
        icon:'icon-weibiaoti-12',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": YSJIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"appendant_type = '雨水井' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'jcj',
        detailModalWidth:412,
        detailSearchUrl:`${config.baseUrl}/jiahe/jhWaterLevelRealData/getHisWaterLevelCurveNew`     
    },
    cnjRender:{
        title:"沉泥井",
        key:"沉泥井",
        icon:'icon-weibiaoti-13',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": CNJIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"appendant_type = '沉泥井' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'jcj',
        detailModalWidth:412,
        detailSearchUrl:`${config.baseUrl}/jiahe/jhWaterLevelRealData/getHisWaterLevelCurveNew` 
    },
    ssjRender:{
        title:"渗水井",
        key:"渗水井",
        icon:'icon-weibiaoti-17',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": SSJIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"appendant_type = '渗水井' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'jcj',
        detailModalWidth:412,
        detailSearchUrl:`${config.baseUrl}/jiahe/jhWaterLevelRealData/getHisWaterLevelCurveNew`     
    },
    fmjRender:{
        title:"阀门井",
        key:"阀门井",
        icon:'icon-weibiaoti-9',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": FMJIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"appendant_type = '阀门井' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'jcj',
        detailModalWidth:412,
        detailSearchUrl:`${config.baseUrl}/jiahe/jhWaterLevelRealData/getHisWaterLevelCurveNew`     
    },
    dsjRender:{
        title:"跌水井",
        key:"跌水井",
        icon:'icon-weibiaoti-15',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": DSJIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"appendant_type = '跌水井' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'jcj',
        detailModalWidth:412,
        detailSearchUrl:`${config.baseUrl}/jiahe/jhWaterLevelRealData/getHisWaterLevelCurveNew`     
    },
    tfjRender:{
        title:"通风井",
        key:"通风井",
        icon:'icon-weibiaoti-2',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": TFJIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"appendant_type = '通风井' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'jcj',
        detailModalWidth:412,
        detailSearchUrl:`${config.baseUrl}/jiahe/jhWaterLevelRealData/getHisWaterLevelCurveNew`    
    },
    cxjRender:{
        title:"冲洗井",
        key:"冲洗井",
        icon:'icon-weibiaoti-18',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": CXJIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"appendant_type = '冲洗井' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'jcj',
        detailModalWidth:412,
        detailSearchUrl:`${config.baseUrl}/jiahe/jhWaterLevelRealData/getHisWaterLevelCurveNew`     
    },
    yljRender:{
        title:"溢流井",
        key:"溢流井",
        icon:'icon-weibiaoti-1',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": YLJIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"appendant_type = '溢流井' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'jcj',
        detailModalWidth:412,
        detailSearchUrl:`${config.baseUrl}/jiahe/jhWaterLevelRealData/getHisWaterLevelCurveNew`     
    },
    sfjRender:{
        title:"水封井",
        key:"水封井",
        icon:'icon-weibiaoti-3',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": SFJIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"appendant_type = '水封井' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'jcj',
        detailModalWidth:412,
        detailSearchUrl:`${config.baseUrl}/jiahe/jhWaterLevelRealData/getHisWaterLevelCurveNew`     
    },
    bzRender:{
        title:"泵站",
        key:"泵站",
        icon:'icon-weibiaoti-7',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": BZIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"appendant_type = '泵站' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPointPump/detail`,
        detailType:'bz',
        detailModalWidth:367    
    },
    pfkRender:{
        title:"排放口",
        key:"排放口",
        icon:'icon-weibiaoti-221',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": PFKIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"appendant_type = '排放口' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPointDischargeOutlet/detail`,
        detailType:'pfk',
        detailModalWidth:356
    },
    ysbRender:{
        title:"雨水篦",
        key:"雨水篦",
        icon:'icon-weibiaoti-6',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": YSBIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"appendant_type = '雨水篦' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'biz',
        detailModalWidth:358     
    },
    wsbRender:{
        title:"污水篦",
        key:"污水篦",
        icon:'icon-weibiaoti-6',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": YSBIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"appendant_type = '污水篦' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'biz',
        detailModalWidth:358   
    },
    ylyRender:{
        title:"溢流堰",
        key:"溢流堰",
        icon:'icon-weibiaoti-29',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": YLYIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"appendant_type = '溢流堰' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPointWeir/detail`,
        detailType:'yly',
        detailModalWidth:346   
    },
    hfcRender:{
        title:"化粪池",
        key:"化粪池",
        icon:'icon-weibiaoti-8',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": HFCIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"appendant_type = '化粪池' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'biz',
        detailModalWidth:358    
    },
    fmRender:{
        title:"阀门",
        key:"阀门",
        icon:'icon-weibiaoti-14',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": FMIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"appendant_type = '阀门' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPointValve/detail`,
        detailType:'fm',
        detailModalWidth:332     
    },
    zmRender:{
        title:"闸门",
        key:"闸门",
        icon:'icon-weibiaoti-16',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": ZMIcon,
                "width": "18px",
                "height": "18px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"appendant_type = '闸门' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPointGate/detail`,
        detailType:'zm',
        detailModalWidth:356      
    },
    // 特征点
    stRender:{
        title:"三通",
        key:"三通",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '三通' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358    
    },
    sitRender:{
        title:"四通",
        key:"四通",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '四通' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358    
    },
    wtRender:{
        title:"五通",
        key:"五通",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '五通' and is_deleted = 0" ,
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358   
    },
    ltRender:{
        title:"六通",
        key:"六通",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '六通' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358    
    },
    zxdRender:{
        title:"直线点",
        key:"直线点",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '直线点' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358    
    },
    gdRender:{
        title:"拐点",
        key:"拐点",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '拐点' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358    
    },
    qsdRender:{
        title:"起始点",
        key:"起始点",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '起始点' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358    
    },
    jbdRender:{
        title:"井边点",
        key:"井边点",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '井边点' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358    
    },
    jndRender:{
        title:"井内点",
        key:"井内点",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '井内点' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358    
    },
    lcdRender:{
        title:"量测点",
        key:"量测点",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '量测点' and is_deleted = 0" ,
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358   
    },
    tcdRender:{
        title:"探测点",
        key:"探测点",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '探测点' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358    
    },
    pxdRender:{
        title:"偏心点",
        key:"偏心点",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '偏心点' and is_deleted = 0" ,
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358   
    },
    wantRender:{
        title:"弯头",
        key:"弯头",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '弯头' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358    
    },
    bjdRender:{
        title:"变径点",
        key:"变径点",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '变径点' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358    
    },
    bcdRender:{
        title:"变材点",
        key:"变材点",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '变材点' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358    
    },
    ylkRender:{
        title:"预留口",
        key:"预留口",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '预留口' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358    
    },
    fpcRender:{
        title:"非普查",
        key:"非普查",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '非普查' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358    
    },
    rhRender:{
        title:"入户",
        key:"入户",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '入户' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358    
    },
    chRender:{
        title:"出户",
        key:"出户",
        icon:'icon-weibiaoti-4',
        iconStyle:{color:'#2A83EE'},
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/FeatureServer/8",
        renderer:{
            "type": "simple",
            "symbol": {
                "type": "picture-marker",
                "url": POINTIcon,
                "width": "16px",
                "height": "16px",
                outline: { 
                    style:'none'
                }
            }
        },
        definitionExpression:"feature_type = '出户' and is_deleted = 0",
        detailUrl:`${config.baseUrl}/jiahe/jhPoint/detail`,
        detailType:'tzd',
        detailModalWidth:358    
    },

    //选中样式
    selectStyle:{
        "污水管网":{
            "type": "simple-line",
            "color": [254, 35, 16, 0.6],
            "width": "10px",
        },
        "雨水管网":{
            "type": "simple-line",
            "color": [254, 35, 16, 0.6],
            "width": "10px",
        },
        "雨污合流":{
            "type": "simple-line",
            "color": [254, 35, 16, 0.6],
            "width": "10px",
        },
        "河道":{
            type: "simple-fill", // autocasts as SimpleFillSymbol
            color: "#63b9f9",
            style: "solid",
            outline: {  // autocasts as SimpleLineSymbol
              color: [99,185,249,0.46],
              width: 30
            }
        },
        "湖泊":{
            type: "simple-fill", // autocasts as SimpleFillSymbol
            color: "#63b9f9",
            style: "solid",
            outline: {  // autocasts as SimpleLineSymbol
              color: [99,185,249,0.46],
              width: 30
            }
        },
        "point":{
            type: "simple-marker", 
            color:[248, 121, 111, 0.5],
            size: 15,
            outline: {
                width: 1,
                color:'#FF1200'
            }
        }
    },

    // 管段流向图层mapSserver
    flowDir:{
        title:'管段流向',
        key:'管段流向',
        url:"http://183.129.170.220:8070/arcgis/rest/services/jiahe/jiahe/MapServer",
    } 

}

