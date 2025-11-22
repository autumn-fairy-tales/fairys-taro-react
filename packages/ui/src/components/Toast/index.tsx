import { Toast } from '@nutui/nutui-react-taro';
import { useGlobalData } from 'context/global.data.instance';

export const FairysTaroToast = () => {
  const [state, proxyInstance] = useGlobalData();
  const toastConfig = state.toastData as any;

  return (
    <Toast
      {...toastConfig}
      visible={toastConfig?.visible || false}
      onClose={() => {
        toastConfig?.onClose?.();
        proxyInstance.hideToast();
      }}
    />
  );
};
