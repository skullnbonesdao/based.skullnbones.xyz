<script lang="ts" setup>
import { useSquadsStore } from 'components/squads/SquadsStore'
import { publicKeyToAsyncSigner, walletStoreToAsyncSigner } from 'components/staratlas/helper'
import { getSigner } from 'components/squads/SignerFinder'
import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import { useRPCStore } from 'stores/rpcStore'
import { SageGameHandler } from 'components/staratlas/sage/SageGameHandler'
import { StarbasePlayerHandler } from 'components/staratlas/sage/SageStarBasePlayerHandler'
import { usePlayerProfileStore } from 'stores/player-profile-store'
import { BN } from '@staratlas/anchor'
import { buildAndSignTransaction } from '@staratlas/data-source'

async function sendTx() {
  const signer = useSquadsStore().useSquads
    ? publicKeyToAsyncSigner(getSigner())
    : walletStoreToAsyncSigner(useWallet())
  const staratlasIxs = []

  const sageGame = new SageGameHandler(useAnchorWallet().value!, useRPCStore().connection)
  await sageGame.ready
  await sageGame.loadGame()

  const starbasePlayer = new StarbasePlayerHandler(sageGame)

  console.log(sageGame)
  console.log(starbasePlayer)

  const ix = await starbasePlayer.ixDepositToStarBase(usePlayerProfileStore().playerProfile?.key, [
    new BN(0),
    new BN(-39),
  ])

  await buildAndSignTransaction(ix, signer, {
    connection: useRPCStore().connection,
  })

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
