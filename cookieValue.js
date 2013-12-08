var page = require('webpage').create();
var async = require('async');
var system = require('system');

var count = 0, out={};

if(system.args.length !== 4){
  console.log("USAGE phantomjs checkCookie.js <iterations> <url> <cookie>");
  phantom.exit();
}

var iterations = system.args[1];
var url = system.args[2];
var cookieName = system.args[3] + '=';

var fetchPage = function(callback){
  page.clearCookies();
 
  page.open(url, function(status) {
      var cookie = page.evaluate(function(cookieName) {
        try{
          return document.cookie.split(cookieName).pop().split(';').shift();
        } catch(e){
        }
      }, cookieName);
      
      if(typeof out[cookie] === 'number'){
        out[cookie] = out[cookie] + 1;
      } else {
        out[cookie] = 1;
      }

      setTimeout(function(){
        callback(null);
      }, 1000);
  });
};

async.whilst(
  function(){
    console.log(count,'iterations completed');
    return count < iterations;
  },
  function(callback){
    count++;
    fetchPage(callback);
  },
  function(err){
    if(err){
      console.log('whilst failed',err);
    } else {
      for(key in out){ 
        console.log(key+':',out[key]);
      };
    }
   
    phantom.exit();
  }
);
