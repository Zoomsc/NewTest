import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Clock, Tag, ChevronRight } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import { format } from 'date-fns';
import type { BlogPost } from '../types';
import AdDisplay from '../components/AdDisplay';

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Initialize with some default posts while waiting for Firebase
        const defaultPosts = [{
          id: '1',
          title: 'Welcome to Our Blog',
          excerpt: 'Start exploring our content...',
          slug: 'welcome',
          author: { id: '1', name: 'Admin' },
          tags: ['welcome'],
          category: 'General',
          status: 'published',
          featured: true,
          content: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          readTime: 1
        }];

        setFeaturedPosts(defaultPosts);
        setRecentPosts(defaultPosts);

        // Fetch actual posts from Firebase
        const postsRef = collection(db, 'posts');
        const postsQuery = query(postsRef, orderBy('createdAt', 'desc'), limit(10));
        const snapshot = await getDocs(postsQuery);

        if (!snapshot.empty) {
          const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as BlogPost[];

          setFeaturedPosts(posts.filter(post => post.featured).slice(0, 3));
          setRecentPosts(posts.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Keep default posts if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-40"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Featured Posts</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group"
              >
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
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-gray-600 transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      <span className="mx-2">•</span>
                      {post.readTime} min read
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Recent Posts</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {recentPosts.map(post => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group"
            >
              <article className="flex gap-4">
                {post.coverImage && (
                  <div className="flex-shrink-0 w-32 h-32">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold mb-2 group-hover:text-gray-600 transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex items-center mt-2 space-x-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <div className="flex gap-2">
                        {post.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="text-xs text-gray-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            View all posts
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}