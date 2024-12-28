<script lang="ts" setup>
import { useWallet } from 'solana-wallets-vue'
import { onMounted } from 'vue'
import { usePlayerProfileStore } from '../stores/player-profile-store'

onMounted(async () => {
  usePlayerProfileStore().wallet = useWallet().publicKey.value!
  await usePlayerProfileStore().updateStore()
})
</script>

<template>
  <div class="col">
    <div class="row">
      <div>Wallet</div>
      <div>
        {{ usePlayerProfileStore().wallet }}
      </div>
    </div>
    <div class="row">
      <div>ProfileKey</div>
      <div>{{ usePlayerProfileStore().profileKey }}</div>
    </div>
    <div class="row">
      <div>ProfileData</div>
      <div>{{ usePlayerProfileStore().profileData }}</div>
    </div>
  </div>
</template>

<style scoped></style>
