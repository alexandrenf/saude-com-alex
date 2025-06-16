"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: postsData, refetch } = api.post.getAll.useQuery({ limit: 50 });

  useEffect(() => {
    if (postsData) {
      setPosts(postsData.posts);
      setIsLoading(false);
    }
  }, [postsData]);

  const deletePostMutation = api.post.delete.useMutation({
    onSuccess: () => {
      void refetch();
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      alert("Erro ao excluir o post");
    },
  });

  const handleDeletePost = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;
    deletePostMutation.mutate({ id });
  };

  const togglePublished = async (post: Post) => {
    // For now, we'll use the API route to toggle published status
    try {
      const response = await fetch(`/api/posts/id/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published: !post.published }),
      });

      if (response.ok) {
        void refetch();
      } else {
        alert("Erro ao atualizar o post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Erro ao atualizar o post");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const publishedPosts = posts.filter(post => post.published);
  const draftPosts = posts.filter(post => !post.published);
  const featuredPosts = posts.filter(post => post.category === 'featured');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Administração do Blog
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie os posts do Saúde com Alex
            </p>
          </div>
          <Link
            href="/admin/create"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Novo Post
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{posts.length}</p>
                <p className="text-gray-600">Total de Posts</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{publishedPosts.length}</p>
                <p className="text-gray-600">Publicados</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{draftPosts.length}</p>
                <p className="text-gray-600">Rascunhos</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{featuredPosts.length}</p>
                <p className="text-gray-600">Em Destaque</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Todos os Posts
            </h2>
          </div>
          
          {posts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {posts.map((post) => (
                <div key={post.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {post.title}
                        </h3>
                        <div className="flex gap-1">
                          {!post.published && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Rascunho
                            </span>
                          )}
                          {post.published && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Publicado
                            </span>
                          )}
                          {post.category === 'featured' && (
                            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Destaque
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {post.excerpt ?? "Sem resumo"}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          {post.publishedAt 
                            ? new Date(post.publishedAt).toLocaleDateString('pt-BR')
                            : new Date(post.createdAt).toLocaleDateString('pt-BR')
                          }
                        </span>
                        {post.category && (
                          <span>Categoria: {post.category}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => void togglePublished(post)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          post.published
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {post.published ? 'Despublicar' : 'Publicar'}
                      </button>
                      
                      <Link
                        href={`/admin/edit/${post.id}`}
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Editar
                      </Link>
                      
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded text-sm font-medium transition-colors"
                        disabled={deletePostMutation.isPending}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
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
                Comece criando seu primeiro post para o blog.
              </p>
              <Link
                href="/admin/create"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
              >
                Criar Primeiro Post
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 