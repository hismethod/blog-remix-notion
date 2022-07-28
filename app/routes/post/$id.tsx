import { Container } from "@mantine/core";
import { BlockObjectResponse, PartialBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Block, RenderBlocks } from "~/components/notion/Block";
import { getBlogPost } from "~/server/api";
import cache from "~/server/cache";

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
    <Container>
      <h1>Post</h1>
      <RenderBlocks blocks={blocks}></RenderBlocks>
    </Container>
  );
}
