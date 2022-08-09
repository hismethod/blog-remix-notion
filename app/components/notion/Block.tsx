import {
  BlockObjectResponse,
  BulletedListItemBlockObjectResponse,
  CalloutBlockObjectResponse,
  CodeBlockObjectResponse,
  ColumnBlockObjectResponse,
  DividerBlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
  ImageBlockObjectResponse,
  NumberedListItemBlockObjectResponse,
  ParagraphBlockObjectResponse,
  QuoteBlockObjectResponse,
  ToggleBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import Highlight, { defaultProps, Language } from "prism-react-renderer";

import { Fragment } from "react";
import { RichText } from "./Text";
import { Theme, useTheme } from "~/utils/theme.provider";
import { CodeHighlighter } from "../CodeHighlight";

export function RenderPage({ blocks }: { blocks: BlockObjectResponse[] }) {
  return (
    <article className="container mx-auto max-w-3xl prose dark:prose-invert">
      <RenderBlocks blocks={blocks}></RenderBlocks>
    </article>
  );
}

export const RenderBlocks = ({ blocks }: { blocks: BlockObjectResponse[] }) => {
  return (
    <Fragment>
      {blocks.map((block) => {
        const children = <>{block.has_children && block[block.type].children && <RenderBlocks blocks={block[block.type].children} />}</>;
        return <Block key={block.id} block={block} children={children} />;
      })}
    </Fragment>
  );
};

export function Block({ block, children }: { block: BlockObjectResponse; children: React.ReactNode }) {
  switch (block.type) {
    case "paragraph":
      return <NotionParagraph key={block.id} block={block} children={children} />;
    case "heading_1":
      return <NotionH1 key={block.id} block={block} children={children} />;
    case "heading_2":
      return <NotionH2 key={block.id} block={block} children={children} />;
    case "heading_3":
      return <NotionH3 key={block.id} block={block} children={children} />;
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
      return <NotionNumberedListItem key={block.id} block={block} children={children} />;
    case "bulleted_list_item":
      return <NotionBulletedListItem key={block.id} block={block} children={children} />;
    case "column_list":
      return <NotionColumnList children={children} />;
    case "column":
      return <NotionColumn block={block} children={children} />;
    case "toggle":
      return <NotionToggle block={block} children={children} />;
    default:
      return <div className={`${block.type} text-purple-600`}>{`${block.type}: ${block.id}`}</div>;
  }
}

function NotionParagraph({ block, children }: { block: ParagraphBlockObjectResponse; children: React.ReactNode }) {
  return (
    <p className="min-h-[30px] mt-[2px] mb-[1px]">
      <RichText richTextArray={block.paragraph.rich_text} />
      {children}
    </p>
  );
}

const NotionH1 = ({ block, children }: { block: Heading1BlockObjectResponse; children: React.ReactNode }) => {
  return (
    <>
      <h1 className="mt-[1.4rem] mb-[1px]">
        <RichText richTextArray={block.heading_1.rich_text} />
      </h1>
      {children}
    </>
  );
};

const NotionH2 = ({ block, children }: { block: Heading2BlockObjectResponse; children: React.ReactNode }) => {
  return (
    <>
      <h2 className="font-semibold mt-[1.4rem] mb-[1px]">
        <RichText richTextArray={block.heading_2.rich_text} />
      </h2>
      {children}
    </>
  );
};

const NotionH3 = ({ block, children }: { block: Heading3BlockObjectResponse; children: React.ReactNode }) => {
  return (
    <>
      <h3 className="mt-[1.4rem] mb-[1px]">
        <RichText richTextArray={block.heading_3.rich_text} />
      </h3>
      {children}
    </>
  );
};

function NotionNumberedListItem({ block, children }: { block: NumberedListItemBlockObjectResponse; children: React.ReactNode }) {
  return (
    <div className="numbered_list_item min-h-[30px] ml-6 my-2 list-item list-decimal">
      <RichText richTextArray={block.numbered_list_item.rich_text} />
      {children}
    </div>
  );
}

function NotionBulletedListItem({ block, children }: { block: BulletedListItemBlockObjectResponse; children: React.ReactNode }) {
  return (
    <div className="bulleted_list_item min-h-[30px] ml-6 my-1 list-item list-disc">
      <RichText richTextArray={block.bulleted_list_item.rich_text} />
      {children}
    </div>
  );
}

function NotionColumnList({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-row">{children}</div>;
}

function NotionColumn({ block, children }: { block: ColumnBlockObjectResponse; children: React.ReactNode }) {
  return <div className="flex-1">{children}</div>;
}

function NotionToggle({ block, children }: { block: ToggleBlockObjectResponse; children: React.ReactNode }) {
  return (
    <details>
      <summary>
        <RichText richTextArray={block.toggle.rich_text} />
      </summary>
      {children}
    </details>
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
    <blockquote>
      <RichText richTextArray={block.quote.rich_text}></RichText>
    </blockquote>
  );
}

function NotionCode({ block }: { block: CodeBlockObjectResponse }) {
  return (
    <CodeHighlighter showLineNumber={true} language={block.code.language as Language}>
      {block.code.rich_text.map((code) => code.plain_text).join("\n")}
    </CodeHighlighter>
  );
}

/** @deprecated */
function NotionCodeOld({ block }: { block: CodeBlockObjectResponse }) {
  const [colorTheme] = useTheme();
  return (
    <Highlight
      {...defaultProps}
      // theme={colorTheme == Theme.LIGHT ? prismLightTheme : prismDarkTheme}
      theme={undefined}
      code={block.code.rich_text.map((code) => code.plain_text).join("\n")}
      language={block.code.language as Language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

function NotionImage({ block }: { block: ImageBlockObjectResponse }) {
  const hasCaption = block.image.caption.length > 0;
  return (
    <>
      <img src={block.image.type == "file" ? block.image.file.url : block.image.external.url} alt={"이미지"} />
      {hasCaption && <RichText richTextArray={block.image.caption} />}
    </>
  );
}

function NotionDivider({ block }: { block: DividerBlockObjectResponse }) {
  return (
    <div className="not-prose">
      <hr />
    </div>
  );
}
