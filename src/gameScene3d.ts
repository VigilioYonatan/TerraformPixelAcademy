/**
 * Lazy-loaded Three.js 3D Infrastructure Arena for TerraPixel Academy mini-games (`#/juego/:id`).
 * Uses only a tree-shaken ESM subset (`./vendor/three.mjs`), avoids inline `style` mutations
 * for strict CSP (`style-src 'self'`), and degrades gracefully when WebGL is unavailable.
 */
import type * as ThreeTypes from './vendor/three.mjs';

export type GameCameraPreset = 'iso' | 'top' | 'front';
export type ArenaAnswerStatus = 'idle' | 'correct' | 'wrong';

export interface GameArenaState {
  gameId: string;
  step: number;
  total: number;
  score: number;
  streak: number;
  finished: boolean;
  won: boolean;
  lastStatus: ArenaAnswerStatus;
  theme: 'dark' | 'light';
  reducedMotion: boolean;
}

export interface GameArenaOptions {
  initialState: GameArenaState;
  onNodeSelect?: (nodeTitle: string, nodeRole: string) => void;
}

export interface GameArenaController {
  updateState: (next: GameArenaState) => void;
  setView: (preset: GameCameraPreset) => void;
  toggleAutoRotate: () => boolean;
  resetCamera: () => void;
  dispose: () => void;
}

interface NodeMeta {
  title: string;
  role: string;
  mesh: ThreeTypes.Mesh;
  ring: ThreeTypes.Mesh;
  baseY: number;
}

const ARENA_BLUEPRINTS: Record<string, ReadonlyArray<readonly [string, string]>> = {
  g1: [
    ['Provider Core', 'Inicializa plugins y verifica versiones fijadas'],
    ['State Vault', 'Protege terraform.tfstate con cifrado y bloqueo'],
    ['Compute Cluster', 'Evalúa plan -/+ antes de mutar recursos'],
    ['Output Beacon', 'Expone contratos verificables sin filtrar secretos']
  ],
  g2: [
    ['Gate 1 · fmt/validate', 'Valida sintaxis HCL y formato determinista'],
    ['Gate 2 · Plan Review', 'Inspecciona diff, drift y recursos destructivos'],
    ['Gate 3 · OIDC & Policy', 'Exige identidad efímera y reglas OPA/Conftest'],
    ['Gate 4 · Apply Controlado', 'Ejecuta despliegue autorizado con observabilidad']
  ],
  g3: [
    ['Secret Scanner', 'Bloquea credenciales y canary values en artefactos'],
    ['Blast Radius Shield', 'Contiene reemplazos destructivos en producción'],
    ['IAM Least Privilege', 'Sustituye llaves estáticas por OIDC por entorno'],
    ['Policy Sentinel', 'Impide -auto-approve sin revisión humana']
  ],
  g4: [
    ['HCL Desired', 'Estado deseado versionado en Git'],
    ['Remote State', 'Mapeo de direcciones y lock concurrente'],
    ['Cloud Actual', 'Observación real para detectar drift fuera de banda'],
    ['Reconcile Gate', 'Decide importar, revertir o migrar con moved']
  ],
  g5: [
    ['Network Layer', 'VPC/CIDR sin solapamientos multiambiente'],
    ['Service Layer', 'Cómputo stateless y contratos de módulos'],
    ['Data Vault', 'Persistencia con prevent_destroy y backups'],
    ['FinOps Guard', 'Presupuesto y alertas antes de escalar']
  ]
};

export async function mountGameArena3D(
  container: HTMLElement,
  options: GameArenaOptions
): Promise<GameArenaController | null> {
  let three: typeof ThreeTypes;
  try {
    three = await import('./vendor/three.mjs');
  } catch {
    return null;
  }

  if (!container.isConnected) return null;

  const canvas = document.createElement('canvas');
  canvas.className = 'game-3d-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);

  let renderer: ThreeTypes.WebGLRenderer;
  try {
    renderer = new three.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
  } catch {
    canvas.remove();
    return null;
  }

  const scene = new three.Scene();
  const width = Math.max(320, container.clientWidth || 560);
  const height = Math.max(260, container.clientHeight || 340);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);

  const camera = new three.PerspectiveCamera(44, width / height, 0.1, 100);
  let azimuth = 0.72;
  let elevation = 0.56;
  let radius = 7.4;
  let autoRotate = !options.initialState.reducedMotion;
  let shakeIntensity = 0;
  let state = options.initialState;
  let selectedIndex = 0;

  const ambient = new three.AmbientLight(0xffffff, 0.9);
  const keyLight = new three.DirectionalLight(0xd8b4fe, 1.35);
  keyLight.position.set(5, 8, 6);
  const rimLight = new three.PointLight(0x48d7ed, 1.4, 24);
  rimLight.position.set(-4, 3, -4);
  scene.add(ambient, keyLight, rimLight);

  const world = new three.Group();
  scene.add(world);

  const grid = new three.GridHelper(10, 12, 0x7c3aed, 0x3b2f63);
  grid.position.y = -1.25;
  world.add(grid);

  const coreGeo = new three.OctahedronGeometry(0.68, 0);
  const coreMat = new three.MeshStandardMaterial({
    color: 0xa855f7,
    emissive: 0x3b0764,
    metalness: 0.35,
    roughness: 0.25
  });
  const coreMesh = new three.Mesh(coreGeo, coreMat);
  coreMesh.position.set(0, 0.35, 0);
  world.add(coreMesh);

  const blueprint = ARENA_BLUEPRINTS[state.gameId] || ARENA_BLUEPRINTS.g1;
  const nodes: NodeMeta[] = [];
  const geometriesToDispose: ThreeTypes.BufferGeometry[] = [coreGeo];
  const materialsToDispose: ThreeTypes.Material[] = [coreMat];

  const boxGeo = new three.BoxGeometry(0.95, 0.72, 0.95);
  const cylGeo = new three.CylinderGeometry(0.48, 0.56, 0.85, 6);
  const ringGeo = new three.TorusGeometry(0.76, 0.045, 10, 32);
  geometriesToDispose.push(boxGeo, cylGeo, ringGeo);

  const lineMat = new three.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.6 });
  materialsToDispose.push(lineMat);

  blueprint.forEach(([title, role], idx) => {
    const isPipeline = state.gameId === 'g2';
    const isStack = state.gameId === 'g5';
    let x = 0;
    let y = 0.2;
    let z = 0;
    if (isPipeline) {
      x = (idx - 1.5) * 1.95;
      y = 0.15;
      z = 0;
    } else if (isStack) {
      const angle = (idx * Math.PI) / 2;
      x = Math.cos(angle) * 2.1;
      z = Math.sin(angle) * 2.1;
      y = -0.3 + idx * 0.48;
    } else {
      const angle = (idx * Math.PI) / 2 + Math.PI / 4;
      x = Math.cos(angle) * 2.45;
      z = Math.sin(angle) * 2.45;
      y = idx % 2 === 0 ? 0.28 : -0.1;
    }

    const mat = new three.MeshStandardMaterial({
      color: 0x6366f1,
      emissive: 0x1e1b4b,
      metalness: 0.3,
      roughness: 0.32
    });
    const ringMat = new three.MeshStandardMaterial({
      color: 0x48d7ed,
      emissive: 0x0e7490,
      metalness: 0.2,
      roughness: 0.4
    });
    materialsToDispose.push(mat, ringMat);

    const mesh = new three.Mesh(idx % 2 === 0 ? boxGeo : cylGeo, mat);
    mesh.position.set(x, y, z);
    mesh.userData = { nodeIndex: idx };
    world.add(mesh);

    const ring = new three.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(x, y - 0.55, z);
    world.add(ring);

    const linkGeo = new three.BufferGeometry().setFromPoints([
      new three.Vector3(0, 0.35, 0),
      new three.Vector3(x, y, z)
    ]);
    geometriesToDispose.push(linkGeo);
    world.add(new three.Line(linkGeo, lineMat));

    nodes.push({ title, role, mesh, ring, baseY: y });
  });

  function applyThemeAndStatus(next: GameArenaState): void {
    const prevStep = state.step;
    const prevStatus = state.lastStatus;
    state = next;

    if (next.lastStatus === 'wrong' && (prevStatus !== 'wrong' || prevStep !== next.step) && !next.reducedMotion) {
      shakeIntensity = 0.22;
    }
    if (next.reducedMotion) {
      autoRotate = false;
    }

    scene.background = new three.Color(next.theme === 'light' ? 0xf3effc : 0x0d0f24);

    if (next.finished) {
      coreMat.color.setHex(next.won ? 0x10b981 : 0xf59e0b);
      coreMat.emissive.setHex(next.won ? 0x065f46 : 0x78350f);
    } else if (next.lastStatus === 'wrong') {
      coreMat.color.setHex(0xf43f5e);
      coreMat.emissive.setHex(0x881337);
    } else if (next.lastStatus === 'correct') {
      coreMat.color.setHex(0x34d399);
      coreMat.emissive.setHex(0x065f46);
    } else {
      coreMat.color.setHex(0xa855f7);
      coreMat.emissive.setHex(0x3b0764);
    }

    const activeIdx = Math.min(nodes.length - 1, next.step % nodes.length);
    nodes.forEach((node, i) => {
      const mat = node.mesh.material as ThreeTypes.MeshStandardMaterial;
      const ringMat = node.ring.material as ThreeTypes.MeshStandardMaterial;
      const solved = i < next.score;
      const isActive = !next.finished && i === activeIdx;
      const isSelected = i === selectedIndex;

      if (next.finished && next.won) {
        mat.color.setHex(0x34d399);
        mat.emissive.setHex(0x065f46);
        ringMat.color.setHex(0x48d7ed);
      } else if (isActive && next.lastStatus === 'wrong') {
        mat.color.setHex(0xfb7185);
        mat.emissive.setHex(0x9f1239);
        ringMat.color.setHex(0xf43f5e);
      } else if (solved || (isActive && next.lastStatus === 'correct')) {
        mat.color.setHex(0x34d399);
        mat.emissive.setHex(0x064e3b);
        ringMat.color.setHex(0x66e7a9);
      } else if (isActive) {
        mat.color.setHex(0x48d7ed);
        mat.emissive.setHex(0x155e75);
        ringMat.color.setHex(0xc084fc);
      } else {
        mat.color.setHex(isSelected ? 0x8b5cf6 : 0x5b4d96);
        mat.emissive.setHex(0x1e1b4b);
        ringMat.color.setHex(isSelected ? 0xf9c96d : 0x6d28d9);
      }
    });
  }

  function updateCameraPosition(timeSec: number): void {
    const shakeX = shakeIntensity > 0.005 ? Math.sin(timeSec * 48) * shakeIntensity : 0;
    const shakeY = shakeIntensity > 0.005 ? Math.cos(timeSec * 39) * shakeIntensity * 0.6 : 0;
    camera.position.x = Math.sin(azimuth) * Math.cos(elevation) * radius + shakeX;
    camera.position.y = Math.sin(elevation) * radius + shakeY;
    camera.position.z = Math.cos(azimuth) * Math.cos(elevation) * radius;
    camera.lookAt(0, 0.15, 0);
  }

  const raycaster = new three.Raycaster();
  const pointer = new three.Vector2();
  let isDragging = false;
  let moved = false;
  let lastX = 0;
  let lastY = 0;

  const onPointerDown = (ev: PointerEvent) => {
    isDragging = true;
    moved = false;
    lastX = ev.clientX;
    lastY = ev.clientY;
  };
  const onPointerMove = (ev: PointerEvent) => {
    if (!isDragging) return;
    const dx = ev.clientX - lastX;
    const dy = ev.clientY - lastY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
    azimuth -= dx * 0.008;
    elevation = Math.max(0.18, Math.min(1.32, elevation + dy * 0.006));
    lastX = ev.clientX;
    lastY = ev.clientY;
  };
  const onPointerUp = (ev: PointerEvent) => {
    const wasClick = isDragging && !moved;
    isDragging = false;
    if (!wasClick) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(nodes.map((n) => n.mesh));
    if (hits.length > 0) {
      const idx = Number(hits[0].object.userData?.nodeIndex ?? 0);
      const picked = nodes[idx];
      if (picked) {
        selectedIndex = idx;
        applyThemeAndStatus(state);
        options.onNodeSelect?.(picked.title, picked.role);
      }
    }
  };
  const onResize = () => {
    if (!container.isConnected) return;
    const w = Math.max(320, container.clientWidth || 560);
    const h = Math.max(260, container.clientHeight || 340);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('resize', onResize);

  applyThemeAndStatus(options.initialState);
  options.onNodeSelect?.(nodes[0].title, nodes[0].role);

  let rafId = 0;
  let disposed = false;
  const startMs = performance.now();

  const tick = (nowMs: number) => {
    if (disposed) return;
    const t = (nowMs - startMs) * 0.001;
    if (autoRotate && !state.reducedMotion && !isDragging) {
      azimuth += 0.0038;
    }
    if (shakeIntensity > 0.001) {
      shakeIntensity *= 0.88;
    } else {
      shakeIntensity = 0;
    }

    if (!state.reducedMotion) {
      coreMesh.rotation.y = t * 0.85;
      coreMesh.rotation.x = Math.sin(t * 0.7) * 0.2;
      nodes.forEach((n, idx) => {
        n.mesh.position.y = n.baseY + Math.sin(t * 1.9 + idx * 1.2) * 0.08;
        n.ring.rotation.z = t * (idx % 2 === 0 ? 0.6 : -0.6);
      });
    }

    updateCameraPosition(t);
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);

  return {
    updateState(next: GameArenaState) {
      applyThemeAndStatus(next);
    },
    setView(preset: GameCameraPreset) {
      if (preset === 'iso') {
        azimuth = 0.72;
        elevation = 0.56;
        radius = 7.4;
      } else if (preset === 'top') {
        azimuth = 0;
        elevation = 1.32;
        radius = 8.1;
      } else {
        azimuth = 0;
        elevation = 0.24;
        radius = 7.6;
      }
    },
    toggleAutoRotate() {
      autoRotate = !autoRotate;
      return autoRotate;
    },
    resetCamera() {
      azimuth = 0.72;
      elevation = 0.56;
      radius = 7.4;
      autoRotate = !state.reducedMotion;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);
      for (const g of geometriesToDispose) g.dispose();
      for (const m of materialsToDispose) m.dispose();
      renderer.dispose();
      canvas.remove();
    }
  };
}
