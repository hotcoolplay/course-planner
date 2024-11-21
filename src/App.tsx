import "./App.css";
import {
  UserSettings,
  MajorSelector,
  SequenceSelector,
  ExtensionSelector,
  YearSelector,
} from "@/components/UserSettings";
import { YearLayout } from "@/components/ScheduleLayout";
import { Major, SelectedMajor, Sequence, Program } from "@/types";
import { standard } from "@/utils/Sequences";
import { client } from "@/lib/client";
import { useState, useEffect } from "react";

function App() {
  const [major, setMajor] = useState<SelectedMajor>();
  const [sequence, setSequence] = useState<Sequence>(standard);
  const [extension, setExtension] = useState<Program>();
  const [startYear, setStartYear] = useState(2024);
  let sequences: Sequence[] = [standard];
  function onSelectMajor(major: SelectedMajor) {
    setMajor(major);
    if (major.regular && major.coop) sequences = [standard, ...major.sequences];
    else if (major.coop) sequences = major.sequences;
    else sequences = [standard];
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
