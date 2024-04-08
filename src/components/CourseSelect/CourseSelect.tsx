import React, { useState } from "react";
import "./CourseSelect.css";
import { Term, Course } from "../../types";
import icon from "../../assets/rows-plus-bottom.svg";

export interface SelectionMenuProps {
    level: number;
    study: boolean;
    term: Term;
}

function CourseSelect(courseSelect: SelectionMenuProps) {
    const [visibility, setVisibility] = useState(false);
    const [selected, setSelected] = useState(0);
    let selectedCourses: Course[] = [];
    const courseSelectHandler: (course: Course) => void = (course: Course) => {
        selectedCourses.push(course);
        setSelected(selected + 1);
    } 
    const visibilityHandler: React.MouseEventHandler<HTMLButtonElement> =
        () => {
        setVisibility(!visibility);
    }
    return (
        <div id="select">
            <h4>{courseSelect.study ? courseSelect.term : courseSelect.term + " (Co-op)"}</h4>
            {selectedCourses.map((item) => (
                <button>{item.subject}</button>
            ))}
            <button id="course" onClick={visibilityHandler}>Add Course...<img src={icon} alt=""/></button>
        </div> 
    );
}

export default CourseSelect;
