import React from 'react';

interface FormattedMarkdownProps {
  content: string;
  className?: string;
}

export const FormattedMarkdown: React.FC<FormattedMarkdownProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split content by lines
  const lines = content.split('\n');

  const parseInline = (text: string) => {
    // Process **bold** and *italic* and inline code
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-bold text-slate-900">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={match.index} className="italic text-slate-700">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code
            key={match.index}
            className="font-mono bg-slate-100 text-[#163B70] px-1.5 py-0.5 rounded text-[11px] font-semibold"
          >
            {token.slice(1, -1)}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Header 3 or 4: ###
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-sm font-extrabold text-[#163B70] pt-1">
              {parseInline(trimmed.replace(/^###\s+/, ''))}
            </h4>
          );
        }

        // Header 2: ##
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-base font-black text-slate-900 pt-2 pb-0.5">
              {parseInline(trimmed.replace(/^##\s+/, ''))}
            </h3>
          );
        }

        // Bullet point: - or *
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.replace(/^[-*]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 text-xs sm:text-sm text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3978F6] shrink-0 mt-1.5" />
              <div className="flex-1">{parseInline(bulletText)}</div>
            </div>
          );
        }

        // Numbered list: 1. 2.
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 text-xs sm:text-sm text-slate-700">
              <span className="font-bold text-[#163B70] text-xs shrink-0">{numMatch[1]}.</span>
              <div className="flex-1">{parseInline(numMatch[2])}</div>
            </div>
          );
        }

        // Checklist: - [ ] or - [x]
        if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]')) {
          const isDone = trimmed.startsWith('- [x]');
          const checkText = trimmed.replace(/^-\s+\[[ x]\]\s+/, '');
          return (
            <div key={idx} className="flex items-center gap-2 pl-1 text-xs sm:text-sm text-slate-700">
              <input
                type="checkbox"
                defaultChecked={isDone}
                className="rounded border-slate-300 text-[#3978F6] focus:ring-[#3978F6]"
                readOnly
              />
              <span className={isDone ? 'line-through text-slate-400' : ''}>
                {parseInline(checkText)}
              </span>
            </div>
          );
        }

        // Blockquote: >
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote
              key={idx}
              className="border-l-4 border-teal-500 pl-3 py-1 my-1 bg-teal-50/60 rounded-r-lg text-xs italic text-teal-900"
            >
              {parseInline(trimmed.replace(/^>\s+/, ''))}
            </blockquote>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {parseInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};
