import Toast from "react-native-root-toast";
import { getStore, getStoreDispatch, _store } from "./configureListener";
import { Dimensions, Platform, AlertIOS } from "react-native";
import codePush from "react-native-code-push";
import RNBugly from "react-native-bugly";
import DeviceInfo from "react-native-device-info";
import { updateToggleAddress, getCodePushKey } from "./env";
import JPush from "jpush-react-native";
import RNProgressHud from "react-native-progress-display";

let _codePushUpdating = false;
let _cacheAlert = null;

export function isIphoneX() {
  const dimen = Dimensions.get("window");
  return (
    Platform.OS === "ios" &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      (dimen.height === 812 || dimen.width === 812)
  );
}

export function PlatformAlert(
  title: string,
  content: string,
  yesLabel: string,
  noLabel: string,
  yesCallback: () => mixed,
  noCallback: ?() => mixed) {
  if (Platform.OS === "ios") {
    if (_codePushUpdating) {
      _cacheAlert = {title, content, yesLabel, noLabel, yesCallback, noCallback};
      return;
    }

    AlertIOS.alert(
      title,
      content,
      [
        {
          text: yesLabel,
          onPress: yesCallback,
        },
        {
          text: noLabel,
          onPress: noCallback ? noCallback : null,
          style: "cancel",
        },
      ]
    );
  }
}

function showCacheAlert() {
  if (_cacheAlert) {
    let {title, content, yesLabel, noLabel, yesCallback, noCallback} = _cacheAlert;
    PlatformAlert(
      title,
      content,
      yesLabel,
      noLabel,
      yesCallback,
      noCallback
    );
    _cacheAlert = null;
  }
}

export function AlertPrompt(
  title: string,
  content: string,
  yesLabel: string,
  noLabel: string,
  yesCallback: () => mixed,
  noCallback: ?() => mixed
) {
  if (Platform.OS === "ios") {
    AlertIOS.prompt(
      title,
      content,
      [
        {
          text: noLabel,
          onPress: noCallback ? noCallback : null,
          style: "cancel",
        },
        {
          text: yesLabel,
          onPress: yesCallback,
        },
      ]
    );
  }
}

export function toastShow(label: string, options: ?Object) {
  Toast.show(label, {...options, position: -70});
}

const MODE_NUM = 100000;
const MODE_DESC = {
  0: "一倍场",
  1: "十倍场",
};

export function getMachineName(machineID: number, withMod: ?boolean = false): string {
  let no = machineID % MODE_NUM;
  let mode = Math.floor(machineID / MODE_NUM);
  let desc = withMod ? MODE_DESC[mode] : "";

  desc += no.toString() + "号机";
  return desc;
}

export function getMachineNO(machineID: number) {
  let no = machineID % MODE_NUM;
  return no;
}

export function getCurrFormat(count: number) {
  const TEN_MILLION = 10000000;
  const TEN_THOUSAND = 10000;

  if (count % TEN_THOUSAND > 0) {
    return Math.floor(count / TEN_THOUSAND) + "万";
  }
  else if (count % TEN_MILLION > 0) {
    return Math.floor(count / TEN_MILLION) + "百万";
  }
  else {
    return count;
  }
}

export async function codePushSync() {
  let num;
  try {
    let response = await fetch( updateToggleAddress, {
      method: "GET",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-Type": "application/json",
      }
    });

    let toggleData = await response.json();

    let name = DeviceInfo.getBundleId();
    console.log("codePushSync bundleId:" + name);
    console.log("codePushSync toggleData:" + JSON.stringify(toggleData));

    if ((toggleData[name] && toggleData[name]["enabled"]) || __DEV__) {
      _codePushUpdating = true;
      console.log("codePushSync enabled");
      num = await codePush.sync({
        deploymentKey: getCodePushKey(),
        updateDialog: {
          appendReleaseDescription: true,
          descriptionPrefix: "更新内容:",
          mandatoryContinueButtonLabel: "更新",
          mandatoryUpdateMessage:"发现一个必须要安装的更新",
          optionalIgnoreButtonLabel: "忽略",
          optionalInstallButtonLabel: "安装",
          optionalUpdateMessage: "发现一个更新,是否要安装?",
          title: "发现可用更新",
        },
        checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
        installMode: codePush.InstallMode.IMMEDIATE
        //installMode: codePush.InstallMode.ON_NEXT_RESUME,
      },
      (syncStatus) => { // status callback
        switch (syncStatus) {
        case codePush.SyncStatus.DOWNLOADING_PACKAGE:
          // Show "downloading" modal
          // RNProgressHud.showProgressWithStatus(0, "正在下载更新...");
          RNProgressHud.showWithStatus("准备开始下载更新...");
          break;
        case codePush.SyncStatus.INSTALLING_UPDATE:
          // Hide "downloading" modal
          RNProgressHud.showWithStatus("正在安装更新...");
          break;
        }
      },
      (progress) => {
        console.log("codePushSync:" + progress.receivedBytes + " of " + progress.totalBytes + " received.");
        RNProgressHud.showProgressWithStatus(progress.receivedBytes / progress.totalBytes, "正在下载更新...");
      });

      codePush.notifyAppReady();
    }
  } catch (e) {
    //
    console.error("err:" + e.message);
    throw e;
  } finally {
    BuglyUpdateVersion();
    RNProgressHud.dismiss();
    _codePushUpdating = false;
    showCacheAlert();
  }

  return num;
}

export async function installCodePush() {
  try {
    let update = await codePush.getUpdateMetadata(codePush.UpdateState.LATEST);

    console.log("installCodePush:" + update.failedInstall);
    if (update && update.failedInstall)
    {
      update.install(codePush.InstallMode.IMMEDIATE);
    }
  } catch (e) {
    throw e;
  }
}

export function BuglyUpdateVersion() {
  codePush.getUpdateMetadata(codePush.UpdateState.RUNNING).then((update) => {
    let version = DeviceInfo.getVersion() + ".";

    if (update) {
      version += update.label;
    }

    console.warn("BuglyUpdateVersion:" + version);
    RNBugly.updateAppVersion(version);
  });
}

export async function GetDeviceToken(): Promise<string> {
  return new Promise((resolve) => {
    JPush.getRegistrationID(registrationId => {
      resolve(registrationId);
    });
  });
}
