import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { Calendar, Clock, ArrowRight, User, Tag } from "lucide-react";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import SEOHead from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blogPosts";
import { marked } from "marked";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPosts[slug] : null;
  const renderedContent = useMemo(() => {
    if (!post) return "";
    return marked.parse(post.content, {
      gfm: true,
      breaks: true,
    }) as string;
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">مقاله یافت نشد</h1>
          <Link to="/blog" className="text-primary hover:underline">
            بازگشت به بلاگ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${post.title} | بلاگ نوا`}
        description={post.excerpt}
        keywords={post.tags.join("، ")}
        canonicalUrl={`https://nova-shop.co/blog/${post.id}`}
        ogImage={post.image}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "image": post.image,
          "author": {
            "@type": "Person",
            "name": post.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "Nova AI Shop"
          },
          "datePublished": post.date
        }}
      />
      
      <div className="min-h-screen bg-background text-foreground" dir="rtl">
        <ShopHeader />
        
        <article className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            {/* Back Link */}
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              بازگشت به بلاگ
            </Link>
            
            {/* Header */}
            <header className="mb-12">
              {/* Category */}
              <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary text-sm font-medium rounded-full mb-4">
                {post.category}
              </span>
              
              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>
              
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} مطالعه</span>
                </div>
              </div>
            </header>
            
            {/* Featured Image */}
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-12">
              <img
                src={post.image}
                alt={post.title}
                className="w-32 h-32 object-contain"
              />
            </div>
            
            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none mb-12">
              <div 
                className="[&_h2]:text-2xl [&_h2]:font-black [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:text-muted-foreground [&_p]:leading-8 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pr-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pr-5 [&_ol]:space-y-2 [&_a]:text-primary [&_a]:font-semibold [&_a]:underline [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:bg-card [&_th]:p-2 [&_td]:border [&_td]:border-border [&_td]:p-2 [&_blockquote]:border-r-4 [&_blockquote]:border-primary [&_blockquote]:pr-4 [&_blockquote]:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: renderedContent }}
              />
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-3 mb-12">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-card rounded-full text-sm text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* CTA */}
            <div className="glass rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold mb-4">
                می‌خواهید از این ابزارها استفاده کنید؟
              </h3>
              <p className="text-muted-foreground mb-6">
                اشتراک‌های اصلی هوش مصنوعی را با قیمت مناسب از نوا تهیه کنید
              </p>
              <Button asChild size="lg" className="rounded-full">
                <Link to="/">
                  مشاهده سرویس‌ها
                </Link>
              </Button>
            </div>
          </div>
        </article>

        <ShopFooter />
      </div>
    </>
  );
};

export default BlogPost;
