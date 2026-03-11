import { useNavigate } from "react-router";
import { MapPin, Home as HomeIcon, Building2, Bed, Wrench, ArrowRight, Car } from "lucide-react";

const featuredListings = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1758874573111-76d77f6ec690?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYXBhcnRtZW50JTIwcm9vbSUyMG1vZGVybnxlbnwxfHx8fDE3NzEzNDczMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Modern Student Studio",
    location: "Near UZ, Mutare",
    price: "$150",
    beds: 1,
    distance: "0.5km from campus",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1661796428175-55423b19409f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYXBhcnRtZW50JTIwYmVkcm9vbSUyMGZ1cm5pc2hlZHxlbnwxfHx8fDE3NzEzNDczMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Cozy Furnished Room",
    location: "City Center, Mutare",
    price: "$120",
    beds: 1,
    distance: "1.2km from campus",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1744509636454-7b7d179b6d23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc3MTMwNDI1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Spacious 2BR Apartment",
    location: "Greenside, Mutare",
    price: "$280",
    beds: 2,
    distance: "2km from campus",
  },
];

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gray-50 overflow-x-hidden">
      {/* Navbar */}
      <nav className="absolute top-0 w-full z-10 px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-end gap-6 items-center text-white font-medium">
          <button onClick={() => navigate("/properties")} className="hover:text-white/80 transition-colors">Browse Properties</button>
          <button onClick={() => navigate("/login")} className="hover:text-white/80 transition-colors">Login</button>
          <button onClick={() => navigate("/get-started")} className="px-5 py-2 bg-white text-primary rounded-full hover:bg-gray-100 transition-colors">Sign Up</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-primary text-white relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-12 md:pt-32 md:pb-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-3 mb-6">
                <img src="/muzinda.png" alt="Muzinda" className="h-10 w-10 md:h-12 md:w-12 rounded-2xl object-cover" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Find your perfect place in Mutare
              </h1>
              <p className="text-lg text-white/90 max-w-xl mb-8">
                Student and general accommodation, verified landlords, and handyman services — all in one platform.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <button
                    onClick={() => navigate("/get-started")}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate("/properties")}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/30"
                  >
                    Browse listings
                  </button>
                </div>
                <button
                  onClick={() => navigate("/onboarding")}
                  className="text-white/90 hover:text-white text-sm font-medium underline w-fit"
                >
                  New here? Take a tour
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/10 px-4 py-3 rounded-2xl w-fit mx-auto md:mx-0">
              <MapPin className="w-5 h-5" />
              <span>Mutare, Zimbabwe</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Featured listings</h2>
        <p className="text-gray-500 mb-8">Sample accommodations — sign in to search and book</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((listing) => (
            <button
              key={listing.id}
              onClick={() => navigate("/home")}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-left"
            >
              <div className="relative h-48 md:h-52">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/50 text-white text-xs rounded-full">
                  {listing.distance}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-800 mb-1">{listing.title}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Bed className="w-4 h-4" />
                    <span>{listing.beds} bed{listing.beds > 1 ? "s" : ""}</span>
                  </div>
                  <span className="text-primary font-bold text-lg">{listing.price}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            View all listings
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* How it works / CTA */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <HomeIcon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Student Housing & General Rentals</h3>
              <p className="text-gray-500 text-sm">Browse verified listings and filter by location to find your perfect home.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Wrench className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Maintenance & Handyman Services</h3>
              <p className="text-gray-500 text-sm">Request repairs and get matched with verified local handymen.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Car className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Student Transport</h3>
              <p className="text-gray-500 text-sm">Book reliable commute services if you are a verified student.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/get-started")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Create account
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
