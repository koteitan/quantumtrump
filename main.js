window.onload=function(){ //entry point
  window.onresize();
  initGame();
  initDraw();
  initEvent();
  setInterval(procAll, 1000/frameRate);
};
var procAll=function(){ //main loop
  if(isRequestedDraw){
    procDraw();
    isRequestedDraw = false;
  }
  procEvent();
}
window.onresize = function(){
  var agent = navigator.userAgent;
  if( agent.search(/iPhone/) != -1 || agent.search(/iPod/) != -1 || agent.search(/iPad/) != -1){
    wx = 512;
    wy = 512;
  }else{
    var newWidth  = [document.documentElement.clientWidth-300, 320].max();
    var newHeight = [(document.documentElement.clientHeight-160)*0.9, 180].max();
    var newSize = [newWidth, newHeight].min();
    wx = newSize;
    wy = newSize;
  }
  document.getElementById("canvas0").width = wx;
  document.getElementById("canvas0").height= wy;
  wc = wx/(cards+3);
  isRequestedDraw = true;
};
//fields for game ---------------------------
var P;  // possibilities matrix P[b][f]="b can be f.", b=index of cards, f=faced up card
var eP; // P=eP[i]*E_i, E_i=ith permutation matrix
var perms; // permutations 
var isShuffled; // isShuffled[b]="b is mark to be shuffled." b=cards
var cards = 6; // number of cards
//fields for graphic ------------------------
var wx;
var wy;
var wc;
var frameRate = 60; // [fps]
var canvas = new Array(2);
var ctx    = new Array(2);
var isRequestedDraw;
//field for event--------------------
var isKeyTyping;
//init event---------------------
var initEvent = function(){
  eventQueue = new Array(0);
  canvas[0].ontouchstart = addTouchEvent;
  canvas[0].ontouchmove  = addTouchEvent;
  canvas[0].ontouchend   = addTouchEvent;
  canvas[0].onmousedown  = addEvent;
  canvas[0].onmousemove  = addEvent;
  canvas[0].onmouseup    = addEvent;
  canvas[0].onmouseout   = addEvent;
  canvas[0].onmousewheel = addEvent;
//  window.onkeydown       = addEvent;
};
//initialize game----------------------------
var initGame=function(){
  perms = factorial(cards);
  eP = new Array(perms);
  for(var p=0;p<perms;p++) eP[p] = 1/perms;
  P = new Array(cards);
  isShuffled = new Array(b);
  for(var b=0;b<cards;b++){
    isShuffled[b] = false;
    P[b]=new Array(cards);
    for(var f=0;f<cards;f++)P[b][f] = 1/cards;
  }
};
var resetGame=function(){
  initGame();
  initDraw();
  procDraw();
  initEvent();
}
var initDraw=function(){
  //renderer
  for(var i=0;i<1;i++){
    canvas[i] = document.getElementById("canvas"+i);
    if(!canvas[i]||!canvas[i].getContext) return false;
    ctx[i] = canvas[i].getContext('2d');
  }
  
  //set bitmap font
  var letterlist=" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
  var sizelist=new Array(96);
  var poslist =new Array(96);
  for(var i=0;i<sizelist.length;i++){
    sizelist[i]=new Array(2);
    poslist [i]=new Array(2);
    sizelist[i][0]=8; //((3px+margin1px),(5px+margin1px))xscale2
    sizelist[i][1]=12;
    poslist [i][0]=2;
    poslist [i][1]=2;
  }
  sizelist[letterlist.indexOf("!")]=[ 4,12];
  sizelist[letterlist.indexOf("#")]=[10,12];
  sizelist[letterlist.indexOf("'")]=[ 4,12];
  sizelist[letterlist.indexOf("(")]=[ 6,12];
  sizelist[letterlist.indexOf(")")]=[ 6,12];
  sizelist[letterlist.indexOf(",")]=[ 6,12];
  sizelist[letterlist.indexOf(".")]=[ 4,12];
  sizelist[letterlist.indexOf(":")]=[ 4,12];
  sizelist[letterlist.indexOf(";")]=[ 6,12];
  sizelist[letterlist.indexOf("[")]=[ 6,12];
  sizelist[letterlist.indexOf("]")]=[ 6,12];
  sizelist[letterlist.indexOf("`")]=[ 6,12];
  sizelist[letterlist.indexOf("M")]=[12,12];
  sizelist[letterlist.indexOf("N")]=[10,12];
  sizelist[letterlist.indexOf("Q")]=[16,14];
  sizelist[letterlist.indexOf("W")]=[12,12];
  sizelist[letterlist.indexOf("g")]=[ 8,16];
  sizelist[letterlist.indexOf("i")]=[ 4,12];
  sizelist[letterlist.indexOf("j")]=[ 6,16];
  sizelist[letterlist.indexOf("l")]=[ 4,12];
  sizelist[letterlist.indexOf("m")]=[12,12];
  sizelist[letterlist.indexOf("p")]=[ 8,16];
  sizelist[letterlist.indexOf("q")]=[ 8,16];
  sizelist[letterlist.indexOf("w")]=[12,12];
  sizelist[letterlist.indexOf("y")]=[ 8,16];
  sizelist[letterlist.indexOf("~")]=[10,12];
  sizelist[letterlist.indexOf("|")]=[ 4,12];
  var posxx=12;
  var posyy=18;
  for(var x=0;x<16;x++){
    for(var y=0;y<6;y++){
      poslist[y*16+x][0] = x*posxx+2;
      poslist[y*16+x][1] = y*posyy+2;
    }
  }
  ctx[0].setBitmapFont("font.png", poslist, sizelist, letterlist);
  isRequestedDraw = true;
};
var procDraw=function(){
  //clear
  ctx[0].clearRect(0, 0, wx-1, wy-1);
  //draw header
  ctx[0].fillStyle = 'rgb(0,0,255)'; //blue
  for(var x=-1;x<cards;x++){
    ctx[0].fillRect((x+2)*wc, 1*wc, wc, wc);
  }
  for(var y=0;y<cards;y++){
    ctx[0].fillRect(1*wc, (y+2)*wc, wc, wc);
  }
  //draw element
  for(var x=0;x<cards;x++){
    for(var y=0;y<cards;y++){
      var c=Math.floor(P[y][x]*255);
      ctx[0].fillStyle = 'rgb('+c+','+c+','+c+')';
      ctx[0].fillRect((x+2)*wc, (y+2)*wc, wc, wc);
    }
  }
  //draw shuffled
  ctx[0].fillStyle = 'rgb(256,0,0)'; //red
  for(var y=0;y<cards;y++){
    if(isShuffled[y]) ctx[0].fillRect(1*wc, (y+2)*wc, wc, wc);
  }
  //draw table
  ctx[0].strokeWeight='1';
  ctx[0].lineWidth   ='1';
  ctx[0].strokeStyle ='rgb(192,192,192)';// light gray
  for(var x=1;x<cards+3;x++){
    ctx[0].beginPath();
    ctx[0].moveTo(x*wc, 1       *wc);
    ctx[0].lineTo(x*wc,(cards+2)*wc);
    ctx[0].stroke();
  }
  for(var y=1;y<cards+3;y++){
    ctx[0].beginPath();
    ctx[0].moveTo( 1       *wc,y*wc);
    ctx[0].lineTo((cards+2)*wc,y*wc);
    ctx[0].stroke();
  }
}
var dummy=function(){
  //draw cource ------
        ctx[0].beginPath();
        ctx[0].moveTo(fc2d[0][0],fc2d[0][1]);
        ctx[0].lineTo(fc2d[1][0],fc2d[1][1]);
        ctx[0].stroke();
    ctx[0].fillStyle = 'rgb(0,0,255)'; //blue
    ctx[0].beginPath();
    ctx[0].arc(p[0], p[1], p[2]*Rstartpos, 0, Math.PI*2, false);
    ctx[0].fill();
    ctx[0].strokeStyle = 'yellow'; //blue
    ctx[0].guideText("TEE",p[0],p[1]);
}
//game-------------------------
var getAloneX=function(y){
  var ax=-1;
  for(var x=0;x<cards;x++){
    if(P[y][x]){
      //true is found
      if(ax!=-1)return -1; //return -1 with 2nd true
      ax=x; //memo
    }
  }
  return ax;
}
var getAloneY=function(x){
  var ay=-1;
  for(var y=0;y<cards;y++){
    if(P[y][x]){
      //true is found
      if(ay!=-1)return -1; //return -1 with 2nd true
      ay=y; //memo
    }
  }
  return ay;
}
var eP2P=function(){
  //clear P
  for(var y=0;y<cards;y++){
    for(var x=0;x<cards;x++){
      P[y][x]=0;
    }
  }
  //eP -> P
  for(var p=0;p<perms;p++){
    var a=hash2perm(p,cards);
    for(var c=0;c<cards;c++){
      P[c][a[c]]+=eP[p];
    }
  }
}
var collapse=function(cx,cy){
  //collapse
  var sum=0;
  for(var p=0;p<perms;p++){
    if(hash2perm(p,cards)[cy]!=cx)eP[p]=0;
    sum+=eP[p];
  }
  //regularize(normalize probability)
  for(var p=0;p<perms;p++) eP[p]/=sum;
  //eP->P
  eP2P();
}
var shuffle=function(){
  //count shuffle
  var shuffleds = 0;
  for(var y=0;y<cards;y++){
    if(isShuffled[y])shuffleds++;
  }
  if(shuffleds==0) return;
  //clear eP2[y]
  var eP2 = new Array(perms);
  for(var p=0;p<perms;p++) eP2[p]=0;
  
  for(var p=0;p<perms;p++){
    var a = hash2perm(p,cards);
    for(var p2=0;p2<perms;p2++){
      var a2 = hash2perm(p2,cards);
      //find same
      var isSameGroup=true;
      for(var y=0;y<cards;y++){
        if(!isShuffled[y] && a[y]!=a2[y]){
          isSameGroup=false;
          break;
        }
      }
      if(isSameGroup){
        eP2[p2]+=eP[p]/factorial(shuffleds);
      }
    }
  }
  eP=eP2;
  eP2P();
}
//event handlers after queue ------------
var handleMouseDown = function(){
  // convert mx,my
  var mx=Math.floor(mouseDownPos[0]/wc)-2;
  var my=Math.floor(mouseDownPos[1]/wc)-2;
  // check open
  if(mx>=0 && mx<cards && my>=0 && my<cards){
    if(P[my][mx]){
      collapse(mx,my);
      for(var y=0;y<cards;y++)isShuffled[y]=0;
      isRequestedDraw = true;
    }
  }
  // check shuffle
  if(mx==-1 && my>=0 && my<cards){
    isShuffled[my]=!isShuffled[my];
    shuffle();
    isRequestedDraw = true;
  }
  // clear shuffle
  if(mx==-1 && my==-1){
    for(var y=0;y<cards;y++)isShuffled[y]=0;
    isRequestedDraw = true;
  }
}
var handleMouseDragging = function(){
  // convert mx,my
  var mx=Math.floor(mousePos[0]/wc)-2;
  var my=Math.floor(mousePos[1]/wc)-2;
}

var handleMouseUp = function(){
}
var handleMouseMoving = function(){
//
}
var handleMouseWheel = function(){
  isRequestedDraw = true;
}
var handleKeyDown = function(e){
    var c = String.fromCharCode(e.keyCode);
    var motion = "adsw".indexOf(c);
    var dtheta=[-1,+1,0,0];
    var dphi  =[0,0,-1,+1];
}
var printDebug=function(str){
  document.getElementById("debugout").innerHTML += str;
}
var clsDebug=function(str){
  document.getElementById("debugout").innerHTML = "";
}

