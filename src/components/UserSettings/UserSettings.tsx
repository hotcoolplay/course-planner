import "./UserSettings.css";

type UserSettingsProps = {
  children: JSX.Element[];
};

export function UserSettings({ children }: UserSettingsProps) {
  return (
    <>
      <h1>UW Course Planner</h1>
      {children}
    </>
  );
}
