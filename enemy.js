// 完成敌人角色的封装
/**
 *
 * @returns {Sprite}
 */
function createEnemy() {

    // 先拿到一个0或者1的数字, 要么是0， 要么是1
    var r = genRandom(0, 1);
    var cfg = {
        img: "enemy",


        // 随机数如果是1， x坐标为500， 如果是0， x坐标为0
        // 实现敌人从场景的两边出现的效果
        x: r ? 500 : 0,
        y: Math.random() * 500,


        // 定义Xy坐标的最大值和最小值，用来限定移动的范围
        minX: 0,
        maxX: 1024,
        minY: 0,
        maxY: 512,


        // 处理键盘事件（实现敌人角色的左右移动）
        handleInput: function () {
            // 先生成一个-4到4之间的整数随机数
            var s = genRandom(-4, 4);
            // 定义移动速度（这个移动的速度是随机分配的）
            var moveSpeed = (150 + s * 10) / 1000;

            this.speedX = this.speedX || moveSpeed;
            // 如果已经移动到了左边的边界
            if (this.x <= this.minX) {
                this.x = this.minX;
                // 开始向右移动
                this.speedX = moveSpeed;
            } else if (this.x >= this.maxX) {
                this.x = this.maxX;
                // 开始向左移动
                this.speedX = -moveSpeed;
            }
        },

        // 定义默认的动画
        defaultAnimId: "move",
        anims: {
            "move": new Animation({
                img: "enemy",
                frames: [
                    {x: 0, y: 0, w: 50, h: 50, duration: 100},
                    {x: 50, y: 0, w: 50, h: 50, duration: 100},
                    {x: 100, y: 0, w: 50, h: 50, duration: 100},
                    {x: 150, y: 0, w: 50, h: 50, duration: 100}
                ]
            })
        }
    };


    // 把新建的这个敌人角色添加进去
    return new Sprite(cfg);
}