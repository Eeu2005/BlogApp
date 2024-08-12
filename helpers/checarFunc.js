function checarSeNulo ( campo, Nomecampo, erros, esperado )
{
    if ( esperado )
    {
        if ( campo != esperado )
        {
            console.log(esperado)
            erros.push( {
                mensagem: `[${Nomecampo}] não são iguais`
            } );
            return;
        }
    }
    if ( !campo || typeof campo == undefined || campo == null )
    {
        erros.push( {
            mensagem: nomeCampo + "invalido"
        } );
    }
}
module.exports = checarSeNulo