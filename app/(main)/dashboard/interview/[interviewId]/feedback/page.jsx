'use client';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'; // Import useState and useEffect
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner'; // Ensure you have a toast library installed (e.g., sonner)

const Feedback = ({ params }) => {
  const [feedbackList, setFeedbackList] = useState([]); // Initialize feedback list
  const [loading, setLoading] = useState(true); // Loading state for skeleton UI
  const router = useRouter(); // Next.js router for navigation

  useEffect(() => {
    const GetFeedback = async () => {
      try {
        const result = await db
          .select()
          .from(UserAnswer)
          .where(eq(UserAnswer.mockIdRef, params.interviewId))
          .orderBy(UserAnswer.id);

        setFeedbackList(result);
      } catch (error) {
        console.error('Failed to load feedback:', error);
        toast.error('Failed to load interview results'); // Show error toast
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    GetFeedback();
  }, [params.interviewId]);

  // Function to calculate the average rating
  const calculateAverageRating = () => {
    if (!feedbackList.length) return 0;

    const validRatings = feedbackList
      .map((item) => {
        const rawRating = Number(item.rating); // Get the raw rating
        let convertedRating;

        if (rawRating > 5 && rawRating <= 10) {
          // Cap rating at 10 and convert to 5-point scale
          convertedRating = Math.min(10, rawRating) / 2;
        } else if (rawRating === 5) {
          // Keep rating as 5 if it's exactly 5
          convertedRating = 5;
        } else {
          // Use the raw rating directly if it's below 5
          convertedRating = rawRating;
        }

        return !isNaN(convertedRating) && convertedRating >= 0 && convertedRating <= 5
          ? convertedRating
          : null;
      })
      .filter((rating) => rating !== null); // Filter out invalid ratings

    if (!validRatings.length) return 0;

    const total = validRatings.reduce((sum, rating) => sum + rating, 0);
    return (total / validRatings.length).toFixed(1); // Calculate and round the average
  };

  const averageRating = calculateAverageRating();

  if (loading) {
    return (
      <div className="p-6 md:p-10 text-center bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-8 w-32 mx-auto" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 text-center bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Interview Results</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">Performance Analysis</h2>

        {feedbackList.length === 0 ? (
          <div className="mt-6 p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Analysis in progress. Please check the feedback section.
            </h2>
            <Button
              className="bg-gray-900 text-white hover:bg-gray-800"
              onClick={() => router.replace('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </div>
        ) : (
          <>
            <div className="my-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="inline-flex flex-col items-center">
                <div className="text-4xl font-bold text-blue-600">
                  {averageRating}
                  <span className="text-lg text-gray-600 ml-1">/ 5</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Average score across {feedbackList.length} questions
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {feedbackList.map((item, index) => {
                // Calculate individual rating with capping
                const rawRating = Number(item.rating);
                let finalRating;

                if (rawRating > 5 && rawRating <= 10) {
                  // Cap rating at 10 and convert to 5-point scale
                  finalRating = (Math.min(10, rawRating) / 2).toFixed(1);
                } else if (rawRating === 5) {
                  // Keep rating as 5 if it's exactly 5
                  finalRating = 5;
                } else {
                  // Use the raw rating directly if it's below 5
                  finalRating = rawRating.toFixed(1);
                }

                return (
                  <Collapsible key={index} className="group">
                    <CollapsibleTrigger className="w-full p-4 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="font-medium text-gray-800">
                            Q{index + 1}. {item.question}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Your rating: {finalRating}/5
                          </div>
                        </div>
                        <ChevronsUpDown className="h-5 w-5 text-gray-500 group-data-[state=open]:rotate-180 transition-transform" />
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="mt-2">
                      <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-200">
                        <div className="p-3 bg-blue-50 rounded-md">
                          <h3 className="text-sm font-medium text-blue-800 mb-2">Your Answer</h3>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {item.userAns || "No answer recorded"}
                          </p>
                        </div>

                        <div className="p-3 bg-green-50 rounded-md">
                          <h3 className="text-sm font-medium text-green-800 mb-2">Ideal Answer</h3>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {item.correctAns || "No reference answer available"}
                          </p>
                        </div>

                        <div className="p-3 bg-purple-50 rounded-md">
                          <h3 className="text-sm font-medium text-purple-800 mb-2">Expert Feedback</h3>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {item.feedback || "No specific feedback available"}
                          </p>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Feedback;