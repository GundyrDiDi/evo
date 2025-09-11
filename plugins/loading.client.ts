export default defineNuxtPlugin((nuxtApp) => {
  const STYLE_ID = "v-loading-styles";
  const CLASS_MASK = "v-loading-mask";
  const CLASS_SPINNER = "v-loading-spinner";

  // 动态创建并注入CSS
  const createStyles = () => {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
              .${CLASS_MASK} {
                  position: absolute;
                  inset: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: rgba(255,255,255,0.1);
                  z-index: 1000;
              }
              .${CLASS_SPINNER} {
                  width: 40px;
                  height: 40px;
                  border: 3px solid rgba(0,0,0,0.1);
                  border-top-color: #3498db;
                  border-radius: 50%;
                  animation: v-loading-spin 1s linear infinite;
              }
              @keyframes v-loading-spin {
                  to { transform: rotate(360deg); }
              }
          `;
      document.head.appendChild(style);
    }
  };

  // 指令实现
  const vLoading = {
    mounted(el, { value }) {
      createStyles();

      el.style.position = "relative";

      // 创建加载元素
      const mask = document.createElement("div");
      mask.className = CLASS_MASK;

      const spinner = document.createElement("div");
      spinner.className = CLASS_SPINNER;

      mask.appendChild(spinner);
      el.loadingElement = mask;

      // 初始状态
      if (value) {
        el.appendChild(mask);
      }
    },
    updated(el, { value, oldValue }) {
      if (value !== oldValue) {
        if (value) {
          el.appendChild(el.loadingElement);
        } else if (el.contains(el.loadingElement)) {
          el.removeChild(el.loadingElement);
        }
      }
    },
  };
  nuxtApp.vueApp.directive("loading", vLoading);
});
