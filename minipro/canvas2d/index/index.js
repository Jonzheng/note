const app = getApp()

Page({
  data: {

  },
  onLoad: function () {
    let json = {
      a2: 'https://pub.pm.qq.com/minigood_production/22d3d1e535bf820aee0b6e9afcdc7b3a/1cd8f0c0de77b7ec2c95423f5f07d58c.jpg?imageMogr2/auto-orient',
      btn1: './Button-share-green.png',
      aruka: './aruka9.png',
      a22: './a22.png',
      cover: "./onichan.jpg",
    };
    wx.showLoading({
      title: '海报生成中...',
    })
    console.log(json);
    //选取画板
    const query = wx.createSelectorQuery()
    query.select('#posterCanvas')
      .fields({ node: true, size: true })
      .exec(async (res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        canvas.width = res[0].width;
        canvas.height = res[0].height;
        ctx.clearRect(0, 0,  canvas.width, canvas.height); //清空画板
        ctx.fillStyle = '#efffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //生成主图
        const mainImg = canvas.createImage();
        mainImg.src = json.a22;
        let mainImgPo = await new Promise((resolve, reject) => {
          mainImg.onload = () => {
            resolve(mainImg)
          }
          mainImg.onerror = (e) => {
            reject(e)
          }
        });
        let h = mainImgPo.height;
        let w = mainImgPo.width;
        let setHeight = 250, //默认源图截取的区域
          setWidth = 320; //默认源图截取的区域
        if (w / h > 320 / 410) {
          setHeight = h;
          setWidth = parseInt(320 / 410 * h);
        } else {
          setWidth = w;
          setHeight = parseInt(410 / 320 * w);
        }
        console.log('w x h =', w, h)
        console.log(setWidth, setHeight)
        // ctx.drawImage(mainImgPo, 200, 300, setWidth, setHeight, 0, 0, 320, 250);
        // ctx.drawImage(mainImgPo, 0, 0, setWidth, setHeight);
        // ctx.drawImage(mainImgPo, 0, 0, 1280, 720, 0, 0, 320, 410);
        ctx.drawImage(mainImgPo, 0, 0, setWidth, setHeight, 0, 0, 320, 410);

        ctx.strokeStyle = '#E5E5E5'
        ctx.moveTo(20, 200)
        ctx.lineTo(200, 200)
        ctx.stroke();
        //写底部背景
        const bgImg = canvas.createImage();
        bgImg.src = json.btn1;
        // 220 x 110
        let bgImgPo = await new Promise((resolve, reject) => {
          bgImg.onload = () => {
            resolve(bgImg)
          }
          bgImg.onerror = (e) => {
            reject(e)
          }
        });
        ctx.drawImage(bgImgPo, 0, 0, 220, 110, 100, 300, 100, 50);

        //文案内容
        let txtLeftPos = 10;
        ctx.textBaseline = "top";
        ctx.textAlign = 'left';
        // 昵称
        ctx.font = "200 20px sans-serif"; //设置字体css font
        ctx.fillStyle = 'red';
        ctx.fillText('200六月不会自己试试', txtLeftPos, 10)

        ctx.font = "300 20px sans-serif"; //设置字体css font
        ctx.fillStyle = 'red';
        ctx.fillText('300大小生效', txtLeftPos, 30)

        ctx.font = "400 20px sans-serif"; //设置字体css font
        ctx.fillStyle = 'red';
        ctx.fillText('400大小生效', txtLeftPos, 50)

        ctx.font = "500 20px sans-serif"; //设置字体css font
        ctx.fillStyle = 'red';
        ctx.fillText('500大小生效', txtLeftPos, 70)

        ctx.font = "600 20px sans-serif"; //设置字体css font
        ctx.fillStyle = 'red';
        ctx.fillText('500大小生效', txtLeftPos, 90)

        ctx.font = "700 20px sans-serif"; //设置字体css font
        ctx.fillStyle = 'red';
        ctx.fillText('700大小生效', txtLeftPos, 110)

        //用户头像
        function canvasWxHeader(headImageLocal) {
          const headerImg = canvas.createImage();
          console.log(headImageLocal)
          headerImg.src = headImageLocal;
          headerImg.onload = () => {
            ctx.save();
            ctx.beginPath()//开始创建一个路径
            ctx.arc(38, 288, 22, 0, 2 * Math.PI, false)//画一个圆形裁剪区域
            ctx.clip()//裁剪
            ctx.drawImage(headerImg, 0, 270, 60, 60);
            ctx.closePath();
            ctx.restore();
            //关闭loading
            wx.hideLoading();
          }
        }
        canvasWxHeader(json.a2);

      });
  },

  getPhotosAuthorize: function () {
    let self = this;
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
              self.saveImg();
            },
            fail() {
              console.log("用户再次拒绝")
            }
          })
        } else {
          self.saveImg();
        }
      }
    })
  },
  
  async saveImg() {
    let self = this;
    const query = wx.createSelectorQuery();
    const canvasObj = await new Promise((resolve, reject) => {
      query.select('#posterCanvas')
        .fields({ node: true, size: true })
        .exec(async (res) => {
          resolve(res[0].node);
        })
    });
    console.log(canvasObj);
    wx.canvasToTempFilePath({
      //fileType: 'jpg',
      //canvasId: 'posterCanvas', //之前的写法
      canvas: canvasObj, //现在的写法
      success: (res) => {
        console.log(res);
        self.setData({ canClose: true, tmpFile: res.tempFilePath });
        //保存图片
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '已保存到相册',
              icon: 'success',
              duration: 2000
            })
            // setTimeout(() => {
            //   self.setData({show: false})
            // }, 6000);
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("当初用户拒绝，再次发起授权")
            } else {
              util.showToast("请截屏保存分享");
            }
          },
          complete(res) {
            wx.hideLoading();
            console.log(res);
          }
        })
      },
      fail(res) {
        console.log(res);
      }
    }, this)
  },
})
