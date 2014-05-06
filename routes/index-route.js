
/*
 * GET home page.
 */

var keys = require('./../modules/Keys')

exports.index = function(req, res){
  res.render('index-view', { title: 'VFA 2014', slug: 'index' });
};

exports.setup = function(req,res){
  res.render('setup-view',{ title: 'Setup', instagram: keys.Instagram, slug: 'setup' })
}

exports.canvas = function(req,res){
	res.render('canvas-view', {title: 'VFA 2014', slug: 'canvas'})
}