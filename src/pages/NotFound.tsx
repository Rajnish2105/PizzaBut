import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <PizzaSVG />
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Oops! Looks like this slice is missing
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            The page you're looking for has been eaten or doesn't exist.
          </p>
        </div>
        <div className="mt-8 bg-gray-800 rounded-2xl shadow-2xl p-6">
          <div className="text-center">
            <p className="text-xl font-medium text-white mb-4">
              Don't worry, we've got plenty more slices!
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
            >
              Go back to the menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function PizzaSVG() {
  return (
    <svg
      className="mx-auto h-48 w-48 text-red-600"
      fill="currentColor"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="#FFA500" />
      <circle cx="50" cy="50" r="40" fill="#FFDB58" />
      <circle cx="50" cy="50" r="38" fill="#FF6347" />
      <circle cx="30" cy="35" r="5" fill="#000000" className="animate-bounce" />
      <circle
        cx="45"
        cy="65"
        r="5"
        fill="#000000"
        className="animate-bounce delay-100"
      />
      <circle
        cx="60"
        cy="40"
        r="5"
        fill="#000000"
        className="animate-bounce delay-200"
      />
      <path d="M50,50 L95,50 A45,45 0 0,0 50,5 Z" fill="#FFA500" />
      <path
        d="M50,50 L95,50 A45,45 0 0,0 50,5 Z"
        fill="none"
        stroke="#8B4513"
        strokeWidth="2"
      />
    </svg>
  );
}
