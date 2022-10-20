// 监听 background 传来的数据 可对页面dom操作
chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    
    // 启动简易图片浏览器
	if(data.mediaType=="image"){
		if(data.srcUrl!=""){
            
            function getWH(){
                let WW = 0;
                let HH = 0;
    
                if (window.innerWidth)
                    WW = window.innerWidth;
                else if ((document.body) && (document.body.clientWidth))
                    WW = document.body.clientWidth;
    
                if (window.innerHeight)
                    HH = window.innerHeight;
                else if ((document.body) && (document.body.clientHeight))
                    HH = document.body.clientHeight;
                console.log(WW,HH);
                if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
                    HH = document.documentElement.clientHeight;
                    WW = document.documentElement.clientWidth;
                }
                return [WW,HH]
            }
			// console.log(data);
			imageView = document.createElement("div");
			
			// console.log(imageView)
			document.body.appendChild(imageView)
			imageView.outerHTML = '<div id="imgViewDiv" style="position: fixed;left: 0;right: 0;top: 0;bottom: 0;z-index: 2000;background: rgba(0, 0, 0, 1);overflow:scroll;"><div id="imgButtions"><div id="imgCapture" style="overflow: hidden;display: block;position: fixed;right: 200px;top: 20px;cursor: pointer;background-color:#fff;border-radius: 6px;padding: 0px 5px;border: 2px solid;user-select: none;" >识别</div><div id="imgViewZoomIn" style="overflow: hidden;display: block;position: fixed;right: 140px;top: 20px;cursor: pointer;background-color:#fff;border-radius: 6px;padding: 0px 5px;border: 2px solid;user-select: none;" >放大</div><div id="imgViewZoomOut" style="overflow: hidden;display: block;position: fixed;right: 80px;top: 20px;cursor: pointer;background-color:#fff;border-radius: 6px;padding: 0px 5px;border: 2px solid;user-select: none;" >缩小</div><div id="imgViewClose" style="overflow: hidden;display: block;position: fixed;right: 20px;top: 20px;cursor: pointer;background-color:#fff;border-radius: 6px;padding: 0px 5px;border: 2px solid;user-select: none;" >关闭</div></div><img  src="'+data.srcUrl+'" id="imgViewTarget"></img></div>'
			// console.log(imageView)
            
            function closeImageView(){
                imgViewDiv.parentNode.removeChild(imgViewDiv);
            }
            document.getElementById("imgViewClose").addEventListener("click", closeImageView);

            function zoomInImageView(){
                mm = 1.25;
                hh = imgViewTarget.height;
                ww = imgViewTarget.width;
                imgViewTarget.height = hh*mm;
                imgViewTarget.width = ww*mm;
                wh=getWH();
                WW = wh[0],HH=wh[1];

                // y0 imgViewDiv.scrollTop+HH/2
                // y1 imgViewDiv.scrollTop'+HH/2 = y0*1.25
                // imgViewDiv.scrollTop' = 1.25 *imgViewDiv.scrollTop+0.25*HH/2
                imgViewDiv.scrollTo(imgViewDiv.scrollLeft*mm+(mm-1)*WW/2,imgViewDiv.scrollTop*mm+(mm-1)*HH/2);
                
                imageAutoMagin();
            }
            document.getElementById("imgViewZoomIn").addEventListener("click", zoomInImageView);

            function zoomOutImageView(){
                mm = 0.8;
                hh = imgViewTarget.height;
                ww = imgViewTarget.width;
                imgViewTarget.height = hh*mm;
                imgViewTarget.width = ww*mm;

                wh=getWH();
                WW = wh[0],HH=wh[1];
                // y0 imgViewDiv.scrollTop+HH/2
                // y1 imgViewDiv.scrollTop'+HH/2 = y0*0.8
                // imgViewDiv.scrollTop' = 0.8 *imgViewDiv.scrollTo-0.2*HH/2
                imgViewDiv.scrollTo(imgViewDiv.scrollLeft*mm+(mm-1)*WW/2,imgViewDiv.scrollTop*mm+(mm-1)*HH/2);
                
                imageAutoMagin();
            }
            document.getElementById("imgViewZoomOut").addEventListener("click", zoomOutImageView);

            

            function imageAutoMagin(){
                wh=getWH();
                WW = wh[0],HH=wh[1];
                // console.log(WW,HH);
                if(HH>imgViewTarget.height)
                    imgViewTarget.style.marginTop = ''+(HH-imgViewTarget.height)/2+'px';
                if(WW>imgViewTarget.width)
                    imgViewTarget.style.marginLeft = ''+(WW-imgViewTarget.width)/2+'px';
            }

            function imageInit(){
                wh=getWH();
                WW = wh[0],HH=wh[1];
                if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
                    HH = document.documentElement.clientHeight;
                    WW = document.documentElement.clientWidth;
                }
                if(HH*imgViewTarget.width>WW*imgViewTarget.height){
                    imgViewTarget.width = WW;
                    imgViewTarget.style.marginTop = ''+(HH-imgViewTarget.height)/2+'px';
                    // console.log(WW,HH);
                }
                else {
                    
                    imgViewTarget.height = HH;
                    imgViewTarget.style.marginLeft = ''+(WW-imgViewTarget.width)/2+'px';
                }
                
            }
            imgViewTarget.addEventListener("load", imageInit);
            

            function launchJS(){
                document.getElementById("imgButtions").style.display="none";
                try{
                    chrome.runtime.sendMessage({farewell: "startCapture"}, function(response) {
                        console.log(response);
                        document.getElementById("imgButtions").style.display="block";
                    });
                }
                catch{
                    document.getElementById("imgButtions").style.display="block";
                }
                
            }
            document.getElementById("imgCapture").addEventListener("click", launchJS);
            
		}

        
	}
    // else {
    //     sendResponse({farewell: "noCapture"});    
    // }
    sendResponse();
    
});
