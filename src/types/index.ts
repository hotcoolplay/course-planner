export type Term = "Fall" | "Winter" | "Spring";

export interface Course {
    subject: string;
    id: string;
    weight: string;
    level: number;
    terms: Term[];
    prereqs: string[];
    coreqs: string[];
    antireqs: string[];
    crosslist: string[];
}
