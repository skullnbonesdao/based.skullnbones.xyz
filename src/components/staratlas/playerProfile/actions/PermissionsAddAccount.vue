<script lang="ts" setup>
import { ref } from 'vue'
import { SAGE_PROGRAM_ID, useWorkspaceAdapter } from 'components/staratlas/connector'
import { PlayerProfile } from '@staratlas/player-profile'
import {
  addStaratlasTransactionToTransaction,
  walletStoreToAsyncSigner,
} from 'components/staratlas/helper'
import { useWallet } from 'solana-wallets-vue'
import { usePlayerProfileStore } from 'stores/player-profile-store'
import { SagePermissions } from '@staratlas/sage'
import { PublicKey, Transaction } from '@solana/web3.js'
import { handleTransaction } from 'src/solana/handleTransaction'

const optionsScope = [SAGE_PROGRAM_ID]

const inputKey = ref('3q9HnMCZTVnLwgHzzTcu9ALi6kJFvnpFcq1TW7gxPeyL')
const inputScope = ref(optionsScope[0])
const inputExpireTime = ref(0)
const permissions = ref()

async function sendTX() {
  const tx = new Transaction()

  const signer = walletStoreToAsyncSigner(useWallet())
  const instruction = await PlayerProfile.addKeys(
    useWorkspaceAdapter()!.playerProfileProgram.value,
    signer,
    usePlayerProfileStore()!.playerProfile,
    SagePermissions,
    SAGE_PROGRAM_ID,
    [
      {
        key: new PublicKey(inputKey.value),
        permissions: SagePermissions.all(),
        expireTime: inputExpireTime.value == 0 ? null : inputExpireTime.value,
      },
    ],
  )(signer)

  addStaratlasTransactionToTransaction(instruction, tx)

  await handleTransaction(tx, 'Add Account to Player Profile')

  console.log('Sending TX')
}
</script>

<template>
  <q-card bordered flat>
    <q-card-actions>
      <div class="text-weight-thin text-center col">Add a new wallet to the permission list</div>
    </q-card-actions>
    <q-card-section>
      <q-input v-model="inputKey" label="Key" square />
      <q-select v-model="inputScope" :options="optionsScope" label="Scope" square />
      <q-input v-model="inputExpireTime" label="Expire Time" square type="number" />
    </q-card-section>
    <q-card-actions>
      <q-btn class="full-width" color="primary" @click="sendTX">ADD</q-btn>
    </q-card-actions>
  </q-card>
</template>

<style scoped></style>
