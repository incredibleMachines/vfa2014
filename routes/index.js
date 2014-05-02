
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'VFA 2014' });
};

exports.setup = function(req,res){
  res.render('setup',{ title: 'Setup' })
}
