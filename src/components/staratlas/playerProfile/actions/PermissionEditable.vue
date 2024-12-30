<script lang="ts" setup>
import {
  PLAYER_PROFILE_PROGRAM_ID,
  SAGE_PROGRAM_ID,
  useWorkspaceAdapter,
} from 'components/staratlas/connector'
import { PlayerProfile, ProfilePermissions } from '@staratlas/player-profile'
import { ref } from 'vue'
import { handleStaratlasTransaction, walletStoreToAsyncSigner } from 'components/staratlas/helper'
import { useWallet } from 'solana-wallets-vue'
import { usePlayerProfileStore } from 'stores/player-profile-store'
import { SagePermissions } from '@staratlas/sage'
import { getSigner } from 'components/squads/SignerFinder'
import { PublicKey } from '@solana/web3.js'

const props = defineProps(['publicKey', 'scope', 'inputPermissions', 'expireTime'])

const permissions = ref()

if (props.scope.toString() == PLAYER_PROFILE_PROGRAM_ID.toString())
  permissions.value = ProfilePermissions.fromPermissions(props.inputPermissions)
if (props.scope.toString() == SAGE_PROGRAM_ID.toString())
  permissions.value = SagePermissions.fromPermissions(props.inputPermissions)

async function sendTx() {
  const signer = walletStoreToAsyncSigner(useWallet())
  const staratlasIxs = []

  staratlasIxs.push(
    PlayerProfile.removeKeys(
      useWorkspaceAdapter()!.playerProfileProgram.value,
      {
        profileKey: usePlayerProfileStore().playerProfile?.key as PublicKey,
        key: signer,
        keyIndex: 0,
        playerProfileProgram: useWorkspaceAdapter()!.playerProfileProgram.value,
      },
      getSigner(),
      [1, 2],
    ),
  )

  staratlasIxs.push(
    PlayerProfile.addKeys(
      useWorkspaceAdapter()!.playerProfileProgram.value,
      signer,
      usePlayerProfileStore()!.playerProfile as PlayerProfile,
      SagePermissions,
      SAGE_PROGRAM_ID,
      [
        {
          key: new PublicKey(props.publicKey.toString()),
          permissions: permissions.value,
          expireTime: props.expireTime >= 0 ? null : props.expireTime,
        },
      ],
    ),
  )

  await handleStaratlasTransaction(`Update profile permissions`, staratlasIxs, signer)

  await usePlayerProfileStore().updateStore()
}
</script>

<template>
  <q-card-section v-if="permissions">
    <div v-for="permission in Object.keys(permissions)" :key="permission" class="row">
      <div class="col">
        {{ permission }}
      </div>
      <div>
        <q-toggle
          v-model="permissions[permission]"
          :disable="scope.toString() == PLAYER_PROFILE_PROGRAM_ID.toString()"
          checked-icon="check"
          dense
          label=""
          unchecked-icon="clear"
        />
      </div>
    </div>
  </q-card-section>
  <q-card-section v-if="scope.toString() != PLAYER_PROFILE_PROGRAM_ID.toString()">
    <q-btn
      :disable="permissions?.getPermissions().toString() == inputPermissions.toString()"
      class="full-width"
      color="primary"
      label="Update"
      @click="sendTx"
    ></q-btn>
  </q-card-section>
</template>

<style scoped></style>
