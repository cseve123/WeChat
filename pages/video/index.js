// pages/video/index.js
import request from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: '',
    videoList: [],
    videoId: '',
    videoUpdateTime: [],
    isTriggered: false
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
    wx.hideLoading()
    let index = 0
    let result = videoListData.datas.map(item => {
      item.id = index++
      return item
    })
    this.setData({
      videoList: result,
      isTriggered: false
    })
  },

  changeNav(event) {
    // let navId = event.currentTarget.id // 会将数字变成字符
    let navId = event.currentTarget.dataset.id
    this.setData({
      navId: navId,
      videoList: []
    })
    wx.showLoading({
      title: '正在加载',
    })
    this.getVideoList(this.data.navId)
  },

  handlePlay(event) {
    // 其他在播放的视频暂停
    // 自己播放，重复点击同一个视频可以正常播放
    // 单例模式
    // 需要创建多个对象的场景下，通过一个变量接收，始终保持只有一个对象（this.vid，this.videoContent）
    // 节省内存空间
    const vid = event.currentTarget.id
    // 优化后只有一个视频不需要多个视频切换
    // this.vid !== vid && this.videoContent && this.videoContent.stop()
    // this.vid = vid
    this.setData({
      videoId: vid
    })
    this.videoContent = wx.createVideoContext(vid)
    let { videoUpdateTime } = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vid)
    if (videoItem) {
      this.videoContent.seek(videoItem.currentTime)
    }
    this.videoContent.play()
  },

  handleTimeUpdate(event) {
    const videoTimeObj = {vid: event.currentTarget.id, currentTime: event.detail.currentTime}
    let { videoUpdateTime } = this.data
    let videoItem =  videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if (videoItem) {
      videoItem.currentTime = event.detail.currentTime
    } else {
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime
    })
  },

  handleEnded(event) {
    // 移除记录中的播放时长
    const vid = event.currentTarget.id
    let { videoUpdateTime } = this.data
    const videoUpdateIndex = videoUpdateTime.findIndex(item => item.vid === vid)
    videoUpdateTime.splice(videoUpdateIndex, 1)
    this.setData({
      videoUpdateTime
    })
  },

  handleRefresher () {
    this.getVideoList(this.data.navId)
  },

  handleTolower () {
    console.log('end')
    let { videoList } = this.data
    // 后端的分页加载 || 前端数据截取形式
    const mockList = [{"type":1,"displayed":false,"alg":"onlineHotGroup","extAlg":null,"data":{"alg":"onlineHotGroup","scm":"1.music-video-timeline.video_timeline.video.181017.-295043608","threadId":"R_VI_62_4897A994454F930729FE323DB7D7DEA7","coverUrl":"https://p2.music.126.net/iLa88rwNomAFA8It0vopQA==/109951163086937693.jpg","height":240,"width":426,"title":"他展示了世界上最高的高音，韩红听了却想达打人","description":"他展示了世界上最高的高音，韩红听了却想达打人[大哭]","commentCount":417,"shareCount":866,"resolutions":[{"resolution":240,"size":11282609}],"creator":{"defaultAvatar":false,"province":350000,"authStatus":0,"followed":false,"avatarUrl":"http://p1.music.126.net/HNbDj1i7vlJRADrz8rZS8Q==/109951165166129726.jpg","accountStatus":0,"gender":1,"city":350200,"birthday":752774400000,"userId":68014748,"userType":200,"nickname":"薛定谔的缝纫机","signature":"Vx:Aimosi99 (备注来意）\r感谢你这么皮还关注这么不正经的我。","description":"","detailDescription":"","avatarImgId":109951165166129730,"backgroundImgId":109951165301204910,"backgroundUrl":"http://p1.music.126.net/S2IvqAvWI-7UCD-70wMDzg==/109951165301204916.jpg","authority":0,"mutual":false,"expertTags":["华语","电子","欧美"],"experts":{"1":"音乐视频达人","2":"欧美音乐资讯达人"},"djStatus":0,"vipType":11,"remarkName":null,"avatarImgIdStr":"109951165166129726","backgroundImgIdStr":"109951165301204916","avatarImgId_str":"109951165166129726"},"urlInfo":{"id":"4897A994454F930729FE323DB7D7DEA7","url":"http://vodkgeyttp9.vod.126.net/cloudmusic/10710ced9263e5c7363b1df6a40c96ad.mp4?ts=1608699472&rid=082973D43CCBFF01CBE54E97E7FDF740&rl=3&rs=HwqKNOWBeEYLUAWsSCRLtNFayifEjJrd&sign=10cb2b02aaf5fc160b00236d5d6c34d1&ext=v%2FCflKQMTE0uQAeWX1%2Futb2I8c4L40oAS5pBUq1s4nf1dysl4%2BpKR4Ipvwy%2BHr7LsREO8TIhW0yxWNKi5Nb3PseEtHmpuwf6OO4ViaB7eLRWzHe%2BmtAyT%2FRF7piHiX76Tob5u3bDDjqSgLenJgT2PWypU6egfWKi88H8mgjZr1JpGLMCmDpLyAB%2F6xHn3KEdMtQMbwPukRXV2s2AnRFx2WKBal04eubyGsp9wJWUTNz7skwTJ4Gx5cLH2juxZgVR","size":11282609,"validityTime":1200,"needPay":false,"payInfo":null,"r":240},"videoGroup":[{"id":3101,"name":"综艺","alg":"groupTagRank"},{"id":13222,"name":"华语","alg":"groupTagRank"},{"id":4101,"name":"娱乐","alg":"groupTagRank"},{"id":1100,"name":"音乐现场","alg":"groupTagRank"},{"id":58100,"name":"现场","alg":"groupTagRank"},{"id":5100,"name":"音乐","alg":"groupTagRank"}],"previewUrl":null,"previewDurationms":0,"hasRelatedGameAd":false,"markTypes":[109],"relateSong":[],"relatedInfo":null,"videoUserLiveInfo":null,"vid":"4897A994454F930729FE323DB7D7DEA7","durationms":293355,"playTime":248601,"praisedCount":1448,"praised":false,"subscribed":false}},{"type":1,"displayed":false,"alg":"onlineHotGroup","extAlg":null,"data":{"alg":"onlineHotGroup","scm":"1.music-video-timeline.video_timeline.video.181017.-295043608","threadId":"R_VI_62_11B4EDF878959651265F24BD430328A8","coverUrl":"https://p2.music.126.net/effdRe5iX35XTjphKbMDxQ==/109951163572742978.jpg","height":1080,"width":1920,"title":"让一首《加州旅馆》告诉你，老鹰乐队墨尔本告别演唱会有多经典","description":"《加州旅馆》（Hotel California）是美国著名乡村摇滚乐队老鹰乐队（Eagles）的歌曲，由乐队鼓手Don Henley担任主唱，单曲发行于1977年2月22日，收录在乐队第五张录音室同名专辑《加州旅馆》中。","commentCount":3394,"shareCount":26054,"resolutions":[{"resolution":240,"size":23602676},{"resolution":480,"size":50411609},{"resolution":720,"size":85397389},{"resolution":1080,"size":209726307}],"creator":{"defaultAvatar":false,"province":430000,"authStatus":0,"followed":false,"avatarUrl":"http://p1.music.126.net/uEINwsYm7ypsvRYt5kt8tA==/109951163076614388.jpg","accountStatus":0,"gender":1,"city":430700,"birthday":-2209017600000,"userId":290223760,"userType":0,"nickname":"停车坐爱枫林晚_-","signature":"","description":"","detailDescription":"","avatarImgId":109951163076614380,"backgroundImgId":109951163377134420,"backgroundUrl":"http://p1.music.126.net/zwDIqJCcjeyuTwqGZpOWlw==/109951163377134411.jpg","authority":0,"mutual":false,"expertTags":null,"experts":null,"djStatus":0,"vipType":0,"remarkName":null,"avatarImgIdStr":"109951163076614388","backgroundImgIdStr":"109951163377134411","avatarImgId_str":"109951163076614388"},"urlInfo":{"id":"11B4EDF878959651265F24BD430328A8","url":"http://vodkgeyttp9.vod.126.net/cloudmusic/36bc4e4d99c8e25a6ec9660368189154.mp4?ts=1608699472&rid=082973D43CCBFF01CBE54E97E7FDF740&rl=3&rs=xJbRxWLIxdCGIMNGlqrERAelReTGFoqd&sign=83e8a86421f419a3f11dbd37389eab64&ext=v%2FCflKQMTE0uQAeWX1%2Futb2I8c4L40oAS5pBUq1s4nf1dysl4%2BpKR4Ipvwy%2BHr7LsREO8TIhW0yxWNKi5Nb3PseEtHmpuwf6OO4ViaB7eLRWzHe%2BmtAyT%2FRF7piHiX76Tob5u3bDDjqSgLenJgT2PWypU6egfWKi88H8mgjZr1JpGLMCmDpLyAB%2F6xHn3KEdMtQMbwPukRXV2s2AnRFx2WKBal04eubyGsp9wJWUTNz7skwTJ4Gx5cLH2juxZgVR","size":209726307,"validityTime":1200,"needPay":false,"payInfo":null,"r":1080},"videoGroup":[{"id":4105,"name":"摇滚","alg":"groupTagRank"},{"id":14137,"name":"感动","alg":"groupTagRank"},{"id":16131,"name":"英文","alg":"groupTagRank"},{"id":24134,"name":"弹唱","alg":"groupTagRank"},{"id":1100,"name":"音乐现场","alg":"groupTagRank"},{"id":58100,"name":"现场","alg":"groupTagRank"},{"id":5100,"name":"音乐","alg":"groupTagRank"}],"previewUrl":null,"previewDurationms":0,"hasRelatedGameAd":false,"markTypes":null,"relateSong":[{"name":"Hotel California","id":5264843,"pst":0,"t":0,"ar":[{"id":91725,"name":"Eagles","tns":[],"alias":[]}],"alia":["加州旅馆"],"pop":100,"st":0,"rt":"","fee":8,"v":680,"crbt":null,"cf":"","al":{"id":512635,"name":"惠威T200A试音碟","picUrl":"http://p4.music.126.net/uAT4CcsZdcAYs-CS0hr-0w==/93458488378219.jpg","tns":[],"pic":93458488378219},"dt":258026,"h":{"br":320000,"fid":0,"size":10323635,"vd":-2},"m":{"br":192000,"fid":0,"size":6194198,"vd":-2},"l":{"br":128000,"fid":0,"size":4129479,"vd":-2},"a":null,"cd":"1","no":8,"rtUrl":null,"ftype":0,"rtUrls":[],"djId":0,"copyright":1,"s_id":0,"rtype":0,"rurl":null,"mst":9,"cp":405025,"mv":0,"publishTime":1104508800007,"privilege":{"id":5264843,"fee":8,"payed":0,"st":0,"pl":128000,"dl":0,"sp":7,"cp":1,"subp":1,"cs":false,"maxbr":999000,"fl":128000,"toast":false,"flag":256,"preSell":false}}],"relatedInfo":null,"videoUserLiveInfo":null,"vid":"11B4EDF878959651265F24BD430328A8","durationms":519147,"playTime":6172140,"praisedCount":47521,"praised":false,"subscribed":false}},{"type":1,"displayed":false,"alg":"onlineHotGroup","extAlg":null,"data":{"alg":"onlineHotGroup","scm":"1.music-video-timeline.video_timeline.video.181017.-295043608","threadId":"R_VI_62_53D9C435061172456538DEC89D0708C0","coverUrl":"https://p2.music.126.net/VqC0rbDzlynWantt8TzXZw==/109951164022174371.jpg","height":1080,"width":1920,"title":"BLACKPINK 美国科切拉音乐节第二场 Whistle","description":"20190420 BLACKPINK 美国科切拉音乐节第二场 Coachella day2 Whistle","commentCount":747,"shareCount":1879,"resolutions":[{"resolution":240,"size":29673579},{"resolution":480,"size":46073045},{"resolution":720,"size":65019917},{"resolution":1080,"size":94500767}],"creator":{"defaultAvatar":true,"province":1000000,"authStatus":0,"followed":false,"avatarUrl":"http://p1.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg","accountStatus":0,"gender":1,"city":1010000,"birthday":631202975999,"userId":85203994,"userType":0,"nickname":"用户85203994","signature":"","description":"","detailDescription":"","avatarImgId":18686200114669624,"backgroundImgId":109951162868126480,"backgroundUrl":"http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg","authority":0,"mutual":false,"expertTags":null,"experts":null,"djStatus":10,"vipType":0,"remarkName":null,"avatarImgIdStr":"18686200114669622","backgroundImgIdStr":"109951162868126486","avatarImgId_str":"18686200114669622"},"urlInfo":{"id":"53D9C435061172456538DEC89D0708C0","url":"http://vodkgeyttp9.vod.126.net/vodkgeyttp8/lnx0OBuP_2457736496_uhd.mp4?ts=1608699472&rid=082973D43CCBFF01CBE54E97E7FDF740&rl=3&rs=GhQzJHCQDEbKymySurznixXpJZdZEtaw&sign=cd947a28cf282f031eb6d75fe9d1a01a&ext=v%2FCflKQMTE0uQAeWX1%2Futb2I8c4L40oAS5pBUq1s4nf1dysl4%2BpKR4Ipvwy%2BHr7LsREO8TIhW0yxWNKi5Nb3PseEtHmpuwf6OO4ViaB7eLRWzHe%2BmtAyT%2FRF7piHiX76Tob5u3bDDjqSgLenJgT2PWypU6egfWKi88H8mgjZr1JpGLMCmDpLyAB%2F6xHn3KEdMtQMbwPukRXV2s2AnRFx2WKBal04eubyGsp9wJWUTNz7skwTJ4Gx5cLH2juxZgVR","size":94500767,"validityTime":1200,"needPay":false,"payInfo":null,"r":1080},"videoGroup":[{"id":92105,"name":"BLACKPINK","alg":"groupTagRank"},{"id":57107,"name":"韩语现场","alg":"groupTagRank"},{"id":59108,"name":"巡演现场","alg":"groupTagRank"},{"id":57108,"name":"流行现场","alg":"groupTagRank"},{"id":1101,"name":"舞蹈","alg":"groupTagRank"},{"id":1100,"name":"音乐现场","alg":"groupTagRank"},{"id":58100,"name":"现场","alg":"groupTagRank"},{"id":5100,"name":"音乐","alg":"groupTagRank"}],"previewUrl":null,"previewDurationms":0,"hasRelatedGameAd":false,"markTypes":null,"relateSong":[],"relatedInfo":null,"videoUserLiveInfo":null,"vid":"53D9C435061172456538DEC89D0708C0","durationms":218268,"playTime":2556133,"praisedCount":22430,"praised":false,"subscribed":false}},{"type":1,"displayed":false,"alg":"onlineHotGroup","extAlg":null,"data":{"alg":"onlineHotGroup","scm":"1.music-video-timeline.video_timeline.video.181017.-295043608","threadId":"R_VI_62_695194266273BB0596388FB208D57C7B","coverUrl":"https://p2.music.126.net/WlU1HZYmXrhPHVtEBR8JzQ==/109951164145423573.jpg","height":1080,"width":1920,"title":"水桶腰和大粗腿又来了","description":"","commentCount":1073,"shareCount":108,"resolutions":[{"resolution":240,"size":46602407},{"resolution":480,"size":58642816},{"resolution":720,"size":104391885},{"resolution":1080,"size":135232928}],"creator":{"defaultAvatar":false,"province":1000000,"authStatus":0,"followed":false,"avatarUrl":"http://p1.music.126.net/Sb2Vpw5Moq37KTirZQ0bNQ==/18497084116244881.jpg","accountStatus":0,"gender":1,"city":1002000,"birthday":-2209017600000,"userId":474289498,"userType":0,"nickname":"狗狗狗狗狗狗狗猫","signature":"我的沉默就是猫猫的沉默，咪咪而喵喵","description":"","detailDescription":"","avatarImgId":18497084116244880,"backgroundImgId":18905002928531110,"backgroundUrl":"http://p1.music.126.net/OhwUHB-Xb5mu20ov_7NnwQ==/18905002928531111.jpg","authority":0,"mutual":false,"expertTags":null,"experts":null,"djStatus":0,"vipType":0,"remarkName":null,"avatarImgIdStr":"18497084116244881","backgroundImgIdStr":"18905002928531111","avatarImgId_str":"18497084116244881"},"urlInfo":{"id":"695194266273BB0596388FB208D57C7B","url":"http://vodkgeyttp9.vod.126.net/vodkgeyttp8/c6wBdbVM_2546807864_uhd.mp4?ts=1608699472&rid=082973D43CCBFF01CBE54E97E7FDF740&rl=3&rs=ZwTgScJbAaflIzjLrCnxtsVdWHmWiyCu&sign=cd02c7897944471f52ed9bb8ef1ab579&ext=v%2FCflKQMTE0uQAeWX1%2Futb2I8c4L40oAS5pBUq1s4nf1dysl4%2BpKR4Ipvwy%2BHr7LsREO8TIhW0yxWNKi5Nb3PseEtHmpuwf6OO4ViaB7eLRWzHe%2BmtAyT%2FRF7piHiX76Tob5u3bDDjqSgLenJgT2PWypU6egfWKi88H8mgjZr1JpGLMCmDpLyAB%2F6xHn3KEdMtQMbwPukRXV2s2AnRFx2WKBal04eubyGsp9wJWUTNz7skwTJ4Gx5cLH2juxZgVR","size":135232928,"validityTime":1200,"needPay":false,"payInfo":null,"r":1080},"videoGroup":[{"id":64100,"name":"Taylor Swift","alg":"groupTagRank"},{"id":9102,"name":"演唱会","alg":"groupTagRank"},{"id":57106,"name":"欧美现场","alg":"groupTagRank"},{"id":57108,"name":"流行现场","alg":"groupTagRank"},{"id":1100,"name":"音乐现场","alg":"groupTagRank"},{"id":58100,"name":"现场","alg":"groupTagRank"},{"id":5100,"name":"音乐","alg":"groupTagRank"}],"previewUrl":null,"previewDurationms":0,"hasRelatedGameAd":false,"markTypes":null,"relateSong":[],"relatedInfo":null,"videoUserLiveInfo":null,"vid":"695194266273BB0596388FB208D57C7B","durationms":187432,"playTime":841829,"praisedCount":2674,"praised":false,"subscribed":false}},{"type":1,"displayed":false,"alg":"onlineHotGroup","extAlg":null,"data":{"alg":"onlineHotGroup","scm":"1.music-video-timeline.video_timeline.video.181017.-295043608","threadId":"R_VI_62_D187D431EE3CB3298C9CFD1BFBD2CD1E","coverUrl":"https://p2.music.126.net/YkRuYxTqq8iJCdtnS2-R7g==/109951165085405693.jpg","height":1080,"width":1920,"title":"Bilimen Seni 我知道是你","description":"歌名：Bilimen Seni 我知道是你\n作曲：Ablikim Ablet\n作词：Muhemmedjan Rashidin\n编曲：Ablikim Ablet/Muratjan Muhter\n这首歌曲是艾力·阿克苏巴（eliaqsopa) 的“Wedimiz Wede”个人演唱会受到大众喜爱的个人原创曲目之一，希望大家能够喜欢，记得关注点个赞，谢谢\nYahturghan Doslaga Rehmat[爱心]","commentCount":23,"shareCount":976,"resolutions":[{"resolution":240,"size":43325064},{"resolution":480,"size":73369392},{"resolution":720,"size":110820351},{"resolution":1080,"size":209333314}],"creator":{"defaultAvatar":false,"province":650000,"authStatus":1,"followed":false,"avatarUrl":"http://p1.music.126.net/iswPs3oFq9Lnrau1y39H1Q==/109951165463595200.jpg","accountStatus":0,"gender":1,"city":650100,"birthday":357408000000,"userId":32062825,"userType":4,"nickname":"eliaqsopa","signature":"网易音乐人，原创歌手，录音师，混音师艾力·阿克苏巴(eliaqsopa)(Alijan Aksopa)（eliajan Aqsopa)","description":"音乐人","detailDescription":"音乐人","avatarImgId":109951165463595200,"backgroundImgId":1418370010010632,"backgroundUrl":"http://p1.music.126.net/XSW4hphP3omHmvkpxSBeWA==/1418370010010632.jpg","authority":0,"mutual":false,"expertTags":["民族","流行"],"experts":{"1":"音乐原创视频达人"},"djStatus":10,"vipType":11,"remarkName":null,"avatarImgIdStr":"109951165463595200","backgroundImgIdStr":"1418370010010632","avatarImgId_str":"109951165463595200"},"urlInfo":{"id":"D187D431EE3CB3298C9CFD1BFBD2CD1E","url":"http://vodkgeyttp9.vod.126.net/vodkgeyttp8/jMiq24fj_3039152130_uhd.mp4?ts=1608699472&rid=082973D43CCBFF01CBE54E97E7FDF740&rl=3&rs=sZhLBDhCnKPtNTPllqgKxnDGyXJNXvXy&sign=cd5ad1f68bd1cccdfcf77d568eadf483&ext=v%2FCflKQMTE0uQAeWX1%2Futb2I8c4L40oAS5pBUq1s4nf1dysl4%2BpKR4Ipvwy%2BHr7LsREO8TIhW0yxWNKi5Nb3PseEtHmpuwf6OO4ViaB7eLRWzHe%2BmtAyT%2FRF7piHiX76Tob5u3bDDjqSgLenJgT2PWypU6egfWKi88H8mgjZr1JpGLMCmDpLyAB%2F6xHn3KEdMtQMbwPukRXV2s2AnRFx2WKBal04eubyGsp9wJWUTNz7skwTJ4Gx5cLH2juxZgVR","size":209333314,"validityTime":1200,"needPay":false,"payInfo":null,"r":1080},"videoGroup":[{"id":25137,"name":"音乐资讯","alg":"groupTagRank"},{"id":59108,"name":"巡演现场","alg":"groupTagRank"},{"id":23116,"name":"音乐推荐","alg":"groupTagRank"},{"id":1100,"name":"音乐现场","alg":"groupTagRank"},{"id":58100,"name":"现场","alg":"groupTagRank"},{"id":5100,"name":"音乐","alg":"groupTagRank"}],"previewUrl":null,"previewDurationms":0,"hasRelatedGameAd":false,"markTypes":null,"relateSong":[{"name":"Bilimen Seni/我知道是你","id":502679150,"pst":0,"t":0,"ar":[{"id":1039899,"name":"eliaqsopa","tns":[],"alias":[]}],"alia":[],"pop":60,"st":0,"rt":null,"fee":8,"v":27,"crbt":null,"cf":"","al":{"id":35677152,"name":"Wedimiz Wede（一言为定）","picUrl":"http://p3.music.126.net/UOCBPtIMHZcfhGJpcdwZJA==/109951162958507801.jpg","tns":[],"pic_str":"109951162958507801","pic":109951162958507800},"dt":269347,"h":{"br":320000,"fid":0,"size":10776076,"vd":-2500},"m":{"br":192000,"fid":0,"size":6465663,"vd":-2},"l":{"br":128000,"fid":0,"size":4310457,"vd":-2},"a":null,"cd":"01","no":2,"rtUrl":null,"ftype":0,"rtUrls":[],"djId":0,"copyright":2,"s_id":0,"rtype":0,"rurl":null,"mst":9,"cp":0,"mv":5647432,"publishTime":1494784800000,"privilege":{"id":502679150,"fee":8,"payed":0,"st":0,"pl":128000,"dl":0,"sp":7,"cp":1,"subp":1,"cs":false,"maxbr":999000,"fl":128000,"toast":false,"flag":66,"preSell":false}},{"name":"Anam Hayat/母亲健在","id":486960105,"pst":0,"t":0,"ar":[{"id":1039899,"name":"eliaqsopa","tns":[],"alias":[]}],"alia":[],"pop":95,"st":0,"rt":null,"fee":8,"v":34,"crbt":null,"cf":"","al":{"id":35677152,"name":"Wedimiz Wede（一言为定）","picUrl":"http://p4.music.126.net/UOCBPtIMHZcfhGJpcdwZJA==/109951162958507801.jpg","tns":[],"pic_str":"109951162958507801","pic":109951162958507800},"dt":250975,"h":{"br":320000,"fid":0,"size":10041513,"vd":-20600},"m":{"br":192000,"fid":0,"size":6024925,"vd":-18200},"l":{"br":128000,"fid":0,"size":4016631,"vd":-16600},"a":null,"cd":"01","no":5,"rtUrl":null,"ftype":0,"rtUrls":[],"djId":0,"copyright":2,"s_id":0,"rtype":0,"rurl":null,"mst":9,"cp":0,"mv":10964149,"publishTime":1494784800000,"privilege":{"id":486960105,"fee":8,"payed":0,"st":0,"pl":128000,"dl":0,"sp":7,"cp":1,"subp":1,"cs":false,"maxbr":999000,"fl":128000,"toast":false,"flag":66,"preSell":false}},{"name":"Gul Aghach Kelmepsegn","id":29795742,"pst":0,"t":0,"ar":[{"id":1039899,"name":"eliaqsopa","tns":[],"alias":[]}],"alia":[],"pop":100,"st":0,"rt":null,"fee":8,"v":24,"crbt":null,"cf":"","al":{"id":3077763,"name":"Muhebbet Sorap/寻爱之路","picUrl":"http://p4.music.126.net/oooYHAXVe2OAiGu2CkzuEg==/2543170397227264.jpg","tns":[],"pic":2543170397227264},"dt":292800,"h":{"br":320000,"fid":0,"size":11714395,"vd":-2},"m":{"br":192000,"fid":0,"size":7028654,"vd":-2},"l":{"br":128000,"fid":0,"size":4685784,"vd":-2},"a":null,"cd":"01","no":21,"rtUrl":null,"ftype":0,"rtUrls":[],"djId":0,"copyright":2,"s_id":0,"rtype":0,"rurl":null,"mst":9,"cp":0,"mv":0,"publishTime":1342022400000,"privilege":{"id":29795742,"fee":8,"payed":0,"st":0,"pl":128000,"dl":0,"sp":7,"cp":1,"subp":1,"cs":false,"maxbr":999000,"fl":128000,"toast":false,"flag":66,"preSell":false}}],"relatedInfo":null,"videoUserLiveInfo":null,"vid":"D187D431EE3CB3298C9CFD1BFBD2CD1E","durationms":308800,"playTime":511629,"praisedCount":1446,"praised":false,"subscribed":false}},{"type":1,"displayed":false,"alg":"onlineHotGroup","extAlg":null,"data":{"alg":"onlineHotGroup","scm":"1.music-video-timeline.video_timeline.video.181017.-295043608","threadId":"R_VI_62_8D0B8C21C2F26F6763A57468790DF80F","coverUrl":"https://p2.music.126.net/HFGq8327AES57GIY9dILGg==/109951164320400233.jpg","height":720,"width":1280,"title":"澳洲好声音史上最快转身！一开口就全体跪！","description":"19岁的妹子让导师开口跪","commentCount":94,"shareCount":134,"resolutions":[{"resolution":240,"size":14003663},{"resolution":480,"size":23392415},{"resolution":720,"size":36852058}],"creator":{"defaultAvatar":false,"province":500000,"authStatus":0,"followed":false,"avatarUrl":"http://p1.music.126.net/73Z6KlAmUBaxLbom7mDtLQ==/3384296799092394.jpg","accountStatus":0,"gender":2,"city":500101,"birthday":-2209017600000,"userId":136066637,"userType":0,"nickname":"喵呜字幕组","signature":"Music With Attitude微博@喵呜字幕组，微信公众号：miaowusub","description":"","detailDescription":"","avatarImgId":3384296799092394,"backgroundImgId":2002210674180201,"backgroundUrl":"http://p1.music.126.net/o3G7lWrGBQAvSRt3UuApTw==/2002210674180201.jpg","authority":0,"mutual":false,"expertTags":null,"experts":null,"djStatus":0,"vipType":11,"remarkName":null,"avatarImgIdStr":"3384296799092394","backgroundImgIdStr":"2002210674180201"},"urlInfo":{"id":"8D0B8C21C2F26F6763A57468790DF80F","url":"http://vodkgeyttp9.vod.126.net/vodkgeyttp8/xpTjcYcK_2658156800_shd.mp4?ts=1608699472&rid=082973D43CCBFF01CBE54E97E7FDF740&rl=3&rs=QKPidmbqejbkvGvUpHJPwDboEkLaKdAv&sign=ece8dea8989b038e931c836304b4dd62&ext=v%2FCflKQMTE0uQAeWX1%2Futb2I8c4L40oAS5pBUq1s4nf1dysl4%2BpKR4Ipvwy%2BHr7LsREO8TIhW0yxWNKi5Nb3PseEtHmpuwf6OO4ViaB7eLRWzHe%2BmtAyT%2FRF7piHiX76Tob5u3bDDjqSgLenJgT2PWypU6egfWKi88H8mgjZr1JpGLMCmDpLyAB%2F6xHn3KEdMtQMbwPukRXV2s2AnRFx2WKBal04eubyGsp9wJWUTNz7skwTJ4Gx5cLH2juxZgVR","size":36852058,"validityTime":1200,"needPay":false,"payInfo":null,"r":720},"videoGroup":[{"id":3101,"name":"综艺","alg":"groupTagRank"},{"id":4101,"name":"娱乐","alg":"groupTagRank"},{"id":1100,"name":"音乐现场","alg":"groupTagRank"},{"id":58100,"name":"现场","alg":"groupTagRank"},{"id":5100,"name":"音乐","alg":"groupTagRank"}],"previewUrl":null,"previewDurationms":0,"hasRelatedGameAd":false,"markTypes":null,"relateSong":[{"name":"It's A Man's Man's Man's World","id":21615771,"pst":0,"t":0,"ar":[{"id":42949,"name":"Seal","tns":[],"alias":[]}],"alia":[],"pop":95,"st":0,"rt":"","fee":1,"v":11,"crbt":null,"cf":"","al":{"id":1991341,"name":"Hits","picUrl":"http://p4.music.126.net/iJ-6GYmu_KjdrQsUtSMHBQ==/690493302254289.jpg","tns":[],"pic":690493302254289},"dt":231000,"h":{"br":320000,"fid":0,"size":9274615,"vd":-23200},"m":{"br":192000,"fid":0,"size":5564809,"vd":-20700},"l":{"br":128000,"fid":0,"size":3709906,"vd":-19100},"a":null,"cd":"1","no":32,"rtUrl":null,"ftype":0,"rtUrls":[],"djId":0,"copyright":1,"s_id":0,"rtype":0,"rurl":null,"mst":9,"cp":7002,"mv":0,"publishTime":1282579200000,"privilege":{"id":21615771,"fee":1,"payed":0,"st":0,"pl":0,"dl":0,"sp":0,"cp":0,"subp":0,"cs":false,"maxbr":320000,"fl":0,"toast":false,"flag":1028,"preSell":false}}],"relatedInfo":null,"videoUserLiveInfo":null,"vid":"8D0B8C21C2F26F6763A57468790DF80F","durationms":117805,"playTime":460633,"praisedCount":2214,"praised":false,"subscribed":false}},{"type":1,"displayed":false,"alg":"onlineHotGroup","extAlg":null,"data":{"alg":"onlineHotGroup","scm":"1.music-video-timeline.video_timeline.video.181017.-295043608","threadId":"R_VI_62_C5D2CD3C629DD39CE3E482802D910FDE","coverUrl":"https://p2.music.126.net/uzTKtOC04KuXkIPiejYIZw==/109951164882974610.jpg","height":1080,"width":1920,"title":"宋茜现场版《屋顶着火》，不愧是女团出身舞台掌控力一流","description":"宋茜现场版《屋顶着火》，不愧是女团出身舞台掌控力一流","commentCount":89,"shareCount":160,"resolutions":[{"resolution":240,"size":21872023},{"resolution":480,"size":36910197},{"resolution":720,"size":52731790},{"resolution":1080,"size":96791510}],"creator":{"defaultAvatar":false,"province":440000,"authStatus":0,"followed":false,"avatarUrl":"http://p1.music.126.net/WbQbH2nMF8_30bj-wH92vg==/109951164781511113.jpg","accountStatus":0,"gender":0,"city":445200,"birthday":-2209017600000,"userId":3247598879,"userType":0,"nickname":"一起爱上好音乐","signature":"","description":"","detailDescription":"","avatarImgId":109951164781511120,"backgroundImgId":109951162868128400,"backgroundUrl":"http://p1.music.126.net/2zSNIqTcpHL2jIvU6hG0EA==/109951162868128395.jpg","authority":0,"mutual":false,"expertTags":null,"experts":null,"djStatus":0,"vipType":0,"remarkName":null,"avatarImgIdStr":"109951164781511113","backgroundImgIdStr":"109951162868128395","avatarImgId_str":"109951164781511113"},"urlInfo":{"id":"C5D2CD3C629DD39CE3E482802D910FDE","url":"http://vodkgeyttp9.vod.126.net/vodkgeyttp8/sk7AXNAm_2961081175_uhd.mp4?ts=1608699472&rid=082973D43CCBFF01CBE54E97E7FDF740&rl=3&rs=hkPKqIDdbBGXgsCTVxyXGogLDvZpSEzd&sign=1c14241ebfec7da89c67eb7d0a543357&ext=v%2FCflKQMTE0uQAeWX1%2Futb2I8c4L40oAS5pBUq1s4nf1dysl4%2BpKR4Ipvwy%2BHr7LsREO8TIhW0yxWNKi5Nb3PseEtHmpuwf6OO4ViaB7eLRWzHe%2BmtAyT%2FRF7piHiX76Tob5u3bDDjqSgLenJgT2PWypU6egfWKi88H8mgjZr1JpGLMCmDpLyAB%2F6xHn3KEdMtQMbwPukRXV2s2AnRFx2WKBal04eubyGsp9wJWUTNz7skwTJ4Gx5cLH2juxZgVR","size":96791510,"validityTime":1200,"needPay":false,"payInfo":null,"r":1080},"videoGroup":[{"id":59101,"name":"华语现场","alg":"groupTagRank"},{"id":59108,"name":"巡演现场","alg":"groupTagRank"},{"id":57108,"name":"流行现场","alg":"groupTagRank"},{"id":1101,"name":"舞蹈","alg":"groupTagRank"},{"id":1100,"name":"音乐现场","alg":"groupTagRank"},{"id":58100,"name":"现场","alg":"groupTagRank"},{"id":5100,"name":"音乐","alg":"groupTagRank"}],"previewUrl":null,"previewDurationms":0,"hasRelatedGameAd":false,"markTypes":null,"relateSong":[],"relatedInfo":null,"videoUserLiveInfo":null,"vid":"C5D2CD3C629DD39CE3E482802D910FDE","durationms":204580,"playTime":900795,"praisedCount":4282,"praised":false,"subscribed":false}},{"type":1,"displayed":false,"alg":"onlineHotGroup","extAlg":null,"data":{"alg":"onlineHotGroup","scm":"1.music-video-timeline.video_timeline.video.181017.-295043608","threadId":"R_VI_62_720D10F0010AC703B9FBC2F30DB7FB03","coverUrl":"https://p2.music.126.net/byQnRd-EQjPy8Yg2T3d7PQ==/109951164492028362.jpg","height":1080,"width":1920,"title":"高清 BLACKPINK BOOMBAYAH舞台160814 1080p60帧","description":"超清 蓝光","commentCount":332,"shareCount":299,"resolutions":[{"resolution":240,"size":60264919},{"resolution":480,"size":102200600},{"resolution":720,"size":151143702},{"resolution":1080,"size":204444884}],"creator":{"defaultAvatar":false,"province":320000,"authStatus":0,"followed":false,"avatarUrl":"http://p1.music.126.net/CGkAv1s0RDW2Yn0NTwxwPQ==/1366692966181590.jpg","accountStatus":0,"gender":0,"city":320100,"birthday":631123200000,"userId":302804694,"userType":0,"nickname":"KPOP音乐-","signature":"b站号：KPOP音乐（大量更新）","description":"","detailDescription":"","avatarImgId":1366692966181590,"backgroundImgId":2002210674180199,"backgroundUrl":"http://p1.music.126.net/VTW4vsN08vwL3uSQqPyHqg==/2002210674180199.jpg","authority":0,"mutual":false,"expertTags":null,"experts":null,"djStatus":0,"vipType":0,"remarkName":null,"avatarImgIdStr":"1366692966181590","backgroundImgIdStr":"2002210674180199"},"urlInfo":{"id":"720D10F0010AC703B9FBC2F30DB7FB03","url":"http://vodkgeyttp9.vod.126.net/vodkgeyttp8/xufgwSCR_2793003242_uhd.mp4?ts=1608699472&rid=082973D43CCBFF01CBE54E97E7FDF740&rl=3&rs=LronXqgkmnjjGUHQOSBfApBugrQOFJIa&sign=f32e9edb76d33776ca6b5b7a75111dbe&ext=v%2FCflKQMTE0uQAeWX1%2Futb2I8c4L40oAS5pBUq1s4nf1dysl4%2BpKR4Ipvwy%2BHr7LsREO8TIhW0yxWNKi5Nb3PseEtHmpuwf6OO4ViaB7eLRWzHe%2BmtAyT%2FRF7piHiX76Tob5u3bDDjqSgLenJgT2PWypU6egfWKi88H8mgjZr1JpGLMCmDpLyAB%2F6xHn3KEdMtQMbwPukRXV2s2AnRFx2WKBal04eubyGsp9wJWUTNz7skwTJ4Gx5cLH2juxZgVR","size":204444884,"validityTime":1200,"needPay":false,"payInfo":null,"r":1080},"videoGroup":[{"id":92105,"name":"BLACKPINK","alg":"groupTagRank"},{"id":1101,"name":"舞蹈","alg":"groupTagRank"},{"id":1100,"name":"音乐现场","alg":"groupTagRank"},{"id":58100,"name":"现场","alg":"groupTagRank"},{"id":5100,"name":"音乐","alg":"groupTagRank"}],"previewUrl":null,"previewDurationms":0,"hasRelatedGameAd":false,"markTypes":null,"relateSong":[],"relatedInfo":null,"videoUserLiveInfo":null,"vid":"720D10F0010AC703B9FBC2F30DB7FB03","durationms":250404,"playTime":710842,"praisedCount":5612,"praised":false,"subscribed":false}}]
    videoList.push(...mockList)
    this.setData({
      videoList
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
  onShareAppMessage: function ({from}) {
    console.log(from)
    if (from === 'button') {
      return {
        title: '自定义button转发',
        page: '/pages/login/index',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    } else {
      return {
        title: '自定义menu转发',
        page: '/pages/login/index',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    }
    
  }
})