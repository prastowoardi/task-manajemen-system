export default function DashboardLayout({ children }) {
    return (
        <div className="dashboard-wrapper">
        {/* Navbar */}
        <nav className="navbar">My Dashboard</nav>

        {/* Sidebar */}
        <aside className="sidebar">Menu</aside>

        {/* Content */}
        <main className="content">
            {children}
        </main>
        </div>
    );
}
