
// get qrcode
var videoElem = null;
var displayMediaOptions = {
    video: {
        cursor: "always"
    },
    audio: false,
	preferCurrentTab:true
};
async function startCapture() {
    stopCapture();
    videoElem = document.createElement('video');
    videoElem.setAttribute("autoplay", "autoplay");
    videoElem.setAttribute("width", "1920");
    videoElem.setAttribute("height", "1080");
    videoElem.setAttribute("id", "video");
    videoElem.style.display="none";
    videoElem.style.position="fixed";
    // loadeddata

    function showRes(url){
        notion = document.createElement("div");
        document.body.appendChild(notion);
        notion.outerHTML = '<div id="qrResultDiv" style="position: fixed;left:0;right:0;top:0;bottom:0;z-index: 2001;background: rgba(0, 0, 0, 0.5);"><div style="margin:auto;text-align: center;position:absolute;max-width: 600px;max-height: 100px;left:0;right:0;top:0;bottom:0;background: white;border:3px solid;border-radius: 6px;padding-top:40px;"><div id="qrResultClose" style="overflow: hidden;display: block;position: absolute;right: 2px;top: -40px;cursor: pointer;background-color:#fff;border-radius: 6px;padding: 0px 5px;border: 2px solid;user-select: none;" >关闭</div><a style="color: black;;border: 1px solid;border-radius: 6px;padding: 0 2px;" href="'+url+'">'+url+'</a></div></div>';
        function closeqrResult(){
            qrResultDiv.parentNode.removeChild(qrResultDiv);
        }
        document.getElementById("qrResultDiv").addEventListener("click", closeqrResult);
    }

    videoElem.addEventListener('loadeddata',function(){
        // alert("loaded");
        var canvas = document.createElement('canvas');
        canvas.width = this.videoWidth;
        canvas.height = this.videoHeight;
        // canvas.style.display="none";
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);
        
        // zxing solution
        var luminanceSource = new HTMLCanvasElementLuminanceSource_1.HTMLCanvasElementLuminanceSource(canvas);
        var hybridBinarizer = new library_1.HybridBinarizer(luminanceSource);
        var bitmap =  new library_1.BinaryBitmap(hybridBinarizer);
        var qres = "failed";
        try{
            const resultImage = codeReader.decodeBitmap(bitmap,this.videoWidth,this.videoHeight);
            qres = resultImage.text;
        }
        catch(error){
            qres = "failed"
        }

        console.log(qres)
        showRes(qres);

		
		// // debug img result
        // var url = canvas.toDataURL();
		// var imageResult = document.createElement('img');
        // imageResult.setAttribute("src",url);
        // document.body.appendChild(imageResult);


        stopCapture();
        document.body.removeChild(videoElem);
      },false);

    document.body.appendChild(videoElem);


    try {
        videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

    } catch (err) {
        // console.error("Error: " + err);
		stopCapture();
        document.body.removeChild(videoElem);
    }
}


function stopCapture() {
    if(videoElem!=null&&videoElem.srcObject != null){
        let tracks = videoElem.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoElem.srcObject = null;
    }
}





startCapture();
// setTimeout(stopCapture,1000)