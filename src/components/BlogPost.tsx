import React from 'react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { useMediaQuery } from 'react-responsive';
import { Clock, Tag, User } from 'lucide-react';
import type { BlogPost as BlogPostType } from '../types';

interface BlogPostProps {
  post: BlogPostType;
  preview?: boolean;
}

export default function BlogPost({ post, preview = false }: BlogPostProps) {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <article className="card overflow-hidden animate-slide-up">
      {post.coverImage && (
        <div className="relative overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className={`w-full object-cover transition-transform duration-300 hover:scale-105
                      ${isMobile ? 'h-48' : 'h-72'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      
      <div className="p-6">
        <h2 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'} mb-4 
                       hover:text-gray-600 transition-colors duration-200`}>
          {post.title}
        </h2>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {post.author.name}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {format(new Date(post.createdAt), 'MMM d, yyyy')}
          </div>
        </div>

        <div className="mb-4 prose prose-gray max-w-none">
          {preview ? (
            <p className="text-gray-600">{post.excerpt}</p>
          ) : (
            <ReactMarkdown>{post.content}</ReactMarkdown>
          )}
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs 
                         font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 
                         transition-colors duration-200 cursor-pointer"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}