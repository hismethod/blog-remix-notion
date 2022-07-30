import { Text } from "@mantine/core";
import { RichTextItemResponse, TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { Fragment } from "react";

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
        return <h1>unkown RichText</h1>;
    }
  });

  return <Fragment>{children}</Fragment>;
}

function TextRichText({ richtext }: { richtext: TextRichTextItemResponse }) {
  const link = richtext.href;
  const children = richtext.plain_text;

  return link ? (
    <a className="text-red-500 underline py-[3px]" href={link} target="_blank">
      {children}
    </a>
  ) : (
    <span className="whitespace-pre-wrap break-words py-[3px]">{children}</span>
  );
}
