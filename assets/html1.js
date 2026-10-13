const button = document.querySelector('#open-payment');
const status = document.querySelector('#status');
const events = document.querySelector('#events');
let childWindow = null;
let closeWatcher = null;

function record(message) {
  const item = document.createElement('li');
  item.textContent = `${new Date().toLocaleTimeString()} · ${message}`;
  events.append(item);
  status.textContent = message;
}

button.addEventListener('click', () => {
  // 必须在用户点击事件内同步打开，便于手机浏览器识别用户操作。
  childWindow = window.open('html2.html', '_blank');
  if (!childWindow) {
    record('未能打开子窗口，请检查浏览器的弹窗设置后重试。');
    return;
  }
  button.disabled = true;
  record('已打开 HTML2，HTML1 保持在原窗口。');
  closeWatcher = window.setInterval(() => {
    if (childWindow.closed) {
      window.clearInterval(closeWatcher);
      button.disabled = false;
      record('已检测到子窗口关闭。当前是 HTML1，可再次测试。');
      childWindow = null;
    }
  }, 400);
});

window.addEventListener('message', (event) => {
  if (event.origin !== location.origin || event.source !== childWindow) return;
  if (event.data?.type !== 'h5-payment-demo') return;
  const messages = {
    paid: 'HTML2 已模拟支付，正在跳转 HTML3。',
    ready: 'HTML3 已加载，将在 3 秒后尝试关闭。',
    closing: 'HTML3 正在调用 window.close()。',
    blocked: 'HTML3 仍未关闭，请查看手机端提示。',
  };
  if (messages[event.data.stage]) record(messages[event.data.stage]);
});
