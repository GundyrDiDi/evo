export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("longpress", {
    mounted(el, binding) {
      const delay = binding.arg ? parseInt(binding.arg) : 200;
      let pressTimer: any = null;
      let progressTimer: any = null;
      let startTime: any = null;

      // 开始按压计时器
      const startPress = (e: MouseEvent) => {
        // 避免右键触发
        if (e.type === "click" && e.button !== 0) return;

        if (binding.value) {
          // 添加按压状态类名
          el.dispatchEvent(
            new CustomEvent("longpress-start", { bubbles: true })
          );

          // 清除现有计时器
          if (pressTimer !== null) {
            clearTimeout(pressTimer);
            pressTimer = null;
          }

          // 设置新的计时器
          pressTimer = setTimeout(() => {
            binding.value();
            el.dispatchEvent(
              new CustomEvent("longpress-complete", { bubbles: true })
            );
          }, delay);

          // 创建进度效果
          if (binding.modifiers.progress) {
            const progress = ref(0);
            startTime = Date.now();
            progressTimer = setInterval(() => {
              const elapsed = Date.now() - startTime;
              const progressPercent = Math.min((elapsed / delay) * 100, 100);
              el.dispatchEvent(
                new CustomEvent("longpress-progress", {
                  detail: progressPercent,
                  bubbles: true,
                })
              );
            }, Math.max(delay / 100, 16));
          }
        }
      };

      // 取消按压
      const cancelPress = () => {
        if (pressTimer !== null) {
          clearTimeout(pressTimer);
          pressTimer = null;
          el.dispatchEvent(
            new CustomEvent("longpress-cancel", { bubbles: true })
          );
        }
        if (progressTimer) {
          clearInterval(progressTimer);
          progressTimer = null;
          el.dispatchEvent(
            new CustomEvent("longpress-progress", {
              detail: 0,
              bubbles: true,
            })
          );
        }
      };

      // 添加事件监听器
      el.addEventListener("mousedown", startPress);
      el.addEventListener("touchstart", startPress);

      // 取消事件
      el.addEventListener("click", cancelPress);
      el.addEventListener("mouseup", cancelPress);
      el.addEventListener("mouseleave", cancelPress);
      el.addEventListener("touchend", cancelPress);
      el.addEventListener("touchcancel", cancelPress);

      // 保存事件处理器以便卸载
      el._longpressHandlers = {
        startPress,
        cancelPress,
      };
    },

    // 清理工作
    unmounted(el) {
      if (el._longpressHandlers) {
        const { startPress, cancelPress } = el._longpressHandlers;
        el.removeEventListener("mousedown", startPress);
        el.removeEventListener("touchstart", startPress);
        el.removeEventListener("click", cancelPress);
        el.removeEventListener("mouseup", cancelPress);
        el.removeEventListener("mouseleave", cancelPress);
        el.removeEventListener("touchend", cancelPress);
        el.removeEventListener("touchcancel", cancelPress);
      }
    },
  });
});
