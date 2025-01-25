<script lang="ts" setup>
import type { PropType } from 'vue'
import { ref } from 'vue'
import { Attribute, cNFT } from 'stores/interfaces/cNFT'
import { usePlayerStore } from 'stores/playerStore'
import CrewDepositWithdrawAction from 'components/portal/actions/CrewDepositWithdrawAction.vue'

const props = defineProps({
  rows: {
    type: {} as PropType<cNFT[]>,
    required: true,
  },
  action: {
    type: String,
  },
  selection: {
    type: {} as PropType<'single' | 'multiple' | 'none' | undefined>,
    default: undefined,
  },
})
const filter = ref()

const columns = [
  /* {
     name: 'symbol',
     required: true,
     label: 'Symbol',
     align: 'left',
     field: (row: cNFT) => row.content.metadata.symbol,
     sortable: true,
   },*/
  {
    name: 'id_name',
    required: true,
    label: 'ID-Name',
    align: 'left',
    field: (row: cNFT) => row.content.metadata.name,
    sortable: true,
  },
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: (row: cNFT) =>
      row.content.metadata.attributes.find((a) => a.trait_type == 'name')?.value,
    sortable: true,
  },
  {
    name: 'species',
    required: true,
    label: 'Species',
    align: 'left',
    field: (row: cNFT) =>
      row.content.metadata.attributes.find((a) => a.trait_type == 'species')?.value,
    sortable: true,
  },
  {
    name: 'sex',
    required: true,
    label: 'Sex',
    align: 'left',
    field: (row: cNFT) => row.content.metadata.attributes.find((a) => a.trait_type == 'sex')?.value,
    sortable: true,
  },
  {
    name: 'age',
    required: true,
    label: 'Sex',
    align: 'left',
    field: (row: cNFT) => row.content.metadata.attributes.find((a) => a.trait_type == 'age')?.value,
    sortable: true,
  },
  {
    name: 'rarity',
    required: true,
    label: 'Rarity',
    align: 'left',
    field: (row: cNFT) =>
      row.content.metadata.attributes.find((a) => a.trait_type == 'rarity')?.value,
    sortable: true,
  },
  {
    name: 'action',
    required: true,
    label: 'Action',
    align: 'right',
    field: (row: cNFT) =>
      row.content.metadata.attributes.find((a) => a.trait_type == 'rarity')?.value,
    sortable: true,
  },
]
</script>

<template>
  <q-table
    v-model:selected="usePlayerStore().starbaseCrewAccountsSelected"
    :columns="columns"
    :filter="filter"
    :pagination="{
      rowsPerPage: 0,
      sortBy: 'name',
      descending: true,
    }"
    :rows="rows"
    :selection="selection"
    flat
    hide-bottom
    square
  >
    <template v-slot:top-left>
      <div class="text-grey-5">Found {{ rows.length }} Items</div>
    </template>
    <template v-slot:top-right>
      <q-input v-model="filter" borderless debounce="300" dense placeholder="Search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <template v-if="props" v-slot:body-cell="props">
      <q-td :props="props">
        <div v-if="props.col.name == 'symbol'">
          {{ props.row.content.metadata.symbol }}
        </div>
        <div v-else-if="props.col.name == 'id_name'">
          {{ props.row.content.metadata.name }}
        </div>
        <div v-else-if="props.col.name == 'name'">
          {{
            props.row.content.metadata.attributes.find((a: Attribute) => a.trait_type == 'name')
              ?.value
          }}
        </div>
        <div v-else-if="props.col.name == 'species'">
          {{
            props.row.content.metadata.attributes.find((a: Attribute) => a.trait_type == 'species')
              ?.value
          }}
        </div>

        <div v-else-if="props.col.name == 'sex'">
          {{
            props.row.content.metadata.attributes.find((a: Attribute) => a.trait_type == 'sex')
              ?.value
          }}
        </div>
        <div v-else-if="props.col.name == 'age'">
          {{
            props.row.content.metadata.attributes.find((a: Attribute) => a.trait_type == 'age')
              ?.value
          }}
        </div>
        <div v-else-if="props.col.name == 'rarity'">
          {{
            props.row.content.metadata.attributes.find((a: Attribute) => a.trait_type == 'rarity')
              ?.value
          }}
        </div>

        <CrewDepositWithdrawAction
          v-if="props.col.name == 'action'"
          :direction="action == 'deposit' ? 'deposit' : 'withdraw'"
        />
      </q-td>
    </template>
  </q-table>
</template>

<style scoped></style>
