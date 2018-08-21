// 这是一个精灵类（主要用于创建场景中的人物）
/**
 *  精灵对象
 * @param cfg
 * @constructor
 */
function Sprite(cfg) {
    for (var attr in cfg) {
        // 这里是对这个对象的属性参数逐个赋值
        this[attr] = cfg[attr];
    }
}

// 添加原型方法和属性
Sprite.prototype = {
    constructor: Sprite,

    // 精灵的坐标
    x: 0,
    y: 0,
    // 精灵的速度
    speedX: 0,
    speedY: 0,

    acceY: 0,

    // 生命值
    HP : 100,

    // 精灵的坐标区间
    minX: 0,
    maxX: 9999,
    minY: 0,
    maxY: 9999,

    // 精灵包含的所有Animation集合， Object类型，数据存放方式为：“id : animation”
    anims: null,
    // 默认的Animation的Id， string类型
    defaultAnimId: null,

    // 当前的Animation
    currentAnim: null,


    // 初始化方法
    init: function () {
        // 初始化所有的Animation， 先把所有的动画取出来
        for (var animId in this.anims) {
            var anim = this.anims[animId];
            anim.id = animId;
            // 初始化，反复调用（Animation的init（）方法）
            anim.init();
        }

        // 设置当前的Animation
        this.setAnim(this.defaultAnimId);
    },

    // 设置当前的Animation， 参数为Animatio的ID， string类型
    /**
     *  这里根据animId也就是walk-left,walk-right的任意一个，获得这个动画里面的额所有参数
     * @param animId
     */
    setAnim: function (animId) {
        this.currentAnim = this.anims[animId];

        // 重置Animation的状态， 设置为0帧
        this.currentAnim.setFrame(0);
    },

    // 更新精灵当前的状态
    update: function (deltaTime) {
        // 每次循环，改变一下绘制的坐标
        this.x = this.x + this.speedX * deltaTime;


        // 物体竖直方向上抛运动， 根据速度 时间来计算位移
        // V = v0 + a*t
        var newSpeedY = this.speedY + this.acceY * deltaTime;
        // Math.round就是四舍五入， 速度*时间 = 距离
        this.y = Math.round(this.y + (this.speedY + newSpeedY) / 2 * deltaTime);
        // 更新速度
        this.speedY = newSpeedY;


        //this.y = this.y + this.speedY * deltaTime;
        //限定移动的范围
        this.x = Math.max(this.minX, Math.min(this.x, this.maxX));
        this.y = Math.max(this.minY, Math.min(this.y, this.maxY));

        // 如果当前的animation 不是空的
        if (this.currentAnim) {
            // 这是当前的帧， 让动画去更新
            this.currentAnim.update(deltaTime);
        }
    },

    // 绘制精灵
    // 把绘制的句柄context传进来就可以了
    draw: function (gc) {
        if (this.currentAnim) {

            // 这里去调用这个动画的绘制函数
            this.currentAnim.draw(gc, this.x, this.y);
        }
    },

    // 对这个精灵增加两个方法， 主要实现精灵之间的碰撞检测的
    //1.获得精灵的碰撞区域
    getCollideRect: function () {
        if (this.currentAnim) {
            // 先拿到当前的帧
            var f = this.currentAnim.currentFrame;
            // 把当前帧的区域返回出去(当前帧的那一个图片区域范围)
            return {
                x1: this.x,
                y1: this.y,
                x2: this.x + f.w,
                y2: this.y + f.h
            }
        }
    },

    //2.  判断是否和另一个精灵发生了碰撞
    // 这里的sprite2 作为参数传进来的实际上是玩家本人palyer
    collideWidthOther: function (sprite2) {
        // 1.首先拿到其他每一个敌人的矩形区域
        var rect1 = this.getCollideRect();
        // 2. 拿到玩家本人当前的矩形区域范围
        var rect2 = sprite2.getCollideRect();

        if (rect1 && rect2) {
            // 开始判断
            if (rect1.x1 > rect2.x2 || rect1.y1 > rect2.y2 || rect1.x2 < rect2.x1 || rect1.y2 < rect2.y1) {
                // 说明没有碰撞
                return false;
            } else {
                // 其他所有的情况都是发生了碰撞
                return true;
            }
        }

    }


};
