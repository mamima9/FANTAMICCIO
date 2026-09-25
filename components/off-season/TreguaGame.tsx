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
          ["cervia","leondoro","lucertola","madonnina","ponte","pozzo","quercia","ranocchio"].forEach((id) => {
            this.load.image(`player-${id}`, `/game/player-${id}.svg`);
          });
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
          const isMobile = window.innerWidth < 768 || "ontouchstart" in window || navigator.maxTouchPoints > 0;
          scene.cameras.main.setZoom(isMobile ? 2.6 : 2);

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
          let username = "Contradaiolo";
          let contradaId = "";
          const collected = new Set<string>();

          const contradaConfig: Record<string,{primary:string;secondary:string;label:string}> = {
            cervia:{primary:"#f4f1e8",secondary:"#7bb8d9",label:"La Cervia"},
            leondoro:{primary:"#e5b93f",secondary:"#c63f3f",label:"Il Leon d'Oro"},
            lucertola:{primary:"#c63f3f",secondary:"#4d914f",label:"La Lucertola"},
            madonnina:{primary:"#3f67ad",secondary:"#e5b93f",label:"La Madonnina"},
            ponte:{primary:"#c63f3f",secondary:"#3f67ad",label:"Il Ponte"},
            pozzo:{primary:"#f4f1e8",secondary:"#c63f3f",label:"Il Pozzo"},
            quercia:{primary:"#f4f1e8",secondary:"#252525",label:"La Quercia"},
            ranocchio:{primary:"#e5b93f",secondary:"#4d914f",label:"Il Ranocchio"}
          };

          const player = scene.physics.add.sprite(24*TILE, 18*TILE, "player-quercia");
          player.setScale(.72);
          player.setCollideWorldBounds(true);
          player.setDepth(player.y);
          const playerBody = player.body;
          if (playerBody) {
            playerBody.setSize(22, 18).setOffset(13, 40);
          }
          scene.cameras.main.startFollow(player, true, .12, .12);

          const usernameText = scene.add.text(player.x, player.y - 55, username, {
            fontFamily:"Arial", fontSize:isMobile ? "11px" : "12px", color:"#fff",
            fontStyle:"bold", stroke:"#241812", strokeThickness:4
          }).setOrigin(.5).setDepth(20000);

          const setPlayerContrada = (id:string) => {
            const valid = contradaConfig[id] ? id : "quercia";
            contradaId = valid;
            player.setTexture(`player-${valid}`);
            usernameText.setText(username);
          };

          const npcPositions: Record<string,{x:number;y:number}> = {
            "vecchio-contradaiolo": {x:23,y:12},
            "contadino-ranocchio": {x:12,y:12},
            "storico-leon": {x:36,y:8},
            "custode-madonnina": {x:27,y:12},
            "viandante-cervia": {x:7,y:24},
            "abitante-ripa": {x:42,y:12},
            "guardiano-ponte": {x:6,y:20},
            "guardiano-pozzi": {x:38,y:19}
          };

          const npcObjects = NPCS.map((npc) => {
            const p = npcPositions[npc.id] ?? {x:24,y:17};
            const sprite = scene.add.image(p.x*TILE+16,p.y*TILE+10,"npc").setScale(.72).setDepth(p.y*TILE+20);
            const tag=scene.add.container(sprite.x,sprite.y-43).setDepth(p.y*TILE+90);
            const tagBg=scene.add.rectangle(0,0,112,20,0x241812,0.86).setStrokeStyle(1,0xd4af37,0.55);
            const tagText=scene.add.text(0,0,npc.nome,{fontFamily:"Arial",fontSize:"8px",fontStyle:"bold",color:"#fff"}).setOrigin(.5);
            tag.add([tagBg,tagText]);
            scene.tweens.add({targets:tag,y:tag.y-2,duration:900,yoyo:true,repeat:-1,ease:"Sine.easeInOut"});
            return { npc, sprite };
          });

          const positions: Record<string,{x:number;y:number}> = {
            cervia:{x:6,y:25}, leondoro:{x:37,y:7}, lucertola:{x:42,y:11}, madonnina:{x:26,y:11},
            ponte:{x:5,y:18}, pozzo:{x:39,y:18}, quercia:{x:22,y:13}, ranocchio:{x:11,y:11}
          };

          // Otto micro-zone: ogni area ha il nome della Contrada e un punto di riferimento visivo.
          Object.entries(positions).forEach(([id,p])=>{
            const cfg=contradaConfig[id];
            if(!cfg) return;
            const x=p.x*TILE+16, y=p.y*TILE+10;
            const halo=scene.add.circle(x,y,25,Phaser.Display.Color.HexStringToColor(cfg.secondary).color,0.12).setDepth(p.y*TILE+1);
            scene.tweens.add({targets:halo,scaleX:1.18,scaleY:1.18,alpha:0.05,duration:1100,yoyo:true,repeat:-1,ease:"Sine.easeInOut"});
            const sign=scene.add.container(x,y-38).setDepth(p.y*TILE+80);
            const flag=scene.add.rectangle(0,0,5,22,Phaser.Display.Color.HexStringToColor(cfg.secondary).color).setOrigin(.5);
            const plate=scene.add.rectangle(8,0,86,22,0x241812,0.9).setStrokeStyle(1,Phaser.Display.Color.HexStringToColor(cfg.primary).color,0.75);
            const label=scene.add.text(8,0,cfg.label.toUpperCase(),{fontFamily:"Arial",fontSize:"7px",fontStyle:"bold",color:"#fff"}).setOrigin(.5);
            sign.add([flag,plate,label]);
          });

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
          const hint = scene.add.text(16,73,isMobile ? "🕹️ Muovi · tocca E per interagire" : "WASD / FRECCE · E per interagire",{fontFamily:"Arial",fontSize:"12px",color:"#eadfce"});
          hud.add([box,title,progress,hint]);

          // Mobile orientation map: a compact overview of the whole village.
          const mini = scene.add.container(scene.scale.width - (isMobile ? 92 : 145), isMobile ? 92 : 105)
            .setScrollFactor(0).setDepth(11000);
          const miniW = isMobile ? 150 : 190;
          const miniH = isMobile ? 105 : 130;
          const miniBg = scene.add.rectangle(0,0,miniW,miniH,0x16251b,.9).setOrigin(.5).setStrokeStyle(2,0xd4af37,.9);
          const miniTitle = scene.add.text(-miniW/2+9,-miniH/2+6,"MAPPA",{fontFamily:"Arial",fontSize:isMobile?"10px":"11px",color:"#f4cf64",fontStyle:"bold"});
          mini.add([miniBg,miniTitle]);

          const mapDots = [
            ["Cervia",6,25],["Leon d'Oro",37,7],["Lucertola",42,11],["Madonnina",26,11],
            ["Ponte",5,18],["Pozzo",39,18],["Quercia",22,13],["Ranocchio",11,11]
          ] as const;
          const miniScaleX=(miniW-18)/(COLS-1);
          const miniScaleY=(miniH-28)/(ROWS-1);
          mapDots.forEach(([name,x,y])=>{
            const id=name==="Leon d'Oro"?"leondoro":name.toLowerCase().replace(/\s+/g,"");
            const cfg=contradaConfig[id];
            const secondary=cfg ? Phaser.Display.Color.HexStringToColor(cfg.secondary).color : 0xf4cf64;
            const dot=scene.add.circle(-miniW/2+9+x*miniScaleX,-miniH/2+20+y*miniScaleY,3.5,secondary,1).setStrokeStyle(1,0xffffff,.8);
            mini.add(dot);
            const label=scene.add.text(dot.x+5,dot.y-5,name,{fontFamily:"Arial",fontSize:isMobile?"7px":"8px",color:"#fff",fontStyle:"bold"});
            mini.add(label);
          });
          const playerDot=scene.add.circle(0,0,5,0xffffff,1).setStrokeStyle(2,0x5c3a21,1);
          mini.add(playerDot);
          scene.tweens.add({targets:playerDot,scaleX:1.35,scaleY:1.35,alpha:.65,duration:650,yoyo:true,repeat:-1,ease:"Sine.easeInOut"});
          const updateMini=()=>{
            playerDot.setPosition(-miniW/2+9+(player.x/TILE)*miniScaleX,-miniH/2+20+(player.y/TILE)*miniScaleY);
          };

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

          const updatePlayerLabel=()=>{usernameText.setPosition(player.x,player.y-55);usernameText.setDepth(player.y+1000);};
          const update=()=>{progress.setText(`BENIAMINI ${collected.size} / 8`); if(collected.size===8){tregua.setVisible(true);say("Hai trovato tutti gli 8 Beniamini! Ora puoi cercare un giocatore di un'altra Contrada.");}};
          const load=async()=>{const {data:{user}}=await supabase.auth.getUser(); if(!user){say("Accedi per salvare la tua raccolta.");return;} userId=user.id;
            const {data:profile}=await supabase.from("profiles").select("username,contrada_id").eq("id",user.id).maybeSingle();
            if(profile){username=profile.username || "Contradaiolo"; setPlayerContrada(profile.contrada_id || "quercia");}
            const {data}=await supabase.from("user_beniamini").select("beniamino_id").eq("user_id",user.id); (data??[]).forEach((r:{beniamino_id:string})=>{if(positions[r.beniamino_id]){collected.add(r.beniamino_id);objects.get(r.beniamino_id)?.setVisible(false);}}); update();};
          const interact=async()=>{let best:string|null=null,bd=Infinity; BENIAMINI_MAPPA.forEach(b=>{if(collected.has(b.id))return;const p=positions[b.id];const d=Phaser.Math.Distance.Between(player.x,player.y,p.x*TILE+16,p.y*TILE+10);if(d<bd){bd=d;best=b.id;}}); if(best&&bd<80){if(!userId){say("Devi accedere per raccogliere il Beniamino.");return;} const {error}=await supabase.from("user_beniamini").insert({user_id:userId,beniamino_id:best}); if(error&&error.code!=="23505"){say("Errore nel salvataggio.");return;} collected.add(best); objects.get(best)?.destroy(); update(); const b=BENIAMINI_MAPPA.find(x=>x.id===best); if(b)say(`✨ Hai trovato ${b.nome}!`); return;} let ni=-1,nd=Infinity; npcObjects.forEach((o,i)=>{const d=Phaser.Math.Distance.Between(player.x,player.y,o.sprite.x,o.sprite.y);if(d<nd){nd=d;ni=i;}}); if(ni>=0&&nd<85){const n=npcObjects[ni].npc;say(`${n.nome}: ${n.text}\\n\\n${n.clue}`);}};
          
          const keys = scene.input.keyboard?.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE,SHIFT") as Record<string, Phaser.Input.Keyboard.Key> | undefined;

          // Mobile joystick + interaction button.
          let joyX = 0;
          let joyY = 0;
          let joystickPointerId: number | null = null;
          const mobile = scene.add.container(112, scene.scale.height - 112).setScrollFactor(0).setDepth(12000).setVisible(isMobile);
          const joyBase = scene.add.circle(0, 0, 62, 0x171717, 0.58).setStrokeStyle(3, 0xffffff, 0.22);
          const joyRing = scene.add.circle(0, 0, 45, 0x000000, 0.16).setStrokeStyle(2, 0xffffff, 0.18);
          const joyKnob = scene.add.circle(0, 0, 27, 0xd4af37, 0.88).setStrokeStyle(2, 0xffffff, 0.5);
          mobile.add([joyBase, joyRing, joyKnob]);

          const action = scene.add.container(scene.scale.width - 92, scene.scale.height - 105).setScrollFactor(0).setDepth(12000).setVisible(isMobile);
          const actionBg = scene.add.circle(0, 0, 42, 0x8b3f2f, 0.9).setStrokeStyle(3, 0xffffff, 0.35).setInteractive();
          const actionText = scene.add.text(0, 0, "E", {fontFamily:"Arial",fontSize:"24px",color:"#fff",fontStyle:"bold"}).setOrigin(.5);
          action.add([actionBg, actionText]);

          const setJoystick=(pointer: Phaser.Input.Pointer)=>{
            const dx = pointer.x - mobile.x;
            const dy = pointer.y - mobile.y;
            const len = Math.hypot(dx,dy);
            const max = 50;
            const scale = len > max ? max / len : 1;
            joyX = (dx * scale) / max;
            joyY = (dy * scale) / max;
            joyKnob.setPosition(dx * scale, dy * scale);
          };
          const resetJoystick=()=>{
            joyX = 0; joyY = 0; joystickPointerId = null;
            joyKnob.setPosition(0,0);
          };
          scene.input.on("pointerdown",(pointer: Phaser.Input.Pointer)=>{
            if(!isMobile) return;
            const dx = pointer.x - mobile.x;
            const dy = pointer.y - mobile.y;
            if(Math.hypot(dx,dy) <= 82){
              joystickPointerId = pointer.id;
              setJoystick(pointer);
            }
          });
          scene.input.on("pointermove",(pointer: Phaser.Input.Pointer)=>{
            if(pointer.id === joystickPointerId) setJoystick(pointer);
          });
          scene.input.on("pointerup",(pointer: Phaser.Input.Pointer)=>{
            if(pointer.id === joystickPointerId) resetJoystick();
          });
          scene.input.on("pointerupoutside",(pointer: Phaser.Input.Pointer)=>{
            if(pointer.id === joystickPointerId) resetJoystick();
          });
          actionBg.on("pointerdown",()=>void interact());


          scene.events.on("update",(_t:number,delta:number)=>{const dt=Math.min(delta,32)/1000; if(!keys)return; let x=joyX,y=joyY;if(keys.A.isDown||keys.LEFT.isDown)x--;if(keys.D.isDown||keys.RIGHT.isDown)x++;if(keys.W.isDown||keys.UP.isDown)y--;if(keys.S.isDown||keys.DOWN.isDown)y++;const len=Math.hypot(x,y);if(len>1){x/=len;y/=len;}const moving=Math.abs(x)+Math.abs(y)>.05;const speed=keys.SHIFT.isDown?190:135;player.setVelocity(x*speed,y*speed);if(moving){player.setScale(0.72,0.69);if(Math.abs(x)>Math.abs(y))player.setFlipX(x<0);else player.setFlipX(false);}else{player.setScale(0.72,0.72);player.setFlipX(false);}player.setDepth(player.y); updatePlayerLabel(); updateMini(); if(Phaser.Input.Keyboard.JustDown(keys.E)||Phaser.Input.Keyboard.JustDown(keys.SPACE))void interact();});
          const resize=()=>{
            hud.setPosition(18,18);
            tregua.setPosition(scene.scale.width/2,18);
            dialog.setPosition(scene.scale.width/2,scene.scale.height-75);
            mobile.setPosition(isMobile ? 105 : -1000,scene.scale.height-(isMobile ? 108 : 105));
            action.setPosition(isMobile ? scene.scale.width-90 : -1000,scene.scale.height-(isMobile ? 98 : 95));
            mini.setPosition(scene.scale.width-(isMobile ? 92 : 145),isMobile ? 92 : 105);
          };
          scene.scale.on("resize",resize); resize(); void load(); scene.cameras.main.fadeIn(500,0,0,0);
        }
      }
    };
    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, []);

  return <div ref={root} className="fixed inset-0 overflow-hidden bg-black" />;
}
