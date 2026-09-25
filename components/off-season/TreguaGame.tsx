"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";

import { createClient } from "@/lib/supabase/client";
import { BENIAMINI_MAPPA } from "@/data/offseason";

export default function TreguaGame() {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const supabase = createClient();

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,

      parent: gameRef.current,

      width: 960,
      height: 540,

      backgroundColor: "#18251b",

      pixelArt: true,

      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },

      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },

      scene: {
        preload() {
          // --------------------------------------------------
          // MAPPA
          // --------------------------------------------------

          this.load.image(
            "querceta",
            "/game/querceta.png"
          );

          // --------------------------------------------------
          // BENIAMINI
          // --------------------------------------------------

          BENIAMINI_MAPPA.forEach((beni) => {
            this.load.image(
              `beni-${beni.id}`,
              beni.image
            );
          });
        },

        create() {
          const scene = this;

          // ==================================================
          // WORLD
          // ==================================================

          const WORLD_WIDTH = 1536;
          const WORLD_HEIGHT = 1024;

          scene.physics.world.setBounds(
            0,
            0,
            WORLD_WIDTH,
            WORLD_HEIGHT
          );

          scene.cameras.main.setBounds(
            0,
            0,
            WORLD_WIDTH,
            WORLD_HEIGHT
          );

          // ==================================================
          // MAPPA
          // ==================================================

          const map = scene.add
            .image(
              WORLD_WIDTH / 2,
              WORLD_HEIGHT / 2,
              "querceta"
            )
            .setDisplaySize(
              WORLD_WIDTH,
              WORLD_HEIGHT
            )
            .setDepth(-100);

          // ==================================================
          // AUTENTICAZIONE
          // ==================================================

          let currentUserId: string | null = null;

          // ==================================================
          // BENIAMINI
          // ==================================================

          const collected = new Set<string>();

          const beniObjects = new Map<
            string,
            {
              sprite: Phaser.GameObjects.Image;
              glow: Phaser.GameObjects.Arc;
              label: Phaser.GameObjects.Text;
            }
          >();

          // --------------------------------------------------
          // POSIZIONI TEMPORANEE
          // --------------------------------------------------
          //
          // Queste sono relative alla nuova mappa.
          // Le rifiniamo quando avremo la tilemap definitiva.
          //

          const positions: Record<
            string,
            { x: number; y: number }
          > = {
            quercia: {
              x: 770,
              y: 470,
            },

            leondoro: {
              x: 760,
              y: 250,
            },

            ranocchio: {
              x: 500,
              y: 240,
            },

            lucertola: {
              x: 1100,
              y: 180,
            },

            pozzo: {
              x: 1100,
              y: 520,
            },

            madonnina: {
              x: 650,
              y: 650,
            },

            ponte: {
              x: 1120,
              y: 760,
            },

            cervia: {
              x: 350,
              y: 780,
            },
          };

          BENIAMINI_MAPPA.forEach((beni) => {
            const pos =
              positions[beni.id];

            if (!pos) return;

            const glow = scene.add
              .circle(
                pos.x,
                pos.y,
                46,
                0xffd45c,
                0.18
              )
              .setDepth(20);

            scene.tweens.add({
              targets: glow,
              scale: 1.25,
              alpha: 0.05,
              duration: 900,
              yoyo: true,
              repeat: -1,
            });

            const sprite = scene.add
              .image(
                pos.x,
                pos.y - 8,
                `beni-${beni.id}`
              )
              .setDisplaySize(
                62,
                62
              )
              .setDepth(30);

            scene.tweens.add({
              targets: sprite,
              y: pos.y - 16,
              duration: 900,
              yoyo: true,
              repeat: -1,
              ease: "Sine.easeInOut",
            });

            const label = scene.add
              .text(
                pos.x,
                pos.y + 38,
                beni.nome,
                {
                  fontFamily:
                    "Arial",
                  fontSize: "14px",
                  color: "#ffffff",
                  backgroundColor:
                    "#49301f",
                  padding: {
                    x: 6,
                    y: 4,
                  },
                  fontStyle:
                    "bold",
                }
              )
              .setOrigin(0.5)
              .setDepth(31);

            beniObjects.set(
              beni.id,
              {
                sprite,
                glow,
                label,
              }
            );
          });

          // ==================================================
          // PLAYER
          // ==================================================

          const player = scene.add
            .container(
              770,
              560
            )
            .setDepth(100);

          // ombra

          const shadow =
            scene.add.ellipse(
              0,
              24,
              34,
              12,
              0x000000,
              0.3
            );

          // corpo

          const body =
            scene.add.rectangle(
              0,
              0,
              28,
              32,
              0x3859a8
            );

          // testa

          const head =
            scene.add.circle(
              0,
              -23,
              16,
              0xf1c28f
            );

          // capelli

          const hair =
            scene.add.rectangle(
              0,
              -37,
              27,
              8,
              0x3a251b
            );

          // gambe

          const legLeft =
            scene.add.rectangle(
              -7,
              18,
              8,
              17,
              0x28386d
            );

          const legRight =
            scene.add.rectangle(
              7,
              18,
              8,
              17,
              0x28386d
            );

          player.add([
            shadow,
            legLeft,
            legRight,
            body,
            head,
            hair,
          ]);

          // ==================================================
          // NOME PLAYER
          // ==================================================

          const nameTag =
            scene.add
              .text(
                player.x,
                player.y - 55,
                "TU",
                {
                  fontFamily:
                    "Arial",
                  fontSize: "13px",
                  color: "#ffffff",
                  backgroundColor:
                    "#49301f",
                  padding: {
                    x: 5,
                    y: 3,
                  },
                  fontStyle:
                    "bold",
                }
              )
              .setOrigin(0.5)
              .setDepth(101);

          // ==================================================
          // INPUT
          // ==================================================

          const keys =
            scene.input.keyboard!.addKeys(
              "W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE"
            ) as Record<
              string,
              Phaser.Input.Keyboard.Key
            >;

          // ==================================================
          // CAMERA
          // ==================================================

          scene.cameras.main.startFollow(
            player,
            true,
            0.08,
            0.08
          );

          scene.cameras.main.setZoom(
            1.25
          );

          // ==================================================
          // HUD
          // ==================================================

          const hud =
            scene.add
              .container(
                20,
                20
              )
              .setScrollFactor(0)
              .setDepth(1000);

          const hudBackground =
            scene.add
              .rectangle(
                0,
                0,
                265,
                105,
                0x3e291c,
                0.94
              )
              .setOrigin(0);

          hudBackground.setStrokeStyle(
            2,
            0xd4af37
          );

          const hudTitle =
            scene.add.text(
              16,
              12,
              "TREGUA TRA CONTRADE",
              {
                fontFamily:
                  "Arial",
                fontSize: "17px",
                color: "#f5d77b",
                fontStyle:
                  "bold",
              }
            );

          const progress =
            scene.add.text(
              16,
              42,
              "BENIAMINI 0 / 8",
              {
                fontFamily:
                  "Arial",
                fontSize: "21px",
                color: "#ffffff",
                fontStyle:
                  "bold",
              }
            );

          const objective =
            scene.add.text(
              16,
              75,
              "Esplora Querceta",
              {
                fontFamily:
                  "Arial",
                fontSize: "13px",
                color: "#dfd5c8",
              }
            );

          hud.add([
            hudBackground,
            hudTitle,
            progress,
            objective,
          ]);

          // ==================================================
          // DIALOGO
          // ==================================================

          const dialog =
            scene.add
              .container(
                0,
                0
              )
              .setScrollFactor(0)
              .setDepth(2000)
              .setVisible(false);

          const dialogBg =
            scene.add
              .rectangle(
                0,
                0,
                760,
                125,
                0x38251a,
                0.97
              )
              .setStrokeStyle(
                3,
                0xd4af37
              );

          const dialogText =
            scene.add
              .text(
                -350,
                -35,
                "",
                {
                  fontFamily:
                    "Arial",
                  fontSize: "19px",
                  color: "#ffffff",
                  wordWrap: {
                    width: 690,
                  },
                  lineSpacing: 8,
                }
              );

          dialog.add([
            dialogBg,
            dialogText,
          ]);

          const showDialog = (
            text: string
          ) => {
            dialog.setPosition(
              scene.scale.width / 2,
              scene.scale.height - 90
            );

            dialogText.setText(text);

            dialog.setVisible(true);

            scene.time.delayedCall(
              3500,
              () => {
                dialog.setVisible(
                  false
                );
              }
            );
          };

          // ==================================================
          // SUPABASE
          // ==================================================

          const loadSavedBeniamini =
            async () => {
              const {
                data: {
                  user,
                },
              } =
                await supabase.auth.getUser();

              if (!user) return;

              currentUserId =
                user.id;

              const {
                data,
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

              let count = 0;

              (
                data ?? []
              ).forEach(
                (item) => {
                  const id =
                    item.beniamino_id;

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

          // ==================================================
          // PROGRESS
          // ==================================================

          const updateProgress = (
            count: number
          ) => {
            progress.setText(
              `BENIAMINI ${count} / 8`
            );

            if (count >= 8) {
              objective.setText(
                "🤝 Hai completato la mappa!"
              );

              showDialog(
                "Hai trovato tutti gli 8 Beniamini! Ora cerca un giocatore di un'altra Contrada."
              );
            } else {
              objective.setText(
                "Esplora Querceta"
              );
            }
          };

          // ==================================================
          // RACCOLTA
          // ==================================================

          const collectBeniamino =
            async (
              id: string
            ) => {
              if (
                collected.has(id)
              ) {
                return;
              }

              if (
                !currentUserId
              ) {
                showDialog(
                  "Devi effettuare il login per raccogliere i Beniamini."
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
                showDialog(
                  "Non è stato possibile salvare il Beniamino."
                );

                return;
              }

              collected.add(id);

              const object =
                beniObjects.get(
                  id
                );

              if (object) {
                scene.tweens.add({
                  targets: [
                    object.sprite,
                    object.glow,
                  ],
                  scale: 1.7,
                  alpha: 0,
                  duration: 450,
                });

                scene.time.delayedCall(
                  450,
                  () => {
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
                );
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

          // ==================================================
          // INTERAZIONE
          // ==================================================

          const interact =
            () => {
              let nearestId:
                | string
                | null = null;

              let nearestDistance =
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

                  const pos =
                    positions[
                      beni.id
                    ];

                  if (!pos) return;

                  const distance =
                    Phaser.Math.Distance.Between(
                      player.x,
                      player.y,
                      pos.x,
                      pos.y
                    );

                  if (
                    distance <
                      nearestDistance
                  ) {
                    nearestDistance =
                      distance;

                    nearestId =
                      beni.id;
                  }
                }
              );

              if (
                nearestId &&
                nearestDistance <
                  90
              ) {
                collectBeniamino(
                  nearestId
                );

                return;
              }
            };

          // ==================================================
          // LOOP
          // ==================================================

          scene.events.on(
            "update",
            () => {
              const speed = 190;

              let vx = 0;
              let vy = 0;

              if (
                keys.A.isDown ||
                keys.LEFT.isDown
              ) {
                vx -= 1;
              }

              if (
                keys.D.isDown ||
                keys.RIGHT.isDown
              ) {
                vx += 1;
              }

              if (
                keys.W.isDown ||
                keys.UP.isDown
              ) {
                vy -= 1;
              }

              if (
                keys.S.isDown ||
                keys.DOWN.isDown
              ) {
                vy += 1;
              }

              if (vx !== 0 && vy !== 0) {
                vx *= 0.707;
                vy *= 0.707;
              }

              player.x +=
                vx *
                speed *
                (1 / 60);

              player.y +=
                vy *
                speed *
                (1 / 60);

              player.x =
                Phaser.Math.Clamp(
                  player.x,
                  40,
                  WORLD_WIDTH - 40
                );

              player.y =
                Phaser.Math.Clamp(
                  player.y,
                  40,
                  WORLD_HEIGHT - 40
                );

              nameTag.setPosition(
                player.x,
                player.y - 55
              );

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

          // ==================================================
          // RESIZE DIALOG
          // ==================================================

          scene.scale.on(
            "resize",
            (
              gameSize: Phaser.Structs.Size
            ) => {
              dialog.setPosition(
                gameSize.width / 2,
                gameSize.height - 90
              );
            }
          );

          // ==================================================
          // START
          // ==================================================

          loadSavedBeniamini();
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
      className="w-full h-screen overflow-hidden bg-black"
    />
  );
}