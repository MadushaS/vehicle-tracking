// HomePage.js
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 container mx-auto my-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Welcome to the Vehicle Tracking System
        </h1>
        <p className="text-lg text-gray-600">
          Track your fleet in real-time, optimize routes, and ensure the safety and efficiency
          of your vehicles.
        </p>
        {/* Add more content as needed */}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
