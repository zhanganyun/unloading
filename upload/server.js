// 后端(node.js) upload.js
var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');    // 过滤请求头部相应格式的body
var multer = require('multer');
var chalk = require('chalk');   // 只是一个 cli 界面字体颜色包而已
var log = console.log.bind(console);

app.use(express.static('static'));
// 接受 application/json 格式的过滤器
var jsonParser = bodyParser.json()
// 接受 application/x-www-form-urlencoded 格式的过滤器
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// 接受 text/html 格式的过滤器
var textParser = bodyParser.text()

// 自定义 multer 的 diskStorage 的存储目录与文件名
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname)
  }
})

var upload = multer({ storage: storage })

// 页面渲染
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/test', textParser, jsonParser, function (req, res) {
  log(req.body);
  var httpInfo = http.address();
  res.send({
    host: httpInfo.address,
    port: httpInfo.port
  })
})

// 对应前端的上传接口 http://127.0.0.1:3000/upload, upload.any() 过滤时不对文件列表格式做任何特殊处理
app.post('/upload', upload.any(), function (req, res) {
  log(req.files)
  res.send({message: '上传成功'})
})

// 监控 web 服务
var http = app.listen(3000, '127.0.0.1', function () {
  var httpInfo = http.address();
  log(`创建服务${chalk.green(httpInfo.address)}:${chalk.yellow(httpInfo.port)}成功`)
})