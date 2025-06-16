"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

export default function CreatePostPage() {
  const router = useRouter();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.content.trim()) {
      alert("Título e conteúdo são obrigatórios");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const result = await response.json() as { slug: string; message: string };
        router.push(`/blog/${result.slug}`);
      } else {
        const error = await response.json() as { error: string };
        alert(error.error ?? "Erro ao criar o post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Erro ao criar o post");
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Criar Novo Post
            </h1>
            <p className="text-gray-600 mt-2">
              Adicione um novo artigo ao blog Saúde com Alex
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
                      placeholder="Deixe vazio para gerar automaticamente..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Se vazio, será gerado automaticamente baseado no título
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
                      Imagem de Destaque (URL)
                    </label>
                    <input
                      type="url"
                      value={form.featuredImage}
                      onChange={(e) => setForm(prev => ({ ...prev, featuredImage: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>

                  {/* Published */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      checked={form.published}
                      onChange={(e) => setForm(prev => ({ ...prev, published: e.target.checked }))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                      Publicar imediatamente
                    </label>
                  </div>
                </div>
              </div>

              {/* SEO Section */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  SEO (Opcional)
                </h2>
                
                <div className="space-y-4">
                  {/* Meta Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título SEO
                    </label>
                    <input
                      type="text"
                      value={form.metaTitle}
                      onChange={(e) => setForm(prev => ({ ...prev, metaTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Título para mecanismos de busca..."
                    />
                  </div>

                  {/* Meta Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição SEO
                    </label>
                    <textarea
                      value={form.metaDescription}
                      onChange={(e) => setForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Descrição para mecanismos de busca..."
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Conteúdo *
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                  >
                    {showPreview ? "Editar" : "Visualizar"}
                  </button>
                </div>
                
                <textarea
                  value={form.content}
                  onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={20}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                  placeholder="Escreva o conteúdo em Markdown..."
                  required
                />
                
                <div className="mt-2 text-xs text-gray-500">
                  Suporte completo para Markdown: **negrito**, *itálico*, # títulos, - listas, etc.
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Visualização
                </h2>
                
                {form.featuredImage && (
                  <img
                    src={form.featuredImage}
                    alt={form.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                
                {form.title && (
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {form.title}
                  </h1>
                )}
                
                {form.excerpt && (
                  <p className="text-xl text-gray-600 mb-6">
                    {form.excerpt}
                  </p>
                )}

                {form.category && (
                  <div className="mb-4">
                    <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                      {categoryOptions.find(cat => cat.value === form.category)?.label}
                    </span>
                  </div>
                )}
                
                <div className="prose prose-lg prose-gray max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {form.content || "*Comece a escrever para ver a visualização...*"}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
            >
              {isSubmitting ? "Criando..." : form.published ? "Publicar Post" : "Salvar Rascunho"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 