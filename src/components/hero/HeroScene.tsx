"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { ACCENT } from "@/lib/util";
import { usePageVisible } from "@/lib/hooks";

// Camera-facing constellation (spread in X/Y, varied Z for depth) so the four
// agents stay separated and never collapse edge-on like a spinning ring would.
const AGENTS = [
  { name: "Claude Code", tag: "CC", pos: [-1.35, 0.95, 0.35] as const },
  { name: "Cursor", tag: "CU", pos: [1.5, 1.1, -0.45] as const },
  { name: "Codex", tag: "CX", pos: [1.65, -0.95, 0.25] as const },
  { name: "Gemini", tag: "GE", pos: [-1.2, -1.1, -0.3] as const },
];
const TRAVEL = 2500;
const HOLD = 2700;
const MAX_PARTICLES = 130;
const accentColor = new THREE.Color(ACCENT);
const WHITE = new THREE.Color("#ffffff");

function nodePos(i: number): THREE.Vector3 {
  const [x, y, z] = AGENTS[i].pos;
  return new THREE.Vector3(x, y, z);
}

function quadBezier(
  p0: THREE.Vector3,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  t: number,
  out: THREE.Vector3
) {
  const u = 1 - t;
  out.set(
    u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
    u * u * p0.z + 2 * u * t * p1.z + t * t * p2.z
  );
  return out;
}

const easeIO = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

type Particle = { slot: number; life: number; max: number; vel: THREE.Vector3 };

type Pool = {
  positions: Float32Array;
  colors: Float32Array;
  active: Particle[];
  free: number[];
};

function createPool(): Pool {
  const positions = new Float32Array(MAX_PARTICLES * 3);
  const colors = new Float32Array(MAX_PARTICLES * 3);
  for (let i = 0; i < MAX_PARTICLES; i++) positions[i * 3 + 1] = -999;
  return {
    positions,
    colors,
    active: [],
    free: Array.from({ length: MAX_PARTICLES }, (_, i) => i),
  };
}

function Scene() {
  const group = useRef<THREE.Group>(null);
  const batonGroup = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const glyphGroup = useRef<THREE.Group>(null);
  const glyphDiv = useRef<HTMLDivElement>(null);
  // per-node halo material refs (for active glow)
  const halos = useRef<(THREE.SpriteMaterial | null)[]>([]);

  // soft radial glow texture for the node halos (premium glow vs a hard disc)
  const glowTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.22, "rgba(255,255,255,0.55)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);

  // pass state
  const pass = useRef({
    from: 0,
    to: 1,
    t: 0,
    phase: "travel" as "travel" | "hold",
  });
  const theta = useRef(0);
  const par = useRef({ x: 0, y: 0 });
  const targetPar = useRef({ x: 0, y: 0 });

  // window-level parallax target (the canvas has pointer-events:none so the
  // hero CTAs stay clickable — so we can't rely on R3F's own pointer).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      targetPar.current.x = e.clientX / window.innerWidth - 0.5;
      targetPar.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // particle pool — created lazily inside the frame loop (never touched in render)
  const poolRef = useRef<Pool | null>(null);

  const tmp = useMemo(() => new THREE.Vector3(), []);
  const tmp2 = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);

  useFrame((_, delta) => {
    const dtMs = Math.min(delta * 1000, 50);
    const g = group.current;
    if (!g) return;

    // lazy-init the particle pool + wire its buffers into the geometry once
    if (!poolRef.current) {
      poolRef.current = createPool();
      if (points.current) {
        const geo = points.current.geometry;
        geo.setAttribute("position", new THREE.BufferAttribute(poolRef.current.positions, 3));
        geo.setAttribute("color", new THREE.BufferAttribute(poolRef.current.colors, 3));
      }
    }
    const pool = poolRef.current;

    // gentle wobble (never a full spin → never edge-on) + mouse parallax
    theta.current += dtMs;
    par.current.x += (targetPar.current.x * 0.5 - par.current.x) * 0.04;
    par.current.y += (targetPar.current.y * 0.32 - par.current.y) * 0.04;
    g.rotation.y = Math.sin(theta.current * 0.00018) * 0.3 + par.current.x;
    g.rotation.x = -0.05 + Math.sin(theta.current * 0.00012) * 0.07 + par.current.y;

    // advance pass
    const p = pass.current;
    p.t += dtMs;
    if (p.phase === "travel" && p.t >= TRAVEL) {
      p.phase = "hold";
      p.t = 0;
      // trigger pulse + glyph at receiver
      const rp = nodePos(p.to);
      if (pulse.current) {
        pulse.current.position.copy(rp);
        pulse.current.scale.setScalar(0.01);
        (pulse.current.material as THREE.MeshBasicMaterial).opacity = 0.7;
        pulse.current.userData.t = 0;
      }
      if (glyphGroup.current) {
        glyphGroup.current.position.set(rp.x, rp.y, rp.z);
        glyphGroup.current.userData.t = 0;
      }
    } else if (p.phase === "hold" && p.t >= HOLD) {
      const from = p.to;
      let to = Math.floor(Math.random() * AGENTS.length);
      if (to === from) to = (to + 1) % AGENTS.length;
      pass.current = { from, to, t: 0, phase: "travel" };
    }

    // baton along bezier
    const baton = batonGroup.current;
    if (baton) {
      if (p.phase === "travel") {
        baton.visible = true;
        const t = easeIO(Math.min(p.t / TRAVEL, 1));
        const p0 = nodePos(p.from);
        const p2 = nodePos(p.to);
        const p1 = tmp2
          .copy(p0)
          .add(p2)
          .multiplyScalar(0.5);
        p1.z = Math.max(p0.z, p2.z) + 1.7; // bulge toward the viewer
        p1.y += 0.3;
        quadBezier(p0, p1, p2, t, tmp);
        baton.position.copy(tmp);
        // orient along travel direction
        quadBezier(p0, p1, p2, Math.min(t + 0.02, 1), dir).sub(tmp).normalize();
        quat.setFromUnitVectors(up, dir);
        baton.quaternion.copy(quat);
        // spawn trail particles
        for (let k = 0; k < 2 && pool.free.length; k++) {
          const slot = pool.free.pop()!;
          pool.active.push({
            slot,
            life: 0,
            max: 480 + Math.random() * 280,
            vel: new THREE.Vector3(
              (Math.random() - 0.5) * 0.4,
              (Math.random() - 0.5) * 0.4 + 0.1,
              (Math.random() - 0.5) * 0.4
            ),
          });
          pool.positions[slot * 3] = tmp.x + (Math.random() - 0.5) * 0.1;
          pool.positions[slot * 3 + 1] = tmp.y + (Math.random() - 0.5) * 0.1;
          pool.positions[slot * 3 + 2] = tmp.z + (Math.random() - 0.5) * 0.1;
        }
      } else {
        baton.visible = false;
      }
    }

    // age particles
    const dtS = dtMs / 1000;
    for (let i = pool.active.length - 1; i >= 0; i--) {
      const pt = pool.active[i];
      pt.life += dtMs;
      const s = pt.slot;
      if (pt.life >= pt.max) {
        pool.positions[s * 3 + 1] = -999;
        pool.colors[s * 3] = pool.colors[s * 3 + 1] = pool.colors[s * 3 + 2] = 0;
        pool.active.splice(i, 1);
        pool.free.push(s);
        continue;
      }
      pool.positions[s * 3] += pt.vel.x * dtS;
      pool.positions[s * 3 + 1] += pt.vel.y * dtS;
      pool.positions[s * 3 + 2] += pt.vel.z * dtS;
      const alpha = (1 - pt.life / pt.max) * 0.6;
      pool.colors[s * 3] = accentColor.r * alpha;
      pool.colors[s * 3 + 1] = accentColor.g * alpha;
      pool.colors[s * 3 + 2] = accentColor.b * alpha;
    }
    if (points.current) {
      const geo = points.current.geometry;
      (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (geo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }

    // pulse ring
    if (pulse.current && pulse.current.userData.t !== undefined) {
      pulse.current.userData.t += dtMs;
      const k = pulse.current.userData.t / 900;
      if (k >= 1) {
        (pulse.current.material as THREE.MeshBasicMaterial).opacity = 0;
      } else {
        pulse.current.scale.setScalar(0.3 + k * 1.5);
        (pulse.current.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.7;
      }
    }

    // node active glow
    for (let i = 0; i < AGENTS.length; i++) {
      const mat = halos.current[i];
      if (!mat) continue;
      const active =
        (p.phase === "travel" && i === p.from && p.t < 700) ||
        (p.phase === "hold" && i === p.to);
      const target = active ? 0.7 : 0.16;
      mat.opacity += (target - mat.opacity) * 0.12;
      mat.color.lerp(active ? accentColor : WHITE, 0.08);
    }

    // HANDOFF.md glyph fade + rise
    if (glyphGroup.current && glyphDiv.current) {
      const ud = glyphGroup.current.userData;
      if (ud.t !== undefined && ud.t < 1600) {
        ud.t += dtMs;
        const k = ud.t / 1600;
        const a = k < 0.15 ? k / 0.15 : 1 - Math.max(0, (k - 0.55) / 0.45);
        glyphGroup.current.position.y = nodePos(pass.current.to).y + 0.6 + k * 0.5;
        glyphDiv.current.style.opacity = String(Math.max(0, a));
      } else if (glyphDiv.current.style.opacity !== "0") {
        glyphDiv.current.style.opacity = "0";
      }
    }
  });

  return (
    <group ref={group} position={[0.95, 0.1, 0]}>
      {/* faint inter-node lattice */}
      <Lattice />

      {/* nodes */}
      {AGENTS.map((agent, i) => {
        const pos = nodePos(i);
        return (
          <group key={agent.tag} position={pos}>
            {/* soft glow halo */}
            <sprite scale={[1.7, 1.7, 1]}>
              <spriteMaterial
                ref={(m) => {
                  halos.current[i] = m;
                }}
                map={glowTex}
                color="#ffffff"
                transparent
                opacity={0.16}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </sprite>
            {/* glassy body */}
            <mesh>
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshStandardMaterial
                color="#1a1a22"
                roughness={0.2}
                metalness={0.1}
                transparent
                opacity={0.6}
                emissive="#0c0c10"
              />
            </mesh>
            {/* tag, centered on the node */}
            <Html center distanceFactor={8} style={{ pointerEvents: "none" }} zIndexRange={[10, 0]}>
              <span className="r3f-node-tag">{agent.tag}</span>
            </Html>
            {/* name, below the node */}
            <Html center position={[0, -0.62, 0]} distanceFactor={8} style={{ pointerEvents: "none" }} zIndexRange={[10, 0]}>
              <span className="r3f-node-name">{agent.name}</span>
            </Html>
          </group>
        );
      })}

      {/* arrival pulse ring (faces the camera) */}
      <mesh ref={pulse}>
        <ringGeometry args={[0.34, 0.4, 48]} />
        <meshBasicMaterial
          color={ACCENT}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* HANDOFF.md glyph at receiver */}
      <group ref={glyphGroup}>
        <Html center distanceFactor={9} style={{ pointerEvents: "none" }}>
          <div ref={glyphDiv} className="r3f-glyph" style={{ opacity: 0 }}>
            HANDOFF.md
          </div>
        </Html>
      </group>

      {/* the baton */}
      <group ref={batonGroup} visible={false}>
        <mesh>
          <capsuleGeometry args={[0.07, 0.5, 8, 16]} />
          <meshBasicMaterial color={ACCENT} toneMapped={false} />
        </mesh>
        <mesh>
          <capsuleGeometry args={[0.03, 0.34, 6, 12]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <pointLight color={ACCENT} intensity={6} distance={3} />
      </group>

      {/* particle trail (geometry buffers attached in the frame loop) */}
      <points ref={points}>
        <bufferGeometry />
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
          toneMapped={false}
        />
      </points>
    </group>
  );
}

function Lattice() {
  const geo = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < AGENTS.length; i++) {
      for (let j = i + 1; j < AGENTS.length; j++) {
        const a = nodePos(i);
        const b = nodePos(j);
        pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.05} />
    </lineSegments>
  );
}

export default function HeroScene() {
  const visible = usePageVisible();
  return (
    <Canvas
      className="hero-canvas"
      camera={{ position: [0, 0, 7], fov: 42 }}
      dpr={[1, 1.5]}
      frameloop={visible ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      // R3F sets position:relative inline by default — override so the canvas is
      // a full-bleed background behind the hero copy (not an in-flow flex item).
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={0.8} />
      <Scene />
      <EffectComposer>
        <Bloom
          intensity={0.9}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.3}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
