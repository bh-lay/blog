
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

function unobserve(el) {
  if (el[nodeUnObserverFnKey]) {
    el[nodeUnObserverFnKey]();
  }
}
export default {
  bind: (el, binding) => {
    const realImgSrc = binding.value
    el[nodeUnObserverFnKey] = waitImageLoad(el, realImgSrc, () => {
      el.classList.remove(nodePlaceholderClass)
      el.classList.add(nodeLoadedClass)
      el.src = realImgSrc;
      unobserve(el)
      setTimeout(() => {
        el.classList.remove(nodeLoadedClass)
      }, 1500)
    })
    el.classList.add(nodePlaceholderClass)
  },
  unbind: (el) => {
    unobserve(el)
    el.classList.remove(nodePlaceholderClass)
    el.classList.remove(nodeLoadedClass)
  },
};
