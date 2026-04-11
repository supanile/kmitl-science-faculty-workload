"use client";

import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";

interface StudentTypeSectionProps {
  faculty: string;
  major: string;
  year: string;
  studyGroup: string;
  enrolledStudents: string;
  onFacultyChange?: (value: string) => void;
  onMajorChange?: (value: string) => void;
  onYearChange?: (value: string) => void;
  onStudyGroupChange?: (value: string) => void;
  onEnrolledStudentsChange?: (value: string) => void;
  disableStudentFields?: boolean; // เมื่อกรอกอัตโนมัติจากการค้นหา
}

export function StudentTypeSection({
  faculty,
  major,
  year,
  studyGroup,
  enrolledStudents,
  onFacultyChange,
  onMajorChange,
  onYearChange,
  onStudyGroupChange,
  onEnrolledStudentsChange,
  disableStudentFields = false,
}: StudentTypeSectionProps) {
  const { t } = useTranslation();

  const faculties = [
    { value: "science", label: t("WorkloadEntry.facultyScience") },
    { value: "engineering", label: t("WorkloadEntry.facultyEngineering") },
    { value: "business", label: t("WorkloadEntry.facultyBusiness") },
  ];

  const majors = [
    { value: "cs", label: t("WorkloadEntry.computerScience") },
    { value: "it", label: t("WorkloadEntry.informationTechnology") },
    { value: "ds", label: t("WorkloadEntry.dataScience") },
    { value: "am", label: t("WorkloadEntry.appliedMathematics") },
  ];

  const years = [
    { value: "1", label: t("WorkloadEntry.year1") },
    { value: "2", label: t("WorkloadEntry.year2") },
    { value: "3", label: t("WorkloadEntry.year3") },
    { value: "4", label: t("WorkloadEntry.year4") },
  ];

  const groups = [
    { value: "a", label: t("WorkloadEntry.group1") },
    { value: "b", label: t("WorkloadEntry.group2") },
    { value: "c", label: t("WorkloadEntry.group3") },
    { value: "d", label: t("WorkloadEntry.group4") },
  ];

  const getFacultyLabel = (value: string) =>
    faculties.find((f) => f.value === value)?.label || "-";
  const getMajorLabel = (value: string) =>
    majors.find((m) => m.value === value)?.label || "-";
  const getYearLabel = (value: string) =>
    years.find((y) => y.value === value)?.label || "-";
  const getGroupLabel = (value: string) =>
    groups.find((g) => g.value === value)?.label || "-";

  // ตรวจสอบว่ามี onChange handler ไหม - ถ้ามี = editable, ถ้าไม่มี = readonly
  const isEditable = !!(onFacultyChange || onMajorChange || onYearChange || onStudyGroupChange);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 dark:border-[#4a4441] dark:bg-[#302826] border-l-4 border-l-orange-400 dark:border-l-[#C96442]">
      {/* Section Header */}
      <div className="mb-4 sm:mb-5 pb-3 sm:pb-4 border-b-2 border-[#F27F0D] dark:border-[#C96442]">
        <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-[#f0ebe5]">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-orange-100 dark:bg-[#C96442]/20 text-orange-600 dark:text-[#C96442]">
            <Users className="h-4 w-4" />
          </span>
          {t("WorkloadEntry.studentType")}
        </h2>
      </div>

      {/* Display-only Grid: 3 columns on top */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5">
        {/* Faculty */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-sm sm:text-base font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.faculty")}
          </Label>
          {isEditable && !disableStudentFields ? (
            <select
              value={faculty}
              onChange={(e) => onFacultyChange?.(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-700 h-10 sm:h-11 outline-none transition-colors hover:border-orange-300 focus:border-orange-500 dark:border-[#4a4441] dark:bg-[#3d3533] dark:text-[#e8e0d8] dark:hover:border-[#C96442]/60 dark:focus:border-[#C96442]"
            >
              <option value="">เลือกคณะ</option>
              {faculties.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          ) : (
            <div className="px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-gray-700 dark:border-[#4a4441] dark:bg-[#3d3533] dark:text-[#e8e0d8] h-10 sm:h-11 flex items-center">
              {faculty ? getFacultyLabel(faculty) : ""}
            </div>
          )}
        </div>

        {/* Major */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-sm sm:text-base font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.major")}
          </Label>
          {isEditable && !disableStudentFields ? (
            <select
              value={major}
              onChange={(e) => onMajorChange?.(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-700 h-10 sm:h-11 outline-none transition-colors hover:border-orange-300 focus:border-orange-500 dark:border-[#4a4441] dark:bg-[#3d3533] dark:text-[#e8e0d8] dark:hover:border-[#C96442]/60 dark:focus:border-[#C96442]"
            >
              <option value="">เลือกสาขาวิชา</option>
              {majors.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          ) : (
            <div className="px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-gray-700 dark:border-[#4a4441] dark:bg-[#3d3533] dark:text-[#e8e0d8] h-10 sm:h-11 flex items-center">
              {major ? getMajorLabel(major) : ""}
            </div>
          )}
        </div>

        {/* Year */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-sm sm:text-base font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.year")}
          </Label>
          {isEditable && !disableStudentFields ? (
            <select
              value={year}
              onChange={(e) => onYearChange?.(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-700 h-10 sm:h-11 outline-none transition-colors hover:border-orange-300 focus:border-orange-500 dark:border-[#4a4441] dark:bg-[#3d3533] dark:text-[#e8e0d8] dark:hover:border-[#C96442]/60 dark:focus:border-[#C96442]"
            >
              <option value="">เลือกชั้นปี</option>
              {years.map((y) => (
                <option key={y.value} value={y.value}>
                  {y.label}
                </option>
              ))}
            </select>
          ) : (
            <div className="px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-gray-700 dark:border-[#4a4441] dark:bg-[#3d3533] dark:text-[#e8e0d8] h-10 sm:h-11 flex items-center">
              {year ? getYearLabel(year) : ""}
            </div>
          )}
        </div>
      </div>

      {/* Display-only Grid: 2 columns on bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Group */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-sm sm:text-base font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.studyGroup")}
          </Label>
          {isEditable && !disableStudentFields ? (
            <select
              value={studyGroup}
              onChange={(e) => onStudyGroupChange?.(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-700 h-10 sm:h-11 outline-none transition-colors hover:border-orange-300 focus:border-orange-500 dark:border-[#4a4441] dark:bg-[#3d3533] dark:text-[#e8e0d8] dark:hover:border-[#C96442]/60 dark:focus:border-[#C96442]"
            >
              <option value="">เลือกกลุ่มเรียน</option>
              {groups.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          ) : (
            <div className="px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-gray-700 dark:border-[#4a4441] dark:bg-[#3d3533] dark:text-[#e8e0d8] h-10 sm:h-11 flex items-center">
              {studyGroup ? getGroupLabel(studyGroup) : ""}
            </div>
          )}
        </div>

        {/* Enrolled Students */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-sm sm:text-base font-medium text-gray-700 dark:text-[#e8e0d8]">
            {t("WorkloadEntry.enrolledStudents")}
          </Label>
          {isEditable && !disableStudentFields ? (
            <input
              type="number"
              value={enrolledStudents}
              onChange={(e) => onEnrolledStudentsChange?.(e.target.value)}
              placeholder="0"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-700 h-10 sm:h-11 outline-none transition-colors hover:border-orange-300 focus:border-orange-500 dark:border-[#4a4441] dark:bg-[#3d3533] dark:text-[#e8e0d8] dark:hover:border-[#C96442]/60 dark:focus:border-[#C96442]"
            />
          ) : (
            <div className="px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-gray-700 dark:border-[#4a4441] dark:bg-[#3d3533] dark:text-[#e8e0d8] h-10 sm:h-11 flex items-center">
              {enrolledStudents || ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}