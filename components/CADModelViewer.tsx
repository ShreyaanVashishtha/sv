'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { CADModelItem } from '@/types/content';
import {
  RotateCcw,
  Play,
  Pause,
  Grid,
  Maximize2,
  Minimize2,
  Box,
  Layers,
  Sparkles,
  Sun,
  Eye,
  Compass,
} from 'lucide-react';

interface CADModelViewerProps {
  model: CADModelItem;
  className?: string;
  wireframeDefault?: boolean;
}

export function CADModelViewer({
  model,
  className = '',
  wireframeDefault = false,
}: CADModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentModelGroup = useRef<THREE.Group | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(true);
  const [isWireframe, setIsWireframe] = useState(wireframeDefault);
  const [showGrid, setShowGrid] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lightingPreset, setLightingPreset] = useState<'hangar' | 'studio' | 'blueprint'>('hangar');
  const [activeFaceCount, setActiveFaceCount] = useState<number>(0);

  // Procedural fallback generators for rocketry & mechanical models
  const buildProceduralModel = useCallback((type: string): THREE.Group => {
    const group = new THREE.Group();

    // High quality metallic materials
    const aluminumMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4d8dd,
      metalness: 0.9,
      roughness: 0.25,
      wireframe: isWireframe,
    });

    const darkAnodizedMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2329,
      metalness: 0.85,
      roughness: 0.35,
      wireframe: isWireframe,
    });

    const carbonFiberMaterial = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.45,
      metalness: 0.3,
      wireframe: isWireframe,
    });

    const brassStandoffMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: isWireframe,
    });

    const accentCyanMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x004455,
      roughness: 0.2,
      metalness: 0.7,
      wireframe: isWireframe,
    });

    if (type.includes('fin-can')) {
      // Supersonic Fin Can Assembly
      // Main Rocket Body Tube Sleeve
      const bodyGeo = new THREE.CylinderGeometry(1.6, 1.6, 4.8, 48, 1, true);
      const bodyMesh = new THREE.Mesh(bodyGeo, darkAnodizedMaterial);
      group.add(bodyMesh);

      // Inner Motor Mount Tube
      const motorTubeGeo = new THREE.CylinderGeometry(0.9, 0.9, 5.2, 32);
      const motorTubeMesh = new THREE.Mesh(motorTubeGeo, aluminumMaterial);
      group.add(motorTubeMesh);

      // Centering Rings (2 rings)
      const ringGeo = new THREE.CylinderGeometry(1.58, 1.58, 0.2, 32);
      const ring1 = new THREE.Mesh(ringGeo, carbonFiberMaterial);
      ring1.position.y = 1.6;
      const ring2 = ring1.clone();
      ring2.position.y = -1.6;
      group.add(ring1);
      group.add(ring2);

      // 4 Swept Trapezoidal Fins with leading-edge chamfers
      for (let i = 0; i < 4; i++) {
        const finShape = new THREE.Shape();
        finShape.moveTo(0, -2.2);
        finShape.lineTo(2.4, -2.4);
        finShape.lineTo(1.8, -0.6);
        finShape.lineTo(0, 1.4);
        finShape.closePath();

        const extrudeSettings = {
          steps: 1,
          depth: 0.08,
          bevelEnabled: true,
          bevelThickness: 0.04,
          bevelSize: 0.04,
          bevelSegments: 3,
        };

        const finGeo = new THREE.ExtrudeGeometry(finShape, extrudeSettings);
        const finMesh = new THREE.Mesh(finGeo, aluminumMaterial);
        finMesh.rotation.y = (i * Math.PI) / 2;
        group.add(finMesh);
      }

      // Motor Retainer Ring at Base
      const retainerGeo = new THREE.TorusGeometry(1.1, 0.15, 16, 32);
      const retainerMesh = new THREE.Mesh(retainerGeo, brassStandoffMaterial);
      retainerMesh.rotation.x = Math.PI / 2;
      retainerMesh.position.y = -2.45;
      group.add(retainerMesh);
    } else if (type.includes('sensor-gimbal')) {
      // Two-Axis Precision Gimbal Mount
      // Outer Bracket Base
      const baseGeo = new THREE.BoxGeometry(3.6, 0.4, 3.6);
      const baseMesh = new THREE.Mesh(baseGeo, darkAnodizedMaterial);
      baseMesh.position.y = -1.8;
      group.add(baseMesh);

      // Outer Gimbal Ring (Yaw)
      const outerRingGeo = new THREE.TorusGeometry(1.9, 0.18, 16, 48);
      const outerRing = new THREE.Mesh(outerRingGeo, aluminumMaterial);
      group.add(outerRing);

      // Inner Gimbal Ring (Pitch)
      const innerRingGeo = new THREE.TorusGeometry(1.4, 0.16, 16, 48);
      const innerRing = new THREE.Mesh(innerRingGeo, darkAnodizedMaterial);
      innerRing.rotation.y = Math.PI / 4;
      group.add(innerRing);

      // Central Sensor / Optical Telemetry Housing
      const sensorGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.8, 32);
      const sensorMesh = new THREE.Mesh(sensorGeo, aluminumMaterial);
      sensorMesh.rotation.x = Math.PI / 2;
      group.add(sensorMesh);

      // Front Optical Glass Lens
      const lensGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.1, 32);
      const lensMesh = new THREE.Mesh(lensGeo, accentCyanMaterial);
      lensMesh.rotation.x = Math.PI / 2;
      lensMesh.position.z = 0.95;
      group.add(lensMesh);

      // Titanium Pivot Screws (4 axis pins)
      const pinGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.6, 16);
      const pin1 = new THREE.Mesh(pinGeo, brassStandoffMaterial);
      pin1.rotation.z = Math.PI / 2;
      pin1.position.x = 1.9;
      const pin2 = pin1.clone();
      pin2.position.x = -1.9;
      group.add(pin1);
      group.add(pin2);
    } else {
      // Default: Astrix Dual-Deploy Avionics Module
      // Top Bulkhead
      const topBulkheadGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.25, 48);
      const topBulkhead = new THREE.Mesh(topBulkheadGeo, carbonFiberMaterial);
      topBulkhead.position.y = 1.8;
      group.add(topBulkhead);

      // Bottom Bulkhead
      const bottomBulkhead = topBulkhead.clone();
      bottomBulkhead.position.y = -1.8;
      group.add(bottomBulkhead);

      // 4 Precision Threaded Aluminum Standoff Rods
      const rodGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.6, 16);
      const radius = 1.35;
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2 + Math.PI / 4;
        const rod = new THREE.Mesh(rodGeo, aluminumMaterial);
        rod.position.x = Math.cos(angle) * radius;
        rod.position.z = Math.sin(angle) * radius;
        group.add(rod);

        // Knurled Hex Nuts on each standoff end
        const nutGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.2, 6);
        const nutTop = new THREE.Mesh(nutGeo, brassStandoffMaterial);
        nutTop.position.set(rod.position.x, 1.92, rod.position.z);
        const nutBottom = nutTop.clone();
        nutBottom.position.y = -1.92;
        group.add(nutTop);
        group.add(nutBottom);
      }

      // Central Electronics Sled Tray
      const trayGeo = new THREE.BoxGeometry(2.1, 2.8, 0.1);
      const trayMesh = new THREE.Mesh(trayGeo, carbonFiberMaterial);
      group.add(trayMesh);

      // Dual Altimeter Flight Computers (Redundant Sleds)
      const altimeterGeo = new THREE.BoxGeometry(0.8, 1.2, 0.15);
      const altimeter1 = new THREE.Mesh(altimeterGeo, darkAnodizedMaterial);
      altimeter1.position.set(-0.45, 0.4, 0.15);
      const altimeter2 = altimeter1.clone();
      altimeter2.position.set(0.45, -0.4, 0.15);
      group.add(altimeter1);
      group.add(altimeter2);

      // Telemetry Status LED Array
      const ledGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const led1 = new THREE.Mesh(ledGeo, accentCyanMaterial);
      led1.position.set(-0.45, 0.9, 0.25);
      const led2 = led1.clone();
      led2.position.set(0.45, 0.1, 0.25);
      group.add(led1);
      group.add(led2);

      // Outer Acrylic/Polycarbonate Transparent Airframe Sleeve (Cutaway)
      const sleeveGeo = new THREE.CylinderGeometry(1.8, 1.8, 3.4, 48, 1, true, 0, Math.PI * 1.3);
      const sleeveMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.18,
        roughness: 0.1,
        transmission: 0.9,
        ior: 1.45,
        wireframe: isWireframe,
      });
      const sleeveMesh = new THREE.Mesh(sleeveGeo, sleeveMat);
      group.add(sleeveMesh);
    }

    // Compute face count for telemetry HUD
    let totalFaces = 0;
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry.index) {
          totalFaces += mesh.geometry.index.count / 3;
        } else if (mesh.geometry.attributes.position) {
          totalFaces += mesh.geometry.attributes.position.count / 3;
        }
      }
    });
    setActiveFaceCount(Math.round(totalFaces));

    return group;
  }, [isWireframe]);

  // Main Scene Initialization & Lifecycle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(5.5, 4.0, 6.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3.0;
    controls.maxDistance = 14.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Prevent camera from going under ground
    controlsRef.current = controls;

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(6, 9, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x90b0e0, 1.2);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    // Cyan Aerospace Rim Light
    const rimLight = new THREE.DirectionalLight(0x00d2ff, 1.8);
    rimLight.position.set(0, -2, -6);
    scene.add(rimLight);

    // 6. Ground Coordinate Grid
    const gridHelper = new THREE.GridHelper(12, 24, 0x334155, 0x1e293b);
    gridHelper.position.y = -2.6;
    gridHelper.name = 'cad-grid';
    scene.add(gridHelper);

    // Soft Ground Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(12, 12);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.605;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 7. Load or Build 3D Model
    setIsLoading(true);

    const loadModel = () => {
      if (currentModelGroup.current) {
        scene.remove(currentModelGroup.current);
      }

      const isExternalUrl =
        model.modelUrl.startsWith('http') ||
        model.modelUrl.endsWith('.glb') ||
        model.modelUrl.endsWith('.gltf') ||
        model.modelUrl.endsWith('.stl');

      if (isExternalUrl && (model.format === 'glb' || model.format === 'gltf')) {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
          model.modelUrl,
          (gltf) => {
            const root = gltf.scene;
            // Center & normalize model size
            const box = new THREE.Box3().setFromObject(root);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 4.5 / (maxDim || 1);
            root.scale.setScalar(scale);

            const center = box.getCenter(new THREE.Vector3());
            root.position.sub(center.multiplyScalar(scale));

            currentModelGroup.current = root;
            scene.add(root);
            setIsLoading(false);
          },
          undefined,
          () => {
            // Fallback to high-detail procedural assembly
            const procedural = buildProceduralModel(model.modelUrl || model.id);
            currentModelGroup.current = procedural;
            scene.add(procedural);
            setIsLoading(false);
          }
        );
      } else if (isExternalUrl && model.format === 'stl') {
        const stlLoader = new STLLoader();
        stlLoader.load(
          model.modelUrl,
          (geometry) => {
            const material = new THREE.MeshStandardMaterial({
              color: 0xd4d8dd,
              metalness: 0.85,
              roughness: 0.3,
              wireframe: isWireframe,
            });
            const mesh = new THREE.Mesh(geometry, material);
            geometry.center();
            geometry.computeVertexNormals();

            const box = new THREE.Box3().setFromObject(mesh);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            mesh.scale.setScalar(4.5 / (maxDim || 1));

            const group = new THREE.Group();
            group.add(mesh);
            currentModelGroup.current = group;
            scene.add(group);
            setIsLoading(false);
          },
          undefined,
          () => {
            const procedural = buildProceduralModel(model.modelUrl || model.id);
            currentModelGroup.current = procedural;
            scene.add(procedural);
            setIsLoading(false);
          }
        );
      } else {
        // Procedural generation
        const procedural = buildProceduralModel(model.modelUrl || model.id);
        currentModelGroup.current = procedural;
        scene.add(procedural);
        setIsLoading(false);
      }
    };

    loadModel();

    // 8. Animation Loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Turntable slow orbital rotation
      if (isRotating && currentModelGroup.current) {
        currentModelGroup.current.rotation.y += 0.004;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      cameraRef.current.aspect = container.clientWidth / container.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [model, buildProceduralModel, isRotating, isWireframe]);

  // Toggle wireframe on active model materials
  useEffect(() => {
    if (!currentModelGroup.current) return;
    currentModelGroup.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            (mat as any).wireframe = isWireframe;
          });
        } else if (mesh.material) {
          (mesh.material as any).wireframe = isWireframe;
        }
      }
    });
  }, [isWireframe]);

  // Toggle ground grid visibility
  useEffect(() => {
    if (!sceneRef.current) return;
    const grid = sceneRef.current.getObjectByName('cad-grid');
    if (grid) grid.visible = showGrid;
  }, [showGrid]);

  // Recalibrate Camera to Default 45° Isometric Perspective
  const handleResetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(5.5, 4.0, 6.5);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
    if (currentModelGroup.current) {
      currentModelGroup.current.rotation.set(0, 0, 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-white/10 bg-[#07090e] shadow-2xl group ${className}`}
      style={{ minHeight: isFullscreen ? '100vh' : '520px' }}
    >
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={containerRef}
        className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"
      />

      {/* Top HUD Telemetry Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-white/10 backdrop-blur-md flex items-center gap-2 text-xs font-mono text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">WebGL // 60 FPS</span>
            <span className="text-zinc-600">•</span>
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider">
              {model.cadSoftware || 'SolidWorks'}
            </span>
          </div>

          {activeFaceCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-white/10 backdrop-blur-md text-[11px] font-mono text-zinc-400">
              <Box className="w-3 h-3 text-cyan-400" />
              <span>{activeFaceCount.toLocaleString()} Polygons</span>
            </div>
          )}
        </div>

        {/* Viewport Control Actions */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Turntable Auto-rotate */}
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
              isRotating
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                : 'bg-zinc-950/80 border-white/10 text-zinc-400 hover:text-white'
            }`}
            title={isRotating ? 'Pause Turntable' : 'Play Turntable'}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          {/* Wireframe Topology Mode */}
          <button
            type="button"
            onClick={() => setIsWireframe(!isWireframe)}
            className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
              isWireframe
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                : 'bg-zinc-950/80 border-white/10 text-zinc-400 hover:text-white'
            }`}
            title="Toggle CAD Wireframe Mesh"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Ground Coordinate Grid */}
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
              showGrid
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-zinc-950/80 border-white/10 text-zinc-500 hover:text-zinc-300'
            }`}
            title="Toggle Coordinate Grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Reset Camera View */}
          <button
            type="button"
            onClick={handleResetCamera}
            className="p-2 rounded-xl bg-zinc-950/80 border border-white/10 text-zinc-400 hover:text-white backdrop-blur-md transition-all"
            title="Reset to Isometric Camera (45°)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-zinc-950/80 border border-white/10 text-zinc-400 hover:text-white backdrop-blur-md transition-all hidden sm:flex"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#07090e]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20">
          <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-cyan-400 animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            Rendering 3D Mesh...
          </span>
        </div>
      )}

      {/* Bottom Hint Banner */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none text-[11px] font-mono text-zinc-500">
        <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-lg backdrop-blur-md border border-white/5 pointer-events-auto">
          <Compass className="w-3 h-3 text-cyan-400" />
          <span>Left-Click: Orbit • Scroll: Zoom • Right-Click: Pan</span>
        </div>

        <div className="hidden sm:block text-[10px] text-zinc-600 bg-black/40 px-2 py-1 rounded border border-white/5">
          CAD Lab // {model.format.toUpperCase()} Standard
        </div>
      </div>
    </div>
  );
}
