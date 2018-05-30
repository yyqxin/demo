<template>
	<div class="sidebar">
		<!--<el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
			<el-radio-button :label="false">展开</el-radio-button>
			<el-radio-button :label="true">收起</el-radio-button>
		</el-radio-group>-->
		<el-menu  :default-active="onRoutes" :router=true class="el-menu-vertical-demo" theme="dark" @select="handleSelect" @open="handleOpen" @close="handleClose" unique-opened router >
			<template v-for="item in items">
				<template v-if="item.subs">
					<el-submenu :index="item.index">
						<template slot="title"><span><icon :name="item.icon" ></icon>&nbsp;&nbsp;{{ item.title }}</span></template>

						<template v-for="subItem in item.subs">
							<template v-if="subItem.subs">
								<el-submenu :index="subItem.index">
									<template slot="title">{{ subItem.title }}</template>
									<el-menu-item v-for="(lastitem,i) in subItem.subs" :key=i :index="lastitem.index" >{{ lastitem.title }}
									</el-menu-item>
								</el-submenu>
							</template>
							<template v-else>
								<el-menu-item :index="subItem.index">
									{{ subItem.title }}
								</el-menu-item>
							</template>

						</template>
					</el-submenu>
				</template>
				<template v-else>
					<el-menu-item :index="item.index">
						<i :class="item.icon"></i>{{ item.title }}
					</el-menu-item>
				</template>
			</template>
		</el-menu>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				isCollapse: true,
				items: [{
						icon: 'setting',
						index: '/md/welcome',
						title: '系统说明'
					},
					{
						icon: 'edit',
						index: 'tools',						
						title: '店铺工具',
						subs:[
							{
								index:'t01',title:'工具',
								subs:[
									{index:'/addbarcode',title:'条码登记'},
									{index:'/query_balance',title:'库存查询'},
									{index:'/query_barcode',title:'条码查询'},
									{index:'/Cashier',title:'收银'},
									{index:'/stock_out',title:'库存调出'},
									{index:'/stock_in',title:'库存调入'}
								]								
							}
						]
					},
					{
						icon: 'weixin',
						index: '4',
						title: '综合分析',
						subs: [
							{ index: '/retail_detail',title: '销售明细'}
							,{ index: '/stock',title: '最新库存'}
							,{ index: '/rScatter',title: '畅滞销分析'}
						]
					}
				]
			}
		},
		methods: {

      handleSelect(key, keyPath) {
        //console.log(key, keyPath);
      },
			handleOpen(key, keyPath) {
			//	console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				//console.log(key, keyPath);
			},

		},
		computed: {
			onRoutes() {				
				return this.$route.path.replace('/', '');
			}
		}
	}
</script>

<style scoped>
	
  /*.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }*/
  
	.sidebar {
		display: block;
		position: absolute;
		width: 400px;
		left: 0;
		top: 70px;
		bottom: 0;
		background: #2E363F;
	}
	
	.sidebar>ul {
		height: 100%;
	}
</style>