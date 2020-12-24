// pages/recommendSong/index.js
import request from '../../../utils/request'
import PubSub from 'pubsub-js' // 页面通信
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: [],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkLogin()
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    this.getRecommendList()

    // 通信detail页面 msg订阅的名称，type数据
    PubSub.subscribe('switchType', (msg, type) => {
      console.log(msg, type)
      let {recommendList, index} = this.data
      if (type === 'pre') {
        (index === 0) && (index = recommendList.length)
        index -= 1
      } else {
        (index === recommendList.length -1) && (index = -1)
        index += 1
      }
      this.setData({
        index
      })
      let musicId = recommendList[index].id
      console.log(musicId, index)
      // 发布给detail页面
      PubSub.publish('musicIdFn', musicId)
    })
  },

  checkLogin () {
    // 登录与否
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          wx.reLaunch({
            url: '/pages/login/index',
          })
        }
      })
    }
  },

  async getRecommendList () {
    let recommendListData = await request('/recommend/songs')
    this.setData({
      recommendList: recommendListData.recommend
    })
  },

  toSongDetail(event) {
    const {song, index} = event.currentTarget.dataset
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/songPackage/pages/songDetail/index?musicId=' + song.id
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