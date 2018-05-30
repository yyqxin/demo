
import { Cookie } from './common';

export const jzmChart = {


	FillToLieBar: function(rpt) {
		var pop_title = ""; //标题的列名,固定为第一列
		var pop_data = [];
		var pop_data_name = [];
		var chart_title = new Array(); //标题数组
		var chart_data = new Array(); //值数组
		//列标题,列字段名取值
		for(var key in rpt.data[0]) {
			if(key == "title") {
				pop_title = key;
			} else {
				pop_data.push(key);
				pop_data_name.push(key);
			}
		}
		for(var i = 0; i < pop_data.length; i++) {
			chart_data[i] = {
				"name": pop_data_name[i],
				"type": "bar",
				"data": []
			};
		}
		//填入标题及各值的数据
		for(var i = 0; i < rpt.data.length; i++) {
			chart_title.push(rpt.data[i]["title"]);
			for(var j = 0; j < pop_data.length; j++) {
				var pop_name = pop_data[j];
				chart_data[j].data.push(rpt.data[i][pop_name]);
			};
		};

		var option = {
			color: ['#87cefa', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
			title: {
				text: rpt.title,
				subtext: rpt.sub_title
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			legend: {
				data: pop_data_name,
				orient: 'vertical',
				x: 'right',
				padding: 3,
				itemGap: 5
			},
			grid: {
				x: '12%',
				y: '15%',
				x2: '1%',
				y2: '10%',
				containLabel: true
			},
			xAxis: {
				type: 'value',
				axisLabel: {
					show: true,
					interval: 'auto'
				},
				boundaryGap: [0, 0.01]
			},
			yAxis: {
				type: 'category',
				data: chart_title
			},
			series: chart_data
		};
		return option;
	},
	FillToLine: function(rpt) {
		var pop_title = ""; //标题的列名,固定为第一列
		var pop_data = [];
		var pop_data_name = [];
		var chart_title = new Array(); //标题数组
		var chart_data = new Array(); //值数组
		//列标题,列字段名取值
		var pop = 0;
		for(var key in rpt.data[0]) {
			if(pop == 0) {
				pop_title = key;
			} else {
				pop_data.push(key);
				pop_data_name.push(key);
			}
			pop++;
		}
		for(var i = 0; i < pop_data.length; i++) {
			chart_data[i] = {
				"name": pop_data_name[i],
				"type": "line",
				"data": []
			};
		}
		//填入标题及各值的数据
		for(var i = 0; i < rpt.data.length; i++) {
			chart_title.push(rpt.data[i]["title"]);
			for(var j = 0; j < pop_data.length; j++) {
				var pop_name = pop_data[j];
				chart_data[j].data.push(rpt.data[i][pop_name]);
			};
		};
		var option = {

			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: pop_data_name
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			toolbox: {
				feature: {
					saveAsImage: {}
				}
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: chart_title
			},
			yAxis: {
				type: 'value'
			},
			series: chart_data
		};
		return option;
	},

	FillToPie: function(rpt) {

		var data = rpt;

		var option = {
			color: ['#87cefa', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
			title: {
				text: rpt.title,
				subtext: rpt.sub_title,
				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			series: [{
				type: 'pie',
				radius: '45%',
				center: ['50%', '65%'],
				data: data.data,
				itemStyle: {
					normal: {
						label: {
							show: true,
							formatter: '{b}\n{d}%'
						},
						labelLine: {
							show: true
						}
					}
				}
			}]
		};
		return option;
	},
	ToTable: function(rpt) {
		var divID = rpt.rid;
		var html = '<table class="table table-striped table-bordered table-hover table-condensed">';
		//填入表头
		html += '<tr>';
		for(var key in rpt.data[1]) {
			html += '<td align="center">' + key + '</td>';
		}
		html += '</tr>';
		//填入表格内容
		for(var j in rpt.data) {
			var obj = rpt.data[j];
			html += '<tr>'
			for(var key in obj) {
				html += '<td align="center">' + obj[key] + '</td>';
			}
			html += '</tr>'
		}
		html += '</table>';

		$("#" + divID).append(html);
	},

	ToText: function(rpt) {
		var divID = rpt.rid;
		//替换占位符
		$(function() {
			String.prototype.format = function() {
				if(arguments.length == 0) return this;
				var obj = arguments[0]; // obj{para:"",value:""}
				var s = this;
				//每查找一个占位符，用对应的value替换
				s = s.replace(new RegExp("\\{" + obj.title + "\\}", "g"), obj.value);
				return s;
			}
			var html = "";
			html = rpt.html;
			//遍历数组，拿到对象key{para:"",value:""}
			for(var n = 0; n < rpt.data.length; n++) {
				var key = rpt.data[n];
				html = html.format(key);
			};
			$("#" + divID).append(html);
		})
	},
	FillToStandBar: function(rpt) {
		require.config({
			paths: {
				echarts: 'http://echarts.baidu.com/build/dist'
			}
		});
		var pop_title = ""; //标题的列名,固定为第一列
		var pop_data = [];
		var pop_data_name = [];
		var chart_title = new Array(); //标题数组
		var chart_data = new Array(); //值数组

		//列标题,列字段名取值
		var pop = 0;
		for(var key in rpt.data[0]) {
			if(pop == 0) {
				pop_title = key;
			} else {
				pop_data.push(key);
				pop_data_name.push(key);
			}
			pop++;
		}
		for(var i = 0; i < pop_data.length; i++) {
			chart_data[i] = {
				"name": pop_data_name[i],
				"type": "bar",
				"data": []
			};
		}
		//填入标题及各值的数据
		for(var i = 0; i < rpt.data.length; i++) {
			chart_title.push(rpt.data[i]["title"]);
			for(var j = 0; j < pop_data.length; j++) {
				var pop_name = pop_data[j];
				chart_data[j].data.push(rpt.data[i][pop_name]);
			};
		};

		//生成图表
		var option = {
			color: ['#87cefa', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],

			label: {
				show: true,
				position: 'top',
				formatter: '{b}\n{c}'
			},
			title: {
				text: rpt.title,
				subtext: rpt.sub_title
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			legend: {
				data: pop_data_name,
				orient: 'vertical',
				x: 'right',
				padding: 3,
				itemGap: 5
			},
			grid: {
				x: '15%',
				y: '20%',
				x2: '1%',
				y2: '10%',
			},
			xAxis: {
				type: 'category',
				data: chart_title
			},
			yAxis: {
				type: 'value',
				boundaryGap: [0, 0.01]
			},
			series: chart_data
		};
		return option;
	},
	
}