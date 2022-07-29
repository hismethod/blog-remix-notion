import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Logo from "~/components/Logo";
import { getBlogPostInfoList } from "~/server/api";
import cache from "~/server/cache";
import { PostInfo } from "~/server/model/post";
import { Theme, useTheme } from "~/utils/theme.provider";

export const loader: LoaderFunction = async ({ params }) => {
  const pageId = process.env.NOTION_BLOG_DATABASE_ID as string;

  let cacheData = cache.get<LoaderData>(pageId);
  if (cacheData === undefined) {
    const posts: PostInfo[] = await getBlogPostInfoList();
    cacheData = {
      posts,
    };
    cache.set(pageId, cacheData);
  }

  return json(cacheData);
};

type LoaderData = {
  posts: PostInfo[];
};

export default function Index() {
  return (
    <div className="container mx-auto">
      <ArticleList />
    </div>
  );
}

function ArticleList() {
  const { posts } = useLoaderData<LoaderData>();
  return (
    <div>
      <AppColorThemeSwitcher></AppColorThemeSwitcher>
      <h1>ArticleList</h1>
      <ul>
        {posts.map((page) => (
          <li key={page.id}>
            <Link to={`/post/${page.id}`}>{page.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AppColorThemeSwitcher() {
  const [, setTheme] = useTheme();
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };

  return <button onClick={toggleTheme}>Toggle</button>;
}
