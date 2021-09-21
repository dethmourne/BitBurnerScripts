/* 
    Automatic server nuking.
    Pulls the purchased server list dynamically to ensure it doesn't try to nuke your own servers.
    Adapted from deepscript-nuke.script, reworked for NS 2.0
*/

export async function main(ns) {
    let allServers = []; // Generate empty array to track server names
    let servers = []; // generate empty array for temporary servers (the next batch to try to nuke)
    let nukedServers = []; // generate empty array for nuked server list so we skip rooted servers as we nuke them
    servers.push(ns.getHostname); // Add the current server (generally but not strictly "home" to the initial server list)
    while(true) { // start infinite loop to nuke servers
        let rootingPrograms = 0; // resets port opener count to 0 - this lets us ensure we count any we've acquired since the last loop
        let myServers = ns.getPurchasedServers(); // add purchased servers to safe server list - this should hopefully allow for dynamic updates
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
            server = servers.pop(); // load next server in server array
            if (!nukedServers.includes(server)) { // check for if server already flagged as nuked
                ns.tprint("--------------------------------" +
                    "-------------------------------");
                ns.tprint("Working on " + server + "...");
    
                // We will only nuke the server if the necessary conditions are met
                let willNuke = 0;
                let willHack = 0;
                let reasons = [];
                if (myServers.includes(server)) {
                    willNuke++;
                    reasons.push("it is included in the 'myServers' list");
                }
                if (ns.hasRootAccess(server)) {
                    willNuke++;
                    reasons.push("we already have root access on it");
                }
                if (
                    ns.getServerSecurityLevel(server) >
                    ns.getHackingLevel()
                ) {
                    willNuke++;
                    reasons.push("our hacking level is too low");
                }
                if (
                    ns.getServerNumPortsRequired(server) >
                    rootingPrograms
                ) {
                    willNuke++;
                    reasons.push("we don't have enough programs");
                }
                if (willNuke > 0) {
                    ns.tprint(
                        server +
                        " can't or won't be nuked right now because " +
                        reasons.join(', and ') +
                        "."
                    );
                } else {
                    ns.tprint("Attempting to nuke " + server + "...");
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
                        ns.tprint(server + " successfully rooted!");
                    } else {
                        ns.tprint(server + " NOT rooted!");
                    }
                }
    
                allServers.push(server);
                nextServers = ns.scan(server);
                for (i = 0; i < nextServers.length; ++i) {
                    if (!allServers.includes(nextServers[i])) {
                        servers.push(nextServers[i]);
                    }
                }
            }
        }
        ns.tprint("================================" +
            "===============================");
        ns.tprint("Rooted servers so far: " + nukedServers.length);
        ns.tprint("Starting a new loop...");
    }
}
