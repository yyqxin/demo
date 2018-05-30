<template>
	<div>
		<el-row>
			<el-col :span="6">
				<el-input placeholder="请输入员工姓名" v-model="staffName" @keyup.enter.native="queryStaff">
					<template slot="prepend">员工姓名:</template>
				</el-input>
			</el-col>
			<el-col :span="4">
				<el-button type="primary" @click="queryStaff">查询</el-button>
				<el-button type="primary"  @click="dialogFormVisible = true;isAdd = true">增加</el-button>
				<el-button type="primary" @click="centerDialogVisible = true">导入</el-button>
			</el-col>
		</el-row>
		<el-table :data="data.slice((currentPage-1)*pagesize,currentPage*pagesize)" showOverflowTooltip style="width: 100%" border ref="multipleTable">
			<el-table-column prop="staff_name" label="员工姓名" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="sex" label="性别">
			</el-table-column>
			<el-table-column prop="telphone" label="联系电话">
			</el-table-column>
			<el-table-column prop="mobilephone" label="手机">
			</el-table-column>
			<el-table-column prop="address" label="联系地址">
			</el-table-column>
			<el-table-column prop="entity_key" label="店铺">
			</el-table-column>
			
			<el-table-column label="操作" width="240">
				<template slot-scope="scope">
					<el-button size="small" type="primary" @click="showEditStaff(scope.$index,scope.row)">编辑</el-button>
					<el-button size="small" type="primary" @click="showdelStaff(scope.$index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="this.currentPage" :page-sizes="[15, 20, 50, 100]" :page-size="this.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="data.length">
		</el-pagination>

	<el-dialog title="增加员工" :rules="rules" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="员工姓名：" :label-width="formLabelWidth">
					<el-input v-model="form.staff_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别：" :label-width="formLabelWidth">
					<el-input v-model="form.sex" auto-complete="off"></el-input>
				</el-form-item>	
				<el-form-item label="联系电话：" :label-width="formLabelWidth">
					<el-input v-model="form.telphone" auto-complete="off"></el-input>
				</el-form-item>	
				<el-form-item label="手机：" :label-width="formLabelWidth">
					<el-input v-model="form.mobilephone" auto-complete="off"></el-input>
				</el-form-item>	
				<el-form-item label="联系地址：" :label-width="formLabelWidth">
					<el-input v-model="form.address" auto-complete="off"></el-input>
				</el-form-item>	
				<el-form-item label="店铺：" :label-width="formLabelWidth">
					<el-select v-model="form.entity_key" placeholder="请选择">
						<el-option v-for="item in entity_data" :key="item.entity_key" :label="item.entity_name" :value="item.entity_key">
						</el-option>
					</el-select>
				</el-form-item>	
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveStaff">确 定</el-button>
			</div>

		</el-dialog>

		<el-dialog title="删除颜色" :visible.sync="delDialogVisible" width="30%" center>
			<span>{{ delMsg }}</span>
			<span slot="footer" class="dialog-footer">
				    <el-button @click="delDialogVisible = false">取 消</el-button>
				    <el-button type="primary" @click="delStaff">确 定</el-button>
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
				entity_data:[],
				currentPage: 1,
				pagesize: 15,
				staffName: '',
				dialogFormVisible:false,
				centerDialogVisible:false,
				rules:{},
				form: {
					staff_name:'',
					sex:'',
					telphone:'',
					mobilephone:'',
					address:'',
					entity_key:''
				},
				formLabelWidth:'120px',
				staff_key :'',
				company_key:'7e4d4d9248f34af48e8cd434661f6793',
				delMsg:'',
				delDialogVisible :false,
				isAdd:false,
				xlsData: {},
				dataHead: [{"name":"dd","value":"dd"}],
				staff_colname:['员工姓名','性别','联系电话','手机','联系地址','店铺'],
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
						t_col = _this.staff_colname; 
						
						for(var i = 0; i < t_col.length; i++) {
							for(var j = 0; j < _this.dataHead.length; j++) {

								if(_this.dataHead[j]['name'] == t_col[i]) //找需要导入数据列的对应列顺序
								{
									colIndex.push(j);
									break;
								}
							}

						}
						var objs = [];
						for(var i = row_start; i < _this.xlsData.length; i++) {
							if(_this.xlsData[i][colIndex[0]] != undefined  && _this.xlsData[i][colIndex[5]] != undefined) {
								let entitykey;
								for(let j = 0;j<_this.entity_data.length;j++){
									if(_this.xlsData[i][colIndex[5]]===_this.entity_data[j].entity_name){
										entitykey = _this.entity_data[j].entity_key;
										break;
									}
								}
								
								let obj = {
									"company_key":_this.company_key,
									"staff_name": _this.xlsData[i][colIndex[0]],
									"sex": _this.xlsData[i][colIndex[1]],
									"telphone": _this.xlsData[i][colIndex[2]],
									"mobilephone": _this.xlsData[i][colIndex[3]],
									"address": _this.xlsData[i][colIndex[4]],
									"entity_key":entitykey
								}
								objs.push(obj);
							}
						}
						let paras = {
							"TypeName": "b_staff",
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
				let paras = apiparas.getParas_Objects('b_staff', '', 'staff_key,staff_name,sex,telphone,mobilephone,address,entity_key,create_time,update_time');
				getObjects(paras).then(response => {
					// success callback
					var json_data = response.result;
					this.data = json_data;
					for(let i = 0;i<this.data.length;i++){
						for(let j = 0;j<this.entity_data.length;j++){
							if(this.data[i].entity_key===this.entity_data[j].entity_key){
								this.data[i].entity_key = this.entity_data[j].entity_name;
								break;
							}
						}
					}
				});
				
			},
			queryStaff:function(){
				if(this.staffName===''){
					this.showData();
				}else{
					let paras = apiparas.getParas_Objects('b_staff', 'staff_name.Contains( \''+this.staffName+'\')', 'staff_key,staff_name,sex,telphone,mobilephone,address,entity_key,create_time,update_time');
					
					getObjects(paras).then(response => {
						// success callback
						var json_data = response.result;
						if(json_data.length===0){
							this.$message.warning('没有查询到该员工！');
						}
						this.data = json_data;
						for(let i = 0;i<this.data.length;i++){
						for(let j = 0;j<this.entity_data.length;j++){
							if(this.data[i].entity_key===this.entity_data[j].entity_key){
								this.data[i].entity_key = this.entity_data[j].entity_name;
								break;
							}
						}
					}
					});
				}
			},
			getEntity:function(){
				let paras = apiparas.getParas_Objects('b_entity', '', 'entity_key,entity_name');
				getObjects(paras).then(response => {
					// success callback
					var json_data = response.result;
					this.entity_data = json_data;
					this.showData();
				});
			},
			refreshPage: function() {
				//刷新页面
			},
			saveStaff:function(){
				//保存尺码组
				//if(this.form.size_order===''){this.form.size_order=1};
				let token = Cookie.Get('token');
				let obj={
					TypeName: 'b_staff',
						JsonObj: {
							company_key:this.company_key,
							staff_key:this.staff_key,
							staff_name : this.staff_name,
							sex:this.form.sex,
							telphone:this.form.telphone,
							mobilephone:this.form.mobilephone,
							address:this.form.address,
							entity_key:this.form.entity_key
						},
					token: token 
				};
				
				if (!this.isAdd)
				{
					entity_update(obj).then(response => {

					if(response.errid == 0) {
						this.$message.success('修改员工成功！');
						this.dialogFormVisible = false;
					} else {
						this.$message.success('修改员工失败！');
					}

					this.form.staff_name = '';
					this.form.sex = '';
					this.form.telphone = '';
					this.form.mobilephone = '';
					this.form.address = '';
					this.form.entity_key='';
					this.showData();

				});
				}
				else
				{
					entity_add(obj).then(response => {

					if(response.errid == 0) {
						this.$message.success('增加员工成功！');
						this.dialogFormVisible = false;
					} else {
						this.$message.success('增加员工失败！');
					}

					this.form.staff_name = '';
					this.form.sex = '';
					this.form.telphone = '';
					this.form.mobilephone = '';
					this.form.address = '';
					this.form.entity_key='';
					this.showData();

				});
				}
				
			},
			showEditStaff: function(index,row) {
				//编辑组别
				this.staff_key = row.staff_key;
				this.form.staff_name = row.staff_name;
				this.form.sex = row.sex;
				this.form.telphone = row.telphone;
				this.form.mobilephone = row.mobilephone;
				this.form.address = row.address;
				for(let i = 0;i<this.entity_data.length;i++){
					if(row.entity_key===this.entity_data[i].entity_name){
						this.form.entity_key = this.entity_data[i].entity_key;
					}
				}
				this.dialogFormVisible = true;
				this.isAdd = false;
			},
			showdelStaff: function(index,row) {
				//删除组别
				this.staff_key= row.staff_key;
				this.delMsg = '您确定要删除员工：' + row.staff_name;
				this.delDialogVisible = true;
			},
			delStaff()
			{
				
				let obj = {
					TypeName: "b_staff",
					JsonObj: {
						staff_key: this.staff_key
					},
					token: Cookie.Get("token"),
				}
				entity_delete(obj).then(response => {
					
					if(response.errid == 0) {
						this.$message.success('删除员工成功！');
						this.delDialogVisible = false;
					} else {
						this.$message.success('删除员工失败！');
					}
					this.showData();
				});
			}
		},
		created: function() {
			this.getEntity();
			
			
		}
	}
</script>

<style>

</style>