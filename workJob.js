// Work job automatically. Takes argument for job (default IT) and second argument for corp (default megacorp)

export async function main(ns) {
    if (ns.args[0]) { // checks for existence of argument, defaults to IT
        var job = ns.args[0]
    } else {
        var job = "IT"
    };
    if (ns.args[1]) { // checks for existence of argument, defaults to MegaCorp
        var company = ns.args[1]
    } else {
        var company = "Megacorp"
    };
    var i = 0; // set a flag for breaking out of our loop
    while (i < 1) { // do work unless we've broken out of the loop
        while (ns.isBusy()) { // make sure we aren't busy when we attempt to do work
            await ns.sleep(100)
        }
        ns.applyToCompany(company,job);
        ns.workForCompany(company);
        await ns.sleep(28500000); // checks if we are still busy 5 minutes before finishing a job loop
        if (!ns.isBusy()) {
            i++
        }
    }
}