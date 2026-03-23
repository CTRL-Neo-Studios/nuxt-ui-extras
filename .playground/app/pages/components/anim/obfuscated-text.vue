<script setup lang="ts">
import { wait } from "lib0/promise";

const message = ref("actual content");
const ready = ref(false);

loadMessage();

async function loadMessage() {
	await wait(5000);
	message.value = "actual content";
	// Text updates but stays obfuscated (autoRevealOnChange=false).
	// Flip `ready` to trigger the reveal:
	ready.value = true;
}

const obfRef = useTemplateRef("obfRef");

function onDataLoaded(text: string) {
	// Programmatically trigger reveal
	obfRef.value?.triggerReveal();
}

function scrambleAgain() {
	obfRef.value?.reset();
}
</script>

<template>
	<DashboardContentPanel title="AnimObfuscatedText">
		<UContainer>
			<DashboardContentPage
				title="AnimObfuscatedText"
				description="The AnimObfuscatedText Text Animation component."
				sourceUrl="/components/Ue/Anim/ObfuscatedText.vue"
			>
				<div class="flex flex-col gap-10">
					<UeAnimObfuscatedText text="Hello, World!" :duration="800" />

					<!-- With delay + glitch effect -->
					<UeAnimObfuscatedText
						text="Welcome to the dashboard"
						:delay="500"
						:duration="1200"
						glitch
					/>

					<!--
						While message is '' → shows nothing.
						Once message loads, text updates + stays scrambled.
						When ready=true → triggers the unobfuscation sequence.
					  -->
					<UeAnimObfuscatedText
						:text="message"
						:reveal="ready"
						:auto-reveal-on-change="false"
						:duration="5000"
						glitch
						:glitch-interval="5000"
						@revealed="console.log('text revealed!')"
					/>
					<div>{{ ready }}</div>

					<UeAnimObfuscatedText
						ref="obfRef"
						text="System online."
						:reveal="false"
						:duration="600"
						glitch
					/>
					<UButton @click="scrambleAgain">Re-scramble</UButton>

					<!-- Binary hacker aesthetic -->
					<UeAnimObfuscatedText
						text="ACCESS GRANTED"
						err-string="01"
						:scramble-interval="30"
						:duration="2000"
						glitch
						:glitch-interval="500"
						:glitch-max-chars="3"
						class="font-mono text-green-400"
					/>

					<!-- Gentle, minimal scramble -->
					<UeAnimObfuscatedText
						text="Loading your profile..."
						err-string="·•○●"
						:scramble-interval="80"
						:duration="1500"
						:delay="300"
					/>
				</div>
			</DashboardContentPage>
		</UContainer>
	</DashboardContentPanel>
</template>

<style scoped></style>
