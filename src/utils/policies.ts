import type { Project, TeamMember } from "../types";

export const isManager = (managerID: Project['manager'], userID: TeamMember['_id'] ) => managerID == userID