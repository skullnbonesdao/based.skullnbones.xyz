<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { handleStarAtlasTransaction } from 'src/handler/wallet/sendAndSign'
import { Faction } from '@staratlas/profile-faction'
import { useSquadsStore } from 'components/squads/SquadsStore'
import { getSigner } from 'components/squads/SignerFinder'
import { ProfileInstructionHandler } from 'src/handler/instructions/ProfileInstructionHandler'
import { useProfileStore } from 'stores/profileStore'
import * as multisig from '@sqds/multisig'
import { getEphemeralSignerPda } from '@sqds/multisig'
import { Keypair, PublicKey } from '@solana/web3.js'
import { getFactionEnumString, getPointsCategoryEnumString } from 'src/handler/convert/EnumToString'
import { keypairToAsyncSigner } from '@staratlas/data-source'
import { PointsCategories } from 'src/handler/interfaces/PointsInterface'
import { getAsyncSigner, publicKeyToAsyncSigner } from 'src/handler/convert/ToSigner'
import { FeeInstructionHandler } from 'src/handler/instructions/FeeInstructionHandler'

const enable_createPlayerProfile = ref(false)
const enable_createPlayerProfileName = ref(false)
const enable_chooseFaction = ref(false)
const enable_createSagePlayerProfile = ref(false)
const enable_createPoints = ref<boolean[]>([])

const factionOptions = [Faction.MUD, Faction.ONI, Faction.Ustur]

const inputName = ref(' ')
const inputFaction = ref(factionOptions[0])

updateEnables()

const combinedValues = computed(() => ({
  playerProfile: useProfileStore().playerProfile,
  faction: useProfileStore().factionProfile,
  sagePlayerProfile: useProfileStore().sageProfile,
  pointsCategories: useProfileStore().points.flatMap((point) => point.points?.key),
}))

watch(
  () => combinedValues,
  () => updateEnables(),
  { deep: true },
)

function updateEnables() {
  enable_createPlayerProfile.value = false
  enable_createPlayerProfileName.value = false
  enable_chooseFaction.value = false
  enable_createSagePlayerProfile.value = false
  enable_createPoints.value = useProfileStore().points.map(() => false)

  if (!useProfileStore().playerProfileAddress) {
    enable_createPlayerProfile.value = true
  }
  if (useProfileStore().playerProfileAddress) {
    if (!useProfileStore().nameProfile) enable_createPlayerProfileName.value = true
    if (!useProfileStore().factionProfile) enable_chooseFaction.value = true
    if (!useProfileStore().sageProfile) enable_createSagePlayerProfile.value = true
    enable_createPoints.value = useProfileStore().points.map((point) => !point.points?.key)
  }
}

async function sendTx() {
  const signer = getAsyncSigner()
  const staratlasIxs = []
  let feeIx = undefined
  const profileInstructionHandler = new ProfileInstructionHandler(signer)

  let ephemeralSigners = 0
  const labels = []

  if (enable_createPlayerProfile.value) {
    let playerProfile
    if (useSquadsStore().useSquads) {
      feeIx = new FeeInstructionHandler(signer).transferFeeIx('CREATE')

      await useSquadsStore().update()
      const [transactionPda] = multisig.getTransactionPda({
        multisigPda: new PublicKey(useSquadsStore().multisigPDA.toString()),
        index: useSquadsStore().getNewTransactionIndex,
      })

      playerProfile = publicKeyToAsyncSigner(
        getEphemeralSignerPda({
          transactionPda,
          ephemeralSignerIndex: 0,
        })[0],
      )

      ephemeralSigners += 1
    } else {
      playerProfile = keypairToAsyncSigner(Keypair.generate())
    }

    staratlasIxs.push(profileInstructionHandler.createPlayerProfileIx(getSigner(), playerProfile))
    labels.push('playerProfile')
  }

  if (enable_createPlayerProfileName.value) {
    if (!inputName.value) throw Error('Player name can not be empty!')

    staratlasIxs.push(profileInstructionHandler.createPlayerProfileNameIx(inputName.value))
    labels.push('nameProfile')
  }

  if (enable_chooseFaction.value) {
    if (!inputFaction.value) throw Error('Please select a faction!')

    staratlasIxs.push(profileInstructionHandler.createChooseFactionIx(inputFaction.value))
    labels.push('factionProfile')
  }

  if (enable_createSagePlayerProfile.value) {
    staratlasIxs.push(profileInstructionHandler.createSagePlayerProfileIx())
    labels.push('sageProfile')
  }

  enable_createPoints.value.forEach((create, idx) => {
    if (create) {
      staratlasIxs.push(
        profileInstructionHandler.createPointsIx(
          PointsCategories.find(
            (categroy) => categroy.kind == useProfileStore().points[idx]!.category,
          )?.key ?? new PublicKey(''),
        ),
      )
      labels.push(`points-${getPointsCategoryEnumString(useProfileStore().points[idx]!.category)}`)
    }
  })

  await handleStarAtlasTransaction(
    `Instructions create: ${labels.join(', ')}`,
    staratlasIxs,
    signer,
    feeIx,
    ephemeralSigners,
  )

  await useProfileStore().updateStore(getSigner())
  return
}
</script>

<template>
  <q-card bordered flat>
    <q-card-section class="row items-center q-gutter-md">
      <q-icon name="create" size="md"></q-icon>
      <div class="text-h6">Create Accounts</div>
    </q-card-section>

    <q-card-section>
      <q-list bordered class="rounded-borders" separator>
        <q-item v-ripple clickable>
          <q-toggle
            v-model="enable_createPlayerProfile"
            checked-icon="check"
            color="secondary"
            unchecked-icon="clear"
          />
          <div>
            <q-item-section>Profile</q-item-section>
            <q-item-label caption>Create player profile</q-item-label>
          </div>
        </q-item>
        <q-item v-ripple clickable>
          <div class="col row q-gutter-sm">
            <div class="col row">
              <q-toggle
                v-model="enable_createPlayerProfileName"
                checked-icon="check"
                color="secondary"
                unchecked-icon="clear"
              />
              <div>
                <q-item-section>Name</q-item-section>
                <q-item-label caption>Create player name</q-item-label>
              </div>
            </div>
            <q-input v-model="inputName" class="col" dense label="Player name" standout />
          </div>
        </q-item>

        <q-item v-ripple clickable>
          <div class="col row q-gutter-sm">
            <div class="col row">
              <q-toggle
                v-model="enable_chooseFaction"
                checked-icon="check"
                color="secondary"
                unchecked-icon="clear"
              />
              <div>
                <q-item-section>Faction</q-item-section>
                <q-item-label caption>Choose faction</q-item-label>
              </div>
            </div>

            <q-select
              v-model="inputFaction"
              :option-label="(option) => getFactionEnumString(option)"
              :options="factionOptions"
              class="col"
              dense
              label="Faction"
              standout
            ></q-select>
          </div>
        </q-item>
        <q-item v-ripple clickable>
          <div class="col row q-gutter-sm">
            <div class="col row">
              <q-toggle
                v-model="enable_createSagePlayerProfile"
                checked-icon="check"
                color="secondary"
                unchecked-icon="clear"
              />
              <div>
                <q-item-section>Sage Profile</q-item-section>
                <q-item-label caption>Create sage profile</q-item-label>
              </div>
            </div>
          </div>
        </q-item>

        <q-item v-for="(point, idx) in useProfileStore().points" :key="idx" v-ripple clickable>
          <div class="col row q-gutter-sm">
            <div class="col row">
              <q-toggle
                v-model="enable_createPoints[idx]"
                checked-icon="check"
                color="secondary"
                unchecked-icon="clear"
              />
              <div>
                <q-item-section
                  >Points {{ getPointsCategoryEnumString(point.category) }}
                </q-item-section>
                <q-item-label caption>Create point</q-item-label>
              </div>
            </div>
          </div>
        </q-item>
      </q-list>
    </q-card-section>

    <q-card-section>
      <q-btn class="full-width" color="primary" label="Send" @click="sendTx"></q-btn>
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
