"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "~/trpc/react";

interface PostForm {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  published: boolean;
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: string;
}

interface EditPostPageProps {
  params: { id: string };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();
  const postId = parseInt(params.id);
  
  const [form, setForm] = useState<PostForm>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [],
    published: false,
    metaTitle: "",
    metaDescription: "",
    featuredImage: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: post, isLoading: isLoadingPost } = api.post.getById.useQuery({ id: postId });
  const updatePostMutation = api.post.update.useMutation({
    onSuccess: () => {
      router.push("/admin");
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      alert("Erro ao atualizar o post");
    },
  });

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? "",
        content: post.content,
        category: post.category ?? "",
        tags: post.tags,
        published: post.published,
        metaTitle: post.metaTitle ?? "",
        metaDescription: post.metaDescription ?? "",
        featuredImage: post.featuredImage ?? "",
      });
      setIsLoading(false);
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.content.trim()) {
      alert("Título e conteúdo são obrigatórios");
      return;
    }

    setIsSubmitting(true);

    try {
      updatePostMutation.mutate({
        id: postId,
        title: form.title,
        content: form.content,
        excerpt: form.excerpt ?? undefined,
        category: form.category ?? undefined,
        tags: form.tags,
        published: form.published,
        metaTitle: form.metaTitle ?? undefined,
        metaDescription: form.metaDescription ?? undefined,
        featuredImage: form.featuredImage ?? undefined,
      });
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Erro ao atualizar o post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const categoryOptions = [
    { value: "", label: "Selecione uma categoria" },
    { value: "featured", label: "Destaque" },
    { value: "pesquisa", label: "Pesquisa" },
    { value: "educacao", label: "Educação" },
    { value: "prevencao", label: "Prevenção" },
    { value: "politicas", label: "Políticas Públicas" },
    { value: "tecnologia", label: "Tecnologia em Saúde" },
    { value: "epidemiologia", label: "Epidemiologia" },
  ];

  if (isLoadingPost || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post não encontrado</h1>
          <Link
            href="/admin"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            ← Voltar ao Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Editar Post
            </h1>
            <p className="text-gray-600 mt-2">
              Editando: {post.title}
            </p>
          </div>
          <Link
            href="/admin"
            className="text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            ← Voltar ao Admin
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Informações do Post
                </h2>
                
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Digite o título do post..."
                      required
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug (URL)
                    </label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="URL do post..."
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      O slug não pode ser alterado após a criação
                    </p>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resumo
                    </label>
                    <textarea
                      value={form.excerpt}
                      onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Breve descrição do post..."
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Digite uma tag e pressione Enter..."
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Adicionar
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagem Destacada (URL)
                    </label>
                    <input
                      type="url"
                      value={form.featuredImage}
                      onChange={(e) => setForm(prev => ({ ...prev, featuredImage: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* SEO Section */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  SEO
                </h2>
                
                <div className="space-y-4">
                  {/* Meta Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Título
                    </label>
                    <input
                      type="text"
                      value={form.metaTitle}
                      onChange={(e) => setForm(prev => ({ ...prev, metaTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Título para SEO (deixe vazio para usar o título do post)"
                    />
                  </div>

                  {/* Meta Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Descrição
                    </label>
                    <textarea
                      value={form.metaDescription}
                      onChange={(e) => setForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Descrição para SEO (deixe vazio para usar o resumo)"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Ações
                </h2>
                
                <div className="space-y-4">
                  {/* Published Toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      checked={form.published}
                      onChange={(e) => setForm(prev => ({ ...prev, published: e.target.checked }))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                      Publicar post
                    </label>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || updatePostMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      {isSubmitting || updatePostMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {showPreview ? "Ocultar" : "Visualizar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Conteúdo *
                </h2>
                
                {!showPreview ? (
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                    rows={20}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                    placeholder="Escreva o conteúdo do post em Markdown..."
                    required
                  />
                ) : (
                  <div className="prose prose-lg max-w-none border border-gray-300 rounded-md p-4 min-h-[500px] bg-gray-50">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {form.content || "*Nenhum conteúdo para visualizar*"}
                    </ReactMarkdown>
                  </div>
                )}
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>
                    Você pode usar Markdown para formatar o texto. 
                    <a 
                      href="https://www.markdownguide.org/basic-syntax/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 ml-1"
                    >
                      Ver guia do Markdown
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 