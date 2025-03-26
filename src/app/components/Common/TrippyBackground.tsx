/**
 * 
 * 
 * 
 * 
 * 
 * Honestly don't even look at this.
 * It's just buns
 * 
 * 
 * 
 * 
 * 
 * 
 */

import { useEffect, useRef } from "react";

const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  // Original by localthunk (https://www.playbalatro.com)

  // Configuration
  #define SPIN_ROTATION -1.0
  #define SPIN_SPEED 0.1
  #define OFFSET vec2(0.0)
  #define COLOUR_1 vec4(0.0, 0.0, 0.0, 1.0)
  #define COLOUR_2 vec4(0.14, 0.14, 0.14, 1.0)
  #define COLOUR_3 vec4(0.0, 0.0, 0.0, 1.0)
  #define CONTRAST 5.0
  #define LIGTHING 0.3
  #define SPIN_AMOUNT 0.1
  #define PIXEL_FILTER 3000.0
  #define SPIN_EASE 1.0
  #define PI 3.14159265359

  uniform float iTime;
  uniform vec2 iResolution;
  const bool isRotate = true;

  vec4 effect(vec2 screenSize, vec2 screen_coords) {
    float pixel_size = length(screenSize.xy) / PIXEL_FILTER;
    vec2 uv = (floor(screen_coords.xy*(1./pixel_size))*pixel_size - 0.5*screenSize.xy)/length(screenSize.xy) - OFFSET;
    float uv_len = length(uv);

    float speed = (SPIN_ROTATION*SPIN_EASE*0.2);
    if(isRotate){
      speed = iTime * speed;
    }
    speed += 302.2;
    float new_pixel_angle = atan(uv.y, uv.x) + speed - SPIN_EASE*20.*(1.*SPIN_AMOUNT*uv_len + (1. - 1.*SPIN_AMOUNT));
    vec2 mid = (screenSize.xy/length(screenSize.xy))/2.;
    uv = (vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid);

    uv *= 30.;
    speed = iTime*(SPIN_SPEED);
    vec2 uv2 = vec2(uv.x+uv.y);

    for(int i=0; i < 5; i++) {
      uv2 += sin(max(uv.x, uv.y)) + uv;
      uv  += 0.5*vec2(cos(5.1123314 + 0.353*uv2.y + speed*0.131121),sin(uv2.x - 0.113*speed));
      uv  -= 1.0*cos(uv.x + uv.y) - 1.0*sin(uv.x*0.711 - uv.y);
    }

    float contrast_mod = (0.25*CONTRAST + 0.5*SPIN_AMOUNT + 1.2);
    float paint_res = min(2., max(0.,length(uv)*(0.035)*contrast_mod));
    float c1p = max(0.,1. - contrast_mod*abs(1.-paint_res));
    float c2p = max(0.,1. - contrast_mod*abs(paint_res));
    float c3p = 1. - min(1., c1p + c2p);
    float light = (LIGTHING - 0.2)*max(c1p*5. - 4., 0.) + LIGTHING*max(c2p*5. - 4., 0.);
    return (0.3/CONTRAST)*COLOUR_1 + (1. - 0.3/CONTRAST)*(COLOUR_1*c1p + COLOUR_2*c2p + vec4(c3p*COLOUR_3.rgb, c3p*COLOUR_1.a)) + light;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    gl_FragColor = effect(iResolution.xy, uv * iResolution.xy);
  }
`;

export const TrippyBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);

  const compileShader = (
    source: string,
    type: number,
    gl: WebGLRenderingContext
  ) => {
    const shader = gl.createShader(type);
    if (!shader) {
      console.error("Unable to create shader");
      return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  };

  const createProgram = (gl: WebGLRenderingContext) => {
    const vShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER, gl);
    const fShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER, gl);
    if (!vShader || !fShader) return null;

    const prog = gl.createProgram();
    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      return null;
    }
    return prog;
  };

  const setupBuffers = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    const vertices = new Float32Array([-1, -1, 3, -1, -1, 3]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  };

  const render = (time: number) => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    if (!(gl && program && canvas)) return;

    gl.useProgram(program);
    const timeLocation = gl.getUniformLocation(program, "iTime");
    const resLocation = gl.getUniformLocation(program, "iResolution");
    if (timeLocation === null || resLocation === null) {
      console.error("Uniform location not found");
      return;
    }
    gl.uniform1f(timeLocation, time * 0.001);
    gl.uniform2f(resLocation, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(render);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas not found");
      return;
    }

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }
    glRef.current = gl;

    const prog = createProgram(gl);
    if (!prog) {
      console.error("Program creation failed");
      return;
    }
    programRef.current = prog;
    gl.useProgram(prog);
    setupBuffers(gl, prog);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    requestAnimationFrame(render);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width="600"
      height="900"
      className="w-full h-full rounded-2xl"
    ></canvas>
  );
};
