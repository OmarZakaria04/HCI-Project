import Header from "../../components/Header";

export default function StudentHome() {
  return (
    <div className="min-h-screen bg-cream/40">
      <Header />
      <main className="max-w-7xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-forest">Student Dashboard</h1>
        <p className="text-sm text-forest/70 mt-1">
          Welcome back to the student portal.
        </p>
      </main>
    </div>
  );
}
