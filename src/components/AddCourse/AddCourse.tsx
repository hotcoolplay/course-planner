import React, { useState } from "react";
import "./AddCourse.css";
import { Term, Course } from "../../types/index";
import icon from "../../assets/rows-plus-bottom.svg";


export interface AddCourseProps  {
    visibility: boolean;
    level: number;
    term: Term;
    handler: (course: Course) => void;
}

//function AddCourse(courseProps: AddCourseProps) {
    const [openSelection, setOpenSelection] = useState(false);
    const openSidebar: React.MouseEventHandler<HTMLButtonElement> = 
        () => {
        setOpenSelection(true);
    } 
    return (
        
    );
}

//export default AddCourse;
