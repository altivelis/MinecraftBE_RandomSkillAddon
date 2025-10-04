import * as mc from "@minecraft/server";
import { hasSkill } from "../main";

mc.world.afterEvents.entityHitEntity.subscribe(data => {
  let {damagingEntity, hitEntity} = data;
  if (damagingEntity instanceof mc.Player === false) return;
  if (!hasSkill(damagingEntity, "potion_hand")) return;
  let event = mc.world.afterEvents.entityHurt.subscribe(data2 => {
    if (data2.hurtEntity.id != hitEntity.id) return;
    if (data2.damageSource.cause !== mc.EntityDamageCause.entityAttack) return;
    if (data2.damageSource.damagingEntity.id != damagingEntity.id) return;
    const effects = mc.EffectTypes.getAll();
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    hitEntity.addEffect(randomEffect, mc.TicksPerSecond * 30, {amplifier: 1, showParticles: true});
  })
  mc.system.run(() => {
    mc.world.afterEvents.entityHurt.unsubscribe(event);
  })
})