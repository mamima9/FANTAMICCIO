"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";

import { createClient } from "@/lib/supabase/client";

import { CONTRADE_MAPPA } from "@/data/offseasonMap";
import {
  BENIAMINI_MAPPA,
  NPCS,
} from "@/data/offseason";

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

      backgroundColor: "#78b957",

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
        // =====================================================
        // PRELOAD
        // =====================================================

        preload() {
          BENIAMINI_MAPPA.forEach((beni) => {
            this.load.image(
              `beni-${beni.id}`,
              beni.image
            );
          });
        },

        // =====================================================
        // CREATE
        // =====================================================

        create() {
          const scene = this;

          // =====================================================
          // AUTENTICAZIONE
          // =====================================================

          let currentUserId: string | null = null;
          let beniLoaded = false;

          // =====================================================
          // WORLD
          // =====================================================

          const worldWidth = 3200;
          const worldHeight = 2200;

          scene.physics.world.setBounds(
            0,
            0,
            worldWidth,
            worldHeight
          );

          scene.cameras.main.setBounds(
            0,
            0,
            worldWidth,
            worldHeight
          );

          // =====================================================
          // MAPPA GEOGRAFICA
          // =====================================================

          const mapMinLat = 43.950;
          const mapMaxLat = 43.990;

          const mapMinLng = 10.185;
          const mapMaxLng = 10.230;

          const mapX = (lng: number) => {
            return (
              ((lng - mapMinLng) /
                (mapMaxLng - mapMinLng)) *
                2600 +
              200
            );
          };

          const mapY = (lat: number) => {
            return (
              2000 -
              ((lat - mapMinLat) /
                (mapMaxLat - mapMinLat)) *
                2000 +
              100
            );
          };

          // =====================================================
          // TERRENO
          // =====================================================

          scene.add
            .rectangle(
              worldWidth / 2,
              worldHeight / 2,
              worldWidth,
              worldHeight,
              0x79b85a
            )
            .setDepth(-100);

          // =====================================================
          // ZONE NATURALI
          // =====================================================

          scene.add
            .ellipse(
              650,
              450,
              900,
              500,
              0x83c765,
              0.55
            )
            .setDepth(-90);

          scene.add
            .ellipse(
              2400,
              500,
              1000,
              650,
              0x70ad52,
              0.55
            )
            .setDepth(-90);

          scene.add
            .ellipse(
              650,
              1750,
              1100,
              650,
              0x72ad53,
              0.55
            )
            .setDepth(-90);

          scene.add
            .ellipse(
              2350,
              1750,
              1000,
              650,
              0x86c466,
              0.55
            )
            .setDepth(-90);

          // =====================================================
          // ACQUA
          // =====================================================

          scene.add
            .rectangle(
              3070,
              1100,
              260,
              2200,
              0x54a6c8
            )
            .setDepth(-80);

          for (let y = 120; y < 2150; y += 110) {
            scene.add
              .line(
                3020,
                y,
                3020,
                y,
                3120,
                y + 35,
                0x8bd0e2
              )
              .setLineWidth(4)
              .setAlpha(0.5)
              .setDepth(-79);
          }

          // =====================================================
          // STRADE PRINCIPALI
          // =====================================================

          const roadColor = 0xd8bd84;

          scene.add
            .rectangle(
              1500,
              1100,
              185,
              2200,
              roadColor
            )
            .setDepth(-70);

          scene.add
            .rectangle(
              1500,
              1100,
              2850,
              175,
              roadColor
            )
            .setDepth(-70);

          scene.add
            .rectangle(
              1400,
              1100,
              8,
              2200,
              0xb08c5b
            )
            .setDepth(-69);

          scene.add
            .rectangle(
              1600,
              1100,
              8,
              2200,
              0xb08c5b
            )
            .setDepth(-69);

          // =====================================================
          // STRADE SECONDARIE
          // =====================================================

          const secondaryRoads = [
            [650, 500, 1250, 90],
            [700, 1750, 1400, 90],
            [2150, 650, 90, 900],
            [850, 1100, 90, 900],
            [2450, 1100, 1000, 90],
          ];

          secondaryRoads.forEach(
            ([x, y, width, height]) => {
              scene.add
                .rectangle(
                  x,
                  y,
                  width,
                  height,
                  roadColor
                )
                .setDepth(-68);
            }
          );

          // =====================================================
          // PIAZZA QUERCETA
          // =====================================================

          scene.add
            .rectangle(
              1500,
              1100,
              650,
              470,
              0xcba76b
            )
            .setStrokeStyle(
              8,
              0x9a7547
            )
            .setDepth(-60);

          scene.add
            .text(
              1500,
              920,
              "QUERCETA",
              {
                fontFamily: "Arial",
                fontSize: "42px",
                color: "#5b3a22",
                fontStyle: "bold",
              }
            )
            .setOrigin(0.5)
            .setDepth(-50);

          // =====================================================
          // CASE
          // =====================================================

          const houses = [
            [450, 400],
            [750, 400],
            [1050, 400],
            [1950, 400],
            [2250, 400],

            [450, 750],
            [750, 750],
            [1050, 750],
            [2200, 780],

            [450, 1450],
            [750, 1450],
            [1050, 1450],
            [2050, 1450],

            [450, 1800],
            [750, 1800],
            [1100, 1800],
            [1950, 1800],
            [2300, 1800],
          ];

          const houseBodies: Phaser.Physics.Arcade.StaticBody[] = [];

          houses.forEach(([x, y]) => {
            const house = scene.add
              .rectangle(
                x,
                y,
                145,
                105,
                0xf0d3a4
              )
              .setStrokeStyle(
                5,
                0x67452c
              )
              .setDepth(5);

            scene.add
              .triangle(
                x,
                y - 70,
                x - 88,
                y - 10,
                x + 88,
                y - 10,
                0x9b5039
              )
              .setDepth(6);

            scene.add
              .rectangle(
                x,
                y + 22,
                28,
                48,
                0x69472f
              )
              .setDepth(7);

            scene.add
              .rectangle(
                x - 43,
                y + 4,
                27,
                25,
                0x72a7bd
              )
              .setDepth(7);

            scene.add
              .rectangle(
                x + 43,
                y + 4,
                27,
                25,
                0x72a7bd
              )
              .setDepth(7);

            scene.physics.add.existing(
              house,
              true
            );

            const houseBody =
              house.body as Phaser.Physics.Arcade.StaticBody;

            houseBodies.push(houseBody);
          });

          // =====================================================
          // ALBERI
          // =====================================================

          const trees = [
            [220, 230],
            [350, 300],
            [520, 240],
            [700, 250],
            [920, 250],
            [1120, 250],
            [1850, 250],
            [2100, 250],
            [2400, 280],
            [2650, 350],

            [220, 650],
            [300, 950],
            [220, 1250],
            [300, 1550],

            [1150, 1550],
            [1300, 1750],
            [1550, 1700],
            [1800, 1900],
            [2150, 1600],
            [2500, 1700],
            [2700, 1450],
          ];

          trees.forEach(([x, y]) => {
            scene.add
              .rectangle(
                x,
                y + 28,
                20,
                58,
                0x70472f
              )
              .setDepth(3);

            scene.add
              .circle(
                x,
                y,
                48,
                0x2f7d32
              )
              .setDepth(4);

            scene.add
              .circle(
                x - 28,
                y + 12,
                30,
                0x398d38
              )
              .setDepth(4);

            scene.add
              .circle(
                x + 28,
                y + 12,
                30,
                0x398d38
              )
              .setDepth(4);

            scene.add
              .circle(
                x,
                y - 18,
                25,
                0x4c983d
              )
              .setDepth(5);
          });

          // =====================================================
          // CONTRADE
          // =====================================================

          CONTRADE_MAPPA.forEach(
            (contrada) => {
              const x = mapX(
                contrada.lng
              );

              const y = mapY(
                contrada.lat
              );

              scene.add
                .circle(
                  x,
                  y + 5,
                  28,
                  0x5b3a22,
                  0.25
                )
                .setDepth(25);

              scene.add
                .circle(
                  x,
                  y,
                  20,
                  0xfff5d6
                )
                .setStrokeStyle(
                  4,
                  0x5b3a22
                )
                .setDepth(30);

              scene.add
                .text(
                  x,
                  y - 42,
                  contrada.nome,
                  {
                    fontFamily: "Arial",
                    fontSize: "18px",
                    color: "#ffffff",
                    backgroundColor: "#5b3a22",
                    padding: {
                      x: 7,
                      y: 4,
                    },
                    fontStyle: "bold",
                  }
                )
                .setOrigin(0.5)
                .setDepth(31);
            }
          );

          // =====================================================
          // BENIAMINI
          // =====================================================

          const collectedBeniamini =
            new Set<string>();

          const beniObjects =
            new Map<
              string,
              {
                sprite: Phaser.GameObjects.Image;
                label: Phaser.GameObjects.Text;
                glow: Phaser.GameObjects.Arc;
              }
            >();

          BENIAMINI_MAPPA.forEach(
            (beni) => {
              const x = mapX(
                beni.coordinates[1]
              );

              const y = mapY(
                beni.coordinates[0]
              );

              const glow =
                scene.add
                  .circle(
                    x,
                    y,
                    48,
                    0xffd95c,
                    0.18
                  )
                  .setDepth(35);

              scene.tweens.add({
                targets: glow,
                scale: 1.25,
                alpha: 0.05,
                duration: 900,
                yoyo: true,
                repeat: -1,
              });

              const sprite =
                scene.add
                  .image(
                    x,
                    y - 8,
                    `beni-${beni.id}`
                  )
                  .setDisplaySize(
                    58,
                    58
                  )
                  .setDepth(40);

              const label =
                scene.add
                  .text(
                    x,
                    y + 45,
                    beni.nome,
                    {
                      fontFamily: "Arial",
                      fontSize: "15px",
                      color: "#ffffff",
                      backgroundColor: "#5b3a22",
                      padding: {
                        x: 5,
                        y: 3,
                      },
                      fontStyle: "bold",
                    }
                  )
                  .setOrigin(0.5)
                  .setDepth(41);

              beniObjects.set(
                beni.id,
                {
                  sprite,
                  label,
                  glow,
                }
              );
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
              .setDepth(1000);

          const hudBg =
            scene.add
              .rectangle(
                0,
                0,
                235,
                92,
                0x49301f,
                0.92
              )
              .setOrigin(0);

          const title =
            scene.add
              .text(
                15,
                12,
                "TREGUA TRA CONTRADE",
                {
                  fontFamily: "Arial",
                  fontSize: "17px",
                  color: "#ffe9a8",
                  fontStyle: "bold",
                }
              );

          const progressText =
            scene.add
              .text(
                15,
                42,
                "BENIAMINI 0 / 8",
                {
                  fontFamily: "Arial",
                  fontSize: "19px",
                  color: "#ffffff",
                  fontStyle: "bold",
                }
              );

          const objectiveText =
            scene.add
              .text(
                15,
                68,
                "Trova i Beniamini",
                {
                  fontFamily: "Arial",
                  fontSize: "13px",
                  color: "#d9d0c5",
                }
              );

          hud.add([
            hudBg,
            title,
            progressText,
            objectiveText,
          ]);

          // =====================================================
          // NPC
          // =====================================================

          NPCS.forEach((npc) => {
            const x = mapX(
              npc.coordinates[1]
            );

            const y = mapY(
              npc.coordinates[0]
            );

            scene.add
              .ellipse(
                x,
                y + 18,
                34,
                12,
                0x000000,
                0.25
              )
              .setDepth(45);

            scene.add
              .rectangle(
                x,
                y + 2,
                24,
                32,
                0x8b5a3c
              )
              .setDepth(46);

            scene.add
              .circle(
                x,
                y - 18,
                16,
                0xf1c28f
              )
              .setDepth(47);

            scene.add
              .rectangle(
                x,
                y - 34,
                32,
                8,
                0x49301f
              )
              .setDepth(48);

            scene.add
              .text(
                x,
                y + 34,
                npc.nome,
                {
                  fontFamily: "Arial",
                  fontSize: "12px",
                  color: "#ffffff",
                  backgroundColor: "#49301f",
                  padding: {
                    x: 4,
                    y: 2,
                  },
                }
              )
              .setOrigin(0.5)
              .setDepth(49);
          });

          // =====================================================
          // PLAYER
          // =====================================================

          const player =
            scene.add
              .container(
                1500,
                1100
              )
              .setDepth(100);

          const playerShadow =
            scene.add
              .ellipse(
                0,
                22,
                34,
                12,
                0x000000,
                0.28
              );

          const legLeft =
            scene.add.rectangle(
              -8,
              15,
              9,
              20,
              0x263b91
            );

          const legRight =
            scene.add.rectangle(
              8,
              15,
              9,
              20,
              0x263b91
            );

          const playerBody =
            scene.add.rectangle(
              0,
              -3,
              34,
              34,
              0x4f46e5
            );

          const face =
            scene.add.circle(
              0,
              -28,
              17,
              0xf1c28f
            );

          const hair =
            scene.add.rectangle(
              0,
              -43,
              30,
              9,
              0x4a2c20
            );

          const eye1 =
            scene.add.circle(
              -6,
              -28,
              2.5,
              0x251b18
            );

          const eye2 =
            scene.add.circle(
              6,
              -28,
              2.5,
              0x251b18
            );

          player.add([
            playerShadow,
            legLeft,
            legRight,
            playerBody,
            face,
            hair,
            eye1,
            eye2,
          ]);

          scene.physics.add.existing(
            player
          );

          const body =
            player.body as Phaser.Physics.Arcade.Body;

          body.setSize(30, 38);
          body.setOffset(-15, -2);
          body.setCollideWorldBounds(true);

          // =====================================================
          // COLLISIONI CASE
          // =====================================================

          houseBodies.forEach(
            (houseBody) => {
              scene.physics.add.collider(
                player,
                houseBody
              );
            }
          );

          // =====================================================
          // NAME TAG
          // =====================================================

          const nameTag =
            scene.add
              .text(
                player.x,
                player.y - 62,
                "TU",
                {
                  fontFamily: "Arial",
                  fontSize: "14px",
                  color: "#ffffff",
                  backgroundColor: "#49301f",
                  padding: {
                    x: 6,
                    y: 3,
                  },
                  fontStyle: "bold",
                }
              )
              .setOrigin(0.5)
              .setDepth(110);

          // =====================================================
          // CAMERA
          // =====================================================

          scene.cameras.main.startFollow(
            player,
            true,
            0.12,
            0.12
          );

          // =====================================================
          // DIALOG
          // =====================================================

          const dialog =
            scene.add
              .container(
                scene.scale.width / 2,
                scene.scale.height - 115
              )
              .setScrollFactor(0)
              .setDepth(2000)
              .setVisible(false);

          const dialogBg =
            scene.add
              .rectangle(
                0,
                0,
                Math.min(
                  700,
                  scene.scale.width - 40
                ),
                120,
                0x49301f,
                0.96
              )
              .setStrokeStyle(
                4,
                0xe2bd69
              );

          const dialogName =
            scene.add
              .text(
                -310,
                -42,
                "",
                {
                  fontFamily: "Arial",
                  fontSize: "18px",
                  color: "#ffe5a0",
                  fontStyle: "bold",
                }
              );

          const dialogText =
            scene.add
              .text(
                -310,
                -12,
                "",
                {
                  fontFamily: "Arial",
                  fontSize: "15px",
                  color: "#ffffff",
                  wordWrap: {
                    width: 620,
                  },
                }
              );

          const dialogHint =
            scene.add
              .text(
                220,
                42,
                "E / SPAZIO",
                {
                  fontFamily: "Arial",
                  fontSize: "11px",
                  color: "#d9c6a4",
                }
              );

          dialog.add([
            dialogBg,
            dialogName,
            dialogText,
            dialogHint,
          ]);

          let dialogOpen = false;

          const openDialog = (
            name: string,
            text: string
          ) => {
            dialogName.setText(name);
            dialogText.setText(text);

            dialog.setVisible(true);

            dialogOpen = true;
          };

          const closeDialog = () => {
            dialog.setVisible(false);
            dialogOpen = false;
          };

          // =====================================================
          // CARICAMENTO BENIAMINI DA SUPABASE
          // =====================================================

          const loadSavedBeniamini =
            async () => {
              const {
                data: userData,
                error: userError,
              } = await supabase.auth.getUser();

              if (
                userError ||
                !userData.user
              ) {
                console.error(
                  "Utente non autenticato:",
                  userError
                );

                beniLoaded = true;

                openDialog(
                  "ACCESSO RICHIESTO",
                  "Devi essere autenticato per partecipare alla Tregua tra Contrade."
                );

                return;
              }

              currentUserId =
                userData.user.id;

              const {
                data,
                error,
              } = await supabase
                .from("user_beniamini")
                .select("beniamino_id")
                .eq(
                  "user_id",
                  currentUserId
                );

              if (error) {
                console.error(
                  "Errore caricamento Beniamini:",
                  error
                );

                beniLoaded = true;

                return;
              }

              data?.forEach(
                (row) => {
                  collectedBeniamini.add(
                    row.beniamino_id
                  );

                  const objects =
                    beniObjects.get(
                      row.beniamino_id
                    );

                  if (objects) {
                    objects.sprite.setVisible(
                      false
                    );

                    objects.label.setVisible(
                      false
                    );

                    objects.glow.setVisible(
                      false
                    );
                  }
                }
              );

              const count =
                collectedBeniamini.size;

              progressText.setText(
                `BENIAMINI ${count} / 8`
              );

              if (count === 8) {
                objectiveText.setText(
                  "Hai tutti gli 8! Trova un'altra Contrada."
                );
              } else {
                objectiveText.setText(
                  `Beniamini raccolti: ${count} / 8`
                );
              }

              beniLoaded = true;
            };

          // =====================================================
          // RACCOLTA BENIAMINO
          // =====================================================

          const collectBeniamino =
            async (
              beni: (typeof BENIAMINI_MAPPA)[number]
            ) => {
              if (!beniLoaded) {
                return;
              }

              if (
                collectedBeniamini.has(
                  beni.id
                )
              ) {
                return;
              }

              if (!currentUserId) {
                openDialog(
                  "ACCESSO RICHIESTO",
                  "Devi essere autenticato per salvare i Beniamini."
                );

                return;
              }

              const {
                error,
              } = await supabase
                .from("user_beniamini")
                .insert({
                  user_id:
                    currentUserId,
                  beniamino_id:
                    beni.id,
                });

              if (error) {
                // 23505 = elemento già presente
                if (
                  error.code ===
                  "23505"
                ) {
                  collectedBeniamini.add(
                    beni.id
                  );
                } else {
                  console.error(
                    "Errore salvataggio Beniamino:",
                    error
                  );

                  openDialog(
                    "ERRORE",
                    "Non è stato possibile salvare il Beniamino. Riprova."
                  );

                  return;
                }
              } else {
                collectedBeniamini.add(
                  beni.id
                );
              }

              const objects =
                beniObjects.get(
                  beni.id
                );

              if (objects) {
                objects.sprite.setVisible(
                  false
                );

                objects.label.setVisible(
                  false
                );

                objects.glow.setVisible(
                  false
                );
              }

              const collectedCount =
                collectedBeniamini.size;

              progressText.setText(
                `BENIAMINI ${collectedCount} / 8`
              );

              if (
                collectedCount === 8
              ) {
                objectiveText.setText(
                  "Hai tutti gli 8! Trova un'altra Contrada."
                );

                openDialog(
                  "TREGUA COMPLETATA",
                  "Hai raccolto tutti gli 8 Beniamini!\n\nOra devi trovare un giocatore di un'altra Contrada per ottenere il Barone."
                );
              } else {
                objectiveText.setText(
                  `Beniamini raccolti: ${collectedCount} / 8`
                );

                openDialog(
                  beni.nome,
                  `Hai trovato il Beniamino ${beni.nome}!\n\n${collectedCount} / 8 Beniamini raccolti.`
                );
              }
            };

          // =====================================================
          // AVVIO CARICAMENTO DATI UTENTE
          // =====================================================

          loadSavedBeniamini();

          // =====================================================
// INTERAZIONE
// =====================================================

const interact = () => {
  if (dialogOpen) {
    closeDialog();
    return;
  }

  // -------------------------------------------------
  // NPC PIÙ VICINO
  // -------------------------------------------------

  let closestNpcIndex = -1;
  let closestDistance = Infinity;

  NPCS.forEach((npc, index) => {
    const nx = mapX(
      npc.coordinates[1]
    );

    const ny = mapY(
      npc.coordinates[0]
    );

    const distance =
      Phaser.Math.Distance.Between(
        player.x,
        player.y,
        nx,
        ny
      );

    if (
      distance < closestDistance
    ) {
      closestDistance = distance;
      closestNpcIndex = index;
    }
  });

  if (
    closestNpcIndex !== -1 &&
    closestDistance < 100
  ) {
    const closestNpc =
      NPCS[closestNpcIndex];

    openDialog(
      closestNpc.nome,
      `${closestNpc.text}\n\n${closestNpc.clue}`
    );

    return;
  }

  // -------------------------------------------------
  // BENIAMINO PIÙ VICINO
  // -------------------------------------------------

  let closestBeniIndex = -1;
  let beniDistance = Infinity;

  BENIAMINI_MAPPA.forEach(
    (beni, index) => {
      if (
        collectedBeniamini.has(
          beni.id
        )
      ) {
        return;
      }

      const bx = mapX(
        beni.coordinates[1]
      );

      const by = mapY(
        beni.coordinates[0]
      );

      const distance =
        Phaser.Math.Distance.Between(
          player.x,
          player.y,
          bx,
          by
        );

      if (
        distance < beniDistance
      ) {
        beniDistance = distance;
        closestBeniIndex = index;
      }
    }
  );

  if (
    closestBeniIndex !== -1 &&
    beniDistance < 100
  ) {
    const closestBeni =
      BENIAMINI_MAPPA[
        closestBeniIndex
      ];

    void collectBeniamino(
      closestBeni
    );
  }
};

          // =====================================================
          // TASTIERA
          // =====================================================

          const cursors =
            scene.input.keyboard!.createCursorKeys();

          const keys =
            scene.input.keyboard!.addKeys(
              "W,A,S,D,E,SPACE"
            ) as Record<
              string,
              Phaser.Input.Keyboard.Key
            >;

          // =====================================================
          // JOYSTICK MOBILE
          // =====================================================

          const joystickBase =
            scene.add
              .circle(
                100,
                scene.scale.height - 92,
                58,
                0x000000,
                0.38
              )
              .setScrollFactor(0)
              .setDepth(1500);

          const joystickThumb =
            scene.add
              .circle(
                100,
                scene.scale.height - 92,
                26,
                0xffffff,
                0.85
              )
              .setScrollFactor(0)
              .setDepth(1501);

          let joystickActive =
            false;

          let joystickX = 0;
          let joystickY = 0;

          const joystickCenterX = 100;

          const getJoystickCenterY =
            () =>
              scene.scale.height - 92;

          const maxDistance = 38;

          scene.input.on(
            "pointerdown",
            (
              pointer: Phaser.Input.Pointer
            ) => {
              const centerY =
                getJoystickCenterY();

              const distance =
                Phaser.Math.Distance.Between(
                  pointer.x,
                  pointer.y,
                  joystickCenterX,
                  centerY
                );

              if (
                distance < 90
              ) {
                joystickActive =
                  true;

                joystickThumb.setPosition(
                  pointer.x,
                  pointer.y
                );
              }
            }
          );

          scene.input.on(
            "pointermove",
            (
              pointer: Phaser.Input.Pointer
            ) => {
              if (
                !joystickActive
              ) {
                return;
              }

              const centerY =
                getJoystickCenterY();

              const dx =
                pointer.x -
                joystickCenterX;

              const dy =
                pointer.y -
                centerY;

              const distance =
                Math.sqrt(
                  dx * dx +
                    dy * dy
                );

              const angle =
                Math.atan2(
                  dy,
                  dx
                );

              const limitedDistance =
                Math.min(
                  distance,
                  maxDistance
                );

              const x =
                Math.cos(angle) *
                limitedDistance;

              const y =
                Math.sin(angle) *
                limitedDistance;

              joystickThumb.setPosition(
                joystickCenterX +
                  x,
                centerY + y
              );

              joystickX =
                x / maxDistance;

              joystickY =
                y / maxDistance;
            }
          );

          scene.input.on(
            "pointerup",
            () => {
              joystickActive =
                false;

              joystickX = 0;
              joystickY = 0;

              joystickThumb.setPosition(
                joystickCenterX,
                getJoystickCenterY()
              );
            }
          );

          // =====================================================
          // BOTTONE INTERAZIONE MOBILE
          // =====================================================

          const interactButton =
            scene.add
              .circle(
                scene.scale.width - 82,
                scene.scale.height - 82,
                38,
                0x49301f,
                0.9
              )
              .setScrollFactor(0)
              .setDepth(1500)
              .setInteractive();

          const interactButtonText =
            scene.add
              .text(
                scene.scale.width - 82,
                scene.scale.height - 82,
                "A",
                {
                  fontFamily: "Arial",
                  fontSize: "25px",
                  color: "#ffffff",
                  fontStyle: "bold",
                }
              )
              .setOrigin(0.5)
              .setScrollFactor(0)
              .setDepth(1501);

          interactButton.on(
            "pointerdown",
            interact
          );

          // =====================================================
          // RESIZE UI
          // =====================================================

          scene.scale.on(
            "resize",
            () => {
              const centerY =
                getJoystickCenterY();

              joystickBase.setPosition(
                joystickCenterX,
                centerY
              );

              if (
                !joystickActive
              ) {
                joystickThumb.setPosition(
                  joystickCenterX,
                  centerY
                );
              }

              interactButton.setPosition(
                scene.scale.width - 82,
                scene.scale.height - 82
              );

              interactButtonText.setPosition(
                scene.scale.width - 82,
                scene.scale.height - 82
              );

              dialog.setPosition(
                scene.scale.width / 2,
                scene.scale.height - 115
              );
            }
          );

          // =====================================================
          // UPDATE
          // =====================================================

          scene.events.on(
            "update",
            () => {
              const speed = 220;

              let velocityX = 0;
              let velocityY = 0;

              // -------------------------------------------------
              // JOYSTICK
              // -------------------------------------------------

              if (
                joystickActive
              ) {
                velocityX =
                  joystickX * speed;

                velocityY =
                  joystickY * speed;
              } else {
                // -------------------------------------------------
                // TASTIERA
                // -------------------------------------------------

                if (
                  cursors.left.isDown ||
                  keys.A.isDown
                ) {
                  velocityX = -speed;
                }

                if (
                  cursors.right.isDown ||
                  keys.D.isDown
                ) {
                  velocityX = speed;
                }

                if (
                  cursors.up.isDown ||
                  keys.W.isDown
                ) {
                  velocityY = -speed;
                }

                if (
                  cursors.down.isDown ||
                  keys.S.isDown
                ) {
                  velocityY = speed;
                }
              }

              // -------------------------------------------------
              // DIAGONALE
              // -------------------------------------------------

              if (
                velocityX !== 0 &&
                velocityY !== 0
              ) {
                const length =
                  Math.sqrt(
                    velocityX *
                      velocityX +
                      velocityY *
                        velocityY
                  );

                velocityX =
                  (velocityX / length) *
                  speed;

                velocityY =
                  (velocityY / length) *
                  speed;
              }

              body.setVelocity(
                velocityX,
                velocityY
              );

              // -------------------------------------------------
              // ANIMAZIONE GAMBE
              // -------------------------------------------------

              if (
                velocityX !== 0 ||
                velocityY !== 0
              ) {
                const walking =
                  Math.sin(
                    scene.time.now / 90
                  ) * 3;

                legLeft.y =
                  15 + walking;

                legRight.y =
                  15 - walking;
              } else {
                legLeft.y = 15;
                legRight.y = 15;
              }

              // -------------------------------------------------
              // NAME TAG
              // -------------------------------------------------

              nameTag.setPosition(
                player.x,
                player.y - 62
              );

              // -------------------------------------------------
              // INTERAZIONE
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