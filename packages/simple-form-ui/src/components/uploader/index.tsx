import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Fragment, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { Failure, Loading, Close2, Photograph, Link } from '@nutui/icons-react-taro';
import { Image } from '@nutui/nutui-react-taro';
import { FairysTaroUploaderBaseInstance, useFairysTaroUploaderBaseInstance } from './instance';

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
  /**预览url地址(建议使用http或者https协议地址，只有图片时可使用base64编码)*/
  previewUrl?: string;
  /**预览类型
   * @default "image"
   */
  previewType?: 'image' | 'video' | 'unknown' | keyof Taro.openDocument.FileType;
  /**上传结果数据*/
  uploadResult?: any;
  /**文件大小*/
  size?: number;
}

export interface FairysTaroUploaderBaseProps {
  /**上传项列表*/
  value?: FairysTaroUploaderItem[];
  /**上传项列表改变事件*/
  onChange?: (value: FairysTaroUploaderItem[]) => void;
  /**上传文件*/
  uploadFile?: (item: FairysTaroUploaderItem) => Promise<any>;
  /**加载预览*/
  loadPreviewItem?: (item: FairysTaroUploaderItem) => Promise<
    | string
    | {
        url: string;
        type?: 'url' | 'base64';
        contentType?: string;
        name?: string;
      }
  >;
  /**预览图片*/
  previewImageOption?: Taro.previewImage.Option;
  /**预览媒体文件*/
  previewMediaOption?: Taro.previewMedia.Option;
  /**最大上传数量*/
  maxCount?: number;
  /**是否仅预览*/
  isOnlyPreview?: boolean;
  /**上传按钮文本*/
  uploadLabel?: React.ReactNode;
  /**上传按钮图标*/
  uploadIcon?: React.ReactNode;
  /**多选*/
  multiple?: boolean;
  /**
   * 上传类型
   * @default "chooseImage"
   */
  uploadType?: 'chooseMessageFile' | 'chooseMedia' | 'chooseImage';
  /**选择图片选项*/
  chooseImageOption?: Taro.chooseImage.Option;
  /**选择消息文件选项*/
  chooseMessageFileOption?: Taro.chooseMessageFile.Option;
  /**选择媒体文件选项*/
  chooseMediaOption?: Taro.chooseMedia.Option;
}

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
    <View className="juhuitaro__w-[100px] juhuitaro__h-[100px] juhuitaro__relative juhuitaro__box-border juhuitaro__rounded-sm">
      <Image
        mode="aspectFill"
        src={previewUrl}
        className="juhuitaro__w-full juhuitaro__h-full juhuitaro__rounded-sm "
        onClick={() => uploaderBaseInstance.onPreviewImage(item)}
      />
      {status === 'uploading' || status === 'error' ? (
        <View className="juhuitaro__absolute juhuitaro__top-0 juhuitaro__left-0 juhuitaro__w-full juhuitaro__h-full juhuitaro__bg-black/50 juhuitaro__rounded-sm juhuitaro__flex juhuitaro__flex-col juhuitaro__items-center juhuitaro__justify-center juhuitaro__gap-2 ">
          {icon}
          {message && <View className="juhuitaro__text-white">{message}</View>}
        </View>
      ) : (
        <Fragment />
      )}
      {isOnlyPreview ? (
        <Fragment />
      ) : (
        <View className="juhuitaro__absolute juhuitaro__right-[-8px] juhuitaro__top-[-8px]">
          <Close2
            className="juhuitaro__w-[20px] juhuitaro__h-[20px] juhuitaro__text-gray-600!"
            onClick={() => uploaderBaseInstance.onDeleteItem(item)}
          />
        </View>
      )}
    </View>
  );
};

/**文件渲染*/
export const FairysTaroUploaderFileListItemBase = (props: FairysTaroUploaderItemBaseProps) => {
  const { item, uploaderBaseInstance, isOnlyPreview } = props;
  const status = item.status;
  /**图标*/
  const icon = status === 'uploading' ? <Loading className="nut-icon-loading" color="#fff" /> : null;

  return (
    <View className="juhuitaro__w-full juhuitaro__relative juhuitaro__box-border juhuitaro__flex juhuitaro__flex-row juhuitaro__items-center juhuitaro__gap-2">
      <View className="juhuitaro__flex juhuitaro__flex-row juhuitaro__items-center juhuitaro__gap-2">
        <Link />
        {icon}
      </View>
      <View className="juhuitaro__flex-1" onClick={() => uploaderBaseInstance.onPreviewImage(item)}>
        {item.name || item.id}
      </View>
      {isOnlyPreview ? (
        <Fragment />
      ) : (
        <View>
          <Close2
            className="juhuitaro__w-[20px] juhuitaro__h-[20px] juhuitaro__text-gray-600!"
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
    multiple = false,
    uploadType = 'chooseImage',
  } = props;
  const uploaderBaseInstance = useFairysTaroUploaderBaseInstance();
  uploaderBaseInstance.previewImageOption = previewImageOption;
  uploaderBaseInstance.chooseImageOption = chooseImageOption;
  uploaderBaseInstance.maxCount = maxCount;
  uploaderBaseInstance.multiple = multiple;
  uploaderBaseInstance.uploadType = uploadType;
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
  // 渲染分成两部分进行渲染，图片和视频 进行正常渲染，如果是其他的列表渲染，名称如果有则渲染名称，如果没有则渲染id

  const renderData = useMemo(() => {
    const imageAndVideoList = [];
    const otherList = [];
    for (let index = 0; index < fileList.length; index++) {
      const item = fileList[index];
      const previewType = `${item.previewType}`.toLowerCase();
      if (/^(image|video)/.test(previewType || '')) {
        imageAndVideoList.push(item);
      } else {
        otherList.push(item);
      }
    }
    return {
      imageAndVideoList,
      otherList,
    };
  }, [fileList]);

  return (
    <View className="juhuitaro__flex juhuitaro__flex-row juhuitaro__items-center juhuitaro__gap-4 juhuitaro__box-border juhuitaro__flex-wrap">
      {(renderData.imageAndVideoList || []).map((item) => {
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
          className="juhuitaro__w-[100px] juhuitaro__h-[100px] juhuitaro__relative juhuitaro__box-border juhuitaro__rounded-sm juhuitaro__bg-[#f2f3f5] juhuitaro__flex juhuitaro__flex-col juhuitaro__items-center juhuitaro__justify-center juhuitaro__gap-2"
          onClick={uploaderBaseInstance.onClickUploaderButton}
        >
          {uploadIcon}
          {uploadLabel ? (
            <View className="juhuitaro__text-center juhuitaro__text-gray-600">{uploadLabel}</View>
          ) : (
            <Fragment />
          )}
        </View>
      ) : (
        <Fragment />
      )}
      {(renderData.otherList || []).map((item) => {
        return (
          <FairysTaroUploaderFileListItemBase
            uploaderBaseInstance={uploaderBaseInstance}
            key={item.uuid || item.id}
            item={item}
          />
        );
      })}
    </View>
  );
};
