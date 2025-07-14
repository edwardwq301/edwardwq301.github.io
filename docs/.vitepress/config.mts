import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Edwardwq301",
  description: "Edwardwq301's Note",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: { provider: "local" },
    nav: [
      { text: "Home", link: "/" },
      {
        text: "Tools",
        link: "/tools/git",
      },
      {
        text: "Backend",
        link: "/backend/python",
      },
    ],
    sidebar: {
      "/tools/": [
        {
          text: "Tools",
          // collapsed: false,
          items: [
            { text: "Git", link: "/tools/git" },
            { text: "Linux", link: "/tools/linux" },
            { text: "新机开荒", link: "/tools/assart" },
            { text: "编辑器", link: "/tools/editor" },
          ],
        },
      ],
      "/backend/": [
        {
          text: "Backend",
          // collapsed: false,
          items: [
            { text: "Python", link: "/backend/python" },
            { text: "TypeScript", link: "/backend/typescript" },
            { text: "Java", link: "/backend/java" },
            { text: "Algorithm", link: "/backend/algorithm" },
            {
              text: "LeetCode",
              items: [
                { text: "Part1", link: "/backend/leetcode-part1" },
                { text: "Part2", link: "/backend/leetcode-part2" },
                { text: "Part3", link: "/backend/leetcode-part3" },
              ],
            },
            { text: "剑指", link: "/backend/sword" },
            { text: "C++", link: "/backend/effectivecpp" },
          ],
        },
      ],
      "/others/": [
        {
          text: "Others",
          items: [{ text: "English", link: "/others/english" }],
        },
      ],
    },
    socialLinks: [{ icon: "github", link: "https://github.com/edwardwq301/edwardwq301.github.io" }],
  },
  markdown: {
    image: {
      lazyLoading: true,
    },
  },
});
