import React, { useState } from "react";
import "./CourseSelect.css";
import { Term } from "../../types";
import AddCourse, { AddCourseProps } from "../AddCourse/AddCourse"
export interface SelectionMenuProps {
    level: number;
    study: boolean;
    term: Term;
    year: number;
    courseCount: number;
}

function CourseSelect(courseSelect: SelectionMenuProps) {
    const addCourseProps: AddCourseProps[] = []
    const maxCourses = courseSelect.study ? 7 : 3;
    for (let i = 0; i < maxCourses; ++i) {
        const props: AddCourseProps = { term: courseSelect.term, year: courseSelect.year }
        addCourseProps.push(props)
    }
    return (
        <div className={`select-${courseSelect.courseCount}`}>
            <h4>{courseSelect.study ? courseSelect.term : courseSelect.term + " (Co-op)"}</h4>
            {addCourseProps.map((item) => 
            <AddCourse {...item} />)}
        </div> 
    );
}

export default CourseSelect;
