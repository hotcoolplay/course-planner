import { useState, useReducer, useEffect } from "react";
import {
  SelectedMajor,
  Sequence,
  SelectedProgram,
  SelectedCourse,
} from "@/types";
import { AddMajor } from "@/features/majors/components/AddMajor";
import { AddExtension } from "@/features/extensions/components/AddExtension";
import { startYear } from "@/utils/constants";
import { UserSettings, SequenceSelector } from "@/components/UserSettings";
import { YearLayout, TermLayout } from "@/components/Layouts";
import { validatePrerequisite } from "@/lib/prerequisite-validator";
import "./PageLayout.css";

type SelectedCoursesAction =
  | { type: "initialize"; sequence: Sequence }
  | { type: "select"; termIndex: number; index: number; course: SelectedCourse }
  | { type: "delete"; termIndex: number; index: number };

function selectedCoursesReducer(
  selectedCourses: { term: string; termCourses: SelectedCourse[] }[],
  action: SelectedCoursesAction
) {
  switch (action.type) {
    case "initialize":
      return action.sequence.sequence.map((item) => {
        return { term: item, termCourses: [] };
      });
    case "select":
      return selectedCourses.map((termItem, termIndex) => {
        if (termIndex === action.termIndex) {
          if (action.index >= termItem.termCourses.length) {
            return {
              term: termItem.term,
              termCourses: [...termItem.termCourses, action.course],
            };
          } else {
            return {
              term: termItem.term,
              termCourses: termItem.termCourses.map((item, index) => {
                if (index === action.index) return action.course;
                else return item;
              }),
            };
          }
        } else return termItem;
      });
    default:
      return selectedCourses.map((termItem, termIndex) => {
        if (termIndex === action.termIndex) {
          return {
            term: termItem.term,
            termCourses: termItem.termCourses.filter(
              (_item, index) => index != action.index
            ),
          };
        } else return termItem;
      });
  }
}

export function PageLayout() {
  const [selectedCourses, dispatch] = useReducer(selectedCoursesReducer, []);
  const [major, setMajor] = useState<SelectedMajor | null>(null);
  const [sequence, setSequence] = useState<Sequence | null>(null);
  const [extension, setExtension] = useState<SelectedProgram | null>(null);
  const [loadArray, setLoadArray] = useState<boolean[]>([]);
  const [loaded, setLoaded] = useState(false);

  function sliceArray(arr: string[], index: number): string[] {
    return arr.slice(index, index + 3);
  }

  function handleInitializeCourses(sequence: Sequence) {
    dispatch({
      type: "initialize",
      sequence: sequence,
    });
  }

  function handleSelectCourse(
    course: SelectedCourse,
    termIndex: number,
    index: number
  ) {
    dispatch({
      type: "select",
      termIndex: termIndex,
      index: index,
      course: course,
    });
  }

  function handleDeleteCourse(termIndex: number, index: number) {
    dispatch({
      type: "delete",
      termIndex: termIndex,
      index: index,
    });
  }

  function handleSelectMajor(major: SelectedMajor | null) {
    setMajor(major);
    handleSelectSequence(major ? major.sequences[0] : null);
  }

  function handleSelectSequence(sequence: Sequence | null) {
    setSequence(sequence);
    if (sequence) {
      handleInitializeCourses(sequence);
      setLoadArray(new Array(sequence.sequence.length).fill(false));
    }
  }

  function handleLoading(index: number) {
    setLoadArray((arr) =>
      arr.map((item, ind) => (ind === index ? true : item))
    );
  }

  function validateCoursePrerequisites(course: SelectedCourse, index: number) {
    for (const prerequisite of course.prerequisites) {
      if (
        !validatePrerequisite(
          prerequisite,
          selectedCourses!,
          extension ? [major!, extension] : [major!],
          100,
          100,
          index
        )
      ) {
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    let allTermsLoaded = true;
    for (const term of loadArray) if (!term) allTermsLoaded = false;
    if (allTermsLoaded) setLoaded(true);
  }, [loadArray]);

  return (
    <>
      <div id="menu">
        <UserSettings>
          <AddMajor major={major} setMajor={handleSelectMajor} />
          {major ? (
            <>
              <AddExtension
                extensionList={major.extensions}
                extension={extension}
                setExtension={setExtension}
              />
              <SequenceSelector
                sequences={major.sequences}
                setSequence={handleSelectSequence}
              />
            </>
          ) : (
            <></>
          )}
        </UserSettings>
      </div>
      {sequence ? (
        <div id="layout">
          {sequence.sequence.map((_item, index) =>
            index % 3 === 0 ? (
              <YearLayout
                key={10 * index}
                startYear={startYear}
                year={startYear + Math.floor(index / 3)}
                termInfo={sliceArray(sequence.sequence, index)}
              >
                {sliceArray(sequence.sequence, index).map((item, termIndex) => (
                  <div
                    key={termIndex}
                    className={`terms-${
                      sliceArray(sequence.sequence, index).length
                    }`}
                  >
                    <TermLayout
                      termIndex={index + termIndex}
                      termCourses={
                        selectedCourses[index + termIndex].termCourses
                      }
                      year={
                        startYear +
                        Math.floor(index / 3) +
                        Math.floor((termIndex + 2) / 3)
                      }
                      termValue={item}
                      loaded={loaded}
                      setLoading={handleLoading}
                      handleSelectCourse={handleSelectCourse}
                      handleDeleteCourse={handleDeleteCourse}
                      validateCourse={validateCoursePrerequisites}
                    />
                  </div>
                ))}
              </YearLayout>
            ) : null
          )}
        </div>
      ) : null}
    </>
  );
}
