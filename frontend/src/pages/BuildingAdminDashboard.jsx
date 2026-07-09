import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import { api } from "../lib/api";

function BuildingAdminDashboard() {
  const [offices, setOffices] = useState([]);
  const [reported, setReported] = useState([]);
  const [floorCount, setFloorCount] = useState(0);
  const [faqs, setFaqs] = useState([]);

  const [office, setOffice] = useState({
    name: "",
    floor: "",
    room: "",
  });

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    api
      .get("/offices")
      .then((data) => setOffices(data.offices))
      .catch((err) => toast.error(err.message));

    api
      .get("/chat/reported")
      .then((data) => setReported(data.messages))
      .catch((err) => toast.error(err.message));

    api
      .get("/tenants/mine")
      .then((data) => setFloorCount(data.tenant.floors?.length || 0))
      .catch(() => {});

    api
      .get("/faqs")
      .then((data) => setFaqs(data.faqs))
      .catch((err) => toast.error(err.message));
  }, []);

  const addFaq = async () => {
    if (!question || !answer) return;
    try {
      const data = await api.post("/faqs", { question, answer });
      setFaqs([...faqs, data.faq]);
      setQuestion("");
      setAnswer("");
      toast.success("FAQ added");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteFaq = async (id) => {
    try {
      await api.delete(`/faqs/${id}`);
      setFaqs(faqs.filter((item) => item._id !== id));
      toast.success("FAQ deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleChange = (e) => {
    setOffice({ ...office, [e.target.name]: e.target.value });
  };

  const addOffice = async () => {
    if (!office.name || !office.floor || !office.room) return;

    try {
      const data = await api.post("/offices", office);
      setOffices([...offices, data.office]);
      setOffice({ name: "", floor: "", room: "" });
      toast.success("Office added");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteOffice = async (id) => {
    try {
      await api.delete(`/offices/${id}`);
      setOffices(offices.filter((item) => item._id !== id));
      toast.success("Office deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await api.delete(`/chat/messages/${id}`);
      setReported(reported.filter((m) => m._id !== id));
      toast.success("Message removed");
    } catch (err) {
      toast.error(err.message);
    }
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
            <h2 className="text-3xl font-bold">{faqs.length}</h2>
            <p>FAQs</p>
          </div>

          <div className="bg-orange-500 text-white rounded-xl p-6">
            <h2 className="text-3xl font-bold">{floorCount}</h2>
            <p>Floors</p>
          </div>

          <div className="bg-purple-500 text-white rounded-xl p-6">
            <h2 className="text-3xl font-bold">{reported.length}</h2>
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
              placeholder="Floor (e.g. 4th Floor)"
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

                <tr key={item._id} className="text-center border-b">

                  <td className="p-3">{item.name}</td>

                  <td>{item.floor}</td>

                  <td>{item.room}</td>

                  <td>

                    <button
                      onClick={() => deleteOffice(item._id)}
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

        {/* FAQs */}

        <div className="bg-white shadow rounded-xl p-6 mt-10">

          <h2 className="text-2xl font-bold mb-5">
            Manage FAQs
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              placeholder="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="border p-3 rounded"
            />

            <input
              placeholder="Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
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

              {faqs.map((item) => (

                <tr key={item._id} className="border-b text-center">

                  <td className="p-3">{item.question}</td>

                  <td>{item.answer}</td>

                  <td>

                    <button
                      onClick={() => deleteFaq(item._id)}
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
            Only UI for testing.
          </p>

        </div>

        {/* Chat Moderation */}

        <div className="bg-white shadow rounded-xl p-6 mt-10">

          <h2 className="text-2xl font-bold mb-5">
            Recent Chat Reports
          </h2>

          {reported.length === 0 ? (
            <p className="text-gray-500">No reported messages. 🎉</p>
          ) : (
            <table className="w-full">

              <thead className="bg-gray-200">

                <tr>

                  <th className="p-3">User</th>

                  <th>Message</th>

                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {reported.map((msg) => (

                  <tr key={msg._id} className="text-center border-b">

                    <td className="p-3">{msg.senderName}</td>

                    <td>{msg.message}</td>

                    <td>

                      <button
                        onClick={() => deleteMessage(msg._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Remove
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>
          )}

        </div>

      </div>
    </MainLayout>
  );
}

export default BuildingAdminDashboard;
