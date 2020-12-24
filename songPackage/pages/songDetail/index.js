// pages/songDetail/index.js
import request from "../../../utils/request";
import moment from "moment";
import PubSub from 'pubsub-js' // 页面通信
// 全局记录状态
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicId: '',
    song: {},
    isPlay: false,
    musicId: '',
    musicLink: '',
    currentTime: '00:00',
    durationTime: '00:00',
    currentWidth: 0
  },

  async getDetail(musicId) {
    let result = await request('/song/detail', {ids: musicId})
    let durationTime = moment(result.songs[0].dt).format("mm:ss")
    this.setData({
      song: result.songs[0],
      durationTime
    })

    // 动态标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },

  handleMusicPlay() {
    const isPlay = !this.data.isPlay
    const { musicId, musicLink } = this.data
    // 真正的音乐是另一个接口地址
    this.musicControl(isPlay, musicId, musicLink)
  },

  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) {
      if (!musicLink) {
        let musicData = await request('/song/url', {id: musicId})
        musicLink = musicData.data[0].url
        // 加载音乐必须字段 url 和title
        this.backgroundAudioManager.title = this.data.song.name
        this.backgroundAudioManager.src = musicLink
      }
    } else {
      this.backgroundAudioManager.pause()
    }
  },

  changePlayState(isPlay) {
    this.setData({
      isPlay
    })
    // 全局的状态
    appInstance.globalData.isMusicPlay = isPlay
  },

  handleSwitch(event) {
    let type = event.currentTarget.id
    console.log(type)
    // 关系当前的音乐
    this.backgroundAudioManager.stop()
    // 这里管切换了，但onload是自动播放的有重复，因为切换和自动播放不触发???
    PubSub.subscribe('musicIdFn', (msg, musicId) => {
      console.log('订阅的music', musicId)
      this.getDetail(musicId)
      this.musicControl(true, musicId)
      // PubSub没有销毁过会有记录，在这里清除一下事件
      PubSub.unsubscribe('musicIdFn')
    })
    // 发布当前的信息给列表页
    PubSub.publish('switchType', type)

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { musicId } = options
    this.setData({
      musicId
    })
    this.getDetail(musicId)
    // console.log(appInstance.globalData)
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      this.setData({
        isPlay: true
      })
    }

    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true)
      appInstance.globalData.musicId = musicId
    })
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onEnded(() => {
      // 切换下一首准备
      console.log('auto next')
      PubSub.publish('switchType', 'next')
      this.setData({
        currentTime: '00:00',
        currentWidth: 0
      })
    })
    this.backgroundAudioManager.onTimeUpdate(() => {
      // 播放进度 和播放时间
      let {currentTime, duration} = this.backgroundAudioManager
      const musicCurrentTime = moment(currentTime * 1000).format("mm:ss")
      const currentWidth = currentTime / duration * 450
      this.setData({
        currentTime: musicCurrentTime,
        currentWidth
      })
    })
    // 订阅信息
    PubSub.subscribe('musicIdFn', (msg, musicId) => {
      console.log('订阅的music', musicId)
      this.getDetail(musicId)
      this.musicControl(true, musicId)
      // PubSub没有销毁过会有记录，在这里清除一下事件
      PubSub.unsubscribe('musicIdFn')
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