import {  nextTick, watch } from 'vue'
import {stateModel} from '@/tool/type' 
import {  reactive } from 'vue'
	import { useRouter, useRoute } from 'vue-router'
  import {
		getLocalStorage,
	} from '@/tool/tool'
function chatBook(){
  const router = useRouter()
  const route = useRoute()
  const state = reactive<stateModel>({
    msg: '',
    name: route.query.name as string,
    userId: getLocalStorage('userId') as string,
    chatArr: [],
    unreadObj: {},
  })
  const onClickLeft = () => {
    router.push('/relativer')
  }
  watch(
    () => state.chatArr,
    async val => {
      await nextTick()
      ;(document.querySelector('.chat-end') as HTMLElement).scrollIntoView()
    },
    {
      deep: true,
    }
  )
  return {
    onClickLeft,
    state
  }
}
export default chatBook