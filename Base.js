/**
 *   { } 大括号，表示定义一个对象，大部分情况下要有成对的属性和值，或是函数
 [ ]中括号，表示一个数组，也可以理解为一个数组对象
 * @param srcList
 * @param callback
 * @returns {{}}
 */
// 自定义一个图片加载的函数，callback为所有的图片加载完成之后的回调函数
function loadImage(srcList, callback) {
    // 定义一个图片数组，用于返回结果,{}这种数据类型表示用来存储json数据格式
    var imgs = {};
    // 求出传过来的图片数量
    var totalCount = srcList.length;
    // 已经加载完成的图片初始为1
    var loadedCount = 0;
    for (var i = 0; i < totalCount; i++) {
        var img = srcList[i];
        // 创建图片对象
        var image = imgs[img.id] = new Image();
        image.src = img.url;

        // 开始加载
        image.onload = function () {
            loadedCount++;
        }
    }

    // 开始处理回调函数
    if (typeof callback == "function") {
        // 这里的this实际上指的是this对象，是window对象
        var self = this;

        function check() {
            // 如果已经加载完毕
            if (loadedCount >= totalCount) {
                // callback 是一个函数，function startDemo(){}
                // self是函数体内对象的指向, 指向window对象
                callback.apply(self, arguments);
            } else {
                // 没有加载完毕
                setTimeout(check, 100);
            }
        }

        // 开始反复检查图片有么有加载完毕
        check();
    }
    return imgs;
}


/**
 * 得到闭区间里面的一个随机数
 * @param lower
 * @param higher
 */
function genRandom(lower, higher) {
    lower = lower || 0;
    higher = higher || 9999;

    // 先来生成一个[0, higgher-lower+1)之间的随机数（整数）
    // 然后两端加一得：[0 , higher-lower+1+1), 也就是[0, higher-lower+1]之间的随机数
    return Math.floor((higher - lower + 1) * Math.random()) + lower;
}


// 定义一个全局变量
var ImgCache = null;

// 记录按键的状态
var keyState = {};