<template>
  <div class="root">
    <header class="top-bar">
      <section>
        <h1>Remote Monitoring System</h1>
      </section>
      <div class="state">
        <ul v-if="user" class="pc-menu">
          <li>{{this.user}}</li>
          <li @click="showManageTag" class="user-type" v-if="userType === 'master'">[管理员权限]</li>
          <li class="log-btn" @click="logout">
            <img src="../assets/16pxlogout.svg" alt="logout" />
            <span>退出登陆</span>
          </li>
        </ul>
        <ul v-else class="pc-menu">
          <li class="log-btn" @click="goToLogin">点击登录</li>
        </ul>
        <div @click="toggleMobileMenu" class="mobile-menu-btn mobile-show">
          <img src="../assets/menu.svg" alt="mobile-menu" />
        </div>
      </div>
    </header>
    <div class="mobile-nav-bar mobile-show" :class="{mobileMenuShow: !showMobileMenu}">
      <ul v-if="user">
        <li>
          {{this.user}}
          <span @click="showManageTag" class="user-type" v-if="userType === 'master'">[管理员权限]</span>
        </li>
        <li @click="logout" class="log-btn">
          <img src="../assets/16pxlogout.svg" alt="logout" />
          <span style="font-size:17px;">退出登陆</span>
        </li>
      </ul>
      <ul v-else>
        <li @click="goToLogin">点击登陆</li>
      </ul>
    </div>
    <div class="operation-area" v-if="user">
      <div class="device-btn">
        <span class="device-detail">「一号设备」 当前状态：{{IO1Status?'开启':'关闭'}}</span>
        <el-button type="info" @click="setDeviceStatus('device1')">{{IO1Status?'关闭':'开启'}}</el-button>
      </div>
      <div class="device-btn">
        <span class="device-detail">「二号设备」 当前状态：{{IO2Status?'开启':'关闭'}}</span>
        <el-button type="info" @click="setDeviceStatus('device2')">{{IO2Status?'关闭':'开启'}}</el-button>
      </div>
      <div class="device-btn">
        <span class="device-detail">「直流电机」 当前状态：{{motorIsOn?'开启':'关闭'}}</span>
        <el-button type="info" @click="setDeviceStatus('device3')">{{motorIsOn?'关闭':'开启'}}</el-button>
      </div>
      <div class="device-btn">
        <span class="device-detail">「电机转速」 当前状态：{{motorIsOn?isSlow?'慢速':'快速':'——'}}</span>
        <el-button type="info" :disabled="!motorIsOn" @click="setDeviceStatus('speed')">切换</el-button>
      </div>
      <div class="device-btn">
        <span class="device-detail">「电机转向」 当前状态：{{motorIsOn?isForward?'正向':'反向':'——'}}</span>
        <el-button type="info" :disabled="!motorIsOn" @click="setDeviceStatus('direction')">切换</el-button>
      </div>
    </div>
    <div id="number-bar" v-if="user">
      温度值：{{temperature}}°C&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;湿度值：{{humidity}}%
      <br />
      <span class="time-stamp">{{timeStamp}}</span>
    </div>
    <div id="chart" ref="chartContainner" class="operation-area" v-if="user"></div>
    <div v-if="!user" class="notice">请登陆</div>
    <el-dialog title="管理员权限" :visible.sync="manageTagShow" :center="true" :fullscreen="true">
      <el-dropdown @command="setOpType">
        <span class="el-dropdown-link">
          {{manageOpType}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="修改密码">修改密码</el-dropdown-item>
          <el-dropdown-item command="添加用户">添加用户</el-dropdown-item>
          <el-dropdown-item command="删除用户">删除用户</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="input-box">
        <div class="input-item">
          要编辑的用户名：
          <el-input v-model="inputUserName" placeholder="请输入用户名"></el-input>
        </div>
        <div class="input-item">
          密码：
          <el-input :disabled="manageOpType === '删除用户'" v-model="inputPassWord" placeholder="请输入密码"></el-input>
        </div>
        <div class="input-item">
          账户类型：
          <el-radio
            :disabled="manageOpType !== '添加用户'"
            v-model="inputUserType"
            label="master"
          >master</el-radio>
          <el-radio
            :disabled="manageOpType !== '添加用户'"
            v-model="inputUserType"
            label="worker"
          >worker</el-radio>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="manageTagShow = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import request from "../utils/request";

const echarts = require("echarts");

export default {
  name: "operation",
  data() {
    return {
      user: "",
      userType: "",
      showMobileMenu: false,
      manageTagShow: false,
      manageOpType: "修改密码",
      inputUserName: "",
      inputPassWord: "",
      inputUserType: "",
      IO1Status: false,
      IO2Status: false,
      motorIsOn: false,
      isSlow: false,
      isForward: false,
      temperature: "",
      humidity: "",
      timeStamp: ""
    };
  },
  mounted: function() {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["token"] = token;
      request("/users/verify", "GET").then(response => {
        if (response.status === 200) {
          this.user = response.data.userName;
          this.userType = response.data.type;
          localStorage.setItem("token", response.data.token);
        }
      });
    }
    request("/device/find", "GET").then(response => {
      if (response.status === 200) {
        const deviceList = response.data;
        for (let value of deviceList) {
          switch (value.id) {
            case "device1":
              this.IO1Status = value.status;
              break;
            case "device2":
              this.IO2Status = value.status;
              break;
            case "device3":
              this.motorIsOn = value.status;
              this.isSlow = value.isSlow;
              this.isForward = value.isForward;
              break;
          }
        }
        this.drawLine();
      }
    });
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.goToLogin();
    },
    goToLogin() {
      this.$router.push({
        path: "/login"
      });
    },
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu;
    },
    showManageTag() {
      this.manageTagShow = !this.manageTagShow;
    },
    setOpType(type) {
      this.manageOpType = type;
    },
    editUserInfo() {
      let path;
      const data = {
        userName: this.inputUserName,
        passWord: this.inputPassWord,
        type: this.inputUserType
      };
      switch (this.manageOpType) {
        case "修改密码":
          path = "/users/update";
          delete data.type;
          break;
        case "添加用户":
          path = "/users/insert";
          break;
        case "删除用户":
          path = "/users/delete";
          delete data.passWord;
          delete data.type;
          break;
      }
      request(path, "POST", data).then(response => {
        if (response.data.result === "succeed") {
          this.manageTagShow = false;
          this.showMobileMenu = false;
          this.$message({
            message: "操作成功",
            type: "success",
            customClass: "messageBox"
          });
        }
      });
    },
    setDeviceStatus(deviceId) {
      let deviceStatus;
      let setSpeed;
      let setDirection;
      switch (deviceId) {
        case "device1":
          deviceStatus = !this.IO1Status;
          break;
        case "device2":
          deviceStatus = !this.IO2Status;
          break;
        case "device3":
          deviceStatus = !this.motorIsOn;
          break;
        case "speed":
          setSpeed = {
            id: "device3",
            isSlow: !this.isSlow
          };
          break;
        case "direction":
          setDirection = {
            id: "device3",
            isForward: !this.isForward
          };
      }
      const path = "/device/setDevice";
      const data = {
        id: deviceId,
        status: deviceStatus
      };
      request(path, "POST", setSpeed || setDirection || data).then(response => {
        if (response.data === "succeed") {
          switch (deviceId) {
            case "device1":
              this.IO1Status = !this.IO1Status;
              break;
            case "device2":
              this.IO2Status = !this.IO2Status;
              break;
            case "device3":
              this.motorIsOn = !this.motorIsOn;
              break;
            case "speed":
              this.isSlow = !this.isSlow;
              break;
            case "direction":
              this.isForward = !this.isForward;
          }
        } else {
          this.$message({
            message: "操作失败",
            type: "warning",
            customClass: "messageBox",
            duration: 1500
          });
        }
      });
    },
    drawLine() {
      const temData = [];
      const humData = [];
      const chartOption = {
        title: { text: "温湿度(%)" },
        legend: {
          data: ["温度", "湿度"]
        },
        tooltip: { trigger: "axis" },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [1, 2, 3, 4, 5, 6]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "温度",
            type: "line",
            data: temData
          },
          {
            name: "湿度",
            type: "line",
            data: humData
          }
        ]
      };
      const chartContainner = this.$refs.chartContainner;
      if (chartContainner) {
        let chart = echarts.init(chartContainner);
        chart.setOption(chartOption);
        setInterval(function() {
          request("/device/read", "GET").then(response => {
            if (response.data.temperature && response.data.humidity) {
              this.temperature = response.data.temperature;
              this.humidity = response.data.humidity;
              this.timeStamp = new Date();
              if (temData.length === 6) temData.shift();
              temData.push(response.data.temperature);
              if (humData.length === 6) humData.shift();
              humData.push(response.data.humidity);
              chart.setOption({
                series: [
                  {
                    seriesIndex: 0,
                    data: temData
                  },
                  {
                    seriesIndex: 1,
                    data: humData
                  }
                ]
              });
            }
          });
        }, 2000);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.root {
  background-color: #fdfdfd;
  font: 25px "Helvetica Neue", "Open Sans", sans-serif;
}
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  background: #eee;
  width: 100%;
  height: 55px;
  z-index: 100;
  border-bottom: 1px solid #ddd;
}
h1 {
  display: block;
  position: fixed;
  top: 2px;
  margin: 0;
  padding: 10px 25px;
  width: auto;
  border-left: none;
  z-index: 1;
  font-weight: 100;
  color: #444;
  font-size: 28px;
}
.state {
  color: #444;
  padding: 12px 4px 0 5%;
  max-width: 1180px;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  box-sizing: content-box;
  ul {
    padding: 0;
    margin: 0;
    right: 0px;
    z-index: 1000;
    li {
      margin: 0 4px 0 4px;
      list-style: none;
      float: left;
    }
  }
}
.user-type {
  font-size: 15px;
  padding-top: 6px;
  cursor: pointer;
}
.log-btn {
  cursor: pointer;
  padding-left: 40px;
  font-size: 20px;
}
.mobile-menu-btn {
  margin-right: 1%;
  cursor: pointer;
}
.mobile-show {
  display: none;
}
@media screen and (max-width: 750px) {
  .mobile-show {
    display: block;
  }
  .pc-menu {
    display: none;
  }
}
.mobile-nav-bar {
  position: absolute;
  top: 57px;
  width: 100%;
  ul {
    list-style: none;
    li {
      background-color: #eee;
      padding: 6px 0 5px 0;
      margin: 0;
      font-size: 20px;
      border-bottom: 1px solid #ccc;
    }
  }
}
.mobileMenuShow {
  display: none;
}
.input-box {
  width: 75%;
  max-width: 450px;
  margin: 20px auto;
  margin-bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.input-item {
  width: 100%;
  margin: 10px 0;
}
.notice {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  font-size: 32px;
}
.operation-area {
  font-size: 18px;
  height: 370px;
  margin: 30px 3%;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.device-btn {
  margin: 10px 0;
}
.device-detail {
  margin-right: 15px;
}
#chart {
  width: 50%;
  min-width: 330px;
  margin: 0 auto;
}
#number-bar {
  height: 60px;
  margin-top: -60px;
  font-size: 20px;
  .time-stamp {
    font-size: 14px;
  }
}
</style>


