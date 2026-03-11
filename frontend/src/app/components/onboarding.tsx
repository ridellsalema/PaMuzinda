import { useState } from "react";
import { useNavigate } from "react-router";
import { Home as HomeIcon, Building2, Wrench, ChevronRight } from "lucide-react";

const slides = [
  {
    icon: HomeIcon,
    title: "Welcome to Muzinda",
    description: "Your trusted platform for finding quality student and general accommodation",
    color: "bg-primary",
  },
  {
    icon: Building2,
    title: "Find Trusted Accommodation",
    description: "Browse verified listings from trusted landlords. Safe, secure, and student-friendly.",
    color: "bg-[#6b8e73]",
  },
  {
    icon: Wrench,
    title: "Connect with Experts",
    description: "List your property or find verified handymen for maintenance and repairs.",
    color: "bg-[#a8926f]",
  },
];

export function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/login");
    }
  };

  const handleSkip = () => {
    navigate("/login");
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen w-full bg-background flex flex-col overflow-x-hidden">
      {/* Skip button */}
      <div className="p-6 flex justify-end">
        <button
          onClick={handleSkip}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20">
        <div className={`w-32 h-32 ${slide.color} rounded-full flex items-center justify-center mb-12 shadow-lg`}>
          <Icon className="w-16 h-16 text-white" />
        </div>

        <h1 className="text-3xl font-semibold text-center mb-4 text-foreground">
          {slide.title}
        </h1>
        <p className="text-center text-muted-foreground text-lg mb-12 max-w-sm">
          {slide.description}
        </p>

        {/* Dots */}
        <div className="flex gap-2 mb-12">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Next button */}
      <div className="p-6">
        <button
          onClick={handleNext}
          className="w-full bg-primary text-primary-foreground py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:bg-primary/90 transition-colors"
        >
          <span className="text-lg font-medium">
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}