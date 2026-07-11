function OfficeCard({ office, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition relative group">
      
      {onDelete && (
        <button 
          onClick={onDelete}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-bold transition opacity-0 group-hover:opacity-100"
        >
          Delete
        </button>
      )}

      <h2 className="text-xl font-bold text-cyan-600 pr-16">
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