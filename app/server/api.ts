import { Client, collectPaginatedAPI, isFullBlock, isFullPage, iteratePaginatedAPI } from "@notionhq/client";
import { BlockObjectResponse, GetBlockResponse, ListBlockChildrenResponse, PartialBlockObjectResponse, TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { PostInfo } from "./model/post";
import { findTitleKey } from "./notion.utils";
const print = console.log;
const [NOTION_OLD_VERSION, NOTION_LATEST_VERSION] = ["2022-02-22", "2022-06-28"];
const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
  notionVersion: NOTION_LATEST_VERSION,
});

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
    const {id, url, icon, created_time, last_edited_time, cover, properties} = page;
    const titleProps = page.properties[titleKey].title as Array<TextRichTextItemResponse>;
    const title = titleProps[0]?.text.content ?? "제목없음";
    let coverUrl = null;
    if(cover) {
      coverUrl = cover[cover.type].url;
    }
    const pageInfo = {
      id: id,
      title: title,
      url: url,
      coverUrl: coverUrl,
      created_at: new Date(created_time),
      updated_at: new Date(last_edited_time),
    };
    postInfoList.push(pageInfo);
  }

  return postInfoList;
}

async function getBlocks(id: string) {
  let blocks: BlockObjectResponse[] = [];
  for await (const block of iteratePaginatedAPI(notion.blocks.children.list, {
    block_id: id,
  })) {
    if(!isFullBlock(block)) continue;
    blocks.push(block);
    // if(block.has_children) {
    //   const childrenBlocks = await getBlocks(block.id);
    //   blocks.push(...childrenBlocks);
    // }
  }
  
  // const blocks = collectPaginatedAPI(notion.blocks.children.list, {block_id: id});
  return blocks;
}

export async function getBlogPost(id: string) {
  // const blocks = await getBlocks(id);
  // return blocks;
  let blockResponse = await notion.blocks.children.list({ block_id: id, page_size: 100 });
  let blocks = [
    ...await deepFetchAllChildren(blockResponse.results)
  ];

  while (blockResponse.has_more && blockResponse.next_cursor) {
    blockResponse = await notion.blocks.children.list({
      block_id: id,
      page_size: 50,
      start_cursor: blockResponse.next_cursor
    });

    const results = blockResponse.results;
    blocks = blocks.concat(await deepFetchAllChildren(results));
  }

  return blocks;
}

async function deepFetchAllChildren (blocks: GetBlockResponse[]): Promise<BlockObjectResponse[]> {

  const fetchChildrenMap = blocks.filter(block => block.has_children).map(block => {
    return {
      promise: notion.blocks.children.list({ block_id: block.id!, page_size: 100 }),
      parent_block: block
    };
  });

  const results = await Promise.all<ListBlockChildrenResponse>(fetchChildrenMap.map(value => value.promise));

  for (let i = 0; i < results.length; i++) {
    const childBlocks = results[i].results;
    await deepFetchAllChildren(childBlocks);
    if (fetchChildrenMap[i]) {
      const parent: any = fetchChildrenMap[i].parent_block;
      parent[parent.type].children = childBlocks;
    }
  }
  return blocks.filter(isFullBlock);
};