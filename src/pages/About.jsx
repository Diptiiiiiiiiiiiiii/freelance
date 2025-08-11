import { FaFacebook, FaInstagram, FaLinkedin, FaPinterest, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const columns = [
  {
    title: "Categories",
    links: [
      "Graphics & Design",
      "Digital Marketing",
      "Writing & Translation",
      "Video & Animation",
      "Music & Audio",
      "Programming & Tech",
      "AI Services",
      "Consulting",
      "Data",
      "Business",
      "Personal Growth & Hobbies",
      "Photography",
      "Finance",
      "End-to-End Projects",
      "Service Catalog",
    ],
  },
  {
    title: "For Clients",
    links: [
      "How It Works",
      "Customer Stories",
      "Trust & Safety",
      "Quality Guide",
      "Online Courses",
      "Guides",
      "Help Center",
    ],
  },
  {
    title: "For Freelancers",
    links: [
      "Become a Freelancer",
      "Become an Agency",
      "Equity Program",
      "Community Hub",
      "Forum",
      "Events",
    ],
  },
  {
    title: "Business Solutions",
    links: [
      "Pro Services",
      "Project Management",
      "Sourcing Service",
      "Content Marketing",
      "Creative Talent",
      "Dropshipping Tools",
      "AI Builder",
      "Logo Maker",
      "Contact Sales",
    ],
  },
  {
    title: "Company",
    links: [
      "About Us",
      "Careers",
      "Privacy Policy",
      "Terms of Service",
      "Do Not Sell Info",
      "Partnerships",
      "Affiliates",
      "Invite a Friend",
      "Newsroom",
      "Investor Relations",
    ],
  },
];

const About = () => {
  return (
    <div className="bg-white text-gray-800 px-6 py-12">
      {/* Top Footer */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-12">
        {columns.map((col, idx) => (
          <div key={idx}>
            <h3 className="font-semibold text-md mb-4">{col.title}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {col.links.map((link, i) => (
                <li key={i} className="hover:underline cursor-pointer">
                  {link}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
        {/* Brand */}
        <div className="text-lg font-bold text-green-700 mb-4 md:mb-0">
          Freelance<span className="text-gray-900">Hub</span>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 text-gray-600 text-xl mb-4 md:mb-0">
          <FaTiktok className="hover:text-black cursor-pointer" />
          <FaInstagram className="hover:text-pink-500 cursor-pointer" />
          <FaLinkedin className="hover:text-blue-700 cursor-pointer" />
          <FaFacebook className="hover:text-blue-600 cursor-pointer" />
          <FaPinterest className="hover:text-red-500 cursor-pointer" />
          <FaXTwitter className="hover:text-black cursor-pointer" />
        </div>

        {/* Language + Currency */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>🌐 English</span>
          <span>₹ INR</span>
          <span>© {new Date().getFullYear()} FreelanceHub</span>
        </div>
      </div>
    </div>
  );
};

export default About;
