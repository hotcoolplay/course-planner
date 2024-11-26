import { Term, SelectedCourse } from "@/types";
import { AddCourse } from "@/features/courses/components/AddCourse";
import { useReducer } from "react";
import { latestYear } from "@/utils/constants";

type CourseListAction =
  | { type: "select"; index: number; course: SelectedCourse }
  | { type: "delete"; index: number };

function courseListReducer(
  courseList: SelectedCourse[],
  action: CourseListAction
) {
  switch (action.type) {
    case "select":
      return action.index >= courseList.length
        ? [...courseList, action.course]
        : courseList.map((item, index) => {
            if (index === action.index) return action.course;
            else return item;
          });
    default:
      return courseList.filter((_item, index) => index != action.index);
  }
}

type TermLayoutProps = {
  year: number;
  term: Term;
  termValue: string;
};

export function TermLayout({ year, term, termValue }: TermLayoutProps) {
  const [courseList, dispatch] = useReducer(courseListReducer, []);

  console.log(courseList);

  function handleSelectCourse(course: SelectedCourse, index: number) {
    console.log(
      `Course: ${course.subject + course.catalogNumber}, index: ${index}`
    );
    dispatch({
      type: "select",
      index: index,
      course: course,
    });
  }

  function handleDeleteCourse(index: number) {
    dispatch({
      type: "delete",
      index: index,
    });
  }

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
      {courseList.map((item, index) => (
        <AddCourse
          term={termString}
          index={index}
          course={item}
          selectCourse={handleSelectCourse}
          deleteCourse={handleDeleteCourse}
        />
      ))}
      <AddCourse
        term={termString}
        index={courseList.length}
        course={null}
        selectCourse={handleSelectCourse}
        deleteCourse={handleDeleteCourse}
      />
    </>
  );
}
