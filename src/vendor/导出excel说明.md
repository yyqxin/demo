#npm install vuex --save     
##安装vuex
#npm install element-ui@2.0 --save
##升级element版本为2.0
#npm install file-saver --save
##安装文件保存模块
#npm install xlsx --save
##安装excel处理模块
#npm install script-loader --save-dev
##安装script-loader 模块

###在导出excel时，如果提示savaAs未定义，可以找到文件vendor\FileSaver.js文件，替换保存模块下的的FileSaver.js文件即可

升级element-ui需要先卸载原先的版本,在cmd中输入 
npm unstall element-ui 

然后重新安装element-ui 
npm i element-ui -S