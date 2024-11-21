import "./App.css";
import {
  UserSettings,
  MajorSelector,
  SequenceSelector,
  ExtensionSelector,
  YearSelector,
} from "@/components/UserSettings";
import { YearLayout } from "@/components/ScheduleLayout";
import { SelectedMajor, Sequence, Program } from "@/types";
import { standard } from "@/utils/Sequences";
import { useState, useEffect } from "react";

function App() {
  const [major, setMajor] = useState<SelectedMajor>();
  const [sequences, setSequences] = useState<Sequence[]>([standard]);
  const [sequence, setSequence] = useState<Sequence>(sequences[0]);
  const [extension, setExtension] = useState<Program>();
  const [startYear, setStartYear] = useState(2024);
  function onSelectMajor(major: SelectedMajor) {
    setMajor(major);
    if (major.regular && major.coop)
      setSequences([standard, ...major.sequences]);
    else if (major.coop) setSequences(major.sequences);
    else setSequences([standard]);
  }
  function sliceArray(arr: string[], index: number): string[] {
    return arr.slice(index, index + 3);
  }
  return (
    <>
      <div id="menu">
        <UserSettings>
          <MajorSelector setMajor={onSelectMajor} />
          <ExtensionSelector
            extensions={major ? major.extensions : []}
            setExtension={setExtension}
          />
          <SequenceSelector sequences={sequences} setSequence={setSequence} />
          <YearSelector setYear={setStartYear} />
        </UserSettings>
      </div>
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
    </>
  );
}

export default App;
