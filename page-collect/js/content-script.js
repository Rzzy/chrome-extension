console.log('content script!');

// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function () {
  injectCustomJs();
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request, 'chrome.runtime.onMessage');
  if (request.message === 'collect-page') {
    createFormElement();
  }
  sendResponse('收到了backgound的消息！');
});

// 向页面注入JS
function injectCustomJs(jsPath) {
  jsPath = jsPath || 'js/inject.js';
  var temp = document.createElement('script');
  temp.setAttribute('type', 'text/javascript');
  // 获得inject的绝对地址：chrome-extension://mifefpkanolkhipobnchebomebjigcmo/js/inject.js
  temp.src = chrome.runtime.getURL(jsPath);
  temp.onload = function () {
    // 放在页面不好看，执行完后移除掉
    this.parentNode.removeChild(this);
  };
  document.body.appendChild(temp);
}
