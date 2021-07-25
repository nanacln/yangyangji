<template>
  <div class="chat-box">
    <van-nav-bar
      title="标题"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="chat-content"></div>
    <div class="chat-input">
      <van-field v-model="msg" center clearable placeholder="请输入">
        <template #button>
          <van-button size="small" type="primary">发送</van-button>
        </template>
      </van-field>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();
    console.log(route.query);
    const state = reactive({
      msg: "",
    });
    const onClickLeft = () => {
      router.push("/relativer");
    };
    return {
      onClickLeft,
      ...toRefs(state),
    };
  },
});
</script>
<style lang="scss" scoped>
.chat{
  &-box{
    display:flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  &-content{
    flex:1;
    overflow-y: auto;
    background-color:#f5f5f5;
  }
  &-input{
    width:100%;
    height: 100px;
  }
}
</style>