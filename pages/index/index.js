// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '初始化测试数据',
    userInfo: {}
  },

  /**
   * methods 
   */
  handleParent() {
    console.log('parent')
  },
  handleChild() {
    console.log('child')
  },
  handleGetUserInfo(res) {
    console.log(res)
    if (res.detail.userInfo) {
      this.setData({
        userInfo: res.detail.userInfo
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.msg)
    this.setData({
      msg: '修改之后的数据'
    })

    // 授权以后获取用户信息
    wx.getUserInfo({
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo
        })
      },
      fail(err){
        console.log(err)
      }
    })

    // 数据劫持的原理
    let sourceData = {
      name: 'jim',
      age: 12
    }
    let currentData = {}
    for (const key in sourceData) {
      if (sourceData.hasOwnProperty(key)) {
        Object.defineProperty(currentData, key, {
          get() {
            return sourceData[key]
          },
          set(newVal) {
            // 不能直接替换当前的值，会死循环
            // 通过迂回的方式
            sourceData[key] = newVal
            console.log(sourceData)
          }
        })
      }
    }
    currentData.age = 13
    console.log(currentData.age)
    // 数据劫持---end
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