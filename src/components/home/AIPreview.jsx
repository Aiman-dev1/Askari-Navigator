function AIPreview() {
  return (
    <section className="py-20 bg-white">

      <div className="max-w-6xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-10 items-center">

          <div>

            <h2 className="text-4xl font-bold mb-5">
              AI Assistant
            </h2>

            <p className="text-gray-600 mb-6">
              Ask any building-related question and receive instant answers
              about offices, departments and facilities.
            </p>


          </div>

          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xl">

            <p className="mb-4">
              <strong>You:</strong> Where is HR Department?
            </p>

            <p className="text-cyan-400">
              <strong>TowerBot:</strong> HR Department is on the 4th Floor,
              Room 402.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default AIPreview;