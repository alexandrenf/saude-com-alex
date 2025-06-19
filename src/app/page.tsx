import Link from "next/link";
import { formatDate } from "~/lib/utils";
import { api } from "~/trpc/server";

export default async function Home() {
  const featuredPosts = await api.post.getFeatured({ limit: 3 });
  const recentPosts = (await api.post.getPublished({ limit: 8 })).posts;

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <section className="py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Saúde com Alex
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Artigos sobre saúde pública, políticas e pesquisas no Brasil
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Em destaque</h2>
            <div className="space-y-8">
              {featuredPosts.map((post) => (
                <article key={post.slug} className="border-b border-gray-100 pb-8 last:border-b-0">
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      {post.publishedAt && (
                        <time dateTime={post.publishedAt.toISOString()}>
                          {formatDate(post.publishedAt.toISOString())}
                        </time>
                      )}
                      {post.readingTime && (
                        <span>{post.readingTime} min de leitura</span>
                      )}
                      {post.category && (
                        <span className="capitalize">{post.category}</span>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Artigos recentes</h2>
            {recentPosts.length > 0 && (
              <Link 
                href="/blog" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver todos →
              </Link>
            )}
          </div>
          
          {recentPosts.length > 0 ? (
            <div className="space-y-6">
              {recentPosts.map((post) => (
                <article key={post.slug} className="border-b border-gray-100 pb-6 last:border-b-0">
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <time dateTime={(post.publishedAt ?? post.createdAt).toISOString()}>
                        {formatDate((post.publishedAt ?? post.createdAt).toISOString())}
                      </time>
                      {post.readingTime && (
                        <span>{post.readingTime} min</span>
                      )}
                      {post.tags.length > 0 && (
                        <div className="flex space-x-2">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-gray-400">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                Ainda não há artigos publicados.
              </p>
              <Link
                href="/admin"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Escrever primeiro artigo
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
