### 构建生产环境版本

```
npm run build
```

如果想测试生产环境版本，可以执行以下命令构建并启动本地 HTTP 服务器预览：

```
npm run preview
```

自定义icon
// User custom variables
// =============================================================================

// Custom font icon
// -----------------------------------------------------------------------------
$icon-fonts: (
 // font-family
 YourFont: (
   weight: normal,
   style: normal,
   // font path
   src: unquote(
       'url("iconfont.woff") format("woff"),
       url("iconfont.ttf") format("truetype"),
       url("iconfont.svg#svgFontName") format("svg");'
   )
 ),
);

// icon name-unicode map
$icons: (
 location: \e612,
 home: \e60b,
 search:\e606,
 wallet:\e607,
 me:\e630,
 share:\e617,
 mycard:\e674,
 changelist:\e60a,
 help:\3459,
 close:\e660,
 like:\e600,
 dislike:\e603,
 transmit:\e610,
 save:\e60f
);
