var captcha=require('./captcha')
var fs=require('fs')

captcha.getCode('http://www.yunjingshang.com/captcha.php',{optz:50},function(text){
	fs.writeFile('res.txt',text,function(){
		console.log('已保存在res.txt中,验证码为：'+text)
	})
})