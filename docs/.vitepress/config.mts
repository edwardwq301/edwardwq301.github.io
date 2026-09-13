import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "jane12",
  description: "jane12's Note",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // 左上角标题直接进内容，不经过正在跳转的根路径
    logoLink: "/tools/editor",
    search: { provider: "local" },
    nav: [
      { text: "Tools", link: "/tools/git" },
      { text: "Backend", link: "/backend/python" },
      { text: "Others", link: "/others/ps" },
      // { text: "Frontend", link: "/frontend/css" },
    ],
    sidebar: {
      "/tools/": [
        {
          text: "Tools",
          // collapsed: false,
          items: [
            { text: "编辑器", link: "/tools/editor" },
            { text: "Git", link: "/tools/git" },
            { text: "Linux", link: "/tools/linux" },
            { text: "新机开荒", link: "/tools/assart" },
            // { text: "Typst", link: "/tools/typst" },
          ],
        },
      ],
      "/backend/": [
        {
          text: "Backend",
          collapsed: true,
          items: [
            { text: "Python", link: "/backend/python" },
            { text: "Python 装饰器", link: "/backend/py_decorator" },
            { text: "TypeScript", link: "/backend/typescript" },
            // { text: "Java", link: "/backend/java" },
            // { text: "Algorithm", link: "/backend/algorithm" },
            // {
            //   text: "LeetCode",
            //   items: [
            //     { text: "Part1", link: "/backend/leetcode-part1" },
            //     { text: "Part2", link: "/backend/leetcode-part2" },
            //     { text: "Part3", link: "/backend/leetcode-part3" },
            //   ],
            // },
            // { text: "剑指", link: "/backend/sword" },
          ],
        },
      ],
      // "/frontend/": [
      //   {
      //     text: "Frontend",
      //     items: [
      //       { text: "CSS", link: "/frontend/css" },
      //       { text: "Vue", link: "/frontend/vue" },
      //     ],
      //   },
      // ],
      "/others/": [
        {
          text: "Others",
          items: [
            { text: "Ps", link: "/others/ps" },
            { text: "LLM 会话交接", link: "/others/llm" },
            // { text: "English", link: "/others/english" },
          ],
        },
      ],
    },
  },
  markdown: {
    image: {
      lazyLoad: true,
    },
    math: true,
  },
});
