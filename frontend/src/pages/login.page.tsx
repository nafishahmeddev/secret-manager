import AuthApi from "@app/services/auth";
import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";

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
        toast.error("Login failed. Please check your credentials.");
        console.error("Login failed:", error);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 via-white to-primary-200">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl px-10 py-12 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary-600 rounded-full h-16 w-16 flex items-center justify-center mb-4 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 2c-2.67 0-8 1.337-8 4v3h16v-3c0-2.663-5.33-4-8-4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="email"
            children={({ name, state, handleBlur, handleChange }) => (
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor={name}>
                  Email Address
                </label>
                <input
                  type="email"
                  id={name}
                  name={name}
                  value={state.value}
                  onBlur={handleBlur}
                  onChange={e => handleChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
                  placeholder="you@email.com"
                  autoComplete="email"
                  required
                />
              </div>
            )}
          />

          <form.Field
            name="password"
            children={({ name, state, handleBlur, handleChange }) => (
              <div className="mb-7">
                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor={name}>
                  Password
                </label>
                <input
                  type="password"
                  id={name}
                  name={name}
                  value={state.value}
                  onBlur={handleBlur}
                  onChange={e => handleChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
            )}
          />

          <form.Subscribe
            children={({ canSubmit, isSubmitting }) => (
              <button
                type="submit"
                className="w-full bg-primary-600 text-white font-semibold py-2.5 rounded-lg shadow hover:bg-primary-700 transition duration-200 disabled:opacity-60"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            )}
          />
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-500 text-sm">Don&apos;t have an account?</span>
          <a href="/register" className="ml-2 text-primary-600 font-semibold hover:underline text-sm">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}