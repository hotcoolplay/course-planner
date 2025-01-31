import { Term, SelectedCourse, Course } from "@/types";
import { AddCourse } from "@/features/courses/components/AddCourse";
import { latestYear } from "@/utils/constants";
import { useCourses } from "@/features/courses/api/getCoursesForTerm";
import { useEffect } from "react";

type TermLayoutProps = {
  termIndex: number;
  termCourses: SelectedCourse[];
  year: number;
  termValue: string;
  loaded: boolean;
  setLoading: (index: number) => void;
  handleSelectCourse: (
    course: SelectedCourse,
    termIndex: number,
    index: number
  ) => void;
  handleDeleteCourse: (termIndex: number, index: number) => void;
  validateCourse: (course: SelectedCourse, index: number) => boolean;
};

export function TermLayout({
  termIndex,
  termCourses,
  year,
  termValue,
  loaded,
  setLoading,
  handleSelectCourse,
  handleDeleteCourse,
  validateCourse,
}: TermLayoutProps) {
  function determineTerm(index: number): Term {
    if (index % 3 === 0) return "Fall";
    else if (index % 3 === 1) return "Winter";
    else return "Spring";
  }

  const termString =
    determineTerm(termIndex).toLowerCase() +
    "-" +
    (year <= latestYear ? year : latestYear);

  let courseList: Course[] | undefined;

  useEffect(() => {
    setLoading(termIndex);
  }, [courseList]);

  courseList = useCourses(termString).data?.data;

  return loaded ? (
    <>
      <h4>{`${determineTerm(termIndex)} ${
        termValue === "Off"
          ? `(${termValue})`
          : termValue.includes("WT")
          ? `(Co-op)`
          : ""
      }`}</h4>
      {termCourses.map((item, index) => (
        <AddCourse
          key={index}
          term={termString}
          termIndex={termIndex}
          index={index}
          course={item}
          courseList={courseList}
          selectCourse={handleSelectCourse}
          deleteCourse={handleDeleteCourse}
          validCourse={validateCourse(item, termIndex)}
        />
      ))}
      <AddCourse
        term={termString}
        termIndex={termIndex}
        index={termCourses.length}
        course={null}
        courseList={courseList}
        selectCourse={handleSelectCourse}
        deleteCourse={handleDeleteCourse}
        validCourse={true}
      />
    </>
  ) : null;
}
