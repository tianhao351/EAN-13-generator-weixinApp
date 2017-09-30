Page({
  data: {
    code12:'',
    code13:'',
    codeOne:'',
    warnState:'',
    binCode:'',
    flag:'hidden',
    flag1:"hidden",
    noiseNum:0,
    noiseSize:0,
    imgUrl:"",
    rotate20: 0 ,
    mirror:false

  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  onReady: function (e) {
  },

  // 确定第十三位数字
  code12to13 :function(){
    var odd = 0;
    var even = 0;
    for(var i = 0; i< 12 ;i++){
      if(i%2 == 0){
        even += parseInt(this.data.code12[i])
      }else{
        odd += parseInt(this.data.code12[i])
      }
    }
    var codeLast = (10 - (even + odd*3) % 10) % 10
    var code13 = this.data.code12 + codeLast.toString();
    this.setData({
      codeOne: codeLast.toString(),
      code13:code13
    })
    console.log("odd:",odd,"even:",even,"codeLast",codeLast)
  },


// 输入十二位数字
  enterCode12: function(e) {
    this.setData({
      code12: e.detail.value,
    })
    console.log("data:",this.data)
  },

//输入噪声个数
  enterNoiseNum: function(e) {
    this.setData({
      noiseNum: e.detail.value,
    })
    console.log("data:",this.data)
  },


//输入噪声直径
  enterNoiseSize: function(e) {
    this.setData({
      noiseSize: e.detail.value,
    })
    console.log("data:",this.data)
  },

//编码
  formatToBin: function(){
    var start = "101";
    var end = "101";
    var interval = "01010";
    var chartset = {
      0: [0, 0, 0, 0, 0, 0],
      1: [0, 0, 1, 0, 1, 1],
      2: [0, 0, 1, 1, 0, 1],
      3: [0, 0, 1, 1, 1, 0],
      4: [0, 1, 0, 0, 1, 1],
      5: [0, 1, 1, 0, 0, 1],
      6: [0, 1, 1, 1, 0, 0],
      7: [0, 1, 0, 1, 0, 1],
      8: [0, 1, 0, 1, 1, 0],
      9: [0, 1, 1, 0, 1, 0]
    };
    var map = {
      0: ["0001101", "0100111", "1110010"],
      1: ["0011001", "0110011", "1100110"],
      2: ["0010011", "0011011", "1101100"],
      3: ["0111101", "0100001", "1000010"],
      4: ["0100011", "0011101", "1011100"],
      5: ["0110001", "0111001", "1001110"],
      6: ["0101111", "0000101", "1010000"],
      7: ["0111011", "0010001", "1000100"],
      8: ["0110111", "0001001", "1001000"],
      9: ["0001011", "0010111", "1110100"]
    };
    var prefix = this.data.code13.slice(0,1)
    var firstPart = this.data.code13.slice(1,7)
    var lastPart = this.data.code13.slice(7,13)

    var choose = chartset[prefix]

    var binCode = '';
    binCode += start;
    for(var i = 0 ; i <= 5 ;i++){
      binCode += map[firstPart[i]][choose[i]]
    }
    binCode += interval;
    for(var j = 0 ; j <= 5 ;j++){
      binCode += map[lastPart[j]][2]
    }
    binCode += end;
    this.setData({
      binCode : binCode,
    })
    console.log("bin:",this.data.binCode.length)
  },





//画图 in canvas
  drawCanvas: function(){
    if(this.data.code12.length == 12){
      this.setData({
        warnState:"条形码及其信息如下:",
        flag:""
      });
      this.code12to13();
      this.formatToBin();
      var context = wx.createCanvasContext('firstCanvas')
      context.setStrokeStyle("#000000")
      context.setLineWidth(5)

      //旋转
      if(this.data.rotate20 > 0){
        for(var i  = 0 ; i < this.data.rotate20 ; i++)
        {
        context.translate(+105, +25+99)
        context.rotate(15 * Math.PI / 180)
        context.translate(-105, -25-99)
        console.log("context",context)
        }
      }

      //draw
      if(this.data.mirror == false){
        for(var i = 0;i<this.data.binCode.length;i++){         
          if(this.data.binCode[i]==1){        
            context.fillRect(2*i+10, 92, 2, 50)
          }
        }
        context.setFontSize(20)
        context.fillText(this.data.code13,20,70+92)
      }

      //draw mirror
      if(this.data.mirror == true){
            for(var i = 0;i<this.data.binCode.length;i++)           {         
              if(this.data.binCode[i]==1){        
                context.fillRect(200-2*i, 92, 2, 50)
              }
            }
          }




      //噪音
      for(var i = 0;i<this.data.noiseNum;i++){
          context.fillRect(95*2*Math.random()+10, 50*Math.random()+92, this.data.noiseSize, this.data.noiseSize)
      }
      context.stroke()
      context.draw()
    }
    else{
      this.setData({
        warnState:"请您输入12位数字"+"，您已输入"+this.data.code12.length+"个",
        flag:"hidden"
      })
      console.log(this.data)
    }
    var that = this
    wx.canvasToTempFilePath({
      canvasId: 'firstCanvas',
      success: function(res) {
        console.log(res.tempFilePath)
        that.setData({
          imgUrl:res.tempFilePath
        })
        } 
      })
  },

  //保存图片

  saveCanvas: function(){
      wx.previewImage({
        current: this.data.imgUrl, // 当前显示图片的http链接
        urls: [this.data.imgUrl]
      })
  },

  rotate: function(){
    this.setData({
      rotate20: this.data.rotate20 + 1
    })
    this.drawCanvas()
  },

  mirror: function(){
    this.setData({
      mirror: !this.data.mirror
    })
    this.drawCanvas()
  }

    
    

})