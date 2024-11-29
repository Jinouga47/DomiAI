export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-layout">
      <nav className="dashboard-nav">
        {/* Navigation items */}
      </nav>
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
} 