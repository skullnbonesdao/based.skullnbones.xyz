<script lang="ts" setup>
import { usePlayerProfileStore } from 'stores/player-profile-store'
import { ProfilePermissions } from '@staratlas/player-profile'
import PermissionsAddAccount from 'components/staratlas/playerProfile/actions/PermissionsAddAccount.vue'
import { PLAYER_PROFILE_PROGRAM_ID, SAGE_PROGRAM_ID } from 'components/staratlas/connector'
import { SagePermissions } from '@staratlas/sage'
</script>

<template>
  <q-card flat>
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
        <q-card-section v-if="k.scope.toString() == PLAYER_PROFILE_PROGRAM_ID.toString()">
          <div
            v-for="permission in Object.keys(ProfilePermissions.fromPermissions(k.permissions))"
            :key="permission"
            class="row"
          >
            <div class="col">
              {{ permission }}
            </div>
            <div>
              {{ ProfilePermissions.fromPermissions(k.permissions)[permission as String] }}
            </div>
          </div>
        </q-card-section>
        <q-card-section v-if="k.scope.toString() == SAGE_PROGRAM_ID.toString()">
          <div
            v-for="permission in Object.keys(SagePermissions.fromPermissions(k.permissions))"
            :key="permission"
            class="row"
          >
            <div class="col">
              {{ permission }}
            </div>
            <div>
              {{ SagePermissions.fromPermissions(k.permissions)[permission as String] }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-card-section>
    <q-card-section>
      <PermissionsAddAccount />
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
