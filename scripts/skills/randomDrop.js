import * as mc from "@minecraft/server";
import { getSkill } from "../main";

mc.world.afterEvents.playerBreakBlock.subscribe(data=>{
  if (!getSkill(data.player) || getSkill(data.player).id !== "random_drop") return;
  /**
   * @param {mc.EntitySpawnAfterEvent} data2 
   * @returns {void}
   */
  let process = (data2) => {
    if (data2.entity.typeId !== "minecraft:item") return;
    if (data.dimension.id != data2.entity.dimension.id) return;
    if (distance(data.block.center(), data2.entity.location) > 2) return;
    let amount = data2.entity.getComponent(mc.EntityItemComponent.componentId).itemStack.amount;
    let item = data2.entity.dimension.spawnItem(new mc.ItemStack(mc.ItemTypes.getAll()[Math.floor(Math.random() * mc.ItemTypes.getAll().length)], amount), data2.entity.location);
    item.clearVelocity();
    item.applyImpulse(data2.entity.getVelocity());
    data2.entity.remove();
  }
  mc.world.afterEvents.entitySpawn.subscribe(process);
  mc.system.run(() => {
    mc.world.afterEvents.entitySpawn.unsubscribe(process);
  })
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