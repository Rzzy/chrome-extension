init();
function init() {
  chrome.storage.sync.get('chromePageUrlStore', function (items) {
    const { chromePageUrlStore = [] } = items || {};
    const pagesObj = {};
    console.log(chromePageUrlStore, items, 'chromePageUrlStore');
    chromePageUrlStore.forEach((element) => {
      const { tag = '公共' } = element;
      if (!pagesObj[tag]) {
        pagesObj[tag] = [];
      }
      pagesObj[tag].push(element);
    });
    generateUrlList(pagesObj, chromePageUrlStore);
  });
}

function generateUrlList(data, chromePageUrlStore) {
  const tags = Object.keys(data);
  const wrap = document.createElement('div');
  const list = tags
    .map((tag) => {
      const pages = data[tag] || [];
      const elStr = `
      <h2>${tag}</h2>
      ${pages
        .map((page) => {
          const { name, url, remark } = page;
          return `
          <div class="page-item">
            <a href="${url}" target="_blank">${name}</a>
            <p>${remark}</p>
            <a href="javascript:void(0)" data-url="${url}">删除</a>
          </div>
          `;
        })
        .join(' ')}
      `;
      return elStr;
    })
    .join(' ');
  wrap.innerHTML = list;
  wrap.addEventListener('click', function (e) {
    const target = e.target;

    console.log(e);
    if (target.innerText === '删除') {
      const { url } = target.dataset;
      const newChromePageUrlStore = chromePageUrlStore.filter((el) => {
        return el.url !== url;
      });
      chrome.storage.sync.set(
        { chromePageUrlStore: [...newChromePageUrlStore] },
        function () {
          wrap.remove();
          init();
          console.log('删除成功！');
        }
      );
    }
  });
  document.querySelector('.page-list').appendChild(wrap);
}
