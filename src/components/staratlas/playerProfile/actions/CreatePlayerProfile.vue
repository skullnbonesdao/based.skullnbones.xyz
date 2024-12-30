<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { Keypair } from '@solana/web3.js'
import {
  getEnumByKey,
  getEnumKeys,
  handleStaratlasTransaction,
  walletStoreToAsyncSigner,
} from 'components/staratlas/helper'
import { useWallet } from 'solana-wallets-vue'
import { PlayerProfile, ProfilePermissions } from '@staratlas/player-profile'
import { PLAYER_PROFILE_PROGRAM_ID, useWorkspaceAdapter } from 'components/staratlas/connector'
import { usePlayerProfileStore } from 'stores/player-profile-store'
import { useFactionStore } from 'stores/faction-store'
import { useGameStore } from 'stores/game-store'
import { keypairToAsyncSigner } from '@staratlas/data-source/src/asyncSigner'
import { Faction, ProfileFactionAccount } from '@staratlas/profile-faction'
import { SagePlayerProfile } from '@staratlas/sage'
import { UserPoints } from '@staratlas/points'
import { usePointsStore } from 'stores/points-store'

const enable_createPlayerProfile = ref(false)
const enable_createPlayerProfileName = ref(false)
const enable_chooseFaction = ref(false)
const enable_createSagePlayerProfile = ref(false)
const enable_createPoints = ref<boolean[]>([])

const factionOptions = getEnumKeys(Faction)

const inputName = ref('test')
const inputFaction = ref(factionOptions[1])

updateEnables()

const combinedValues = computed(() => ({
  playerProfile: usePlayerProfileStore().playerProfile,
  faction: useFactionStore().profileFaction,
  sagePlayerProfile: useGameStore().sagePlayerProfile,
  pointsCategories: usePointsStore().pointsCategories,
}))

watch(
  () => combinedValues,
  () => updateEnables(),
  { deep: true },
)

function updateEnables() {
  enable_createPlayerProfile.value = false
  enable_createPlayerProfileName.value = false
  enable_chooseFaction.value = false
  enable_createSagePlayerProfile.value = false

  usePointsStore().pointsCategories.forEach(() => {
    enable_createPoints.value.push(false)
  })

  if (!usePlayerProfileStore().hasProfile) {
    enable_createPlayerProfile.value = true
  }
  if (usePlayerProfileStore().hasProfile) {
    if (!usePlayerProfileStore().playerName?.key) enable_createPlayerProfileName.value = true
    if (!useFactionStore().profileFaction?.data) enable_chooseFaction.value = true
    if (!useGameStore().sagePlayerProfile?.data) enable_createSagePlayerProfile.value = true

    enable_createPoints.value = []
    usePointsStore().pointsCategories.forEach((category) => {
      if (!category.pointsCategory) enable_createPoints.value.push(true)
      else enable_createPoints.value.push(false)
    })
  }
}

async function sendTx() {
  const signer = walletStoreToAsyncSigner(useWallet())
  const staratlasIxs = []

  const playerProfile = keypairToAsyncSigner(Keypair.generate())

  if (enable_createPlayerProfile.value) {
    staratlasIxs.push(
      PlayerProfile.createProfile(
        useWorkspaceAdapter()!.playerProfileProgram.value,
        playerProfile,
        [
          {
            key: signer.publicKey(),
            expireTime: null,
            scope: PLAYER_PROFILE_PROGRAM_ID,
            permissions: ProfilePermissions.all(),
          },
        ],
        1,
      ),
    )
  }

  if (enable_createPlayerProfileName.value) {
    const { instructions } = PlayerProfile.setName(
      useWorkspaceAdapter()!.playerProfileProgram.value,
      {
        profile: usePlayerProfileStore()!.playerProfile as PlayerProfile,
        key: signer,
        playerProfileProgram: useWorkspaceAdapter()!.playerProfileProgram.value,
      },
      // walletSigner,
      inputName.value,
    )

    staratlasIxs.push(instructions)
  }

  if (enable_chooseFaction.value) {
    const { instructions } = ProfileFactionAccount.chooseFaction(
      useWorkspaceAdapter()!.profileFactionProgram.value,
      {
        profile: usePlayerProfileStore()!.playerProfile as PlayerProfile,
        key: signer,
        playerProfileProgram: useWorkspaceAdapter()!.playerProfileProgram.value,
      },
      getEnumByKey(inputFaction.value),
    )
    staratlasIxs.push(instructions)
  }

  if (enable_createSagePlayerProfile.value) {
    const instruction = SagePlayerProfile.registerSagePlayerProfile(
      useWorkspaceAdapter()!.sageProgram.value,
      usePlayerProfileStore()!.playerProfile!.key,
      useGameStore().game!.key,
      useGameStore().game!.data.gameState,
    )
    staratlasIxs.push(instruction)
  }

  enable_createPoints.value.forEach((create, idx) => {
    if (create) {
      const { instructions } = UserPoints.createUserPointAccount(
        useWorkspaceAdapter()!.pointsProgram.value,
        usePlayerProfileStore()!.playerProfile!.key,
        usePointsStore().pointsCategories[idx]!.key,
      )
      staratlasIxs.push(instructions)
    }
  })

  await handleStaratlasTransaction(
    `Create Profile Instructions LEN=${staratlasIxs.length}`,
    staratlasIxs,
    signer || playerProfile,
  )

  await usePlayerProfileStore().updateStore()
  await useFactionStore().updateStore()
  await useGameStore().updateStore()
  return
}
</script>

<template>
  <q-card bordered flat>
    <q-card-section class="row items-center q-gutter-md">
      <q-icon name="create" size="md"></q-icon>
      <div class="text-h6">Create Accounts</div>
    </q-card-section>

    <q-card-section>
      <q-list bordered class="rounded-borders" separator>
        <q-item v-ripple :disable="usePlayerProfileStore().hasProfile" clickable>
          <q-toggle
            v-model="enable_createPlayerProfile"
            checked-icon="check"
            color="secondary"
            unchecked-icon="clear"
          />
          <div>
            <q-item-section>Profile</q-item-section>
            <q-item-label caption>Create the player profile account</q-item-label>
          </div>
        </q-item>
        <q-item v-ripple :disable="!usePlayerProfileStore().hasProfile" clickable>
          <div class="col row q-gutter-sm">
            <div class="col row">
              <q-toggle
                v-model="enable_createPlayerProfileName"
                checked-icon="check"
                color="secondary"
                unchecked-icon="clear"
              />
              <div>
                <q-item-section>Name</q-item-section>
                <q-item-label caption>Create the player name account</q-item-label>
              </div>
            </div>
            <q-input v-model="inputName" class="col" dense label="Player name" />
          </div>
        </q-item>

        <q-item v-ripple :disable="!usePlayerProfileStore().hasProfile" clickable>
          <div class="col row q-gutter-sm">
            <div class="col row">
              <q-toggle
                v-model="enable_chooseFaction"
                checked-icon="check"
                color="secondary"
                unchecked-icon="clear"
              />
              <div>
                <q-item-section>Faction</q-item-section>
                <q-item-label caption>Choose a faction</q-item-label>
              </div>
            </div>
            <q-select v-model="inputFaction" :options="factionOptions" class="col" dense></q-select>
          </div>
        </q-item>
        <q-item v-ripple :disable="!usePlayerProfileStore().hasProfile" clickable>
          <div class="col row q-gutter-sm">
            <div class="col row">
              <q-toggle
                v-model="enable_createSagePlayerProfile"
                checked-icon="check"
                color="secondary"
                unchecked-icon="clear"
              />
              <div>
                <q-item-section>Sage Profile</q-item-section>
                <q-item-label caption>Create sage player profile</q-item-label>
              </div>
            </div>
          </div>
        </q-item>

        <q-item
          v-for="(categroy, idx) in usePointsStore().pointsCategories"
          :key="idx"
          v-ripple
          :disable="!usePlayerProfileStore().hasProfile"
          clickable
        >
          <div class="col row q-gutter-sm">
            <div class="col row">
              <q-toggle
                v-model="enable_createPoints[idx]"
                checked-icon="check"
                color="secondary"
                unchecked-icon="clear"
              />
              <div>
                <q-item-section>Points {{ categroy.name }}</q-item-section>
                <q-item-label caption>Create point</q-item-label>
              </div>
            </div>
          </div>
        </q-item>
      </q-list>
    </q-card-section>

    <q-card-section>
      <q-btn class="full-width" color="primary" label="Send" @click="sendTx"></q-btn>
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
