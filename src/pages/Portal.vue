<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { getSigner } from 'components/squads/SignerFinder'
import { byteArrayToString } from '@staratlas/data-source'
import { useProfileStore } from 'stores/profileStore'
import { useGameStore } from 'stores/gameStore'
import { useTokenStore } from 'stores/tokenStore'
import TokenTable from 'components/portal/TokenTable.vue'
import InfoBanner from 'components/general/InfoBanner.vue'
import CrewTable from 'components/portal/CrewTable.vue'
import LoadingAnimation from 'components/general/LoadingAnimation.vue'

const tabDirection = ref('deposit')
const tabItemType = ref('ship')

onMounted(async () => {
  await useProfileStore().updateStore(getSigner())
  await useGameStore().updateStore()
})

watch(
  () => getSigner(),
  async () => {
    await useProfileStore().updateStore(getSigner())
  },
)

watch(
  () => useGameStore().starbase,
  async () => {
    await useGameStore().updateStore()
    await useTokenStore().updateStore(getSigner())
  },
)
</script>
<template>
  <q-page v-if="!useGameStore().starbases?.length" class="row justify-center items-center">
    <LoadingAnimation />
  </q-page>
  <q-page v-else class="">
    <q-select
      v-model="useGameStore().starbase"
      :option-label="(value) => byteArrayToString(value.data.name)"
      :options="
        useGameStore().starbases?.filter((starbase) =>
          byteArrayToString(starbase.data.name).includes('Central'),
        )
      "
      class=""
      label="Selected Starbase"
      square
      standout
    >
      <template v-slot:prepend>
        <q-icon name="home" />
      </template>
    </q-select>

    <InfoBanner v-if="!useGameStore().starbase" message="Please select a starabse" />

    <div v-if="useGameStore().starbase">
      <q-separator />
      <q-tabs v-model="tabDirection" active-bg-color="primary" align="justify" inline-label>
        <q-tab icon="call_made" label="Deposit" name="deposit"></q-tab>
        <q-tab icon="call_received" label="Withdraw" name="withdraw"></q-tab>
      </q-tabs>
      <q-separator />
      <q-tabs v-model="tabItemType" active-bg-color="primary" align="justify">
        <q-tab label="Ships" name="ship"></q-tab>
        <q-tab label="Resources" name="resource"></q-tab>
        <q-tab label="Crew" name="crew"></q-tab>
      </q-tabs>
      <q-separator />

      <InfoBanner
        v-if="
          !useTokenStore().walletTokenAccounts &&
          (tabItemType == 'ship' || tabItemType == 'resource')
        "
        :message="`No ${tabItemType}s found to ${tabDirection}`"
      />

      <InfoBanner
        v-if="!useTokenStore().walletCrewAccounts && tabItemType == 'crew'"
        :message="`No ${tabItemType} found to ${tabDirection}`"
      />

      <TokenTable
        v-if="
          useTokenStore().walletTokenAccounts &&
          (tabItemType == 'ship' || tabItemType == 'resource')
        "
        :direction="tabDirection"
        :item-type="tabItemType"
        :rows="useTokenStore().walletTokenAccounts?.filter((acc) => acc.itemType == tabItemType)"
      />

      <CrewTable
        v-if="
          tabDirection == 'deposit' && useTokenStore().walletCrewAccounts && tabItemType == 'crew'
        "
        :direction="tabDirection"
        :rows="useTokenStore().walletCrewAccounts!"
      />
    </div>
  </q-page>
</template>
