import moment from "moment";
import { IPullRequest } from "../Models";
import { CsvWriter } from "../../../CsvWriter";
import { mapObjectToArray } from "../../../Object.Extensions";
import { getTeamLookup } from "./Utils";

export function calcNoOfCommentsWritten(prs: IPullRequest[]): void {

    const contributors = {} as {
        [email: string]: {
            commentCount: number;
            commentCountExcludingOwnTeam: number;
            team: string;
        };
    };
    const teamLookup = getTeamLookup();

    for (const pr of prs) {
        for (const activity of pr.activities) {
            if (moment(activity.date).isBefore(moment().subtract(14, "days"))) continue;
            if (activity.action.toLowerCase() != "commented") continue;

            const mail = activity.userEmail;
            contributors[mail] = contributors[mail] || {
                commentCount: 0,
                commentCountExcludingOwnTeam: 0,
                team: teamLookup[activity.userName] || "unknown team"
            };

            const activityOnOwnPr = activity.userName == pr.userName;
            if (!activityOnOwnPr) {
                contributors[mail].commentCount += 1;

                const activityOnOwnTeam = teamLookup[activity.userName] == teamLookup[pr.userName];
                if (!activityOnOwnTeam) {
                    contributors[mail].commentCountExcludingOwnTeam += 1;
                }
            }
        }
    }

    new CsvWriter().write("module-bcm-noOfCommentsWritten.csv", mapObjectToArray(contributors, userStats => userStats));
}
