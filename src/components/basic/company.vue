<template>
	<div>
		<el-row>
			<el-col :span="6">
				<el-input placeholder="请输入公司名称" v-model="companyName"  @keyup.enter.native="queryCompany">
					<template slot="prepend">公司名称:</template>
				</el-input>
			</el-col>
			<el-col :span="4">
				<el-button type="primary" @click="queryCompany">查询</el-button>
				<el-button type="primary"  @click="dialogFormVisible = true;isAdd = true">增加</el-button>
			</el-col>
		</el-row>
		<el-table :data="data.slice((currentPage-1)*pagesize,currentPage*pagesize)" showOverflowTooltip style="width: 100%" border ref="multipleTable">
			<el-table-column prop="company_name" label="公司名称" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="telphone" label="联系电话">
			</el-table-column>
			<el-table-column prop="address" label="联系地址">
			</el-table-column>
			<el-table-column prop="legal_person" label="法人">
			</el-table-column>
			
			<el-table-column label="操作" width="240">
				<template slot-scope="scope">
					<el-button size="small" type="primary" @click="showEditCompany(scope.$index,scope.row)">编辑</el-button>
					<el-button size="small" type="primary" @click="showDelCompany(scope.$index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="this.currentPage" :page-sizes="[15, 20, 50, 100]" :page-size="this.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="data.length">
		</el-pagination>

	<el-dialog title="增加公司" :rules="rules" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="公司名称：" :label-width="formLabelWidth">
					<el-input v-model="form.company_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系电话：" :label-width="formLabelWidth">
					<el-input v-model="form.telphone" auto-complete="off"></el-input>
				</el-form-item>	
				<el-form-item label="联系地址：" :label-width="formLabelWidth">
					<el-input v-model="form.address" auto-complete="off"></el-input>
				</el-form-item>	
				<el-form-item label="法人：" :label-width="formLabelWidth">
					<el-input v-model="form.legal_person" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveCompany">确 定</el-button>
			</div>

		</el-dialog>

		<el-dialog title="删除公司" :visible.sync="delDialogVisible" width="30%" center>
			<span>{{ delMsg }}</span>
			<span slot="footer" class="dialog-footer">
				    <el-button @click="delDialogVisible = false">取 消</el-button>
				    <el-button type="primary" @click="delCompany">确 定</el-button>
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
					company_name:'',
					telphone:'',
					address:'',
					legal_person:''
				},
				formLabelWidth:'120px',
				company_key :'',
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
				let paras = apiparas.getParas_Objects('b_company', '', 'company_key,company_name,telphone,address,legal_person,create_time,update_time');
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
			saveCompany:function(){
				//保存尺码组
				let token = Cookie.Get('token');
				let obj={
					TypeName: 'b_company',
						JsonObj: {
							company_key:this.company_key,
							company_name:this.form.company_name,
							telphone:this.form.telphone,
							address:this.form.address,
							legal_person:this.form.legal_person
						},
					token: token 
				};
				
				if (!this.isAdd)
				{
					entity_update(obj).then(response => {

					if(response.errid == 0) {
						this.$message.success('修改公司成功！');
						this.dialogFormVisible = false;
					} else {
						this.$message.error('修改公司失败！');
					}
					this.company_key= '';
					this.form.company_name = '';
					this.form.telphone = '';
					this.form.address = '';
					this.form.address = '';
					this.form.legal_person = '';
					this.showData();

				});
				}
				else
				{
					entity_add(obj).then(response => {

					if(response.errid == 0) {
						this.$message.success('增加公司成功！');
						this.dialogFormVisible = false;
					} else {
						this.$message.error('增加公司失败！');
					}
					this.company_key= '';
					this.form.company_name = '';
					this.form.telphone = '';
					this.form.address = '';
					this.form.address = '';
					this.form.legal_person = '';
					this.showData();

				});
				}
				
			},
			showEditCompany: function(index,row) {
				//编辑组别
				this.company_key = row.company_key;
				this.form.company_name = row.company_name;
				this.form.telphone = row.telphone;
				this.form.address = row.address;
				this.form.legal_person = row.legal_person;
				this.dialogFormVisible = true;
				this.isAdd = false;
			},
			showDelCompany: function(index,row) {
				//删除组别
				this.company_key = row.company_key;
				this.delMsg = '您确定要删除公司 名称：' + row.company_name;
				this.delDialogVisible = true;
			},
			delCompany()
			{
				
				let obj = {
					TypeName: "b_company",
					JsonObj: {
						company_key: this.company_key
					},
					token: Cookie.Get("token"),
				}
				entity_delete(obj).then(response => {
					
					if(response.errid == 0) {
						this.$message.success('删除公司成功！');
						this.delDialogVisible = false;
					} else {
						this.$message.error('删除公司失败！');
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