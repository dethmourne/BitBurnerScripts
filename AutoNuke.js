/* 
    Automatic server nuking.
    Pulls the purchased server list dynamically to ensure it doesn't try to nuke your own servers.
    Adapted from deepscript-nuke.script, reworked for NS 2.0
*/

export async function main(ns) {
    var nukedServers = []; // generate empty array for nuked server list so we skip rooted servers as we nuke them
    var allServers = []; // Generate empty array to track server names
    var servers = []; // generate empty array for temporary servers (the next batch to try to nuke)
    servers.push(ns.getHostname()); // Add the current server (generally but not strictly "home" to the initial server list)
    var rootingPrograms = 0; // resets port opener count to 0 - this vars us ensure we count any we've acquired since the last loop
    var myServers = ns.getPurchasedServers(); // add purchased servers to safe server list - this should hopefully allow for dynamic updates
    myServers.push("home"); // always add home to safe server list
    if (ns.fileExists("BruteSSH.exe", "home")) { // this if chain adds to the port opener count
        rootingPrograms++;
        if (ns.fileExists("FTPCrack.exe", "home")) {
            rootingPrograms++;
            if (ns.fileExists("relaySMTP.exe", "home")) {
                rootingPrograms++;
                if (ns.fileExists("HTTPWorm.exe", "home")) {
                    rootingPrograms++;
                    if (ns.fileExists("SQLInject.exe", "home")) {
                        rootingPrograms++;
                    }
                }
            }
        }
    }
    while (servers.length > 0) {
        var server = servers.pop(); // load next server in server array
        if (!nukedServers.includes(server)) { // check for if server already flagged as nuked
            ns.print("--------------------------------" +
                "-------------------------------");
            ns.print("Working on " + server + "...");

            // We will only nuke the server if the necessary conditions are met
            var willNuke = 0;
            var willHack = 0;
            var reasons = [];
            if (myServers.includes(server)) {
                willNuke++;
                reasons.push("it is included in the 'myServers' list");
            }
            if (ns.hasRootAccess(server)) {
                willNuke++;
                reasons.push("we already have root access on it");
            }
            if (
                ns.getServerNumPortsRequired(server) >
                rootingPrograms
            ) {
                willNuke++;
                reasons.push("we don't have enough programs");
            }
            if (willNuke > 0) {
                ns.print(
                    server +
                    " can't or won't be nuked right now because " +
                    reasons.join(', and ') +
                    "."
                );
            } else {
                ns.print("Attempting to nuke " + server + "...");
                if (ns.getServerNumPortsRequired(server) > 0) {
                    ns.brutessh(server);
                    if (
                        ns.getServerNumPortsRequired(server) >
                        1
                    ) {
                        ns.ftpcrack(server);
                        if (
                            ns.getServerNumPortsRequired(
                                server
                            ) >
                            2
                        ) {
                            ns.relaysmtp(server);
                            if (
                                ns.getServerNumPortsRequired(
                                    server
                                ) >
                                3
                            ) {
                                ns.httpworm(server);
                                if (
                                    ns.getServerNumPortsRequired(
                                        server
                                    ) >
                                    4
                                ) {
                                    ns.sqlinject(server);
                                }
                            }
                        }
                    }
                }
                ns.nuke(server);
                if (ns.hasRootAccess(server)) {
                    ns.print(server + " successfully rooted!");
                    ns.tprint("LOOPNUKE: " + server + " successfully rooted!");
                    nukedServers.push(server);
                } else {
                    ns.print(server + " NOT rooted!");
                }
            }
            await ns.sleep(10);
            allServers.push(server);
            var nextServers = ns.scan(server);
            for (let i = 0; i < nextServers.length; i++) {
                if (!allServers.includes(nextServers[i])) {
                    servers.push(nextServers[i]);
                }
            }
        }
    }
    ns.print("================================" +
        "===============================");
    ns.print("Rooted servers this run: " + nukedServers.length);
    ns.tprint("LOOPNUKE: Rooted servers this run: " + nukedServers.length);
    await ns.sleep(100)
}
