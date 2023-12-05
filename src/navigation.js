export const headerData = {
  links: [
    {
      text: '首页',
      href: '/',
    },
    {
      text: '知识分享',
      href: '/knowledge',
    },
    {
      text: '摄影展示',
      href: '/photography',
    },
    {
      text: '幸福记录',
      href: '/happiness',
    },
    {
      text: '关于我',
      href: '/about',
    },
  ],
};

export const footerData = {
  links: [
    {
      title: '知识分享',
      href: '/knowledge',
    },
    {
      title: '摄影展示',
      href: '/photography',
    },
    {
      title: '幸福记录',
      href: '/happiness',
    },
    {
      title: '关于我',
      links: [{ text: '技术栈', href: '/about#technology-stack' }],
    },
  ],
  socialLinks: [{ ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/Dacong-wu' }],
  footNote: `<span class="ml-1.5">Made by spanBlog · 2023 - <a class="hover:underline" href="https://onwidget.com/">苏ICP备2021045936号-2</a></span>`,
};
