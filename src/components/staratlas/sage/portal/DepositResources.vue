<script lang="ts" setup>
import { getAsyncSigner } from 'src/handler/convert/ToSigner'

async function sendTx() {
  const signer = getAsyncSigner()
  const staratlasIxs = []

  /*const sageGame = new SageGameHandler(useAnchorWallet().value!, useRPCStore().connection)
  await sageGame.ready
  await sageGame.loadGame()

  const starbasePlayer = new StarbasePlayerHandler(sageGame)

  console.log(sageGame)
  console.log(starbasePlayer)

  const ix = await starbasePlayer.ixDepositToStarBase(useProfileStore().playerProfileAddress, [
    new BN(0),
    new BN(-39),
  ])

  await buildAndSignTransaction(ix, signer, {
    connection: useRPCStore().connection,
  })*/

  /*  const sageGame = new SageGame(signer, useRPCStore().connection)
    await sageGame.initalize()

    const inst = sageGame.addCargoToGameInstructions(
      useStarbaseStore().starbase!.key,
      useStarbaseStore().starbasePlayer!.key,
      new PublicKey('ammoK8AkX2wnebQb35cDAZtTkvsXQbi82cGeTnUvvfK'),
      1,
    )

    console.log(inst)*/
}
</script>

<template>
  <q-btn label="Deposit" @click="sendTx"></q-btn>
</template>

<style scoped></style>
