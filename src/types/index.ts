export interface License {
  id: string;
  userId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  expiresAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  coverImage?: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  readTime: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface UserData {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  isAdmin: boolean;
  createdAt: string;
  licenses: License[];
}

export interface AdPlacement {
  id: string;
  location: 'header' | 'sidebar' | 'in-content' | 'footer';
  adCode: string;
  active: boolean;
}