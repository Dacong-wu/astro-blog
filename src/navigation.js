import { getPermalink, getAsset } from './utils/permalinks';
export const headerData = {
  links: [
    {
      text: '首页',
      href: getPermalink('/'),
    },
    {
      text: '知识分享',
      href: getPermalink('/knowledge'),
      links: [
        {
          text: '标签列表',
          href: getPermalink('tags'),
        },
        {
          text: '分类列表',
          href: getPermalink('categories'),
        },
      ],
    },
    {
      text: '摄影展示',
      href: getPermalink('/photography'),
      links: [
        {
          text: '武汉行',
          href: getPermalink('photography/wuhan'),
        },
        {
          text: '温州行',
          href: getPermalink('photography/wenzhou'),
        },
        {
          text: '杭州行',
          href: getPermalink('photography/hangzhou'),
        },
      ],
    },
    {
      text: '关于我',
      href: getPermalink('/about'),
    },
  ],
};

export const footerData = {
  links: [
    {
      title: '知识分享',
      href: getPermalink('/knowledge'),
      links: [
        { text: '标签列表', href: getPermalink('tags') },
        { text: '分类列表', href: getPermalink('categories') },
      ],
    },
    {
      title: '摄影展示',
      href: getPermalink('/photography'),
      links: [
        { text: '武汉行', href: getPermalink('photography/wuhan'), },
        { text: '温州行', href: getPermalink('photography/wenzhou') },
        { text: '杭州行', href: getPermalink('photography/hangzhou') },
      ],
    },
    {
      title: '关于我',
      href: getPermalink('/about'),
      links: [{ text: '技术栈', href: getPermalink('/about#technology-stack') }],
    },
  ],
  socialLinks: [
    { ariaLabel: 'RSS Feed', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    {
      ariaLabel: 'Github',
      icon: 'tabler:brand-github',
      target: '_blank',
      href: 'https://github.com/Dacong-wu/astro-blog',
    },
  ],
  // footNote: `<span class="ml-1.5">Made By Span · 2023 - <a class="hover:underline" href="https://beian.miit.gov.cn/">苏ICP备2021045936号-2</a></span>`,
  footNote: `<span class="ml-1.5">Made By &copy;Span · 2023 - <a class="hover:underline" href="https://beian.miit.gov.cn/">苏ICP备2021045936号-2</a></span>`,
};
