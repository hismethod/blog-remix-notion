import { BlockObjectResponse, PartialBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { HeadersFunction, HtmlLinkDescriptor, json, LinksFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Block, RenderBlocks, RenderPage } from "~/components/notion/Block";
import { getBlogPost } from "~/server/api";
import cache from "~/server/cache";
import prismOneDark from "~/styles/prism.one.dark.css";
import prismOneLight from "~/styles/prism.one.light.css";
import { emojiFavigonDataUri } from "~/utils";

export const headers: HeadersFunction = ({ loaderHeaders, parentHeaders }) => {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=300",
  };
};

export const links: LinksFunction = () => {
  const favicon: HtmlLinkDescriptor = {
    rel: "icon",
    href: emojiFavigonDataUri(""),
  };

  const prismOneThemeStyleSheets = [
    { rel: "stylesheet", href: prismOneLight },
    { rel: "stylesheet", href: prismOneDark },
  ];

  return [favicon, ...prismOneThemeStyleSheets];
};

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id as string;

  let cachedBlocks = cache.get<LoaderData>(id);
  if (cachedBlocks === undefined) {
    const blocks = await getBlogPost(id);
    cachedBlocks = { blocks };
    cache.set(id, cachedBlocks);
  }
  return json(cachedBlocks);
};

type LoaderData = {
  blocks: BlockObjectResponse[];
};

export default function Post() {
  const { blocks } = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>Post</h1>
      <RenderPage blocks={blocks}></RenderPage>
    </div>
  );
}
