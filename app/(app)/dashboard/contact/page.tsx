export default function ContactPage() {
  return (
    <div className="p-8">
      <h1 className="font-bold text-2xl mb-3" style={{ color: 'var(--q-text-primary)' }}>
        Questions?
      </h1>
      <p className="text-sm" style={{ color: 'var(--q-text-muted)' }}>
        Contact us at{' '}
        <a
          href="mailto:founders@quantus.finance"
          className="underline hover:opacity-80"
          style={{ color: 'var(--q-purple)' }}
        >
          founders@quantus.finance
        </a>
      </p>
    </div>
  )
}
