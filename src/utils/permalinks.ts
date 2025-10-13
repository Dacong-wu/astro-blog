import slugify from 'limax';

import { SITE, APP_BLOG, APP_PHTOTGRAPHY } from '~/utils/config';

import { trim } from '~/utils/utils';

export const trimSlash = (s: string) => trim(trim(s, '/'));
const createPath = (...params: string[]) => {
  const paths = params
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
  return '/' + paths + (SITE.trailingSlash && paths ? '/' : '');
};

const BASE_PATHNAME = SITE.base || '/';

export const cleanSlug = (text = '') =>
  trimSlash(text)
    .split('/')
    .map((slug) => slugify(slug))
    .join('/');
export const BLOG_BASE = cleanSlug(APP_BLOG?.list?.pathname);
export const PHOTOGRAPHY_BASE = cleanSlug(APP_PHTOTGRAPHY?.list?.pathname);
export const CATEGORY_BASE = cleanSlug(APP_BLOG?.category?.pathname);
export const TAG_BASE = cleanSlug(APP_BLOG?.tag?.pathname) || 'tag';

export const POST_PERMALINK_PATTERN = trimSlash(APP_BLOG?.post?.permalink || `${BLOG_BASE}/%slug%`);
export const PHTOTGRAPHY_PERMALINK_PATTERN = trimSlash(
  APP_PHTOTGRAPHY?.post?.permalink || `${PHOTOGRAPHY_BASE}/%slug%`
);

/** */
export const getCanonical = (path = ''): string | URL => {
  const url = String(new URL(path, SITE.site));
  if (SITE.trailingSlash == false && path && url.endsWith('/')) {
    return url.slice(0, -1);
  } else if (SITE.trailingSlash == true && path && !url.endsWith('/')) {
    return url + '/';
  }
  return url;
};

/** */
export const getPermalink = (slug = '', type = 'page'): string => {
  let permalink: string;

  switch (type) {
    case 'category':
      permalink = createPath(CATEGORY_BASE, trimSlash(slug));
      break;

    case 'tag':
      permalink = createPath(TAG_BASE, trimSlash(slug));
      break;

    case 'post':
      permalink = createPath(trimSlash(slug));
      break;

    case 'page':
    default:
      permalink = createPath(slug);
      break;
  }

  return definitivePermalink(permalink);
};

/** */
export const getHomePermalink = (): string => getPermalink('/');

/** */
export const getBlogPermalink = (): string => getPermalink(BLOG_BASE);
export const getPhotographyPermalink = (): string => getPermalink(PHOTOGRAPHY_BASE);

/** */
export const getAsset = (path: string): string =>
  '/' +
  [BASE_PATHNAME, path]
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');

/** */
const definitivePermalink = (permalink: string): string => createPath(BASE_PATHNAME, permalink);

/**
 * 通用的永久链接生成器
 * @param pattern 模板，例如 "%year%/%month%/%slug%"
 * @param id 文档 id
 * @param slug 文档 slug
 * @param publishDate 发布时间
 * @param extra 额外占位符，例如 { category: "tech" }
 */
export const generatePermalink = ({
  pattern,
  id,
  slug,
  publishDate,
  extra = {}
}: {
  pattern: string;
  id: string;
  slug: string;
  publishDate: Date;
  extra?: Record<string, string | undefined>;
}): string => {
  const dateParts = {
    year: publishDate.getFullYear().toString().padStart(4, '0'),
    month: (publishDate.getMonth() + 1).toString().padStart(2, '0'),
    day: publishDate.getDate().toString().padStart(2, '0'),
    hour: publishDate.getHours().toString().padStart(2, '0'),
    minute: publishDate.getMinutes().toString().padStart(2, '0'),
    second: publishDate.getSeconds().toString().padStart(2, '0')
  };

  let permalink = pattern
    .replace('%id%', id)
    .replace('%slug%', slug)
    .replace('%year%', dateParts.year)
    .replace('%month%', dateParts.month)
    .replace('%day%', dateParts.day)
    .replace('%hour%', dateParts.hour)
    .replace('%minute%', dateParts.minute)
    .replace('%second%', dateParts.second);

  // 替换额外参数（如果是 undefined/null 就替换为空字符串）
  Object.entries(extra).forEach(([key, value]) => {
    permalink = permalink.replace(new RegExp(`%${key}%`, 'g'), value != null ? String(value) : '');
  });

  return permalink.split('/').map(trimSlash).filter(Boolean).join('/');
};
