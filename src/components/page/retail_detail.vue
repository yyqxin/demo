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

			<el-col :span="11">
				<div align="right">
					<el-date-picker v-model="p_sdate" type="date" placeholder="开始日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change='sTimeChange'>
					</el-date-picker>
					-
					<el-date-picker v-model="p_edate" type="date" placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="eTimeChange">
					</el-date-picker>
					<el-button type="primary" @click="showcharts">搜索</el-button>
					<el-button type="primary" @click="exportTable()">导出Excel</el-button>
					<!--<input id="upload" type="file" @change="importfxx(this)" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />-->
					
				</div>

			</el-col>
			<el-col :span="3">
				<el-upload  action="http://localhost:62489/api/erp/upfile" :on-preview="handlePreview" :on-change="handleChange" :on-success="handleSuccess"
  :on-remove="handleRemove"  :before-remove="beforeRemove"  multiple  :limit="3"  :on-exceed="handleExceed"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" > 
  <el-button size="small" type="primary">点击上传</el-button>
  
</el-upload>
			</el-col>
			<el-col :span="3">
				<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-col>

		</el-row>
		<el-row>
			<el-table :data="data.slice((currentPage-1)*pagesize,currentPage*pagesize)" showOverflowTooltip style="width: 100%" border ref="multipleTable" :row-class-name="tableRowClassName" :summary-method="getSummaries" show-summary>
				<el-table-column prop="cnumber" label="售销单号" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="entity_code" label="店铺编码" min-width="70"></el-table-column>
				<el-table-column prop="short_name" label="店铺名称" min-width="80"></el-table-column>
				<el-table-column prop="supplier" label="品牌" min-width="40"></el-table-column>
				<el-table-column prop="style" label="款号" min-width="90"></el-table-column>
				<el-table-column prop="color_name" label="颜色" min-width="50"></el-table-column>
				<el-table-column prop="size" label="尺码" min-width="40"></el-table-column>
				<el-table-column prop="qty" label="数量" min-width="40"></el-table-column>
				<el-table-column prop="skje" label="金额" min-width="80"></el-table-column>
				<el-table-column prop="work_date" label="销售时间" sortable min-width="140"></el-table-column>
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
				fileList:[],
				p_sdate: "",
				p_edate: "",
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
 handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
	handleSuccess(response,file, fileList)
	{
		 	this.$message({
							message: '成功上传文件,数据已成功导入!',
							type: 'success'
						});
		
	},
			exportTable() {
				this.downloadLoading = true
				require.ensure([], () => {

					const {
						export_json_to_excel
					} = require('@../../vendor/Export2Excel')
					const tHeader = ['售销单号', '店铺编码', '店铺名称', '品牌', '款号', '颜色', '尺码', '数量', '金额', '销售时间'];
					const filterVal = ['cnumber', 'entity_code', 'short_name', 'supplier', 'style', 'color_name', 'size', 'qty', 'skje', 'work_date'];
					const list = this.data;
					const _data = this.formatJson(filterVal, list);
					export_json_to_excel(tHeader, _data, '销售明细');
				})
			},

			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => v[j]))
			},
			handleChange(file, fileList) {
				
				if(file.status !="ready") return ;
				
				//console.log(BASE_API);
				let _this = this;
				let inputDOM = this.$refs.inputer;
				// 通过DOM取文件数据
				this.file = event.currentTarget.files[0];
				var rABS = false; //是否将文件读取为二进制字符串
				var f = this.file;
				var reader = new FileReader();
				//if (!FileReader.prototype.readAsBinaryString) {
				FileReader.prototype.readAsBinaryString = function(f) {
					var binary = "";
					var rABS = false; //是否将文件读取为二进制字符串
					var pt = this;
					var wb; //读取完成的数据
					var outdata;
					var reader = new FileReader();
					reader.onload = function(e) {
						var bytes = new Uint8Array(reader.result);
						var length = bytes.byteLength;
						for(var i = 0; i < length; i++) {
							binary += String.fromCharCode(bytes[i]);
						}
						var XLSX = require('xlsx');
						if(rABS) {
							wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
								type: 'base64'
							});
						} else {
							wb = XLSX.read(binary, {
								type: 'binary'
							});
						}
						
						
						outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1}); //outdata就是你想要的东西

						this.da = [...outdata];
						console.log(this.da);
						                      let arr = []
						//                      this.da.map(v => {
						//                          let obj = {}
						//                          obj.id = v.id
						//                          obj.status = v.status
						//                          arr.push(obj)
						//                      })
						//                   
						                      let para = {
						                          //withList: JSON.stringify(this.da)
						                          withList: arr
						                      }
						console.log(para);
						_this.$message({
							message: '请耐心等待导入成功',
							type: 'success'
						});
						//                      withImport(para).then(res => {
						//                          window.location.reload()
						//                      })

					}
					reader.readAsArrayBuffer(f);
				}
				if(rABS) {
					reader.readAsArrayBuffer(f);
				} else {
					reader.readAsBinaryString(f);
				}
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
						if(index === 8) {
							sums[index] += ' 元';
						} else {
							sums[index] += ' 件';
						}

					} else {
						sums[index] = '';
					}
				});

				return sums;
			},

			//函数
			showcharts: function() {
				//显示图表
				if(this.p_stime > this.p_etime) {
					this.$alert('开始日期不能大于结束日期', '信息提示');
					return;
				}
				this.currentPage = 1;
				var jsonparas = []; //参数
				apiparas.pushPara(jsonparas, 'entity_name', this.entity_name);
				apiparas.pushPara(jsonparas, 'styleno', this.style_no);
				apiparas.pushPara(jsonparas, 'sdate', this.p_sdate);
				apiparas.pushPara(jsonparas, 'edate', this.p_edate);
				let paras = apiparas.getParas('retail', jsonparas);

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
			sTimeChange: function(val) {
				this.p_sdate = val;

			},
			eTimeChange: function(val) {
				this.p_edate = val;

			},
			refreshPage: function() {
				//刷新页面
			}

		},
		created: function() {
			var jsonparas = [];
			let paras = apiparas.getParas('retail', jsonparas);
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
				//this.showcharts();
			});
		}
	}
</script>

<style>
</style>