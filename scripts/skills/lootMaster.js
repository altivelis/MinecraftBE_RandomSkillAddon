import * as mc from "@minecraft/server";
import { getSkill } from "../main";

mc.world.afterEvents.entityHitEntity.subscribe(data => {
  const {damagingEntity, hitEntity} = data;
  if (damagingEntity instanceof mc.Player === false) return;
  if (!getSkill(damagingEntity) || getSkill(damagingEntity).id !== "loot_master") return;
  let event = mc.world.afterEvents.entityHurt.subscribe(data2 => {
    if (data2.hurtEntity.isValid == false) return;
    if (data2.hurtEntity.id != hitEntity.id) return;
    if (data2.damageSource.cause !== mc.EntityDamageCause.entityAttack) return;
    if (data2.damageSource.damagingEntity.id != damagingEntity.id) return;
    hitEntity.addTag("lootMaster"); // ドロップアイテムを取得するためのタグを追加
    damagingEntity.runCommand(`loot spawn ${hitEntity.location.x} ${hitEntity.location.y} ${hitEntity.location.z} kill @e[type=${hitEntity.typeId}, tag=lootMaster] mainhand`)
    hitEntity.removeTag("lootMaster");
  })
  mc.system.run(() => {
    mc.world.afterEvents.entityHurt.unsubscribe(event);
  })
})