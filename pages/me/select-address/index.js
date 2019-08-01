//index.js
//获取应用实例
var app = getApp()
 
const selectAddressUP = app.globalData.apiDomain + "/user/selectAddress/update";
const selectAddresslist = app.globalData.apiDomain + "/user/selectAddress/list";
const selectAddressAdd = app.globalData.apiDomain + "/user/selectAddress/Add";
 

Page({
  data: {
    addressList:[]
  },

  selectTap: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: selectAddressUP,
      data: {
        token: wx.getStorageSync('token'),
        id:id,
        isDefault:'true'
      },
      success: (res) =>{
        wx.navigateBack({})
      }
    })
  },

  addAddess : function () {
    wx.navigateTo({
      url:"/pages/address-add/index"
    })
  },
  
  editAddess: function (e) {
    wx.navigateTo({
      url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    })
  },
  
  onLoad: function () {
    console.log('onLoad')

   
  },
  onShow : function () {
    this.initShippingAddress();
  },
  initShippingAddress: function () {
    var that = this;
    wx.request({
      url: selectAddresslist,
      data: {
        token: wx.getStorageSync('token')
      },
      success: (res) =>{
        if (res.data.code == 0) {
          that.setData({
            addressList:res.data.data
          });
        } else if (res.data.code == 700){
          that.setData({
            addressList: null
          });
        }
      }
    })
  }

})
