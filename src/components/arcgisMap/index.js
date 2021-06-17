/**
 * arcgisMap
 */


import React, { Component } from 'react';
import { loadModules } from 'esri-loader';
import styles from './index.less';
import config from '@/config';
import myConfig from './config'

export default class extends Component{

    static defaultProps = {
        center : [112.36,25.5926],
        zoom:16
    }

    map = null

    componentDidMount(){
        this.initMap()
    }

    initMap = () => {
        const myOptions = config.arcGisOption;
        const t = this;
        const {isModalMap = false,createMap, center,zoom} = t.props;
        loadModules([
            "esri/layers/WebTileLayer",
			"esri/Map",
            "esri/Basemap",
            "esri/widgets/BasemapToggle",
            "esri/views/SceneView",
            "esri/views/MapView",
            "esri/layers/SceneLayer",
            "dojo/domReady!"			
        ], myOptions).then(([ 
            WebTileLayer, Map, Basemap, BasemapToggle, SceneView,
            MapView, SceneLayer
        ]) => {

            const mapBaseLayer = new WebTileLayer({
                urlTemplate: "http://{subDomain}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=13b4890427f17c692f9efed46b98db81",
                subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
                copyright: '天地图影像图'
            });

            const anoBaseLayer = new WebTileLayer({
                urlTemplate: "http://{subDomain}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=13b4890427f17c692f9efed46b98db81",
                subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
                copyright: '天地图影像注记'
            });

            const imgBasemap = new Basemap({
                baseLayers: [mapBaseLayer,anoBaseLayer],
                title: "影像图",
                id: "img_w",
                thumbnailUrl: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/0/0/0"
            });
            
            const mapBaseLayer_vec = new WebTileLayer({
                urlTemplate: "http://{subDomain}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=13b4890427f17c692f9efed46b98db81",
                subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
                copyright: '天地图矢量图'
            });
            
            const anoBaseLayer_vec = new WebTileLayer({
                urlTemplate: "http://{subDomain}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=13b4890427f17c692f9efed46b98db81",
                subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
                copyright: '天地图矢量注记'
            });
            
            const vecBasemap = new Basemap({
                baseLayers: [mapBaseLayer_vec,anoBaseLayer_vec],
                title: "矢量图",
                id: "cva_w",
                thumbnailUrl: "https://stamen-tiles.a.ssl.fastly.net/terrain/10/177/410.png"
            });

            const map = new Map({
                basemap:vecBasemap,
                spatialReference:{
                    wkid: 4326
                },
                ground: "world-elevation"
            });

            // const sceneLayer = new SceneLayer({
            //     portalItem: {
            //       id: "2e0761b9a4274b8db52c4bf34356911e"
            //     },
            //     popupEnabled: false
            // });
            // map.add(sceneLayer);

            const view = new MapView({
                map: map,
                center: center, // Longitude, latitude
                zoom: zoom, // Zoom level
                container: "viewDiv", // Div element
                title:"底图",
                // camera: {
                //     position: [-74.0338, 40.6913, 707],
                //     tilt: 81,
                //     heading: 50
                // }
            });
            

            view.when(function() {
                const toggle = new BasemapToggle({
                    titleVisible: true,
                    view: view,
                    nextBasemap: imgBasemap,
                    container:"myToggle"
                });
                if(isModalMap){
                    view.ui._removeComponents(['zoom'])
                }
                view.ui.add(toggle, "bottom-right");
                
            });

            // view.on("click",function(event){
            //     view.hitTest(event).then(res=>{
            //         if(res.results.length){
            //             console.log("res",res)
            //         }
            //     })
            // })

            t.map = map
            createMap && createMap(map,view)

        }).catch(err => {
            console.error('地图初始化失败', err);
        })
    }

    componentWillUnmount(){
        let t = this;
        t.map && t.map.destroy()
    }


    render(){
        const {className} = this.props;
        return(
            <div 
                id="viewDiv" 
                className={`${styles.arcgisMap} ${className}`}
                ref={ref => (this.mapRef = ref)}
            ></div>
        )
    }
}