<script lang="ts" setup>
import { usePlayerProfileStore } from 'stores/player-profile-store'
import PermissionsAddAccount from 'components/staratlas/playerProfile/actions/PermissionsAddAccount.vue'
import PermissionEditable from 'components/staratlas/playerProfile/actions/PermissionEditable.vue'
</script>

<template>
  <q-card bordered flat>
    <q-card-section class="row items-center q-gutter-md">
      <q-icon name="vpn_key" size="md"></q-icon>
      <div class="text-h6">Permissions</div>
    </q-card-section>

    <q-card-section v-if="usePlayerProfileStore().playerProfile" class="q-gutter-y-md">
      <q-card
        v-for="(k, idx) in usePlayerProfileStore().playerProfile!.profileKeys"
        :key="idx"
        bordered
        class="col"
        flat
      >
        <q-card-section>
          <div class="row">
            <div class="col">Key</div>
            <div>{{ k.key }}</div>
          </div>
          <div class="row">
            <div class="col">Scope</div>
            <div>{{ k.scope }}</div>
          </div>
          <div class="row">
            <div class="col">ExpireTime</div>
            <div>{{ k.expireTime }}</div>
          </div>
        </q-card-section>

        <q-card-section>
          <PermissionEditable
            :expire-time="k.expireTime"
            :input-permissions="k.permissions"
            :publicKey="k.key"
            :scope="k.scope"
          ></PermissionEditable>
        </q-card-section>
      </q-card>
    </q-card-section>
    <q-card-section>
      <PermissionsAddAccount />
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
