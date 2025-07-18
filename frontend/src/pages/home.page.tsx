export default function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Website</h1>
        <p className="text-lg mb-6">This is a simple homepage with a hero section and some content.</p>
        <button className="bg-white text-primary-600 font-semibold px-6 py-2 rounded shadow hover:bg-primary-50">
          Get Started
        </button>
      </section>

      {/* Content Section 1 */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-4">Our Features</h2>
        <p className="text-gray-700 mb-6">
          Discover the amazing features we offer to help you succeed. Our platform is designed to be user-friendly and efficient.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-2">Feature One</h3>
            <p className="text-gray-600">Description of feature one.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-2">Feature Two</h3>
            <p className="text-gray-600">Description of feature two.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-2">Feature Three</h3>
            <p className="text-gray-600">Description of feature three.</p>
          </div>
        </div>
      </section>

      {/* Content Section 2 */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">About Us</h2>
          <p className="text-gray-700">
            We are committed to providing the best service possible. Our team is passionate and dedicated to your success.
          </p>
        </div>
      </section>
    </div>
  );
}
