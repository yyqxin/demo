<template>
	<div id="divbox">
		<div id="header">

		</div>
		<div id="main">
			<div class="main-center">
				<el-table :data="tableData3" height="600"  style="width: 100%">
					<el-table-column prop="date" label="日期" >
					</el-table-column>
					<el-table-column prop="name" label="姓名" >
					</el-table-column>
					<el-table-column prop="address" label="地址">
					</el-table-column>
				</el-table>
			</div>
			<div class="main-right">
				F2:销售/退货
				<br> F8:选择销售员
				<br> F9:收款结算
				<br> F10:重打小票
				<br> ↑:上一行
				<br> ↓:下一行
				<br> ←:数量减1
				<br> →:数量加1
				<br> "+":会员选择
				<br> "-":折扣(改价,改折扣)
				<br> "/":整单打折
				<br> Del:删除行
				<br> Insert:清单,重开新单
				<br>
			</div>
			<div id="footer">

			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {}
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
			showcharts: function() {
				//显示图表
			},
			refreshPage: function() {
				//刷新页面
			}

		},
		created: function() {}
	}
</script>

<style>
	.content {
		background: none repeat scroll 0 0 #fff;
		position: absolute;
		left: 200px;
		right: 0;
		top: 70px;
		bottom: 0;
		width: auto;
		padding: 15px;
		box-sizing: border-box;
		overflow-y: scroll;
	}
	
	#header {
		height: 100px;
		background: blue;
	}
	
	#main {
		width: 100%;
		position: relative;
	}
	
	#main .main-center {
		height: 600px;
		width: 85%;
		margin: 0 0;
	}
	
	#main .main-right {
		width: 15%;
		height: 100%;
		background: pink;
		position: absolute;
		right: 0;
		top: 0;
	}
	
	#footer {
		height: 100px;
		width: 85%;
		background: gray;
	}
</style>