import { useEffect, useRef, useState } from "react";

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;

  float yCss = gl_FragCoord.y / uDpr;
  float yNorm = yCss / (uRes.y / uDpr);

  float sl = step(0.66, fract(yCss / 3.0)) * 0.12;

  float bandPos = fract(uTime * 0.07);
  float dBand = abs(fract(yNorm - bandPos + 0.5) - 0.5);
  float band = smoothstep(0.05, 0.0, dBand) * 0.045;

  vec2 c = uv - 0.5;
  float vig = (1.0 - smoothstep(0.42, 0.86, length(vec2(c.x * 1.05, c.y * 1.2)))) * 0.28;
  float corner = (1.0 - smoothstep(0.5, 1.02, length(c * vec2(1.45, 1.3)))) * 0.22;

  float alpha = clamp(sl + band + vig + corner, 0.0, 0.8);
  gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function CrtOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false });
    if (!gl) {
      setFailed(true);
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      setFailed(true);
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uDpr = gl.getUniformLocation(prog, "uDpr");
    const uTime = gl.getUniformLocation(prog, "uTime");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uDpr, dpr);
    };

    const draw = () => {
      resize();
      gl.uniform1f(uTime, reduced ? 0 : (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      if (reduced) draw();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [mounted]);

  if (!mounted) return null;

  if (failed) {
    return <div className="scanlines pointer-events-none fixed inset-0 z-40" aria-hidden />;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 h-full w-full"
    />
  );
}
