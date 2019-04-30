import sys
import pymongo
import Adafruit_DHT
import time

dburl = "mongodb://new-user_0:553744@monitoringusersverify-shard-00-00-fjxrl.azure.mongodb.net:27017,monitoringusersverify-shard-00-01-fjxrl.azure.mongodb.net:27017,monitoringusersverify-shard-00-02-fjxrl.azure.mongodb.net:27017/deviceMsg?ssl=true&replicaSet=monitoringUsersVerify-shard-0&authSource=admin&retryWrites=true";
client = pymongo.MongoClient(dburl)
db = client.deviceMsg
status = db.status

sensor_args = { '11': Adafruit_DHT.DHT11,#11号引脚连到DHT11温湿度传感器的信号端
                '22': Adafruit_DHT.DHT22,
                '2302': Adafruit_DHT.AM2302 }
if len(sys.argv) == 3 and sys.argv[1] in sensor_args:
    sensor = sensor_args[sys.argv[1]]
    pin = sys.argv[2]
else:
    print('Usage: sudo ./Adafruit_DHT.py [11|22|2302] <GPIO pin number>')
    print('Example: sudo ./Adafruit_DHT.py 2302 4 - Read from an AM2302 connected to GPIO pin #4')
    sys.exit(1)

while(1):
    humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)#获取传感器数据

    if humidity is not None and temperature is not None:
        status.update({"type":"sensor"},{'$set':{"temperature":temperature}})#温度数据写入云数据库
        status.update({"type":"sensor"},{'$set':{"humidity":humidity}})#湿度数据写入云数据库
        print('Temp={0:0.1f}*  Humidity={1:0.1f}%'.format(temperature, humidity))#终端输出温湿度值
    else:
        print('Failed to get reading. Try again!')
        sys.exit(1)
    time.sleep(2)#采样频率为两秒
