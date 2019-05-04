<template>
  <div class="root">
    <img @click="pageBackUp" class="backup" src="../../dist/img/backup.svg" alt="backup">
    <div class="main-content">
      <div class="row login-icon" >
        <img src="../../dist/img/clickToLogin.svg" alt="login">
      </div>
      <el-input type="" class="row" v-model="userName" placeholder="请输入用户名"></el-input>
      <el-input type="password" class="row" v-model="passWord" placeholder="请输入密码"></el-input>
      <el-button type="info" plain class="row" @click="login()">登录</el-button>
    </div>
  </div>
</template>

<script>
//import ajax from '../utils/ajax'
import axios from 'axios'

export default {
  name: 'login',
  data(){
    return{
      userName: '',
      passWord: '',
    }
  },
  methods: {
    login(){
      let that = this;
      axios.post('http://localhost:3000/users/find', {
        userName: this.userName,
        passWord: this.passWord,
      })
      .then(function (response) {
        console.log(response);
        localStorage.setItem('token', response.data.token)
        if(response.data.result === 'found'){
          that.$router.push({  
            path:'/',   
          })
        }else if(response.data.result === 'notFound'){
          that.$message({
            message: '用户名或密码错误',
            customClass: 'messageBox',
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    pageBackUp(){
      this.$router.push({  
          path:'/',   
      })
    }
  },
  components: {
    
  }
}
</script>

<style lang="scss" scoped>
  .root{
    background-color: #fdfdfd;
    font: 25px "Helvetica Neue", "Open Sans", sans-serif;
  }
  .main-content{
    width: 30%;
    min-width: 240px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background-color: #fff;
  }
  .row{
    margin: 14px 0 14px 0;
  }
  .login-icon{
    height: 150px;
    img{
      height: 150px;
      width: 150px;
    }
  }
  .backup{
    position: absolute;
    top: 10px;
    right: 10px;
  }

</style>

