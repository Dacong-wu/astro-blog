import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Post } from '~/types';
import { APP_BLOG } from '~/utils/config';
import {
  cleanSlug,
  BLOG_BASE,
  POST_PERMALINK_PATTERN,
  CATEGORY_BASE,
  TAG_BASE,
  generatePermalink // ✅ 使用通用方法
} from './permalinks';

/**
 * 将 Astro Collection 的 blog 数据标准化
 * - 渲染 markdown 得到 Content
 * - 处理日期、分类、标签
 * - 生成 permalink
 */
const getNormalizedPost = async (post: CollectionEntry<'blog'>): Promise<Post> => {
  const { id, data } = post;
  const { Content, remarkPluginFrontmatter } = await render(post);

  const {
    publishDate: rawPublishDate = new Date(),
    updateDate: rawUpdateDate,
    title,
    excerpt,
    image,
    tags: rawTags = [],
    category: rawCategory,
    author,
    draft = false,
    metadata = {}
  } = data;

  const slug = cleanSlug(id); // 从文件路径生成干净的 slug
  const publishDate = new Date(rawPublishDate);
  const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;
  const category = rawCategory ? cleanSlug(rawCategory) : undefined;
  const tags = rawTags.map((tag: string) => cleanSlug(tag));

  return {
    id,
    slug,
    // 使用通用 generatePermalink 生成永久链接
    permalink: generatePermalink({
      pattern: POST_PERMALINK_PATTERN,
      id,
      slug,
      publishDate,
      extra: { category } // 博客独有的 category 占位符
    }),
    publishDate,
    updateDate,
    title,
    excerpt,
    image,
    category,
    tags,
    author,
    draft,
    metadata,
    Content, // 文章渲染后的内容
    readingTime: remarkPluginFrontmatter?.readingTime // 阅读时间插件
  };
};

/**
 * 加载所有博客文章
 * - 从 Astro content collection 获取
 * - 标准化数据
 * - 按发布日期倒序排列
 * - 过滤掉草稿文章
 */
const load = async (): Promise<Array<Post>> => {
  const posts = await getCollection('blog');
  const normalized = await Promise.all(posts.map(getNormalizedPost));
  return normalized.sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf()).filter((post) => !post.draft);
};

/** 内存缓存，避免重复加载 */
let _posts: Array<Post>;

/** 配置开关和 robots 设置，直接导出方便模板调用 */
export const isBlogEnabled = APP_BLOG.isEnabled;
export const isBlogListRouteEnabled = APP_BLOG.list.isEnabled;
export const isBlogPostRouteEnabled = APP_BLOG.post.isEnabled;
export const isBlogCategoryRouteEnabled = APP_BLOG.category.isEnabled;
export const isBlogTagRouteEnabled = APP_BLOG.tag.isEnabled;

export const blogListRobots = APP_BLOG.list.robots;
export const blogPostRobots = APP_BLOG.post.robots;
export const blogCategoryRobots = APP_BLOG.category.robots;
export const blogTagRobots = APP_BLOG.tag.robots;

export const blogPostsPerPage = APP_BLOG?.postsPerPage;

/**
 * 获取所有文章（带缓存）
 */
export const fetchPosts = async (): Promise<Array<Post>> => {
  if (!_posts) {
    _posts = await load();
  }
  return _posts;
};

/**
 * 根据 slug 批量查找文章
 */
export const findPostsBySlugs = async (slugs: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(slugs)) return [];
  const posts = await fetchPosts();
  return posts.filter((post) => slugs.includes(post.slug));
};

/**
 * 根据 id 批量查找文章
 */
export const findPostsByIds = async (ids: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(ids)) return [];
  const posts = await fetchPosts();
  return posts.filter((post) => ids.includes(post.id));
};

/**
 * 获取最新文章
 * @param count 默认返回 4 篇
 */
export const findLatestPosts = async ({ count = 4 }: { count?: number }): Promise<Array<Post>> => {
  const posts = await fetchPosts();
  return posts.slice(0, count);
};

/**
 * 生成博客列表的静态路径（分页）
 */
export const getStaticPathsBlogList = async ({ paginate }) => {
  if (!isBlogEnabled || !isBlogListRouteEnabled) return [];
  return paginate(await fetchPosts(), {
    params: { blog: BLOG_BASE || undefined },
    pageSize: blogPostsPerPage
  });
};

/**
 * 生成单篇博客文章的静态路径
 */
export const getStaticPathsBlogPost = async () => {
  if (!isBlogEnabled || !isBlogPostRouteEnabled) return [];
  return (await fetchPosts()).map((post) => ({
    params: { blog: post.permalink },
    props: { post }
  }));
};

/**
 * 生成分类分页的静态路径
 */
export const getStaticPathsBlogCategory = async ({ paginate }) => {
  if (!isBlogEnabled || !isBlogCategoryRouteEnabled) return [];
  const posts = await fetchPosts();
  const categories = new Set(posts.filter((p) => typeof p.category === 'string').map((p) => p.category!.toLowerCase()));
  return Array.from(categories).flatMap((category) =>
    paginate(
      posts.filter((p) => p.category?.toLowerCase() === category),
      {
        params: { category, blog: CATEGORY_BASE || undefined },
        pageSize: blogPostsPerPage,
        props: { category }
      }
    )
  );
};

/**
 * 生成标签分页的静态路径
 */
export const getStaticPathsBlogTag = async ({ paginate }) => {
  if (!isBlogEnabled || !isBlogTagRouteEnabled) return [];
  const posts = await fetchPosts();
  const tags = new Set(posts.flatMap((p) => (Array.isArray(p.tags) ? p.tags.map((t) => t.toLowerCase()) : [])));
  return Array.from(tags).flatMap((tag) =>
    paginate(
      posts.filter((p) => p.tags?.some((t) => t.toLowerCase() === tag)),
      {
        params: { tag, blog: TAG_BASE || undefined },
        pageSize: blogPostsPerPage,
        props: { tag }
      }
    )
  );
};

/**
 * 获取所有标签（用于构建标签列表页）
 */
export const getStaticPathsBlogTags = async () => {
  if (!isBlogEnabled || !isBlogTagRouteEnabled) return [];
  const posts = await fetchPosts();
  const tags = new Set(posts.flatMap((p) => (Array.isArray(p.tags) ? p.tags.map((t) => t.toLowerCase()) : [])));
  return [...tags].sort();
};

/**
 * 获取所有分类（用于构建分类列表页）
 */
export const getStaticPathsBlogCategories = async () => {
  if (!isBlogEnabled || !isBlogCategoryRouteEnabled) return [];
  const posts = await fetchPosts();
  const categories = new Set(
    posts.flatMap((p) => {
      if (typeof p.category === 'string') return [p.category.toLowerCase()];
      if (Array.isArray(p.category)) return p.category.map((c) => c.toLowerCase());
      return [];
    })
  );
  return [...categories].sort();
};
