import { Container } from "@mantine/core";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Callout, H1, H2, H3, Paragraph } from "~/components/notion/Block";
import { getBlogPost } from "~/server/api";

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id as string;
  const blocks = await getBlogPost(id);
  return json({ blocks });
};

type LoaderData = {
  blocks: BlockObjectResponse[];
};

export default function Post() {
  const { blocks } = useLoaderData() as LoaderData;
  return (
    <Container>
      <h1>Post</h1>
      {blocks.map((block) => Block(block))}
    </Container>
  );
}

export function Block(block: BlockObjectResponse) {
  if (block.type === "paragraph") {
    return <Paragraph block={block} />;
  } else if (block.type === "heading_1") {
    return <H1 block={block} />;
  } else if (block.type === "heading_2") {
    return <H2 block={block} />;
  } else if (block.type === "heading_3") {
    return <H3 block={block} />;
  } else if (block.type === "callout") {
    return <Callout block={block} />;
  } else {
    return <p>{block.type}</p>;
  }
}
