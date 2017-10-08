var log10 = function(x){
  return Math.LOG10E + Math.log(x);
}
var log2 = function(x){
  return Math.LOG2E + Math.log(x);
}
var ln = function(x){
  return Math.log(x);
}
var sqrt1p2=function(){
  return 0.7071067811865475;
}
var chisqr_1_0p05 = function(){
  -3.841
}
//xorshift random object
var XorShift=function(s){
  if(s==undefined) s=(new Date()).getTime();
  this.x=123456789;
  this.y=362436069;
  this.z=521288629;
  this.seed=s;
  this.w=this.seed;
  for(var i=0;i<1000;i++) this.getNext(); // because randomness is very poor
};
// random float value 0.0<=x<+1.0
XorShift.prototype.getNext = function() {
  var t = this.x ^ (this.x << 11);
  this.x = this.y;
  this.y = this.z;
  this.z = this.w;
  this.w = (this.w^(this.w>>>19))^(t^(t>>>8));
  return this.w/(1<<31)/2+1/2;
};
//test randomness
XorShift.test = function(seed){
  var str="";
  var xs=new this(seed);
  var sumx=0;
  var maxx=-Infinity;
  var minx=+Infinity;
  var N=100000;
  for(var i=0;i<N;i++){
    var x=this.getNext();
    sumx+=x;
    if(x>maxx)maxx=x;
    if(x<minx)minx=x;
  }
  str+="avg="+sumx/N+0.5;
  str+=" max="+maxx;
  str+=" min="+minx;
  return str;
}