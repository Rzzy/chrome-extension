const storeKey = 'chromePageUrlStore';
function createFormElement() {
  chrome.storage.sync.get('chromePageUrlStore', function (items) {
    const { chromePageUrlStore = [] } = items || {};
    const formElWrap = document.createElement('div');
    const classNamePrefix = 'chrome-page-collect-';
    formElWrap.className = classNamePrefix + 'main';
    formElWrap.innerHTML = `
    <div class="${classNamePrefix}item">
      <span class="${classNamePrefix}name">页面名称</span>
      <input name="name" type="text" class="${classNamePrefix}input"/>
    </div>
    <div class="${classNamePrefix}item">
      <span class="${classNamePrefix}name">标签</span>
      <input name="tag" type="text" class="${classNamePrefix}input"/>
    </div>
    <div class="${classNamePrefix}item">
      <span class="${classNamePrefix}name">地址</span>
      <input name="url" type="text" class="${classNamePrefix}input"/>
    </div>
    <div class="${classNamePrefix}item">
      <span class="${classNamePrefix}name">简介</span>
      <textarea name="remark" type="text" class="${classNamePrefix}text"></textarea>
    </div>
    <div class="${classNamePrefix}button">
      <button id="submit">收藏</button>
      <button id="cancel">取消</button>
    </div>
  `;
    document.body.appendChild(formElWrap);
    formElWrap.querySelector('[name="url"]').value = location.href;
    formElWrap.querySelector('[name="name"]').value = document.title;
    formElWrap.querySelector('#submit').addEventListener('click', function () {
      const res = {};
      Array.prototype.forEach.call(
        formElWrap.querySelectorAll('[name]'),
        (el) => {
          const key = el.name;
          const val = el.value;
          res[key] = val;
        }
      );
      console.log(chromePageUrlStore, 'chromePageUrlStore');
      chrome.storage.sync.set(
        { chromePageUrlStore: [...chromePageUrlStore, res] },
        function () {
          console.log('保存成功！');
        }
      );
      formElWrap.remove();
    });
    formElWrap.querySelector('#cancel').addEventListener('click', function () {
      formElWrap.remove();
    });
  });
}
