<script lang="ts" setup>
import { ref } from 'vue'
import { handleStarAtlasTransaction } from 'src/handler/wallet/sendAndSign'

import { SagePermissions } from '@staratlas/sage'
import { PublicKey } from '@solana/web3.js'
import { useProfileStore } from 'stores/profileStore'
import { getSigner } from 'components/squads/SignerFinder'
import { getAsyncSigner } from 'src/handler/convert/ToSigner'
import {
  permissionOptions,
  ProfileInstructionHandler,
} from 'src/handler/instructions/ProfileInstructionHandler'
import { PointsPermissions } from '@staratlas/points'
import { PointsStorePermissions } from '@staratlas/points-store'
import { BN } from '@staratlas/anchor'
import { FeeInstructionHandler } from 'src/handler/instructions/FeeInstructionHandler'
import { FeePayerPermissions } from '@staratlas/atlas-prime'

const inputKey = ref('')
const inputScope = ref(permissionOptions[0])
const inputExpireTime = ref(0)
const permissions = ref()

async function sendTX() {
  const signer = getAsyncSigner()
  const staratlasIxs = []
  const profileInstructionHandler = new ProfileInstructionHandler(signer)

  if (inputScope.value?.address == permissionOptions[1]?.address)
    staratlasIxs.push(
      profileInstructionHandler.addSageKeyPermissionToProfileIx(
        new PublicKey(inputKey.value),
        SagePermissions.empty(),
        inputExpireTime.value == 0 ? null : new BN(inputExpireTime.value),
      ),
    )

  if (inputScope.value?.address == permissionOptions[2]?.address)
    staratlasIxs.push(
      profileInstructionHandler.addPointsKeyPermissionToProfileIx(
        new PublicKey(inputKey.value),
        PointsPermissions.empty(),
        inputExpireTime.value == 0 ? null : new BN(inputExpireTime.value),
      ),
    )

  if (inputScope.value?.address == permissionOptions[3]?.address)
    staratlasIxs.push(
      profileInstructionHandler.addPointsStoreKeyPermissionToProfileIx(
        new PublicKey(inputKey.value),
        PointsStorePermissions.empty(),
        inputExpireTime.value == 0 ? null : new BN(inputExpireTime.value),
      ),
    )

  if (inputScope.value?.address == permissionOptions[4]?.address)
    staratlasIxs.push(
      profileInstructionHandler.addFeePayerPermissionToProfileIx(
        new PublicKey(inputKey.value),
        FeePayerPermissions.empty(),
        inputExpireTime.value == 0 ? null : new BN(inputExpireTime.value),
      ),
    )

  await handleStarAtlasTransaction(
    `Add permission account`,
    staratlasIxs,
    signer,
    new FeeInstructionHandler(signer).transferFeeIx('DEFAULT'),
  )
  await useProfileStore().updateStore(getSigner())
  console.log('Sending TX')
}
</script>

<template>
  <div class="q-gutter-y-sm">
    <q-input v-model="inputKey" dense label="Wallet (Key)" standout />

    <div class="row q-gutter-x-sm">
      <q-select
        v-model="inputScope"
        :option-label="(option) => option.label"
        :options="permissionOptions.slice(1)"
        class="col"
        dense
        label="Scope"
        standout
      />

      <q-input
        v-model="inputExpireTime"
        class="col"
        dense
        label="Expire Time"
        standout
        type="number"
      />
    </div>
    <q-btn class="full-width" color="primary" rounded @click="sendTX">ADD</q-btn>
  </div>
</template>

<style scoped></style>
