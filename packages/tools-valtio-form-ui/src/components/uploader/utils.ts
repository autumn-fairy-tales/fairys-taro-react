import type { FairysTaroUploaderItem } from './index';

// 把类型不是这些的转换成这些
// image 图片格式
// video 视频格式
// doc	doc 格式
// docx	docx 格式
// xls	xls 格式
// xlsx	xlsx 格式
// ppt	ppt 格式
// pptx	pptx 格式
// pdf	pdf 格式

export class TransformationFileType {
  static imagePrefixes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/x-icon', 'image/svg+xml'];
  static imagePrefixesBase64 = TransformationFileType.imagePrefixes.map((prefix) => `data:${prefix};base64,`);
  static videoPrefixes = ['video/mp4', 'video/webm', 'video/ogg', 'video/mpeg', 'video/vnd.rn-realvideo'];
  static videoPrefixesBase64 = TransformationFileType.videoPrefixes.map((prefix) => `data:${prefix};base64,`);
  static docPrefixe = 'application/msword';
  static docPrefixeBase64 = `data:${TransformationFileType.docPrefixe};base64,`;
  static docxPrefixe = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  static docxPrefixeBase64 = `data:${TransformationFileType.docxPrefixe};base64,`;
  static xlsPrefixe = 'application/vnd.ms-excel';
  static xlsPrefixeBase64 = `data:${TransformationFileType.xlsPrefixe};base64,`;
  static xlsxPrefixe = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  static xlsxPrefixeBase64 = `data:${TransformationFileType.xlsxPrefixe};base64,`;
  static pptPrefixe = 'application/vnd.ms-powerpoint';
  static pptPrefixeBase64 = `data:${TransformationFileType.pptPrefixe};base64,`;
  static pptxPrefixe = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  static pptxPrefixeBase64 = `data:${TransformationFileType.pptxPrefixe};base64,`;
  static pdfPrefixe = 'application/pdf';
  static pdfPrefixeBase64 = `data:${TransformationFileType.pdfPrefixe};base64,`;

  /**通过文件名转换文件类型*/
  static transformationFileNameType = (fileName: string): FairysTaroUploaderItem['previewType'] => {
    const fileType = `${fileName}`.toLowerCase().split('.').pop() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(fileType)) {
      return 'image';
    } else if (['mp4', 'webm', 'ogg', 'mpeg', 'avi', 'rmvb'].includes(fileType)) {
      return 'video';
    } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'].includes(fileType)) {
      return fileType as FairysTaroUploaderItem['previewType'];
    }
    return 'unknown';
  };

  /**通过contentType/或base64编码转换文件类型*/
  static transformationFileType = (content: string): FairysTaroUploaderItem['previewType'] => {
    const _base64String = `${content}`.toLowerCase();
    // 检查是否是base64编码
    if (_base64String.startsWith('data:')) {
      // 检查是否是图片
      for (const prefix of TransformationFileType.imagePrefixesBase64) {
        if (_base64String.startsWith(prefix)) {
          return 'image';
        }
      }
      // 检查是否是视频
      for (const prefix of TransformationFileType.videoPrefixesBase64) {
        if (_base64String.startsWith(prefix)) {
          return 'video';
        }
      }
    } else {
      // 检查是否是图片
      for (const prefix of TransformationFileType.imagePrefixes) {
        if (_base64String === prefix) {
          return 'image';
        }
      }
      // 检查是否是视频
      for (const prefix of TransformationFileType.videoPrefixes) {
        if (_base64String === prefix) {
          return 'video';
        }
      }
    }

    if (
      _base64String.startsWith(TransformationFileType.docPrefixeBase64) ||
      _base64String === TransformationFileType.docPrefixe
    ) {
      return 'doc';
    }
    if (
      _base64String.startsWith(TransformationFileType.docxPrefixeBase64) ||
      _base64String === TransformationFileType.docxPrefixe
    ) {
      return 'docx';
    }
    if (
      _base64String.startsWith(TransformationFileType.xlsPrefixeBase64) ||
      _base64String === TransformationFileType.xlsPrefixe
    ) {
      return 'xls';
    }
    if (
      _base64String.startsWith(TransformationFileType.xlsxPrefixeBase64) ||
      _base64String === TransformationFileType.xlsxPrefixe
    ) {
      return 'xlsx';
    }
    if (
      _base64String.startsWith(TransformationFileType.pptPrefixeBase64) ||
      _base64String === TransformationFileType.pptPrefixe
    ) {
      return 'ppt';
    }
    if (
      _base64String.startsWith(TransformationFileType.pptxPrefixeBase64) ||
      _base64String === TransformationFileType.pptxPrefixe
    ) {
      return 'pptx';
    }
    if (
      _base64String.startsWith(TransformationFileType.pdfPrefixeBase64) ||
      _base64String === TransformationFileType.pdfPrefixe
    ) {
      return 'pdf';
    }
    // 默认返回未知类型
    return 'unknown';
  };

  /**获取文件类型*/
  static getFileType = (
    url: string,
    type?: 'url' | 'base64',
    contentType?: string,
  ): FairysTaroUploaderItem['previewType'] => {
    if (contentType) {
      return TransformationFileType.transformationFileType(contentType);
    } else if (/(http|https):\/\//.test(url)) {
      return TransformationFileType.transformationFileNameType(url);
    } else if (type === 'base64') {
      return TransformationFileType.transformationFileType(contentType || url);
    }
    return TransformationFileType.transformationFileNameType(url);
  };
}
