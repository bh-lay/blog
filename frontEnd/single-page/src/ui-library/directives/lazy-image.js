import { LazyLoadManager } from '@/common/js/lazy-load-manager.js'
// import lazyPlaceholderUrl from '@/ui-library/images/lazy-placeholder.svg'
const nodeUnObserverFnKey = '@@lazy-image-observer'
const lazyPlaceholderUrl = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSItMTAyNCAtMTAyNCAzMDcyIDMwNzIiIHdpZHRoPSI0MHB4IiBoZWlnaHQ9IjQwcHgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzg0LjEyOCAzNTJhOTYgOTYgMCAxIDEtMTkyIDAgOTYgOTYgMCAwIDEgMTkyIDB6IiBmaWxsPSIjZjRmNGY0IiAvPjxwYXRoIGQ9Ik0xMjguMTI4IDY0YTEyOCAxMjggMCAwIDAtMTI4IDEyOHY2NDBhMTI4IDEyOCAwIDAgMCAxMjggMTI4aDc2OGExMjggMTI4IDAgMCAwIDEyOC0xMjhWMTkyYTEyOCAxMjggMCAwIDAtMTI4LTEyOGgtNzY4eiBtNzY4IDY0YTY0IDY0IDAgMCAxIDY0IDY0djQxNmwtMjQxLjcyOC0xMjQuNjA4YTMyIDMyIDAgMCAwLTM2LjkyOCA1Ljk1MmwtMjM3LjQ0IDIzNy40NC0xNzAuMjQtMTEzLjQwOGEzMiAzMiAwIDAgMC00MC4zMiAzLjk2OEw2NC4xMjggNzY4VjE5MmE2NCA2NCAwIDAgMSA2NC02NGg3Njh6IiBmaWxsPSIjZjRmNGY0Ii8+PC9zdmc+'
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
