import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Save, Image, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import type { BlogPost } from '../types';

interface BlogEditorProps {
  post?: Partial<BlogPost>;
  onSave: (post: Partial<BlogPost>) => Promise<void>;
  categories: string[];
}

export default function BlogEditor({ post = {}, onSave, categories }: BlogEditorProps) {
  const [title, setTitle] = useState(post.title || '');
  const [content, setContent] = useState(post.content || '');
  const [excerpt, setExcerpt] = useState(post.excerpt || '');
  const [coverImage, setCoverImage] = useState(post.coverImage || '');
  const [category, setCategory] = useState(post.category || categories[0]);
  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [status, setStatus] = useState<'draft' | 'published'>(post.status || 'draft');
  const [featured, setFeatured] = useState(post.featured || false);
  const [preview, setPreview] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleSave = async () => {
    const updatedPost = {
      ...post,
      title,
      content,
      excerpt,
      coverImage,
      category,
      tags,
      status,
      featured,
      updatedAt: new Date().toISOString(),
    };

    await onSave(updatedPost);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {post.id ? 'Edit Post' : 'Create New Post'}
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setPreview(!preview)}
            className="btn-secondary"
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            className="btn-primary flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Save
          </button>
        </div>
      </div>

      {preview ? (
        <div className="prose max-w-none">
          <h1>{title}</h1>
          {coverImage && (
            <img src={coverImage} alt={title} className="rounded-lg" />
          )}
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="space-y-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post Title"
            className="input-field text-2xl font-bold"
          />

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Cover Image URL
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="input-field flex-1"
              />
              <button className="btn-secondary">
                <Image className="w-5 h-5" />
              </button>
            </div>
          </div>

          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Post excerpt..."
            rows={3}
            className="input-field"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content in Markdown..."
            rows={20}
            className="input-field font-mono"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="input-field"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add tag and press Enter"
                className="input-field flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = e.currentTarget.value.trim();
                    if (value && !tags.includes(value)) {
                      setTags([...tags, value]);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
              <Tag className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100"
                >
                  {tag}
                  <button
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
              Featured post
            </label>
          </div>
        </div>
      )}
    </div>
  );
}