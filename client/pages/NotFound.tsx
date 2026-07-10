import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 bg-geo-red rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-2xl">404</span>
        </div>
        <h1 className="text-4xl font-bold text-geo-dark mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Sorry, the page you're looking for doesn't exist. Let's get you back
          on track.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-geo-red text-white font-bold rounded-lg hover:bg-red-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
