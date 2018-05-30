<template>
	<div>
		<el-row>
			<el-col :span="6">
				<el-input placeholder="请输入店铺名称" v-model="companyName"  @keyup.enter.native="queryCompany">
					<template slot="prepend">店铺名称:</template>
				</el-input>
			</el-col>
			<el-col :span="4">
				<el-button type="primary" @click="queryCompany">查询</el-button>
				<el-button type="primary"  @click="dialogFormVisible = true;isAdd = true">增加</el-button>
			</el-col>
		</el-row>
		<el-table :data="data.slice((currentPage-1)*pagesize,currentPage*pagesize)" showOverflowTooltip style="width: 100%" border ref="multipleTable">
			<el-table-column prop="entity_code" label="店铺编码" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="entity_name" label="店铺名称">
			</el-table-column>
			<el-table-column prop="short_name" label="店铺简称">
			</el-table-column>
			<el-table-column prop="full_name" label="店铺全称">
			</el-table-column>
			<el-table-column prop="open_date" label="开店日期">
			</el-table-column>
			<el-table-column prop="close_date" label="关店日期">
			</el-table-column>
			<el-table-column prop="addr01_name" label="国家">
			</el-table-column>
			<el-table-column prop="addr02_name" label="省份">
			</el-table-column>
			<el-table-column prop="addr03_name" label="地区">
			</el-table-column>
			<el-table-column prop="addr04_name" label="县市">
			</el-table-column>
			<el-table-column prop="addr05_name" label="乡镇">
			</el-table-column>
			<el-table-column prop="cust_name" label="客户姓名">
			</el-table-column>
			<el-table-column prop="entity_type" label="店铺类型">
			</el-table-column>
			<el-table-column prop="entity_state" label="店铺状态">
			</el-table-column>
			<el-table-column prop="area" label="面积">
			</el-table-column>
			<el-table-column prop="order_code" label="店铺排序编码">
			</el-table-column>
			
			<el-table-column label="操作" width="240">
				<template slot-scope="scope">
					<el-button size="small" type="primary" @click="showEditEntity(scope.$index,scope.row)">编辑</el-button>
					<el-button size="small" type="primary" @click="showDelEntity(scope.$index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="this.currentPage" :page-sizes="[15, 20, 50, 100]" :page-size="this.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="data.length">
		</el-pagination>

	<el-dialog title="增加店铺" :rules="rules" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="店铺编码：" :label-width="formLabelWidth">
					<el-input v-model="form.entity_code" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="店铺名称：" :label-width="formLabelWidth">
					<el-input v-model="form.entity_name" auto-complete="off"></el-input>
				</el-form-item>	
				<el-form-item label="店铺简称：" :label-width="formLabelWidth">
					<el-input v-model="form.short_name" auto-complete="off"></el-input>
				</el-form-item>	
				<el-form-item label="店铺全称：" :label-width="formLabelWidth">
					<el-input v-model="form.full_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="开店日期：" :label-width="formLabelWidth">
					<el-input v-model="form.open_date" auto-complete="off"></el-input>
				</el-form-item>	
				<el-form-item label="关店日期：" :label-width="formLabelWidth">
					<el-input v-model="form.close_date" auto-complete="off"></el-input>
				</el-form-item>	
				<el-form-item label="国家：" :label-width="formLabelWidth">
					<el-input v-model="form.addr01_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="省份：" :label-width="formLabelWidth">
					<el-input v-model="form.addr02_name" auto-complete="off"></el-input>
				</el-form-item>	
				<el-form-item label="地区：：" :label-width="formLabelWidth">
					<el-input v-model="form.addr03_name" auto-complete="off"></el-input>
				</el-form-item>	
				<el-form-item label="县市：" :label-width="formLabelWidth">
					<el-input v-model="form.addr04_name" auto-complete="off"></el-input>
				</el-form-item>	
				<el-form-item label="乡镇：" :label-width="formLabelWidth">
					<el-input v-model="form.addr05_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="客户姓名：" :label-width="formLabelWidth">
					<el-input v-model="form.cust_name" auto-complete="off"></el-input>
				</el-form-item>	
				<el-form-item label="店铺类型：" :label-width="formLabelWidth">
					<el-input v-model="form.entity_type" auto-complete="off"></el-input>
				</el-form-item>	
				<el-form-item label="面积：" :label-width="formLabelWidth">
					<el-input v-model="form.area" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="店铺排序编码：" :label-width="formLabelWidth">
					<el-input v-model="form.order_code" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEntity">确 定</el-button>
			</div>

		</el-dialog>

		<el-dialog title="删除公司" :visible.sync="delDialogVisible" width="30%" center>
			<span>{{ delMsg }}</span>
			<span slot="footer" class="dialog-footer">
				    <el-button @click="delDialogVisible = false">取 消</el-button>
				    <el-button type="primary" @click="delEntity">确 定</el-button>
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
				companyName: '',
				dialogFormVisible:false,
				rules:{},
				form: {
					entity_code:'',
					entity_name:'',
					short_name:'',
					full_name:'',
					open_date:'',
					close_date:'',
					addr01_name:'',
					addr02_name:'',
					addr03_name:'',
					addr04_name:'',
					addr05_name:'',
					cust_name:'',
					entity_type:'',
					area:'',
					order_code:''
				},
				formLabelWidth:'120px',
				company_key:'7e4d4d9248f34af48e8cd434661f6793',
				entity_key :'',
				brand_key:'',
				delMsg:'',
				delDialogVisible :false,
				isAdd:false,
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
				let paras = apiparas.getParas_Objects('b_entity', '', 'entity_key,entity_code,entity_name,short_name,full_name,open_date,close_date,addr01_name,addr02_name,addr03_name,addr04_name,addr05_name,cust_name,entity_type,entity_state,area,order_code,create_time,update_time');
				getObjects(paras).then(response => {
					// success callback
					var json_data = response.result;
					this.data = json_data;
				});
			},
			queryCompany:function(){
				if(this.companyName===''){
					this.showData();
				}else{
					let paras = apiparas.getParas_Objects('b_company', 'company_name.Contains( \''+this.companyName+'\')', 'company_key,company_name,telphone,address,legal_person,create_time,update_time');
					getObjects(paras).then(response => {
						// success callback
						var json_data = response.result;
						if(json_data.length===0){
							this.$message.warning('没有查询到该公司！');
						}
						this.data = json_data;
					});
				}
			},
			refreshPage: function() {
				//刷新页面
			},
			saveEntity:function(){
				//保存尺码组
				let token = Cookie.Get('token');
				if(this.form.order_code===''){this.form.order_code=1};
				let obj={
					TypeName: 'b_entity',
						JsonObj: {
							company_key:this.company_key,
							entity_key:this.entity_key,
							brand_key:this.brand_key,
							entity_code:this.form.entity_code,
							entity_name:this.form.entity_name,
							short_name:this.form.short_name,
							full_name:this.form.full_name,
							open_date:this.form.open_date,
							close_date:this.form.close_date,
							addr01_name:this.form.addr01_name,
							addr02_name:this.form.addr02_name,
							addr03_name:this.form.addr03_name,
							addr04_name:this.form.addr04_name,
							addr05_name:this.form.addr05_name,
							cust_name:this.form.cust_name,
							entity_type:this.form.entity_type,
							entity_state:this.form.entity_state,
							area:this.form.area,
							order_code:this.form.order_code
						},
					token: token 
				};
				
				if (!this.isAdd)
				{
					entity_update(obj).then(response => {

					if(response.errid == 0) {
						this.$message.success('修改店铺成功！');
						this.dialogFormVisible = false;
					} else {
						this.$message.error('修改店铺失败！');
					}
					this.entity_key='';
					this.brand_key='';
					this.form.entity_code = '';
					this.form.entity_name = '';
					this.form.short_name = '';
					this.form.full_name = '';
					this.form.open_date = '';
					this.form.close_date = '';
					this.form.addr01_name = '';
					this.form.addr02_name = '';
					this.form.addr03_name = '';
					this.form.addr04_name = '';
					this.form.addr05_name = '';
					this.form.cust_name = '';
					this.form.entity_type = '';
					this.form.area = '';
					this.form.order_code = '';
					this.showData();

				});
				}
				else
				{
					entity_add(obj).then(response => {

					if(response.errid == 0) {
						this.$message.success('增加店铺成功！');
						this.dialogFormVisible = false;
					} else {
						this.$message.error('增加店铺失败！');
					}

					this.entity_key='';
					this.brand_key='';
					this.form.entity_code = '';
					this.form.entity_name = '';
					this.form.short_name = '';
					this.form.full_name = '';
					this.form.open_date = '';
					this.form.close_date = '';
					this.form.addr01_name = '';
					this.form.addr02_name = '';
					this.form.addr03_name = '';
					this.form.addr04_name = '';
					this.form.addr05_name = '';
					this.form.cust_name = '';
					this.form.entity_type = '';
					this.form.area = '';
					this.form.order_code = '';
					this.showData();

				});
				}
				
			},
			showEditEntity: function(index,row) {
				//编辑组别
				this.entity_key = row.entity_key;
				this.brand_key=row.brand_key;
				this.form.entity_code = row.entity_code;
				this.form.entity_name = row.entity_name;
				this.form.short_name = row.short_name;
				this.form.full_name = row.full_name;
				this.form.open_date = row.open_date;
				this.form.close_date = row.close_date;
				this.form.addr01_name = row.addr01_name;
				this.form.addr02_name = row.addr02_name;
				this.form.addr03_name = row.addr03_name;
				this.form.addr04_name = row.addr04_name;
				this.form.addr05_name = row.addr05_name;
				this.form.cust_name = row.cust_name;
				this.form.entity_type = row.entity_type;
				this.form.area = row.area;
				this.form.order_code = row.order_code;
				this.dialogFormVisible = true;
				this.isAdd = false;
			},
			showDelEntity: function(index,row) {
				//删除组别
				this.entity_key = row.entity_key;
				this.delMsg = '您确定要删除店铺名称：' + row.entity_name;
				this.delDialogVisible = true;
			},
			delEntity()
			{
				
				let obj = {
					TypeName: "b_entity",
					JsonObj: {
						entity_key: this.entity_key
					},
					token: Cookie.Get("token"),
				}
				entity_delete(obj).then(response => {
					
					if(response.errid == 0) {
						this.$message.success('删除店铺成功！');
						this.delDialogVisible = false;
					} else {
						this.$message.error('删除店铺失败！');
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