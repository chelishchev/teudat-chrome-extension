const s = document.createElement('script')
s.src = chrome.runtime.getURL('injected.js')
s.onload = async function () {
    this.remove();
};
(document.head || document.documentElement).appendChild(s)