
import { loadImg } from '@/common/js/node-utils.js'
const nodeUnObserverFnKey = '@@lazy-image-observer'
const nodePlaceholderClass = 'ui-lazy-image-placeholder'
const nodeLoadedClass = 'ui-lazy-image-loaded'
function waitImageLoad(el, realImgSrc, nextFn) {
  const options = {
    rootMargin: '0px',
    threshold: 0.1,
  };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadImg(realImgSrc, () => {
          nextFn && nextFn();
        })
        observer.unobserve(el);
      }
    });
  }, options);
  observer.observe(el);
  return function unobserve() {
    observer.unobserve(el);
  }
}
export default {
  bind: (el, binding) => {
    const realImgSrc = binding.value
    el[nodeUnObserverFnKey] = waitImageLoad(el, realImgSrc, () => {
      el.classList.remove(nodePlaceholderClass)
      el.classList.add(nodeLoadedClass)
      el.src = realImgSrc;
    })
    el.classList.add(nodePlaceholderClass)
  },
  unbind: (el) => {
    if (el[nodeUnObserverFnKey]) {
      el[nodeUnObserverFnKey]();
    }
    el.classList.remove(nodePlaceholderClass)
    el.classList.remove(nodeLoadedClass)
  },
};
