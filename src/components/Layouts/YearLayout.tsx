import "./YearLayout.css";

type YearLayoutProps = {
  startYear: number;
  year: number;
  termInfo: string[];
  children: JSX.Element[];
};

export function YearLayout({
  startYear,
  year,
  termInfo,
  children,
}: YearLayoutProps) {
  return (
    <>
      <div className={`year-${termInfo.length}`}>
        <h3>Year {year - startYear + 1}</h3>
        {children}
      </div>
    </>
  );
}
