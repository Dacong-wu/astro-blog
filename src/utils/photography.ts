import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Photography } from '~/types';
import { APP_PHTOTGRAPHY } from '~/utils/config';
import { cleanSlug, PHOTOGRAPHY_BASE, trimSlash, PHTOTGRAPHY_PERMALINK_PATTERN } from './permalinks';

const generatePermalink = async ({ id, slug, publishDate }: { id: string; slug: string; publishDate: Date }) => {
  const year = String(publishDate.getFullYear()).padStart(4, '0');
  const month = String(publishDate.getMonth() + 1).padStart(2, '0');
  const day = String(publishDate.getDate()).padStart(2, '0');
  const hour = String(publishDate.getHours()).padStart(2, '0');
  const minute = String(publishDate.getMinutes()).padStart(2, '0');
  const second = String(publishDate.getSeconds()).padStart(2, '0');

  const permalink = PHTOTGRAPHY_PERMALINK_PATTERN.replace('%slug%', slug)
    .replace('%id%', id)
    .replace('%year%', year)
    .replace('%month%', month)
    .replace('%day%', day)
    .replace('%hour%', hour)
    .replace('%minute%', minute)
    .replace('%second%', second);
  return permalink
    .split('/')
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
};
export const photographyPostsPerPage = APP_PHTOTGRAPHY?.postsPerPage;
const getNormalizedPhotography = async (photography: CollectionEntry<'photography'>): Promise<Photography> => {
  const { id, slug: rawSlug = '', data } = photography;
  const { publishDate: rawPublishDate = new Date(), title, excerpt, images } = data;

  const slug = cleanSlug(rawSlug); // cleanSlug(rawSlug.split('/').pop());
  const publishDate = new Date(rawPublishDate);
  return {
    id: id,
    slug: slug,
    permalink: await generatePermalink({ id, slug, publishDate }),
    publishDate: publishDate,
    title: title,
    excerpt: excerpt,
    images: images,
  };
};

const load = async function (): Promise<Array<Photography>> {
  const photographys = await getCollection('photography');
  const normalizedPhotographys = photographys.map(async (photography) => await getNormalizedPhotography(photography));
  const results = (await Promise.all(normalizedPhotographys)).sort(
    (a, b) => b.publishDate.valueOf() - a.publishDate.valueOf()
  );
  return results;
};

let _photographys: Array<Photography>;
export const fetchPhotographys = async (): Promise<Array<Photography>> => {
  if (!_photographys) {
    _photographys = await load();
  }
  return _photographys;
};

export const getStaticPathsPhotographyList = async ({ paginate }) => {
  return paginate(await fetchPhotographys(), {
    params: { photography: PHOTOGRAPHY_BASE || undefined },
    pageSize: photographyPostsPerPage,
  });
};

export const getStaticPathsPhotographyPost = async () => {
  return (await fetchPhotographys()).flatMap((photography) => ({
    params: {
      photography: photography.permalink,
    },
    props: { photography },
  }));
};
