function e (req,res,next){
    if ( req.isAuthenticated() && res.locals.user.admin==1){
        next()
    }  else{
      req.flash("error_msg","voce precisa ser administrador")
    res.redirect("/")
}
}
module.exports =e 