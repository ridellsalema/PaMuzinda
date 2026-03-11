import { useState } from "react";
import { useNavigate } from "react-router";
import { Wrench, ArrowLeft, Check, DollarSign, Briefcase } from "lucide-react";

const skillOptions = ["Plumbing", "Electrical", "Carpentry", "Painting", "General Repairs"];

export function HandymanOnboarding() {
  const [step, setStep] = useState<"profile" | "skills" | "rates" | "success">("profile");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState("");
  const [experience, setExperience] = useState("");
  const navigate = useNavigate();

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmitProfile = () => {
    if (name.trim() && phone.trim()) setStep("skills");
  };

  const handleSubmitSkills = () => {
    if (skills.length > 0) setStep("rates");
  };

  const handleSubmitRates = () => {
    setStep("success");
    setTimeout(() => navigate("/handyman"), 2500);
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3 text-gray-800">Profile submitted!</h1>
          <p className="text-gray-500 mb-6">
            We'll review your application and get you verified soon. You can browse the handyman dashboard in the meantime.
          </p>
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 overflow-x-hidden">
      <div className="max-w-lg mx-auto px-4 py-8 md:py-12">
        <button
          onClick={() => (step === "profile" ? navigate("/handyman") : setStep(step === "skills" ? "profile" : "skills"))}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Handyman onboarding</h1>
            <p className="text-gray-500 text-sm">
              {step === "profile" && "Your contact details"}
              {step === "skills" && "Services you offer"}
              {step === "rates" && "Rates & experience"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
          {step === "profile" && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Michael Chikwanha"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +263 77 123 4567"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <button
                onClick={handleSubmitProfile}
                disabled={!name.trim() || !phone.trim()}
                className="w-full mt-6 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </>
          )}

          {step === "skills" && (
            <>
              <p className="text-gray-500 text-sm mb-4">Select all services you can provide</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      skills.includes(skill)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmitSkills}
                disabled={skills.length === 0}
                className="w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </>
          )}

          {step === "rates" && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hourly rate (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      placeholder="15"
                      min="1"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="e.g. 5 years"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleSubmitRates}
                className="w-full mt-6 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Submit profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
