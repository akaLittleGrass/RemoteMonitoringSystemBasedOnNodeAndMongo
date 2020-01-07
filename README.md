# 一个简单的物联网体系
## 功能
通过web前端实时监控室内温湿度，控制电器运转。       
原理就是用树莓派开发板控制一个温湿度传感器、一台电机、两个LED灯，并使用web与之通信。
## web
前端vue、element-ui、echarts，后端用node.js，数据库用Mongo。    
需要解决局域网穿透的问题，因为树莓派开发板部署在局域网中，手机电脑若在局域网以外则不能通过IP地址直接找到它。为了节省一台代理服务器，我用Mongo数据库做数据中转，一端将传感器数据和控制量轮询写入数据库，另一端轮询读取。传输延迟1秒左右。
## 单片机程序
rpio是node.js的一个模块，用于对树莓派单片机的编程。singleChipComputerProgram目录下有IO.js、engine.js、sensor.py三个演示脚本。  

sensor.py是传感器控制。将DHT11传感器的信号端接到某个GPIO引脚，例如GPIO.0，正负极分别接5V电和接地，命令行运行Python sensor.py 11 0 即运行温湿度采集，11代表DHT11传感器，0代表GPIO.0引脚。然后温湿度采集就开始了，前端程序跑起来就能看到数据实时变化。        

engine.js是直流电机控制。给L298N电机驱动板接5V输入，A通道使能端接树莓派引脚GPIO.29，靠近A通道使能端的两个IO控制接口接GPIO.27、GPIO.28，电机输出端A接到小马达上，树莓派上命令行运行node engine，即可在前端控制电机。         

IO.js是简单IO控制，用GPIO.4、GPIO.5接两个LED灯然后接地，命令行运行node IO，即可在前端控制两个LED灯。

一个测试账号：zhangwuji   
密码：emm     


实物图：
<div align='center'>
  <img src='https://i.loli.net/2019/12/04/KHIeXqLuoxvVGMh.png' height='400px' width='500px'>
</div>


登陆界面：
<div align='center'>
  <img src='https://i.loli.net/2019/05/04/5ccd94418be6c.jpg' width='750px'>
</div>

主控界面：
<div align='center'>
  <img src='https://i.loli.net/2019/05/18/5ce0047aa759281728.jpg' width='750px'>
</div>

其实主要是想做移动端：
<div align='center'>
  <img src='https://i.loli.net/2019/06/01/5cf2147046f5c96067.jpg' width='750px'>
</div>

管理员可以增删改账户：
<div align='center'>
  <img src='https://i.loli.net/2019/05/18/5ce007b0b4bb634151.jpg' width='750px'>
</div>

点击[管理员权限]：
<div align='center'>
  <img src='https://i.loli.net/2019/05/04/5ccd944169b79.jpg' width='750px'>
</div>