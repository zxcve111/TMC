/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
let baseUrl = '';
let routerMode = 'history';
let baseImgPath;
let logout = "/"
if (process.env.NODE_ENV == 'development') {
     // baseUrl='http://10.233.166.134'; //有线
     // baseUrl='http://10.233.155.99'; //有线
    //baseUrl='http://10.233.155.109:8111/Graph'; //张帆有线
     baseUrl='https://tmctest.fresenius-kabi-sspc.com/Graph'; //测试
    //  baseUrl='http://10.156.152.132:8019/Graph'; //测试
} else if (window.location.host == 'tmctest.fresenius-kabi-sspc.com')
{
    baseUrl='https://tmctest.fresenius-kabi-sspc.com/Graph'; //测试
}
else if(window.location.host == 'tmc.fresenius-kabi.com.cn')
{
    baseUrl='https://tmc.fresenius-kabi.com.cn/Graph';
}
export {
    baseUrl,
    routerMode,
    baseImgPath,
    logout,
}
