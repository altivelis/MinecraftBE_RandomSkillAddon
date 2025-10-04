import * as mc from "@minecraft/server";
import { hasSkill } from "../main";

mc.system.runInterval(() => {
  const players = mc.world.getPlayers();
  players.forEach(player =>{
    if (!hasSkill(player, "rpg_player")) return;
    
    let lookingEntity = player.getEntitiesFromViewDirection({maxdistance: 32})[0]?.entity;
    if(!lookingEntity) return;

    let name = (lookingEntity?.nameTag != "")?lookingEntity.nameTag:{translate: `entity.${lookingEntity.typeId.slice(10)}.name`}
    const healthComponent = lookingEntity.getComponent(mc.EntityHealthComponent.componentId);
    if(!healthComponent) return;
    let currentHp = healthComponent.currentValue;
    let maxHp = healthComponent.effectiveMax;
    player.onScreenDisplay.setActionBar([name, ` §l§a${Math.floor(currentHp*10)/10}§r/${Math.floor(maxHp*10)/10}`, `\n§l§a${"/".repeat(Math.floor((currentHp/maxHp)*20))}§4${"/".repeat(20-Math.floor((currentHp/maxHp)*20))}`]);
  });
})