import React, { useState } from "react";
import "./SequenceMenu.css";
import CourseSelect, { SelectionMenuProps } from "../CourseSelect/CourseSelect";
import { one, two, three, four } from "../../utils/constants"

function SequenceMenu() {
    const [sequence, setSequence] = useState(1);
    const sequenceSelectHandler: React.MouseEventHandler<HTMLButtonElement> = 
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setSequence(parseInt((e.target as HTMLButtonElement).value));
    } 
    function sequenceArray(): boolean[] {
        if (sequence == 1) return one;
        if (sequence == 2) return two;
        if (sequence == 3) return three;
        else return four; 
    }
    function propMaker (arr: boolean[]): SelectionMenuProps[]  {
        let propArray: SelectionMenuProps[] = [];
        let count: number = 0;
        for (var i = 0; i < arr.length; ++i) {
            let props: SelectionMenuProps = { level: count, study: arr[i], term: "Fall"};
            if (arr[i]) {
                ++count;
            }
            if (i % 3 === 0) props.term = "Fall";
            else if (i % 3 === 1) props.term = "Winter";
            else props.term = "Spring";
            propArray.push(props);
        }
        return propArray;
    }
    const selections: SelectionMenuProps[] = propMaker(sequenceArray());
    return (
        <>
            <div id="menu">
                <button value="1" className={sequence === 1 ? "sel" : "seq"} onClick={sequenceSelectHandler}>Sequence 1</button>
                <button value="2" className={sequence === 2 ? "sel" : "seq"} onClick={sequenceSelectHandler}>Sequence 2</button>
                <button value="3" className={sequence === 3 ? "sel" : "seq"} onClick={sequenceSelectHandler}>Sequence 3</button>
                <button value="4" className={sequence === 4 ? "sel" : "seq"} onClick={sequenceSelectHandler}>Sequence 4</button>
            </div>
            <div id="schedule">
                <div className="year">
                    <h3>Year 1</h3>
                    <div className="term">
                        {(selections.slice(0, 3).map((item) => (
                        <CourseSelect {...item} />
                    )))}
                    </div>
                </div>
                <div className="year">
                    <h3>Year 2</h3>
                    <div className="term">
                        {(selections.slice(3, 6).map((item) => (
                        <CourseSelect {...item} />
                    )))}
                    </div>
                </div>
                <div className="year">
                    <h3>Year 3</h3>
                    <div className="term">
                        {(selections.slice(6, 9).map((item) => (
                        <CourseSelect {...item} />
                    )))}
                    </div>
                </div>
                <div className="year">
                    <h3>Year 4</h3>
                    <div className="term">
                        {(selections.slice(9, 12).map((item) => (
                        <CourseSelect {...item} />
                    )))}
                    </div>
                </div>
                <div id={sequence == 3 ? "five" : "fivetruncated"}>
                    <h3>Year 5</h3>
                    <div className="term">
                        {(selections.slice(12, selections.length).map((item) => (
                        <CourseSelect {...item} />
                    )))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SequenceMenu;
