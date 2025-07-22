export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Secrety</h1>
        <p className="text-lg mb-6">
          Securely manage and fetch your project environment variables from anywhere.
        </p>
        <button className="bg-white text-primary-600 font-semibold px-6 py-2 rounded shadow hover:bg-primary-50">
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto py-12 px-10">
        <h2 className="text-2xl font-bold mb-4">Why Secrety?</h2>
        <p className="text-gray-700 mb-6">
          Secrety lets you host, organize, and retrieve your secrets and environment variables for any project, making remote configuration simple and secure.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-2">Centralized Secrets</h3>
            <p className="text-gray-600">
              Store all your environment variables in one secure place, accessible from anywhere.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-2">Easy Integration</h3>
            <p className="text-gray-600">
              Fetch secrets remotely and inject them into your computer or server environments with simple commands.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-600">
              Share access with your team and manage permissions for different projects securely.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-6xl px-10 mx-auto">
          <h2 className="text-2xl font-bold mb-4">About Secrety</h2>
          <p className="text-gray-700">
            Secrety is built for developers and teams who need a reliable way to manage secrets and environment variables. Host your secrets, fetch them remotely, and keep your projects secure and organized.
          </p>
        </div>
      </section>
      {/* Footer Section */}
      <footer className="bg-primary-700 text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <span className="text-sm">&copy; {new Date().getFullYear()} Secrety. All rights reserved.</span>
          <span className="text-sm mt-2 md:mt-0">Made with &hearts; for secure environment management.</span>
        </div>
      </footer>
    </div>
  );
}
