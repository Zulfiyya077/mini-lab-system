const DashboardPage = () => {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Welcome to Mini Lab System
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Patients
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              124
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending Analyses
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-600">
              18
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Approved Analyses
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              96
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Rejected Analyses
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-600">
              10
            </h2>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Quick Actions
          </h2>

          <div className="mt-4 flex flex-wrap gap-3">
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Add Patient
            </button>

            <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
              Create Analysis
            </button>

            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              View Analyses
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;