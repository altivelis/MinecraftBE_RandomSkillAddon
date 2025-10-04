import * as mc from "@minecraft/server";
import { getSkill } from "../main";

mc.world.afterEvents.entityHitEntity.subscribe(data => {
  let {damagingEntity, hitEntity} = data;
  if (damagingEntity instanceof mc.Player === false) return;
  if (!getSkill(damagingEntity) || getSkill(damagingEntity).id !== "area_attack") return;
  let event = mc.world.afterEvents.entityHurt.subscribe(data2 => {
    if (data2.hurtEntity.id != hitEntity.id) return;
    if (data2.damageSource.cause !== mc.EntityDamageCause.entityAttack) return;
    if (data2.damageSource.damagingEntity.id != damagingEntity.id) return;
    let entities = damagingEntity.dimension.getEntities({location: hitEntity.location, maxDistance: mc.world.getDynamicProperty("area_attack_range") || 3});
    entities.forEach(entity => {
      if (entity.id == damagingEntity.id) return;
      if (entity.id == hitEntity.id) return;
      let familyComponent = entity.getComponent(mc.EntityTypeFamilyComponent.componentId)
      if (familyComponent == undefined) return;
      if (!(familyComponent.hasTypeFamily("player") || familyComponent.hasTypeFamily("mob") || familyComponent.hasTypeFamily("animal"))) return;
      entity.applyDamage(data2.damage / 2, {cause: mc.EntityDamageCause.entityAttack, damagingEntity: damagingEntity});
      entity.dimension.spawnParticle("minecraft:critical_hit_emitter", {...entity.location, y: entity.location.y + 1});
    });
  })
  mc.system.run(() => {
    mc.world.afterEvents.entityHurt.unsubscribe(event);
  })
})