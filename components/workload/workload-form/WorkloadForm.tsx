"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";
import { SelectGroup } from "./SelectGroup";
import { WeeklyGrid } from "./WeeklyGrid";
import { ActionButtons } from "./ActionButtons";
import { CalendarDays, BookOpenText } from "lucide-react";

interface DayColumn {
  dayCode: string;
  dayName: string;
  courses: Array<{
    id: string;
    courseCode: string;
    courseName: string;
    time: string;
    room: string;
    studentCount: number;
    status?: 'pending' | 'approved' | 'rejected' | 'draft' | 'selected';
    lectureWeeks?: number[];
    labWeeks?: number[];
  }>;
}

interface WorkloadFormProps {
  onConfirm?: () => void;
}

interface SavedCourse {
  id: string;
  courseCode: string;
  courseName: string;
  time: string;
  room: string;
  studentCount: number;
  dayOfWeek: string;
  semester: string;
  year: string;
}

export function WorkloadForm({
  onConfirm = () => console.log("Confirm clicked"),
}: WorkloadFormProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [academicYear, setAcademicYear] = useState<string>("2569");
  const [semester, setSemester] = useState<string>("1");
  const [isLoading, setIsLoading] = useState(false);

  const isTh = currentLanguage === "th";

  // Mock data for demonstration with state management
  const [columns, setColumns] = useState<DayColumn[]>([
    {
      dayCode: "sunday",
      dayName: "อาทิตย์",
      courses: [],
    },
    {
      dayCode: "monday",
      dayName: "จันทร์",
      courses: [
        {
          id: "1",
          courseCode: "05016208",
          courseName: "Data Systems Lab",
          time: "13:00 - 16:00",
          room: "Lab : A",
          studentCount: 48,
          status: "pending",
          lectureWeeks: [1, 2, 3, 4, 5],
          labWeeks: [1, 2, 3, 4, 5, 6, 7],
        },
      ],
    },
    {
      dayCode: "tuesday",
      dayName: "อังคาร",
      courses: [
        {
          id: "2",
          courseCode: "05016209",
          courseName: "Data Systems Lab",
          time: "13:00 - 16:00",
          room: "Lab : A",
          studentCount: 48,
          status: "approved",
          lectureWeeks: [1, 2, 3, 4, 5, 6, 7, 8],
          labWeeks: [1, 2, 3, 4, 5, 6, 7, 8],
        },
        {
          id: "3",
          courseCode: "CS205",
          courseName: "Web Development",
          time: "09:00 - 11:00",
          room: "Room 101",
          studentCount: 35,
          status: "rejected",
          lectureWeeks: [1, 2, 3],
          labWeeks: [],
        },
        {
          id: "4",
          courseCode: "CS206",
          courseName: "Database Management",
          time: "11:00 - 13:00",
          room: "Room 102",
          studentCount: 40,
          status: "draft",
          lectureWeeks: [],
          labWeeks: [],
        },
        {
          id: "5",
          courseCode: "CS207",
          courseName: "Software Engineering",
          time: "13:00 - 15:00",
          room: "Lab : B",
          studentCount: 32,
          status: "selected",
          lectureWeeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
          labWeeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        },
        {
          id: "6",
          courseCode: "CS208",
          courseName: "Mobile Development",
          time: "15:00 - 17:00",
          room: "Lab : C",
          studentCount: 28,
          status: "draft",
          lectureWeeks: [3, 4, 5],
          labWeeks: [3, 4, 5, 6, 7],
        },
        {
          id: "7",
          courseCode: "CS209",
          courseName: "Cloud Computing",
          time: "09:00 - 10:30",
          room: "Room 103",
          studentCount: 25,
          status: "selected",
          lectureWeeks: [6, 7, 8, 9, 10],
          labWeeks: [6, 7, 8, 9, 10, 11],
        },
        {
          id: "11",
          courseCode: "CS213",
          courseName: "Advanced Algorithms",
          time: "16:00 - 17:30",
          room: "Room 107",
          studentCount: 20,
          status: "draft",
          lectureWeeks: [],
          labWeeks: [],
        },
      ],
    },
    {
      dayCode: "wednesday",
      dayName: "พุธ",
      courses: [],
    },
    {
      dayCode: "thursday",
      dayName: "พฤหัสบดี",
      courses: [
        {
          id: "4",
          courseCode: "05016211",
          courseName: "Data Systems Lab",
          time: "13:00 - 16:00",
          room: "Lab : A",
          studentCount: 48,
          status: "draft",
          lectureWeeks: [],
          labWeeks: [],
        },
      ],
    },
    {
      dayCode: "friday",
      dayName: "ศุกร์",
      courses: [
        {
          id: "5",
          courseCode: "05016210",
          courseName: "Data Systems Lab",
          time: "13:00 - 16:00",
          room: "Lab : A",
          studentCount: 48,
          status: "selected",
          lectureWeeks: [8, 9, 10, 11, 12, 13],
          labWeeks: [8, 9, 10, 11, 12, 13, 14, 15],
        },
      ],
    },
    {
      dayCode: "saturday",
      dayName: "เสาร์",
      courses: [],
    },
  ]);

  // Load saved courses from sessionStorage when component mounts
  useEffect(() => {
    const savedCoursesStr = sessionStorage.getItem("workloadCourses");
    console.log("Checking for saved courses in sessionStorage...");
    
    if (savedCoursesStr) {
      try {
        const savedCourses: SavedCourse[] = JSON.parse(savedCoursesStr);
        console.log("✅ Loaded saved courses:", savedCourses);
        
        // Update columns with saved courses
        setColumns((prevColumns) => {
          const updatedColumns = prevColumns.map((col) => {
            const coursesToAdd = savedCourses.filter((course) => {
              const matches = course.dayOfWeek === col.dayCode;
              console.log(`Filtering course ${course.courseCode} (dayOfWeek=${course.dayOfWeek}) for ${col.dayCode}: ${matches}`);
              return matches;
            });
            
            return {
              ...col,
              courses: [
                ...col.courses,
                ...coursesToAdd,
              ],
            };
          });
          console.log("Updated columns:", updatedColumns);
          return updatedColumns;
        });
        
        // Clear saved courses after loading
        sessionStorage.removeItem("workloadCourses");
      } catch (error) {
        console.error("Failed to load saved courses:", error);
      }
    } else {
      console.log("❌ No saved courses found in sessionStorage");
    }
  }, []);

  const currentYear = 2569;
  const academicYearOptions = Array.from({ length: 6 }, (_, i) => {
    const year = currentYear + i;
    const displayYear = isTh ? year : year - 543; // Convert BE to AD for English
    return { value: year.toString(), label: `${displayYear}` };
  });

  const semesterOptions = [
    { value: "1", label: isTh ? "ภาคเรียนที่ 1" : "Semester 1" },
    { value: "2", label: isTh ? "ภาคเรียนที่ 2" : "Semester 2" },
    {
      value: "3",
      label: isTh ? "ภาคเรียนที่ 3 (ฤดูร้อน)" : "Semester 3 (Summer)",
    },
  ];

  const handleAddCourse = (dayCode: string) => {
    router.push(
      `/workload/entry?day=${dayCode}&semester=${semester}&year=${academicYear}&mode=add`,
    );
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      console.log("Confirming data:", { academicYear, semester });
      onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header — centered to match Figma */}
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#f0ebe5]">
          {t("WorkloadForm.title")}
        </h1>
        <p className="mt-1 text-base sm:text-lg text-gray-500 dark:text-[#8b7f77]">
          {t("WorkloadForm.subtitle")}
        </p>
      </div>

      {/* Selection Group — orange left border */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-[#4a4441] dark:bg-[#302826] border-l-4 border-l-orange-400 dark:border-l-[#C96442]">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
          {/* Academic Year */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-700 dark:text-[#e8e0d8]">
              <CalendarDays className="h-4 w-4 text-gray-500 dark:text-[#8b7f77]" />
              <span>{t("WorkloadForm.academicYear")}</span>
            </div>
            <SelectGroup
              label=""
              value={academicYear}
              onValueChange={setAcademicYear}
              options={academicYearOptions}
            />
          </div>

          {/* Semester */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm sm:text-base  font-medium text-gray-700 dark:text-[#e8e0d8]">
              <BookOpenText className="h-4 w-4 text-gray-500 dark:text-[#8b7f77]" />
              <span>{t("WorkloadForm.semester")}</span>
            </div>
            <SelectGroup
              label=""
              value={semester}
              onValueChange={setSemester}
              options={semesterOptions}
            />
          </div>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 sm dark:border-[#4a4441] dark:bg-[#302826]">
        <WeeklyGrid
          columns={columns}
          semesterBadge={
            isTh
              ? `เทอม ${semester}/${academicYear}`
              : `Term ${semester}/${parseInt(academicYear) - 543}`
          }
          onAddClick={handleAddCourse}
          semester={semester}
          year={academicYear}
        />
      </div>

      {/* Action Buttons */}
      <ActionButtons
        onConfirm={handleConfirm}
        isLoading={isLoading}
      />
    </div>
  );
}
