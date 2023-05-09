(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const u of i.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&o(u)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();const F=`
  precision mediump float;

  attribute vec4 aPosition;

  uniform float uCellWidth;
  uniform float uCellHeight;

  varying float vWidth;
  varying float vHeight;
  varying vec2 vTexCoord; 
  varying vec2 neighbors[8];
   
  void main() {
    gl_Position = aPosition;   

    vTexCoord = (aPosition.xy + vec2(1.0, 1.0)) * 0.5;
  
    neighbors[0] = vec2(uCellWidth, uCellHeight);
    neighbors[1] = vec2(-uCellWidth, -uCellHeight);
    neighbors[2] = vec2(uCellWidth, -uCellHeight);
    neighbors[3] = vec2(-uCellWidth, uCellHeight);
    neighbors[4] = vec2(0, uCellHeight);
    neighbors[5] = vec2(uCellWidth, 0);
    neighbors[6] = vec2(0, -uCellHeight);
    neighbors[7] = vec2(-uCellWidth, 0);

    vWidth = uCellWidth;
    vHeight = uCellHeight;
  }
`,H=`
  precision mediump float;

  uniform sampler2D uTexture;
  uniform vec2 uAliveCell;
  
  varying float vWidth, vHeight;
  varying vec2 vTexCoord;
  varying vec2 neighbors[8];
 
  void main() {
    int count = 0;
    
    for (int i = 0; i <= 7; i++) {
      if (texture2D(uTexture, vTexCoord + neighbors[i]).g == 1.0) count += 1; 
    }

    float g = texture2D(uTexture, vTexCoord).g;
    if ((count == 3) || (g == 1.0 && count == 2) || (abs(vTexCoord.x - uAliveCell.x) < vWidth * 5.0 &&
      abs(vTexCoord.y - uAliveCell.y) < vHeight * 5.0))
      gl_FragColor = vec4(0.9, 1.0, 0.9, 1);
    else
      gl_FragColor = vec4(0.2, 0.1, 0.2, 1);
  }
`,W=`
   precision mediump float;
    
   uniform sampler2D uTexture; 
   varying vec2 vTexCoord;
  
   void main() {
    gl_FragColor = texture2D(uTexture, vTexCoord);
   }
`,X=t=>{const e=t.getContext("webgl2");return e||(alert("Sorry, your device or browser not support WebGL"),null)},m=(t,e,n)=>{const o=t.createShader(e);return t.shaderSource(o,n),t.compileShader(o),t.getShaderParameter(o,t.COMPILE_STATUS)?o:(console.log("Failed to compile shader:",t.getShaderInfoLog(o)),t.deleteShader(o),null)},_=(t,e,n)=>{const o=t.createProgram();return t.attachShader(o,e),t.attachShader(o,n),t.linkProgram(o),t.getProgramParameter(o,t.LINK_STATUS)?o:(console.log("Failed to create a shader program:",t.getProgramInfoLog(o)),t.deleteProgram(o),null)},w=(t,e)=>{const n=new Uint8Array(t*e*4);for(let o=0;o<n.length;o+=4)n[o+1]=Math.random()>.5?255:0,n[o+3]=255;return n},b=(t,e,n,o=!1)=>{const r=o?w(e,n):null,i=t.createTexture();return t.bindTexture(t.TEXTURE_2D,i),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e,n,0,t.RGBA,t.UNSIGNED_BYTE,r),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.REPEAT),t.bindTexture(t.TEXTURE_2D,null),i},L=(t,e)=>{const n=t.getBoundingClientRect(),o=e.clientX-n.left,r=e.clientY-n.top;return{xPos:o,yPos:r}};let a=1024,s=768,E=!1,f=!1,c=[];const G=t=>{const e=document.getElementById("clearGridBtn"),n=document.getElementById("randomGridBtn");e.addEventListener("click",()=>{E=!1,T(t)}),n.addEventListener("click",()=>{E=!0,T(t)})},N=t=>{const e=document.getElementById("widthInput");e.value=a;const n=document.getElementById("heightInput");n.value=s,document.getElementById("updateSizeBtn").addEventListener("click",()=>{const r=e.value,i=n.value;if(r!==a||i!==s){a=r,s=i,T(t);return}})},M=t=>{const e=r=>{f=!0,c.push(L(t,r))},n=r=>{f&&c.push(L(t,r))},o=()=>{c=[],f=!1};t.addEventListener("mousedown",e),t.addEventListener("mousemove",n),t.addEventListener("mouseup",o),t.addEventListener("mouseleave",o)},O=()=>{const t=document.getElementById("app-canvas");G(t),N(t),M(t),T(t)},T=t=>{t.width=a,t.height=s;const e=X(t);if(!e)return;const n=m(e,e.VERTEX_SHADER,F),o=m(e,e.FRAGMENT_SHADER,H),r=_(e,n,o),i=m(e,e.VERTEX_SHADER,F),u=m(e,e.FRAGMENT_SHADER,W),v=_(e,i,u);let l=b(e,a,s,E),h=b(e,a,s);const D=[1,1,-1,1,1,-1,-1,-1],U=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,U),e.bufferData(e.ARRAY_BUFFER,new Float32Array(D),e.STATIC_DRAW);const g=e.getAttribLocation(v,"aPosition");e.enableVertexAttribArray(g),e.vertexAttribPointer(g,2,e.FLOAT,!1,0,0);const B=e.createFramebuffer(),C=e.getUniformLocation(r,"uCellWidth"),I=e.getUniformLocation(r,"uCellHeight"),x=e.getUniformLocation(r,"uAliveCell");e.activeTexture(e.TEXTURE0);const p=1e3/60;let R=0;const A=P=>{requestAnimationFrame(A);const S=P-R;if(S>p){e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),e.useProgram(r),e.uniform1f(C,1/a),e.uniform1f(I,1/s);let d=[-1,-1];if(f&&c.length>0){const y=c.shift();d[0]=y.xPos/a,d[1]=1-y.yPos/s}e.uniform2f(x,d[0],d[1]),e.bindFramebuffer(e.FRAMEBUFFER,B),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,h,0),e.viewport(0,0,a,s),e.bindTexture(e.TEXTURE_2D,l),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.useProgram(null),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,null,0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.useProgram(v),e.viewport(0,0,a,s),e.bindTexture(e.TEXTURE_2D,l),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.bindTexture(e.TEXTURE_2D,null),e.useProgram(null),[h,l]=[l,h],R=P-S%p}};requestAnimationFrame(A)};O();
