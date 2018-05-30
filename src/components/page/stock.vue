<template>
	<div>
		<el-row type="flex" justify="start" align="middle">
			<el-col :span="4">
				<el-select v-model="entity_name" placeholder="店铺">
					<el-option v-for="item in entity_list" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-col>
			<el-col :span="4">
				<el-input placeholder="请输入款号" v-model="style_no">
					<template slot="prepend">款号:</template>
				</el-input>
			</el-col>
			<el-col :span="4">
				<el-button type="primary" @click="showcharts">搜索</el-button>
				<el-button type="primary" @click="exportTable()">导出Excel</el-button>
			</el-col>
		</el-row>
		<el-row>
			<el-table :data="data.slice((currentPage-1)*pagesize,currentPage*pagesize)" showOverflowTooltip style="width: 100%" border ref="multipleTable" :row-class-name="tableRowClassName" :summary-method="getSummaries" show-summary>
				<el-table-column prop="entity_code" label="店铺编码" min-width="70"></el-table-column>
				<el-table-column prop="short_name" label="店铺名称" min-width="80"></el-table-column>
				<el-table-column prop="supplier" label="品牌" min-width="40"></el-table-column>
				<el-table-column prop="style" label="款号" min-width="90"></el-table-column>
				<el-table-column prop="color_name" label="颜色" min-width="50"></el-table-column>
				<el-table-column prop="size" label="尺码" min-width="40"></el-table-column>
				<el-table-column prop="qty" label="数量" min-width="40"></el-table-column>
				<el-table-column prop="modifiedby" label="更新人" min-width="60"></el-table-column>
				<el-table-column prop="updatedate" label="库存最后更新时间" sortable min-width="140"></el-table-column>
			</el-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="this.currentPage" :page-sizes="[15, 20, 50, 100]" :page-size="this.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="data.length">
			</el-pagination>
		</el-row>
	</div>
</template>

<script>
	import { getreport, getfilter, query, apiparas } from '../../api/api';
	import { jzm } from '../../js/common';
	import { jzmChart } from '../../js/jzmChart';
	export default {
		data() {
			return {
				entity_name: "",
				entity_list: [],
				style_no: "",
				data: [],
				currentPage: 1,
				pagesize: 15
			}
		},
		components: {
			//注册组件
		},
		mounted: function() {
			//生命周期
		},
		computed: {
			//计算属性
		},
		methods: {

			exportTable() {
				this.downloadLoading = true
				require.ensure([], () => {

					const {
						export_json_to_excel
					} = require('@../../vendor/Export2Excel')
					const tHeader = ['店铺编码','店铺名称','品牌','款号','颜色','尺码','数量','更新人','库存最后更新时间'];
					const filterVal = ['entity_code','short_name','supplier','style','color_name','size','qty','modifiedby','updatedate'];
					const list = this.data;
					const _data = this.formatJson(filterVal, list);
					export_json_to_excel(tHeader, _data, '最新库存明细');
				})
			},
			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => v[j]))
			},
			tableRowClassName(row, rowIndex) {
				return '';
			},
			handleSizeChange: function(size) {
				this.pagesize = size;
			},
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
			},
			getSummaries(param) {
				const {
					columns,
					data
				} = param;
				const sums = [];
				columns.forEach((column, index) => {
					if(index === 0) {
						sums[index] = '合计';
						return;
					}
					const values = data.map(item => Number(item[column.property]));
					if(!values.every(value => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
							const value = Number(curr);
							if(!isNaN(value)) {
								return prev + curr;
							} else {
								return prev;
							}
						}, 0);
						sums[index] += ' 件';
					} else {
						sums[index] = '';
					}
				});

				return sums;
			},
			//函数
			showcharts: function() {
				//显示图表
				this.currentPage = 1;
				var jsonparas = []; //参数
				apiparas.pushPara(jsonparas, 'entity_name', this.entity_name);
				apiparas.pushPara(jsonparas, 'style_no', this.style_no);
				let paras = apiparas.getParas('stock', jsonparas);

				this.$notify.success({
					title: '提示信息',
					message: '正在加载数据',
					showClose: false
				});

				getreport(paras).then(response => {
					var json_data = response.result;
					if(json_data[0].data.length != 0) {
						this.data = json_data[0].data;
					} else {
						this.data = [];
					}
					this.$notify.success({
						title: '提示信息',
						message: '数据加载完毕',
						showClose: false
					});

				});

			},
			refreshPage: function() {
				//刷新页面
			}

		},
		created: function() {
			var jsonparas = [];
			let paras = apiparas.getParas('stock', jsonparas);
			getfilter(paras).then(response => {
				// success callback
				var json_data = response.result;
				if(json_data != "") {
					//可查询的店铺名称
					var row = jzm.findOnID(json_data, "f01");
					if(row.length > 0) {
						this.entity_list = row;
						this.entity_name = row[0].value;
					}
				} else {
					alert("没有数据,请重新选择条件");
				}
				this.showcharts();
			});
		}
	}
</script>

<style>

</style>