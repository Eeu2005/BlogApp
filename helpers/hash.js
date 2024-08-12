const cripto = require("crypto")
function hashear(string){
    return cripto.scryptSync( string, "cheiDeSal", 64 ).toString( "hex" );
}
module.exports = hashear