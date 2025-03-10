'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { signUp, createProfile, signIn } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 }
};

// Form step interface
interface FormStep {
  title: string;
  description?: string;
  fields: FormField[];
}

// Form field interface
interface FormField {
  id: string;
  type: 'text' | 'email' | 'password' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'file' | 'multiselect';
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  validation?: (value: any) => boolean;
  errorMessage?: string;
}

export default function SignUpPage() {
  const router = useRouter();
  // Form data state
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    major: '',
    year: '',
    interests: '',
    skills: '',
    linkedin: '',
    twitter: '',
    
    // What are you looking for
    lookingFor: [] as string[],
    
    // Founder section
    founderType: '',
    startupName: '',
    startupIdea: '',
    rolesLookingFor: '',
    founderSkills: '',
    startupStage: '',
    
    // Job section
    interestedRoles: '',
    experience: '',
    resume: null as File | null,
    
    // Additional questions
    industries: '',
    commitment: '',
    
    // Terms
    agreeToTerms: false,
  });

  // Current step state
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFounderSection, setShowFounderSection] = useState(false);
  const [showJobSection, setShowJobSection] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Generate random particles for the background effect
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 30 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.3,
      duration: Math.random() * 3 + 2,
      yOffset: Math.random() * 30 - 15
    })));
  }, []);

  // Form steps
  const formSteps: FormStep[] = [
    // Step 1: Basic Information
    {
      title: "Let's get to know you",
      description: "Start by telling us about yourself",
      fields: [
        { id: 'fullName', type: 'text', label: 'Full Name', required: true },
        { id: 'email', type: 'email', label: 'Chapman University Email', placeholder: 'your.name@chapman.edu', required: true },
        { id: 'password', type: 'password', label: 'Password', required: true },
        { id: 'confirmPassword', type: 'password', label: 'Confirm Password', required: true },
        { id: 'major', type: 'text', label: 'Major', required: true },
        { id: 'year', type: 'select', label: 'Year', options: [
          { value: 'freshman', label: 'Freshman' },
          { value: 'sophomore', label: 'Sophomore' },
          { value: 'junior', label: 'Junior' },
          { value: 'senior', label: 'Senior' },
          { value: 'graduate', label: 'Graduate Student' },
        ], required: true },
        { id: 'interests', type: 'text', label: 'Interests (Comma separated)', required: true },
        { id: 'skills', type: 'text', label: 'Skills (Comma separated)', required: true },
        { id: 'linkedin', type: 'text', label: 'LinkedIn (link)', required: false },
        { id: 'twitter', type: 'text', label: 'X (link)', required: false },
      ]
    },
    // Step 2: What are you looking for
    {
      title: "What are you looking for?",
      description: "Select one or multiple options",
      fields: [
        { id: 'lookingFor', type: 'multiselect', label: 'I am looking for:', options: [
          { value: 'founder-looking-cofounder', label: '🔹 I\'m a Founder Looking for a Co-Founder' },
          { value: 'founder-looking-talent', label: '🔹 I\'m a Founder Looking for Talent (but not a Co-Founder)' },
          { value: 'looking-job', label: '🔹 I\'m Looking for a Startup Job/Internship' },
          { value: 'looking-resources', label: '🔹 I\'m Looking for Startup Resources & Networking' },
        ], required: true },
      ]
    },
    // Step 3: Founder Section (Conditional)
    {
      title: "Tell us about your startup",
      description: "Help us match you with the right co-founder or talent",
      fields: [
        { id: 'founderType', type: 'select', label: 'Are you looking for a co-founder or just hiring talent?', options: [
          { value: 'co-founder', label: 'Co-Founder' },
          { value: 'hiring', label: 'Hiring for Specific Roles' },
          { value: 'both', label: 'Both' },
        ], required: true },
        { id: 'startupName', type: 'text', label: 'Startup Name (if applicable)', required: false },
        { id: 'startupIdea', type: 'textarea', label: 'Briefly describe your startup idea (100 Words)', required: true },
        { id: 'rolesLookingFor', type: 'textarea', label: 'What roles are you looking for? (100 words)', required: true },
        { id: 'founderSkills', type: 'textarea', label: 'What skills do you bring? (100 words)', required: true },
        { id: 'startupStage', type: 'select', label: 'Startup Stage', options: [
          { value: 'idea', label: 'Idea' },
          { value: 'mvp', label: 'MVP' },
          { value: 'launched', label: 'Launched' },
          { value: 'scaling', label: 'Scaling' },
        ], required: true },
      ]
    },
    // Step 4: Job Section (Conditional)
    {
      title: "Tell us about your job interests",
      description: "Help us match you with the right opportunities",
      fields: [
        { id: 'interestedRoles', type: 'select', label: 'What roles are you interested in?', options: [
          { value: 'software-engineer', label: 'Software Engineer' },
          { value: 'frontend-developer', label: 'Frontend Developer' },
          { value: 'backend-developer', label: 'Backend Developer' },
          { value: 'fullstack-developer', label: 'Full-Stack Developer' },
          { value: 'mobile-developer', label: 'Mobile App Developer' },
          { value: 'data-scientist', label: 'Data Scientist' },
          { value: 'ai-ml-engineer', label: 'AI/ML Engineer' },
          { value: 'blockchain-developer', label: 'Blockchain Developer' },
          { value: 'cybersecurity', label: 'Cybersecurity Specialist' },
          { value: 'ui-ux-designer', label: 'UI/UX Designer' },
          { value: 'graphic-designer', label: 'Graphic Designer' },
          { value: 'product-manager', label: 'Product Manager' },
          { value: 'marketing-specialist', label: 'Marketing Specialist' },
          { value: 'growth-hacker', label: 'Growth Hacker' },
          { value: 'social-media-manager', label: 'Social Media Manager' },
          { value: 'content-creator', label: 'Content Creator/Copywriter' },
          { value: 'sales-business-dev', label: 'Sales & Business Development' },
          { value: 'finance-accounting', label: 'Finance & Accounting' },
          { value: 'operations-manager', label: 'Operations Manager' },
          { value: 'legal-compliance', label: 'Legal & Compliance' },
          { value: 'customer-success', label: 'Customer Success Manager' },
          { value: 'community-manager', label: 'Community Manager' },
          { value: 'hr-talent', label: 'HR & Talent Acquisition' },
          { value: 'event-coordinator', label: 'Event Coordinator' },
          { value: 'research-analyst', label: 'Research & Strategy Analyst' },
          { value: 'other', label: 'Other' },
        ], required: true },
        { id: 'experience', type: 'textarea', label: 'Experience (100 words)', required: true },
        { id: 'resume', type: 'file', label: 'Resume Upload (Optional)', required: false },
      ]
    },
    // Step 5: Additional Questions
    {
      title: "Additional Matching Questions",
      description: "Optional but recommended for better matches",
      fields: [
        { id: 'industries', type: 'textarea', label: 'What industries interest you? (100 words)', required: false },
        { id: 'commitment', type: 'select', label: 'Are you looking for short-term projects or long-term commitments?', options: [
          { value: 'short-term', label: 'Short-term projects' },
          { value: 'long-term', label: 'Long-term commitments' },
          { value: 'both', label: 'Both' },
        ], required: false },
      ]
    },
    // Step 6: Terms and Conditions
    {
      title: "Final Steps",
      description: "Complete your registration",
      fields: [
        { id: 'agreeToTerms', type: 'checkbox', label: 'I agree to the Terms of Service and Privacy Policy', required: true },
      ]
    },
  ];

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'lookingFor') {
      // Handle multiselect
      const select = e.target as HTMLSelectElement;
      const options = Array.from(select.selectedOptions).map(option => option.value);
      setFormData({ ...formData, [name]: options });
      
      // Show/hide conditional sections based on selection
      setShowFounderSection(options.some(option => 
        option === 'founder-looking-cofounder' || option === 'founder-looking-talent'
      ));
      setShowJobSection(options.includes('looking-job'));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsSubmitting(false);
      return;
    }
    
    // Validate email is a Chapman email
    if (!formData.email.endsWith('@chapman.edu')) {
      setError("Please use a Chapman University email (@chapman.edu)");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Register user with Supabase
      const { data, error: signUpError } = await signUp(formData.email, formData.password);
      
      if (signUpError) {
        throw signUpError;
      }
      
      if (data?.user) {
        // Create profile
        const interestsArray = formData.interests.split(',').map(item => item.trim());
        
        const profileData = {
          user_id: data.user.id,
          university: 'Chapman University',
          bio: `${formData.major} - ${formData.year}`,
          interests: interestsArray,
        };
        
        const { error: profileError } = await createProfile(profileData);
        
        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Continue anyway, as the user is created
        }
        
        // Automatically sign in the user
        const { error: signInError } = await signIn(formData.email, formData.password);
        
        if (signInError) {
          console.error('Error signing in after registration:', signInError);
          // Continue anyway, as the user is created
        }
        
        // Show success message
        setRegistrationSuccess(true);
        
        // Redirect to home page after a delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate to next step
  const nextStep = () => {
    // Skip founder section if not selected
    if (currentStep === 1 && !showFounderSection && formSteps[currentStep + 1].title.includes("startup")) {
      setCurrentStep(currentStep + 2);
    } 
    // Skip job section if not selected
    else if (currentStep === 2 && !showJobSection && formSteps[currentStep + 1].title.includes("job")) {
      setCurrentStep(currentStep + 2);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    // Skip founder section if not selected
    if (currentStep === 3 && !showFounderSection && formSteps[currentStep - 1].title.includes("startup")) {
      setCurrentStep(currentStep - 2);
    } 
    // Skip job section if not selected
    else if (currentStep === 4 && !showJobSection && formSteps[currentStep - 1].title.includes("job")) {
      setCurrentStep(currentStep - 2);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  // Check if current step is valid
  const isStepValid = () => {
    const currentFields = formSteps[currentStep].fields;
    return currentFields.every(field => {
      if (field.required) {
        if (field.id === 'lookingFor') {
          return (formData[field.id as keyof typeof formData] as string[]).length > 0;
        }
        return !!formData[field.id as keyof typeof formData];
      }
      return true;
    });
  };

  // Render form field based on type
  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <input
            id={field.id}
            name={field.id}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.id as keyof typeof formData] as string}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-white/30 bg-black/30 text-white rounded-md shadow-sm focus:outline-none focus:ring-white/50 focus:border-white/50"
          />
        );
      case 'select':
        return (
          <select
            id={field.id}
            name={field.id}
            required={field.required}
            value={formData[field.id as keyof typeof formData] as string}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-white/30 bg-black/30 text-white rounded-md shadow-sm focus:outline-none focus:ring-white/50 focus:border-white/50"
          >
            <option value="">Select an option</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'multiselect':
        return (
          <select
            id={field.id}
            name={field.id}
            required={field.required}
            multiple
            value={formData[field.id as keyof typeof formData] as string[]}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-white/30 bg-black/30 text-white rounded-md shadow-sm focus:outline-none focus:ring-white/50 focus:border-white/50 h-40"
          >
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            id={field.id}
            name={field.id}
            required={field.required}
            value={formData[field.id as keyof typeof formData] as string}
            onChange={handleChange}
            rows={4}
            className="appearance-none block w-full px-3 py-2 border border-white/30 bg-black/30 text-white rounded-md shadow-sm focus:outline-none focus:ring-white/50 focus:border-white/50"
          />
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              id={field.id}
              name={field.id}
              type="checkbox"
              required={field.required}
              checked={formData[field.id as keyof typeof formData] as boolean}
              onChange={handleChange}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={field.id} className="ml-2 block text-sm text-gray-200">
              {field.label}
            </label>
          </div>
        );
      case 'file':
        return (
          <input
            id={field.id}
            name={field.id}
            type="file"
            required={field.required}
            onChange={handleFileChange}
            className="appearance-none block w-full px-3 py-2 border border-white/30 bg-black/30 text-white rounded-md shadow-sm focus:outline-none focus:ring-white/50 focus:border-white/50"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Galaxy Background */}
      <img 
        src="/images/background.png"
        alt="Galaxy background"
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      />
      
      {/* Fallback color in case image fails to load */}
      <div className="fixed inset-0 bg-[#090618] -z-10" />
      
      {/* Overlay Gradient */}
      <div className="fixed inset-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-[#090618]/30 to-[#090618]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1333]/5 via-transparent to-[#1a1333]/5" />
      </div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
              opacity: particle.opacity,
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.5)'
            }}
            animate={{
              y: [0, particle.yOffset],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center min-h-screen py-12">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="sm:mx-auto sm:w-full sm:max-w-2xl px-4"
        >
          <motion.div variants={fadeIn} className="text-center mb-8">
            <Link href="/" className="inline-block text-white font-bold text-3xl mb-6">
              FounderConnect
            </Link>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
              Join the community
            </h2>
            <p className="mt-2 text-gray-300">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-white hover:text-blue-200 font-medium underline">
                Sign in
              </Link>
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.div variants={fadeIn} className="mb-8">
            <div className="w-full bg-white/10 rounded-full h-2.5">
              <div 
                className="bg-white h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / formSteps.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>Start</span>
              <span>Complete</span>
            </div>
          </motion.div>

          <motion.div 
            variants={fadeIn}
            className="bg-white/10 backdrop-blur-md py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-white/20"
          >
            {error && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-white text-sm">
                {error}
              </div>
            )}
            
            {registrationSuccess ? (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-4"
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Registration Successful!</h3>
                <p className="text-gray-300 mb-4">
                  Your account has been created successfully.
                </p>
                <p className="text-gray-400 text-sm">
                  Redirecting you to the dashboard...
                </p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {formSteps[currentStep].title}
                    </h3>
                    {formSteps[currentStep].description && (
                      <p className="text-gray-300">
                        {formSteps[currentStep].description}
                      </p>
                    )}
                  </div>

                  <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    {formSteps[currentStep].fields.map((field) => (
                      <div key={field.id}>
                        {field.type !== 'checkbox' && (
                          <label htmlFor={field.id} className="block text-sm font-medium text-gray-200 mb-1">
                            {field.label} {field.required && <span className="text-red-400">*</span>}
                          </label>
                        )}
                        <div className="mt-1">
                          {renderField(field)}
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-between pt-4">
                      {currentStep > 0 ? (
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-4 py-2 border border-white/30 rounded-md text-white hover:bg-white/10 transition-colors"
                        >
                          Back
                        </button>
                      ) : (
                        <div></div>
                      )}
                      
                      {currentStep < formSteps.length - 1 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={!isStepValid()}
                          className={`px-6 py-2 rounded-md text-black bg-white hover:bg-blue-50 transition-colors ${!isStepValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Continue
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={isSubmitting || !isStepValid()}
                          className={`px-6 py-2 rounded-md text-black bg-white hover:bg-blue-50 transition-colors ${(isSubmitting || !isStepValid()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
                        </button>
                      )}
                    </div>
                  </form>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 