// src/directives/long-press.js
export default {
    beforeMount(el, binding) {
      let pressTimer = null;
  
      const start = (e) => {
        if (e.type === 'click' && e.button !== 0) {
          return;
        }
        if (pressTimer === null) {
          pressTimer = setTimeout(() => binding.value(e), 600);
        }
      };
  
      const cancel = () => {
        if (pressTimer !== null) {
          clearTimeout(pressTimer);
          pressTimer = null;
        }
      };
  
      el.addEventListener('mousedown', start);
      el.addEventListener('touchstart', start);
      el.addEventListener('click', cancel);
      el.addEventListener('mouseout', cancel);
      el.addEventListener('touchend', cancel);
      el.addEventListener('touchcancel', cancel);
    }
  };
  