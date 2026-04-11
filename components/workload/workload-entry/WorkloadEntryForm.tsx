"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Trash2, Save } from "lucide-react";
import { ConfirmationDialog } from "@/components/alerts/ConfirmationDialog";
import { CourseInfoSection } from "./CourseInfoSection";
import { TeachingInfoSection } from "./TeachingInfoSection";
import { StudentTypeSection } from "./StudentTypeSection";
import {
  TeachingWeeksSection,
  buildDefaultWeeks,
} from "./TeachingWeeksSection";
import type { WeekEntry } from "./TeachingWeeksSection";
import { AdditionalSection } from "./AdditionalSection";

interface TimeRange {
  start: string;
  end: string;
}

interface EntryFormData {
  courseCode: string;
  courseName: string;
  creditUnits: number | null;
  degreeLevel: string;
  lectureTime: TimeRange;
  labTime: TimeRange;
  faculty: string;
  major: string;
  year: string;
  studyGroup: string;
  enrolledStudents: string;
  weeklyStudents: string;
  lectureWeeks: WeekEntry[];
  labWeeks: WeekEntry[];
  attachedFile: File | null;
  notes: string;
  dayOfWeek?: string; // e.g., "monday", "wednesday"
}

const DAY_NAMES_TH: Record<string, string> = {
  sunday: "อาทิตย์",
  monday: "จันทร์",
  tuesday: "อังคาร",
  wednesday: "พุธ",
  thursday: "พฤหัสบดี",
  friday: "ศุกร์",
  saturday: "เสาร์",
};

const DAY_NAMES_EN: Record<string, string> = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

const MOCK_LECTURE_LOCKED = [
  { weekNumber: 1, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 2, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 10, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 11, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 12, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 13, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 14, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 15, lockedByName: "รศ.ดร.สมชาย" },
];

const MOCK_LAB_LOCKED = [
  { weekNumber: 1, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 2, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 10, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 11, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 12, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 13, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 14, lockedByName: "รศ.ดร.สมชาย" },
  { weekNumber: 15, lockedByName: "รศ.ดร.สมชาย" },
];

const TOTAL_WEEKS = 15;

export function WorkloadEntryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentLanguage } = useLanguage();
  const isTh = currentLanguage === "th";

  const semester = searchParams.get("semester") || "1";
  const year = searchParams.get("year") || "2568";
  const dayCode = searchParams.get("day") || "";
  const mode = searchParams.get("mode") || "add"; // "add" or "edit"

  const dayNameTh = dayCode ? (DAY_NAMES_TH[dayCode] ?? dayCode) : null;
  const dayNameEn = dayCode ? (DAY_NAMES_EN[dayCode] ?? dayCode) : null;

  const subtitleTh = dayNameTh
    ? `วัน${dayNameTh} ปีการศึกษา ${year} ภาคเรียนที่ ${semester}`
    : `ปีการศึกษา ${year} ภาคเรียนที่ ${semester}`;

  const subtitleEn = dayNameEn
    ? `${dayNameEn}, Academic Year ${parseInt(year) - 543}, Semester ${semester}`
    : `Academic Year ${parseInt(year) - 543}, Semester ${semester}`;

  const isEditMode = mode === "edit";
  const pageTitle = isTh 
    ? (isEditMode ? "แก้ไขข้อมูลการสอน" : "เพิ่มข้อมูลการสอน")
    : (isEditMode ? "Edit Teaching Assignment" : "Add Teaching Assignment");

  const [formData, setFormData] = useState<EntryFormData>({
    courseCode: "",
    courseName: "",
    creditUnits: null,
    degreeLevel: "bachelor_regular",
    lectureTime: { start: "", end: "" },
    labTime: { start: "", end: "" },
    faculty: "",
    major: "",
    year: "",
    studyGroup: "",
    enrolledStudents: "",
    weeklyStudents: "",
    lectureWeeks: buildDefaultWeeks(TOTAL_WEEKS, MOCK_LECTURE_LOCKED),
    labWeeks: buildDefaultWeeks(TOTAL_WEEKS, MOCK_LAB_LOCKED),
    attachedFile: null,
    notes: "",
    dayOfWeek: dayCode || undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // โหลดข้อมูลจาก sessionStorage เมื่อกลับมาแก้ไข
  useEffect(() => {
    const storedData = sessionStorage.getItem("workloadEntryData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        
        // Restore lectureWeeks while preserving lock information
        const defaultLectureWeeks = buildDefaultWeeks(TOTAL_WEEKS, MOCK_LECTURE_LOCKED);
        const restoredLectureWeeks = parsed.lectureWeeks
          ? parsed.lectureWeeks.map((week: WeekEntry) => {
              const lockedInfo = MOCK_LECTURE_LOCKED.find(
                (l) => l.weekNumber === week.weekNumber,
              );
              return {
                ...week,
                isLockedByOther: !!lockedInfo,
                lockedByName: lockedInfo?.lockedByName,
              };
            })
          : defaultLectureWeeks;

        // Restore labWeeks while preserving lock information
        const defaultLabWeeks = buildDefaultWeeks(TOTAL_WEEKS, MOCK_LAB_LOCKED);
        const restoredLabWeeks = parsed.labWeeks
          ? parsed.labWeeks.map((week: WeekEntry) => {
              const lockedInfo = MOCK_LAB_LOCKED.find(
                (l) => l.weekNumber === week.weekNumber,
              );
              return {
                ...week,
                isLockedByOther: !!lockedInfo,
                lockedByName: lockedInfo?.lockedByName,
              };
            })
          : defaultLabWeeks;

        setFormData((prev) => ({
          ...prev,
          courseCode: parsed.courseCode || "",
          courseName: parsed.courseName || "",
          creditUnits: parsed.creditUnits || null,
          degreeLevel: parsed.degreeLevel || "bachelor_regular",
          lectureTime: parsed.lectureTime || { start: "", end: "" },
          labTime: parsed.labTime || { start: "", end: "" },
          faculty: parsed.faculty || "",
          major: parsed.major || "",
          year: parsed.year || "",
          studyGroup: parsed.studyGroup || "",
          enrolledStudents: parsed.enrolledStudents || "",
          weeklyStudents: parsed.weeklyStudents || "",
          lectureWeeks: restoredLectureWeeks,
          labWeeks: restoredLabWeeks,
          notes: parsed.notes || "",
          dayOfWeek: dayCode || parsed.dayOfWeek || prev.dayOfWeek,
          // attachedFile ไม่สามารถ restore ได้จาก JSON
          // แต่เราจะเก็บชื่อไฟล์ไว้ให้ผู้ใช้เห็นได้ว่ามีไฟล์แนบไว้
        }));
        // เก็บชื่อไฟล์เดิม
        if (parsed.attachedFileName) {
          setAttachedFileName(parsed.attachedFileName);
        }
      } catch (error) {
        console.error("Failed to restore form data:", error);
      }
    }
  }, [dayCode]);

  const update = <K extends keyof EntryFormData>(
    key: K,
    value: EntryFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field when user edits it
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // ── Clear errors when user changes teaching weeks ──
  const handleLectureWeeksChange = (w: WeekEntry[]) => {
    setFormData((prev) => ({ ...prev, lectureWeeks: w }));
    if (errors.lectureWeeks) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.lectureWeeks;
        return next;
      });
    }
  };

  const handleLabWeeksChange = (w: WeekEntry[]) => {
    setFormData((prev) => ({ ...prev, labWeeks: w }));
    if (errors.labWeeks) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.labWeeks;
        return next;
      });
    }
  };

  // ── Handlers for nested time fields (clear per-subfield errors) ──
  const handleLectureTimeChange = (t: TimeRange) => {
    setFormData((prev) => ({ ...prev, lectureTime: t }));
    setErrors((prev) => {
      const next = { ...prev };
      if (t.start) delete next.lectureTimeStart;
      if (t.end) delete next.lectureTimeEnd;
      return next;
    });
  };

  const handleLabTimeChange = (t: TimeRange) => {
    setFormData((prev) => ({ ...prev, labTime: t }));
    setErrors((prev) => {
      const next = { ...prev };
      if (t.start) delete next.labTimeStart;
      if (t.end) delete next.labTimeEnd;
      return next;
    });
  };

  const mockCourseSearch = (
    code: string,
  ): Promise<{
    name: string;
    credits: number;
    faculty: string;
    major: string;
    year: string;
    studyGroup: string;
    enrolledStudents: number;
    weeklyStudents: number;
  } | null> =>
    new Promise((resolve) =>
      setTimeout(() => {
      const db: Record<
        string,
        {
          name: string;
          credits: number;
          faculty: string;
          major: string;
          year: string;
          studyGroup: string;
          enrolledStudents: number;
          weeklyStudents: number;
        }
      > = {
          "05016202": {
            name: "Data Systems Lab",
            credits: 3,
            faculty: "science",
            major: "cs",
            year: "2",
            studyGroup: "a",
            enrolledStudents: 67,
            weeklyStudents: 60,
          },
          "05016203": {
            name: "Web Development",
            credits: 4,
            faculty: "science",
            major: "cs",
            year: "3",
            studyGroup: "b",
            enrolledStudents: 45,
            weeklyStudents: 40,
          },
          "05016204": {
            name: "Database Management",
            credits: 3,
            faculty: "science",
            major: "cs",
            year: "2",
            studyGroup: "c",
            enrolledStudents: 55,
            weeklyStudents: 50,
          },
          "03011401": {
            name: "System Analyst (SA)",
            credits: 3,
            faculty: "engineering",
            major: "it",
            year: "4",
            studyGroup: "d",
            enrolledStudents: 30,
            weeklyStudents: 28,
          },
          "01010101": {
            name: "Calculus I",
            credits: 4,
            faculty: "science",
            major: "am",
            year: "1",
            studyGroup: "a",
            enrolledStudents: 80,
            weeklyStudents: 75,
          },
          "01010102": {
            name: "Linear Algebra",
            credits: 3,
            faculty: "science",
            major: "am",
            year: "1",
            studyGroup: "b",
            enrolledStudents: 78,
            weeklyStudents: 72,
          },
          "01010201": {
            name: "Differential Equations",
            credits: 4,
            faculty: "science",
            major: "am",
            year: "2",
            studyGroup: "a",
            enrolledStudents: 65,
            weeklyStudents: 60,
          },
          "01010202": {
            name: "Numerical Analysis",
            credits: 3,
            faculty: "science",
            major: "am",
            year: "2",
            studyGroup: "c",
            enrolledStudents: 55,
            weeklyStudents: 50,
          },
          "01010301": {
            name: "Real Analysis",
            credits: 4,
            faculty: "science",
            major: "am",
            year: "3",
            studyGroup: "b",
            enrolledStudents: 40,
            weeklyStudents: 38,
          },
          "01010302": {
            name: "Abstract Algebra",
            credits: 4,
            faculty: "science",
            major: "am",
            year: "3",
            studyGroup: "d",
            enrolledStudents: 42,
            weeklyStudents: 40,
          },
          "01010401": {
            name: "Functional Analysis",
            credits: 3,
            faculty: "science",
            major: "am",
            year: "4",
            studyGroup: "a",
            enrolledStudents: 25,
            weeklyStudents: 24,
          },
          "01010402": {
            name: "Topology",
            credits: 3,
            faculty: "science",
            major: "am",
            year: "4",
            studyGroup: "b",
            enrolledStudents: 28,
            weeklyStudents: 26,
          },
        };
        resolve(db[code.toUpperCase()] ?? null);
      }, 500),
    );

  const handleCourseSearch = async () => {
    if (!formData.courseCode) {
      setErrors({
        courseCode: isTh ? "กรุณาใส่รหัสวิชา" : "Please enter course code",
      });
      return;
    }
    setIsSearching(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.courseCode;
      delete next.courseName;
      return next;
    });
    try {
      const result = await mockCourseSearch(formData.courseCode);
      if (result) {
        setFormData((prev) => ({
          ...prev,
          courseName: result.name,
          creditUnits: result.credits,
          faculty: result.faculty,
          major: result.major,
          year: result.year,
          studyGroup: result.studyGroup,
          enrolledStudents: result.enrolledStudents.toString(),
          weeklyStudents: result.weeklyStudents.toString(),
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          courseCode: isTh ? "ไม่พบรหัสวิชานี้ในระบบ" : "Course not found",
        }));
        setFormData((prev) => ({ ...prev, courseName: "", creditUnits: null }));
      }
    } finally {
      setIsSearching(false);
    }
  };

  // ── Validation ─────────────────────────────────────────────
  const validateForm = (): boolean => {
    const e: Record<string, string> = {};

    if (!formData.courseCode)
      e.courseCode = isTh
        ? "รหัสวิชา: จำเป็นต้องระบุ"
        : "Course Code: Required";

    // ── Teaching weeks: at least 1 week with isSelected OR hasSpecialLecturer (excluding locked) ──
    const selectableLectureWeeks = formData.lectureWeeks.filter(
      (w) => !w.isLockedByOther,
    );
    const hasLectureWeek = selectableLectureWeeks.some(
      (w) => w.isSelected || w.hasSpecialLecturer,
    );
    if (!hasLectureWeek)
      e.lectureWeeks = isTh
        ? "สัปดาห์ที่สอน (ทฤษฎี): กรุณาเลือกสัปดาห์หรือมีวิทยากรพิเศษอย่างน้อย 1 สัปดาห์"
        : "Lecture Weeks: Please select a week or mark special lecturer for at least 1 week";

    const selectableLabWeeks = formData.labWeeks.filter(
      (w) => !w.isLockedByOther,
    );
    const hasLabWeek = selectableLabWeeks.some(
      (w) => w.isSelected || w.hasSpecialLecturer,
    );
    if (!hasLabWeek)
      e.labWeeks = isTh
        ? "สัปดาห์ที่สอน (ปฏิบัติ): กรุณาเลือกสัปดาห์หรือมีวิทยากรพิเศษอย่างน้อย 1 สัปดาห์"
        : "Lab Weeks: Please select a week or mark special lecturer for at least 1 week";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCancel = () =>
    setShowDeleteDialog(true);

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      // ลบข้อมูลทั้งหมดจาก sessionStorage
      sessionStorage.removeItem("workloadEntryData");
      sessionStorage.removeItem("workloadEntryFile");
      
      // ไปหน้า workload form (ข้อมูลภาระงาน)
      router.push(`/workload/form?semester=${semester}&year=${year}`);
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // Store form data WITHOUT file data to avoid localStorage quota exceeded
      const serializable = {
        ...formData,
        attachedFile: undefined, // File ไม่ serialize ได้
        attachedFileName: formData.attachedFile?.name ?? null, // เก็บแค่ชื่อ
        attachedFileData: undefined, // Don't store base64 to avoid quota issues
        academicYear: year,
        semester: semester,
      };
      sessionStorage.setItem("workloadEntryData", JSON.stringify(serializable));
      
      // Store file separately in sessionStorage with key to avoid quota issues
      if (formData.attachedFile) {
        try {
          const reader = new FileReader();
          await new Promise<void>((resolve) => {
            reader.onload = (e) => {
              const base64 = e.target?.result as string;
              try {
                sessionStorage.setItem("workloadEntryFile", base64);
                resolve();
              } catch (error) {
                // If file storage fails, continue anyway - user can re-upload
                console.warn("Could not store file in sessionStorage:", error);
                resolve();
              }
            };
            reader.readAsDataURL(formData.attachedFile!);
          });
        } catch (error) {
          console.warn("Error storing file:", error);
          // Continue without file - it's not critical for preview
        }
      }
      
      router.push(`/workload/check?semester=${semester}&year=${year}${dayCode ? `&day=${dayCode}` : ""}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#f0ebe5]">
          {pageTitle}
        </h1>
        <p className="mt-1 text-base sm:text-lg text-gray-500 dark:text-[#8b7f77]">
          {isTh ? subtitleTh : subtitleEn}
        </p>
      </div>

      <div className="w-full space-y-4 sm:space-y-5">
        {/* ── 1. Course Info ── */}
        <CourseInfoSection
          courseCode={formData.courseCode}
          onCourseCodeChange={(v) => update("courseCode", v)}
          onSearch={handleCourseSearch}
          courseName={formData.courseName}
          creditUnits={formData.creditUnits}
          isSearching={isSearching}
          errors={errors}
        />

        {/* ── 2. Student Type ── */}
        <StudentTypeSection
          faculty={formData.faculty}
          major={formData.major}
          year={formData.year}
          studyGroup={formData.studyGroup}
          enrolledStudents={formData.enrolledStudents}
          onFacultyChange={(v) => update("faculty", v)}
          onMajorChange={(v) => update("major", v)}
          onYearChange={(v) => update("year", v)}
          onStudyGroupChange={(v) => update("studyGroup", v)}
          onEnrolledStudentsChange={(v) => update("enrolledStudents", v)}
          disableStudentFields={!!formData.courseName}
        />

        {/* ── 3. Teaching Info ── */}
        <TeachingInfoSection
          degreeLevel={formData.degreeLevel}
          onDegreeLevelChange={(v) => update("degreeLevel", v)}
          lectureTime={formData.lectureTime}
          onLectureTimeChange={handleLectureTimeChange}
          labTime={formData.labTime}
          onLabTimeChange={handleLabTimeChange}
          errors={errors}
        />

        {/* ── 4. Teaching Weeks — Lecture ── */}
        <TeachingWeeksSection
          type="lecture"
          weeks={formData.lectureWeeks}
          onWeeksChange={handleLectureWeeksChange}
          hasError={!!errors.lectureWeeks}
          errorMessage={errors.lectureWeeks}
        />

        {/* ── 5. Teaching Weeks — Lab ── */}
        <TeachingWeeksSection
          type="lab"
          weeks={formData.labWeeks}
          onWeeksChange={handleLabWeeksChange}
          hasError={!!errors.labWeeks}
          errorMessage={errors.labWeeks}
        />

        {/* ── 6. Additional ── */}
        <AdditionalSection
          attachedFile={formData.attachedFile}
          onFileChange={(f) => {
            update("attachedFile", f);
            // ลบชื่อไฟล์เดิมเมื่อ upload ไฟล์ใหม่
            if (f) {
              setAttachedFileName(null);
            } else {
              // ลบชื่อไฟล์เดิมเมื่อกดปุ่มลบ
              setAttachedFileName(null);
            }
          }}
          attachedFileName={attachedFileName}
          notes={formData.notes}
          onNotesChange={(v) => update("notes", v)}
        />

        {/* ── Validation Errors Summary ── */}
        {Object.keys(errors).length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-900/20">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
              {isTh
                ? "กรุณาแก้ไขข้อผิดพลาดต่อไปนี้:"
                : "Please fix the following errors:"}
            </p>
            <ul className="list-inside list-disc space-y-0.5 text-sm text-red-600 dark:text-red-400">
              {Object.values(errors)
                .filter((err) => err.trim() !== "")
                .map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
            </ul>
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2 sm:pt-3">
          <Button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className={`flex-1 h-10 sm:h-12 rounded-full font-semibold text-sm sm:text-base gap-2 cursor-pointer transition-colors ${
              isEditMode
                ? "bg-red-200 hover:bg-red-300 disabled:bg-red-100 text-red-800 dark:bg-red-900/40 dark:hover:bg-red-900/60 dark:disabled:bg-red-900/20 dark:text-red-400"
                : "bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 dark:bg-[#4a4441] dark:hover:bg-[#5a5350] dark:disabled:bg-[#3d3533] dark:text-[#f0ebe5]"
            }`}
          >
            {isEditMode ? (
              <>
                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{isTh ? "ลบวิชา" : "Delete"}</span>
              </>
            ) : (
              <>
                <span>✕</span>
                <span>{isTh ? "ยกเลิก" : "Cancel"}</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 h-10 sm:h-12 rounded-full bg-[#F27F0D] hover:bg-[#E06C00] disabled:bg-gray-400 text-white font-semibold text-sm sm:text-base gap-2 dark:bg-[#C96442] dark:hover:bg-[#B5563A] dark:disabled:bg-[#4a4441] cursor-pointer transition-colors"
          >
            <Save className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>
              {isLoading
                ? isTh
                  ? "กำลังบันทึก..."
                  : "Saving..."
                : isTh
                  ? "บันทึกข้อมูล"
                  : "Save"}
            </span>
          </Button>
        </div>
      </div>

      {/* ── Confirmation Dialog for Delete/Cancel ── */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title={isEditMode 
          ? (isTh ? "ยืนยันการลบวิชา" : "Confirm Delete")
          : (isTh ? "ยืนยันการยกเลิก" : "Confirm Cancel")
        }
        description={isEditMode
          ? (isTh 
            ? "คุณแน่ใจที่จะลบวิชานี้หรือไม่? ข้อมูลทั้งหมดจะถูกลบและไม่สามารถกู้คืนได้"
            : "Are you sure you want to delete this course? All data will be deleted and cannot be recovered.")
          : (isTh 
            ? "คุณแน่ใจที่จะยกเลิกการเพิ่มวิชาใหม่หรือไม่? ข้อมูลที่กรอกจะถูกลบทั้งหมด"
            : "Are you sure you want to cancel adding a new course? All entered data will be deleted.")
        }
        confirmText={isEditMode ? (isTh ? "ยืนยันการลบ" : "Delete") : (isTh ? "ยืนยันการยกเลิก" : "Cancel")}
        cancelText={isTh ? "กลับไป" : "Go Back"}
        variant={isEditMode ? "error" : "warning"}
        isLoading={isLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
