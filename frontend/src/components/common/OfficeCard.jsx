function OfficeCard({ office }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition">

      <h2 className="text-xl font-bold text-cyan-600">
        {office.name}
      </h2>

      <p className="mt-2">
        <strong>Floor:</strong> {office.floor}
      </p>

      <p>
        <strong>Room:</strong> {office.room}
      </p>

      <p className="mt-2 text-gray-600">
        {office.description}
      </p>

    </div>
  );
}

export default OfficeCard;