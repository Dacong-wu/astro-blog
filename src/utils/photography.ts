import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Photography } from '~/types';
import { APP_PHTOTGRAPHY } from '~/utils/config';
import {
  cleanSlug,
  PHOTOGRAPHY_BASE,
  PHTOTGRAPHY_PERMALINK_PATTERN,
  generatePermalink // ✅ 使用通用方法
} from './permalinks';

export const photographyPostsPerPage = APP_PHTOTGRAPHY?.postsPerPage;

/**
 * 将 Astro Collection 的 photography 数据标准化
 * - 清理 slug
 * - 生成 permalink
 * - 确保 Date 类型正确
 */
const getNormalizedPhotography = async (photography: CollectionEntry<'photography'>): Promise<Photography> => {
  const { id, data } = photography;
  const { publishDate: rawPublishDate = new Date(), title, excerpt, images } = data;

  const slug = cleanSlug(id); // 从文件路径生成干净的 slug
  const publishDate = new Date(rawPublishDate);

  return {
    id,
    slug,
    // 使用通用 generatePermalink 生成永久链接
    permalink: generatePermalink({
      pattern: PHTOTGRAPHY_PERMALINK_PATTERN,
      id,
      slug,
      publishDate
    }),
    publishDate,
    title,
    excerpt,
    images
  };
};

/**
 * 加载所有摄影文章
 * - 从 Astro content collection 获取
 * - 标准化数据
 * - 按发布日期倒序排列
 */
const load = async (): Promise<Array<Photography>> => {
  const photographys = await getCollection('photography');
  const normalized = await Promise.all(photographys.map(getNormalizedPhotography));
  return normalized.sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf());
};

/** 内存缓存，避免每次都重新 IO */
let _photographys: Array<Photography>;

/**
 * 获取摄影文章（带缓存）
 * - 如果内存已有数据直接返回
 * - 否则调用 load() 重新加载
 */
export const fetchPhotographys = async (): Promise<Array<Photography>> => {
  if (!_photographys) {
    _photographys = await load();
  }
  return _photographys;
};

/**
 * 生成摄影文章列表的静态路径（分页）
 * - 用于 Astro 的 getStaticPaths
 */
export const getStaticPathsPhotographyList = async ({ paginate }) => {
  return paginate(await fetchPhotographys(), {
    params: { photography: PHOTOGRAPHY_BASE || undefined },
    pageSize: photographyPostsPerPage
  });
};

/**
 * 生成单篇摄影文章的静态路径
 * - 用于 Astro 的 getStaticPaths
 */
export const getStaticPathsPhotographyPost = async () => {
  return (await fetchPhotographys()).map((photography) => ({
    params: { photography: photography.permalink },
    props: { photography }
  }));
};
