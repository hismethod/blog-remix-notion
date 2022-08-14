import { HeadersFunction, json, LoaderFunction } from "@remix-run/node";
import { Link, LinkProps, PrefetchPageLinks, useLoaderData } from "@remix-run/react";
import { getBlogPostInfoList } from "~/server/api";
import cache from "~/server/cache";
import { PostInfo } from "~/server/model/post";

export const headers: HeadersFunction = ({ loaderHeaders, parentHeaders }) => {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=300",
  };
};

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

export default function PostIndex() {
  return (
    <div className="container mx-auto max-w-3xl">
      <h1 className="text-3xl">블로그</h1>
      <ArticleList />
    </div>
  );
}

function ArticleList() {
  const { posts } = useLoaderData<LoaderData>();
  return (
    <ul className="">
      {posts.map((page) => (
        <li>
          <PostListItem key={page.id} linkTo={`/post/${page.id}`} title={page.title} content={""} imageUrl={null} />
        </li>
      ))}
    </ul>
  );
}

function PostListItem({ linkTo, title, content, imageUrl }: { linkTo: string; title: string; content: string; imageUrl: string | null }) {
  return (
    <Link to={linkTo} prefetch="intent">
      <div className="my-4">
        <span className="text-xl">{title}</span>
      </div>
    </Link>
  );
}

function PostCard({ linkTo, title, content, imageUrl }: { linkTo: string; title: string; content: string; imageUrl: string | null }) {
  return (
    <Link to={linkTo} prefetch="intent">
      <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
        {imageUrl && <img className="rounded-t-lg" src={imageUrl} alt="" />}
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{content}</p>
          <span className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Read more
            <svg aria-hidden="true" className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
