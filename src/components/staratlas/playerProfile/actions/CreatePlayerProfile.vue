<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Keypair, Transaction } from '@solana/web3.js'
import {
  addStaratlasTransactionToTransaction,
  publicKeyToAsyncSigner,
  walletStoreToAsyncSigner,
} from 'components/staratlas/helper'
import { useWallet } from 'solana-wallets-vue'
import { PlayerProfile, ProfilePermissions } from '@staratlas/player-profile'
import { PLAYER_PROFILE_PROGRAM_ID, useWorkspaceAdapter } from 'components/staratlas/connector'
import { handleTransaction } from 'src/solana/handleTransaction'
import { getSigner } from 'components/squads/SignerFinder'
import { usePlayerProfileStore } from 'stores/player-profile-store'
import { useFactionStore } from 'stores/faction-store'
import { useGameStore } from 'stores/game-store'

const enable_createPlayerProfile = ref(false)
const enable_createPlayerProfileName = ref(false)

const inputName = ref()

updateEnables()

watch(
  () => usePlayerProfileStore().playerProfile,
  () => updateEnables(),
)

function updateEnables() {
  if (!usePlayerProfileStore().hasProfile) {
    enable_createPlayerProfile.value = true
    enable_createPlayerProfileName.value = false
  }
}

async function sendTx() {
  const tx = new Transaction()

  const signer = walletStoreToAsyncSigner(useWallet())

  const playerProfile = publicKeyToAsyncSigner(Keypair.generate().publicKey)

  if (enable_createPlayerProfile.value) {
    const instruction = await PlayerProfile.createProfile(
      useWorkspaceAdapter()!.playerProfileProgram.value,
      playerProfile,
      [
        {
          key: getSigner(),
          expireTime: null,
          scope: PLAYER_PROFILE_PROGRAM_ID,
          permissions: ProfilePermissions.all(),
        },
      ],
      1,
    )(signer)
    console.log(instruction)

    addStaratlasTransactionToTransaction(instruction, tx)
  }

  /*if (enable_createPlayerProfileName.value) {
    const { instructions, _name } = PlayerProfile.setName(
      useWorkspaceAdapter()!.playerProfileProgram.value,
      {
        profile: usePlayerProfileStore()!.playerProfile,
        key: signer,
        playerProfileProgram: useWorkspaceAdapter()!.playerProfileProgram.value,
      },
      // walletSigner,
      inputName.value,
    )

    const i = await instructions(signer)
    addStaratlasTransactionToTransaction(i, tx)
  }*/

  console.log(tx)
  await handleTransaction(tx, 'Add Account to Player Profile')

  await usePlayerProfileStore().updateStore()
  await useFactionStore().updateStore()
  await useGameStore().updateStore()
  return
}
</script>

<template>
  <q-card bordered flat>
    <q-card-section>
      <div class="text-h6">Create Accounts</div>
    </q-card-section>

    <q-card-section>
      <q-list bordered separator>
        <q-item v-ripple clickable>
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
        <q-item v-ripple :disabled="!usePlayerProfileStore().hasProfile" clickable>
          <div>
            <div class="row">
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
            <div class="row">
              <div class="col"></div>
              <q-input v-model="inputName" dense label="Player name" />
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
