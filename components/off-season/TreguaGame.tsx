"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";

import { createClient } from "@/lib/supabase/client";
import { BENIAMINI_MAPPA, NPCS } from "@/data/offseason";

export default function TreguaGame() {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const supabase = createClient();

    const WORLD_W = 1536;
    const WORLD_H = 1024;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,

      parent: gameRef.current,

      width: 960,
      height: 540,

      backgroundColor: "#101813",

      pixelArt: true,

      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },

      render: {
        antialias: false,
        roundPixels: true,
      },

      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },

      scene: {
        preload() {
          this.load.image(
            "querceta",
            "/game/querceta.png"
          );

          BENIAMINI_MAPPA.forEach((beni) => {
            this.load.image(
              `beni-${beni.id}`,
              beni.image
            );
          });
        },

        create() {
          const scene = this;

          // =====================================================
          // STATE
          // =====================================================

          let currentUserId: string | null = null;

          const collected = new Set<string>();

          let dialogTimer:
            | Phaser.Time.TimerEvent
            | null = null;

          // =====================================================
          // WORLD
          // =====================================================

          scene.physics.world.setBounds(
            0,
            0,
            WORLD_W,
            WORLD_H
          );

          scene.cameras.main.setBounds(
            0,
            0,
            WORLD_W,
            WORLD_H
          );

          // =====================================================
          // MAPPA
          // =====================================================

          scene.add
            .image(
              WORLD_W / 2,
              WORLD_H / 2,
              "querceta"
            )
            .setDisplaySize(
              WORLD_W,
              WORLD_H
            )
            .setDepth(-1000);

          scene.add
            .rectangle(
              WORLD_W / 2,
              WORLD_H / 2,
              WORLD_W,
              WORLD_H,
              0x17301d,
              0.06
            )
            .setDepth(-999);

          // =====================================================
          // WALKABLE AREAS
          // =====================================================

          const walkableZones = [
            new Phaser.Geom.Rectangle(
              300,
              300,
              900,
              470
            ),

            new Phaser.Geom.Rectangle(
              400,
              180,
              220,
              650
            ),

            new Phaser.Geom.Rectangle(
              850,
              170,
              260,
              700
            ),

            new Phaser.Geom.Rectangle(
              100,
              420,
              500,
              360
            ),

            new Phaser.Geom.Rectangle(
              500,
              700,
              620,
              220
            ),
          ];

          const isWalkable = (
            x: number,
            y: number
          ) => {
            return walkableZones.some(
              (zone) =>
                zone.contains(x, y)
            );
          };

          // =====================================================
          // PLAYER
          // =====================================================

          const player = scene.add
            .container(
              760,
              620
            )
            .setDepth(620);

          const shadow =
            scene.add.ellipse(
              0,
              22,
              30,
              10,
              0x000000,
              0.28
            );

          const legs =
            scene.add.rectangle(
              0,
              13,
              20,
              18,
              0x28365e
            );

          const body =
            scene.add.rectangle(
              0,
              -2,
              26,
              30,
              0x315aa5
            );

          const skin =
            scene.add.rectangle(
              0,
              -25,
              21,
              19,
              0xf0bd8c
            );

          const hair =
            scene.add.rectangle(
              0,
              -35,
              23,
              9,
              0x3a241c
            );

          player.add([
            shadow,
            legs,
            body,
            skin,
            hair,
          ]);

          // =====================================================
          // PLAYER NAME
          // =====================================================

          const playerName =
            scene.add
              .text(
                player.x,
                player.y - 58,
                "TU",
                {
                  fontFamily: "Arial",
                  fontSize: "13px",
                  color: "#ffffff",
                  fontStyle: "bold",
                  backgroundColor:
                    "#392619",
                  padding: {
                    x: 7,
                    y: 4,
                  },
                }
              )
              .setOrigin(0.5)
              .setDepth(1000);

          // =====================================================
          // CAMERA
          // =====================================================

          scene.cameras.main.startFollow(
            player,
            true,
            0.10,
            0.10
          );

          scene.cameras.main.setZoom(
            1.35
          );

          // =====================================================
          // BENIAMINI
          // =====================================================

          const positions: Record<
            string,
            { x: number; y: number }
          > = {
            quercia: {
              x: 760,
              y: 470,
            },

            leondoro: {
              x: 760,
              y: 250,
            },

            ranocchio: {
              x: 480,
              y: 260,
            },

            lucertola: {
              x: 1090,
              y: 190,
            },

            pozzo: {
              x: 1110,
              y: 520,
            },

            madonnina: {
              x: 650,
              y: 680,
            },

            ponte: {
              x: 1160,
              y: 760,
            },

            cervia: {
              x: 320,
              y: 760,
            },
          };

          const beniObjects = new Map<
            string,
            {
              sprite: Phaser.GameObjects.Image;
              glow: Phaser.GameObjects.Arc;
              label: Phaser.GameObjects.Text;
            }
          >();

          BENIAMINI_MAPPA.forEach(
            (beni) => {
              const pos =
                positions[beni.id];

              if (!pos) return;

              const glow =
                scene.add
                  .circle(
                    pos.x,
                    pos.y,
                    38,
                    0xffd35a,
                    0.16
                  )
                  .setDepth(
                    pos.y - 20
                  );

              scene.tweens.add({
                targets: glow,
                scale: 1.35,
                alpha: 0.03,
                duration: 900,
                ease: "Sine.easeInOut",
                yoyo: true,
                repeat: -1,
              });

              const sprite =
                scene.add
                  .image(
                    pos.x,
                    pos.y - 10,
                    `beni-${beni.id}`
                  )
                  .setDisplaySize(
                    58,
                    58
                  )
                  .setDepth(
                    pos.y
                  );

              scene.tweens.add({
                targets: sprite,
                y: pos.y - 18,
                duration: 850,
                ease: "Sine.easeInOut",
                yoyo: true,
                repeat: -1,
              });

              const label =
                scene.add
                  .text(
                    pos.x,
                    pos.y + 32,
                    beni.nome,
                    {
                      fontFamily: "Arial",
                      fontSize: "12px",
                      color: "#ffffff",
                      fontStyle: "bold",
                      backgroundColor:
                        "#392619",
                      padding: {
                        x: 6,
                        y: 3,
                      },
                    }
                  )
                  .setOrigin(0.5)
                  .setDepth(
                    pos.y + 1
                  );

              beniObjects.set(
                beni.id,
                {
                  sprite,
                  glow,
                  label,
                }
              );
            }
          );

          // =====================================================
          // NPC
          // =====================================================

          const npcPoints = NPCS.map(
            (npc, index) => {
              const keys =
                Object.keys(
                  positions
                );

              const key =
                keys[
                  index % keys.length
                ];

              const position =
                positions[key];

              return {
                id: npc.id,
                nome: npc.nome,
                text: npc.text,
                clue: npc.clue,
                x:
                  position.x + 45,
                y:
                  position.y + 35,
              };
            }
          );

          // =====================================================
          // HUD
          // =====================================================

          const hud =
            scene.add
              .container(
                18,
                18
              )
              .setScrollFactor(0)
              .setDepth(5000);

          const hudBg =
            scene.add
              .rectangle(
                0,
                0,
                300,
                112,
                0x332116,
                0.95
              )
              .setOrigin(0)
              .setStrokeStyle(
                2,
                0xd4af37
              );

          const hudTitle =
            scene.add
              .text(
                16,
                11,
                "TREGUA TRA CONTRADE",
                {
                  fontFamily: "Arial",
                  fontSize: "17px",
                  color: "#f4cf64",
                  fontStyle: "bold",
                }
              );

          const progress =
            scene.add
              .text(
                16,
                42,
                "BENIAMINI 0 / 8",
                {
                  fontFamily: "Arial",
                  fontSize: "22px",
                  color: "#ffffff",
                  fontStyle: "bold",
                }
              );

          const objective =
            scene.add
              .text(
                16,
                77,
                "Esplora Querceta",
                {
                  fontFamily: "Arial",
                  fontSize: "13px",
                  color: "#e5d8ca",
                }
              );

          hud.add([
            hudBg,
            hudTitle,
            progress,
            objective,
          ]);

          // =====================================================
          // MINIMAP
          // =====================================================

          const minimap =
            scene.add
              .container(
                scene.scale.width - 175,
                18
              )
              .setScrollFactor(0)
              .setDepth(5000);

          const miniBg =
            scene.add
              .rectangle(
                0,
                0,
                155,
                105,
                0x332116,
                0.95
              )
              .setOrigin(0)
              .setStrokeStyle(
                2,
                0xd4af37
              );

          const miniTitle =
            scene.add
              .text(
                12,
                9,
                "QUERCETA",
                {
                  fontFamily: "Arial",
                  fontSize: "14px",
                  color: "#ffffff",
                  fontStyle: "bold",
                }
              );

          const miniWorld =
            scene.add
              .rectangle(
                10,
                31,
                135,
                65,
                0x5b8c52
              )
              .setOrigin(0);

          const miniPlayer =
            scene.add.circle(
              78,
              64,
              4,
              0xffd45a
            );

          minimap.add([
            miniBg,
            miniTitle,
            miniWorld,
            miniPlayer,
          ]);

          // =====================================================
          // DIALOG
          // =====================================================

          const dialog =
            scene.add
              .container(
                scene.scale.width / 2,
                scene.scale.height - 82
              )
              .setScrollFactor(0)
              .setDepth(6000)
              .setVisible(false);

          const dialogBg =
            scene.add
              .rectangle(
                0,
                0,
                760,
                110,
                0x2b1c14,
                0.97
              )
              .setStrokeStyle(
                3,
                0xd4af37
              );

          const dialogText =
            scene.add
              .text(
                -345,
                -34,
                "",
                {
                  fontFamily: "Arial",
                  fontSize: "17px",
                  color: "#ffffff",
                  wordWrap: {
                    width: 690,
                  },
                  lineSpacing: 6,
                }
              );

          dialog.add([
            dialogBg,
            dialogText,
          ]);

          const showDialog = (
            message: string
          ) => {
            if (dialogTimer) {
              dialogTimer.remove();
            }

            dialog.setPosition(
              scene.scale.width / 2,
              scene.scale.height - 82
            );

            dialogText.setText(
              message
            );

            dialog.setVisible(
              true
            );

            dialogTimer =
              scene.time.delayedCall(
                4200,
                () => {
                  dialog.setVisible(
                    false
                  );
                }
              );
          };

          // =====================================================
          // TREGUA BUTTON
          // =====================================================

          const treguaButton =
            scene.add
              .container(
                scene.scale.width / 2,
                18
              )
              .setScrollFactor(0)
              .setDepth(5500)
              .setVisible(false);

          const treguaBg =
            scene.add
              .rectangle(
                0,
                0,
                250,
                44,
                0xd4af37
              )
              .setStrokeStyle(
                2,
                0x5c3a21
              );

          const treguaText =
            scene.add
              .text(
                0,
                0,
                "🤝 CERCA IL BARONE",
                {
                  fontFamily: "Arial",
                  fontSize: "16px",
                  color: "#3b2617",
                  fontStyle: "bold",
                }
              )
              .setOrigin(0.5);

          treguaButton.add([
            treguaBg,
            treguaText,
          ]);

          treguaBg.setInteractive({
            useHandCursor: true,
          });

          treguaBg.on(
            "pointerdown",
            () => {
              window.location.href =
                "/tregua";
            }
          );

          // =====================================================
          // PROGRESS
          // =====================================================

          const updateProgress = (
            count: number
          ) => {
            progress.setText(
              `BENIAMINI ${count} / 8`
            );

            if (count >= 8) {
              objective.setText(
                "🤝 Tutti gli 8 trovati!"
              );

              treguaButton.setVisible(
                true
              );

              showDialog(
                "Hai completato la raccolta! Ora puoi iniziare la Tregua con un'altra Contrada."
              );
            } else {
              objective.setText(
                "Trova tutti i Beniamini"
              );
            }
          };

          // =====================================================
          // LOAD SAVED BENIAMINI
          // =====================================================

          const loadSaved =
            async () => {
              const {
                data: {
                  user,
                },
              } =
                await supabase.auth.getUser();

              if (!user) {
                showDialog(
                  "Accedi per salvare i tuoi Beniamini."
                );

                return;
              }

              currentUserId =
                user.id;

              const {
                data,
                error,
              } =
                await supabase
                  .from(
                    "user_beniamini"
                  )
                  .select(
                    "beniamino_id"
                  )
                  .eq(
                    "user_id",
                    user.id
                  );

              if (error) {
                console.error(
                  error
                );

                return;
              }

              let count = 0;

              (
                data ?? []
              ).forEach(
                (row) => {
                  const id =
                    row.beniamino_id;

                  if (
                    !BENIAMINI_MAPPA.some(
                      (b) =>
                        b.id === id
                    )
                  ) {
                    return;
                  }

                  collected.add(id);

                  const object =
                    beniObjects.get(
                      id
                    );

                  if (object) {
                    object.sprite.setVisible(
                      false
                    );

                    object.glow.setVisible(
                      false
                    );

                    object.label.setVisible(
                      false
                    );
                  }

                  count++;
                }
              );

              updateProgress(
                count
              );
            };

          // =====================================================
          // COLLECT BENIAMINO
          // =====================================================

          const collect = async (
            id: string
          ) => {
            if (
              collected.has(id)
            ) {
              return;
            }

            if (!currentUserId) {
              showDialog(
                "Devi accedere per raccogliere questo Beniamino."
              );

              return;
            }

            const {
              error,
            } =
              await supabase
                .from(
                  "user_beniamini"
                )
                .insert({
                  user_id:
                    currentUserId,
                  beniamino_id:
                    id,
                });

            if (
              error &&
              error.code !==
                "23505"
            ) {
              console.error(
                error
              );

              showDialog(
                "Errore nel salvataggio del Beniamino."
              );

              return;
            }

            collected.add(id);

            const object =
              beniObjects.get(id);

            if (object) {
              scene.tweens.add({
                targets: [
                  object.sprite,
                  object.glow,
                  object.label,
                ],
                scale: 1.8,
                alpha: 0,
                duration: 420,
                ease: "Back.easeIn",

                onComplete: () => {
                  object.sprite.destroy();
                  object.glow.destroy();
                  object.label.destroy();
                },
              });
            }

            const count =
              collected.size;

            updateProgress(
              count
            );

            const beni =
              BENIAMINI_MAPPA.find(
                (b) =>
                  b.id === id
              );

            if (beni) {
              showDialog(
                `✨ Hai trovato ${beni.nome}!`
              );
            }
          };

          // =====================================================
          // INTERACTION
          // =====================================================

          const interact = () => {
            // ---------------------------------------------------
            // BENIAMINO PIÙ VICINO
            // ---------------------------------------------------

            let nearestBeniId:
              | string
              | null = null;

            let nearestBeniDistance =
              Infinity;

            BENIAMINI_MAPPA.forEach(
              (beni) => {
                if (
                  collected.has(
                    beni.id
                  )
                ) {
                  return;
                }

                const position =
                  positions[
                    beni.id
                  ];

                if (!position) {
                  return;
                }

                const distance =
                  Phaser.Math.Distance.Between(
                    player.x,
                    player.y,
                    position.x,
                    position.y
                  );

                if (
                  distance <
                  nearestBeniDistance
                ) {
                  nearestBeniDistance =
                    distance;

                  nearestBeniId =
                    beni.id;
                }
              }
            );

            if (
              nearestBeniId !==
                null &&
              nearestBeniDistance <
                90
            ) {
              void collect(
                nearestBeniId
              );

              return;
            }

            // ---------------------------------------------------
            // NPC PIÙ VICINO
            // ---------------------------------------------------
            //
            // IMPORTANTE:
            // usiamo l'indice invece di assegnare un oggetto
            // dentro forEach. In questo modo TypeScript mantiene
            // correttamente il tipo e non produce "never".
            //

            let nearestNpcIndex =
              -1;

            let nearestNpcDistance =
              Infinity;

            for (
              let i = 0;
              i < npcPoints.length;
              i++
            ) {
              const npc =
                npcPoints[i];

              const distance =
                Phaser.Math.Distance.Between(
                  player.x,
                  player.y,
                  npc.x,
                  npc.y
                );

              if (
                distance <
                nearestNpcDistance
              ) {
                nearestNpcDistance =
                  distance;

                nearestNpcIndex =
                  i;
              }
            }

            if (
              nearestNpcIndex !==
                -1 &&
              nearestNpcDistance <
                95
            ) {
              const nearestNpc =
                npcPoints[
                  nearestNpcIndex
                ];

              showDialog(
                `${nearestNpc.nome}: ${nearestNpc.text}\n\n${nearestNpc.clue}`
              );
            }
          };

          // =====================================================
          // KEYBOARD
          // =====================================================

          const keyboard =
            scene.input.keyboard;

          if (!keyboard) {
            return;
          }

          const keys =
            keyboard.addKeys(
              "W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE,SHIFT"
            ) as Record<
              string,
              Phaser.Input.Keyboard.Key
            >;

          // =====================================================
          // MOBILE JOYSTICK
          // =====================================================

          const joystick =
            scene.add
              .container(
                105,
                scene.scale.height - 105
              )
              .setScrollFactor(0)
              .setDepth(7000);

          const joyOuter =
            scene.add
              .circle(
                0,
                0,
                58,
                0x172018,
                0.60
              )
              .setStrokeStyle(
                2,
                0xffffff,
                0.35
              );

          const joyInner =
            scene.add.circle(
              0,
              0,
              27,
              0xffffff,
              0.32
            );

          joystick.add([
            joyOuter,
            joyInner,
          ]);

          let joystickActive =
            false;

          let joystickX = 0;
          let joystickY = 0;

          joyOuter.setInteractive();

          joyOuter.on(
            "pointerdown",
            (
              pointer: Phaser.Input.Pointer
            ) => {
              joystickActive =
                true;

              updateJoystick(
                pointer
              );
            }
          );

          scene.input.on(
            "pointermove",
            (
              pointer: Phaser.Input.Pointer
            ) => {
              if (
                joystickActive
              ) {
                updateJoystick(
                  pointer
                );
              }
            }
          );

          scene.input.on(
            "pointerup",
            () => {
              joystickActive =
                false;

              joystickX = 0;
              joystickY = 0;

              joyInner.setPosition(
                0,
                0
              );
            }
          );

          function updateJoystick(
            pointer: Phaser.Input.Pointer
          ) {
            const dx =
              pointer.x -
              joystick.x;

            const dy =
              pointer.y -
              joystick.y;

            const length =
              Math.sqrt(
                dx * dx +
                  dy * dy
              );

            const max = 38;

            if (
              length === 0
            ) {
              return;
            }

            const factor =
              Math.min(
                length,
                max
              ) / length;

            const x =
              dx * factor;

            const y =
              dy * factor;

            joyInner.setPosition(
              x,
              y
            );

            joystickX =
              x / max;

            joystickY =
              y / max;
          }

          // =====================================================
          // ACTION BUTTON
          // =====================================================

          const action =
            scene.add
              .container(
                scene.scale.width - 85,
                scene.scale.height - 90
              )
              .setScrollFactor(0)
              .setDepth(7000);

          const actionBg =
            scene.add
              .circle(
                0,
                0,
                34,
                0x38251b,
                0.82
              )
              .setStrokeStyle(
                2,
                0xd4af37
              );

          const actionText =
            scene.add
              .text(
                0,
                0,
                "E",
                {
                  fontFamily: "Arial",
                  fontSize: "22px",
                  color: "#ffffff",
                  fontStyle: "bold",
                }
              )
              .setOrigin(0.5);

          action.add([
            actionBg,
            actionText,
          ]);

          actionBg.setInteractive();

          actionBg.on(
            "pointerdown",
            () => {
              interact();
            }
          );

          // =====================================================
          // RESPONSIVE UI
          // =====================================================

          const resizeUi =
            () => {
              minimap.setPosition(
                scene.scale.width -
                  175,
                18
              );

              treguaButton.setPosition(
                scene.scale.width / 2,
                18
              );

              dialog.setPosition(
                scene.scale.width / 2,
                scene.scale.height -
                  82
              );

              joystick.setPosition(
                105,
                scene.scale.height -
                  105
              );

              action.setPosition(
                scene.scale.width -
                  85,
                scene.scale.height -
                  90
              );
            };

          scene.scale.on(
            "resize",
            resizeUi
          );

          // =====================================================
          // GAME LOOP
          // =====================================================

          scene.events.on(
            "update",
            (
              _time: number,
              delta: number
            ) => {
              const dt =
                Math.min(
                  delta,
                  32
                ) / 1000;

              let x = 0;
              let y = 0;

              if (
                keys.A.isDown ||
                keys.LEFT.isDown
              ) {
                x -= 1;
              }

              if (
                keys.D.isDown ||
                keys.RIGHT.isDown
              ) {
                x += 1;
              }

              if (
                keys.W.isDown ||
                keys.UP.isDown
              ) {
                y -= 1;
              }

              if (
                keys.S.isDown ||
                keys.DOWN.isDown
              ) {
                y += 1;
              }

              if (
                joystickActive
              ) {
                x = joystickX;
                y = joystickY;
              }

              const magnitude =
                Math.sqrt(
                  x * x +
                    y * y
                );

              if (
                magnitude > 1
              ) {
                x /= magnitude;
                y /= magnitude;
              }

              const sprint =
                keys.SHIFT.isDown;

              const speed =
                sprint
                  ? 245
                  : 170;

              const nextX =
                player.x +
                x *
                  speed *
                  dt;

              const nextY =
                player.y +
                y *
                  speed *
                  dt;

              // -------------------------------------------------
              // COLLISIONE
              // -------------------------------------------------

              if (
                isWalkable(
                  nextX,
                  player.y
                )
              ) {
                player.x =
                  nextX;
              }

              if (
                isWalkable(
                  player.x,
                  nextY
                )
              ) {
                player.y =
                  nextY;
              }

              // -------------------------------------------------
              // PLAYER LABEL
              // -------------------------------------------------

              playerName.setPosition(
                player.x,
                player.y - 58
              );

              // -------------------------------------------------
              // DEPTH
              // -------------------------------------------------

              player.setDepth(
                player.y
              );

              playerName.setDepth(
                player.y + 100
              );

              // -------------------------------------------------
              // MINIMAP
              // -------------------------------------------------

              miniPlayer.setPosition(
                10 +
                  (player.x /
                    WORLD_W) *
                    135,
                31 +
                  (player.y /
                    WORLD_H) *
                    65
              );

              // -------------------------------------------------
              // PLAYER ANIMATION
              // -------------------------------------------------

              const moving =
                Math.abs(x) +
                  Math.abs(y) >
                0.05;

              if (moving) {
                const bob =
                  Math.sin(
                    scene.time.now /
                      90
                  ) * 2;

                body.y =
                  -2 + bob;

                hair.y =
                  -35 + bob;

                skin.y =
                  -25 + bob;

                legs.y =
                  13 - bob;
              } else {
                body.y = -2;
                hair.y = -35;
                skin.y = -25;
                legs.y = 13;
              }

              // -------------------------------------------------
              // KEYBOARD INTERACTION
              // -------------------------------------------------

              if (
                Phaser.Input.Keyboard.JustDown(
                  keys.E
                ) ||
                Phaser.Input.Keyboard.JustDown(
                  keys.SPACE
                )
              ) {
                interact();
              }
            }
          );

          // =====================================================
          // INITIALIZATION
          // =====================================================

          loadSaved();

          resizeUi();

          scene.cameras.main.fadeIn(
            500,
            0,
            0,
            0
          );
        },
      },
    };

    const game =
      new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div
      ref={gameRef}
      className="fixed inset-0 overflow-hidden bg-black"
    />
  );
}