export interface Author {
  id: string;
  name: string;
  avatar_url: string;
  bio: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string;
  profiles: Author;
  date: string;
}
