<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { getSigner } from 'components/squads/SignerFinder'
import { useProfileStore } from 'stores/profileStore'
import { useGameStore } from 'stores/gameStore'
import { useTokenStore } from 'stores/tokenStore'
import TokenTable from 'components/portal/TokenTable.vue'
import InfoBanner from 'components/general/InfoBanner.vue'
import CrewTable from 'components/portal/CrewTable.vue'
import LoadingAnimation from 'components/general/LoadingAnimation.vue'
import HeaderBanner from 'components/general/HeaderBanner.vue'
import { usePlayerStore } from 'stores/playerStore'

const tabDirection = ref('deposit')
const tabItemType = ref('ship')

onMounted(async () => {
  await useProfileStore().updateStore(getSigner())
  await useGameStore().updateStore()
})

watch(
  () => tabDirection.value,
  () => {
    usePlayerStore().starbaseTokenAccountsSelected = []
    usePlayerStore().starbaseCrewAccountsSelected = []
  },
)
</script>
<template>
  <q-page v-if="!useGameStore().starbases?.length" class="row justify-center items-center">
    <LoadingAnimation />
  </q-page>
  <q-page v-else class="">
    <!--    <q-select
          v-model="useGameStore().starbase"
          :disable="true"
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
        </q-select>-->

    <InfoBanner v-if="!usePlayerStore().currentStarbase" message="Please select a starabse" />

    <div v-else>
      <HeaderBanner text="Wallet/Sage Portal" />

      <q-separator />
      <q-tabs v-model="tabDirection" active-bg-color="primary" align="justify" inline-label>
        <q-tab icon="call_made" label="Deposit" name="deposit"></q-tab>
        <q-tab icon="call_received" label="Withdraw" name="withdraw"></q-tab>
      </q-tabs>
      <q-separator />

      <q-tabs v-model="tabItemType" active-bg-color="primary" align="justify" inline-label>
        <q-tab icon="sailing" label="Ships" name="ship"></q-tab>
        <q-tab icon="category" label="Resources" name="resource"></q-tab>
        <q-tab icon="person" label="Crew" name="crew"></q-tab>
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
          (tabItemType == 'ship' || tabItemType == 'resource') &&
          tabDirection == 'deposit'
        "
        :action="tabDirection"
        :item-type="tabItemType"
        :rows="useTokenStore().walletTokenAccounts?.filter((acc) => acc.itemType == tabItemType)"
        selection="multiple"
      />

      <TokenTable
        v-if="
          usePlayerStore().starbaseTokenAccounts &&
          (tabItemType == 'ship' || tabItemType == 'resource') &&
          tabDirection == 'withdraw'
        "
        :action="tabDirection"
        :item-type="tabItemType"
        :rows="usePlayerStore().starbaseTokenAccounts?.filter((acc) => acc.itemType == tabItemType)"
        selection="multiple"
      />

      <CrewTable
        v-if="
          useTokenStore().walletCrewAccounts && tabItemType == 'crew' && tabDirection == 'deposit'
        "
        :action="tabDirection"
        :rows="useTokenStore().walletCrewAccounts!"
        selection="multiple"
      />

      <CrewTable
        v-if="
          usePlayerStore().starbaseCrewAccounts &&
          tabItemType == 'crew' &&
          tabDirection == 'withdraw'
        "
        :action="tabDirection"
        :rows="usePlayerStore().starbaseCrewAccounts!"
        selection="multiple"
      />
    </div>
  </q-page>
</template>
