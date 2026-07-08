import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";

function ManageOffices() {
  const [offices, setOffices] = useState([
    { id: 1, name: "HR Department", floor: "4th", room: "402" },
    { id: 2, name: "Finance", floor: "3rd", room: "305" },
  ]);

  const [name, setName] = useState("");
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");

  const addOffice = () => {
    if (!name || !floor || !room) return;

    const newOffice = {
      id: Date.now(),
      name,
      floor,
      room,
    };

    setOffices([...offices, newOffice]);

    setName("");
    setFloor("");
    setRoom("");
  };

  const deleteOffice = (id) => {
    setOffices(offices.filter((office) => office.id !== id));
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-10">

        <h1 className="text-4xl font-bold mb-6">
          Manage Offices
        </h1>

        {/* Form */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">

          <input
            type="text"
            placeholder="Office Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded"
          />

          <input
            type="text"
            placeholder="Floor"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            className="border p-3 rounded"
          />

          <input
            type="text"
            placeholder="Room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="border p-3 rounded"
          />

        </div>

        <button
          onClick={addOffice}
          className="bg-cyan-500 text-white px-6 py-3 rounded"
        >
          Add Office
        </button>

        {/* Table */}
        <table className="w-full mt-10 border">

          <thead className="bg-slate-200">

            <tr>
              <th className="p-3">Office</th>
              <th>Floor</th>
              <th>Room</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {offices.map((office) => (

              <tr key={office.id} className="text-center border-t">

                <td className="p-3">{office.name}</td>

                <td>{office.floor}</td>

                <td>{office.room}</td>

                <td>

                  <button
                    onClick={() => deleteOffice(office.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    </MainLayout>
  );
}

export default ManageOffices;