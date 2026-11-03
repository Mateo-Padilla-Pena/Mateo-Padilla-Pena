import React from "react";

interface FooterProps {
  name: string;
}

const Footer: React.FC<FooterProps> = ({ name }) => {
  return (
    <footer className="bg-white py-8 px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-gray-500 font-medium">© 2025 {name}</p>
      </div>
    </footer>
  );
};

export default Footer;
