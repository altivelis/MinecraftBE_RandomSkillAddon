import * as mc from "@minecraft/server";
import { getSkill } from "../main";

mc.system.runInterval(() => {
  let power = mc.world.getDynamicProperty("satoruLength") || 3;
  mc.world.getPlayers().filter(player => {
    const skill = getSkill(player);
    return skill && skill.id === "gojo_satoru";
  }).forEach(player => {
    // プレイヤーが「無下限呪術」スキルを持っている場合の処理
    const nearbyEntities = player.dimension.getEntities({location: player.location, maxDistance: power});
    nearbyEntities.forEach(entity => {
      if (entity.typeId !== "minecraft:player") {
        // プレイヤー以外のエンティティを反発させる
        const vector = getVectorBetweenEntities(player, entity);
        entity.applyImpulse({
          x: vector.x, // 反発力の強さを調整
          y: vector.y,
          z: vector.z
        });
      }else{
        if (entity === player) return; // 自分自身には適用しない
        const vector = getVectorBetweenEntities(player, entity);
        entity.applyKnockback({x: vector.x, z: vector.z}, vector.y);
      }
    });
  });
})

/**
 * 2つのエンティティ間のベクトルを取得する関数
 * @param {mc.Entity | mc.Player} fromEntity 
 * @param {mc.Entity | mc.Player} toEntity 
 * @return {{x: number, y: number, z: number}}
 */
function getVectorBetweenEntities(fromEntity, toEntity) {
  let fp = fromEntity.location;
  let tp = toEntity.location;
  let v = {
    x: tp.x - fp.x,
    y: tp.y - fp.y,
    z: tp.z - fp.z
  };
  let length = Math.sqrt(v.x**2 + v.y**2 + v.z**2);
  if (length > 0) {
    v.x /= length;
    v.y /= length;
    v.z /= length;
  }
  return v;
}