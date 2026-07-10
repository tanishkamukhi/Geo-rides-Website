import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description: string;
}

export default function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 bg-geo-red rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-2xl">G</span>
        </div>
        <h1 className="text-4xl font-bold text-geo-dark mb-2">{title}</h1>
        <p className="text-gray-600 mb-8">{description}</p>
        <p className="text-gray-500 text-sm mb-6">
          This page is currently being built. Would you like to continue exploring other parts of the site or request this feature to be implemented?
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
}
