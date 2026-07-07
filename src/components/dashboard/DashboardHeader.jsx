function DashboardHeader({ title }) {
  return (
    <div className="mb-8">

      {/* Page Title */}
      <h1 className="text-4xl font-bold">
        {title}
      </h1>

      <p className="text-gray-500 mt-2">
        Welcome to TowerNav & Chat Dashboard
      </p>

    </div>
  );
}

export default DashboardHeader;