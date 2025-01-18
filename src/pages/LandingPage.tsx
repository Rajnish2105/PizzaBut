import { Pizza, PizzaIcon, History, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, redirect } from "react-router-dom";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="group p-6 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:bg-gray-800">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    async function getUserRole() {
      try {
        const res = await fetch(
          "https://pizzabut-be.rajnishchahar.tech/whoami",
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error);
        }
        const { user } = await res.json();
        setUserRole(user.role);
      } catch (error) {
        console.log("Couldn't get the user role", error);
        throw redirect("/auth");
      }
    }
    getUserRole();
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-900 text-gray-100">
      <div className="w-full px-6 md:px-0 md:w-4/5 max-w-7xl py-16 space-y-16">
        <header className="text-center space-y-4">
          <h1 className="text-6xl font-bold tracking-tight">PIZZABUT</h1>
          <p className="text-xl text-gray-400">Delicious pizza your way</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Pizza className="w-16 h-16 text-yellow-500" />}
            title="Pre-made Pizzas"
            description="Choose from our expertly crafted selection of signature pizzas"
          />
          <FeatureCard
            icon={<PizzaIcon className="w-16 h-16 text-green-500" />}
            title="Custom Pizza"
            description="Create your perfect pizza with our wide range of fresh toppings"
          />
          <FeatureCard
            icon={<History className="w-16 h-16 text-blue-500" />}
            title="Track Orders"
            description="Follow your pizza's journey from our oven to your doorstep"
          />
        </section>

        <div className="text-center">
          <Link
            to={
              userRole.toString().toLowerCase() === "admin"
                ? "/admin/inventory"
                : "/user/dashboard"
            }
            className="group relative inline-flex items-center justify-center py-3 px-8 text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
