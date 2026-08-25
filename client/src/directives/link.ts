import { useRouter } from "vue-router";

export const linkDirective = {
  mounted(el: HTMLElement, binding: any) {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      const router = useRouter();
      const { value } = binding;
      if (value) {
        router.push(value);
      } else {
        const href = el.getAttribute("href");
        if (href) {
          router.push({
            path: href,
            query: {
              title: el.innerText,
            },
          });
        }
      }
    });
  },
};
