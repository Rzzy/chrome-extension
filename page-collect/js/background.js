// 创建右键菜单
chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: 'contextMenu1',
    title: '收藏此页面',
  });
  chrome.contextMenus.create({
    id: 'contextMenu2',
    title: '使用百度搜索：%s', // %s表示选中的文字
    contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
  });
});
// 当用户点击右键菜单时执行的方法
chrome.contextMenus.onClicked.addListener((item, tab) => {
  const tld = item.menuItemId;
  const url = new URL(`https://google.${tld}/search`);
  url.searchParams.set('q', item.selectionText);
  switch (tld) {
    case 'contextMenu1':
      sendMessageToContentScript(
        {
          message: 'collect-page',
        },
        notifications
      );

      break;
    case 'contextMenu2':
      chrome.tabs.create({
        url:
          'https://www.baidu.com/s?ie=utf-8&wd=' +
          encodeURI(item.selectionText),
      });
    default:
      break;
  }
});
function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      if (callback) callback(response);
    });
  });
}
function notifications(message, type, title) {
  chrome.notifications.create({
    type: type || 'basic',
    iconUrl: '../images/icon.png',
    title: title || 'page loaded',
    message: message || '您刚才点击了自定义右键菜单！',
  });
}
