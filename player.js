// 完成玩家角色的封装
// 专门定义一个创建角色的函数
/**
 *
 * @returns {Sprite}
 */
function createPlayer() {
    // 把角色创建需要的参数，利用json数据格式存起来
    var cfg = {
        // 通过json格式把数据传过去
        // 初始的坐标位置
        x: 250,
        y: 284,

        // 移动速度
        speedX: 0,
        speedY: 0,
        // 初始化一个加速度
        acceY: 0,

        // Y坐标的最大值和最小值， 用来限定移动的范围
        minX: 0,
        maxX: 900,
        minY: 0,
        maxY: 410,

        // 定义走路速度的绝对值
        walkSpeed : 200/1000,

        //定义跳跃初速度,垂直加速度
        jumpSpeed : -700/1000,
        acceY : 1.0/1000,



        // 默认的移动帧
        defaultAnimId: "stand-right",

        // 定义两个帧Animation, 一个向左走， 一个向右走
        anims: {
            // 再次定义两个帧， 一个是玩家站着方向向左， 一个是向右
            "stand-left": new Animation({
                img: "player",
                frames: [
                    {x: 0, y: 60, w: 50, h: 60, duration: 100}
                ]
            }),

            "stand-right": new Animation({
                img: "player",
                frames: [
                    {x: 0, y: 0, w: 50, h: 60, duration: 100}
                ]
            }),

            // 向左移动的动画
            "walk-left": new Animation({
                img: "player",
                // 这个动画由三帧组成， 对应图片中的第一行
                frames: [
                    // 图片的第二行
                    {x: 0, y: 60, w: 50, h: 60, duration: 100},
                    {x: 50, y: 60, w: 50, h: 60, duration: 100},
                    {x: 100, y: 60, w: 50, h: 60, duration: 100}
                ]
            }),
            "walk-right": new Animation({
                img: "player",
                // 这个动画由三帧组成， 对应图片中的第一行
                frames: [
                    {x: 0, y: 0, w: 50, h: 60, duration: 100},
                    {x: 50, y: 0, w: 50, h: 60, duration: 100},
                    {x: 100, y: 0, w: 50, h: 60, duration: 100}
                ]
            })
        },

        // 获得用户当前的朝向（返回left, right）
        getDirx : function () {
            var dirX = this.currentAnim.id.split("-")[1];
            return dirX;
        },

        // 添加一个处理用户的按键做出响应的操作
        // 更具按键做出不同的移动
        handleInput: function () {
            // 注意这里的大小写要完全一致
            var left = keyState[key.A];
            var right = keyState[key.D];
            var up = keyState[key.W];

            // 获得用户当前的面对的方向(得到了一个字符串)
            var dirX = this.getDirx();


            // 判断玩家有没有落地
            // 如果玩家落地的话
            if (this.y == this.maxY) {
                // 站在地上(为对象添加一个属性)
                this.jumping = false;
                this.speedY = 0;
                this.setAnim("walk-" + dirX);
            }

            // 如果用户按下了上按键, 而且当前没有在跳跃中
            if (up && !this.jumping) {
                console.log("jump!");
                this.jumping = true;
                this.speedY = this.jumpSpeed;
                // 设置动画与当前的方向一致
                this.setAnim("walk-" + dirX);
            }


            // 如果用户同时按下左键和右键， 或者都没有按下【水平方向的速度为0】
            if ((left && right) || (!left && !right)) {
                this.speedX = 0;

                // 如果没有在跳跃中 玩家就进入到战力状态
                if (!this.jumping) {
                    // 说明玩家已经落地了
                    this.setAnim("walk-" + dirX);
                }
            }
            // 如果按下了左键， 而且当前不是向左走, 就向左走
            else if (left && this.speedX != -this.walkSpeed) {
                console.log("left!");
                this.setAnim("walk-left");
                // 这里的speed属性已经封装到了买这个createPlayer构造函数中去了
                this.speedX = -this.walkSpeed//-sprite.walkSpeed;
            }
            // 如果按下了右， 且当前不是向右走， 就设置为向右走
            else if (right && this.speedX != this.walkSpeed) {
                console.log("right!");
                this.setAnim("walk-right");
                this.speedX = this.walkSpeed;
            }
        }

    };

    // 返回创建的角色
    return new Sprite(cfg);
}