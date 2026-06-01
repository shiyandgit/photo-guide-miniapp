const showLoading = (title = '加载中...') => {
  wx.showLoading({ title, mask: true })
}

const hideLoading = () => {
  wx.hideLoading()
}

const showSuccess = (title) => {
  wx.showToast({ title, icon: 'success' })
}

const showError = (title) => {
  wx.showToast({ title: typeof title === 'string' ? title : '操作失败', icon: 'none' })
}

const formatTime = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

const throttle = (fn, delay = 300) => {
  let timer = null
  return function (...args) {
    if (timer) return
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

module.exports = { showLoading, hideLoading, showSuccess, showError, formatTime, throttle }
