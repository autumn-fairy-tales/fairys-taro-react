import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Fragment, useMemo, useRef } from 'react';
import { proxy, useSnapshot, snapshot, ref } from 'valtio';
import { Failure, Loading, Close2, Photograph } from '@nutui/icons-react-taro';
import { Image } from '@nutui/nutui-react-taro';

export interface FairysTaroUploaderItem {
  /**id*/
  id: string;
  /**唯一标识(用于匹配上传结果)*/
  uuid?: string;
  /**名称*/
  name?: string;
  /**上传项状态*/
  status?: 'success' | 'error' | 'uploading';
  /**上传项状态消息*/
  message?: string;
  /**文件类型*/
  type?: string;
  /**预览url地址*/
  previewUrl?: string;
  /**上传结果数据*/
  uploadResult?: any;
}

export interface FairysTaroUploaderBaseProps {
  /**上传项列表*/
  value?: FairysTaroUploaderItem[];
  /**上传项列表改变事件*/
  onChange?: (value: FairysTaroUploaderItem[]) => void;
  /**选择图片选项*/
  chooseImageOption?: Taro.chooseImage.Option;
  /**上传文件*/
  uploadFile?: (item: FairysTaroUploaderItem) => Promise<any>;
  /**加载预览*/
  loadPreviewItem?: (item: FairysTaroUploaderItem) => Promise<string>;
  /**预览图片*/
  previewImageOption?: Taro.previewImage.Option;
  /**最大上传数量*/
  maxCount?: number;
  /**是否仅预览*/
  isOnlyPreview?: boolean;
  /**上传按钮文本*/
  uploadLabel?: React.ReactNode;
  /**上传按钮图标*/
  uploadIcon?: React.ReactNode;
}

export class FairysTaroUploaderBaseInstance {
  /**上传项列表改变事件*/
  onChange?: FairysTaroUploaderBaseProps['onChange'];
  /**选择图片选项*/
  chooseImageOption?: FairysTaroUploaderBaseProps['chooseImageOption'];
  /**上传文件*/
  uploadFile?: FairysTaroUploaderBaseProps['uploadFile'];
  /**加载预览*/
  loadPreviewItem?: FairysTaroUploaderBaseProps['loadPreviewItem'];
  /**预览图片*/
  previewImageOption?: FairysTaroUploaderBaseProps['previewImageOption'];
  /**最大上传数量*/
  maxCount?: FairysTaroUploaderBaseProps['maxCount'];
  /**上传项列表*/
  store = proxy<{ value: FairysTaroUploaderItem[] }>({ value: [] });
  /**更新上传项列表*/
  updatedValue = (value: FairysTaroUploaderItem[]) => {
    this.store.value = [...value];
  };

  /**加载预览*/
  loadPreview = async () => {
    if (typeof this.loadPreviewItem !== 'function') {
      return;
    }
    const fileList = this.store.value;
    for (let index = 0; index < fileList.length; index++) {
      const element = fileList[index];
      if (element.previewUrl) {
        continue;
      }
      // 获取预览数据
      const previewUrl = await this.loadPreviewItem(element);
      const finxIndex = this.store.value.findIndex((it) => it.id === element.id);
      if (finxIndex !== -1) {
        const _item = { ...this.store.value[finxIndex] };
        _item.previewUrl = previewUrl;
        if (!previewUrl) {
          _item.status = 'error';
          _item.message = '加载预览失败';
        }
        this.store.value[finxIndex] = { ..._item };
      }
    }
  };

  /**循环上传文件*/
  loopUpload = async (items: FairysTaroUploaderItem[]) => {
    if (typeof this.uploadFile !== 'function') {
      return;
    }
    /**上传文件*/
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      try {
        /**上传文件*/
        const uploadResult = await this.uploadFile(item);
        const finxIndex = this.store.value.findIndex((it) => it.uuid === item.uuid);
        if (finxIndex !== -1 && uploadResult) {
          const _item = { ...this.store.value[finxIndex] };
          _item.uploadResult = uploadResult;
          _item.status = 'success';
          _item.message = '上传成功';
          this.store.value[finxIndex] = { ..._item };
        }
      } catch (error) {
        const finxIndex = this.store.value.findIndex((it) => it.uuid === item.uuid);
        if (finxIndex !== -1) {
          const _item = { ...this.store.value[finxIndex] };
          _item.status = 'error';
          _item.message = '上传失败';
          this.store.value[finxIndex] = { ..._item };
        }
      }
    }
    /**上传完成*/
    this.onChange?.([...this.store.value]);
  };

  /**上传项列表改变事件*/
  onValuesChange = (_value: Taro.chooseImage.SuccessCallbackResult) => {
    const tempFiles: FairysTaroUploaderItem[] = (_value.tempFiles || []).map((it, index) => {
      const uuid = new Date().valueOf() + '_' + index;
      const name = it.path.split('/').pop() || '';
      return {
        id: it.path,
        uuid: uuid,
        name: name,
        type: it.type,
        status: typeof this.uploadFile !== 'function' ? 'success' : 'uploading',
        previewUrl: it.path,
        message: typeof this.uploadFile !== 'function' ? '上传成功' : '上传中',
      };
    });
    const _list = [...this.store.value].concat([...tempFiles]);
    this.updatedValue(_list);
    this.onChange?.(_list);
    /**进行上传数据处理*/
    this.loopUpload([...tempFiles]);
  };

  /**点击上传图标*/
  onClickUploaderButton = () => {
    const length = this.store.value.length;
    const pam: Taro.chooseImage.Option = {};
    if (this.maxCount) {
      if (length >= this.maxCount) {
        Taro.showToast({
          title: '最多只能上传' + this.maxCount + '张图片',
          icon: 'none',
        });
        return;
      }
      const count = this.maxCount - length;
      pam.count = count;
    }
    Taro.chooseImage({
      ...this.chooseImageOption,
      ...pam,
      success: (res) => {
        this.onValuesChange(res);
      },
      fail: (err) => {
        console.log(err);
        Taro.showToast({
          title: err.errMsg,
          icon: 'none',
        });
      },
    });
  };

  /**预览图片*/
  onPreviewImage = (item: FairysTaroUploaderItem) => {
    // 所有数据
    const _snapshot = snapshot(this.store);
    const fileList = _snapshot.value;
    Taro.previewImage({
      ...this.previewImageOption,
      urls: fileList.map((it) => it.previewUrl || '').filter(Boolean),
      current: item.previewUrl || '',
    });
  };

  /**删除*/
  onDeleteItem = (item: FairysTaroUploaderItem) => {
    const _list = this.store.value.filter((it) => !(it.id === item.id || it.uuid === item.uuid));
    this.updatedValue([..._list]);
    this.onChange?.([..._list]);
  };
}

const useFairysTaroUploaderBaseInstance = () => {
  const ref = useRef<FairysTaroUploaderBaseInstance>();
  if (!ref.current) {
    ref.current = new FairysTaroUploaderBaseInstance();
  }
  return ref.current;
};

export interface FairysTaroUploaderItemBaseProps {
  /**上传项*/
  item: FairysTaroUploaderItem;
  /**上传项列表实例*/
  uploaderBaseInstance?: FairysTaroUploaderBaseInstance;
  /**是否仅预览*/
  isOnlyPreview?: boolean;
}

/**渲染图片列表*/
export const FairysTaroUploaderItemBase = (props: FairysTaroUploaderItemBaseProps) => {
  const { item, uploaderBaseInstance, isOnlyPreview } = props;
  const status = item.status;
  const previewUrl = item.previewUrl || '';
  const message = item.message || '';
  /**图标*/
  const icon =
    status === 'uploading' ? (
      <Loading className="nut-icon-loading" color="#fff" />
    ) : status === 'error' ? (
      <Failure color="#fff" />
    ) : null;

  return (
    <View className="fairystaroform__w-[100px] fairystaroform__h-[100px] fairystaroform__relative fairystaroform__box-border fairystaroform__rounded-sm">
      <Image
        mode="aspectFill"
        src={previewUrl}
        className="fairystaroform__w-full fairystaroform__h-full fairystaroform__rounded-sm "
        onClick={() => uploaderBaseInstance.onPreviewImage(item)}
      />
      {status === 'uploading' || status === 'error' ? (
        <View className="fairystaroform__absolute fairystaroform__top-0 fairystaroform__left-0 fairystaroform__w-full fairystaroform__h-full fairystaroform__bg-black/50 fairystaroform__rounded-sm fairystaroform__flex fairystaroform__flex-col fairystaroform__items-center fairystaroform__justify-center fairystaroform__gap-2 ">
          {icon}
          {message && <View className="fairystaroform__text-white">{message}</View>}
        </View>
      ) : (
        <Fragment />
      )}
      {isOnlyPreview ? (
        <Fragment />
      ) : (
        <View className="fairystaroform__absolute fairystaroform__right-[-8px] fairystaroform__top-[-8px]">
          <Close2
            className="fairystaroform__w-[20px] fairystaroform__h-[20px]"
            onClick={() => uploaderBaseInstance.onDeleteItem(item)}
          />
        </View>
      )}
    </View>
  );
};

/**图片、文件上传*/
export const FairysTaroUploaderBase = (props: FairysTaroUploaderBaseProps) => {
  const {
    value,
    onChange,
    previewImageOption,
    chooseImageOption,
    uploadFile,
    loadPreviewItem,
    maxCount,
    isOnlyPreview,
    uploadLabel,
    uploadIcon = <Photograph size="20px" color="#808080" />,
  } = props;
  const uploaderBaseInstance = useFairysTaroUploaderBaseInstance();
  uploaderBaseInstance.previewImageOption = previewImageOption;
  uploaderBaseInstance.chooseImageOption = chooseImageOption;
  uploaderBaseInstance.maxCount = maxCount;
  uploaderBaseInstance.onChange = onChange;
  uploaderBaseInstance.uploadFile = uploadFile;
  uploaderBaseInstance.loadPreviewItem = loadPreviewItem;

  const snapshot = useSnapshot(uploaderBaseInstance.store);

  useMemo(() => {
    uploaderBaseInstance.updatedValue(value || []);
    uploaderBaseInstance.loadPreview();
  }, [value]);
  const fileList = snapshot.value;

  const isShowUploadButton = useMemo(() => {
    if (isOnlyPreview) {
      return false;
    }
    if (!maxCount) {
      return true;
    }
    return fileList.length < maxCount;
  }, [fileList.length, maxCount, isOnlyPreview]);

  return (
    <View className="fairystaroform__flex fairystaroform__flex-row fairystaroform__items-center fairystaroform__gap-2 fairystaroform__box-border fairystaroform__flex-wrap">
      {(fileList || []).map((item) => {
        return (
          <FairysTaroUploaderItemBase
            uploaderBaseInstance={uploaderBaseInstance}
            key={item.uuid || item.id}
            item={item}
          />
        );
      })}
      {isShowUploadButton ? (
        <View
          className="fairystaroform__w-[100px] fairystaroform__h-[100px] fairystaroform__relative fairystaroform__box-border fairystaroform__rounded-sm fairystaroform__bg-[#f2f3f5] fairystaroform__flex fairystaroform__flex-col fairystaroform__items-center fairystaroform__justify-center fairystaroform__gap-2"
          onClick={uploaderBaseInstance.onClickUploaderButton}
        >
          {uploadIcon}
          {uploadLabel ? (
            <View className="fairystaroform__text-center fairystaroform__text-gray-600">{uploadLabel}</View>
          ) : (
            <Fragment />
          )}
        </View>
      ) : (
        <Fragment />
      )}
    </View>
  );
};
