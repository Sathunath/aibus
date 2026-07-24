import { useState, FormEvent } from 'react';
import { Search, Sparkles, FileText, CheckCircle, ExternalLink, Tag, Code, BookOpen } from 'lucide-react';
import { SEOArticle } from '../types';

interface SeoStudioProps {
  articles: SEOArticle[];
  onGenerateBlogWithAI: (keyword: string, category: string, targetProduct: string) => Promise<void>;
}

export function SeoStudio({ articles, onGenerateBlogWithAI }: SeoStudioProps) {
  const [keywordInput, setKeywordInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Home Decor & Lighting');
  const [productInput, setProductInput] = useState('Nordic Brass Arc Lamp');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<SEOArticle | null>(articles[0] || null);

  const handleGenerateClick = async (e: FormEvent) => {
    e.preventDefault();
    if (!keywordInput.trim()) return;
    setIsGenerating(true);
    await onGenerateBlogWithAI(keywordInput, categoryInput, productInput);
    setIsGenerating(false);
    setKeywordInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-cyan-600" />
            <h2 className="text-xl font-bold text-slate-900">Programmatic SEO & Content Marketing Studio</h2>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Rank-SEOAgent generates 2,000+ word keyword-targeted articles, inserts internal product links, and writes Schema JSON-LD structured data.
          </p>
        </div>

        <div className="bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-cyan-600" />
          <span>Schema JSON-LD Validated</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Keyword & Blog Generator */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <h3 className="text-sm font-bold text-slate-900">Rank-SEOAgent Generator</h3>
          </div>

          <form onSubmit={handleGenerateClick} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Target Keyword</label>
              <input
                type="text"
                required
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="e.g. USA dropshipping lighting trends 2026"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Store Category</label>
              <select
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 focus:outline-none cursor-pointer"
              >
                <option value="Home Decor & Lighting">Home Decor & Lighting</option>
                <option value="Tactical & Survival Gear">Tactical & Survival Gear</option>
                <option value="Clean Skincare">Clean Skincare</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Target Product to Link</label>
              <input
                type="text"
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                placeholder="e.g. Nordic Brass Arc Lamp"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating || !keywordInput.trim()}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold py-3 rounded-xl transition shadow-sm flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isGenerating ? 'Writing Longform Article...' : 'Generate Programmatic SEO Blog'}</span>
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Article Preview & Meta Tags Inspector */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          {selectedArticle ? (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                    Keyword: {selectedArticle.targetKeyword}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{selectedArticle.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedArticle.wordCount} Words • {selectedArticle.internalLinksCount} Internal Links • SEO Score: {selectedArticle.seoScore}/100
                  </p>
                </div>
              </div>

              {/* Meta Tags Preview Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs text-cyan-700 font-bold">
                  <Tag className="w-4 h-4" />
                  <span>Google SERP Preview</span>
                </div>
                <p className="text-xs font-bold text-blue-700 hover:underline cursor-pointer">{selectedArticle.metaTitle}</p>
                <p className="text-xs text-slate-700">{selectedArticle.metaDescription}</p>
              </div>

              {/* Article Content Markdown */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed space-y-3 whitespace-pre-wrap max-h-[420px] overflow-y-auto font-mono">
                {selectedArticle.contentMarkdown}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-2 text-slate-400" />
              <p className="text-sm font-semibold text-slate-500">Select or generate an article to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
