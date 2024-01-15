// src/components/Footer.js
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-white shadow-md p-4 text-center">
    <div className="container mx-auto text-gray-600">
      <p>© 2023 Vehicle Tracking System. All rights reserved.</p>
      <div className="flex justify-center mt-2">
        <Link to="/privacy-policy" className="text-gray-600 hover:text-blue-500 transition duration-300 mx-2">
          Privacy Policy
        </Link>
        <Link to="/terms-of-service" className="text-gray-600 hover:text-blue-500 transition duration-300 mx-2">
          Terms of Service
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
