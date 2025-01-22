<script lang="ts" setup>
import { useSquadsStore } from 'components/squads/SquadsStore'
import { ref, watch } from 'vue'
import HeaderBanner from 'components/general/HeaderBanner.vue'

const newMultisigLabel = ref('')
const newMultisigPDA = ref()

watch(
  () => useSquadsStore().storeSelected,
  () => {
    useSquadsStore().multisigPDA = useSquadsStore().storeSelected.value
  },
)
</script>

<template>
  <q-page class="bg-black">
    <HeaderBanner text="Squad.so Integration" />

    <q-card flat>
      <q-card-section class="row items-center q-gutter-x-md">
        <q-space />
        <q-btn
          :href="useSquadsStore().getLink"
          color="primary"
          icon="arrow_forward"
          label="To Squads.so"
          target="_blank"
        />
      </q-card-section>
      <q-separator />

      <q-card-section>
        <div class="text-subtitle1">
          Please enter the required information so send instructions to your Squads Account
        </div>
        <div class="text-subtitle2 text-accent">
          You will still need to approve the transaction in you squads account!
        </div>
      </q-card-section>

      <q-card-section v-if="useSquadsStore().store.length" class="q-gutter-y-sm">
        <q-card bordered flat>
          <q-card-section>
            <div class="text-h6">Select Squad</div>
            <div class="text-subtitle2">Please choose one of you stored squad accounts</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-gutter-y-sm">
            <div class="row q-gutter-x-sm items-center">
              <div class="col-2">
                <q-select
                  v-model="useSquadsStore().storeSelected"
                  :options="useSquadsStore().store"
                  dense
                  filled
                />
              </div>
              <div class="col items-center">
                <div class="col">
                  <div class="row q-gutter-x-md">
                    <div class="col-2 text-right text-weight-light">Multisig Account</div>
                    <div class="col">
                      {{ useSquadsStore().multisigPDA }}
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="row q-gutter-x-md">
                    <div class="col-2 text-right text-weight-light">Squads Account</div>
                    <div class="col">
                      {{ useSquadsStore().getVaultPDA }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col"></div>
              <q-btn color="primary" label="Remove" @click="useSquadsStore().removeFromStore()" />
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>

      <q-card-section class="q-gutter-y-sm">
        <q-card bordered flat>
          <q-card-section>
            <div class="text-h6">Add Squad</div>
            <div class="text-subtitle2">Add a new squad to the local store...</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-gutter-y-sm">
            <div class="row q-gutter-x-sm items-center">
              <div class="col">
                <q-input v-model="newMultisigLabel" dense label="Label" standout type="text" />
              </div>
              <div class="col text-weight-light"></div>
            </div>
            <div class="row q-gutter-x-sm items-center">
              <div class="col">
                <q-input
                  v-model="newMultisigPDA"
                  dense
                  label="Multisig Account"
                  standout
                  type="text"
                />
              </div>
              <div class="col text-weight-light">Squads.so -> Settings -> Multisig Account</div>
            </div>

            <div class="row">
              <div class="col"></div>
              <q-btn
                color="primary"
                label="Add"
                @click="useSquadsStore().addToStore(newMultisigLabel, newMultisigPDA)"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style lang="sass" scoped></style>
