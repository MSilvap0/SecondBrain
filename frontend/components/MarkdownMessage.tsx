'use client';

import { useState, useMemo } from 'react';
import { Check, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownMessageProps {
  content: string;
}

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <FormattedContent content={content} />
    </div>
  );
}

function FormattedContent({ content }: { content: string }) {
  // Usar useMemo para evitar re-parsing desnecessário
  const parts = useMemo(() => parseMarkdown(content), [content]);

  return (
    <>
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return <CodeBlock key={index} code={part.content} language={part.language || 'text'} />;
        } else if (part.type === 'text') {
          return <TextBlock key={index} content={part.content} />;
        }
        return null;
      })}
    </>
  );
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      {/* Header com linguagem e botão copiar */}
      <div className="flex items-center justify-between bg-zinc-800 px-4 py-2 rounded-t-lg border-b border-zinc-700">
        <span className="text-xs text-zinc-400 font-mono">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar código</span>
            </>
          )}
        </button>
      </div>

      {/* Código com syntax highlighting */}
      <div className="rounded-b-lg overflow-hidden">
        <SyntaxHighlighter
          language={language || 'text'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: '#1e1e1e',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          showLineNumbers={code.split('\n').length > 5}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function TextBlock({ content }: { content: string }) {
  // Usar useMemo para evitar re-processar o markdown a cada render
  const formatted = useMemo(() => {
    return content
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-white mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mt-5 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mt-6 mb-4">$1</h1>')
      
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-zinc-800 text-indigo-400 rounded text-sm font-mono">$1</code>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-indigo-400 hover:text-indigo-300 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Lists
      .replace(/^• (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
      
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br />');
  }, [content]);

  return (
    <div 
      className="text-sm leading-relaxed text-zinc-300"
      dangerouslySetInnerHTML={{ __html: `<p class="mb-3">${formatted}</p>` }}
    />
  );
}

// Parser para separar código de texto
function parseMarkdown(content: string): Array<{ type: 'code' | 'text'; content: string; language?: string }> {
  const parts: Array<{ type: 'code' | 'text'; content: string; language?: string }> = [];
  
  // Regex para encontrar blocos de código (com flag global)
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  
  let lastIndex = 0;
  let match;

  // Resetar o regex antes de usar
  codeBlockRegex.lastIndex = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Adicionar texto antes do código
    if (match.index > lastIndex) {
      const textContent = content.substring(lastIndex, match.index).trim();
      if (textContent) {
        parts.push({ type: 'text', content: textContent });
      }
    }

    // Adicionar bloco de código
    const language = match[1] || 'text';
    const code = match[2].trim();
    parts.push({ type: 'code', content: code, language });

    lastIndex = codeBlockRegex.lastIndex;
  }

  // Adicionar texto restante
  if (lastIndex < content.length) {
    const textContent = content.substring(lastIndex).trim();
    if (textContent) {
      parts.push({ type: 'text', content: textContent });
    }
  }

  // Se não houver partes, adicionar todo o conteúdo como texto
  if (parts.length === 0) {
    parts.push({ type: 'text', content: content });
  }

  return parts;
}
