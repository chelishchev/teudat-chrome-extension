const s = document.createElement('script')
s.src = chrome.runtime.getURL('dist/page-worker.bundle.js')
s.onload = async function () {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);
document.documentElement.dataset.gifPath = chrome.runtime.getURL('images/process.gif');