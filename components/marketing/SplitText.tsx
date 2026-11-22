import type { CSSProperties, ElementType } from 'react'

type Line = string | { text: string; accent?: boolean }

/**
 * Splits a heading into masked words that rise into place when the parent reveal fires.
 * Assistive technology reads the plain sentence once; the animated copy is hidden from it.
 */
export function SplitText({ lines, as: Tag = 'span', className = '', id, reveal = true }: {
  lines: Line[]
  as?: ElementType
  className?: string
  id?: string
  /** When false the words animate once on load (used by the hero) instead of on scroll. */
  reveal?: boolean
}) {
  const normalized = lines.map(line => typeof line === 'string' ? { text: line, accent: false } : { text: line.text, accent: !!line.accent })
  let index = 0
  return <Tag id={id} className={`ms-split ${className}`} {...(reveal ? { 'data-reveal': 'split' } : {})}>
    <span className="sr-only">{normalized.map(line => line.text).join(' ')}</span>
    {normalized.map((line, lineIndex) => <span key={lineIndex} aria-hidden="true" className={`ms-split-line${line.accent ? ' is-accent' : ''}`}>
      {line.text.trim().split(/\s+/).map((word, wordIndex, words) => {
        const style = { '--i': index++ } as CSSProperties
        return <span key={wordIndex}><span className="ms-split-word"><span className="ms-split-inner" style={style}>{word}</span></span>{wordIndex < words.length - 1 ? ' ' : ''}</span>
      })}
    </span>)}
  </Tag>
}
