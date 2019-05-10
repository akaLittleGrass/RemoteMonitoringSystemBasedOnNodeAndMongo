# 基于node.js的远程监控系统
## 功能
与树莓派开发板相连接的温湿度传感器的数值实时推送到web端，现场设备如电机、LED亦可通过web操纵。也适配了移动端。
## web端
后端用node写的，账户管理用的Mongodb。    
需要解决局域网穿透的问题，由于树莓派开发板要部署在局域网中，在局域网以外不能通过IP地址直接找到它，所以用Mongodb数据库做数据中转。一端以http轮询将传感器数据或控制量写入数据库，另一端以同样的方式将数据取出。传输延迟平均1秒左右，还可以啦。
## 树莓派单片机端
rpio是node.js的一个模块，用于对树莓派单片机的编程。singleChipComputerProgram目录下用rpio编写了各种各样的js脚本文件，用node直接运行即可。部分硬件因为不兼容所以改用python编写脚本，用Python运行即可。
各脚本文件名对应各类设备。相关引脚号各脚本文件中已用注释标明，可按既定引脚连接也可以自行修改引脚号。   
例如AdafruitDHT.py文件定义的是11号引脚，将DHT11传感器的信号端接到树莓派的11号引脚，正负极分别接5V电和接地，即匹配了该脚本，命令行运行Python AdafruitDHT.py 11 17即可将温湿度信号以2秒间隔采样并写入Mongodb之中，web端会将数据轮询读出并显示在图表上。
## 使用
测试账号：zhangwuji   
密码：emm   
注意前端src/utils/request.js中的请求的域名端口号是否与后端程序运行的一致    
如果登陆不上，大概率是因为连接Mongodb失败，通常由网络原因导致，重启后端程序能解决😓…………


登陆界面：
![Xnip2019-04-14_23-26-09.jpg](https://i.loli.net/2019/05/04/5ccd94418be6c.jpg)


主控界面：
![Xnip2019-05-10_17-06-19.jpg](https://i.loli.net/2019/05/10/5cd5419824657.jpg)

管理员可以增删改账户：
![Xnip2019-05-10_17-03-42.jpg](https://i.loli.net/2019/05/10/5cd541981d60e.jpg)


点击[管理员权限]:
![03.jpg](https://i.loli.net/2019/05/04/5ccd944169b79.jpg)
