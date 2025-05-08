
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4 p-8 bg-white border border-gray-200 rounded-lg shadow-sm max-w-md w-full">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-xl text-gray-700 mb-4">Page Not Found</p>
        <p className="text-gray-500">
          We couldn't find the page you're looking for. The page might have been moved or deleted.
        </p>
        <Button asChild className="mt-4 bg-primary hover:bg-primary-600">
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
