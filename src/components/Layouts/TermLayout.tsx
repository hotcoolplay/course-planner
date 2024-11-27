import { Term, SelectedCourse } from "@/types";
import { AddCourse } from "@/features/courses/components/AddCourse";
import { latestYear } from "@/utils/constants";

type TermLayoutProps = {
  termIndex: number;
  termCourses: SelectedCourse[];
  year: number;
  term: Term;
  termValue: string;
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
  term,
  termValue,
  handleSelectCourse,
  handleDeleteCourse,
  validateCourse,
}: TermLayoutProps) {
  const termString =
    term.toLowerCase() + "-" + (year <= latestYear ? year : latestYear);

  return (
    <>
      <h4>{`${term} ${
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
        selectCourse={handleSelectCourse}
        deleteCourse={handleDeleteCourse}
        validCourse={true}
      />
    </>
  );
}
