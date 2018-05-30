<template>
	<div>
		<el-row>
			<el-col :span="20">
				<el-input id="inputvip" placeholder="请输入会员卡号" ref="inputvip" v-model="inputvip" @keyup.enter.native="getVIP(inputvip)">
					<template slot="prepend">会员卡号：</template>
				</el-input>
			</el-col>
			<el-col :span="4">
				<el-button type="primary" @click="getVIP(inputvip)">搜索</el-button>
			</el-col>
		</el-row>
		
		<div v-if="vipQuery">
			<el-table :data="vipData" border style="width: 100%">
				<el-table-column label="姓名">
					<template slot-scope="scope">
						<div class="td">{{ scope.row.vip_name }}</div>
					</template>
				</el-table-column>
				<el-table-column label="卡号">
					<template slot-scope="scope">
						<div class="td">{{ scope.row.vip_card }}</div>
					</template>
				</el-table-column>
				<el-table-column label="手机号">
					<template slot-scope="scope">
						<div class="td">{{ scope.row.mobilephone }}</div>
					</template>
				</el-table-column>
				<el-table-column label="类别">
					<template slot-scope="scope">
						<div class="td">{{ scope.row.vip_level }}</div>
					</template>
				</el-table-column>
			</el-table>
			
			<br>
			<el-row type="flex" class="row-bg" justify="center">
	  			<el-button @click="close()">取 消</el-button>
				<el-button type="primary" @click="selectVIP()">确 定</el-button>
			</el-row>
		</div>
		
		<div v-if="vipAdd" style="height: 250px;">
			<br /> 	
			<el-form :model="vip">
				<el-col :span="12">
					<el-form-item label="姓名" :label-width="formLabelWidth">
						<el-input v-model="vip.vip_name" auto-complete="off"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="性别" :label-width="formLabelWidth">
						<el-input v-model="vip.sex" auto-complete="off"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="生日" :label-width="formLabelWidth">
						<el-input v-model="vip.Birthday" auto-complete="off"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="卡号" :label-width="formLabelWidth">
						<el-input v-model="vip.vip_card" auto-complete="off"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="手机号码" :label-width="formLabelWidth">
						<el-input v-model="vip.mobilephone" auto-complete="off"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="类型" :label-width="formLabelWidth">
						<el-input v-model="vip.vip_level" auto-complete="off"></el-input>
					</el-form-item>
				</el-col>
				<br>
				<el-col :span="24">
					<el-row type="flex" class="row-bg" justify="center">
			  			<el-button @click="close()">取 消</el-button>
						<el-button type="primary" @click="addVIP()">确定并添加</el-button>
					</el-row>
				</el-col>
				
			</el-form>
			
			
		</div>
	</div>
</template>

<script>
	import { query, apiparas,entity_add } from '../../api/api';
	
	export default {
		props: ['dialogVipVisible','currentPage'],
		data() {
			return {
				inputvip:'',
				vipData:[],
				vipQuery:false,
				vipAdd:false,
				formLabelWidth:'100px',
				vip:{
           			company_key:"7e4d4d9248f34af48e8cd434661f6793",
		            vip_name:"czc",
		            Birthday:"1995-08-06",
		            sex:"男",
		            telphone:"13650425960",
		            mobilephone:"13650425960",
		            vip_card:"card99",
		            vip_level:"银卡",
		            entity_key:"7e4d4d9248f34af48e8cd434661f6795"
        		}
			}
		},
		mounted: function() {
			//生命周期
			this.$refs.inputvip.focus();
		},
		computed: {
			//计算属性
		
		},
		methods: { //函数
			getVIP:function(val){
				var jsonparas = [];
				var jsondata = {};
				apiparas.pushPara(jsonparas, 'vip', val);
				let paras = apiparas.getParas('vip|get_vip_byno',jsonparas);
				query(paras).then(response => {
					if(response.result.length>0){
						this.vipData=response.result;
						this.vipAdd=false;
						this.vipQuery=true;
					}else{
						this.vipQuery=false;
						this.vipAdd=true;						
					}
				});
			},
			addVIP:function(){
				let paras = apiparas.getParas_add("b_vip",this.vip);
				entity_add(paras).then(response =>{
					if(response.result.length>0){
						this.getVIP(this.vip.mobilephone);
						this.vipAdd=false;
						this.vipQuery=true;
					}
				});
			},
			selectVIP:function(){
				this.$emit('onchange',this.vipData[0]);
			}
			
		},
		created:function(){
    		
    	},
		update:function(){
			
		},
		watch: {
			dialogVipVisible:function (newval, oldval){
				if(newval===true){
					this.$refs.inputvip.focus();
					this.inputvip='';
					this.vipData=[];
					this.vipQuery=false;
					this.vipAdd=false;
				}
			}
		}

	}
</script>

<style>
</style>