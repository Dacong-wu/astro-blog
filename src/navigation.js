import { getPermalink } from './utils/permalinks';

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
    // {
    //   text: '行业展示',
    //   links: [
    //     {
    //       text: '物联网关',
    //       href: getPermalink('/iot-gateway'),
    //     },
    //     {
    //       text: '充电桩',
    //       href: getPermalink('/charging-station'),
    //     },
    //   ],
    // },
    {
      text: '关于我们',
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
      title: '行业展示',
      links: [
        { text: '物联网关', href: '/iot-gateway' },
        { text: '充电桩', href: '/charging-station' },
      ],
    },
  ],
  socialLinks: [
    // { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    // { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'Wechat', icon: 'tabler:brand-wechat', href: '/miao-chat' },
    // { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    // { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/onwidget/astrowind' },
  ],
  // footNote: `
  //   <span class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm bg-[url(https://onwidget.com/favicon/favicon-32x32.png)]"></span>
  //   Made by <a class="text-blue-600 hover:underline dark:text-gray-200" href="https://onwidget.com/"> onWidget</a> · 2008-2023 - 苏ICP备20041812号
  // `,
  footNote: `
    Made by <span class="text-blue-600 dark:text-gray-200">量子猫技术支持</span> · 2008-2023 - <a class="hover:underline" href="https://onwidget.com/"> 苏ICP备20041812号</a>
  `,
};
