import React from "react";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Biocollections Worldwide Inc
        </h1>

        <div className="space-y-4">
          <button
            // onClick={() => signIn('google')} // Placeholder for NextAuth.js
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {/* Replace with Google SVG icon */}
            <span className="mr-2">G</span>
            Sign in with Google
          </button>

          <button
            // onClick={() => signIn('github')} // Placeholder for NextAuth.js
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
          >
            {/* Replace with GitHub SVG icon */}
            <span className="mr-2">GH</span>
            Sign in with GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Please sign in to continue.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
