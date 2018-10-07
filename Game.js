// 完成Game类的封装
function Game(cfg) {
    for (var attr in cfg) {
        // 这里的this指的就是Game的对象
        this[attr] = cfg[attr];
    }
}

// 定义原型方法和属性
Game.prototype = {
    constructor: Game,

    // 游戏画布的初始化(这个是游戏画布的默认宽度和高度)
    width: 640,
    height: 480,

    // 画布canvas和绘图句柄gc(在构造函数中已经完成了初始化)
    canvas: null,
    gc: null,

    // 帧速率和时间间隔
    FPS: 40,
    sleep: 0,

    // 游戏中的精灵
    sprites: null,

    // 游戏中的运动的背景

    skyOffset: 0,
    grassOffset: 0,
    treeOffset: 0,
    nearTreeoffset: 0,

    TREE_VELOCITY: 20,
    FAST_TREE_VELOCITY: 40,
    SKY_VELOCITY: 8,
    GRASS_VELOCITY: 75,

    lastTime: 0,

    lastUpdateFPS: 0,
    lastUpdateTime: 0,


    // 游戏场景的初始化(主要场景参数的初始化处理)
    init: function () {
        // 直接手动创建canvas元素
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;


        document.body.appendChild(this.canvas);


        // 设置我的绘图句柄
        this.gc = this.canvas.getContext("2d");

        // 初始化键盘的事件
        this.initEvent();

        // 帧速率不为空，设置我的间隔时间
        if (this.FPS) {
            this.sleep = Math.floor(1000 / this.FPS);
        }

        // 当前的精灵(要么是自己， 要么是一个空数组)
        this.sprites = this.sprites || [];
        // 对每一个精灵完成初始化
        for (var i = 0, len = this.sprites.length; i < len; i++) {
            this.sprites[i].init();
        }

    },

    // 初始化键盘的事件
    initEvent: function () {
        // 按下按键
        document.addEventListener("keydown", function (ev) {
            keyState[ev.keyCode] = true;
            console.log(keyState);
        }, true);

        // 松开按键
        document.addEventListener("keyup", function (ev) {
            keyState[ev.keyCode] = false;
            console.log(keyState);
        }, true);
    },

    // 游戏开始， 就进入到主循环
    start: function () {
        // this指向的是Game这个对象
        var Me = this;

        // 记录一下，游戏开始的时间
        Me.startTime = Date.now();


        // 主循环
        this.mainLoop = setInterval(function () {
            // 距离上一次间隔的时间
            var deltaTime = Me.sleep;

            // 在主循环的执行过程中来实现碰撞检测的功能(一直在不断地检测是否发生了碰撞)
            Me.run(deltaTime);


        }, Me.sleep);

    },

    // 主循环中需要执行的操作
    run: function (deltaTime) {
        // 显示当前游戏持续进行的时间(玩家在这个游戏中持续的时间就是他的分数)
        var playedTime = Date.now() - this.startTime;
        // 在主界面上面显示时间（span标签）
        document.getElementById("timeCount").innerHTML = playedTime.toString();
        document.getElementById("lifeCount").innerHTML = this.sprites[0].HP.toString();

        // 开始碰撞检测
        var coll = this.checkCollide();
        // 只要coll不为空， 就说明有其他玩家和我发生了碰撞
        if (coll) {
            // 如果发生敌人和玩家的碰撞， 就结束游戏(有三个生命值)
            if (this.sprites[0].HP > 0) {
                this.sprites[0].HP--;
                game.playSingleMusic('kill', './audio/踩敌人.mp3');
            }
        }
        // 我是精灵角色中的第0个角色，直接得到我的生命值并显示
        document.getElementById("lifeCount").innerHTML = this.sprites[0].HP.toString();

        if (this.sprites[0].HP == 0) {
            // 1. 清空主循环中的定时器
            clearInterval(this.mainLoop);
            document.getElementById('music').innerHTML = '';
            game.playSingleMusic('end', './audio/游戏结束.mp3');
            alert("Game Over.\n Your score : " + playedTime);
            document.getElementById('score').innerHTML = '<span style="color: red;">您的最终得分：'+playedTime.toString()+'</span>';
            // 2.直接退出程序
            return;
        }


        // 更新画布
        this.update(deltaTime);
        // 清空画布
        this.clear(deltaTime);
        // 重绘画布
        this.draw(deltaTime);


        // 进入主循环之后， 还要不断地处理接收键盘事件
        this.handleInput();
    },

    // 开始实现碰撞的检测， 返回true就表示发生了玩家和敌人的碰撞
    checkCollide: function () {
        // 1.拿到我的玩家这个对象
        var player = this.sprites[0];
        //  注意这里是从第一个场景中的人物和我来逐一检测（我是第0个人物， 其他的都是敌人）
        for (var i = 1, len = this.sprites.length; i < len; i++) {
            var sprite = this.sprites[i];
            // 对于游戏场景中的除了自己的其他所有的精灵和我一一进行碰撞检测
            var coll = sprite.collideWidthOther(player);
            if (coll) {
                return coll;
            }
        }
        return false;
    },

    // 更新精灵的状态
    update: function (deltaTime) {
        for (var i = 0, len = this.sprites.length; i < len; i++) {
            var sprite = this.sprites[i];
            // 开始更新每一个精灵的坐标状态（运动状态信息）
            sprite.update(deltaTime);
        }
    },

    // 清空画布信息
    clear: function () {
        // 清空画布
        this.gc.clearRect(0, 0, this.canvas.width, this.canvas.height);

        var fps = this.caculateFPS();
        this.fps = fps;

        // 显示帧速率到画布上面
        var now = Date.now();
        if (now - this.lastUpdateTime > 1000) {
            this.lastUpdateTime = now;
            this.lastUpdateFPS = fps;

            document.getElementById("fps").innerText = this.lastUpdateFPS.toFixed();
        }


        this.initGameMap();

    },

    // 绘制背景地图
    initGameMap: function () {
        var fps = this.fps;

        // 实现移动的位移量
        this.skyOffset = this.skyOffset < this.canvas.width ?
            this.skyOffset + this.SKY_VELOCITY / fps : 0;

        this.grassOffset = this.grassOffset < this.canvas.width ?
            this.grassOffset + this.GRASS_VELOCITY / fps : 0;

        this.treeOffset = this.treeOffset < this.canvas.width ?
            this.treeOffset + this.TREE_VELOCITY / fps : 0;

        this.nearTreeOffset = this.nearTreeOffset < this.canvas.width ?
            this.nearTreeOffset + this.FAST_TREE_VELOCITY / fps : 0;

        var sky = ImgCache["sky"],
            tree = ImgCache["tree-twotrunks"],
            nearTree = ImgCache["smalltree"],
            grass = ImgCache["grass"],
            grass2 = ImgCache["grass2"];

        this.gc.save();
        this.gc.translate(-this.skyOffset, 0);
        this.gc.drawImage(sky, 0, 0);
        this.gc.drawImage(sky, sky.width - 2, 0);
        this.gc.restore();

        this.gc.save();
        this.gc.translate(-this.treeOffset, 0);
        this.gc.drawImage(tree, 100, 240);
        this.gc.drawImage(tree, 1100, 240);
        this.gc.drawImage(tree, 400, 240);
        this.gc.drawImage(tree, 1400, 240);
        this.gc.drawImage(tree, 700, 240);
        this.gc.drawImage(tree, 1700, 240);
        this.gc.restore();

        this.gc.save();
        this.gc.translate(-this.nearTreeOffset, 0);
        this.gc.drawImage(nearTree, 250, 240);
        this.gc.drawImage(nearTree, 1250, 240);
        this.gc.drawImage(nearTree, 800, 240);
        this.gc.drawImage(nearTree, 1800, 240);
        this.gc.restore();

        this.gc.save();
        this.gc.translate(-this.grassOffset, 0);

        this.gc.drawImage(grass, 0, this.canvas.height - grass.height);

        this.gc.drawImage(grass, grass.width - 5,
            this.canvas.height - grass.height);

        this.gc.drawImage(grass2, 0, this.canvas.height - grass2.height);

        this.gc.drawImage(grass2, grass2.width,
            this.canvas.height - grass2.height);
        this.gc.restore();
    },

    // 绘制背景滚动的效果
    caculateFPS: function (now) {
        if (now == undefined) {
            now = Date.now();
        }

        var fps = 1000 / (now - this.lastTime);
        this.lastTime = now;
        return fps;
    },


    // 开始重新绘制精灵
    draw: function (deltaTime) {
        for (var i = 0, len = this.sprites.length; i < len; i++) {
            var sprite = this.sprites[i];
            // 开始绘制
            sprite.draw(this.gc);
        }

    },


    // 游戏中的处理用户的输入
    handleInput: function () {
        for (var i = 0, len = this.sprites.length; i < len; i++) {
            var sprite = this.sprites[i];
            // 先判断一下，这个精灵有没有handleInput属性
            if (sprite.handleInput) {
                // 如果这个精灵有这个属性或者方法的话， 就去调用精灵自己的处理函数
                sprite.handleInput();
            }
        }
    },


    // 游戏音乐
    playMusic : function(id, url) {
        document.getElementById(id).innerHTML = '<audio autoplay="autoplay" controls="controls" loop="loop" preload="auto" style="display: none" \n' +
            '            src="'+url+'">\n' +
            '                你的浏览器版本太低，不支持游戏场景音乐\n' +
            '            </audio>';
    },

    // 不循环
    playSingleMusic : function (id, url) {
        document.getElementById(id).innerHTML = '<audio autoplay="autoplay" controls="controls"  preload="auto" style="display: none" \n' +
            '            src="'+url+'">\n' +
            '                你的浏览器版本太低，不支持游戏场景音乐\n' +
            '            </audio>';
    }
}