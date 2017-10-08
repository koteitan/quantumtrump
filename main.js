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
  gS  = new Geom(3,[[0,wy,0],[wx,0,wx] ]);
  isRequestedDraw = true;
};
//fields for game ---------------------------
var P; // possibilities matrix P[b][f]="b can be f.", b=index of cards, f=faced up card
var isShuffle; // isShuffle[b]="b is mark to be shuffled." b=cards
var cards = 53; // number of cards
//fields for graphic ------------------------
var frameRate = 60; // [fps]
var canvas = new Array(2);
var ctx    = new Array(2);
var isRequestedDraw;
//field for event--------------------
var isKeyTyping;
var mdposC; // position at mousedown in CameraView coordinate
var mmposC; // position at mousemove in CameraView coordinate
var mdcam;         // Camera object at mousedown
var mdshotAngle3d; // shot angle at mousedown
var Rdrag = fairways; // radius to drag
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
  // reset to all 1
  P = new Array(cards);
  isShuffle = new Array(b);
  for(var b=0;b<cards;b++){
    isSuffle[b] = false;
    P[b]=new Array(cards);
    for(var f=0;f<cards;f++)P[b][f]=true;
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
};
var procDraw=function(){
  //clear
  ctx[0].clearRect(0, 0, wx-1, wy-1);
  //draw table
  ctx[0].strokeWeight='1';
  ctx[0].lineWidth='1';
}
var dummy=function(){
  //draw cource ------
  ctx[0].strokeWeight='1';
  ctx[0].lineWidth='1';
  for(var f=0;f<fairways;f++){
    if(f==0||f==fairways-1){
      ctx[0].strokeStyle='rgb(128,255,128)';
    }else{
      ctx[0].strokeStyle='rgb(0,128,0)';
    }
    var fc=wirecube.clone();
    for(var l=0;l<fc.length;l++){
      fc[l][0] = add(fc[l][0], fairway[f]);
      fc[l][1] = add(fc[l][1], fairway[f]);
      var fc2d = [transCam(fc[l][0], cam, cam0, gP, gS), 
                  transCam(fc[l][1], cam, cam0, gP, gS)];
      if(fc2d[0][2]>=0 && fc2d[1][2]>=0){
        ctx[0].beginPath();
        ctx[0].moveTo(fc2d[0][0],fc2d[0][1]);
        ctx[0].lineTo(fc2d[1][0],fc2d[1][1]);
        ctx[0].stroke();
      }
    }//i
  }//f
  //draw tee
  var p=transCam(startpos, cam, cam0, gP, gS);
  if(p[2]>=0){
    ctx[0].fillStyle = 'rgb(0,0,255)'; //blue
    ctx[0].beginPath();
    ctx[0].arc(p[0], p[1], p[2]*Rstartpos, 0, Math.PI*2, false);
    ctx[0].fill();
    ctx[0].strokeStyle = 'yellow'; //blue
    ctx[0].guideText("TEE",p[0],p[1]);
  }
  //draw goal
  var p=transCam(goalpos, cam, cam0, gP, gS);
  if(p[2]>=0){
    ctx[0].fillStyle = 'rgb(255,255,0)'; //yellow
    ctx[0].beginPath();
    ctx[0].arc(p[0], p[1], p[2]*Rgoalpos, 0, Math.PI*2, false);
    ctx[0].fill();
    ctx[0].strokeStyle = 'yellow'; //yellow
    ctx[0].guideText("GOAL",p[0],p[1]);
  }
  //draw ball
  var p=transCam(nowpos, cam, cam0, gP, gS);
  if(p[2]>=0){
    ctx[0].fillStyle = 'rgb(255,255,255)'; //white
    ctx[0].beginPath();
    ctx[0].arc(p[0], p[1], p[2]*Rnowpos, 0, Math.PI*2, false);
    ctx[0].fill();
    ctx[0].strokeStyle = 'yellow'; //white
    ctx[0].guideText("BALL",p[0],p[1]);
  }
  //draw guide
  var p0=transCam(nowpos, cam, cam0, gP, gS);
  var v3d2=dot(shotAngle3d,shotAngle3d);
  var l = 2*HeadSpeed*HeadSpeed*Math.sqrt(v3d2)*shotAnglew/Gravity/mpfairways;
  var p1=transCam(add(nowpos,mulkv(l,shotAngle3d)), cam, cam0, gP, gS);
  if(p0[2]>0 && p1[2]>=0){
    ctx[0].strokeStyle = 'rgb(0,255,255)'; //cyan
    ctx[0].beginPath();
    ctx[0].moveTo(p0[0],p0[1]);
    ctx[0].lineTo(p1[0],p1[1]);
    ctx[0].stroke();
  }
}
//event handlers after queue ------------
var handleMouseDown = function(){
  mdposC = transPos([mouseDownPos[0], mouseDownPos[1] ,cam.screenDistance],gS,gP);
  mmposC = mdposC.clone();
  mdcam         = cam.clone();
  mdshotAngle3d = shotAngle3d.clone();
  isRequestedDraw = true;
}
var handleMouseDragging = function(){
  mmposC = transPos([mousePos[0],mousePos[1],cam.screenDistance],gS,gP);
  var invcamr = getRotate(cam0.dirmz, cam0.dirx, cam.dirmz, cam.dirx);
  var mdposP = mul(invcamr, mdposC);
  var mmposP = mul(invcamr, mmposC);
  if(isShiftKey){
    //shiftキー押しているなら
	var invr = getRotate(mmposP, mdposP);
    shotAngle3d = mul(invr, mdshotAngle3d);
  }else{
    //カメラ位置回転
    var r = getRotate(mdposP, mmposP);
    cam.pos   = mul(r, mdcam.pos);
    cam.dirmz = mul(r, mdcam.dirmz);
    cam.dirx  = mul(r, mdcam.dirx);
  }
  isRequestedDraw = true;
}
var handleMouseUp = function(){
}
var handleMouseMoving = function(){
//
}
var handleMouseWheel = function(){
  var dz = mouseWheel[1]*0.01;
  cam.pos=add(cam.pos, mulkv(dz, cam.dirmz));
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

