<template>
  <router-view></router-view>
  <!-- <router-view v-slot="{ Component, route }">
		<transition>
			<keep-alive v-if="route.meta.keepAlive">
				<component :is="Component" />
			</keep-alive>
			<component :is="Component" v-else />
		</transition>
	</router-view> -->
</template>
