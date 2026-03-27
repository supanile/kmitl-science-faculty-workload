"use client";

import { Clock, MapPin, Users } from "lucide-react";

interface WorkloadCardProps {
  courseCode: string;
  courseName: string;
  time: string;
  room: string;
  studentCount: number;
}

export function WorkloadCard({
  courseCode,
  courseName,
  time,
  room,
  studentCount,
}: WorkloadCardProps) {
  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 sm:p-4 dark:border-orange-900/40 dark:bg-stone-900/30 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-orange-500 dark:border-l-orange-400" style={{
      '--color-orange-primary': '#C96442',
      '--color-dark-primary': '#292524',
      '--color-dark-secondary': '#302826',
    } as React.CSSProperties}>
      {/* Course Code */}
      <p className="text-sm sm:text-base font-extrabold text-orange-600 dark:text-orange-300 line-clamp-1">
        {courseCode}
      </p>

      {/* Divider */}
      <hr className="my-2 border-orange-200 dark:border-orange-900/30" />

      {/* Course Name */}
      <p className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-orange-50 leading-snug mb-2 sm:mb-3">
        {courseName}
      </p>

      {/* Course Details */}
      <div className="space-y-1 sm:space-y-1.5 text-gray-500 dark:text-orange-200/70">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
          <Clock className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-orange-300/60" />
          <span className="line-clamp-1">{time}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-orange-300/60" />
          <span className="line-clamp-1">{room}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
          <Users className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-orange-300/60" />
          <span className="line-clamp-1">Students : {studentCount}</span>
        </div>
      </div>
    </div>
  );
}
