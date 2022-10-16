var displayMediaOptions = {
    video: {
        cursor: "always"
    },
    audio: false
};
// https://developer.chrome.com/docs/extensions/reference/scripting/#method-executeScript


function handleActionClick(tab){
    

    chrome.scripting.executeScript(
        {
          target: {tabId: tab.id},
          files: ['zxing.js','screen_capture.js'],
        },
        (results) => { 
            console.log("done")
            console.log(results)
         });

    // chrome.tabs.executeScript(tabId, { file: 'screen_capture.js' });
    
}

chrome.action.onClicked.addListener(handleActionClick);

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        title: '识别',
        id: 'qrcode',
        type: 'normal',
        contexts: ['all'],
    });
});
// 点击弹出菜单
chrome.contextMenus.onClicked.addListener(function(item, tab) {
	chrome.tabs.sendMessage(tab.id, item, function() {
		console.log(arguments, chrome.runtime.lastError);
	});
});
