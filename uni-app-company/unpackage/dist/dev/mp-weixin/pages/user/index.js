"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_share2 = common_vendor.resolveComponent("share");
  _easycom_share2();
}
const _easycom_share = () => "../../components/share/share.js";
if (!Math) {
  _easycom_share();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const app = getApp();
    const mine = common_vendor.ref({
      avatar: "",
      avatar_url: "",
      nickname: false,
      _id: "",
      seller_switch: 0
    });
    const statistic = common_vendor.ref({
      topays: 0,
      todos: 0
    });
    const clone_shareModal = common_vendor.ref(false);
    common_vendor.onLoad(() => {
      app.globalData.utils.request({
        url: "/User/index",
        header: {
          token: common_vendor.index.getStorageSync("token")
        },
        success: (res) => {
          mine.value = res.data.mine;
          statistic.value = res.data.statistic;
        },
        fail: (res) => {
        }
      });
    });
    const toOrders = (e) => {
      if (e.currentTarget.dataset.filt) {
        app.globalData.orders_filt = e.currentTarget.dataset.filt;
      } else {
        app.globalData.orders_filt = "";
      }
      common_vendor.index.switchTab({
        url: "/pages/order/index"
      });
    };
    const showShareModal = () => {
      clone_shareModal.value = true;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: mine.value.avatar
      }, mine.value.avatar ? {
        b: mine.value.avatar_url
      } : {}, {
        c: common_vendor.t(mine.value.nickname ? mine.value.nickname : "用户" + mine.value._id),
        d: common_vendor.o(toOrders),
        e: statistic.value.topays > 0
      }, statistic.value.topays > 0 ? {
        f: common_vendor.t(statistic.value.topays)
      } : {}, {
        g: common_vendor.o(toOrders),
        h: statistic.value.todos > 0
      }, statistic.value.todos > 0 ? {
        i: common_vendor.t(statistic.value.todos)
      } : {}, {
        j: common_vendor.o(toOrders),
        k: common_vendor.o(toOrders),
        l: common_vendor.o(toOrders),
        m: common_vendor.o(showShareModal),
        n: common_vendor.p({
          shareModal: clone_shareModal.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/workspace/uni-app/uni-app-company/pages/user/index.vue"]]);
wx.createPage(MiniProgramPage);
