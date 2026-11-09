import * as React from 'react'

function Card({ className = '', ...props }: React.ComponentProps<'article'>) {
  return <article data-slot="card" className={`ui-card ${className}`} {...props} />
}

function CardHeader({ className = '', ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-header" className={`ui-card-header ${className}`} {...props} />
}

function CardTitle({ className = '', ...props }: React.ComponentProps<'h3'>) {
  return <h3 data-slot="card-title" className={`ui-card-title ${className}`} {...props} />
}

function CardDescription({ className = '', ...props }: React.ComponentProps<'p'>) {
  return <p data-slot="card-description" className={`ui-card-description ${className}`} {...props} />
}

function CardContent({ className = '', ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={`ui-card-content ${className}`} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
