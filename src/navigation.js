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
    },
    {
      text: '摄影展示',
      href: getPermalink('/photography'),
    },
    {
      text: '幸福记录',
      href: getPermalink('/happiness'),
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
    },
    {
      title: '摄影展示',
      href: getPermalink('/photography'),
      links: [{ text: '杭州行', href: getPermalink('photography/hangzhou') }],
    },
    {
      title: '幸福记录',
      href: getPermalink('/happiness'),
      links: [{ text: '1999', href: 'https://2018-0215.cn', target: '_blank' }],
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
  footNote: `<span class="ml-1.5">Made By Span · 2023 - <a class="hover:underline" href="https://onwidget.com/">苏ICP备2021045936号-2</a></span>`,
};
