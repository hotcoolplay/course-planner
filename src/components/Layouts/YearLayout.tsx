import "./YearLayout.css";
import { Term } from "@/types";
import { TermLayout } from "@/components/Layouts";

type YearLayoutProps = {
  startYear: number;
  year: number;
  termInfo: string[];
};

export function YearLayout({ startYear, year, termInfo }: YearLayoutProps) {
  function determineTerm(index: number): Term {
    if (index === 0) return "Fall";
    else if (index === 1) return "Winter";
    else return "Spring";
  }
  return (
    <>
      <div className={`year-${termInfo.length}`}>
        <h3>Year {year - startYear + 1}</h3>
        {termInfo.map((item, index) => (
          <div className={`terms-${termInfo.length}`}>
            <TermLayout
              year={year + Math.floor((index + 2) / 3)}
              term={determineTerm(index)}
              termValue={item}
            />
          </div>
        ))}
      </div>
    </>
  );
}
