import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';
import type { BlogPost } from '../types';

interface BlogPostCardProps {
  post: BlogPost;
  variant?: 'default' | 'compact';
}

export default function BlogPostCard({ post, variant = 'default' }: BlogPostCardProps) {
  if (variant === 'compact') {
    return (
      <Link to={`/blog/${post.slug}`} className="group">
        <article className="flex gap-4">
          {post.coverImage && (
            <div className="flex-shrink-0 w-24 h-24">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          )}
          <div>
            <h3 className="font-semibold group-hover:text-gray-600 transition-colors duration-200">
              {post.title}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Clock className="w-4 h-4 mr-1" />
              {format(new Date(post.createdAt), 'MMM d, yyyy')}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/blog/${post.slug}`} className="group">
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {post.coverImage && (
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={post.coverImage}
              alt={post.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              {post.category}
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-gray-600 transition-colors duration-200">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {format(new Date(post.createdAt), 'MMM d, yyyy')}
              <span className="mx-2">•</span>
              {post.readTime} min read
            </div>
            {post.tags.length > 0 && (
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                <span>{post.tags[0]}</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}