import {
  SelectedCourse,
  Program,
  Prerequisite,
  ParentPrerequisite,
  OtherPrerequisite,
  CoursePrerequisite,
  ProgramPrerequisite,
  LevelPrerequisite,
  DegreePrerequisite,
  PseudoCoursePrerequisite,
  MajorAveragePrerequisite,
  PseudoProgramPrerequisite,
  CumulativeAveragePrerequisite,
  SelectedMajor,
} from "@/types";

export function validatePrerequisite(
  prerequisite: Prerequisite,
  courses: { term: string; termCourses: SelectedCourse[] }[],
  programs: Program[],
  majorAverage: number,
  cumulativeAverage: number,
  termIndex: number
) {
  switch (prerequisite.requisiteSubtype) {
    case "parent":
      return validateParentPrerequisite(
        prerequisite as ParentPrerequisite,
        courses,
        programs,
        majorAverage,
        cumulativeAverage,
        termIndex
      );
    case "other":
      return validateOtherPrerequisite(prerequisite as OtherPrerequisite);
    case "course":
      return validateCoursePrerequisite(
        prerequisite as CoursePrerequisite,
        courses,
        null,
        termIndex
      );
    case "program":
      return validateProgramPrerequisite(
        prerequisite as ProgramPrerequisite,
        programs,
        null
      );
    case "degree":
      return validateDegreePrerequisite(
        prerequisite as DegreePrerequisite,
        programs
      );
    case "level":
      return validateLevelPrerequisite(
        prerequisite as LevelPrerequisite,
        courses,
        termIndex
      );
    case "pseudoCourse":
      return validatePseudoCoursePrerequisite(
        prerequisite as PseudoCoursePrerequisite,
        courses,
        false,
        termIndex
      );
    case "pseudoProgram":
      return validatePseudoProgramPrerequisite(
        prerequisite as PseudoProgramPrerequisite,
        programs
      );
    case "cumulativeAverage":
      return validateCumulativeAveragePrerequisite(
        prerequisite as CumulativeAveragePrerequisite,
        cumulativeAverage
      );
    case "majorAverage":
      return validateMajorAveragePrerequisite(
        prerequisite as MajorAveragePrerequisite,
        majorAverage
      );
  }
}

function validateParentPrerequisite(
  prerequisite: ParentPrerequisite,
  courses: { term: string; termCourses: SelectedCourse[] }[],
  programs: Program[],
  majorAverage: number,
  cumulativeAverage: number,
  termIndex: number
) {
  if (prerequisite.amount !== null) {
    let trueCounter = 0;
    if (prerequisite.grade !== null) {
      for (const child of prerequisite.prerequisites) {
        if (
          validateCoursePrerequisite(
            child as CoursePrerequisite,
            courses,
            prerequisite.grade,
            termIndex
          )
        )
          ++trueCounter;
      }
    } else {
      for (const child of prerequisite.prerequisites) {
        if (
          validatePrerequisite(
            child,
            courses,
            programs,
            majorAverage,
            cumulativeAverage,
            termIndex
          )
        )
          ++trueCounter;
      }
    }
    if (
      (prerequisite.amount === 0 &&
        trueCounter < prerequisite.prerequisites.length) ||
      trueCounter < prerequisite.amount
    )
      return false;
    return true;
  } else if (prerequisite.units !== null) {
    let unitCounter = 0;
    for (const child of prerequisite.prerequisites) {
      unitCounter += validatePseudoCoursePrerequisite(
        child as PseudoCoursePrerequisite,
        courses,
        true,
        termIndex
      ) as number;
    }
    if (unitCounter < prerequisite.units) return false;
    return true;
  } else if (prerequisite.programAverage !== null) {
    for (const child of prerequisite.prerequisites) {
      if (
        validateProgramPrerequisite(
          child as ProgramPrerequisite,
          programs,
          prerequisite.programAverage
        )
      )
        return true;
    }
    return false;
  } else throw Error(`Invalid parent prerequisite! ${prerequisite}`);
}

function validateOtherPrerequisite(prerequisite: OtherPrerequisite) {
  return true;
}

function validateCoursePrerequisite(
  prerequisite: CoursePrerequisite,
  courses: { term: string; termCourses: SelectedCourse[] }[],
  grade: number | null,
  termIndex: number
) {
  let validate: boolean;
  if (prerequisite.requisiteType === "antireq") {
    validate = true;
    for (let i = 0; i <= termIndex; ++i) {
      const termCourses = courses[i];
      for (const course of termCourses.termCourses) {
        // true is placedholder for a grade check: not implemented yet
        if (prerequisite.courseId === course.id && (!grade || true)) {
          validate = false;
          break;
        }
      }
    }
  } else {
    validate = false;
    for (
      let i = 0;
      prerequisite.requisiteType === "prereq" ? i < termIndex : i <= termIndex;
      ++i
    ) {
      const termCourses = courses[i];
      for (const course of termCourses.termCourses) {
        // true is placedholder for a grade check: not implemented yet
        if (prerequisite.courseId === course.id && (!grade || true)) {
          validate = true;
          break;
        }
      }
    }
  }
  return validate;
}

function validateProgramPrerequisite(
  prerequisite: ProgramPrerequisite,
  programs: Program[],
  average: number | null
) {
  let validate: boolean;
  if (prerequisite.requisiteType === "antireq") {
    validate = true;
    for (const program of programs) {
      // true is placedholder for a average check: not implemented yet
      if (program.id === prerequisite.programId && (!average || true))
        validate = false;
      break;
    }
  } else {
    validate = false;
    for (const program of programs) {
      // true is placedholder for a average check: not implemented yet
      if (program.id === prerequisite.programId && (!average || true))
        validate = true;
      break;
    }
  }
  return validate;
}

function validateLevelPrerequisite(
  prerequisite: LevelPrerequisite,
  courses: { term: string; termCourses: SelectedCourse[] }[],
  termIndex: number
) {
  for (let i = 0; i <= termIndex; ++i) {
    const termCourses = courses[i];
    if (termCourses.term === prerequisite.level) {
      if (
        prerequisite.level.charAt(prerequisite.level.length - 1) !== "+" &&
        i !== termIndex
      )
        return false;
      else return true;
    }
  }
  return false;
}

function validateDegreePrerequisite(
  prerequisite: DegreePrerequisite,
  programs: Program[]
) {
  for (const program of programs) {
    if (program.programSubtype === "Major") {
      const major = program as SelectedMajor;
      if (major.degree.id === prerequisite.degreeId) return true;
    }
  }
  return false;
}

function validatePseudoCoursePrerequisite(
  prerequisite: PseudoCoursePrerequisite,
  courses: { term: string; termCourses: SelectedCourse[] }[],
  units: boolean,
  termIndex: number
) {
  if (!units) {
    let validate: boolean;
    if (prerequisite.requisiteType === "antireq") {
      validate = true;
      for (let i = 0; i <= termIndex; ++i) {
        const termCourses = courses[i];
        for (const course of termCourses.termCourses) {
          //TODO: implement term check (topic can't really be checked)
          if (prerequisite.subject && course.subject !== prerequisite.subject)
            continue;
          if (
            prerequisite.catalogNumber &&
            course.catalogNumber !== prerequisite.catalogNumber
          )
            continue;
          if (
            prerequisite.minCatalogNumber &&
            catalogToNumber(course.catalogNumber) <
              prerequisite.minCatalogNumber
          )
            continue;
          if (
            prerequisite.maxCatalogNumber &&
            catalogToNumber(course.catalogNumber) >
              prerequisite.maxCatalogNumber
          )
            continue;
          if (
            prerequisite.component &&
            course.component !== prerequisite.component
          )
            continue;
          validate = false;
          break;
        }
      }
    } else {
      validate = false;
      for (
        let i = 0;
        prerequisite.requisiteType === "prereq"
          ? i < termIndex
          : i <= termIndex;
        ++i
      ) {
        const termCourses = courses[i];
        for (const course of termCourses.termCourses) {
          //TODO: implement term check (topic can't really be checked)
          if (prerequisite.subject && course.subject !== prerequisite.subject)
            continue;
          if (
            prerequisite.catalogNumber &&
            course.catalogNumber !== prerequisite.catalogNumber
          )
            continue;
          if (
            prerequisite.minCatalogNumber &&
            catalogToNumber(course.catalogNumber) <
              prerequisite.minCatalogNumber
          )
            continue;
          if (
            prerequisite.maxCatalogNumber &&
            catalogToNumber(course.catalogNumber) >
              prerequisite.maxCatalogNumber
          )
            continue;
          if (
            prerequisite.component &&
            course.component !== prerequisite.component
          )
            continue;
          validate = true;
          break;
        }
      }
    }
    return validate;
  } else {
    let units = 0;
    for (let i = 0; i < termIndex; ++i) {
      const termCourses = courses[i];
      for (const course of termCourses.termCourses) {
        //TODO: implement term check (topic can't really be checked)
        if (prerequisite.subject && course.subject !== prerequisite.subject)
          continue;
        if (
          prerequisite.catalogNumber &&
          course.catalogNumber !== prerequisite.catalogNumber
        )
          continue;
        if (
          prerequisite.minCatalogNumber &&
          catalogToNumber(course.catalogNumber) < prerequisite.minCatalogNumber
        )
          continue;
        if (
          prerequisite.maxCatalogNumber &&
          catalogToNumber(course.catalogNumber) > prerequisite.maxCatalogNumber
        )
          continue;
        if (
          prerequisite.component &&
          course.component !== prerequisite.component
        )
          continue;
        units += course.units;
      }
    }
    return units;
  }
}

function validateMajorAveragePrerequisite(
  prerequisite: MajorAveragePrerequisite,
  average: number
) {
  //placeholder until major averages are implemented
  return true;
}

function validateCumulativeAveragePrerequisite(
  prerequisite: CumulativeAveragePrerequisite,
  average: number
) {
  //placeholder until cumulative averages are implemented
  return true;
}

function validatePseudoProgramPrerequisite(
  prerequisite: PseudoProgramPrerequisite,
  programs: Program[]
) {
  let validate: boolean;
  if (prerequisite.requisiteType === "antireq") {
    validate = true;
    for (const program of programs) {
      if (program.programSubtype === "Major") {
        const major = program as SelectedMajor;
        //TODO: some way for user to indicate if they're in co-op or not
        if (
          prerequisite.faculty &&
          !major.degree.faculties.includes(prerequisite.faculty)
        )
          continue;
        if (
          prerequisite.majorType &&
          major.majorType !== prerequisite.majorType
        )
          continue;
        validate = false;
      }
    }
  } else {
    validate = false;
    for (const program of programs) {
      if (program.programSubtype === "Major") {
        const major = program as SelectedMajor;
        //TODO: some way for user to indicate if they're in co-op or not
        if (
          prerequisite.faculty &&
          !major.degree.faculties.includes(prerequisite.faculty)
        )
          continue;
        if (
          prerequisite.majorType &&
          major.majorType !== prerequisite.majorType
        )
          continue;
        validate = true;
      }
    }
  }
  return validate;
}

function catalogToNumber(catalogNumber: string) {
  for (let i = catalogNumber.length; i > 0; --i) {
    const substr = catalogNumber.substring(0, i);
    if (Number(substr)) return Number(substr);
  }
  throw new Error(
    `Catalog number ${catalogNumber} can't be converted to number!`
  );
}
