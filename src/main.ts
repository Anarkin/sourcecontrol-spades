import bcmModule from "./Modules/BCM";

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "0";
process.env['ENV'] = "dev";

(async function main() {

    await bcmModule();

})();
