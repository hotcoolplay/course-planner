export type Term = "Fall" | "Winter" | "Spring";

export interface Course {
  id: number;
  subject: string;
  catalogNumber: string;
  title: string;
  courseid: string;
  faculty: string;
  component: string;
  completions: number | null;
  simulEnroll: boolean | null;
  grading: string;
  units: number;
  description: string;
}

export interface SelectedCourse {}

export interface Sequence {
  name: string | null;
  sequence: string[];
}

export interface Program {
  id: number;
  name: string;
  programSubtype: programSubtype;
}

export interface Major extends Program {
  degreeId: number;
  majorType: majorType;
  regular: boolean;
  coop: boolean;
}

export interface SelectedMajor extends Program {
  degreeId: number;
  majorType: majorType;
  regular: boolean;
  coop: boolean;
  sequences: Sequence[];
  extensions: Program[];
}

type majorType = "H" | "JH" | "3G" | "4G";
type programSubtype =
  | "Diploma"
  | "Major"
  | "Minor"
  | "Option"
  | "Specialization";
