/* Lightweight procedural skeletal animation pack for the 1v1 TDM Arena.
   Works on the loaded player body's existing skeleton; no extra 3D asset or heavy library. */
(function (root) {
  'use strict';
  function prepare(body) {
    const bones = [];
    body.traverse(function (o) {
      if (!o.isBone) return;
      bones.push({
        bone: o,
        name: o.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
        base: o.quaternion.clone()
      });
    });
    return bones;
  }
  function pose(state, now, moving, ctx) {
    if (!state || !state.bones || !state.bones.length) return;
    ctx = ctx || {};
    const run = !!ctx.run && moving;
    const crouch = !!ctx.crouch;
    const jump = !!ctx.jump;
    const shoot = !!ctx.shoot;
    const reload = !!ctx.reload;
    const dead = !!ctx.dead;
    const phase = now * (run ? 13 : 8) + (ctx.enemy ? 1.7 : 0);
    const swing = moving ? (run ? 0.62 : 0.38) : 0.025;
    state.bones.forEach(function (item) {
      const n = item.name;
      let x = 0, y = 0, z = 0;
      if (/leftupleg|leftthigh|thighl|legl|leftleg/.test(n)) x = Math.sin(phase) * swing;
      else if (/rightupleg|rightthigh|thighr|legr|rightleg/.test(n)) x = -Math.sin(phase) * swing;
      else if (/leftfoot|footl|leftankle/.test(n)) x = Math.max(0, -Math.sin(phase)) * swing * 0.35;
      else if (/rightfoot|footr|rightankle/.test(n)) x = Math.max(0, Math.sin(phase)) * swing * 0.35;
      else if (/leftarm|leftupperarm|upperarml|arml|shoulderl/.test(n)) {
        x = shoot ? -0.65 : Math.sin(phase + Math.PI) * swing * 0.45;
        y = shoot ? -0.12 : 0; z = shoot ? -0.18 : -0.04;
      } else if (/rightarm|rightupperarm|upperarmr|armr|shoulderr/.test(n)) {
        x = shoot ? -0.82 : Math.sin(phase) * swing * 0.35;
        y = shoot ? -0.08 : 0; z = shoot ? 0.14 : 0.04;
      } else if (/leftforearm|forearml|lowerarml/.test(n)) x = shoot ? -1.05 : (reload ? -0.45 : 0);
      else if (/rightforearm|forearmr|lowerarmr/.test(n)) x = shoot ? -1.15 : (reload ? -0.8 : 0);
      else if (/spine|chest|torso/.test(n)) { z = moving ? Math.sin(phase * 0.5) * 0.035 : 0; x = shoot ? -0.08 : 0; }
      else if (/head|neck/.test(n)) { x = shoot ? -0.04 : 0; y = shoot ? -0.025 : 0; }
      if (crouch && /spine|chest|torso|upleg|thigh/.test(n)) x += /spine|chest|torso/.test(n) ? 0.22 : 0.45;
      if (jump && /upleg|thigh/.test(n)) x -= 0.18;
      if (dead && /spine|chest|torso/.test(n)) z += 0.35;
      const q = new root.THREE.Quaternion().setFromEuler(new root.THREE.Euler(x, y, z, 'XYZ'));
      item.bone.quaternion.copy(item.base).multiply(q);
    });
  }
  root.PlayerAnimations = { prepare: prepare, pose: pose, version: 1 };
})(window);
