import { Blockquote, Code, Divider } from "@mantine/core";
import {
  BlockObjectResponse,
  CalloutBlockObjectResponse,
  CodeBlockObjectResponse,
  DividerBlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
  NumberedListItemBlockObjectResponse,
  ParagraphBlockObjectResponse,
  QuoteBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Fragment } from "react";
import { RichText } from "./Text";

export const RenderBlocks = ({ blocks }: { blocks: BlockObjectResponse[] }) => {
  return (
    <div>
      {blocks.map((block) => {
        return (
          <div key={block.id}>
            <Block block={block} />
            {block.has_children && block[block.type].children && <RenderBlocks blocks={block[block.type].children} />}
          </div>
        );
      })}
    </div>
  );
};

export function Block({ block }: { block: BlockObjectResponse }) {
  switch (block.type) {
    case "paragraph":
      return <NotionParagraph key={block.id} block={block} />;
    case "heading_1":
      return <NotionH1 key={block.id} block={block} />;
    case "heading_2":
      return <NotionH2 key={block.id} block={block} />;
    case "heading_3":
      return <NotionH3 key={block.id} block={block} />;
    case "callout":
      return <NotionCallout key={block.id} block={block} />;
    case "quote":
      return <NotionQuote key={block.id} block={block} />;
    case "code":
      return <NotionCode key={block.id} block={block} />;
    case "divider":
      return <NotionDivider key={block.id} block={block} />;
    case "numbered_list_item":
      return <NotionNumberedListItem block={block} />;
    default:
      return <p style={{ color: "red" }}>{block.type}</p>;
  }
}

function NotionParagraph({ block }: { block: ParagraphBlockObjectResponse }) {
  return (
    <p>
      <RichText richTextArray={block.paragraph.rich_text} />
    </p>
  );
}

const NotionH1 = ({ block }: { block: Heading1BlockObjectResponse }) => {
  return <h1>{block.heading_1.rich_text.map((h) => h.plain_text).join("\n")}</h1>;
};

const NotionH2 = ({ block }: { block: Heading2BlockObjectResponse }) => {
  return <h2>{block.heading_2.rich_text.map((h) => h.plain_text).join("\n")}</h2>;
};

const NotionH3 = ({ block }: { block: Heading3BlockObjectResponse }) => {
  return <h3>{block.heading_3.rich_text.map((h) => h.plain_text).join("\n")}</h3>;
};

function NotionCallout({ block }: { block: CalloutBlockObjectResponse }) {
  let icon;
  if (block.callout.icon?.type === "emoji") {
    icon = <span>{block.callout.icon.emoji}</span>;
  } else {
    icon = <span>TODO!!! 이모지가 파일일때 구현필요</span>;
  }

  return (
    <div>
      {icon}
      <RichText richTextArray={block.callout.rich_text}></RichText>
    </div>
  );
}

function NotionQuote({ block }: { block: QuoteBlockObjectResponse }) {
  return (
    <Blockquote>
      <RichText richTextArray={block.quote.rich_text}></RichText>
    </Blockquote>
  );
}

function NotionCode({ block }: { block: CodeBlockObjectResponse }) {
  return (
    <div>
      <p>{block.code.language}</p>
      <Code block>
        <span>{block.code.caption}</span>
        <RichText richTextArray={block.code.rich_text} />
      </Code>
    </div>
  );
}

function NotionDivider({ block }: { block: DividerBlockObjectResponse }) {
  return <Divider />;
}

function NotionNumberedListItem({ block }: { block: NumberedListItemBlockObjectResponse }) {
  return (
    <p>
      <RichText richTextArray={block.numbered_list_item.rich_text} />
    </p>
  );
}
