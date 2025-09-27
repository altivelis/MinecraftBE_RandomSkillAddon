import * as mc from "@minecraft/server";
import { getSkill } from "../main";

mc.world.afterEvents.itemCompleteUse.subscribe(data=>{
  if (!data.itemStack.hasTag("minecraft:is_food") && !data.itemStack.hasTag("minecraft:is_food")) return;
  const skill = getSkill(data.source);
  if (!skill || skill.id !== "eat_teleport") return;
  const player = data.source;
  const positionIterator = player.dimension.getBlocks(new mc.BlockVolume(
    {x:player.location.x - 16, y:player.location.y + 16, z:player.location.z - 16},
    {x:player.location.x + 16, y:player.location.y + 16, z:player.location.z + 16}
  ), {includeTypes: ["minecraft:air"]}).getBlockLocationIterator();
  /** @type {Array<mc.Vector3>} */
  const positions = [];
  let count = 0;
  for (const pos of positionIterator) {
    count++;
    let belowPos = player.dimension.getBlockBelow(pos).location;
    positions.push({...belowPos, y:belowPos.y + 1});
  }
  while(1) {
    if (positions.length === 0) break;
    let index = Math.floor(Math.random() * positions.length);
    if (player.tryTeleport(player.dimension.getBlock(positions[index]).bottomCenter())) break;
    positions.splice(index, 1);
  }
})