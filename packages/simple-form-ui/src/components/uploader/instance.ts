import { proxy, snapshot } from 'valtio';
import type { FairysTaroUploaderBaseProps, FairysTaroUploaderItem } from './index';
import { TransformationFileType } from './utils';
import Taro from '@tarojs/taro';
import { useRef } from 'react';

export class FairysTaroUploaderBaseInstance {
  /**上传项列表改变事件*/
  onChange?: FairysTaroUploaderBaseProps['onChange'];
  /**选择图片选项*/
  chooseImageOption?: FairysTaroUploaderBaseProps['chooseImageOption'];
  /**选择消息文件选项*/
  chooseMessageFileOption?: FairysTaroUploaderBaseProps['chooseMessageFileOption'];
  /**选择媒体文件选项*/
  chooseMediaOption?: FairysTaroUploaderBaseProps['chooseMediaOption'];
  /**上传文件*/
  uploadFile?: FairysTaroUploaderBaseProps['uploadFile'];
  /**
   * 加载预览
   * @description 加载预览图片或媒体文件的预览地址，（建议返回http或https开头的url地址，图片支持base64编码预览）
   */
  loadPreviewItem?: FairysTaroUploaderBaseProps['loadPreviewItem'];
  /**预览图片*/
  previewImageOption?: FairysTaroUploaderBaseProps['previewImageOption'];
  /**预览媒体文件*/
  previewMediaOption?: FairysTaroUploaderBaseProps['previewMediaOption'];
  /**最大上传数量*/
  maxCount?: FairysTaroUploaderBaseProps['maxCount'];
  /**多选*/
  multiple?: FairysTaroUploaderBaseProps['multiple'];
  /**上传类型*/
  uploadType?: FairysTaroUploaderBaseProps['uploadType'];
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
        if (typeof previewUrl === 'string') {
          _item.previewUrl = previewUrl;
          // 按照 base64 解析类型
          _item.previewType = TransformationFileType.getFileType(previewUrl, 'base64');
        } else if (previewUrl) {
          _item.previewUrl = previewUrl.url;
          _item.previewType = TransformationFileType.getFileType(
            previewUrl.url,
            previewUrl.type || 'url',
            previewUrl.contentType,
          );
          if (previewUrl.name) _item.name = previewUrl.name;
        }
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
  onValuesChange = (tempFiles: FairysTaroUploaderItem[]) => {
    const _list = [...this.store.value].concat([...tempFiles]);
    this.updatedValue(_list);
    this.onChange?.(_list);
    /**进行上传数据处理*/
    this.loopUpload([...tempFiles]);
  };

  /**选择图片改变事件*/
  onChooseImageChange = (_value: Taro.chooseImage.SuccessCallbackResult) => {
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
        previewType: TransformationFileType.transformationFileNameType(
          it.path,
        ) as FairysTaroUploaderItem['previewType'],
        size: it.size,
      };
    });
    this.onValuesChange(tempFiles);
  };

  /**选择媒体文件改变事件*/
  onChooseMediaChange = (_value: Taro.chooseMedia.SuccessCallbackResult) => {
    const tempFiles: FairysTaroUploaderItem[] = (_value.tempFiles || []).map((it, index) => {
      const uuid = new Date().valueOf() + '_' + index;
      const name = it.tempFilePath.split('/').pop() || '';
      return {
        id: it.tempFilePath,
        uuid: uuid,
        name: name,
        type: it.fileType,
        status: typeof this.uploadFile !== 'function' ? 'success' : 'uploading',
        previewUrl: it.tempFilePath,
        message: typeof this.uploadFile !== 'function' ? '上传成功' : '上传中',
        previewType: TransformationFileType.transformationFileNameType(
          it.tempFilePath,
        ) as FairysTaroUploaderItem['previewType'],
        size: it.size,
      };
    });
    this.onValuesChange(tempFiles);
  };

  /**选择消息文件改变事件*/
  onChooseMessageFileChange = (_value: Taro.chooseMessageFile.SuccessCallbackResult) => {
    const tempFiles: FairysTaroUploaderItem[] = (_value.tempFiles || []).map((it, index) => {
      const uuid = new Date().valueOf() + '_' + index;
      return {
        id: it.path,
        uuid: uuid,
        name: it.name,
        type: it.type,
        status: typeof this.uploadFile !== 'function' ? 'success' : 'uploading',
        previewUrl: it.path,
        message: typeof this.uploadFile !== 'function' ? '上传成功' : '上传中',
        previewType: TransformationFileType.transformationFileNameType(
          it.path,
        ) as FairysTaroUploaderItem['previewType'],
        size: it.size,
      };
    });
    this.onValuesChange(tempFiles);
  };

  /**点击上传图标*/
  onClickUploaderButton = () => {
    const length = this.store.value.length;
    const pam: any = { count: 1 };
    if (this.maxCount) {
      if (length >= this.maxCount) {
        Taro.showToast({
          title: '最多只能上传' + this.maxCount + '个文件',
          icon: 'none',
        });
        return;
      }
      if (this.multiple) {
        const count = this.maxCount - length;
        pam.count = count;
      }
    }
    if (this.uploadType === 'chooseImage') {
      Taro.chooseImage({
        ...this.chooseImageOption,
        ...pam,
        success: (res) => {
          this.onChooseImageChange(res);
        },
        fail: (err) => {
          console.log(err);
          Taro.showToast({
            title: err.errMsg,
            icon: 'none',
          });
        },
      });
    } else if (this.uploadType === 'chooseMedia') {
      Taro.chooseMedia({
        ...this.chooseMediaOption,
        ...pam,
        success: (res) => {
          this.onChooseMediaChange(res);
        },
        fail: (err) => {
          console.log(err);
          Taro.showToast({
            title: err.errMsg,
            icon: 'none',
          });
        },
      });
    } else if (this.uploadType === 'chooseMessageFile') {
      Taro.chooseMessageFile({
        ...this.chooseMessageFileOption,
        ...pam,
        success: (res) => {
          this.onChooseMessageFileChange(res);
        },
        fail: (err) => {
          console.log(err);
          Taro.showToast({
            title: err.errMsg,
            icon: 'none',
          });
        },
      });
    }
  };

  /**预览图片*/
  onPreviewImage = (item: FairysTaroUploaderItem) => {
    if (item.previewType === 'unknown') {
      Taro.showToast({
        title: '预览类型未知',
        icon: 'none',
      });
      return;
    }
    if (!item.previewUrl) {
      console.log('预览地址加载失败===>', item);
      Taro.showToast({
        title: '预览地址加载失败',
        icon: 'none',
      });
      return;
    }
    if (this.uploadType === 'chooseMessageFile') {
      const type = `${item.previewType}`.toLowerCase();
      // 判断非图片和视频文件
      if (!/^image|video/.test(type || '')) {
        if (/(http|https):\/\//.test(item.previewUrl || '')) {
          Taro.openDocument({
            filePath: item.previewUrl || '',
            fileType: item.previewType as unknown as keyof Taro.openDocument.FileType,
            fail: (err) => {
              console.log('Taro.openDocument==打开文件失败===>', item, err);
              Taro.showToast({
                title: err.errMsg || '打开文件失败',
                icon: 'none',
              });
            },
          });
        } else {
          Taro.showToast({
            title: '预览地址不正确，请使用http或https协议',
            icon: 'none',
          });
        }
        return;
      }
    }
    // 所有数据
    const _snapshot = snapshot(this.store);
    const fileList = _snapshot.value;
    // previewType
    if (this.uploadType === 'chooseImage') {
      // 图片预览
      Taro.previewImage({
        ...this.previewImageOption,
        urls: fileList.map((it) => it.previewUrl || '').filter(Boolean),
        current: item.previewUrl || '',
      });
    } else if (this.uploadType === 'chooseMedia' || this.uploadType === 'chooseMessageFile') {
      // 图片和视频预览
      Taro.previewMedia({
        ...this.previewMediaOption,
        sources: fileList
          .map((it) => {
            const type = `${it.previewType}`.toLowerCase();
            if (/^image/.test(type)) {
              return {
                type: 'image',
                url: it.previewUrl || '',
              } as Taro.previewMedia.Sources;
            } else if (/^video/.test(type)) {
              return {
                type: 'video',
                url: it.previewUrl || '',
              } as Taro.previewMedia.Sources;
            }
            return undefined;
          })
          .filter(Boolean),
      });
    }
  };

  /**删除*/
  onDeleteItem = (item: FairysTaroUploaderItem) => {
    let list = this.store.value;
    if (item.uuid) {
      list = list.filter((it) => it.uuid !== item.uuid);
    } else {
      list = list.filter((it) => it.id !== item.id);
    }
    this.updatedValue([...list]);
    this.onChange?.([...list]);
  };
}

export const useFairysTaroUploaderBaseInstance = () => {
  const ref = useRef<FairysTaroUploaderBaseInstance>();
  if (!ref.current) {
    ref.current = new FairysTaroUploaderBaseInstance();
  }
  return ref.current;
};
