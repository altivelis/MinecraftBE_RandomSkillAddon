import * as mc from "@minecraft/server";
import { getSkill } from "../main";

mc.world.afterEvents.entityHitEntity.subscribe(data=>{
  const attacker = data.damagingEntity;
  const hurter = data.hitEntity;
  if (!(attacker instanceof mc.Player) || !(hurter instanceof mc.Entity)) return; // プレイヤーとモブのみ対象
  const skill = getSkill(attacker);
  if (!skill || skill.id !== "loot_master") return; // スキルが剥ぎ取り名人でない場合は処理をスキップ
  // モブがドロップするアイテムを取得
  hurter.addTag("lootMaster"); // ドロップアイテムを取得するためのタグを追加
  attacker.runCommand(`loot spawn ${hurter.location.x} ${hurter.location.y} ${hurter.location.z} kill @e[type=${hurter.typeId}, tag=lootMaster] mainhand`)
  hurter.removeTag("lootMaster")
})