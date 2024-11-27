import { useState, useEffect } from "react";

import icon from "@/assets/plus-circle.svg";
import x from "@/assets/delete.svg";

import { Course, SelectedCourse } from "@/types/index";
import { SelectorModal } from "@/components/Modals";
import { CourseSelector } from "./CourseSelector";
import { useCourses } from "../api/getCoursesForTerm";
import { useSelectedCourse } from "../api/getSelectedCourse";
import "./AddCourse.css";

type AddCourseProps = {
  term: string;
  termIndex: number;
  index: number;
  course: SelectedCourse | null;
  selectCourse: (
    course: SelectedCourse,
    termIndex: number,
    index: number
  ) => void;
  deleteCourse: (termIndex: number, index: number) => void;
  validCourse: boolean;
};

export function AddCourse({
  term,
  termIndex,
  index,
  course,
  selectCourse,
  deleteCourse,
  validCourse,
}: AddCourseProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(course);
  function handleClick() {
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
  }

  function handleDeleteCourse() {
    setSelectedCourse(null);
    deleteCourse(termIndex, index);
  }

  const courseList = useCourses(term).data?.data;

  const id = selectedCourse ? selectedCourse.id : 0;

  const enrichedCourse = useSelectedCourse(id).data?.data;

  useEffect(() => {
    enrichedCourse ? selectCourse(enrichedCourse, termIndex, index) : null;
  }, [enrichedCourse]);

  useEffect(() => {
    setSelectedCourse(null);
  }, [index]);

  if (!courseList) return null;

  return (
    <div id="add-course-container">
      {course ? (
        <button
          aria-label="delete course"
          className="delete"
          type="button"
          onClick={handleDeleteCourse}
        >
          <img className="delete-icon" src={x} />
        </button>
      ) : null}
      <button
        aria-label="add course"
        id="add-course"
        type="button"
        onClick={handleClick}
      >
        <span className={validCourse ? "button-text" : "invalid-button-text"}>
          {course ? course.subject + course.catalogNumber : "Add Course"}
        </span>
        {!course ? <img className="add-icon" src={icon} /> : null}
      </button>
      {isModalOpen ? (
        <SelectorModal isOpen={isModalOpen} closeModal={closeModal}>
          <CourseSelector
            courseList={courseList}
            setSelectedCourse={setSelectedCourse}
            closeModal={closeModal}
          />
        </SelectorModal>
      ) : null}
    </div>
  );
}
