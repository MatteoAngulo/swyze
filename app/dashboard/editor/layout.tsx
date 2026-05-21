export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Editor has its own full-screen layout without the sidebar
  return <>{children}</>
}
