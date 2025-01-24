<template>
  <router-view />
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { initWorkspaceAdapter, useWorkspaceAdapter } from 'src/handler/connector'
import { useRPCStore } from 'stores/rpcStore'
import { useGameStore } from 'stores/gameStore'
import { usePlayerStore } from 'stores/playerStore'
import { useProfileStore } from 'stores/profileStore'
import { useTokenStore } from 'stores/tokenStore'
import { onMounted, watch } from 'vue'
import { getSigner } from 'components/squads/SignerFinder'
import { byteArrayToString } from '@staratlas/data-source'
import { Faction } from '@staratlas/profile-faction'
import { PublicKey } from '@solana/web3.js'

useQuasar().dark.set(true)

useGameStore()
usePlayerStore()
useProfileStore()
useTokenStore()

useRPCStore().update_connection()
useWorkspaceAdapter()
initWorkspaceAdapter()

onMounted(async () => {
  const accounts = await useRPCStore().connection.getProgramAccounts(
    new PublicKey('AddressLookupTab1e1111111111111111111111111'),
    {
      filters: [
        {
          memcmp: {
            offset: 8, // Owner pubkey starts at byte offset 32
            bytes: new PublicKey('derpyLfAzeqGt8Ny7NGi11eRsm154r1WHzTFz3CtstL').toBase58(),
          },
        },
      ],
    },
  )
  console.log(accounts)
})

watch(
  () => getSigner(),
  async () => {
    await useProfileStore().updateStore(getSigner())
  },
)

watch(
  () => usePlayerStore().currentStarbase,
  async () => {
    await usePlayerStore().updateStore()
    await usePlayerStore().updateStarbasePlayer()
    await useTokenStore().updateStore(getSigner())
  },
)

watch(
  () => useGameStore().starbases,
  () => {
    usePlayerStore().currentStarbase = useGameStore().starbases!.find(
      (starbase) =>
        byteArrayToString(starbase.data.name).toLowerCase().includes('Central'.toLowerCase()) &&
        byteArrayToString(starbase.data.name)
          .toLowerCase()
          .includes(
            (Faction[useProfileStore().factionProfile?.data.faction ?? 0] ?? 'none').toLowerCase(),
          ),
    )
  },
)

//useGameStore().starbase = useGameStore().persistent.starbase
</script>
