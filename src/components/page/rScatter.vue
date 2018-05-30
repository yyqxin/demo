<template>
	<section class="chart-container">
		<el-row>
			<el-select v-model="entity" placeholder="店铺">
				<el-option v-for="item in entity_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<el-select v-model="sex" placeholder="款性别">
				<el-option v-for="item in sex_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<el-select v-model="category" placeholder="款大类">
				<el-option v-for="item in category_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<el-select v-model="style_season" placeholder="最近三季">
				<el-option v-for="item in style_season_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
<div id='divEntity' style="display: none;"></div>
			<el-button type="primary" @click="drawCharts">搜索</el-button>
		</el-row>
		<el-row>
			<el-col span="24">
				<div id="divScatter" style="width:85%;height:750px;"></div>
				<div id='divMsg'></div>
				

			</el-col>
		</el-row>
	</section>
</template>

<script>
	import { getreport, getfilter, query, apiparas } from '../../api/api';
	import { jzm } from '../../js/common';
	import { jzmChart } from '../../js/jzmChart';

	export default {
		data() {
			return {
				chartScatter: null,
				json_data: [],
				entity: "",
				entity_list: [],
				category: "",
				category_list: [],
				sex: "",
				sex_list: [],
				style_season: "",
				style_season_list: []
			}
		},

		methods: {
			drawScatterChart() {

				var jsonparas = [];
				var _sex = "";
				var _category = "";

				if(this.sex == "") return;
				if(this.category == "") return;

				if(this.sex == "全部") {
					_sex = "";
				} else {
					_sex = this.sex;
				}

				if(this.category == "全部") {
					_category = "";
				} else {
					_category = this.category;
				}
				document.getElementById('divEntity').innerText=this.entity;

				//增加查询条件
				apiparas.pushPara(jsonparas, 'entity_name', this.entity);
				apiparas.pushPara(jsonparas, 'year_season', this.style_season);
				apiparas.pushPara(jsonparas, 'big_category', _category);
				apiparas.pushPara(jsonparas, 'sex', _sex);

				let paras = apiparas.getParas('r010', jsonparas);
				getreport(paras).then(response => {
					var json_data = response.result;
					if(json_data != "") {
						var _data = json_data[0].data;

						var schema = [{
								name: 'totalSaleQty',
								index: 0,
								text: '累计销量'
							},
							{
								name: 'store',
								index: 1,
								text: '库存量'
							},
							{
								name: 'sale_rate',
								index: 2,
								text: '售出率'
							},
							{
								name: 'today',
								index: 3,
								text: '销售天数'
							},
							{
								name: 'styleNo',
								index: 4,
								text: '款号'
							}
						]

						var itemStyle = {
							normal: {
								opacity: 0.8,
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowOffsetY: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						};

						var chart_option = {
							backgroundColor: new this.$echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
								offset: 0,
								color: '#f7f8fa'
							}, {
								offset: 1,
								color: '#cdd0d5'
							}]),
							color: ['#4A4AFF'],
							grid: {
								x: '10%',
								x2: 90,
								y: '12%',
								y2: '10%'
							},
							tooltip: {
								padding: 10,
								backgroundColor: '#222',
								borderColor: '#777',
								borderWidth: 1,
								formatter: function(obj) {
									var value = obj.value;
									return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
										'款号：' + value[5] +
										'</div>' +
										schema[0].text + '：' + value[0] + '<br>' +
										schema[1].text + '：' + value[1] + '<br>' +
										schema[2].text + '：' + value[2] + '<br>' +
										schema[3].text + '：' + value[3] + '<br>';
								}
							},
							xAxis: {
								type: 'value',
								name: "销售天数",
							
							//	max: 200,
								nameTextStyle: {
									fontSize: 16
								},
								splitLine: {
									lineStyle: {
										type: 'dashed'
									}
								}

							},
							yAxis: {
								type: 'value',
								name: "售出率",
								dimension: 2,
								nameGap: 20,
							//	max: 1.5,
								nameTextStyle: {
									fontSize: 18
								},
								splitLine: {
									lineStyle: {
										type: 'dashed'
									}
								},
								scale: true
							},
							visualMap: [{
								left: 'right',
								top: '10%',
								dimension: 1,
								min: 1,
							//	max: 250,
								itemWidth: 30,
								itemHeight: 320,
								calculable: true,
								precision: 0.1,
								text: ['圆形大小：库存量'],
								textGap: 30,
								textStyle: {
									color: '#fff'
								},
								inRange: {
									symbolSize: [10, 70]
								},
								outOfRange: {
									symbolSize: [10, 70],
									color: ['rgba(255,255,255,.2)']
								},
								controller: {
									inRange: {
										color: ['#c23531']
									},
									outOfRange: {
										color: ['#444']
									}
								}
							}],

							series: [{
								data: _data,
								itemStyle: itemStyle,
								type: 'scatter'
							}],
							encode:{
								x:3,
								y:2,
								tooltip:4,
								label:4
							}
						};

						this.chartScatter = this.$echarts.init(document.getElementById('divScatter'));
						this.chartScatter.setOption(chart_option);
						
						
						
						this.chartScatter.on('click', function(params) {
							var jsonparas = [];
							//增加查询条件"款号"
						//	alert(document.getElementById('divEntity').innerText);
						//	alert(params.value[5]);
							
							apiparas.pushPara(jsonparas, 'kuanhao', params.value[5]);
							apiparas.pushPara(jsonparas, 'entity_name', document.getElementById('divEntity').innerText);
							let paras = apiparas.getParas('r010|q02', jsonparas);

							query(paras).then(response => {
								// success callback
								var styleno_info = response.result[0];
								document.getElementById('divMsg').innerHTML = "<table style='border:1px solid #0094ff;width:210px; min-height: 25px; line-height: 25px; text-align: center;border-collapse:collapse;padding:2px;'><tr style='border:1px solid #0094ff;'><td colspan='2'  style='border:1px solid #0094ff;'><img src='" + styleno_info.图片 + "' width='200px' hight='300px'></td></tr><tr style='border:1px solid #0094ff;'><td  style='border:1px solid #0094ff;'>款号</td><td  style='border:1px solid #0094ff;'>" + params.value[5] + "</td></tr><tr style='border:1px solid #0094ff;'><td>吊牌价</td><td style='border:1px solid #0094ff;'>￥" + styleno_info.list_price + "</td></tr><tr style='border:1px solid #0094ff;'><td style='border:1px solid #0094ff;'>回货数</td><td style='border:1px solid #0094ff;'>" + styleno_info.回货数 + "</td></tr><tr style='border:1px solid #0094ff;'><td style='border:1px solid #0094ff;'>回货率</td><td style='border:1px solid #0094ff;'>" + styleno_info.回货率 + "</td></tr><tr style='border:1px solid #0094ff;'><td style='border:1px solid #0094ff;'>销售数</td><td style='border:1px solid #0094ff;'>" + styleno_info.销售数 + "</td></tr><tr style='border:1px solid #0094ff;'><td style='border:1px solid #0094ff;'>累计销量</td><td style='border:1px solid #0094ff;'>" + styleno_info.累计销量 + "</td></tr><tr style='border:1px solid #0094ff;'><td style='border:1px solid #0094ff;'>折扣</td><td style='border:1px solid #0094ff;'>" + styleno_info.折扣 + "</td></tr><tr style='border:1px solid #0094ff;'><td style='border:1px solid #0094ff;'>累计售出率</td><td style='border:1px solid #0094ff;'>" + styleno_info.累计售出率 + "</td></tr><tr style='border:1px solid #0094ff;'><td style='border:1px solid #0094ff;'>库存数</td><td style='border:1px solid #0094ff;'>" + styleno_info.库存数 + "</td></tr><tr style='border:1px solid #0094ff;'><td style='border:1px solid #0094ff;'>流转天</td><td style='border:1px solid #0094ff;'>" + styleno_info.流转天 + "</td></tr><tr style='border:1px solid #0094ff;'><td style='border:1px solid #0094ff;'>占比</td><td style='border:1px solid #0094ff;'>" + styleno_info.占比 + "</td></tr><tr style='border:1px solid #0094ff;'><td style='border:1px solid #0094ff;'>前三颜色</td><td style='border:1px solid #0094ff;'>" + styleno_info.前三颜色 + "</td></tr></table>";
							});

							//alert(params.color);
							/*
		// 当前点击的图形元素所属的组件名称，
    // 其值如 'series'、'markLine'、'markPoint'、'timeLine' 等。
   // componentType: string,
    // 系列类型。值可能为：'line'、'bar'、'pie' 等。当 componentType 为 'series' 时有意义。
    //seriesType: string,
    // 系列在传入的 option.series 中的 index。当 componentType 为 'series' 时有意义。
    //seriesIndex: number,
    // 系列名称。当 componentType 为 'series' 时有意义。
   // seriesName: string,
    // 数据名，类目名
    //name: string,
    // 数据在传入的 data 数组中的 index
    dataIndex: number,
    // 传入的原始数据项
   // data: Object,
    // sankey、graph 等图表同时含有 nodeData 和 edgeData 两种 data，
    // dataType 的值会是 'node' 或者 'edge'，表示当前点击在 node 还是 edge 上。
    // 其他大部分图表中只有一种 data，dataType 无意义。
   // dataType: string,
    // 传入的数据值
    //value: number|Array
    // 数据图形的颜色。当 componentType 为 'series' 时有意义。
    //color: string	
*/
						});
					}
				});

			},

			drawCharts() {
				this.drawScatterChart();

			},
		},

		mounted: function() {
			this.drawCharts();
		},
		updated: function() {
			//this.drawCharts();
		},
		created: function() {

			var jsonparas = [];

			let paras = apiparas.getParas('r010', jsonparas);

			getfilter(paras).then(response => {
				// success callback
				var json_data = response.result;
				if(json_data != "") {
					//可查询的店铺名称
					var row = jzm.findOnID(json_data, "f01");
					if(row.length > 0) {
						this.entity_list = row;
						this.entity = row[0].value;
					}
					//最近三季
					row = jzm.findOnID(json_data, "f02");
					if(row.length != "") {
						this.style_season_list = row;
						this.style_season = row[2].value;
					}

					//款大类
					row = jzm.findOnID(json_data, "f03");
					if(row.length != "") {
						this.category_list = row;
						this.category = row[0].value;
					}

					//款性别
					row = jzm.findOnID(json_data, "f04");
					if(row.length != "") {
						this.sex_list = row;
						this.sex = row[0].value;
					}
					this.drawScatterChart();

				} else {
					alert("没有数据,请重新选择条件");
				}
			});

		}
	}
</script>

<style scoped>
	.chart-container {
		width: 100%;
		float: left;
	}
	/*.chart div {
        height: 400px;
        float: left;
    }
	 padding: 10px 20px;
	*/
	
	#divMsg {
		width: 13%;
		position: absolute;
		top: 10px;
		right: 15px;
	}
	
	.el-col {
		padding: 10px 20px;
	}
</style>