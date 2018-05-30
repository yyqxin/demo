<template>
	<div>
		<div style="width: 100%;height: 100px;">
			<div class="item">
				<div class="item_title">数量（件）</div>
				<div class="item_val"><h1>{{ count }}</h1></div>
			</div>
			<div class="item">
				<div class="item_title">金额（元）</div>
				<div class="item_val"><h1>{{ amt }}</h1></div>
			</div>
			<div class="item">
				<div class="item_title">实收（元）</div>
				<div class="item_val"><h1>{{ proceeds }}</h1></div>
			</div>
			<div class="item">
				<div class="item_title">找零（元）</div>
				<div class="item_val"><h1>{{ changemoney }}</h1></div>
			</div>
		</div>
		<el-form :model="proceedsForm" style="height: 250px;">
			<el-col :span="12">
				<el-form-item label="支付宝" :label-width="formLabelWidth">
					<el-input v-model="proceedsForm.Alipay" auto-complete="off"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="微信" :label-width="formLabelWidth">
					<el-input v-model="proceedsForm.wechat" auto-complete="off"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="刷卡" :label-width="formLabelWidth">
					<el-input v-model="proceedsForm.card" auto-complete="off"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="现金" :label-width="formLabelWidth">
					<el-input v-model="proceedsForm.cash" auto-complete="off"></el-input>
				</el-form-item>
			</el-col>
		</el-form>
		<el-row type="flex" class="row-bg" justify="center">
  			<el-button @click="close()">取 消</el-button>
			<el-button type="primary" @click="getproceeds()">确 定</el-button>
		</el-row>
	</div>
</template>

<script>
	
	export default {
		props: ['dialogAmtVisible','count','amt'],
		
		data() {
			return {
				formLabelWidth: '60px',
				proceedsForm:{
					Alipay:'',
					wechat:'',
					card:'',
					cash:''
				},
			}
		},
		mounted: function() {
			//生命周期
			
		},
		computed: {
			//计算属性
			proceeds(){
		    	//实收金额
		    	return Number(this.proceedsForm.Alipay)+Number(this.proceedsForm.wechat)+Number(this.proceedsForm.card)+Number(this.proceedsForm.cash);
		    },
		    changemoney(){
		    	//找零金额
		    	return this.proceeds-this.amt;
		    },
		    cashiers(){
		    	let cashier = [
		    		{cashier_type:'微信',fact_amt:Number(this.proceedsForm.wechat)},
					{cashier_type:'支付宝',fact_amt:Number(this.proceedsForm.Alipay)},
					{cashier_type:'现金',fact_amt:Number(this.proceedsForm.cash)}
		    	];
		    	return cashier;
		    }
		},
		methods: { //函数
			getproceeds:function(){
				
				this.$emit('onchange',this.cashiers,this.proceeds,this.changemoney);
			},
		},
		created: function() {
			
		},
		update:function(){
			
		},
		watch: {
			dialogAmtVisible:function(newval,oldval){
				if(newval===true){
					this.proceedsForm={
						Alipay:'',
						wechat:'',
						card:'',
						cash:''
					};
				}
			}
		}

	}
</script>

<style>
	.item{
		width: 25%;
		height: 100px;
		float: left;
		text-align: center;
	}
	.item_title{
		width: 100%;
		height:40px;
	}
	.item_val{
		width: 100%;
		height: 60px;
		font-size: xx-large;
	}
</style>