import React, { useState, useEffect } from "react";
import "./AddCourse.css";
import { Term, Course } from "../../types/index";
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCombobox } from 'downshift'
import icon from "../../assets/rows-plus-bottom.svg";
import axios from 'axios'


export interface AddCourseProps  {
    term: Term;
    year: number;
}


function AddCourse(courseProps: AddCourseProps) {
    const [courses, setCourses] = useState<Course[]>([])
    const client = axios.create({
        baseURL: import.meta.env.VITE_API_URL
    })
    useEffect(() => {
        client.get<Course[]>(`/courses/term/${courseProps.term.toLowerCase()}-${new Date().getFullYear()}`).then(
            (res) => {
                console.log(res.data)
                setCourses(res.data)
                setItems(res.data)
            })
    }, [])
    function filterCourses(input: string) {
        const lowerInput = input.toLowerCase()
        return function courseFilter(course: Course) {
            const courseString = course.subjectcode.toLowerCase() + ' ' + course.catalognumber.toLowerCase()
            return (
                !lowerInput || courseString.includes(lowerInput)
            )
        }
    }
    const [items, setItems] = useState<Course[]>([])
    const {
        isOpen,
        getToggleButtonProps,
        getLabelProps,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        getItemProps,
        selectedItem,
    } = useCombobox({
        onInputValueChange({inputValue}) {
            setItems(courses.filter(filterCourses(inputValue)))
        },
        items,
        itemToString(item) {
          return item ? item.subjectcode + ' ' + item.catalognumber : ''
        },
    })
    const parentRef = React.useRef(null)

    const rowVirtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 35,
        overscan: 5
    })
    return (
        <div className="course-container">
            <label {...getLabelProps()} />
            <div className="input-container">
                <input className="course-input" placeholder="Add Course..." {...getInputProps({type: 'text'})} />
                <button className="add-button" type="button" {...getToggleButtonProps()}><img className="add-icon" src={icon} /></button>
            </div>
            <ul {...getMenuProps({ref: parentRef})}>
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                {isOpen && rowVirtualizer.getVirtualItems().map((virtualRow) => (
                    <li
                        key={`${courseProps.term}-${courseProps.year}-${items[virtualRow.index].courseid}`}
                        {...getItemProps({
                        index: virtualRow.index,
                        item: items[virtualRow.index],
                        style: {
                            height: `${virtualRow.size}px`
                        }
                        })}
                    >
                        {`${items[virtualRow.index].subjectcode} ${items[virtualRow.index].catalognumber}`}
                    </li>
                ))}
                </div>
            </ul>
        </div>
    );
}

export default AddCourse;
