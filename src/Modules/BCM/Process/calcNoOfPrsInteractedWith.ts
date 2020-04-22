import moment from "moment";
import { IPullRequest } from "../Models";
import { CsvWriter } from "../../../CsvWriter";
import { mapObjectToArray } from "../../../Object.Extensions";
import { getTeamLookup } from "./Utils";

export function calcNoOfPrsInteractedWith(prs: IPullRequest[]): void {

    const contributors = {} as {
        [email: string]: {
            prIds: Set<string>;
            prIdsExcludingOwnTeam: Set<string>;
            team: string;
        };
    };
    const teamLookup = getTeamLookup();

    for (const pr of prs) {
        for (const activity of pr.activities) {
            if (moment(activity.date).isBefore(moment().subtract(14, "days"))) continue;

            const mail = activity.userEmail;
            contributors[mail] = contributors[mail] || {
                prIds: new Set<string>(),
                prIdsExcludingOwnTeam: new Set<string>(),
                team: teamLookup[activity.userName] || "unknown team"
            };

            const activityOnOwnPr = activity.userName == pr.userName;
            if (!activityOnOwnPr) {
                contributors[mail].prIds.add(pr.id.toString());

                const activityOnOwnTeam = teamLookup[activity.userName] == teamLookup[pr.userName];
                if (!activityOnOwnTeam) {
                    contributors[mail].prIdsExcludingOwnTeam.add(pr.id.toString());
                }
            }
        }
    }

    new CsvWriter().write("module-bcm-noOfPrsInteractedWith.csv", mapObjectToArray(contributors, userStats => ({
        prCount: userStats.prIds.size,
        prCountExcludingOwnTeam: userStats.prIdsExcludingOwnTeam.size,
        team: userStats.team
    })));
}
