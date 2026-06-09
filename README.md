<h3>基于<a href="https://lyt-top.gitee.io/vue-next-admin-doc-preview/">vue-next-admin</a>模板的ts分支<a href="https://gitee.com/lyt-top/vue-next-admin/tree/vue-next-admin-template/">vue-next-admin-template</a>修改
</h3>
<h3>注意事项</h3>

- '/@'已经按习惯改成'@'（'/@'有时候工具会报红）
- 增加了unocss配置
- SvgIcon代码修改过
- 注意此模板elementIcon的用法，单独使用的时候要加ele-，这是模板本身的修改，<a href="https://lyt-top.gitee.io/vue-next-admin-doc-preview/config/iconfont/">见</a>
- 网络请求工具request.ts有修改
- 注意此模板面包屑显示和路由的命名之间的关系，见<a href="https://gitee.com/lyt-top/vue-next-admin/blob/master/src/router/route.ts#L584-588">这里</a>
- userInfo的保存和header的格式已改好，修改了Session工具类，增加了存储userInfo的逻辑（记住我-存cookie，不记住-存session），注意此模板，是在路由守卫（frontEnd、backEnd）中读取了userInfo到store中
-  npm换成了pnpm，步骤: 

```
- 删除 node_modules
- npm install -g pnpm（安装pnpm）
- pnpm import（为了从package-lock.json导入到pnpm-lock.yaml，完事删除package-lock.json）
- pnpm install （装依赖包）
```
### 🎨 原子化 CSS

使用 [tailwindicss](https://github.com/tailwindlabs/tailwindcss) 或 [UnoCss](https://unocss.dev/)    
如果需要使用背景，需要将文件放置在 `public/images` 目录下
```html
<div class="bg-[url(/images/bg-1.png)]"></div>
```

### Webp图片显示配置
web.config
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<configuration>
  <system.webServer>
   ... 
    <staticContent>
      <mimeMap fileExtension=".webp" mimeType="image/webp" />
    </staticContent>
    ...
  </system.webServer>
</configuration>

```


### 另外记录一些遇到的坑

- 最外层的template和div之间不能有任何东西（包括注释）
- 想要keep-alive的话，组件的name必须和路由的name一致
- 关于本地图片地址的问题，如 img src="/src/assets/img/share_bg.png"
  - 最前面要加斜杠，/src是绝对路径，src是相对路径，配了别名@的用别名，不容易错（不然本地能显示，线上不行）
  - 不要用el-image（待验证，el-image就显示显示网络图片吧）
  - js或ts里的必须用import形式导入
  - 动态的background里的url写法：
  
```
import iosIcon from "@/assets/svg/ios.svg"
const style = `background: url(${iosIcon}) no-repeat center center`
```
