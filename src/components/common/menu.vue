<template>
	<div class="top_menu">
		<el-menu :default-active="onRoutes"  :router=true mode="horizontal" @select="handleSelect" background-color="#242f42"
			style="background-color: transparent;" text-color="#fff" active-text-color="#ffd04b" unique-opened router  >
			 <template v-for="item in items">
				<template v-if="item.subs">
					<el-submenu :index="item.menu_index">
						<template slot="title"><span><icon :name="item.icon" ></icon>&nbsp;&nbsp;{{ item.title }}</span></template>

						<template v-for="subItem in item.subs">
							<template v-if="subItem.subs">
								<el-submenu :index="subItem.menu_index">
									<template slot="title">{{ subItem.title }}</template>
									<el-menu-item v-for="(lastitem,i) in subItem.subs" :key=i :index="lastitem.menu_index" >{{ lastitem.title }}
									</el-menu-item>
								</el-submenu>
							</template>
							<template v-else>
								<el-menu-item :index="subItem.menu_index">
									{{ subItem.title }}
								</el-menu-item>
							</template>

						</template>
					</el-submenu>
				</template>
				<template v-else>
					<el-menu-item :index="item.menu_index">
						<i :class="item.icon"></i>{{ item.title }}
					</el-menu-item>
				</template>
			</template>
		</el-menu>
	</div>
</template>

<script>
	import { query, apiparas } from '../../api/api';
	
	export default {
		data() {
			return {
				activeIndex: '1',
				activeIndex2: '1',
				isCollapse: true,
				items: []			
			};
		},
		components: {
			//注册组件
		},
		mounted: function() {
			//生命周期
		},
		computed: {
			onRoutes() {				
				return this.$route.path.replace('/', '');
			}
		},
		methods: {
			showmenu: function() {
				//显示数据
				var jsonparas = [];
				
				let paras = apiparas.getParas_rtype('menu|getmenu',3,jsonparas);
				query(paras).then(response => {
							var json_data = response.result;
							this.items = json_data;
				});
			},

      handleSelect(key, keyPath) {
       // console.log(key, keyPath);
      },
			handleOpen(key, keyPath) {
			//	console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
			//	console.log(key, keyPath);
			},

		},
		created: function() {
			this.showmenu();
		}
	}
</script>

<style>
.top_menu
{
	margin:-60px;
}
</style>