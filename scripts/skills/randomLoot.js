import * as mc from "@minecraft/server";
import { hasSkill } from "../main";

mc.world.afterEvents.entitySpawn.subscribe(data => {
  if(data.entity.typeId !== "minecraft:item") return;
  if(data.entity.isValid == false) return;
  let amount = data.entity.getComponent(mc.EntityItemComponent.componentId).itemStack.amount;
  // mc.world.sendMessage(`${data.entity.location.x}, ${data.entity.location.y}, ${data.entity.location.z}にアイテムが生成されました。`);
  /**
   * @param {mc.EntityDieAfterEvent} data2 
   * @returns {void}
   */
  let process = (data2) => {
    if (data2.deadEntity.typeId == "minecraft:player") return;
    const player = data2.damageSource.damagingEntity;
    if(!player || !(player instanceof mc.Player) || !hasSkill(player, "random_loot")) return;
    if (data2.deadEntity.dimension.id != data.entity.dimension.id) return;
    // if (Math.floor(data2.deadEntity.location.x) != Math.floor(data.entity.location.x)) return;
    // if (Math.floor(data2.deadEntity.location.y) != Math.floor(data.entity.location.y)) return;
    // if (Math.floor(data2.deadEntity.location.z) != Math.floor(data.entity.location.z)) return;
    if(distance(data2.deadEntity.location, data.entity.location) > 2) return;
    let item = data.entity.dimension.spawnItem(new mc.ItemStack(mc.ItemTypes.getAll()[Math.floor(Math.random() * mc.ItemTypes.getAll().length)], amount), data.entity.location);
    item.clearVelocity();
    item.applyImpulse(data.entity.getVelocity());
    data.entity.remove();
  }
  mc.world.afterEvents.entityDie.subscribe(process);
  mc.system.run(() => {
    mc.world.afterEvents.entityDie.unsubscribe(process);
  });
})

/**
 * 座標同士の距離を計算する関数
 * @param {mc.Vector3} pos1
 * @param {mc.Vector3} pos2
 */
function distance(pos1, pos2) {
  return Math.sqrt(
    Math.pow(pos2.x - pos1.x, 2) +
    Math.pow(pos2.y - pos1.y, 2) +
    Math.pow(pos2.z - pos1.z, 2)
  );
}