// 格式化时间
const formatTime = (date) => {
  if (!date) return '';
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${year}-${padZero(month)}-${padZero(day)} ${padZero(hour)}:${padZero(minute)}`;
};

const padZero = (num) => {
  return num < 10 ? '0' + num : '' + num;
};

// 防抖函数
const debounce = (fn, delay = 500) => {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

// 图片预览
const previewImages = (urls, current) => {
  wx.previewImage({
    current: current || urls[0],
    urls: urls
  });
};

// 显示成功提示
const showSuccess = (title = '操作成功') => {
  wx.showToast({
    title,
    icon: 'success',
    duration: 2000
  });
};

// 显示错误提示
const showError = (title = '操作失败') => {
  wx.showToast({
    title,
    icon: 'none',
    duration: 2000
  });
};

// 显示加载中
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title,
    mask: true
  });
};

// 隐藏加载中
const hideLoading = () => {
  wx.hideLoading();
};

module.exports = {
  formatTime,
  debounce,
  previewImages,
  showSuccess,
  showError,
  showLoading,
  hideLoading
};
