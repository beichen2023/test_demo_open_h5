const countdown = document.querySelector('#countdown');
const status = document.querySelector('#status');
const deadline = Date.now() + 3000;

function notify(stage) {
  window.opener?.postMessage({ type: 'h5-payment-demo', stage }, location.origin);
}

notify('ready');
const ticker = window.setInterval(() => {
  countdown.textContent = String(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
}, 100);

window.setTimeout(() => {
  window.clearInterval(ticker);
  countdown.textContent = '0';
  status.textContent = '正在尝试关闭当前子窗口…';
  notify('closing');
  // 保留真实关闭行为，关闭失败时留在 HTML3 展示实测结果。
  window.close();
  window.setTimeout(() => {
    status.textContent = '自动关闭未成功，此页面仍然打开。';
    document.querySelector('#blocked').hidden = false;
    notify('blocked');
  }, 600);
}, 3000);
