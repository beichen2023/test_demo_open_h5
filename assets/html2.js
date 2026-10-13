document.querySelector('#pay').addEventListener('click', () => {
  // 在原子窗口内跳转，避免创建第三个窗口。
  window.opener?.postMessage({ type: 'h5-payment-demo', stage: 'paid' }, location.origin);
  location.href = 'html3.html';
});
