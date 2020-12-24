// pages/search/index.js
import request from "../../utils/request";
let isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '',
    hotList: [],
    searchContent: '',
    searchList: [],
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData()
    this.getHistoryList()
  },

  async getInitData () {
    let placeholderData = await request('/search/default')
    let hotListData = await request('/search/hot/detail')
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hotListData.data
    })
  },

  async getSearchList () {
    if (!this.data.searchContent) {
      this.setData({
        searchList: []
      })
      return
    }
    let {searchContent, historyList} = this.data
    let searchListData = await request('/search', {keywords: searchContent, limit: 10})
    this.setData({
      searchList: searchListData.result.songs
    })

    // 记录关键字
    if (historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    historyList.unshift(searchContent)
    this.setData({
      historyList
    })
    wx.setStorageSync('searchHistory', historyList)
  },

  getHistoryList () {
    let historyList = wx.getStorageSync('searchHistory')
    if (historyList) {
      this.setData({
        historyList
      })
    }
  },

  handleInputChange (event) {
    this.setData({
      searchContent: event.detail.value.trim()
    })
    // 节流每隔多少时间触发一次 防抖是停止多少时间触发一次
    if (isSend) {
      return
    }
    isSend = true
    this.getSearchList()
    setTimeout(()=> {
      isSend = false
    }, 300)
  },

  clearSearchContent() {
    this.setData({
      searchContent: '',
      searchList: []
    })
  },

  deleteSearchHistory() {
    wx.showModal({
      content: '确认删除',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            historyList: []
          })
          wx.removeStorageSync('searchHistory')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})