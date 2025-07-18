import AuthApi from "@app/services/auth";
import { useForm } from "@tanstack/react-form";


export default function LoginPage() {

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await AuthApi.login(value);
        window.location.reload();
      } catch (error) {
        alert("Login failed. Please check your credentials.");
        console.error("Login failed:", error);
      }
    },
  });
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}>
          <form.Field
            name="email"
            children={({ name, state, handleBlur, handleChange }) => (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={name}>
                  Email
                </label>
                <input
                  type="email"
                  id={name}
                  name={name}
                  value={state.value}
                  onBlur={handleBlur}
                  onChange={e => handleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-primary-500"
                  placeholder="Enter your email"
                />
              </div>
            )} />

          <form.Field
            name="password"
            children={({ name, state, handleBlur, handleChange }) => (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={name}>
                  Password
                </label>
                <input
                  type="password"
                  id={name}
                  name={name}
                  value={state.value}
                  onBlur={handleBlur}
                  onChange={e => handleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-primary-500"
                  placeholder="Enter your password"
                />
              </div>
            )} />

          <form.Subscribe children={({ canSubmit, isSubmitting }) => (
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition duration-200"
              disabled={!canSubmit || isSubmitting}
            >
              Login
            </button>
          )} />
        </form>
      </div>
    </div>
  );
}