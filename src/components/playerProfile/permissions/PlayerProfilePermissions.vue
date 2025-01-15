<script lang="ts" setup>
import PermissionsAddAccount from 'components/playerProfile/actions/PermissionsAddAccount.vue'
import PermissionEditable from 'components/playerProfile/actions/PermissionEditable.vue'
import { useProfileStore } from 'stores/profileStore'
</script>

<template>
  <q-card bordered flat>
    <q-card-section class="row items-center q-gutter-md">
      <q-icon name="vpn_key" size="md"></q-icon>
      <div class="text-h6">Permissions</div>
    </q-card-section>

    <q-card-section v-if="useProfileStore().playerProfile" class="q-gutter-y-md">
      <q-card
        v-for="(k, idx) in useProfileStore().playerProfile!.profileKeys"
        :key="idx"
        bordered
        class="col"
        flat
      >
        <q-card-section>
          <div class="row items-center q-gutter-md">
            <div>Key</div>
            <q-separator class="col" />
            <div>{{ k.key }}</div>
          </div>
          <div class="row items-center q-gutter-md">
            <div>Scope</div>
            <q-separator class="col" />
            <div>{{ k.scope }}</div>
          </div>
          <div class="row items-center q-gutter-md">
            <div>ExpireTime</div>
            <q-separator class="col" />
            <div>{{ k.expireTime.toString() == '-1' ? 'never' : k.expireTime }}</div>
          </div>
        </q-card-section>

        <q-card-section>
          <PermissionEditable
            :expire-time="k.expireTime"
            :index="idx"
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
