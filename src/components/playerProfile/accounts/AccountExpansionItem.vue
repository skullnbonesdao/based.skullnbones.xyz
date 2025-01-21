<script lang="ts" setup>
import TimestampFormatter from 'components/formatter/TimestampFormatter.vue'
import { Faction } from '@staratlas/profile-faction'

defineProps(['label', 'account'])
</script>

<template>
  <q-expansion-item
    :caption="account?.key.toString() ?? 'not-found'"
    :label="label"
    icon="perm_identity"
  >
    <q-card>
      <q-card-section v-if="account?.data">
        <div v-for="data in Object.entries(account!.data)" :key="data[0]" class="row">
          <div class="col">{{ data[0] }}</div>
          <TimestampFormatter
            v-if="data[0] == 'createdAt'"
            :unix-timestamp="data[1]"
          ></TimestampFormatter>
          <div v-else-if="data[0] == 'faction'">
            {{ Faction[data[1] as number] }}
          </div>
          <div v-else>{{ data[1] }}</div>
        </div>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<style scoped></style>
