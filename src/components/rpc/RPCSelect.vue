<script lang="ts" setup>
import { useRPCStore } from 'stores/rpcStore'
import { watch } from 'vue'
import { RPC_NETWORKS } from 'stores/interfaces/RPC_Networks'
import { useQuasar } from 'quasar'

const $q = useQuasar()

watch(
  () => useRPCStore().rpc_stored_name,
  () => {
    useRPCStore().update_connection()

    $q.notify({
      timeout: 5000,
      message: `Using RPC: ${useRPCStore().rpc_selected!.name}`,
      position: 'bottom-right',
      color: 'orange',
    })
  },
)
</script>

<template>
  <q-select
    v-model="useRPCStore().rpc_stored_name"
    :options="RPC_NETWORKS.map((rpc) => rpc.name)"
    class="col"
    label="RPC"
    square
  />
</template>

<style scoped></style>
