import * as mc from "@minecraft/server";
import { hasSkill } from "../main";

mc.system.runInterval(() => {
  const players = mc.world.getPlayers().filter(player=>{
    return hasSkill(player, "mermaid");
  });
  if (players.length === 0) return;
  players.forEach(player=>{
    if(player.isInWater) {
      player.addEffect(mc.EffectTypes.get("conduit_power"), 20, {amplifier: 3, showParticles: false});
      player.addEffect(mc.EffectTypes.get("strength"), 20, {amplifier: 1, showParticles: false});
      player.addEffect(mc.EffectTypes.get("resistance"), 20, {amplifier: 1, showParticles: false});
      player.addEffect(mc.EffectTypes.get("regeneration"), 20, {amplifier: 1, showParticles: false});
    }
  })
})