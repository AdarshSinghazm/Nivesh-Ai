export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p>&copy; {new Date().getFullYear()} AI Investment Copilot. Hackathon Project.</p>
            </div>
        </footer>
    );
}
