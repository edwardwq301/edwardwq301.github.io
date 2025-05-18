import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "wqnote",
  description: "wq's note",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      {
        text: "tools",
        link: "/tools/git",
      },
      {
        text: "backend",
        link: "/backend/python",
      },
    ],
    sidebar: {
      "/tools/": [
        {
          text: "Tools",
          collapsed: false,
          items: [
            { text: "Git", link: "/tools/git" },
            { text: "编辑器", link: "/tools/editor" },
            { text: "Linux", link: "/tools/linux" },
            { text: "Typst", link: "/tools/typst" },
          ],
        },
      ],
      "/backend/": [
        {
          text: "Backend",
          collapsed: false,
          items: [
            { text: "Python", link: "/backend/python" },
            { text: "algorithm", link: "/backend/algorithm" },
            {
              text: "LeetCode",
              items: [
                { text: "part1", link: "/backend/leetcode-part1" },
                { text: "part2", link: "/backend/leetcode-part2" },
                { text: "part3", link: "/backend/leetcode-part3" },
              ],
            },
            { text: "剑指", link: "/backend/sword" },
            { text: "C++", link: "/backend/effectivecpp" },
          ],
        },
      ],
    },
    socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }],
    search: { provider: "local" },
  },
  markdown: {
    image: {
      lazyLoading: true,
    },
  },
});
