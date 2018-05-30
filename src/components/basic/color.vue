<template>
	<div>
		<el-row>
			<el-col :span="6">
				<el-input placeholder="请输入颜色名称" v-model="colorName"  @keyup.enter.native="queryColor">
					<template slot="prepend">颜色名称:</template>
				</el-input>
			</el-col>
			<el-col :span="4">
				<el-button type="primary" @click="queryColor">查询</el-button>
				<el-button type="primary"  @click="dialogFormVisible = true;isAdd = true">增加</el-button>
				<el-button type="primary" @click="centerDialogVisible = true">导入</el-button>
			</el-col>
		</el-row>
		<el-table :data="data.slice((currentPage-1)*pagesize,currentPage*pagesize)" showOverflowTooltip style="width: 100%" border ref="multipleTable">
			<el-table-column prop="color_code" label="颜色编码" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="color_name" label="颜色名称">
			</el-table-column>
			<el-table-column prop="color_class" label="颜色分类">
			</el-table-column>
			
			<el-table-column label="操作" width="240">
				<template slot-scope="scope">
					<el-button size="small" type="primary" @click="showEditColor(scope.$index,scope.row)">编辑</el-button>
					<el-button size="small" type="primary" @click="showDelColor(scope.$index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="this.currentPage" :page-sizes="[15, 20, 50, 100]" :page-size="this.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="data.length">
		</el-pagination>

	<el-dialog title="增加颜色" :rules="rules" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="颜色编码：" :label-width="formLabelWidth">
					<el-input v-model="form.color_code" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="颜色名称：" :label-width="formLabelWidth">
					<el-input v-model="form.color_name" auto-complete="off"></el-input>
				</el-form-item>	
				<el-form-item label="颜色分类：" :label-width="formLabelWidth">
					<el-input v-model="form.color_class" auto-complete="off"></el-input>
				</el-form-item>	
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveColor">确 定</el-button>
			</div>

		</el-dialog>

		<el-dialog title="删除颜色" :visible.sync="delDialogVisible" width="30%" center>
			<span>{{ delMsg }}</span>
			<span slot="footer" class="dialog-footer">
				    <el-button @click="delDialogVisible = false">取 消</el-button>
				    <el-button type="primary" @click="delColor">确 定</el-button>
				  </span>
		</el-dialog>
		
		<el-dialog title="尺码组导入" :visible.sync="centerDialogVisible" width="30%" center>
			<span>
			  	<el-upload  action="http://39.108.64.181/api/erp/upfile" :on-preview="handlePreview" :on-change="handleChange" :on-success="handleSuccess"
			  		:on-remove="handleRemove"  :before-remove="beforeRemove"  multiple  :limit="3"  :on-exceed="handleExceed"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" > 
			  		<el-button size="small" type="primary">点击上传</el-button> 
				</el-upload>
		  	</span>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="centerDialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="importBill">确 定</el-button>
			  </span>
		</el-dialog>




	</div>
</template>

<script>
	import { getreport, getfilter, query, apiparas, getObjects , entity_add , entity_delete , entity_update , entity_import } from '../../api/api';
	import { Cookie } from '../../js/common' ;
	export default {
		data() {
			return {
				data: [],
				currentPage: 1,
				pagesize: 15,
				colorName: '',
				dialogFormVisible:false,
				centerDialogVisible:false,
				rules:{},
				form: {
					color_code:'',
					color_name:'',
					color_class:''
				},
				formLabelWidth:'120px',
				color_key :'',
				brand_key:'ee5b760e4dc1450f8094f3d52d66101c',
				delMsg:'',
				delDialogVisible :false,
				isAdd:false,
				xlsData: {},
				dataHead: [{"name":"dd","value":"dd"}],
				color_colname:['颜色编码','颜色名称','颜色分类'],
				paras:{}
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
		methods: { //函数
			handleRemove(file, fileList) {
				console.log(file, fileList,"handleRemove");
			},
			handlePreview(file) {
				console.log(file,"handlePreview");
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			handleSuccess(response, file, fileList) {
				this.$message({
					message: '成功上传文件,数据已成功导入!',
					type: 'success'
				});

			},
			handleChange(file, fileList) {

				if(file.status != "ready") return;

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

						outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
							header: 1
						}); //outdata就是你想要的东西
						_this.xlsData = [...outdata];

						_this.dataHead = [];
						var colIndex = []; //找到列对应的位置
						var t_col = [];
						var row_start = 1;
						for(var i = 0; i < _this.xlsData[0].length; i++) {
							apiparas.pushPara(_this.dataHead , _this.xlsData[0][i], _this.xlsData[0][i]);
						}
						t_col = _this.color_colname; 
						
						for(var i = 0; i < t_col.length; i++) {
							for(var j = 0; j < _this.dataHead.length; j++) {

								if(_this.dataHead[j]['name'] == t_col[i]) //找需要导入数据列的对应列顺序
								{
									colIndex.push(j);
									continue;
								}
							}

						}
						var objs = [];
						for(var i = row_start; i < _this.xlsData.length; i++) {
							if(_this.xlsData[i][colIndex[0]] != undefined  && _this.xlsData[i][colIndex[1]] != undefined) {
								let obj = {
									"brand_key":_this.brand_key,
									"color_code": _this.xlsData[i][colIndex[0]],
									"color_name": _this.xlsData[i][colIndex[1]],
									"color_class": _this.xlsData[i][colIndex[2]],
								}
								objs.push(obj);
							}
						}
						let paras = {
							"TypeName": "b_color",
							"JsonObjs": objs
						}
						_this.paras = paras;
						

//						let para = {
//							withList: JSON.stringify(this.da)
//							//withList: arr
//						}
						
						_this.$message({
							message: '请耐心等待导入成功',
							type: 'success'
						});
						
					}
					reader.readAsArrayBuffer(f);
				}
				if(rABS) {
					reader.readAsArrayBuffer(f);
				} else {
					reader.readAsBinaryString(f);
				}
			}, 
			importBill: function() {
				//this.$message(this.dataHead.length);
				entity_import(this.paras).then(response => {
							var json_data = response.result;
							this.$message({
								message: '成功导入数据' + json_data + "条",
								type: 'success'
							});

					});
				this.centerDialogVisible = false;
				this.showData();
				//  this.$message(this.centerDialogTitle); 		
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
			
			showData: function() {
				//显示数据
				let paras = apiparas.getParas_Objects('b_color', '', 'color_key,color_code,color_name,color_class,create_time,update_time');
				getObjects(paras).then(response => {
					// success callback
					var json_data = response.result;
					this.data = json_data;
				});
			},
			queryColor:function(){
				if(this.colorName===''){
					this.showData();
				}else{
					let paras = apiparas.getParas_Objects('b_color', 'color_name.Contains( \''+this.colorName+'\')', 'color_key,color_code,color_name,color_class,create_time,update_time');
					getObjects(paras).then(response => {
						// success callback
						var json_data = response.result;
						if(json_data.length===0){
							this.$message.warning('没有查询到该颜色！');
						}
						this.data = json_data;
					});
				}
			},
			refreshPage: function() {
				//刷新页面
			},
			saveColor:function(){
				//保存尺码组
				let token = Cookie.Get('token');
				let obj={
					TypeName: 'b_color',
						JsonObj: {
							color_key:this.color_key,
							brand_key:this.brand_key,
							color_code:this.form.color_code,
							color_name:this.form.color_name,
							color_class:this.form.color_class
						},
					token: token 
				};
				
				if (!this.isAdd)
				{
					entity_update(obj).then(response => {

					if(response.errid == 0) {
						this.$message.success('修改颜色成功！');
						this.dialogFormVisible = false;
					} else {
						this.$message.success('修改颜色失败！');
					}

					this.form.color_code = '';
					this.form.color_name = '';
					this.form.color_class = '';
					this.color_key = '';
					this.showData();

				});
				}
				else
				{
					entity_add(obj).then(response => {

					if(response.errid == 0) {
						this.$message.success('增加颜色成功！');
						this.dialogFormVisible = false;
					} else {
						this.$message.success('增加颜色失败！');
					}

					this.form.color_code = '';
					this.form.color_name = '';
					this.form.color_class = '';
					this.color_key = '';
					this.showData();

				});
				}
				
			},
			showEditColor: function(index,row) {
				//编辑组别
				this.color_key = row.color_key;
				this.form.color_code = row.color_code;
				this.form.color_name = row.color_name;
				this.form.color_class = row.color_class;
				this.dialogFormVisible = true;
				this.isAdd = false;
			},
			showDelColor: function(index,row) {
				//删除组别
				this.color_key = row.color_key;
				this.delMsg = '您确定要删除颜色代码：' + row.color_code;
				this.delMsg += '颜色名称：' + row.color_name;
				this.delDialogVisible = true;
			},
			delColor()
			{
				
				let obj = {
					TypeName: "b_color",
					JsonObj: {
						color_key: this.color_key
					},
					token: Cookie.Get("token"),
				}
				entity_delete(obj).then(response => {
					
					if(response.errid == 0) {
						this.$message.success('删除颜色成功！');
						this.delDialogVisible = false;
					} else {
						this.$message.success('删除颜色失败！');
					}
					this.showData();
				});
			}
		},
		created: function() {
			this.showData();
			
		}
	}
</script>

<style>

</style>