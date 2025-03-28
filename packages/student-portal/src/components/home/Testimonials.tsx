import React from 'react';
import { Users } from 'lucide-react';

export function Testimonials() {
  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            What Parents Are Saying
          </h2>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <TestimonialCard
            quote="This platform made the entire application process manageable. The weekly tasks and reminders kept us on track, and my daughter got into her top-choice school!"
            author="Sarah M."
            role="Parent of 7th Grader"
          />
          <TestimonialCard
            quote="The resource library and practice materials were invaluable. Having everything organized in one place reduced our stress significantly."
            author="Michael R."
            role="Parent of 6th Grader"
          />
          <TestimonialCard
            quote="The progress tracking and success metrics helped us understand exactly where we stood in the process. Highly recommend for any family applying to private schools."
            author="Jennifer L."
            role="Parent of 8th Grader"
          />
        </div>
      </div>
    </div>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <p className="text-gray-600 mb-4">{quote}</p>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Users className="h-10 w-10 text-blue-600" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}