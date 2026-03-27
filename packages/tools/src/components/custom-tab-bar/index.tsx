import { proxy, useSnapshot, ref } from 'valtio';
import { CoverImage, CoverView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Fragment, memo, useMemo } from 'react';
import clsx from 'clsx';

let fairysTaroCustomTabBarRender: React.ReactNode | undefined;

/**自定义底部导航栏状态管理*/
export const fairysTaroCustomTabBarState = proxy({
  /**当前选中的项*/
  selected: '',
  items: ref([]) as FairysTaroCustomTabBarItemItem[],
  isUpdatedItems: false,
  /**未选中颜色*/
  color: 'rgb(156 163 175)',
  /**选中颜色*/
  selectedColor: '#000',
  /**切换标签*/
  onSwitchTab: (url: string) => {
    fairysTaroCustomTabBarState.selected = url;
    Taro.switchTab({ url });
  },
  /**更新自定义底部导航栏项*/
  onUpdatedItems: (items: FairysTaroCustomTabBarItemItem[]) => {
    fairysTaroCustomTabBarState.items = ref(items);
    fairysTaroCustomTabBarState.isUpdatedItems = true;
  },
  /**设置自定义底部导航栏渲染*/
  onSetTabBarRender: (_tabBarRender: React.ReactNode) => {
    fairysTaroCustomTabBarRender = _tabBarRender;
    fairysTaroCustomTabBarState.isUpdatedItems = false;
  },
});

export interface FairysTaroCustomTabBarItemItem {
  /**自定义底部导航栏项文本*/
  text: string;
  /**自定义底部导航栏项 URL*/
  url: string;
  /**自定义底部导航栏项图标*/
  icon?: string;
  /**自定义底部导航栏项样式*/
  style?: React.CSSProperties;
  /**自定义底部导航栏项类名*/
  className?: string;
  /**自定义底部导航栏项选中图标*/
  selectedIcon?: string;
  /**自定义底部导航栏项选中图标样式*/
  selectedIconStyle?: React.CSSProperties;
  /**自定义底部导航栏项图标样式*/
  iconStyle?: React.CSSProperties;
  /**自定义底部导航栏项选中图标类名*/
  selectedIconClassName?: string;
  /**自定义底部导航栏项选中文本样式*/
  selectedTextStyle?: React.CSSProperties;
  /**自定义底部导航栏项文本样式*/
  textStyle?: React.CSSProperties;
  /**自定义底部导航栏项选中文本类名*/
  selectedTextClassName?: string;
}

export interface FairysTaroCustomTabBarProps {}

export interface FairysTaroCustomTabBarItemProps {
  /**自定义底部导航栏项*/
  item: FairysTaroCustomTabBarItemItem;
}

const FairysTaroCustomTabBarItemBase = (props: FairysTaroCustomTabBarItemProps) => {
  const { item } = props;
  const { selected, color, selectedColor } = useSnapshot(fairysTaroCustomTabBarState);
  const isSelected = selected === item.url;
  const className = useMemo(() => clsx('fairys_taro_custom_tab_bar_item', item.className), [item.className]);
  const imgClassName = useMemo(
    () =>
      clsx('fairys_taro_custom_tab_bar_item_img', item.selectedIconClassName, {
        fairys_taro_custom_tab_bar_item_img_selected: isSelected,
        // 'fairystaro__opacity-100': isSelected,
        // 'fairystaro__opacity-60': !isSelected,
      }),
    [item.selectedIconClassName, isSelected],
  );
  const imgStyle = useMemo(() => {
    return {
      opacity: isSelected ? 1 : 0.6,
    };
  }, [isSelected]);

  const textClassName = useMemo(
    () =>
      clsx('fairys_taro_custom_tab_bar_item_text', item.selectedTextClassName, {
        fairys_taro_custom_tab_bar_item_text_selected: isSelected,
        // 'fairystaro__text-black': isSelected,
        // 'fairystaro__text-gray-400': !isSelected,
      }),
    [item.selectedTextClassName, isSelected],
  );

  const textStyle = useMemo(() => {
    return { color: isSelected ? selectedColor : color };
  }, [isSelected, color, selectedColor]);

  return (
    <CoverView
      onClick={() => fairysTaroCustomTabBarState.onSwitchTab(item.url)}
      key={item.url}
      style={item.style}
      className={className}
    >
      {item.icon ? (
        <CoverImage
          src={isSelected ? item.selectedIcon || item.icon : item.icon}
          className={imgClassName}
          style={{ ...imgStyle, ...((isSelected ? item.selectedIconStyle : item.iconStyle) || {}) }}
        />
      ) : (
        <Fragment />
      )}
      <CoverView
        className={textClassName}
        style={{
          ...((isSelected ? item.selectedTextStyle : item.textStyle) || {}),
          ...textStyle,
        }}
      >
        {item.text}
      </CoverView>
    </CoverView>
  );
};

const FairysTaroCustomTabBarBase = () => {
  const { items } = useSnapshot(fairysTaroCustomTabBarState);
  const _itemsRender = useMemo(() => {
    if (fairysTaroCustomTabBarState.isUpdatedItems === false && fairysTaroCustomTabBarRender) {
      return fairysTaroCustomTabBarRender;
    }
    const render = items.map((item) => {
      return <FairysTaroCustomTabBarItemBase key={item.url} item={item} />;
    });
    fairysTaroCustomTabBarState.onSetTabBarRender(render);
    return render;
  }, [items]);

  return (
    <CoverView className="fairys_taro_custom_tab_bar">
      <CoverView className="fairys_taro_custom_tab_bar-border"></CoverView>
      {_itemsRender}
    </CoverView>
  );
};

export const FairysTaroCustomTabBar = memo(() => {
  return useMemo(() => <FairysTaroCustomTabBarBase />, []);
});

/**
 * 页面高度问题
 */
export const useFairysTaroCustomTabBarPageStyle = () => {
  return useMemo(() => {
    const height = Taro.getSystemInfoSync().windowHeight;
    return {
      height: height - 60,
      overflowY: 'auto',
    };
  }, []);
};
