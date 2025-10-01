import * as mc from "@minecraft/server";
import { getSkill } from "../main";

mc.world.afterEvents.entityHurt.subscribe(data=>{
  const player = data.damageSource.damagingEntity;
  if(!player) return;
  if(!(player instanceof mc.Player)) return;
  let skill = getSkill(player);
  if(!skill || skill.id !== "vampire") return;
  const healthComponent = player.getComponent(mc.EntityHealthComponent.componentId);
  if(!healthComponent) return;
  if(healthComponent.currentValue >= healthComponent.effectiveMax) return; // 満タンならスキップ
  // ダメージ分回復する
  healthComponent.setCurrentValue(Math.min(Math.floor(healthComponent.currentValue + data.damage), healthComponent.effectiveMax));
  player.dimension.spawnParticle("minecraft:heart_particle", player.location);
})