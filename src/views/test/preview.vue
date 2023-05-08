<template>
	<div class="preview_content">
		<n-card :segmented="true" :header-style="{ padding: '10px' }">
			<template #header>
      			<h1>视频播放器（集成西瓜视频插件SDK）</h1>
			</template>
    		<div class="flex justify-center">
      			<div ref="playerRef" id="player"></div>
    		</div>
		</n-card>
		<n-card :segmented="true" :header-style="{ padding: '10px' }">
			<template #header>
      			<h1>文本预览</h1>
			</template>
    		<div class="flex justify-center">
      			
    		</div>
		</n-card>
		<n-card :segmented="true" :header-style="{ padding: '10px' }">
			<template #header>
      			<h1>图片预览</h1>
			</template>
    		<div class="flex justify-center">
				<n-image width="100" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
    		</div>
		</n-card>
	</div>
</template>

<script lang="ts">
	import { defineComponent, onMounted, ref } from 'vue'
	import Player from 'xgplayer'
	const playUrl = 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4'
	const poster = 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg'
	export default defineComponent({
		name: 'preview',
		setup() {
			const playerRef = ref<HTMLDivElement>();
			onMounted(() => {
        		new Player({
					el: playerRef.value,
          			url: playUrl,
          			poster,
					playbackRate: [0.5, 0.75, 1, 1.5, 2],
          			defaultPlaybackRate: 1,
        		})
      		})
			return {
				playerRef,
			}
		}
	})
</script>

<style scoped lang="scss">
	.preview_content{
		padding: 30px;
		box-sizing: border-box;
	}
</style>