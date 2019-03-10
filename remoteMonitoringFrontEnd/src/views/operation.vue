<template>
    <div class="root">
        <header class="top-bar">
            <section class="slogan">
                Remote Monitoring System
            </section>
            <div class="state-bar">
                <ul v-if="user" class="pc-menu">
                    <li>{{this.user}}</li>
                    <li @click="showManageTag" class="user-type" v-if="userType === 'master'">[管理员权限]</li>
                    <li class="log-btn" @click="logout">
                        <img src="../../dist/img/16pxlogout.svg" alt="logout">
                        <span>退出登陆</span>
                    </li>
                </ul>
                <ul v-else class="pc-menu">
                    <li class="log-btn" @click="goToLogin">点击登录</li>
                </ul>
                <div @click="toggleMobileMenu" class="mobile-menu-btn mobile-show">
                    <img src="../../dist/img/menu.svg" alt="mobile-menu">
                </div>
            </div>
        </header>
        <div class="mobile-nav-bar mobile-show" :class="{mobileMenuShow: !showMobileMenu}">
            <ul v-if="user">
                <li>{{this.user}}<span @click="showManageTag" class="user-type" v-if="userType === 'master'">[管理员权限]</span></li>
                <li @click="logout" class="log-btn"> <img src="../../dist/img/16pxlogout.svg" alt="logout"><span style="font-size:17px;">退出登陆</span></li>
            </ul>
            <ul v-else>
                <li @click="goToLogin">点击登陆</li>
            </ul>
        </div>
        <div class="operation-area" v-if="user">
            <div class="device-btn">
                <span class="device-detail">「设备一」 当前状态：{{deviceStatus1?'开启':'关闭'}} </span><el-button type="info" @click="setDviceStatus('device1')">{{deviceStatus1?'关闭':'开启'}}</el-button>
            </div>
            <div class="device-btn">
                <span class="device-detail">「设备二」 当前状态：{{deviceStatus2?'开启':'关闭'}} </span><el-button type="info" @click="setDviceStatus('device2')">{{deviceStatus2?'关闭':'开启'}}</el-button>
            </div>
            <div class="device-btn">
                <span class="device-detail">「设备三」 当前状态：{{deviceStatus3?'开启':'关闭'}} </span><el-button type="info" @click="setDviceStatus('device3')">{{deviceStatus3?'关闭':'开启'}}</el-button>
            </div>
        </div>
        <div v-if="!user" class="notice">
            请登陆
        </div>
        <el-dialog
            title="管理员权限"
            :visible.sync="manageTagShow"
            :center="true"
            :fullscreen="true"
            >
            <el-dropdown @command="setOpType">
                <span class="el-dropdown-link">
                    {{manageOpType}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="修改密码">修改密码</el-dropdown-item>
                    <el-dropdown-item command="添加用户">添加用户</el-dropdown-item>
                    <el-dropdown-item command="删除用户">删除用户</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
                <div class="input-box">
                    <div class="input-item">
                        要编辑的用户名：<el-input v-model="inputUserName" placeholder="请输入用户名"></el-input>
                    </div>
                    <div class="input-item">
                        密码：<el-input :disabled="manageOpType === '删除用户'" v-model="inputPassWord" placeholder="请输入密码"></el-input>
                    </div>
                    <div class="input-item">
                        账户类型：<el-radio :disabled="manageOpType !== '添加用户'" v-model="inputUserType" label="master">master</el-radio>
                                <el-radio :disabled="manageOpType !== '添加用户'" v-model="inputUserType" label="worker">worker</el-radio>
                    </div>
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button  @click="manageTagShow = false">取 消</el-button>
                <el-button  type="primary" @click="editUserInfo" >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'operation',
    data(){
        return{
            user: '',
            userType: '',
            showMobileMenu: false,
            manageTagShow: false,
            manageOpType: '修改密码',
            inputUserName: '',
            inputPassWord: '',
            inputUserType: '',
            deviceStatus1: false,
            deviceStatus2: false,
            deviceStatus3: false,
        }
    },
    mounted: function(){
        const token = localStorage.getItem('token');
        const that = this;
        axios.get('http://localhost:3000/device/find').then(function(response){
            if(response.status === 200){
                const deviceList = response.data;
                for(let value of deviceList){
                    switch(value.id){
                        case 'device1':
                        that.deviceStatus1 = value.status;
                        break;
                        case 'device2':
                        that.deviceStatus2 = value.status;
                        break;
                        case 'device3':
                        that.deviceStatus3 = value.status;
                        break;
                    }
                }
            }
        })
        if(token){
            axios.defaults.headers.common['token'] = token;
            axios.get('http://localhost:3000/users/verify')
            .then(function (response) {
                if(response.status === 200){
                    that.user = response.data.userName;
                    that.userType = response.data.type;
                }   
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    },
    methods: {
        logout(){
            localStorage.removeItem('token');
            this.goToLogin();
        },
        goToLogin(){
            this.$router.push({  
                path:'/login',   
            })
        },
        toggleMobileMenu(){
            this.showMobileMenu = !this.showMobileMenu;
        },
        showManageTag(){
            this.manageTagShow = !this.manageTagShow;
        },
        setOpType(type){
            this.manageOpType = type;
        },
        editUserInfo(){
            let url ; 
            let that = this;
            let data = {
                userName: this.inputUserName, 
                passWord: this.inputPassWord,
                type: this.inputUserType,
            }
            switch(this.manageOpType){
                case '修改密码':
                url = 'http://localhost:3000/users/update';
                delete data.type;
                break;
                case '添加用户':
                url = 'http://localhost:3000/users/insert';
                break;
                case '删除用户':
                url = 'http://localhost:3000/users/delete';
                delete data.passWord;
                delete data.type;
                break;
            }
            axios.post(url, data).then(function(res){
                if(res.data.result === 'succeed'){
                    that.manageTagShow = false;
                    that.showMobileMenu = false;
                    that.$message({
                        message: '操作成功',
                        type: 'success',
                        customClass: 'messageBox',
                    });
                }
            }).catch(function(error){
                console.log(error);
            });
        },
        setDviceStatus(deviceId){
            let deviceStatus;
            switch(deviceId){
                case 'device1':
                deviceStatus = !this.deviceStatus1;
                break;
                case 'device2':
                deviceStatus = !this.deviceStatus2;
                break;
                case 'device3':
                deviceStatus = !this.deviceStatus3;
                break;
            }
            const url = 'http://localhost:3000/device/setDevice';
            const that = this;
            const data = {
                id: deviceId,
                status: deviceStatus
            }
            axios.post(url, data).then(function(res){
                if(res.data === 'succeed'){
                    switch(deviceId){
                        case 'device1':
                        that.deviceStatus1 = !that.deviceStatus1;
                        break;
                        case 'device2':
                        that.deviceStatus2 = !that.deviceStatus2;
                        break;
                        case 'device3':
                        that.deviceStatus3 = !that.deviceStatus3;
                        break;
                    }
                }else{
                    that.$message({
                        message: '操作失败',
                        type: 'warning',
                        customClass: 'messageBox',
                        duration: 1500,
                    });
                }

            }).catch(function(error){
                console.log(error)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .root{
        background-color: #fdfdfd;
        font: 25px "Helvetica Neue", "Open Sans", sans-serif;
    }
    .top-bar{
        position: fixed;
        top: 0;
        left: 0;
        background: #eee;
        width: 100%;
        height: 55px;
        z-index: 100;
        border-bottom: 1px solid #ddd;
    }
    .slogan{
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
    }
   .state-bar{
        color: #444;
        padding: 12px 4px 0 5%;
        max-width: 1180px;  
        height: 100%;
        position: relative;
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        box-sizing: content-box;
        ul{
            padding: 0;
            margin: 0;
            right: 0px;
            z-index: 1000;
            li{
                margin: 0 4px 0 4px;
                list-style: none;
                float: left;
            }
        }
   }
   .user-type{
        font-size: 15px;
        padding-top: 6px;
        cursor: pointer;
   }
   .log-btn{
        cursor: pointer;
        padding-left: 40px;
        font-size: 20px;
   }
   .mobile-menu-btn{
       margin-right: 1%;
       cursor: pointer;
   }
   .mobile-show{
       display: none;
   }
   @media screen and (max-width: 750px){
       .mobile-show{
           display: block;
       }
       .pc-menu{
           display: none;
       }
   }
   .mobile-nav-bar{
       position: absolute;
       top: 57px;
       width: 100%;
       ul{
           list-style: none;
           li{
               background-color: #eee;
               padding: 6px 0 5px 0;
               margin: 0;
               font-size: 20px;
               border-bottom: 1px solid #ccc;
           }
       }
   }
   .mobileMenuShow{
       display: none;
   }
   .input-box{
       width: 75%;
       max-width: 450px;
       margin: 20px auto;
       margin-bottom: 0;
       display: flex;
       justify-content: center;
       align-items: center;
       flex-direction: column;
   }
   .input-item{
       width: 100%;
       margin: 10px 0;
   }
   .notice{
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translateX(-50%) translateY(-50%);
       font-size: 32px;
   }
   .operation-area{
       font-size: 18px;
    //    background-color: #ddd;
       height: 300px;
       margin: 57px 3%;
       padding: 10px 0;
       display: flex;
       justify-content: center;
       align-items: center;
       flex-direction: column;
   }
   .device-btn{
       margin: 10px 0;
   }
   .device-detail{
       margin-right: 30px;
   }
</style>


