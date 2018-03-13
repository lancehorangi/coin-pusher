import Toast from 'react-native-root-toast';

export function toastShow(label: string, options: ?Object) {
  Toast.show(label, {...options, position: -70})
}
