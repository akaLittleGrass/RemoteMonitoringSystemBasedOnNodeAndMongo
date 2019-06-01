# 搭建一个简单的物联网体系
## 功能
通过前端实时监控室内温湿度，控制电器运转。       
用树莓派开发板接了一个温湿度传感器、一台电机、两个LED灯，部署在远端，使用web能分别监测和控制它们。
## web
后端用node写的，账户管理用的Mongodb。    
得解决局域网穿透的问题，树莓派开发板要部署在局域网中，在局域网以外不能通过IP地址直接找到它。条件有限，没法用代理服务器，所以用Mongodb数据库做数据中转。一端将传感器数据和控制量轮询写入数据库，另一端以同样的方式将数据取出。传输延迟平均1秒左右，还凑合吧。
## 单片机
rpio是node.js的一个模块，用于对树莓派单片机的编程。singleChipComputerProgram目录下用rpio写了IO.js和engine.js两个脚本，用node命令运行就能跟前端对接上了。传感器因为不兼容所以改用python写，直接Python xxx(文件名)。
各脚本文件对应各类设备。   
例如sensor.py这个文件，将DHT11传感器的信号端接到某个GPIO引脚，例如GPIO 4，正负极分别接5V电和接地，命令行运行Python sensor.py 11 4即运行温湿度采集，11代表DHT11传感器，4代表GPIO 4引脚。然后温湿度采集就开始了，前端能收到数据。
IO.js和engine.js用的引脚号是写在代码里的，得按照代码的定义的引脚号去接线。
## 使用
npm i

测试账号：zhangwuji   
密码：emm   
前端src/utils/request.js中的请求的域名端口号是否与后端所在的一致    


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
