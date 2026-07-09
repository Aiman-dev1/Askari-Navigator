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
      <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">

        {/* Dashboard Header */}
        <div className="mb-10 border-b border-gray-200/80 pb-6 relative">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-wide uppercase">
            Building Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm font-light mt-2 uppercase tracking-widest">
            Manage offices, directory listings, FAQs, and moderation settings
          </p>
          <div className="absolute bottom-[-1px] left-0 w-24 h-[2px] bg-gold-400"></div>
        </div>

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">

          <div className="bg-slate-900 border border-gold-400/20 text-white rounded p-6 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400"></div>
            <h2 className="text-4xl font-serif font-bold text-gold-400">{offices.length}</h2>
            <p className="text-xs uppercase tracking-widest text-gray-400 mt-2 font-medium">Total Offices</p>
          </div>

          <div className="bg-slate-900 border border-gold-400/20 text-white rounded p-6 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400"></div>
            <h2 className="text-4xl font-serif font-bold text-gold-400">{faqs.length}</h2>
            <p className="text-xs uppercase tracking-widest text-gray-400 mt-2 font-medium">FAQs</p>
          </div>

          <div className="bg-slate-900 border border-gold-400/20 text-white rounded p-6 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400"></div>
            <h2 className="text-4xl font-serif font-bold text-gold-400">{floorCount}</h2>
            <p className="text-xs uppercase tracking-widest text-gray-400 mt-2 font-medium">Floors</p>
          </div>

          <div className="bg-slate-900 border border-gold-400/20 text-white rounded p-6 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-red-500/70"></div>
            <h2 className="text-4xl font-serif font-bold text-red-400">{reported.length}</h2>
            <p className="text-xs uppercase tracking-widest text-gray-400 mt-2 font-medium">Chat Reports</p>
          </div>

        </div>

        {/* Add Office */}
        <div className="bg-white border border-gray-200/60 shadow-md rounded p-8 mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400/40"></div>

          <h2 className="text-xl font-serif font-bold text-slate-900 mb-6 tracking-wide uppercase">
            Add New Office Suite
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold mb-1">Office Name</label>
              <input
                name="name"
                placeholder="e.g. Ernst & Young Office"
                value={office.name}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all bg-slate-50/50"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold mb-1">Floor Level</label>
              <input
                name="floor"
                placeholder="e.g. 8th Floor"
                value={office.floor}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all bg-slate-50/50"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold mb-1">Room / Suite Code</label>
              <input
                name="room"
                placeholder="e.g. Suite 803"
                value={office.room}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all bg-slate-50/50"
              />
            </div>
          </div>

          <button
            onClick={addOffice}
            className="mt-6 bg-gold-400 hover:bg-gold-500 text-slate-950 px-6 py-3 rounded font-bold uppercase tracking-wider text-xs transition-all shadow cursor-pointer"
          >
            Add Office Listing
          </button>

        </div>

        {/* Office Table */}
        <div className="bg-white border border-gray-200/60 shadow-md rounded p-8 mb-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400/40"></div>

          <h2 className="text-xl font-serif font-bold text-slate-900 mb-6 tracking-wide uppercase">
            Office Directory Management
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-gold-400 text-xs uppercase tracking-widest font-serif border-b border-gold-400/20">
                  <th className="p-4">Office Name</th>
                  <th className="p-4">Floor</th>
                  <th className="p-4">Suite / Room</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {offices.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-slate-900">{item.name}</td>
                    <td className="p-4 text-sm text-gray-600">{item.floor}</td>
                    <td className="p-4 text-sm text-gray-600">{item.room}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => deleteOffice(item._id)}
                        className="border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white border border-gray-200/60 shadow-md rounded p-8 mb-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400/40"></div>

          <h2 className="text-xl font-serif font-bold text-slate-900 mb-6 tracking-wide uppercase">
            Manage FAQs & Info Sheets
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold mb-1">Question</label>
              <input
                placeholder="e.g. What are lobby operating hours?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="border border-gray-200 p-3 rounded text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all bg-slate-50/50"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold mb-1">Answer / Guideline</label>
              <input
                placeholder="e.g. The reception desk is staffed 24/7."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="border border-gray-200 p-3 rounded text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all bg-slate-50/50"
              />
            </div>
          </div>

          <button
            onClick={addFaq}
            className="bg-gold-400 hover:bg-gold-500 text-slate-950 px-6 py-3 rounded font-bold uppercase tracking-wider text-xs transition-all shadow cursor-pointer"
          >
            Add FAQ Listing
          </button>

          <div className="overflow-x-auto mt-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-gold-400 text-xs uppercase tracking-widest font-serif border-b border-gold-400/20">
                  <th className="p-4 w-1/3">Question</th>
                  <th className="p-4 w-1/2">Answer</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {faqs.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-slate-900">{item.question}</td>
                    <td className="p-4 text-sm text-gray-600 leading-relaxed">{item.answer}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => deleteFaq(item._id)}
                        className="border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Floor Map */}
        <div className="bg-white border border-gray-200/60 shadow-md rounded p-8 mb-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-400/40"></div>

          <h2 className="text-xl font-serif font-bold text-slate-900 mb-4 tracking-wide uppercase">
            Floor Map Schematic Upload
          </h2>

          <input
            type="file"
            className="file:border-0 file:bg-slate-900 file:text-gold-400 file:px-4 file:py-2 file:rounded file:text-xs file:uppercase file:tracking-wider file:font-semibold file:cursor-pointer hover:file:bg-slate-800 border border-gray-200 p-3 rounded w-full bg-slate-50/50"
          />

          <p className="text-gray-400 text-xs mt-3 uppercase tracking-wider">
            Schematic upload is currently mocked for staging environment testing.
          </p>

        </div>

        {/* Chat Moderation */}
        <div className="bg-white border border-gray-200/60 shadow-md rounded p-8 mb-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-red-500/40"></div>

          <h2 className="text-xl font-serif font-bold text-slate-900 mb-6 tracking-wide uppercase">
            Recent Chat Moderation Queue
          </h2>

          {reported.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded border border-gray-100 text-center text-gray-500 text-sm">
              No flagged or reported tenant messages in queue. 🎉
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-gold-400 text-xs uppercase tracking-widest font-serif border-b border-gold-400/20">
                    <th className="p-4">Sender</th>
                    <th className="p-4 w-1/2">Flagged Message</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reported.map((msg) => (
                    <tr key={msg._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm font-semibold text-slate-900">{msg.senderName}</td>
                      <td className="p-4 text-sm text-gray-600 italic">"{msg.message}"</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => deleteMessage(msg._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all hover:bg-red-600 cursor-pointer"
                        >
                          Remove Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </MainLayout>
  );
}

export default BuildingAdminDashboard;
