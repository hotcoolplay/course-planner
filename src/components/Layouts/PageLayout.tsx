import { useState } from "react";
import { SelectedMajor, Sequence, SelectedProgram } from "@/types";
import { AddMajor } from "@/features/majors/components/AddMajor";
import { AddExtension } from "@/features/extensions/components/AddExtension";
import { startYear } from "@/utils/constants";
import { UserSettings, SequenceSelector } from "@/components/UserSettings";
import { YearLayout } from "@/components/Layouts";
import "./PageLayout.css";

export function PageLayout() {
  const [major, setMajor] = useState<SelectedMajor | null>(null);
  const [sequence, setSequence] = useState<Sequence | null>(null);
  const [extension, setExtension] = useState<SelectedProgram | null>(null);
  function sliceArray(arr: string[], index: number): string[] {
    return arr.slice(index, index + 3);
  }
  function handleMajorSelector(major: SelectedMajor | null) {
    setMajor(major);
    setSequence(major ? major.sequences[0] : null);
  }
  return (
    <>
      <div id="menu">
        <UserSettings>
          <AddMajor major={major} setMajor={handleMajorSelector} />
          {major ? (
            <>
              <AddExtension
                extensionList={major.extensions}
                extension={extension}
                setExtension={setExtension}
              />
              <SequenceSelector
                sequences={major.sequences}
                setSequence={setSequence}
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
                startYear={startYear}
                year={startYear + Math.floor(index / 3)}
                termInfo={sliceArray(sequence.sequence, index)}
              />
            ) : null
          )}
        </div>
      ) : null}
    </>
  );
}
