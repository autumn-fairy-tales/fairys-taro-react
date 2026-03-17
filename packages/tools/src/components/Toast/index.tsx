import { Toast } from '@nutui/nutui-react-taro';
import { FairysTaroPortal } from 'components/Portal';
import { useGlobalMessageData } from 'context/global.message.data.instance';

export const FairysTaroToast = () => {
  const [state, proxyInstance] = useGlobalMessageData();
  const toastConfig = state.toastData as any;

  return (
    <FairysTaroPortal>
      <Toast
        type="text"
        {...toastConfig}
        visible={toastConfig?.visible || false}
        onClose={() => {
          toastConfig?.onClose?.();
          proxyInstance.hideToast();
        }}
      />
    </FairysTaroPortal>
  );
};
