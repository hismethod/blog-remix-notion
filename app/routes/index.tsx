import { ActionIcon, AppShell, Container, Header, useMantineColorScheme } from "@mantine/core";
import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Logo from "~/components/Logo";
import { getBlogPostInfoList } from "~/server/api";
import cache from "~/server/cache";
import { PostInfo } from "~/server/model/post";

export const loader: LoaderFunction = async ({ params }) => {
  const pageId = process.env.NOTION_BLOG_DATABASE_ID as string;

  let cacheData = cache.get<LoaderData>(pageId);
  if (cacheData === undefined) {
    const posts: PostInfo[] = await getBlogPostInfoList();
    cacheData = {
      posts,
    };
    cache.set(pageId, cacheData);
  }

  return json(cacheData);
};

type LoaderData = {
  posts: PostInfo[];
};

export default function Index() {
  return (
    <AppShell
      header={
        <Header height={70}>
          <Logo />
        </Header>
      }
    >
      <Container>
        <ArticleList />
      </Container>
    </AppShell>
  );
}

function ArticleList() {
  const { posts } = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>ArticleList</h1>
      <ul>
        {posts.map((page) => (
          <li key={page.id}>
            <Link to={`/post/${page.id}`}>{page.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AppColorThemeSwitcher() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon variant="outline" color={dark ? "yellow" : "blue"} onClick={() => toggleColorScheme()} title="Toggle color scheme">
      {dark ? <span>light</span> : <span>dark</span>}
    </ActionIcon>
  );
}
