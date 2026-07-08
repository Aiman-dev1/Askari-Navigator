import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";

function BuildingAdminDashboard() {
  const [offices, setOffices] = useState([
    { id: 1, name: "HR Department", floor: "4th", room: "402" },
    { id: 2, name: "Finance", floor: "3rd", room: "305" },
    { id: 3, name: "IT Department", floor: "5th", room: "501" },
  ]);

  const [office, setOffice] = useState({
    name: "",
    floor: "",
    room: "",
  });

  const [faqs, setFaqs] = useState([
  {
    id: 1,
    question: "Where is HR?",
    answer: "4th Floor, Room 402",
  },
]);

const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");

const addFaq = () => {
  if (!question || !answer) return;

  setFaqs([
    ...faqs,
    {
      id: Date.now(),
      question,
      answer,
    },
  ]);

  setQuestion("");
  setAnswer("");
};

const deleteFaq = (id) => {
  setFaqs(faqs.filter((item) => item.id !== id));
};

  const handleChange = (e) => {
    setOffice({ ...office, [e.target.name]: e.target.value });
  };

  const addOffice = () => {
    if (!office.name || !office.floor || !office.room) return;

    setOffices([
      ...offices,
      {
        id: Date.now(),
        ...office,
      },
    ]);

    setOffice({
      name: "",
      floor: "",
      room: "",
    });
  };

  

  const deleteOffice = (id) => {
    setOffices(offices.filter((item) => item.id !== id));
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">
          Building Admin Dashboard
        </h1>

        {/* Dashboard Cards */}

        <div className="grid md:grid-cols-4 gap-5 mb-10">

          <div className="bg-cyan-500 text-white rounded-xl p-6">
            <h2 className="text-3xl font-bold">{offices.length}</h2>
            <p>Total Offices</p>
          </div>

          <div className="bg-green-500 text-white rounded-xl p-6">
            <h2 className="text-3xl font-bold">6</h2>
            <p>FAQs</p>
          </div>

          <div className="bg-orange-500 text-white rounded-xl p-6">
            <h2 className="text-3xl font-bold">5</h2>
            <p>Floor Maps</p>
          </div>

          <div className="bg-purple-500 text-white rounded-xl p-6">
            <h2 className="text-3xl font-bold">18</h2>
            <p>Chat Reports</p>
          </div>

        </div>

        {/* Add Office */}

        <div className="bg-white shadow rounded-xl p-6 mb-8">

          <h2 className="text-2xl font-bold mb-5">
            Add Office
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <input
              name="name"
              placeholder="Office Name"
              value={office.name}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              name="floor"
              placeholder="Floor"
              value={office.floor}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              name="room"
              placeholder="Room"
              value={office.room}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

          </div>

          <button
            onClick={addOffice}
            className="mt-5 bg-cyan-600 text-white px-6 py-3 rounded-lg"
          >
            Add Office
          </button>

        </div>

        {/* Office Table */}

        <div className="bg-white shadow rounded-xl p-6">

          <h2 className="text-2xl font-bold mb-5">
            Office Directory
          </h2>

          <table className="w-full">

            <thead className="bg-slate-200">

              <tr>

                <th className="p-3">Office</th>
                <th>Floor</th>
                <th>Room</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {offices.map((item) => (

                <tr key={item.id} className="text-center border-b">

                  <td className="p-3">{item.name}</td>

                  <td>{item.floor}</td>

                  <td>{item.room}</td>

                  <td>

                    <button
                      onClick={() => deleteOffice(item.id)}
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

        {/* Add FAQ */}{/* FAQs */}

<div className="bg-white shadow rounded-xl p-6 mt-10">

<h2 className="text-2xl font-bold mb-5">
Manage FAQs
</h2>

<div className="grid md:grid-cols-2 gap-4">

<input
placeholder="Question"
value={question}
onChange={(e)=>setQuestion(e.target.value)}
className="border p-3 rounded"
/>

<input
placeholder="Answer"
value={answer}
onChange={(e)=>setAnswer(e.target.value)}
className="border p-3 rounded"
/>

</div>

<button
onClick={addFaq}
className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
>
Add FAQ
</button>

<table className="w-full mt-6">

<thead className="bg-gray-200">

<tr>

<th className="p-3">Question</th>

<th>Answer</th>

<th>Action</th>

</tr>

</thead>

<tbody>

{faqs.map((item)=>(

<tr key={item.id} className="border-b text-center">

<td className="p-3">{item.question}</td>

<td>{item.answer}</td>

<td>

<button
onClick={()=>deleteFaq(item.id)}
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
      {/* Floor Map */}

<div className="bg-white shadow rounded-xl p-6 mt-10">

<h2 className="text-2xl font-bold mb-5">
Floor Map Upload
</h2>

<input
type="file"
className="border p-3 rounded w-full"
/>

<p className="text-gray-500 mt-3">
Only UI for presentation.
</p>

</div>

{/* Chat Moderation */}

<div className="bg-white shadow rounded-xl p-6 mt-10">

<h2 className="text-2xl font-bold mb-5">
Recent Chat Reports
</h2>

<table className="w-full">

<thead className="bg-gray-200">

<tr>

<th className="p-3">User</th>

<th>Message</th>

<th>Status</th>

</tr>

</thead>

<tbody>

<tr>

<td className="p-3">ShadowWalker</td>

<td>Spam Message</td>

<td className="text-red-500 font-bold">
Reported
</td>

</tr>

<tr>

<td className="p-3">Aiman</td>

<td>Hello Everyone</td>

<td className="text-green-600 font-bold">
Approved
</td>

</tr>

</tbody>

</table>

</div>
      </div>
    </MainLayout>
  );
}

export default BuildingAdminDashboard;