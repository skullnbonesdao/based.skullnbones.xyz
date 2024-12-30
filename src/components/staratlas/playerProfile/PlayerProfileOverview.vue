<script lang="ts" setup>
import { usePlayerProfileStore } from 'stores/player-profile-store'
import { useGameStore } from 'stores/game-store'
import { useFactionStore } from 'stores/faction-store'
import { usePointsStore } from 'stores/points-store'
</script>

<template>
  <q-card bordered flat>
    <q-card-section class="row items-center q-gutter-md">
      <q-icon name="visibility" size="md"></q-icon>
      <div class="text-h6">View Accounts</div>
    </q-card-section>
    <q-card-section class="row">
      <q-list bordered class="rounded-borders full-width" separator>
        <q-expansion-item
          :caption="usePlayerProfileStore().wallet?.toString()"
          icon="perm_identity"
          label="Wallet"
        >
        </q-expansion-item>
        <q-expansion-item
          :caption="usePlayerProfileStore().playerProfile?.key?.toString() ?? 'not-found'"
          icon="perm_identity"
          label="Player profile"
        >
          <q-card>
            <q-card-section v-if="usePlayerProfileStore().playerProfile?.data">
              <div
                v-for="data in Object.keys(usePlayerProfileStore().playerProfile!.data)"
                :key="data"
                class="row"
              >
                <div class="col">{{ data }}</div>
                <div>{{ usePlayerProfileStore().playerProfile!.data[data] ?? 'none' }}</div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          :caption="usePlayerProfileStore().playerName?.key?.toString() ?? 'not-found'"
          icon="perm_identity"
          label="Profile Name"
        >
          <q-card>
            <q-card-section v-if="usePlayerProfileStore().playerName?.data">
              <div class="row">
                <div class="col">name</div>
                <div>{{ usePlayerProfileStore().playerName?.name }}</div>
              </div>
              <div
                v-for="data in Object.keys(usePlayerProfileStore().playerName!.data)"
                :key="data"
                class="row"
              >
                <div class="col">{{ data }}</div>
                <div>{{ usePlayerProfileStore().playerName!.data[data as any] }}</div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          :caption="useGameStore().gameID?.toString()"
          icon="perm_identity"
          label="Game"
        >
          <q-card>
            <q-card-section v-if="useGameStore().game?.data">
              <div v-for="data in Object.keys(useGameStore().game!.data)" :key="data" class="row">
                <div class="col">{{ data }}</div>
                <div>{{ useGameStore().game!.data[data as any] as any }}</div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          :caption="useFactionStore().profileFaction?.key?.toString() ?? 'not-found'"
          icon="perm_identity"
          label="Faction Profile"
        >
          <q-card>
            <q-card-section v-if="useFactionStore().profileFaction?.data">
              <div
                v-for="(data, idx) in Object.keys(useFactionStore().profileFaction!.data)"
                :key="idx"
                class="row"
              >
                <div class="col">{{ data }}</div>
                <div>
                  {{ useFactionStore().profileFaction!.data[data as any] }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          :caption="useGameStore().sagePlayerProfile?.key?.toString() ?? 'not-found'"
          icon="perm_identity"
          label="Sage Profile"
        >
          <q-card>
            <q-card-section v-if="useGameStore().sagePlayerProfile?.data">
              <div
                v-for="(data, idx) in Object.keys(useGameStore().sagePlayerProfile!.data)"
                :key="idx"
                class="row"
              >
                <div class="col">{{ data }}</div>
                <div>
                  {{ useGameStore().sagePlayerProfile!.data[data as any] }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item icon="perm_identity" label="Points">
          <q-card>
            <q-card-section>
              <q-list>
                <q-expansion-item
                  v-for="(categroy, idx) in usePointsStore().pointsCategories"
                  :key="idx"
                  :caption="categroy.pointsCategory?.key.toString() ?? 'not-found'"
                  :label="categroy.name"
                  icon="perm_identity"
                >
                  <q-card>
                    <q-card-section v-if="usePointsStore().pointsCategories[idx]?.pointsCategory">
                      <div
                        v-for="(data, i) in Object.keys(
                          usePointsStore().pointsCategories[idx]!.pointsCategory!.data,
                        )"
                        :key="i"
                        class="row"
                      >
                        <div class="col">{{ data }}</div>
                        <div>
                          {{
                            usePointsStore().pointsCategories[idx]!.pointsCategory!.data[
                              data as any
                            ]
                          }}
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
