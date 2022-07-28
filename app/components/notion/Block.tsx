import { Blockquote, Code, Divider } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { Language } from "prism-react-renderer";
import {
  BlockObjectResponse,
  BulletedListItemBlockObjectResponse,
  CalloutBlockObjectResponse,
  CodeBlockObjectResponse,
  DividerBlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
  ImageBlockObjectResponse,
  NumberedListItemBlockObjectResponse,
  ParagraphBlockObjectResponse,
  QuoteBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Fragment } from "react";
import { RichText } from "./Text";

export const RenderBlocks = ({ blocks }: { blocks: BlockObjectResponse[] }) => {
  return (
    <Fragment>
      {blocks.map((block) => (
        <div key={block.id}>
          <Block block={block} />
          {block.has_children && block[block.type].children && <RenderBlocks blocks={block[block.type].children} />}
        </div>
      ))}
    </Fragment>
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
    case "image":
      return <NotionImage key={block.id} block={block} />;
    case "callout":
      return <NotionCallout key={block.id} block={block} />;
    case "quote":
      return <NotionQuote key={block.id} block={block} />;
    case "code":
      return <NotionCode key={block.id} block={block} />;
    case "divider":
      return <NotionDivider key={block.id} block={block} />;
    case "numbered_list_item":
      return <NotionNumberedListItem key={block.id} block={block} />;
    case "bulleted_list_item":
      return <NotionBulletedListItem key={block.id} block={block} />;
    default:
      return <p style={{ color: "red" }}>{`${block.type}: ${block.id}`}</p>;
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
  return (
    <h1>
      <RichText richTextArray={block.heading_1.rich_text} />
    </h1>
  );
};

const NotionH2 = ({ block }: { block: Heading2BlockObjectResponse }) => {
  return (
    <h2>
      <RichText richTextArray={block.heading_2.rich_text} />
    </h2>
  );
};

const NotionH3 = ({ block }: { block: Heading3BlockObjectResponse }) => {
  return (
    <h3>
      <RichText richTextArray={block.heading_3.rich_text} />
    </h3>
  );
};

function NotionNumberedListItem({ block }: { block: NumberedListItemBlockObjectResponse }) {
  return <RichText richTextArray={block.numbered_list_item.rich_text} />;
}

function NotionBulletedListItem({ block }: { block: BulletedListItemBlockObjectResponse }) {
  return (
    <div>
      -
      <RichText richTextArray={block.bulleted_list_item.rich_text} />
    </div>
  );
}

function NotionCallout({ block }: { block: CalloutBlockObjectResponse }) {
  let icon;
  if (block.callout.icon?.type === "emoji") {
    icon = <span>{block.callout.icon.emoji}</span>;
  } else {
    icon = <span>TODO!!! 아이콘이 파일일때 구현필요</span>;
  }

  return (
    <div>
      {block.callout.icon && icon}
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
      <label>{block.code.language}</label>
      <Prism language={block.code.language as Language}>{block.code.rich_text.map((code) => code.plain_text).join()}</Prism>
    </div>
  );
}

function NotionImage({ block }: { block: ImageBlockObjectResponse }) {
  const hasCaption = block.image.caption.length > 0;
  return (
    <div>
      <img src={block.image.type == "file" ? block.image.file.url : block.image.external.url} alt={"이미지"} />
      {hasCaption && <RichText richTextArray={block.image.caption} />}
    </div>
  );
}

function NotionDivider({ block }: { block: DividerBlockObjectResponse }) {
  return <Divider />;
}
