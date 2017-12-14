请求规范
    
    
    
响应的两种方案
1.同步响应
2.异步响应  ---- bigPipe

请求合并的两种方案
一、 前端负责打包
二、 后端约定


回调的解决方案
    bigPipe 的回调 bp.view ();

    jsonp

    也就是只能前端


执行方案
var requests = new RU.Requests();
requests.add({
    url:"",
    params:"",
    type:"get",
    
    });
requests.send();



fetch 
与 ajax 方案