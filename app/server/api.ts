import { Client } from "@notionhq/client";
import { PageObjectResponse, PartialPageObjectResponse, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
const print = console.log;

export type PageObject = PageObjectResponse | PartialPageObjectResponse;

async function getBlogDatabase(): Promise<QueryDatabaseResponse> {
  const notion = new Client({
    auth: process.env.NOTION_API_TOKEN,
  });

  const database = await notion.databases.query({
    database_id: process.env.NOTION_BLOG_DATABASE_ID as string,
  });

  return database;
}

export async function getBlogPosts(): Promise<PageObject[]> {
  const database = await getBlogDatabase();
  return database.results;
}