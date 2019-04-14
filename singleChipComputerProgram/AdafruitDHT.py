#!/usr/bin/python
# Copyright (c) 2014 Adafruit Industries
# Author: Tony DiCola

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
import sys
import pymongo
import Adafruit_DHT
import time

#connect to mongodb
dburl = "mongodb://new-user_0:8551524@monitoringusersverify-shard-00-00-fjxrl.azure.mongodb.net:27017,monitoringusersverify-shard-00-01-fjxrl.azure.mongodb.net:27017,monitoringusersverify-shard-00-02-fjxrl.azure.mongodb.net:27017/deviceMsg?ssl=true&replicaSet=monitoringUsersVerify-shard-0&authSource=admin&retryWrites=true";
client = pymongo.MongoClient(dburl)
db = client.deviceMsg
status = db.status


# Parse command line parameters.
sensor_args = { '11': Adafruit_DHT.DHT11,
                '22': Adafruit_DHT.DHT22,
                '2302': Adafruit_DHT.AM2302 }
if len(sys.argv) == 3 and sys.argv[1] in sensor_args:
    sensor = sensor_args[sys.argv[1]]
    pin = sys.argv[2]
else:
    print('Usage: sudo ./Adafruit_DHT.py [11|22|2302] <GPIO pin number>')
    print('Example: sudo ./Adafruit_DHT.py 2302 4 - Read from an AM2302 connected to GPIO pin #4')
    sys.exit(1)

# Try to grab a sensor reading.  Use the read_retry method which will retry up
# to 15 times to get a sensor reading (waiting 2 seconds between each retry).
while(1):
    humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)#获取传感器数据

    if humidity is not None and temperature is not None:
        status.update({"type":"sensor"},{'$set':{"temperature":temperature}})#温度数据写入云数据库
        status.update({"type":"sensor"},{'$set':{"humidity":humidity}})#湿度诗句写入云数据库
        print('Temp={0:0.1f}*  Humidity={1:0.1f}%'.format(temperature, humidity))#终端输出温湿度值
    else:
        print('Failed to get reading. Try again!')
        sys.exit(1)
    time.sleep(2)#采样频率为两秒
