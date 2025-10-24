import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DEPTH = 3;
const JSON_FOLDER = './json';
const BLOG_FOLDER = 'src/content/blog';

// 获取数据
const getData = async (folder, groupDepth) => {
  const getPath = await fs.readdir(folder);
  const removeIndex = getPath.filter((item) => !item.startsWith('-'));

  const getPaths = await Promise.all(
    removeIndex.map(async (filename) => {
      const filepath = path.join(folder, filename);
      const stats = await fs.stat(filepath);
      const isFolder = stats.isDirectory();

      if (isFolder) {
        return await getData(filepath, groupDepth);
      } else if (filename.endsWith('.md') || filename.endsWith('.mdx')) {
        const file = await fs.readFile(filepath, 'utf-8');
        const { data } = matter(file);
        const pathParts = filepath.split(path.sep);
        const slug =
          data.slug ||
          pathParts
            .slice(CONTENT_DEPTH)
            .join('/')
            .replace(/\.[^/.]+$/, '');
        const group = pathParts[groupDepth];
        return {
          group: group,
          slug: slug,
          frontmatter: data
        };
      } else {
        return [];
      }
    })
  );

  const flattenedPaths = getPaths.flat();
  const publishedPages = flattenedPaths.filter((page) => !page.frontmatter?.draft && page);
  return publishedPages;
};

const main = async () => {
  try {
    // 创建文件夹如果不存在
    const exists = await fs
      .access(JSON_FOLDER)
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      await fs.mkdir(JSON_FOLDER);
    }

    // 获取数据并创建 search.json 文件
    const posts = await getData(BLOG_FOLDER, 2);
    await fs.writeFile(`${JSON_FOLDER}/search.json`, JSON.stringify(posts));
  } catch (err) {
    console.error(err);
  }
};

main();
