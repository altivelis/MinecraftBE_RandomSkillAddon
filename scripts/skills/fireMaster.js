import * as mc from "@minecraft/server";
import { hasSkill } from "../main";

// 攻撃した相手を燃やす
mc.world.afterEvents.entityHitEntity.subscribe(data => {
  const player = data.damagingEntity;
  if (!(player instanceof mc.Player)) return;
  if (!hasSkill(player, "fire_master")) return;
  
  const target = data.hitEntity;
  // 相手を5秒間燃やす
  target.setOnFire(5, true);
});

mc.world.afterEvents.entitySpawn.subscribe(data => {
  let {cause, entity} = data;
  if (cause !== mc.EntityInitializationCause.Spawned) return;
  if (!entity.isValid) return;
  let pComponent = entity.getComponent(mc.EntityProjectileComponent.componentId);
  if (!pComponent) return;
  let shooter = pComponent.owner;
  if (!shooter) return;
  if (!(shooter instanceof mc.Player)) return;
  if (!hasSkill(shooter, "fire_master")) return;
  // pComponent.catchFireOnHurt = true;
  // pComponent.onFireTime = 5; // 命中後5秒間燃える
  entity.setOnFire(30, true);
})
