/**
 * 添加一个动画类
 * @param cfg object类型的参数集
 * @constructor
 */
// 每次在创建new Animation()这个动画对象的时候都会来调用这个构造函数
function Animation(cfg) {
    for (var attr in cfg) {
        this[attr] = cfg[attr];
    }
}

// 添加原型方法
Animation.prototype = {
    constructor: Animation,

    // Animation包含的Frame， 类型数组
    frames: null,
    // 包含的frame数量
    frameCount: -1,
    // 所使用的图片ID（在ImgCache中存放的key）,字符串类型
    img: null,
    currentFrame: null,
    currentFrameIndex: -1,
    currentFramePlayed: -1,


    // 初始化Animation
    init: function () {
        // 首先更具ID获得image对象
        this.img = ImgCache[this.img] || this.img;

        // 当前所有的帧存储在一个数组中
        this.frames = this.frames || [];
        this.frameCount = this.frames.length;

        // 缺省从第0帧开始播放
        /*this.currentFrameIndex = 0;
        this.currentFrame = this.frames[this.currentFrameIndex];
        // 当前帧是否已经播放完毕
        this.currentFramePlayed = 0;*/
        this.setFrame(0);
    },

    // 设置当前帧
    // 一个frame里面的属性：
    /*
    duration:100
    h    :   60
    w    :    50
    x    :    0
    y    :    0
    * */
    setFrame: function (index) {
        this.currentFrameIndex = index;
        this.currentFrame = this.frames[index];
        this.currentFramePlayed = 0;
    },


    // 更新Animation的状态， deltaTime表示时间的变化量
    update: function (deltaTime) {
        // 判断当前的Frame 是否已经播放完成
        if (this.currentFramePlayed >= this.currentFrame.duration) {

            //播放下一帧
            if (this.currentFrameIndex >= this.frameCount - 1) {
                // 如果当前是最后一帧， 就播放第0帧
                this.currentFrameIndex = 0;
            } else {
                // 播放下一帧
                this.currentFrameIndex++;
            }

            // 设置当前帧的信息
            this.currentFrame = this.frames[this.currentFrameIndex];
            this.currentFramePlayed = 0;
        } else {
            // 增加当前帧的已经播放的时间
            this.currentFramePlayed += deltaTime;
        }
    },

    // 绘制Animation
    draw: function (gc, x, y) {
        var f = this.currentFrame;
        // 开始绘制
        gc.drawImage(this.img, f.x, f.y, f.w, f.h, x, y, f.w, f.h);
    },

}