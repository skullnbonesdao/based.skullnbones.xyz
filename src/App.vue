<template>
  <router-view />
</template>

<script setup lang="ts">

import {useQuasar} from "quasar";

useQuasar().dark.set(true);
</script>
