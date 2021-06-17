import React from 'react';
import ReactEcharts from 'echarts-for-react';

function Chart({ height = 200, itemGap, subtext, color, center, lengendWidth, tooltipFormat, data = [], title, backgroundColor, textColor, bottom, right, serise }) {

  textColor = textColor || '#000';
  let totalVal = 0;
  if (title && data.length>0) {
    data.map(item => { totalVal = totalVal +  Number(item.value);});
  }
  const option = {
    color: color || ["#01B0F1", "#FED24D", "#FFA100", "#FD815B", "#02B3C5", "#8F82BC", "#975FE5", "#71D96C", "#82DFBE", "#36CBCB", "#3AA1FF", "#4B77D8"],
    backgroundColor: backgroundColor || '#fff',
    title: {
      show: title ? true : false,
      zlevel: 0,
      text: subtext ? totalVal : totalVal.toFixed(2),
      subtext: subtext || '公里',
      top: 'center',
      left: '29%',
      textAlign: 'center',
      textStyle: {
        fontSize: 32,
        lineHeight: 22
      },
      subtextStyle: {
        fontSize: 20,
        lineHeight: 20
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: tooltipFormat || ''
    },
    legend: {
      orient: 'vertical',
      right: right || '12%',
      bottom: bottom || '35%',
      data: data,
      itemWidth: 15,
      itemHeight: 15,
      itemGap: itemGap,
      formatter: function (name) {
        var total = 0;
        var target;
        for (var i = 0, l = data.length; i < l; i++) {
          total += data[i].value * 1;
          if (data[i].name == name) {
            target = data[i].value;
          }
        }
        for (var i = 0, l = data.length; i < l; i++) {
          if (data[i].name == name) {
            if(subtext){
              var arr = [
                '{a|' + name + '}',
                '{b|' + (data[i].value * 1) + subtext + '}'
              ]
            }else{
              var arr = [
                '{a|' + name + '}',
                '{b|' + (data[i].value * 1).toFixed(2) + '公里}'
              ]
            }
          }
        }

        return arr.join('')
      },
      textStyle: {
        rich: {
          a: {
            fontSize: 13,
            verticalAlign: 'left',
            align: 'left',
            padding: [0, 0, 0, 10],
            width: lengendWidth || 74,
          },
          b: {
            fontSize: 12,
            align: 'left',
            padding: [0, 0, 0, 20],
            width: 60,
          },
        }
      }
    },
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      containLabel: true
    },
    series: [
      {
        data: data,
        center: center || ['30%', '50%'],
        type: 'pie',
        radius: '58%',
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: false,
            textStyle: {
              fontSize: '30',
              fontWeight: 'bold'
            }
          }
        },
        ...serise
      },
    ],
  };
  return (
    <ReactEcharts option={option} style={{ height }} notMerge />
  )
}

export default Chart;
