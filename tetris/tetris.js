// 定义常量，棋盘宽度50，高度50，每个方块的宽高为10
const WIDTH = 10
const HEIGHT = 21
const ITEM_WIDTH = 20
const ITEM_SM = 12
const X_AXIS = ITEM_WIDTH * 4 + 10
const ContextQueue = []
const srcMap = {
  // 'rotate': 'https://systems-1256378396.cos.ap-guangzhou.myqcloud.com/m_jgby_1_66.mp3',
  // 'down': 'https://audio-1256378396.cos.ap-guangzhou.myqcloud.com/sr_x_skill0_02.wav',
  // 'dropHard': 'https://audio-1256378396.cos.ap-guangzhou.myqcloud.com/m_kls_0_0.mp3',
  'left': 'https://audio-1256378396.cos.ap-guangzhou.myqcloud.com/m_keb_0_7.wav',
  'right': 'https://audio-1256378396.cos.ap-guangzhou.myqcloud.com/m_keb_0_7.wav',
  'up': 'https://audio-1256378396.cos.ap-guangzhou.myqcloud.com/sr_xj_skill0_02.wav',
  'rotate': 'https://audio-1256378396.cos.ap-guangzhou.myqcloud.com/sr_xj_skill0_02.wav',
  'down': 'https://audio-1256378396.cos.ap-guangzhou.myqcloud.com/m_keb_0_7.wav',
  'dropHard': 'https://audio-1256378396.cos.ap-guangzhou.myqcloud.com/m_keb_0_7.wav',
  'hold': 'https://audio-1256378396.cos.ap-guangzhou.myqcloud.com/sr_xj_skill0_02.wav',
  'end': 'https://audio-1256378396.cos.ap-guangzhou.myqcloud.com/m_keb_1_3.wav'
}
Array.prototype.clone = function () {
  var array = this;
  const res = array.map(arr => {
    return [...arr];
  });
  return res;
}

Array.prototype.shuffle = function () {
  var array = this;
  var m = array.length,
    t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

Page({

  data: {
    cvHeight: HEIGHT * ITEM_WIDTH,
    cvWidth: WIDTH * ITEM_WIDTH,
  },

  onLoad: function (options) {
    this._round = 0
    wx.createSelectorQuery()
      .select('#canvas2d')
      .fields({
        node: true,
        size: true,
      })
      .exec(this.init.bind(this))
  },

  onReady: function () {
    console.log('st', this._st);
  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {
    return {
      title: 'Tetris'
    }
  },

  init(res) {
    const width = res[0].width
    const height = res[0].height
    const canvas = res[0].node
    this._ctx = canvas.getContext('2d')
    const dpr = wx.getSystemInfoSync().pixelRatio
    canvas.width = width * dpr
    canvas.height = height * dpr
    this._ctx.scale(dpr, dpr);
    this._ctx.fillStyle = '#000000';
    this._ctx.strokeStyle = '#879372';
    this.startGame();
  },

  async startGame() {
    if (this._st) clearInterval(this._st);
    this.initBoard();
    this._x = 3;
    this._y = -1;
    this._itv = 1600;
    this._bucketItems = '';
    this._itemsQueue = this.makeRandomItems();
    this._nextArea = Array(2).fill().map(() => Array(4).fill(0));
    this._ctx.fillStyle = '#9ead86';
    this._ctx.fillRect(0, 0, WIDTH * ITEM_WIDTH + 40, HEIGHT * ITEM_WIDTH + 20);
    this._ctx.fillRect(ITEM_WIDTH * 12, 0, 115, HEIGHT * ITEM_WIDTH + 20);
    this.drawNextItem([[], []], ITEM_WIDTH + 10, ITEM_WIDTH * 2 + 5);
    this.pickNextItem();
    await this.loadFontFace();
    this._ctx.fillStyle = '#333333';
    this._ctx.textBaseline = "top";
    this._ctx.textAlign = 'left';
    this._ctx.font = '600 14px sans-serif';
    this._ctx.fillText('Hold:', 10, ITEM_WIDTH + 5);
    this._ctx.fillText('Next:', X_AXIS + ITEM_WIDTH * 10 + 10, ITEM_WIDTH * 2);
    this._ctx.fillText('分数:', 10, ITEM_WIDTH * 12);
    // this._ctx.fillText('最高分:', 10, ITEM_WIDTH * 15);
    this._scroe = 0;
    this.setScore(0);
    this.makeGame(this._itv);
  },

  // 初始化棋盘
  initBoard() {
    // 创建初始二维数组
    this._matrix = Array(HEIGHT).fill().map(() => Array(WIDTH).fill(0))

    this.drawMatrix(this._matrix)
  },
  drawMatrix(matrix) {
    // 因为canvas是覆写式的逻辑，所以绘制之前必须先清空区域
    this._ctx.clearRect(X_AXIS, 0, WIDTH * ITEM_WIDTH, HEIGHT * ITEM_WIDTH);
    this._ctx.fillStyle = '#9ead86';
    this._ctx.fillRect(X_AXIS, 0, WIDTH * ITEM_WIDTH, HEIGHT * ITEM_WIDTH);
    // 双重循环绘制每个方格
    matrix.forEach((arr, y) => {
      if (y < 1) return;
      arr.forEach((item, x) => {
        if (item == 1) {
          this._ctx.fillStyle = '#000000';
          this._ctx.strokeStyle = '#879372';
          this._ctx.fillRect(X_AXIS + x * ITEM_WIDTH + 0.5, y * ITEM_WIDTH + 0.5, ITEM_WIDTH - 1, ITEM_WIDTH - 1);
          this._ctx.strokeRect(X_AXIS + x * ITEM_WIDTH + 3, y * ITEM_WIDTH + 3, ITEM_WIDTH - 6, ITEM_WIDTH - 6);
          this._ctx.strokeRect(X_AXIS + x * ITEM_WIDTH + 2, y * ITEM_WIDTH + 2, ITEM_WIDTH - 4, ITEM_WIDTH - 4);
          this._ctx.strokeRect(X_AXIS + x * ITEM_WIDTH, y * ITEM_WIDTH, ITEM_WIDTH, ITEM_WIDTH);
        } else if (item == 0) {
          this._ctx.fillStyle = '#879372';
          this._ctx.strokeStyle = '#879372';
          this._ctx.fillRect(X_AXIS + x * ITEM_WIDTH + 6, y * ITEM_WIDTH + 6, ITEM_WIDTH - 12, ITEM_WIDTH - 12);
          this._ctx.strokeRect(X_AXIS + x * ITEM_WIDTH + 4, y * ITEM_WIDTH + 4, ITEM_WIDTH - 8, ITEM_WIDTH - 8);
          this._ctx.strokeRect(X_AXIS + x * ITEM_WIDTH, y * ITEM_WIDTH, ITEM_WIDTH, ITEM_WIDTH);
        } else if (item.fillStyle) {
          this._ctx.fillStyle = item.fillStyle || '#222222';
          this._ctx.strokeStyle = item.strokeStyle || '#948E99';
          this._ctx.fillRect(X_AXIS + x * ITEM_WIDTH + 0.5, y * ITEM_WIDTH + 0.5, ITEM_WIDTH - 1, ITEM_WIDTH - 1);
          this._ctx.strokeRect(X_AXIS + x * ITEM_WIDTH + 3, y * ITEM_WIDTH + 3, ITEM_WIDTH - 6, ITEM_WIDTH - 6);
          this._ctx.strokeRect(X_AXIS + x * ITEM_WIDTH + 2, y * ITEM_WIDTH + 2, ITEM_WIDTH - 4, ITEM_WIDTH - 4);
          this._ctx.strokeRect(X_AXIS + x * ITEM_WIDTH, y * ITEM_WIDTH, ITEM_WIDTH, ITEM_WIDTH);
        }
      })
    })
  },
  drawNextItem(item, dx, dy) {
    const matrix = this._nextArea.map(arr => {
      return [...arr];
    });
    console.log('item', item)
    item.map((it, y) => {
      it.map((val, x) => {
        if (val) {
          matrix[y][x] = val;
        }
      })
    })
    this._ctx.clearRect(dx, dy, ITEM_SM * 4, ITEM_SM * 2);
    this._ctx.fillStyle = '#9ead86';
    this._ctx.fillRect(dx, dy, ITEM_SM * 4, ITEM_SM * 2);
    matrix.forEach((arr, y) => {
      arr.forEach((item, x) => {
        if (item == 1) {
          this._ctx.fillStyle = '#000000';
          this._ctx.fillRect(dx + x * ITEM_SM + 0.4, dy + y * ITEM_SM + 0.4, ITEM_SM - 0.8, ITEM_SM - 0.8);
          this._ctx.strokeRect(dx + x * ITEM_SM + 2.5, dy + y * ITEM_SM + 2.5, ITEM_SM - 5, ITEM_SM - 5);
          this._ctx.strokeRect(dx + x * ITEM_SM + 1, dy + y * ITEM_SM + 1, ITEM_SM - 2, ITEM_SM - 2);
          this._ctx.strokeRect(dx + x * ITEM_SM, dy + y * ITEM_SM, ITEM_SM, ITEM_SM);
        } else {
          this._ctx.fillStyle = '#879372';
          this._ctx.fillRect(dx + x * ITEM_SM + 3, dy + y * ITEM_SM + 3, ITEM_SM - 6, ITEM_SM - 6);
          this._ctx.strokeRect(dx + x * ITEM_SM + 2, dy + y * ITEM_SM + 2, ITEM_SM - 4, ITEM_SM - 4);
          this._ctx.strokeRect(dx + x * ITEM_SM, dy + y * ITEM_SM, ITEM_SM, ITEM_SM);
        }
      })
    })
  },
  async makeGame(itv = 500, down='') {
    this.drawItem(this._item, this._x, this._y, false);
    if (this._st) clearInterval(this._st);
    this._st = setInterval(() => {
      if (this.posAllowed(this._item, this._x, this._y + 1)) {
        this._y += 1;
        this.drawItem(this._item, this._x, this._y, false);
      } else {
        if (down) return clearInterval(this._st);
        console.log('this._lockFix', this._lockFix)
        this.fixItem().then(()=>{
          this.roundEnd();
          this._lockFix = false;
        })
      }
    }, itv)
  },

  fixItem() {
    return new Promise((r,j)=>{
      if (this._lockFix) return j();
      this._lockFix = true;
      console.log('item fixing')
      this._item.map((it, y) => {
        it.map((val, x) => {
          this._item[y][x] = val ? { fillStyle: '#830000' } : 0;
        })
      })
      this.drawItem(this._item, this._x, this._y, false);
      if (this._stFix) clearTimeout(this._stFix);
      this._stFix = setTimeout(()=>{
        this._item.map((it, y) => {
          it.map((val, x) => {
            this._item[y][x] = val ? 1 : 0;
          })
        })
        this.drawItem(this._item, this._x, this._y);
        clearInterval(this._st);
        wx.vibrateShort();
        console.log('item fixed')
        this.setScore(4);
        this._lockHor = false;
        r();
      }, 67)
    })
  },

  roundEnd() {
    console.log('end this._matrix', this._matrix);
    let idx = this._matrix.length - 1;
    let subIdxs = []
    while (idx > 0) {
      let allOne = this._matrix[idx].every(val => val);
      if (allOne) {
        subIdxs.push(idx)
      }
      idx -= 1;
    }
    if (!subIdxs.length) {
      return this.nextDrop();
    }
    let ft = 0;
    let fixSize = subIdxs.length;
    this.playSE('end');
    this.setScore(fixSize * 100);
    this._stLast = setInterval(() => {
      console.log('ft', ft)
      if (ft > 6) {
        clearInterval(this._stLast);
        console.log('next drop');
        while (subIdxs.length) {
          let idx = subIdxs.shift();
          this._matrix.splice(idx, 1);
        }
        while (fixSize > 0) {
          this._matrix.unshift(Array(WIDTH).fill(0));
          fixSize -= 1;
        }
        console.log('next', this._matrix);
        this.nextDrop();
      }
      this._ctx.fillStyle = ft % 2 == 0 ? '#830000' : '#000000';
      this._matrix.forEach((arr, y) => {
        arr.forEach((item, x) => {
          if (item == 1 && subIdxs.indexOf(y) > -1) {
            this._ctx.fillRect(X_AXIS + x * ITEM_WIDTH + 0.5, y * ITEM_WIDTH + 0.5, ITEM_WIDTH - 1, ITEM_WIDTH - 1);
            this._ctx.strokeRect(X_AXIS + x * ITEM_WIDTH + 3, y * ITEM_WIDTH + 3, ITEM_WIDTH - 6, ITEM_WIDTH - 6);
            this._ctx.strokeRect(X_AXIS + x * ITEM_WIDTH + 2, y * ITEM_WIDTH + 2, ITEM_WIDTH - 4, ITEM_WIDTH - 4);
            this._ctx.strokeRect(X_AXIS + x * ITEM_WIDTH, y * ITEM_WIDTH, ITEM_WIDTH, ITEM_WIDTH);
          }
        })
      })
      ft += 1
    }, 34)
  },

  nextDrop() {
    this._x = 3;
    this._y = 0;
    this._item = this.pickNextItem();
    if (this.posAllowed(this._item, this._x, this._y)) {
      if (this._st) clearInterval(this._st);
      this.makeGame(this._itv);
    } else {
      console.log('game over')
      clearInterval(this._st);
      this.startGame();
    }
  },

  posAllowed(item, dx, dy) {
    let allow = true;
    item.map((it, y) => {
      it.map((val, x) => {
        if (val) {
          allow = this._matrix[y + dy] && allow;
          if (allow) {
            if (this._matrix[y + dy][x + dx] == 1 || this._matrix[y + dy][x + dx] == undefined) {
              allow = false;
            }
          } else if (y + dy == -1) {
            allow = true;
          }

        }
      })
    })
    return allow;
  },
  drawItem(item, dx, dy, save = true) {
    const nextMatrix = this._matrix.map(arr => {
      return [...arr];
    });
    item.map((it, y) => {
      it.map((val, x) => {
        if (val && nextMatrix[y + dy]) {
          nextMatrix[y + dy][x + dx] = val;
        }
        this.drawMatrix(nextMatrix);
        if (save) {
          this._matrix = nextMatrix;
        }
      })
    })
  },

  drawShadow() {
    let shadow = this._item.clone();
    this._floorY = this._y;
    while (this.posAllowed(shadow, this._x, this._floorY)) {
      this._floorY += 1;
    }
    this._floorY -= 1;
    // #116688
    shadow.map((it, y) => {
      it.map((val, x) => {
        shadow[y][x] = val ? { fillStyle: '#444444', strokeStyle: '#948E99' } : 0;
      })
    })
    this._matrix.forEach((arr, y) => {
      if (y < 1) return;
      arr.forEach((item, x) => {
        if (item && item.fillStyle) {
          this._matrix[y][x] = 0;
        }
      })
    })
    this.drawItem(shadow, this._x, this._floorY);
  },

  pickNextItem(just='') {
    this._curIdx = 0;
    this._curItems = this._itemsQueue.shift();
    this._item = this._curItems[this._curIdx];
    if (just) {
      this.adjestItem(this._item);
    }
    if (this._itemsQueue.length < 7) {
      this._itemsQueue = this._itemsQueue.concat(this.makeRandomItems());
    }
    this.drawNextItem(this._itemsQueue[0][0], X_AXIS + ITEM_WIDTH * 10 + 10, ITEM_WIDTH * 3);
    this.drawNextItem(this._itemsQueue[1][0], X_AXIS + ITEM_WIDTH * 10 + 10, ITEM_WIDTH * 5);
    this.drawNextItem(this._itemsQueue[2][0], X_AXIS + ITEM_WIDTH * 10 + 10, ITEM_WIDTH * 7);
    this.drawNextItem(this._itemsQueue[3][0], X_AXIS + ITEM_WIDTH * 10 + 10, ITEM_WIDTH * 9);
    this.drawNextItem(this._itemsQueue[4][0], X_AXIS + ITEM_WIDTH * 10 + 10, ITEM_WIDTH * 11);
    this.drawNextItem(this._itemsQueue[5][0], X_AXIS + ITEM_WIDTH * 10 + 10, ITEM_WIDTH * 13);
    this.drawShadow();
    this.drawItem(this._item, this._x, this._y, false);
    return this._item;
  },

  directionEvent(direction, val = 1) {
    switch (direction) {
      case "left":
        if (this.posAllowed(this._item, this._x - 1, this._y)) {
          this._x -= 1;
          this.drawShadow();
          this.drawItem(this._item, this._x, this._y, false);
        }
        this._stKeep = setTimeout(() => {
          this.keepMoveHor(direction)
        }, 50)
        break
      case "right":
        if (this.posAllowed(this._item, this._x + 1, this._y)) {
          this._x += 1;
          this.drawShadow();
          this.drawItem(this._item, this._x, this._y, false);
        }
        this._stKeep = setTimeout(() => {
          this.keepMoveHor(direction)
        }, 50)
        break
      case "down":
        this.makeGame(20, true);
        break
      case "dropHard":
        this._lockHor = true;
        this._y = this._floorY;
        if (this._st) clearInterval(this._st);
        this.fixItem().then(()=>{
          this.roundEnd();
          this._lockFix = false;
        })
        break
      case "rotate":
        this.rotateItem(val);
        break
      case "up":
        this.rotateItem(val);
        break
      case "hold":
        this.holdItem();
        break
    }
  },

  keepMoveHor(direction) {
    let val = direction == 'left' ? -1 : 1;
    if (this._stMove) clearInterval(this._stMove);
    this._stMove = setInterval(() => {
      if (this.posAllowed(this._item, this._x + val, this._y)) {
        this._x += val;
        this.drawShadow();
        this.drawItem(this._item, this._x, this._y, false);
      }
    }, 33)
  },

  holdItem() {
    if (this._bucketItems) {
      let tmp = this._bucketItems.clone();
      if (!this.adjestItem(tmp[0])) return;
      this._bucketItems = this._curItems.clone();
      this._curItems = tmp.clone();
      this._curIdx = 0;
      this._item = this._curItems[0];
      this.rotateItem(-1);
      this.rotateItem(1);
    } else {
      this._bucketItems = this._curItems.clone();
      console.log('this._bucketItems', this._bucketItems);
      this.pickNextItem(true);
    }
    this.drawNextItem(this._bucketItems[0], ITEM_WIDTH + 10, ITEM_WIDTH * 2 + 5);
  },

  rotateItem(val) {
    let idx = this._curIdx + val;
    idx = idx < this._curItems.length ? idx : 0;
    idx = idx < 0 ? this._curItems.length - 1 : idx;
    console.log(idx, this._curItems[idx])
    console.log(idx, this._matrix)
    if (!this.posAllowed(this._curItems[idx], this._x, this._y + 1)) {

    }
    if (!this.posAllowed(this._curItems[idx], this._x, this._y)) {
      console.log('!=')
      if (this.adjestItem(this._curItems[idx])) {
        console.log('adjestItem true!');
      } else if (this.posAllowed(this._curItems[idx], this._x, this._y + 1)) {
        console.log('y+1')
        this._y += 1
      } else if (this.posAllowed(this._curItems[idx], this._x + 1, this._y + 1)) {
        console.log('x+1y+1')
        this._x += 1
        this._y += 1
      } else if (this.posAllowed(this._curItems[idx], this._x - 1, this._y + 1)) {
        console.log('x-1y+1')
        this._x -= 1
        this._y += 1
      } else {
        return;
      }
    }
    this._curIdx = idx;
    this._item = this._curItems[idx];
    this.drawShadow();
    this.drawItem(this._item, this._x, this._y, false);
  },

  adjestItem(item) {
    if (this.posAllowed(item, this._x, this._y)) {
      return true;
    } else if (this.posAllowed(item, this._x + 1, this._y)) {
      console.log('x+1')
      this._x += 1;
      return true;
    } else if (this.posAllowed(item, this._x - 1, this._y)) {
      console.log('x-1')
      this._x -= 1;
      return true;
    } else if (this.posAllowed(item, this._x + 2, this._y)) {
      console.log('x+2')
      this._x += 2;
      return true;
    } else if (this.posAllowed(item, this._x - 2, this._y)) {
      console.log('x-2')
      this._x -= 2;
      return true;
    }
    return false;
  },

  changeClick() {
    console.log('change');
  },
  directionPress(e) {
    if (this._lockHor) return;
    const { direction, val = 1 } = e.currentTarget.dataset;
    this._direction = direction;
    this.playSE(direction);
    this.directionEvent(direction, parseInt(val));
  },
  directionEnd(e) {
    if (this._direction == 'down') {
      this.makeGame(this._itv);
    }
    if (this._stKeep) clearInterval(this._stKeep);
    if (this._stMove) clearInterval(this._stMove);
  },

  makeRandomItems() {
    let itemIs = [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
      ],
      [
        [0, 1],
        [0, 1],
        [0, 1],
        [0, 1]
      ]
    ]

    let itemLs = [
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
      [
        [1, 1, 1],
        [1, 0, 0],
        [0, 0, 0],
      ],
      [
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 0],
      ],
    ]
    let itemJs = [
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
      [
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 0],
      ],
      [
        [1, 1, 0],
        [1, 0, 0],
        [1, 0, 0],
      ],
    ]

    let itemZs = [
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0],
      ]
    ]
    let itemSs = [
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],
      [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
      ]
    ]

    let itemTs = [
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
      ],
    ]
    let itemOs = [
      [
        [0, 1, 1, 0],
        [0, 1, 1, 0],
      ]
    ]
    const Items = [itemIs, itemLs, itemZs, itemJs, itemSs, itemTs, itemOs];
    // const Items = [itemIs];
    return [].concat(Items).shuffle();
  },

  getAudioContext(){
    let ctx = ContextQueue.shift();
    if (!ctx) {
      let ctx1 = wx.createInnerAudioContext();
      let ctx2 = wx.createInnerAudioContext();
      let ctx3 = wx.createInnerAudioContext();
      let ctx4 = wx.createInnerAudioContext();
      let ctx5 = wx.createInnerAudioContext();
      let ctx6 = wx.createInnerAudioContext();
      let ctx7 = wx.createInnerAudioContext();
      let ctx8 = wx.createInnerAudioContext();
      let ctx9 = wx.createInnerAudioContext();
      ContextQueue.push(ctx1);
      ContextQueue.push(ctx2);
      ContextQueue.push(ctx3);
      ContextQueue.push(ctx4);
      ContextQueue.push(ctx5);
      ContextQueue.push(ctx6);
      ContextQueue.push(ctx7);
      ContextQueue.push(ctx8);
      ContextQueue.push(ctx9);
      return ctx1;
    }else {
      ContextQueue.push(ctx);
      return ctx;
    }
  },

  getSrcSE(type){
    let key = `src_se_${type}`
    let seSrc = wx.getStorageSync(key);
    return new Promise((resolve, j)=>{
      if (!seSrc) {
        wx.downloadFile({
          url: srcMap[type],
          success: (res) => {
            if (res && res.tempFilePath) {
              seSrc = res.tempFilePath
              wx.setStorageSync(key, seSrc)
              resolve(seSrc)
            }
          },
          fail: (err)=>{
            console.log(err)
            j(err)
          }
        })
      } else {
        resolve(seSrc)
      }
    })
  },

  async playSE(type=''){
    let ctx = this.getAudioContext();
    ctx.src = await this.getSrcSE(type);
    ctx.play()
  },

  async loadFontFace() {
    const self = this
    return new Promise((r,j)=>{
      wx.loadFontFace({
        family: 'let-go-digital',
        // source: 'url("https://sungd.github.io/Pacifico.ttf")',
        // source: 'url("https://systems-1256378396.cos.ap-guangzhou.myqcloud.com/Lets-go-Digital.TTF")',
        source: 'url("https://webcdn.m.qq.com/mini/tmp/Lets-go-Digital.TTF")',
        scopes: ['native'],
        success(res) {
          console.log('loadFontFace', res.status)
          self.setData({ loaded: true })
        },
        fail: function(res) {
          console.log('fail font', res)
        },
        complete: function(res) {
          console.log('loadFontFace complete', res.status)
          r();
        }
      });

    })
  },
  setScore(score) {
    this._scroe += score;
    this._ctx.textAlign = 'right';
    this._ctx.font = '22px let-go-digital';
    this._ctx.fillStyle = '#9ead86';
    this._ctx.fillRect(0, ITEM_WIDTH * 13 - 5, X_AXIS - 5, ITEM_SM * 2 + 10);
    this._ctx.fillStyle = '#333333';
    this._ctx.fillText(this._scroe, X_AXIS - 10, ITEM_WIDTH * 13);
  },

})