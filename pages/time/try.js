Page({
  data: {
    array: ['美国', '中国', '巴西', '日本'],
    objectArray: [
      {
        id: 0,
        name: '美国'
      },
      {
        id: 1,
        name: '中国'
      },
      {
        id: 2,
        name: '巴西'
      },
      {
        id: 3,
        name: '日本'
      }
    ],
    index: 0,
    date: '2016-09-01',
    time: '',
    nowHours:0,
    nowMinutes:0,

  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  onReady: function (e) {
    var date  = new Date()
    var nowHours = date.getHours();
    var nowMinutes = date.getMinutes();
    console.log(nowHours)
    console.log(nowMinutes)
    this.setData({
      time: nowHours + ":" + nowMinutes,
      nowMinutes: nowMinutes,
      nowHours: nowHours,
    })
    console.log("this.data",this.data)
  },


})