import * as mc from "@minecraft/server";
import { getSkill } from "../main";

mc.system.runInterval(() => {
  const radius = mc.world.getDynamicProperty("nature_blessing_radius") || 5;
  const players = mc.world.getPlayers().filter(player => {
    const skill = getSkill(player);
    return skill && skill.id === "nature_blessing";
  })
  if (players.length === 0) return;
  players.forEach(player => {
    // 自然の恵みスキルの効果を適用
    const p = player.location;
    const locations = player.dimension.getBlocks(
      new mc.BlockVolume({x: p.x - radius, y: p.y - radius, z: p.z - radius}, {x: p.x + radius, y: p.y + radius, z: p.z + radius}),
      {}
    ).getBlockLocationIterator();
    for (const loc of locations) {
      if (getDistance(player.location, loc) > radius) continue;
      const block = player.dimension.getBlock(loc);
      const state = block.permutation.getState("growth");
      if(state === undefined) continue; // 成長状態がないブロックはスキップ
      if(state >= 7) continue; // 既に最大成長状態のブロックはスキップ
      block.setPermutation(block.permutation.withState("growth", state + 1));
    }
  });
}, 4)

function getDistance(loc1, loc2) {
  const dx = Math.floor(loc1.x) - Math.floor(loc2.x);
  const dy = Math.floor(loc1.y) - Math.floor(loc2.y);
  const dz = Math.floor(loc1.z) - Math.floor(loc2.z);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}