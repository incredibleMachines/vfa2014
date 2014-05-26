
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

exports.visualizer = function(req,res){
	res.render('visualizer-view', {title: 'VFA 2014', slug: 'visualizer'})
}