import Link from "next/link";
import { formatDate } from "~/lib/utils";
import { api } from "~/trpc/server";

export default async function BlogPage() {
  const postsResult = await api.post.getPublished({ limit: 50 });
  const posts = postsResult.posts;
  
  // Get all unique tags from posts
  const allTags = new Set<string>();
  posts.forEach(post => {
    post.tags.forEach(tag => allTags.add(tag));
  });
  const tags = Array.from(allTags).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore todos os artigos sobre saúde pública, pesquisas e projetos
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Categorias
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                  className="bg-white border border-gray-200 hover:border-green-500 text-gray-700 hover:text-green-700 px-3 py-1 rounded-full text-sm font-medium transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Posts List */}
        {posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-500">
                    {formatDate((post.publishedAt ?? post.createdAt).toISOString())}
                  </span>
                  {post.readingTime && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{post.readingTime} min de leitura</span>
                    </>
                  )}
                  {post.category && post.category === 'featured' && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Destaque
                      </span>
                    </>
                  )}
                </div>
                
                <Link href={`/blog/${post.slug}`} className="group">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                
                <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                  {post.excerpt ?? "Sem resumo disponível"}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tag/${encodeURIComponent(tag)}`}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    Ler mais →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum post encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                Ainda não há posts publicados no blog. Seja o primeiro a criar conteúdo!
              </p>
              <Link
                href="/admin"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
              >
                Criar Primeiro Post
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 