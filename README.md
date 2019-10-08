# 搭建一个简单的物联网体系
## 功能
通过前端实时监控室内温湿度，控制电器运转。       
用树莓派开发板接了一个温湿度传感器、一台电机、两个LED灯，都是淘宝上几块钱的小器件儿。使用web能分别监测和控制它们。
## web
后端用node写的，账户管理用的Mongodb。    
得解决局域网穿透的问题，树莓派开发板要部署在局域网中，在局域网以外不能通过IP地址直接找到它。我用Mongodb数据库做数据中转，一端将传感器数据和控制量轮询写入数据库，另一端以同样的方式将数据取出。传输延迟1秒左右。
图省事儿前后端通信也是轮询，下次拿socket写个。
## 单片机
rpio是node.js的一个模块，用于对树莓派单片机的编程。singleChipComputerProgram目录下有IO.js、engine.js、sensor.py三个演示脚本。  
sensor.py是传感器控制。将DHT11传感器的信号端接到某个GPIO引脚，例如GPIO.0，正负极分别接5V电和接地，命令行运行Python sensor.py 11 0 即运行温湿度采集，11代表DHT11传感器，0代表GPIO.0引脚。然后温湿度采集就开始了，前端程序跑起来就能看到数据实时变化。
engine.js是直流电机控制。给L298N电机驱动板接5V输入，A通道使能端接树莓派引脚GPIO.29，靠近A通道使能端的两个IO控制接口接GPIO.27、GPIO.28，电机输出端A接到小马达上，树莓派上运行node engine，就在Web前端控制电机了。
IO.js是简单IO控制，用GPIO.4、GPIO.5接两个LED灯然后接地，node IO，就能在前端控制开关灯了。

有一个测试账号：zhangwuji   
密码：emm     


登陆界面：
![Xnip2019-04-14_23-26-09.jpg](https://i.loli.net/2019/05/04/5ccd94418be6c.jpg)


主控界面：
![Xnip2019-05-18_21-09-40.jpg](https://i.loli.net/2019/05/18/5ce0047aa759281728.jpg)

其实主要是想做移动端：
![mobileEnd.jpg](https://i.loli.net/2019/06/01/5cf2147046f5c96067.jpg)

管理员可以增删改账户：
![Xnip2019-05-18_21-24-18.jpg](https://i.loli.net/2019/05/18/5ce007b0b4bb634151.jpg)


点击[管理员权限]:
![03.jpg](https://i.loli.net/2019/05/04/5ccd944169b79.jpg)
