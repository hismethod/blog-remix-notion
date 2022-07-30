export interface PostInfo {
  id: string;
  title: string;
  url: string;
  coverUrl: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface PostPage {
  info: PostInfo;
  content: ContentBlock[];
}

export interface ContentBlock {
  id: string;
}
