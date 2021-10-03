// Work for the specified faction (arg 0) doing the specified job type (arg 1) until you reach the desired faction rep (arg 2)
// Job type is "hacking", "field", or "security"

export async function main(ns) {
    const faction = ns.args[0];
    const jobType = ns.args[1];
    const repAmount = ns.args[2];
    while (ns.getFactionRep(faction) < repAmount) {
        ns.workForFaction(faction, jobType);
        await ns.sleep(60000);
    }
}