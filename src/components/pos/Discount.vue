<template>
	<div>
		<el-table :data="tabledate" border style="width: 100%">
			<el-table-column label="商品名称">
				<template slot-scope="scope">
					<div class="td">{{ scope.row.name }}</div>
				</template>
			</el-table-column>
			<el-table-column label="颜色">
				<template slot-scope="scope">
					<div class="td">{{ scope.row.color }}</div>
				</template>
			</el-table-column>
			<el-table-column label="尺寸">
				<template slot-scope="scope">
					<div class="td">{{ scope.row.size }}</div>
				</template>
			</el-table-column>
			<el-table-column label="吊牌价">
				<template slot-scope="scope">
					<div class="td">{{ scope.row.price }}</div>
				</template>
			</el-table-column>
			<el-table-column label="折扣">
				<template slot-scope="scope">
					<div class="td">{{ scope.row.discount }}</div>
				</template>
			</el-table-column>
			<el-table-column label="金额">
				<template slot-scope="scope">
					<div class="td">{{ scope.row.amt }}</div>
				</template>
			</el-table-column>
		</el-table>
		<br>
		<br>
		<el-form>
			<el-form-item label="折扣" :label-width="formLabelWidth">
				<el-input type="number" ref="discountChange" id="discountChange" v-model="discount" auto-complete="off" @keyup.enter.native="discountChange()"></el-input>
			</el-form-item>
			<el-form-item label="减免金额" :label-width="formLabelWidth">
				<el-input type="number" ref="amtChange" id="amtChange" v-model="amt" auto-complete="off" @keyup.enter.native="discountChange()"></el-input>
			</el-form-item>
			<el-row type="flex" class="row-bg" justify="center">
  				<el-button @click="close()">取 消</el-button>
				<el-button type="primary" @click="discountChange()">确 定</el-button>
			</el-row>
		</el-form>
	</div>
</template>

<script>
	
	export default {
		props: ['currentRow','dialogDiscountVisible'],
		data() {
			return {
				formLabelWidth: '100px',
				discount:'',
				amt:''
			}
		},
		mounted: function() {
			//生命周
			this.$refs.discountChange.focus();
			console.log(this.currentRow);
		},

		computed: {
			//计算属性
			tabledate(){
				let tabledate=[];
				tabledate.push(this.currentRow);
				return tabledate;
			}
		},
		methods: { //函数
			infocus:function(){
				this.$refs.amtChange.focus();
			},
			close:function(){
				this.$emit('onchange', this.currentRow);
			},
			discountChange(){
				let dc;
				let amt;
				if(this.discount===''){
      				dc=this.currentRow.discount.substring(0,this.currentRow.discount.length-1);
      				console.log(dc,'1');
      			}else{
      				dc = this.discount;
      			}
      			if(this.amt===''){
      				amt=0;
      			}else{
      				amt = this.amt;
      			}
      			
      			
	        	if(dc>0&&dc<10){
	        		this.currentRow.price_after_discount = Number( (this.currentRow.price*(dc*10/100) - (amt/this.currentRow.count)).toFixed(2) );
	        		this.currentRow.discount = (this.currentRow.price_after_discount/this.currentRow.price).toFixed(2)*100+"%";
      				this.currentRow.amt = Number( (this.currentRow.count*this.currentRow.price_after_discount).toFixed(2) );
	        	}else if(dc>=10&&dc<=100){
	        		this.currentRow.price_after_discount = Number( (this.currentRow.price*(dc/100) - (amt/this.currentRow.count)).toFixed(2) );
	        		this.currentRow.discount = (this.currentRow.price_after_discount/this.currentRow.price).toFixed(2)*100+"%";
      				this.currentRow.amt = Number( (this.currentRow.count*this.currentRow.price_after_discount).toFixed(2) );
	        	}
      			this.$emit('onchange', this.currentRow);
			},
		},
		created: function() {
			
		},
		update: function() {
	
		},
		watch: {
			dialogDiscountVisible:function (newval, oldval){
				if(newval===true){
					this.$refs.discountChange.focus();
					this.discount='';
					this.amt='';
				}
			}
		},
//		beforeCreate: function() {
//			console.log("创建前beforeCreate");
//		},
//		created: function() {
//			console.log("创建之后created");
//		},
//		beforeMount: function() {
//			console.log("mount之前beforeMount");
//		},
//	
//		mounted: function() {
//			console.log("mount之后mounted");
//		},
//	
//		beforeUpdate: function() {
//			console.log("更新前beforeUpdate");
//		},
//		updated: function() {
//			console.log("更新完成updated");
//		},
//		beforeDestroy: function() {
//			console.log("销毁前beforeDestroy");
//		},
//		destroyed: function() {
//			console.log("已销毁destroyed");
//		},
//		activated:function(){
//			console.log("activated");
//		},
//		deactivated:function(){
//	  		console.log("deactivated");
//	  	}
	}
</script>

<style>

</style>