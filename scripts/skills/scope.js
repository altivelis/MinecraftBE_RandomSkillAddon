import * as mc from "@minecraft/server";
import { hasSkill } from "../main";

mc.system.runInterval(() => {
  const players = mc.world.getPlayers();
  players.forEach(player =>{
    if (!hasSkill(player, "scope")) return;

    if(player.isSneaking) {
      player.camera.setFov({fov: 30, easeOptions: {easeTime:0.3, easeType: mc.EasingType.OutCubic}});
    } else {
      player.camera.clear();
    }
  });
})