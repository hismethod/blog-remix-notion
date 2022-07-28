import { RichTextItemResponse, TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

export function RichText({ richTextArray }: { richTextArray: RichTextItemResponse[] }) {
  if (!richTextArray) return null;

  const children = richTextArray.map((richText, i) => {
    switch (richText.type) {
      case "text":
        return <TextRichText key={i} richtext={richText} />;
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
  const TagType = richtext.href ? "a" : "span";
  return <TagType href={richtext.href ?? ""}>{richtext.plain_text.split(/(\r|\n|\r\n)/).map((content, i) => (content.match(/(\r|\n|\r\n)/) ? <br key={i} /> : content))}</TagType>;
}
