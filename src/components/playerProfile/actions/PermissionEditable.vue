<script lang="ts" setup>
import { PLAYER_PROFILE_PROGRAM_ID, SAGE_PROGRAM_ID } from 'components/staratlas/connector'
import { ProfilePermissions } from '@staratlas/player-profile'
import { ref } from 'vue'
import { handleStarAtlasTransaction, walletStoreToAsyncSigner } from 'components/staratlas/helper'
import { useWallet } from 'solana-wallets-vue'

import { SagePermissions } from '@staratlas/sage'
import { PublicKey } from '@solana/web3.js'
import { ProfileInstructionHandler } from 'src/handler/instructions/ProfileInstructionHandler'
import { useProfileStore } from 'stores/profileStore'
import { getSigner } from 'components/squads/SignerFinder'
import { BN } from '@staratlas/anchor'

const props = defineProps(['publicKey', 'scope', 'inputPermissions', 'expireTime'])

const permissions = ref()

if (props.scope.toString() == PLAYER_PROFILE_PROGRAM_ID.toString())
  permissions.value = ProfilePermissions.fromPermissions(props.inputPermissions)
if (props.scope.toString() == SAGE_PROGRAM_ID.toString())
  permissions.value = SagePermissions.fromPermissions(props.inputPermissions)

async function sendDelete() {
  const signer = walletStoreToAsyncSigner(useWallet())
  const staratlasIxs = []
  const profileInstructionHandler = new ProfileInstructionHandler(signer)

  staratlasIxs.push(profileInstructionHandler.removeKeyFromProfileIx([1, 2]))

  await handleStarAtlasTransaction(`Update profile permissions`, staratlasIxs, signer)

  await useProfileStore().updateStore(getSigner())
}

async function sendUpdate() {
  const signer = walletStoreToAsyncSigner(useWallet())
  const staratlasIxs = []

  const profileInstructionHandler = new ProfileInstructionHandler(signer)

  staratlasIxs.push(profileInstructionHandler.removeKeyFromProfileIx([1, 2]))

  staratlasIxs.push(
    profileInstructionHandler.addSageKeyToProfileIx(
      new PublicKey(props.publicKey.toString()),
      permissions.value as never,
      props.expireTime >= 0 ? null : new BN(props.expireTime),
    ),
  )

  await handleStarAtlasTransaction(`Update profile permissions`, staratlasIxs, signer)

  await useProfileStore().updateStore(getSigner())
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
  <q-card-section
    v-if="scope.toString() != PLAYER_PROFILE_PROGRAM_ID.toString()"
    class="q-gutter-x-sm row"
  >
    <q-btn class="col" color="primary" label="Delete" @click.prevent="sendDelete"></q-btn>

    <q-btn
      :disable="permissions?.getPermissions().toString() == inputPermissions.toString()"
      class="col"
      color="primary"
      label="Update"
      @click.prevent="sendUpdate"
    ></q-btn>
  </q-card-section>
</template>

<style scoped></style>
