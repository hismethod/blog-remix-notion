import { ActionIcon, AppShell, Container, Header, useMantineColorScheme } from "@mantine/core";
import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Logo from "~/components/Logo";
import { getBlogPostInfoList } from "~/server/api";
import { PostInfo } from "~/server/model/post";

export const loader: LoaderFunction = async () => {
  const posts: PostInfo[] = await getBlogPostInfoList();
  return json({ posts });
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
  const { posts } = useLoaderData() as LoaderData;
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
