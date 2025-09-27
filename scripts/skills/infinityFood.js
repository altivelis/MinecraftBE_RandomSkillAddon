import * as mc from "@minecraft/server";
import { getSkill } from "../main";

mc.world.afterEvents.itemCompleteUse.subscribe(data=>{
  if (!data.itemStack.hasTag("minecraft:is_food") && !data.itemStack.hasTag("minecraft:is_food")) return;
  const skill = getSkill(data.source);
  if (!skill || skill.id !== "infinity_food") return;
  const player = data.source;
  data.itemStack.amount = 1;
  player.getComponent(mc.EntityInventoryComponent.componentId).container.addItem(data.itemStack);
})