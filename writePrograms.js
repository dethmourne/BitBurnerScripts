// Write any available programs
// Really only useful in the first few runs of a node - use buyProgs once you can buy faster than you can write.

const progList = [ // Set up an array with each program and hacking level required to program it.
    ['BruteSSH.exe', 50],
    ['FTPCrack.exe', 100],
    ['relaySMTP.exe', 250],
    ['HTTPWorm.exe', 500],
    ['SQLInject.exe', 750],
    ['DeepScanV1.exe', 75],
    ['DeepScanV2.exe', 400],
    ['ServerProfiler.exe', 75],
    ['AutoLink.exe', 25]
]

export async function main(ns) {
    if (!ns.isBusy()) { // Don't do anything if we're busy already.
        var hackLevel = ns.getHackingLevel(); // Get our current hacking level for comparison.
        for (let i = 0; i < progList.length; i++) { // increment through our program list.
            if (!ns.fileExists(progList[i][0], "home")) { // check to see if the program exists.
                if (hackLevel >= progList[i][1]) { // if program exists, confirm we have a high enough hacking level to program it.
                    ns.createProgram(progList[i][0]); // create the program.
                    await ns.sleep(1000); // wait a second, then loop every second while busy --
                    while (ns.isBusy()) { // this keeps us in this for iteration - staying in this iteration means --
                        await ns.sleep(1000) // we can check for the next program after we're done writing this one.
                    }
                } else {
                    ns.tprint("Insufficient hacking level for " + progList[i][0] + ", checking next program.") // Write to terminal if we aren't up to snuff for this program yet.
                }
            } else {
                ns.tprint("Already own " + progList[i][0] + ", checking next program.") // Write to terminal if we own this program already.
            }
        }
        ns.tprint("Created all valid programs. Current hacking level is " + hackLevel + ".") // Write to terminal at end of loop and report current hack level.
    } else {
        ns.tprint("Already busy - will not interrupt another job.") // Write to terminal if we find something else running.
    }
}