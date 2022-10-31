export interface PostInfo {
  id: string;
  title: string;
  url: string;
  slug?: string;
  coverUrl: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostPage {
  info: PostInfo;
  content: ContentBlock[];
}

export interface ContentBlock {
  id: string;
}
