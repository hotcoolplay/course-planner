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

export interface SelectedCourse extends Course {
  prerequisites: Prerequisite[];
}

export interface Sequence {
  name: string | null;
  sequence: string[];
}

export interface Program {
  id: number;
  name: string;
  programSubtype: programSubtype;
}

export interface SelectedProgram extends Program {}

export interface Major extends Program {
  degreeId: number;
  majorType: majorType;
  regular: boolean;
  coop: boolean;
}

export interface SelectedMajor extends Major {
  sequences: Sequence[];
  extensions: Program[];
}

export interface Prerequisite {
  id: number;
  parentPrerequisiteId: number | null;
  parentCourseId: number | null;
  requisiteType: requisiteType;
  requisiteSubtype: requisiteSubtype;
}

interface ParentPrerequisite extends Prerequisite {
  amount: number | null;
  grade: number | null;
  units: number | null;
  programAverage: number | null;
}

interface CoursePrerequisite extends Prerequisite {
  courseId: number;
}

interface ProgramPrerequisite extends Prerequisite {
  programId: number;
}

interface LevelPrerequisite extends Prerequisite {
  level: string;
}

interface OtherPrerequisite extends Prerequisite {
  other: string;
}

interface PseudoCoursePrerequisite extends Prerequisite {
  subject: string | null;
  catalogNumber: string | null;
  minCatalogNumber: number | null;
  maxCatalogNumber: number | null;
  topic: string | null;
  term: string | null;
  component: string | null;
}

interface CumulativeAveragePrerequisite extends Prerequisite {
  cumulativeAverage: number;
}

interface MajorAveragePrerequisite extends Prerequisite {
  majorAverage: number;
}

interface PseudoProgramPrerequisite extends Prerequisite {
  faculty: string | null;
  majorType: majorType | null;
  majorSystem: majorSystem | null;
}

interface DegreePrerequisite extends Prerequisite {
  degreeId: number;
}

type majorType = "H" | "JH" | "3G" | "4G";
type programSubtype =
  | "Diploma"
  | "Major"
  | "Minor"
  | "Option"
  | "Specialization";
type majorSystem = "Regular" | "Co-operative";
type requisiteType = "antireq" | "prereq" | "coreq";
type requisiteSubtype =
  | "course"
  | "level"
  | "program"
  | "other"
  | "parent"
  | "pseudoCourse"
  | "pseudoProgram"
  | "degree"
  | "cumulativeAverage"
  | "majorAverage";
