import { ConfigProvider } from "../Config";

export function getTeamLookup(): { [member: string]: string } {

    const config = new ConfigProvider().load();
    const teams = config.teams;

    const lookup = {} as { [member: string]: string };

    for (const team of teams) {
        for (const member of team.members) {
            lookup[member] = team.name;
        }
    }

    return lookup;
}
