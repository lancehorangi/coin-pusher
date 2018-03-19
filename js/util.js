import Toast from 'react-native-root-toast';
import { Dimensions, Platform } from 'react-native';
import codePush from "react-native-code-push";

export function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      (dimen.height === 812 || dimen.width === 812)
  );
}

export function toastShow(label: string, options: ?Object) {
  Toast.show(label, {...options, position: -70})
}

const MODE_NUM = 100000;
const MODE_DESC = {
  0: '一倍场',
  1: '十倍场',
}

export function getMachineName(machineID: number, withMod: ?boolean = false): string {
  let no = machineID % MODE_NUM;
  let mode = Math.floor(machineID / MODE_NUM)
  let desc = withMod ? MODE_DESC[mode] : "";

  desc += no.toString() + '号机';
  return desc;
}

export function getMachineNO(machineID: number) {
  let no = machineID % MODE_NUM;
  return no;
}

export function getCurrFormat(count: number) {
  const TEN_MILLION = 10000000;
  const TEN_THOUSAND = 10000;

  if (count % TEN_MILLION > 0) {
    return Math.floor(count / TEN_MILLION) + "百万";
  }
  else if (count % TEN_THOUSAND > 0) {
    return Math.floor(count / TEN_THOUSAND) + "万";
  }
  else {
    return count + "万";
  }
}

export function codePushSync() {
  codePush.sync({
              // updateDialog: {
              //   descriptionPrefix: '描述:',
              //   mandatoryContinueButtonLabel:'继续',
              //   mandatoryUpdateMessage:'这是一个必须要安装的更新',
              //   optionalIgnoreButtonLabel: '忽略',
              //   optionalInstallButtonLabel: '安装',
              //   optionalUpdateMessage: '发现一个更新,是否要安装?',
              //   title: '更新',
              // },
              checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
              //installMode: codePush.InstallMode.IMMEDIATE
              installMode: codePush.InstallMode.ON_NEXT_RESUME,
          },
          (syncStatus) => { // status callback
            // do smthing with the sync status
          },
          (progress) => {
              console.log("codePush:" + progress.receivedBytes + " of " + progress.totalBytes + " received.");
          });
}
