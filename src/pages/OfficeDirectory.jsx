import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import OfficeCard from "../components/common/OfficeCard";
import offices from "../data/offices";

function OfficeDirectory() {
  // Search state
  const [search, setSearch] = useState("");

  // Filter offices
  const filteredOffices = offices.filter((office) =>
    office.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Heading */}
        <h1 className="text-4xl font-bold mb-6">
          Office Directory
        </h1>

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search office..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 mb-8"
        />

        {/* Office Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffices.map((office) => (
            <OfficeCard key={office.id} office={office} />
          ))}
        </div>

      </div>
    </MainLayout>
  );
}

export default OfficeDirectory;