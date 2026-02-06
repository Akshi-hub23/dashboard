interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="bg-card border-b border-border px-8 py-6">
      <h1 className="text-3xl font-bold text-card-foreground flex items-center gap-2">
        {title}
      </h1>
      {subtitle && (
        <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
      )}
    </div>
  )
}
