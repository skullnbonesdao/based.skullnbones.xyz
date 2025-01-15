<script lang="ts" setup>
import { ProfilePermissions } from '@staratlas/player-profile'
import { ref } from 'vue'
import { handleStarAtlasTransaction } from 'src/handler/wallet/sendAndSign'

import { SagePermissions } from '@staratlas/sage'
import { PublicKey } from '@solana/web3.js'
import { ProfileInstructionHandler } from 'src/handler/instructions/ProfileInstructionHandler'
import { useProfileStore } from 'stores/profileStore'
import { getSigner } from 'components/squads/SignerFinder'
import { BN } from '@staratlas/anchor'
import { getAsyncSigner } from 'src/handler/convert/ToSigner'
import {
  PLAYER_PROFILE_PROGRAM_ID,
  POINTS_PROGRAM_ID,
  POINTS_STORE_PROGRAM_ID,
  SAGE_PROGRAM_ID,
} from 'src/handler/constants'
import { PointsPermissions } from '@staratlas/points'
import { PointsStorePermissions } from '@staratlas/points-store'
import { FeeInstructionHandler } from 'src/handler/instructions/FeeInstructionHandler'

const props = defineProps(['index', 'publicKey', 'scope', 'inputPermissions', 'expireTime'])

const permissions = ref()

if (props.scope.toString() == PLAYER_PROFILE_PROGRAM_ID.toString())
  permissions.value = ProfilePermissions.fromPermissions(props.inputPermissions)
if (props.scope.toString() == SAGE_PROGRAM_ID.toString())
  permissions.value = SagePermissions.fromPermissions(props.inputPermissions)
if (props.scope.toString() == POINTS_PROGRAM_ID.toString())
  permissions.value = PointsPermissions.fromPermissions(props.inputPermissions)
if (props.scope.toString() == POINTS_STORE_PROGRAM_ID.toString())
  permissions.value = PointsStorePermissions.fromPermissions(props.inputPermissions)

async function sendDelete() {
  const signer = getAsyncSigner()
  const staratlasIxs = []
  const profileInstructionHandler = new ProfileInstructionHandler(signer)

  staratlasIxs.push(
    profileInstructionHandler.removeKeyFromProfileIx([props.index, props.index + 1]),
  )

  await handleStarAtlasTransaction(
    `Update profile permissions`,
    staratlasIxs,
    signer,
    new FeeInstructionHandler(signer).transferFeeIx('DEFAULT'),
  )

  await useProfileStore().updateStore(getSigner())
}

async function sendUpdate() {
  const signer = getAsyncSigner()
  const staratlasIxs = []

  const profileInstructionHandler = new ProfileInstructionHandler(signer)

  staratlasIxs.push(
    profileInstructionHandler.removeKeyFromProfileIx([props.index, props.index + 1]),
  )

  staratlasIxs.push(
    profileInstructionHandler.addSageKeyPermissionToProfileIx(
      new PublicKey(props.publicKey.toString()),
      permissions.value as never,
      props.expireTime >= 0 ? null : new BN(props.expireTime),
    ),
  )

  await handleStarAtlasTransaction(
    `Update profile permissions`,
    staratlasIxs,
    signer,
    new FeeInstructionHandler(signer).transferFeeIx('DEFAULT'),
  )

  await useProfileStore().updateStore(getSigner())
}
</script>

<template>
  <q-card-section v-if="permissions" class="q-gutter-y-xs">
    <div
      v-for="permission in Object.keys(permissions)"
      :key="permission"
      class="row items-center q-gutter-x-md"
    >
      <div class="">
        {{ permission }}
      </div>
      <q-separator class="col" />
      <div>
        <q-toggle
          v-model="permissions[permission]"
          :disable="scope.toString() == PLAYER_PROFILE_PROGRAM_ID.toString()"
          checked-icon="check"
          color="positive"
          dense
          label=""
          size="sm"
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
