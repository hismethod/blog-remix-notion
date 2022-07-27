import { RichTextItemResponse, TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

export function RichText({ richTextArray }: { richTextArray: RichTextItemResponse[] }) {
  if (!richTextArray) return null;

  const children = richTextArray.map((richText) => {
    switch (richText.type) {
      case "text":
        return <TextRichText richtext={richText} />;
      case "mention":
        return <span>{richText.plain_text}</span>;
      case "equation":
        return <span>{richText.plain_text}</span>;
      default:
        return <span style={{ color: "red" }}>unkown RichText</span>;
    }
  });

  return <>{children}</>;
}

function TextRichText({ richtext }: { richtext: TextRichTextItemResponse }) {
  if (richtext.href != null && richtext.href.length > 0) {
    return (
      <a href={richtext.href} target="_blank">
        {richtext.plain_text}
      </a>
    );
  } else {
    return <span>{richtext.plain_text}</span>;
  }
}
