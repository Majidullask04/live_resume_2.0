import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Crosshair, Play, Pause, Terminal, ShieldCheck, Zap, Bug, Eye } from 'lucide-react';
import { sound } from './SoundEffects';

// Target information when hovering an interactive or important element
interface TargetInfo {
  tag: string;
  name: string;
  isImportant: boolean;
  priorityLabel?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Single leg structure with inverse kinematics state
interface SpiderLeg {
  id: number;
  side: 'left' | 'right';
  index: number; // 0 (front) to 3 (rear)
  group: 0 | 1; // Alternating tetrapod stepping group
  mountLocal: { x: number; y: number }; // Attachment point on carapace in local coords
  restLocal: { x: number; y: number }; // Ideal resting position in local coords
  currentPos: { x: number; y: number }; // Current foot position in world coords
  prevPos: { x: number; y: number }; // Step start position
  targetPos: { x: number; y: number }; // Step target position
  stepProgress: number; // 0 to 1 (1 = planted)
  isStepping: boolean;
  femurLength: number;
  tibiaLength: number;
}

// Silk web segment trailing behind spinneret
interface SilkPoint {
  x: number;
  y: number;
  alpha: number;
}

// Web click burst shockwave
interface WebShockwave {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const PatchrightCursorTracker: React.FC = () => {
  // Real mouse coordinates
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [targetInfo, setTargetInfo] = useState<TargetInfo | null>(null);
  
  // Settings & Emulation States
  const [isSpiderMode, setIsSpiderMode] = useState(true);
  const [isAutopilotActive, setIsAutopilotActive] = useState(false);
  const [isHighlightsOnly, setIsHighlightsOnly] = useState(false);
  const [followMode, setFollowMode] = useState<'head-first' | 'front-scout'>('head-first');
  const [telemetryLog, setTelemetryLog] = useState<string>('ARACHNID_CORE: INITIALIZED // 8-LEG IK FORWARD READY');

  // Follow mode ref & mouse velocity tracker
  const followModeRef = useRef<'head-first' | 'front-scout'>('head-first');
  followModeRef.current = followMode;
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const prevMouseTimeRef = useRef(performance.now());
  const mouseVelRef = useRef({ vx: 0, vy: 0 });

  // Canvas & Animation references
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const autopilotTimeoutRef = useRef<number | null>(null);

  // Mutable animation state references to maintain 120 FPS decoupled from React render cycle
  const spiderRef = useRef({
    x: -200,
    y: -200,
    targetX: -200,
    targetY: -200,
    angle: 0,
    targetAngle: 0,
    speed: 0,
    isHovered: false,
    isImportant: false,
    isClicking: false,
    activeGroup: 0 as 0 | 1,
    lastStepTime: 0,
    silkTrail: [] as SilkPoint[],
    shockwaves: [] as WebShockwave[],
    legs: [] as SpiderLeg[],
    pedipalpTwitch: 0,
    breathCycle: 0,
    hasInitialized: false,
  });

  // Initialize 8 Spider Legs with anatomical offsets & length ratios
  const initSpiderLegs = (startX: number, startY: number): SpiderLeg[] => {
    const legs: SpiderLeg[] = [];
    
    // 4 legs on left, 4 on right
    // Natural resting angles fan out from front to rear
    const legConfigs = [
      // Left side: Index 0, 1, 2, 3
      { side: 'left' as const, index: 0, group: 0 as const, mount: { x: -6, y: 7 }, rest: { x: -24, y: 28 }, fLen: 18, tLen: 22 },
      { side: 'left' as const, index: 1, group: 1 as const, mount: { x: -7, y: 2 }, rest: { x: -34, y: 12 }, fLen: 20, tLen: 24 },
      { side: 'left' as const, index: 2, group: 0 as const, mount: { x: -7, y: -4 }, rest: { x: -32, y: -14 }, fLen: 20, tLen: 24 },
      { side: 'left' as const, index: 3, group: 1 as const, mount: { x: -6, y: -9 }, rest: { x: -24, y: -30 }, fLen: 22, tLen: 26 },

      // Right side: Index 0, 1, 2, 3
      { side: 'right' as const, index: 0, group: 1 as const, mount: { x: 6, y: 7 }, rest: { x: 24, y: 28 }, fLen: 18, tLen: 22 },
      { side: 'right' as const, index: 1, group: 0 as const, mount: { x: 7, y: 2 }, rest: { x: 34, y: 12 }, fLen: 20, tLen: 24 },
      { side: 'right' as const, index: 2, group: 1 as const, mount: { x: 7, y: -4 }, rest: { x: 32, y: -14 }, fLen: 20, tLen: 24 },
      { side: 'right' as const, index: 3, group: 0 as const, mount: { x: 6, y: -9 }, rest: { x: 24, y: -30 }, fLen: 22, tLen: 26 },
    ];

    legConfigs.forEach((cfg, idx) => {
      legs.push({
        id: idx,
        side: cfg.side,
        index: cfg.index,
        group: cfg.group,
        mountLocal: cfg.mount,
        restLocal: cfg.rest,
        currentPos: { x: startX + cfg.rest.x, y: startY + cfg.rest.y },
        prevPos: { x: startX + cfg.rest.x, y: startY + cfg.rest.y },
        targetPos: { x: startX + cfg.rest.x, y: startY + cfg.rest.y },
        stepProgress: 1,
        isStepping: false,
        femurLength: cfg.fLen,
        tibiaLength: cfg.tLen,
      });
    });

    return legs;
  };

  // Setup Mouse Tracking & Element Inspection
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isAutopilotActive) {
        setIsAutopilotActive(false);
        setTelemetryLog('MANUAL_OVERRIDE: AUTOPILOT PAUSED BY USER MOTION');
      }

      const clientX = e.clientX;
      const clientY = e.clientY;

      const now = performance.now();
      const dtMouse = Math.max((now - prevMouseTimeRef.current) / 1000, 0.001);
      const instantVx = (clientX - prevMousePosRef.current.x) / dtMouse;
      const instantVy = (clientY - prevMousePosRef.current.y) / dtMouse;
      mouseVelRef.current.vx = mouseVelRef.current.vx * 0.7 + instantVx * 0.3;
      mouseVelRef.current.vy = mouseVelRef.current.vy * 0.7 + instantVy * 0.3;
      prevMousePosRef.current = { x: clientX, y: clientY };
      prevMouseTimeRef.current = now;

      setMousePos({ x: clientX, y: clientY });

      let targetX = clientX;
      let targetY = clientY;

      // In Front-Scout mode, project target ahead of cursor movement to lead from front
      if (followModeRef.current === 'front-scout') {
        const velSpeed = Math.hypot(mouseVelRef.current.vx, mouseVelRef.current.vy);
        if (velSpeed > 30) {
          const dirX = mouseVelRef.current.vx / velSpeed;
          const dirY = mouseVelRef.current.vy / velSpeed;
          targetX = clientX + dirX * 55;
          targetY = clientY + dirY * 55;
        }
      }

      // Initialize spider position immediately on first mouse appearance
      if (!spiderRef.current.hasInitialized) {
        spiderRef.current.x = targetX;
        spiderRef.current.y = targetY;
        spiderRef.current.targetX = targetX;
        spiderRef.current.targetY = targetY;
        spiderRef.current.legs = initSpiderLegs(targetX, targetY);
        spiderRef.current.hasInitialized = true;
      } else {
        spiderRef.current.targetX = targetX;
        spiderRef.current.targetY = targetY;
      }

      // Check for interactive and critical portfolio targets
      const target = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
      if (target) {
        const interactiveEl = target.closest('button, a, input, select, textarea, [role="button"], [data-important="true"], .important-asset') as HTMLElement | null;
        if (interactiveEl) {
          setIsHovered(true);
          spiderRef.current.isHovered = true;
          const rect = interactiveEl.getBoundingClientRect();
          const isImp = interactiveEl.getAttribute('data-important') === 'true' || interactiveEl.classList.contains('important-asset');
          const impLabel = interactiveEl.getAttribute('data-important-title') || 'CRITICAL ASSET';

          spiderRef.current.isImportant = isImp;

          setTargetInfo({
            tag: interactiveEl.tagName.toLowerCase(),
            name: interactiveEl.innerText?.slice(0, 26) || interactiveEl.getAttribute('aria-label') || interactiveEl.id || 'INTERACTIVE_NODE',
            isImportant: isImp,
            priorityLabel: impLabel,
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
          });
        } else {
          setIsHovered(false);
          spiderRef.current.isHovered = false;
          spiderRef.current.isImportant = false;
          setTargetInfo(null);
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      spiderRef.current.isClicking = true;
      sound.playClick();

      // Trigger web shockwave ring at mouse location
      spiderRef.current.shockwaves.push({
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: 65,
        alpha: 0.9,
      });
    };

    const handleMouseUp = () => {
      setIsClicking(false);
      spiderRef.current.isClicking = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isAutopilotActive]);

  // Main Canvas Rendering Engine (60 - 120 FPS Inverse Kinematics Spider)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const sp = spiderRef.current;

      if (sp.hasInitialized) {
        // 1. Smoothly interpolate body position towards target (mouse)
        const dx = sp.targetX - sp.x;
        const dy = sp.targetY - sp.y;
        const distToMouse = Math.hypot(dx, dy);

        // Responsive chasing speed: fast catch-up when far, organic crawling when near
        const followSpeed = distToMouse > 250 ? 16 : distToMouse > 50 ? 11 : 7.5;
        sp.x += dx * Math.min(dt * followSpeed, 0.45);
        sp.y += dy * Math.min(dt * followSpeed, 0.45);

        sp.speed = Math.hypot(dx * dt * followSpeed, dy * dt * followSpeed);

        // 2. Rotate body so the head (front) faces movement direction towards the cursor
        if (distToMouse > 3) {
          // Angle offset: Spider head points toward mouse (- Math.PI / 2 because head is at local +Y)
          const moveAngle = Math.atan2(dy, dx) - Math.PI / 2;
          
          // Angular shortest distance interpolation
          let diff = moveAngle - sp.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          sp.angle += diff * Math.min(dt * 14, 0.4);
        }

        // Forward and Right unit vectors based on current orientation
        const forwardX = -Math.sin(sp.angle);
        const forwardY = Math.cos(sp.angle);
        const rightX = Math.cos(sp.angle);
        const rightY = Math.sin(sp.angle);

        // Breathing cycle & pedipalp twitch
        sp.breathCycle += dt * 3;
        sp.pedipalpTwitch += dt * (sp.isHovered ? 12 : 4);

        // 3. Update Silk Trail (Gossamer web emitted from spinneret)
        // Spinneret sits at the rear tip of the abdomen (opposite to head/forward vector)
        const spinneretX = sp.x - forwardX * 26;
        const spinneretY = sp.y - forwardY * 26;

        if (distToMouse > 8) {
          sp.silkTrail.push({ x: spinneretX, y: spinneretY, alpha: 0.55 });
          if (sp.silkTrail.length > 28) sp.silkTrail.shift();
        }

        // Fade existing silk points
        for (let i = 0; i < sp.silkTrail.length; i++) {
          sp.silkTrail[i].alpha -= dt * 0.4;
        }
        sp.silkTrail = sp.silkTrail.filter(p => p.alpha > 0.02);

        // Render Silk Trail
        if (sp.silkTrail.length > 2) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(sp.silkTrail[0].x, sp.silkTrail[0].y);
          for (let i = 1; i < sp.silkTrail.length; i++) {
            const p = sp.silkTrail[i];
            ctx.lineTo(p.x, p.y);
          }
          ctx.strokeStyle = sp.isImportant ? 'rgba(34, 211, 238, 0.4)' : 'rgba(245, 158, 11, 0.35)';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([3, 4]);
          ctx.stroke();
          ctx.restore();
        }

        // 4. Update & Render Click Web Shockwaves
        for (let i = sp.shockwaves.length - 1; i >= 0; i--) {
          const wave = sp.shockwaves[i];
          wave.radius += dt * 140;
          wave.alpha -= dt * 1.5;

          if (wave.alpha <= 0) {
            sp.shockwaves.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
          ctx.strokeStyle = sp.isImportant
            ? `rgba(34, 211, 238, ${wave.alpha})`
            : `rgba(245, 158, 11, ${wave.alpha})`;
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Web Radial Strands inside the shockwave
          const strands = 8;
          for (let s = 0; s < strands; s++) {
            const angle = (s * Math.PI * 2) / strands;
            ctx.beginPath();
            ctx.moveTo(wave.x, wave.y);
            ctx.lineTo(wave.x + Math.cos(angle) * wave.radius, wave.y + Math.sin(angle) * wave.radius);
            ctx.strokeStyle = `rgba(255, 255, 255, ${wave.alpha * 0.4})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
          ctx.restore();
        }

        // 5. Update Legs (Inverse Kinematics + Alternating Stepping Gait)

        // Group step timer toggle
        if (time - sp.lastStepTime > 110) {
          sp.activeGroup = sp.activeGroup === 0 ? 1 : 0;
          sp.lastStepTime = time;
        }

        sp.legs.forEach(leg => {
          // World mount coordinates on carapace
          const mountX = sp.x + rightX * leg.mountLocal.x + forwardX * leg.mountLocal.y;
          const mountY = sp.y + rightY * leg.mountLocal.x + forwardY * leg.mountLocal.y;

          // Ideal foot position relative to current body pose
          // Extra forward bias when moving fast to simulate dynamic gait stride
          const velocityBias = Math.min(distToMouse * 0.35, 18);
          const idealFootX = sp.x + rightX * leg.restLocal.x + forwardX * (leg.restLocal.y + velocityBias);
          const idealFootY = sp.y + rightY * leg.restLocal.x + forwardY * (leg.restLocal.y + velocityBias);

          // Alert hunter stance: front legs (pair 0) lift high and reach out towards interactive buttons
          if (sp.isHovered && leg.index === 0) {
            leg.targetPos.x = sp.x + rightX * (leg.side === 'left' ? -18 : 18) + forwardX * 38 + Math.sin(sp.pedipalpTwitch) * 3;
            leg.targetPos.y = sp.y + rightY * (leg.side === 'left' ? -18 : 18) + forwardY * 38 + Math.cos(sp.pedipalpTwitch) * 3;
          }

          // Check if foot is too far from its resting spot
          const distToRest = Math.hypot(leg.currentPos.x - idealFootX, leg.currentPos.y - idealFootY);

          // Stepping trigger: trigger when distance exceeds threshold AND it belongs to the active group
          if (!leg.isStepping && distToRest > 18 && leg.group === sp.activeGroup) {
            leg.isStepping = true;
            leg.stepProgress = 0;
            leg.prevPos = { ...leg.currentPos };
            leg.targetPos = {
              x: idealFootX + (Math.random() - 0.5) * 4,
              y: idealFootY + (Math.random() - 0.5) * 4,
            };
          }

          // Animate active step
          if (leg.isStepping) {
            leg.stepProgress += dt * 6.5; // step animation speed (~150ms)
            if (leg.stepProgress >= 1) {
              leg.stepProgress = 1;
              leg.isStepping = false;
              leg.currentPos = { ...leg.targetPos };
            } else {
              // Interpolate foot position with parabolic height lift
              const t = leg.stepProgress;
              leg.currentPos.x = leg.prevPos.x + (leg.targetPos.x - leg.prevPos.x) * t;
              leg.currentPos.y = leg.prevPos.y + (leg.targetPos.y - leg.prevPos.y) * t;
            }
          }

          // Calculate 2-bone Inverse Kinematics (Mount -> Knee -> Foot)
          const toFootX = leg.currentPos.x - mountX;
          const toFootY = leg.currentPos.y - mountY;
          let footDist = Math.hypot(toFootX, toFootY);

          const maxReach = (leg.femurLength + leg.tibiaLength) * 0.96;
          if (footDist > maxReach) footDist = maxReach;

          const baseAngle = Math.atan2(toFootY, toFootX);
          
          // Law of Cosines for interior knee angle
          const l1 = leg.femurLength;
          const l2 = leg.tibiaLength;
          let cosAlpha = (l1 * l1 + footDist * footDist - l2 * l2) / (2 * l1 * footDist);
          cosAlpha = Math.max(-1, Math.min(1, cosAlpha));
          const alpha = Math.acos(cosAlpha);

          // Knee angle: Left legs bend outward-backward, Right legs bend outward-forward
          const kneeBendDirection = leg.side === 'left' ? -1 : 1;
          const kneeAngle = baseAngle + alpha * kneeBendDirection;

          // Parabolic lift height when stepping (adds 3D elevation illusion)
          const liftHeight = leg.isStepping ? Math.sin(leg.stepProgress * Math.PI) * 10 : 0;

          const kneeX = mountX + Math.cos(kneeAngle) * l1;
          const kneeY = mountY + Math.sin(kneeAngle) * l1 - liftHeight;

          // 6. Draw Leg Shadow on website surface
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(mountX + 2, mountY + 3);
          ctx.lineTo(kneeX + 2, kneeY + 4 + liftHeight * 0.8);
          ctx.lineTo(leg.currentPos.x + 2, leg.currentPos.y + 3);
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.filter = 'blur(2px)';
          ctx.stroke();
          ctx.restore();

          // 7. Draw Segment 1 (Femur - Coxa to Knee)
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(mountX, mountY);
          ctx.lineTo(kneeX, kneeY);
          ctx.strokeStyle = sp.isImportant ? '#0891b2' : '#78350f';
          ctx.lineWidth = 3.2;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Inner metallic chitin highlight on Femur
          ctx.beginPath();
          ctx.moveTo(mountX, mountY);
          ctx.lineTo(kneeX, kneeY);
          ctx.strokeStyle = sp.isImportant ? '#22d3ee' : '#f59e0b';
          ctx.lineWidth = 1.3;
          ctx.stroke();

          // Luminous Knee Joint Node
          ctx.beginPath();
          ctx.arc(kneeX, kneeY, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = sp.isImportant ? '#67e8f9' : '#fbbf24';
          ctx.shadowColor = sp.isImportant ? '#22d3ee' : '#f59e0b';
          ctx.shadowBlur = 6;
          ctx.fill();

          // 8. Draw Segment 2 (Tibia/Tarsus - Knee to Foot Claw)
          ctx.beginPath();
          ctx.moveTo(kneeX, kneeY);
          // Subtle curve towards foot
          const midX = (kneeX + leg.currentPos.x) / 2 + (leg.side === 'left' ? -2 : 2);
          const midY = (kneeY + leg.currentPos.y) / 2;
          ctx.quadraticCurveTo(midX, midY, leg.currentPos.x, leg.currentPos.y);
          ctx.strokeStyle = sp.isImportant ? '#0e7490' : '#451a03';
          ctx.lineWidth = 2.4;
          ctx.stroke();

          // Glowing Claw Tip on contact
          ctx.beginPath();
          ctx.arc(leg.currentPos.x, leg.currentPos.y, leg.isStepping ? 1.5 : 2, 0, Math.PI * 2);
          ctx.fillStyle = sp.isImportant ? '#a5f3fc' : '#fde68a';
          ctx.shadowColor = sp.isImportant ? '#22d3ee' : '#f59e0b';
          ctx.shadowBlur = leg.isStepping ? 8 : 4;
          ctx.fill();
          ctx.restore();
        });

        // 9. Draw Spider Body (Cephalothorax + Abdomen + Fangs + Eyes)
        ctx.save();
        ctx.translate(sp.x, sp.y);
        ctx.rotate(sp.angle);

        // Click pounce / squash compression effect
        if (sp.isClicking) {
          ctx.scale(0.88, 0.88);
        }

        // Soft Body Ground Shadow
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(3, 4, 11, 16, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.filter = 'blur(4px)';
        ctx.fill();
        ctx.restore();

        // A. Abdomen (Opisthosoma - Rear Segment)
        const breathScale = 1 + Math.sin(sp.breathCycle) * 0.04;
        ctx.save();
        ctx.translate(0, -15);
        ctx.scale(breathScale, breathScale);

        // Abdomen Shell
        const abdomenGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 14);
        abdomenGrad.addColorStop(0, '#262626');
        abdomenGrad.addColorStop(0.65, '#171717');
        abdomenGrad.addColorStop(1, '#0a0a0a');

        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 14, 0, 0, Math.PI * 2);
        ctx.fillStyle = abdomenGrad;
        ctx.strokeStyle = sp.isImportant ? 'rgba(34, 211, 238, 0.5)' : 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.fill();
        ctx.stroke();

        // Bio-mechanical Arachnid Back Pattern (Hourglass / Cyber Chevron)
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(4, -3);
        ctx.lineTo(1, 0);
        ctx.lineTo(4, 5);
        ctx.lineTo(0, 9);
        ctx.lineTo(-4, 5);
        ctx.lineTo(-1, 0);
        ctx.lineTo(-4, -3);
        ctx.closePath();
        ctx.fillStyle = sp.isImportant ? '#22d3ee' : '#f59e0b';
        ctx.shadowColor = sp.isImportant ? '#06b6d4' : '#d97706';
        ctx.shadowBlur = 8;
        ctx.fill();

        // Spinneret Tip (Rear silk gland)
        ctx.beginPath();
        ctx.arc(0, -13, 2, 0, Math.PI * 2);
        ctx.fillStyle = sp.isImportant ? '#67e8f9' : '#fbbf24';
        ctx.fill();
        ctx.restore();

        // B. Pedicel (Narrow waist connection)
        ctx.beginPath();
        ctx.ellipse(0, -5, 3.5, 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#171717';
        ctx.fill();

        // C. Cephalothorax (Front Head & Carapace)
        const carapaceGrad = ctx.createRadialGradient(-2, 3, 1, 0, 4, 11);
        carapaceGrad.addColorStop(0, '#333333');
        carapaceGrad.addColorStop(0.7, '#1a1a1a');
        carapaceGrad.addColorStop(1, '#0a0a0a');

        ctx.beginPath();
        ctx.ellipse(0, 4, 8, 9, 0, 0, Math.PI * 2);
        ctx.fillStyle = carapaceGrad;
        ctx.strokeStyle = sp.isImportant ? 'rgba(34, 211, 238, 0.6)' : 'rgba(245, 158, 11, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.fill();
        ctx.stroke();

        // D. Chelicerae & Fangs (Mouthparts in Front)
        const fangPinch = sp.isClicking ? 2.5 : Math.sin(sp.pedipalpTwitch) * 0.8;
        // Left Fang
        ctx.beginPath();
        ctx.moveTo(-3, 11);
        ctx.quadraticCurveTo(-4, 15, -1 - fangPinch, 17);
        ctx.lineTo(-2, 11);
        ctx.fillStyle = '#171717';
        ctx.strokeStyle = sp.isImportant ? '#22d3ee' : '#f59e0b';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        // Right Fang
        ctx.beginPath();
        ctx.moveTo(3, 11);
        ctx.quadraticCurveTo(4, 15, 1 + fangPinch, 17);
        ctx.lineTo(2, 11);
        ctx.fillStyle = '#171717';
        ctx.strokeStyle = sp.isImportant ? '#22d3ee' : '#f59e0b';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        // E. Pedipalps (Front mini-arms / feelers)
        const palpWave = Math.sin(sp.pedipalpTwitch) * 2;
        // Left Pedipalp
        ctx.beginPath();
        ctx.moveTo(-5, 9);
        ctx.lineTo(-8, 15 + palpWave);
        ctx.lineTo(-6, 18 + palpWave);
        ctx.strokeStyle = sp.isImportant ? '#22d3ee' : '#f59e0b';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Right Pedipalp
        ctx.beginPath();
        ctx.moveTo(5, 9);
        ctx.lineTo(8, 15 - palpWave);
        ctx.lineTo(6, 18 - palpWave);
        ctx.strokeStyle = sp.isImportant ? '#22d3ee' : '#f59e0b';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.stroke();

        // F. 8 Glowing Predatory Eyes (Arachnid cluster)
        ctx.save();
        const eyeColor = sp.isImportant ? '#22d3ee' : '#fbbf24';
        const eyeGlow = sp.isImportant ? '#06b6d4' : '#f59e0b';
        ctx.shadowColor = eyeGlow;
        ctx.shadowBlur = sp.isHovered ? 14 : 7;
        ctx.fillStyle = eyeColor;

        // 2 Primary Anterior-Median Eyes (Large glowing forward headlights)
        ctx.beginPath();
        ctx.arc(-2.2, 10.5, 1.6, 0, Math.PI * 2);
        ctx.arc(2.2, 10.5, 1.6, 0, Math.PI * 2);
        ctx.fill();

        // 2 Anterior-Lateral Eyes
        ctx.beginPath();
        ctx.arc(-4.6, 9.8, 1.1, 0, Math.PI * 2);
        ctx.arc(4.6, 9.8, 1.1, 0, Math.PI * 2);
        ctx.fill();

        // 2 Posterior-Median Eyes
        ctx.beginPath();
        ctx.arc(-1.8, 8, 1.1, 0, Math.PI * 2);
        ctx.arc(1.8, 8, 1.1, 0, Math.PI * 2);
        ctx.fill();

        // 2 Posterior-Lateral Eyes
        ctx.beginPath();
        ctx.arc(-4.2, 7.5, 0.9, 0, Math.PI * 2);
        ctx.arc(4.2, 7.5, 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // G. Cyber Targeting Crosshair (Precision Point right at fangs tip)
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 19, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = sp.isImportant ? '#22d3ee' : '#fbbf24';
        ctx.shadowColor = sp.isImportant ? '#22d3ee' : '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.fill();

        if (sp.isHovered) {
          ctx.beginPath();
          ctx.arc(0, 19, 9, 0, Math.PI * 2);
          ctx.strokeStyle = sp.isImportant ? 'rgba(34, 211, 238, 0.7)' : 'rgba(245, 158, 11, 0.7)';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);
          ctx.stroke();
        }
        ctx.restore();

        ctx.restore(); // end spider translation
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, []);

  // Autonomous Guided Tour (Spider crawls between top portfolio highlights)
  const keyMilestones = [
    { selector: '#hero-ai-copilot', label: 'AI INTERVIEW COPILOT', note: 'INSPECTING AI AGENT PROTOCOL' },
    { selector: '#github-live', label: 'LIVE GITHUB TELEMETRY', note: 'VERIFYING PRODUCTION COMMITS & CI/CD' },
    { selector: '#project-03', label: 'FINSEC ENTERPRISE PLATFORM', note: 'AUDITING KUBERNETES & DEVSECOPS' },
    { selector: '#project-05', label: 'CYBERSHIELD THREAT ENGINE', note: 'ANALYZING REAL-TIME LOG PIPELINES' },
    { selector: '#project-01', label: 'NEURALLINK AI WORKSPACE', note: 'CHECKING GENERATIVE AI ARCHITECTURE' },
    { selector: '#contact-connect', label: 'DIRECT RECRUITER CONNECT', note: 'CALCULATING CANDIDATE FIT' },
  ];

  const runAutopilotStep = useCallback((stepIndex: number) => {
    if (stepIndex >= keyMilestones.length) {
      setIsAutopilotActive(false);
      setTelemetryLog('AUTOPILOT COMPLETE: 100% PORTFOLIO AUDITED');
      sound.playSuccess();
      return;
    }

    const milestone = keyMilestones[stepIndex];
    const targetElement = document.querySelector(milestone.selector) as HTMLElement | null;

    if (!targetElement) {
      runAutopilotStep(stepIndex + 1);
      return;
    }

    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTelemetryLog(`AUTOPILOT [${stepIndex + 1}/${keyMilestones.length}]: ${milestone.note}`);

    setTimeout(() => {
      const rect = targetElement.getBoundingClientRect();
      const targetPointX = rect.left + rect.width / 2;
      const targetPointY = rect.top + rect.height / 2;

      setMousePos({ x: targetPointX, y: targetPointY });
      spiderRef.current.targetX = targetPointX;
      spiderRef.current.targetY = targetPointY;
      spiderRef.current.isHovered = true;
      spiderRef.current.isImportant = true;

      setTargetInfo({
        tag: targetElement.tagName.toLowerCase(),
        name: milestone.label,
        isImportant: true,
        priorityLabel: 'AUTOPILOT TARGET',
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });

      sound.playPop();

      autopilotTimeoutRef.current = window.setTimeout(() => {
        runAutopilotStep(stepIndex + 1);
      }, 2600);
    }, 600);
  }, [keyMilestones]);

  const toggleAutopilot = () => {
    if (isAutopilotActive) {
      setIsAutopilotActive(false);
      if (autopilotTimeoutRef.current) clearTimeout(autopilotTimeoutRef.current);
      setTelemetryLog('MANUAL_OVERRIDE: AUTOPILOT PAUSED BY USER');
      sound.playClick();
    } else {
      setIsAutopilotActive(true);
      setTelemetryLog('INITIALIZING ARACHNID AUTONOMOUS AUDIT...');
      sound.playOpenModal();
      runAutopilotStep(0);
    }
  };

  // Toggle Highlight All Critical Portfolio Assets
  const toggleHighlights = () => {
    const nextState = !isHighlightsOnly;
    setIsHighlightsOnly(nextState);
    sound.playPop();

    const importantEls = document.querySelectorAll('[data-important="true"], .important-asset');
    importantEls.forEach(el => {
      if (nextState) {
        el.classList.add('patchright-highlight-active');
      } else {
        el.classList.remove('patchright-highlight-active');
      }
    });

    setTelemetryLog(nextState ? 'RADAR: ALL CRITICAL ASSETS HIGHLIGHTED' : 'RADAR: STANDARD MODE');
  };

  // Toggle Spider Follow Mode: Head-First Chaser vs Front Scout
  const toggleFollowMode = () => {
    const nextMode = followMode === 'head-first' ? 'front-scout' : 'head-first';
    setFollowMode(nextMode);
    followModeRef.current = nextMode;
    sound.playPop();
    setTelemetryLog(`SPIDER_MODE: ${nextMode === 'head-first' ? 'FOLLOWING FROM FRONT (HEAD-FIRST)' : 'LEADING FROM FRONT (FRONT SCOUT)'}`);
  };

  return (
    <>
      {/* 1. Fullscreen Canvas Overlay for Procedural IK Spider */}
      <canvas
        ref={canvasRef}
        className="hidden md:block fixed inset-0 pointer-events-none z-[101] w-full h-full"
      />

      {/* 2. Target Acquisition Bounding Brackets for Important Elements */}
      <AnimatePresence>
        {targetInfo && targetInfo.isImportant && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              left: targetInfo.x - 6,
              top: targetInfo.y - 6,
              width: targetInfo.width + 12,
              height: targetInfo.height + 12,
              pointerEvents: 'none',
              zIndex: 97
            }}
            className="hidden md:block border border-dashed border-cyan-400/60 rounded-xl bg-cyan-400/5 shadow-[0_0_30px_rgba(34,211,238,0.15)]"
          >
            {/* Tactical Corner Reticles */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Real-time Telemetry Tag Badge when Hovering Interactive Elements */}
      <AnimatePresence>
        {targetInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              left: Math.min(mousePos.x + 36, window.innerWidth - 180),
              top: Math.max(mousePos.y - 40, 20),
              pointerEvents: 'none',
              zIndex: 103,
            }}
            className={`hidden md:flex px-2.5 py-1.5 rounded-lg backdrop-blur-xl border text-[10px] font-mono whitespace-nowrap shadow-2xl flex-col gap-0.5 ${
              targetInfo.isImportant
                ? 'bg-neutral-950/95 border-cyan-400/80 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                : 'bg-neutral-950/90 border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold tracking-wider uppercase">
              <Crosshair size={11} className={targetInfo.isImportant ? 'text-cyan-400 animate-spin' : 'text-amber-400'} />
              <span>{targetInfo.name}</span>
              {targetInfo.isImportant && (
                <span className="px-1 py-0.2 rounded bg-cyan-400/20 text-cyan-300 text-[8px] font-bold border border-cyan-400/50">
                  ★ CRITICAL
                </span>
              )}
            </div>
            <div className="text-[8px] text-neutral-400 flex items-center gap-2">
              <span>X:{Math.round(mousePos.x)} Y:{Math.round(mousePos.y)}</span>
              <span className="text-emerald-400 flex items-center gap-0.5">
                <ShieldCheck size={9} /> SPIDER_TRACKER
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Arachnid Stealth Control Center HUD (Bottom Floating Pill) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[105] flex flex-col items-center gap-2 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center gap-2 p-1.5 bg-neutral-950/90 hover:bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 hover:border-amber-500/50 rounded-full shadow-2xl transition-all font-mono text-xs"
        >
          {/* Arachnid Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isAutopilotActive ? 'bg-cyan-400' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isAutopilotActive ? 'bg-cyan-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="hidden sm:inline font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Bug size={11} className={isAutopilotActive ? 'text-cyan-400' : 'text-amber-400'} />
              {isAutopilotActive ? 'ARACHNID AUTONOMOUS' : 'CYBER SPIDER IK'}
            </span>
            <span className="text-[10px] text-neutral-500 hidden md:inline">
              | {Math.round(mousePos.x)},{Math.round(mousePos.y)}
            </span>
          </div>

          {/* Follow Mode Toggle Button */}
          <button
            onClick={toggleFollowMode}
            title={followMode === 'head-first' ? "Current: Following head-first from front. Click to lead from front as scout" : "Current: Leading from front. Click to follow head-first"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-neutral-700"
          >
            <Eye size={12} className={followMode === 'head-first' ? 'text-amber-400' : 'text-cyan-400'} />
            <span className="hidden sm:inline">
              {followMode === 'head-first' ? 'FOLLOW: HEAD-FIRST' : 'LEAD: FRONT SCOUT'}
            </span>
          </button>

          {/* Autopilot Showcase Button */}
          <button
            onClick={toggleAutopilot}
            title={isAutopilotActive ? "Pause autonomous spider tour" : "Start spider crawling tour of portfolio highlights"}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isAutopilotActive
                ? 'bg-cyan-500 text-neutral-950 shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:border-amber-400'
            }`}
          >
            {isAutopilotActive ? <Pause size={12} /> : <Play size={12} />}
            <span>{isAutopilotActive ? 'PAUSE TOUR' : 'SPIDER TOUR'}</span>
          </button>

          {/* Highlight Most Important Elements Button */}
          <button
            onClick={toggleHighlights}
            title="Highlight all critical sections and top projects simultaneously"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
              isHighlightsOnly
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <Sparkles size={12} className={isHighlightsOnly ? 'text-neutral-950' : 'text-amber-400'} />
            <span className="hidden sm:inline">HIGHLIGHT CRITICAL</span>
          </button>
        </motion.div>

        {/* Telemetry Log Stream */}
        <AnimatePresence>
          {(isAutopilotActive || isHovered) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="text-[10px] font-mono text-neutral-400 bg-neutral-950/80 px-3 py-1 rounded-md border border-neutral-800/60 backdrop-blur-md flex items-center gap-2"
            >
              <Terminal size={11} className="text-amber-500" />
              <span className="text-neutral-300">{telemetryLog}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
