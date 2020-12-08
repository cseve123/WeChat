// pages/video/index.js
import request from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: '',
    videoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupListData()
    // 只执行一次都是异步拿不到videoList
  },

  async getVideoGroupListData() {
    let videoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id
    })
    // 这里可以拿到
    this.getVideoList(this.data.navId)
  },

  async getVideoList (navId) {
    let videoListData = await request('/video/group', {id: navId})
    let index = 0
    let result = videoListData.datas.map(item => {
      item.id = index++
      return item
    })
    this.setData({
      videoList: result
    })
  },

  changeNav(event) {
    // let navId = event.currentTarget.id // 会将数字变成字符
    let navId = event.currentTarget.dataset.id
    this.setData({
      navId: navId
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