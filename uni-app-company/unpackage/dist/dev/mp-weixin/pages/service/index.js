"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_dtPicker2 = common_vendor.resolveComponent("dtPicker");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_dtPicker2 + _easycom_uni_popup2)();
}
const _easycom_dtPicker = () => "../../components/dtPicker/dtPicker.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_dtPicker + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const popup = common_vendor.ref();
    const service = common_vendor.ref({});
    const hospitals = common_vendor.ref([]);
    const hospital_index = common_vendor.ref(0);
    const client = common_vendor.reactive({
      name: ""
    });
    const is_xieyi = common_vendor.ref(false);
    const cfg = common_vendor.reactive({
      page_xy: "",
      page_fw: ""
    });
    const validMobile = common_vendor.reactive({
      phone: "",
      validCode: ""
    });
    const qrCodePopup = common_vendor.ref();
    const countdown = common_vendor.reactive({
      validText: "获取验证码",
      time: 60
    });
    const order = common_vendor.reactive({
      price: "",
      starttime: "",
      address: {
        userName: "",
        cityName: "",
        countyName: "",
        detailInfo: ""
      },
      receiveAddress: "",
      tel: "",
      demand: ""
    });
    common_vendor.onLoad((options) => {
      console.log(options, "options");
      mainLoad(options);
    });
    const app = getApp();
    const mainLoad = (options) => {
      app.globalData.utils.request({
        url: "/Service/order",
        data: {
          svid: options.svid
        },
        success: (res2) => {
          console.log(res2);
          service.value = res2.data.service;
          hospitals.value = res2.data.hospitals;
          const hospitalsData = common_vendor.toRaw(hospitals.value);
          if (options.hid > 0) {
            for (let i = 0; i < hospitalsData.length; i++) {
              if (hospitalsData[i].id == options.hid) {
                hospital_index.value = i;
                order.price = hospitalsData[i].service_price;
                break;
              }
            }
          }
        }
      });
    };
    const handleTap = () => {
    };
    const onHospitalChange = (e) => {
      const value = parseInt(e.detail.value);
      hospital_index.value = value;
      order.price = common_vendor.toRaw(hospitals.value)[value].service_price;
    };
    const onStartTimeChanged = (e) => {
      order.starttime = e.detail.value;
    };
    const onClickChange = () => {
      common_vendor.index.navigateTo({
        url: "../clients/index?act=select"
      });
    };
    common_vendor.index.$on("clientChange", (data) => {
      console.log("data", data);
      client.name = data.name;
      client.id = data.user_id;
      client.sex = data.sex;
      client.age = data.age;
      client.mobile = data.mobile;
    });
    const onXieyiChange = () => {
      is_xieyi.value = !is_xieyi.value;
    };
    const onAddressChange = () => {
      common_vendor.index.chooseAddress({
        success: (res2) => {
          console.log(res2, "address");
          order.address.userName = res2.userName;
          order.address.cityName = res2.cityName;
          order.address.countyName = res2.countyName;
          order.address.detailInfo = res2.detailInfo;
        },
        fail: (res2) => {
          console.log(res2, "addresserror");
        }
      });
    };
    let submitOrder;
    const submit = () => {
      if (!is_xieyi) {
        return common_vendor.index.showToast({
          title: "请先阅读并同意用户协议和服务协议",
          icon: "none",
          duration: 1e3
        });
      }
      const orderData = common_vendor.toRaw(order);
      const serviceData = common_vendor.toRaw(service.value);
      const hospitailsData = common_vendor.toRaw(hospitals.value);
      const clientData = common_vendor.toRaw(client);
      orderData.service_code = serviceData.code;
      orderData.service_id = serviceData.id;
      orderData.service_name = serviceData.name;
      orderData.service_stype = serviceData.stype;
      if (serviceData.stype < 100) {
        if (hospital_index.value == 0) {
          return common_vendor.index.showToast({
            title: "请选择医院",
            icon: "none",
            duration: 1e3
          });
        }
        orderData.hospital_id = hospitailsData[hospital_index.value].id;
        orderData.hospital_name = hospitailsData[hospital_index.value].name;
      }
      if (!orderData.starttime) {
        return common_vendor.index.showToast({
          title: "请选择时间",
          icon: "none",
          duration: 1e3
        });
      }
      if (serviceData.stype == 10 || serviceData.stype == 15 || serviceData.stype == 20) {
        if (!clientData.id) {
          return common_vendor.index.showToast({
            title: "请选择就诊人",
            icon: "none",
            duration: 1e3
          });
        }
        orderData.client = {};
        orderData.client.sex = clientData.sex;
        orderData.client.age = clientData.age;
        orderData.client.mobile = clientData.mobile;
        orderData.client.name = clientData.name;
        if (serviceData.stype == 15) {
          if (!orderData.receiveAddress) {
            return common_vendor.index.showToast({
              title: "请填写就诊人所在地址",
              icon: "none",
              duration: 1e3
            });
          }
        }
      }
      if (serviceData.stype == 30 || serviceData.stype == 40) {
        if (!orderData.address.userName) {
          return common_vendor.index.showToast({
            title: "请选择收件信息",
            icon: "none",
            duration: 1e3
          });
        }
      }
      if (!orderData.tel) {
        return common_vendor.index.showToast({
          title: "请填写您的联系方式",
          icon: "none",
          duration: 1e3
        });
      }
      console.log("orderData----------", orderData);
      submitOrder = orderData;
      if (!common_vendor.index.getStorageSync("token")) {
        popup.value.open("center");
      } else {
        creatOrder(submitOrder);
      }
    };
    const cancal = () => {
      popup.value.close();
    };
    const ok = () => {
      if (!validMobile.phone || !validMobile.validCode) {
        return common_vendor.index.showToast({
          title: "请检查填写数据",
          icon: "none",
          duration: 1e3
        });
      }
      app.globalData.utils.request({
        url: "/user/authentication",
        method: "POST",
        data: {
          tel: validMobile.phone,
          code: validMobile.validCode
        },
        success: (res2) => {
          common_vendor.index.setStorageSync("token", res2.data.token);
          creatOrder(submitOrder);
        },
        fail: () => {
          debugger;
          common_vendor.index.showToast({
            title: res.msg,
            icon: "none",
            duration: 1e3
          });
        }
      });
    };
    let flag = false;
    const countdownChange = () => {
      if (!validMobile.phone) {
        return common_vendor.index.showToast({
          title: "请输入手机号",
          icon: "none",
          duration: 1e3
        });
      }
      if (flag)
        return;
      const time = setInterval(() => {
        if (countdown.time <= 0) {
          countdown.validText = "获取验证码";
          countdown.time = 60;
          flag = false;
          clearInterval(time);
        } else {
          countdown.time -= 1;
          countdown.validText = `剩余${countdown.time}s`;
        }
      }, 1e3);
      flag = true;
      app.globalData.utils.request({
        url: "/get/code",
        method: "POST",
        data: {
          tel: validMobile.phone
        },
        success: (res2) => {
          return common_vendor.index.showToast({
            title: "验证码发送成功，请尽快验证!",
            icon: "none",
            duration: 1e3
          });
        },
        fail: (res2) => {
          common_vendor.index.showToast({
            title: res2.msg,
            icon: "none",
            duration: 1e3
          });
        }
      });
    };
    const creatOrder = (orderData) => {
      app.globalData.utils.request({
        url: "/pay/createOrder",
        method: "POST",
        header: {
          token: common_vendor.index.getStorageSync("token")
        },
        data: orderData,
        success: (res2) => {
          qrCodePopup.value.open("center");
          const qr = new common_vendor.UQRCode();
          qr.data = res2.wx_code;
          qr.size = 150;
          qr.make();
          var canvasContext = common_vendor.index.createCanvasContext("qrcode");
          qr.canvasContext = canvasContext;
          qr.drawCanvas();
        },
        fail: () => {
        }
      });
    };
    const payment = () => {
      common_vendor.index.switchTab({
        url: "/pages/order/index"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: service.value.icon_image ? service.value.icon_image_url : "../../static/resource/images/avatar.jpg",
        b: common_vendor.t(service.value.name),
        c: common_vendor.o(handleTap),
        d: service.value.stype == 10 || service.value.stype == 15 || service.value.stype == 20
      }, service.value.stype == 10 || service.value.stype == 15 || service.value.stype == 20 ? common_vendor.e({
        e: hospitals.value[hospital_index.value].name,
        f: hospitals.value,
        g: common_vendor.o(onHospitalChange),
        h: hospital_index.value,
        i: common_vendor.o(onStartTimeChanged),
        j: common_vendor.p({
          timestamp: order.starttime,
          placeholder: "请选择就诊时间"
        }),
        k: client.name,
        l: common_vendor.o(onClickChange),
        m: service.value.stype == 15
      }, service.value.stype == 15 ? {
        n: order.receiveAddress,
        o: common_vendor.o(($event) => order.receiveAddress = $event.detail.value)
      } : {}, {
        p: order.tel,
        q: common_vendor.o(($event) => order.tel = $event.detail.value)
      }) : {}, {
        r: service.value.stype == 30 || service.value.stype == 40
      }, service.value.stype == 30 || service.value.stype == 40 ? {
        s: hospitals.value[hospital_index.value].name,
        t: common_vendor.o(onHospitalChange),
        v: hospital_index.value,
        w: hospitals.value,
        x: common_vendor.o(onStartTimeChanged),
        y: common_vendor.p({
          timestamp: order.starttime,
          placeholder: "请选择期望服务时间"
        }),
        z: order.address.userName ? order.address.userName + "(" + order.address.cityName + order.address.countyName + order.address.detailInfo + ")" : "",
        A: common_vendor.o(onAddressChange),
        B: order.tel,
        C: common_vendor.o(($event) => order.tel = $event.detail.value)
      } : {}, {
        D: order.demand,
        E: common_vendor.o(($event) => order.demand = $event.detail.value),
        F: common_vendor.n("is_xieyi " + (is_xieyi.value ? "is_xieyi_on" : "")),
        G: common_vendor.o(onXieyiChange),
        H: cfg.page_xy,
        I: cfg.page_fw,
        J: order.price > 0
      }, order.price > 0 ? {} : {}, {
        K: common_vendor.n("btnp " + (is_xieyi.value ? "" : "btnp-disabled")),
        L: common_vendor.o(submit),
        M: validMobile.phone,
        N: common_vendor.o(($event) => validMobile.phone = $event.detail.value),
        O: validMobile.validCode,
        P: common_vendor.o(($event) => validMobile.validCode = $event.detail.value),
        Q: common_vendor.t(countdown.validText),
        R: common_vendor.o(countdownChange),
        S: common_vendor.o(cancal),
        T: common_vendor.o(ok),
        U: common_vendor.sr(popup, "0b29b37c-2", {
          "k": "popup"
        }),
        V: common_vendor.p({
          type: "center",
          ["is-mask-click"]: false,
          ["background-color"]: "#fff"
        }),
        W: common_vendor.o(payment),
        X: common_vendor.sr(qrCodePopup, "0b29b37c-3", {
          "k": "qrCodePopup"
        }),
        Y: common_vendor.p({
          type: "center",
          ["is-mask-click"]: false,
          ["background-color"]: "#fff"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/workspace/uni-app/uni-app-company/pages/service/index.vue"]]);
wx.createPage(MiniProgramPage);
