/**
 * @description 单y轴柱状图
 * @param {number} height 图表的高度
 * @param {array} data 图表属性
 * @param {array} xAxisData X轴数据 
 * @param {boolean} dataZoomShow 组件区域缩放【是否显示拖动条】
 * @param {object} yAxisConfig 图形yAxis属性
 * @param {object} xAxisConfig 图形xAxis属性
 * @param {object} titleConfig 图形title属性
 * @param {object} textStyle  主标题样式
 * @param {object} subtextStyle  副标题样式
 * @param {object} tooltipConfig 图形tooltip属性
 * @param {object} legendConfig 图形legend属性
 * @param {object} gridConfig 图形grid属性
 * @param {object} seriesConfig 图形series属性  {name:'序列名称', data:[数据]}
 * @param {object} series 图形新增的series属性
 * @param {string} textColor 图表字体颜色
 * @param {string} name y轴坐标轴名称
 * @param {object} selected 图例选中状态表
 */
 import React from 'react';
 import ReactEcharts from 'echarts-for-react';
 
 function Chart({ height = 200, data = [],backgroundColor,barWidth,gridTop,seriesName, barBorderRadius, barColor, xAxisData = [], xrotate, textColor, name, selected, dataZoomShow }) {
 
   textColor = textColor || '#000';
 
   const lineColor = '#C5CCD1';
   const option = {
     color: ["#79b8ff", "#EDD256", "#54C77A", "#fc8a33", "#f8ac6e", "#ff497d", "#a5f84f", "#9b6ef8"],
     backgroundColor: backgroundColor || '#EFF2F7',
     title: {
       textStyle: {
         width: "30%",
         fontSize: 30,
         color: "#FFF",
         lineHeight: 18,
         fontWeight: "lighter",
       },
       subtextStyle: {
         width: "30%",
         fontSize: 18,
         color: "#FFF",
         textAlign: "center",
         fontWeight: "lighter",
       },
     },
     tooltip: {
       trigger: 'axis',
       axisPointer: {
         type: 'line',
         label: {
           backgroundColor: '#6a7985'
         },
         lineStyle: {
           type: "solid"
         }
       }
     },
    //  legend: [
    //    {
    //      type: "scroll",
    //      itemGap: 20,
    //      textStyle: {
    //        color: textColor
    //      },
    //      selected,
    //      pageIconColor: textColor, //翻页下一页的三角按钮颜色
    //      pageIconInactiveColor: '#aaa', //翻页（即翻页到头时）
    //      pageTextStyle: {
    //        color: textColor
    //      }
    //    }
    //  ],
     dataZoom: dataZoomShow ? [
       {
         show: true,
         realtime: true,
         start: 25,
         end: 75,
         height: 14
       },
     ] : [],
     grid: {
        top: gridTop || 40,
        left: 34,
        right: 34,
        bottom: xAxisData.length > 0 ? 10 : 50,
        containLabel: true,
      },
     xAxis: [
       {
         type: 'category',
         data: xAxisData,
         axisLabel: {
           color: textColor,
           rotate: xrotate || 0,
         },
         axisLine: {
           lineStyle: {
             type: 'solid',
             color: lineColor,
             width: 1,//这里是为了突出显示加上的
           }
         },
         axisTick: {
           show: false
         },
       },
     ],
     yAxis: [
       {
         type: 'value',
         name: name,
       }
     ],
     series: [
       {
         data: data,
         type: 'bar',
         name: seriesName || '',
         barWidth: barWidth || 18,
         itemStyle: {
            color: barColor || "#4095F9",
            barBorderRadius: barBorderRadius || 9,
         }
       },
     ],
   };
   return (
     <ReactEcharts option={option} style={{ height }} notMerge />
   )
 }
 
 export default Chart;
 