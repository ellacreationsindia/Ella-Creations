import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, User, ArrowLeft, ArrowRight, Tag, Share2, Sparkles, Search, MessageSquare, ShieldCheck } from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';
import SEOHead from '../components/SEOHead';

export default function BlogView() {
  const { blogs, selectedBlogId, navigateTo, currentView, products } = useStore();

  const [blogSearch, setBlogSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Bridal Trends', 'Styling Guide', 'Jewelry Care'];

  // Detail View Active Article
  const activeBlog = blogs.find(b => b.id === selectedBlogId) || blogs[0];

  // List View Filtered Articles
  const publishedBlogs = blogs.filter(b => b.status !== 'Draft');
  const filteredBlogs = publishedBlogs.filter(b => {
    if (selectedCategory !== 'All' && b.category !== selectedCategory) return false;
    if (blogSearch.trim() && !b.title.toLowerCase().includes(blogSearch.toLowerCase()) && !b.excerpt.toLowerCase().includes(blogSearch.toLowerCase())) return false;
    return true;
  });

  // Render Full Article Detail Page
  if (currentView === 'blog-detail' && activeBlog) {
    const relatedBlogs = blogs.filter(b => b.id !== activeBlog.id && b.status !== 'Draft').slice(0, 2);

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-stone-800">
        <SEOHead
          title={`${activeBlog.title} | Ella Journal`}
          description={activeBlog.excerpt}
        />

        {/* Back Button */}
        <button
          onClick={() => navigateTo('blog')}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-brand-rose transition-colors bg-white px-4 py-2 rounded-full border border-stone-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Ella Journal
        </button>

        {/* Article Header */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-gold/30 shadow-md space-y-6">
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap text-xs">
              <span className="bg-brand-gold/20 text-brand-gold-dark font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-brand-gold/30">
                {activeBlog.category || 'Jewelry Journal'}
              </span>
              <span className="text-stone-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {activeBlog.readTime || '4 min read'}
              </span>
              <span className="text-stone-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {new Date(activeBlog.publishedAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 leading-tight">
              {activeBlog.title}
            </h1>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed italic border-l-4 border-brand-rose pl-4 py-1">
              "{activeBlog.excerpt}"
            </p>

            <div className="flex items-center justify-between border-t border-stone-100 pt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-rose/20 text-brand-rose font-serif font-bold flex items-center justify-center">
                  E
                </div>
                <div>
                  <span className="font-bold text-stone-900 block">{activeBlog.author || 'Ella Editorial'}</span>
                  <span className="text-[10px] text-stone-400">Jewelry Specialist</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: activeBlog.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Article link copied to clipboard!');
                  }
                }}
                className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 bg-stone-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            </div>
          </div>

          {/* Article Cover Media */}
          {activeBlog.coverImage && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-sm border border-stone-200">
              <img
                src={activeBlog.coverImage}
                alt={activeBlog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body Content (Preserves Formatting & Line Breaks) */}
          <div className="prose prose-stone max-w-none text-xs sm:text-sm leading-relaxed text-stone-700 space-y-4 whitespace-pre-wrap font-normal">
            {activeBlog.content}
          </div>

          {/* Featured Product CTA Promo Box */}
          <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 sm:p-8 rounded-2xl border border-brand-gold/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold bg-brand-gold/20 px-2.5 py-0.5 rounded-full border border-brand-gold/30 inline-block">
                Ella Master Collection
              </span>
              <h3 className="font-serif text-xl font-bold text-brand-cream">Elevate Your Royal Jewelry Wardrobe</h3>
              <p className="text-xs text-stone-300 max-w-md">
                Explore our handcrafted 22k gold plated Kundan chokers, AAA+ Cubic Zirconia crystals, and bridal fine sets.
              </p>
            </div>
            <button
              onClick={() => navigateTo('shop')}
              className="bg-brand-rose hover:bg-brand-rose/90 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-soft-rose transition-all flex-shrink-0"
            >
              Explore Shop Catalog <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
          </div>

        </article>

        {/* Related Articles Section */}
        {relatedBlogs.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-stone-900">More Articles from Ella Journal</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedBlogs.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigateTo('blog-detail', rel.id)}
                  className="bg-white p-5 rounded-2xl border border-brand-gold/20 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-brand-gold">{rel.category}</span>
                    <h4 className="font-serif text-base font-bold text-stone-900 line-clamp-2">{rel.title}</h4>
                    <p className="text-xs text-stone-600 line-clamp-2">{rel.excerpt}</p>
                  </div>
                  <span className="text-xs font-bold text-brand-rose flex items-center gap-1 pt-2 border-t border-stone-100">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  }

  // List View: Blog Journal Directory
  const featuredBlog = publishedBlogs[0];
  const regularBlogs = publishedBlogs.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 text-stone-800">
      <SEOHead
        title="Ella Journal | Jewelry Styling, Trends & Care Guides"
        description="Read personalized blogs, bridal trends, jewelry styling guides, and care tips by Ella Creations."
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-sand via-brand-cream to-brand-pink/30 p-8 sm:p-12 rounded-3xl border border-brand-gold/30 text-center space-y-4 shadow-sm relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full border border-brand-gold/40 text-xs font-semibold uppercase tracking-widest text-brand-gold">
          <BookOpen className="w-3.5 h-3.5 text-brand-gold" /> The Ella Journal & Styling Guides
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 leading-tight">
          Stories of Craftsmanship & Royal Style
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Explore curated bridal trends, daily CZ jewelry styling inspiration, and expert craftsmanship guides authored by our concierge team.
        </p>

        {/* Filter & Search Controls Bar */}
        <div className="pt-4 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search articles by topic..."
              value={blogSearch}
              onChange={(e) => setBlogSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-3 rounded-2xl border border-brand-gold/40 outline-none focus:border-brand-rose bg-white shadow-sm"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          </div>

          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-2.5 rounded-xl font-semibold border transition-all flex-shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-brand-rose text-white border-brand-rose shadow-soft-rose'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Hero Article Spotlight */}
      {featuredBlog && !blogSearch && selectedCategory === 'All' && (
        <div
          onClick={() => navigateTo('blog-detail', featuredBlog.id)}
          className="bg-white rounded-3xl overflow-hidden border border-brand-gold/30 shadow-md hover:shadow-xl transition-all cursor-pointer grid grid-cols-1 lg:grid-cols-12 group"
        >
          <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden relative">
            <img
              src={featuredBlog.coverImage}
              alt={featuredBlog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 bg-brand-rose text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              Featured Story
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
                <span className="text-brand-gold font-bold uppercase">{featuredBlog.category}</span>
                <span>•</span>
                <span>{featuredBlog.readTime}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 group-hover:text-brand-rose transition-colors leading-snug">
                {featuredBlog.title}
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                {featuredBlog.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-brand-rose">
              <div className="flex items-center gap-2 text-stone-700 font-normal">
                <User className="w-3.5 h-3.5 text-stone-400" /> {featuredBlog.author}
              </div>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Full Story <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Blog Cards Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-brand-gold/20 pb-3">
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            {selectedCategory === 'All' ? 'All Journal Articles' : `${selectedCategory} Articles`}
          </h2>
          <span className="text-xs font-semibold text-stone-500">{filteredBlogs.length} Articles</span>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-stone-200">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-stone-800">No articles found</h3>
            <p className="text-xs text-stone-500">Try clearing search filters or changing category options.</p>
            <button
              onClick={() => { setBlogSearch(''); setSelectedCategory('All'); }}
              className="bg-brand-rose text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-brand-rose/90 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => navigateTo('blog-detail', blog.id)}
                className="bg-white rounded-3xl overflow-hidden border border-brand-gold/20 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="aspect-[16/10] overflow-hidden relative bg-stone-100">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-white/20">
                      {blog.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-[11px] text-stone-400 font-medium">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.readTime}</span>
                      <span>•</span>
                      <span>{new Date(blog.publishedAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-brand-rose transition-colors leading-snug line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-brand-rose">
                  <span className="text-[11px] text-stone-500 font-normal">{blog.author}</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Post <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
