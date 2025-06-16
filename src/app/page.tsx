import Link from "next/link";
import { formatDate } from "~/lib/utils";
import { api } from "~/trpc/server";

export default async function Home() {
  const featuredPosts = await api.post.getFeatured({ limit: 3 });
  const recentPosts = (await api.post.getPublished({ limit: 6 })).posts;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Saúde com Alex
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Artigos e projetos sobre saúde pública em português. 
              Promovendo conhecimento e educação para um futuro mais saudável.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Explorar Artigos
              </Link>
              <Link
                href="#featured"
                className="border border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Posts em Destaque
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section id="featured" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Posts em Destaque
              </h2>
              <p className="text-xl text-gray-600">
                Conteúdo selecionado sobre saúde pública
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Destaque
                      </span>
                      {post.publishedAt && (
                        <span className="text-sm text-gray-500">
                          {formatDate(post.publishedAt.toISOString())}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt ?? "Sem resumo disponível"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {post.readingTime && (
                          <span className="text-sm text-gray-500">{post.readingTime} min</span>
                        )}
                        {post.category && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500">{post.category}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Artigos Recentes
            </h2>
            <p className="text-xl text-gray-600">
              As últimas publicações sobre saúde pública
            </p>
          </div>
          {recentPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-500">
                        {formatDate((post.publishedAt ?? post.createdAt).toISOString())}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt ?? "Sem resumo disponível"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {post.readingTime && (
                          <span className="text-sm text-gray-500">{post.readingTime} min</span>
                        )}
                        {post.category && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500">{post.category}</span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                Ainda não há posts publicados.
              </p>
              <Link
                href="/admin"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Criar Primeiro Post
              </Link>
            </div>
          )}
          
          {recentPosts.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Ver Todos os Posts
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
