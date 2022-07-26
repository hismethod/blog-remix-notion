import { Client, isFullBlock, isFullPage, iteratePaginatedAPI } from "@notionhq/client";
import { BlockObjectResponse, TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { PostInfo } from "./model/post";
import { findTitleKey } from "./notion.utils";
const print = console.log;

const [NOTION_OLD_VERSION, NOTION_LATEST_VERSION] = ["2022-02-22", "2022-06-28"];

async function getBlogDatabase() {
  const notionOld = new Client({
    auth: process.env.NOTION_API_TOKEN,
    notionVersion: NOTION_OLD_VERSION,
  });

  const database = await notionOld.databases.query({
    database_id: process.env.NOTION_BLOG_DATABASE_ID as string,
    sorts: [{
          timestamp: "created_time",
          direction: "ascending"
    }],
  });

  return database;
}

export async function getBlogPostInfoList(): Promise<PostInfo[]> {
  const database = await getBlogDatabase();
  const pages = database.results;
  if(pages.length === 0) {
    return [];
  }
  const titleKey = findTitleKey(pages[0].properties);
  let postInfoList: PostInfo[] = [];
  for (const page of pages) {
    if(!isFullPage(page)) {
      continue;
    }
    const {id, url, icon, created_time, last_edited_time, properties} = page;
    const titleProps = page.properties[titleKey].title as Array<TextRichTextItemResponse>;
    const title = titleProps[0]?.text.content ?? "제목없음";
    const pageInfo = {
      id: id,
      title: title,
      url: url,
      created_at: new Date(created_time),
      updated_at: new Date(last_edited_time),
    };
    postInfoList.push(pageInfo);
  }

  return postInfoList;
}

export async function getBlogPost(id: string) {
  const notion = new Client({
    auth: process.env.NOTION_API_TOKEN,
    notionVersion: NOTION_LATEST_VERSION,
  });

  let blocks: BlockObjectResponse[] = [];
  for await (const block of iteratePaginatedAPI(notion.blocks.children.list, {
    block_id: id,
  })) {
    if(!isFullBlock(block)) continue;
    blocks.push(block);
  }
  console.log(blocks.length)
  return blocks;
}