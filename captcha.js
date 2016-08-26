/*
*	识别验证码
*/
// 加载模块
const http=require('http')
const fs=require('fs')
const tesseract=require('node-tesseract')
const gm=require('gm')

function getCode(url,opts,callback){
	var opts=opts || {}
	var optz=opts.optz || 0  // 是否需要优化，默认不需要
	var optz_temp=opts.optz_temp || '_optz.png'  // 本地优化后验证码路径
	fixOrigin(url,function(path){
		if(optz){
			optimization(path,optz_temp,optz,function(opath){
				recognition(opath,function(text){
					callback(text)
				})
			})
		}else{
			recognition(path,function(text){
				callback(text);
			})
		}
	})
}

// 图片来源
function fixOrigin(url,callback){
	var _url='' // 原始
	//判断是否为远程
	if(url.split('://').length==2){
		// 保存到本地
		http.get(url,function(res){
			var imgData=''
			// 保存成二进制
			res.setEncoding('binary')
			res.on('data',function(chunk){
				imgData+=chunk
			}).on('end',function(){
				_url='_local.png'
				fs.writeFile(_url,imgData,'binary',function(){
					callback(_url)
				})
			})
		})
	}else{
		callback(url)
	}
}

// 优化图片
function optimization(path,newPath,val,cb){
	gm(path).threshold(val).write(newPath,function(err){
		if(err) throw err;
		cb(newPath)
	})
}

// 开始识别
function recognition(path,cb){
	tesseract.process(path,function(err,text){
		if(err) throw err
		cb(text)		
	})
}

// exports
exports.fixOrigin=fixOrigin // 线上图片需要保存到本地
exports.optimization=optimization  // 优化图片
exports.recognition=recognition	// 识别图片
exports.getCode=getCode  // 识别验证码