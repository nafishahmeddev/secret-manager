export default function HomePage() {

  return (
    <div className=" px-8 py-8">
      <section className="bg-white border border-gray-200 rounded-lg shadow-md  px-8 md:px-24 py-20 flex flex-col items-start">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          Welcome to Secret Manager
        </h1>
        <p className="text-2xl text-gray-600 mb-10 max-w-4xl leading-relaxed">
          Securely store, manage, and access your secrets with ease. Your privacy and security are our top priorities.
        </p>
        <button className="px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-600 to-yellow-400 rounded hover:from-orange-700 hover:to-yellow-500 shadow transition">
          Get Started
        </button>
      </section>
    </div>
  )
}