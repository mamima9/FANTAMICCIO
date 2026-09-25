"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { createClient } from "@/lib/supabase/client";
import { BENIAMINI_MAPPA, NPCS } from "@/data/offseason";

type Dir = "down" | "up" | "side";

export default function TreguaGame() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const supabase = createClient();

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: root.current,
      width: 960,
      height: 540,
      pixelArt: true,
      backgroundColor: "#6f9f58",
      scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
      render: { antialias: false, roundPixels: true },
      physics: { default: "arcade", arcade: { debug: false } },
      scene: {
        preload(this: Phaser.Scene) {
          this.load.image("tiles", "/game/rpg-tileset.svg");
          this.load.image("player-down-1", "/game/player-down-1.svg");
          this.load.image("player-down-2", "/game/player-down-2.svg");
          this.load.image("player-up-1", "/game/player-up-1.svg");
          this.load.image("player-up-2", "/game/player-up-2.svg");
          this.load.image("player-side-1", "/game/player-side-1.svg");
          this.load.image("player-side-2", "/game/player-side-2.svg");
          this.load.image("npc", "/game/npc.svg");
          BENIAMINI_MAPPA.forEach((b) => this.load.image(`beni-${b.id}`, b.image));
        },
        create(this: Phaser.Scene) {
          const scene = this;
          const TILE = 32;
          const COLS = 48;
          const ROWS = 34;
          const WORLD_W = COLS * TILE;
          const WORLD_H = ROWS * TILE;

          scene.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
          scene.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
          scene.cameras.main.setZoom(2);

          const map = scene.make.tilemap({ tileWidth: TILE, tileHeight: TILE, width: COLS, height: ROWS });
          const tiles = map.addTilesetImage("rpg-tileset", "tiles", TILE, TILE, 0, 0, 1);
          if (!tiles) return;

          const ground = map.createBlankLayer("ground", tiles, 0, 0, COLS, ROWS, TILE, TILE);
          if (!ground) return;

          // Grass base.
          ground.fill(0);
          // Paths.
          const path = (x: number, y: number, w: number, h: number) => ground.fill(2, x, y, w, h);
          path(21, 0, 4, ROWS);
          path(0, 15, COLS, 4);
          path(10, 4, 25, 3);
          path(8, 25, 30, 3);
          ground.fill(3, 19, 14, 8, 6);

          // Water pond and bridge.
          ground.fill(4, 2, 2, 7, 6);
          ground.fill(5, 4, 4, 3, 2);

          // Village buildings.
          const building = (x: number, y: number, w: number, h: number) => {
            ground.fill(6, x, y, w, h);
            ground.fill(7, x, y - 1, w, 1);
          };
          building(12, 8, 5, 5);
          building(29, 8, 6, 5);
          building(34, 21, 5, 5);
          building(8, 20, 5, 5);

          // Decorative trees and rocks.
          const decorations: Array<[number, number, number]> = [];
          for (let x = 1; x < 47; x += 4) {
            decorations.push([x, 1, 8]);
            decorations.push([x + 1, 30, 8]);
          }
          [[1,10],[6,12],[39,5],[43,12],[45,22],[3,25],[17,30],[28,30],[42,29],[37,15]].forEach(([x,y]) => decorations.push([x,y,14]));
          decorations.forEach(([x,y,t]) => ground.putTileAt(t,x,y));

          // Collision from occupied map tiles.
          const blocked = new Set<string>();
          const blockRect = (x:number,y:number,w:number,h:number) => {
            for(let yy=y; yy<y+h; yy++) for(let xx=x; xx<x+w; xx++) blocked.add(`${xx},${yy}`);
          };
          blockRect(2,2,7,6);
          blockRect(12,7,5,6); blockRect(29,7,6,6); blockRect(34,20,5,6); blockRect(8,19,5,6);
          decorations.forEach(([x,y]) => blockRect(x,y,1,1));
          ground.setCollisionByExclusion([0,1,2,3,5,12,15]);
          
          let userId: string | null = null;
          const collected = new Set<string>();

          const player = scene.physics.add.sprite(24*TILE, 18*TILE, "player-down-1");
          player.setScale(.72);
          player.setCollideWorldBounds(true);
          player.setDepth(player.y);
          const playerBody = player.body;
          if (playerBody) {
            playerBody.setSize(22, 18).setOffset(13, 40);
          }
          scene.cameras.main.startFollow(player, true, .12, .12);

          const anim = (key:string, frames:string[]) => {
            if (scene.anims.exists(key)) return;
            scene.anims.create({ key, frames: frames.map(f=>({key:f})), frameRate:7, repeat:-1 });
          };
          anim("walk-down", ["player-down-1","player-down-2"]);
          anim("walk-up", ["player-up-1","player-up-2"]);
          anim("walk-side", ["player-side-1","player-side-2"]);

          const npcObjects = NPCS.map((npc, i) => {
            const b = BENIAMINI_MAPPA[i];
            const x = Math.round((b?.coordinates[1] ?? 10.2) * 1000) % (COLS-4) * TILE;
            const y = Math.round((b?.coordinates[0] ?? 43.97) * 1000) % (ROWS-4) * TILE;
            const sprite = scene.add.image(Math.max(48,x), Math.max(48,y), "npc").setScale(.72).setDepth(Math.max(48,y));
            return { npc, sprite };
          });

          const positions: Record<string,{x:number;y:number}> = {
            cervia:{x:6,y:25}, leondoro:{x:37,y:7}, lucertola:{x:42,y:11}, madonnina:{x:26,y:11},
            ponte:{x:5,y:18}, pozzo:{x:39,y:18}, quercia:{x:22,y:13}, ranocchio:{x:11,y:11}
          };

          const objects = new Map<string, Phaser.GameObjects.Image>();
          BENIAMINI_MAPPA.forEach(b => {
            const p = positions[b.id];
            const sprite = scene.add.image(p.x*TILE+16,p.y*TILE+10,`beni-${b.id}`).setDisplaySize(54,54).setDepth(p.y*TILE+20);
            scene.tweens.add({targets:sprite,y:sprite.y-5,duration:700,yoyo:true,repeat:-1,ease:"Sine.easeInOut"});
            objects.set(b.id,sprite);
          });

          const hud = scene.add.container(18,18).setScrollFactor(0).setDepth(9000);
          const box = scene.add.rectangle(0,0,310,105,0x2b1c14,.94).setOrigin(0).setStrokeStyle(2,0xd4af37);
          const title = scene.add.text(16,10,"TREGUA TRA CONTRADE",{fontFamily:"Arial",fontSize:"16px",color:"#f4cf64",fontStyle:"bold"});
          const progress = scene.add.text(16,38,"BENIAMINI 0 / 8",{fontFamily:"Arial",fontSize:"22px",color:"#fff",fontStyle:"bold"});
          const hint = scene.add.text(16,73,"WASD / FRECCE · E per interagire",{fontFamily:"Arial",fontSize:"12px",color:"#eadfce"});
          hud.add([box,title,progress,hint]);

          const dialog = scene.add.container(scene.scale.width/2,scene.scale.height-75).setScrollFactor(0).setDepth(10000).setVisible(false);
          const dbox = scene.add.rectangle(0,0,760,105,0x241812,.97).setStrokeStyle(3,0xd4af37);
          const dtext = scene.add.text(-345,-35,"",{fontFamily:"Arial",fontSize:"16px",color:"#fff",wordWrap:{width:690},lineSpacing:5});
          dialog.add([dbox,dtext]);
          let timer: Phaser.Time.TimerEvent|null=null;
          const say=(s:string)=>{timer?.remove(); dtext.setText(s); dialog.setVisible(true); timer=scene.time.delayedCall(4200,()=>dialog.setVisible(false));};

          const tregua = scene.add.container(scene.scale.width/2,18).setScrollFactor(0).setDepth(9500).setVisible(false);
          const tb = scene.add.rectangle(0,0,250,42,0xd4af37).setStrokeStyle(2,0x5c3a21).setInteractive({useHandCursor:true});
          const tt = scene.add.text(0,0,"🤝 CERCA IL BARONE",{fontFamily:"Arial",fontSize:"15px",color:"#3b2617",fontStyle:"bold"}).setOrigin(.5);
          tregua.add([tb,tt]); tb.on("pointerdown",()=>window.location.href="/tregua");

          const update=()=>{progress.setText(`BENIAMINI ${collected.size} / 8`); if(collected.size===8){tregua.setVisible(true);say("Hai trovato tutti gli 8 Beniamini! Ora puoi cercare un giocatore di un'altra Contrada.");}};
          const load=async()=>{const {data:{user}}=await supabase.auth.getUser(); if(!user){say("Accedi per salvare la tua raccolta.");return;} userId=user.id; const {data}=await supabase.from("user_beniamini").select("beniamino_id").eq("user_id",user.id); (data??[]).forEach((r:{beniamino_id:string})=>{if(positions[r.beniamino_id]){collected.add(r.beniamino_id);objects.get(r.beniamino_id)?.setVisible(false);}}); update();};
          const interact=async()=>{let best:string|null=null,bd=Infinity; BENIAMINI_MAPPA.forEach(b=>{if(collected.has(b.id))return;const p=positions[b.id];const d=Phaser.Math.Distance.Between(player.x,player.y,p.x*TILE+16,p.y*TILE+10);if(d<bd){bd=d;best=b.id;}}); if(best&&bd<80){if(!userId){say("Devi accedere per raccogliere il Beniamino.");return;} const {error}=await supabase.from("user_beniamini").insert({user_id:userId,beniamino_id:best}); if(error&&error.code!=="23505"){say("Errore nel salvataggio.");return;} collected.add(best); objects.get(best)?.destroy(); update(); const b=BENIAMINI_MAPPA.find(x=>x.id===best); if(b)say(`✨ Hai trovato ${b.nome}!`); return;} let ni=-1,nd=Infinity; npcObjects.forEach((o,i)=>{const d=Phaser.Math.Distance.Between(player.x,player.y,o.sprite.x,o.sprite.y);if(d<nd){nd=d;ni=i;}}); if(ni>=0&&nd<85){const n=npcObjects[ni].npc;say(`${n.nome}: ${n.text}\\n\\n${n.clue}`);}};
          
          const keys=scene.input.keyboard?.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE,SHIFT") as Record<string,Phaser.Input.Keyboard.Key>|undefined;
          scene.events.on("update",(_t:number,delta:number)=>{const dt=Math.min(delta,32)/1000; if(!keys)return; let x=0,y=0;if(keys.A.isDown||keys.LEFT.isDown)x--;if(keys.D.isDown||keys.RIGHT.isDown)x++;if(keys.W.isDown||keys.UP.isDown)y--;if(keys.S.isDown||keys.DOWN.isDown)y++;const len=Math.hypot(x,y);if(len>1){x/=len;y/=len;}const speed=keys.SHIFT.isDown?190:135;player.setVelocity(x*speed,y*speed);if(Math.abs(x)+Math.abs(y)>.05){if(Math.abs(x)>Math.abs(y)){player.anims.play("walk-side",true);player.setFlipX(x<0);}else player.anims.play(y>0?"walk-down":"walk-up",true);}else player.anims.stop();player.setDepth(player.y); if(Phaser.Input.Keyboard.JustDown(keys.E)||Phaser.Input.Keyboard.JustDown(keys.SPACE))void interact();});
          const resize=()=>{hud.setPosition(18,18);tregua.setPosition(scene.scale.width/2,18);dialog.setPosition(scene.scale.width/2,scene.scale.height-75);};
          scene.scale.on("resize",resize); resize(); void load(); scene.cameras.main.fadeIn(500,0,0,0);
        }
      }
    };
    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, []);

  return <div ref={root} className="fixed inset-0 overflow-hidden bg-black" />;
}
