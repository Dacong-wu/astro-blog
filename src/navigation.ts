import { getPermalink, getAsset } from './utils/permalinks';

// 公共数据配置
const COMMON_LINKS = [
  {
    title: '知识分享',
    href: getPermalink('/knowledge'),
    links: [
      { subtitle: '标签列表', href: getPermalink('tags') },
      { subtitle: '分类列表', href: getPermalink('categories') }
    ]
  },
  {
    title: '摄影展示',
    href: getPermalink('/photography'),
    links: [
      { subtitle: '云南行', href: getPermalink('photography/yunnan') },
      { subtitle: '武汉行', href: getPermalink('photography/wuhan') },
      { subtitle: '温州行', href: getPermalink('photography/wenzhou') },
      { subtitle: '杭州行', href: getPermalink('photography/hangzhou') }
    ]
  },
  {
    title: '工具集',
    href: getPermalink('/tools'),
    target: '_blank' as const,
    links: [
      {
        subtitle: '网络工具',
        href: getPermalink('/tools#network-tools'),
        target: '_blank' as const
      }
    ]
  },
  {
    title: '关于我',
    href: getPermalink('/about'),
    links: [{ subtitle: '技术栈', href: getPermalink('/about#technology-stack') }]
  }
];

// 社交链接配置
const SOCIAL_LINKS = [
  {
    ariaLabel: 'RSS Feed',
    icon: 'tabler:rss',
    href: getAsset('/rss.xml')
  },
  {
    ariaLabel: 'Github',
    icon: 'tabler:brand-github',
    target: '_blank',
    href: 'https://github.com/Dacong-wu/astro-blog'
  }
];

// 生成页脚注释
const generateFootNote = (): string => {
  const currentYear = new Date().getFullYear();
  const startYear = 2023;
  const yearRange = currentYear > startYear ? `${startYear} - ${currentYear}` : `${startYear}`;

  return `<span class="ml-1.5">© ${yearRange} Made by Dacong.wu · <a class="hover:underline text-xs" href="https://beian.miit.gov.cn/">苏ICP备2021045936号-2</a></span>
`;
};

// Header 数据配置
export const headerData = {
  links: [{ title: '首页', href: getPermalink('/') }, ...COMMON_LINKS]
};

// Footer 数据配置
export const footerData = {
  links: COMMON_LINKS,
  socialLinks: SOCIAL_LINKS,
  footNote: generateFootNote()
};
