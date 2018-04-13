//@flow
"use strict";

let NIMLoginDescrib = {
  "3": "正在连接IM服务器",
  "5": "连接IM服务器成功",
  "2": "连接IM服务器失败",
  "4": "正在登陆",
  "6": "登陆成功",
  "10": "登陆失败",
  "13": "IM开始同步",
  "14": "IM同步成功",
  "12": "网络断开",
  "15": "网络环境切换"
};

let NIMAVChatDescrib = {
  "502": "连接直播服务",
  "503": "连接直播服务成功",
  "504": "连接直播服务失败",
};

module.exports = { NIMLoginDescrib, NIMAVChatDescrib };
