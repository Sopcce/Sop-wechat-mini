var app = getApp();
const userchecktoken = app.globalData.apiDomain + "/user/checktoken";
const userwxapplogin = app.globalData.apiDomain + "/user/wxapplogin";
const userwxappregister = app.globalData.apiDomain + "/user/wxappregister";
 
Page({ 
  rejectLogin: function (e){
    wx.navigateBack({
      
    })
  },
  bindGetUserInfo: function (e) {
    if (!e.detail.userInfo){
      return;
    }
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.login();
  },
  login: function () {
    let that = this;
    let token = wx.getStorageSync('token');
    if (token) {
      wx.request({
        url: userchecktoken,
        data: {
          token: token
        },
        success: function (res) {
          if (res.data.code != 0) {
            wx.removeStorageSync('token')
            that.login();
          } else {
            // 回到原来的地方
            wx.navigateBack();
          }
        }
      })
      return;
    }
    wx.login({
      success: function (res) {
        console.log('wx.login:'+JSON.stringify(res))
        wx.request({
          url: userwxapplogin,
          data: {
            code: res.code
          },
          success: function (res) {
            console.log(res.data.code)
            console.log(JSON.stringify(res.data))

            if (res.data.code == 10000) {
              // 去注册
              that.registerUser();
              return;
            }
            else if (res.data.code != 0) {
              // 登录错误
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel: false
              })
              return;
            }
            wx.setStorageSync('token', res.data.data.token)
            wx.setStorageSync('uid', res.data.data.uid)
            // 回到原来的页面
            wx.navigateBack();
          }
        })
      }
    })
  },
  registerUser: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            var iv = res.iv;
            var encryptedData = res.encryptedData;
            if(true){
              console.log(iv + '|' + encryptedData + '|' + code)
            }         


            // 下面开始调用注册接口
            wx.request({
              url: userwxappregister,
              data: { code: code, encryptedData: encryptedData, iv: iv }, // 设置请求的 参数
              success: (res) => {
                wx.hideLoading();
                that.login();
              }
            })
          }
        })
      }
    })
  }
})