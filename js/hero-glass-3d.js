/**
 * PRV Projects — WebGL glass (Three.js MeshPhysicalMaterial transmission)
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.172.0/build/three.module.js";
import { RoomEnvironment } from "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/environments/RoomEnvironment.js";

const THREE_CDN = "0.172.0";

function prefersReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isEnabled() {
  const cfg = window.PRV_CONFIG || {};
  if (cfg.heroWebgl === false) return false;
  if (cfg.effectsEnabled === false) return false;
  return true;
}

function effectiveTheme() {
  return document.documentElement.getAttribute("data-effective-theme") === "dark" ? "dark" : "light";
}

export function initHeroGlass3d() {
  const canvas = document.getElementById("hero-glass-canvas");
  if (!canvas || canvas.dataset.glReady === "1" || !isEnabled() || prefersReduced()) {
    document.body.classList.add("no-hero-webgl");
    return null;
  }

  if (window.matchMedia("(max-width: 720px)").matches) {
    document.body.classList.add("no-hero-webgl");
    return null;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0.2, 4.2);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const accent = new THREE.Color(0x0071e3);
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  const fill = new THREE.DirectionalLight(accent, 0.45);
  fill.position.set(-4, 1, 2);
  scene.add(fill);

  scene.add(new THREE.AmbientLight(0xffffff, effectiveTheme() === "dark" ? 0.35 : 0.55));

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.04,
    transmission: 1,
    thickness: 1.1,
    ior: 1.48,
    transparent: true,
    attenuationColor: new THREE.Color(0x0071e3),
    attenuationDistance: 3.5,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  });

  const pane = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.45, 0.08), glassMat);
  pane.rotation.set(-0.18, 0.42, 0.06);
  scene.add(pane);

  const orbMat = glassMat.clone();
  orbMat.thickness = 0.65;
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.42, 48, 48), orbMat);
  orb.position.set(1.05, 0.55, 0.35);
  scene.add(orb);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.95, 0.03, 16, 80),
    new THREE.MeshPhysicalMaterial({
      color: accent,
      metalness: 0.2,
      roughness: 0.25,
      transmission: 0.85,
      thickness: 0.3,
      transparent: true,
    })
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.z = 0.2;
  scene.add(rim);

  let mouse = { x: 0, y: 0 };
  let raf = 0;
  let t = 0;

  const onMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  };

  window.addEventListener("pointermove", onMove, { passive: true });

  const resize = () => {
    const w = canvas.clientWidth || 320;
    const h = canvas.clientHeight || 360;
    if (w < 8 || h < 8) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const themeObserver = new MutationObserver(() => {
    const dark = effectiveTheme() === "dark";
    scene.children
      .filter((c) => c.isAmbientLight)
      .forEach((l) => {
        l.intensity = dark ? 0.35 : 0.55;
      });
    renderer.setClearColor(0x000000, 0);
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-effective-theme"],
  });

  canvas.dataset.glReady = "1";
  document.body.classList.add("hero-webgl-ready");

  const animate = () => {
    t += 0.012;
    pane.rotation.y = 0.42 + mouse.x * 0.22 + Math.sin(t) * 0.06;
    pane.rotation.x = -0.18 + mouse.y * 0.12 + Math.cos(t * 0.9) * 0.04;
    orb.position.y = 0.55 + Math.sin(t * 1.3) * 0.08;
    orb.rotation.y += 0.008;
    rim.rotation.z += 0.004;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  };
  animate();

  const destroy = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
    ro.disconnect();
    themeObserver.disconnect();
    pmrem.dispose();
    pane.geometry.dispose();
    orb.geometry.dispose();
    rim.geometry.dispose();
    glassMat.dispose();
    orbMat.dispose();
    renderer.dispose();
  };

  window.PRV_HERO_GLASS = { destroy, THREE_CDN };
  return destroy;
}
