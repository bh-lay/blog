import { LazyLoadManager } from '@/common/js/lazy-load-manager.js'
import lazyPlaceholderUrl from '@/ui-library/images/lazy-placeholder.svg'
const nodeUnObserverFnKey = '@@lazy-image-observer'

// 使用自定义配置
const manager = new LazyLoadManager({
  rootMargin: '0px',
  threshold: 0.1,
  placeholder: lazyPlaceholderUrl,
  fallback: lazyPlaceholderUrl,
  srcAttr: 'src'
});

export default {
  bind: (el) => {
    el[nodeUnObserverFnKey] = manager.lazyLoad(el)
  },
  unbind: (el) => {
    if (el[nodeUnObserverFnKey]) {
      el[nodeUnObserverFnKey]();
      el[nodeUnObserverFnKey] = null;
    }
  },
};
