import React, { useState } from 'react';
import { Groq } from '@groq/groq-sdk';
import ReactMarkdown from 'react-markdown';
import { PenLine, Loader2, Copy, Check } from 'lucide-react';

const BlogGenerator = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [blogPost, setBlogPost] = useState('');
  const [copied, setCopied] = useState(false);

  const generateBlogPost = async () => {
    if (!topic) return;
    
    setLoading(true);
    setBlogPost('');

    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
      });

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert blog writer who creates engaging, well-researched content."
          },
          {
            role: "user",
            content: `Write a 1000-word blog post about "${topic}". Make it engaging, informative, and well-structured with proper headings and paragraphs. Use markdown formatting.`
          }
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.7,
        max_tokens: 4096,
      });

      setBlogPost(completion.choices[0]?.message?.content || '');
    } catch (error) {
      console.error('Error generating blog post:', error);
      setBlogPost('Error generating blog post. Please make sure your API key is set correctly.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(blogPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <PenLine className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Blog Post Generator</h1>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                What would you like to write about?
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your blog topic..."
              />
            </div>

            <button
              onClick={generateBlogPost}
              disabled={loading || !topic}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Blog Post'
              )}
            </button>
          </div>
        </div>

        {blogPost && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Generated Blog Post</h2>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{blogPost}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogGenerator;