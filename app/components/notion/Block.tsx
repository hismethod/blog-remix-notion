import {
  CalloutBlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
  ParagraphBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

type NotionParagraphProps = {
  block: ParagraphBlockObjectResponse;
};

type NotionHeading1Props = {
  block: Heading1BlockObjectResponse;
};
type NotionHeading2Props = {
  block: Heading2BlockObjectResponse;
};
type NotionHeading3Props = {
  block: Heading3BlockObjectResponse;
};

export const Paragraph = (props: NotionParagraphProps) => {
  const { block } = props;

  return <p>{block.paragraph.rich_text.map((p) => p.plain_text).join("\n")}</p>;
};

export const H1 = (props: NotionHeading1Props) => {
  const { block } = props;
  return <h1>{block.heading_1.rich_text.map((h) => h.text.content).join("\n")}</h1>;
};

export const H2 = (props: NotionHeading2Props) => {
  const { block } = props;
  return <h2>{block.heading_2.rich_text.map((h) => h.text.content).join("\n")}</h2>;
};

export const H3 = (props: NotionHeading3Props) => {
  const { block } = props;
  return <h3>{block.heading_3.rich_text.map((h) => h.text.content).join("\n")}</h3>;
};

type NotionCalloutProps = {
  block: CalloutBlockObjectResponse;
};

export const Callout = (props: NotionCalloutProps) => {
  const { block } = props;
  let icon;
  if (block.callout.icon?.type === "emoji") {
    icon = Emoji({ emoji: block.callout.icon.emoji });
  } else {
    icon = <span>TODO!!! 구현필요</span>;
  }
  return (
    <div>
      {icon}
      <p>{block.callout.rich_text.map((c) => c.text.content).join("\n")}</p>
    </div>
  );
};

export const Icon = (props: NotionCalloutProps) => {};

type EmojiProps = {
  emoji: string;
};
export const Emoji = (props: EmojiProps) => {
  const { emoji } = props;
  return <span>{emoji}</span>;
};
