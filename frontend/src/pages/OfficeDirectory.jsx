import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import OfficeCard from "../components/common/OfficeCard";
import { api } from "../lib/api";
import { useSelector } from "react-redux";

function OfficeDirectory() {
  const { user } = useSelector((state) => state.auth);
  const [offices, setOffices] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/offices")
      .then((data) => setOffices(data.offices))
      .catch((err) => toast.error(err.message));
  }, []);

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
            <OfficeCard 
              key={office._id} 
              office={office} 
              onDelete={
                user?.role === "super_admin" 
                  ? async () => {
                      if (!window.confirm("Are you sure you want to permanently delete this office?")) return;
                      try {
                        await api.delete(`/offices/${office._id}`);
                        setOffices(offices.filter((o) => o._id !== office._id));
                        toast.success("Office deleted permanently");
                      } catch (err) {
                        toast.error(err.message);
                      }
                    }
                  : null
              }
            />
          ))}
        </div>

      </div>
    </MainLayout>
  );
}

export default OfficeDirectory;
